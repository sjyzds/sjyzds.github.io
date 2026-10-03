// Original conceptual illustrations, not manuscript figures.
const moons = [
  { color: 'moon-fill', glow: '#e7b1ff', radius: 7, rx: 215, ry: 61, tilt: -28, period: 26000, phase: -.5 },
  { color: 'moon-ice', glow: '#8df0ff', radius: 5, rx: 215, ry: 61, tilt: -28, period: 38000, phase: 2.1 },
  { color: 'moon-gold', glow: '#ffd0a2', radius: 9, rx: 222, ry: 143, tilt: 18, period: 47000, phase: 3.5, ring: true },
  { color: 'moon-blue', glow: '#99baff', radius: 6, rx: 176, ry: 167, tilt: -35, period: 56000, phase: 1.28 },
];
const moonArtwork = moon => {
  const tilt = moon.tilt * Math.PI / 180;
  const x = moon.rx * Math.cos(moon.phase), y = moon.ry * Math.sin(moon.phase);
  const depth = (Math.sin(moon.phase) + 1) / 2;
  return `<g class="orbiting-moon" data-orbit-rx="${moon.rx}" data-orbit-ry="${moon.ry}" data-orbit-tilt="${moon.tilt}" data-orbit-period="${moon.period}" data-orbit-phase="${moon.phase}" transform="translate(${250+x*Math.cos(tilt)-y*Math.sin(tilt)} ${246+x*Math.sin(tilt)+y*Math.cos(tilt)}) scale(${.78+depth*.32})" opacity="${.55+depth*.45}">
    <circle r="${moon.radius+7}" fill="${moon.glow}" opacity=".2" filter="url(#planet-soft-glow)"/>
    <circle r="${moon.radius}" fill="url(#${moon.color})"/>
    ${moon.ring ? `<ellipse rx="17" ry="4.5" transform="rotate(-24)" stroke="#f6d9b9" stroke-opacity=".65" stroke-width=".8"/>` : ''}
  </g>`;
};
export const heroArt = `<svg class="hero-art" viewBox="0 0 500 500" fill="none" aria-hidden="true">
  <defs>
    <radialGradient id="planet-body" cx=".26" cy=".19" r=".88">
      <stop stop-color="#d0fbff"/><stop offset=".19" stop-color="#62d7ef"/>
      <stop offset=".43" stop-color="#6b81ee"/><stop offset=".65" stop-color="#7140c8"/>
      <stop offset=".84" stop-color="#29225f"/><stop offset="1" stop-color="#090f29"/>
    </radialGradient>
    <radialGradient id="planet-shade" cx=".27" cy=".2" r=".85">
      <stop offset=".3" stop-color="#080d2c" stop-opacity="0"/>
      <stop offset=".65" stop-color="#100d30" stop-opacity=".05"/>
      <stop offset="1" stop-color="#05091d" stop-opacity=".88"/>
    </radialGradient>
    <radialGradient id="planet-halo"><stop offset=".64" stop-color="#7871f3" stop-opacity="0"/><stop offset=".79" stop-color="#8670f8" stop-opacity=".21"/><stop offset="1" stop-color="#49c5ef" stop-opacity="0"/></radialGradient>
    <linearGradient id="planet-cloud" x1="140" y1="130" x2="360" y2="350" gradientUnits="userSpaceOnUse"><stop stop-color="#a6f8ff"/><stop offset=".42" stop-color="#9eafff"/><stop offset=".72" stop-color="#db99ff"/><stop offset="1" stop-color="#5f50cb"/></linearGradient>
    <linearGradient id="planet-rim" x1="155" y1="147" x2="340" y2="360" gradientUnits="userSpaceOnUse"><stop stop-color="#c4fcff"/><stop offset=".36" stop-color="#73baff" stop-opacity=".5"/><stop offset=".7" stop-color="#a175f5" stop-opacity=".15"/><stop offset="1" stop-color="#bf83ff" stop-opacity=".6"/></linearGradient>
    <linearGradient id="planet-ring" x1="35" y1="215" x2="470" y2="288" gradientUnits="userSpaceOnUse"><stop stop-color="#7ac9ff" stop-opacity=".15"/><stop offset=".25" stop-color="#96f2ff"/><stop offset=".58" stop-color="#a3a3ff"/><stop offset=".84" stop-color="#e1b2ff"/><stop offset="1" stop-color="#9f80f5" stop-opacity=".1"/></linearGradient>
    <radialGradient id="moon-fill" cx=".3" cy=".25"><stop stop-color="#fff1de"/><stop offset=".45" stop-color="#f2baff"/><stop offset="1" stop-color="#7553c1"/></radialGradient>
    <radialGradient id="moon-ice" cx=".25" cy=".2" r=".8"><stop stop-color="#e1ffff"/><stop offset=".4" stop-color="#79e3e7"/><stop offset="1" stop-color="#245d91"/></radialGradient>
    <radialGradient id="moon-gold" cx=".25" cy=".2" r=".8"><stop stop-color="#fff2ce"/><stop offset=".4" stop-color="#dfa472"/><stop offset="1" stop-color="#563150"/></radialGradient>
    <radialGradient id="moon-blue" cx=".25" cy=".2" r=".8"><stop stop-color="#d9eaff"/><stop offset=".4" stop-color="#829be5"/><stop offset="1" stop-color="#36316c"/></radialGradient>
    <filter id="planet-soft-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
    <clipPath id="planet-clip"><circle cx="250" cy="246" r="122"/></clipPath>
  </defs>
  <circle cx="250" cy="246" r="177" fill="url(#planet-halo)"/>
  <g class="planet-system">
    <ellipse cx="250" cy="246" rx="222" ry="143" transform="rotate(18 250 246)" stroke="#aca8ed" stroke-width=".6" stroke-opacity=".13" stroke-dasharray="1 8"/>
    <g transform="rotate(-28 250 246)">
      <path d="M35 246a215 61 0 0 1 430 0" stroke="url(#planet-ring)" stroke-width="13" opacity=".1"/>
      <path d="M35 246a215 61 0 0 1 430 0" stroke="url(#planet-ring)" stroke-width="2" opacity=".55"/>
      <path d="M22 246a228 71 0 0 1 456 0" stroke="#a7b8ff" stroke-width=".7" opacity=".2"/>
    </g>
    <g data-orbit-layer="back">${moons.filter(moon => Math.sin(moon.phase) < 0).map(moonArtwork).join('')}</g>
    <circle cx="250" cy="246" r="123" stroke="#8399ff" stroke-width="8" opacity=".22" filter="url(#planet-soft-glow)"/>
    <circle cx="250" cy="246" r="122" fill="url(#planet-body)"/>
    <g clip-path="url(#planet-clip)">
      <g transform="rotate(-27 250 246)">
        <path d="M109 154c75-20 115 23 168 19s80-24 124-10v22c-49-9-77 22-129 14s-96-36-163-20Z" fill="url(#planet-cloud)" opacity=".54"/>
        <path d="M110 190c63-15 105 26 150 18s83-13 138 6" stroke="#cff9ff" stroke-width="3" opacity=".33"/>
        <path d="M105 220c64-28 109 15 158 12s103-34 138-9v27c-43-24-87 6-132 3s-104-36-164-12Z" fill="url(#planet-cloud)" opacity=".46"/>
        <path d="M112 253c59-21 92 0 142 12s106-12 151-4" stroke="#302783" stroke-width="12" opacity=".3"/>
        <path d="M117 267c65-27 102 34 154 13s92-21 134-1" stroke="url(#planet-cloud)" stroke-width="7" opacity=".7"/>
        <path d="M121 291c53-20 107 17 150 10s82-18 121-1v24c-55-17-90 10-137-3s-83-16-134-4Z" fill="url(#planet-cloud)" opacity=".45"/>
        <path d="M148 332c72-23 127 36 220 1" stroke="#c094ff" stroke-width="4" opacity=".33"/>
        <path d="M162 148c34-5 55 9 78 11M138 225c41-9 67 9 83 10M286 290c19-3 37-11 57-10" stroke="#e1fbff" stroke-width="1.5" stroke-linecap="round" opacity=".48"/>
      </g>
      <circle cx="250" cy="246" r="122" fill="url(#planet-shade)"/>
    </g>
    <circle cx="250" cy="246" r="122" stroke="url(#planet-rim)" stroke-width="1.5"/>
    <g transform="rotate(-28 250 246)">
      <path d="M35 246a215 61 0 0 0 430 0" stroke="url(#planet-ring)" stroke-width="12" opacity=".16"/>
      <path d="M35 246a215 61 0 0 0 430 0" stroke="url(#planet-ring)" stroke-width="4" opacity=".65"/>
      <path d="M35 246a215 61 0 0 0 430 0" stroke="url(#planet-ring)" stroke-width="1.3"/>
      <path d="M22 246a228 71 0 0 0 456 0" stroke="url(#planet-ring)" stroke-width=".7" opacity=".45"/>
    </g>
    <g data-orbit-layer="front">${moons.filter(moon => Math.sin(moon.phase) >= 0).map(moonArtwork).join('')}</g>
  </g>
  <g stroke-linecap="round">
    <path class="planet-star" d="M114 103v14m-7-7h14" stroke="#b9e8ff" stroke-width="1.2"/>
    <path class="planet-star planet-star-late" d="M388 355v10m-5-5h10" stroke="#d6bfff"/>
    <circle cx="87" cy="285" r="1.6" fill="#d5edff"/><circle cx="327" cy="83" r="1.2" fill="#c9bdff"/><circle cx="192" cy="411" r="1.2" fill="#c9ddff"/>
  </g>
</svg>`;

