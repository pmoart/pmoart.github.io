// Standalone port of the concept's component logic (originally a DCLogic class
// that needed the design tool's support.js runtime). Behavior is unchanged.
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const root = $('root'), header = $('hdr'), hero = $('top');
  const heroTitle = $('heroTitle'), heroImg = $('heroImg'), heroScale = $('heroScale'), heroCap = $('heroCap');
  const marq = $('marq'), hs = $('on-view'), track = $('track'), bar = $('bar'), count = $('count');
  const menu = $('menu'), form = $('join'), joined = $('joined');
  const motion = true; // concept prop "motion" (default true)
  let menuOpen = false, mx = 0, lastY = 0, counted = false, raf;

  // Menu overlay
  const toggleMenu = () => { menuOpen = !menuOpen; menu.hidden = !menuOpen; };
  document.querySelectorAll('[data-menu-toggle],[data-menu-close]').forEach(el => el.addEventListener('click', toggleMenu));

  // Mailing list (preview only — nothing is sent)
  form.addEventListener('submit', e => { e.preventDefault(); form.hidden = true; joined.hidden = false; });

  // Count-up
  function countUp() {
    if (counted) return; counted = true;
    const t0 = performance.now(), end = 3600;
    const step = t => {
      const p = Math.min(1, (t - t0) / 1800), e = 1 - Math.pow(1 - p, 3);
      count.textContent = Math.round(end * e).toLocaleString() + (p === 1 ? '+' : '');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Reveal on scroll
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    if (el === count) { countUp(); } else { el.style.opacity = 1; el.style.transform = 'none'; }
    io.unobserve(el);
  }), { threshold: 0.12 });
  root.querySelectorAll('[data-reveal]').forEach(el => {
    const d = el.dataset.delay || 0;
    el.style.opacity = 0; el.style.transform = 'translateY(40px)';
    el.style.transition = `opacity 1s cubic-bezier(.2,.7,.2,1) ${d}ms, transform 1s cubic-bezier(.2,.7,.2,1) ${d}ms, background .3s, color .3s, padding .3s`;
    io.observe(el);
  });
  if (count) io.observe(count);

  // Scroll-driven frame loop
  const tick = () => {
    const vh = window.innerHeight, vw = window.innerWidth, y = window.scrollY || document.documentElement.scrollTop;
    const cl = v => Math.max(0, Math.min(1, v));
    if (header && !menuOpen) {
      header.style.transform = (y > lastY + 2 && y > 300) ? 'translateY(-100%)' : (y < lastY - 2 || y < 300 ? 'none' : header.style.transform);
    }
    lastY = y;

    if (hero) {
      const r = hero.getBoundingClientRect(), p = motion ? cl(-r.top / (r.height - vh)) : 1, q = 1 - p;
      heroImg.style.clipPath = `inset(${46 * q}% ${4 * q}% ${5 * q}% ${4 * q}% round ${4 * q}px)`;
      heroScale.style.transform = `scale(${1 + 0.15 * q})`;
      heroTitle.style.transform = `translateY(${-p * 160}px)`;
      heroTitle.style.opacity = String(cl(1 - p * 1.6));
      heroCap.style.opacity = p > 0.7 ? '1' : '0';
    }

    if (hs && track) {
      const dist = Math.max(0, track.scrollWidth - vw), want = (dist + vh) + 'px';
      if (hs.style.height !== want) hs.style.height = want;
      const r = hs.getBoundingClientRect(), p = cl(-r.top / Math.max(1, r.height - vh));
      track.style.transform = `translate3d(${-p * dist}px,0,0)`;
      bar.style.transform = `scaleX(${p})`;
    }

    if (marq && motion) {
      mx -= 0.7; const w = marq.scrollWidth / 2;
      if (w && -mx > w) mx += w;
      marq.style.transform = `translate3d(${mx}px,0,0)`;
    }
    raf = requestAnimationFrame(tick);
  };
  tick();
})();
