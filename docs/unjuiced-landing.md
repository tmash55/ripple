# Unjuiced Landing Page — Ideas & Section Plan

**Goal:** re-skin this repo's layout, motion, and flow (the Ripple template) into the
landing page for **Unjuiced** — the sharp betting intel tool (odds comparison, no-vig
pricing, +EV, props, alerts). Keep every animation pattern; swap the story, the art,
and the tokens.

**Product truths to build on** (from the app itself): 20+ sportsbooks · sub-2s odds
updates · no-vig pricing · one-click betting · positive EV board · arbs · best odds ·
prop cheat sheets · sharp intel · promos/alerts · brand accent `#38BDF8` · Geist type.

**Positioning line to write everything against:**
> Sportsbooks price in their profit. Unjuiced strips it out so you see the true price
> of every bet — and who's offering better than that.

---

## 1 · Voice

Same DNA as Ripple's voice rules (short, declarative, second person) but colder and
sharper — a trading desk, not a greeting card.

- "The juice is gone."
- "Bet the true price."
- "No picks. No touts. Just math."
- "Sub-2 seconds. Twenty books. Zero vig."
- Numbers always concrete: "-110/-110 is really 52.4%. You're paying 4.5% for nothing."
- Banned: "guaranteed", "locks", "can't lose", "beat the books" (compliance + credibility).

## 2 · Art direction (pick one, write it into DESIGN.md before building)

The template's system (ink type at 652/456/300, hairlines, pills, one-viewport
scenes, grain) survives any of these. Only the artwork contract and 2–3 tokens change.

**Option A — Terminal dusk (recommended).** Keep the light ink-on-white system for
reading sections, but hero + CTA band go dark: a generated ambient loop of a stadium
at dusk seen from high above, floodlights just coming on, scoreboard glow — same
Seedance same-start/end-frame seamless loop trick as the Ripple hero. Accent shifts
to Unjuiced sky `#38BDF8`; money-green `#22c55e` reserved exclusively for +EV values,
red for negative — colors used like ink, only on numbers.
*Prompt contract draft:* "Cinematic aerial view at dusk, [stadium/ballpark/arena]
under floodlights, moody blue hour, subtle haze, no people visible up close, no
text, no logos, photographic and calm."

**Option B — Pure data-paper.** No scenic art at all. The 'artwork' is typography and
live numbers: an oversized de-vigged odds table as the hero backdrop (blurred rows
sharpening on scroll), Geist Mono everywhere numbers appear. Cheapest, most 'sharp'.

**Option C — Blueprint.** Ink-on-white with hand-drawn court/field diagrams and odds
annotations (generated line-art contract). Distinctive, but riskiest tonally.

## 3 · Section-by-section (mapping the flow you like)

Order preserved from the template. Each entry: what it becomes + which existing
animation it inherits.

### 01 · Nav (pill, blur)
Wordmark + mark. Links: **Tools · Odds · Pricing · Blog**. CTA pill: **Start free**.
The Ripple heart/rings SVG mark → the Unjuiced wordmark/mark from `components/wordmark.tsx`.

### 02 · Hero (typed headline + ambient loop + veil)
- Typed headline (keep the typewriter + accent cursor): **"The juice is gone."**
  Alternates: "Bet the true price." / "Every book. No vig."
- Lede: "Unjuiced strips the sportsbook's cut out of every line — so you see what a
  bet is actually worth, across 20+ books, in under 2 seconds."
- CTAs: **Start free** (primary) · **See it live →** (glass, scrolls to demo)
- Backdrop: Option A stadium loop under the same white/dark veil system.
- **New graphic idea:** a thin live **line-move ticker** pinned to the hero's bottom
  edge (marquee: "LAL -3.5 → -2.5 · DK", "Judge o1.5 TB +102 → +108 · FD"…). Demo
  data is fine; it makes the page feel alive in the first second.

### 03 · Pinned stats + floating tiles (the section people remember)
- Floating tiles = **the sportsbook logos** (`public/images/sports-books/` — they
  were literally in this template once; bring them back). Wander animation reads as
  "books being scanned."
