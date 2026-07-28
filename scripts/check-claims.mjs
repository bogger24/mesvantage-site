#!/usr/bin/env node
/**
 * The evidence ratchet.
 *
 * Scans the built HTML for two classes of problem and fails the build on either:
 *
 *   1. A statistic rendered outside an <Evidence> wrapper (no `data-evidence` ancestor).
 *      A number with a %, ×, k, M, €, $ or "hrs" next to it is a claim. Claims live in
 *      src/data/claims.ts, with a source and a verified date, or they do not ship.
 *
 *   2. Banned vocabulary. Our own external-communications policy prohibits a specific set of
 *      phrases — "predictive maintenance", "autonomous quality", "self-validating",
 *      "fully compliant", "FDA-validated" — because each one is either a category error or a
 *      claim we cannot defend to a regulator. A policy nobody enforces is a preference.
 *
 * Usage: node scripts/check-claims.mjs dist
 *
 * This is deliberately noisy and deliberately annoying to work around. The site shipped
 * "€0 Validation Budget" for eleven weeks because nothing was watching.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.argv[2] ?? 'dist';

/* ------------------------------------------------------------------ config */

const BANNED = [
  { pattern: /FDA[-\s]validated/i, why: 'FDA does not validate software; implies agency endorsement' },
  { pattern: /predictive maintenance/i, why: 'banned by policy — say condition monitoring' },
  { pattern: /autonomous quality/i, why: 'banned by policy' },
  { pattern: /self[-\s]validating/i, why: 'banned by policy' },
  { pattern: /fully compliant/i, why: 'compliance is a property we demonstrate, not a feature we sell' },
  { pattern: /AI runs the factory/i, why: 'banned by policy' },
  { pattern: /€\s*0\s*(<[^>]*>\s*)*validation/i, why: 'the validation-budget claim is retired — see claims.ts' },
  { pattern: /skip the \d+[-\s]month validation/i, why: 'no supplier can discharge the customer’s validation obligation' },
  { pattern: /annex\s*11/i, why: 'EU GMP for medicinal products, not devices — use 21 CFR Part 11' },
];

/**
 * Text that looks like a claim.
 *
 * A red-team pass defeated the first version 27 ways out of 35. It required a *symbol* unit
 * adjacent to a digit, so every number bound to a word ("40 percent", "12,000 parts"), every
 * bare number ("90d", "226 of 226"), and every spelled-out magnitude ("two thirds", "half of
 * all") walked straight through — including several already on the site. It also carried no
 * `i` flag, so `2X` passed while `3x` failed.
 *
 * These patterns are deliberately over-eager. A false positive costs one line in the allowlist
 * or one <Evidence> wrapper. A false negative is how "€0 Validation Budget" shipped.
 */
const STAT_PATTERNS = [
  // currency amounts
  /[€$£]\s?\d/,
  // digit bound to a symbol or short unit — [\s-]? because "sub-90-day" and "70-percent"
  // walked straight past a version that only allowed an optional space
  /\d[\s-]?(?:%|×|x\b|k\b|m\b|bn\b|d\b)/i,
  // digit bound to a word unit
  /\d[\d,.]*[\s-]?(?:percent|per ?cent|pc\b|hrs?\b|hours?\b|mins?\b|minutes?\b|days?\b|weeks?\b|months?\b|years?\b|fte\b|parts?\b|units?\b|sites?\b|customers?\b|modules?\b|domains?\b|tests?\b|requirements?\b|operators?\b|machines?\b)/i,
  // any number of 1,000 or more, however separated (comma, space, or full stop)
  /\b\d{1,3}(?:[,. \u202f\u00a0]\d{3})+\b|\b\d{4,}\b/,
  // non-ASCII digits: \d is ASCII-only, so Arabic-Indic and full-width forms were invisible
  /[\u0660-\u0669\u06f0-\u06f9\uff10-\uff19]{2,}/u,
  // "N of N" / "N/N" score forms
  /\b\d+\s*(?:of|\/)\s*\d+\b/,
  // spelled-out magnitudes and comparatives
  // "third party" and "quarter" as a calendar/period noun are not magnitudes.
  /\b(?:half|two[- ]thirds|three[- ]quarters|a tenth)\b/i,
  /\bthirds?\b(?![\s-]*part)/i,
  /\b(?:one|two|three|four|five|six|seven|eight|nine|ten)\s+(?:out of|in)\s+(?:two|three|four|five|ten|a hundred)\b/i,
  /\b(?:ten|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred)(?:[- ](?:one|two|three|four|five|six|seven|eight|nine))?[\s-](?:per ?cent|percent)\b/i,
  // spelled-out counts attached to a countable noun — "eighteen platforms", "three hundred sources"
  /\b(?:two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|eighteen|twenty|thirty|fifty|hundred|thousand)\s+(?:hundred\s+)?(?:platforms?|vendors?|sources?|customers?|sites?|modules?|weeks?|months?|years?|days?)\b/i,
  /\b(?:double|triple|halve[sd]?|twice)\b/i,
  /\b(?:\d+|one|two|three|four|five|ten)\s+times\b/i,
  /\bup to\s+\w+\s*(?:%|percent|per cent)/i,
];

