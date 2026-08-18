# THE SWIFT PROJECT — Public Site Rebrand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the deployed Swift Holdings site as **THE SWIFT PROJECT** with the approved obsidian/gold design system and the full 10-page public architecture.

**Architecture:** Keep the existing Astro marketing stack (MarketingLayout, data-driven pages, Tailwind 4 tokens). Replace the violet token set with obsidian/canvas/gold tokens, swap Outfit for Cormorant Garamond + Manrope, rewrite the data layer with the new business model (70/30, $50K entry, 3 tiers, 4 hubs, 2 partnership pathways), and rebuild all 10 pages as thin compositions of the existing + a few new components. Discovery form, login, gated documents, and the portal are separate plans.

**Tech Stack:** Astro 7 (server output, Cloudflare adapter), Tailwind 4 via Vite, astro-font, astro-seo, Vitest, sharp (social card regeneration).

**Deferred to later plans:** 5-step discovery form (Plan 2), auth/login + gated documents (Plan 2), member portal (Plan 3). Resources page in this plan shows locked states with a `/briefing` link; real unlocking lands in Plan 2.

---

## File Structure

| File | Responsibility |
| --- | --- |
| `src/assets/styles/marketing.css` | All design tokens + shared classes (buttons, eyebrow, ledger, dark surface) |
| `src/layout/MarketingLayout.astro` | Fonts (Cormorant Garamond + Manrope), SEO, header theme prop |
| `src/data/marketing/site.ts` | Site identity, nav, primary CTA, membership tiers |
| `src/data/marketing/pages.ts` | Per-page SEO + hero + section copy for all 10 public pages |
| `src/data/marketing/calculator.ts` | Pure monthly-income math + defaults |
| `src/data/marketing/calculator.test.ts` | Calculator math tests |
| `src/data/marketing/locations.ts` | 4 hubs + market statistics |
| `src/data/marketing/locations.test.ts` | Hub data tests |
| `src/data/marketing/pathways.ts` | Partnership pathways (owner / ecosystem fund) |
| `src/data/marketing/pathways.test.ts` | Pathway data tests |
| `src/data/marketing/documents.ts` | 3 gated long-form documents metadata |
| `src/data/marketing/documents.test.ts` | Document metadata tests |
| `src/data/marketing/no-forbidden-strings.test.ts` | Regression: no 80/20, Hamilton, violet anywhere |
| `src/components/marketing/SiteHeader.astro` | Wordmark, nav, gold CTA; light/dark theme prop |
| `src/components/marketing/SiteFooter.astro` | Rebrand footer + contacts |
| `src/components/marketing/MarketingHero.astro` | Dark obsidian hero variant (serif headline, gold eyebrow) |
| `src/components/marketing/MarketLedger.astro` | Asymmetric stat/ledger section (replaces equal-card rows) |
| `src/components/marketing/TimelineSteps.astro` | 5-phase lock-in timeline |
| `src/components/marketing/PathwayBand.astro` | Partnership pathway band (owner = gold, fund = platinum) |
| `src/components/marketing/HubMap.astro` | SVG capital-bridge map (Accra + 3 hubs) |
| `src/components/marketing/DocRow.astro` | Gated document row with locked state |
| `src/components/marketing/Calculator.client.tsx` | Client calculator island (sliders + locked save) |
| `src/pages/index.astro` … `src/pages/briefing.astro` | 10 thin page compositions |
| `public/_redirects` | `/accra` → `/locations` |
| `scripts/prepare-marketing-images.mjs` | Social card text → THE SWIFT PROJECT |
| `public/icon.svg` | Gold-on-obsidian mark |
| `public/manifest.webmanifest` | Name → The Swift Project |

**Approved copy ground rules:** numbers come from the documents (300K+ Accra deficit, 2M+ national, 6–10% growth, ADR $100–132, occupancy 33–44% market / 88% unit, 38 m², 9-layer wall, CIGS solar, 70/30, $50K entry, 5-year lock-in in 5 phases). No 80/20, no Hamilton, no violet. Images stay labeled `Illustrative reference`.

---

## Task 1: Design tokens and fonts

**Files:**
- Modify: `src/assets/styles/marketing.css`
- Modify: `src/layout/MarketingLayout.astro`
- Modify: `src/data/marketing/marketing-foundation.test.ts`

- [ ] **Step 1: Write the failing foundation test update**

Replace the entire `src/data/marketing/marketing-foundation.test.ts` content with:

```ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readProjectFile = (path: string): string =>
  readFileSync(new URL(path, import.meta.url), 'utf8');

describe('marketing foundation regressions', () => {
  it('visibly labels the generated social card as an illustrative reference', () => {
    const generator = readProjectFile(
      '../../../scripts/prepare-marketing-images.mjs'
    );

    expect(generator).toContain('>ILLUSTRATIVE REFERENCE</text>');
  });

  it('supports a distinct mobile aspect ratio for curated mobile crops', () => {
    const imageFrame = readProjectFile(
      '../../components/marketing/ImageFrame.astro'
    );

    expect(imageFrame).toContain('mobileRatio?: string;');
    expect(imageFrame).toContain('--marketing-image-mobile-ratio');
  });

  it('uses the phase 2 token set (obsidian, canvas, gold) and no violet', () => {
    const marketingCss = readProjectFile('../../assets/styles/marketing.css');
    const layout = readProjectFile('../../layout/MarketingLayout.astro');

    expect(marketingCss).toContain('--marketing-obsidian-900:');
    expect(marketingCss).toContain('--marketing-canvas:');
    expect(marketingCss).toContain('--marketing-gold-gradient');
    expect(marketingCss).not.toContain('#2A1C46');
    expect(layout).not.toContain('#2A1C46');
  });

  it('uses contrasting text and focus styling on dark marketing surfaces', () => {
    const marketingCss = readProjectFile('../../assets/styles/marketing.css');
    const homePage = readProjectFile('../../pages/index.astro');

    expect(marketingCss).toContain('.marketing-surface-dark');
    expect(homePage).toContain('marketing-surface-dark');
  });

  it('validates every generated public marketing asset', () => {
    const validator = readProjectFile(
      '../../../scripts/validate-marketing-images.mjs'
    );

    for (const asset of [
      'social.png',
      'icon.svg',
      'icon-192.png',
      'icon-512.png',
      'apple-touch-icon.png',
    ]) {
      expect(validator).toContain(asset);
    }
  });

  it('loads Cormorant Garamond and Manrope through astro-font', () => {
    const layout = readProjectFile('../../layout/MarketingLayout.astro');

    expect(layout).toContain('Cormorant+Garamond');
    expect(layout).toContain('family=Manrope');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test -- marketing-foundation`
Expected: FAIL — `expect(marketingCss).toContain('--marketing-obsidian-900:')` fails (old tokens) and the astro-font assertion fails.

- [ ] **Step 3: Replace the token set in `src/assets/styles/marketing.css`**

Replace the entire file content with:

```css
:root {
  --marketing-obsidian-950: #14141a;
  --marketing-obsidian-900: #171719;
  --marketing-obsidian-850: #1d2026;
  --marketing-obsidian-800: #211f1d;
  --marketing-canvas: #f4efe6;
  --marketing-ink: #211f1d;
  --marketing-muted: #5c574f;
  --marketing-rule: #ded7cb;
  --marketing-gold-400: #e1be92;
  --marketing-gold-500: #d6ac7a;
  --marketing-gold-600: #c8a06c;
  --marketing-gold-700: #a88459;
  --marketing-gold-gradient: linear-gradient(92deg, #d7b777 0%, #b99255 100%);
  --marketing-gold-line: rgba(214, 172, 122, 0.14);
  --marketing-ink-on-dark: #ede7dc;
  --marketing-dim-on-dark: rgba(237, 231, 220, 0.5);
  --marketing-fund-fill: #c9cdd6;
  --marketing-fund-ink: #17191d;
}

.marketing-shell {
  min-height: 100vh;
  background: var(--marketing-canvas);
  color: var(--marketing-ink);
}

.marketing-shell-dark {
  background: var(--marketing-obsidian-900);
  color: var(--marketing-ink-on-dark);
}

.marketing-container {
  width: min(100% - 2rem, 72rem);
  margin-inline: auto;
}

.marketing-eyebrow {
  color: var(--marketing-gold-600);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.marketing-display {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 500;
  letter-spacing: -0.01em;
}

.marketing-button-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.3125rem;
  background: var(--marketing-gold-gradient);
  color: #1a1a19;
  font-weight: 600;
  padding: 0.75rem 1.25rem;
  transition: filter 160ms ease;
}

.marketing-button-primary:hover,
.marketing-button-primary:focus-visible {
  filter: brightness(1.06);
}

.marketing-button-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.3125rem;
  border: 1px solid var(--marketing-gold-600);
  color: var(--marketing-gold-600);
  font-weight: 600;
  padding: 0.75rem 1.25rem;
  transition:
    background-color 160ms ease,
    color 160ms ease;
}

.marketing-button-outline:hover,
.marketing-button-outline:focus-visible {
  background: rgba(200, 160, 108, 0.1);
}

.marketing-button-fund {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.3125rem;
  background: var(--marketing-fund-fill);
  color: var(--marketing-fund-ink);
  font-weight: 600;
  padding: 0.75rem 1.25rem;
  transition: filter 160ms ease;
}

.marketing-button-fund:hover,
.marketing-button-fund:focus-visible {
  filter: brightness(0.96);
}

.marketing-button-link {
  color: var(--marketing-gold-600);
  font-weight: 600;
}

.marketing-ledger-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: baseline;
  border-bottom: 1px solid rgba(33, 31, 29, 0.12);
  padding: 0.75rem 0;
  font-size: 0.8125rem;
}

.marketing-ledger-row:last-child {
  border-bottom: 0;
}

.marketing-ledger-row .marketing-ledger-label {
  color: var(--marketing-muted);
}

.marketing-ledger-row .marketing-ledger-value {
  color: var(--marketing-ink);
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}

.marketing-image-frame {
  position: relative;
  overflow: hidden;
  aspect-ratio: var(--marketing-image-desktop-ratio);
  background: #e8e3dc;
}

.marketing-image-frame > picture {
  display: block;
  width: 100%;
  height: 100%;
}

.marketing-image-label {
  position: absolute;
  inset: 0.75rem auto auto 0.75rem;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.9);
  color: var(--marketing-gold-700);
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  padding: 0.375rem 0.5rem;
  text-transform: uppercase;
}

.marketing-shell :where(a, button, input, select, textarea):focus-visible {
  outline: 2px solid var(--marketing-gold-600);
  outline-offset: 3px;
}

.marketing-surface-dark .marketing-eyebrow {
  color: var(--marketing-gold-400);
}

.marketing-surface-dark
  :where(a, button, input, select, textarea):focus-visible {
  outline-color: var(--marketing-gold-400);
}

@media (max-width: 47.999rem) {
  .marketing-container {
    width: min(100% - 1.25rem, 72rem);
  }

  .marketing-image-frame {
    aspect-ratio: var(--marketing-image-mobile-ratio);
  }
}
```

