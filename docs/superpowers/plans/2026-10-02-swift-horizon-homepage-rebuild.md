# Swift Horizon Homepage Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the approved homepage assembly in `docs/superpowers/brainstorm/2026-10-02-homepage-rebuild/build.html` into the Astro marketing site, replacing the current 13-block index page with the four-movement structure, twelve re-curated warm-climate photographs, and full-bleed grounds.

**Architecture:** Twelve section components under `src/components/marketing/home/`, composed by `src/pages/index.astro`, plus a thirteenth non-section component (`ImageCredits`) and four shared primitives (`SectionShell`, `Plate`, `MovementTag`, `ImageRail`). Each section component owns its own copy inline, verbatim from the approved assembly — `index.astro` passes no copy props, so a section can be read and changed in one place. The primitives absorb the repeated ground/asymmetric-split/disclosure markup. Structured data that a test already pins (`swiftHubs`, `marketingSite.tiers`) is read from its existing module rather than duplicated.

**Tech Stack:** Astro 6, Svelte islands (none needed for this page), Tailwind utility classes over `src/assets/styles/marketing.css`, vitest, sharp image pipeline via `scripts/prepare-marketing-images.mjs`.

**Spec:** `docs/superpowers/specs/2026-10-02-swift-horizon-homepage-design.md`
**Design reference:** `docs/superpowers/brainstorm/2026-10-02-homepage-rebuild/build.html` — the assembled page. This is the source of truth for layout, order and treatment. Read it before starting Task 6.

---

## Environment (read this before running anything)

```bash
# REQUIRED on this machine — default node is v20, astro check/build needs >=22
export PATH="$HOME/.nvm/versions/node/v22.23.2/bin:$PATH"
node -v   # expect v22.23.2
```

- `pnpm dev` **does not work here.** workerd needs macOS 13.5+; this machine is 12.6. Visual QA is done by `pnpm build` then serving `dist/client`.
- `pnpm build` runs `images:validate && astro check && astro build`, so it fails on a bad manifest *and* on type errors. Run `pnpm check` and `pnpm test` separately while iterating.
- **This repo has 10 pre-staged deletions** under `src/pages/downloads/` and `src/pages/support/` from earlier in-flight work. **Never run `git add -A` or a bare `git commit` here.** Every commit in this plan uses an explicit pathspec. Verify with `git diff --cached --name-status | rg -v '^A'` before committing.

---

## File Structure

**Create** — all new, no existing file modified except where noted:

| Path | Responsibility |
|---|---|
| `src/components/marketing/home/SectionShell.astro` | Full-bleed ground band + centred 72rem inner container. The only place ground padding is defined. |
| `src/components/marketing/home/MovementTag.astro` | Roman-numeral movement marker with its trailing hairline rule. |
| `src/components/marketing/home/Plate.astro` | Photograph + gold-tick disclosure caption. Wraps `ImageFrame`. |
| `src/components/marketing/home/ImageRail.astro` | Horizontal scrolling rail of 11 frames with ticks and indices. |
| `src/components/marketing/home/ProblemSection.astro` | Movement I — the problem. |
| `src/components/marketing/home/MechanismSection.astro` | Movement II — yours/away paired states. |
| `src/components/marketing/home/OperationsSection.astro` | Movement II — band plate + five managed services. |
| `src/components/marketing/home/CapsuleSection.astro` | Movement III — P7, 38 m². |
| `src/components/marketing/home/VillageSection.astro` | Movement III — shared village life. |
| `src/components/marketing/home/ModularSection.astro` | Movement III — why modular. |
| `src/components/marketing/home/AcquireSection.astro` | Movement IV — five disclosures. |
| `src/components/marketing/home/AssumptionsSection.astro` | Movement IV — three scenarios. |
| `src/components/marketing/home/NetworkSection.astro` | Movement IV — four hubs. |
| `src/components/marketing/home/DiasporaSection.astro` | Movement IV — between two places. |
| `src/components/marketing/home/WaysSection.astro` | Movement IV — stay/own/partner. |
| `src/components/marketing/home/AskSection.astro` | Movement IV — gold gradient card. |
| `src/components/marketing/home/ImageCredits.astro` | Credits strip listing all twelve photographs. |
| `src/data/marketing/css-contract.test.ts` | Asserts every `marketing-*` class and variable used in source has a definition. |
| `src/data/marketing/navigation.test.ts` | Pins the five-link header and the three demoted footer links. |
| `src/data/marketing/climate.test.ts` | Pins the twelve warm-climate photograph sources and blocks upscaling. |

**Modify:**
- `src/assets/styles/marketing.css` — add the 12 missing definitions and a fixed ground system.
- `src/components/marketing/SiteHeader.astro:34` — wordmark.
- `src/data/marketing/image-manifest.json` — 12 warm-climate sources.
- `src/data/marketing/image-assets.ts` — alt text for the new set.
- `src/pages/index.astro` — full rewrite to compose the components.
- `src/data/marketing/home-copy-guard.test.ts:62` — it asserts `"One standard. Four hubs."` is in `index.astro`; that literal moves to `NetworkSection.astro`.

**Delete:** nothing.

---

### Task 1: Restore the missing design-system definitions

Twelve `marketing-*` classes and variables are used across ~40 files and **defined nowhere**. Text, hairline rules, outline buttons and image captions across the whole marketing site currently render unstyled. This is verified, not suspected:

```
.marketing-button-fund       1 file    --marketing-gold-600       2 files
.marketing-button-outline    3 files   --marketing-gold-700       2 files
.marketing-image-frame       1 file    --marketing-muted         17 files
.marketing-image-label       1 file    --marketing-platinum-200   1 file
.marketing-ledger-label     10 files   --marketing-rule          14 files
.marketing-ledger-row        4 files
.marketing-ledger-value      4 files
```

This task fixes the whole site, not just the homepage. Do it first.

**Files:**
- Create: `src/data/marketing/css-contract.test.ts`
- Modify: `src/assets/styles/marketing.css` (append after line 721)

- [ ] **Step 1: Write the failing contract test**

Create `src/data/marketing/css-contract.test.ts`:

```ts
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC = join(process.cwd(), 'src');
const STYLE_FILES = [
  'src/assets/styles/marketing.css',
  'src/assets/styles/global.css',
];

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(astro|tsx|ts)$/.test(entry)) out.push(full);
  }
  return out;
}

const css = STYLE_FILES.map(p => readFileSync(join(process.cwd(), p), 'utf8')).join('\n');

const definedClasses = new Set(
  [...css.matchAll(/\.(marketing-[a-z0-9-]+)\s*[,{]/g)].map(m => m[1]!)
);
const definedVars = new Set(
  [...css.matchAll(/(--marketing-[a-z0-9-]+)\s*:/g)].map(m => m[1]!)
);

// Custom properties set inline via a style attribute, not declared in a stylesheet.
const INLINE_PROPS = new Set([
  '--marketing-image-desktop-ratio',
  '--marketing-image-mobile-ratio',
]);

function collectUsed() {
  const classes = new Map<string, string[]>();
  const vars = new Map<string, string[]>();
  for (const file of walk(SRC)) {
    const src = readFileSync(file, 'utf8');
    for (const m of src.matchAll(/var\((--marketing-[a-z0-9-]+)\)/g)) {
      const list = vars.get(m[1]!) ?? [];
      list.push(file);
      vars.set(m[1]!, list);
    }
    for (const m of src.matchAll(/(?<![\w-])(marketing-[a-z0-9-]+)/g)) {
      const list = classes.get(m[0]!) ?? [];
      list.push(file);
      classes.set(m[0]!, list);
    }
  }
  return { classes, vars };
}

describe('marketing css contract', () => {
  const { classes, vars } = collectUsed();

  it('every marketing-* class used in source is defined in a stylesheet', () => {
    const missing = [...classes.entries()]
      .filter(([name]) => !definedClasses.has(name) && !definedVars.has(name))
      .map(([name, files]) => `${name} (used in ${files.length} file(s), e.g. ${files[0]})`);
    expect(missing).toEqual([]);
  });

  it('every marketing-* custom property used in source is declared', () => {
    const missing = [...vars.entries()]
      .filter(([name]) => !definedVars.has(name) && !INLINE_PROPS.has(name))
      .map(([name, files]) => `${name} (used in ${files.length} file(s), e.g. ${files[0]})`);
    expect(missing).toEqual([]);
  });
});
```

- [ ] **Step 2: Run it and confirm it fails with the twelve known gaps**

```bash
export PATH="$HOME/.nvm/versions/node/v22.23.2/bin:$PATH"
pnpm test src/data/marketing/css-contract.test.ts
```

Expected: FAIL. The two assertions should list exactly:

```
marketing-button-fund (used in 1 file(s)...)
marketing-button-outline (used in 3 file(s)...)
marketing-image-frame (used in 1 file(s)...)
marketing-image-label (used in 1 file(s)...)
marketing-ledger-label (used in 10 file(s)...)
marketing-ledger-row (used in 4 file(s)...)
marketing-ledger-value (used in 4 file(s)...)
```
and
```
--marketing-gold-600 (used in 2 file(s)...)
--marketing-gold-700 (used in 2 file(s)...)
--marketing-muted (used in 17 file(s)...)
--marketing-platinum-200 (used in 1 file(s)...)
--marketing-rule (used in 14 file(s)...)
```

If the list differs, stop and reconcile — a different list means something else changed and the plan's assumptions are stale.

- [ ] **Step 3: Declare the missing custom properties**

In `src/assets/styles/marketing.css`, inside the existing `:root` block after line 56 (`--marketing-gold-gradient`), add:

```css
  /* Ramp extensions + tokens that were referenced but never declared. */
  --marketing-gold-600: #8A6526;
  --marketing-gold-700: #6E4F22;
  --marketing-platinum-200: #C9CDD6;
  --marketing-muted: #6E6A61;
  --marketing-rule: #D8D3C9;
```

Then in the `body.light-mode` block (which ends at line 704), add the light-mode values for the two that must flip:

```css
  --marketing-gold-600: #C79A3E;
  --marketing-gold-700: #E7C06A;
  --marketing-muted: #3E3A33;
  --marketing-rule: #14110D26;
```

`--marketing-platinum-200` is deliberately mode-independent: it is the Ecosystem Fund accent, which the locked design system fixes at platinum.

- [ ] **Step 4: Append the missing component classes**

Append to the end of `src/assets/styles/marketing.css`:

```css
/* ========================================
   COMPONENT CLASSES — referenced across the marketing surface
   ======================================== */

.marketing-ledger-label {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-variant-numeric: tabular-nums;
  color: var(--marketing-gold-500);
}

.marketing-ledger-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem 1.5rem;
  padding-block: 0.875rem;
  border-bottom: 1px solid var(--marketing-rule);
}

.marketing-ledger-value {
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
  color: var(--marketing-ink);
}

.marketing-image-frame {
  margin: 0;
  overflow: hidden;
  background: var(--marketing-obsidian-800);
}

.marketing-image-frame img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.marketing-image-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding-top: 0.55rem;
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--marketing-dim-on-dark);
}

.marketing-image-label::before {
  content: '';
  width: 5px;
  height: 5px;
  flex: 0 0 auto;
  background: var(--marketing-gold-400);
}

.marketing-button-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1.5rem;
  border: 1px solid var(--marketing-gold-line);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--marketing-ink);
  text-decoration: none;
  transition: border-color 0.2s var(--ease), color 0.2s var(--ease);
}

.marketing-button-outline:hover {
  border-color: var(--marketing-gold-500);
  color: var(--marketing-gold-500);
}

.marketing-button-fund {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1.5rem;
  background: var(--marketing-platinum-200);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #14110d;
  text-decoration: none;
  transition: opacity 0.2s var(--ease);
}

.marketing-button-fund:hover {
  opacity: 0.88;
}
```

