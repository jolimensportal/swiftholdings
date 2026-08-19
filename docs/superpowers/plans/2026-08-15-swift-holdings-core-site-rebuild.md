# Swift Holdings Core-Site Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Swift Holdings' eight-page diaspora-homebuyer marketing journey locally, with curated reference imagery, a reliable private-briefing conversion path, and a static Cloudflare Pages deployment target.

**Architecture:** Introduce an isolated `MarketingLayout` and small `src/components/marketing/` system so the new buyer journey does not inherit DataNova metadata, navigation, footer, or investor-first sections. Keep legacy layout, API, support, and download routes intact for Phase 2. Generate fixed-ratio marketing image derivatives locally from `Desktop/PREFAB`, commit only the derivatives and manifest, prerender the eight core routes into `dist/client`, and submit briefing leads directly to Formspree from the browser.

**Tech Stack:** Astro 7, TypeScript strict mode, Tailwind CSS v4, Sharp 0.35, Vitest 4, Astro assets, Cloudflare Pages, Formspree.

---

## File Structure

### Create

| File                                            | Responsibility                                                                                                         |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `src/assets/images/marketing/*`                 | Generated, committed WebP/JPEG crop derivatives only. Never copy `Desktop/PREFAB` originals here unchanged.            |
| `src/assets/styles/marketing.css`               | Buyer-journey-only tokens, photo-frame rules, button hierarchy, and responsive layout helpers.                         |
| `src/layout/MarketingLayout.astro`              | Swift SEO/schema/font shell with the new header and footer; no DataNova defaults or client-router animation bootstrap. |
| `src/components/marketing/SiteHeader.astro`     | Accessible buyer-first header, native mobile disclosure, and briefing CTA.                                             |
| `src/components/marketing/SiteFooter.astro`     | Minimal Swift contact/footer treatment without newsletter or investor disclaimer copy.                                 |
| `src/components/marketing/ImageFrame.astro`     | Fixed-ratio `<picture>` renderer with visible `Illustrative reference` label.                                          |
| `src/components/marketing/MarketingHero.astro`  | Premium photo-led hero with one primary briefing CTA and optional secondary link.                                      |
| `src/components/marketing/ProofStrip.astro`     | Three compact project/context facts.                                                                                   |
| `src/components/marketing/StorySplit.astro`     | Editorial text-image relationship with an optional reversed desktop layout.                                            |
| `src/components/marketing/NumberedSteps.astro`  | Four-step buyer process.                                                                                               |
| `src/components/marketing/ConfidenceList.astro` | Verified/illustrative distinction and buyer-confidence list.                                                           |
| `src/components/marketing/BriefingForm.astro`   | Accessible direct-Formspree form with clear success, retry, and email fallback states.                                 |
| `src/data/marketing/site.ts`                    | Swift contact details, navigation items, CTA labels, and default SEO values.                                           |
| `src/data/marketing/pages.ts`                   | Typed buyer-first copy for all eight core routes.                                                                      |
| `src/data/marketing/image-manifest.json`        | Canonical source name, crop, focal point, label, alt text, and derivative metadata for the 12 selected references.     |
| `src/data/marketing/image-assets.ts`            | Static Astro imports that expose generated image metadata to page components.                                          |
| `src/data/marketing/image-manifest.test.ts`     | Manifest shape, ID, ratio, and generated-asset validation tests.                                                       |
| `src/utils/briefing-form.ts`                    | Pure validation and direct Formspree request-state functions.                                                          |
| `src/utils/briefing-form.test.ts`               | Validation, success, network failure, timeout, and missing-endpoint tests.                                             |
| `scripts/prepare-marketing-images.mjs`          | Local Sharp image derivative and branded social/icon generator.                                                        |
| `scripts/validate-marketing-images.mjs`         | CI/Cloudflare-safe check that committed derivatives exist and match manifest dimensions.                               |
| `src/pages/village.astro`                       | The Village route.                                                                                                     |
| `src/pages/how-it-works.astro`                  | Ownership process route.                                                                                               |
| `src/pages/ownership.astro`                     | Buyer-fit and ownership route.                                                                                         |
| `src/pages/accra.astro`                         | Oyarifa/Accra diaspora context route.                                                                                  |
| `src/pages/briefing.astro`                      | Private briefing route.                                                                                                |
| `public/_redirects`                             | Cloudflare Pages permanent redirects for retired legacy marketing paths.                                               |

### Modify

| File                                                                                             | Change                                                                                                                                               |
| ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json`                                                                                   | Add image preparation/validation scripts and run derivative validation before `astro check` in `build`.                                              |
| `src/env.d.ts`                                                                                   | Type `PUBLIC_FORMSPREE_BRIEFING_ENDPOINT`.                                                                                                           |
| `.env.template`                                                                                  | Document the intentionally public briefing endpoint, static fallback behavior, and Cloudflare Pages configuration; remove Vercel deployment wording. |
| `src/pages/index.astro`                                                                          | Replace legacy investor section stack with new Home composition and `prerender = true`.                                                              |
| `src/pages/about.astro`                                                                          | Replace investor/share copy with buyer-first About Swift composition and `prerender = true`.                                                         |
| `src/pages/protections.astro`                                                                    | Replace unsupported investor safeguards with a confirmed-vs-illustrative buyer confidence page and `prerender = true`.                               |
| `src/pages/404.astro`                                                                            | Use `MarketingLayout` and Swift recovery links.                                                                                                      |
| `src/pages/robots.txt.ts`                                                                        | Prerender a correct Swift Holdings robots file without a nonexistent sitemap URL.                                                                    |
| `public/manifest.webmanifest`                                                                    | Replace DataNova name and teal values with Swift Holdings/violet values.                                                                             |
| `public/icon.svg`                                                                                | Replace DataNova icon with the generated Swift violet monogram.                                                                                      |
| `public/social.png`, `public/icon-192.png`, `public/icon-512.png`, `public/apple-touch-icon.png` | Replace template branding through the image preparation script.                                                                                      |
| `README.md`                                                                                      | Replace Vercel deployment instructions with Cloudflare Pages build/output/environment instructions.                                                  |

### Intentionally Leave Untouched in Phase 1

- `src/layout/BaseLayout.astro`, legacy `Navbar.astro`, legacy `Footer.astro`, and legacy section components.
- `src/components/ui/forms/ContactForm.astro`, newsletter forms, `src/utils/form-client.ts`, `src/pages/api/contact.ts`, and other server API routes.
- Support, downloads, articles, whitepapers, references, spreadsheet tooling, and Keystatic/Drizzle code.
- `src/db/client.ts`; its legacy production database safeguard is not part of the static buyer journey.

## Task 1: Create the Marketing Content and Image Manifest Contract

**Files:**

- Create: `src/data/marketing/site.ts`
- Create: `src/data/marketing/pages.ts`
- Create: `src/data/marketing/image-manifest.json`
- Create: `src/data/marketing/image-manifest.test.ts`

- [ ] **Step 1: Write the failing image-manifest test**

```ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

type MarketingImageManifest = {
  images: Array<{
    id: string;
    source: string;
    label: 'Illustrative reference';
    alt: string;
    focalPoint: 'centre' | 'north' | 'south';
    derivatives: Array<{ name: string; width: number; height: number }>;
  }>;
};

const manifestPath = new URL('./image-manifest.json', import.meta.url);
const manifest = JSON.parse(
  readFileSync(manifestPath, 'utf8')
) as MarketingImageManifest;

