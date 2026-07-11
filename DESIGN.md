---
version: alpha
name: Ripple
description: >
  An ink-on-paper kindness brand. Near-black type at a heavy-but-not-bold
  weight sits on white canvas over soft watercolor landscapes; surfaces
  separate with alpha hairlines instead of shadows; every control is a full
  pill. One blue accent is used like ink, and the brand's own sage-and-
  terracotta pair lives only in the ripple mark, the card plaques, and the
  printable cards. Motion is smoothed, never hijacked — reveals rise and
  settle, ambient loops breathe, and the page reads as a sequence of
  one-viewport scenes. Everything should feel like the printed card:
  quiet, warm, hand-made.
colors:
  ink: "#141414"
  ink-hover: "#262626"
  secondary: "#717171"
  muted: "#adadad"
  canvas: "#ffffff"
  card: "#fdfbf6"
  hairline-soft: "#4040400f"
  hairline: "#40404014"
  hairline-mid: "#4040401a"
  hairline-strong: "#4040401f"
  outline: "#41414129"
  button-border: "#e1e1e1"
  accent: "#0065ff"
  sage: "#5d7050"
  terracotta: "#c2704a"
  dark-surface: "#262626"
  on-dark-hairline: "#ededed29"
  on-ink: "#ffffff"
  text-on-art: "#3f3f3f"
typography:
  display-xl:
    fontFamily: "Inter, sans-serif"
    fontSize: 80px
    fontWeight: 652
    lineHeight: 80px
    letterSpacing: -0.6px
  display-lg:
    fontFamily: "Inter, sans-serif"
    fontSize: 56px
    fontWeight: 652
    lineHeight: 56px
    letterSpacing: -0.6px
  heading-md:
    fontFamily: "Inter, sans-serif"
    fontSize: 32px
    fontWeight: 652
    lineHeight: 36px
    letterSpacing: 0
  heading-sm:
    fontFamily: "Inter, sans-serif"
    fontSize: 24px
    fontWeight: 652
    lineHeight: 30px
    letterSpacing: 0
  lede:
    fontFamily: "Inter, sans-serif"
    fontSize: 20px
    fontWeight: 300
    lineHeight: 26px
    letterSpacing: 0
  body-md:
    fontFamily: "Inter, sans-serif"
    fontSize: 16px
    fontWeight: 300
    lineHeight: 22px
    letterSpacing: 0.2px
  ui:
    fontFamily: "Inter, sans-serif"
    fontSize: 16px
    fontWeight: 456
    lineHeight: 22px
    letterSpacing: -0.01em
  small:
    fontFamily: "Inter, sans-serif"
    fontSize: 14px
    fontWeight: 300
    lineHeight: 20px
    letterSpacing: 0.2px
  caption:
    fontFamily: "Inter, sans-serif"
    fontSize: 12px
    fontWeight: 300
    lineHeight: 16px
    letterSpacing: 0.2px
  eyebrow:
    fontFamily: "Inter, sans-serif"
    fontSize: 14px
    fontWeight: 456
    lineHeight: 20px
    letterSpacing: 0.08em
rounded:
  control: 10px
  card-sm: 16px
  card-md: 20px
  card-lg: 24px
  pill: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 40px
  3xl: 64px
  4xl: 80px
  section: 120px
  section-mobile: 80px
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.pill}"
    padding: 16px 20px
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    border: "1px solid {colors.button-border}"
    typography: "{typography.ui}"
    rounded: "{rounded.pill}"
    padding: 16px 20px
  button-glass:
    backgroundColor: "rgba(255,255,255,0.6)"
    backdropFilter: "blur(12px)"
    textColor: "{colors.ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.pill}"
    padding: 16px 20px
  nav-pill:
    backgroundColor: "rgba(255,255,255,0.7)"
    backdropFilter: "blur(40px)"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.pill}"
    height: 60px
  card:
    backgroundColor: "{colors.canvas}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.card-lg}"
    shadow: "none"
  badge:
    backgroundColor: "transparent"
    border: "1px solid {colors.hairline-mid}"
    textColor: "{colors.secondary}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
  plaque:
    backgroundColor: "{colors.card}"
    border: "1px solid {colors.hairline-strong}"
    rounded: 12px
    microText: "{typography.caption} uppercase {colors.secondary}"
    stateText: "22px, weight 652, uppercase, {colors.sage}"
  carousel-button:
    backgroundColor: "transparent"
    border: "1px solid {colors.button-border}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    size: 48px