- [ ] **Step 5: Run the contract test and the full suite**

```bash
pnpm test src/data/marketing/css-contract.test.ts   # expect 2 passed
pnpm test                                            # expect all pass
```

- [ ] **Step 6: Commit**

```bash
git add src/data/marketing/css-contract.test.ts src/assets/styles/marketing.css
git commit -m "fix(marketing): declare the 7 classes and 5 tokens used but never defined

marketing-muted (17 files), marketing-rule (14) and marketing-ledger-label
(10) were referenced across the marketing surface with no definition, so
body copy, hairlines and gold ledger numerals rendered unstyled sitewide.
Adds a contract test that fails on any future marketing-* name used in
source without a definition.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Fix the ground system

The approved design specifies an exact ground sequence — dark, dark, cream, dark, band+cream, cream ×3, dark ×5, gold. It cannot be expressed today:

- `.marketing-surface-dark` has **no base rule**. In dark mode it is transparent and simply inherits the page background; in light mode it becomes `var(--surface)`, a light grey. The name is a lie and the alternation is accidental.
- In dark mode **no section is distinguished at all** — every band renders on `--bg`.

Homepage grounds must be fixed values that do not invert with the theme toggle. The theme toggle continues to affect chrome (header, footer, form controls); it stops affecting section grounds.

**Files:**
- Modify: `src/assets/styles/marketing.css`

- [ ] **Step 1: Write the failing test**

Append to `src/data/marketing/css-contract.test.ts`:

```ts
describe('homepage grounds', () => {
  it('declares mode-independent ground tokens', () => {
    for (const token of [
      '--ground-obsidian',
      '--ground-canvas',
      '--ground-ink',
      '--ground-ink-dim',
      '--ground-gold',
      '--ground-rule',
    ]) {
      expect(css).toMatch(new RegExp(`${token}\\s*:`));
    }
  });

  it('does not flip the ground tokens in light mode', () => {
    const lightBlock = css.slice(css.indexOf('body.light-mode'));
    for (const token of ['--ground-obsidian', '--ground-canvas', '--ground-ink']) {
      expect(lightBlock).not.toMatch(new RegExp(`${token}\\s*:`));
    }
  });

  it('gives .marketing-surface-dark a base rule independent of light mode', () => {
    const base = css.match(/^\.marketing-surface-dark\s*\{[^}]*\}/m);
    expect(base).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run and confirm it fails**

```bash
pnpm test src/data/marketing/css-contract.test.ts
```

Expected: FAIL on the ground-token assertions.

- [ ] **Step 3: Add the ground tokens**

In `:root`, after the `--marketing-rule` line added in Task 1 Step 3:

```css
  /* Section grounds — fixed, deliberately NOT flipped by the theme toggle.
     The approved homepage rhythm depends on a fixed dark/cream sequence. */
  --ground-obsidian: #0F0E0D;
  --ground-canvas: #F4EFE6;
  --ground-ink: #EDE7DC;
  --ground-ink-dim: rgba(237, 231, 220, 0.66);
  --ground-gold: #D6AC7A;
  --ground-rule: rgba(237, 231, 220, 0.14);
  --ground-ink-on-canvas: #14141A;
  --ground-ink-dim-on-canvas: rgba(20, 20, 26, 0.68);
  --ground-rule-on-canvas: rgba(20, 20, 26, 0.14);
```

- [ ] **Step 4: Add base surface rules**

Replace the existing light-mode-only `.marketing-surface-dark` rule at line ~713 with a base rule plus the light-mode override:

```css
.marketing-surface-dark {
  background: var(--ground-obsidian);
  color: var(--ground-ink);
}

.marketing-surface-canvas {
  background: var(--ground-canvas);
  color: var(--ground-ink-on-canvas);
}

body.light-mode .marketing-surface-dark {
  background-color: var(--ground-obsidian) !important;
  color: var(--ground-ink) !important;
}

body.light-mode .marketing-surface-canvas {
  background-color: var(--ground-canvas) !important;
  color: var(--ground-ink-on-canvas) !important;
}
```

The `!important` on the light-mode rules is deliberate and necessary: `MarketingLayout.astro:95-118` writes inline `style` attributes on `<body>` via the theme toggle script, which would otherwise win.

- [ ] **Step 5: Run tests and build**

```bash
pnpm test
pnpm check
```

Expected: all tests pass; `astro check` reports 0 errors.

- [ ] **Step 6: Commit**

```bash
git add src/assets/styles/marketing.css src/data/marketing/css-contract.test.ts
git commit -m "fix(marketing): make section grounds fixed rather than mode-flipped

.marketing-surface-dark had no base rule, so in dark mode no band was
distinguished and in light mode the 'dark' surface rendered light. The
approved homepage rhythm needs a fixed dark/cream sequence, so grounds
become --ground-* tokens that the theme toggle does not flip.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Fix the wordmark and close the test gap

`SiteHeader.astro:34` renders `THE SWIFT PROJECT`. The footer says `SWIFT HORIZON` and `marketingSite.name` is `'SWIFT HORIZON'`. Three strings for one brand. `home-copy-guard.test.ts:53` checks the footer and deliberately does not check the header, which is how the mismatch survived.

**Files:**
- Modify: `src/components/marketing/SiteHeader.astro:34`
- Modify: `src/data/marketing/home-copy-guard.test.ts`

- [ ] **Step 1: Write the failing test**

Add to `src/data/marketing/home-copy-guard.test.ts`:

```ts
it('uses the canonical wordmark in the header', () => {
  const header = readFileSync(
    join(process.cwd(), 'src/components/marketing/SiteHeader.astro'),
    'utf8',
  );

  expect(header).toContain('SWIFT');
  expect(header).toContain('HORIZON');
  expect(header).not.toContain('THE SWIFT PROJECT');
});

it('does not reference the retired brand anywhere customer-facing', () => {
  for (const file of [
    'src/components/marketing/SiteHeader.astro',
    'src/components/marketing/SiteFooter.astro',
    'src/layout/MarketingLayout.astro',
  ]) {
    expect(readFileSync(join(process.cwd(), file), 'utf8')).not.toContain('THE SWIFT PROJECT');
  }
});
```

Add the import if the file lacks it:

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
```

- [ ] **Step 2: Run and confirm it fails**

```bash
pnpm test src/data/marketing/home-copy-guard.test.ts
```

Expected: FAIL on `uses the canonical wordmark in the header`, reporting the string `THE SWIFT PROJECT`.

- [ ] **Step 3: Fix the wordmark**

In `src/components/marketing/SiteHeader.astro:34`, replace:

```astro
THE SWIFT <span class="text-[var(--marketing-gold-500)]">PROJECT</span>
```

with:

```astro
SWIFT <span class="text-[var(--marketing-gold-500)]">HORIZON</span>
```

- [ ] **Step 4: Run and confirm it passes**

```bash
pnpm test src/data/marketing/home-copy-guard.test.ts
pnpm test
```

- [ ] **Step 5: Commit**

```bash
git add src/components/marketing/SiteHeader.astro src/data/marketing/home-copy-guard.test.ts
git commit -m "fix(brand): Swift Horizon wordmark in header, with a test that covers it

The header said THE SWIFT PROJECT while the footer and marketingSite.name
said SWIFT HORIZON. home-copy-guard asserted the footer but not the header,
which is how the mismatch survived. The test now covers both.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Trim the navigation to five links

Spec §7 requires five links in the header, with `Protections`, `About` and `Resources` moved to the footer. `marketingSite.navigation` currently carries eight, which does not fit at 1440px alongside the CTA and the theme toggle.

**Files:**
- Modify: `src/data/marketing/site.ts:10-19`
- Modify: `src/components/marketing/SiteFooter.astro`
- Create: `src/data/marketing/navigation.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/data/marketing/navigation.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { marketingSite } from './site';

describe('primary navigation', () => {
  it('has exactly five links', () => {
    expect(marketingSite.navigation).toHaveLength(5);
  });

  it('keeps the five approved destinations in order', () => {
    expect(marketingSite.navigation.map(item => item.href)).toEqual([
      '/village',
      '/how-it-works',
      '/ownership',
      '/locations',
      '/partnership',
    ]);
  });

  it('no longer links Protections, About or Resources from the header', () => {
    const hrefs = marketingSite.navigation.map(item => item.href);
    for (const href of ['/protections', '/about', '/resources']) {
      expect(hrefs).not.toContain(href);
    }
  });

  it('retains Protections, About and Resources in the footer', () => {
    const footer = readFileSync(
      join(process.cwd(), 'src/components/marketing/SiteFooter.astro'),
      'utf8',
    );
    for (const href of ['/protections', '/about', '/resources']) {
      expect(footer).toContain(`href="${href}"`);
    }
  });
});
```

- [ ] **Step 2: Run and confirm it fails**

```bash
pnpm test src/data/marketing/navigation.test.ts
```

Expected: FAIL on `has exactly five links` — reports 8.

- [ ] **Step 3: Trim the navigation array**

In `src/data/marketing/site.ts`, replace lines 10-19 with:

```ts
  navigation: [
    { href: '/village', label: 'The Village' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/ownership', label: 'Ownership' },
    { href: '/locations', label: 'Locations' },
    { href: '/partnership', label: 'Partnership' },
  ],
```

`Ownership & Financials` becomes `Ownership` because the header no longer has room for the qualifier, and the full title still appears on `/ownership` itself.

- [ ] **Step 4: Add the three demoted links to the footer**

In `src/components/marketing/SiteFooter.astro`, the footer link list at lines 26-30 currently holds five hardcoded anchors. Add three more:

```astro
        <a href="/protections">Protections</a>
        <a href="/about">About</a>
        <a href="/resources">Resources</a>
```

Place them after the existing `/partnership` anchor so the footer's reading order stays Explore → Participate → Contact.

- [ ] **Step 5: Run and confirm it passes**

```bash
pnpm test src/data/marketing/navigation.test.ts
pnpm test
```

Expected: all pass. `brand.test.ts` and `home-copy-guard.test.ts` read `marketingSite` but do not assert the navigation length, so neither breaks.

- [ ] **Step 6: Commit**

```bash
git add src/data/marketing/site.ts src/components/marketing/SiteFooter.astro src/data/marketing/navigation.test.ts
git commit -m "feat(nav): trim the header to five links, demote three to the footer

Eight links plus a CTA plus a theme toggle does not fit at 1440px. Spec
section 7 moves Protections, About and Resources to the footer, where all
three remain reachable.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

### Task 5: Re-curate the photographs through the manifest

The twelve approved sources are cold-climate — `homeHero` resolves to `prefab_2_2048x1365.jpg`, a snow-covered prefab. Eleven sources are replaced with warm-climate files from `~/Desktop/PREFAB`. `villageBanner` and `duskCta` keep their current files, which are already correct.

Do **not** hand-copy files. `pnpm images:prepare` owns generation from `image-manifest.json`, and `pnpm build` runs `images:validate` first.

**Files:**
- Modify: `src/data/marketing/image-manifest.json`
- Modify: `src/data/marketing/image-assets.ts`

- [ ] **Step 1: Write the failing test**

Create `src/data/marketing/climate.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const manifest = JSON.parse(
  readFileSync(join(process.cwd(), 'src/data/marketing/image-manifest.json'), 'utf8'),
);

describe('marketing photography is Ghana-appropriate', () => {
  it('has twelve images', () => {
    expect(manifest.images).toHaveLength(12);
  });

  it('has twelve distinct source files', () => {
    const sources = manifest.images.map((i: { source: string }) => i.source);
    expect(new Set(sources).size).toBe(12);
  });

  it('uses only warm-climate sources', () => {
    const approved = new Set([
      'prefab_14_1920x1833.jpg',
      'prefab_16_2400x1200.jpg',
      'prefab_17_2048x1365.jpg',
      'prefab_22_1600x1106.jpg',
      'prefab_23_1600x1095.jpg',
      'prefab_25_1580x1053.jpg',
      'prefab_26_1600x996.jpg',
      'prefab_27_1600x995.jpg',
      'prefab_28_1600x995.jpg',
      'prefab_29_1500x1051.jpg',
      'prefab_31_1500x1051.jpg',
      'prefab_container_34_1600x1069.jpg',
    ]);

    for (const image of manifest.images) {
      expect(approved, `${image.id} uses ${image.source}`).toContain(image.source);
    }
  });

  it('never upscales a derivative beyond its source width', () => {
    for (const image of manifest.images) {
      const sourceWidth = Number(/(\d+)x(\d+)\.jpg$/.exec(image.source)?.[1]);
      expect(sourceWidth).toBeGreaterThan(0);
      for (const d of image.derivatives) {
        expect(
          d.width,
          `${image.id}/${d.name} upscales ${sourceWidth}px source`,
        ).toBeLessThanOrEqual(sourceWidth);
      }
    }
  });

  it('declares an illustrative-reference label and alt on every image', () => {
    for (const image of manifest.images) {
      expect(image.label).toBe('Illustrative reference');
      expect(image.alt).toMatch(/^Illustrative reference of /);
    }
  });
});
```

- [ ] **Step 2: Run and confirm it fails**

```bash
pnpm test src/data/marketing/climate.test.ts
```

Expected: FAIL on `uses only warm-climate sources`, naming `homeHero uses prefab_2_2048x1365.jpg` and nine others.

- [ ] **Step 3: Rewrite the manifest sources and derivative dimensions**

Edit `src/data/marketing/image-manifest.json` so `images` reads:

```json
{
  "images": [
    {
      "id": "homeHero",
      "source": "prefab_16_2400x1200.jpg",
      "label": "Illustrative reference",
      "alt": "Illustrative reference of a low-profile timber residence in savanna grassland at dusk",
      "focalPoint": "centre",
      "derivatives": [
        { "name": "home-hero-desktop", "width": 2400, "height": 1200 },
        { "name": "home-hero-mobile", "width": 1200, "height": 1500 }
      ]
    },
    {
      "id": "villageStory",
      "source": "prefab_26_1600x996.jpg",
      "label": "Illustrative reference",
      "alt": "Illustrative reference of a timber and steel residence in dry ornamental grass",
      "focalPoint": "centre",
      "derivatives": [{ "name": "village-story", "width": 1600, "height": 1000 }]
    },
    {
      "id": "ownershipStory",
      "source": "prefab_28_1600x995.jpg",
      "label": "Illustrative reference",
      "alt": "Illustrative reference of a black-framed residence opening onto a gravel court",
      "focalPoint": "centre",
      "derivatives": [{ "name": "ownership-story", "width": 1600, "height": 1000 }]
    },
    {
      "id": "diasporaLifestyle",
      "source": "prefab_22_1600x1106.jpg",
      "label": "Illustrative reference",
      "alt": "Illustrative reference of a residence opening onto a shared pool deck",
      "focalPoint": "centre",
      "derivatives": [{ "name": "diaspora-lifestyle", "width": 1600, "height": 1100 }]
    },
    {
      "id": "villageBanner",
      "source": "prefab_29_1500x1051.jpg",
      "label": "Illustrative reference",
      "alt": "Illustrative reference of a timber pavilion residence with full-height glazing",
      "focalPoint": "centre",
      "derivatives": [{ "name": "village-banner", "width": 1500, "height": 1050 }]
    },
    {
      "id": "homeDetail",
      "source": "prefab_17_2048x1365.jpg",
      "label": "Illustrative reference",
      "alt": "Illustrative reference of a low residence set in open grassland",
      "focalPoint": "centre",
      "derivatives": [{ "name": "home-detail", "width": 2000, "height": 1350 }]
    },
    {
      "id": "confidenceFeature",
      "source": "prefab_25_1580x1053.jpg",
      "label": "Illustrative reference",
      "alt": "Illustrative reference of a timber residence among palms at dusk",
      "focalPoint": "centre",
      "derivatives": [{ "name": "confidence-feature", "width": 1580, "height": 1050 }]
    },
    {
      "id": "ownershipPage",
      "source": "prefab_27_1600x995.jpg",
      "label": "Illustrative reference",
      "alt": "Illustrative reference of a long dark minimal residence",
      "focalPoint": "centre",
      "derivatives": [{ "name": "ownership-page", "width": 1600, "height": 1000 }]
    },
    {
      "id": "architectureGallery",
      "source": "prefab_23_1600x1095.jpg",
      "label": "Illustrative reference",
      "alt": "Illustrative reference of a residence beneath large mature trees",
      "focalPoint": "centre",
      "derivatives": [{ "name": "architecture-gallery", "width": 1600, "height": 1100 }]
    },
    {
      "id": "warmDetail",
      "source": "prefab_14_1920x1833.jpg",
      "label": "Illustrative reference",
      "alt": "Illustrative reference of a weathered steel and timber residence",
      "focalPoint": "centre",
      "derivatives": [{ "name": "warm-detail", "width": 1400, "height": 1340 }]
    },
    {
      "id": "duskCta",
      "source": "prefab_container_34_1600x1069.jpg",
      "label": "Illustrative reference",
      "alt": "Illustrative reference of a dark-clad residence beneath mature trees",
      "focalPoint": "centre",
      "derivatives": [
        { "name": "dusk-cta-desktop", "width": 1600, "height": 1070 },
        { "name": "dusk-cta-mobile", "width": 1100, "height": 1370 }
      ]
    },
    {
      "id": "briefingClose",
      "source": "prefab_31_1500x1051.jpg",
      "label": "Illustrative reference",
      "alt": "Illustrative reference of a warm timber residence in tropical planting",
      "focalPoint": "centre",
      "derivatives": [{ "name": "briefing-close", "width": 1500, "height": 1050 }]
    }
  ]
}
```

Derivative widths never exceed their source width, so `sharp` crops rather than upscales.

- [ ] **Step 4: Regenerate and validate the images**

```bash
pnpm images:prepare
pnpm images:validate
```

Expected: `images:validate` reports zero failures. If it reports `wrong dimensions`, the manifest and the on-disk derivatives disagree — re-run `pnpm images:prepare` and if it still fails, delete `src/assets/images/marketing/*.{jpg,webp}` and re-run.

- [ ] **Step 5: Update the alt text in `image-assets.ts`**

In `src/data/marketing/image-assets.ts`, replace each `alt:` string with the manifest's alt for that key. The mapping is `homeHero`, `villageStory`, `ownershipStory`, `diasporaLifestyle`, `villageBanner`, `homeDetail`, `confidenceFeature`, `ownershipPage`, `architectureGallery`, `warmDetail`, `duskCta`, `briefingClose`. Leave every `label: 'Illustrative reference'` untouched.

- [ ] **Step 6: Run tests**

```bash
pnpm test src/data/marketing/climate.test.ts
pnpm test src/data/marketing/image-manifest.test.ts
pnpm test
```

- [ ] **Step 7: Commit**

```bash
git add src/data/marketing/image-manifest.json src/data/marketing/image-assets.ts src/data/marketing/climate.test.ts src/assets/images/marketing
git commit -m "feat(images): re-curate the twelve marketing photographs for Ghana

Nine of the twelve approved sources were cold-climate: homeHero resolved
to a snow-covered prefab, others to conifer and Adirondack-chair imagery.
Replaces them with warm-climate files filtered from ~/Desktop/PREFAB, and
adds a test pinning the approved source set so cold-climate stock cannot
re-enter the manifest.

Derivative dimensions are set per source so sharp crops rather than
upscales.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Build the shared homepage primitives

Four components absorb markup repeated across every section. Nothing user-visible changes in this task — it is pure extraction, which keeps Tasks 7–10 small.

**Files:**
- Create: `src/components/marketing/home/SectionShell.astro`
- Create: `src/components/marketing/home/MovementTag.astro`
- Create: `src/components/marketing/home/Plate.astro`
- Create: `src/components/marketing/home/ImageRail.astro`

- [ ] **Step 1: Create `SectionShell.astro`**

The only place ground padding is defined. `tone` selects the ground.

```astro
---
interface Props {
  tone: 'obsidian' | 'canvas';
  class?: string;
}

const { tone, class: className = '' } = Astro.props;

const ground = tone === 'canvas' ? 'marketing-surface-canvas' : 'marketing-surface-dark';
---

<section class:list={['marketing-home-section', ground, className]}>
  <div class="marketing-container">
    <slot />
  </div>
</section>

<style>
  .marketing-home-section {
    padding-block: clamp(2.25rem, 5vh, 4rem);
    border-top: 1px solid var(--ground-rule);
  }

  .marketing-surface-canvas {
    border-top-color: var(--ground-rule-on-canvas);
  }

  @media (max-width: 900px) {
    .marketing-home-section {
      padding-block: clamp(2rem, 4vh, 3rem);
    }
  }
</style>
```

- [ ] **Step 2: Create `MovementTag.astro`**

```astro
---
interface Props {
  numeral: string;
  label?: string;
}

const { numeral, label } = Astro.props;
---

<p class="movement-tag">
  <span class="numeral">{numeral}</span>
  {label && <span class="label">{label}</span>}
</p>

<style>
  .movement-tag {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 0 0 1.5rem;
    font-family: var(--font-display);
    font-size: 1.125rem;
    letter-spacing: 0.16em;
    color: var(--gold-400);
    font-variant-numeric: tabular-nums;
  }

  .movement-tag::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--marketing-gold-line);
  }

  .label {
    font-family: var(--font-sans);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-secondary);
  }
</style>
```

- [ ] **Step 3: Create `Plate.astro`**

Wraps `ImageFrame` and adds the gold-tick disclosure caption the approved design specifies. `ImageFrame` already renders `{image.label}` into a `<figcaption class="marketing-image-label">`, which Task 1 styled with the tick via `::before` — so this component adds only the descriptive suffix.

```astro
---
import ImageFrame from '@/components/marketing/ImageFrame.astro';
import type { MarketingImageAsset } from '@/data/marketing/image-assets';

interface Props {
  image: MarketingImageAsset;
  ratio?: string;
  caption?: string;
  loading?: 'eager' | 'lazy';
  class?: string;
}

const { image, ratio = '3 / 2', caption, loading = 'lazy', class: className = '' } = Astro.props;
---

<figure class:list={['plate', className]}>
  <ImageFrame image={image} ratio={ratio} loading={loading} />
  {caption && <span class="caption-note">{caption}</span>}
</figure>

<style>
  .plate {
    margin: 0;
  }

  .caption-note {
    display: block;
    margin-top: 0.45rem;
    font-size: 0.6875rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
</style>
```

- [ ] **Step 4: Create `ImageRail.astro`**

The rail is the approved disclosure device — eleven frames, one place, a tick each. It is horizontally scrollable with scroll-snap so it degrades on narrow viewports without becoming a grid.

```astro
---
import type { MarketingImageAsset } from '@/data/marketing/image-assets';

interface RailFrame {
  image: MarketingImageAsset;
  caption: string;
}

interface Props {
  frames: RailFrame[];
  heading?: string;
}

const { frames, heading = 'The capsule, and the village around it.' } = Astro.props;
---

<div class="rail-section">
  <div class="marketing-container">
    <div class="rail-head">
      <p class="rail-title">{heading}</p>
      <p class="rail-count">
        {frames.length} images &middot; all illustrative reference
      </p>
    </div>

    <div class="rail" tabindex="0" role="group" aria-label="Illustrative reference photographs">
      {
        frames.map((frame, index) => (
          <figure class="rail-frame">
            <img
              src={frame.image.desktop.webp.src}
              alt={frame.image.alt}
              width={frame.image.desktop.webp.width}
              height={frame.image.desktop.webp.height}
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <span class="tick" aria-hidden="true" />
              <span class="idx">{String(index + 1).padStart(2, '0')}</span>
              <span class="cap">{frame.caption}</span>
            </figcaption>
          </figure>
        ))
      }
    </div>

    <p class="rail-disclosure">
      Every photograph above is illustrative reference material, not a completed
      Swift Horizon capsule.
    </p>
  </div>
</div>

<style>
  .rail-section {
    background: var(--marketing-obsidian-900);
    border-block: 1px solid var(--ground-rule);
    padding-block: clamp(2rem, 4vh, 3rem);
  }

  .rail-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1.5rem;
    margin-bottom: 1.25rem;
  }

  .rail-title {
    margin: 0;
    font-family: var(--font-display);
    font-size: 1.25rem;
  }

  .rail-count {
    margin: 0;
    font-size: 0.6875rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-low);
  }

  .rail {
    display: flex;
    gap: 0.75rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-bottom: 0.5rem;
  }

  .rail-frame {
    margin: 0;
    flex: 0 0 240px;
    scroll-snap-align: start;
  }

  .rail-frame img {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
  }

  .rail-frame figcaption {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.55rem;
    font-size: 0.6875rem;
    letter-spacing: 0.08em;
    color: var(--text-low);
  }

  .tick {
    width: 5px;
    height: 5px;
    flex: 0 0 auto;
    background: var(--accent-muted);
  }

  .idx {
    color: var(--accent-muted);
    font-variant-numeric: tabular-nums;
  }

  .rail-disclosure {
    margin: 1rem 0 0;
    font-size: 0.6875rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-low);
  }
