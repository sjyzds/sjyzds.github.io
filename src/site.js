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
matchMedia('(min-width:801px)').addEventListener('change', closeMenu);

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

// The nebula and SVG planets remain visible without JavaScript.
// One capped animation loop drives the sky and the small orbiting planets.
const starCanvas = document.querySelector('#starfield');
const starContext = starCanvas?.getContext('2d');
if (starContext) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let stars = [];
  let skyWidth = 0;
  let skyHeight = 0;
  let animationFrame = 0;
  let lastFrame = 0;
  let skyTime = 0;
  let nextMeteor = 1000;
  let meteors = [];
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('pointermove', event => {
      pointer.targetX = (event.clientX / Math.max(skyWidth, 1) - .5) * 2;
      pointer.targetY = (event.clientY / Math.max(skyHeight, 1) - .5) * 2;
    }, { passive: true });
    window.addEventListener('pointerout', event => {
      if (!event.relatedTarget) { pointer.targetX = 0; pointer.targetY = 0; }
    }, { passive: true });
    window.addEventListener('blur', () => { pointer.targetX = 0; pointer.targetY = 0; });
  }
  const backOrbit = document.querySelector('[data-orbit-layer="back"]');
  const frontOrbit = document.querySelector('[data-orbit-layer="front"]');
  const moons = [...document.querySelectorAll('.orbiting-moon')].map(element => ({
    element,
    rx: Number(element.dataset.orbitRx), ry: Number(element.dataset.orbitRy),
    tilt: Number(element.dataset.orbitTilt) * Math.PI / 180,
    period: Number(element.dataset.orbitPeriod), phase: Number(element.dataset.orbitPhase),
  }));
  const moveMoons = time => {
    if (!backOrbit || !frontOrbit) return;
    for (const moon of moons) {
      const angle = moon.phase + time / moon.period * Math.PI * 2;
      const depth = (Math.sin(angle) + 1) / 2;
      const x = moon.rx * Math.cos(angle), y = moon.ry * Math.sin(angle);
      const px = 250 + x * Math.cos(moon.tilt) - y * Math.sin(moon.tilt);
      const py = 246 + x * Math.sin(moon.tilt) + y * Math.cos(moon.tilt);
      const layer = Math.sin(angle) < 0 ? backOrbit : frontOrbit;
      if (moon.element.parentNode !== layer) layer.appendChild(moon.element);
      moon.element.setAttribute('transform', `translate(${px.toFixed(2)} ${py.toFixed(2)}) scale(${(.78 + depth * .32).toFixed(3)})`);
      moon.element.setAttribute('opacity', (.55 + depth * .45).toFixed(3));
    }
  };
  const paintMeteors = time => {
    if (reducedMotion.matches) return;
    if (time >= nextMeteor) {
      // Keep each pass short, with quiet intervals between shooting stars.
      if (meteors.length < 2) meteors.push({
        start: time, duration: 1200 + Math.random() * 600,
        x: skyWidth * (.38 + Math.random() * .6),
        y: skyHeight * (.04 + Math.random() * .38),
        distance: Math.min(skyWidth * .65, 560),
        tail: Math.min(skyWidth * .23, 145),
      });
      nextMeteor = time + 3600 + Math.random() * 4400;
    }
    meteors = meteors.filter(meteor => time - meteor.start < meteor.duration);
    for (const meteor of meteors) {
      const progress = (time - meteor.start) / meteor.duration;
      const brightness = Math.sin(progress * Math.PI) * .8;
      const x = meteor.x - progress * meteor.distance;
      const y = meteor.y + progress * meteor.distance * .48;
      const tail = meteor.tail * Math.min(progress * 5, 1);
      const gradient = starContext.createLinearGradient(x + tail, y - tail * .48, x, y);
      gradient.addColorStop(0, 'rgba(142,177,255,0)');
      gradient.addColorStop(.65, `rgba(174,193,255,${brightness * .3})`);
      gradient.addColorStop(1, `rgba(226,238,255,${brightness})`);
      starContext.strokeStyle = gradient;
      starContext.lineCap = 'round';
      starContext.beginPath();
      starContext.moveTo(x + tail, y - tail * .48);
      starContext.lineTo(x, y);
      starContext.globalAlpha = .16;
      starContext.lineWidth = 5;
      starContext.stroke();
      starContext.globalAlpha = 1;
      starContext.lineWidth = 1.3;
      starContext.stroke();
      const halo = starContext.createRadialGradient(x, y, 0, x, y, 9);
      halo.addColorStop(0, `rgba(196,219,255,${brightness * .5})`);
      halo.addColorStop(1, 'rgba(168,193,255,0)');
      starContext.fillStyle = halo;
      starContext.beginPath();
      starContext.arc(x, y, 9, 0, Math.PI * 2);
      starContext.fill();
      starContext.fillStyle = `rgba(241,247,255,${brightness})`;
      starContext.beginPath();
      starContext.arc(x, y, 1.6, 0, Math.PI * 2);
      starContext.fill();
    }
  };
  const paintStars = time => {
    starContext.clearRect(0, 0, skyWidth, skyHeight);
    pointer.x += (pointer.targetX - pointer.x) * .045;
    pointer.y += (pointer.targetY - pointer.y) * .045;
    for (const star of stars) {
      const moving = !reducedMotion.matches;
      const glow = moving ? .53 + .25 * Math.sin(time * (.00025 + star.depth * .00018) + star.phase) : .6;
      const x = star.x + (moving ? Math.sin(time * .00004 + star.phase) * star.depth * 5 + pointer.x * star.depth * 12 : 0);
      const y = star.y + (moving ? Math.cos(time * .00003 + star.phase) * star.depth * 4 + pointer.y * star.depth * 8 : 0);
      if (star.radius > 1.2) {
        const halo = starContext.createRadialGradient(x, y, 0, x, y, 7);
        halo.addColorStop(0, `rgba(${star.color},${glow * .2})`);
        halo.addColorStop(1, `rgba(${star.color},0)`);
        starContext.fillStyle = halo;
        starContext.beginPath();
        starContext.arc(x, y, 7, 0, Math.PI * 2);
        starContext.fill();
      }
      starContext.fillStyle = `rgba(${star.color},${glow * star.alpha})`;
      starContext.beginPath();
      starContext.arc(x, y, star.radius, 0, Math.PI * 2);
      starContext.fill();
      if (star.radius > 1) {
        starContext.strokeStyle = `rgba(189,209,255,${glow * .22})`;
        starContext.lineWidth = .6;
        starContext.beginPath();
        starContext.moveTo(x - 4, y);
        starContext.lineTo(x + 4, y);
        starContext.moveTo(x, y - 4);
        starContext.lineTo(x, y + 4);
        starContext.stroke();
      }
    }
    paintMeteors(time);
    moveMoons(time);
  };
  const animate = time => {
    if (document.hidden || reducedMotion.matches) return;
    if (!lastFrame) lastFrame = time;
    if (time - lastFrame >= 32) {
      skyTime += Math.min(time - lastFrame, 100);
      paintStars(skyTime);
      lastFrame = time;
    }
    animationFrame = requestAnimationFrame(animate);
  };
  const restartSky = () => {
    cancelAnimationFrame(animationFrame);
    document.documentElement?.classList.toggle('sky-paused', document.hidden);
    lastFrame = 0;
    paintStars(skyTime);
    if (!document.hidden && !reducedMotion.matches) animationFrame = requestAnimationFrame(animate);
  };
  const resizeSky = () => {
    skyWidth = innerWidth;
    skyHeight = innerHeight;
    meteors = [];
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    starCanvas.width = Math.round(skyWidth * ratio);
    starCanvas.height = Math.round(skyHeight * ratio);
    starContext.setTransform(ratio, 0, 0, ratio, 0, 0);
    let seed = 7129;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const starColors = ['203,221,255', '203,221,255', '184,227,239', '225,203,255', '244,224,203'];
    stars = Array.from({ length: Math.min(160, Math.round(skyWidth * skyHeight / 8500)) }, () => ({
      x: random() * skyWidth, y: random() * skyHeight,
      radius: .35 + random() ** 4 * 1.35, alpha: .3 + random() * .65, phase: random() * Math.PI * 2,
      depth: .2 + random() * .8, color: starColors[Math.floor(random() * starColors.length)],
    }));
    restartSky();
  };
  window.addEventListener('resize', resizeSky, { passive: true });
  document.addEventListener('visibilitychange', restartSky);
  reducedMotion.addEventListener('change', restartSky);
  resizeSky();
}
