# The Swift Project — Homepage Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the public homepage to the approved Copy Constitution (spec: `docs/superpowers/specs/2026-08-21-the-swift-project-copy-constitution-design.md`) — locked copy, four-hub framing, brand migration to THE SWIFT PROJECT with Swift Holdings reduced to one legal footer line — with zero visual/design change to existing components.

**Architecture:** Data-first TDD: a new guard test locks the approved copy verbatim and bans jargon before any source changes. Then data files (`site.ts`, `pages.ts`, `locations.ts`) are corrected, the homepage (`index.astro`) is recomposed into the approved 12-section architecture using ONLY existing components/classes, and site chrome (footer, 404) is de-branded. Every task ends green and committed.

**Tech Stack:** Astro + TypeScript, Vitest, Tailwind v4 utilities with `--marketing-*` CSS tokens, pnpm. Node v22 via nvm for `astro check`/build (`pnpm dev` is blocked on this Mac — workerd needs macOS 13.5+).

**Scope decisions already made (do not relitigate):**
- Hero component (`MarketingHero`) is UNTOUCHED — it renders new words from `pages.ts` inside the existing design.
- `PortalPreview` and the 88% stat chip leave the HOMEPAGE only (both remain on `/ownership`, `/resources`, `/locations`).
- Global jargon bans stay scoped to a NEW home-guard test because `pages-rich.test.ts` requires `'GATED'` in the ownership entry and other pages still carry legacy strings until pass 2. Do NOT add these bans to `no-forbidden-strings.test.ts` yet.
- Legacy blueprint pages (`contact`, `investment`, `market-insights`, `the-model`, old `sections/Footer.astro`) are out of scope (pass 2 cleanup).
- Emails/domains unchanged. No layout/CSS file edits.

---

### Task 1: Guard test (write first, watch it fail)

**Files:**
- Create: `src/data/marketing/home-copy-guard.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { marketingPages } from './pages';
import { marketingSite } from './site';
import { swiftHubs } from './locations';

const readSrc = (rel: string): string =>
  readFileSync(new URL(rel, import.meta.url), 'utf8');

describe('homepage copy constitution', () => {
  const home = JSON.stringify(marketingPages.home);

  it('locks the approved hero verbatim', () => {
    expect(marketingPages.home.hero.eyebrow).toBe('THE SWIFT PROJECT · GHANA');
    expect(marketingPages.home.hero.title).toBe(
      "Own your place in Ghana. Let it work while you're away.",
    );
    expect(marketingPages.home.hero.lead.startsWith('Fully finished modular residences')).toBe(true);
  });

  it('keeps internal jargon and leaks off the homepage', () => {
    for (const banned of [
      'membership ecosystem',
      'GATED',
      'absolute certainty',
      'PBKDF2',
      'securemensah.workers.dev',
      'recorded',
    ]) {
      expect(home).not.toContain(banned);
    }
  });

  it('reduces Swift Holdings to the legal line', () => {
    expect(home).not.toContain('Swift Holdings');
    expect(marketingSite.name).toBe('THE SWIFT PROJECT');
    expect(marketingSite.legalName).toBe('Swift Holdings');
  });

  it('presents Stay / Own / Partner instead of tier jargon', () => {
    expect(marketingSite.tiers.map(tier => tier.name)).toEqual(['Stay', 'Own', 'Partner']);
    expect(marketingSite.tiers.map(tier => tier.cta.href)).toEqual([
      '/village',
      '/ownership',
      '/partnership',
    ]);
  });

  it('standardizes the four-hub network counts', () => {
    expect(swiftHubs.map(hub => hub.capsules)).toEqual([48, 24, 12, 12]);
  });

  it('scrubs the brand name from chrome except the legal line', () => {
    const footer = readSrc('../../components/marketing/SiteFooter.astro');
    expect(footer).toContain('THE SWIFT PROJECT');
    expect(footer).not.toContain('SWIFT HOLDINGS');
    expect(footer.match(/Operated by Swift Holdings/g)).toHaveLength(1);
    const notFound = readSrc('../../pages/404.astro');
    expect(notFound).not.toContain('Swift Holdings');
  });

  it('drops the 88% target and portal preview from the homepage', () => {
    const indexPage = readSrc('../../pages/index.astro');
    expect(indexPage).not.toContain('88%');
    expect(indexPage).not.toContain('PortalPreview');
    expect(indexPage).toContain('One standard. Four hubs.');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/data/marketing/home-copy-guard.test.ts`