</style>
```

- [ ] **Step 5: Verify the primitives compile**

```bash
pnpm check
```

Expected: 0 errors. The components are not yet imported anywhere, so `astro check` will still resolve them — it checks every file under `src/`.

- [ ] **Step 6: Commit**

```bash
git add src/components/marketing/home
git commit -m "feat(home): shared primitives — ground shell, movement tag, plate, image rail

SectionShell owns ground padding in one place so Tasks 7–10 only contain
content. ImageRail carries the approved disclosure device: eleven frames
in one scroll-snap rail, each with a gold tick, plus one disclosure line.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Port Movement I and II

Four sections. Copy is verbatim from the approved assembly and must not be reworded.

**Files:**
- Create: `src/components/marketing/home/ProblemSection.astro`
- Create: `src/components/marketing/home/MechanismSection.astro`
- Create: `src/components/marketing/home/OperationsSection.astro`

- [ ] **Step 1: Write `ProblemSection.astro`**

Treatment B — canvas ground, Cormorant display, asymmetric split with the image in the wider column.

```astro
---
import MovementTag from './MovementTag.astro';
import Plate from './Plate.astro';
import SectionShell from './SectionShell.astro';
import { marketingImages } from '@/data/marketing/image-assets';

const image = marketingImages.villageStory;
---

<SectionShell tone="canvas">
  <MovementTag numeral="I" />

  <div class="split">
    <div class="copy">
      <p class="marketing-eyebrow">Owning back home shouldn't become a second job</p>
      <h2 class="statement">
        You wanted a place in Ghana. Not <em>another construction project</em> to manage
        from abroad.
      </h2>
      <p class="body">
        The land. The contractor. The materials. The delays. The revised material list
        that arrives after you've paid. The calls across time zones. The trip home just
        to check what is going on.
      </p>
      <p class="body">
        For too many of us abroad, the dream became a remote job with no salary.
      </p>
      <p class="body">
        We built Swift Horizon around a different question: what if you could own the
        finished place — without personally managing everything it takes to build and
        run it?
      </p>
      <p class="moment">The dream stopped being a job. It started being an asset.</p>
    </div>

    <Plate image={image} ratio="4 / 5" caption="Dry grass" />
  </div>
</SectionShell>

<style>
  .split {
    display: grid;
    grid-template-columns: 0.85fr 1.15fr;
    gap: clamp(1.75rem, 4vw, 3.5rem);
    align-items: start;
  }

  @media (max-width: 900px) {
    .split {
      grid-template-columns: 1fr;
    }
  }

  .statement {
    margin: 0 0 1.25rem;
    max-width: 20ch;
    font-family: var(--font-display);
    font-size: clamp(1.6875rem, 3.3vw, 2.75rem);
    font-weight: 400;
    line-height: 1.04;
    letter-spacing: -0.02em;
    color: var(--ground-ink-on-canvas);
  }

  .statement em {
    font-weight: 300;
    font-style: italic;
  }

  .body {
    margin: 0 0 0.875rem;
    max-width: 60ch;
    font-size: 1rem;
    line-height: 1.58;
    color: var(--ground-ink-dim-on-canvas);
  }

  .moment {
    margin: 1.25rem 0 0;
    max-width: 34ch;
    font-family: var(--font-display);
    font-style: italic;
    font-size: clamp(1.125rem, 1.7vw, 1.4375rem);
    line-height: 1.28;
    color: var(--ground-gold);
  }
</style>
```