- Stat lines (rise-and-settle, count-up upgrade from the ideas backlog):
  **"20+ books scanned"** → **"under 2 seconds"** → **"zero juice"**.
- Eyebrow: "Every line, all at once."

### 04 · How it works (3 hairline steps)
01 **We pull every line** — every book, every market, refreshed in real time.
02 **We strip the juice** — de-vig the odds to the true probability.
03 **You take the best price** — one click to the book holding the edge.

### 05 · Flagship demo section (was: Print — this is now the tool showcase)
The 2-col layout + fanned cards become **a live-feeling product demo**:
- Left: copy + CTA ("This is the +EV board. It's watching 20 books right now.")
- Right: the card fan becomes **three tilted prop cards** (real app screenshots or
  rebuilt mini-cards): a +EV row, a best-odds comparison, an arb. Hover spreads
  them (same animation).
- Below (was the 'where to leave one' tiles): **six tool tiles** — Positive EV ·
  Best Odds · Arbs · Prop Cheat Sheets · Sharp Intel · Promo Finder — one line each,
  hairline-top, linking into the app.

### 06 · Five feature cards (hover-play covers)
The watercolor cinemagraph cards become **feature cards with hover-play screen
recordings** of the actual app (Mobbin ethos: real UI beats illustration):
1. **Positive EV** — board sorting itself, edges appearing.
2. **Best odds** — a prop's price across 20 books, best one highlighting.
3. **Betslip sync** — one-click bet placement.
4. **Cheat sheets** — NRFI / hit-streak / TB sheets filling in.
5. **Alerts** — a line move notification landing.
4s loops, `preload="none"`, poster = first frame — identical mechanics to today.

### 07 · Two-column showpiece
- Card 1: **"The +EV board"** — "Every mispriced line, ranked by edge." CTA: Open the board.
- Card 2: **"The prop shop"** — "Every player prop, de-vigged and shoppable." CTA: Shop a prop.
- The morphing orbs become slow **data-glow gradients** in accent blue — same scrub.

### 08 · Coverage grid (was: 50 states — two strong options, pick one)
- **Option 1 — "Legal where you are":** keep the 50-state grid as a **state
  availability map** — states where sports betting is live get their book count
  ("Ohio · 18 books"), the rest render dimmed "soon". The collector-grid pattern
  becomes a compliance feature. Genuinely useful + unique.
- **Option 2 — "Every book":** grid of all 20+ sportsbook cards (logo + count of
  markets tracked). Click → FLIP modal (below).
- FLIP card modal (keep it!): click a state/book → card lifts and expands, flip to
  the back for details: books live there / markets covered / deep link. The flip
  animation is the site's signature moment — don't lose it.

### 09 · Pull-quote band
A stat, not a testimonial: **"The average bettor pays 4.7% juice on every bet.
You don't have to."** Or a real user quote from `testimonials-v2` if one is sharp.

### 10 · Journal (you already produce this content!)
The app has automated content (morning / pre-lock / recap posts). Surface it:
**"The Morning Juice"** — six cards, meta = date · sport, titles like "Where the
sharp money went last night". Straight reuse of the journal slider.

### 11 · Dark CTA band (typed headline on dusk backdrop)
- Typed: **"Stop paying the juice."** CTA: **Start free** (light pill).
- Backdrop: dark stadium loop (Option A) with scrim — the Ripple dusk band's exact
  structure.
- **Sub-line under CTA (compliance):** "21+. Not a sportsbook. No bets placed here."

### 12 · Footer
Columns: Tools · Company · Legal (+ Responsible Gaming link — page already exists in
the app). Giant **UNJUICED** wordmark (line-height .85, weight 652). Add the required
badges: 21+, responsible-gaming disclosure, state availability note.

## 4 · Interactive tools ON the landing page (pick 2 for launch)

These are the "wow, it's not a brochure" moments — small, self-contained, shareable:

1. **De-juice calculator** ⭐ — two inputs (-110 / -110) → animated output: true
   probability, fair odds, juice %. One slider version: "your book's line" → "the
   real line". This *is* the product thesis in one widget. Put it right under the hero
   or in the How-it-works section.
