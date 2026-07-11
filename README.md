# Ripple

A little kindness. Every state. All connected.

Ripple is a kindness-card movement: print a card, do something kind, leave the card anywhere for a stranger to find — then they take the next turn. This is the marketing site (Next.js) plus a printable card sheet, and it doubles as a **template repo** for new projects in this design language.

## Running it

```bash
npm install
npm run dev      # http://localhost:4173
npm run build    # static production build
```

## Structure

- `app/page.tsx` — the whole landing page (server-rendered sections)
- `app/globals.css` — the entire design system as CSS (tokens in `:root`)
- `app/layout.tsx` — Inter Variable via `next/font` (the weight axis matters: 652/456/300)
- `components/SiteMotion.tsx` — the motion layer (GSAP ScrollTrigger + Lenis), one client-side effect that animates the server-rendered DOM
- `public/print.html` — printable sheet of four cut-out Ripple cards (plain HTML on purpose)
- `public/assets/` — generated watercolor artwork: hero valley (still + ambient loop), 50 state cards, card cinemagraphs, dusk CTA backdrop
- `DESIGN.md` — **read this before touching any UI.** The design language as a spec (getdesign.md `alpha` format): tokens, rationale, motion rules, artwork prompt contract.

## Using this as a template

1. Clone, then read `DESIGN.md` — it is the style's source of truth.
2. Swap copy in `app/page.tsx`; keep the section skeleton (one viewport per scene).
3. New artwork must follow the prompt contract in `DESIGN.md » Artwork` so it matches the existing set.
4. Tokens change in exactly two places, together: `app/globals.css` (`:root`) and `DESIGN.md` (YAML front matter).

## History

Originally built as a single static `index.html` (see git history) on a design language extracted from mobbin.com; ported to Next.js App Router with byte-identical CSS and markup. Artwork generated with Higgsfield (Nano Banana Pro stills, Seedance loops using matched start/end frames for seamless looping).
