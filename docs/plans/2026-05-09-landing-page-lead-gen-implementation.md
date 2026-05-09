# Landing Page Lead Generation Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rewrite the mesvantage.com homepage to follow a Pain→Proof→Product→CTA arc, with a gated PDF download (ConvertKit) as the primary conversion action.

**Architecture:** New `LeadCaptureModal.tsx` React island handles the name+email gate — it renders a trigger button + modal with ConvertKit API POST. The modal is self-contained and reused in the hero, header, and closing CTA. The PDF is `public/mesvantage-product-overview.pdf`, generated from the existing `brochure.astro` page via headless Chrome (manual step). All homepage content lives in `src/pages/index.astro`.

**Tech Stack:** Astro 4.x, Tailwind CSS 3.x, React 18 (islands), ConvertKit v3 API (client-side form subscribe)

---

## Pre-flight: ConvertKit setup (manual — Patrick does this once)

Before running any tasks, complete these steps:

1. Go to [convertkit.com](https://convertkit.com) → create a free account
2. Create a new **Form** (type: Inline — no embed needed, API only). Name it "PDF Download".
3. Copy the **Form ID** from the form's URL: `app.convertkit.com/forms/designers/XXXXXXX/edit` → ID is `XXXXXXX`
4. Go to **Settings → Advanced** → copy the **API Key** (not the API Secret)
5. Create a **Visual Automation**: trigger = "Subscribes to PDF Download form" → action = "Send email" with subject "Your MESvantage Product Overview" and body containing: `Download here: https://mesvantage.com/mesvantage-product-overview.pdf`
6. Create local `.env`:
   ```
   PUBLIC_CONVERTKIT_API_KEY=your_api_key_here
   PUBLIC_CONVERTKIT_FORM_ID=your_form_id_here
   ```
7. Add both vars to Vercel dashboard under the `mesvantage-site` project

---

## Task 1: Extend type declarations + create .env.example

**Files:**
- Modify: `src/env.d.ts`
- Create: `.env.example`

**Step 1: Update env.d.ts to declare the two public env vars**

Replace the contents of `src/env.d.ts` with:

```typescript
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_CONVERTKIT_API_KEY: string;
  readonly PUBLIC_CONVERTKIT_FORM_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

**Step 2: Create `.env.example`**

```
PUBLIC_CONVERTKIT_API_KEY=ck_live_xxxxxxxxxxxxxxxx
PUBLIC_CONVERTKIT_FORM_ID=1234567
```

**Step 3: Verify no TypeScript errors**

```bash
cd /home/patrick/Code/mesvantage-site
npx tsc --noEmit
```

Expected: no errors (zero output).

**Step 4: Commit**

```bash
git add src/env.d.ts .env.example
git commit -m "chore: declare ConvertKit env vars in type system"
```

---

## Task 2: Build LeadCaptureModal React island

**Files:**
- Create: `src/components/LeadCaptureModal.tsx`

**Step 1: Create the component**

Create `src/components/LeadCaptureModal.tsx`:

```tsx
import { useState } from 'react';

interface Props {
  label?: string;
  variant?: 'primary' | 'ghost' | 'nav';
}

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function LeadCaptureModal({
  label = 'Download Product Overview',
  variant = 'primary',
}: Props) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<FormState>('idle');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const buttonClass =
    variant === 'primary'
      ? 'bg-accent hover:bg-accent-dark text-white font-semibold px-8 py-3.5 rounded-md transition-colors'
      : variant === 'ghost'
      ? 'border border-white/30 hover:border-white text-white font-semibold px-8 py-3.5 rounded-md transition-colors'
      : 'bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('submitting');
    setErrorMsg('');

    const apiKey = import.meta.env.PUBLIC_CONVERTKIT_API_KEY;
    const formId = import.meta.env.PUBLIC_CONVERTKIT_FORM_ID;

    // Dev fallback: if no ConvertKit vars, simulate success
    if (!apiKey || !formId) {
      setTimeout(() => setState('success'), 800);
      return;
    }

    try {
      const res = await fetch(
        `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_key: apiKey, first_name: firstName, email }),
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setState('success');
    } catch {
      setState('error');
      setErrorMsg('Something went wrong. Please email us at hello@mesvantage.com.');
    }
  }

  function close() {
    setOpen(false);
    // Reset form when modal closes (after animation)
    setTimeout(() => {
      setState('idle');
      setFirstName('');
      setEmail('');
      setErrorMsg('');
    }, 200);
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={buttonClass}>
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              type="button"
              onClick={close}
              className="absolute top-4 right-4 text-ink/30 hover:text-ink transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {state === 'success' ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5">
                  <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-navy mb-2">Check your inbox</h3>
                <p className="text-ink/60 text-sm leading-relaxed">
                  Your product overview is on its way — it should arrive within a minute.
                  <br />Can't find it? Check your spam folder.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-navy mb-1">Download the Product Overview</h3>
                <p className="text-sm text-ink/60 mb-6">
                  We'll send the 2-page PDF to your inbox. No spam, unsubscribe any time.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5" htmlFor="ck-first-name">
                      First name
                    </label>
                    <input
                      id="ck-first-name"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                      placeholder="Patrick"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5" htmlFor="ck-email">
                      Work email
                    </label>
                    <input
                      id="ck-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                      placeholder="you@company.com"
                    />
                  </div>
                  {errorMsg && (
                    <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-md px-3 py-2">
                      {errorMsg}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={state === 'submitting'}
                    className="w-full bg-accent hover:bg-accent-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-md transition-colors"
                  >
                    {state === 'submitting' ? 'Sending…' : 'Send me the PDF →'}
                  </button>
                  <p className="text-xs text-ink/40 text-center">
                    By submitting you agree to receive occasional product updates.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
```

**Step 2: Start the dev server and verify the component compiles**

```bash
cd /home/patrick/Code/mesvantage-site && npm run dev
```

Expected: server starts at `http://localhost:4321` with no TypeScript errors in terminal.

Kill the dev server (Ctrl+C) before continuing.

**Step 3: Commit**

```bash
git add src/components/LeadCaptureModal.tsx
git commit -m "feat: add LeadCaptureModal React island with ConvertKit gate"
```

---

## Task 3: Update Header nav CTA

**Files:**
- Modify: `src/components/Header.astro`

**Step 1: Import LeadCaptureModal and replace the "Book a Demo" button**

Find the `<div class="flex items-center gap-3">` block in `Header.astro` (currently line ~28–35). Replace the entire `<div class="flex items-center gap-3">` block with:

```astro
---
// Add at top of frontmatter (after existing imports):
import LeadCaptureModal from './LeadCaptureModal';
---
```

Then replace:
```html
<div class="flex items-center gap-3">
  <a
    href="/about#contact"
    class="bg-accent hover:bg-accent-dark text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
  >
    Book a Demo
  </a>
  <!-- Mobile menu toggle ... -->
```

With:
```astro
<div class="flex items-center gap-3">
  <LeadCaptureModal label="Download Overview" variant="nav" client:load />
  <!-- Mobile menu toggle (visible on small screens only) -->
```

**Step 2: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:4321` — verify "Download Overview" button appears in the nav. Click it — modal should open. Close by clicking the X or the backdrop.

Kill dev server.

**Step 3: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat: replace header CTA with LeadCaptureModal"
```

---

## Task 4: Rewrite homepage hero section

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Add the LeadCaptureModal import at the top of index.astro**

Add to the frontmatter:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import LeadCaptureModal from '../components/LeadCaptureModal';
---
```

**Step 2: Replace the hero section**

Replace the entire `<!-- Hero -->` section (from `<section class="bg-navy text-white pt-24...">` through its closing `</section>`) with:

```astro
<!-- Hero -->
<section class="bg-navy text-white pt-24 pb-20 px-6 overflow-hidden relative">
  <div class="absolute inset-0 opacity-[0.04] pointer-events-none"
       style="background-image: linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px); background-size: 48px 48px;"></div>

  <div class="max-w-5xl mx-auto text-center relative">
    <div class="inline-flex items-center gap-2 bg-accent/15 border border-accent/30 rounded-full px-4 py-1.5 text-xs font-semibold text-accent tracking-wide uppercase mb-6">
      <span class="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
      Validated · ISO 13485 · 21 CFR Part 11
    </div>
    <h1 class="text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
      Every FAI, NCR, audit, and machine —<br class="hidden md:block" /> one validated platform.
    </h1>
    <p class="mt-7 text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
      Medical device CDMOs spend three weeks preparing for an audit. MESvantage cuts that to four days.
      Built and FDA-validated inside a live 250,000-knee-per-year orthopaedic CDMO.
    </p>
    <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
      <LeadCaptureModal label="Download Product Overview" variant="primary" client:load />
      <a href="/about#contact" class="border border-white/30 hover:border-white text-white font-semibold px-8 py-3.5 rounded-md transition-colors">
        Book a Demo
      </a>
    </div>
  </div>
</section>
```

**Step 3: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:4321`. Check:
- New headline renders
- "Download Product Overview" button opens the modal
- "Book a Demo" link goes to `/about#contact`

Kill dev server.

**Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(homepage): pain-first hero + modal CTA"
```

---

## Task 5: Add "Sound familiar?" pain recognition section

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Add pain section immediately after the hero section closing `</section>` and BEFORE the `<!-- Quantified outcomes band -->`**

Insert this block:

```astro
<!-- Pain recognition -->
<section class="py-20 px-6 bg-white border-b border-border">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-12">
      <span class="text-xs font-bold tracking-widest text-accent uppercase">Does this sound familiar?</span>
      <h2 class="mt-2 text-3xl md:text-4xl font-bold text-navy">
        The problems every CDMO lives with.
      </h2>
    </div>
    <div class="grid md:grid-cols-3 gap-6">
      {[
        {
          icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`,
          title: 'Audit prep is a 3-week fire drill',
          body: 'Every FDA or notified body visit means weeks of pulling records, chasing paper travellers, and reconstructing device history from spreadsheets and shared drives.',
        },
        {
          icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>`,
          title: "You can't see your floor in real time",
          body: 'Machine status, OEE, active jobs, operator positions — none of it is visible until someone walks the floor or checks a whiteboard at shift handover.',
        },
        {
          icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>`,
          title: 'Your quality system is a shared drive',
          body: 'FAIs, NCRs, CAPAs, incoming inspection results — scattered across SharePoint folders, email threads, and institutional knowledge that leaves when people leave.',
        },
      ].map(card => (
        <div class="bg-surface border border-border rounded-xl p-8">
          <div class="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-5" set:html={card.icon} />
          <h3 class="text-lg font-bold text-navy mb-3">{card.title}</h3>
          <p class="text-ink/70 leading-relaxed text-sm">{card.body}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

**Step 2: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:4321` — scroll below the hero. Pain section should appear with 3 cards before the stats band.

Kill dev server.

**Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(homepage): add pain recognition section"
```

---

## Task 6: Add context lines to the outcomes band

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Replace the `<!-- Quantified outcomes band -->` section**

Find and replace the entire `<!-- Quantified outcomes band -->` section with:

```astro
<!-- Quantified outcomes band -->
<section class="bg-navy/5 border-b border-border">
  <div class="max-w-6xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
    {[
      { stat: '90d', label: 'Time to Live', context: 'From contract to production floor' },
      { stat: '~70%', label: 'Faster Audit Prep', context: 'Weeks of prep becomes days' },
      { stat: '~75%', label: 'FAI Cycle Reduction', context: 'From drawing to approved record' },
      { stat: '€0', label: 'Validation Budget', context: 'IQ/OQ/PQ already passed' },
    ].map(item => (
      <div>
        <div class="text-3xl md:text-4xl font-extrabold text-navy">{item.stat}</div>
        <div class="text-xs uppercase tracking-wider text-ink/60 mt-1 font-semibold">{item.label}</div>
        <div class="text-xs text-ink/40 mt-1">{item.context}</div>
      </div>
    ))}
  </div>
</section>
```

**Step 2: Verify in browser**

```bash
npm run dev
```

Stats band should now show a context line under each label.

Kill dev server.

**Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(homepage): add context lines to outcomes stats band"
```

---

## Task 7: Update module domain grid with outcome descriptions

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Find the module highlights section and replace the data array**

Locate the `<!-- Module highlights -->` section (or `6-tile grid` section). Replace the module data array with:

```astro
<!-- Module highlights -->
<section class="py-24 px-6 bg-white border-b border-border">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-14">
      <span class="text-xs font-bold tracking-widest text-accent uppercase">The platform</span>
      <h2 class="mt-2 text-3xl md:text-4xl font-bold text-navy">50+ validated modules. Six domains.</h2>
      <p class="mt-4 text-ink/60 max-w-xl mx-auto">
        Every module was designed for regulated contract manufacturing — not retrofitted from a generic platform.
      </p>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        {
          domain: 'Quality',
          num: '01',
          icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
          outcome: 'From incoming inspection to lot release — every quality record signed, traceable, and audit-ready under 21 CFR Part 11.',
        },
        {
          domain: 'Production',
          num: '02',
          icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`,
          outcome: 'Real-time OEE, scheduling, and in-process documentation that eliminates paper travellers and floor clipboards.',
        },
        {
          domain: 'Metrology',
          num: '03',
          icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>`,
          outcome: 'CMM results parsed automatically from Renishaw, Hexagon, and Zeiss — tolerance failures flagged before the part leaves the machine.',
        },
        {
          domain: 'Training',
          num: '04',
          icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>`,
          outcome: 'Operators can only run what they are trained on. Trainer sign-off, competency expiry, and enforcement — fully automated.',
        },
        {
          domain: 'Intelligence',
          num: '05',
          icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>`,
          outcome: 'CEO-level visibility: machine utilisation, quality trends, energy spend, and predictive alerts — without a BI team or data analyst.',
        },
        {
          domain: 'Platform',
          num: '06',
          icon: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" /></svg>`,
          outcome: 'Mobile PWA, digital signage, audit trail, e-signatures, and role-based access — the regulated infrastructure that makes the rest possible.',
        },
      ].map(m => (
        <div class="bg-surface border border-border rounded-xl p-8 hover:border-accent/40 hover:shadow-sm transition-all">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center flex-shrink-0" set:html={m.icon} />
            <div>
              <div class="text-xs font-bold tracking-wider text-ink/30 uppercase">Domain {m.num}</div>
              <div class="text-base font-bold text-navy leading-tight">{m.domain}</div>
            </div>
          </div>
          <p class="text-ink/70 leading-relaxed text-sm">{m.outcome}</p>
          <a href={`/product#${m.domain.toLowerCase()}`} class="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-accent hover:text-accent-dark transition-colors">
            See modules <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" /></svg>
          </a>
        </div>
      ))}
    </div>
    <div class="mt-10 text-center">
      <a href="/product" class="text-sm font-semibold text-accent hover:text-accent-dark transition-colors">
        View all 50+ modules →
      </a>
    </div>
  </div>
</section>
```

**Step 2: Verify in browser**

```bash
npm run dev
```

Module grid should now show outcome-focused copy with domain numbering and "See modules" links.

Kill dev server.

**Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(homepage): outcome-focused module domain grid"
```

---

## Task 8: Add screenshot callout section

**Files:**
- Modify: `src/pages/index.astro`
- Create: `public/screenshots/` (directory — add a placeholder first)

**Step 1: Add a placeholder screenshot**

```bash
mkdir -p /home/patrick/Code/mesvantage-site/public/screenshots
# Create a placeholder (1400x800 SVG) until the real screenshot is ready
cat > /home/patrick/Code/mesvantage-site/public/screenshots/intelligence-dashboard.svg << 'SVGEOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 800" width="1400" height="800">
  <rect width="1400" height="800" fill="#F8F9FB"/>
  <rect x="0" y="0" width="1400" height="56" fill="#0F2D52"/>
  <text x="24" y="36" fill="white" font-family="system-ui" font-size="16" font-weight="700">MESvantage Intelligence</text>
  <text x="700" y="420" fill="#94A3B8" font-family="system-ui" font-size="18" text-anchor="middle">[ Screenshot placeholder — replace with public/screenshots/intelligence-dashboard.png ]</text>
</svg>
SVGEOF
```

**Step 2: Add the screenshot section to index.astro**

Insert this section AFTER the module grid section and BEFORE the `<!-- The gap we fill -->` section:

```astro
<!-- Screenshot callout -->
<section class="py-24 px-6 bg-navy relative overflow-hidden">
  <div class="absolute inset-0 opacity-[0.04] pointer-events-none"
       style="background-image: linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px); background-size: 48px 48px;"></div>
  <div class="max-w-6xl mx-auto relative">
    <div class="text-center mb-10">
      <span class="text-xs font-bold tracking-widest text-accent uppercase">Real platform. Live in production.</span>
      <h2 class="mt-2 text-3xl md:text-4xl font-bold text-white">Not a demo. Not a pilot.</h2>
      <p class="mt-4 text-white/60 max-w-xl mx-auto">
        The platform has been running under FDA scrutiny at 250,000 knees per year for two years.
        What you see is what you get.
      </p>
    </div>
    <div class="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      <img
        src="/screenshots/intelligence-dashboard.svg"
        alt="MESvantage Intelligence Dashboard — CEO-level visibility across quality, production, and energy"
        class="w-full h-auto block"
        width="1400"
        height="800"
        loading="lazy"
      />
    </div>
    <p class="text-center text-white/30 text-xs mt-4">
      Intelligence module — machine utilisation, quality trends, and predictive alerts. All data anonymised.
    </p>
  </div>
</section>
```

**Note for Patrick:** Replace `public/screenshots/intelligence-dashboard.svg` with the real PNG once captured from the live MES. The `<img>` src will work with either `.svg` or `.png` — just change the extension.

**Step 3: Verify in browser**

```bash
npm run dev
```

Screenshot section should appear between the module grid and compliance sections, on a navy background.

Kill dev server.

**Step 4: Commit**

```bash
git add src/pages/index.astro public/screenshots/
git commit -m "feat(homepage): add screenshot callout section (placeholder)"
```

---

## Task 9: Add founder quote section

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Insert the founder quote section AFTER the `<!-- The gap we fill -->` section**

```astro
<!-- Founder quote -->
<section class="py-20 px-6 bg-surface border-b border-border">
  <div class="max-w-3xl mx-auto text-center">
    <svg class="w-10 h-10 text-accent/40 mx-auto mb-6" fill="currentColor" viewBox="0 0 32 32">
      <path d="M10 8C6.686 8 4 10.686 4 14v10h10V14H7c0-1.657 1.343-3 3-3V8zm18 0c-3.314 0-6 2.686-6 6v10h10V14h-7c0-1.657 1.343-3 3-3V8z"/>
    </svg>
    <blockquote class="text-xl md:text-2xl font-medium text-navy leading-relaxed">
      "We built the MES we couldn't find on the market. It's been running live in our plant for two years —
      250,000 knee systems a year, fully under FDA scrutiny. That's not a pilot. That's the product."
    </blockquote>
    <div class="mt-8 flex items-center justify-center gap-4">
      <div class="w-12 h-12 rounded-full bg-navy/10 flex items-center justify-center text-navy font-bold text-lg">PB</div>
      <div class="text-left">
        <div class="font-bold text-navy">Patrick Byrnes</div>
        <div class="text-sm text-ink/60">CEO, Croom Medical — Founding Customer</div>
      </div>
    </div>
  </div>
</section>
```

**Step 2: Verify in browser**

```bash
npm run dev
```

Quote section should appear with blockquote text and founder attribution.

Kill dev server.

**Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(homepage): add founder quote section"
```

---

## Task 10: Add closing CTA and remove old closing strip

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Find the existing closing CTA section** (it currently has a navy bg with "Ready to see it live?" and a "Book a Demo" button). Replace it with:

```astro
<!-- Closing CTA -->
<section class="py-24 px-6 bg-navy relative overflow-hidden">
  <div class="absolute inset-0 opacity-[0.04] pointer-events-none"
       style="background-image: linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px); background-size: 48px 48px;"></div>
  <div class="max-w-3xl mx-auto text-center relative">
    <span class="text-xs font-bold tracking-widest text-accent uppercase">Get started</span>
    <h2 class="mt-3 text-3xl md:text-4xl font-bold text-white leading-tight">
      See exactly what MESvantage<br class="hidden md:block" /> would look like in your plant.
    </h2>
    <p class="mt-5 text-white/60 text-lg max-w-xl mx-auto">
      Download the product overview — a 2-page summary of every module, compliance credentials, and implementation timeline.
    </p>
    <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
      <LeadCaptureModal label="Download Product Overview" variant="primary" client:load />
      <a href="/about#contact" class="border border-white/30 hover:border-white text-white font-semibold px-8 py-3.5 rounded-md transition-colors">
        Book a Demo Instead
      </a>
    </div>
  </div>
</section>
```

**Step 2: Verify full page flow in browser**

```bash
npm run dev
```

Scroll from top to bottom — verify the full story arc:
1. Hero with pain headline + modal CTA ✓
2. Social proof bar ✓
3. "Sound familiar?" pain cards ✓
4. Stats band with context lines ✓
5. Architecture diagram ✓
6. Module grid with outcome copy ✓
7. Screenshot callout (navy bg) ✓
8. "The gap we fill" cards ✓
9. Founder quote ✓
10. Compliance section ✓
11. Closing CTA with modal ✓

Kill dev server.

**Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(homepage): closing CTA with PDF download gate"
```

---

## Task 11: Update brochure.astro to 2-page product overview

**Files:**
- Modify: `src/pages/brochure.astro`

**Step 1: Replace the entire brochure.astro content**

The full 2-page brochure should replace the existing `brochure.astro`. The file is designed for headless Chrome PDF printing (`@page { size: A4; margin: 0 }`).

Replace `src/pages/brochure.astro` with:

```astro
---
// 2-page A4 product overview — designed to be rendered to PDF
// Generate PDF: chromium --headless --print-to-pdf=public/mesvantage-product-overview.pdf --no-margins http://localhost:4321/brochure
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>MESvantage — Product Overview</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <style is:global>
    @page { size: A4 portrait; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      font-family: 'Inter', sans-serif;
      color: #1A1A2E;
      background: white;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      width: 210mm; height: 297mm;
      padding: 12mm 14mm;
      display: flex; flex-direction: column; gap: 5mm;
      page-break-after: always;
      overflow: hidden;
    }

    /* Header */
    .header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 4mm; border-bottom: 1.5px solid #E2E8F0; }
    .logo { font-size: 20pt; font-weight: 900; color: #0F2D52; letter-spacing: -0.5px; }
    .logo span { color: #1A7FBF; }
    .badges { display: flex; gap: 5px; }
    .badge { background: #EFF6FF; color: #1A7FBF; font-size: 6.5pt; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 2px 7px; border-radius: 20px; }

    /* Hero block */
    .hero { background: #0F2D52; color: white; padding: 8mm 10mm; border-radius: 8px; }
    .hero h1 { font-size: 16pt; font-weight: 800; line-height: 1.2; margin-bottom: 3mm; }
    .hero p { font-size: 9pt; color: rgba(255,255,255,0.7); line-height: 1.6; max-width: 150mm; }

    /* Stats row */
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4mm; }
    .stat-card { background: #F8F9FB; border: 1px solid #E2E8F0; border-radius: 6px; padding: 4mm; text-align: center; }
    .stat-num { font-size: 18pt; font-weight: 900; color: #0F2D52; }
    .stat-label { font-size: 6.5pt; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.8px; margin-top: 1mm; }
    .stat-context { font-size: 6pt; color: #94A3B8; margin-top: 0.5mm; }

    /* Module grid */
    .section-title { font-size: 8pt; font-weight: 700; color: #1A7FBF; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 3mm; }
    .modules { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3.5mm; }
    .module-card { background: #F8F9FB; border: 1px solid #E2E8F0; border-radius: 6px; padding: 4mm; }
    .module-name { font-size: 9pt; font-weight: 800; color: #0F2D52; margin-bottom: 1.5mm; }
    .module-num { font-size: 6pt; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1mm; }
    .module-body { font-size: 7.5pt; color: #475569; line-height: 1.5; }

    /* Page 2 sections */
    .proof-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; }
    .proof-card { padding: 4mm; border: 1px solid #E2E8F0; border-radius: 6px; }
    .proof-title { font-size: 8.5pt; font-weight: 700; color: #0F2D52; margin-bottom: 1.5mm; }
    .proof-body { font-size: 7.5pt; color: #475569; line-height: 1.5; }

    .compliance-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; }
    .compliance-card { background: #0F2D52; color: white; padding: 4mm 5mm; border-radius: 6px; }
    .compliance-title { font-size: 8pt; font-weight: 800; margin-bottom: 1.5mm; }
    .compliance-body { font-size: 7pt; color: rgba(255,255,255,0.65); line-height: 1.5; }

    .timeline { display: grid; grid-template-columns: 18mm 1fr; gap: 2mm 5mm; align-items: start; }
    .t-week { font-size: 7.5pt; font-weight: 700; color: #1A7FBF; padding-top: 1mm; }
    .t-body { font-size: 7.5pt; color: #475569; line-height: 1.5; padding-bottom: 2mm; border-bottom: 1px solid #F1F5F9; }

    .quote-block { background: #F8F9FB; border-left: 3px solid #1A7FBF; padding: 5mm 6mm; border-radius: 0 6px 6px 0; }
    .quote-text { font-size: 9pt; font-style: italic; color: #0F2D52; line-height: 1.6; margin-bottom: 2.5mm; }
    .quote-attr { font-size: 7.5pt; font-weight: 700; color: #475569; }

    .footer-bar { display: flex; justify-content: space-between; align-items: center; padding-top: 3mm; border-top: 1px solid #E2E8F0; margin-top: auto; }
    .footer-text { font-size: 7pt; color: #94A3B8; }
    .footer-url { font-size: 7.5pt; font-weight: 700; color: #1A7FBF; }
  </style>
</head>
<body>

<!-- PAGE 1 -->
<div class="page">
  <div class="header">
    <div class="logo">MES<span>vantage</span></div>
    <div class="badges">
      <span class="badge">FDA 21 CFR Part 11</span>
      <span class="badge">ISO 13485</span>
      <span class="badge">Validated</span>
    </div>
  </div>

  <div class="hero">
    <h1>The manufacturing intelligence platform<br/>for medical device CDMOs.</h1>
    <p>
      Medical device CDMOs spend three weeks preparing for an audit. MESvantage cuts that to four days.
      Built and FDA-validated inside a live 250,000-knee-per-year orthopaedic CDMO — not a pilot, not a demo, but a product that has been running under FDA scrutiny for two years.
    </p>
  </div>

  <div class="stats">
    {[
      { num: '90d', label: 'Time to Live', ctx: 'Contract to production floor' },
      { num: '~70%', label: 'Faster Audit Prep', ctx: 'Weeks of prep becomes days' },
      { num: '~75%', label: 'FAI Cycle Reduction', ctx: 'Drawing to approved record' },
      { num: '€0', label: 'Validation Budget', ctx: 'IQ/OQ/PQ already passed' },
    ].map(s => (
      <div class="stat-card">
        <div class="stat-num">{s.num}</div>
        <div class="stat-label">{s.label}</div>
        <div class="stat-context">{s.ctx}</div>
      </div>
    ))}
  </div>

  <div class="section-title">Platform modules — 6 domains, 50+ features</div>
  <div class="modules">
    {[
      { num: '01', name: 'Quality', body: 'FAI, FPY, SPC, DHR, NCR, CAPA, Incoming Inspection, Customer Quality Portal. Every record electronically signed and audit-ready.' },
      { num: '02', name: 'Production', body: 'Real-time OEE, scheduling, and in-process documentation. Paper travellers eliminated. Shift handover in one screen.' },
      { num: '03', name: 'Metrology', body: 'Automatic CMM parsing from Renishaw, Hexagon, and Zeiss. Tolerance failures flagged before the part leaves the machine.' },
      { num: '04', name: 'Training', body: 'Operators can only run what they are trained on. Competency expiry, trainer sign-off, and enforcement automated.' },
      { num: '05', name: 'Intelligence', body: 'CEO dashboard: machine utilisation, quality trends, energy spend, predictive alerts. No BI team or data analyst required.' },
      { num: '06', name: 'Platform', body: 'Mobile PWA, digital signage, audit trail, e-signatures, role-based access. The regulated infrastructure layer.' },
    ].map(m => (
      <div class="module-card">
        <div class="module-num">Domain {m.num}</div>
        <div class="module-name">{m.name}</div>
        <div class="module-body">{m.body}</div>
      </div>
    ))}
  </div>

  <div class="footer-bar">
    <div class="footer-text">MESvantage — Confidential product overview</div>
    <div class="footer-url">mesvantage.com</div>
  </div>
</div>

<!-- PAGE 2 -->
<div class="page">
  <div class="header">
    <div class="logo">MES<span>vantage</span></div>
    <div class="footer-text" style="font-size:7.5pt;color:#64748B;">Product Overview — Page 2 of 2</div>
  </div>

  <div class="section-title">Why MESvantage</div>
  <div class="proof-grid">
    {[
      { title: 'Purpose-built for CDMOs', body: 'Not a generic MES retrofitted to medical. Every workflow — DHR, FAI, CMM, OEE, NCR — was designed for regulated contract manufacturing.' },
      { title: 'Validation transferable', body: 'IQ/OQ/PQ baseline already passed in a live regulated environment. Validation evidence transfers. Skip the 12-month validation programme.' },
      { title: 'Production-grade from day one', body: 'Stress-tested at scale, 24/7, under FDA scrutiny. Every feature has run on a real production floor — not a lab, not a sandbox.' },
    ].map(c => (
      <div class="proof-card">
        <div class="proof-title">{c.title}</div>
        <div class="proof-body">{c.body}</div>
      </div>
    ))}
  </div>

  <div class="section-title">Compliance credentials</div>
  <div class="compliance-grid">
    {[
      { title: 'FDA 21 CFR Part 11', body: 'Full audit trail on every record change. Electronic signatures with intent capture. Access control and session management.' },
      { title: 'ISO 13485', body: 'DHR, traceability, incoming inspection, CAPA, and document control aligned to ISO 13485 quality management requirements.' },
      { title: 'Siloed SaaS', body: 'Each customer has their own compute, database, and storage. No data co-mingles across customers — a compliance feature, not a limitation.' },
    ].map(c => (
      <div class="compliance-card">
        <div class="compliance-title">{c.title}</div>
        <div class="compliance-body">{c.body}</div>
      </div>
    ))}
  </div>

  <div class="section-title">Implementation timeline — 90 days to live</div>
  <div class="timeline">
    <div class="t-week">Weeks 1–4</div>
    <div class="t-body">Environment provisioned. Data migration from ERP (M1, SAP, Plex, Infor). Quality module configured. Staff onboarding begins.</div>
    <div class="t-week">Weeks 5–10</div>
    <div class="t-body">Production, OEE, and training modules live. CMM integration connected to existing metrology hardware. Parallel run vs. legacy system.</div>
    <div class="t-week">Weeks 11–13</div>
    <div class="t-body">Intelligence and reporting live. Legacy system retired. IQ/OQ/PQ documentation package delivered. Go-live sign-off.</div>
  </div>

  <div class="section-title">Founding customer</div>
  <div class="quote-block">
    <div class="quote-text">"We built the MES we couldn't find on the market. It's been running live in our plant for two years — 250,000 knee systems a year, fully under FDA scrutiny. That's not a pilot. That's the product."</div>
    <div class="quote-attr">Patrick Byrnes, CEO — Croom Medical &nbsp;·&nbsp; ISO 13485 &nbsp;·&nbsp; FDA 21 CFR Part 11 &nbsp;·&nbsp; 250,000 knee systems/year</div>
  </div>

  <div class="footer-bar">
    <div class="footer-text">mesvantage.com &nbsp;·&nbsp; hello@mesvantage.com &nbsp;·&nbsp; MESvantage Limited, Ireland</div>
    <div class="footer-url">Book a demo: mesvantage.com/about</div>
  </div>
</div>

</body>
</html>
```

**Step 2: Preview the brochure in browser**

```bash
npm run dev
```

Open `http://localhost:4321/brochure`. You should see the 2-page A4 layout.

Kill dev server.

**Step 3: Generate the PDF (requires Chromium/Chrome)**

```bash
# Start the dev server in background
cd /home/patrick/Code/mesvantage-site && npm run dev &
sleep 3

# Generate PDF
chromium-browser --headless --no-sandbox --print-to-pdf=/home/patrick/Code/mesvantage-site/public/mesvantage-product-overview.pdf --no-pdf-header-footer http://localhost:4321/brochure 2>/dev/null || \
google-chrome --headless --no-sandbox --print-to-pdf=/home/patrick/Code/mesvantage-site/public/mesvantage-product-overview.pdf --no-pdf-header-footer http://localhost:4321/brochure 2>/dev/null

# Kill the dev server
kill %1

ls -lh /home/patrick/Code/mesvantage-site/public/mesvantage-product-overview.pdf
```

Expected: `mesvantage-product-overview.pdf` exists, ~200-400KB.

**Step 4: Commit**

```bash
git add src/pages/brochure.astro public/mesvantage-product-overview.pdf
git commit -m "feat(brochure): 2-page A4 product overview + generated PDF"
```

---

## Task 12: Production build verification

**Step 1: Run the full build**

```bash
cd /home/patrick/Code/mesvantage-site && npm run build
```

Expected: build completes with no errors. Warnings about chunk size are pre-existing and acceptable.

**Step 2: Preview the production build**

```bash
npm run preview
```

Open `http://localhost:4321`. Walk through:
- [ ] Hero: new headline visible, "Download Product Overview" button opens modal
- [ ] Modal: name + email form renders, X closes it
- [ ] Pain section: 3 cards visible
- [ ] Stats band: context lines under each number
- [ ] Module grid: outcome descriptions, "See modules" links work
- [ ] Screenshot section: placeholder visible on navy background
- [ ] Founder quote: visible
- [ ] Closing CTA: modal button works
- [ ] Header: "Download Overview" button opens modal
- [ ] `/brochure`: 2-page layout renders correctly

**Step 3: Push to Vercel**

```bash
git push
```

Vercel auto-deploys on push to `main`. Verify at `https://mesvantage.com` (or Vercel preview URL).

---

## Post-deploy checklist (manual)

- [ ] ConvertKit account created and welcome automation set up
- [ ] `PUBLIC_CONVERTKIT_API_KEY` and `PUBLIC_CONVERTKIT_FORM_ID` added to Vercel env vars
- [ ] Re-deploy Vercel after adding env vars (Settings → Environment Variables → Redeploy)
- [ ] Test the full flow: submit name + email → check inbox → PDF arrives
- [ ] Replace `public/screenshots/intelligence-dashboard.svg` with real anonymised PNG from live MES
- [ ] Re-generate PDF after adding the real screenshot to the brochure (repeat Task 11 Step 3)
