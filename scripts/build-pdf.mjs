#!/usr/bin/env node
/**
 * Regenerates public/mesvantage-product-overview.pdf from the /brochure route, and records the
 * hash of the source it was generated from.
 *
 * Why this exists: the truth pass rewrote brochure.astro to remove "FDA-validated",
 * "€0 Validation Budget", "~70%", "~75%" and "Skip the 12-month validation programme" — but the
 * PDF was never re-rendered. For a further push the site's primary call to action, on every
 * page, downloaded a document containing every claim the site had just retired. The claims
 * checker never saw it because it only walks *.html.
 *
 * The sidecar .source-sha file is the fix. CI compares it against the current hash of
 * brochure.astro; if the source has moved and the PDF has not, the build fails.
 *
 * Usage:
 *   npm run build          # produce dist/
 *   npm run pdf            # serve dist/, print to PDF, write the sidecar
 */

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync, spawn } from 'node:child_process';

// Hash the BUILT page, not the source.
//
// The first version of this guard hashed src/pages/brochure.astro while printing from dist/ via
// astro preview. Those are different things: brochure.astro imports src/data/claims.ts, so every
// number in the PDF comes from a file the guard never looked at, and nothing forced dist/ to be
// in step with either. Red team broke it twice in under a minute — once by editing the source and
// running `npm run pdf` alone (stale dist, fresh sidecar, CI green), once by editing a claim value
// (source hash unchanged, PDF wrong, CI green).
//
// dist/brochure/index.html is the artefact actually printed, and it already reflects the source,
// the register, and the stylesheet. Hashing it makes the attestation mean what it says.
const SOURCE = 'dist/brochure/index.html';
const OUT = 'public/mesvantage-product-overview.pdf';
const SIDECAR = `${OUT}.source-sha`;
const URL = 'http://localhost:4321/brochure';

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

function sourceHash() {
  return createHash('sha256').update(readFileSync(SOURCE)).digest('hex');
}

export function expectedHash() {
  return existsSync(SIDECAR) ? readFileSync(SIDECAR, 'utf8').trim() : null;
}

const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  console.error('No Chrome/Chromium found. Set CHROME_PATH.');
  process.exit(1);
}

if (!existsSync(SOURCE)) {
  console.error(`${SOURCE} not found. Run \`npm run build\` first — this script prints what is in dist/.`);
  process.exit(1);
}

const preview = spawn('npx', ['astro', 'preview'], { stdio: 'ignore', detached: true });

async function waitForServer(timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(URL);
      if (res.ok) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

try {
  if (!(await waitForServer())) throw new Error(`preview server never served ${URL}`);

  execFileSync(
    chrome,
    [
      '--headless',
      '--no-sandbox',
      '--disable-gpu',
      '--no-pdf-header-footer',
      // Without a virtual time budget, headless Chrome prints before the self-hosted webfont
      // has loaded and silently substitutes whatever the machine resolves 'sans-serif' to.
      // The brochure sets .page { height: 297mm; overflow: hidden }, so font metrics decide
      // page fit and overflow is clipped rather than reflowed — the PDF would differ depending
      // on who generated it.
      '--virtual-time-budget=10000',
      '--run-all-compositor-stages-before-draw',
      `--print-to-pdf=${OUT}`,
      URL,
    ],
    { stdio: 'inherit' },
  );

  writeFileSync(SIDECAR, `${sourceHash()}\n`);
  console.log(`✓ ${OUT} regenerated from ${SOURCE}`);
  console.log('  (if you edited brochure.astro or claims.ts, you must run `npm run build` first)');
  console.log(`✓ ${SIDECAR} updated`);
} finally {
  try {
    process.kill(-preview.pid);
  } catch {
    /* already gone */
  }
}
