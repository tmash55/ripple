import SiteMotion from "@/components/SiteMotion";

export default function Home() {
  return (
    <>
      <div className="grain" aria-hidden="true"></div>
      <div className="vignette" aria-hidden="true"></div>
      
      {/* 01 · NAV */}
      <div className="nav-wrap">
        <nav className="pill">
          <a className="brand" href="/"><span className="brand-mark"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M16 14.8C13 12.2 10.6 10.4 10.6 8.2C10.6 6.5 12 5.2 13.6 5.2C14.6 5.2 15.5 5.7 16 6.5C16.5 5.7 17.4 5.2 18.4 5.2C20 5.2 21.4 6.5 21.4 8.2C21.4 10.4 19 12.2 16 14.8Z" fill="#c2704a"/><ellipse cx="16" cy="20.5" rx="6.5" ry="2.4" fill="none" stroke="#5d7050" strokeWidth="1.8"/><ellipse cx="16" cy="21.8" rx="11.5" ry="4.2" fill="none" stroke="#5d7050" strokeWidth="1.4" opacity="0.5"/></svg></span>Ripple</a>
          <ul className="nav-links">
            <li><a href="#how">How it works</a></li>
            <li><a href="#use-cases">Ideas</a></li>
            <li><a href="#journal">Stories</a></li>
          </ul>
          <a className="btn btn-primary btn-sm" href="/reached">Reached me</a>
        </nav>
      </div>
      
      {/* 02 · HERO */}
      <header className="hero">
        <div className="hero-bg" aria-hidden="true"><video className="hero-video" muted loop playsInline preload="none" src="/assets/hero-bg-loop.mp4"></video></div>
        <div className="container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div className="orb" data-reveal></div>
          <h1 className="hero-headline"><span id="typed" data-text="You found a ripple."></span><span className="typed-cursor">|</span></h1>
          <p className="lede" data-reveal>Someone left a little kindness in the world. It found you.</p>
          <div className="cta-row" data-reveal>
            <a className="btn btn-primary" href="#how">How it works</a>
            <a className="btn btn-secondary" href="/reached">Your list <span className="arr">→</span></a>
          </div>
        </div>
      </header>
      
      {/* 02b · LIBRARY (pinned stats, lines reveal on scroll while frame holds) */}
      <section className="library" id="library" aria-label="The first fifty cards">
        <div className="tiles" aria-hidden="true">
          <div className="float-tile" style={{"--x": '4%', "--y": '8%', "--s": '88px'} as React.CSSProperties}><span className="tile"><img loading="lazy" decoding="async" src="/assets/state-iowa.jpg" alt="" /></span></div>
          <div className="float-tile" style={{"--x": '88%', "--y": '6%', "--s": '76px'} as React.CSSProperties}><span className="tile"><img loading="lazy" decoding="async" src="/assets/state-texas.jpg" alt="" /></span></div>
          <div className="float-tile" style={{"--x": '92%', "--y": '34%', "--s": '88px'} as React.CSSProperties}><span className="tile"><img loading="lazy" decoding="async" src="/assets/state-colorado.jpg" alt="" /></span></div>
          <div className="float-tile" style={{"--x": '11%', "--y": '82%', "--s": '80px'} as React.CSSProperties}><span className="tile"><img loading="lazy" decoding="async" src="/assets/state-vermont.jpg" alt="" /></span></div>
          <div className="float-tile" style={{"--x": '89%', "--y": '80%', "--s": '76px'} as React.CSSProperties}><span className="tile"><img loading="lazy" decoding="async" src="/assets/state-alaska.jpg" alt="" /></span></div>
          <div className="float-tile" style={{"--x": '3%', "--y": '54%', "--s": '72px'} as React.CSSProperties}><span className="tile"><img loading="lazy" decoding="async" src="/assets/state-washington.jpg" alt="" /></span></div>
          <div className="float-tile" style={{"--x": '12%', "--y": '30%', "--s": '64px'} as React.CSSProperties}><span className="tile"><img loading="lazy" decoding="async" src="/assets/state-arizona.jpg" alt="" /></span></div>
          <div className="float-tile" style={{"--x": '22%', "--y": '10%', "--s": '60px'} as React.CSSProperties}><span className="tile"><img loading="lazy" decoding="async" src="/assets/state-maine.jpg" alt="" /></span></div>
          <div className="float-tile" style={{"--x": '85%', "--y": '56%', "--s": '64px'} as React.CSSProperties}><span className="tile"><img loading="lazy" decoding="async" src="/assets/state-newyork.jpg" alt="" /></span></div>
          <div className="float-tile" style={{"--x": '26%', "--y": '86%', "--s": '64px'} as React.CSSProperties}><span className="tile"><img loading="lazy" decoding="async" src="/assets/state-montana.jpg" alt="" /></span></div>
          <div className="float-tile" style={{"--x": '72%', "--y": '88%', "--s": '56px'} as React.CSSProperties}><span className="tile"><img loading="lazy" decoding="async" src="/assets/state-louisiana.jpg" alt="" /></span></div>
          <div className="float-tile" style={{"--x": '72%', "--y": '11%', "--s": '56px'} as React.CSSProperties}><span className="tile"><img loading="lazy" decoding="async" src="/assets/state-hawaii.jpg" alt="" /></span></div>
        </div>
        <div className="container stat-stack">
          <p className="stat-eyebrow">One small act, then another</p>
          <h2 className="stat-line">The first fifty cards</h2>
          <h2 className="stat-line">start in Ankeny, Iowa</h2>
          <h2 className="stat-line">one ripple at a time</h2>
          <span className="stat-dash"><i></i></span>
        </div>
      </section>
      
      {/* 02c · HOW IT WORKS */}
      <section id="how">
        <div className="container">
          <p className="eyebrow" data-reveal>The loop</p>
          <h2 className="heading-2" data-reveal style={{marginTop: '12px'}}>How a ripple works</h2>
          <div className="steps">
            <div className="step" data-reveal>
              <span className="step-num">01</span>
              <h4 className="heading-4">A card finds you</h4>
              <p className="small">Fifty cards were left around Ankeny, Iowa. Each carries one kind sentence and a code of its own.</p>
            </div>
            <div className="step" data-reveal>
              <span className="step-num">02</span>
              <h4 className="heading-4">Add your part</h4>
              <p className="small">Scan it and, only if you want to, write down a kindness that reached you. No account, no name.</p>
            </div>
            <div className="step" data-reveal>
              <span className="step-num">03</span>
              <h4 className="heading-4">Pass it on</h4>
              <p className="small">Leave the card for someone else, or send them a link of your own. They become the next part of its story.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 02d · WHERE TO LEAVE IT */}
      <section id="leave">
        <div className="container-wide">
          <div style={{maxWidth: '640px'}}>
            <p className="eyebrow" data-reveal>Keep it moving</p>
            <h2 className="heading-2" data-reveal style={{marginTop: '12px'}}>Leave it where someone will find it.</h2>
            <p className="lede" data-reveal style={{marginTop: '16px', maxWidth: '40ch'}}>Once you’ve read yours, the card is meant to keep going. Anywhere a stranger might pause will do.</p>
          </div>
          <div className="spot-row">
            <div className="spot" data-reveal><b>In a library book</b><span>Page 100 of a favorite. The next reader earns it.</span></div>
            <div className="spot" data-reveal><b>On a coffee counter</b><span>Next to the sugar. Pay for the next order if you can.</span></div>
            <div className="spot" data-reveal><b>At a trailhead</b><span>Under a stone at the map board.</span></div>
            <div className="spot" data-reveal><b>On a park bench</b><span>Weighted with a pebble, waiting.</span></div>
            <div className="spot" data-reveal><b>In a gym locker</b><span>Someone’s hardest hour just got lighter.</span></div>
            <div className="spot" data-reveal><b>On a windshield</b><span>Better than a parking ticket.</span></div>
          </div>
        </div>
      </section>
      
      {/* 03 · USE CASES */}
      <section id="use-cases">
        <div className="container-wide">
          <div className="carousel-head">
            <div>
              <p className="eyebrow" data-reveal>Ideas</p>
              <h2 className="heading-2" data-reveal style={{marginTop: '12px'}}>Five small kindnesses to pass on</h2>
            </div>
            <div className="carousel-nav" data-reveal>
              <button className="circle-btn" data-track="cases" data-dir="-1" aria-label="Previous">←</button>
              <button className="circle-btn" data-track="cases" data-dir="1" aria-label="Next">→</button>
            </div>
          </div>
          <div className="track" id="cases" data-reveal-group>
            {/* repeat ×5 */}
            <article className="case-card" data-reveal><div className="case-cover"><video muted loop playsInline preload="none" data-poster="/assets/case-design.jpg" src="/assets/case-design.mp4"></video></div><div className="case-body"><span className="badge">Flowers</span><h4 className="heading-4">Leave flowers for a stranger</h4><p className="small" style={{color: 'var(--text-secondary)'}}>Pick a few on your walk and leave them where someone will find them.</p></div></article>
            <article className="case-card" data-reveal><div className="case-cover"><video muted loop playsInline preload="none" data-poster="/assets/case-product.jpg" src="/assets/case-product.mp4"></video></div><div className="case-body"><span className="badge">Books</span><h4 className="heading-4">Share a favorite book</h4><p className="small" style={{color: 'var(--text-secondary)'}}>Leave it on a bench with a note inside: this one mattered to me.</p></div></article>
            <article className="case-card" data-reveal><div className="case-cover"><video muted loop playsInline preload="none" data-poster="/assets/case-marketing.jpg" src="/assets/case-marketing.mp4"></video></div><div className="case-body"><span className="badge">Notes</span><h4 className="heading-4">Write an encouraging note</h4><p className="small" style={{color: 'var(--text-secondary)'}}>Tuck it under a door, in a mailbox, inside a library book.</p></div></article>
            <article className="case-card" data-reveal><div className="case-cover"><video muted loop playsInline preload="none" data-poster="/assets/case-founders.jpg" src="/assets/case-founders.mp4"></video></div><div className="case-body"><span className="badge">Rocks</span><h4 className="heading-4">Paint a kindness rock</h4><p className="small" style={{color: 'var(--text-secondary)'}}>Leave it on a trail for the next hiker to find.</p></div></article>
            <article className="case-card" data-reveal><div className="case-cover"><video muted loop playsInline preload="none" data-poster="/assets/case-ops.jpg" src="/assets/case-ops.mp4"></video></div><div className="case-body"><span className="badge">Plants</span><h4 className="heading-4">Give someone a plant</h4><p className="small" style={{color: 'var(--text-secondary)'}}>A cutting from your kitchen jar is plenty. Watch it grow.</p></div></article>
          </div>
        </div>
      </section>
      
      {/* 04 · TWO-COLUMN SHOWPIECE */}
      <section id="showpiece">
        <div className="container-wide">
          <div className="two-col">
            <div className="showpiece" data-reveal>
              <div className="morph" data-morph></div>
              <span className="badge">The card</span>
              <h3>Take it, pass it on</h3>
              <p className="lede">Every card carries its story from hand to hand.</p>
              <div className="cta-row" style={{marginTop: 'var(--gap-m)', justifyContent: 'flex-start'}}>
                <a className="btn btn-primary" href="#how">How it works</a>
              </div>
            </div>
            <div className="showpiece" data-reveal>
              <div className="morph" data-morph></div>
              <span className="badge">Your list</span>
              <h3>Things that reached me</h3>
              <p className="lede">Every Ripple that finds you is kept in a private list on your own device.</p>
              <div className="cta-row" style={{marginTop: 'var(--gap-m)', justifyContent: 'flex-start'}}>
                <a className="btn btn-primary" href="/reached">Open your list</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 05 · STORIES — empty until real ones are recorded. Keep id="journal": SiteMotion scrolls against it. */}
      <section id="journal">
        <div className="container" style={{textAlign: 'center'}}>
          <h2 className="heading-2" data-reveal>Ripple stories</h2>
          <p className="lede" data-reveal style={{marginTop: 'var(--gap-l)', maxWidth: '44ch', marginLeft: 'auto', marginRight: 'auto'}}>The first cards are only just going out. Real stories will appear here as the people who find them write them down.</p>
        </div>
      </section>
      
      {/* 06 · DARK CTA BAND */}
      <section className="dark-band" id="get-started">
        <div className="cta-bg" aria-hidden="true"></div>
        <div className="container" style={{position: 'relative', zIndex: '1'}}>
          <h2 className="heading-2"><span id="typed-dark" data-text="You never know where yours ends."></span><span className="typed-cursor">|</span></h2>
          <div className="cta-row">
            <a className="btn btn-light" href="/reached">Things that reached me</a>
          </div>
        </div>
      </section>
      
      {/* 07 · FOOTER */}
      <footer>
        <div className="container-wide">
          <div className="foot-grid">
            <div>
              <a className="brand" href="/" style={{marginBottom: '16px'}}><span className="brand-mark"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M16 14.8C13 12.2 10.6 10.4 10.6 8.2C10.6 6.5 12 5.2 13.6 5.2C14.6 5.2 15.5 5.7 16 6.5C16.5 5.7 17.4 5.2 18.4 5.2C20 5.2 21.4 6.5 21.4 8.2C21.4 10.4 19 12.2 16 14.8Z" fill="#c2704a"/><ellipse cx="16" cy="20.5" rx="6.5" ry="2.4" fill="none" stroke="#5d7050" strokeWidth="1.8"/><ellipse cx="16" cy="21.8" rx="11.5" ry="4.2" fill="none" stroke="#5d7050" strokeWidth="1.4" opacity="0.5"/></svg></span>Ripple</a>
              <p className="small" style={{color: 'var(--text-secondary)', marginTop: '12px', maxWidth: '24ch'}}>A little kindness, passed from hand to hand.</p>
            </div>
            <div><h5>The ripple</h5><ul><li><a href="#how">How it works</a></li><li><a href="#use-cases">Ideas</a></li><li><a href="#journal">Stories</a></li><li><a href="/reached">Things that reached me</a></li></ul></div>
            <div><h5>Help</h5><ul><li><a href="/contact">Contact</a></li><li><a href="/contact?topic=remove">Remove something I wrote</a></li></ul></div>
            <div><h5>Legal</h5><ul><li><a href="/privacy">Privacy</a></li><li><a href="/terms">Terms</a></li></ul></div>
          </div>
          <div className="giant-wordmark" data-reveal>RIPPLE</div>
          <div className="foot-legal">
            <span>© 2026 Ripple</span>
            <span className="links"><a href="/privacy">Privacy</a><a href="/terms">Terms</a></span>
          </div>
        </div>
      </footer>
      
      <SiteMotion />
    </>
  );
}
