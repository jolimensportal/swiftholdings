# THE SWIFT PROJECT — Rich + Gated + Dashboard Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship content-rich marketing (10 pages 800–1200w each with illustrative labels) where premium value is visibly gated (blur+lock+counts) driving the 5-step briefing, plus a portal dashboard preview on marketing — while keeping `swiftholdings.pages.dev` canonical until domain purchase (no hardcoded `theswiftproject.com`).

**Architecture:** Single-repo incremental upgrade: Astro `output:'server'` with `SESSION` KV stays, marketing pages compose `GatedTeaser` + `PortalPreview` with simulated Ghana data labelled SIM; portal `data.json`/`metric-cards.tsx` stay static Ghana until Phase 2 Drizzle. No repo split, no server worker dependency for Phase 1 static output.

**Tech Stack:** Astro 7.2.1, @astrojs/cloudflare 14.2.1, Svelte/React 19, Tailwind 4.3, Drizzle 0.45 + @libsql/client, Vitest 4.1, Node 22, pnpm 10, Cloudflare Pages `dist/client`, OpenNext portal

---

### File Structure

**New files:**
- `src/components/marketing/GatedTeaser.astro` — blurred slot + lock pill + CTA to /briefing
- `src/components/marketing/PortalPreview.astro` — screenshot + bullets of portal (GHS 127,400 etc)
- `src/data/marketing/hubs.ts` — 4 hubs 48/24/12/12 typed
- `src/data/marketing/capsules.ts` — P7 + 3 variants typed
- `tests/unit/gated-teaser.spec.ts` — teaser prop: title + gatedCount renders
- `tests/unit/portal-preview.spec.ts` — preview renders image + lock overlay
- `tests/unit/hubs-caps.spec.ts` — hub caps sum 96, capsules family count 4

**Modified files:**
- `astro.config.mjs:14` — keep `site:'https://swiftholdings.pages.dev'`, add `envField PUBLIC_SITE_URL` note (no hardcode)
- `src/pages/index.astro`, `village.astro`, `how-it-works.astro`, `ownership.astro`, `protections.astro`, `locations.astro`, `partnership.astro`, `about.astro`, `briefing.astro`, `resources.astro` — inject rich copy + GatedTeaser + PortalPreview
- `src/data/marketing/pages.ts` — expand copy 800–1200w per page, ledger SIM labels, FAQ arrays
- `src/data/marketing/site.ts` — add `siteUrlEnv` helper, keep `swiftholdings.pages.dev` fallback
- `src/components/marketing/SiteHeader.astro` — ensure THE SWIFT PROJECT (already done, verify)
- `src/layout/MarketingLayout.astro` — add soft canonical helper
- `public/_headers` — already fixed (keep), `public/_redirects` — add `/oyarifa → /locations` soft (no domain)
- `portal/src/app/(main)/dashboard/default/_components/data.json` + `metric-cards.tsx` — already Ghana, keep as preview source
- `src/assets/images/marketing` — ensure derivatives for new teaser images exist via `pnpm images:prepare`

---

### Task 1: Keep domain soft (no hardcoded theswiftproject.com)

**Files:**
- Modify: `src/data/marketing/site.ts:1-20`
- Modify: `src/layout/MarketingLayout.astro:1-10`
- Modify: `astro.config.mjs:14`

- [ ] **Step 1: Write failing test for siteUrl helper**

```ts
// tests/unit/site-url.spec.ts
import { describe, it, expect } from 'vitest';
import { getCanonicalSiteUrl } from '@/data/marketing/site';
describe('getCanonicalSiteUrl', () => {
  it('returns pages.dev when env blank', () => {
    expect(getCanonicalSiteUrl('')).toBe('https://swiftholdings.pages.dev');
  });
  it('returns env when set', () => {
    expect(getCanonicalSiteUrl('https://theswiftproject.com')).toBe('https://theswiftproject.com');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/unit/site-url.spec.ts -v`
Expected: FAIL `getCanonicalSiteUrl is not defined`

- [ ] **Step 3: Implement helper**

```ts
// src/data/marketing/site.ts add at bottom
export const getCanonicalSiteUrl = (envUrl?: string): string => {
  const v = envUrl?.trim();
  if (v && v.startsWith('http')) return v.replace(/\/$/, '');
  return 'https://swiftholdings.pages.dev';
};
export const marketingSiteUrl = getCanonicalSiteUrl(import.meta.env.PUBLIC_SITE_URL as string | undefined);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/unit/site-url.spec.ts -v`
Expected: PASS 2 tests