Expected: FAIL — hero verbatim mismatch, tier names mismatch, hub counts `[42, 24, 18, 12]`, footer/404/index assertions failing. (If any assertion unexpectedly passes, note it and continue.)

- [ ] **Step 3: Leave the test red — no commit yet**

The next task turns it green. Do not commit a red suite.

---

### Task 2: Data layer — brand constants, locked homepage copy, hub counts

**Files:**
- Modify: `src/data/marketing/site.ts`
- Modify: `src/data/marketing/pages.ts` (home entry lines 22–41; about lead line 159; about sections lines 163–165)
- Modify: `src/data/marketing/locations.ts` (capsules 42→48, 18→12; Oyarifa role)

- [ ] **Step 1: Update `site.ts`**

Replace the `name` value and the whole `tiers` array; update `primaryCta` label. Resulting relevant blocks:

```ts
export const marketingSite = {
  name: 'THE SWIFT PROJECT',
  legalName: 'Swift Holdings',
  email: 'info@swiftholdings.org',
  partnershipsEmail: 'partnerships@swiftholdings-ghana.com',
  phone: '+233 544 101016',
  phoneNorthAmerica: '+1 437 421 0963',
  address: '20 Edmonton St, Madina, Accra',
  primaryCta: { label: 'Request a private briefing', href: '/briefing' },
  navigation: [
    { href: '/village', label: 'The Village' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/ownership', label: 'Ownership & Financials' },
    { href: '/protections', label: 'Protections' },
    { href: '/locations', label: 'Locations' },
    { href: '/partnership', label: 'Partnership' },
    { href: '/about', label: 'About' },
    { href: '/resources', label: 'Resources' },
  ],
  tiers: [
    {
      name: 'Stay',
      summary:
        'Book a visit. Feel the village before you decide anything.',
      cta: { label: 'Explore stays', href: '/village' },
    },
    {
      name: 'Own',
      summary:
        'Explore ownership — the residence, the operation, the numbers.',
      cta: { label: 'See ownership', href: '/ownership' },
    },
    {
      name: 'Partner',
      summary:
        'Bring land, capital, or operations. Build a hub with us.',
      cta: { label: 'Explore partnership', href: '/partnership' },
    },
  ],
} as const;
```

(`getCanonicalSiteUrl` / `marketingSiteUrl` below stay exactly as they are.)

- [ ] **Step 2: Rewrite the `home` entry in `pages.ts`**

Replace the entire `home: { ... }` block (currently lines 22–41) with:

