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

const SOURCE = 'src/pages/brochure.astro';
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
      `--print-to-pdf=${OUT}`,
      URL,
    ],
    { stdio: 'inherit' },
  );

  writeFileSync(SIDECAR, `${sourceHash()}\n`);
  console.log(`✓ ${OUT} regenerated from ${SOURCE}`);
  console.log(`✓ ${SIDECAR} updated`);
} finally {
  try {
    process.kill(-preview.pid);
  } catch {
    /* already gone */
  }
}
