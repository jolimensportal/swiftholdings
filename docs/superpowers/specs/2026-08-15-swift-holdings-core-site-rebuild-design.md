# Swift Holdings Core-Site Rebuild Design

## Status

Approved through the visual companion on 2026-08-15. This supersedes the
visitor-facing direction in `2026-08-14-swift-holdings-design.md` for the
core marketing site. The prior document remains historical context.

## Goal

Rebuild the public Swift Holdings marketing experience locally before any
further Cloudflare Pages deployment. The result must feel premium, calm, and
considered for diaspora homebuyers exploring a home base in Oyarifa, Accra.

The core site must:

- Remove inherited DataNova wording, layout patterns, and unrelated visual
  motifs from the buyer journey.
- Use a small, deliberate component system rather than bespoke page stacks.
- Use only curated reference imagery with exact crop ratios and clear
  illustrative labels.
- Route visitors toward one useful conversion action: request a private
  briefing.
- Be built and visually reviewed offline before it is pushed to Cloudflare
  Pages.

## Approved Decisions

| Area | Decision |
| --- | --- |
| Primary audience | Diaspora homebuyers looking for a dependable home base in Accra. |
| Primary conversion | `Request a private briefing`. |
| Visual direction | Premium and spacious: photo-led, high-end real-estate calm, generous whitespace. |
| Type | Outfit for headings and body. |
| Brand violet | `#2A1C46` for primary actions only; `#1C0E2A` for hover states. |
| Excluded accent | No yellow. Violet is not used as a general page background or heading color. |
| Image truthfulness | All current images are references, never completed Swift Holdings homes. Visible labels and alt text must say `Illustrative reference` where relevant. |
| Deployment discipline | Local build and visual QA pass before a Git push or Cloudflare Pages deployment. |

## Scope

### Phase 1: Core Marketing Site

The redesign covers these eight buyer-facing pages:

1. Home
2. The Village
3. How It Works
4. Ownership
5. Protections
6. Accra
7. About Swift
8. Private Briefing

The current support, downloads, reference, articles, whitepapers, and sample
spreadsheets areas are Phase 2. They remain functional but are not exposed as
primary navigation during Phase 1.

### Route Plan

Existing public marketing URLs have a concrete deployed history, so the new
route names receive redirects rather than breaking old links.

| New route | Purpose | Existing route redirected to it |
| --- | --- | --- |
| `/` | Buyer promise and primary conversion | N/A |
| `/village` | Oyarifa context, lifestyle, home types | `/platform` |
| `/how-it-works` | Four-step ownership path and timeline | `/the-model` |
| `/ownership` | What ownership includes and who it serves | `/investment` |
| `/protections` | Safeguards, standards, and verified facts | Existing route retained |
| `/accra` | Oyarifa context and practical diaspora insight | `/market-insights` |
| `/about` | Why Swift exists and the team behind it | Existing route retained |
| `/briefing` | Private briefing form and next-step expectations | `/contact` |

## Information Architecture

The main navigation is intentionally short:

```text
The Village | How It Works | Ownership | Protections | Accra | About | Request a briefing
```

Each page has one job and ends with the same calm next step:

| Page | Job | Required sections |
| --- | --- | --- |
| Home | Establish the promise and earn a briefing request | Hero, proof strip, village story, three reasons, selected images, briefing CTA |
| The Village | Make the location and lifestyle tangible | Oyarifa story, village context, home typologies, curated gallery, briefing CTA |
| How It Works | Explain the ownership path without jargon | Four-step process, timing expectations, common questions, briefing CTA |
| Ownership | Explain what a buyer receives and how the decision is structured | Buyer fit, inclusions, decision points, briefing CTA |
| Protections | Build confidence through specific, verifiable safeguards | Standards, transparency, what is confirmed versus illustrative, briefing CTA |
| Accra | Give practical local context for diaspora buyers | Oyarifa context, homecoming story, local considerations, briefing CTA |
| About Swift | Explain the company and its intent | Why Swift, principles, people, briefing CTA |
| Private Briefing | Collect a qualified lead and set expectations | Short form, privacy explanation, what happens next, fallback contact |

## Visual System

### Page Grammar

Core pages use a small repeated grammar:

1. A spacious, photo-led hero.
2. A compact proof or context strip.
3. One image-story relationship, not a collection of unrelated cards.
4. A limited proof, feature, or process section.
5. One primary CTA: `Request a private briefing`.

