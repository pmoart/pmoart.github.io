(() => {
  'use strict';
  const button = document.querySelector('.menu-button');
  const menu = document.querySelector('.mobile-menu');
  const header = document.querySelector('.site-header');
  const form = document.querySelector('.footer-newsletter form');
  const status = document.querySelector('.newsletter-status');

  function setMenu(open) {
    if (!button || !menu) return;
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!open));
    menu.classList.toggle('mobile-menu--open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (document.querySelector('main')) document.querySelector('main').inert = open;
    if (document.querySelector('footer')) document.querySelector('footer').inert = open;
  }
  button?.addEventListener('click', () => setMenu(button.getAttribute('aria-expanded') !== 'true'));
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button?.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      button.focus();
    }
  });
  let wasScrolled = false;
  function onScroll() {
    const isScrolled = scrollY > 24;
    if (wasScrolled !== isScrolled) {
      header?.classList.toggle('site-header--scrolled', isScrolled);
      wasScrolled = isScrolled;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  if (scrollY > 24) onScroll();
  form?.addEventListener('submit', event => {
    event.preventDefault();
    status.textContent = 'Preview only: your address was not submitted. A mailing-list integration is needed for sign-ups.';
    form.reset();
  });
  form?.querySelectorAll('input:disabled, button:disabled').forEach(control => { control.disabled = false; });
})();
