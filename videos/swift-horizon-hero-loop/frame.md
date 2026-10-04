---
name: Swift Horizon — hero ground
extends: null
description: The ambient background ground for the Swift Horizon homepage hero.
---

# Frame — Swift Horizon hero ground

Brand truth is **the live site's own token set** (`src/assets/styles/marketing.css`).
Nothing here invents a colour; the two non-brand values are haze and glint tints
sampled from the photograph's own sky.

## Tokens

| Role | Value | Source |
|---|---|---|
| Ground / deepest shadow | `#0F0E0D` obsidian | `--marketing-obsidian-900` |
| Canvas (unused here — this is a dark ground) | `#F4EFE6` | `--ground-canvas` |
| Accent — warm haze | `#D6AC7A` | `--ground-gold` |
| Accent — specular glint | `#F4D88F` | `--accent-light` |
| Accent — deep bronze (unused on this dark ground) | `#6E4F22` | `--ground-gold-on-canvas` |

One accent hue family (gold, ~40° hue), warm-tinted neutrals, no cool grey, no
pure `#000`/`#FFF`. Matches the parent page exactly, so the loop reads as part
of the site rather than as a video dropped onto it.

## Concept angle

**A camera that keeps watching after you stop looking.** One continuous,
uninterrupted dolly across a single savanna photograph at dusk — no cuts, no
tour, no rooms to inspect. The place simply continues.

## Type

**None.** This piece carries no text, no logo, no numerals. Cormorant Garamond
and Manrope belong to the page, not the ground — loading them here would only
cost render time. Consequence: the frame can never compete with the H1, which
is the entire design requirement.

## Composition

- **Focal element — right-of-centre, at the horizon line (~42% x, ~50% y):** the
  lit residence glazing under the acacia canopy. This is the only warm light
  source in frame and it is what the glint sweeps across.
- **Second focal point — lower right (~70% x, ~80% y):** near-field grass and
  rock, the fastest-moving plane. The eye travels from the lit building down
  into the grass and back out. Two destinations, no centre.
- **Edge anchors:** all four edges are held by content — canopy top-left,
  open sky top-right, rock bottom-left, grass mass bottom-right. No letterbox
  band, no empty margin.
- **Text-safe zone:** the left 45% is deliberately the darkest, lowest-contrast
  region of the frame. It carries no focal element by design. The page's own
  `--hero-gradient-left` scrim lands here and completes the type bed.
- **Background treatment:** radial only. `video-composition.md` forbids
  full-screen linear gradients on dark grounds (H.264 banding) — so the
  vignette is radial and off-centre at `62% 42%`, which pushes the darkening
  toward the lower-left and does the type-bed work without a scrim.

## Depth

Three planes reconstructed from one photograph by cropping it into bands and
scaling each about the **frame centre**, so all three register pixel-exactly at
scale 1 and separate only through differential scale + translation:

| Plane | Band | Scale | X travel | Cycles / loop |
|---|---|---|---|---|
| Far — sky, canopy, distant grass | full frame | 1.000 → 1.035 | −10px | 1 |
| Mid — residence, deck | 40% → 78% | 1.000 → 1.060 | −26px | 2 |
| Near — grass, rock | 69% → 100% | 1.000 → 1.100 | −46px | 3 |

Band top edges are masked to transparent over 22% (mid) and 16% (near) so the
differential motion has no hard seam to reveal. At scale 1 all three plates are
the same crop of the same file, so frame 0 reconstructs the photograph exactly —
which is what makes the loop seam invisible.

## Motion

Every tween is `sine.inOut` + `yoyo` with a finite `repeat`, all starting at 0
and all summing to exactly 24s, so **frame 0 and frame 720 are identical**.
Because 12s is the midpoint of any push-and-return loop, all three planes reach
their turnaround at t=12 — this is deliberate coherence, not a hitch: the far
plane's reversal is 0.35%/s with C1-continuous ease, while mid and near are at
maximum velocity through the same instant.

Grain is **static**. Animated grain at 30fps over a dark ground shimmers under
H.264 and reads as idle motion; a static seeded `feTurbulence` is deterministic,
costs one frame, and adds texture without movement.

## Don'ts

- No cuts, no dissolves between vistas, no second photograph in v1.
- No letterboxing, no bars, no vignette so heavy it reads as a filter.
- No logo, no wordmark, no numerals, no faces, no signage.
- No saturated blue or teal — the sky must stay in the photograph's own
  lavender/rose.