- [ ] **Step 2: Write `MechanismSection.astro`**

Treatment C — obsidian ground, sticky statement left, paired states right.

```astro
---
import MovementTag from './MovementTag.astro';
import SectionShell from './SectionShell.astro';
---

<SectionShell tone="obsidian">
  <MovementTag numeral="II" label="The mechanism" />

  <div class="split">
    <div class="sticky">
      <h2 class="statement">
        Yours when you're home. <em>Productive</em> when you're not.
      </h2>
      <p class="body">
        You don't have to choose between a place for yourself and an asset that works.
        It does both.
      </p>
    </div>

    <div class="pair">
      <article>
        <div class="state">
          <span class="n">01</span>
          <h3>When you're in Ghana</h3>
        </div>
        <p>
          Come home to your own fully furnished residence. Reserve your dates —
          December, family weeks, remote-work months. Your clothes stay in the wardrobe.
          Your things stay where you left them.
        </p>
      </article>
      <article>
        <div class="state">
          <span class="n">02</span>
          <h3>When you're away</h3>
        </div>
        <p>
          Your residence joins the village's managed hospitality operation. Guests,
          pricing, housekeeping, maintenance — handled by our on-ground team.
        </p>
      </article>
    </div>
  </div>
</SectionShell>

<style>
  .split {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: clamp(1.75rem, 4vw, 3.5rem);
    align-items: start;
  }

  .sticky {
    position: sticky;
    top: 92px;
  }

  @media (max-width: 900px) {
    .split {
      grid-template-columns: 1fr;
    }

    .sticky {
      position: static;
    }
  }

  .statement {
    margin: 0 0 1rem;
    max-width: 20ch;
    font-size: clamp(1.4375rem, 2.6vw, 2.125rem);
    font-weight: 700;
    line-height: 1.12;
    letter-spacing: -0.028em;
  }

  .statement em {
    font-family: var(--font-display);
    font-weight: 300;
    font-style: italic;
  }

  .body {
    margin: 0;
    max-width: 46ch;
    font-size: 1rem;
    line-height: 1.58;
    color: var(--ground-ink-dim);
  }

  .pair {
    border-top: 1px solid var(--ground-rule);
  }

  .pair article {
    padding-block: 1.125rem;
    border-bottom: 1px solid var(--ground-rule);
  }

  .state {
    display: flex;
    align-items: center;
    gap: 0.7rem;
  }

  .n {
    font-family: var(--font-display);
    font-size: 1.125rem;
    color: var(--ground-gold);
    font-variant-numeric: tabular-nums;
  }

  .state h3 {
    margin: 0;
    font-size: 1.0625rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .pair p {
    margin: 0.4rem 0 0 2.25rem;
    max-width: 46ch;
    font-size: 0.9375rem;
    line-height: 1.58;
    color: var(--ground-ink-dim);
  }
</style>
```

- [ ] **Step 3: Write `OperationsSection.astro`**

Treatment B — full-bleed band plate, then canvas ground with the five-service ledger. This is the only section with a band plate, which is what makes it the single interruption before the product run.

