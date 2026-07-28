#!/usr/bin/env node
/**
 * Structural invariants over the built HTML.
 *
 * This is the cheap half of an accessibility and SEO audit — the half that needs no browser,
 * runs in the build, and catches the defects that actually recur: a heading level skipped, an
 * image without alt text, a link to a page that was renamed, two pages sharing a title.
 *
 * It does not replace axe. Contrast, focus order, target size and reading order need a real
 * browser and a real person. What this does is make sure the same regression cannot land
 * twice, which is the job the claims ratchet does for numbers.
 *
 * Every rule here is a defect this site actually had, or one it would have shipped next.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const distDir = resolve(process.argv[2] ?? 'dist');

/* ---------- collect pages ---------- */

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : full.endsWith('.html') ? [full] : [];
  });
}

const files = walk(distDir).sort();

/** dist/limits/index.html -> /limits ; dist/index.html -> / ; dist/404.html -> /404 */
const routeOf = (file) =>
  '/' +
  relative(distDir, file)
    .replace(/index\.html$/, '')
    .replace(/\.html$/, '')
    .replace(/\/$/, '');

const routes = new Set(files.map(routeOf));

/* ---------- tiny HTML helpers (no parser dependency) ---------- */

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}=("([^"]*)"|'([^']*)')`, 'i'));
  return m ? (m[2] ?? m[3]) : null;
};
const meta = (html, key, kind = 'name') => {
  const m = html.match(new RegExp(`<meta[^>]*\\s${kind}=["']${key}["'][^>]*>`, 'i'));
  return m ? attr(m[0], 'content') : null;
};
const stripHidden = (html) =>
  html
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

/* ---------- rules ---------- */

const issues = [];
const fail = (file, rule, detail) => issues.push({ file: relative(distDir, file), rule, detail });

const titles = new Map();
const descriptions = new Map();

