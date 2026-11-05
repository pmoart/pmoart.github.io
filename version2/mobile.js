// Standalone port of the mobile concept's component logic ("Parrish Option 1 - Masthead - Mobile",
// originally a DCLogic class that needed the design tool's runtime). Behavior is unchanged.
// Only runs its frame loop while the mobile layout is showing (max-width: 767px).
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const root = $('m-top'), track = $('m-track'), trackBar = $('m-trackBar'), menu = $('m-menu');
  const active = matchMedia('(max-width: 767px)');
  const motion = true; // concept prop "motion" (default true)

  // Menu overlay
  const setMenu = open => { menu.hidden = !open; };
  root.querySelectorAll('[data-m-menu]').forEach(b => b.addEventListener('click', () => setMenu(menu.hidden)));
  root.querySelectorAll('[data-m-close]').forEach(a => a.addEventListener('click', () => setMenu(false)));

  // Exhibition rail: progress bar + prev/next
  const measure = () => {
    const max = track.scrollWidth - track.clientWidth;
    const pct = max > 0 ? (track.clientWidth / track.scrollWidth) + (track.scrollLeft / max) * (1 - track.clientWidth / track.scrollWidth) : 1;
    trackBar.style.width = (pct * 100).toFixed(1) + '%';
  };
  const step = dir => { const card = track.firstElementChild; track.scrollBy({ left: dir * ((card ? card.offsetWidth : 300) + 14), behavior: 'smooth' }); };
  track.addEventListener('scroll', measure, { passive: true });
  $('m-prev').addEventListener('click', () => step(-1));
  $('m-next').addEventListener('click', () => step(1));
  active.addEventListener('change', measure);
  addEventListener('resize', measure);
  measure();

  if (!motion || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Staggered reveal on scroll
  const ease = 'cubic-bezier(.2,.7,.2,1)';
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return; io.unobserve(en.target);
    en.target.style.opacity = '1'; en.target.style.transform = 'none';
  }), { threshold: 0.1 });
  root.querySelectorAll('[data-reveal]').forEach(el => {
    const sibs = [...el.parentElement.children].filter(c => c.hasAttribute('data-reveal'));
    const d = Math.min(sibs.indexOf(el), 3) * 90;
    el.style.opacity = '0'; el.style.transform = 'translateY(32px)';
    el.style.transition = `opacity 800ms ${ease} ${d}ms, transform 1000ms ${ease} ${d}ms, background 160ms, color 160ms`;
    io.observe(el);
  });

  // Parallax images
  const par = [...root.querySelectorAll('[data-parallax]')];
  const tick = () => {
    requestAnimationFrame(tick);
    if (!active.matches) return;
    const vh = innerHeight;
    par.forEach(el => {
      const r = el.parentElement.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh) return;
      el.style.transform = `translate3d(0,${((r.top + r.height / 2 - vh / 2) * -el.dataset.parallax).toFixed(1)}px,0) scale(1.18)`;
    });
  };
  tick();
})();