```ts
  home: {
    seo: {
      title:
        "The Swift Project | Own your place in Ghana. Let it work while you're away.",
      description:
        "Fully finished modular residences inside professionally managed hospitality villages across Accra, Kumasi, Tamale, and Takoradi. Yours when you're home. Productive when you're not.",
    },
    hero: {
      eyebrow: 'THE SWIFT PROJECT · GHANA',
      title: "Own your place in Ghana. Let it work while you're away.",
      lead: "Fully finished modular residences inside professionally managed hospitality villages. Yours when you're home. Productive when you're not.",
    },
    secondaryCta: { label: 'See how ownership works', href: '/how-it-works' },
    sections: [
      "You wanted a place in Ghana. Not another construction project to manage from abroad. The land. The contractor. The materials. The delays. The revised material list that arrives after you've paid. The calls across time zones. The trip home just to check what is going on. For too many of us abroad, the dream became a remote job with no salary. We built The Swift Project around a different question: what if you could own the finished place — without personally managing everything it takes to build and run it?",
      "Yours when you're home. Productive when you're not. When you're in Ghana: come home to your own fully furnished residence. Reserve your dates — December, family weeks, remote-work months. Your clothes stay in the wardrobe. Your things stay where you left them. When you're away: your residence joins the village's managed hospitality operation. Guests, pricing, housekeeping, maintenance — handled by our on-ground team. You don't have to choose between a place for yourself and an asset that works. It does both.",
      'The P7 Capsule — thirty-eight square metres, considered down to the last one. Full-height glazing that opens the room to the trees. Warm timber inside. A private deck for morning coffee. Engineered as a complete product — structure, insulation, services, furniture — finished before it ever reaches your plot: nine-layer wall system, solar-ready roof, integrated services, turnkey furnishing.',
      'Your residence is private. The life around it is shared. A pool for slow afternoons. Fire-side evenings in December. Long tables under the pavilion. Children in the shallows while you finish your coffee. Places to be alone; places to host everyone you love. Not a row of prefabs. A village.',
      'Most of the building happens before the building arrives. Cost control: factory production removes the site surprises that inflate budgets. Parallel timelines: site preparation and home construction happen at once, not in sequence. Repeatable quality: every capsule built to the same standard, by the same team, with the same checks. Faster to first stay: months, not years, between decision and your first night home.',
      "You own the asset. We run the experience around it. While you're away, the village operates as a hospitality business — and your residence is part of it. Distribution and booking across the channels guests actually use. Dynamic pricing tuned to season and demand. Guest operations handled on the ground, not from abroad. Housekeeping, linen, and preventive maintenance. An owner portal with bookings, statements, and your own reservations — visible anytime. So ownership never becomes another full-time job.",
      "Don't take our word for it. Before you decide anything, you'll understand: exactly what you acquire — and the rights that come with it; what the operator manages, and what stays yours; how revenue and costs are treated, line by line; the assumptions behind every projection we show you; what happens if you want to exit. Clarity first. Decision second.",
      "We'd rather show you the assumptions than sell you the outcome. Ghana's short-let market runs at roughly 33–44% occupancy. Our model is built on documented assumptions — base case, stronger case, downside case — that you'll examine line by line in your briefing. No headline ROI theatre. No promises we can't defend.",
      'One standard. Four hubs. The Swift Project is a national network of hospitality villages, built to one standard. Four hubs anchor the map: Oyarifa · Accra — flagship village, where the network begins; Kumasi · Ashanti; Tamale · Northern; Takoradi · Western. 48, 24, 12, and 12 capsules respectively — 96 across the network. Same capsule. Same share. Same standard. Wherever you land.',
      "Maybe home doesn't have to mean choosing one country over another. A key that is yours. A room that remembers you. Your children growing up with somewhere in Ghana that is theirs — not a hotel, not a relative's spare room. December means something again. \"We're going home.\" And meaning it.",
      'Stay. Own. Partner. Book a visit and feel the village before you decide anything. Explore ownership — the residence, the operation, the numbers. Or bring land, capital, or operations and build a hub with us.',
    ],
  },
```

- [ ] **Step 3: Touch up the `about` entry in `pages.ts` (name/jargon only — full rewrite is pass 2)**

Line 159 `lead` becomes:

```ts
      lead: 'The Swift Project designs, builds, and operates hospitality villages for the diaspora returning home — and for Ghanaians building at home. 20 Edmonton St, Madina, Accra.',
```

In `sections[0]` (line 163), replace the opening `Pioneering West African real estate: Swift Holdings integrates` with `Pioneering West African real estate: The Swift Project integrates`. Change nothing else in that string.

In `sections[2]` (line 165), replace everything after `partnerships@swiftholdings-ghana.com.` — i.e. delete ` Legal entity now THE SWIFT PROJECT (Full rebrand per Q1-A) — parent Swift Holdings retired from marketing, retained only as historical legal until MX cutover.` The string ends at the email.

- [ ] **Step 4: Fix hub counts in `locations.ts`**

Oyarifa: `capsules: 42` → `capsules: 48`, and `role: 'Flagship village — first capsule site'` → `role: 'Flagship village — where the network begins'`.
Tamale: `capsules: 18` → `capsules: 12`.
Kumasi and Takoradi rows unchanged. `marketStatistics` unchanged (88% removal there is a pass-2 /locations decision).

- [ ] **Step 5: Run the guard test and the neighboring suites**

Run: `pnpm vitest run src/data/marketing/home-copy-guard.test.ts src/data/marketing/locations.test.ts src/data/marketing/pages-rich.test.ts src/data/marketing/no-forbidden-strings.test.ts src/data/marketing/hubs-caps.test.ts`
Expected: ALL PASS. (`pages-rich` still finds `'GATED'` in the untouched ownership entry; `no-forbidden-strings` still finds `'70'`/`'$50,000'` in untouched entries.)