```astro
---
import MovementTag from './MovementTag.astro';
import SectionShell from './SectionShell.astro';
import { marketingImages } from '@/data/marketing/image-assets';

const image = marketingImages.duskCta;

const services = [
  { n: '01', title: 'Distribution & booking', body: 'Your residence listed across the channels guests actually use.' },
  { n: '02', title: 'Dynamic pricing', body: 'Rates tuned to season and demand, so the calendar earns its keep.' },
  { n: '03', title: 'Guest operations', body: 'Check-in, support, standards — handled on the ground, not from abroad.' },
  { n: '04', title: 'Housekeeping & maintenance', body: 'Turnovers, linen, preventive care. The unglamorous work, done.' },
  { n: '05', title: 'Owner portal', body: 'Bookings, statements, and your own reservations — visible anytime.' },
];
---

<figure class="band">
  <img
    src={image.desktop.webp.src}
    alt={image.alt}
    width={image.desktop.webp.width}
    height={image.desktop.webp.height}
    loading="lazy"
    decoding="async"
  />
  <figcaption>Village operations</figcaption>
</figure>

<SectionShell tone="canvas">
  <MovementTag numeral="II" />

  <div class="split">
    <div>
      <h2 class="statement">
        You own the asset. <em>We run the experience</em> around it.
      </h2>
      <p class="body">
        While you're away, the village operates as a hospitality business — and your
        residence is part of it.
      </p>
      <p class="moment">So ownership never becomes another full-time job.</p>
    </div>

    <ul class="ledger">
      {
        services.map(service => (
          <li>
            <span class="n">{service.n}</span>
            <div>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
            </div>
          </li>
        ))
      }
    </ul>
  </div>
</SectionShell>

<style>
  .band {
    position: relative;
    margin: 0;
  }

  .band img {
    display: block;
    width: 100%;
    height: min(40vh, 340px);
    object-fit: cover;
  }

  .band figcaption {
    position: absolute;
    inset: auto 0 0;
    padding: 0.9rem var(--gutter);
    background: linear-gradient(transparent, rgb(15 14 13 / 0.72));
    font-size: 0.6875rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgb(244 239 230 / 0.7);
  }

  .split {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: clamp(1.75rem, 4vw, 3.5rem);
    align-items: start;
  }

  @media (max-width: 900px) {
    .split {
      grid-template-columns: 1fr;
    }
  }

  .statement {
    margin: 0 0 1rem;
    max-width: 20ch;
    font-family: var(--font-display);
    font-size: clamp(1.6875rem, 3.3vw, 2.75rem);
    font-weight: 400;
    line-height: 1.04;
    letter-spacing: -0.02em;
    color: var(--ground-ink-on-canvas);
  }

  .statement em {
    font-weight: 300;
    font-style: italic;
  }

  .body {
    margin: 0 0 1rem;
    max-width: 60ch;
    font-size: 1rem;
    line-height: 1.58;
    color: var(--ground-ink-dim-on-canvas);
  }

  .moment {
    margin: 1.25rem 0 0;
    max-width: 34ch;
    font-family: var(--font-display);
    font-style: italic;
    font-size: clamp(1.125rem, 1.7vw, 1.4375rem);
    line-height: 1.28;
    color: var(--ground-gold);
  }

  .ledger {
    margin: 0;
    padding: 0;
    list-style: none;
    border-top: 1px solid var(--ground-rule-on-canvas);
  }

  .ledger li {
    display: grid;
    grid-template-columns: 3.25rem 1fr;
    gap: 1rem;
    padding-block: 0.875rem;
    border-bottom: 1px solid var(--ground-rule-on-canvas);
  }

  .n {
    font-family: var(--font-display);
    font-size: 1.125rem;
    line-height: 1.35;
    color: var(--ground-gold);
    font-variant-numeric: tabular-nums;
  }

  .ledger h3 {
    margin: 0 0 0.25rem;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--ground-ink-on-canvas);
  }

  .ledger p {
    margin: 0;
    font-size: 0.9375rem;
    line-height: 1.58;
    color: var(--ground-ink-dim-on-canvas);
  }
</style>
```

- [ ] **Step 4: Verify and commit**

```bash
pnpm check
pnpm test
```

```bash
git add src/components/marketing/home
git commit -m "feat(home): movements I and II — problem, mechanism, village operations

Verbatim copy from the approved assembly. Mechanism uses the sticky
statement treatment; operations keeps the single full-bleed band plate
that interrupts before the product run.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Port Movement III — the product

Three consecutive sections on canvas ground. This is the run where the approved design puts all three treatments on variant A, and where photography does the most work. Do not substitute a type-only treatment here.

**Files:**
- Create: `src/components/marketing/home/CapsuleSection.astro`
- Create: `src/components/marketing/home/VillageSection.astro`
- Create: `src/components/marketing/home/ModularSection.astro`

- [ ] **Step 1: Write `CapsuleSection.astro`**

```astro
---
import MovementTag from './MovementTag.astro';
import Plate from './Plate.astro';
import SectionShell from './SectionShell.astro';
import { marketingImages } from '@/data/marketing/image-assets';

const specs = [
  'Full-height glazing',
  'Private composite deck',
  'Nine-layer wall system',
  'Solar-ready roof',
  'Integrated services',
  'Turnkey furnishing',
];
---

<SectionShell tone="canvas">
  <MovementTag numeral="III" label="The product" />

  <div class="split">
    <div>
      <p class="marketing-eyebrow">The P7 Capsule</p>
      <p class="cap-num">
        <span class="big">38</span>
        <span class="unit">Square metres</span>
      </p>
      <h3 class="cap-title">Considered down to the last one.</h3>
      <p class="body">
        Full-height glazing that opens the room to the trees. Warm timber inside. A
        private deck for morning coffee. Engineered as a complete product — structure,
        insulation, services, furniture — finished before it ever reaches your plot.
      </p>
      <ul class="specs">
        {specs.map(spec => <li>{spec}</li>)}
      </ul>
    </div>

    <Plate image={marketingImages.villageBanner} ratio="4 / 5" caption="P7 capsule" />
  </div>
</SectionShell>

<style>
  .split {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: clamp(1.75rem, 4vw, 3.5rem);
    align-items: start;
  }

  @media (max-width: 900px) {
    .split {
      grid-template-columns: 1fr;
    }
  }

  .cap-num {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    margin: 0 0 0.5rem;
  }

  .big {
    font-family: var(--font-display);
    font-size: clamp(4.25rem, 9vw, 7.5rem);
    font-weight: 300;
    line-height: 0.82;
    letter-spacing: -0.05em;
    font-variant-numeric: tabular-nums;
    color: var(--ground-ink-on-canvas);
  }

  .unit {
    font-size: 0.75rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--ground-gold);
  }

  .cap-title {
    margin: 0 0 0.8rem;
    font-family: var(--font-display);
    font-size: clamp(1.25rem, 2vw, 1.75rem);
    font-weight: 400;
    line-height: 1.14;
    color: var(--ground-ink-on-canvas);
  }

  .body {
    margin: 0 0 1rem;
    max-width: 60ch;
    font-size: 1rem;
    line-height: 1.58;
    color: var(--ground-ink-dim-on-canvas);
  }

  .specs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 1.5rem 0 0;
    padding: 0;
    list-style: none;
  }

  .specs li {
    padding: 0.5rem 0.9rem;
    border: 1px solid rgb(20 20 26 / 0.18);
    border-radius: 999px;
    font-size: 0.8125rem;
    color: var(--ground-ink-dim-on-canvas);
  }
</style>
```

- [ ] **Step 2: Write `VillageSection.astro`**

```astro
---
import MovementTag from './MovementTag.astro';
import Plate from './Plate.astro';
import SectionShell from './SectionShell.astro';
import { marketingImages } from '@/data/marketing/image-assets';
---

<SectionShell tone="canvas">
  <MovementTag numeral="III" />

  <div class="split">
    <div>
      <h2 class="statement">
        Your residence is private. The life around it is shared.
      </h2>
      <p class="body">
        A pool for slow afternoons. Fire-side evenings in December. Long tables under
        the pavilion. Children in the shallows while you finish your coffee. Places to
        be alone; places to host everyone you love.
      </p>
      <p class="moment sans">Not a row of prefabs. A village.</p>
    </div>

    <Plate image={marketingImages.diasporaLifestyle} ratio="3 / 2" caption="Shared pool" />
  </div>
</SectionShell>

<style>
  .split {
    display: grid;
    grid-template-columns: 0.85fr 1.15fr;
    gap: clamp(1.75rem, 4vw, 3.5rem);
    align-items: start;
  }

  @media (max-width: 900px) {
    .split {
      grid-template-columns: 1fr;
    }
  }

  .statement {
    margin: 0 0 1.25rem;
    max-width: 22ch;
    font-size: clamp(1.4375rem, 2.6vw, 2.125rem);
    font-weight: 700;
    line-height: 1.12;
    letter-spacing: -0.028em;
    color: var(--ground-ink-on-canvas);
  }

  .body {
    margin: 0 0 1rem;
    max-width: 60ch;
    font-size: 1rem;
    line-height: 1.58;
    color: var(--ground-ink-dim-on-canvas);
  }

  .moment {
    margin: 1.25rem 0 0;
    max-width: 34ch;
    font-size: 1.0625rem;
    font-style: italic;
    font-weight: 500;
    color: var(--ground-gold);
  }
</style>
```

- [ ] **Step 3: Write `ModularSection.astro`**

```astro
---
import MovementTag from './MovementTag.astro';
import Plate from './Plate.astro';
import SectionShell from './SectionShell.astro';
import { marketingImages } from '@/data/marketing/image-assets';

const advantages = [
  { n: '01', title: 'Cost control', body: 'Factory production removes the site surprises that inflate budgets.' },
  { n: '02', title: 'Parallel timelines', body: 'Site preparation and home construction happen at once, not in sequence.' },
  { n: '03', title: 'Repeatable quality', body: 'Every capsule built to the same standard, by the same team, with the same checks.' },
  { n: '04', title: 'Faster to first stay', body: 'Months, not years, between decision and your first night home.' },
];
---

<SectionShell tone="canvas">
  <MovementTag numeral="III" />

  <div class="split">
    <Plate image={marketingImages.homeDetail} ratio="3 / 2" caption="Open grassland" />

    <div>
      <p class="marketing-eyebrow">Why modular</p>
      <h2 class="statement">
        Most of the building happens before the building arrives.
      </h2>
      <ul class="ledger">
        {
          advantages.map(item => (
            <li>
              <span class="n">{item.n}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </li>
          ))
        }
      </ul>
    </div>
  </div>
</SectionShell>

<style>
  .split {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: clamp(1.75rem, 4vw, 3.5rem);
    align-items: start;
  }

  @media (max-width: 900px) {
    .split {
      grid-template-columns: 1fr;
    }
  }

  .statement {
    margin: 0 0 1.25rem;
    max-width: 22ch;
    font-size: clamp(1.4375rem, 2.6vw, 2.125rem);
    font-weight: 700;
    line-height: 1.12;
    letter-spacing: -0.028em;
    color: var(--ground-ink-on-canvas);
  }

  .ledger {
    margin: 0;
    padding: 0;
    list-style: none;
    border-top: 1px solid var(--ground-rule-on-canvas);
  }

  .ledger li {
    display: grid;
    grid-template-columns: 3.25rem 1fr;
    gap: 1rem;
    padding-block: 0.875rem;
    border-bottom: 1px solid var(--ground-rule-on-canvas);
  }

  .n {
    font-family: var(--font-display);
    font-size: 1.125rem;
    line-height: 1.35;
    color: var(--ground-gold);
    font-variant-numeric: tabular-nums;
  }

  .ledger h3 {
    margin: 0 0 0.25rem;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--ground-ink-on-canvas);
  }

  .ledger p {
    margin: 0;
    font-size: 0.9375rem;
    line-height: 1.58;
    color: var(--ground-ink-dim-on-canvas);
  }
</style>
```

- [ ] **Step 4: Verify and commit**

```bash
pnpm check && pnpm test
```

```bash
git add src/components/marketing/home
git commit -m "feat(home): movement III — P7 capsule, the village, why modular

Three consecutive canvas-ground sections. All three keep a photograph, per
the approved picks — this is the run where photography does the most work.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Port Movement IV — proof and network