function findStat(text) {
  for (const re of STAT_PATTERNS) {
    const hit = re.exec(text);
    if (hit) return hit[0].trim();
  }
  return null;
}

/**
 * Digits that are part of a name, not a measurement.
 *
 * These are MASKED OUT of a chunk before statistic detection runs, rather than allow-listed
 * against the whole chunk. The first version tested the surrounding chunk, so any sentence
 * containing "Part 11" or "ISO 13485" became wholly exempt — on a medical-device MES site, that
 * is most sentences. Red team confirmed "Part 11 audit trails cut our audit prep by 70% last
 * year" passed clean.
 *
 * Masking keeps the statistic detector over-eager while stopping it tripping on a standard
 * number, a copyright year, or a page number.
 */
const NON_CLAIM_TOKENS = [
  /\b21\s*CFR\s*Part\s*11\b/gi,
  /\bPart\s*11\b/gi,
  /\bISO\s*\d{4,5}(?::\d{4})?\b/gi,
  /\bSOC\s*2\b/gi,
  /\bGAMP\s*5\b/gi,
  /\bAnnex\s*\d+\b/gi,
  /§\s*\d+(?:\.\d+)*/g,
  /\b\d+\.\d+\.\d+\b/g,            // clause numbers like 4.1.6
  /\bPage\s*\d+\s*of\s*\d+\b/gi,
  /©\s*\d{4}/g,
  /\b(?:19|20)\d{2}\b/g,             // years
  /\b24\/7\b/g,
  /\bwoff2?\b/gi,
  // Git SHAs. A capture caption cites the build it came from, and a SHA like "2c09d37d"
  // contains "7d", which the unit patterns read as "7 days". It fires on roughly half of all
  // SHAs, so it looked like an intermittent failure until the caption text was read.
  /\b(?:build|commit|sha)\s+[0-9a-f]{7,40}\b/gi,
  /\b[0-9a-f]{7,40}\b(?=\s*(?:\.|,|<|$))/g,
];

function maskNonClaims(text) {
  let out = text;
  for (const re of NON_CLAIM_TOKENS) out = out.replace(re, ' \u2014 ');
  return out;
}

/** Chunks that are structurally exempt: the reader's own problem, stated back to them. */
const CHUNK_ALLOWLIST = [
  /\b3-week fire drill\b/i,
  // Biography inside attributed speech: "we spent two years looking for an MES" asserts nothing
  // measurable about the product.
  /\bwe spent two years looking\b/i,
  // A meeting length is an offer, not a performance claim.
  /\b30-minute session\b/i,
  // Rhetoric inside attributed speech, not a measurement. "Priced for a company ten times our
  // size" asserts nothing checkable and is quoted, not stated.
  /\bten times our size\b/i,
];

/* ------------------------------------------------------------------- walk */

function htmlFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...htmlFiles(full));
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

/** Strip script, style, svg and HTML comments — none of them render as copy. */
function visibleHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    // SVG graphics are dropped, but <text> and <title> inside them are rendered to the screen
    // and were previously exempt from both checks. This site renders a lot of inline SVG.
    .replace(/<svg[\s\S]*?<\/svg>/gi, (svg) =>
      (svg.match(/<(?:text|title|tspan)\b[^>]*>([\s\S]*?)<\/(?:text|title|tspan)>/gi) || []).join(' '))
    .replace(/<!--[\s\S]*?-->/g, ' ')
    // Decode the entities that let "fully&nbsp;compliant" slip past the banned-word scan.
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)));
}

/**
 * Remove every element carrying `attr`, along with its subtree, by walking tags.
 * Whatever statistics remain are unattributed.
 */
const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