- [ ] **Step 6: Commit**

```bash
git add src/data/marketing/site.ts src/data/marketing/pages.ts src/data/marketing/locations.ts src/data/marketing/home-copy-guard.test.ts
git commit -m "feat(copy): lock homepage constitution, Stay/Own/Partner tiers, canonical hub counts"
```

---

### Task 3: Recompose the homepage (below-hero sections only)

**Files:**
- Modify: `src/pages/index.astro` (full below-hero recomposition; hero block untouched)

- [ ] **Step 1: Replace `index.astro` with the composed page**

Keep the existing frontmatter imports minus `PortalPreview` and `StorySplit`/`MarketLedger`, add `swiftHubs`. Full file:

```astro
---
export const prerender = true;

import ImageFrame from '@/components/marketing/ImageFrame.astro';
import MarketingHero from '@/components/marketing/MarketingHero.astro';
import { marketingImages } from '@/data/marketing/image-assets';
import { marketingPages } from '@/data/marketing/pages';
import { marketingSite } from '@/data/marketing/site';
import { swiftHubs } from '@/data/marketing/locations';
import MarketingLayout from '@layout/MarketingLayout.astro';

const page = marketingPages.home;

const modularAdvantages = [
  { n: '01', title: 'Cost control', body: 'Factory production removes the site surprises that inflate budgets.' },
  { n: '02', title: 'Parallel timelines', body: 'Site preparation and home construction happen at once, not in sequence.' },
  { n: '03', title: 'Repeatable quality', body: 'Every capsule built to the same standard, by the same team, with the same checks.' },
  { n: '04', title: 'Faster to first stay', body: 'Months, not years, between decision and your first night home.' },
];

const operatorRows = [
  { title: 'Distribution & booking', body: 'Your residence listed across the channels guests actually use.' },
  { title: 'Dynamic pricing', body: 'Rates tuned to season and demand, so the calendar earns its keep.' },
  { title: 'Guest operations', body: 'Check-in, support, standards — handled on the ground, not from abroad.' },
  { title: 'Housekeeping & maintenance', body: 'Turnovers, linen, preventive care. The unglamorous work, done.' },
  { title: 'Owner portal', body: 'Bookings, statements, and your own reservations — visible anytime.' },
];

const clarityPoints = [
  'Exactly what you acquire — and the rights that come with it',
  'What the operator manages, and what stays yours',
  'How revenue and costs are treated, line by line',
  'The assumptions behind every projection we show you',
  'What happens if you want to exit',
];

const capsuleChips = [
  'Full-height glazing',
  'Private composite deck',
  'Nine-layer wall system',
  'Solar-ready roof',
  'Integrated services',
  'Turnkey furnishing',
];
---

<MarketingLayout seo={page.seo} headerTheme="dark">
  <MarketingHero
    {...page.hero}
    secondaryCta={page.secondaryCta}
    image={marketingImages.villageBanner}
    ratio="4 / 3"
  />

  <section class="marketing-container py-16 lg:py-24">
    <p class="marketing-eyebrow">Owning back home shouldn't become a second job</p>
    <h2 class="marketing-display mt-3 max-w-3xl text-4xl leading-[1.08] text-[var(--marketing-ink)]">
      You wanted a place in Ghana. Not another construction project to manage from abroad.
    </h2>
    <p class="mt-6 max-w-2xl leading-7 text-[var(--marketing-muted)]">
      The land. The contractor. The materials. The delays. The revised material
      list that arrives after you've paid. The calls across time zones. The trip
      home just to check what is going on.
    </p>
    <p class="mt-4 max-w-2xl leading-7 text-[var(--marketing-muted)]">
      For too many of us abroad, the dream became a remote job with no salary.
    </p>
    <p class="marketing-display mt-8 max-w-2xl text-2xl italic leading-snug text-[var(--marketing-ink)]">
      We built The Swift Project around a different question:
      <span class="text-[var(--marketing-gold-500)]">
        what if you could own the finished place — without personally managing
        everything it takes to build and run it?
      </span>
    </p>
  </section>

  <section class="marketing-surface-dark">
    <div class="marketing-container py-16 lg:py-24">
      <h2 class="marketing-display max-w-3xl text-4xl leading-[1.08] text-[var(--marketing-ink-on-dark)]">
        Yours when you're home.<br />Productive when you're not.
      </h2>
      <div class="mt-10 grid gap-px border border-[var(--marketing-gold-line)] bg-[var(--marketing-gold-line)] lg:grid-cols-2">
        <article class="bg-[var(--marketing-obsidian-900)] p-8 text-[var(--marketing-ink-on-dark)] lg:p-10">
          <p class="marketing-ledger-label">When you're in Ghana</p>
          <p class="mt-4 text-sm leading-6 text-[var(--marketing-dim-on-dark)]">
            Come home to your own fully furnished residence. Reserve your dates
            — December, family weeks, remote-work months. Your clothes stay in
            the wardrobe. Your things stay where you left them.
          </p>
        </article>
        <article class="bg-[var(--marketing-obsidian-900)] p-8 text-[var(--marketing-ink-on-dark)] lg:p-10">
          <p class="marketing-ledger-label">When you're away</p>
          <p class="mt-4 text-sm leading-6 text-[var(--marketing-dim-on-dark)]">
            Your residence joins the village's managed hospitality operation.
            Guests, pricing, housekeeping, maintenance — handled by our
            on-ground team.
          </p>
        </article>
      </div>
      <p class="marketing-display mt-8 max-w-2xl text-2xl italic leading-snug text-[var(--marketing-ink-on-dark)]">
        You don't have to choose between a place for yourself and an asset that works. It does both.
      </p>
    </div>
  </section>

  <section class="marketing-container py-16 lg:py-24">
    <p class="marketing-eyebrow">The P7 Capsule</p>
    <h2 class="marketing-display mt-3 max-w-3xl text-4xl leading-[1.08] text-[var(--marketing-ink)]">
      Thirty-eight square metres, considered down to the last one.
    </h2>
    <p class="mt-6 max-w-2xl leading-7 text-[var(--marketing-muted)]">
      Full-height glazing that opens the room to the trees. Warm timber inside.
      A private deck for morning coffee. Engineered as a complete product —
      structure, insulation, services, furniture — finished before it ever
      reaches your plot.
    </p>
    <ul class="mt-8 flex flex-wrap gap-3">
      {
        capsuleChips.map(chip => (
          <li class="rounded-full border border-[var(--marketing-rule)] px-4 py-2 text-xs tracking-wide text-[var(--marketing-muted)]">
            {chip}
          </li>
        ))
      }
    </ul>
  </section>

  <section class="marketing-surface-dark">
    <div class="marketing-container grid items-center gap-10 py-16 lg:grid-cols-[1fr_0.9fr] lg:py-20">
      <div>
        <p class="marketing-eyebrow">The village</p>
        <h2 class="marketing-display mt-3 max-w-lg text-4xl leading-[1.08] text-[var(--marketing-ink-on-dark)]">
          Your residence is private. The life around it is shared.
        </h2>
        <p class="mt-4 max-w-lg leading-7 text-[var(--marketing-dim-on-dark)]">
          A pool for slow afternoons. Fire-side evenings in December. Long
          tables under the pavilion. Children in the shallows while you finish
          your coffee. Places to be alone; places to host everyone you love.
        </p>
        <p class="marketing-display mt-6 text-2xl italic text-[var(--marketing-gold-500)]">
          Not a row of prefabs. A village.
        </p>
      </div>
      <ImageFrame image={marketingImages.villageBanner} ratio="3 / 2" />
    </div>
  </section>

  <section class="marketing-container py-16 lg:py-24">
    <p class="marketing-eyebrow">Why modular</p>
    <h2 class="marketing-display mt-3 max-w-3xl text-4xl leading-[1.08] text-[var(--marketing-ink)]">
      Most of the building happens before the building arrives.
    </h2>
    <div class="mt-10 grid gap-px border border-[var(--marketing-gold-line)] bg-[var(--marketing-gold-line)] sm:grid-cols-2">
      {
        modularAdvantages.map(item => (
          <article class="bg-[var(--marketing-canvas)] p-8">
            <p class="marketing-ledger-label">{item.n}</p>
            <h3 class="marketing-display mt-3 text-2xl text-[var(--marketing-ink)]">{item.title}</h3>
            <p class="mt-3 text-sm leading-6 text-[var(--marketing-muted)]">{item.body}</p>
          </article>
        ))
      }
    </div>
  </section>

  <section class="marketing-container pb-16 lg:pb-24">
    <h2 class="marketing-display max-w-3xl text-4xl leading-[1.08] text-[var(--marketing-ink)]">
      You own the asset. We run the experience around it.
    </h2>
    <p class="mt-5 max-w-2xl leading-7 text-[var(--marketing-muted)]">
      While you're away, the village operates as a hospitality business — and
      your residence is part of it.
    </p>
    <div class="mt-8 divide-y divide-[var(--marketing-rule)] border-y border-[var(--marketing-rule)]">
      {
        operatorRows.map(row => (
          <div class="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-8">
            <h3 class="min-w-64 text-sm font-semibold tracking-wide text-[var(--marketing-ink)]">{row.title}</h3>
            <p class="text-sm leading-6 text-[var(--marketing-muted)]">{row.body}</p>
          </div>
        ))
      }
    </div>
    <p class="marketing-display mt-8 text-2xl italic text-[var(--marketing-ink)]">
      So ownership never becomes another full-time job.
    </p>
  </section>

  <section class="marketing-container pb-16 lg:pb-24">
    <h2 class="marketing-display max-w-3xl text-4xl leading-[1.08] text-[var(--marketing-ink)]">
      Don't take our word for it.
    </h2>
    <p class="mt-5 max-w-2xl leading-7 text-[var(--marketing-muted)]">
      Before you decide anything, you'll understand:
    </p>
    <ol class="mt-6 max-w-3xl">
      {
        clarityPoints.map((point, index) => (
          <li class="flex items-baseline gap-5 border-b border-[var(--marketing-rule)] py-4">
            <span class="marketing-ledger-label">{String(index + 1).padStart(2, '0')}</span>
            <span class="text-sm leading-6 text-[var(--marketing-muted)]">{point}</span>
          </li>
        ))
      }
    </ol>
    <p class="marketing-display mt-8 text-2xl italic text-[var(--marketing-ink)]">
      Clarity first. Decision second.
    </p>
  </section>

  <section class="marketing-container pb-16 lg:pb-24">
    <h2 class="marketing-display max-w-3xl text-4xl leading-[1.08] text-[var(--marketing-ink)]">
      We'd rather show you the assumptions than sell you the outcome.
    </h2>
    <p class="mt-6 max-w-2xl leading-7 text-[var(--marketing-muted)]">
      Ghana's short-let market runs at roughly 33–44% occupancy. Our model is
      built on documented assumptions — base case, stronger case, downside case
      — that you'll examine line by line in your briefing.
    </p>
    <p class="mt-4 max-w-2xl leading-7 text-[var(--marketing-muted)]">
      No headline ROI theatre. No promises we can't defend.
    </p>
    <a class="marketing-button-link mt-7" href="/briefing">Request the numbers</a>
  </section>

  <section class="marketing-container pb-16 lg:pb-24">
    <p class="marketing-eyebrow">One standard, four hubs</p>
    <h2 class="marketing-display mt-3 max-w-3xl text-4xl leading-[1.08] text-[var(--marketing-ink)]">
      One standard. Four hubs.
    </h2>
    <p class="mt-5 max-w-2xl leading-7 text-[var(--marketing-muted)]">
      The Swift Project is a national network of hospitality villages, built to
      one standard. Four hubs anchor the map:
    </p>
    <div class="mt-8 divide-y divide-[var(--marketing-rule)] border-y border-[var(--marketing-rule)]">
      {
        swiftHubs.map(hub => (
          <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5">
            <p class="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--marketing-ink)]">
              {hub.city} · {hub.region}
            </p>
            <p class="text-sm italic text-[var(--marketing-muted)]">{hub.role}</p>
            <p class="ml-auto text-sm tabular-nums text-[var(--marketing-muted)]">{hub.capsules} capsules</p>
          </div>
        ))
      }
    </div>
    <p class="mt-4 text-sm text-[var(--marketing-muted)]">96 capsules across the network.</p>
    <p class="marketing-display mt-6 text-2xl italic text-[var(--marketing-ink)]">
      Same capsule. Same share. Same standard. Wherever you land.
    </p>
  </section>

  <section class="marketing-surface-dark">
    <div class="marketing-container py-16 text-center lg:py-24">
      <p class="marketing-eyebrow">For those who live between two places</p>
      <h2 class="marketing-display mx-auto mt-3 max-w-3xl text-4xl leading-[1.08] text-[var(--marketing-ink-on-dark)]">
        Maybe home doesn't have to mean choosing one country over another.
      </h2>
      <p class="mx-auto mt-6 max-w-2xl leading-7 text-[var(--marketing-dim-on-dark)]">
        A key that is yours. A room that remembers you. Your children growing up
        with somewhere in Ghana that is theirs — not a hotel, not a relative's
        spare room.
      </p>
      <p class="mx-auto mt-4 max-w-2xl leading-7 text-[var(--marketing-dim-on-dark)]">
        December means something again.
      </p>
      <p class="marketing-display mx-auto mt-8 max-w-2xl text-2xl italic leading-snug text-[var(--marketing-ink-on-dark)]">
        "We're going home." <span class="text-[var(--marketing-gold-500)]">And meaning it.</span>
      </p>
    </div>
  </section>

  <section class="marketing-container py-16 lg:py-24">
    <p class="marketing-eyebrow">Three ways in</p>
    <h2 class="marketing-display mt-3 max-w-2xl text-4xl leading-[1.08] text-[var(--marketing-ink)]">
      Stay. Own. Partner.
    </h2>
    <div class="mt-10 grid gap-px border border-[var(--marketing-gold-line)] bg-[var(--marketing-gold-line)] lg:grid-cols-3">
      {
        marketingSite.tiers.map((tier, index) => (
          <article class="bg-[var(--marketing-canvas)] p-8 lg:p-10">
            <p class="marketing-ledger-label">{String(index + 1).padStart(2, '0')}</p>
            <h3 class="marketing-display mt-4 text-2xl text-[var(--marketing-ink)]">{tier.name}</h3>
            <p class="mt-3 text-sm leading-6 text-[var(--marketing-muted)]">{tier.summary}</p>
            <a class="marketing-button-link mt-6" href={tier.cta.href}>
              {tier.cta.label}
            </a>
          </article>
        ))
      }
    </div>
  </section>

  <section class="marketing-surface-dark">
    <div class="marketing-container grid items-center gap-10 py-16 lg:grid-cols-[1fr_0.9fr] lg:py-20">
      <ImageFrame image={marketingImages.duskCta} ratio="3 / 2" />
      <div>
        <p class="marketing-eyebrow">Your next step</p>
        <h2 class="marketing-display mt-3 max-w-lg text-4xl leading-[1.08] text-[var(--marketing-ink-on-dark)]">
          You don't need to decide today. You need enough information to decide well.
        </h2>
        <p class="mt-4 max-w-lg leading-7 text-[var(--marketing-dim-on-dark)]">
          No checkout. No countdown timer. No pressure on the call. Just a
          structured conversation about whether this fits the life you're
          building.
        </p>
        <a class="marketing-button-primary mt-7" href="/briefing">
          Request a private briefing
        </a>
      </div>
    </div>
  </section>
</MarketingLayout>
```

