const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
const closeMenu = () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  nav?.classList.remove('is-open');
};
menuButton?.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(expanded));
  nav.classList.toggle('is-open', expanded);
});
nav?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header-inner')) closeMenu();
});
matchMedia('(min-width:641px)').addEventListener('change', closeMenu);

if ('IntersectionObserver' in window) {
  const links = [...document.querySelectorAll('#main-nav a')];
  const observer = new IntersectionObserver(entries => {
    const active = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (!active) return;
    links.forEach(link => {
      if (link.hash === `#${active.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}

const copyButton = document.querySelector('[data-copy-email]');
const copyLabel = copyButton?.querySelector('span');
const copyStatus = document.querySelector('.copy-status');
let resetTimer;
copyButton?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyButton.dataset.copyEmail);
    copyLabel.textContent = 'Copied!';
    copyStatus.textContent = 'Email address copied.';
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => { copyLabel.textContent = 'Copy email'; copyStatus.textContent = ''; }, 3500);
  } catch {
    copyStatus.textContent = 'Select the address to copy it, or click it to open your email app.';
  }
});