---

# Ripple — DESIGN.md

> Agent instructions: read this file before writing or changing any UI in this
> repo. Tokens in the YAML are the only allowed values — no invented hexes, no
> rounded numbers, no new shadows. If a needed rule is missing, follow the
> closest rationale below, then add the decision to this file in the same PR.

## Overview

Ripple is a kindness-card movement — print a card, do something kind, leave
the card anywhere — and the site is built to feel like the printed card
itself. The skeleton is a design language extracted from mobbin.com's
production CSS (type scale, spacing rhythm, surface rules); the voice on top
is Ripple's own: soft watercolor landscapes, a heart-over-ripples mark, and
sage/terracotta card details.

The page floor is pure white {colors.canvas} carrying near-black
{colors.ink} type. Hierarchy comes from weight contrast, not color: display
type runs at weight 652 while body text runs light at 300 — nothing in the
system sits on a stock 400/500/700. One blue {colors.accent} exists and is
spent like ink, one moment per screen. The brand pair — {colors.sage} and
{colors.terracotta} — appears only where the physical card shows through:
the logo mark, card plaques, the print sheet. Watercolor artwork supplies
all imagery; photography does not exist here.

**Key Characteristics:**
- Weight does the talking: display at 652 over body at 300 is the brand's
  typographic personality. Never bold body text; never lighten headlines.
- Display type is set solid — line-height equals font-size (80/80, 56/56) —
  with negative tracking; small text takes positive tracking. Headlines read
  as carved blocks, paragraphs stay airy.
- No drop shadows. Depth comes from 6–12% black hairlines
  ({colors.hairline-soft} → {colors.hairline-strong}), a blur(40px) floating
  pill nav, and layering. The single sanctioned shadow is
  `0 8px 40px #0000000a` for genuinely floating panels.
- Every interactive control is a full pill ({rounded.pill}); every surface
  is a rounded card (16–24px).
- Each top-level section is one viewport tall with centered content — the
  page is a sequence of discrete scenes, not a scroll of stacked blocks.
- All imagery is generated watercolor under one prompt contract (see
  Artwork), so sixty images read as one painter's work.

## Colors

### Ink & Text
- **Ink** ({colors.ink}): all reading text and primary buttons. The "black"
  of the system — never pure #000.
- **Ink Hover** ({colors.ink-hover}): primary button hover; also the dark
  band surface. One step warmer than ink.
- **Secondary** ({colors.secondary}): ledes and supporting copy. Ledes are
  gray *by design* — they whisper under the headline.
- **Muted** ({colors.muted}): captions, meta lines, eyebrows, and the
  not-yet-settled state of animated stat lines (they arrive muted, then
  settle to ink).
- **Text on Art** ({colors.text-on-art}): the darker gray for copy sitting
  on watercolor, always with a soft white text-glow; plain
  {colors.secondary} disappears over artwork.

### Surface
- **Canvas** ({colors.canvas}): the page floor. Pure white — the artwork
  supplies all warmth.
- **Card** ({colors.card}): cream reserved for physical-card surfaces
  (modal card faces, plaques, the print sheet) — the paper the brand is
  printed on.
- **Dark Surface** ({colors.dark-surface}): the dusk CTA band, always under
  artwork with a ~42% ink scrim so white type holds contrast.

### Hairlines
- **Hairline Soft → Strong** ({colors.hairline-soft}, {colors.hairline},
  {colors.hairline-mid}, {colors.hairline-strong}): the shadow replacement.
  Soft for hover fills and dividers, default (8%) for card borders, mid for
  badges, strong for interactive outlines. On dark surfaces use
  {colors.on-dark-hairline}.
- **Button Border** ({colors.button-border}): the one solid (non-alpha)
  border — secondary buttons only.

### Accent & Brand
- **Accent** ({colors.accent}): links, the typed-headline cursor, focus
  states. One accent moment per screen; it never fills surfaces.
- **Sage** ({colors.sage}) and **Terracotta** ({colors.terracotta}): the
  ripple mark (terracotta heart, sage rings), plaque state names, print
  sheet accents. These are the *card's* colors — do not promote them to
  general UI.