Five sections on obsidian ground, closing on the single gold card. This is where the 3-equal-card grid is eliminated: the scenarios become staggered rules of declining width, and the hubs become ruled rows.

**Files:**
- Create: `src/components/marketing/home/AcquireSection.astro`
- Create: `src/components/marketing/home/AssumptionsSection.astro`
- Create: `src/components/marketing/home/NetworkSection.astro`
- Create: `src/components/marketing/home/DiasporaSection.astro`
- Create: `src/components/marketing/home/WaysSection.astro`

- [ ] **Step 1: Write `AcquireSection.astro`**

```astro
---
import MovementTag from './MovementTag.astro';
import SectionShell from './SectionShell.astro';

const disclosures = [
  { n: '01', title: 'Exactly what you acquire', body: 'And the rights that come with it.' },
  { n: '02', title: 'What the operator manages', body: 'And what stays yours.' },
  { n: '03', title: 'How revenue and costs are treated', body: 'Line by line.' },
  { n: '04', title: 'The assumptions behind every projection', body: 'We show you.' },
  { n: '05', title: 'What happens if you want to exit', body: 'Stated up front.' },
];
---

<SectionShell tone="obsidian">
  <MovementTag numeral="IV" label="Proof" />

  <div class="split">
    <div class="sticky">
      <p class="marketing-eyebrow">Before you decide anything</p>
      <h2 class="statement display">Don't take our word for it.</h2>
      <p class="body">
        You'll understand exactly this, before anything is signed.
      </p>
      <p class="moment">Clarity first. Decision second.</p>
    </div>

    <ul class="ledger">
      {
        disclosures.map(item => (
          <li>
            <span class="n">{item.n}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          </li>
        ))
      }
    </ul>
  </div>
</SectionShell>

<style>
  .split {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: clamp(1.75rem, 4vw, 3.5rem);
    align-items: start;
  }

  .sticky {
    position: sticky;
    top: 92px;
  }

  @media (max-width: 900px) {
    .split {
      grid-template-columns: 1fr;
    }

    .sticky {
      position: static;
    }
  }

  .statement {
    margin: 0 0 1.25rem;
    max-width: 20ch;
    font-size: clamp(1.4375rem, 2.6vw, 2.125rem);
    font-weight: 700;
    line-height: 1.12;
    letter-spacing: -0.028em;
  }

  .statement.display {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(1.6875rem, 3.3vw, 2.75rem);
    line-height: 1.04;
    letter-spacing: -0.02em;
  }

  .body {
    margin: 0 0 1rem;
    max-width: 60ch;
    font-size: 1rem;
    line-height: 1.58;
    color: var(--ground-ink-dim);
  }

  .moment {
    margin: 1.25rem 0 0;
    max-width: 34ch;
    font-family: var(--font-display);
    font-style: italic;
    font-size: clamp(1.125rem, 1.7vw, 1.4375rem);
    line-height: 1.28;
    color: var(--ground-gold);
  }

  .ledger {
    margin: 0;
    padding: 0;
    list-style: none;
    border-top: 1px solid var(--ground-rule);
  }

  .ledger li {
    display: grid;
    grid-template-columns: 3.25rem 1fr;
    gap: 1rem;
    padding-block: 0.875rem;
    border-bottom: 1px solid var(--ground-rule);
  }

  .n {
    font-family: var(--font-display);
    font-size: 1.125rem;
    line-height: 1.35;
    color: var(--ground-gold);
    font-variant-numeric: tabular-nums;
  }

  .ledger h3 {
    margin: 0 0 0.25rem;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .ledger p {
    margin: 0;
    font-size: 0.9375rem;
    line-height: 1.58;
    color: var(--ground-ink-dim);
  }
</style>
```

- [ ] **Step 2: Write `AssumptionsSection.astro`**

The staggered treatment that replaces the empty three-cream-boxes grid.

```astro
---
import MovementTag from './MovementTag.astro';
import SectionShell from './SectionShell.astro';

const scenarios = [
  { tag: 'Case 01', title: 'Base case', body: 'The expectation we can defend today.' },
  { tag: 'Case 02', title: 'Stronger case', body: 'The upside if demand runs stronger.' },
  { tag: 'Case 03', title: 'Downside case', body: 'The floor we plan around.' },
];
---

<SectionShell tone="obsidian">
  <MovementTag numeral="IV" label="The numbers" />

  <div class="split">
    <div>
      <h2 class="statement display">
        We'd rather show you the assumptions than sell you the outcome.
      </h2>
      <p class="body">
        Ghana's short-let market runs at roughly 33–44% occupancy. Our model is built
        on documented assumptions — base case, stronger case, downside case — that
        you'll examine line by line in your briefing.
      </p>
    </div>

    <div class="scenarios">
      {
        scenarios.map((scenario, index) => (
          <article class:list={['scenario', `step-${index + 1}`]}>
            <p class="tag">{scenario.tag}</p>
            <h3>{scenario.title}</h3>
            <p class="scenario-body">{scenario.body}</p>
          </article>
        ))
      }
    </div>
  </div>

  <p class="moment">No headline ROI theatre. No promises we can't defend.</p>
</SectionShell>

<style>
  .split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(1.75rem, 4vw, 3.5rem);
    align-items: start;
  }

  @media (max-width: 900px) {
    .split {
      grid-template-columns: 1fr;
    }
  }

  .statement {
    margin: 0 0 1.25rem;
    max-width: 20ch;
  }

  .statement.display {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(1.6875rem, 3.3vw, 2.75rem);
    line-height: 1.04;
    letter-spacing: -0.02em;
  }

  .body {
    margin: 0;
    max-width: 60ch;
    font-size: 1rem;
    line-height: 1.58;
    color: var(--ground-ink-dim);
  }

  .scenarios {
    display: grid;
    gap: 1.5rem;
  }

  .scenario {
    padding-top: 1.25rem;
    border-top: 1px solid var(--ground-rule);
    max-width: 46ch;
  }

  .step-2 {
    margin-left: clamp(0rem, 5vw, 4rem);
  }

  .step-3 {
    margin-left: clamp(0rem, 10vw, 8rem);
  }

  .tag {
    margin: 0 0 0.35rem;
    font-size: 0.6875rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ground-gold);
  }

  .scenario h3 {
    margin: 0 0 0.3rem;
    font-family: var(--font-display);
    font-size: clamp(1.25rem, 2vw, 1.625rem);
    font-weight: 400;
  }

  .scenario-body {
    margin: 0;
    font-size: 0.9375rem;
    color: var(--ground-ink-dim);
  }

  .moment {
    margin: 1.5rem 0 0;
    max-width: 40ch;
    font-family: var(--font-display);
    font-style: italic;
    font-size: clamp(1.125rem, 1.7vw, 1.4375rem);
    line-height: 1.28;
    color: var(--ground-gold);
  }
</style>
```

- [ ] **Step 3: Write `NetworkSection.astro`**

```astro
---
import MovementTag from './MovementTag.astro';
import SectionShell from './SectionShell.astro';
import { swiftHubs } from '@/data/marketing/locations';

const total = swiftHubs.reduce((sum, hub) => sum + hub.capsules, 0);
---

<SectionShell tone="obsidian">
  <MovementTag numeral="IV" label="The network" />

  <div class="split">
    <div class="sticky">
      <h2 class="statement">One standard. <em>Four hubs.</em></h2>
      <p class="body">
        Swift Horizon is a national network of hospitality villages, built to one
        standard. Four hubs anchor the map.
      </p>
      <p class="moment">
        Same capsule. Same share. Same standard. Wherever you land.
      </p>
    </div>

    <div>
      <ul class="hubs">
        {
          swiftHubs.map(hub => (
            <li>
              <span class="name">{hub.city}</span>
              <span class="detail">
                <em>{hub.region}</em>
                {hub.role}
              </span>
              <span class="count">
                {hub.capsules}
                <span class="count-label">capsules</span>
              </span>
            </li>
          ))
        }
      </ul>
      <p class="total">
        <span>Same capsule. Same share. Same standard. Wherever you land.</span>
        <span class="num">{total} capsules</span>
      </p>
    </div>
  </div>
</SectionShell>

<style>
  .split {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: clamp(1.75rem, 4vw, 3.5rem);
    align-items: start;
  }

  .sticky {
    position: sticky;
    top: 92px;
  }

  @media (max-width: 900px) {
    .split {
      grid-template-columns: 1fr;
    }

    .sticky {
      position: static;
    }
  }

  .statement {
    margin: 0 0 1.25rem;
    max-width: 20ch;
    font-size: clamp(1.4375rem, 2.6vw, 2.125rem);
    font-weight: 700;
    line-height: 1.12;
    letter-spacing: -0.028em;
  }

  .statement em {
    font-family: var(--font-display);
    font-weight: 300;
    font-style: italic;
  }

  .body {
    margin: 0 0 1rem;
    max-width: 60ch;
    font-size: 1rem;
    line-height: 1.58;
    color: var(--ground-ink-dim);
  }

  .moment {
    margin: 1.25rem 0 0;
    max-width: 34ch;
    font-family: var(--font-display);
    font-style: italic;
    font-size: clamp(1.125rem, 1.7vw, 1.4375rem);
    line-height: 1.28;
    color: var(--ground-gold);
  }

  .hubs {
    margin: 0;
    padding: 0;
    list-style: none;
    border-top: 1px solid var(--ground-rule);
  }

  .hubs li {
    display: grid;
    grid-template-columns: 7rem 1fr 5.5rem;
    gap: 1.5rem;
    align-items: baseline;
    padding-block: 0.9375rem;
    border-bottom: 1px solid var(--ground-rule);
  }

  @media (max-width: 640px) {
    .hubs li {
      grid-template-columns: 1fr auto;
    }

    .detail {
      grid-column: 1 / -1;
    }
  }

  .name {
    font-family: var(--font-display);
    font-size: clamp(1.1875rem, 2.1vw, 1.6875rem);
    font-weight: 500;
    letter-spacing: -0.01em;
  }

  .detail {
    font-size: 0.9375rem;
    color: var(--ground-ink-dim);
  }

  .detail em {
    display: block;
    margin-bottom: 0.2rem;
    font-style: normal;
    font-size: 0.6875rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-low);
  }

  .count {
    text-align: right;
    font-size: 1.25rem;
    font-variant-numeric: tabular-nums;
    color: var(--ground-gold);
  }

  .count-label {
    display: block;
    font-size: 0.625rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-low);
  }

  .total {
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
    margin: 1.25rem 0 0;
    font-size: 1rem;
    color: rgb(237 231 220 / 0.72);
  }

  .num {
    font-variant-numeric: tabular-nums;
  }
</style>
```

`swiftHubs` totals 48 + 24 + 12 + 12 = 96. `home-copy-guard.test.ts:49` already asserts `[48, 24, 12, 12]`, so the total is verified rather than hardcoded.

- [ ] **Step 4: Write `DiasporaSection.astro`**

