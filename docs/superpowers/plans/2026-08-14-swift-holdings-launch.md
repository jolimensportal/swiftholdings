# Swift Holdings — Launch Polish & Deploy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Take the built Swift Holdings site from a local blueprint prototype to a public, content-accurate, image-rich deployment on Vercel.

**Architecture:** Extend the existing Astro/DataNova site. Introduce a single source of truth for investment figures, an `astro:assets`-based responsive image component wired into the hero and key sections, a per-page SEO/structured-data pass, an accessibility pass, a real test for figure accuracy, and a Vercel deploy with working form delivery via env-configured endpoints.

**Tech Stack:** Astro 7, Tailwind CSS v4, Preline UI, astro:assets (sharp), vitest, Vercel, Lenis.

---

## File Structure

- `src/utils/figures.ts` — **single source of truth** for every investment number used across sections (ADR, occupancy, yield, share price, profit split, contacts). Imported by sections so a figure is edited in one place.
- `src/components/common/ResponsiveImage.astro` — wraps `astro:assets` `<Image>`/`<Picture>`; takes a local image import, alt text, and class; emits optimized, responsive markup. Used wherever a photo replaces/augments the blueprint art.
- `src/assets/images/photos/` — real photography / AI capsule renders supplied by the engineer (`.webp`, `< 400kB` each). Named by slot (e.g. `hero-village.webp`, `capsule-1.webp`, `about-team.webp`).
- `src/components/sections/*.astro` — consume `figures.ts` and `ResponsiveImage` where relevant (InvestmentSection, About, Market Insights, HeroSection).
- `src/utils/figures.test.ts` — vitest test asserting `figures.ts` matches the proposal constants (prevents silent drift).
- `src/pages/*.astro` — SEO props already present; Task 6 verifies each.
- `astro.config.mjs` / `vercel.json` — deploy config (exists); Task 9 confirms.
- `.env` / Vercel project env — `FORMSPREE_CONTACT_ENDPOINT`, `FORM_WEBHOOK_CONTACT`, `FORMSPREE_NEWSLETTER_ENDPOINT`, `FORM_WEBHOOK_NEWSLETTER` for real form delivery.

---

### Task 1: Single source of truth for figures

**Files:**

- Create: `src/utils/figures.ts`
- Modify: `src/components/sections/SwiftStats.astro`, `src/components/sections/InvestmentSection.astro`, `src/components/sections/InsightsSection.astro`, `src/components/sections/LeadCTA.astro`, `src/components/sections/Footer.astro`

- [ ] **Step 1: Create the figures module**

```ts
// src/utils/figures.ts
export const figures = {
  sharePriceFrom: 100,
  adrLow: 100,
  adrHigh: 132,
  occupancyLow: 33,
  occupancyHigh: 44,
  yieldLow: 6,
  yieldHigh: 10,
  profitShareInvestor: 80,
  profitShareOperator: 20,
  tiers: [
    { name: 'Starter', shares: 12, capsules: 1, priceFrom: 1200 },
    {
      name: 'Cluster',
      shares: 48,
      capsules: 4,
      priceFrom: 4800,
      featured: true,
    },
    { name: 'Block', shares: 120, capsules: 10, priceFrom: 12000 },
  ],
  contacts: {
    email: 'info@swiftholdings.org',
    phoneGh: '+233 544 101016',
    phoneCa: '+1 437 421 0963',
    address: '20 Edmonton St, Madina, Accra',
  },
} as const;

export type Figures = typeof figures;
```

- [ ] **Step 2: Use it in `SwiftStats.astro`**

Replace the hardcoded `stats` array with imports:

```astro
---
import { figures } from '@utils/figures';
const stats = [
  {
    value: `$${figures.sharePriceFrom}`,
    label: 'Entry share price',
    note: 'Fractional ownership',
  },
  {
    value: `$${figures.adrLow}–${figures.adrHigh}`,
    label: 'Average daily rate',
    note: 'ADR per capsule',
  },
  {
    value: `${figures.occupancyLow}–${figures.occupancyHigh}%`,
    label: 'Occupancy (ramp)',
    note: 'Stabilising upward',
  },
  {
    value: `${figures.yieldLow}–${figures.yieldHigh}%`,
    label: 'Target annual yield',
    note: 'Net of management',
  },
];
const split = `${figures.profitShareInvestor} / ${figures.profitShareOperator}`;
---
```