## Typography

Font: **Inter Variable** — chosen because the source design language uses
the commercial "M Saans" with Inter as its own declared fallback, and
Inter's variable weight axis supports the exact non-standard weights
(652/456/300) that carry the brand.

| Style | Use |
|---|---|
| {typography.display-xl} | Hero headline only; typed-letter animated with {colors.accent} cursor |
| {typography.display-lg} | Section headlines |
| {typography.heading-md}, {typography.heading-sm} | Card and step headings |
| {typography.lede} | Section subtitles, colored {colors.secondary}, max 38ch |
| {typography.body-md} | Reading text, max 60ch |
| {typography.ui} | Buttons, nav links, labels |
| {typography.small}, {typography.caption} | Support text, badges, meta |
| {typography.eyebrow} | Uppercase kickers above headlines, {colors.muted} |

### Principles
- Tracking flips sign with size: −0.6px at display sizes, +0.2px at small
  sizes. This optical correction is non-negotiable.
- Line-heights are pixel values, never unitless ratios — display type at
  ratio 1.0 is what makes headlines feel deliberate.
- Weight 456 (not 400/500) for UI chrome: crisper than regular without
  reading bold.

### Note on Font Substitutes
If M Saans is ever licensed, swap the family only — every weight and metric
in this file was chosen to survive that swap unchanged.

## Layout

- Containers: **960px** for reading content, **1280px** for card grids;
  page margin {spacing.xl} (20px mobile).
- Sections: `min-height: 100vh`, content vertically centered, padded
  {spacing.section} top/bottom ({spacing.section-mobile} on mobile, where
  min-height relaxes to auto).
- The spacing scale is 4px-based; {spacing.lg} is the default gap.
  Generosity is the point — when unsure, take the larger step.
- The nav is a floating pill fixed 16px from the top, never full-width.

## Elevation

One tier. Surfaces sit flat on the canvas separated by hairlines; the nav
and glass buttons float via backdrop-blur, not shadow. Exactly two shadows
exist: the whisper `0 8px 40px #0000000a` (floating panels, fanned print
cards) and a stronger `0 24px 80px rgba(20,20,20,.25)` reserved for the
opened card modal — a physical card lifted off the page is the one thing
allowed to visibly float.

## Motion

