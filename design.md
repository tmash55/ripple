# Ripple — Design Doc

**Author:** Tyler Maschoff (with Claude)
**Status:** Living document
**Last updated:** 2026-07-10
**Format:** follows [Design Docs at Google](https://www.industrialempathy.com/posts/design-docs-at-google/) — context → goals → design (with trade-offs) → alternatives → cross-cutting concerns.

> **How to use this doc:** before adding or changing any UI, read [Goals](#goals-and-non-goals), the [design system](#the-actual-design), and the [house rules](#house-rules). If a change fights a rule here, either follow the rule or update this doc first — never silently diverge. The doc is the memory; the code is the application of it.

---

## Context and scope

Ripple is a kindness-card movement: anyone can **print a card, do something kind, and leave the card anywhere** for a stranger to find. Each card names the state where its ripple began; finders take the next turn and the card travels. This repo is the marketing site (`index.html`, single file, no build step) plus a printable card sheet (`print.html`).

The visual system was not designed from scratch. It is a **translation of mobbin.com's design language** (extracted from their production CSS on 2026-07-08 — reusable kit in `~/Desktop/mobbin-kit/`), re-voiced for Ripple with hand-generated watercolor artwork. The card/flyer design (cream card, "YOU FOUND A RIPPLE", heart-over-ripples mark, state collector grid) is the brand's source of truth for tone and iconography.

**In scope:** everything user-visible on the site and the printable sheet — type, color, layout, motion, artwork, copy voice.
**Out of scope:** backend, real find-logging, accounts, payments. The demo fakes per-state stats deterministically.

## Goals and non-goals

**Goals**

- Every screen should feel like the printed card: quiet, warm, hand-made, generous with whitespace.
- One consistent art voice (soft watercolor) across hero, cards, states, and CTA — a visitor should believe one person painted the whole site.
- Motion that rewards scrolling without hijacking it — reveals, pins, and ambient loops, never scroll-speed manipulation.
- The print action is the product. Every major CTA path should end at `print.html`.
- Zero build step. The site must run by serving the folder statically.

**Non-goals**

- Dark mode. The language is ink-on-paper; the one dark moment (dusk CTA) is deliberate contrast, not a theme.
- Pixel-perfect Mobbin cloning. We borrowed their *system* (type scale, spacing, surfaces), not their identity.
- Photorealism. Photography is banned; illustration only.
- CMS/framework migration. A single HTML file is a feature at this stage, not debt.

---

## The actual design

### Overview

Three decisions carry the whole feel — protect them above everything else:

1. **Non-standard font weights.** Display type at weight **652**, UI labels at **456**, body at **300** (Inter Variable). Nothing sits on 400/500/700. Heavy-but-not-bold headlines over airy light body text *is* the typographic personality. (Mobbin does this with the commercial "M Saans"; Inter is their own declared fallback, which is why this is a faithful translation and not an approximation.)
2. **Display type set solid.** Headline `line-height` equals `font-size` exactly (80/80, 56/56) with tracking that flips sign by size: **−0.6px** on display, **+0.2px** on small text. Never use unitless line-heights on headlines.
3. **No shadows — alpha hairlines.** Surfaces separate with 6–12% black borders (`#4040400f`–`#4040401f`) and a `blur(40px)` pill nav. The single sanctioned shadow is `0 8px 40px #0000000a` (floating panels/cards only; the card modal uses a stronger one because modals genuinely float).

### Tokens (verbatim — do not round)

| Group | Token | Value |
|---|---|---|
| Ink | `--ink` | `#141414` |
| | `--ink-hover` / `--surface-dark` | `#262626` |
| Text | `--text-secondary` | `#717171` |
| | `--text-tertiary` | `#adadad` |
| Accent | `--accent` (used like ink, one per screen) | `#0065ff` |
| Brand (Ripple additions) | sage / terracotta / cream | `#5d7050` / `#c2704a` / `#fdfbf6` |
| Hairlines | 6% → 12% black | `#4040400f` `#40404014` `#4040401a` `#4040401f` |
| Type scale | hero / h2 / h3 / h4 | `80/80/−.6px` · `56/56/−.6px` · `32/36` · `24/30` |
| | lede / body / small / caption | `20/26` · `16/22/+.2px` · `14/20/+.2px` · `12/16` |
| Responsive display | hero, h2 at ≤1199px / ≤809px | `64/64`, `44/44` / `44/44/−.4px`, `32/36` |
| Spacing | base · default gap · section pad | `4px` · `24px` · `120px 0` (mobile `80px`) |
| Layout | container / wide / nav height | `960px` / `1280px` / `60px` |
| Radius | control / cards / pills | `10px` / `16–24px` / `999px` |
| Motion | UI transition | `color .2s ease, background .2s ease` |

Every section is one viewport tall (`min-height: 100vh`, content centered; mobile `auto`). Footer sizes to content.

### The brand layer (Ripple on top of the Mobbin skeleton)

- **Mark:** inline SVG — terracotta heart over two sage ripple ellipses (outer ring 50% opacity). Lives in nav, footer, card backs, print sheet. One source of truth; copy the SVG, don't redraw it.
- **Voice:** short, declarative, second-person, warm. "You found a ripple." "Small is the whole point." Banned words: revolutionary, seamless, unleash, empower, transform, game-changing, supercharge, world-class. CTAs ≤ 4 words.
- **The card is the recurring motif:** cream `#fdfbf6` face, hairline border, plaque with micro-caption ("THIS RIPPLE STARTED IN") over a state name in sage. Any new card-like component should reuse the plaque pattern.

### Artwork pipeline

All imagery is generated, never stock. The style contract that keeps 60+ images coherent:

> *"Watercolor anime background art, soft painterly, serene high-key: [scene], no people, no animals, no text"*

- Stills: Nano Banana Pro (via Higgsfield MCP), 1:1 for cards at 1k, 21:9 at 2k for backdrops. Web-encode as JPEG q80–85 (512px for cards, ≤2304px for backdrops).
- Ambient loops: Seedance image-to-video with **the same still passed as `start_image` and `end_image`** — first and last frames match, so loops are seamless. A canvas overlay of frame 0 crossfades over the final 0.5s as insurance (see `SEAM_FADE` in `index.html`).
- Dark scenes (dusk CTA) sit under a 42% ink scrim so white type holds contrast.
- Trade-off we accepted: generated art varies slightly between batches. The prompt prefix, palette words ("high-key", "sage", "desaturated"), and "no people/animals/text" suffix are what hold it together — never drop them.

### Motion system

Stack: **Lenis** (`lerp: 0.1`, driven by GSAP's ticker) + **GSAP ScrollTrigger**. Native scroll is never replaced, only smoothed.

- **Reveals:** `y: 40 → 0`, `opacity: 0 → 1`, `0.9s power3.out`, stagger `0.08`, trigger `top 80%`, per section via `[data-reveal]`.
- **Pinned stats:** section pins for 170% of a viewport; stat lines rise from `y: 110` with `power3.out`, arriving gray `#adadad` then settling to ink; `scrub: 0.7` for the catch-up glide. The frame itself never moves — no parallax on pinned content (we tried it; it reads as drift, not depth).
- **Modal (state cards):** FLIP technique — size the card at final dimensions, animate **transform scale** from the origin rect. Never animate `width`/`height` on anything containing text (it reflows per frame and glitches). Text/chrome fade out in 0.15s before the shrink.
- **Ambient:** hero video loop, hover-play cinemagraph covers (`preload="none"`), tile wander (`repeatRefresh` random walks, ±30px, sine).
- **Cinematic layers:** film grain at 3.5% opacity, edge vignette at 6% — cheap texture that makes flat art photographic.
- **Accessibility rule:** everything above gates behind `prefers-reduced-motion` — video removed (poster stays), reveals visible, no pin.

### Responsive art direction

21:9 backdrops with `object-fit: cover` over-crop on tall screens (~1.3 aspect loses ~45% of the frame). Rule: at `max-aspect-ratio: 3/2`, switch hero media to bottom-anchored, width-fit sizing and let the sky blend into the white veil. Full composition beats full bleed.

### Legibility over imagery

Text never sits raw on artwork. The hero uses a two-part veil (radial white glow behind the text column + vertical gradient: ~90% white at top, transparent through the scenery, white at the bottom seam). Ledes over art darken to `#3f3f3f` with a soft white text-shadow; ghost buttons become frosted glass (60% white + 12px blur). If new copy lands on new art, reuse these, don't invent new treatments.

---

## Alternatives considered

- **M Saans (Mobbin's actual font):** rejected — commercial license. Inter Variable is M Saans's own declared fallback and supports the exact non-standard weights, so fidelity loss is minimal. If a license is ever bought, only `--font-sans` changes.
- **Pixel-art backdrop:** built and shipped briefly (`assets/hero-bg-pixel.jpg`, kept in-repo). Rejected in favor of watercolor when the card flyer became the brand anchor — dither reads "retro tech", watercolor reads "hand-made kindness".
- **Photographic misty landscape:** generated first (`assets/hero-bg.jpg`) — beautiful but generic SaaS; replaced for brand fit. Both alternates remain in `assets/` for reference.
- **Gradient card covers** (original scaffold): replaced by generated art — gradients matched Mobbin's system but said nothing about Ripple.
- **Width/height modal animation:** first implementation; caused text reflow glitches on close. Replaced with scale-based FLIP (see Motion).
- **CSS-only tile bobbing:** synchronized yoyo looked mechanical; replaced with randomized GSAP wander.
- **Framework (Next.js) build:** deliberately deferred — single-file HTML keeps the demo portable, diffable, and hosting-free. Revisit only when real data (find-logging) arrives.

## Cross-cutting concerns

- **Accessibility:** `prefers-reduced-motion` honored everywhere; decorative layers `aria-hidden`; content readable with JS off (`no-js` class reverts reveals); type contrast maintained via veils/scrims; Esc closes the modal.
- **Performance:** state-grid images lazy-load; hover videos `preload="none"`; poster-first hero. Known debt: ~25MB of media — videos need H.265/VP9 re-encode and stills could go WebP before any real deploy.
- **Print:** `print.html` is part of the product, not an afterthought — printer-friendly ink coverage, dashed cut lines, works in black & white.
- **Licensing:** all artwork is generated (no stock, no brand marks); the one licensed asset risk (M Saans) was designed out.
- **Copy safety:** nothing on the site reproduces Mobbin's copy; the flyer's own lines ("You never know where yours will end…") are the brand's, used deliberately.

## References

- [Design Docs at Google](https://www.industrialempathy.com/posts/design-docs-at-google/) — structure this doc follows
- `~/Desktop/mobbin-kit/` — extracted design-language kit (tokens.json, builder-brief.md, structure.css)
- `README.md` — how to run the site
- Card flyer image (brand source of truth) — in project chat history; consider committing a copy to `assets/brand/` when available
