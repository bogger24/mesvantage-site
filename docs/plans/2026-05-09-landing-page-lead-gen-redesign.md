# MESvantage Landing Page — Lead Generation Redesign

**Date:** 2026-05-09  
**Author:** Patrick Byrnes / Claude  
**Status:** Approved

---

## Objective

Rewrite `mesvantage.com` to follow a Pain → Proof → Product → CTA story arc. Replace "Book a Demo" as the primary above-fold CTA with "Download Product Overview" — a gated name + email form that delivers a 2-page PDF and adds the subscriber to ConvertKit for future follow-up.

---

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Primary CTA | Download Product Overview (gated PDF) | CEO/QA buyers forward PDFs internally; builds a subscriber list from day one |
| Lead gate | Name + email → ConvertKit → PDF link via welcome email | Free up to 10k subscribers; proper list ownership; enables follow-up sequences |
| PDF mechanism | `brochure.astro` printed via Chrome headless → `public/mesvantage-product-overview.pdf` | Already exists, version-controlled, re-generatable in one command |
| Screenshots | Real MES screenshots, anonymised (names/costs blurred) | Highest trust signal; buyers need to see actual product |
| Hero buyer | CDMO CEO/MD — names the pain, CEO language | QA + Ops scannable via proof points and module grid below the fold |
| Secondary CTA | Book a Demo (ghost button) | Remains for buyers who skip straight to a call |

---

## Homepage Structure (new)

| # | Section | Change from current |
|---|---|---|
| 1 | **Hero** | Pain-first headline + subheadline. CTA swap: primary → "Download Product Overview" (opens modal), ghost → "Book a Demo" |
| 2 | **Social proof bar** | Keep: Croom · 250k knees · ISO 13485 · FDA Part 11 |
| 3 | **Pain recognition — "Sound familiar?"** | NEW. 3 pain cards with buyer language. Goes BEFORE the stats band. |
| 4 | **Quantified outcomes band** | Keep stats (90d · ~70% · ~75% · €0) but add 1-line context per stat |
| 5 | **Architecture / How it works** | Keep SVG diagram. Reframe section header copy only. |
| 6 | **Screenshot callout** | NEW. Single anonymised MES screenshot (Intelligence / CEO dashboard). Caption: "Real platform. Live in production." |
| 7 | **Module domain grid** | Keep 6-tile structure. Rewrite descriptions: feature-list → one-sentence outcome per domain. |
| 8 | **Founder quote** | NEW. Patrick as Croom CEO: built the product he couldn't find; 2 years live in production. |
| 9 | **Compliance block** | Keep: FDA / ISO / Siloed SaaS. |
| 10 | **Closing CTA strip** | Replace "Book a Demo" with "Download Product Overview" (same modal). |

---

## Hero Copy

**Headline:**  
`Every FAI, NCR, audit, and machine — one validated platform.`

**Subheadline:**  
`Medical device CDMOs spend 3 weeks preparing for an audit. MESvantage cuts that to 4 days. Built and FDA-validated inside a live 250,000-knee-per-year orthopaedic CDMO.`

**Primary CTA:** `Download Product Overview` → opens `LeadCaptureModal`  
**Ghost CTA:** `Book a Demo` → `/about#contact`

---

## Pain Recognition Section — "Sound familiar?"

Three cards, buyer language, no solution copy in this section:

1. **"Audit prep is a 3-week fire drill"**  
   Every FDA or notified body visit means weeks of pulling records, chasing paper travellers, and reconstructing device history from spreadsheets.

2. **"You can't see your floor in real time"**  
   Machine status, OEE, active jobs, operator positions — none of it is visible until someone walks the floor or checks a whiteboard.

3. **"Your quality system is a shared drive"**  
   FAIs, NCRs, CAPAs, incoming inspection — scattered across SharePoint folders, email threads, and tribal knowledge.

---

## Module Domain Grid — Outcome Rewrites