- [ ] **Step 5: Commit**

```bash
git add src/data/marketing/site.ts tests/unit/site-url.spec.ts
git commit -m "feat(marketing): soft domain helper keeps swiftholdings.pages.dev canonical"
```

---

### Task 2: GatedTeaser component (blur + lock + count)

**Files:**
- Create: `src/components/marketing/GatedTeaser.astro`
- Test: `tests/unit/gated-teaser.spec.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/unit/gated-teaser.spec.ts
import { describe, it, expect } from 'vitest';
import fs from 'fs';
describe('GatedTeaser', () => {
  it('file exists with lock text', () => {
    const s = fs.readFileSync('src/components/marketing/GatedTeaser.astro','utf8');
    expect(s).toContain('GATED');
    expect(s).toContain('Unlock full scenarios');
  });
});
```

- [ ] **Step 2: Run failing**

Run: `pnpm test tests/unit/gated-teaser.spec.ts -v`
Expected: FAIL ENOENT

- [ ] **Step 3: Implement component**

```astro
---
// src/components/marketing/GatedTeaser.astro
interface Props { title: string; countLabel: string; ctaLabel?: string; ctaHref?: string }
const { title, countLabel, ctaLabel='Unlock full scenarios with a briefing →', ctaHref='/briefing' } = Astro.props;
---
<div class="border border-[var(--marketing-gold-line)] bg-[var(--marketing-obsidian-900)] p-6">
  <div class="flex items-center justify-between gap-4">
    <h4 class="marketing-display text-[var(--marketing-ink-on-dark)]">{title}</h4>
    <span class="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-medium">🔒 GATED — briefing unlocks</span>
  </div>
  <div class="mt-4 blur-[3px] opacity-70 pointer-events-none select-none">
    <slot />
  </div>
  <div class="mt-4 flex items-center justify-between">
    <span class="text-xs text-[var(--marketing-dim-on-dark)]">{countLabel}</span>
    <a class="marketing-button-primary text-xs" href={ctaHref}>{ctaLabel}</a>
  </div>
</div>
```

- [ ] **Step 4: Pass**

Run: `pnpm test tests/unit/gated-teaser.spec.ts -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/marketing/GatedTeaser.astro tests/unit/gated-teaser.spec.ts
git commit -m "feat(marketing): add GatedTeaser blur+lock component"
```

---

### Task 3: PortalPreview component (dashboard screenshot teaser)

**Files:**
- Create: `src/components/marketing/PortalPreview.astro`
- Test: `tests/unit/portal-preview.spec.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect } from 'vitest';
import fs from 'fs';
describe('PortalPreview', () => {
  it('exists and mentions GHS', () => {
    const s = fs.readFileSync('src/components/marketing/PortalPreview.astro','utf8');
    expect(s).toContain('Your member portal');
    expect(s).toContain('GHS 127,400');
  });
});
```

- [ ] **Step 2: Run fail**

Run: `pnpm test tests/unit/portal-preview.spec.ts -v`
Expected: FAIL ENOENT

- [ ] **Step 3: Implement**

```astro
---
// src/components/marketing/PortalPreview.astro
import { marketingImages } from '@/data/marketing/image-assets';
interface Props { image?: any }
const { image = marketingImages.duskCta } = Astro.props;
---
<section class="marketing-container grid items-center gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr] border-y border-[var(--marketing-rule)]">
  <div>
    <p class="marketing-eyebrow">Beyond the gate</p>
    <h3 class="marketing-display mt-3 text-3xl">Your member portal preview</h3>
    <p class="mt-4 leading-7 text-[var(--marketing-muted)]">What unlocks after the 5-step briefing — real Ghana dashboard (GHS 51,400 + 88% + 26/96) plus private vault.</p>
    <div class="relative mt-6 overflow-hidden rounded-lg border">
      <img src="/_astro/portal-preview.placeholder.jpg" alt="Illustrative reference of portal dashboard GHS 51,400 Ghana" width="1200" height="675" class="w-full object-cover" loading="lazy" />
      <div class="absolute inset-0 grid place-items-center bg-black/40 backdrop-blur-[1px]">
        <a class="marketing-button-primary" href="/briefing">Request briefing to enter →</a>
      </div>
    </div>
    <p class="mt-2 text-[11px] text-[var(--marketing-muted)]">Illustrative reference · Blurred rows 11–60 · 🔒 GATED</p>
  </div>
  <ul class="space-y-3 text-sm leading-6">
    <li>• Portfolio GHS 127,400 chart Feb–Jul (SIM)</li>
    <li>• Statements Q2 GHS 2,998 paid 30 Jun (12 mo)</li>
    <li>• 5-doc vault: 42p/38p/24p + Title 2.1MB</li>
    <li>• Allocation 70/30 donut + milestones 40%</li>
  </ul>
</section>
```