- [ ] **Step 4: Update `src/layout/MarketingLayout.astro`**

Replace lines 8–11 (font import) and the `<AstroFont>` block (lines 58–71), and the body class + schema name:

```astro
---
import { AstroFont } from 'astro-font';
import { SEO } from 'astro-seo';
import { Schema } from 'astro-seo-schema';
import type { Thing, WithContext } from 'schema-dts';
import SiteFooter from '@/components/marketing/SiteFooter.astro';
import SiteHeader from '@/components/marketing/SiteHeader.astro';
import '@styles/global.css';
import '@styles/marketing.css';
import { marketingSite } from '@/data/marketing/site';

interface Props {
  seo: { title: string; description: string };
  headerTheme?: 'light' | 'dark';
}

const { seo, headerTheme = 'light' } = Astro.props;
const siteUrl = Astro.site ?? new URL('https://swiftholdings.pages.dev');
const socialImage = new URL('/social.png', siteUrl).href;
const schema: WithContext<Thing> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: marketingSite.name,
  url: siteUrl.href,
  email: marketingSite.email,
};
---

<html lang="en">
  <head>
    <SEO
      charset="utf-8"
      title={seo.title}
      description={seo.description}
      openGraph={{
        basic: { title: seo.title, type: 'website', image: socialImage },
        optional: { description: seo.description },
      }}
      twitter={{
        card: 'summary_large_image',
        title: seo.title,
        description: seo.description,
        image: socialImage,
        imageAlt: 'The Swift Project illustrative prefab residence',
      }}
      extend={{
        link: [
          { rel: 'icon', href: '/icon.svg', type: 'image/svg+xml' },
          { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
          { rel: 'manifest', href: '/manifest.webmanifest' },
        ],
        meta: [
          { name: 'viewport', content: 'width=device-width' },
          { name: 'generator', content: Astro.generator },
        ],
      }}
    />
    <Schema item={schema} />
    <AstroFont
      config={[
        {
          src: [],
          name: 'Manrope',
          googleFontsURL:
            'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&display=swap',
          preload: true,
          display: 'swap',
          selector: 'body',
          fallback: 'sans-serif',
        },
        {
          src: [],
          name: 'Cormorant Garamond',
          googleFontsURL:
            'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap',
          preload: true,
          display: 'swap',
          selector: '.marketing-display',
          fallback: 'serif',
        },
      ]}
    />
  </head>
  <body
    class="marketing-shell selection:bg-[#C8A06C] selection:text-[#171719]"
  >
    <a
      href="#main-content"
      class="marketing-button-primary sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
    >
      Skip to content
    </a>
    <SiteHeader theme={headerTheme} />
    <main id="main-content" tabindex="-1"><slot /></main>
    <SiteFooter />
  </body>
</html>
```

- [ ] **Step 5: Run the full test suite**

Run: `pnpm test`
Expected: PASS (foundation test group passes; `no-forbidden-strings.test.ts` does not exist yet, Task 2 adds it).

- [ ] **Step 6: Commit**

```bash
git add src/assets/styles/marketing.css src/layout/MarketingLayout.astro src/data/marketing/marketing-foundation.test.ts
git commit -m "feat: swap phase 1 tokens for obsidian/canvas/gold design system"
```

---

## Task 2: Site identity, nav, tiers, and forbidden-string regression

**Files:**
- Modify: `src/data/marketing/site.ts`
- Create: `src/data/marketing/no-forbidden-strings.test.ts`

- [ ] **Step 1: Write the failing regression test**

Create `src/data/marketing/no-forbidden-strings.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const files = [
  '../../data/marketing/site.ts',
  '../../data/marketing/pages.ts',
  '../../data/marketing/locations.ts',
  '../../data/marketing/pathways.ts',
  '../../data/marketing/documents.ts',
  '../../data/marketing/calculator.ts',
];

const readAll = (): string =>
  files.map(path => readFileSync(new URL(path, import.meta.url), 'utf8')).join('\n');

describe('phase 2 content regressions', () => {
  it('contains no retired model or artifact strings', () => {
    const content = readAll();

    expect(content).not.toContain('80/20');
    expect(content).not.toContain('Hamilton');
    expect(content).not.toContain('#2A1C46');
  });

  it('asserts the approved business model constants', () => {
    const content = readAll();

    expect(content).toContain('70');
    expect(content).toContain('$50,000');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test -- no-forbidden-strings`
Expected: FAIL — `locations.ts` / `pathways.ts` / `documents.ts` / `calculator.ts` do not exist yet.

- [ ] **Step 3: Replace `src/data/marketing/site.ts`**

Replace the entire file with:

```ts
export const marketingSite = {
  name: 'The Swift Project',
  legalName: 'Swift Holdings',
  email: 'info@swiftholdings.org',
  partnershipsEmail: 'partnerships@swiftholdings-ghana.com',
  phone: '+233 544 101016',
  phoneNorthAmerica: '+1 437 421 0963',
  address: '20 Edmonton St, Madina, Accra',
  primaryCta: { label: 'Request a briefing', href: '/briefing' },
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
      name: 'Guest',
      summary: 'Browse and book short stays at project capsules — like a gated community open to the public.',
      cta: { label: 'Explore stays', href: '/village' },
    },
    {
      name: 'Member',
      summary: 'Join through the discovery briefing for full yield data, availability, pricing, and the legal dossier.',
      cta: { label: 'Join through a briefing', href: '/briefing' },
    },
    {
      name: 'Owner-Investor',
      summary: 'Set up a P7 capsule from a $50,000 entry and share revenue 70 / 30. Primary audience: the diaspora.',
      cta: { label: 'See the model', href: '/ownership' },
    },
  ],
} as const;

export type MarketingPageKey =
  | 'home'
  | 'village'
  | 'howItWorks'
  | 'ownership'
  | 'protections'
  | 'locations'
  | 'partnership'
  | 'about'
  | 'resources'
  | 'briefing';
```

- [ ] **Step 4: Run the regression test**

Run: `pnpm test -- no-forbidden-strings`
Expected: still FAIL — the four data files referenced in the test do not exist yet. This test turns green after Tasks 6, 8, 9, and 10 create them. It is fine for it to stay red until then; do not mark the task complete until all four files exist.

- [ ] **Step 5: Commit**

```bash
git add src/data/marketing/site.ts src/data/marketing/no-forbidden-strings.test.ts
git commit -m "feat: rebrand site identity to The Swift Project with tier data"
```

---

## Task 3: Header and footer

**Files:**
- Modify: `src/components/marketing/SiteHeader.astro`
- Modify: `src/components/marketing/SiteFooter.astro`

- [ ] **Step 1: Replace `src/components/marketing/SiteHeader.astro`**

```astro
---
import { marketingSite } from '@/data/marketing/site';

interface Props {
  theme?: 'light' | 'dark';
}

const { theme = 'light' } = Astro.props;
const currentPath = Astro.url.pathname;
const onDark = theme === 'dark';
const ink = onDark ? 'text-[var(--marketing-ink-on-dark)]' : 'text-[var(--marketing-ink)]';
const muted = onDark ? 'text-[var(--marketing-dim-on-dark)]' : 'text-[var(--marketing-muted)]';
const surface = onDark ? 'bg-[var(--marketing-obsidian-900)]' : 'bg-[var(--marketing-canvas)]';
const rule = onDark ? 'border-[var(--marketing-gold-line)]' : 'border-[var(--marketing-rule)]';
---

<header class={`border-b ${surface} ${rule}`}>
  <div class="marketing-container flex min-h-18 items-center justify-between gap-4 py-4">
    <a href="/" class={`marketing-display text-lg tracking-[0.14em] ${ink}`} aria-label="The Swift Project home">
      THE SWIFT <span class="text-[var(--marketing-gold-500)]">PROJECT</span>
    </a>
    <nav class="hidden items-center gap-6 lg:flex" aria-label="Primary navigation">
      {
        marketingSite.navigation.map(item => (
          <a
            href={item.href}
            aria-current={currentPath === item.href ? 'page' : undefined}
            class={`text-sm ${muted} hover:${onDark ? 'text-[var(--marketing-ink-on-dark)]' : 'text-[var(--marketing-ink)]'}`}
          >
            {item.label}
          </a>
        ))
      }
      <a class="marketing-button-primary text-sm" href={marketingSite.primaryCta.href}>
        {marketingSite.primaryCta.label}
      </a>
    </nav>
    <details class="relative lg:hidden">
      <summary class={`cursor-pointer rounded border ${rule} px-3 py-2 text-sm ${ink}`}>Menu</summary>
      <nav
        class={`absolute top-14 right-0 z-20 grid min-w-60 gap-1 border ${rule} bg-[var(--marketing-canvas)] p-3 shadow-lg`}
        aria-label="Mobile navigation"
      >
        {
          marketingSite.navigation.map(item => (
            <a
              href={item.href}
              aria-current={currentPath === item.href ? 'page' : undefined}
              class="rounded px-3 py-2 text-sm text-[var(--marketing-ink)] hover:bg-[rgba(200,160,108,0.12)]"
            >
              {item.label}
            </a>
          ))
        }
        <a class="marketing-button-primary mt-2 text-sm" href={marketingSite.primaryCta.href}>
          {marketingSite.primaryCta.label}
        </a>
      </nav>
    </details>
  </div>
</header>
```