function stripMarkedBlocks(html, attr) {
  let out = '';
  let i = 0;

  // Match the attribute only where an attribute can legally appear: preceded by whitespace,
  // followed by '=', '>', '/' or more whitespace. Previously a bare indexOf matched
  // class="data-evidence" and even prose containing the word, both of which laundered claims.
  const attrRe = new RegExp(`\\s${attr}(?=[\\s=>/])`, 'g');

  for (;;) {
    attrRe.lastIndex = i;
    const found = attrRe.exec(html);
    const at = found ? found.index + 1 : -1;
    if (at === -1) {
      out += html.slice(i);
      break;
    }

    const tagStart = html.lastIndexOf('<', at);
    if (tagStart === -1) { i = at + attr.length; continue; }
    out += html.slice(i, tagStart);

    const nameMatch = /^<([a-zA-Z][\w-]*)/.exec(html.slice(tagStart, at + attr.length));
    if (!nameMatch) { i = at + attr.length; continue; }
    const tag = nameMatch[1].toLowerCase();

    const openTagEnd = html.indexOf('>', at);
    if (openTagEnd === -1) { i = html.length; break; }

    // Void and self-closing elements have no matching close tag. Without this, the walker
    // searched for </img>, never found it, and discarded the entire remainder of the document —
    // one <img data-evidence> disabled the statistic check for every element after it.
    const isSelfClosing = html[openTagEnd - 1] === '/';
    if (VOID_ELEMENTS.has(tag) || isSelfClosing) {
      i = openTagEnd + 1;
      continue;
    }

    let cursor = openTagEnd + 1;
    let depth = 1;
    const boundary = new RegExp(`<(/?)${tag}\\b`, 'gi');
    boundary.lastIndex = cursor;

    let match;
    while ((match = boundary.exec(html)) !== null) {
      if (match[1] === '/') {
        depth -= 1;
        if (depth === 0) {
          const closeEnd = html.indexOf('>', boundary.lastIndex);
          cursor = closeEnd === -1 ? html.length : closeEnd + 1;
          break;
        }
      } else {
        depth += 1;
      }
    }
    if (depth !== 0) cursor = html.length;

    i = cursor;
  }

  return out;
}

/** The inverse of stripMarkedBlocks: return only the marked subtrees. */
function extractMarkedBlocks(html, attr) {
  const stripped = stripMarkedBlocks(html, attr);
  // Cheap and sufficient: anything the stripper removed is what we want to inspect.
  let out = html;
  for (const kept of stripped.split(/(?=<)/)) {
    if (kept.length > 40) out = out.replace(kept, ' ');
  }
  return out;
}

/**
 * Reader-facing text held in attributes: meta descriptions, social card copy, alt text,
 * aria-labels, link titles. None of this was scanned, because textChunks strips whole tags.
 */
const TEXT_ATTRS = /(?:content|alt|aria-label|title|placeholder)\s*=\s*"([^"]{12,})"/gi;

function attributeChunks(html) {
  const out = [];
  for (const [, value] of html.matchAll(TEXT_ATTRS)) {
    out.push(value.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim());
  }
  return out;
}

/**
 * Inline formatting elements that do not break a sentence. They are removed without inserting a
 * boundary, so `<span>7</span><span>0</span>%` reads as `70%` rather than three separate chunks
 * of "7", "0" and "%". Splitting on every tag made that a working evasion.
 */
const INLINE_TAGS = /<\/?(?:span|b|i|em|strong|a|small|sup|sub|code|mark|u|s|abbr|time|wbr|bdi|bdo|var|kbd|samp|q|cite|dfn|ruby|rt|rp|del|ins|font)\b[^>]*>/gi;