The layout avoids stacked bento cards, unnecessary gradients, dense widgets,
and repeated competing calls to action.

### Typography and Color

- Outfit supplies the entire type system.
- Headings use tight tracking and an editorial scale without serif styling.
- Backgrounds stay off-white with deep near-black text and thin neutral rules.
- `#2A1C46` is reserved for primary buttons, primary CTA panels, and small
  purposeful accents.
- Buttons have one visual hierarchy: primary violet, secondary text link, and
  no yellow accent state.

### Responsive Rules

- Desktop content uses a readable max width and clear two-column relationships.
- Mobile becomes a single reading column; no squeezed side-by-side forms,
  cards, navigation, or images.
- Headlines wrap naturally and never use per-word nonbreaking spacing.
- Navigation collapses to an accessible menu before it overflows.
- Every image frame has an explicit aspect ratio and an intentional
  `object-position`.

## Image Strategy

### Source Rules

- `/Users/macbookpro/Desktop/PREFAB` is the local source library and is not
  committed to the repository.
- The approved source library contains 83 remaining reference images.
- Some files are WebP images with `.jpg` filenames. The preparation step must
  normalize their output type rather than trust source extensions.
- The primary buyer journey uses a cohesive set of general prefab references.
  Alibaba, China, and container reference sets remain outside the main buyer
  journey because they make the experience feel like a supplier catalogue.

### Curated Reference Library

The following 12 source files are the approved visual library for Phase 1:

| Role | Source file | Native size | Production crop |
| --- | --- | --- | --- |
| Homepage hero | `prefab_2_2048x1365.jpg` | 2048 x 1365 | 16:10 |
| Village story | `prefab_10_2500x1667.jpg` | 2500 x 1667 | 3:2 |
| Ownership story | `prefab_6_4368x2912.jpg` | 4368 x 2912 | 3:2 |
| Diaspora lifestyle | `prefab_8_2943x1962.jpg` | 2943 x 1962 | 4:3 |
| Wide village banner | `prefab_16_2400x1200.jpg` | 2400 x 1200 | 21:9 |
| Home detail | `prefab_18_1800x1210.jpg` | 1800 x 1210 | 3:2 |
| Confidence feature | `prefab_19_1800x1200.jpg` | 1800 x 1200 | 4:3 |
| Ownership page | `prefab_25_1580x1053.jpg` | 1580 x 1053 | 3:2 |
| Architecture gallery | `prefab_28_1600x995.jpg` | 1600 x 995 | 4:3 |
| Warm detail | `prefab_29_1500x1051.jpg` | 1500 x 1051 | 4:3 |
| Dusk CTA | `prefab_31_1500x1051.jpg` | 1500 x 1051 | 16:10 |
| Briefing close | `prefab_37_1200x840.jpg` | 1200 x 840 | 3:2 |

### Derivative Pipeline

1. Keep originals in `Desktop/PREFAB` unchanged.
2. Maintain a committed image manifest that assigns each selected source a
   route role, crop ratio, focal point, alt text, and visible reference label.
3. Generate only the needed derivatives into the project image directory:
   desktop WebP, compatible JPEG fallback when necessary, and mobile crop
   variants for hero and CTA images.
4. Use the derivative, not the original, in every Astro component.
5. The local preparation command validates that every Desktop source exists and
   that every generated derivative matches its declared crop ratio. The
   production build validates only the committed derivative manifest, so it
   never depends on `Desktop/PREFAB` being available in Cloudflare.

Standard image frames:

| Frame | Target size | Use |
| --- | --- | --- |
| Hero | 2400 x 1500 (16:10) | Page opening image |
| Story | 1800 x 1200 (3:2) | Text-image editorial split |
| Feature | 1600 x 1200 (4:3) | Controlled gallery and feature image |
| Banner | 2520 x 1080 (21:9) | Wide CTA or village panorama |

## Component Architecture

The public core pages compose a concise Swift-specific component set. Existing
DataNova components remain available during transition but are not the source
of new buyer-journey layouts.

| Component | Responsibility |
| --- | --- |
| `SiteHeader` | Buyer-first navigation, responsive menu, primary briefing CTA |
| `MarketingHero` | Label, headline, supporting copy, two CTA tiers, 16:10 image frame |
| `ImageFrame` | Enforces ratio, focal point, alt text, and illustrative label |
| `ProofStrip` | Three concise project/context facts |
| `StorySplit` | Editorial text-image section with consistent spacing |
| `NumberedSteps` | Clear process or ownership sequence |
| `ConfidenceList` | Protections and verified facts without exaggerated claims |
| `BriefingForm` | Accessible lead form and direct Formspree submission states |
| `SiteFooter` | Lightweight close, contact path, reference/privacy wording |