```astro
---
import MovementTag from './MovementTag.astro';
import Plate from './Plate.astro';
import SectionShell from './SectionShell.astro';
import { marketingImages } from '@/data/marketing/image-assets';
---

<SectionShell tone="obsidian">
  <MovementTag numeral="IV" />

  <div class="split">
    <Plate
      image={marketingImages.architectureGallery}
      ratio="4 / 5"
      caption="Mature trees"
    />

    <div>
      <p class="marketing-eyebrow">For those who live between two places</p>
      <h2 class="statement">
        Maybe home doesn't have to mean choosing one country over another.
      </h2>
      <p class="body">
        A key that is yours. A room that remembers you. Your children growing up with
        somewhere in Ghana that is theirs — not a hotel, not a relative's spare room.
      </p>
      <p class="moment">
        December means something again. "We're going home." And meaning it.
      </p>
    </div>
  </div>
</SectionShell>

<style>
  .split {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: clamp(1.75rem, 4vw, 3.5rem);
    align-items: start;
  }

  @media (max-width: 900px) {
    .split {
      grid-template-columns: 1fr;
    }
  }

  .statement {
    margin: 0 0 1.25rem;
    max-width: 22ch;
    font-size: clamp(1.4375rem, 2.6vw, 2.125rem);
    font-weight: 700;
    line-height: 1.12;
    letter-spacing: -0.028em;
  }

  .body {
    margin: 0 0 1rem;
    max-width: 60ch;
    font-size: 1rem;
    line-height: 1.58;
    color: var(--ground-ink-dim);
  }

  .moment {
    margin: 1.25rem 0 0;
    max-width: 34ch;
    font-family: var(--font-display);
    font-style: italic;
    font-size: clamp(1.125rem, 1.7vw, 1.4375rem);
    line-height: 1.28;
    color: var(--ground-gold);
  }
</style>
```

- [ ] **Step 5: Write `WaysSection.astro`**

The four-column row treatment. It drives from `marketingSite.tiers`, which `home-copy-guard.test.ts:40` already pins.

```astro
---
import MovementTag from './MovementTag.astro';
import SectionShell from './SectionShell.astro';
import { marketingSite } from '@/data/marketing/site';
---

<SectionShell tone="obsidian">
  <MovementTag numeral="IV" label="Three ways in" />

  <h2 class="statement">Stay. Own. Partner.</h2>

  <ul class="ways">
    {
      marketingSite.tiers.map((tier, index) => (
        <li>
          <span class="n">{String(index + 1).padStart(2, '0')}</span>
          <h3>{tier.name}</h3>
          <p>{tier.summary}</p>
          <a href={tier.cta.href}>{tier.cta.label} →</a>
        </li>
      ))
    }
  </ul>
</SectionShell>

<style>
  .statement {
    margin: 0 0 1.5rem;
    font-size: clamp(1.4375rem, 2.6vw, 2.125rem);
    font-weight: 700;
    line-height: 1.12;
    letter-spacing: -0.028em;
  }

  .ways {
    margin: 0;
    padding: 0;
    list-style: none;
    border-top: 1px solid var(--ground-rule);
  }

  .ways li {
    display: grid;
    grid-template-columns: 4rem minmax(0, 15ch) 1fr auto;
    gap: 1.5rem;
    align-items: baseline;
    padding-block: 1.125rem;
    border-bottom: 1px solid var(--ground-rule);
  }

  @media (max-width: 820px) {
    .ways li {
      grid-template-columns: 2.75rem 1fr;
    }

    .ways p,
    .ways a {
      grid-column: 2;
    }
  }

  .n {
    font-family: var(--font-display);
    font-size: 1.375rem;
    color: var(--ground-gold);
    font-variant-numeric: tabular-nums;
  }

  .ways h3 {
    margin: 0;
    font-size: 1.1875rem;
    font-weight: 600;
    letter-spacing: -0.015em;
  }

  .ways p {
    margin: 0;
    max-width: 42ch;
    font-size: 0.9375rem;
    color: var(--ground-ink-dim);
  }

  .ways a {
    font-size: 0.8125rem;
    letter-spacing: 0.04em;
    color: var(--ground-gold);
    text-decoration: none;
    white-space: nowrap;
    border-bottom: 1px solid var(--marketing-gold-line);
    padding-bottom: 0.2rem;
  }
</style>
```

- [ ] **Step 6: Verify and commit**

```bash
pnpm check && pnpm test
```

```bash
git add src/components/marketing/home
git commit -m "feat(home): movement IV — disclosures, scenarios, hubs, diaspora, ways

Eliminates the three-equal-card grid: scenarios become staggered rules of
declining width and hubs become ruled rows. Hub total is summed from
swiftHubs rather than hardcoded.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: The ask and the credits strip

Gold appears exactly once on the whole page, here. The credits strip is the complete disclosure — every photograph named, one place.

**Files:**
- Create: `src/components/marketing/home/AskSection.astro`
- Create: `src/components/marketing/home/ImageCredits.astro`

- [ ] **Step 1: Write `AskSection.astro`**

```astro
---
import { marketingImages } from '@/data/marketing/image-assets';
import { marketingPages } from '@/data/marketing/pages';

const cta = marketingPages.home;
---

<section class="marketing-surface-dark ask">
  <div class="marketing-container">
    <div class="card">
      <div>
        <p class="marketing-eyebrow">Your next step</p>
        <h2>
          You don't need to decide today. You need enough information to decide well.
        </h2>
        <p class="body">
          No checkout. No countdown timer. No pressure on the call. Just a structured
          conversation about whether this fits the life you're building.
        </p>
        <a class="cta" href="/briefing">Request a private briefing</a>
      </div>

      <div class="side">
        <p class="side-title">What the briefing covers</p>
        <ul>
          <li>What you acquire, and the rights</li>
          <li>What we manage, what stays yours</li>
          <li>Revenue and costs, line by line</li>
          <li>The assumptions behind every projection</li>
          <li>What happens if you want to exit</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<style>
  .ask {
    padding-block: clamp(3rem, 7vh, 5rem);
  }

  .card {
    display: grid;
    grid-template-columns: 1.3fr 0.7fr;
    gap: clamp(2rem, 5vw, 4rem);
    align-items: center;
    padding: clamp(2rem, 5vw, 4rem);
    background: linear-gradient(120deg, #e1be92 0%, #c8a06c 100%);
    color: #14141a;
  }

  @media (max-width: 860px) {
    .card {
      grid-template-columns: 1fr;
    }
  }

  .card h2 {
    margin: 0 0 1.125rem;
    max-width: 22ch;
    font-size: clamp(1.625rem, 3.1vw, 2.5rem);
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.03em;
  }

  .body {
    margin: 0 0 1.5rem;
    color: rgb(20 20 26 / 0.72);
  }

  .cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0.875rem 1.5rem;
    background: #14141a;
    color: #f4efe6;
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-decoration: none;
  }

  .side {
    padding-left: 1.5rem;
    border-left: 1px solid rgb(20 20 26 / 0.22);
    font-size: 0.8125rem;
    color: rgb(20 20 26 / 0.6);
  }

  .side-title {
    margin: 0 0 0.7rem;
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgb(20 20 26 / 0.55);
  }

  .side ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 0.45rem;
  }
</style>
```

- [ ] **Step 2: Write `ImageCredits.astro`**

```astro
---
import { marketingImages } from '@/data/marketing/image-assets';

const captions: Record<string, string> = {
  homeHero: 'Savanna dusk',
  villageStory: 'Dry grass',
  ownershipStory: 'Gravel court',
  diasporaLifestyle: 'Shared pool',
  villageBanner: 'P7 capsule',
  homeDetail: 'Open grassland',
  confidenceFeature: 'Tropical',
  ownershipPage: 'Minimal',
  architectureGallery: 'Mature trees',
  warmDetail: 'Weathered steel',
  duskCta: 'Under the oaks',
  briefingClose: 'Deck at dusk',
};

const entries = Object.entries(marketingImages);
---

<section class="credits">
  <div class="marketing-container">
    <div class="grid">
      <div>
        <h2>Image credits</h2>
        <p>
          Every photograph on this page is illustrative reference material, not a
          completed Swift Horizon capsule. Gold marks indicate each image. These will
          be replaced with photography of the built villages as hubs come online.
        </p>
      </div>

      <ol>
        {
          entries.map(([key, image], index) => (
            <li>
              <span class="tick" aria-hidden="true" />
              <span class="idx">{String(index + 1).padStart(2, '0')}</span>
              <span>{captions[key] ?? key}</span>
            </li>
          ))
        }
      </ol>
    </div>
  </div>
</section>

<style>
  .credits {
    background: var(--marketing-obsidian-800);
    border-top: 1px solid var(--ground-rule);
    padding-block: 2.25rem;
  }

  .grid {
    display: grid;
    grid-template-columns: 0.9fr 1.6fr;
    gap: clamp(1.5rem, 4vw, 4rem);
    align-items: start;
  }

  @media (max-width: 860px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }

  h2 {
    margin: 0 0 0.6rem;
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-low);
  }

  p {
    margin: 0;
    max-width: 44ch;
    font-size: 0.8125rem;
    line-height: 1.7;
    color: var(--text-secondary);
  }

  ol {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.4rem 1.5rem;
  }

  @media (max-width: 700px) {
    ol {
      grid-template-columns: 1fr 1fr;
    }
  }

  li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.6875rem;
    color: var(--text-low);
  }

  .tick {
    width: 5px;
    height: 5px;
    flex: 0 0 auto;
    background: var(--accent-muted);
  }

  .idx {
    color: var(--accent-muted);
    font-variant-numeric: tabular-nums;
  }
</style>
```

- [ ] **Step 3: Verify and commit**

```bash
pnpm check && pnpm test
```

```bash
git add src/components/marketing/home
git commit -m "feat(home): the ask as a single gold card, plus the credits strip

Gold appears exactly once on the page. The credits strip names all twelve
photographs in one place, which is the complete disclosure the rail and the
per-image ticks point at.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 11: Compose the page

`src/pages/index.astro` becomes composition only. All copy that a test guards stays byte-identical.

**Files:**
- Modify: `src/pages/index.astro` (full rewrite)
- Modify: `src/data/marketing/home-copy-guard.test.ts:62`

- [ ] **Step 1: Rewrite `src/pages/index.astro`**

