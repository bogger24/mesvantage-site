# Deploying mesvantage.com

## Normal path

Push to `main`. Vercel builds and promotes to production automatically.

```bash
git push origin main
```

The GitHub repository is connected to the Vercel project `mesvantage-site`
(org `croommedical-2585s-projects`). Deployment status appears on the commit in GitHub.

> This was not always true. Between 7 May and 28 July 2026 the Vercel project had **no Git
> repository connected**, so pushes never triggered anything. Twenty commits and green CI
> accumulated while the live site served the 7 May build for two and a half months, and
> `mesvantage.com/mesvantage-product-overview.pdf` — the target of the primary call to action —
> returned 404 for eleven weeks. Nothing surfaced it, because nothing was watching. If the site
> ever looks stale again, check this setting first.

## Manual path

Only needed if the Git integration is disconnected or a deploy must bypass it.

```bash
npm run build          # must pass — see below
vercel --prod --yes
```

## The build gate

`npm run build` is `astro build && node scripts/check-claims.mjs dist`. The second half is not
optional and is deliberately inside the build script rather than beside it: it must be impossible
to produce a deployable `dist/` that has not been checked.

It fails on:

- **an unattributed statistic** — any number bound to a unit, currency or magnitude rendered
  outside an `<Evidence>` wrapper, in body copy *or* in `meta`/`alt`/`aria-label` text
- **banned vocabulary** — `FDA-validated`, `predictive maintenance`, `autonomous quality`,
  `self-validating`, `fully compliant`, `Annex 11`, and the retired validation-budget claim
- **an undisclosed illustration** — a page marking mockups `data-illustration` without telling
  the reader they are illustrations rendered with synthetic data
- **a claim laundered inside an illustration** — marketing prose carrying a statistic placed in
  an exempt wrapper

If the checker blocks copy, **rewrite the copy**. Do not widen the allowlist. The allowlist masks
digits that are part of a name (ISO 13485, 21 CFR Part 11, clause numbers, years, page numbers) —
nothing else belongs there.

When a new evasion is found: add the case to `scripts/check-claims.test.mjs` **first**, watch it
fail, then fix the checker. Two adversarial reviews defeated earlier versions 27 and then 22 ways,
each time because a fix landed without a test. The suite is 46 cases and runs in CI.

## Changing the product overview PDF

The PDF is printed from the `/brochure` route. Editing `brochure.astro` or `claims.ts` is not
enough — the PDF must be re-rendered:

```bash
npm run pdf            # runs build first, then prints, then records the sidecar hash
```

CI compares `sha256(dist/brochure/index.html)` against
`public/mesvantage-product-overview.pdf.source-sha` and fails if they drift.

The hash covers the **built page**, not the source. `brochure.astro` imports the claims register,
so hashing the source alone leaves every number in the PDF unguarded — an earlier version of this
guard did exactly that and attested to a PDF it had never seen.

## After deploying

```bash
curl -sI https://mesvantage.com/                                  # 200
curl -sI https://mesvantage.com/mesvantage-product-overview.pdf   # 200, not 404
curl -s https://mesvantage.com/brochure | grep 'name="robots"'    # noindex, nofollow
curl -s https://mesvantage.com/sitemap.xml | grep -c brochure     # 0
```

Note that repeated automated requests will trip Vercel's bot mitigation and start returning
`403` with `x-vercel-mitigated: challenge`. That is your own IP being challenged, not an outage —
a browser solves it transparently.