/** Reduce markup to sentence-ish chunks of visible text. */
function textChunks(html) {
  return html
    .replace(INLINE_TAGS, '')
    .replace(/<[^>]+>/g, '\n')
    .split('\n')
    .map((s) => s.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

/* ------------------------------------------------------------------ check */

/**
 * A page may exempt illustration mockups from the statistic check — but only if it actually
 * discloses that they are illustrations. Otherwise `data-illustration` becomes a way to launder
 * an unsourced number, which is precisely the failure mode this script exists to prevent.
 */
const DISCLOSURE = /illustration[s]?[\s\S]{0,120}?synthetic data/i;

/**
 * A real screenshot carries a different obligation from an illustration. It is genuinely the
 * product, so it must not be labelled an illustration — but it is the product running against a
 * seeded dataset, and that has to be said plainly next to the image. A screenshot travels: into
 * a slide, a forwarded email, a customer's validation file. Whatever is not attached to it is
 * lost, so a page-level footnote is not enough and the caption must carry it.
 */
const SCREENSHOT_DISCLOSURE = /fictional manufacturer[\s\S]{0,160}?(seeded|demonstration) data/i;

let files;
try {
  files = htmlFiles(root);
} catch (err) {
  console.error(`\n✗ claims check: cannot read "${root}" — run \`astro build\` first.\n`);
  process.exit(2);
}
const failures = [];

for (const file of files) {
  const raw = readFileSync(file, 'utf8');
  const visible = visibleHtml(raw);
  const rel = relative(process.cwd(), file);

  const hasIllustrations = /data-illustration\b/.test(visible);
  if (hasIllustrations && !DISCLOSURE.test(visible.replace(/<[^>]+>/g, ' '))) {
    failures.push({
      file: rel,
      kind: 'undisclosed-illustration',
      detail:
        'page marks elements data-illustration but never tells the reader they are illustrations rendered with synthetic data',
    });
  }

  const hasScreenshots = /data-screenshot\b/.test(visible);
  if (hasScreenshots && !SCREENSHOT_DISCLOSURE.test(visible.replace(/<[^>]+>/g, ' '))) {
    failures.push({
      file: rel,
      kind: 'undisclosed-screenshot',
      detail:
        'page renders a product screenshot without stating, next to it, that the manufacturer is ' +
        'fictional and the records are seeded demonstration data',
    });
  }

  // 1. Banned vocabulary.
  //    Skipped only inside data-retired blocks: the evidence page shows retired claims struck
  //    through, alongside the reasoning for removing them. Quoting a claim in order to disown it
  //    is documentation, not a claim. Nothing else is exempt — an <Evidence> wrapper does not
  //    license banned wording.
  // data-retired exempts banned vocabulary, but only on the evidence page. Anywhere else the
  // attribute is meaningless and the exemption does not apply — otherwise any page could carry
  // any banned phrase by tagging the element.
  const isEvidencePage = /(^|[\\/])evidence[\\/]index\.html$/.test(rel);
  const bannedScope = isEvidencePage ? stripMarkedBlocks(visible, 'data-retired') : visible;
  for (const { pattern, why } of BANNED) {
    const hit = pattern.exec(bannedScope.replace(/<[^>]+>/g, ' '));
    if (hit) {
      failures.push({ file: rel, kind: 'banned-vocabulary', detail: `"${hit[0].trim()}" — ${why}` });
    }
  }

  // 2. Illustration laundering.
  //    A mockup is UI chrome: short labels, column headings, status pills. It is not prose.
  //    If a data-illustration block contains a sentence carrying a statistic, someone has put
  //    marketing copy inside an exempt wrapper — the one attack the illustration exemption makes
  //    possible. Red team confirmed it: a 70% / EUR 250,000 claim wrapped in data-illustration
  //    passed clean.
  //
  //    The threshold is 8 words, calibrated against the real mockups. It is deliberately tight
  //    enough that the two longest real offenders — an invented energy saving that read like a
  //    utility bill, and a claim of a live third-party data feed — had to be rewritten rather
  //    than exempted.
  const illustrationOnly = visible.length - stripMarkedBlocks(visible, 'data-illustration').length > 0
    ? extractMarkedBlocks(visible, 'data-illustration')
    : '';
  for (const chunk of textChunks(illustrationOnly)) {
    const words = chunk.split(/\s+/).length;
    if (words > 8 && findStat(maskNonClaims(chunk))) {
      failures.push({
        file: rel,
        kind: 'claim-inside-illustration',
        detail: `prose carrying a statistic inside a data-illustration block: "${chunk.slice(0, 110)}${chunk.length > 110 ? '…' : ''}"`,
      });
    }
  }

  // 3. Unattributed statistics — checked only outside data-evidence subtrees.
  //    Attribute text is checked from the raw HTML: a claim in a meta description cannot be
  //    wrapped in an <Evidence> element, so it must simply not assert a statistic.
  const unattributed = stripMarkedBlocks(stripMarkedBlocks(visible, 'data-evidence'), 'data-illustration');
  for (const chunk of [...textChunks(unattributed), ...attributeChunks(raw)]) {
    if (CHUNK_ALLOWLIST.some((re) => re.test(chunk))) continue;
    const hit = findStat(maskNonClaims(chunk));
    if (hit) {
      failures.push({
        file: rel,
        kind: 'unattributed-statistic',
        detail: `"${hit}" in: ${chunk.slice(0, 110)}${chunk.length > 110 ? '…' : ''}`,
      });
    }
  }
}

/* ----------------------------------------------------------------- report */

if (failures.length === 0) {
  console.log(`✓ claims check passed — ${files.length} pages, no unattributed statistics, no banned vocabulary`);
  process.exit(0);
}

const byKind = failures.reduce((acc, f) => ((acc[f.kind] ??= []).push(f), acc), {});
console.error(`\n✗ claims check failed — ${failures.length} issue(s)\n`);
for (const [kind, items] of Object.entries(byKind)) {
  console.error(`  ${kind} (${items.length})`);
  for (const item of items) console.error(`    ${item.file}\n      ${item.detail}`);
  console.error('');
}
console.error('  Fix: move the number into src/data/claims.ts and render it with <Evidence claim="..." />,');
console.error('  or rewrite the copy so it does not assert a statistic.\n');
process.exit(1);
