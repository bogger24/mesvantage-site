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

/** Text that looks like a claim: a number bound to a unit or a currency. */
const STAT = /(?:^|[\s>(])(?:[€$£]\s?\d[\d,.]*|\d[\d,.]*\s?(?:%|×|x\b|k\b|M\b|bn\b|hrs?\b|hours?\b|days?\b|weeks?\b|months?\b))/;

/** Phrases that are prose, not statistics, and would otherwise trip the STAT regex. */
const STAT_ALLOWLIST = [
  /\b3-week fire drill\b/i,     // naming the reader's problem, not claiming a result
  /\b21 CFR Part 11\b/i,
  /\bISO 13485\b/i,
  /\bPart 11\b/i,
  /\b24\/7\b/i,
  /\b30-minute\b/i,
  /\bone business day\b/i,
  /\bΔ\b/,
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
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
}

/**
 * Remove every element carrying `attr`, along with its subtree, by walking tags.
 * Whatever statistics remain are unattributed.
 */
function stripMarkedBlocks(html, attr) {
  let out = '';
  let i = 0;

  for (;;) {
    const at = html.indexOf(attr, i);
    if (at === -1) {
      out += html.slice(i);
      break;
    }

    const tagStart = html.lastIndexOf('<', at);
    if (tagStart === -1) { i = at + attr.length; continue; }
    out += html.slice(i, tagStart);

    const nameMatch = /^<([a-zA-Z][\w-]*)/.exec(html.slice(tagStart, at + attr.length));
    if (!nameMatch) { i = at + attr.length; continue; }
    const tag = nameMatch[1];

    // Move past the opening tag, then consume until this element's matching close.
    const openTagEnd = html.indexOf('>', at);
    if (openTagEnd === -1) { i = html.length; break; }

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

/** Reduce markup to sentence-ish chunks of visible text. */
function textChunks(html) {
  return html
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

const files = htmlFiles(root);
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

  // 1. Banned vocabulary.
  //    Skipped only inside data-retired blocks: the evidence page shows retired claims struck
  //    through, alongside the reasoning for removing them. Quoting a claim in order to disown it
  //    is documentation, not a claim. Nothing else is exempt — an <Evidence> wrapper does not
  //    license banned wording.
  const bannedScope = stripMarkedBlocks(visible, 'data-retired');
  for (const { pattern, why } of BANNED) {
    const hit = pattern.exec(bannedScope.replace(/<[^>]+>/g, ' '));
    if (hit) {
      failures.push({ file: rel, kind: 'banned-vocabulary', detail: `"${hit[0].trim()}" — ${why}` });
    }
  }

  // 2. Unattributed statistics — checked only outside data-evidence subtrees.
  const unattributed = stripMarkedBlocks(stripMarkedBlocks(visible, 'data-evidence'), 'data-illustration');
  for (const chunk of textChunks(unattributed)) {
    if (STAT_ALLOWLIST.some((re) => re.test(chunk))) continue;
    const hit = STAT.exec(chunk);
    if (hit) {
      failures.push({
        file: rel,
        kind: 'unattributed-statistic',
        detail: `"${hit[0].trim()}" in: ${chunk.slice(0, 110)}${chunk.length > 110 ? '…' : ''}`,
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
