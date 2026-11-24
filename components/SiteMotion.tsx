// @ts-nocheck — deliberately imperative DOM script; see note below.
"use client";

// Global motion layer — a faithful port of the static site's inline script.
// Imperative by design: it queries the server-rendered DOM after mount, so
// the markup in app/page.tsx stays byte-compatible with the original HTML.
// See DESIGN.md ("Motion") before changing timings or easings.
import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";

export default function SiteMotion() {
  useEffect(() => {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      /* The hero loop is ~9 MB. Skip it for anyone who has asked for less data
         or is on a 2G/3G-class connection (where the browser tells us), and
         show the still instead. `?lite=1` forces this for testing. */
      var conn = (navigator as any).connection || {};
      var lite = conn.saveData === true
        || /(^|-)[23]g$/.test(conn.effectiveType || '')
        || /[?&]lite=1(&|$)/.test(window.location.search);
      if (reduced) document.documentElement.classList.add('reduced-motion');
      if (reduced || lite) {
        var hv = document.querySelector('.hero-video');
        if (hv) hv.remove(); /* fall back to the static still behind it */
      }

      /* Card-cover posters sit far down the page; fetch each one only as its
         card approaches the viewport. */
      (function(){
        var covers = Array.prototype.slice.call(document.querySelectorAll('video[data-poster]'));
        function show(v){ v.setAttribute('poster', v.getAttribute('data-poster')); v.removeAttribute('data-poster'); }
        if (!('IntersectionObserver' in window)) { covers.forEach(show); return; }
        var io = new IntersectionObserver(function(entries){
          entries.forEach(function(e){ if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
        }, { rootMargin: '600px 600px' });
        covers.forEach(function(v){ io.observe(v); });
      })();
    
      /* ---- typed-letter headline (word-wrap safe: types word by word into spans) ---- */
      function typeInto(id, done){
        var el = document.getElementById(id);
        if(!el) return;
        var text = el.getAttribute('data-text');
        if(reduced){ el.textContent = text; if(done) done(); return; }
        var words = text.split(' ');
        var spans = words.map(function(w){
          var s = document.createElement('span');
          s.style.whiteSpace = 'nowrap';
          s.dataset.word = w;
          return s;
        });
        spans.forEach(function(s,i){ el.appendChild(s); if(i < spans.length-1) el.appendChild(document.createTextNode(' ')); });
        var wi = 0, ci = 0;
        (function tick(){
          if(wi >= spans.length){ if(done) done(); return; }
          var word = spans[wi].dataset.word;
          ci++;
          spans[wi].textContent = word.slice(0, ci);
          if(ci >= word.length){ wi++; ci = 0; }
          setTimeout(tick, 45);
        })();
      }
      typeInto('typed');
    
      if (reduced || typeof gsap === 'undefined') return;
    
      /* ---- Lenis smooth scroll, driven by the GSAP ticker ---- */
      gsap.registerPlugin(ScrollTrigger);
      var lenis = new Lenis({ lerp: 0.1 });
      window.lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function(t){ lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    
      /* ---- scroll reveals: rise 40px + fade, staggered per section ---- */
      document.querySelectorAll('section, header.hero, footer').forEach(function(sec){
        var items = sec.querySelectorAll('[data-reveal]');
        if(!items.length) return;
        gsap.to(items, {
          opacity: 1, y: 0,
          duration: 0.9, ease: 'power3.out', stagger: 0.08,
          scrollTrigger: { trigger: sec, start: 'top 80%' }
        });
      });
    
      /* ---- scroll pacing: hero orb + headline drift up as you leave the hero ---- */
      gsap.to('header.hero .container', {
        y: -80, opacity: 0.4, ease: 'none',
        scrollTrigger: { trigger: 'header.hero', start: 'bottom 90%', end: 'bottom 30%', scrub: true }
      });
      /* backdrop breathes: slow zoom + drift as the hero scrolls away */
      gsap.to('.hero-bg', {
        yPercent: 6, scale: 1.14, ease: 'none',
        scrollTrigger: { trigger: 'header.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
      /* mask the loop seam: crossfade the video's own first frame around the restart */
      var heroVideo = document.querySelector('.hero-video');
      if (heroVideo) {
        var seam = document.createElement('canvas');
        seam.className = 'hero-seam';
        heroVideo.parentNode.appendChild(seam);
        var probe = document.createElement('video');
        probe.src = heroVideo.getAttribute('src');
        probe.muted = true; probe.preload = 'auto';
        probe.addEventListener('loadeddata', function(){
          seam.width = probe.videoWidth; seam.height = probe.videoHeight;
          seam.getContext('2d').drawImage(probe, 0, 0);
          probe.removeAttribute('src'); probe.load();
        }, { once: true });
        probe.load();
        var SEAM_FADE = 0.5;
        gsap.ticker.add(function(){
          var d = heroVideo.duration, t = heroVideo.currentTime, o = 0;
          if (d) {
            if (t > d - SEAM_FADE) o = (t - (d - SEAM_FADE)) / SEAM_FADE;
            else if (t < SEAM_FADE) o = 1 - t / SEAM_FADE;
          }
          seam.style.opacity = o.toFixed(3);
        });
      }
    
      /* ---- morphing orbs in the showpiece cards, scrubbed by scroll ---- */
      document.querySelectorAll('[data-morph]').forEach(function(m, i){
        gsap.to(m, {
          x: i % 2 ? -120 : 80, y: 140, scale: 1.35, ease: 'none',
          scrollTrigger: { trigger: m.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true }
        });
        gsap.to(m, { rotate: 180, borderRadius: '38%', duration: 9, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      });
    
      /* ---- library: pin the frame, reveal stat lines with scroll progress ---- */
      var lib = document.getElementById('library');
      if (lib) {
        var eyebrow = lib.querySelector('.stat-eyebrow');
        var statLines = lib.querySelectorAll('.stat-line');
        var dash = lib.querySelector('.stat-dash i');
        gsap.set(eyebrow, { opacity: 0, y: 30 });
        gsap.set(statLines, { opacity: 0, y: 110 });
        /* eyebrow loads in as the section arrives — already visible when the frame locks */
        gsap.to(eyebrow, {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: lib, start: 'top 75%' }
        });
        var libTl = gsap.timeline({
          scrollTrigger: {
            trigger: lib, start: 'top top', end: '+=170%',
            pin: true, scrub: 0.7,
            onUpdate: function(self){ if (dash) dash.style.transform = 'scaleX(' + self.progress + ')'; }
          }
        });
        libTl.to({}, { duration: 0.35 }); /* a beat with only the eyebrow, like the source */
        statLines.forEach(function(line){
          libTl.to(line, { opacity: 1, y: 0, color: '#adadad', duration: 1.1, ease: 'power3.out' })
               .to(line, { color: '#141414', duration: 0.45 }, '-=0.25');
        });
        libTl.to({}, { duration: 0.5 }); /* hold the finished frame a beat */
        /* smooth organic wander: each tile eases to a new random offset every cycle */
        lib.querySelectorAll('.tile').forEach(function(el, i){
          gsap.to(el, {
            x: 'random(-30, 30)', y: 'random(-26, 26)', rotation: 'random(-6, 6)',
            duration: 'random(3.5, 6)', ease: 'sine.inOut',
            repeat: -1, repeatRefresh: true, delay: (i % 5) * 0.4
          });
        });
      }
    
      /* ---- color tint: page warms as the dark band approaches ---- */
      gsap.to('body', {
        backgroundColor: '#f7f5f2', ease: 'none',
        scrollTrigger: { trigger: '#journal', start: 'top bottom', end: 'top top', scrub: true }
      });
      gsap.to('body', {
        backgroundColor: '#ffffff', ease: 'none',
        scrollTrigger: { trigger: '#get-started', start: 'top bottom', end: 'top center', scrub: true }
      });
    
      /* ---- dark-band typed headline fires when it enters ---- */
      var darkTyped = false;
      ScrollTrigger.create({
        trigger: '#get-started', start: 'top 70%',
        onEnter: function(){ if(!darkTyped){ darkTyped = true; typeInto('typed-dark'); } }
      });
    
      /* ---- card covers: play the ambient loop on hover ---- */
      document.querySelectorAll('.case-card').forEach(function(card){
        var vid = card.querySelector('.case-cover video');
        if (!vid) return;
        card.addEventListener('mouseenter', function(){ vid.play(); });
        card.addEventListener('mouseleave', function(){ vid.pause(); });
      });
    
      /* ---- state card modal: lift, expand, flip ---- */
      (function(){
        var root = document.getElementById('card-modal');
        if (!root) return;
        var scrim = root.querySelector('.card-scrim');
        var fly = root.querySelector('.card-fly');
        var inner = root.querySelector('.flip-inner');
        var frontImg = root.querySelector('.card-front img');
        var plaque = root.querySelector('.plaque-state');
        var openFrom = null, isOpen = false, closing = false, curT = null;
        var plaqueBox = root.querySelector('.card-plaque');
        var chrome = [root.querySelector('.modal-close-x'), root.querySelector('.modal-btns')];
    
        function hashNum(s){ var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9973; return h; }
        var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    
        function targetRect(){
          var w = Math.min(400, window.innerWidth - 48);
          var h = Math.min(w * 1.4, window.innerHeight - 160);
          return { left: (window.innerWidth - w) / 2, top: (window.innerHeight - h) / 2 - 16, width: w, height: h };
        }
    
        function openCard(card){
          if (isOpen) return;
          isOpen = true; openFrom = card;
          var img = card.querySelector('img');
          var name = card.querySelector('.state-name').textContent;
          frontImg.src = img.src; frontImg.alt = name;
          plaque.textContent = name;
          var h = hashNum(name);
          var r = card.getBoundingClientRect(), t = targetRect();
          curT = t;
          root.hidden = false;
          gsap.set(inner, { rotateY: 0 });
          /* FLIP: size the card at its final dimensions, then scale-transform from the
             origin rect — children scale as one unit, so text never reflows mid-flight */
          gsap.set(fly, { left: t.left, top: t.top, width: t.width, height: t.height, transformOrigin: '0 0' });
          card.style.visibility = 'hidden';
          if (window.lenis) window.lenis.stop();
          gsap.to(scrim, { opacity: 1, duration: 0.35, ease: 'power2.out' });
          gsap.fromTo(fly,
            { x: r.left - t.left, y: r.top - t.top, scaleX: r.width / t.width, scaleY: r.height / t.height },
            { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.55, ease: 'power3.inOut' });
          gsap.fromTo([plaqueBox].concat(chrome),
            { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 0.4, stagger: 0.06, ease: 'power2.out' });
        }
    
        function closeCard(){
          if (!isOpen || closing) return;
          closing = true;
          var r = openFrom.getBoundingClientRect(), t = curT;
          /* text and chrome fade out first, then the card scales home as one unit */
          gsap.to([plaqueBox].concat(chrome), { opacity: 0, duration: 0.15, ease: 'power1.out' });
          gsap.to(inner, { rotateY: 0, duration: 0.25, ease: 'power2.inOut' });
          gsap.to(scrim, { opacity: 0, duration: 0.4, ease: 'power2.in' });
          gsap.to(fly, {
            x: r.left - t.left, y: r.top - t.top,
            scaleX: r.width / t.width, scaleY: r.height / t.height,
            duration: 0.5, ease: 'power3.inOut',
            onComplete: function(){
              root.hidden = true;
              openFrom.style.visibility = '';
              gsap.set(fly, { clearProps: 'transform' });
              gsap.set([plaqueBox].concat(chrome), { clearProps: 'opacity' });
              if (window.lenis) window.lenis.start();
              isOpen = false; closing = false;
            }});
        }
    
        document.querySelectorAll('.state-card').forEach(function(card){
          card.addEventListener('click', function(e){ e.preventDefault(); openCard(card); });
        });
        root.querySelector('.flip-btn').addEventListener('click', function(){
          gsap.to(inner, { rotateY: '+=180', duration: 0.65, ease: 'power2.inOut' });
        });
        root.querySelector('.modal-close-x').addEventListener('click', closeCard);
        scrim.addEventListener('click', closeCard);
        document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeCard(); });
      })();
    
      /* ---- carousel buttons ---- */
      document.querySelectorAll('.circle-btn[data-track]').forEach(function(btn){
        btn.addEventListener('click', function(){
          var track = document.getElementById(btn.dataset.track);
          var card = track.firstElementChild;
          var step = (card ? card.getBoundingClientRect().width : 380) + 24;
          track.scrollBy({ left: step * Number(btn.dataset.dir), behavior: 'smooth' });
        });
      });

    /* React SSR omits the muted attribute, which blocks autoplay — restore it */
    var heroV = document.querySelector(".hero-video");
    if (heroV) {
      heroV.preload = "auto";
      heroV.muted = true;
      var p = heroV.play();
      if (p) p.catch(function () {});
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      if (window.lenis) {
        window.lenis.destroy();
        window.lenis = undefined;
      }
      gsap.globalTimeline.clear();
    };
  }, []);

  return null;
}