- [ ] **Step 2: Verify guard + typecheck**

Run: `pnpm vitest run src/data/marketing/home-copy-guard.test.ts && source ~/.nvm/nvm.sh && nvm use 22 >/dev/null && npx astro check`
Expected: guard PASS; astro check 0 errors (pre-existing 3 hints acceptable).

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(home): recompose homepage to approved 12-section copy architecture"
```

---

### Task 4: Chrome — footer legal line + 404 de-brand

**Files:**
- Modify: `src/components/marketing/SiteFooter.astro` (lines 22, 25–31, 33–35)
- Modify: `src/pages/404.astro` (lines 7, 9, 23)

- [ ] **Step 1: SiteFooter.astro**

Line 22 brand span: `SWIFT HOLDINGS` → `THE SWIFT PROJECT`.

Footer nav (lines 26–30) — dead `/#anchor` links become real routes:

```astro
    <nav class="site-footer-links" aria-label="Footer navigation">
      <a href="/village">The Village</a>
      <a href="/how-it-works">How It Works</a>
      <a href="/locations">Locations</a>
      <a href="/partnership">Partnership</a>
      <a href="/briefing">Request Briefing</a>
    </nav>
```

Copyright (line 34):

```astro
      © {new Date().getFullYear()} The Swift Project · Operated by {marketingSite.legalName}.
```