2. **Odds converter** — American ↔ decimal ↔ implied %. Cheap, useful, SEO-friendly.
3. **"What did the juice cost you?"** — inputs: bets/week × avg stake → animated
   $/year burned on vig. Emotional, extremely shareable.
4. **Live edges teaser** — 3 real (or demo) +EV rows visible, the rest blurred with a
   "Start free to unlock" veil. Classic, effective.
5. **Line-move replay** — a 20-second scrubbable chart of one famous line move with
   annotations ("sharp money hits 9:42am"). Pairs with the Sharp Intel feature.

## 5 · Visuals & graphics inventory

- **Sportsbook logos** — already have 24+ (square + long). Floating tiles, coverage
  grid, "works with" strip.
- **App screenshots / screen recordings** — the feature-card hover loops and demo fan.
  Record at 2x, trim to 4s, same-first/last-frame where possible.
- **Generated backdrops** (Higgsfield pipeline is proven): hero dusk-stadium loop +
  dark CTA variant. One new prompt contract, 2 stills + 2 loops ≈ ~150 credits.
- **Numbers in mono** — Geist Mono for every odd, price, and percentage (the design
  language already reserves mono for numbers; here it becomes the brand's texture).
- **Team/league iconery** — avoid real team marks (licensing); use matchup initials
  ("LAL @ BOS") in plaque-style chips — the Ripple plaque pattern, repurposed.
- **Grain + vignette** — keep; they read as "broadcast" here.
- **Odds-board wall graphic** — a full-bleed blurred grid of mono numbers as section
  wallpaper (CSS-generated, no image needed) for the demo section background.

## 6 · Motion mapping (nothing new to invent)

| Template animation | Unjuiced use |
|---|---|
| Typed hero + accent cursor | "The juice is gone." |
| Pinned stats + muted→ink settle | 20+ books / sub-2s / zero juice (+ count-up) |
| Floating tile wander | Sportsbook logos being "scanned" |
| Hover-play cinemagraph covers | App screen recordings |
| Scroll-scrubbed morph orbs | Accent-blue data glows |
| FLIP card modal + 3D flip | State/book detail cards |
| Seam-masked ambient hero loop | Dusk stadium |
| Color tint between sections | White → cool gray as data sections approach |
| Fanned-cards hover spread | Tilted prop-card demo fan |

## 7 · Trust & compliance section (new, required)

Short hairline-divided row before the footer:
- **No picks, no touts** — "We don't sell predictions. We show prices."
- **Not a sportsbook** — "Unjuiced never takes a bet."
- **21+ / Responsible gaming** — link + hotline line.
- **Availability** — "Odds coverage varies by state" → coverage grid.

## 8 · Build notes (how to execute with this template)

1. Clone repo (or "Use this template"), then **rewrite DESIGN.md first**: new name,
   description, palette (`accent: #38BDF8`, `ev-green`, `ev-red`, dark tokens for the
   band), the chosen artwork contract, and the voice rules above. Tokens change in
   `app/globals.css` + DESIGN.md YAML together.
2. Font decision: stay Inter Variable (652/456/300 carries the feel) + **Geist Mono
   for all numerics**; the app already uses Geist, so consider Geist for UI text to
   match product — test both against the 652-weight display look.
3. Section swaps happen in `app/page.tsx`; motion stays in `SiteMotion.tsx` untouched
   except new count-up + ticker helpers.
4. Screen recordings replace generated cinemagraphs in `public/assets/`.
5. Launch cut (a weekend): Hero + ticker · stats/tiles · how-it-works · de-juice
   calculator · 5 feature cards · dark CTA · footer/compliance. Everything else is v2.

## 9 · Open questions for Tyler

- Which art direction (A/B/C)? A is recommended; B is fastest.
- Coverage grid: states or books first?
- Can we show real live odds on the landing page (API cost/ToS), or demo data?
- Keep Inter for display or move to Geist to match the app?
- Which two widgets ship at launch? (Recommend: de-juice calculator + live ticker.)