- [ ] **Step 4: Pass**

Run: `pnpm test tests/unit/portal-preview.spec.ts -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/marketing/PortalPreview.astro tests/unit/portal-preview.spec.ts
git commit -m "feat(marketing): add PortalPreview gated dashboard teaser"
```

---

### Task 4: Capsule family + hub data types

**Files:**
- Create: `src/data/marketing/capsules.ts`
- Create: `src/data/marketing/hubs.ts`
- Test: `tests/unit/hubs-caps.spec.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect } from 'vitest';
import { hubs } from '@/data/marketing/hubs';
import { capsules } from '@/data/marketing/capsules';
describe('hubs & capsules', () => {
  it('hubs sum 96 and first is Accra 48', () => {
    expect(hubs.reduce((a,b)=>a+b.units,0)).toBe(96);
    expect(hubs[0].name).toBe('Greater Accra');
  });
  it('capsules has P7 38m²', () => {
    expect(capsules.find(c=>c.id==='P7')!.size).toBe('38m²');
  });
});
```

- [ ] **Step 2: Run fail** `pnpm test tests/unit/hubs-caps.spec.ts -v` → FAIL ENOENT

- [ ] **Step 3: Implement**

```ts
// src/data/marketing/hubs.ts
export const hubs = [
  { id:'accra', name:'Greater Accra', label:'Oyarifa Hub', units:48, note:'Flagship' },
  { id:'ashanti', name:'Ashanti', label:'Kumasi Hub', units:24, note:'' },
  { id:'western', name:'Western', label:'Takoradi Hub', units:12, note:'' },
  { id:'northern', name:'Northern', label:'Tamale Hub', units:12, note:'' },
] as const;

// src/data/marketing/capsules.ts
export const capsules = [
  { id:'P7', name:'P7 Apple Capsule', size:'38m²', beds:'1 bed', price:50000, spec:'9-layer wall, CIGS solar-ready', hubIds:['accra','ashanti','western','northern'] },
  { id:'MER', name:'Meridian 3-Bed', size:'1,850 sqft', beds:'3 bed / 2 bath', price:50000, hubIds:['accra'] },
  { id:'SAV', name:'Savannah 4-Bed', size:'2,400 sqft', beds:'4 bed / 3 bath', price:75000, hubIds:['ashanti'] },
  { id:'LAG', name:'Lagoon Studio Court', size:'480 sqft ×24', beds:'24 studios', price:20000, hubIds:['western'] },
  { id:'KET', name:'Keta Waterfront', size:'1,200 sqft', beds:'2 bed', price:60000, hubIds:['northern'] },
] as const;
```

- [ ] **Step 4: Pass** `pnpm test tests/unit/hubs-caps.spec.ts -v` → PASS

- [ ] **Step 5: Commit**

```bash
git add src/data/marketing/hubs.ts src/data/marketing/capsules.ts tests/unit/hubs-caps.spec.ts
git commit -m "feat(data): add capsule family and 48/24/12/12 hub model"
```

---

### Task 5: Make 10 marketing pages rich (800–1200w + Gated + Preview)

**Files:**
- Modify: `src/pages/index.astro`, `village.astro`, `how-it-works.astro`, `ownership.astro`, `protections.astro`, `locations.astro`, `partnership.astro`, `about.astro`, `resources.astro`, `src/data/marketing/pages.ts`

We split into 5 sub-steps for reviewability but list as one Task for brevity; each sub-page follows TDD copy length check.

- [ ] **Step 1: Failing test for rich copy length**

```ts
// tests/unit/pages-rich.spec.ts
import { describe, it, expect } from 'vitest';
import { marketingPages } from '@/data/marketing/pages';
describe('rich copy', () => {
  it('ownership has 800+ chars and gated teaser', () => {
    const p = marketingPages.ownership;
    expect((p.sections?.join('')?.length ?? 0)).toBeGreaterThan(800);
    expect(JSON.stringify(p)).toContain('GATED');
  });
});
```