| Domain | Old description (feature-list) | New description (outcome) |
|---|---|---|
| Quality | (bullet list) | From incoming inspection to lot release — every quality record signed, traceable, and audit-ready. |
| Production | (bullet list) | Real-time OEE, scheduling, and in-process documentation that replaces paper travellers on the floor. |
| Metrology | (bullet list) | CMM results parsed automatically from Renishaw, Hexagon, and Zeiss — tolerance failures flagged before the part leaves the machine. |
| Training | (bullet list) | Operators can only run what they're trained on. Trainer sign-off, expiry tracking, and enforcement built in. |
| Intelligence | (bullet list) | CEO-level visibility: machine utilisation, quality trends, energy spend, and predictive alerts — without a BI team. |
| Platform | (bullet list) | Mobile PWA, digital signage, e-signatures, audit trail, and role-based access — the regulated infrastructure layer. |

---

## Founder Quote

> "We built the MES we couldn't find on the market. It's been running live in our plant for two years — 250,000 knee systems a year, fully under FDA scrutiny. That's not a pilot. That's the product."

— **Patrick Byrnes**, CEO, Croom Medical (founding customer)

---

## Lead Capture Flow

```
User clicks "Download Product Overview"
  → LeadCaptureModal opens (React island)
  → User submits name + email
  → Client POSTs to ConvertKit Form Subscribe API
      POST https://api.convertkit.com/v3/forms/{FORM_ID}/subscribe
      { api_key, first_name, email }
  → Modal shows success state: "Check your inbox — your copy is on its way."
  → ConvertKit triggers welcome email → contains PDF link
      (PDF hosted at: https://mesvantage.com/mesvantage-product-overview.pdf)
```

**ConvertKit manual setup steps (one-time, done by Patrick):**
1. Create ConvertKit account at convertkit.com (free, no credit card)
2. Create a new Form (type: inline, no embed needed — API only)
3. Create a welcome automation: tag "pdf-download" → email with PDF link
4. Copy: API Key (Settings → Advanced) + Form ID (from form URL)
5. Add to Vercel env vars: `PUBLIC_CONVERTKIT_API_KEY` and `PUBLIC_CONVERTKIT_FORM_ID`
6. Add same vars to local `.env`

---

## PDF One-Pager Structure (updates to `brochure.astro`)

**Page 1:**
- MESvantage logo + tagline + compliance badges (top bar)
- Headline: "The manufacturing intelligence platform for medical device CDMOs."
- Subheadline: 2-sentence pitch (pain → solution → proof)
- 4 stat callouts (90d · ~70% audit · ~75% FAI · €0 validation)
- 6 module domains grid: icon + name + one-sentence outcome (same text as homepage)

**Page 2:**
- "Why MESvantage" — 3-column proof block (purpose-built CDMO / validation transferable / production-grade)
- Compliance credentials: FDA 21 CFR Part 11 · ISO 13485 · Siloed SaaS
- Implementation timeline: 90-day go-live breakdown (3 rows: Weeks 1-4 / 5-10 / 11-13)
- Founding customer proof: Croom Medical block + Patrick quote
- Footer: mesvantage.com · contact placeholder

---

## New Files

| File | Purpose |
|---|---|
| `src/components/LeadCaptureModal.tsx` | React island — name+email form, ConvertKit POST, success state |
| `src/components/DownloadButton.astro` | Wrapper that renders LeadCaptureModal client-side |
| `public/mesvantage-product-overview.pdf` | Generated from `brochure.astro` via Chrome headless (manual step post-build) |
| `public/screenshots/intelligence-dashboard.png` | Anonymised MES screenshot (manual step — captured from live MES) |

## Modified Files

| File | Change |
|---|---|
| `src/pages/index.astro` | Full homepage rewrite per section structure above |
| `src/pages/brochure.astro` | 2-page content update per PDF structure above |
| `src/components/Header.astro` | Nav CTA: "Book a Demo" → "Download Overview" (triggers modal) |

---

## Screenshot Capture Guidance

For the anonymised Intelligence/CEO dashboard screenshot:
- Navigate to the CEO Intelligence module in the live MES
- Use browser devtools to blur/replace: machine names, operator names, specific cost/OEE figures
- Target size: 1400×800px minimum, PNG
- Crop to show the dashboard header + 2-3 KPI cards + one chart
- Save to `public/screenshots/intelligence-dashboard.png`

Alternatively: use the Power BI dashboards that are already public-facing via OptSigns — these have no identifiable operator data.

---

## Out of Scope

- Logo redesign (separate workstream)
- LinkedIn video clips (separate workstream)
- Scribe/documentation tooling (separate workstream)
- Any change to `/product`, `/compliance`, `/pricing`, `/about` pages
