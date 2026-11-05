// Standalone port of the mobile concept's component logic ("Parrish Demo - Mobile",
// originally a DCLogic class that needed the design tool's runtime). Behavior is unchanged.
// The desktop build keeps its own interactions.js; this only drives the mobile layout (max-width: 767px).
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const root = $('m-top'), menu = $('m-menu'), bar = $('m-bar'), marq = $('m-marq');
  const form = $('m-subscribe'), msg = $('m-subMsg');
  const active = matchMedia('(max-width: 767px)');
  const motion = true; // concept prop "motion" (default true); "stickyTickets" also defaults to true

  // Menu overlay
  const setMenu = open => { menu.hidden = !open; };
  root.querySelectorAll('[data-m-menu]').forEach(b => b.addEventListener('click', () => setMenu(menu.hidden)));
  root.querySelectorAll('[data-m-close]').forEach(a => a.addEventListener('click', () => setMenu(false)));

  // Sticky "Plan visit / Tickets" bar slides in after 400px of scroll
  let barIn = false;
  const onScroll = () => { const b = scrollY > 400; if (b !== barIn) { barIn = b; bar.style.transform = b ? 'none' : 'translateY(110%)'; } };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Newsletter (demo only — nothing is sent)
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.querySelector('input').value = '';
    msg.textContent = 'Thanks — you’re on the list. (Demo only.)';
  });

  if (!motion || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Reveal on scroll
  const ease = 'cubic-bezier(.2,.7,.2,1)';
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return; io.unobserve(en.target);
    en.target.style.opacity = '1'; en.target.style.transform = 'none';
  }), { threshold: 0.1 });
  root.querySelectorAll('[data-reveal]').forEach(el => {
    el.style.opacity = '0'; el.style.transform = 'translateY(32px)';
    el.style.transition = `opacity 800ms ${ease}, transform 1000ms ${ease}`;
    io.observe(el);
  });

  // Ticker + parallax images
  if (marq) marq.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }], { duration: 40000, iterations: Infinity });
  const par = [...root.querySelectorAll('[data-parallax]')];
  const tick = () => {
    requestAnimationFrame(tick);
    if (!active.matches) return;
    const vh = innerHeight;
    par.forEach(el => {
      const r = el.parentElement.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh) return;
      el.style.transform = `translate3d(0,${((r.top + r.height / 2 - vh / 2) * -el.dataset.parallax).toFixed(1)}px,0) scale(1.15)`;
    });
  };
  tick();
})();