- [ ] **Step 2: 404.astro**

Read the file, then make three replacements:
- Line 7 title: `'Page not found | Swift Holdings'` → `'Page not found | The Swift Project'`
- Line 9 description: `'The page you requested is not part of the current Swift Holdings site.'` → `'The page you requested is not part of The Swift Project site.'`
- Line 23 visible paragraph: same sentence, same replacement.

- [ ] **Step 3: Verify guard + full unit suite**

Run: `pnpm vitest run`
Expected: ALL suites pass (guard chrome assertions now green).

- [ ] **Step 4: Commit**

```bash
git add src/components/marketing/SiteFooter.astro src/pages/404.astro
git commit -m "feat(chrome): footer brand + legal line, de-brand 404"
```

---

### Task 5: Full verification + push

**Files:** none created; verification only.

- [ ] **Step 1: Typecheck + full tests + production build**

```bash
source ~/.nvm/nvm.sh && nvm use 22 >/dev/null && npx astro check && pnpm test && pnpm build
```
Expected: astro check 0 errors; vitest all green; build completes with routes emitted to `dist/client`.

- [ ] **Step 2: Serve and inspect the built homepage**

```bash
python3 -m http.server 4321 --directory dist/client
```
Then in another shell:
```bash
curl -s http://localhost:4321/ | rg -c "Own your place in Ghana" 
curl -s http://localhost:4321/ | rg "One standard. Four hubs." 
curl -s http://localhost:4321/ | rg -c "Operated by Swift Holdings"
curl -s http://localhost:4321/ | rg "membership ecosystem|GATED|absolute certainty|PBKDF2|securemensah" || echo CLEAN
curl -s http://localhost:4321/404 | rg "The Swift Project"
```
Expected: hero present; four-hubs section present; exactly 1 legal-line occurrence; banned strings absent (`CLEAN`); 404 rebranded.

