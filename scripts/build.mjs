import { readFile, writeFile, mkdir, copyFile, cp, stat, readdir, rm, lstat } from 'node:fs/promises';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { icon, heroArt, researchArt } from './illustrations.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const p = JSON.parse(await readFile(resolve(root, 'content/profile.json'), 'utf8'));
const out = resolve(root, 'dist');
async function checkPublicFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) throw new Error('Public assets must not be symbolic links.');
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await checkPublicFiles(path);
    else if (/\.(pdf|docx?)$/i.test(entry.name)) throw new Error('The owner permits paper introductions only. Do not publish document files.');
  }
}
await checkPublicFiles(resolve(root, 'public'));
// Only clean this project's generated directory; removed assets must not survive a rebuild.
if (relative(root, out) !== 'dist' || dirname(out) !== root) throw new Error('Unsafe output directory.');
const outputInfo = await lstat(out).catch(error => { if (error.code !== 'ENOENT') throw error; });
if (outputInfo?.isSymbolicLink()) throw new Error('Output directory must not be a symbolic link.');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
const esc = (value = '') => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const asset = value => {
  if (!/^[a-zA-Z0-9_./-]+$/.test(value) || value.startsWith('/') || value.split('/').includes('..')) throw new Error(`Invalid asset: ${value}`);
  return value;
};
const url = value => {
  const parsed = new URL(value);
  if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error(`Invalid URL: ${value}`);
  return esc(parsed.href);
};
if (!p.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) throw new Error('A name and valid contact email are required.');
const email = `mailto:${encodeURIComponent(p.email).replace(/%40/g, '@')}`;
const externalLink = (href, content, cls = '') => `<a href="${url(href)}" class="${cls}" target="_blank" rel="noopener noreferrer">${content}</a>`;
const tags = values => `<ul class="tags">${values.map(value => `<li>${esc(value)}</li>`).join('')}</ul>`;
const researchItems = p.research || [];
const sections = [{ id: 'about', label: 'About' }, { id: 'research', label: 'Research' }, { id: 'background', label: 'Background' }, { id: 'projects', label: 'Projects' }];
const heading = (number, label, title, id, intro = '') => `<div class="section-heading"><div><p class="eyebrow"><span>${number}</span> ${label}</p><h2 id="${id}">${title}</h2></div>${intro ? `<p class="section-intro">${esc(intro)}</p>` : ''}</div>`;
const research = `<section class="section research" id="research" aria-labelledby="research-title">${heading('01', 'Selected research', 'Ideas in motion.', 'research-title', p.researchIntro)}<div class="research-grid">${researchItems.map((item, i) => `<article class="research-card"><div class="research-visual visual-${i}"><div class="visual-label"><span>${esc(item.topic.split(' · ')[0])}</span><span>${String(i+1).padStart(2, '0')}</span></div>${researchArt(i)}<span class="visual-caption">${esc(item.topic.split(' · ')[1] || item.topic)}</span></div><div class="research-body"><p class="research-category">${i === 0 ? 'Embodied intelligence' : 'Multimodal generation'}</p><h3>${esc(item.title)}</h3><p class="research-summary">${esc(item.summary)}</p><div class="research-footer"><span class="status-dot" aria-hidden="true"></span>${esc(item.status)}</div></div></article>`).join('')}</div></section>`;
const education = p.education.map((entry, i) => `<article class="education-entry"><div class="school-mark" aria-hidden="true">${i === 0 ? 'NPU' : 'WTU'}</div><div><p class="dates">${esc(entry.dates)}</p><h4>${esc(entry.institution)}</h4><p class="degree">${esc(entry.title)}</p><p class="entry-description">${esc(entry.description)}</p></div></article>`).join('');
const experience = p.experience.map(entry => `<article class="experience-entry"><p class="current-label"><span class="status-dot" aria-hidden="true"></span>${esc(entry.dates)}</p><h4>${esc(entry.institution)}</h4><p class="degree">${esc(entry.title)}</p><p class="entry-description">${esc(entry.description)}</p><div class="experience-note">${icon('sun')}<span>Exploring how intelligent systems<br>understand and interact with the world.</span></div></article>`).join('');
const background = `<section class="section" id="background" aria-labelledby="background-title">${heading('02', 'Background', 'Learning. Exploring. Building.', 'background-title')}<div class="background-grid"><div><h3 class="column-title">Education</h3>${education}</div><div><h3 class="column-title">Research experience</h3>${experience}</div></div></section>`;
const projects = `<section class="section projects" id="projects" aria-labelledby="projects-title">${heading('03', 'Selected projects', 'From ideas to practice.', 'projects-title')}<div class="project-list">${p.projects.map((project, i) => `<article class="project"><span class="project-index" aria-hidden="true">0${i+1}</span><div class="project-name"><p class="project-label">${esc(project.label)}</p><h3>${esc(project.title)}</h3></div><div class="project-details"><p>${esc(project.description)}</p>${tags(project.tags)}</div></article>`).join('')}</div><div class="skills">${p.skills.map(s => `<div><h3>${esc(s.label)}</h3><p>${esc(s.items)}</p></div>`).join('')}</div></section>`;
const description = `${p.name}, ${p.role.toLowerCase()} at ${p.affiliation}. Research in embodied intelligence, vision-language-action models, and multimodal generation.`;
const versions = Object.fromEntries(await Promise.all(['styles.css', 'site.js'].map(async file => [file, createHash('sha256').update(await readFile(resolve(root, 'src', file))).digest('hex').slice(0, 10)])));
const favicon = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="#213e35"/><text x="32" y="43" font-family="Georgia,serif" font-size="31" fill="#e5edca" text-anchor="middle">JS</text></svg>`)}`;
const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.name)} | Embodied Intelligence & Multimodal Learning</title>
<meta name="description" content="${esc(description)}"><meta name="theme-color" content="#f7f7f2">
<link rel="canonical" href="${url(p.siteUrl)}"><link rel="icon" type="image/svg+xml" href="${favicon}">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(p.name)} | Academic Homepage"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url(p.siteUrl)}">
<link rel="preload" href="fonts/newsreader-400.ttf" as="font" type="font/ttf" crossorigin><link rel="preload" href="fonts/inter-400.ttf" as="font" type="font/ttf" crossorigin>
<link rel="stylesheet" href="styles.css?v=${versions['styles.css']}"><script src="site.js?v=${versions['site.js']}" defer></script>
</head><body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"><div class="header-inner page-width"><a class="wordmark" href="#about" aria-label="${esc(p.name)}, home"><span class="brand-symbol">${icon('sun')}</span>${esc(p.name)}<span class="brand-period">.</span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav"><span class="menu-text">Menu</span><span class="menu-lines" aria-hidden="true"></span></button><nav id="main-nav" aria-label="Main navigation">${sections.map((s,i) => `<a href="#${s.id}"${i === 0 ? ' aria-current="location"' : ''}>${s.label}</a>`).join('')}<a class="nav-contact" href="#contact">Let’s talk ${icon('diagonal')}</a></nav></div></header>
<main id="main">
<section class="hero page-width" id="about" aria-labelledby="page-title"><div class="hero-copy"><div class="identity"><img class="portrait" src="${esc(asset(p.avatar))}" alt="Portrait of ${esc(p.name)}" width="1280" height="1792" fetchpriority="high"><div><span class="identity-role">Master’s student & researcher</span><span class="identity-school">Northwestern Polytechnical University</span></div></div><div class="name-line"><h1 id="page-title">${esc(p.name)}<span>.</span></h1><span class="chinese-name" lang="zh-CN">${esc(p.chineseName)}</span></div><p class="hero-statement">Exploring intelligence,<br>from <em>perception</em> to <em>action.</em></p><p class="hero-bio">I study embodied intelligence and multimodal learning, with a focus on vision-language-action models and selective video-to-audio generation.</p><div class="hero-actions"><a class="button button-primary" href="#research">Explore my research ${icon('arrow')}</a>${externalLink(p.github, `${icon('github')}<span>GitHub</span>`, 'social-link')}<a class="social-link" href="${email}">${icon('mail')}<span>Email</span></a></div></div><div class="hero-canvas"><div class="canvas-topline"><span>Perception. Language. Action.</span>${icon('diagonal')}</div>${heroArt}<div class="canvas-bottomline"><span class="canvas-caption">Connecting the dots<br><strong>between vision & action.</strong></span><span class="canvas-symbol" aria-hidden="true">${icon('sun')}</span></div></div><div class="hero-foot"><div class="current-position"><span class="current-label"><span class="status-dot" aria-hidden="true"></span>Currently</span><span>Research Intern <span class="position-separator">/</span> <strong>State Grid AI Laboratory</strong></span></div><span class="hero-scroll" aria-hidden="true">Scroll to explore ${icon('arrow')}</span></div></section>
<div class="interest-strip"><div class="page-width"><span class="interest-label">Research interests</span>${p.researchInterests.map(item=>`<span class="interest-item">${esc(item)}</span>`).join('')}</div></div>
<div class="page-width">${research}${background}${projects}
<section class="contact-section" id="contact" aria-labelledby="contact-title"><div class="contact-decoration" aria-hidden="true">${icon('sun')}</div><p class="eyebrow">04 <span>Get in touch</span></p><div class="contact-layout"><div><h2 id="contact-title">Good research starts<br>with a conversation<span>.</span></h2><p>Let’s exchange ideas on embodied intelligence,<br class="desktop-break"> multimodal learning, and what comes next.</p></div><div class="contact-details"><a class="contact-email" href="${email}"><span>${esc(p.email)}</span>${icon('diagonal')}</a><div class="contact-links"><button type="button" class="copy-button" data-copy-email="${esc(p.email)}">${icon('copy')}<span>Copy email</span></button>${externalLink(p.github, `GitHub ${icon('diagonal')}`)}${p.scholar ? externalLink(p.scholar,`Google Scholar ${icon('diagonal')}`) : ''}</div><p class="copy-status" role="status" aria-live="polite"></p></div></div></section></div>
</main><footer class="site-footer page-width"><a class="footer-brand" href="#about">${icon('sun')} ${esc(p.name)}</a><span>© ${new Date().getUTCFullYear()} · Always learning.</span><a class="back-to-top" href="#about">Back to top ${icon('arrow')}</a></footer></body></html>`;
for (const file of [p.avatar, 'fonts/inter-400.ttf', 'fonts/inter-600.ttf', 'fonts/newsreader-400.ttf']) await stat(resolve(root, 'public', asset(file)));
await cp(resolve(root, 'public'), out, { recursive: true });
for (const file of ['styles.css', 'site.js']) await copyFile(resolve(root, 'src', file), resolve(out, file));
await writeFile(resolve(out, 'index.html'), html);
await writeFile(resolve(out, '.nojekyll'), '');
await writeFile(resolve(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${p.siteUrl}/sitemap.xml\n`);
await writeFile(resolve(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${esc(p.siteUrl)}/</loc></url></urlset>`);
console.log(`Built ${p.name}'s homepage with ${researchItems.length} paper introductions. No manuscripts published.`);