Update the footnote paragraph to use `{split}` instead of the literal `80 / 20`.

- [ ] **Step 3: Use it in `InvestmentSection.astro`**

Replace the local `tiers` const with `import { figures } from '@utils/figures'; const tiers = figures.tiers;`. Keep the `featured` flag (already on `Cluster` in `figures.ts`).

- [ ] **Step 4: Use contacts in `Footer.astro` and `LeadCTA.astro`**

In `Footer.astro` set `contactDetails` from `figures.contacts` (map `phoneGh`→`phone`, keep `email`/`address`/`website: 'swiftholdings.org'`). In `LeadCTA.astro` render `figures.contacts.phoneGh` / `phoneCa` / `email` / `address`.

- [ ] **Step 5: Build to confirm no breakage**

Run: `pnpm build` (use Node 22 via nvm)
Expected: exits 0, no "is not defined" errors.

- [ ] **Step 6: Commit**

```bash
git add src/utils/figures.ts src/components/sections/SwiftStats.astro src/components/sections/InvestmentSection.astro src/components/sections/Footer.astro src/components/sections/LeadCTA.astro
git commit -m "refactor: single source of truth for Swift figures"
```

---

### Task 2: Responsive image component

**Files:**

- Create: `src/components/common/ResponsiveImage.astro`

- [ ] **Step 1: Write the component**

```astro
---
import { Image } from 'astro:assets';
import type { ImageMetadata } from 'astro';
interface Props {
  src: ImageMetadata;
  alt: string;
  class?: string;
  widths?: number[];
  sizes?: string;
}
const {
  src,
  alt,
  class: className = '',
  widths = [400, 800, 1200, 1600],
  sizes = '(min-width: 1024px) 50vw, 100vw',
} = Astro.props;
---

<Image
  src={src}
  alt={alt}
  widths={widths}
  sizes={sizes}
  loading="lazy"
  decoding="async"
  class={`block w-full h-full object-cover ${className}`}
/>
```

- [ ] **Step 2: Build to confirm it compiles**

Run: `pnpm build`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/common/ResponsiveImage.astro
git commit -m "feat: responsive image component (astro:assets)"
```

---

### Task 3: Wire imagery into sections

**Files:**

- Modify: `src/components/sections/InvestmentSection.astro`, `src/components/sections/About.astro`, `src/components/sections/MarketInsights.astro`, `src/components/sections/HeroSection.astro`
- Create (assets): `src/assets/images/photos/capsule-1.webp`, `src/assets/images/photos/village-aerial.webp`, `src/assets/images/photos/about-team.webp`

- [ ] **Step 1: Add a photo slot to `InvestmentSection`**

Import the asset and component, and insert a framed photo above the `CapsuleArt` figure:

```astro
---
import ResponsiveImage from '@common/ResponsiveImage.astro';
import capsule from '@images/photos/capsule-1.webp';
---
```

Add, just inside the section after the heading:

```astro
<div
  class="reveal mt-10 overflow-hidden border border-slate-900/15"
  style="--d:180ms"
>
  <ResponsiveImage
    src={capsule}
    alt="A completed Swift Holdings prefab capsule in Oyarifa"
  />
