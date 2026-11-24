import SiteMotion from "@/components/SiteMotion";

export default function Home() {
  return (
    <>
      <div className="grain" aria-hidden="true"></div>
      <div className="vignette" aria-hidden="true"></div>
      
      {/* 01 · NAV */}
      <div className="nav-wrap">
        <nav className="pill">
          <a className="brand" href="#"><span className="brand-mark"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M16 14.8C13 12.2 10.6 10.4 10.6 8.2C10.6 6.5 12 5.2 13.6 5.2C14.6 5.2 15.5 5.7 16 6.5C16.5 5.7 17.4 5.2 18.4 5.2C20 5.2 21.4 6.5 21.4 8.2C21.4 10.4 19 12.2 16 14.8Z" fill="#c2704a"/><ellipse cx="16" cy="20.5" rx="6.5" ry="2.4" fill="none" stroke="#5d7050" strokeWidth="1.8"/><ellipse cx="16" cy="21.8" rx="11.5" ry="4.2" fill="none" stroke="#5d7050" strokeWidth="1.4" opacity="0.5"/></svg></span>Ripple</a>
          <ul className="nav-links">
            <li><a href="#use-cases">Ideas</a></li>
            <li><a href="#showpiece">Cards</a></li>
            <li><a href="#print">Print</a></li>
            <li><a href="#journal">Stories</a></li>
            <li><a href="#states">States</a></li>
          </ul>
          <a className="btn btn-primary btn-sm" href="#get-started">Join</a>
        </nav>
      </div>
      
      {/* 02 · HERO */}
      <header className="hero">
        <div className="hero-bg" aria-hidden="true"><video className="hero-video" autoPlay muted loop playsInline preload="auto" poster="/assets/hero-bg-valley.jpg" src="/assets/hero-bg-loop.mp4"></video></div>
        <div className="container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div className="orb" data-reveal></div>
          <h1 className="hero-headline"><span id="typed" data-text="You found a ripple."></span><span className="typed-cursor">|</span></h1>
          <p className="lede" data-reveal>Someone left a little kindness in the world. It found you.</p>
          <div className="cta-row" data-reveal>
            <a className="btn btn-primary" href="#get-started">Join the ripple</a>
            <a className="btn btn-secondary" href="#how">How it works <span className="arr">→</span></a>
          </div>
          <a className="play-intro" href="#" data-reveal><span className="play-glyph">▶</span> Play the story</a>
        </div>
      </header>
      
      {/* 02b · LIBRARY (pinned stats, lines reveal on scroll while frame holds) */}
      <section className="library" id="library" aria-label="Archive stats">
        <div className="tiles" aria-hidden="true">
          <div className="float-tile" style={{"--x": '4%', "--y": '8%', "--s": '88px'} as React.CSSProperties}><span className="tile"><img src="/assets/state-iowa.jpg" alt="" /></span></div>
          <div className="float-tile" style={{"--x": '88%', "--y": '6%', "--s": '76px'} as React.CSSProperties}><span className="tile"><img src="/assets/state-texas.jpg" alt="" /></span></div>
          <div className="float-tile" style={{"--x": '92%', "--y": '34%', "--s": '88px'} as React.CSSProperties}><span className="tile"><img src="/assets/state-colorado.jpg" alt="" /></span></div>
          <div className="float-tile" style={{"--x": '11%', "--y": '82%', "--s": '80px'} as React.CSSProperties}><span className="tile"><img src="/assets/state-vermont.jpg" alt="" /></span></div>
          <div className="float-tile" style={{"--x": '89%', "--y": '80%', "--s": '76px'} as React.CSSProperties}><span className="tile"><img src="/assets/state-alaska.jpg" alt="" /></span></div>
          <div className="float-tile" style={{"--x": '3%', "--y": '54%', "--s": '72px'} as React.CSSProperties}><span className="tile"><img src="/assets/state-washington.jpg" alt="" /></span></div>
          <div className="float-tile" style={{"--x": '12%', "--y": '30%', "--s": '64px'} as React.CSSProperties}><span className="tile"><img src="/assets/state-arizona.jpg" alt="" /></span></div>
          <div className="float-tile" style={{"--x": '22%', "--y": '10%', "--s": '60px'} as React.CSSProperties}><span className="tile"><img src="/assets/state-maine.jpg" alt="" /></span></div>
          <div className="float-tile" style={{"--x": '85%', "--y": '56%', "--s": '64px'} as React.CSSProperties}><span className="tile"><img src="/assets/state-newyork.jpg" alt="" /></span></div>
          <div className="float-tile" style={{"--x": '26%', "--y": '86%', "--s": '64px'} as React.CSSProperties}><span className="tile"><img src="/assets/state-montana.jpg" alt="" /></span></div>
          <div className="float-tile" style={{"--x": '72%', "--y": '88%', "--s": '56px'} as React.CSSProperties}><span className="tile"><img src="/assets/state-louisiana.jpg" alt="" /></span></div>
          <div className="float-tile" style={{"--x": '72%', "--y": '11%', "--s": '56px'} as React.CSSProperties}><span className="tile"><img src="/assets/state-hawaii.jpg" alt="" /></span></div>
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
              <h4 className="heading-4">Print a card</h4>
              <p className="small">Print a sheet at home in one minute — or start with a card you found.</p>
            </div>
            <div className="step" data-reveal>
              <span className="step-num">02</span>
              <h4 className="heading-4">Do something kind</h4>
              <p className="small">Flowers, a note, a coffee. Small is the whole point.</p>
            </div>
            <div className="step" data-reveal>
              <span className="step-num">03</span>
              <h4 className="heading-4">Leave it anywhere</h4>
              <p className="small">A bench, a book, a coffee counter. Whoever finds it takes the next turn.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 02d · PRINT & PLACE */}
      <section id="print">
        <div className="container-wide">
          <div className="print-grid">
            <div>
              <p className="eyebrow" data-reveal>Free, forever</p>
              <h2 className="heading-2" data-reveal style={{marginTop: '12px'}}>Print one. Leave it anywhere.</h2>
              <p className="lede" data-reveal style={{marginTop: '16px', maxWidth: '34ch'}}>That’s the whole idea. A card you print at home becomes the best part of a stranger’s week.</p>
              <div className="cta-row" data-reveal style={{justifyContent: 'flex-start', marginTop: 'var(--gap-l)'}}>
                <a className="btn btn-primary" href="/print.html" target="_blank">Print your cards</a>
                <a className="btn btn-secondary" href="#use-cases">Need an idea? <span className="arr">→</span></a>
              </div>
              <p className="print-note" data-reveal>One sheet, four cards · fits any printer · lovely in black &amp; white too</p>
            </div>
            <div className="print-fan" data-reveal aria-hidden="true">
              <div className="mini-card"><img src="/assets/state-iowa.jpg" alt="" /><span className="mini-label"><span className="plaque-micro">This ripple started in</span><span className="plaque-state">Iowa</span></span></div>
              <div className="mini-card"><img src="/assets/state-colorado.jpg" alt="" /><span className="mini-label"><span className="plaque-micro">This ripple started in</span><span className="plaque-state">Colorado</span></span></div>
              <div className="mini-card"><img src="/assets/state-maine.jpg" alt="" /><span className="mini-label"><span className="plaque-micro">This ripple started in</span><span className="plaque-state">Maine</span></span></div>
            </div>
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
              <p className="eyebrow" data-reveal>Keep it moving</p>
              <h2 className="heading-2" data-reveal style={{marginTop: '12px'}}>Five ways to start a ripple</h2>
            </div>
            <div className="carousel-nav" data-reveal>
              <button className="circle-btn" data-track="cases" data-dir="-1" aria-label="Previous">←</button>
              <button className="circle-btn" data-track="cases" data-dir="1" aria-label="Next">→</button>
            </div>
          </div>
          <div className="track" id="cases" data-reveal-group>
            {/* repeat ×5 */}
            <article className="case-card" data-reveal><div className="case-cover"><video muted loop playsInline preload="none" poster="/assets/case-design.jpg" src="/assets/case-design.mp4"></video></div><div className="case-body"><span className="badge">Flowers</span><h4 className="heading-4">Leave flowers for a stranger</h4><p className="small" style={{color: 'var(--text-secondary)'}}>Pick a few on your walk and leave them where someone will find them.</p><a className="arrow-link" href="#">View case <span className="arr">→</span></a></div></article>
            <article className="case-card" data-reveal><div className="case-cover"><video muted loop playsInline preload="none" poster="/assets/case-product.jpg" src="/assets/case-product.mp4"></video></div><div className="case-body"><span className="badge">Books</span><h4 className="heading-4">Share a favorite book</h4><p className="small" style={{color: 'var(--text-secondary)'}}>Leave it on a bench with a note inside: this one mattered to me.</p><a className="arrow-link" href="#">View case <span className="arr">→</span></a></div></article>
            <article className="case-card" data-reveal><div className="case-cover"><video muted loop playsInline preload="none" poster="/assets/case-marketing.jpg" src="/assets/case-marketing.mp4"></video></div><div className="case-body"><span className="badge">Notes</span><h4 className="heading-4">Write an encouraging note</h4><p className="small" style={{color: 'var(--text-secondary)'}}>Tuck it under a door, in a mailbox, inside a library book.</p><a className="arrow-link" href="#">View case <span className="arr">→</span></a></div></article>
            <article className="case-card" data-reveal><div className="case-cover"><video muted loop playsInline preload="none" poster="/assets/case-founders.jpg" src="/assets/case-founders.mp4"></video></div><div className="case-body"><span className="badge">Rocks</span><h4 className="heading-4">Paint a kindness rock</h4><p className="small" style={{color: 'var(--text-secondary)'}}>Leave it on a trail for the next hiker to find.</p><a className="arrow-link" href="#">View case <span className="arr">→</span></a></div></article>
            <article className="case-card" data-reveal><div className="case-cover"><video muted loop playsInline preload="none" poster="/assets/case-ops.jpg" src="/assets/case-ops.mp4"></video></div><div className="case-body"><span className="badge">Plants</span><h4 className="heading-4">Give someone a plant</h4><p className="small" style={{color: 'var(--text-secondary)'}}>A cutting from your kitchen jar is plenty. Watch it grow.</p><a className="arrow-link" href="#">View case <span className="arr">→</span></a></div></article>
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
              <p className="lede">Every card carries its story from state to state.</p>
              <div className="cta-row" style={{marginTop: 'var(--gap-m)', justifyContent: 'flex-start'}}>
                <a className="btn btn-primary" href="/print.html" target="_blank">Print cards</a>
                <a className="btn btn-secondary" href="#">See the story</a>
              </div>
            </div>
            <div className="showpiece" data-reveal>
              <div className="morph" data-morph></div>
              <span className="badge">The map</span>
              <h3>Every state, connected</h3>
              <p className="lede">Follow each ripple’s journey from hand to hand.</p>
              <div className="cta-row" style={{marginTop: 'var(--gap-m)', justifyContent: 'flex-start'}}>
                <a className="btn btn-primary" href="#">Open the map</a>
                <a className="btn btn-secondary" href="#">Learn more</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 04b · STATES */}
      <section id="states">
        <div className="container-wide">
          <div style={{textAlign: 'center', maxWidth: '640px', margin: '0 auto var(--gap-3xl)'}}>
            <p className="eyebrow" data-reveal>Every state</p>
            <h2 className="heading-2" data-reveal style={{marginTop: '12px'}}>All fifty, all connected</h2>
            <p className="lede" data-reveal style={{marginTop: '16px'}}>Collect a card from every state to see how far kindness can travel.</p>
          </div>
          <div className="states-grid">
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-alabama.jpg" alt="Alabama" /></span><span className="state-name">Alabama</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-alaska.jpg" alt="Alaska" /></span><span className="state-name">Alaska</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-arizona.jpg" alt="Arizona" /></span><span className="state-name">Arizona</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-arkansas.jpg" alt="Arkansas" /></span><span className="state-name">Arkansas</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-california.jpg" alt="California" /></span><span className="state-name">California</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-colorado.jpg" alt="Colorado" /></span><span className="state-name">Colorado</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-connecticut.jpg" alt="Connecticut" /></span><span className="state-name">Connecticut</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-delaware.jpg" alt="Delaware" /></span><span className="state-name">Delaware</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-florida.jpg" alt="Florida" /></span><span className="state-name">Florida</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-georgia.jpg" alt="Georgia" /></span><span className="state-name">Georgia</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-hawaii.jpg" alt="Hawaii" /></span><span className="state-name">Hawaii</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-idaho.jpg" alt="Idaho" /></span><span className="state-name">Idaho</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-illinois.jpg" alt="Illinois" /></span><span className="state-name">Illinois</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-indiana.jpg" alt="Indiana" /></span><span className="state-name">Indiana</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-iowa.jpg" alt="Iowa" /></span><span className="state-name">Iowa</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-kansas.jpg" alt="Kansas" /></span><span className="state-name">Kansas</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-kentucky.jpg" alt="Kentucky" /></span><span className="state-name">Kentucky</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-louisiana.jpg" alt="Louisiana" /></span><span className="state-name">Louisiana</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-maine.jpg" alt="Maine" /></span><span className="state-name">Maine</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-maryland.jpg" alt="Maryland" /></span><span className="state-name">Maryland</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-massachusetts.jpg" alt="Massachusetts" /></span><span className="state-name">Massachusetts</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-michigan.jpg" alt="Michigan" /></span><span className="state-name">Michigan</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-minnesota.jpg" alt="Minnesota" /></span><span className="state-name">Minnesota</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-mississippi.jpg" alt="Mississippi" /></span><span className="state-name">Mississippi</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-missouri.jpg" alt="Missouri" /></span><span className="state-name">Missouri</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-montana.jpg" alt="Montana" /></span><span className="state-name">Montana</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-nebraska.jpg" alt="Nebraska" /></span><span className="state-name">Nebraska</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-nevada.jpg" alt="Nevada" /></span><span className="state-name">Nevada</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-newhampshire.jpg" alt="New Hampshire" /></span><span className="state-name">New Hampshire</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-newjersey.jpg" alt="New Jersey" /></span><span className="state-name">New Jersey</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-newmexico.jpg" alt="New Mexico" /></span><span className="state-name">New Mexico</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-newyork.jpg" alt="New York" /></span><span className="state-name">New York</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-northcarolina.jpg" alt="North Carolina" /></span><span className="state-name">North Carolina</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-northdakota.jpg" alt="North Dakota" /></span><span className="state-name">North Dakota</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-ohio.jpg" alt="Ohio" /></span><span className="state-name">Ohio</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-oklahoma.jpg" alt="Oklahoma" /></span><span className="state-name">Oklahoma</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-oregon.jpg" alt="Oregon" /></span><span className="state-name">Oregon</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-pennsylvania.jpg" alt="Pennsylvania" /></span><span className="state-name">Pennsylvania</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-rhodeisland.jpg" alt="Rhode Island" /></span><span className="state-name">Rhode Island</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-southcarolina.jpg" alt="South Carolina" /></span><span className="state-name">South Carolina</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-southdakota.jpg" alt="South Dakota" /></span><span className="state-name">South Dakota</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-tennessee.jpg" alt="Tennessee" /></span><span className="state-name">Tennessee</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-texas.jpg" alt="Texas" /></span><span className="state-name">Texas</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-utah.jpg" alt="Utah" /></span><span className="state-name">Utah</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-vermont.jpg" alt="Vermont" /></span><span className="state-name">Vermont</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-virginia.jpg" alt="Virginia" /></span><span className="state-name">Virginia</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-washington.jpg" alt="Washington" /></span><span className="state-name">Washington</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-westvirginia.jpg" alt="West Virginia" /></span><span className="state-name">West Virginia</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-wisconsin.jpg" alt="Wisconsin" /></span><span className="state-name">Wisconsin</span></a>
            <a className="state-card" data-reveal href="#"><span className="state-art"><img loading="lazy" src="/assets/state-wyoming.jpg" alt="Wyoming" /></span><span className="state-name">Wyoming</span></a>
          </div>
          <p className="small" data-reveal style={{textAlign: 'center', marginTop: 'var(--gap-xl)', color: 'var(--text-tertiary)'}}>All fifty, ready to be found.</p>
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
            <a className="btn btn-light" href="/print.html" target="_blank">Print your first card</a>
          </div>
        </div>
      </section>
      
      {/* 07 · FOOTER */}
      <footer>
        <div className="container-wide">
          <div className="foot-grid">
            <div>
              <a className="brand" href="#" style={{marginBottom: '16px'}}><span className="brand-mark"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M16 14.8C13 12.2 10.6 10.4 10.6 8.2C10.6 6.5 12 5.2 13.6 5.2C14.6 5.2 15.5 5.7 16 6.5C16.5 5.7 17.4 5.2 18.4 5.2C20 5.2 21.4 6.5 21.4 8.2C21.4 10.4 19 12.2 16 14.8Z" fill="#c2704a"/><ellipse cx="16" cy="20.5" rx="6.5" ry="2.4" fill="none" stroke="#5d7050" strokeWidth="1.8"/><ellipse cx="16" cy="21.8" rx="11.5" ry="4.2" fill="none" stroke="#5d7050" strokeWidth="1.4" opacity="0.5"/></svg></span>Ripple</a>
              <p className="small" style={{color: 'var(--text-secondary)', marginTop: '12px', maxWidth: '24ch'}}>A little kindness. Every state. All connected.</p>
            </div>
            <div><h5>The ripple</h5><ul><li><a href="#use-cases">Ideas</a></li><li><a href="#showpiece">Cards</a></li>
            <li><a href="#print">Print</a></li><li><a href="/print.html" target="_blank">Print cards</a></li></ul></div>
            <div><h5>Movement</h5><ul><li><a href="#">About</a></li><li><a href="#journal">Stories</a></li><li><a href="#">Contact</a></li></ul></div>
            <div><h5>Legal</h5><ul><li><a href="#">Privacy</a></li><li><a href="#">Terms</a></li></ul></div>
          </div>
          <div className="giant-wordmark" data-reveal>RIPPLE</div>
          <div className="foot-legal">
            <span>© 2026 Ripple</span>
            <span className="links"><a href="#">Privacy</a><a href="#">Terms</a></span>
          </div>
        </div>
      </footer>
      
      {/* STATE CARD MODAL */}
      <div className="card-modal-root" id="card-modal" hidden>
        <div className="card-scrim"></div>
        <div className="card-fly">
          <div className="flip-inner">
            <div className="card-face card-front">
              <span className="card-art"><img alt="" /></span>
              <div className="card-plaque">
                <span className="plaque-micro">This ripple started in</span>
                <span className="plaque-state">Iowa</span>
              </div>
            </div>
            <div className="card-face card-back">
              <svg className="back-mark" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M16 14.8C13 12.2 10.6 10.4 10.6 8.2C10.6 6.5 12 5.2 13.6 5.2C14.6 5.2 15.5 5.7 16 6.5C16.5 5.7 17.4 5.2 18.4 5.2C20 5.2 21.4 6.5 21.4 8.2C21.4 10.4 19 12.2 16 14.8Z" fill="#c2704a"/><ellipse cx="16" cy="20.5" rx="6.5" ry="2.4" fill="none" stroke="#5d7050" strokeWidth="1.8"/><ellipse cx="16" cy="21.8" rx="11.5" ry="4.2" fill="none" stroke="#5d7050" strokeWidth="1.4" opacity="0.5"/></svg>
              <h5>Keep the ripple moving</h5>
              <p className="back-msg">If this brought a smile to your face, help someone else experience the same.</p>
              <span className="back-tag">#KeepTheRippleMoving</span>
            </div>
          </div>
          <button className="modal-close-x" aria-label="Close">✕</button>
          <div className="modal-btns">
            <button className="btn btn-light flip-btn">Flip the card</button>
          </div>
        </div>
      </div>
      <SiteMotion />
    </>
  );
}