Stack: Lenis smooth scroll (lerp 0.1, driven by GSAP's ticker) + GSAP
ScrollTrigger. Native scroll is smoothed, never replaced or scroll-jacked.

- **Reveals:** rise 40px + fade, 0.9s power3.out, 0.08s stagger, triggered
  at `top 80%` per section (`[data-reveal]`).
- **Pinned stats:** the frame pins dead-still while lines rise from 110px
  with power3.out, arriving {colors.muted} and settling to {colors.ink};
  scrub 0.7 gives a catch-up glide. Nothing else moves during a pin —
  parallax on pinned content reads as drift, not depth (tried; removed).
- **Card modal:** FLIP — size the element at final dimensions, animate
  transform scale from the origin rect. Never animate width/height on
  anything containing text (per-frame reflow glitches). Fade text/chrome
  out 0.15s before shrinking.
- **Ambient life:** hero video loop (seam-masked, see Artwork), hover-play
  cinemagraph card covers (`preload="none"`), floating tiles on randomized
  sine wanders (±30px, `repeatRefresh`).
- **Texture:** film grain at 3.5% opacity + 6% edge vignette over
  everything — this is what makes flat art read photographic.
- **Accessibility contract:** every effect above gates behind
  `prefers-reduced-motion`; posters replace video, reveals render visible,
  pins disable.

## Artwork

All imagery is generated (Higgsfield: Nano Banana Pro stills, Seedance
loops). The style contract that keeps the whole set coherent — never drop
any clause:

> "Watercolor anime background art, soft painterly, serene high-key:
> [scene], no people, no animals, no text"

- Backdrops 21:9 at 2k; card art 1:1 at 1k. Encode JPEG q80–85 (512px for
  cards, ≤2304px for backdrops).
- Seamless loops: pass the same still as `start_image` and `end_image`,
  then crossfade a canvas capture of frame 0 over the final 0.5s
  (`SEAM_FADE` in `index.html`) as insurance.
- Text never sits raw on art: white radial glow behind hero copy, gradient
  veils at section seams, ~42% ink scrim on dark artwork.
- Dusk/dark scenes may use the brand's night palette (indigo, firefly gold)
  but must stay in the same painterly hand.

## Components

**`button-primary`** — The ink pill. Background {colors.ink}, text
{colors.on-ink}, type {typography.ui}, padding 16px 20px, rounded
{rounded.pill}. Hover shifts to {colors.ink-hover}. Labels ≤ 4 words.

**`button-secondary`** — Ghost pill: transparent with 1px
{colors.button-border}, text {colors.ink}, hover fills
{colors.hairline-soft}. Use on white canvas only.

**`button-glass`** — The secondary button whenever it sits on artwork: 60%
white fill + blur(12px) so it stays legible over any scene.

**`nav-pill`** — Floating navigation: 60px tall, blur(40px) over 70% white,
{colors.hairline} border, fully pill-shaped. Ripple mark + wordmark left,
links center (pill hover {colors.hairline-soft}), one `button-primary`
right.

**`card`** — Default content card: {colors.canvas} with {colors.hairline}
border, rounded {rounded.card-lg}, no shadow. Covers are 16:10 media;
hover may zoom the media to ~1.07 over 0.5s and play its ambient loop.

**`badge`** — Uppercase pill tag: {typography.caption} tracked wide,
{colors.secondary} text, {colors.hairline-mid} border.

**`plaque`** — The physical-card label: {colors.card} box with
{colors.hairline-strong} border; micro-caption "THIS RIPPLE STARTED IN" in
uppercase {colors.secondary}; state name in 652-weight uppercase
{colors.sage}. Reuse this exact pattern anywhere the printed card is
represented (modal, print fan, print sheet).

**`carousel-button`** — 48px circular ghost button with an arrow glyph;
hover {colors.hairline-soft}.

## Responsive Behavior

| Name | Width | Key Changes |
|---|---|---|
| Mobile | ≤ 809px | Nav links hide (pill keeps brand + CTA); hero 44px/44px/−0.4px; h2 32/36/0; sections min-height auto with {spacing.section-mobile} padding; states grid 3-up; carousels stay swipeable |
| Tablet | 810–1199px | Hero 64/64; h2 44/44; states grid 4-up; two-column layouts hold |
| Desktop | ≥ 1200px | Full scale; states grid 7-up; containers cap at 960/1280px |

### Art Direction
At `max-aspect-ratio: 3/2`, hero media switches from `cover` (which crops
~45% of a 21:9 frame on tall screens) to bottom-anchored width-fit sizing —
the full composition shows and the sky blends into the white veil. Full
composition beats full bleed.

### Touch Targets
- All pills ≥ 44px tall; carousel buttons 48px; Esc and scrim-click both
  close the modal.
- Hover-only effects (card cinemagraphs, tile wander) must never carry
  information — touch users see posters and lose nothing.

## Voice & Copy

Short, declarative, second person, warm: "You found a ripple." "Small is
the whole point." CTAs ≤ 4 words. Banned words: revolutionary, seamless,
unleash, empower, transform, game-changing, supercharge, world-class.
Numbers stay concrete (12,400 cards found); stories stay specific (a gas
pump outside Toledo).

## Known Gaps

- No dark mode — the dusk CTA band is a deliberate scene, not a theme.
- Form styles (inputs, error/success states) are not yet defined; the demo
  has no forms.
- No real data layer: per-state stats are deterministic fakes from a name
  hash.
- Media weight: ~25MB of JPEG/MP4; videos need H.265/VP9 re-encode and
  stills WebP conversion before a real deploy.
- The card modal's scale-FLIP close animation should be re-verified across
  browsers.
- The print sheet exists only in US Letter.

## References

- DESIGN.md spec: https://getdesign.md/what-is-design-md (Google Stitch
  `alpha` format) · examples: https://github.com/VoltAgent/awesome-design-md
- Source design language: extracted from mobbin.com 2026-07-08 — reusable
  kit in `~/Desktop/mobbin-kit/` (tokens.json, builder-brief.md)
- Prior engineering-style design doc (Google eng-doc format, with
  alternatives considered): this file's git history, commit `343ce05`