const visualFeatures = Array.from({ length: 36 }, (_, i) => {
  const selected = [8, 9, 14, 15, 20, 21, 27].includes(i);
  return `<rect class="${selected ? 'vision-feature' : ''}" x="${(i % 6) * 22}" y="${Math.floor(i / 6) * 22}" width="17" height="17" rx="3" fill="${selected ? 'url(#vision-active)' : '#2a4367'}" opacity="${selected ? 1 : .65}" style="--i:${i}"/>`;
}).join('');

const actionArt = `<svg class="action-art" viewBox="0 0 560 240" fill="none" aria-hidden="true">
  <defs>
    <pattern id="vision-grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0v28" stroke="#719ed8" stroke-opacity=".09"/></pattern>
    <radialGradient id="vision-halo"><stop stop-color="#319ebb" stop-opacity=".2"/><stop offset="1" stop-color="#142545" stop-opacity="0"/></radialGradient>
    <linearGradient id="vision-active" x2="1" y2="1"><stop stop-color="#a0f3ed"/><stop offset="1" stop-color="#4c95e1"/></linearGradient>
    <linearGradient id="robot-metal" x1="350" y1="80" x2="435" y2="185" gradientUnits="userSpaceOnUse"><stop stop-color="#e0f5ff"/><stop offset=".45" stop-color="#86b4de"/><stop offset="1" stop-color="#4e74b3"/></linearGradient>
    <linearGradient id="robot-base" x2="0" y2="1"><stop stop-color="#7c9cca"/><stop offset="1" stop-color="#253c62"/></linearGradient>
  </defs>
  <rect width="560" height="240" fill="#0b1425"/><rect width="560" height="240" fill="url(#vision-grid)"/>
  <ellipse cx="394" cy="132" rx="160" ry="122" fill="url(#vision-halo)"/>
  <g transform="translate(54 46) rotate(-7 64 64)">
    <rect x="-11" y="-11" width="149" height="149" rx="13" fill="#172943" fill-opacity=".4" stroke="#6da8d5" stroke-opacity=".23"/>
    ${visualFeatures}
    <path d="M39 24v-6h50v6m0 72v8H39v-8" stroke="#bcf9fc" stroke-width="1.5"/>
  </g>
  <path d="M208 117h105" stroke="#81bcdf" stroke-opacity=".2"/>
  <path class="signal-path" d="M208 117h105" stroke="#8de5ee" stroke-width="1.7" stroke-dasharray="3 9"/>
  <path d="m307 112 6 5-6 5" stroke="#9bd5e9" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="233" y="98" width="56" height="37" rx="8" fill="#142b45" stroke="#719cc8" stroke-opacity=".5"/>
  <path d="m244 119 7-7 7 10 8-13 11 8" stroke="#8bdde9" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
  <g class="robot-scene">
    <ellipse cx="413" cy="190" rx="95" ry="15" fill="#24466a" fill-opacity=".22"/><ellipse cx="413" cy="190" rx="95" ry="15" stroke="#5684b3" stroke-opacity=".3"/>
    <path d="M338 190h157" stroke="#527ea5" stroke-opacity=".3"/>
    <path d="m361 185 10-18h40l10 18v7h-60Z" fill="url(#robot-base)" stroke="#b5d9f2" stroke-opacity=".45"/>
    <rect x="379" y="157" width="25" height="24" rx="6" fill="#3a608c" stroke="#83b9db"/>
    <g class="robot-arm">
      <path d="m391 165-44-49 42-37" stroke="#14253f" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="m391 165-44-49 42-37" stroke="url(#robot-metal)" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="m389 159-35-40m1-10 28-25" stroke="#d7f6ff" stroke-opacity=".6" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="391" cy="165" r="12" fill="#28466c" stroke="#a5d5ed" stroke-width="2"/><circle cx="391" cy="165" r="4" fill="#9eeaf0"/>
      <circle cx="347" cy="116" r="13" fill="#294d76" stroke="#b6e1f3" stroke-width="2"/><circle cx="347" cy="116" r="5" fill="#7fbedb"/>
      <g class="robot-wrist">
        <path d="m389 79 43 28" stroke="#152a43" stroke-width="19" stroke-linecap="round"/><path d="m389 79 43 28" stroke="url(#robot-metal)" stroke-width="13" stroke-linecap="round"/>
        <path d="m398 83 28 18" stroke="#d9f8ff" stroke-width="2" opacity=".65" stroke-linecap="round"/>
        <circle cx="389" cy="79" r="10" fill="#2d5077" stroke="#b4e6f3" stroke-width="2"/><circle cx="389" cy="79" r="3.5" fill="#9bedea"/>
        <g transform="rotate(32 432 107)"><rect x="427" y="103" width="15" height="11" rx="3" fill="#a1d0e7"/><path d="M438 102h12l5 7m-17 7h12l5-7" stroke="#92dbea" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>
      </g>
    </g>
    <g class="robot-target"><ellipse cx="465" cy="178" rx="24" ry="8" stroke="#66ddde" stroke-dasharray="2 5" opacity=".55"/><path d="m450 154 15-9 15 9v18l-15 9-15-9Z" fill="#226076" stroke="#90eeed" stroke-opacity=".7"/><path d="m450 154 15 9 15-9-15-9Z" fill="#87e3e0"/><path d="M465 163v18l15-9v-18Z" fill="#439bba"/></g>
  </g>
  <g class="diagram-label" text-anchor="middle"><text x="119" y="218">VISUAL CUES</text><text x="261" y="157">ACTION</text><text x="411" y="218">ROBOTIC CONTROL</text></g>
</svg>`;