for (const file of files) {
  const raw = readFileSync(file, 'utf8');
  const html = stripHidden(raw);
  const route = routeOf(file);
  const noindex = /<meta[^>]*name=["']robots["'][^>]*noindex/i.test(raw);

  /* /brochure is the print source the PDF is rendered from, not a page anyone browses to. It
     is noindex, it is excluded in robots.txt, and it carries X-Robots-Tag from vercel.json.
     Demanding a canonical, a share image and a search description of it would be theatre. The
     structural rules below — headings, alt text, links, no inline script or style — still
     apply to it, because those are about whether the artefact is sound. */
  const printOnly = route === '/brochure';

  /* --- document --- */
  if (!/<html[^>]*\slang=/i.test(raw)) fail(file, 'lang', '<html> has no lang attribute');

  /* --- headings: exactly one h1, no skipped levels --- */
  const headings = [...html.matchAll(/<h([1-6])\b/gi)].map((m) => Number(m[1]));
  const h1s = headings.filter((h) => h === 1).length;
  if (h1s !== 1) fail(file, 'h1-count', `${h1s} <h1> elements, expected exactly 1`);

  for (let i = 1; i < headings.length; i++) {
    const jump = headings[i] - headings[i - 1];
    if (jump > 1) {
      fail(
        file,
        'heading-skip',
        `h${headings[i - 1]} is followed by h${headings[i]} — screen-reader users navigate by level, and a skipped level reads as a missing section`,
      );
      break; // one report per page is enough to act on
    }
  }

  /* --- images need alt; decorative ones need alt="" explicitly --- */
  for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
    if (attr(tag, 'alt') === null) {
      fail(file, 'img-alt', `<img> without alt: ${(attr(tag, 'src') ?? tag).slice(0, 90)}`);
    }
  }

  /* --- every <nav> needs an accessible name once there is more than one --- */
  const navs = html.match(/<nav\b[^>]*>/gi) ?? [];
  if (navs.length > 1) {
    for (const tag of navs) {
      if (!attr(tag, 'aria-label') && !attr(tag, 'aria-labelledby')) {
        fail(
          file,
          'nav-label',
          'a <nav> has no aria-label, so it is announced only as "navigation" alongside the others',
        );
        break;
      }
    }
  }

  /* --- links must go somewhere, and must say where --- */
  for (const tag of html.match(/<a\b[^>]*>/gi) ?? []) {
    const href = attr(tag, 'href');
    if (href === null) {
      fail(file, 'anchor-no-href', 'an <a> has no href — it is not focusable or activatable');
      continue;
    }
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) continue;
    if (href.startsWith('/.well-known/') || /\.[a-z0-9]{2,5}$/i.test(href)) continue; // real files
    const target = href.replace(/[?#].*$/, '').replace(/\/$/, '') || '/';
    if (!routes.has(target)) {
      fail(file, 'broken-link', `links to ${href}, which is not a built page`);
    }
  }

  /* --- head: the things that decide how a share renders --- */
  if (!printOnly) {
    const canonical = (raw.match(/<link[^>]*rel=["']canonical["'][^>]*>/i) ?? [])[0];
    if (!canonical) fail(file, 'canonical', 'no canonical link');
    else if (!(attr(canonical, 'href') ?? '').startsWith('https://'))
      fail(file, 'canonical', 'canonical is not absolute');

    const ogImage = meta(raw, 'og:image', 'property');
    if (!ogImage) fail(file, 'og-image', 'no og:image — shares render as a bare text card');
    else if (!ogImage.startsWith('https://'))
      fail(file, 'og-image', 'og:image is not absolute; LinkedIn and Outlook will drop it');

    /* --- title and description, uniqueness and length --- */
    const title = (raw.match(/<title>([\s\S]*?)<\/title>/i) ?? [, ''])[1].trim();
    const description = meta(raw, 'description') ?? '';

    if (!title) fail(file, 'title', 'no <title>');
    if (title.length > 65)
      fail(file, 'title-length', `title is ${title.length} chars, keep it ≤65`);
    if (!description) fail(file, 'description', 'no meta description');
    else if (description.length < 70 || description.length > 175)
      fail(
        file,
        'description-length',
        `description is ${description.length} chars, aim for 70–175 so it is not truncated or padded`,
      );

    if (!noindex) {
      if (titles.has(title)) fail(file, 'title-unique', `same <title> as ${titles.get(title)}`);
      else titles.set(title, route);

      if (descriptions.has(description))
        fail(file, 'description-unique', `same description as ${descriptions.get(description)}`);
      else descriptions.set(description, route);
    }
  }

  /* --- the CSP contract: no inline script or style may enter the build ---
     Not a style preference. script-src/style-src are 'self' with no 'unsafe-inline' in
     vercel.json, so anything inline is both a broken page and a silent invitation to
     weaken the policy to fix it. Data blocks (ld+json) are not executed and are fine. */
  for (const tag of raw.match(/<script\b[^>]*>/gi) ?? []) {
    const src = attr(tag, 'src');
    const type = (attr(tag, 'type') ?? '').toLowerCase();
    if (!src && type !== 'application/ld+json') {
      fail(
        file,
        'inline-script',
        'inline <script> — the CSP has no unsafe-inline, so it is blocked',
      );
    }
  }
  if (/\sstyle=["']/.test(raw))
    fail(file, 'inline-style', 'inline style attribute — the CSP has no unsafe-inline for styles');
}

/* ---------- report ---------- */

if (issues.length === 0) {
  console.log(
    `✓ html check passed — ${files.length} pages: headings, alt text, links, head tags, CSP-safe markup`,
  );
  process.exit(0);
}

console.error(`\n✗ html check failed — ${issues.length} issue(s)\n`);
const byRule = issues.reduce((acc, i) => ((acc[i.rule] ??= []).push(i), acc), {});
for (const [rule, list] of Object.entries(byRule)) {
  console.error(`  ${rule} (${list.length})`);
  for (const i of list) console.error(`    ${i.file}\n      ${i.detail}`);
  console.error('');
}
process.exit(1);