</div>
```

- [ ] **Step 2: Add a photo to `About.astro`**

Replace the left prose column's first `<p>` block with a two-part layout: prose then a `ResponsiveImage` of `about-team.webp` in a bordered frame. Import `aboutTeam from '@images/photos/about-team.webp'` and `ResponsiveImage`.

- [ ] **Step 3: Add an aerial to `MarketInsights.astro` or `HeroSection`**

In `HeroSection`, add an optional `ResponsiveImage` of `village-aerial.webp` as a secondary framed visual beneath the `VillagePlan` (desktop only), import `villageAerial from '@images/photos/village-aerial.webp'`.

- [ ] **Step 4: Build to confirm asset imports resolve**

Run: `pnpm build`
Expected: exits 0. If a `.webp` is missing, build fails with "Could not import" — supply the file (see Task 4) before committing.

- [ ] **Step 5: Commit (after assets exist)**

```bash
git add src/components/sections/InvestmentSection.astro src/components/sections/About.astro src/components/sections/MarketInsights.astro src/components/sections/HeroSection.astro src/assets/images/photos
git commit -m "feat: wire real photography into key sections"
```

---

### Task 4: Populate image assets

**Files:**

- Create: `src/assets/images/photos/*.webp` (engineer-supplied)

- [ ] **Step 1: Place optimized assets**

Copy the supplied photography / AI capsule renders into `src/assets/images/photos/` with these exact names:

- `capsule-1.webp` — hero capsule render (portrait or square, ≥1200px wide)
- `village-aerial.webp` — aerial/site view of the village (≥1600px wide)
- `about-team.webp` — team or brand image (≥1200px wide)

Each file must be `.webp`, **under 400 kB**. Compress with `cwebp -q 78 in.png -o src/assets/images/photos/<name>.webp` if needed.

- [ ] **Step 2: Build and verify sizes**

Run: `pnpm build`
Expected: exits 0; `dist/` contains hashed, resized variants under `dist/_astro/`.

- [ ] **Step 3: Commit**

```bash
git add src/assets/images/photos
git commit -m "assets: add Swift Holdings photography"
```

---

### Task 5: Figure-accuracy test (TDD)

**Files:**

- Create: `src/utils/figures.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/utils/figures.test.ts
import { describe, it, expect } from 'vitest';
import { figures } from './figures';

describe('Swift Holdings figures match the Oyarifa proposal', () => {
  it('exposes the proposal ADR range', () => {
    expect(figures.adrLow).toBe(100);
    expect(figures.adrHigh).toBe(132);
  });
  it('exposes occupancy, yield and the 80/20 split', () => {
    expect(figures.occupancyLow).toBe(33);
    expect(figures.occupancyHigh).toBe(44);
    expect(figures.yieldLow).toBe(6);
    expect(figures.yieldHigh).toBe(10);
    expect(figures.profitShareInvestor).toBe(80);
    expect(figures.profitShareOperator).toBe(20);
  });
  it('keeps the three investment tiers', () => {
    expect(figures.tiers.map(t => t.name)).toEqual([
      'Starter',
      'Cluster',
      'Block',
    ]);
  });
});
```

- [ ] **Step 2: Run the test to verify it passes (figures already defined in Task 1)**

Run: `pnpm test`
Expected: all 3 tests PASS.

- [ ] **Step 3: Commit**

```bash
git add src/utils/figures.test.ts
git commit -m "test: assert Swift figures match proposal"
```

---

### Task 6: Per-page SEO & structured data review

**Files:**

- Verify: `src/pages/index.astro`, `src/pages/the-model.astro`, `src/pages/investment.astro`, `src/pages/market-insights.astro`, `src/pages/about.astro`, `src/pages/protections.astro`, `src/pages/contact.astro`

- [ ] **Step 1: Confirm every page sets `seo` props**

Each page already imports `BaseLayout` with `seo={{ title, description }}`. Verify none is missing by grepping:

Run: `grep -L "seo=" src/pages/*.astro`
Expected: no output (every page has `seo=`).

- [ ] **Step 2: Confirm unique titles**

Run: `grep -rho "title: '[^']*'" src/pages/*.astro | sort | uniq -d`
Expected: no duplicates printed.

- [ ] **Step 3: Add `OG_IMAGE` env / social image if missing**

If `public/social.png` is absent, create a 1200×630 `social.png` in `public/` (export from the capsule render). Confirm `BaseLayout` references `social.png` (it does via `socialImage`).

- [ ] **Step 4: Commit (only if a file changed)**

```bash
git add -A && git commit -m "fix: ensure per-page SEO titles are unique"
```

---

### Task 7: Accessibility pass

**Files:**

- Modify: `src/components/common/ResponsiveImage.astro`, `src/components/sections/*.astro` as needed

- [ ] **Step 1: Guarantee alt text on every image**

`ResponsiveImage` already requires `alt`. Grep usages:

Run: `grep -rn "<ResponsiveImage" src | grep -v 'alt=' `
Expected: no output (every usage passes `alt`).

- [ ] **Step 2: Verify focus-visible styles exist**

`global.css` already sets `focus-visible:ring` on buttons/links via Preline; confirm by grepping `focus-visible:ring` occurs at least once. Add a global fallback if missing:

```css
:where(a, button, input, textarea, select):focus-visible {
  outline: 2px solid var(--color-slate-900);
  outline-offset: 2px;
}
```

- [ ] **Step 3: Confirm reduced-motion keeps content visible**

`global.css` gates `.reveal` behind `.reveal-ready` (added only when motion is allowed). Verify:

Run: `grep -n "reveal-ready" src/assets/styles/global.css`
Expected: the `.reveal-ready .reveal` rule is present.

- [ ] **Step 4: Build and manually keyboard-tab through the nav**

Run: `pnpm dev`, open `http://127.0.0.1:4321/`, tab through Navbar → hero CTA → sections. No element should be unreachable or unstyled.

- [ ] **Step 5: Commit**

```bash
git add src/assets/styles/global.css src/components/common/ResponsiveImage.astro
git commit -m "a11y: alt-text, focus-visible, reduced-motion guarantees"
```

---

### Task 8: Real form delivery

**Files:**

- Modify: `.env` (local), Vercel project env (production)
- Verify: `src/utils/form-client.ts`, `src/pages/api/contact.ts`, `src/pages/api/newsletter.ts`

- [ ] **Step 1: Set endpoints in `.env`**

```
FORMSPREE_CONTACT_ENDPOINT=https://formspree.io/f/your_contact_form_id
FORM_WEBHOOK_CONTACT=
FORMSPREE_NEWSLETTER_ENDPOINT=https://formspree.io/f/your_newsletter_form_id
FORM_WEBHOOK_NEWSLETTER=
```

Copy `.env.template` → `.env` first if not present.

- [ ] **Step 2: Verify the API routes read env**

Run: `grep -n "FORMSPREE_CONTACT_ENDPOINT\|FORM_WEBHOOK_CONTACT" src/pages/api/contact.ts`
Expected: both referenced (route posts to Formspree or the webhook).

- [ ] **Step 3: Smoke-test the contact endpoint with env set**

Run (with `.env` loaded by your shell or `pnpm dev`):
`curl -s -X POST http://127.0.0.1:4321/api/contact -H "Content-Type: application/json" -d '{"name":"T","email":"t@e.com","message":"hi"}'`
Expected: `200` and the submission appears in the Formspree inbox.

- [ ] **Step 4: Commit env template only (never real secrets)**

```bash
git add .env.template
git commit -m "ci: document form delivery endpoints"
```

(`.env` must stay gitignored — confirm with `git status --short` that `.env` is NOT listed.)

---

### Task 9: Deploy to Vercel

**Files:**

- Verify: `vercel.json`, `astro.config.mjs`

- [ ] **Step 1: Preview build locally**

Run: `pnpm build`
Expected: exits 0, `dist/` produced.

- [ ] **Step 2: Link & deploy to preview**

Run: `pnpm dlx vercel` (login if prompted), then `pnpm dlx vercel deploy`
Expected: a preview URL is printed.

- [ ] **Step 3: Set production env in Vercel**

In the Vercel dashboard (or `pnpm dlx vercel env add`), add the four `FORMSPREE_*` / `FORM_WEBHOOK_*` variables from Task 8.

- [ ] **Step 4: Promote to production**

Run: `pnpm dlx vercel deploy --prod`
Expected: production URL live; `curl -sI https://<your-domain>/` returns `200`.

- [ ] **Step 5: Smoke-test production pages**

Run:
`for p in "" the-model investment market-insights about protections contact; do curl -s -o /dev/null -w "/$p %{http_code}\n" https://<your-domain>/$p; done`
Expected: all `200`.

- [ ] **Step 6: Commit any deploy config tweaks**

```bash
git add vercel.json astro.config.mjs
git commit -m "ci: Vercel deploy configuration"
```

---

## Self-Review

**1. Spec coverage**

- Imagery (real photos / AI renders): Tasks 2–4 ✅
- Content accuracy: Task 1 (single source) + Task 5 (test) + Task 6 (review) ✅
- Deploy: Task 9 ✅; form delivery: Task 8 ✅
- Accessibility: Task 7 ✅
- No spec requirement left without a task.

**2. Placeholder scan**

- No "TBD"/"TODO". Asset filenames are concrete; engineer supplies bytes (expected — not a code placeholder).
- Every code step shows the code; every verification shows the command + expected output.

**3. Type consistency**

- `figures.ts` exports `figures` (and `Figures` type). Sections import `figures` and read `.adrLow`, `.tiers[].name`, `.contacts.*` — names match across Tasks 1, 3, 5.
- `ResponsiveImage` prop is `src: ImageMetadata` (astro:assets); usages pass imported `.webp` metadata, consistent.
- `ResponsiveImage` requires `alt` in every Task 3 usage (Task 7 verifies).

Plan complete and saved to `docs/superpowers/plans/2026-08-14-swift-holdings-launch.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