const waveform = Array.from({ length: 15 }, (_, i) => {
  const h = 13 + Math.sin(i * 1.18) ** 2 * 46;
  return `<rect class="sound-bar" x="${455 + i * 4.4}" y="${124 - h / 2}" width="2.8" height="${h}" rx="1.4" fill="${i > 3 && i < 11 ? '#e0b7ff' : '#8572b1'}" style="--i:${i}"/>`;
}).join('');

const audioArt = `<svg class="audio-art" viewBox="0 0 560 240" fill="none" aria-hidden="true">
  <defs>
    <pattern id="sound-grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0v28" stroke="#aa87d3" stroke-opacity=".09"/></pattern>
    <radialGradient id="audio-halo"><stop stop-color="#8850cf" stop-opacity=".23"/><stop offset="1" stop-color="#20142e" stop-opacity="0"/></radialGradient>
    <linearGradient id="selector-fill" x2="1" y2="1"><stop stop-color="#47356a"/><stop offset="1" stop-color="#252340"/></linearGradient>
    <linearGradient id="generator-fill" x2="1" y2="1"><stop stop-color="#513b78"/><stop offset="1" stop-color="#302343"/></linearGradient>
    <linearGradient id="audio-flow" x1="120" y1="124" x2="446" y2="124" gradientUnits="userSpaceOnUse"><stop stop-color="#8da8ec"/><stop offset="1" stop-color="#e0afff"/></linearGradient>
  </defs>
  <rect width="560" height="240" fill="#171126"/><rect width="560" height="240" fill="url(#sound-grid)"/>
  <ellipse cx="321" cy="124" rx="235" ry="114" fill="url(#audio-halo)"/>
  <g class="video-frames">
    <rect x="41" y="40" width="83" height="59" rx="7" fill="#241d3a" stroke="#68598e" opacity=".65"/>
    <rect x="35" y="46" width="83" height="59" rx="7" fill="#292342" stroke="#8873af" opacity=".85"/>
    <rect x="29" y="52" width="83" height="59" rx="7" fill="#292a48" stroke="#b0a3d6"/>
    <path d="m39 99 17-18 13 11 14-19 19 26" stroke="#8397c5" stroke-width="1.2"/><circle cx="88" cy="67" r="4" fill="#a8bce4"/>
    <rect x="45" y="70" width="28" height="29" rx="4" fill="#9cbfd9" fill-opacity=".13" stroke="#b9d5ef" stroke-dasharray="3 3"/><path d="m55 79 8 5-8 5Z" fill="#d1def6"/>
  </g>
  <g class="diagram-label" text-anchor="middle"><text x="73" y="132">VIDEO</text></g>
  <rect x="29" y="160" width="99" height="33" rx="8" fill="#34233f" stroke="#af89c6" stroke-opacity=".6"/>
  <path d="M42 170h10m-5 0v12m-3 0h6" stroke="#d9b5e6" stroke-width="1.2" stroke-linecap="round"/>
  <text class="diagram-text" x="60" y="181" fill="#ddc9ef">Prompt</text>
  <g stroke="url(#audio-flow)" stroke-width="1.4">
    <path d="M120 82h24q12 0 12 12v15q0 10 12 10h12M128 177h16q12 0 12-12v-26q0-10 12-10h12" stroke-opacity=".25"/>
    <path class="signal-path" d="M120 82h24q12 0 12 12v15q0 10 12 10h12M128 177h16q12 0 12-12v-26q0-10 12-10h12" stroke-dasharray="3 7"/>
    <path class="signal-path" d="M284 124h39M421 124h25" stroke-dasharray="3 7"/>
    <path d="m174 115 6 4-6 4m0 2 6 4-6 4M317 120l6 4-6 4M440 120l6 4-6 4" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <g class="focus-selector">
    <rect x="180" y="78" width="104" height="92" rx="14" fill="url(#selector-fill)" stroke="#a793da" stroke-opacity=".75"/>
    <g transform="translate(218 94)">${Array.from({length:9},(_,i)=>`<rect class="${[1,4,5].includes(i)?'focus-cell':''}" x="${(i%3)*10}" y="${Math.floor(i/3)*10}" width="7" height="7" rx="1.5" fill="${[1,4,5].includes(i)?'#d0c6ff':'#6f648b'}"/>`).join('')}</g>
    <text class="diagram-text" text-anchor="middle" x="232" y="145" fill="#eee5ff">Focus</text><text class="diagram-text" text-anchor="middle" x="232" y="158" fill="#b5a6d7">Selector</text>
  </g>
  <g class="audio-generator">
    <rect x="323" y="78" width="98" height="92" rx="14" fill="url(#generator-fill)" stroke="#c39be1" stroke-opacity=".75"/>
    <path d="m350 109 22-11 22 11-22 12Z" fill="#745b9b" stroke="#d2afe9" stroke-width=".8"/>
    <path d="m350 103 22-11 22 11-22 12Z" fill="#9573bb" stroke="#dfbaff" stroke-width=".8"/>
    <path d="m350 97 22-11 22 11-22 12Z" fill="#c2a1e8" stroke="#e3c4ff" stroke-width=".8"/>
    <text class="diagram-text" text-anchor="middle" x="372" y="145" fill="#f3e1ff">V2A</text><text class="diagram-text" text-anchor="middle" x="372" y="158" fill="#c6afd9">Generator</text>
  </g>
  <rect x="447" y="80" width="77" height="88" rx="38" fill="#b28aec" fill-opacity=".07"/>
  <path d="M451 124h69" stroke="#b28aec" stroke-opacity=".2"/>
  ${waveform}
  <path d="M450 94v-9h10m58 9v-9h-10M450 154v9h10m58-9v9h-10" stroke="#c8a3ed" stroke-width="1.2"/>
  <g class="diagram-label" text-anchor="middle"><text x="299" y="209">TARGET-FOCUSED GENERATION</text><text x="485" y="188">AUDIO</text></g>
</svg>`;

export const researchArt = index => index === 0 ? actionArt : audioArt;