Note: the mobile menu panel keeps a light canvas surface even on dark pages — intentional for legibility.

- [ ] **Step 2: Replace `src/components/marketing/SiteFooter.astro`**

```astro
---
import { marketingSite } from '@/data/marketing/site';
---

<footer class="border-t border-[var(--marketing-gold-line)] bg-[var(--marketing-obsidian-900)] text-[var(--marketing-ink-on-dark)]">
  <div class="marketing-container grid gap-10 py-14 lg:grid-cols-[1.2fr_1fr_1fr]">
    <div>
      <p class="marketing-display text-lg tracking-[0.14em]">
        THE SWIFT <span class="text-[var(--marketing-gold-500)]">PROJECT</span>
      </p>
      <p class="mt-4 max-w-sm text-sm leading-7 text-[var(--marketing-dim-on-dark)]">
        A membership ecosystem of owned P7 capsules across Ghana — built, operated, and shared on a 70 / 30 model.
      </p>
      <p class="mt-6 text-xs text-[var(--marketing-dim-on-dark)]">
        {marketingSite.legalName} · {marketingSite.address}
      </p>
    </div>
    <div>
      <p class="marketing-eyebrow">Explore</p>
      <nav class="mt-4 grid gap-3 text-sm" aria-label="Footer navigation">
        {
          marketingSite.navigation.map(item => (
            <a class="text-[var(--marketing-dim-on-dark)] hover:text-[var(--marketing-ink-on-dark)]" href={item.href}>
              {item.label}
            </a>
          ))
        }
      </nav>
    </div>
    <div>
      <p class="marketing-eyebrow">Contact</p>
      <div class="mt-4 grid gap-3 text-sm text-[var(--marketing-dim-on-dark)]">
        <a class="hover:text-[var(--marketing-ink-on-dark)]" href={`tel:${marketingSite.phone}`}>{marketingSite.phone}</a>
        <a class="hover:text-[var(--marketing-ink-on-dark)]" href={`tel:${marketingSite.phoneNorthAmerica}`}>{marketingSite.phoneNorthAmerica}</a>
        <a class="hover:text-[var(--marketing-ink-on-dark)]" href={`mailto:${marketingSite.email}`}>{marketingSite.email}</a>
        <a class="hover:text-[var(--marketing-ink-on-dark)]" href={`mailto:${marketingSite.partnershipsEmail}`}>{marketingSite.partnershipsEmail}</a>
      </div>
    </div>
  </div>
  <div class="border-t border-[var(--marketing-gold-line)]">
    <p class="marketing-container py-5 text-xs text-[var(--marketing-dim-on-dark)]">
      © {new Date().getFullYear()} {marketingSite.legalName}. Photography is illustrative reference unless labelled otherwise.
    </p>
  </div>
</footer>
```

- [ ] **Step 3: Visual check**

Run: `pnpm dev` and open `http://localhost:4321/`
Expected: header wordmark in Cormorant Garamond with gold PROJECT; gold gradient "Request a briefing" button; obsidian footer.

- [ ] **Step 4: Commit**

```bash
git add src/components/marketing/SiteHeader.astro src/components/marketing/SiteFooter.astro
git commit -m "feat: rebrand header and footer for The Swift Project"
```

---

## Task 4: Dark hero and market ledger components

**Files:**
- Modify: `src/components/marketing/MarketingHero.astro`
- Create: `src/components/marketing/MarketLedger.astro`

- [ ] **Step 1: Replace `src/components/marketing/MarketingHero.astro`**

```astro
---
import ImageFrame from '@/components/marketing/ImageFrame.astro';
import type { MarketingImageAsset } from '@/data/marketing/image-assets';
import { marketingSite } from '@/data/marketing/site';

interface Props {
  eyebrow: string;
  title: string;
  lead: string;
  image: MarketingImageAsset;
  ratio?: string;
  mobileRatio?: string;
  secondaryCta?: { label: string; href: string };
}

const { eyebrow, title, lead, image, ratio = '4 / 3', mobileRatio = ratio, secondaryCta } = Astro.props;
---

<section class="marketing-surface-dark bg-[var(--marketing-obsidian-900)]">
  <div class="marketing-container grid items-center gap-10 py-14 lg:grid-cols-[1.04fr_0.96fr] lg:py-20">
    <div>
      <p class="marketing-eyebrow">{eyebrow}</p>
      <h1 class="marketing-display mt-4 max-w-xl text-5xl leading-[1.04] text-[var(--marketing-ink-on-dark)] sm:text-6xl">
        {title}
      </h1>
      <p class="mt-6 max-w-xl text-lg leading-8 text-[var(--marketing-dim-on-dark)]">{lead}</p>
      <div class="mt-8 flex flex-wrap items-center gap-5">
        <a class="marketing-button-primary" href={marketingSite.primaryCta.href}>{marketingSite.primaryCta.label}</a>
        {
          secondaryCta && (
            <a class="marketing-button-outline" href={secondaryCta.href}>{secondaryCta.label}</a>
          )
        }
      </div>
      <p class="mt-6 text-sm text-[var(--marketing-dim-on-dark)]">A guided conversation, not a public sales funnel.</p>
    </div>
    <ImageFrame image={image} {ratio} {mobileRatio} loading="eager" />
  </div>
</section>
```

- [ ] **Step 2: Create `src/components/marketing/MarketLedger.astro`**

```astro
---
interface LedgerItem {
  label: string;
  value: string;
  note?: string;
}

interface Props {
  eyebrow: string;
  title: string;
  body?: string;
  items: readonly LedgerItem[];
  cta?: { label: string; href: string };
}

const { eyebrow, title, body, items, cta } = Astro.props;
---

<section class="marketing-container py-16 lg:py-24">
  <div class="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
    <div>
      <p class="marketing-eyebrow">{eyebrow}</p>
      <h2 class="marketing-display mt-3 max-w-md text-4xl leading-[1.08] text-[var(--marketing-ink)]">{title}</h2>
      {body && <p class="mt-4 max-w-md leading-7 text-[var(--marketing-muted)]">{body}</p>}
      {
        cta && (
          <a class="marketing-button-outline mt-6" href={cta.href}>{cta.label}</a>
        )
      }
    </div>
    <div class="border-t border-[var(--marketing-rule)] pt-2">
      {
        items.map(item => (
          <div class="marketing-ledger-row">
            <span class="marketing-ledger-label">
              {item.label}
              {item.note && <span class="mt-0.5 block text-xs">— {item.note}</span>}
            </span>
            <span class="marketing-ledger-value">{item.value}</span>
          </div>
        ))
      }
    </div>
  </div>
</section>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/marketing/MarketingHero.astro src/components/marketing/MarketLedger.astro
git commit -m "feat: add dark hero variant and ledger section component"
```

---

## Task 5: Page content data (all 10 pages)

**Files:**
- Modify: `src/data/marketing/pages.ts`

- [ ] **Step 1: Replace `src/data/marketing/pages.ts` entirely**

```ts
import type { MarketingPageKey } from './site';

interface MarketingSeo {
  title: string;
  description: string;
}

interface MarketingHeroContent {
  eyebrow: string;
  title: string;
  lead: string;
}

interface MarketingPage {
  seo: MarketingSeo;
  hero: MarketingHeroContent;
  secondaryCta?: { label: string; href: string };
}

export const marketingPages = {
  home: {
    seo: {
      title: 'The Swift Project | A luxury hospitality asset in Ghana, built with absolute certainty.',
      description:
        'Own a P7 capsule in Ghana on a 70 / 30 model. The Swift Project — a membership ecosystem of luxury modular hospitality across Accra, Kumasi, Tamale, and Takoradi.',
    },
    hero: {
      eyebrow: 'Oyarifa · Accra',
      title: 'A luxury hospitality asset in Ghana, built with absolute certainty.',
      lead: 'The Swift Project is a membership ecosystem: guests book stays, members hold the detail, and owner-investors operate their own capsule on a 70 / 30 revenue share.',
    },
    secondaryCta: { label: 'See the model', href: '/ownership' },
  },
  village: {
    seo: {
      title: 'The Village | The Swift Project',
      description:
        'The Oyarifa village: P7 capsules, shared land, the nine-layer wall system, and solar-ready design.',
    },
    hero: {
      eyebrow: 'Oyarifa · Accra',
      title: 'A village of capsules, held in common.',
      lead: 'Owner-investors hold the capsule; the village holds the land. Shared infrastructure, secure compounds, and a calmer rhythm than the city core.',
    },
    secondaryCta: { label: 'See the locations', href: '/locations' },
  },
  howItWorks: {
    seo: {
      title: 'How It Works | The Swift Project',
      description:
        'From discovery briefing to revenue: the five-phase path to a P7 capsule and the five-year operating lock-in.',
    },
    hero: {
      eyebrow: 'The path',
      title: 'From first conversation to first revenue.',
      lead: 'Five phases, a five-year operating lock-in, and a 70 / 30 share settled monthly. The path is the same for every capsule.',
    },
    secondaryCta: { label: 'Check the numbers', href: '/ownership' },
  },
  ownership: {
    seo: {
      title: 'Ownership & Financials | The Swift Project',
      description:
        'A $50,000 entry, a 70 / 30 revenue share, and an operating model built on documented market data across Ghana.',
    },
    hero: {
      eyebrow: 'Ownership & financials',
      title: 'Know what you are choosing before you commit.',
      lead: 'One entry point, one share, one operator. The Swift Project keeps the owner path legible: $50,000, 70 / 30, and a monthly settlement.',
    },
    secondaryCta: { label: 'See the protections', href: '/protections' },
  },
  protections: {
    seo: {
      title: 'Protections | The Swift Project',
      description:
        'Escrow, Ghanaian land law, insurance, and the legal dossier behind every capsule.',
    },
    hero: {
      eyebrow: 'Protections',
      title: 'Clarity before confidence.',
      lead: 'Deposits into escrow, title under Ghanaian law, insured builds, and a legal dossier members can read in full.',
    },
    secondaryCta: { label: 'Read the dossier', href: '/resources' },
  },
  locations: {
    seo: {
      title: 'Locations | The Swift Project',
      description:
        'Four hubs — Oyarifa (Accra), Kumasi, Tamale, and Takoradi — and the market case for each.',
    },
    hero: {
      eyebrow: 'Locations',
      title: 'Four hubs, one standard.',
      lead: 'The same capsule, the same 70 / 30, the same build standard — across the cities where Ghanaian demand is growing fastest.',
    },
    secondaryCta: { label: 'Start with the village', href: '/village' },
  },
  partnership: {
    seo: {
      title: 'Partnership | The Swift Project',
      description:
        'Two pathways: become an owner-investor, or partner with the Ecosystem Fund for institutional deployment.',
    },
    hero: {
      eyebrow: 'Partnership',
      title: 'Two ways into the project.',
      lead: 'Owner-investors set up capsules on the 70 / 30. The Ecosystem Fund deploys institutional capital across hubs at scale.',
    },
    secondaryCta: { label: 'See the financials', href: '/ownership' },
  },
  about: {
    seo: {
      title: 'About | The Swift Project',
      description:
        'Why The Swift Project exists: certainty, craft, and a better model for modular hospitality in Ghana.',
    },
    hero: {
      eyebrow: 'About',
      title: 'Built with certainty, not promises.',
      lead: 'Swift Holdings builds, operates, and shares the Swift Project — a membership ecosystem designed for the diaspora returning home.',
    },
    secondaryCta: { label: 'Request a briefing', href: '/briefing' },
  },
  resources: {
    seo: {
      title: 'Resources | The Swift Project',
      description:
        'The partnership summary, investor summary, and institutional whitepaper — behind the discovery briefing.',
    },
    hero: {
      eyebrow: 'Resources',
      title: 'The detail, held for members.',
      lead: 'Three long-form documents carry the real substance. They open after a discovery briefing, and stay with members in the portal.',
    },
    secondaryCta: { label: 'Join through a briefing', href: '/briefing' },
  },
  briefing: {
    seo: {
      title: 'Briefing | The Swift Project',
      description:
        'Request a private discovery briefing on owning a P7 capsule in Ghana.',
    },
    hero: {
      eyebrow: 'Private briefing',
      title: 'Tell us what you are planning.',
      lead: 'Share the essentials, and we reply with a more relevant next conversation. Briefings are encrypted, recorded, and summarised.',
    },
  },
} as const satisfies Record<MarketingPageKey, MarketingPage>;
```

