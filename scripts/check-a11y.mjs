#!/usr/bin/env node
/**
 * WCAG 2.2 AA pass over the built site, in a real browser.
 *
 * scripts/check-html.mjs covers the structural half — headings, alt text, landmarks, links —
 * without a browser, so it can run on every build. This covers the half that needs layout and
 * computed style: colour contrast, target size, horizontal overflow, and whether the
 * no-cookies claim on /cookies is actually true.
 *
 * Run with `npm run a11y`. It is deliberately NOT part of `npm run build` — it needs a browser
 * download, and a marketing build should not be gated on that. Run it before shipping a
 * design change, and treat any finding as a defect rather than as advice.
 *
 * Findings this pass caught the first time it ran, all of them real:
 *   - `accent-onDark` (#4DA3FB, the blue meant for navy) used on white in three places, at
 *     2.64:1. The palette had encoded the light/dark split correctly; the call sites had not.
 *   - `text-ink/60` at 4.43:1 — an opacity-derived grey landing just under AA, which is the
 *     exact failure mode the solid `muted` token was introduced to end.
 *   - A <dl> whose divs wrapped dt + dd + p, breaking the term/definition association.
 *   - Nine standalone links between 15 and 20px tall, against the 24px floor in WCAG 2.2.
 */
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const DIST = resolve(process.argv[2] ?? 'dist');
const PORT = Number(process.env.A11Y_PORT ?? 4599);

const ROUTES = [
  '/', '/product', '/architecture', '/pricing', '/compliance', '/evidence', '/limits',
  '/about', '/privacy', '/terms', '/cookies', '/404',
];
const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
];

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.avif': 'image/avif',
  '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json',
  '.pdf': 'application/pdf', '.txt': 'text/plain', '.xml': 'application/xml',
};

const server = createServer((req, res) => {
  let file = join(DIST, decodeURIComponent(req.url.split('?')[0]));
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file) && existsSync(`${file}.html`)) file += '.html';
  if (!existsSync(file)) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    return res.end(readFileSync(join(DIST, '404.html')));
  }
  res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(PORT, r));

const browser = await chromium.launch();
const findings = [];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();

  for (const route of ROUTES) {
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle' });
    await page.addScriptTag({ content: axeSource });

    const result = await page.evaluate(
      async () =>
        await window.axe.run(document, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'],
          },
        }),
    );

    for (const v of result.violations) {
      for (const n of v.nodes) {
        findings.push({
          viewport: vp.name, route, id: v.id, impact: v.impact, help: v.help,
          target: n.target?.join(' ') ?? '',
          sample: n.html?.slice(0, 150) ?? '',
          why: [...(n.any ?? []), ...(n.all ?? [])].map((c) => c.message).join('; ').slice(0, 220),
        });
      }
    }

    // The things axe does not check, each of which is a published promise on this site.
    const extra = await page.evaluate(() => {
      const out = [];

      // /cookies says "this website sets no cookies" and tells the reader to verify it.
      if (document.cookie !== '') out.push(`cookies set: ${document.cookie}`);

      if (document.documentElement.scrollWidth > window.innerWidth + 1) {
        out.push(
          `horizontal overflow: ${document.documentElement.scrollWidth}px in ${window.innerWidth}px`,
        );
      }

      // WCAG 2.2 §2.5.8, with the two exceptions the success criterion actually grants:
      //   - Inline: the target sits in a sentence or block of text.
      //   - A skip link hidden until focus expands to full size when it can be activated,
      //     so its 1x1 resting box is not the target.
      const small = [...document.querySelectorAll('a,button,[role="button"]')].filter((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return false;
        if (r.width >= 24 && r.height >= 24) return false;
        const cs = getComputedStyle(el);
        if (cs.position === 'absolute' && r.width <= 2 && r.height <= 2) return false;

        // Walk up for a prose ancestor: the evidence dagger sits inside a <span> inside a <p>,
        // so checking only the immediate parent misses that it is plainly inline in a sentence.
        for (let a = el.parentElement, d = 0; a && d < 4; a = a.parentElement, d++) {
          if (!['P', 'LI', 'SPAN', 'DD', 'DT'].includes(a.tagName)) continue;
          if (a.textContent.trim().length > el.textContent.trim().length + 12) return false;
        }
        return true;
      });
      for (const el of small) {
        const r = el.getBoundingClientRect();
        out.push(
          `target ${Math.round(r.width)}x${Math.round(r.height)} under 24x24: "${el.textContent.trim().slice(0, 40)}"`,
        );
      }
      return out;
    });

    for (const e of extra) {
      findings.push({
        viewport: vp.name, route, id: 'wcag22-manual', impact: 'serious',
        help: e, target: '', sample: '', why: '',
      });
    }
  }
  await ctx.close();
}

await browser.close();
server.close();

if (findings.length === 0) {
  console.log(
    `✓ axe WCAG 2.2 AA — 0 violations across ${ROUTES.length} routes × ${VIEWPORTS.length} viewports`,
  );
  console.log('  also verified: no cookies set, no horizontal overflow, all targets ≥24×24');
  process.exit(0);
}

const byId = findings.reduce((acc, f) => ((acc[f.id] ??= []).push(f), acc), {});
console.error(`\n✗ ${findings.length} finding(s), ${Object.keys(byId).length} distinct\n`);
for (const [id, list] of Object.entries(byId).sort((a, b) => b[1].length - a[1].length)) {
  console.error(`  ${id} [${list[0].impact}] — ${list[0].help}`);
  const seen = new Set();
  for (const f of list) {
    const key = f.route + f.target + f.help;
    if (seen.has(key)) continue;
    seen.add(key);
    console.error(`    ${f.viewport} ${f.route}  ${f.target}`);
    if (f.sample) console.error(`      ${f.sample}`);
    if (f.why) console.error(`      why: ${f.why}`);
  }
  console.error('');
}
process.exit(1);
