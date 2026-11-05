// Standalone port of the mobile concept's component logic ("Parrish Redesign - Mobile",
// originally a DCLogic class that needed the design tool's runtime). Behavior is unchanged.
// Only runs its frame loop while the mobile layout is showing (max-width: 767px).
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const root = $('mroot'), header = $('m-hdr'), hero = $('m-top');
  const heroTitle = $('m-heroTitle'), heroImg = $('m-heroImg'), heroScale = $('m-heroScale'), heroCap = $('m-heroCap');
  const marq = $('m-marq'), track = $('m-track'), exIndex = $('m-exIndex'), trackBar = $('m-trackBar');
  const count = $('m-count'), bar = $('m-bar'), menu = $('m-menu'), form = $('m-join'), joined = $('m-joined');
  const active = matchMedia('(max-width: 767px)');
  const motionProp = true, stickyVisit = true; // concept props (defaults)
  const reduced = () => !motionProp || matchMedia('(prefers-reduced-motion: reduce)').matches;
  let menuOpen = false, mx = 0, lastY = 0, counted = false, idx = 1, pct = 0.2;

  // Menu overlay (accordion groups are native <details>)
  const toggleMenu = () => { menuOpen = !menuOpen; menu.hidden = !menuOpen; };
  root.querySelectorAll('[data-m-menu]').forEach(el => el.addEventListener('click', toggleMenu));

  // Mailing list (preview only — nothing is sent)
  form.addEventListener('submit', e => { e.preventDefault(); form.hidden = true; joined.hidden = false; });

  if (!stickyVisit) bar.remove();

  // Count-up
  function countUp(reduce) {
    if (counted) return; counted = true;
    const end = 3600;
    if (reduce) { count.textContent = '3,600+'; return; }
    const t0 = performance.now();
    const step = t => {
      const p = Math.min(1, (t - t0) / 1600), e = 1 - Math.pow(1 - p, 3);
      count.textContent = Math.round(end * e).toLocaleString() + (p === 1 ? '+' : '');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Reveal on scroll
  const reduce = reduced();
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; const el = e.target;
    if (el === count) countUp(reduce); else { el.style.opacity = 1; el.style.transform = 'none'; }
    io.unobserve(el);
  }), { threshold: 0.1 });
  if (!reduce) root.querySelectorAll('[data-reveal]').forEach(el => {
    el.style.opacity = 0; el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity .9s cubic-bezier(.2,.7,.2,1), transform .9s cubic-bezier(.2,.7,.2,1), background .2s, color .2s';
    io.observe(el);
  });
  if (count) io.observe(count);

  // Exhibition rail: "01 / 05" counter + progress bar
  const onTrack = () => {
    const card = track.firstElementChild, w = card ? card.offsetWidth + 12 : 1;
    const nIdx = Math.min(5, Math.round(track.scrollLeft / w) + 1);
    const max = track.scrollWidth - track.clientWidth;
    const nPct = max > 0 ? 0.2 + 0.8 * (track.scrollLeft / max) : 1;
    if (nIdx !== idx || Math.abs(nPct - pct) > 0.01) {
      idx = nIdx; pct = nPct;
      exIndex.textContent = String(idx).padStart(2, '0');
      trackBar.style.width = (pct * 100).toFixed(1) + '%';
    }
  };
  track.addEventListener('scroll', onTrack, { passive: true });

  // Scroll-driven frame loop
  const tick = () => {
    raf = requestAnimationFrame(tick);
    if (!active.matches) return;
    const motion = !reduced();
    const vh = innerHeight, y = scrollY;
    const cl = v => Math.max(0, Math.min(1, v));
    if (header && !menuOpen) header.style.transform = (y > lastY + 2 && y > 240) ? 'translateY(-100%)' : (y < lastY - 2 || y < 240 ? 'none' : header.style.transform);
    if (bar.isConnected) bar.style.transform = y > vh * 1.2 ? 'none' : 'translateY(160%)';
    lastY = y;
    if (hero && heroImg) {
      const r = hero.getBoundingClientRect(), p = motion ? cl(-r.top / (r.height - vh)) : 1, q = 1 - p;
      heroImg.style.clipPath = `inset(${52 * q}% ${5 * q}% ${6 * q}% ${5 * q}%)`;
      heroScale.style.transform = `scale(${1 + 0.15 * q})`;
      heroTitle.style.transform = `translateY(${-p * 120}px)`;
      heroTitle.style.opacity = String(cl(1 - p * 1.6));
      heroCap.style.opacity = p > 0.7 ? '1' : '0';
    }
    if (marq && motion) { mx -= 0.5; const w = marq.scrollWidth / 2; if (w && -mx > w) mx += w; marq.style.transform = `translate3d(${mx}px,0,0)`; }
  };
  let raf = requestAnimationFrame(tick);
})();