- [ ] **Step 2: Run tests and typecheck**

Run: `pnpm test && pnpm astro check`
Expected: PASS (no-forbidden-strings may still fail on missing files — that resolves in Tasks 6/8/9/10; `astro check` must pass).

- [ ] **Step 3: Commit**

```bash
git add src/data/marketing/pages.ts
git commit -m "feat: rewrite public page content for phase 2"
```

---

## Task 6: Calculator logic and tests

**Files:**
- Create: `src/data/marketing/calculator.ts`
- Create: `src/data/marketing/calculator.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/data/marketing/calculator.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { CALCULATOR_DEFAULTS, monthlyInvestorIncome, grossMonthlyIncome } from './calculator';

describe('calculator', () => {
  it('matches the approved default figure: $50K entry, 88% occupancy, $132 ADR, 70% share', () => {
    const { occupancy, adr, share } = CALCULATOR_DEFAULTS;

    expect(monthlyInvestorIncome(occupancy, adr, share)).toBe(2440);
  });

  it('computes gross income as nights × occupancy × ADR', () => {
    expect(grossMonthlyIncome(1, 100)).toBe(3000);
  });

  it('rounds to the nearest ten dollars', () => {
    expect(monthlyInvestorIncome(0.88, 132, 0.7)).toBe(2440);
  });

  it('returns zero for zero occupancy', () => {
    expect(monthlyInvestorIncome(0, 132, 0.7)).toBe(0);
  });
});
```

Note on figures: `30 nights × 88% × $132 × 70% = $2,439.36`, displayed as **$2,440**. The "~$2,450/month" figure from the briefing materials is the same case before nearest-ten rounding — copy on the Ownership page says "~$2,450" only where the plan's prose quote does; the island itself renders the computed $2,440.

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test -- calculator`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Create `src/data/marketing/calculator.ts`**

```ts
export const CALCULATOR_DEFAULTS = {
  entry: 50000,
  occupancy: 0.88,
  adr: 132,
  share: 0.7,
  adrMin: 100,
  adrMax: 132,
  occupancyMin: 0.7,
  occupancyMax: 0.95,
  nightsPerMonth: 30,
  projectionNote: '350% projected return across the five-year operating lock-in — full scenarios behind the briefing.',
} as const;

export const grossMonthlyIncome = (occupancy: number, adr: number): number =>
  Math.round(CALCULATOR_DEFAULTS.nightsPerMonth * occupancy * adr);

export const monthlyInvestorIncome = (occupancy: number, adr: number, share: number): number =>
  Math.round(grossMonthlyIncome(occupancy, adr) * share / 10) * 10;
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test -- calculator`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/marketing/calculator.ts src/data/marketing/calculator.test.ts
git commit -m "feat: add public calculator math with approved defaults"
```

---

## Task 7: Calculator island and Ownership page

**Files:**
- Create: `src/components/marketing/Calculator.client.tsx`
- Create: `src/components/marketing/CalculatorSection.astro`
- Modify: `src/pages/ownership.astro`

- [ ] **Step 1: Create `src/components/marketing/Calculator.client.tsx`**

```tsx
import { useState } from 'react';
import {
  CALCULATOR_DEFAULTS,
  grossMonthlyIncome,
  monthlyInvestorIncome,
} from '@/data/marketing/calculator';

interface Props {
  initialOccupancy?: number;
  initialAdr?: number;
}

export default function Calculator({
  initialOccupancy = CALCULATOR_DEFAULTS.occupancy,
  initialAdr = CALCULATOR_DEFAULTS.adr,
}: Props): React.JSX.Element {
  const [occupancy, setOccupancy] = useState(initialOccupancy);
  const [adr, setAdr] = useState(initialAdr);

  const gross = grossMonthlyIncome(occupancy, adr);
  const investor = monthlyInvestorIncome(occupancy, adr, CALCULATOR_DEFAULTS.share);

  return (
    <div className="border border-[var(--marketing-gold-line)] bg-[var(--marketing-obsidian-900)] p-8 text-[var(--marketing-ink-on-dark)] lg:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="marketing-eyebrow">The public view</p>
          <p className="marketing-display mt-2 text-5xl text-[var(--marketing-gold-400)]">${investor.toLocaleString()}</p>
          <p className="mt-1 text-sm text-[var(--marketing-dim-on-dark)]">estimated monthly share at {Math.round(occupancy * 100)}% occupancy · ${adr} ADR</p>
        </div>
        <p className="max-w-44 text-xs leading-5 text-[var(--marketing-dim-on-dark)]">{CALCULATOR_DEFAULTS.projectionNote}</p>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="text-[var(--marketing-dim-on-dark)]">Occupancy</span>
          <input
            type="range"
            min={CALCULATOR_DEFAULTS.occupancyMin * 100}
            max={CALCULATOR_DEFAULTS.occupancyMax * 100}
            value={Math.round(occupancy * 100)}
            onChange={(event) => setOccupancy(Number(event.target.value) / 100)}
            className="accent-[var(--marketing-gold-500)]"
          />
          <span className="text-xs text-[var(--marketing-dim-on-dark)]">{Math.round(occupancy * 100)}%</span>
        </label>
        <label className="grid gap-2 text-sm">
          <span className="text-[var(--marketing-dim-on-dark)]">Average daily rate</span>
          <input
            type="range"
            min={CALCULATOR_DEFAULTS.adrMin}
            max={CALCULATOR_DEFAULTS.adrMax}
            value={adr}
            onChange={(event) => setAdr(Number(event.target.value))}
            className="accent-[var(--marketing-gold-500)]"
          />
          <span className="text-xs text-[var(--marketing-dim-on-dark)]">${adr} · market range ${CALCULATOR_DEFAULTS.adrMin}–${CALCULATOR_DEFAULTS.adrMax}</span>
        </label>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-px bg-[var(--marketing-gold-line)] text-sm">
        <div className="bg-[var(--marketing-obsidian-900)] p-4">
          <span className="text-[var(--marketing-dim-on-dark)]">Gross monthly</span>
          <span className="mt-1 block font-medium text-[var(--marketing-ink-on-dark)]">${gross.toLocaleString()}</span>
        </div>
        <div className="bg-[var(--marketing-obsidian-900)] p-4">
          <span className="text-[var(--marketing-dim-on-dark)]">Your share — 70%</span>
          <span className="mt-1 block font-medium text-[var(--marketing-gold-400)]">${investor.toLocaleString()}</span>
        </div>
      </div>
      <a className="marketing-button-primary mt-6 w-full" href="/briefing">
        Unlock full scenarios with a briefing
      </a>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/marketing/CalculatorSection.astro`**

```astro
---
import Calculator from '@/components/marketing/Calculator.client';
---

<section class="marketing-container py-16 lg:py-24">
  <div class="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
    <div>
      <p class="marketing-eyebrow">The public view</p>
      <h2 class="marketing-display mt-3 max-w-md text-4xl leading-[1.08] text-[var(--marketing-ink)]">
        The approved case, in public.
      </h2>
      <p class="mt-4 max-w-md leading-7 text-[var(--marketing-muted)]">
        A $50,000 entry at 88% occupancy and the top of the market rate range, on the 70 / 30 model. Full scenarios and saved comparisons sit behind the briefing.
      </p>
    </div>
    <Calculator client:load />
  </div>
</section>
```

- [ ] **Step 3: Replace `src/pages/ownership.astro`**

