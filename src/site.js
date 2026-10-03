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

// The image is the visual fallback. This small canvas adds slow, subtle starlight.
const starCanvas = document.querySelector('#starfield');
const starContext = starCanvas?.getContext('2d');
if (starContext) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let stars = [];
  let skyWidth = 0;
  let skyHeight = 0;
  let animationFrame = 0;
  let lastFrame = 0;
  const paintStars = time => {
    starContext.clearRect(0, 0, skyWidth, skyHeight);
    for (const star of stars) {
      const glow = reducedMotion.matches ? .6 : .5 + .24 * Math.sin(time * .00035 + star.phase);
      starContext.fillStyle = `rgba(211,224,255,${glow * star.alpha})`;
      starContext.beginPath();
      starContext.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      starContext.fill();
      if (star.radius > 1) {
        starContext.strokeStyle = `rgba(189,209,255,${glow * .22})`;
        starContext.lineWidth = .6;
        starContext.beginPath();
        starContext.moveTo(star.x - 4, star.y);
        starContext.lineTo(star.x + 4, star.y);
        starContext.moveTo(star.x, star.y - 4);
        starContext.lineTo(star.x, star.y + 4);
        starContext.stroke();
      }
    }
  };
  const animate = time => {
    if (document.hidden || reducedMotion.matches) return;
    if (time - lastFrame > 45) { paintStars(time); lastFrame = time; }
    animationFrame = requestAnimationFrame(animate);
  };
  const restartSky = () => {
    cancelAnimationFrame(animationFrame);
    paintStars(0);
    if (!document.hidden && !reducedMotion.matches) animationFrame = requestAnimationFrame(animate);
  };
  const resizeSky = () => {
    skyWidth = innerWidth;
    skyHeight = innerHeight;
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    starCanvas.width = Math.round(skyWidth * ratio);
    starCanvas.height = Math.round(skyHeight * ratio);
    starContext.setTransform(ratio, 0, 0, ratio, 0, 0);
    let seed = 7129;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    stars = Array.from({ length: Math.min(110, Math.round(skyWidth * skyHeight / 10000)) }, () => ({
      x: random() * skyWidth, y: random() * skyHeight,
      radius: .35 + random() ** 4 * 1.1, alpha: .25 + random() * .6, phase: random() * Math.PI * 2,
    }));
    restartSky();
  };
  window.addEventListener('resize', resizeSky, { passive: true });
  document.addEventListener('visibilitychange', restartSky);
  reducedMotion.addEventListener('change', restartSky);
  resizeSky();
}
