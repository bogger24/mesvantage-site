#!/usr/bin/env node
/**
 * Generates public/og.png — the card that appears when the site is pasted into LinkedIn,
 * Slack, Teams or an email client.
 *
 * There was no og:image at all, so every share rendered as a bare text stub. For a site whose
 * whole argument is "we are more rigorous than we look", a broken-looking share card is a
 * poor first frame — and it is the first frame most people get, because the way this site
 * reaches a VP of Quality is someone pasting it into a Teams channel.
 *
 * Composed as SVG and rasterised with sharp, which is already a dependency of astro:assets.
 * No headless browser, no external service, and it regenerates in about a second.
 *
 * The "Record Strip" along the bottom is the site's signature device: a monospaced hairline
 * band of the fields a device history record actually carries. It says what the product is
 * faster than a sentence does.
 */
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';

const W = 1200;
const H = 630;

const NAVY = '#0F2D52';
const NAVY_DEEP = '#0A2140';
const ACCENT = '#3FA9F5';
const WHITE = '#FFFFFF';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const strip = ['SERIAL', 'OPERATION', 'GAUGE', 'RESULT', 'SIGNED', 'UTC'];

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${NAVY}"/>
      <stop offset="100%" stop-color="${NAVY_DEEP}"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="${WHITE}" stroke-width="1" opacity="0.04"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>

  <!-- accent rule, top left, the one piece of colour -->
  <rect x="80" y="96" width="64" height="4" fill="${ACCENT}"/>

  <text x="80" y="146" font-family="Inter, Helvetica, Arial, sans-serif" font-size="22"
        font-weight="700" letter-spacing="4" fill="${ACCENT}">MESVANTAGE</text>

  <text x="80" y="248" font-family="Inter, Helvetica, Arial, sans-serif" font-size="58"
        font-weight="800" fill="${WHITE}">${esc('Every implant. Every operation.')}</text>
  <text x="80" y="318" font-family="Inter, Helvetica, Arial, sans-serif" font-size="58"
        font-weight="800" fill="${WHITE}">${esc('Every signature.')}</text>
  <text x="80" y="388" font-family="Inter, Helvetica, Arial, sans-serif" font-size="58"
        font-weight="800" fill="${ACCENT}">${esc('One validated record.')}</text>

  <text x="80" y="452" font-family="Inter, Helvetica, Arial, sans-serif" font-size="25"
        font-weight="400" fill="${WHITE}" opacity="0.78">${esc(
          'The manufacturing execution system for orthopaedic implant manufacturers.',
        )}</text>

  <!-- record strip -->
  <line x1="80" y1="516" x2="${W - 80}" y2="516" stroke="${WHITE}" stroke-width="1" opacity="0.18"/>
  ${strip
    .map(
      (field, i) =>
        `<text x="${80 + i * 176}" y="552" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="15" font-weight="600" letter-spacing="1.5" fill="${WHITE}" opacity="0.55">${field}</text>`,
    )
    .join('\n  ')}
  <line x1="80" y1="574" x2="${W - 80}" y2="574" stroke="${WHITE}" stroke-width="1" opacity="0.18"/>

  <text x="80" y="606" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="14"
        fill="${WHITE}" opacity="0.4">mesvantage.com</text>
</svg>`;

const out = new URL('../public/og.png', import.meta.url);
const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
writeFileSync(out, png);

const meta = await sharp(png).metadata();
if (meta.width !== W || meta.height !== H) {
  throw new Error(`og.png is ${meta.width}×${meta.height}, expected ${W}×${H}`);
}
console.log(`✓ og.png — ${meta.width}×${meta.height}, ${(png.length / 1024).toFixed(1)} KB`);
