// Standalone port of the concept's component logic (originally a DCLogic class
// that needed the design tool's support.js runtime). Behavior is unchanged.
(() => {
  'use strict';
  const track = document.getElementById('track');
  const scroll = dir => { if (track) track.scrollBy({ left: dir * track.clientWidth * 0.6, behavior: 'smooth' }); };
  document.getElementById('prev').addEventListener('click', () => scroll(-1));
  document.getElementById('next').addEventListener('click', () => scroll(1));

  const motion = true; // concept prop "motion" (default true)
  if (!motion || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Staggered reveal on scroll
  const ease = 'cubic-bezier(.2,.7,.2,1)';
  const rv = [...document.querySelectorAll('[data-reveal]')];
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; const el = e.target; io.unobserve(el);
    el.style.opacity = '1'; el.style.transform = 'none';
    setTimeout(() => { el.style.transition = el.dataset.ot || ''; }, 1400 + (+el.dataset.d || 0));
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  rv.forEach(el => {
    const s = [...el.parentElement.children].filter(c => c.hasAttribute('data-reveal'));
    const d = Math.min(s.indexOf(el), 5) * 110; el.dataset.d = d; el.dataset.ot = el.style.transition;
    el.style.opacity = '0'; el.style.transform = 'translateY(56px)';
    el.style.transition = `opacity 900ms ${ease} ${d}ms, transform 1200ms ${ease} ${d}ms`;
    io.observe(el);
  });

  // Parallax images + scroll-velocity marquee
  const par = [...document.querySelectorAll('[data-parallax]')];
  const mqEl = document.querySelector('[data-marquee]');
  const mq = mqEl ? mqEl.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }], { duration: 40000, iterations: Infinity }) : null;
  let ly = scrollY, v = 0;
  const tick = () => {
    const vh = innerHeight;
    par.forEach(el => {
      const r = el.parentElement.getBoundingClientRect(); if (r.bottom < -100 || r.top > vh + 100) return;
      el.style.transform = `translate3d(0,${((r.top + r.height / 2 - vh / 2) * -el.dataset.parallax).toFixed(1)}px,0) scale(1.22)`;
    });
    if (mq) { v = v * 0.9 + Math.abs(scrollY - ly) * 0.1; ly = scrollY; mq.playbackRate = 1 + Math.min(v / 4, 6); }
    requestAnimationFrame(tick);
  };
  tick();
})();