```astro
---
export const prerender = true;

import MarketingHero from '@/components/marketing/MarketingHero.astro';
import StorySplit from '@/components/marketing/StorySplit.astro';
import MarketLedger from '@/components/marketing/MarketLedger.astro';
import CalculatorSection from '@/components/marketing/CalculatorSection.astro';
import { marketingImages } from '@/data/marketing/image-assets';
import { marketingPages } from '@/data/marketing/pages';
import MarketingLayout from '@layout/MarketingLayout.astro';

const page = marketingPages.ownership;
---

<MarketingLayout seo={page.seo}>
  <MarketingHero {...page.hero} secondaryCta={page.secondaryCta} image={marketingImages.ownershipPage} ratio="3 / 2" />

  <MarketLedger
    eyebrow="The owner path"
    title="One entry, one share, one operator."
    body="The Swift Project keeps the owner path legible. Every capsule follows the same financial line."
    items={[
      { label: 'Entry', value: '$50,000', note: 'one P7 capsule, fully installed' },
      { label: 'Revenue share', value: '70 / 30', note: '70% to you, 30% to the operator' },
      { label: 'Settlement', value: 'Monthly', note: 'USD held · GHS settled' },
      { label: 'Lock-in', value: '5 years', note: 'five phases, one operating partner' },
      { label: 'Your capsule', value: '38 m²', note: 'nine-layer wall system, CIGS solar-ready' },
    ]}
    cta={{ label: 'See the protections', href: '/protections' }}
  />

  <CalculatorSection />

  <StorySplit
    eyebrow="Why the numbers hold"
    title="Grounded in documented demand, not optimism."
    body="The case rests on the accommodation deficit: over 300,000 rooms short in Accra and more than two million across Ghana, with demand growing 6–10% a year."
    image={marketingImages.ownershipStory}
    reverse
  />

  <section class="marketing-container pb-20">
    <a class="marketing-button-primary" href="/briefing">Request a briefing</a>
  </section>
</MarketingLayout>
```

- [ ] **Step 4: Verify**

Run: `pnpm dev`, open `http://localhost:4321/ownership`
Expected: dark hero, ledger section, interactive calculator defaulting to **$2,440** (~$2,450 per the briefing materials), story split, gold CTA.

- [ ] **Step 5: Commit**

```bash
git add src/components/marketing/Calculator.client.tsx src/components/marketing/CalculatorSection.astro src/pages/ownership.astro
git commit -m "feat: add interactive calculator and rebuild ownership page"
```

---

## Task 8: Locations data, hub map, page, redirect

**Files:**
- Create: `src/data/marketing/locations.ts`
- Create: `src/data/marketing/locations.test.ts`
- Create: `src/components/marketing/HubMap.astro`
- Create: `src/pages/locations.astro`
- Modify: `public/_redirects`

- [ ] **Step 1: Write the failing test**

Create `src/data/marketing/locations.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { marketStatistics, swiftHubs } from './locations';

describe('locations', () => {
  it('lists exactly four hubs including Oyarifa', () => {
    expect(swiftHubs).toHaveLength(4);
    expect(swiftHubs.map(hub => hub.city)).toContain('Oyarifa');
  });

  it('carries the documented market statistics', () => {
    expect(marketStatistics.accommodationDeficit).toContain('300,000');
    expect(marketStatistics.nationalDeficit).toContain('2,000,000');
    expect(marketStatistics.growth).toContain('6');
  });

  it('gives every hub a role and a capsule count', () => {
    for (const hub of swiftHubs) {
      expect(hub.role).toBeTruthy();
      expect(hub.capsules).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test -- locations`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Create `src/data/marketing/locations.ts`**

```ts
export const marketStatistics = {
  accommodationDeficit: '300,000+',
  accommodationDeficitLabel: 'rooms short in Accra alone',
  nationalDeficit: '2,000,000+',
  nationalDeficitLabel: 'across Ghana',
  growth: '6–10%',
  growthLabel: 'annual demand growth',
} as const;

export const swiftHubs = [
  {
    city: 'Oyarifa',
    region: 'Accra',
    role: 'The flagship village — first capsules, shared land, gated community.',
    capsules: 12,
  },
  {
    city: 'Kumasi',
    region: 'Ashanti',
    role: 'The second hub — regional capital demand, short stays and visiting family.',
    capsules: 8,
  },
  {
    city: 'Tamale',
    region: 'Northern',
    role: 'The northern bridge — conference and institutional stays.',
    capsules: 6,
  },
  {
    city: 'Takoradi',
    region: 'Western',
    role: 'The coastal hub — energy-sector stays and weekend escapes.',
    capsules: 6,
  },
] as const;

export type SwiftHub = (typeof swiftHubs)[number];
```

- [ ] **Step 4: Run tests**

Run: `pnpm test -- locations`
Expected: PASS (3 tests).

- [ ] **Step 5: Create `src/components/marketing/HubMap.astro`**

```astro
---
import { swiftHubs } from '@/data/marketing/locations';
---

<figure class="overflow-hidden rounded border border-[var(--marketing-gold-line)] bg-[var(--marketing-obsidian-900)] p-6 lg:p-8">
  <svg viewBox="0 0 400 300" class="w-full" role="img" aria-label="Schematic map of the four Swift hubs and their connecting routes">
    <g stroke="rgba(214,172,122,0.35)" stroke-width="1">
      <path d="M 200 60 L 110 160" />
      <path d="M 200 60 L 200 250" />
      <path d="M 200 60 L 300 200" />
      <path d="M 110 160 L 300 200" />
      <path d="M 110 160 L 200 250" />
      <path d="M 300 200 L 200 250" />
    </g>
    {
      swiftHubs.map((hub, index) => {
        const coords = [
          { x: 200, y: 60 },
          { x: 110, y: 160 },
          { x: 200, y: 250 },
          { x: 300, y: 200 },
        ][index]!;
        return (
          <g key={hub.city}>
            <circle cx={coords.x} cy={coords.y} r="10" fill="var(--marketing-obsidian-900)" stroke="var(--marketing-gold-500)" stroke-width="1.5" />
            <circle cx={coords.x} cy={coords.y} r="3" fill="var(--marketing-gold-500)" />
            <text x={coords.x} y={coords.y - 18} text-anchor="middle" fill="var(--marketing-ink-on-dark)" font-size="11" letter-spacing="2">{hub.city.toUpperCase()}</text>
            <text x={coords.x} y={coords.y + 26} text-anchor="middle" fill="var(--marketing-dim-on-dark)" font-size="9">{hub.capsules} capsules</text>
          </g>
        );
      })
    }
  </svg>
  <figcaption class="mt-4 text-xs text-[var(--marketing-dim-on-dark)]">
    Schematic bridge map — indicative, not to scale.
  </figcaption>
</figure>
```

- [ ] **Step 6: Create `src/pages/locations.astro`**

```astro
---
export const prerender = true;

import MarketingHero from '@/components/marketing/MarketingHero.astro';
import MarketLedger from '@/components/marketing/MarketLedger.astro';
import HubMap from '@/components/marketing/HubMap.astro';
import { marketingImages } from '@/data/marketing/image-assets';
import { marketingPages } from '@/data/marketing/pages';
import { marketStatistics, swiftHubs } from '@/data/marketing/locations';
import MarketingLayout from '@layout/MarketingLayout.astro';

const page = marketingPages.locations;
---

<MarketingLayout seo={page.seo}>
  <MarketingHero {...page.hero} secondaryCta={page.secondaryCta} image={marketingImages.villageBanner} ratio="4 / 3" />

  <MarketLedger
    eyebrow="The market case"
    title="Demand that is documented, not assumed."
    body="The hubs sit where the numbers are loudest. One capsule standard, four markets."
    items={[
      { label: 'Accra shortfall', value: marketStatistics.accommodationDeficit, note: marketStatistics.accommodationDeficitLabel },
      { label: 'National shortfall', value: marketStatistics.nationalDeficit, note: marketStatistics.nationalDeficitLabel },
      { label: 'Demand growth', value: marketStatistics.growth, note: marketStatistics.growthLabel },
      { label: 'Market occupancy', value: '33–44%', note: 'documented range across target cities' },
      { label: 'Unit occupancy target', value: '88%', note: 'operated mix of stays and members' },
    ]}
  />

  <section class="marketing-container grid gap-10 py-16 lg:grid-cols-[1fr_1.4fr] lg:py-24">
    <div>
      <p class="marketing-eyebrow">The hubs</p>
      <h2 class="marketing-display mt-3 max-w-md text-4xl leading-[1.08] text-[var(--marketing-ink)]">
        One standard, four cities.
      </h2>
      <p class="mt-4 max-w-md leading-7 text-[var(--marketing-muted)]">
        The same capsule, the same 70 / 30, the same operator — across the cities where the deficit is sharpest.
      </p>
    </div>
    <div class="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
      <HubMap />
      <div class="border-t border-[var(--marketing-rule)] pt-2">
        {
          swiftHubs.map(hub => (
            <div class="marketing-ledger-row">
              <span class="marketing-ledger-label">
                {hub.city}, {hub.region}
                <span class="mt-0.5 block text-xs">— {hub.role}</span>
              </span>
              <span class="marketing-ledger-value">{hub.capsules} capsules</span>
            </div>
          ))
        }
      </div>
    </div>
  </section>
</MarketingLayout>
```

- [ ] **Step 7: Update `public/_redirects` and remove the old Accra page**

Replace the `/market-insights /accra 301` line with:

```
/market-insights /locations 301
/accra /locations 301
```

Delete the superseded page (its content moved into `locations.astro`):

```bash
git rm src/pages/accra.astro
```

- [ ] **Step 8: Run tests + build the page**

Run: `pnpm test && pnpm astro check`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/data/marketing/locations.ts src/data/marketing/locations.test.ts src/components/marketing/HubMap.astro src/pages/locations.astro public/_redirects
git commit -m "feat: add locations page with hubs, market stats, and schematic map"
```

---

## Task 9: Partnership pathways and page

**Files:**
- Create: `src/data/marketing/pathways.ts`
- Create: `src/data/marketing/pathways.test.ts`
- Create: `src/components/marketing/PathwayBand.astro`
- Create: `src/pages/partnership.astro`

- [ ] **Step 1: Write the failing test**

Create `src/data/marketing/pathways.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { pathways } from './pathways';

