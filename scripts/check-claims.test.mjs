#!/usr/bin/env node
/**
 * Regression suite for the evidence ratchet.
 *
 * Every case here is an evasion that worked at some point. Two adversarial reviews defeated the
 * checker 27 ways and then 22 more; each fix landed without a test, so the second review simply
 * found a new set. This file exists so the third one has to work harder than the second.
 *
 * Run: npm run test:claims
 *
 * When a new evasion is found: add it here FIRST, watch it fail, then fix the checker.
 */

import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const page = (body, head = '') => `<html><head>${head}</head><body>${body}</body></html>`;

/** Each case: [name, html, shouldFail] */
const CASES = [
  // ---- statistics that must be caught -------------------------------------
  ['word-unit percent', page('<p>Customers see up to 40 percent faster audit prep.</p>'), true],
  ['spelled magnitude', page('<p>Half of all CDMOs fail their first audit.</p>'), true],
  ['spelled percent', page('<p>A seventy per cent reduction in audit prep.</p>'), true],
  ['hyphenated percent', page('<p>Delivered with 70-percent less effort.</p>'), true],
  ['hyphenated day', page('<p>Delivered in sub-90-day cycles.</p>'), true],
  ['spelled ratio', page('<p>Four out of five sites report gains.</p>'), true],
  ['spelled hyphen percent', page('<p>Seventy-five per cent fewer findings.</p>'), true],
  ['bare thousands', page('<p>We track 12,000 parts a day.</p>'), true],
  ['space separator', page('<p>We handle 250 000 parts.</p>'), true],
  ['dot separator', page('<p>We handle 250.000 records.</p>'), true],
  ['arabic-indic digits', page('<p>We track ٢٥٠٬٠٠٠ parts.</p>'), true],
  ['fullwidth digits', page('<p>We track ２５０，０００ records.</p>'), true],
  ['uppercase X multiplier', page('<p>It is 2X cheaper.</p>'), true],
  ['digit times', page('<p>It is 3 times faster.</p>'), true],
  ['a tenth', page('<p>Saves a tenth of the effort.</p>'), true],
  ['fte', page('<p>Saves 1.5 FTE per site.</p>'), true],
  ['N of N', page('<p>226 of 226 test cases passed.</p>'), true],
  ['spelled count + noun', page('<p>We reviewed eighteen platforms.</p>'), true],
  ['currency', page('<p>Saves EUR 250,000 a year.</p>'), true],

  // ---- attribute text ------------------------------------------------------
  ['meta description', page('<p>x</p>', '<meta name="description" content="We cut audit prep by 70 percent.">'), true],
  ['og description', page('<p>x</p>', '<meta property="og:description" content="Saving 12,000 parts a year.">'), true],
  ['alt text', page('<img alt="Chart showing 70% faster audit prep">'), true],
  ['aria-label', page('<div aria-label="Dashboard showing 99.9% uptime over 30 days"></div>'), true],

  // ---- encoding and markup tricks -----------------------------------------
  ['split across spans', page('<p>Audit prep fell <span>7</span><span>0</span>%.</p>'), true],
  ['decimal entities', page('<p>Audit prep fell &#55;&#48;&#37;.</p>'), true],
  ['svg text node', page('<svg><text>FDA-validated MES</text></svg>'), true],
  ['nbsp entity', page('<p>MESvantage is fully&nbsp;compliant.</p>'), true],

  // ---- exemption laundering ------------------------------------------------
  ['void data-evidence disables page', page('<img data-evidence="x" src="a.png" /><p>Audit prep fell 70%.</p>'), true],
  ['class attribute collision', page('<div class="data-evidence"><p>Audit prep fell 70%.</p></div>'), true],
  ['prose mentioning the attribute', page('<p>Tag it with data-evidence. Audit prep fell 70%.</p>'), true],
  ['similar attribute name', page('<div data-evidenced><p>Audit prep fell 70%.</p></div>'), true],
  [
    'claim laundered through illustration',
    page('<div data-illustration><p>MESvantage cuts audit prep by 70% and saves EUR 250,000 a year.</p></div><p>Illustration rendered with synthetic data.</p>'),
    true,
  ],
  ['undisclosed illustration', page('<div data-illustration><p>Cell 01</p></div>'), true],
  ['undisclosed screenshot', page('<figure data-screenshot="a.png"><img alt="x"></figure>'), true],
  ['data-retired off the evidence page', page('<div data-retired><h2>MESvantage is fully compliant.</h2></div>'), true],

  // ---- banned vocabulary ---------------------------------------------------
  ['FDA-validated', page('<p>Our FDA-validated platform.</p>'), true],
  ['predictive maintenance', page('<p>Includes predictive maintenance.</p>'), true],
  ['annex 11', page('<p>Electronic signatures (Annex 11).</p>'), true],

  // ---- must NOT be caught (false-positive guards) --------------------------
  ['standard number', page('<p>Audit trails implemented against 21 CFR Part 11.</p>'), false],
  ['iso number', page('<p>Certified under ISO 13485 at the site.</p>'), false],
  ['clause number', page('<p>See ISO 13485 clause 4.1.6 for the obligation.</p>'), false],
  ['copyright year', page('<p>© 2026 MESvantage Limited.</p>'), false],
  ['git sha in a caption', page('<p>Screenshot captured from build 2c09d37d.</p>'), false],
  ['git sha with day-like pair', page('<p>Captured from build a17d90b3.</p>'), false],
  ['third party', page('<p>Your data never trains a third party’s model.</p>'), false],
  ['third-party hyphenated', page('<p>There are no embedded third-party frames.</p>'), false],
  ['attributed statistic', page('<div data-evidence="module-count"><p>74 modules</p></div>'), false],
  ['disclosed illustration', page('<div data-illustration><p>Cell 01 · 84%</p></div><p>Illustration rendered with synthetic data.</p>'), false],
  ['plain prose', page('<p>Every record signed, traceable and audit-ready.</p>'), false],
  [
    'disclosed screenshot',
    page(
      '<figure data-screenshot="a.png"><img alt="x"><figcaption>Ardara Orthopaedics is a ' +
        'fictional manufacturer and every record shown is seeded demonstration data.</figcaption></figure>',
    ),
    false,
  ],
];

const root = mkdtempSync(join(tmpdir(), 'claims-test-'));
let passed = 0;
const failures = [];

for (const [name, html, shouldFail] of CASES) {
  const dir = join(root, name.replace(/[^a-z0-9]+/gi, '-'));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);

  let exitCode = 0;
  try {
    execFileSync(process.execPath, ['scripts/check-claims.mjs', dir], { stdio: 'pipe' });
  } catch (err) {
    exitCode = err.status ?? 1;
  }

  const didFail = exitCode !== 0;
  if (didFail === shouldFail) {
    passed += 1;
  } else {
    failures.push(
      shouldFail
        ? `EVADED   ${name} — should have been caught`
        : `FALSE +  ${name} — should have passed`,
    );
  }
}

rmSync(root, { recursive: true, force: true });

if (failures.length === 0) {
  console.log(`✓ claims-checker regression suite: ${passed}/${CASES.length} cases`);
  process.exit(0);
}

console.error(`\n✗ claims-checker regression suite: ${failures.length} of ${CASES.length} failed\n`);
for (const f of failures) console.error(`  ${f}`);
console.error('');
process.exit(1);
