---
workflow: general-video
flow: automation
storyboard: no
message: "The place keeps existing — and keeps earning — while you are not there"
destination: homepage-hero-background
aspect: 1920x1080
language: en
length: 24s
angle: concept
---

## Intent

A silent, seamless background loop for the Swift Horizon homepage hero. It plays
behind the existing H1 ("Own your place in Ghana. Let it work while you're away.")
and its two CTAs, so it must never compete with 60px Cormorant Garamond. The
feeling to convey is *quiet stewardship over distance* — a savanna dwelling at
dusk that is simply still there, holding its light, whether or not anyone is
watching. Not a property tour. Not an amenity reel. Ambient, patient, unhurried.

No narration, no music, no text, no logo. The loop is a ground, not a message.

## Assets

- `assets/home-hero-desktop.jpg` — the site's own approved hero photograph
  (2400x1200, savanna dusk, timber/corten residence under an acacia canopy).
  Staged from `src/assets/images/marketing/home-hero-desktop.jpg`. This is the
  plate for all three depth planes.

## Customizations

- Three-plane parallax reconstructed from the single photograph: sky/tree line
  (far), residence + deck (mid), grass + rocks (near). Real differential camera
  move, no invented imagery.
- Atmosphere pass: warm horizon haze, one slow specular sweep across the glazing,
  radial vignette, fine static grain.

## Notes

- **Text-safe by construction.** All visual interest is held in the right two
  thirds and the lower third. The left ~45% stays dark, low-contrast and
  detail-free because that is where the page's H1 and CTAs sit.
- **Do not bake a directional left scrim.** The page already layers
  `--hero-gradient-left` over the hero element (rgba(10,10,10,.95) → 0). Baking a
  second one would double-darken the type bed. The loop bakes only a *radial*
  vignette, which also avoids the H.264 banding that `video-composition.md`
  warns about for full-screen linear gradients on dark grounds.
- **Seam is the hard requirement.** Frame 0 must equal frame 720 exactly. All
  motion is `sine.inOut` + `yoyo` with `transform-origin` at frame centre, so
  every plane returns to its exact start state.
- Brand truth is the live site's token set: obsidian `#0F0E0D`, canvas
  `#F4EFE6`, gold `#C79A4E` / `#E7C06A`, bronze `#6E4F22`. No new colours are
  invented here; the only new values are the haze/glint tints sampled from the
  photograph's own sky.
- Photography is **illustrative reference material**, consistent with the
  disclosure the site already carries on every image. No faces, no signage, no
  text in frame.
- A 4:5 mobile cut is a separate composition and is out of scope for v1 — the
  site declares `--marketing-image-mobile-ratio: 4 / 5` and ships a distinct
  mobile still, so that cut needs its own band splits.