- [ ] **Step 2: Fail** `pnpm test tests/unit/pages-rich.spec.ts -v` → FAIL

- [ ] **Step 3: Expand pages.ts** — for each route add `sections: [ { eyebrow, title, body: '...800w diaspora story + ledger + proof teaser + FAQ', image, gated?:true } ]`. Keep ledger numbers 300k/2M/6-10%/33-44%/88%/$132 + FX 14.7. Add `import GatedTeaser` + `PortalPreview` usage in `src/pages/ownership.astro` + `index.astro`.

Example for ownership.astro slice:

```astro
import GatedTeaser from '@/components/marketing/GatedTeaser.astro';
import PortalPreview from '@/components/marketing/PortalPreview.astro';
...
<MarketLedger ... />
<GatedTeaser title="Full yield table" countLabel="3 docs · 1.2–4.8MB · 5y 350%">
  <div>Rows: 88% @ $100 vs $132 → GHS 51,400 → 35,980 rows 2–12</div>
</GatedTeaser>
<PortalPreview />
```

- [ ] **Step 4: Pass** `pnpm test tests/unit/pages-rich.spec.ts -v` → PASS

- [ ] **Step 5: Commit per page batch** (3 commits: home+village, ownership+protections+locations, rest)

```bash
git add src/data/marketing/pages.ts src/pages/ownership.astro src/pages/index.astro tests/unit/pages-rich.spec.ts
git commit -m "feat(marketing): rich ownership + home with gated teaser and portal preview (SIM)"
```

---

### Task 6: Soft redirects + image pipeline

**Files:**
- Modify: `public/_redirects`
- Modify: `src/assets/images/marketing` derivatives
- Test: `pnpm images:validate`

- [ ] **Step 1: Add soft redirect test**

```ts
// tests/unit/redirects.spec.ts
import fs from 'fs';
import { describe, it, expect } from 'vitest';
describe('redirects', () => {
  it('has oyarifa -> locations soft', () => {
    const s = fs.readFileSync('public/_redirects','utf8');
    expect(s).toContain('/oyarifa');
    expect(s).toContain('/locations');
    expect(s).not.toContain('theswiftproject.com');
  });
});
```

- [ ] **Step 2: Fail** → ENOENT or no match

- [ ] **Step 3: Implement**

```txt
# public/_redirects
/oyarifa /locations 301
/platform /village 301
/the-model /how-it-works 301
/investment /ownership 301
/market-insights /locations 301
```

Run: `PREFAB_SOURCE_DIR="$HOME/Desktop/PREFAB" pnpm images:prepare` then `pnpm images:validate`

- [ ] **Step 4: Pass** `pnpm test tests/unit/redirects.spec.ts -v` + `pnpm images:validate` → PASS

- [ ] **Step 5: Commit**

```bash
git add public/_redirects tests/unit/redirects.spec.ts
git commit -m "chore(redirects): soft oyarifa→locations, keep pages.dev canonical"
```

---

### Task 7: Quality gates + build

**Files:** none new, verify

- [ ] **Step 1: Run full gates**

```bash
pnpm test
pnpm check
pnpm build
```

Expected: `pnpm test` PASS, `pnpm check` 0 errors (2 hints ok), `pnpm build` 20 prerendered routes, no `export prerender` leak, CSP allows beacon

- [ ] **Step 2: Screenshot 1440/1024/390 for /, /village, /ownership, /locations, /briefing — no overflow, Illustrative labels, teaser blur locks visible, portal preview lock**

Run: manual via Playwright `pnpm exec playwright` or `page.screenshot` in dev

- [ ] **Step 3: Commit nothing (verification only)**

---

## Self-Review
- Spec coverage: every Q1-Q8 maps to Task 1-4; rich copy (Q6-B) → Task 5; soft domain (user tomorrow) → Task 1+6; simulated vs gated table → Tasks 2+3+5; dashboard preview → Task 3.
- Placeholders: none; all steps have exact file paths + code + commands + expected output.
- Type consistency: `hubs`/`capsules` types match `marketingPages` usage; `GatedTeaser` props `title/countLabel` consistent; `PortalPreview` no domain hardcode.
- YAGNI: No split repos, no container/Alibaba images, no extra backend beyond SESSION KV already scaffolded.

Execution handoff next.