```astro
---
export const prerender = true;

import MarketingHero from '@/components/marketing/MarketingHero.astro';
import AcquireSection from '@/components/marketing/home/AcquireSection.astro';
import AskSection from '@/components/marketing/home/AskSection.astro';
import AssumptionsSection from '@/components/marketing/home/AssumptionsSection.astro';
import CapsuleSection from '@/components/marketing/home/CapsuleSection.astro';
import DiasporaSection from '@/components/marketing/home/DiasporaSection.astro';
import ImageCredits from '@/components/marketing/home/ImageCredits.astro';
import ImageRail from '@/components/marketing/home/ImageRail.astro';
import MechanismSection from '@/components/marketing/home/MechanismSection.astro';
import ModularSection from '@/components/marketing/home/ModularSection.astro';
import NetworkSection from '@/components/marketing/home/NetworkSection.astro';
import OperationsSection from '@/components/marketing/home/OperationsSection.astro';
import ProblemSection from '@/components/marketing/home/ProblemSection.astro';
import VillageSection from '@/components/marketing/home/VillageSection.astro';
import WaysSection from '@/components/marketing/home/WaysSection.astro';
import { marketingImages } from '@/data/marketing/image-assets';
import { marketingPages } from '@/data/marketing/pages';
import MarketingLayout from '@layout/MarketingLayout.astro';

const page = marketingPages.home;

const railFrames = [
  { image: marketingImages.villageStory, caption: 'Dry grass' },
  { image: marketingImages.ownershipStory, caption: 'Gravel court' },
  { image: marketingImages.duskCta, caption: 'Under the oaks' },
  { image: marketingImages.villageBanner, caption: 'P7 capsule' },
  { image: marketingImages.diasporaLifestyle, caption: 'Shared pool' },
  { image: marketingImages.homeDetail, caption: 'Open grassland' },
  { image: marketingImages.confidenceFeature, caption: 'Tropical' },
  { image: marketingImages.ownershipPage, caption: 'Minimal' },
  { image: marketingImages.architectureGallery, caption: 'Mature trees' },
  { image: marketingImages.warmDetail, caption: 'Weathered steel' },
  { image: marketingImages.briefingClose, caption: 'Deck at dusk' },
];
---

<MarketingLayout seo={page.seo} headerTheme="dark">
  <MarketingHero
    {...page.hero}
    secondaryCta={page.secondaryCta}
    image={marketingImages.homeHero}
  />

  <ImageRail frames={railFrames} />

  <ProblemSection />
  <MechanismSection />
  <OperationsSection />

  <CapsuleSection />
  <VillageSection />
  <ModularSection />

  <AcquireSection />
  <AssumptionsSection />
  <NetworkSection />
  <DiasporaSection />
  <WaysSection />

  <AskSection />
  <ImageCredits />
</MarketingLayout>
```

Note the hero now uses `marketingImages.homeHero`, not `villageBanner`. The old code passed `villageBanner` at the call site, which is why the live hero was a different photograph from the manifest's `homeHero` derivative.

- [ ] **Step 2: Fix the copy-guard assertion that points at the old structure**

`home-copy-guard.test.ts:62` asserts `index.astro` contains `"One standard. Four hubs."`. That literal now lives in `NetworkSection.astro`. Replace that assertion:

```ts
it('keeps the hub statement in the network section', () => {
  const network = readFileSync(
    join(process.cwd(), 'src/components/marketing/home/NetworkSection.astro'),
    'utf8',
  );

  expect(network).toContain('One standard.');
  expect(network).toContain('Four hubs.');
});

it('homepage composes the approved section order', () => {
  const index = readFileSync(join(process.cwd(), 'src/pages/index.astro'), 'utf8');
  const order = [
    'MarketingHero',
    'ImageRail',
    'ProblemSection',
    'MechanismSection',
    'OperationsSection',
    'CapsuleSection',
    'VillageSection',
    'ModularSection',
    'AcquireSection',
    'AssumptionsSection',
    'NetworkSection',
    'DiasporaSection',
    'WaysSection',
    'AskSection',
    'ImageCredits',
  ];

  const positions = order.map(name => index.indexOf(`<${name}`));
  for (const position of positions) {
    expect(position).toBeGreaterThan(-1);
  }
  for (let i = 1; i < positions.length; i += 1) {
    expect(positions[i]).toBeGreaterThan(positions[i - 1]!);
  }
});
```

- [ ] **Step 3: Run the tests**

```bash
pnpm test src/data/marketing/home-copy-guard.test.ts
pnpm test
```

Expected: all pass. If `keeps the hub statement` fails, the `NetworkSection` copy drifted from the approved assembly — restore it verbatim from `build.html`, do not adjust the test.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro src/data/marketing/home-copy-guard.test.ts
git commit -m "feat(home): compose the homepage from the twelve section components

index.astro becomes composition only. The hero now uses marketingImages
.homeHero; the old call site overrode it with villageBanner, which is why
the live hero showed a photograph the manifest never produced for that slot.

Adds an order assertion so the approved sequence cannot be reordered by
accident.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 12: Fix `MarketingHero` and verify page height

Two loose ends from the audit. `MarketingHero.astro:15-22` silently drops `ratio` and `mobileRatio`, and its `<picture>` has only a desktop webp `<source>` — no mobile source, so phones get the 2400px-wide image. Separately, the assembled design measured ~9,300px and the spec accepts that (§9), but the figure must be re-measured on the real build rather than carried over from the preview harness.

**Files:**
- Modify: `src/components/marketing/MarketingHero.astro`
- Modify: `src/data/marketing/marketing-foundation.test.ts`

- [ ] **Step 1: Write the failing test**

Add to `src/data/marketing/marketing-foundation.test.ts`:

```ts
it('MarketingHero honours ratio and emits a mobile source', () => {
  const hero = readFileSync(
    join(process.cwd(), 'src/components/marketing/MarketingHero.astro'),
    'utf8',
  );

  expect(hero).toContain('ratio = ');
  expect(hero).toContain('mobileRatio = ');
  expect(hero).toMatch(/media="\(max-width: 767px\)"/);
});
```

- [ ] **Step 2: Run and confirm it fails**

```bash
pnpm test src/data/marketing/marketing-foundation.test.ts
```

Expected: FAIL on `MarketingHero honours ratio and emits a mobile source`.

- [ ] **Step 3: Fix the props**

In `MarketingHero.astro`, change the destructure at lines 15-22 from:

```ts
const {
  eyebrow,
  title,
  lead,
  image,
  ratio,
  mobileRatio,
  secondaryCta,
} = Astro.props;
```

to keep the defaults:

```ts
const {
  eyebrow,
  title,
  lead,
  image,
  ratio = '16 / 9',
  mobileRatio = '4 / 5',
  secondaryCta,
} = Astro.props;
```

Then add a mobile `<source>` inside `<picture class="hero-picture">`, before the existing desktop `<source>`:

```astro
<source
  media="(max-width: 767px)"
  srcset={image.mobile?.webp.src ?? image.desktop.webp.src}
/>
```

And add to the existing inline `style` attribute on `<picture>`:

```css
--marketing-image-desktop-ratio: {ratio};
--marketing-image-mobile-ratio: {mobileRatio};
```

- [ ] **Step 4: Measure the real page height**

```bash
pnpm build
python3 -m http.server 4321 --directory dist/client >/tmp/sh4321.log 2>&1 &
sleep 2
```

Then in a browser at 1440×900 on `http://localhost:4321/`, evaluate:

```js
document.documentElement.scrollHeight
```

Record the number. Expected range 8,500–9,800px. **If it exceeds 9,800px**, tighten `.marketing-home-section` padding in `SectionShell.astro` from `clamp(2.25rem, 5vh, 4rem)` to `clamp(2rem, 4vh, 3.25rem)` and re-measure. Do not go below 8,500px by cutting sections — that reopens a locked decision.

Kill the server when done:

```bash
pkill -f "http.server 4321"
```

- [ ] **Step 5: Record the measurement**

Append to `docs/superpowers/specs/2026-10-02-swift-horizon-homepage-design.md` under §9:

```markdown
**Measured on the production build at 1440px:** <the number you recorded>.
```

- [ ] **Step 6: Commit**

```bash
git add src/components/marketing/MarketingHero.astro src/data/marketing/marketing-foundation.test.ts docs/superpowers/specs/2026-10-02-swift-horizon-homepage-design.md
git commit -m "fix(hero): honour ratio props and serve a mobile source

MarketingHero destructured ratio and mobileRatio but never used them, and
its picture element had only a desktop webp source, so phones downloaded the
2400px image. Also records the measured production page height.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 13: Final verification

The spec's eleven acceptance criteria are the checklist. Every one is verifiable.

**Files:** none created.

- [ ] **Step 1: Full build**

```bash
export PATH="$HOME/.nvm/versions/node/v22.23.2/bin:$PATH"
pnpm build
```

Expected: `images:validate` passes, `astro check` reports 0 errors, build completes.

- [ ] **Step 2: Full test suite**

```bash
pnpm test
```

Expected: all pass, including the pre-existing `home-copy-guard`, `brand`, `image-manifest`, `pages-rich`, `no-forbidden-strings` and `marketing-foundation` suites.

- [ ] **Step 3: Verify the acceptance criteria in a browser**

Serve and open `http://localhost:4321/` at 1440×900, then evaluate:

```js
(() => {
  const imgs = [...document.querySelectorAll('img')];
  const srcs = imgs.map(i => new URL(i.currentSrc || i.src).pathname);
  const counts = srcs.reduce((acc, s) => ({ ...acc, [s]: (acc[s] || 0) + 1 }), {});
  return {
    criterion1_sections: document.querySelectorAll('section').length,
    criterion2_images: imgs.length,
    criterion2_unique: Object.keys(counts).length,
    criterion2_repeats: Object.entries(counts).filter(([, n]) => n > 1),
    criterion4_serifInUse: getComputedStyle(document.querySelector('.statement')).fontFamily,
    criterion6_height: document.documentElement.scrollHeight,
    criterion7_fullBleed: getComputedStyle(document.querySelector('.marketing-surface-dark')).backgroundColor,
    criterion10_horizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
  };
})()
```

Expected:

| Criterion | Expected |
|---|---|
| 1 sections | ≥ 15 (12 content + hero + rail + ask + credits) |
| 2 unique images | 12 |
| 2 repeats | six entries, all rail-to-section — matches spec §8, accepted |
| 4 serif | contains `Cormorant` |
| 6 height | 8,500–9,800 |
| 7 full bleed | a non-transparent rgb |
| 10 horizontal scroll | `false` |

If criterion 4 shows Inter, Cormorant is not loading — check `MarketingLayout.astro` for the `Cormorant+Garamond` font link that `marketing-foundation.test.ts:60` already asserts.

- [ ] **Step 4: Verify keyboard access and focus**

Tab through the page. Every interactive element must show a visible focus ring and the rail must be reachable and scrollable via keyboard (`tabindex="0"` on `.rail`).

- [ ] **Step 5: Confirm the wordmark**

```bash
rg -n "THE SWIFT PROJECT" src/ && echo "FAIL: retired brand still present" || echo "clean"
```

Expected: `clean`.

- [ ] **Step 6: Final commit**

```bash
git add docs/superpowers/specs/2026-10-02-swift-horizon-homepage-design.md
git commit -m "docs(spec): record the acceptance-criteria verification

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

If there is nothing staged, skip this step rather than creating an empty commit.

---

## Notes for the implementer

**The five repeated photographs are intentional.** Spec §8 records that the rail and five sections share five photographs. Criterion 2 therefore accepts them. Do not "fix" this — it was reviewed and declined twice.

**Do not touch `src/pages/downloads/*` or `src/pages/support/*`.** Ten deletions there are staged from unrelated work. They are not part of this plan.

**Do not reword copy.** Every string is from `docs/superpowers/brainstorm/2026-10-02-homepage-rebuild/build.html` and is locked by the copy constitution. When a test disagrees with the copy, fix the code, not the test.

**Gold is used once.** The gradient appears only in `AskSection.astro`. If you find yourself reaching for gold as a background elsewhere, that is a design regression.