describe('pathways', () => {
  it('offers exactly two pathways', () => {
    expect(pathways).toHaveLength(2);
  });

  it('keeps the owner path at $50,000 on 70 / 30', () => {
    const owner = pathways.find(pathway => pathway.name === 'Owner-Investor');
    expect(owner?.entry).toBe('$50,000');
    expect(owner?.share).toBe('70 / 30');
  });

  it('keeps the Ecosystem Fund separate from the owner path', () => {
    const fund = pathways.find(pathway => pathway.name === 'Ecosystem Fund');
    expect(fund?.entry).toBe('$1M+');
    expect(fund?.ctaStyle).toBe('fund');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test -- pathways`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Create `src/data/marketing/pathways.ts`**

```ts
export const pathways = [
  {
    name: 'Owner-Investor',
    tagline: 'Own a capsule. Share the revenue.',
    body: 'Set up a P7 capsule from a $50,000 entry, operated by Swift on a 70 / 30 revenue share with a five-year lock-in. The primary path for the diaspora.',
    entry: '$50,000',
    share: '70 / 30',
    cta: { label: 'See the financials', href: '/ownership' },
    ctaStyle: 'gold' as const,
  },
  {
    name: 'Ecosystem Fund',
    tagline: 'Institutional capital, deployed at scale.',
    body: 'Partner the Ecosystem Fund to deploy institutional capital across hubs — village-level deployment, portfolio reporting, and Ghanaian law structured through Swift Holdings.',
    entry: '$1M+',
    share: 'Fund terms',
    cta: { label: 'Discuss the fund', href: '/briefing' },
    ctaStyle: 'fund' as const,
  },
] as const;
```

- [ ] **Step 4: Run tests**

Run: `pnpm test -- pathways`
Expected: PASS (3 tests).

- [ ] **Step 5: Create `src/components/marketing/PathwayBand.astro`**

```astro
---
import { pathways } from '@/data/marketing/pathways';
---

<section class="marketing-container py-16 lg:py-24">
  <div class="border-t border-[var(--marketing-rule)] pt-2">
    {
      pathways.map((pathway, index) => (
        <div
          class="grid gap-8 py-10 lg:grid-cols-[0.8fr_1.4fr_0.8fr] lg:items-center"
          style={`border-bottom: 1px solid ${index === pathways.length - 1 ? 'var(--marketing-rule)' : 'rgba(33,31,29,0.12)'}`}
        >
          <p class="marketing-display text-3xl text-[var(--marketing-gold-600)]">0{index + 1}</p>
          <div>
            <h2 class="marketing-display text-4xl leading-[1.08] text-[var(--marketing-ink)]">{pathway.name}</h2>
            <p class="mt-1 text-sm font-semibold tracking-wide text-[var(--marketing-gold-700)]">{pathway.tagline}</p>
            <p class="mt-4 max-w-2xl leading-7 text-[var(--marketing-muted)]">{pathway.body}</p>
            <div class="mt-6 grid max-w-md grid-cols-2 gap-6 border-t border-[var(--marketing-rule)] pt-4">
              <div>
                <p class="marketing-eyebrow">Entry</p>
                <p class="marketing-display mt-1 text-2xl text-[var(--marketing-ink)]">{pathway.entry}</p>
              </div>
              <div>
                <p class="marketing-eyebrow">Share</p>
                <p class="marketing-display mt-1 text-2xl text-[var(--marketing-ink)]">{pathway.share}</p>
              </div>
            </div>
          </div>
          <div class="lg:text-right">
            <a
              class={pathway.ctaStyle === 'fund' ? 'marketing-button-fund' : 'marketing-button-primary'}
              href={pathway.cta.href}
            >
              {pathway.cta.label}
            </a>
          </div>
        </div>
      ))
    }
  </div>
</section>
```

Note: the owner path uses the gold gradient CTA; the Ecosystem Fund uses the platinum `marketing-button-fund` — the approved "differently-colored CTA" rule.

- [ ] **Step 6: Create `src/pages/partnership.astro`**

```astro
---
export const prerender = true;

import MarketingHero from '@/components/marketing/MarketingHero.astro';
import PathwayBand from '@/components/marketing/PathwayBand.astro';
import { marketingImages } from '@/data/marketing/image-assets';
import { marketingPages } from '@/data/marketing/pages';
import MarketingLayout from '@layout/MarketingLayout.astro';

const page = marketingPages.partnership;
---

<MarketingLayout seo={page.seo}>
  <MarketingHero {...page.hero} secondaryCta={page.secondaryCta} image={marketingImages.duskCta} ratio="4 / 3" />
  <PathwayBand />
</MarketingLayout>
```

- [ ] **Step 7: Verify**

Run: `pnpm dev`, open `http://localhost:4321/partnership`
Expected: two pathway bands; gold CTA on owner path, platinum on the fund.

- [ ] **Step 8: Commit**

```bash
git add src/data/marketing/pathways.ts src/data/marketing/pathways.test.ts src/components/marketing/PathwayBand.astro src/pages/partnership.astro
git commit -m "feat: add partnership page with owner and ecosystem fund pathways"
```

---

## Task 10: Resources page and document metadata

**Files:**
- Create: `src/data/marketing/documents.ts`
- Create: `src/data/marketing/documents.test.ts`
- Create: `src/components/marketing/DocRow.astro`
- Create: `src/pages/resources.astro`

- [ ] **Step 1: Write the failing test**

Create `src/data/marketing/documents.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { gatedDocuments } from './documents';

describe('gated documents', () => {
  it('lists exactly three long-form documents', () => {
    expect(gatedDocuments).toHaveLength(3);
  });

  it('keeps every document gated behind the briefing', () => {
    for (const document of gatedDocuments) {
      expect(document.access).toBe('members');
      expect(document.pages).toBeGreaterThan(0);
    }
  });

  it('includes the institutional whitepaper', () => {
    expect(gatedDocuments.map(document => document.title).join(' ')).toContain('Institutional');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test -- documents`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Create `src/data/marketing/documents.ts`**

```ts
export const gatedDocuments = [
  {
    title: 'Partnership Summary',
    subtitle: 'The membership ecosystem, the village, and the operator model.',
    pages: 42,
    access: 'members',
    cta: { label: 'Unlock with a briefing', href: '/briefing' },
  },
  {
    title: 'Investor Summary & Partnership Models',
    subtitle: 'Full yield scenarios, lock-in phases, and the 70 / 30 in detail.',
    pages: 38,
    access: 'members',
    cta: { label: 'Unlock with a briefing', href: '/briefing' },
  },
  {
    title: 'Institutional Modular Hospitality in Ghana',
    subtitle: 'A whitepaper on prefab and portable real estate at national scale.',
    pages: 24,
    access: 'members',
    cta: { label: 'Unlock with a briefing', href: '/briefing' },
  },
] as const;
```

- [ ] **Step 4: Run tests**

Run: `pnpm test -- documents`
Expected: PASS (3 tests). Note: this task also completes the missing-file dependencies of `no-forbidden-strings.test.ts` from Task 2 — run `pnpm test -- no-forbidden-strings` to confirm it now passes.

- [ ] **Step 5: Create `src/components/marketing/DocRow.astro`**

```astro
---
import type { gatedDocuments } from '@/data/marketing/documents';

interface Props {
  document: (typeof gatedDocuments)[number];
  index: number;
}

const { document, index } = Astro.props;
---

<div class="grid gap-6 border-b border-[var(--marketing-rule)] py-8 lg:grid-cols-[3rem_1fr_auto] lg:items-center">
  <p class="marketing-display text-2xl text-[var(--marketing-gold-600)]">{String(index + 1).padStart(2, '0')}</p>
  <div>
    <h2 class="marketing-display text-3xl leading-[1.1] text-[var(--marketing-ink)]">{document.title}</h2>
    <p class="mt-2 max-w-xl leading-6 text-[var(--marketing-muted)]">{document.subtitle}</p>
  </div>
  <div class="flex items-center gap-6 lg:flex-col lg:items-end">
    <p class="text-xs text-[var(--marketing-muted)]">{document.pages} pages · members</p>
    <span class="flex items-center gap-2 text-xs text-[var(--marketing-gold-700)]">
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        <rect x="2" y="5" width="8" height="5" rx="1" fill="none" stroke="currentColor" />
        <path d="M3.5 5V3.5a2.5 2.5 0 0 1 5 0V5" fill="none" stroke="currentColor" />
      </svg>
      Locked
    </span>
    <a class="marketing-button-outline" href={document.cta.href}>{document.cta.label}</a>
  </div>
</div>
```

- [ ] **Step 6: Create `src/pages/resources.astro`**

```astro
---
export const prerender = true;

import MarketingHero from '@/components/marketing/MarketingHero.astro';
import DocRow from '@/components/marketing/DocRow.astro';
import { marketingImages } from '@/data/marketing/image-assets';
import { marketingPages } from '@/data/marketing/pages';
import { gatedDocuments } from '@/data/marketing/documents';
import MarketingLayout from '@layout/MarketingLayout.astro';

const page = marketingPages.resources;
---

<MarketingLayout seo={page.seo}>
  <MarketingHero {...page.hero} secondaryCta={page.secondaryCta} image={marketingImages.briefingClose} ratio="4 / 3" />

  <section class="marketing-container py-16 lg:py-24">
    <p class="marketing-eyebrow">Held for members</p>
    <h2 class="marketing-display mt-3 max-w-2xl text-4xl leading-[1.08] text-[var(--marketing-ink)]">
      The real substance lives here.
    </h2>
    <p class="mt-4 max-w-2xl leading-7 text-[var(--marketing-muted)]">
      Each document is written to be read — long-form, on-site, and downloadable as PDF once you are a member. The briefing is the door.
    </p>
    <div class="mt-10 border-t border-[var(--marketing-rule)]">
      {
        gatedDocuments.map((document, index) => (
          <DocRow document={document} index={index} />
        ))
      }
    </div>
  </section>
</MarketingLayout>
```

- [ ] **Step 7: Verify**

Run: `pnpm dev`, open `http://localhost:4321/resources`
Expected: three ledger rows with serif titles, gold lock glyph, outlined unlock CTAs.

- [ ] **Step 8: Commit**

```bash
git add src/data/marketing/documents.ts src/data/marketing/documents.test.ts src/components/marketing/DocRow.astro src/pages/resources.astro
git commit -m "feat: add resources page with gated document rows"
```

---

## Task 11: How It Works — five-phase timeline

**Files:**
- Create: `src/components/marketing/TimelineSteps.astro`
- Modify: `src/pages/how-it-works.astro`

- [ ] **Step 1: Create `src/components/marketing/TimelineSteps.astro`**

```astro
---
const phases = [
  { title: 'Land & permits', body: 'The village plot is secured, surveyed, and permitted under Ghanaian law.' },
  { title: 'Foundation', body: 'The slab and services go in — power, water, and drainage at the plot edge.' },
  { title: 'Delivery', body: 'Your P7 capsule ships to the hub from the factory floor.' },
  { title: 'Installation & finish', body: 'The nine-layer wall system is raised and finished in place.' },
  { title: 'Revenue', body: 'The capsule joins the operated pool — 70 / 30, settled monthly.' },
] as const;

const lockIn = 'A five-year operating lock-in keeps the pool stable; the marketplace keeps owners liquid.';
---

<section class="marketing-container py-16 lg:py-24">
  <p class="marketing-eyebrow">Five phases</p>
  <h2 class="marketing-display mt-3 max-w-2xl text-4xl leading-[1.08] text-[var(--marketing-ink)]">
    From first conversation to first revenue.
  </h2>
  <ol class="mt-12 grid gap-0 border-t border-[var(--marketing-rule)]">
    {
      phases.map((phase, index) => (
        <li class="grid gap-3 border-b border-[var(--marketing-rule)] py-6 lg:grid-cols-[4rem_14rem_1fr] lg:items-baseline">
          <p class="marketing-display text-2xl text-[var(--marketing-gold-600)]">{String(index + 1).padStart(2, '0')}</p>
          <h3 class="marketing-display text-2xl text-[var(--marketing-ink)]">{phase.title}</h3>
          <p class="max-w-xl leading-7 text-[var(--marketing-muted)]">{phase.body}</p>
        </li>
      ))
    }
  </ol>
  <p class="mt-8 max-w-2xl text-sm leading-6 text-[var(--marketing-muted)]">{lockIn}</p>
</section>
```

- [ ] **Step 2: Replace `src/pages/how-it-works.astro`**

```astro
---
export const prerender = true;

import MarketingHero from '@/components/marketing/MarketingHero.astro';
import TimelineSteps from '@/components/marketing/TimelineSteps.astro';
import { marketingImages } from '@/data/marketing/image-assets';
import { marketingPages } from '@/data/marketing/pages';
import MarketingLayout from '@layout/MarketingLayout.astro';

const page = marketingPages.howItWorks;
---

<MarketingLayout seo={page.seo}>
  <MarketingHero {...page.hero} secondaryCta={page.secondaryCta} image={marketingImages.architectureGallery} ratio="4 / 3" />
  <TimelineSteps />
</MarketingLayout>
```

- [ ] **Step 3: Verify**

Run: `pnpm dev`, open `http://localhost:4321/how-it-works`
Expected: five asymmetric ledger rows (number / phase / body), not equal cards.

- [ ] **Step 4: Commit**

```bash
git add src/components/marketing/TimelineSteps.astro src/pages/how-it-works.astro
git commit -m "feat: add five-phase timeline to how it works"
```

---

## Task 12: Village page

**Files:**
- Modify: `src/pages/village.astro`

- [ ] **Step 1: Replace `src/pages/village.astro`**

```astro
---
export const prerender = true;

import MarketingHero from '@/components/marketing/MarketingHero.astro';
import StorySplit from '@/components/marketing/StorySplit.astro';
import MarketLedger from '@/components/marketing/MarketLedger.astro';
import { marketingImages } from '@/data/marketing/image-assets';
import { marketingPages } from '@/data/marketing/pages';
import MarketingLayout from '@layout/MarketingLayout.astro';

const page = marketingPages.village;
---

<MarketingLayout seo={page.seo}>
  <MarketingHero {...page.hero} secondaryCta={page.secondaryCta} image={marketingImages.villageStory} ratio="4 / 3" />

  <MarketLedger
    eyebrow="The capsule"
    title="One specification, everywhere."
    body="The P7 is a 38 m² capsule built to a single specification, so every owner's asset is identical and every hub is interchangeable."
    items={[
      { label: 'Footprint', value: '38 m²', note: 'one bedroom, full services' },
      { label: 'Wall system', value: '9 layers', note: 'thermal, acoustic, and structural in one panel' },
      { label: 'Energy', value: 'CIGS solar-ready', note: 'thin-film solar integration as standard' },
      { label: 'Install', value: 'Days, not months', note: 'factory-built, shipped, raised on site' },
    ]}
    cta={{ label: 'See the locations', href: '/locations' }}
  />

  <StorySplit
    eyebrow="Shared land"
    title="You hold the capsule. The village holds the ground."
    body="Capsules sit on shared village land — secured compounds, shared services, and a gated rhythm. It is the structure that keeps a 38 m² asset feeling like a home."
    image={marketingImages.villageBanner}
    reverse
  />
</MarketingLayout>
```

- [ ] **Step 2: Verify**

Run: `pnpm dev`, open `http://localhost:4321/village`
Expected: dark hero, capsule ledger, shared-land split.

- [ ] **Step 3: Commit**

```bash
git add src/pages/village.astro
git commit -m "feat: rebuild village page with capsule specification"
```

---

## Task 13: Protections page

**Files:**
- Modify: `src/pages/protections.astro`

- [ ] **Step 1: Replace `src/pages/protections.astro`**

```astro
---
export const prerender = true;

import MarketingHero from '@/components/marketing/MarketingHero.astro';
import MarketLedger from '@/components/marketing/MarketLedger.astro';
import { marketingImages } from '@/data/marketing/image-assets';
import { marketingPages } from '@/data/marketing/pages';
import MarketingLayout from '@layout/MarketingLayout.astro';

const page = marketingPages.protections;
---

<MarketingLayout seo={page.seo}>
  <MarketingHero {...page.hero} secondaryCta={page.secondaryCta} image={marketingImages.confidenceFeature} ratio="4 / 3" />

  <MarketLedger
    eyebrow="What is in place"
    title="Safeguards on paper, before money moves."
    body="The protections are written into the agreements, not promised in prose. Members read the full dossier."
    items={[
      { label: 'Deposits', value: 'Escrow-held', note: 'release only against documented milestones' },
      { label: 'Title', value: 'Ghanaian law', note: 'structured through Swift Holdings counsel' },
      { label: 'Build', value: 'Insured', note: 'full-build certificate on every capsule' },
      { label: 'Documents', value: 'Dossier', note: 'agreements, title memorandum, insurance — for members' },
    ]}
    cta={{ label: 'Read the dossier', href: '/resources' }}
  />

  <section class="marketing-container pb-20">
    <div class="grid gap-6 border-t border-[var(--marketing-rule)] pt-8 lg:grid-cols-[1fr_auto] lg:items-center">
      <div>
        <p class="marketing-eyebrow">Still open questions</p>
        <p class="mt-3 max-w-2xl leading-7 text-[var(--marketing-muted)]">
          Reference visuals are illustrative; legal, price, schedule, and construction details are confirmed directly in a briefing. Nothing here is a promise to sell.
        </p>
      </div>
      <a class="marketing-button-primary" href="/briefing">Ask in a briefing</a>
    </div>
  </section>
</MarketingLayout>
```

- [ ] **Step 2: Verify**

Run: `pnpm dev`, open `http://localhost:4321/protections`
Expected: protections ledger + open-questions band.

- [ ] **Step 3: Commit**

```bash
git add src/pages/protections.astro
git commit -m "feat: rebuild protections page with escrow and title safeguards"
```

---

## Task 14: Home page — full-bleed hero, tiers, market proof

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace `src/pages/index.astro`**

```astro
---
export const prerender = true;

import MarketingHero from '@/components/marketing/MarketingHero.astro';
import StorySplit from '@/components/marketing/StorySplit.astro';
import MarketLedger from '@/components/marketing/MarketLedger.astro';
import ImageFrame from '@/components/marketing/ImageFrame.astro';
import { marketingImages } from '@/data/marketing/image-assets';
import { marketingPages } from '@/data/marketing/pages';
import { marketingSite } from '@/data/marketing/site';
import MarketingLayout from '@layout/MarketingLayout.astro';

const page = marketingPages.home;
---

<MarketingLayout seo={page.seo} headerTheme="dark">
  <MarketingHero {...page.hero} secondaryCta={page.secondaryCta} image={marketingImages.homeHero} ratio="16 / 10" />

  <section class="marketing-container py-16 lg:py-24">
    <p class="marketing-eyebrow">The membership ecosystem</p>
    <h2 class="marketing-display mt-3 max-w-2xl text-4xl leading-[1.08] text-[var(--marketing-ink)]">
      Three ways in. One project.
    </h2>
    <div class="mt-10 border-t border-[var(--marketing-rule)]">
      {
        marketingSite.tiers.map((tier, index) => (
          <div class="grid gap-3 border-b border-[var(--marketing-rule)] py-6 lg:grid-cols-[4rem_14rem_1fr_auto] lg:items-baseline">
            <p class="marketing-display text-2xl text-[var(--marketing-gold-600)]">{String(index + 1).padStart(2, '0')}</p>
            <h3 class="marketing-display text-2xl text-[var(--marketing-ink)]">{tier.name}</h3>
            <p class="max-w-xl leading-7 text-[var(--marketing-muted)]">{tier.summary}</p>
            <a class="marketing-button-link" href={tier.cta.href}>{tier.cta.label}</a>
          </div>
        ))
      }
    </div>
  </section>

  <MarketLedger
    eyebrow="Why now"
    title="The gap is measured in hundreds of thousands."
    body="The Swift Project exists because the accommodation deficit is documented — and growing."
    items={[
      { label: 'Accra shortfall', value: '300,000+', note: 'rooms short' },
      { label: 'National shortfall', value: '2,000,000+', note: 'across Ghana' },
      { label: 'Demand growth', value: '6–10%', note: 'year on year' },
      { label: 'Guest mix', value: '~65% experiential', note: 'stays, visits, family' },
    ]}
    cta={{ label: 'See the locations', href: '/locations' }}
  />

  <StorySplit
    eyebrow="Built with certainty"
    title="Factory precision, operated locally."
    body="The P7 capsule is built to one specification, raised in days, and operated by Swift on the 70 / 30 model. Owner-investors hold the asset; the village holds the ground."
    image={marketingImages.diasporaLifestyle}
    reverse
  />

  <section class="marketing-surface-dark bg-[var(--marketing-obsidian-900)]">
    <div class="marketing-container grid items-center gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
      <div>
        <p class="marketing-eyebrow">Begin</p>
        <h2 class="marketing-display mt-3 max-w-lg text-4xl leading-[1.08] text-[var(--marketing-ink-on-dark)]">
          The project starts with a conversation.
        </h2>
        <p class="mt-4 max-w-lg leading-7 text-[var(--marketing-dim-on-dark)]">
          The discovery briefing is encrypted, recorded, and summarised — and it is the door to everything members can read.
        </p>
        <a class="marketing-button-primary mt-8" href="/briefing">Request a briefing</a>
      </div>
      <ImageFrame image={marketingImages.duskCta} ratio="4 / 3" />
    </div>
  </section>
</MarketingLayout>
```

- [ ] **Step 2: Verify**

Run: `pnpm dev`, open `http://localhost:4321/`
Expected: dark obsidian header over the dark hero; serif display headline; tier rows (not cards); ledger; dark CTA band.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: rebuild home page with membership tiers and market proof"
```

---

## Task 15: About and Briefing page restyle

**Files:**
- Modify: `src/pages/about.astro`
- Modify: `src/pages/briefing.astro`

- [ ] **Step 1: Replace `src/pages/about.astro`**

```astro
---
export const prerender = true;

import MarketingHero from '@/components/marketing/MarketingHero.astro';
import MarketLedger from '@/components/marketing/MarketLedger.astro';
import { marketingImages } from '@/data/marketing/image-assets';
import { marketingPages } from '@/data/marketing/pages';
import { marketingSite } from '@/data/marketing/site';
import MarketingLayout from '@layout/MarketingLayout.astro';

const page = marketingPages.about;
---

<MarketingLayout seo={page.seo}>
  <MarketingHero {...page.hero} secondaryCta={page.secondaryCta} image={marketingImages.homeDetail} ratio="4 / 3" />

  <MarketLedger
    eyebrow="Why Swift exists"
    title="A better model for modular hospitality in Ghana."
    body="Swift Holdings builds, operates, and shares the Swift Project — certainty first, for the diaspora returning home."
    items={[
      { label: 'Operator', value: marketingSite.legalName },
      { label: 'Address', value: marketingSite.address },
      { label: 'Accra line', value: marketingSite.phone },
      { label: 'North America', value: marketingSite.phoneNorthAmerica },
      { label: 'Email', value: marketingSite.email },
      { label: 'Partnerships', value: marketingSite.partnershipsEmail },
    ]}
    cta={{ label: 'Request a briefing', href: '/briefing' }}
  />
</MarketingLayout>
```

- [ ] **Step 2: Read the current `src/pages/briefing.astro` and restyle it**

Run: `cat src/pages/briefing.astro`

Keep the existing `BriefingForm` component and its submission behavior untouched (Plan 2 replaces the form itself). Change only the page shell:

```astro
---
export const prerender = true;

import MarketingHero from '@/components/marketing/MarketingHero.astro';
import BriefingForm from '@/components/marketing/BriefingForm.astro';
import { marketingImages } from '@/data/marketing/image-assets';
import { marketingPages } from '@/data/marketing/pages';
import MarketingLayout from '@layout/MarketingLayout.astro';

const page = marketingPages.briefing;
---

<MarketingLayout seo={page.seo}>
  <MarketingHero {...page.hero} image={marketingImages.briefingClose} ratio="4 / 3" />
  <section class="marketing-container py-16 lg:py-24">
    <div class="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
      <div>
        <p class="marketing-eyebrow">What happens next</p>
        <p class="mt-3 max-w-md leading-7 text-[var(--marketing-muted)]">
          Your answers stay private, encrypted, and are used only to prepare a relevant conversation. Briefings are recorded and summarised; nothing is shared.
        </p>
      </div>
      <BriefingForm />
    </div>
  </section>
</MarketingLayout>
```

- [ ] **Step 3: Remove the last violet from the in-use briefing form**

In `src/components/marketing/BriefingForm.astro` line 202, replace:

```astro
class="mt-1 size-4 rounded border-[var(--marketing-rule)] text-[#2A1C46]"
```

with:

```astro
class="mt-1 size-4 rounded border-[var(--marketing-rule)] text-[var(--marketing-gold-600)]"
```

- [ ] **Step 4: Verify**

Run: `pnpm dev`, open `http://localhost:4321/about` and `http://localhost:4321/briefing`
Expected: both pages render with the new shell; the briefing form still submits as before; the consent checkbox is gold, not violet.

- [ ] **Step 5: Commit**

```bash
git add src/pages/about.astro src/pages/briefing.astro src/components/marketing/BriefingForm.astro
git commit -m "feat: restyle about and briefing pages"
```

---

## Task 16: Social card, favicon, manifest

**Files:**
- Modify: `scripts/prepare-marketing-images.mjs`
- Modify: `public/icon.svg`
- Modify: `public/manifest.webmanifest`

- [ ] **Step 1: Read and update the social card text**

Run: `grep -n "Swift\|SWIFT" scripts/prepare-marketing-images.mjs`

Replace every brand text occurrence in the SVG template with `THE SWIFT PROJECT` (keep the `>ILLUSTRATIVE REFERENCE</text>` element unchanged — the foundation test depends on it).

- [ ] **Step 2: Regenerate the social card**

Run: `pnpm images:prepare`
Expected: `public/social.png` regenerated showing "THE SWIFT PROJECT" + "ILLUSTRATIVE REFERENCE" watermark.

- [ ] **Step 3: Replace `public/icon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#171719"/>
  <rect x="14" y="14" width="36" height="36" rx="4" fill="none" stroke="#D6AC7A" stroke-width="2.5"/>
  <path d="M24 34 L32 22 L40 34" fill="none" stroke="#E1BE92" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

- [ ] **Step 4: Update `public/manifest.webmanifest`**

Change the `name` and `short_name` values to `The Swift Project`; update `icons` `src` values to match existing files if needed (do not rename existing icons — just the manifest name fields).

- [ ] **Step 5: Verify**

Run: `pnpm test && pnpm astro check`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add scripts/prepare-marketing-images.mjs public/social.png public/icon.svg public/manifest.webmanifest
git commit -m "feat: rebrand social card, favicon, and manifest"
```

---

## Task 17: Full build, visual QA, deploy

**Files:** none (verification).

- [ ] **Step 1: Format check**

Run: `pnpm format:check`
Expected: PASS. If prettier reports files, run `pnpm format:fix` and review the diff.

- [ ] **Step 2: Full test + build**

Run: `pnpm test && pnpm build`
Expected: PASS — all vitest suites green (calculator, locations, pathways, documents, no-forbidden-strings, foundation, image manifest) and `astro build` completes with no errors.

- [ ] **Step 3: Visual QA against the craft rules**

Run: `pnpm preview`, then walk every route. Checklist (each must hold):

- [ ] No three-equal-card grids anywhere; compositions are asymmetric (split, ledger, timeline).
- [ ] Cormorant Garamond display + Manrope body loaded (no system-font fallback visible).
- [ ] Real photography on every hero; every image carries an `Illustrative reference` label.
- [ ] One serif moment per section; eyebrows restrained (one per 2–3 sections).
- [ ] CTAs are gold gradient (owner path) or platinum (Ecosystem Fund only); no violet anywhere.
- [ ] Hairlines and tabular numerals in every ledger; no badge stacks or marquees.
- [ ] `/accra` and `/market-insights` redirect to `/locations`.
- [ ] No "80/20", "Hamilton", or "2A1C46" in any rendered page (source of truth: `pnpm test`).

- [ ] **Step 4: Commit any QA fixes**

```bash
git add -A
git commit -m "fix: phase 2 visual QA corrections"
```

(If nothing changed, skip this step.)

- [ ] **Step 5: Deploy**

Push to `main` so Cloudflare Pages publishes the Phase 2 public site:

```bash
git push origin main
```

Verify `https://swiftholdings.pages.dev/` renders the new home page (dark hero, serif headline, gold CTA) and `/locations` resolves.

---

## Self-Review Notes (post-write fixes are applied inline)

- The `no-forbidden-strings.test.ts` file list includes four data files created in later tasks; the plan states explicitly that the test stays red until Task 10 completes — this is intentional and documented in the task.
- `Calculator.client.tsx` uses `React.JSX.Element`; the repo's `tsconfig` sets `jsxImportSource: react`, and React 19 is installed, so the annotation resolves.
- `HubMap` coordinates use a non-null assertion on a constant tuple — safe and typechecked.
- `PathwayBand` uses `ctaStyle` to switch `marketing-button-fund` vs `marketing-button-primary`; both classes exist from Task 1.
- The plan does not touch `StorySplit`, `ProofStrip`, `ConfidenceList`, `NumberedSteps`, or `BriefingForm` internals — they still render with Phase 1 styling. `NumberedSteps` and `ProofStrip` are no longer used by any page after the rebuilds; leave them in place (removal is out of scope for this plan and harmless).

---

## Spec Coverage

| Spec requirement | Task |
| --- | --- |
| Rebrand name + metadata + social card | 2, 3, 16 |
| Obsidian/canvas/gold tokens, no violet | 1 |
| Cormorant Garamond + Manrope | 1 |
| Gold gradient CTA both modes; outline secondary | 1 |
| 10-page architecture + `/accra` → `/locations` | 5, 7–15, 8 |
| Content map (public sections) | 5, 7, 8, 12, 13 |
| 70/30, $50K, 5-phase lock-in, 5-year | 2, 6, 7, 11 |
| Calculator public view ($50K/88%/$132 → $2,440, ≈ $2,450) | 6, 7 |
| Market stats (300K+, 2M+, 6–10%) | 8, 14 |
| Partnership two pathways, differently-colored CTAs | 9 |
| Resources locked rows (real gating in Plan 2) | 10 |
| Three tiers (guest/member/owner-investor) | 2, 14 |
| No 80/20, no Hamilton, no violet | 2 (regression test) |
| Contacts in footer + about | 3, 15 |