Route copy and image roles live in small typed data modules rather than inside
large page files. Pages compose the shared components with route-specific
data. This gives every core page the same visual rhythm while keeping its job
clear.

## Private Briefing Form

### Fields

- Full name (required)
- Email address (required)
- WhatsApp or phone (optional)
- Current country (required)
- Interest (`Owning a home`, `Understanding the village`, or `Investor information`) (required)
- Timeframe (required)
- Optional context message
- Privacy acknowledgement (required)
- Hidden honeypot field

### Client Flow

```text
Native/client validation -> Formspree -> Swift inbox or webhook -> success state
```

The new form posts directly to a public Formspree endpoint configured as
`PUBLIC_FORMSPREE_BRIEFING_ENDPOINT`. This endpoint is intended to be public;
no secret is exposed to the browser.

If that endpoint is absent, the form must not simulate success. It displays a
configured direct-email fallback instead of allowing a submission that cannot
be delivered.

The form must:

- Announce field errors inline and move focus to the first invalid field.
- Preserve all entered values if delivery fails.
- Show a clear retry state plus a direct email fallback.
- Reset only after a confirmed successful submission.
- Avoid client-side logging of lead data.

The existing `/api/contact` and newsletter endpoints are not used by the new
core conversion path. They remain untouched until the legacy/support scope is
reviewed separately.

## Local Build and Cloudflare Workflow

1. Curate source images and generate committed derivatives locally.
2. Build the core pages locally with Node 22 and pnpm.
3. Review desktop and mobile screenshots locally.
4. Run form success and failure tests against a mock or configured Formspree
   endpoint.
5. Run `pnpm build`.
6. Push only the reviewed source and generated assets to
   `jolimensportal/swiftholdings`.
7. Cloudflare Pages builds with `pnpm run build` and serves `dist/client`.
   Redirects for the renamed marketing routes ship through `public/_redirects`.

The existing Cloudflare adapter remains in place during the core redesign so
the legacy app is not destabilized. The new core pages and briefing flow must
work from the static client output and must not rely on a server worker. Legacy
server routes may remain during transition, but no Phase 1 buyer-facing page
may fetch them. Inactive Vercel configuration and stale Vercel wording are
removed only after imports and deployment references are verified unused.

## Error Handling and Accessibility

- Missing image manifest sources fail the local preparation step with the
  filename and route role.
- Missing derivatives render a neutral fallback frame during local development
  and block production publishing until resolved.
- Form network failures retain values, expose retry, and display direct email
  fallback.
- Buttons, links, mobile navigation, and form controls remain keyboard
  reachable with visible focus treatment.
- Labels, helpful error text, status messages, and image alt text are semantic.
- Reference imagery is never described as a completed Swift Holdings home.

## Quality Gates

Before each production push, verify:

1. `pnpm build` succeeds on Node 22.
2. The eight core routes render at 1440px, 1024px, and 390px widths without
   horizontal overflow or clipped content.
3. The header, mobile menu, and primary CTA work on each core route.
4. Every image matches its assigned ratio, preserves its focal point, and has
   no stretching.
5. Every reference image is visibly labelled where it could be confused with
   Swift project photography.
6. Briefing form validation, success, failure, retry, and email fallback work.
7. Legacy marketing routes redirect to their new buyer-first routes.
8. No DataNova name, product copy, or spreadsheet/download navigation appears
   in the Phase 1 buyer journey.

## Tests

- Extend Vitest coverage for briefing-form validation and request-state logic.
- Add a small manifest validation test for source existence, crop configuration,
  and generated derivative presence.
- Run existing `pnpm test`, `pnpm check`, and `pnpm build` before push.
- Use browser smoke checks for the eight core routes at desktop and mobile
  viewport sizes, including keyboard navigation and form states.

## Out of Scope

- Redesigning support, downloads, articles, references, whitepapers, and
  spreadsheet tooling.
- Treating reference imagery as actual Swift project photography.
- Changing financial claims without a separate proposal and legal-content
  review.
- Implementing a custom backend or server worker solely for the briefing form.
