# Ripple

A little kindness. Every state. All connected.

Ripple is a kindness-card movement: print a card, do something kind, leave the card anywhere for a stranger to find — then they take the next turn. This is the marketing site, plus a printable card sheet.

## Running it

No build step. Serve the folder statically:

```bash
python3 -m http.server 4173
# open http://localhost:4173
```

- `index.html` — the site (single file: markup, styles, and scripts)
- `print.html` — printable sheet of four cut-out Ripple cards
- `assets/` — generated watercolor artwork: hero valley (still + ambient video loop), 50 state cards, card-cover cinemagraphs, dusk CTA backdrop

## How it's built

- **Design language** extracted from mobbin.com with the `design-language` skill — type scale (Inter Variable at weights 652/456/300, pixel line-heights), ink-on-white palette, alpha-hairline surfaces, full-pill buttons. See `~/Desktop/mobbin-kit` for the reusable kit.
- **Motion**: GSAP ScrollTrigger + Lenis smooth scroll — pinned stats reveal, scroll-scrubbed hero, seam-masked seamless video loop, FLIP state-card modal with 3D flip.
- **Artwork**: generated with Higgsfield (Nano Banana Pro stills, Seedance ambient loops using matching start/end frames).
