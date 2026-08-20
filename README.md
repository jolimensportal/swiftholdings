# Swift Holdings

Swift Holdings is a buyer-first marketing site for diaspora homebuyers considering a home base in Oyarifa, Accra.

## Requirements

- Node 22, selected through `.nvmrc`
- pnpm 10

## Local Development

```bash
nvm use 22
pnpm install
PREFAB_SOURCE_DIR="$HOME/Desktop/PREFAB" pnpm images:prepare
pnpm dev
```

The curated source library is local-only. Do not commit originals from `Desktop/PREFAB`; commit only the generated WebP/JPEG derivatives in `src/assets/images/marketing`.

## Checks

```bash
pnpm images:validate
pnpm test
pnpm check
pnpm build
```

`pnpm build` validates committed image derivatives before typechecking and creating the Cloudflare Pages artifact.

## Private Briefing

Set `PUBLIC_FORMSPREE_BRIEFING_ENDPOINT` locally and in Cloudflare Pages before a production build. It is intentionally public because Astro embeds it into the static client bundle.

When the variable is blank, the private-briefing form preserves entered values and shows a visible `mailto:` fallback instead of reporting success.

## Cloudflare Pages

- Repository: `jolimensportal/swiftholdings`
- Production branch: `main`
- Node version: `22` from `.nvmrc`
- Build command: `pnpm run build`
- Build output directory: `dist/client`
- Required build variable: `PUBLIC_FORMSPREE_BRIEFING_ENDPOINT`

The core buyer routes are prerendered into `dist/client`. Legacy server routes remain during the Phase 1 transition, but buyer pages do not depend on them.

## Image Truthfulness

All current marketing imagery is an illustrative reference, not completed Swift Holdings project photography. The shared image component renders a visible reference label and descriptive alt text on every curated image.
 