describe('marketing image manifest', () => {
  it('contains the approved twelve curated source files exactly once', () => {
    expect(manifest.images.map(image => image.source)).toEqual([
      'prefab_2_2048x1365.jpg',
      'prefab_10_2500x1667.jpg',
      'prefab_6_4368x2912.jpg',
      'prefab_8_2943x1962.jpg',
      'prefab_16_2400x1200.jpg',
      'prefab_18_1800x1210.jpg',
      'prefab_19_1800x1200.jpg',
      'prefab_25_1580x1053.jpg',
      'prefab_28_1600x995.jpg',
      'prefab_29_1500x1051.jpg',
      'prefab_31_1500x1051.jpg',
      'prefab_37_1200x840.jpg',
    ]);
  });

  it('declares unique positive-dimension derivatives and illustrative alt text', () => {
    const derivativeNames = manifest.images.flatMap(image => {
      expect(image.label).toBe('Illustrative reference');
      expect(image.alt).toContain('Illustrative reference');
      return image.derivatives.map(derivative => {
        expect(derivative.width).toBeGreaterThan(0);
        expect(derivative.height).toBeGreaterThan(0);
        return derivative.name;
      });
    });

    expect(new Set(derivativeNames).size).toBe(derivativeNames.length);
  });
});
```

- [ ] **Step 2: Run the test and verify it fails because the manifest does not exist**

Run: `pnpm test src/data/marketing/image-manifest.test.ts`

Expected: FAIL with an `ENOENT` error for `image-manifest.json`.

- [ ] **Step 3: Create the canonical image manifest**

Create `src/data/marketing/image-manifest.json` with this exact data. All
derivative names produce both `.webp` and `.jpg` files. Only hero and dusk CTA
need mobile crops.

```json
{
  "images": [
    {
      "id": "homeHero",
      "source": "prefab_2_2048x1365.jpg",
      "label": "Illustrative reference",
      "alt": "Illustrative reference of a contemporary prefab residence at dusk",
      "focalPoint": "centre",
      "derivatives": [
        { "name": "home-hero-desktop", "width": 2400, "height": 1500 },
        { "name": "home-hero-mobile", "width": 1200, "height": 1500 }
      ]
    },
    {
      "id": "villageStory",
      "source": "prefab_10_2500x1667.jpg",
      "label": "Illustrative reference",
      "alt": "Illustrative reference of a warm contemporary prefab residence",
      "focalPoint": "centre",
      "derivatives": [
        { "name": "village-story", "width": 1800, "height": 1200 }
      ]
    },
    {
      "id": "ownershipStory",
      "source": "prefab_6_4368x2912.jpg",
      "label": "Illustrative reference",
      "alt": "Illustrative reference of a modern modular home in a natural setting",
      "focalPoint": "centre",
      "derivatives": [
        { "name": "ownership-story", "width": 1800, "height": 1200 }
      ]
    },
    {
      "id": "diasporaLifestyle",
      "source": "prefab_8_2943x1962.jpg",
      "label": "Illustrative reference",
      "alt": "Illustrative reference of a covered outdoor living space at a prefab home",
      "focalPoint": "centre",
      "derivatives": [
        { "name": "diaspora-lifestyle", "width": 1600, "height": 1200 }
      ]
    },
    {
      "id": "villageBanner",
      "source": "prefab_16_2400x1200.jpg",
      "label": "Illustrative reference",
      "alt": "Illustrative reference of a low-profile prefab residence in evening light",
      "focalPoint": "centre",
      "derivatives": [
        { "name": "village-banner", "width": 2520, "height": 1080 }
      ]
    },
    {
      "id": "homeDetail",
      "source": "prefab_18_1800x1210.jpg",
      "label": "Illustrative reference",
      "alt": "Illustrative reference of a compact timber prefab home",
      "focalPoint": "centre",
      "derivatives": [{ "name": "home-detail", "width": 1800, "height": 1200 }]
    },
    {
      "id": "confidenceFeature",
      "source": "prefab_19_1800x1200.jpg",
      "label": "Illustrative reference",
      "alt": "Illustrative reference of a modern prefab residence with a broad roofline",
      "focalPoint": "centre",
      "derivatives": [
        { "name": "confidence-feature", "width": 1600, "height": 1200 }
      ]
    },
    {
      "id": "ownershipPage",
      "source": "prefab_25_1580x1053.jpg",
      "label": "Illustrative reference",
      "alt": "Illustrative reference of a multi-level contemporary prefab residence",
      "focalPoint": "centre",
      "derivatives": [
        { "name": "ownership-page", "width": 1800, "height": 1200 }
      ]
    },
    {
      "id": "architectureGallery",
      "source": "prefab_28_1600x995.jpg",
      "label": "Illustrative reference",
      "alt": "Illustrative reference of a glass-fronted prefab home",
      "focalPoint": "centre",
      "derivatives": [
        { "name": "architecture-gallery", "width": 1600, "height": 1200 }
      ]
    },
    {
      "id": "warmDetail",
      "source": "prefab_29_1500x1051.jpg",
      "label": "Illustrative reference",
      "alt": "Illustrative reference of a warm contemporary prefab exterior",
      "focalPoint": "centre",
      "derivatives": [{ "name": "warm-detail", "width": 1600, "height": 1200 }]
    },
    {
      "id": "duskCta",
      "source": "prefab_31_1500x1051.jpg",
      "label": "Illustrative reference",
      "alt": "Illustrative reference of a welcoming prefab home at dusk",
      "focalPoint": "centre",
      "derivatives": [
        { "name": "dusk-cta-desktop", "width": 2400, "height": 1500 },
        { "name": "dusk-cta-mobile", "width": 1200, "height": 1500 }
      ]
    },
    {
      "id": "briefingClose",
      "source": "prefab_37_1200x840.jpg",
      "label": "Illustrative reference",
      "alt": "Illustrative reference of a landscaped prefab residence",
      "focalPoint": "centre",
      "derivatives": [
        { "name": "briefing-close", "width": 1800, "height": 1200 }
      ]
    }
  ]
}
```

- [ ] **Step 4: Create typed site and page-copy modules**

Create `src/data/marketing/site.ts`:

```ts
export const marketingSite = {
  name: 'Swift Holdings',
  email: 'info@swiftholdings.org',
  phone: '+233 544 101016',
  address: '20 Edmonton St, Madina, Accra',
  primaryCta: { label: 'Request a private briefing', href: '/briefing' },
  navigation: [
    { href: '/village', label: 'The Village' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/ownership', label: 'Ownership' },
    { href: '/protections', label: 'Protections' },
    { href: '/accra', label: 'Accra' },
    { href: '/about', label: 'About' },
  ],
} as const;

export type MarketingPageKey =
  | 'home'
  | 'village'
  | 'howItWorks'
  | 'ownership'
  | 'protections'
  | 'accra'
  | 'about'
  | 'briefing';
```

Create `src/data/marketing/pages.ts` with a typed object keyed by
`MarketingPageKey`. Use the approved copy below rather than fractional-share,
yield, rental-return, or securities language.

| Key           | Hero title                                      | Required page-specific sections                                                                                      |
| ------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `home`        | `A home in Accra, built with certainty.`        | Oyarifa/proof strip; “The better way to make Accra home from abroad”; three reasons; selected gallery; briefing CTA. |
| `village`     | `A quieter way to return to Accra.`             | Oyarifa context; village lifestyle; reference gallery; briefing CTA.                                                 |
| `howItWorks`  | `From first conversation to a home base.`       | Briefing; explore the village; understand the path; prepare for the next decision.                                   |
| `ownership`   | `Know what you are choosing before you commit.` | Buyer fit; topics covered in a briefing; clarity before commitment.                                                  |
| `protections` | `Clarity before confidence.`                    | What is confirmed; what remains to be confirmed; questions to ask in a briefing.                                     |
| `accra`       | `A homecoming needs local context.`             | Oyarifa perspective; living from abroad; practical questions for a private briefing.                                 |
| `about`       | `Why Swift exists.`                             | Why the village matters; standards; an honest, buyer-first next step.                                                |
| `briefing`    | `Tell us what you are planning.`                | Briefing form; privacy copy; personal-reply expectation.                                                             |

- [ ] **Step 5: Run the manifest test and record the expected missing-asset failure**

Run: `pnpm test src/data/marketing/image-manifest.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit the data contract**

```bash
git add src/data/marketing/site.ts src/data/marketing/pages.ts src/data/marketing/image-manifest.json src/data/marketing/image-manifest.test.ts
```

## Task 2: Generate and Validate Curated Marketing Image Derivatives

**Files:**

- Create: `scripts/prepare-marketing-images.mjs`
- Create: `scripts/validate-marketing-images.mjs`
- Create: `src/assets/images/marketing/*.webp`
- Create: `src/assets/images/marketing/*.jpg`
- Create: `src/data/marketing/image-assets.ts`
- Modify: `package.json`
- Modify: `public/social.png`
- Modify: `public/icon-192.png`
- Modify: `public/icon-512.png`
- Modify: `public/apple-touch-icon.png`

- [ ] **Step 1: Extend the manifest test with a failing committed-derivative assertion**

Re-add the `existsSync` import and append this test to
`src/data/marketing/image-manifest.test.ts`:

```ts
it('has committed derivatives after local preparation', () => {
  for (const image of manifest.images) {
    for (const derivative of image.derivatives) {
      expect(
        existsSync(
          new URL(
            `../../assets/images/marketing/${derivative.name}.webp`,
            import.meta.url
          )
        )
      ).toBe(true);
      expect(
        existsSync(
          new URL(
            `../../assets/images/marketing/${derivative.name}.jpg`,
            import.meta.url
          )
        )
      ).toBe(true);
    }
  }
});
```

Run: `pnpm test src/data/marketing/image-manifest.test.ts`

Expected: FAIL because no derivatives have been generated yet.

- [ ] **Step 2: Create the local Sharp preparation script**

Create `scripts/prepare-marketing-images.mjs`. It must:

```js
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';

const root = new URL('..', import.meta.url).pathname;
const sourceDirectory =
  process.env.PREFAB_SOURCE_DIR ?? join(homedir(), 'Desktop', 'PREFAB');
const manifestPath = join(root, 'src/data/marketing/image-manifest.json');
const outputDirectory = join(root, 'src/assets/images/marketing');
const publicDirectory = join(root, 'public');

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
await mkdir(outputDirectory, { recursive: true });

for (const image of manifest.images) {
  const source = join(sourceDirectory, image.source);
  for (const derivative of image.derivatives) {
    const pipeline = sharp(source).rotate().resize({
      width: derivative.width,
      height: derivative.height,
      fit: 'cover',
      position: image.focalPoint,
    });

    await pipeline
      .clone()
      .webp({ quality: 82 })
      .toFile(join(outputDirectory, `${derivative.name}.webp`));
    await pipeline
      .clone()
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(join(outputDirectory, `${derivative.name}.jpg`));
  }
}
```

After the derivative loop, generate a `1200 x 630` `public/social.png` from
`homeHero` with a left-to-right `#2A1C46` translucent overlay and the text
`Swift Holdings` / `A home in Accra, built with certainty.`. Generate
`icon-192.png`, `icon-512.png`, and `apple-touch-icon.png` from this SVG
buffer, using Sharp PNG output:

```js
const monogram = Buffer.from(`
  <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="96" fill="#2A1C46"/>
    <path d="M152 156h208v54H220v39h112c39 0 68 23 68 59 0 35-28 58-70 58H152v-54h176c10 0 17-5 17-13 0-9-8-14-19-14H214c-39 0-64-23-64-58 0-42 29-71 72-71Z" fill="white"/>
  </svg>
`);

const homeHero = manifest.images.find(image => image.id === 'homeHero');
if (!homeHero)
  throw new Error('homeHero is missing from the marketing manifest.');

const socialOverlay = Buffer.from(`
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="shade" x1="0" x2="1"><stop stop-color="#2A1C46" stop-opacity="0.92"/><stop offset="0.7" stop-color="#2A1C46" stop-opacity="0.18"/><stop offset="1" stop-color="#2A1C46" stop-opacity="0"/></linearGradient></defs>
    <rect width="1200" height="630" fill="url(#shade)"/>
    <text x="72" y="90" fill="white" font-family="Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="3">SWIFT HOLDINGS</text>
    <text x="72" y="390" fill="white" font-family="Arial, sans-serif" font-size="64" font-weight="700">A home in Accra,</text>
    <text x="72" y="462" fill="white" font-family="Arial, sans-serif" font-size="64" font-weight="700">built with certainty.</text>
  </svg>
`);

await sharp(join(sourceDirectory, homeHero.source))
  .rotate()
  .resize(1200, 630, { fit: 'cover', position: homeHero.focalPoint })
  .composite([{ input: socialOverlay, top: 0, left: 0 }])
  .png()
  .toFile(join(publicDirectory, 'social.png'));

await writeFile(join(publicDirectory, 'icon.svg'), monogram);
await Promise.all([
  sharp(monogram)
    .resize(192, 192)
    .png()
    .toFile(join(publicDirectory, 'icon-192.png')),
  sharp(monogram)
    .resize(512, 512)
    .png()
    .toFile(join(publicDirectory, 'icon-512.png')),
  sharp(monogram)
    .resize(180, 180)
    .png()
    .toFile(join(publicDirectory, 'apple-touch-icon.png')),
]);
```

Do not trust the `.jpg` suffix: Sharp must decode every source by content and
write the requested WebP/JPEG derivative type.

- [ ] **Step 3: Create the CI-safe derivative validator**

Create `scripts/validate-marketing-images.mjs` to read the same JSON manifest,
check both output formats for every derivative, and inspect the output
metadata with Sharp. It must set `process.exitCode = 1` and print every missing
or wrong-size asset in this format:

```text
missing: src/assets/images/marketing/home-hero-desktop.webp
wrong dimensions: src/assets/images/marketing/home-hero-desktop.jpg expected 2400x1500, found 2399x1500
```

Use this validation core:

```js
import { readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import sharp from 'sharp';

const root = new URL('..', import.meta.url).pathname;
const manifestPath = join(root, 'src/data/marketing/image-manifest.json');
const outputDirectory = join(root, 'src/assets/images/marketing');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const formats = ['webp', 'jpg'];
const failures = [];

for (const image of manifest.images) {
  for (const derivative of image.derivatives) {
    for (const format of formats) {
      const path = join(outputDirectory, `${derivative.name}.${format}`);
      try {
        const metadata = await sharp(path).metadata();
        if (
          metadata.width !== derivative.width ||
          metadata.height !== derivative.height
        ) {
          failures.push(
            `wrong dimensions: ${relative(root, path)} expected ${derivative.width}x${derivative.height}, found ${metadata.width}x${metadata.height}`
          );
        }
      } catch {
        failures.push(`missing: ${relative(root, path)}`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
}
```

- [ ] **Step 4: Add package scripts and run preparation against the curated Desktop library**

Update `package.json` scripts:

```json
{
  "images:prepare": "node scripts/prepare-marketing-images.mjs",
  "images:validate": "node scripts/validate-marketing-images.mjs",
  "build": "pnpm images:validate && astro check && astro build"
}
```

Run:

```bash
PREFAB_SOURCE_DIR="$HOME/Desktop/PREFAB" pnpm images:prepare
pnpm images:validate
```

Expected: `images:validate` exits `0`. Inspect generated assets with `sips -g
pixelWidth -g pixelHeight src/assets/images/marketing/home-hero-desktop.webp`
and confirm `2400 x 1500`.

- [ ] **Step 5: Create static Astro imports for all derivatives**

Create `src/data/marketing/image-assets.ts` with one typed record per image
ID. Follow this exact shape:

```ts
import type { ImageMetadata } from 'astro';
import homeHeroDesktopJpeg from '@images/marketing/home-hero-desktop.jpg';
import homeHeroDesktopWebp from '@images/marketing/home-hero-desktop.webp';
import homeHeroMobileJpeg from '@images/marketing/home-hero-mobile.jpg';
import homeHeroMobileWebp from '@images/marketing/home-hero-mobile.webp';
import villageStoryJpeg from '@images/marketing/village-story.jpg';
import villageStoryWebp from '@images/marketing/village-story.webp';
import ownershipStoryJpeg from '@images/marketing/ownership-story.jpg';
import ownershipStoryWebp from '@images/marketing/ownership-story.webp';
import diasporaLifestyleJpeg from '@images/marketing/diaspora-lifestyle.jpg';
import diasporaLifestyleWebp from '@images/marketing/diaspora-lifestyle.webp';
import villageBannerJpeg from '@images/marketing/village-banner.jpg';
import villageBannerWebp from '@images/marketing/village-banner.webp';
import homeDetailJpeg from '@images/marketing/home-detail.jpg';
import homeDetailWebp from '@images/marketing/home-detail.webp';
import confidenceFeatureJpeg from '@images/marketing/confidence-feature.jpg';
import confidenceFeatureWebp from '@images/marketing/confidence-feature.webp';
import ownershipPageJpeg from '@images/marketing/ownership-page.jpg';
import ownershipPageWebp from '@images/marketing/ownership-page.webp';
import architectureGalleryJpeg from '@images/marketing/architecture-gallery.jpg';
import architectureGalleryWebp from '@images/marketing/architecture-gallery.webp';
import warmDetailJpeg from '@images/marketing/warm-detail.jpg';
import warmDetailWebp from '@images/marketing/warm-detail.webp';
import duskCtaDesktopJpeg from '@images/marketing/dusk-cta-desktop.jpg';
import duskCtaDesktopWebp from '@images/marketing/dusk-cta-desktop.webp';
import duskCtaMobileJpeg from '@images/marketing/dusk-cta-mobile.jpg';
import duskCtaMobileWebp from '@images/marketing/dusk-cta-mobile.webp';
import briefingCloseJpeg from '@images/marketing/briefing-close.jpg';
import briefingCloseWebp from '@images/marketing/briefing-close.webp';

export interface MarketingImageAsset {
  alt: string;
  label: 'Illustrative reference';
  desktop: { jpeg: ImageMetadata; webp: ImageMetadata };
  mobile?: { jpeg: ImageMetadata; webp: ImageMetadata };
}

export const marketingImages = {
  homeHero: {
    alt: 'Illustrative reference of a contemporary prefab residence at dusk',
    label: 'Illustrative reference',
    desktop: { jpeg: homeHeroDesktopJpeg, webp: homeHeroDesktopWebp },
    mobile: { jpeg: homeHeroMobileJpeg, webp: homeHeroMobileWebp },
  },
  villageStory: {
    alt: 'Illustrative reference of a warm contemporary prefab residence',
    label: 'Illustrative reference',
    desktop: { jpeg: villageStoryJpeg, webp: villageStoryWebp },
  },
  ownershipStory: {
    alt: 'Illustrative reference of a modern modular home in a natural setting',
    label: 'Illustrative reference',
    desktop: { jpeg: ownershipStoryJpeg, webp: ownershipStoryWebp },
  },
  diasporaLifestyle: {
    alt: 'Illustrative reference of a covered outdoor living space at a prefab home',
    label: 'Illustrative reference',
    desktop: { jpeg: diasporaLifestyleJpeg, webp: diasporaLifestyleWebp },
  },
  villageBanner: {
    alt: 'Illustrative reference of a low-profile prefab residence in evening light',
    label: 'Illustrative reference',
    desktop: { jpeg: villageBannerJpeg, webp: villageBannerWebp },
  },
  homeDetail: {
    alt: 'Illustrative reference of a compact timber prefab home',
    label: 'Illustrative reference',
    desktop: { jpeg: homeDetailJpeg, webp: homeDetailWebp },
  },
  confidenceFeature: {
    alt: 'Illustrative reference of a modern prefab residence with a broad roofline',
    label: 'Illustrative reference',
    desktop: { jpeg: confidenceFeatureJpeg, webp: confidenceFeatureWebp },
  },
  ownershipPage: {
    alt: 'Illustrative reference of a multi-level contemporary prefab residence',
    label: 'Illustrative reference',
    desktop: { jpeg: ownershipPageJpeg, webp: ownershipPageWebp },
  },
  architectureGallery: {
    alt: 'Illustrative reference of a glass-fronted prefab home',
    label: 'Illustrative reference',
    desktop: { jpeg: architectureGalleryJpeg, webp: architectureGalleryWebp },
  },
  warmDetail: {
    alt: 'Illustrative reference of a warm contemporary prefab exterior',
    label: 'Illustrative reference',
    desktop: { jpeg: warmDetailJpeg, webp: warmDetailWebp },
  },
  duskCta: {
    alt: 'Illustrative reference of a welcoming prefab home at dusk',
    label: 'Illustrative reference',
    desktop: { jpeg: duskCtaDesktopJpeg, webp: duskCtaDesktopWebp },
    mobile: { jpeg: duskCtaMobileJpeg, webp: duskCtaMobileWebp },
  },
  briefingClose: {
    alt: 'Illustrative reference of a landscaped prefab residence',
    label: 'Illustrative reference',
    desktop: { jpeg: briefingCloseJpeg, webp: briefingCloseWebp },
  },
} satisfies Record<string, MarketingImageAsset>;
```

- [ ] **Step 6: Run image tests and validation**

Run:

```bash
pnpm test src/data/marketing/image-manifest.test.ts
pnpm images:validate
```

Expected: PASS, then exit code `0`.

- [ ] **Step 7: Commit generated assets and pipeline**

```bash
git add package.json pnpm-lock.yaml scripts/prepare-marketing-images.mjs scripts/validate-marketing-images.mjs src/assets/images/marketing src/data/marketing/image-assets.ts src/data/marketing/image-manifest.test.ts public/social.png public/icon.svg public/icon-192.png public/icon-512.png public/apple-touch-icon.png
```

## Task 3: Establish the Isolated Swift Marketing Layout and Shared Visual Primitives

**Files:**

- Create: `src/assets/styles/marketing.css`
- Create: `src/layout/MarketingLayout.astro`
- Create: `src/components/marketing/SiteHeader.astro`
- Create: `src/components/marketing/SiteFooter.astro`
- Create: `src/components/marketing/ImageFrame.astro`
- Create: `src/components/marketing/MarketingHero.astro`
- Create: `src/components/marketing/ProofStrip.astro`
- Create: `src/components/marketing/StorySplit.astro`
- Create: `src/components/marketing/NumberedSteps.astro`
- Create: `src/components/marketing/ConfidenceList.astro`

- [ ] **Step 1: Create buyer-journey CSS without changing legacy global styles**

Create `src/assets/styles/marketing.css` and define the tokens and rules below.
Do not remove legacy teal/blueprint utilities from `global.css`; legacy routes
still use them in Phase 1.

```css
:root {
  --marketing-paper: #f8f7f4;
  --marketing-ink: #21182b;
  --marketing-muted: #685f6c;
  --marketing-rule: #ddd6cf;
  --marketing-violet: #2a1c46;
  --marketing-violet-hover: #1c0e2a;
}

.marketing-shell {
  min-height: 100vh;
  background: var(--marketing-paper);
  color: var(--marketing-ink);
}

.marketing-container {
  width: min(100% - 2rem, 72rem);
  margin-inline: auto;
}

.marketing-eyebrow {
  color: var(--marketing-muted);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.marketing-button-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  background: var(--marketing-violet);
  color: #fff;
  font-weight: 650;
  padding: 0.75rem 1rem;
  transition: background-color 160ms ease;
}

.marketing-button-primary:hover,
.marketing-button-primary:focus-visible {
  background: var(--marketing-violet-hover);
}

.marketing-button-link {
  color: var(--marketing-violet);
  font-weight: 650;
}

.marketing-image-frame {
  position: relative;
  overflow: hidden;
  background: #e8e3dc;
}

.marketing-image-label {
  position: absolute;
  inset: 0.75rem auto auto 0.75rem;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.9);
  color: var(--marketing-violet);
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 0.375rem 0.5rem;
  text-transform: uppercase;
}

@media (max-width: 47.999rem) {
  .marketing-container {
    width: min(100% - 1.25rem, 72rem);
  }
}
```

- [ ] **Step 2: Create `MarketingLayout.astro` with Swift-only metadata**

Use one `AstroFont` Outfit registration, `SEO`, `Schema`, `SiteHeader`, and
`SiteFooter`. Do not import `ClientRouter`, Lenis, legacy `Navbar`, legacy
`Footer`, or DataNova schema defaults.

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
}
const { seo } = Astro.props;
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
        imageAlt: 'Swift Holdings illustrative prefab residence',
      }}
      extend={{
        link: [
          { rel: 'icon', href: '/icon.svg', type: 'image/svg+xml' },
          { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
          { rel: 'manifest', href: '/manifest.webmanifest' },
        ],
      }}
    />
    <Schema item={schema} />
    <AstroFont
      config={[
        {
          src: [],
          name: 'Outfit',
          googleFontsURL:
            'https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap',
          preload: true,
          display: 'swap',
          selector: 'body',
          fallback: 'sans-serif',
        },
      ]}
    />
  </head>
  <body class="marketing-shell selection:bg-[#2A1C46] selection:text-white">
    <a
      href="#main-content"
      class="marketing-button-primary sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
      >Skip to content</a
    >
    <SiteHeader />
    <main id="main-content" tabindex="-1"><slot /></main>
    <SiteFooter />
  </body>
</html>
```

- [ ] **Step 3: Create accessible native-navigation header and focused footer**

`SiteHeader.astro` must import `marketingSite`, use the route path for
`aria-current`, and use a native `<details>` mobile menu. Its desktop navigation
uses `marketingSite.navigation`; the only primary button links to `/briefing`.

```astro
---
import { marketingSite } from '@/data/marketing/site';
const currentPath = Astro.url.pathname;
---

<header class="border-b border-[var(--marketing-rule)] bg-white">
  <div
    class="marketing-container flex min-h-18 items-center justify-between gap-4 py-4"
  >
    <a href="/" class="text-sm font-bold tracking-[0.04em]"
      >SWIFT <span class="font-normal">HOLDINGS</span></a
    >
    <nav
      class="hidden items-center gap-5 lg:flex"
      aria-label="Primary navigation"
    >
      {
        marketingSite.navigation.map(item => (
          <a
            href={item.href}
            aria-current={currentPath === item.href ? 'page' : undefined}
            class="text-sm text-[var(--marketing-muted)] hover:text-[var(--marketing-ink)]"
          >
            {item.label}
          </a>
        ))
      }
      <a
        class="marketing-button-primary text-sm"
        href={marketingSite.primaryCta.href}>{marketingSite.primaryCta.label}</a
      >
    </nav>
    <details class="relative lg:hidden">
      <summary
        class="cursor-pointer rounded border border-[var(--marketing-rule)] px-3 py-2 text-sm"
        >Menu</summary
      >
      <nav
        class="absolute top-16 right-3 z-20 grid min-w-60 gap-1 border border-[var(--marketing-rule)] bg-white p-3 shadow-lg"
        aria-label="Mobile navigation"
      >
        {
          marketingSite.navigation.map(item => (
            <a
              href={item.href}
              aria-current={currentPath === item.href ? 'page' : undefined}
              class="rounded px-3 py-2 text-sm hover:bg-[#f1edf5]"
            >
              {item.label}
            </a>
          ))
        }
        <a
          class="marketing-button-primary mt-2 text-sm"
          href={marketingSite.primaryCta.href}
          >{marketingSite.primaryCta.label}</a
        >
      </nav>
    </details>
  </div>
</header>
```

`SiteFooter.astro` must contain the Swift name, email link, phone link,
address, `Illustrative reference imagery used for concept direction.`, and one
link to `/briefing`. Do not include the old newsletter, fractional ownership,
or securities disclaimer.

- [ ] **Step 4: Create the image and content primitives**

`ImageFrame.astro` receives a `MarketingImageAsset`, a `ratio`, `loading`, and
optional `class`. It must reserve the ratio in CSS, render desktop and optional
mobile WebP/JPEG sources, eager-load only heroes, and always render the visible
label from `image.label`.

```astro
---
import type { MarketingImageAsset } from '@/data/marketing/image-assets';
interface Props {
  image: MarketingImageAsset;
  ratio: string;
  loading?: 'eager' | 'lazy';
  class?: string;
}
const { image, ratio, loading = 'lazy', class: className = '' } = Astro.props;
---

<figure
  class:list={['marketing-image-frame', className]}
  style={`aspect-ratio:${ratio}`}
>
  <picture>
    {
      image.mobile && (
        <source
          media="(max-width: 767px)"
          srcset={image.mobile.webp.src}
          type="image/webp"
        />
      )
    }
    {
      image.mobile && (
        <source
          media="(max-width: 767px)"
          srcset={image.mobile.jpeg.src}
          type="image/jpeg"
        />
      )
    }
    <source srcset={image.desktop.webp.src} type="image/webp" />
    <img
      src={image.desktop.jpeg.src}
      width={image.desktop.jpeg.width}
      height={image.desktop.jpeg.height}
      alt={image.alt}
      loading={loading}
      decoding={loading === 'eager' ? 'sync' : 'async'}
      class="h-full w-full object-cover"
    />
  </picture>
  <figcaption class="marketing-image-label">{image.label}</figcaption>
</figure>
```

Create the remaining components with these stable interfaces:

```ts
// MarketingHero props
{ eyebrow: string; title: string; lead: string; image: MarketingImageAsset; secondaryCta?: { label: string; href: string } }

// ProofStrip props
{ items: ReadonlyArray<{ label: string; value: string }> }

// StorySplit props
{ eyebrow: string; title: string; body: string; image: MarketingImageAsset; reverse?: boolean }

// NumberedSteps props
{ eyebrow: string; title: string; steps: ReadonlyArray<{ title: string; body: string }> }

// ConfidenceList props
{ eyebrow: string; title: string; confirmed: readonly string[]; discuss: readonly string[] }
```

Each primitive uses `marketing-container`, has one mobile column below `768px`,
and never creates nested generic cards.

Create `MarketingHero.astro` with this complete structure:

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
  secondaryCta?: { label: string; href: string };
}

const { eyebrow, title, lead, image, secondaryCta } = Astro.props;
---

<section
  class="marketing-container grid items-center gap-10 py-12 lg:grid-cols-[1.04fr_0.96fr] lg:py-20"
>
  <div>
    <p class="marketing-eyebrow">{eyebrow}</p>
    <h1
      class="mt-4 max-w-xl text-5xl font-semibold tracking-[-0.05em] text-[var(--marketing-ink)] sm:text-6xl lg:text-7xl"
    >
      {title}
    </h1>
    <p class="mt-6 max-w-xl text-lg leading-8 text-[var(--marketing-muted)]">
      {lead}
    </p>
    <div class="mt-8 flex flex-wrap items-center gap-5">
      <a class="marketing-button-primary" href={marketingSite.primaryCta.href}
        >{marketingSite.primaryCta.label}</a
      >
      {
        secondaryCta && (
          <a class="marketing-button-link" href={secondaryCta.href}>
            {secondaryCta.label}
          </a>
        )
      }
    </div>
    <p class="mt-6 text-sm text-[var(--marketing-muted)]">
      A guided conversation, not a public sales funnel.
    </p>
  </div>
  <ImageFrame image={image} ratio="16 / 10" loading="eager" />
</section>
```

Create `ProofStrip.astro` and `StorySplit.astro` with these exact structures:

```astro
---
interface Props {
  items: ReadonlyArray<{ label: string; value: string }>;
}
const { items } = Astro.props;
---

<section class="border-y border-[var(--marketing-rule)] bg-white">
  <div
    class="marketing-container grid divide-y divide-[var(--marketing-rule)] md:grid-cols-3 md:divide-x md:divide-y-0"
  >
    {
      items.map(item => (
        <div class="py-5 md:px-6 first:md:pl-0 last:md:pr-0">
          <p class="marketing-eyebrow">{item.label}</p>
          <p class="mt-2 text-lg font-semibold">{item.value}</p>
        </div>
      ))
    }
  </div>
</section>
```

```astro
---
import ImageFrame from '@/components/marketing/ImageFrame.astro';
import type { MarketingImageAsset } from '@/data/marketing/image-assets';

interface Props {
  eyebrow: string;
  title: string;
  body: string;
  image: MarketingImageAsset;
  reverse?: boolean;
}
const { eyebrow, title, body, image, reverse = false } = Astro.props;
---

<section
  class="marketing-container grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24"
>
  <div class:list={{ 'lg:order-2': reverse }}>
    <p class="marketing-eyebrow">{eyebrow}</p>
    <h2 class="mt-3 text-4xl font-semibold tracking-[-0.04em]">{title}</h2>
    <p class="mt-5 max-w-xl leading-8 text-[var(--marketing-muted)]">{body}</p>
  </div>
  <ImageFrame image={image} ratio="3 / 2" />
</section>
```

Create `NumberedSteps.astro` and `ConfidenceList.astro` with the following
markup so process and trust content remain factual and readable:

```astro
---
interface Props {
  eyebrow: string;
  title: string;
  steps: ReadonlyArray<{ title: string; body: string }>;
}
const { eyebrow, title, steps } = Astro.props;
---

<section class="marketing-container py-16 lg:py-24">
  <p class="marketing-eyebrow">{eyebrow}</p>
  <h2 class="mt-3 max-w-2xl text-4xl font-semibold tracking-[-0.04em]">
    {title}
  </h2>
  <ol
    class="mt-10 grid gap-6 border-t border-[var(--marketing-rule)] pt-6 md:grid-cols-2"
  >
    {
      steps.map((step, index) => (
        <li class="grid grid-cols-[auto_1fr] gap-4">
          <span class="grid size-7 place-items-center rounded-full bg-[#2A1C46] text-xs font-bold text-white">
            {index + 1}
          </span>
          <div>
            <>
              <h3 class="text-xl font-semibold">{step.title}</h3>
              <p class="mt-2 leading-7 text-[var(--marketing-muted)]">
                {step.body}
              </p>
            </>
          </div>
        </li>
      ))
    }
  </ol>
</section>
```

```astro
---
interface Props {
  eyebrow: string;
  title: string;
  confirmed: readonly string[];
  discuss: readonly string[];
}
const { eyebrow, title, confirmed, discuss } = Astro.props;
---

<section class="marketing-container py-16 lg:py-24">
  <p class="marketing-eyebrow">{eyebrow}</p>
  <h2 class="mt-3 max-w-2xl text-4xl font-semibold tracking-[-0.04em]">
    {title}
  </h2>
  <div class="mt-10 grid gap-8 md:grid-cols-2">
    <article class="border-t border-[var(--marketing-rule)] pt-5">
      <h3 class="text-xl font-semibold">What is clear now</h3><ul
        class="mt-4 grid gap-3 text-[var(--marketing-muted)]"
      >
        {confirmed.map(item => <li>{item}</li>)}
      </ul>
    </article>
    <article class="border-t border-[var(--marketing-rule)] pt-5">
      <h3 class="text-xl font-semibold">What to discuss directly</h3><ul
        class="mt-4 grid gap-3 text-[var(--marketing-muted)]"
      >
        {discuss.map(item => <li>{item}</li>)}
      </ul>
    </article>
  </div>
</section>
```

- [ ] **Step 5: Typecheck the foundation**

Run: `pnpm check`

Expected: PASS. Fix only new marketing component type errors before continuing.

- [ ] **Step 6: Commit the marketing foundation**

```bash
git add src/assets/styles/marketing.css src/layout/MarketingLayout.astro src/components/marketing
```

## Task 4: Implement and Test Direct Private-Briefing Delivery

**Files:**

- Create: `src/utils/briefing-form.ts`
- Create: `src/utils/briefing-form.test.ts`
- Create: `src/components/marketing/BriefingForm.astro`
- Modify: `src/env.d.ts`
- Modify: `.env.template`

- [ ] **Step 1: Write failing unit tests for pure briefing validation and delivery results**

Create `src/utils/briefing-form.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import {
  submitBriefing,
  validateBriefing,
  type BriefingPayload,
} from './briefing-form';

const validPayload: BriefingPayload = {
  name: 'Ama Mensah',
  email: 'ama@example.com',
  phone: '+1 555 0100',
  country: 'Canada',
  interest: 'Owning a home',
  timeframe: '6-12 months',
  message: 'I would like to understand the next step.',
  consent: true,
  website: '',
};

describe('validateBriefing', () => {
  it('accepts a complete private-briefing request', () => {
    expect(validateBriefing(validPayload)).toEqual({});
  });

  it('returns field messages for missing consent and invalid email', () => {
    expect(
      validateBriefing({
        ...validPayload,
        email: 'not-an-email',
        consent: false,
      })
    ).toMatchObject({
      email: 'Enter a valid email address.',
      consent: 'Confirm that Swift may reply to this request.',
    });
  });
});

describe('submitBriefing', () => {
  it('silently succeeds for a honeypot submission', async () => {
    const fetcher = vi.fn();
    await expect(
      submitBriefing({
        endpoint: 'https://formspree.io/f/example',
        payload: { ...validPayload, website: 'https://bot.invalid' },
        fetcher,
      })
    ).resolves.toEqual({ kind: 'success' });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('returns fallback when no public Formspree endpoint is configured', async () => {
    await expect(
      submitBriefing({ endpoint: '', payload: validPayload })
    ).resolves.toEqual({ kind: 'fallback' });
  });

  it('returns success only after a successful Formspree response', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(new Response('', { status: 200 }));
    await expect(
      submitBriefing({
        endpoint: 'https://formspree.io/f/example',
        payload: validPayload,
        fetcher,
      })
    ).resolves.toEqual({ kind: 'success' });
  });

  it('keeps the form retryable after a network error', async () => {
    const fetcher = vi.fn().mockRejectedValue(new TypeError('Network failed'));
    await expect(
      submitBriefing({
        endpoint: 'https://formspree.io/f/example',
        payload: validPayload,
        fetcher,
      })
    ).resolves.toEqual({
      kind: 'error',
      message:
        'We could not send your request. Please try again or email us directly.',
    });
  });

  it('returns a retryable error after the request times out', async () => {
    const fetcher = vi.fn(
      (_input: RequestInfo | URL, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(new DOMException('Timed out', 'AbortError'))
          );
        })
    );

    await expect(
      submitBriefing({
        endpoint: 'https://formspree.io/f/example',
        payload: validPayload,
        fetcher: fetcher as typeof fetch,
        timeoutMs: 0,
      })
    ).resolves.toEqual({
      kind: 'error',
      message:
        'We could not send your request. Please try again or email us directly.',
    });
  });
});
```

- [ ] **Step 2: Run the test and verify it fails because the module does not exist**

Run: `pnpm test src/utils/briefing-form.test.ts`

Expected: FAIL with `Failed to load url ./briefing-form`.

- [ ] **Step 3: Implement the pure form module**

Create `src/utils/briefing-form.ts` with exact public types and behavior:

```ts
export interface BriefingPayload {
  name: string;
  email: string;
  phone: string;
  country: string;
  interest: string;
  timeframe: string;
  message: string;
  consent: boolean;
  website: string;
}

export type BriefingFieldErrors = Partial<
  Record<keyof BriefingPayload, string>
>;
export type BriefingSubmissionResult =
  | { kind: 'success' }
  | { kind: 'fallback' }
  | { kind: 'error'; message: string };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateBriefing(
  payload: BriefingPayload
): BriefingFieldErrors {
  const errors: BriefingFieldErrors = {};
  if (!payload.name.trim()) errors.name = 'Enter your full name.';
  if (!emailPattern.test(payload.email.trim()))
    errors.email = 'Enter a valid email address.';
  if (!payload.country.trim()) errors.country = 'Select your current country.';
  if (!payload.interest.trim())
    errors.interest = 'Select what brings you to Swift.';
  if (!payload.timeframe.trim()) errors.timeframe = 'Select your timeframe.';
  if (!payload.consent)
    errors.consent = 'Confirm that Swift may reply to this request.';
  return errors;
}

export async function submitBriefing({
  endpoint,
  payload,
  fetcher = fetch,
  timeoutMs = 10_000,
}: {
  endpoint: string;
  payload: BriefingPayload;
  fetcher?: typeof fetch;
  timeoutMs?: number;
}): Promise<BriefingSubmissionResult> {
  if (!endpoint.trim()) return { kind: 'fallback' };
  if (payload.website) return { kind: 'success' };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const formData = new FormData();
    for (const [key, value] of Object.entries(payload)) {
      formData.set(key, String(value));
    }
    const response = await fetcher(endpoint, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
      signal: controller.signal,
    });
    return response.ok
      ? { kind: 'success' }
      : {
          kind: 'error',
          message:
            'We could not send your request. Please try again or email us directly.',
        };
  } catch {
    return {
      kind: 'error',
      message:
        'We could not send your request. Please try again or email us directly.',
    };
  } finally {
    clearTimeout(timeout);
  }
}
```

The global `setTimeout` keeps the function testable in the Node Vitest
environment. Explicitly return `fallback` before creating `FormData` when the
endpoint is blank. Do not call the legacy JSON helper or `/api/contact`.

- [ ] **Step 4: Run the form utility tests and make them pass**

Run: `pnpm test src/utils/briefing-form.test.ts`

Expected: PASS.

- [ ] **Step 5: Create the accessible briefing form component**

`BriefingForm.astro` must render these fields and error slots:

```text
name, email, phone, country, interest, timeframe, message, consent, website
```

Use these `name` values exactly. Mark `name`, `email`, `country`, `interest`,
`timeframe`, and `consent` required. Use a hidden, `aria-hidden` `website`
honeypot. Read the build-time public endpoint in frontmatter:

```astro
---
import { marketingSite } from '@/data/marketing/site';
const endpoint =
  import.meta.env.PUBLIC_FORMSPREE_BRIEFING_ENDPOINT?.trim() ?? '';
const fallbackHref = `mailto:${marketingSite.email}?subject=${encodeURIComponent('Private briefing request')}`;
---
```

Give every input `aria-describedby` pointing to its corresponding
`[data-error-for]` element. Include a `role="status" aria-live="polite"`
region. Bind a page-load script that:

1. Reads the `FormData` into a `BriefingPayload`.
2. Clears prior inline errors.
3. Calls `validateBriefing` and writes errors to matching error slots.
4. Focuses the first invalid element.
5. If the endpoint is blank, reveals the direct `mailto:` fallback and does not
   call `fetch`.
6. Disables the submit control while `submitBriefing` is pending.
7. Resets only on `{ kind: 'success' }`.
8. Preserves all values and reveals retry/email fallback on `{ kind: 'error' }`.

Use this exact conversion before validation so every input name agrees with
`BriefingPayload`:

```ts
const formData = new FormData(form);
const payload: BriefingPayload = {
  name: String(formData.get('name') ?? ''),
  email: String(formData.get('email') ?? ''),
  phone: String(formData.get('phone') ?? ''),
  country: String(formData.get('country') ?? ''),
  interest: String(formData.get('interest') ?? ''),
  timeframe: String(formData.get('timeframe') ?? ''),
  message: String(formData.get('message') ?? ''),
  consent: formData.get('consent') === 'on',
  website: String(formData.get('website') ?? ''),
};
```

Add a `<noscript>` block containing the same email link. Do not add an external
`form action`; the existing CSP needs no change because this is a JS `fetch` to
the already allowed `connect-src https://formspree.io` origin.

- [ ] **Step 6: Add the public environment type and template entry**

Append to `src/env.d.ts`:

```ts
readonly PUBLIC_FORMSPREE_BRIEFING_ENDPOINT?: string;
```

Replace the top of `.env.template` with:

```dotenv
# Swift Holdings form delivery configuration
# Set these values locally in .env and in Cloudflare Pages before a production build.
# PUBLIC_FORMSPREE_BRIEFING_ENDPOINT is intentionally public: Astro embeds it in the static client build.
# Leave it blank only when the visible mailto fallback is intentional.

PUBLIC_FORMSPREE_BRIEFING_ENDPOINT=

# Legacy server-side forms below remain for Phase 2 routes only.
FORMSPREE_CONTACT_ENDPOINT=
FORM_WEBHOOK_CONTACT=
FORMSPREE_NEWSLETTER_ENDPOINT=
FORM_WEBHOOK_NEWSLETTER=
```

- [ ] **Step 7: Run typecheck and form tests**

Run:

```bash
pnpm test src/utils/briefing-form.test.ts
pnpm check
```

Expected: PASS.

- [ ] **Step 8: Commit the briefing flow**

```bash
git add src/utils/briefing-form.ts src/utils/briefing-form.test.ts src/components/marketing/BriefingForm.astro src/env.d.ts .env.template
```

## Task 5: Rebuild Home and The Village Around the Approved Photo-Led Direction

**Files:**

- Modify: `src/pages/index.astro`
- Create: `src/pages/village.astro`

- [ ] **Step 1: Replace the home page section stack with the approved composition**

Keep `export const prerender = true`. Replace all legacy section imports with
`MarketingLayout`, `MarketingHero`, `ProofStrip`, `StorySplit`, and
`ImageFrame`. The page must follow this exact order:

1. Hero: `A home in Accra, built with certainty.` with `marketingImages.homeHero`.
2. Proof strip: `Location / Oyarifa, Accra`, `Approach / Prefab-led precision`,
   `First step / Private briefing`.
3. Story split: `The better way to make Accra home from abroad.` with
   `marketingImages.villageStory`.
4. Three unboxed reasons: `Built with precision`, `A guided ownership path`,
   `Designed for life abroad`.
5. Two-image village/lifestyle section using `diasporaLifestyle` and
   `architectureGallery`.
6. Final violet CTA panel using `duskCta` and `/briefing`.

Use this scaffold:

```astro
---
export const prerender = true;
import MarketingLayout from '@layout/MarketingLayout.astro';
import MarketingHero from '@/components/marketing/MarketingHero.astro';
import ProofStrip from '@/components/marketing/ProofStrip.astro';
import StorySplit from '@/components/marketing/StorySplit.astro';
import ImageFrame from '@/components/marketing/ImageFrame.astro';
import { marketingImages } from '@/data/marketing/image-assets';
import { marketingPages } from '@/data/marketing/pages';

const page = marketingPages.home;
const reasons = [
  {
    title: 'Built with precision',
    body: 'A prefab-led approach replaces improvised, distant decision-making with a clearer process.',
  },
  {
    title: 'A guided ownership path',
    body: 'The first conversation is designed to make the next decision more informed, not more pressured.',
  },
  {
    title: 'Designed for life abroad',
    body: 'The site speaks to a home base for family, return visits, and the future.',
  },
];
---

<MarketingLayout seo={page.seo}>
  <MarketingHero
    {...page.hero}
    image={marketingImages.homeHero}
    secondaryCta={{ label: 'See how it works', href: '/how-it-works' }}
  />
  <ProofStrip items={page.proof} />
  <StorySplit {...page.story} image={marketingImages.villageStory} />
  <section class="marketing-container py-20">
    <div
      class="grid gap-8 border-t border-[var(--marketing-rule)] pt-6 md:grid-cols-3"
    >
      {
        reasons.map((reason, index) => (
          <article>
            <p class="text-sm font-bold text-[var(--marketing-violet)]">
              0{index + 1}
            </p>
            <h2 class="mt-3 text-2xl font-semibold tracking-[-0.03em]">
              {reason.title}
            </h2>
            <p class="mt-3 leading-7 text-[var(--marketing-muted)]">
              {reason.body}
            </p>
          </article>
        ))
      }
    </div>
  </section>
  <section class="marketing-container grid gap-5 pb-20 md:grid-cols-2">
    <ImageFrame image={marketingImages.diasporaLifestyle} ratio="4 / 3" />
    <ImageFrame image={marketingImages.architectureGallery} ratio="4 / 3" />
  </section>
  <section class="bg-[#2A1C46] py-16 text-white">
    <div
      class="marketing-container grid items-center gap-8 md:grid-cols-[1fr_0.8fr]"
    >
      <div>
        <p class="marketing-eyebrow text-white/70">The next step</p>
        <h2 class="mt-3 text-4xl font-semibold tracking-[-0.04em]">
          See whether Swift fits your plans.
        </h2>
        <a
          class="mt-6 inline-flex rounded-md border border-white/75 px-4 py-3 font-semibold"
          href="/briefing">Request a private briefing</a
        >
      </div>
      <ImageFrame image={marketingImages.duskCta} ratio="16 / 10" />
    </div>
  </section>
</MarketingLayout>
```

- [ ] **Step 2: Create `/village` as a specific place-and-lifestyle route**

Create `src/pages/village.astro` with `prerender = true`, the village SEO data,
and this sequence:

1. Hero title: `A quieter way to return to Accra.` with `villageBanner`.
2. Oyarifa story split using `homeDetail`.
3. A three-item “What the village is designed to support” list: `A home base`,
   `Time with family`, `A calmer return rhythm`.
4. A controlled two-image gallery using `warmDetail` and
   `architectureGallery`, each visibly labelled illustrative.
5. Final `/briefing` CTA.

Do not use language that asserts construction completion, amenities, titles,
or delivery dates that are not confirmed in the proposal.

- [ ] **Step 3: Run page-level typecheck and static build inspection**

Run:

```bash
pnpm check
pnpm build
test -f dist/client/index.html
```

Expected: every command exits `0`.

- [ ] **Step 4: Visually inspect desktop and mobile Home/Village**

Run a local preview, then capture both widths:

```bash
pnpm preview --host 127.0.0.1 --port 4321
```

Use browser automation at `1440x900` and `390x844` to verify: hero images have
labels, no horizontal overflow appears, headings wrap naturally, the header CTA
links to `/briefing`, and the mobile disclosure exposes all six nav links.

- [ ] **Step 5: Commit Home and The Village**

```bash
git add src/pages/index.astro src/pages/village.astro
```

## Task 6: Build How It Works, Ownership, and Protections Pages

**Files:**

- Create: `src/pages/how-it-works.astro`
- Create: `src/pages/ownership.astro`
- Modify: `src/pages/protections.astro`

- [ ] **Step 1: Create the four-step How It Works page**

Create `src/pages/how-it-works.astro` with `prerender = true`. Use
`MarketingHero` with `ownershipStory`, then `NumberedSteps` with these exact
steps:

```ts
[
  {
    title: 'Start with a private briefing',
    body: 'Share what you are looking for and the questions you need answered.',
  },
  {
    title: 'Explore the village direction',
    body: 'Review the Oyarifa concept, reference visuals, and what is currently known.',
  },
  {
    title: 'Understand the path before deciding',
    body: 'Talk through buyer fit, timing, practical next steps, and open questions.',
  },
  {
    title: 'Prepare for the next confirmed step',
    body: 'Move forward only with the information and documentation appropriate to your decision.',
  },
];
```

Close with `warmDetail` and a briefing CTA. Do not claim a purchase contract,
handover date, or legal structure that has not been approved.

- [ ] **Step 2: Create the ownership decision page**

Create `src/pages/ownership.astro` with `prerender = true`. Use
`ownershipPage` as hero imagery and these three sections:

1. `Who this is for`: diaspora buyers seeking a considered home base rather
   than a generic investment dashboard.
2. `What a briefing should clarify`: current project status, buyer fit,
   practical questions, and next steps.
3. `What not to assume`: reference visuals are illustrative; legal, price,
   schedule, and construction details require direct confirmation.

Use `StorySplit`, a three-item list, and a single `/briefing` CTA. Exclude
share tiers, ADR, occupancy, yields, profit share, and securities language.

- [ ] **Step 3: Replace protections content with verified buyer confidence**

Modify `src/pages/protections.astro` to use `MarketingLayout`,
`MarketingHero`, and `ConfidenceList`, with `prerender = true`.

Pass these lists to `ConfidenceList`:

```ts
const confirmed = [
  'The site presents a buyer-first private briefing before asking for a decision.',
  'Reference imagery is labelled clearly while project photography is finalized.',
  'Questions that affect a purchase are surfaced before a visitor is asked to proceed.',
];

const discuss = [
  'Current project status and the documentation available for review.',
  'Ownership, timing, pricing, and delivery details relevant to your situation.',
  'Which details are confirmed now and which are still being finalized.',
];
```

Do not retain `clear title`, `secondary window`, `quarterly reporting`, or
other unverified investor-protection claims from `ProtectionsSection.astro`.

- [ ] **Step 4: Verify new routes are prerendered and visually coherent**

Run:

```bash
pnpm check
pnpm build
```

Then smoke-test `/how-it-works`, `/ownership`, and `/protections` at desktop
and `390px` mobile widths. Confirm no legacy `LeadCTA`, `PageHeader`,
`SwiftStats`, or investor-share terminology is rendered.

- [ ] **Step 5: Commit the buyer-decision pages**

```bash
git add src/pages/how-it-works.astro src/pages/ownership.astro src/pages/protections.astro
```

## Task 7: Build Accra, About Swift, and the Private Briefing Route

**Files:**

- Create: `src/pages/accra.astro`
- Create: `src/pages/briefing.astro`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/404.astro`

- [ ] **Step 1: Create the Accra context page**

Create `src/pages/accra.astro` with `prerender = true`. Use `homeDetail` for
the hero and `confidenceFeature` for a story split. Its content must be
practical and modest:

```text
Hero: A homecoming needs local context.
Story heading: Start with the questions that matter in Oyarifa.
Three prompts: How often will you be in Accra? Who will use the home? What needs to be clear before you decide?
```

End in `/briefing`; do not use uncited population, price, rental, or market
return statistics from the legacy insights components.

- [ ] **Step 2: Replace About Swift with the approved buyer-first story**

Modify `src/pages/about.astro` with `prerender = true`, `MarketingLayout`,
and `villageStory` imagery. Use these principles exactly:

```ts
const principles = [
  {
    title: 'A more considered path home',
    body: 'Swift exists to make a return to Accra feel more legible from abroad.',
  },
  {
    title: 'Clarity before momentum',
    body: 'The site and briefing are designed to surface questions before a buyer is asked to act.',
  },
  {
    title: 'A village, not a product dashboard',
    body: 'The work is about a home base, local context, and a more grounded ownership conversation.',
  },
];
```

Do not mention shares, yield, operator splits, or DataNova. Include a visible
illustrative-reference image label and briefing CTA.

- [ ] **Step 3: Create the briefing page and mount the new form**

Create `src/pages/briefing.astro` with `prerender = true`. It must use
`MarketingLayout`, have the hero title `Tell us what you are planning.`, render
`BriefingForm`, and present these three next-step statements beside it:

```text
1. You share the essentials.
2. Swift reviews your request.
3. You get a personal reply.
```

State `We use your details only to reply to this request.` and do not claim a
reply deadline unless the business has formally confirmed one.

- [ ] **Step 4: Rebuild the 404 page in the marketing layout**

Modify `src/pages/404.astro` to use `MarketingLayout`, title `Page not found`,
copy `The page you requested is not part of the current Swift Holdings site.`,
and exactly two recovery links: `Return home` (`/`) and `Request a private
briefing` (`/briefing`). Remove DataNova SEO/schema, teal styling, support
resources, and `history.back()` JavaScript.

- [ ] **Step 5: Validate routes and form fallback behavior locally**

Run:

```bash
pnpm test src/utils/briefing-form.test.ts
pnpm check
pnpm build
```

Start local preview without `PUBLIC_FORMSPREE_BRIEFING_ENDPOINT`. Verify that
`/briefing` visibly shows the email fallback and does not report a success
message after submit.

- [ ] **Step 6: Commit the final core content routes**

```bash
git add src/pages/accra.astro src/pages/about.astro src/pages/briefing.astro src/pages/404.astro
```

## Task 8: Add Cloudflare Redirects, Metadata, and Static-Deployment Hygiene

**Files:**

- Create: `public/_redirects`
- Modify: `src/pages/robots.txt.ts`
- Modify: `public/manifest.webmanifest`
- Modify: `public/icon.svg`
- Modify: `README.md`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

- [ ] **Step 1: Add permanent legacy marketing redirects**

Create `public/_redirects` exactly:

```text
/platform /village 301
/the-model /how-it-works 301
/investment /ownership 301
/market-insights /accra 301
/contact /briefing 301
```

This preserves existing deployed marketing URLs while allowing their old
DataNova/investor implementation files to remain untouched in Phase 1.

- [ ] **Step 2: Make robots static and correct**

Modify `src/pages/robots.txt.ts`:

```ts
import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /keystatic',
      'Disallow: /api/',
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
```

Do not declare a sitemap URL until the project actually generates one.

- [ ] **Step 3: Replace manifest branding and verify generated icon assets**

Replace `public/manifest.webmanifest` with:

```json
{
  "short_name": "Swift",
  "name": "Swift Holdings",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "display": "minimal-ui",
  "id": "/",
  "start_url": "/",
  "theme_color": "#2A1C46",
  "background_color": "#F8F7F4"
}
```

Verify that the Task 2 generator emitted `public/icon.svg` with the same
`#2A1C46` / white monogram geometry and no external font reference. Do not hand
edit the generated SVG after this validation.

- [ ] **Step 4: Update Cloudflare Pages documentation and remove unused Vercel adapter package**

First confirm no active code imports Vercel:

```bash
rg "@astrojs/vercel|adapter\(vercel|vercel\.json" src astro.config.mjs package.json README.md
```

Expected: only the unused package manifest entry and stale README deployment
wording remain.

Then run:

```bash
pnpm remove @astrojs/vercel
```

Replace the README deployment section with:

```text
Cloudflare Pages

- Repository: jolimensportal/swiftholdings
- Production branch: main
- Node version: 22 (from .nvmrc)
- Build command: pnpm run build
- Build output directory: dist/client
- Required build variable: PUBLIC_FORMSPREE_BRIEFING_ENDPOINT
```

Leave `astro.config.mjs` server output and the Cloudflare adapter unchanged in
this task. The eight buyer routes are prerendered; legacy server routes are
not part of the Phase 1 static conversion path.

- [ ] **Step 5: Build and inspect the deploy artifact**

Run:

```bash
pnpm build
```

Expected: every command exits `0`.

- [ ] **Step 6: Commit deployment hygiene**

```bash
git add public/_redirects src/pages/robots.txt.ts public/manifest.webmanifest README.md package.json pnpm-lock.yaml
```

## Task 9: Run the Full Offline Quality Gate Before Any Push

**Files:**

- Test: `src/data/marketing/image-manifest.test.ts`
- Test: `src/utils/briefing-form.test.ts`
- Verify: all files created or modified in Tasks 1-8

- [ ] **Step 1: Run formatting, unit tests, typecheck, and production build**

Run:

```bash
pnpm format:check
pnpm test
pnpm check
pnpm build
```

Expected: all commands exit `0`.

- [ ] **Step 2: Smoke-test every buyer route in the static preview**

Run local preview:

```bash
pnpm preview --host 127.0.0.1 --port 4321
```

Use browser automation to visit:

```text
/
/village
/how-it-works
/ownership
/protections
/accra
/about
/briefing
/platform
/the-model
/investment
/market-insights
/contact
```

Verify the first eight return Swift page content. Verify the final five return
their permanent destinations. Check both `1440x900` and `390x844` viewports
for no horizontal scroll, usable native mobile navigation, visible focus, and
no clipped form fields or images.

- [ ] **Step 3: Exercise briefing success and failure states**

At `/briefing`:

1. Submit empty fields and verify inline messages plus focus on the first
   invalid field.
2. Run without the public endpoint and verify the visible mail fallback rather
   than a false success.
3. With a disposable/form-test Formspree endpoint in a local `.env`, submit a
   complete request and verify success/reset behavior.
4. Block the Formspree request in browser automation and verify values remain,
   retry is visible, and email fallback appears.

- [ ] **Step 4: Verify content and image truthfulness**

Search the eight source pages and marketing components:

```bash
rg "DataNova|Excel|yield|ADR|fractional ownership|shareholder|secondary window|clear title" src/pages/index.astro src/pages/village.astro src/pages/how-it-works.astro src/pages/ownership.astro src/pages/protections.astro src/pages/accra.astro src/pages/about.astro src/pages/briefing.astro src/components/marketing
```

Expected: no matches. Also verify every image frame visibly renders
`Illustrative reference` and every alt string begins with that phrase.

- [ ] **Step 5: Review the final diff before push**

Run:

```bash
git status --short
git diff --stat 8ffbc2a..HEAD
```

Confirm no `.env`, `.wrangler`, `Desktop/PREFAB` sources, `.superpowers`, or
unrelated legacy support/download changes are staged.

- [ ] **Step 6: Commit only any QA fixes that were required**

If QA required changes, stage only the exact files fixed and commit with a
specific message such as:

```bash
git add src/components/marketing/BriefingForm.astro src/assets/styles/marketing.css
```

If QA required no changes, do not create an empty commit. Do not push until the
human partner explicitly asks for a push or Cloudflare deployment.
