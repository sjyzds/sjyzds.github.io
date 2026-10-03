import { readFile, writeFile, mkdir, copyFile, cp, stat, readdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const p = JSON.parse(await readFile(resolve(root, 'content/profile.json'), 'utf8'));
const out = resolve(root, 'dist');
async function checkPublicFiles(directory) {
  for (const entry of await readdir(directory, {withFileTypes:true})) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await checkPublicFiles(path);
    else if (/\.(pdf|docx?)$/i.test(entry.name)) throw new Error('Do not publish document files. The owner permits paper introductions only.');
  }
}
await checkPublicFiles(resolve(root, 'public'));
await mkdir(out, { recursive: true });
const esc = (value = '') => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const asset = value => {
  if (!/^[a-zA-Z0-9_./-]+$/.test(value) || value.startsWith('/') || value.split('/').includes('..')) throw new Error(`Invalid asset path: ${value}`);
  return value;
};
const url = value => {
  const parsed = new URL(value);
  if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error(`Invalid URL: ${value}`);
  return esc(parsed.href);
};
const external = ' target="_blank" rel="noopener noreferrer"';
const externalLink = (href, label, cls = '') => `<a href="${url(href)}" class="${cls}"${external}>${esc(label)}</a>`;
const pdfLink = (href, label, cls = '') => `<a href="${esc(asset(href))}" class="${cls}"${external}>${esc(label)}</a>`;
if (!p.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) throw new Error('A name and valid contact email are required.');
const email = `mailto:${encodeURIComponent(p.email).replace(/%40/g, '@')}`;
const researchItems = p.research || [];
const sections = [{id:'about', label:'About'}];
if (researchItems.length) sections.push({id:'research', label:'Research'});
if (p.education?.length || p.experience?.length) sections.push({id:'background', label:'Background'});
if (p.projects?.length) sections.push({id:'projects', label:'Projects'});
sections.push({id:'contact', label:'Contact'});
const sectionHeading = (number, title, id, intro = '') => `<div class="section-heading"><div class="section-title"><span class="section-number" aria-hidden="true">${number}</span><h2 id="${id}">${title}</h2></div>${intro ? `<p>${esc(intro)}</p>` : ''}</div>`;
const tags = values => `<ul class="tags">${values.map(value => `<li>${esc(value)}</li>`).join('')}</ul>`;
const research = researchItems.length ? `<section class="section research" id="research" aria-labelledby="research-title">${sectionHeading('01', 'Research', 'research-title', p.researchIntro)}<div class="paper-grid">${researchItems.map((item,index) => `<article class="research-card"><div class="research-card-label"><span>${esc(item.topic)}</span><span aria-hidden="true">0${index+1}</span></div><h3>${esc(item.title)}</h3><p class="research-card-summary">${esc(item.summary)}</p><p class="research-card-status">${esc(item.status)}</p></article>`).join('')}</div></section>` : '';
const timeline = records => `<div class="timeline">${records.map(r => `<article class="timeline-entry"><p class="dates">${esc(r.dates)}</p><h4>${esc(r.institution)}</h4><p class="degree">${esc(r.title)}</p>${r.description ? `<p class="entry-description">${esc(r.description)}</p>` : ''}</article>`).join('')}</div>`;
const background = p.education?.length || p.experience?.length ? `<section class="section" id="background" aria-labelledby="background-title">${sectionHeading('02','Background','background-title')}<div class="background-grid">${p.education?.length ? `<div><h3 class="column-title">Education</h3>${timeline(p.education)}</div>` : ''}${p.experience?.length ? `<div><h3 class="column-title">Research experience</h3>${timeline(p.experience)}</div>` : ''}</div></section>` : '';
const projects = p.projects?.length ? `<section class="section" id="projects" aria-labelledby="projects-title">${sectionHeading('03','Selected projects','projects-title')}<div class="project-list">${p.projects.map(project => `<article class="project"><div><p class="project-label">${esc(project.label)}</p><h3>${esc(project.title)}</h3></div><div><p>${esc(project.description)}</p>${tags(project.tags)}</div></article>`).join('')}</div>${p.skills?.length ? `<div class="skills" aria-label="Technical skills">${p.skills.map(s => `<div><h3>${esc(s.label)}</h3><p>${esc(s.items)}</p></div>`).join('')}</div>` : ''}</section>` : '';
const favicon = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="17" fill="#173c45"/><text x="32" y="43" font-family="Georgia,serif" font-size="32" fill="white" text-anchor="middle">${esc(p.initials)}</text></svg>`)}`;
const description = `${p.name}, ${p.role.toLowerCase()} at ${p.affiliation}. Research in embodied intelligence, vision-language-action models, and multimodal generation.`;
const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.name)} | Embodied Intelligence & Multimodal Learning</title>
<meta name="description" content="${esc(description)}"><meta name="theme-color" content="#f7f9f9">
<link rel="canonical" href="${url(p.siteUrl)}"><link rel="icon" type="image/svg+xml" href="${favicon}">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(p.name)} | Academic Homepage"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url(p.siteUrl)}">
<link rel="preload" href="fonts/newsreader-400.ttf" as="font" type="font/ttf" crossorigin><link rel="preload" href="fonts/inter-400.ttf" as="font" type="font/ttf" crossorigin>
<link rel="stylesheet" href="styles.css"><script src="site.js" defer></script></head><body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"><div class="header-inner"><a class="wordmark" href="#about" aria-label="${esc(p.name)}, home"><span class="monogram" aria-hidden="true">${esc(p.initials)}</span><span>${esc(p.name)}</span></a><nav aria-label="Main navigation">${sections.map(s => `<a href="#${s.id}">${s.label}</a>`).join('')}</nav></div></header>
<main id="main"><section class="hero page-width" id="about" aria-labelledby="page-title"><div class="hero-copy"><p class="eyebrow">Embodied intelligence & multimodal learning</p><div class="name-line"><h1 id="page-title">${esc(p.name)}</h1><span class="chinese-name" lang="zh-CN">${esc(p.chineseName)}</span></div><p class="affiliation">${esc(p.role)}<br><span>${esc(p.school)} · ${esc(p.affiliation)}</span></p><div class="biography">${p.about.map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}</div><div class="hero-actions"><a class="button button-primary" href="#research">Explore research</a>${p.cv ? pdfLink(p.cv,'Download CV','button button-outline') : externalLink(p.github,'GitHub','button button-outline')}<a class="plain-link" href="${email}">Email me</a></div></div><div class="portrait-column"><figure class="portrait-frame"><img src="${esc(asset(p.avatar))}" alt="Portrait of ${esc(p.name)}" width="1280" height="1792" fetchpriority="high"></figure><p class="portrait-caption">${esc(p.affiliation)}</p></div><div class="interests"><span class="interests-label">Research interests</span>${tags(p.researchInterests)}</div></section>
<div class="page-width">${research}${background}${projects}</div>
<section class="contact-section" id="contact" aria-labelledby="contact-title"><div class="contact-inner page-width"><div><p class="eyebrow">Contact</p><h2 id="contact-title">Let’s connect.</h2><p>For research correspondence, email is the best way to reach me.</p></div><div class="contact-details"><a class="contact-email" href="${email}">${esc(p.email)}</a><div class="contact-links"><button class="copy-button" type="button" data-copy-email="${esc(p.email)}" aria-label="Copy email address">Copy email</button>${externalLink(p.github,'GitHub')}${p.scholar ? externalLink(p.scholar,'Google Scholar') : ''}${p.cv ? pdfLink(p.cv,'Curriculum vitae') : ''}</div><p class="copy-status" role="status" aria-live="polite"></p></div></div></section></main>
<footer class="site-footer page-width"><span>© ${new Date().getUTCFullYear()} ${esc(p.name)}</span><span>Research · Learning · Building</span><a href="#about">Back to top</a></footer></body></html>`;
const required = [p.avatar,p.cv,'fonts/inter-400.ttf','fonts/inter-600.ttf','fonts/newsreader-400.ttf'].filter(Boolean);
for (const file of required) await stat(resolve(root,'public',asset(file)));
await cp(resolve(root,'public'),out,{recursive:true});
for (const file of ['styles.css','site.js']) await copyFile(resolve(root,'src',file),resolve(out,file));
await writeFile(resolve(out,'index.html'),html);
await writeFile(resolve(out,'.nojekyll'),'');
await writeFile(resolve(out,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${p.siteUrl}/sitemap.xml\n`);
await writeFile(resolve(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${esc(p.siteUrl)}/</loc></url></urlset>`);
console.log(`Built ${p.name}'s academic homepage with ${researchItems.length} research areas.`);
