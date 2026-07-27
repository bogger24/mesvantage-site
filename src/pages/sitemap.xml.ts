import type { APIRoute } from 'astro';

/**
 * Sitemap, generated from the real page files.
 *
 * Deliberately not @astrojs/sitemap: the installed 3.7.x targets Astro 5+ and crashes on
 * Astro 4's `astro:build:done` signature. That incompatibility is why the integration was
 * un-wired back in May 2026 and then quietly left in package.json — so the site has shipped
 * with `site:` configured and nothing consuming it ever since. Twenty lines here removes the
 * dependency, the version trap, and the drift.
 *
 * Routes are derived from src/pages, so a new page is in the sitemap the moment it exists.
 */

const SITE = 'https://mesvantage.com';

/** Routes that must never be indexed. Keep in step with public/robots.txt. */
const EXCLUDE = new Set(['/brochure']);

const pageModules = import.meta.glob('./**/*.astro', { eager: true });

function fileToRoute(file: string): string {
  const route = file
    .replace(/^\.\//, '/')
    .replace(/\.astro$/, '')
    .replace(/\/index$/, '');
  return route === '' ? '/' : route;
}

export const GET: APIRoute = () => {
  const routes = Object.keys(pageModules)
    .map(fileToRoute)
    .filter((route) => !EXCLUDE.has(route) && !route.startsWith('/_'))
    .sort();

  const urls = routes
    .map((route) => `  <url>\n    <loc>${SITE}${route}</loc>\n  </url>`)
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