- [ ] **Step 3: Visual sanity (hero unchanged, sections render)**

Screenshot `http://localhost:4321/` with the browser tooling (scrapling session or agent-browser). Confirm: hero looks identical to production except words; dark/light rhythm matches the approved mockup; no broken images. Kill the http server afterwards.

- [ ] **Step 4: Push**

```bash
git push origin main
```
Expected: push succeeds; Cloudflare Pages auto-deploys (~2 min).

- [ ] **Step 5: Post-deploy smoke on production**

```bash
sleep 150 && curl -s https://swiftholdings.pages.dev/ | rg "Own your place in Ghana" && curl -s https://swiftholdings.pages.dev/ | rg -c "Operated by Swift Holdings"
```
Expected: hero live; exactly one legal line. Report result to the user with screenshots if available.

---

## Self-Review Notes (already applied)

- **Spec coverage:** hero copy (Task 2), 12-section architecture (Task 3), four-hub counts + roles (Tasks 2–3), Stay/Own/Partner (Tasks 2–3), footer legal line + nav fix (Task 4), 404 (Task 4), About lead/name scrub (Task 2), 88%/PortalPreview homepage removal (Task 3), guard enforcement (Tasks 1–4), staging-URL leak removal (Task 2 home sections rewrite). Pass-2 items intentionally excluded.
- **Type consistency:** `swiftHubs` fields (`city`,`region`,`role`,`capsules`) match `locations.ts`; `marketingSite.tiers` shape unchanged; `page.hero`/`secondaryCta` props match `MarketingHero` usage; `ImageFrame` props match existing usage.
- **Known interplay:** `pages-rich.test.ts` needs `'GATED'` in ownership entry (untouched) and `'48'` in locations entry (untouched); `no-forbidden-strings.test.ts` needs `'70'`/`'$50,000'` (present in untouched entries). Guard bans are home-scoped for exactly this reason.
