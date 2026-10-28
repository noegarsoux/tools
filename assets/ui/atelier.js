/* Atelier — kit d'interface commun à tous les outils.
 *
 * Structure inspirée de Figma : barre du haut, scène au centre, panneau de propriétés à droite.
 * Un outil ne construit jamais sa propre interface : il décrit ses paramètres et le kit s'occupe
 * du rendu, des presets, de la graine, de l'animation, des formats, de la charte de marque
 * et des exports. Voir AGENTS.md.
 *
 *   const app = Atelier.app({
 *     stage: document.querySelector('canvas'),
 *     params: { 'Forme': { count: { type: 'range', label: 'Nombre', min: 1, max: 100, value: 20 } } },
 *     presets: { 'Calme': { count: 10 } },
 *     seed: true, animate: true, finish: true,
 *     pointer: { down(p) {}, drag(p) {}, move(p) {}, up(p) {}, wheel(p, dy) {} },
 *     export: { png: true, video: true, svg: () => '<svg…>' },
 *     onChange(key, value) {}, onResize({ w, h, dpr }) {},  // onResize : pas appelé à la création
 *   });
 *   app.loop((t, dt) => draw(t));
 */
(() => {
  const TYPES = {
    typography: 'Typographie', system: 'Langages visuels', shapes: 'Formes', pattern: 'Motifs',
    generative: 'Génératif', motion: 'Motion & vidéo', webgl: 'WebGL & 3D', filter: 'Filtres & image',
    gradient: 'Dégradés', color: 'Couleur', audio: 'Audio-réactif', utility: 'Utilitaires',
  };
  const FORMATS = {
    screen: { label: 'Écran' },
    '16:9': { label: '16:9', w: 1920, h: 1080 },
    '9:16': { label: '9:16', w: 1080, h: 1920 },
    '4:5': { label: '4:5', w: 1080, h: 1350 },
    '1:1': { label: '1:1', w: 1080, h: 1080 },
    custom: { label: 'Libre' },
  };
  const MAX_SIDE = 8192, MAX_AREA = 40e6;
  const LOGO_POS = { none: 'Aucun', tl: 'Haut gauche', tc: 'Haut centre', tr: 'Haut droite', cl: 'Milieu gauche', c: 'Centre', cr: 'Milieu droite', bl: 'Bas gauche', bc: 'Bas centre', br: 'Bas droite' };
  const FALLBACK_STOPS = ['#0b0b0f', '#3d2bff', '#ff4d1a', '#f4efe6'];
  const BRAND_KEY = 'atelier.brand.v1';
  const BRAND_FONT = 'AtelierBrand';
  // Palettes relevées sur le moodboard de Noé (references/moodboard.md). Fond d'abord, puis encres.
  const PALETTES = {
    chladni: { name: 'Chladni', colors: ['#050505', '#b4b4b4', '#f2f2f2'] },
    'gris-0006': { name: 'Gris 0006', colors: ['#aaa9a7', '#040404'] },
    papier: { name: 'Papier', colors: ['#fdfdfd', '#0f0f0f'] },
    'papier-60': { name: 'Papier 60', colors: ['#f4f4f2', '#27262b'] },
    'papier-gris': { name: 'Papier gris', colors: ['#ecebe8', '#2a2927', '#94928f'] },
    photocopie: { name: 'Photocopie', colors: ['#e3e4e6', '#1c191b', '#767478'] },
    'trame-nuit': { name: 'Trame nuit', colors: ['#131313', '#f5f5f5', '#828282'] },
    acide: { name: 'Acide', colors: ['#c3c3c2', '#1c1c17', '#d6ea3f', '#f2f2f0'] },
    menthe: { name: 'Menthe', colors: ['#dce8e5', '#191d1e', '#a4e0bc', '#4f9d7a'] },
    bitmap: { name: 'Bitmap', colors: ['#e3e0d6', '#1f1e1c', '#e8552b', '#4b6cf0', '#f4c53a'] },
    thermique: { name: 'Thermique', colors: ['#8ea79c', '#3b3bb3', '#e0622e', '#f2c06a', '#7a47b4', '#d1bde0'] },
    glyphes: { name: 'Glyphes', colors: ['#0a0a0a', '#f4f1ea', '#2f6b3a', '#e79ab5', '#e5502a', '#f2c230', '#3a6fd0'] },
    pyramides: { name: 'Pyramides', colors: ['#9b8f84', '#2e3b25', '#e0402f', '#e57d9e', '#c49a35', '#524e76', '#111111'] },
    code: { name: 'Code', colors: ['#d2c9c5', '#e07a2e', '#d49be0', '#2e7d32', '#e8b830', '#5b7fd6', '#1a1a1a'] },
    orbite: { name: 'Orbite', colors: ['#e05527', '#111111', '#f2f2f1'] },
    salon: { name: 'Salon', colors: ['#e5e3e0', '#0a0a0a', '#d6453b', '#5fae5c', '#f0e04a'] },
    'good-room': { name: 'Good Room', colors: ['#111111', '#6dbf45', '#e8782f', '#b07ad8', '#9db0ef'] },
    eventail: { name: 'Éventail', colors: ['#3b2a10', '#2f4fa8', '#a3a03a', '#c9401f', '#4c8a5a'] },
    biennale: { name: 'Biennale', colors: ['#f4f3f0', '#111111', '#e5452a', '#f2b0c8', '#f2e640'] },
    pixels: { name: 'Pixels', colors: ['#999899', '#42956e', '#d0453a', '#3c4fd0', '#a047ab', '#6fe0a0'] },
    kegelbahn: { name: 'Kegelbahn', colors: ['#060303', '#f272ba', '#486cfc', '#edd14b', '#297c26', '#ef5a2f'] },
    luzern: { name: 'Luzern', colors: ['#f25f03', '#7d38e7', '#b9a0e6', '#1a1410', '#ffffff'] },
  };

  const svg = (d) => `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICON = {
    play: svg('<path d="M5 3.5v9l7-4.5z" fill="currentColor" stroke="none"/>'),
    pause: svg('<path d="M5.5 3.5v9M10.5 3.5v9"/>'),
    dice: svg('<rect x="2.5" y="2.5" width="11" height="11" rx="2.5"/><circle cx="5.7" cy="5.7" r=".9" fill="currentColor"/><circle cx="10.3" cy="10.3" r=".9" fill="currentColor"/><circle cx="8" cy="8" r=".9" fill="currentColor"/>'),
    link: svg('<path d="M6.5 9.5l3-3"/><path d="M7 4.5l1.2-1.2a2.6 2.6 0 0 1 3.7 3.7L10.7 8.2M9 11.5l-1.2 1.2a2.6 2.6 0 0 1-3.7-3.7l1.2-1.2"/>'),
    shuffle: svg('<path d="M2.5 4.5h2.2c3.6 0 3.6 7 7.3 7h1.5M2.5 11.5h2.2c1.3 0 2.1-.9 2.8-2M10.5 6c.6-.9 1.4-1.5 2.5-1.5h1.5M12.5 2.5l2 2-2 2M12.5 9.5l2 2-2 2"/>'),
    theme: svg('<circle cx="8" cy="8" r="5.5"/><path d="M8 2.5v11A5.5 5.5 0 0 0 8 2.5z" fill="currentColor"/>'),
  };

  const el = (tag, attrs = {}, ...children) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') n.className = v;
      else if (k === 'html') n.innerHTML = v;
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? '' : v);
    }
    n.append(...children.filter((c) => c != null));
    return n;
  };

  // Générateur pseudo-aléatoire déterministe (mulberry32).
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const newSeed = () => 1 + Math.floor(Math.random() * 999999);
  const decimals = (step) => (String(step).split('.')[1] || '').length;
  const options = (o) => (Array.isArray(o) ? o.map((v) => (Array.isArray(v) ? v : [v, v])) : Object.entries(o));

  // ——— Couleur ———
  const hexRgb = (h) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const rgbHex = (r, g, b) => '#' + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
  const luma = (h) => { const [r, g, b] = hexRgb(h); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; };
  const parseHexList = (s) => (String(s).match(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b|\b[0-9a-f]{6}\b/gi) || []).map((h) => {
    h = h.replace('#', '').toLowerCase();
    return '#' + (h.length === 3 ? h.replace(/./g, (c) => c + c) : h);
  });
  // Table de 256 couleurs interpolées entre des arrêts répartis régulièrement.
  function rampLUT(stops) {
    const rgb = stops.map(hexRgb), lut = new Uint8ClampedArray(256 * 3);
    for (let i = 0; i < 256; i++) {
      const f = (i / 255) * (rgb.length - 1), k = Math.min(rgb.length - 2, Math.floor(f)), u = f - k;
      for (let c = 0; c < 3; c++) lut[i * 3 + c] = rgb[k][c] + (rgb[k + 1][c] - rgb[k][c]) * u;
    }
    return lut;
  }
  // Extrait n couleurs dominantes d'une image (k-moyennes sur une vignette).
  function extractPalette(img, n = 5) {
    const c = document.createElement('canvas'), s = 64;
    c.width = c.height = s;
    const x = c.getContext('2d', { willReadFrequently: true });
    x.drawImage(img, 0, 0, s, s);
    const d = x.getImageData(0, 0, s, s).data, px = [];
    for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 128) px.push([d[i], d[i + 1], d[i + 2]]);
    if (!px.length) return [];
    px.sort((a, b) => (a[0] * 2 + a[1] * 7 + a[2]) - (b[0] * 2 + b[1] * 7 + b[2]));
    let cent = Array.from({ length: n }, (_, i) => [...px[Math.floor((i + 0.5) / n * px.length)]]);
    for (let it = 0; it < 8; it++) {
      const sum = cent.map(() => [0, 0, 0, 0]);
      for (const p of px) {
        let best = 0, bd = Infinity;
        cent.forEach((q, j) => { const dd = (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 + (p[2] - q[2]) ** 2; if (dd < bd) { bd = dd; best = j; } });
        const sb = sum[best]; sb[0] += p[0]; sb[1] += p[1]; sb[2] += p[2]; sb[3]++;
      }
      cent = cent.map((q, j) => (sum[j][3] ? [sum[j][0] / sum[j][3], sum[j][1] / sum[j][3], sum[j][2] / sum[j][3]] : q));
    }
    return [...new Set(cent.map((q) => rgbHex(...q)))].sort((a, b) => luma(a) - luma(b));
  }

  // ——— ZIP sans compression (séquences d'images) ———
  const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  const crc32 = (u8) => { let c = 0xffffffff; for (let i = 0; i < u8.length; i++) c = CRC[(c ^ u8[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  function zip(files) { // files : [{ name, blob, crc, size }]
    const parts = [], central = [];
    let offset = 0;
    for (const f of files) {
      const name = new TextEncoder().encode(f.name);
      const h = new DataView(new ArrayBuffer(30));
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint32(14, f.crc, true);
      h.setUint32(18, f.size, true); h.setUint32(22, f.size, true); h.setUint16(26, name.length, true);
      parts.push(h, name, f.blob);
      const c = new DataView(new ArrayBuffer(46));
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint32(16, f.crc, true);
      c.setUint32(20, f.size, true); c.setUint32(24, f.size, true); c.setUint16(28, name.length, true); c.setUint32(42, offset, true);
      central.push(c, name);
      offset += 30 + name.length + f.size;
    }
    const cSize = central.reduce((s, p) => s + p.byteLength, 0);
    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true);
    end.setUint32(12, cSize, true); end.setUint32(16, offset, true);
    return new Blob([...parts, ...central, end], { type: 'application/zip' });
  }

  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
  };

  class App {
    constructor(opts) {
      this.opts = opts;
      this.params = {};
      this.specs = {};
      this.controls = {};
      this.thumbnail = new URLSearchParams(location.search).has('thumbnail');
      this.playing = !!opts.animate;
      this.speed = 1;
      this.time = 0;
      this.seed = typeof opts.seed === 'number' ? opts.seed : newSeed();
      this.random = rng(this.seed);
      this.size = { w: 0, h: 0, dpr: 1 };
      this.stage = opts.stage || el('canvas');
      this.canvas = this.stage instanceof HTMLCanvasElement ? this.stage : null;
      this.brand = this.loadBrand();

      opts.params = this.withKitParams(opts.params || {});
      for (const group of Object.values(opts.params)) {
        for (const [key, spec] of Object.entries(group)) {
          this.specs[key] = spec;
          if (spec.type !== 'button') this.params[key] = spec.value ?? (spec.type === 'toggle' ? false : null);
        }
      }
      this.defaults = structuredClone(Object.fromEntries(Object.entries(this.params).filter(([k]) => this.specs[k].type !== 'file')));
      const fromLink = this.readHash();
      if (!fromLink && this.brand.auto && this.brand.colors.length && !this.thumbnail) Object.assign(this.params, this.brandValues());
      this.pointer = { x: 0, y: 0, px: 0, py: 0, vx: 0, vy: 0, down: false, inside: false, button: 0 };
      if (this.thumbnail) document.documentElement.classList.add('at-thumb');
      this.build();
      this.observe();
      this.sync();
      this.keys();
      this.bindPointer();
      this.bindDrop();
      if (this.brand.font) this.loadFont(this.brand.font);
      if (this.brand.logo) this.loadLogo(this.brand.logo);
      Atelier.instance = this;
    }

    // Sections ajoutées par le kit : Format en tête ; Finition, Gradient map et Logo à la fin.
    withKitParams(params) {
      const o = this.opts, out = {};
      const kit = { internal: true, explore: false };
      if (o.format !== false) {
        const custom = (p) => p._fmt === 'custom';
        out['Format'] = {
          _fmt: { ...kit, type: 'segmented', label: 'Format', options: Object.fromEntries(Object.entries(FORMATS).map(([k, f]) => [k, f.label])), value: o.format?.value || 'screen' },
          _w: { ...kit, type: 'range', label: 'Largeur', min: 64, max: 4096, step: 1, value: o.format?.w || 1920, show: custom },
          _h: { ...kit, type: 'range', label: 'Hauteur', min: 64, max: 4096, step: 1, value: o.format?.h || 1080, show: custom },
          _res: { ...kit, type: 'segmented', label: 'Définition', options: [[1, '×1'], [2, '×2'], [4, '×4']], value: 1 },
        };
      }
      Object.assign(out, params);
      if (o.finish) {
        const f = typeof o.finish === 'object' ? o.finish : {};
        out['Finition'] = {
          grain: { type: 'range', label: 'Grain', min: 0, max: 1, step: 0.01, value: f.grain ?? 0.12 },
          vignette: { type: 'range', label: 'Vignette', min: 0, max: 1, step: 0.01, value: f.vignette ?? 0.25 },
        };
      }
      if (o.brand !== false) {
        const on = (p) => p._gm;
        out['Gradient map'] = {
          _gm: { ...kit, type: 'toggle', label: 'Activer', value: false },
          _gmSrc: { ...kit, type: 'segmented', label: 'Couleurs', options: { brand: 'Charte', duo: 'Duo', trio: 'Trio' }, value: 'brand', show: on },
          _gmA: { ...kit, type: 'color', label: 'Ombres', value: '#14123a', show: (p) => on(p) && p._gmSrc !== 'brand' },
          _gmM: { ...kit, type: 'color', label: 'Tons moyens', value: '#ff4d1a', show: (p) => on(p) && p._gmSrc === 'trio' },
          _gmB: { ...kit, type: 'color', label: 'Lumières', value: '#f4efe6', show: (p) => on(p) && p._gmSrc !== 'brand' },
          _gmInv: { ...kit, type: 'toggle', label: 'Inverser', value: false, show: on },
          _gmAmt: { ...kit, type: 'range', label: 'Intensité', min: 0, max: 1, step: 0.01, value: 1, show: on },
        };
        const logo = () => !!this.brand.logo;
        out['Logo'] = {
          _logo: { ...kit, type: 'select', label: 'Position', options: LOGO_POS, value: 'none', show: logo },
          _logoSize: { ...kit, type: 'range', label: 'Taille', min: 0.04, max: 0.8, step: 0.01, value: 0.16, show: (p) => logo() && p._logo !== 'none' },
          _logoOp: { ...kit, type: 'range', label: 'Opacité', min: 0, max: 1, step: 0.01, value: 1, show: (p) => logo() && p._logo !== 'none' },
        };
      }
      return out;
    }

    // ——— Construction de l'interface ———
    build() {
      const o = this.opts;
      const title = o.title || document.title;
      this.typeLabel = el('span', { class: 'at-type' });
      this.seedInput = el('input', {
        class: 'at-num at-seed', type: 'number', min: 1, max: 999999, value: this.seed, 'aria-label': 'Graine', title: 'Graine',
        onchange: (e) => this.reseed(Math.max(1, Math.floor(+e.target.value) || 1)),
      });
      this.playBtn = o.animate ? el('button', {
        class: 'at-iconbtn', type: 'button', 'aria-label': 'Lecture / pause (espace)', title: 'Lecture / pause (espace)',
        html: ICON.pause, onclick: () => this.toggle(), 'data-skip-test': true,
      }) : null;
      this.recLabel = el('span', { class: 'at-rec' });

      const topbar = el('header', { class: 'at-topbar' },
        el('a', { class: 'at-brand', href: '../../', title: 'Retour à la bibliothèque' }, el('i'), 'Atelier'),
        el('span', { class: 'at-sep' }),
        el('span', { class: 'at-title' }, title),
        this.typeLabel,
        el('span', { class: 'at-spacer' }),
        this.recLabel,
        el('div', { class: 'at-group' },
          this.playBtn,
          o.seed !== false ? el('button', {
            class: 'at-iconbtn', type: 'button', html: ICON.dice, 'aria-label': 'Nouvelle graine (R)', title: 'Nouvelle graine (R)',
            onclick: () => this.reseed(),
          }) : null,
          o.seed !== false ? this.seedInput : null,
          el('button', { class: 'at-iconbtn at-hide-sm', type: 'button', html: ICON.link, 'aria-label': 'Copier le lien vers ces réglages', title: 'Copier le lien vers ces réglages', onclick: (e) => this.share(e.currentTarget), 'data-skip-test': true }),
          el('button', { class: 'at-iconbtn at-hide-sm', type: 'button', html: ICON.theme, 'aria-label': 'Thème clair / sombre', title: 'Thème clair / sombre', onclick: () => this.toggleTheme(), 'data-skip-test': true }),
        ),
        el('button', { class: 'at-primary', type: 'button', onclick: () => this.showTab('export'), 'data-skip-test': true }, 'Exporter'),
      );

      const settings = el('div', { class: 'at-pane', role: 'tabpanel', id: 'at-pane-settings' });
      if (o.presets && Object.keys(o.presets).length) {
        this.presetBtns = Object.entries(o.presets).map(([name, values]) =>
          el('button', { class: 'at-preset', type: 'button', 'aria-pressed': 'false', onclick: (e) => this.applyPreset(values, e.currentTarget) }, name));
        settings.append(el('section', { class: 'at-section' }, el('h3', {}, 'Presets'), el('div', { class: 'at-presets' }, ...this.presetBtns)));
      }
      settings.append(el('section', { class: 'at-section' }, el('div', { class: 'at-presets' },
        el('button', { class: 'at-btn', type: 'button', html: `${ICON.shuffle}<span>Explorer</span>`, title: 'Varier tous les réglages au hasard (X)', onclick: () => this.explore() }),
        el('button', { class: 'at-btn', type: 'button', onclick: () => this.reset(), 'data-skip-test': true }, 'Réinitialiser'))));
      for (const [name, group] of Object.entries(o.params)) {
        if (name === 'Gradient map' && o.brand !== false) settings.append(this.buildBrand());
        const sec = el('section', { class: 'at-section' }, el('h3', {}, name));
        for (const [key, spec] of Object.entries(group)) sec.append(this.control(key, spec));
        if (name === 'Format') sec.append(this.sizeNote = el('p', { class: 'at-note at-mono' }));
        if (name === 'Logo') { this.logoSection = sec; sec.hidden = !this.brand.logo; }
        settings.append(sec);
      }
      if (o.animate) {
        settings.append(el('section', { class: 'at-section' }, el('h3', {}, 'Animation'),
          this.control('__speed', { type: 'range', label: 'Vitesse', min: 0.1, max: 3, step: 0.05, value: 1 })));
      }
      if (o.notes) settings.append(el('section', { class: 'at-section' }, el('p', { class: 'at-note' }, o.notes)));

      const exp = el('div', { class: 'at-pane', role: 'tabpanel', id: 'at-pane-export', hidden: true });
      this.buildExport(exp);

      this.tabs = {
        settings: el('button', { class: 'at-tab', role: 'tab', 'aria-selected': 'true', 'aria-controls': 'at-pane-settings', onclick: () => this.showTab('settings') }, 'Réglages'),
        export: el('button', { class: 'at-tab', role: 'tab', 'aria-selected': 'false', 'aria-controls': 'at-pane-export', onclick: () => this.showTab('export') }, 'Exporter'),
      };
      this.panes = { settings, export: exp };

      // Filtre SVG de la gradient map, appliqué en CSS à l'affichage et via ctx.filter à l'export.
      this.defs = el('div', { class: 'at-defs', 'aria-hidden': 'true', html: `<svg width="0" height="0"><filter id="at-gm" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feColorMatrix type="matrix" values=".2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 0 0 0 1 0" result="l"/>
        <feComponentTransfer in="l" result="m"><feFuncR type="table"/><feFuncG type="table"/><feFuncB type="table"/></feComponentTransfer>
        <feComposite in="m" in2="SourceGraphic" operator="arithmetic" k1="0" k2="1" k3="0" k4="0"/></filter></svg>` });

      this.logoEl = el('img', { class: 'at-logo', alt: '', hidden: true });
      // finish: { overlay: true } — grain et vignette posés par le kit sur un calque (outils à traînées).
      this.veil = o.finish?.overlay ? el('canvas', { class: 'at-veil' }) : null;
      this.frameEl = el('div', { class: 'at-frame' }, this.stage, this.veil, this.logoEl);
      this.hintEl = o.hint ? el('div', { class: 'at-hint' }, o.hint) : null;
      this.stageEl = el('main', { class: 'at-stage' }, this.frameEl, this.hintEl);
      if (o.pointer) this.stageEl.classList.add('at-interactive');
      this.root = el('div', { class: 'at-app' }, topbar, this.stageEl,
        el('aside', { class: 'at-sidebar', 'aria-label': 'Propriétés' }, el('div', { class: 'at-tabs', role: 'tablist' }, this.tabs.settings, this.tabs.export), settings, exp),
        this.defs);
      document.body.prepend(this.root);
      this.refreshVisibility();

      fetch('tool.json').then((r) => (r.ok ? r.json() : null)).then((m) => { if (m) this.typeLabel.textContent = TYPES[m.type] || ''; }).catch(() => {});
    }

    // Charte de marque : palette partagée par tous les outils, typo et logo. Stockée dans le navigateur.
    buildBrand() {
      const b = this.brand;
      const swatches = el('div', { class: 'at-colors' });
      const hex = el('input', { class: 'at-text at-mono', type: 'text', placeholder: '#111111 #ff4d1a #f4efe6', 'aria-label': 'Couleurs de la charte (hex)', spellcheck: 'false' });
      const render = () => {
        swatches.replaceChildren(...b.colors.map((c, i) => {
          const s = el('input', { class: 'at-swatch', type: 'color', value: c, 'aria-label': `Couleur de la charte ${i + 1}` });
          s.addEventListener('input', () => { b.colors[i] = s.value; hex.value = b.colors.join(' '); this.brandChanged(); });
          return s;
        }));
        swatches.hidden = !b.colors.length;
        hex.value = b.colors.join(' ');
      };
      this.renderBrandColors = render;
      hex.addEventListener('change', () => { b.colors = parseHexList(hex.value).slice(0, 12); render(); this.brandChanged(); });
      const pick = el('input', { type: 'file', accept: 'image/*', hidden: true });
      pick.addEventListener('change', async () => {
        if (!pick.files[0]) return;
        const img = await this.load(pick.files[0]);
        b.colors = extractPalette(img, 5);
        render(); this.brandChanged();
        pick.value = '';
      });
      const fontIn = el('input', { type: 'file', accept: '.woff2,.woff,.ttf,.otf,font/*', hidden: true });
      const fontName = el('span', { class: 'at-note at-ellipsis' });
      const fontDel = el('button', { class: 'at-btn at-small', type: 'button', 'data-skip-test': true, onclick: () => { b.font = null; this.saveBrand(); refreshAssets(); this.fontsChanged(); } }, 'Retirer');
      fontIn.addEventListener('change', async () => {
        const f = fontIn.files[0];
        if (!f) return;
        b.font = { name: f.name.replace(/\.[^.]+$/, ''), data: await this.dataURL(f) };
        await this.loadFont(b.font);
        this.saveBrand(); refreshAssets();
        fontIn.value = '';
      });
      const logoIn = el('input', { type: 'file', accept: 'image/svg+xml,image/png,image/webp,image/jpeg', hidden: true });
      const logoName = el('span', { class: 'at-note at-ellipsis' });
      const logoDel = el('button', { class: 'at-btn at-small', type: 'button', 'data-skip-test': true, onclick: () => { b.logo = null; this.logoImg = null; this.saveBrand(); refreshAssets(); this.sync(); } }, 'Retirer');
      logoIn.addEventListener('change', async () => {
        const f = logoIn.files[0];
        if (!f) return;
        b.logo = { name: f.name, data: await this.dataURL(f) };
        await this.loadLogo(b.logo);
        this.saveBrand();
        if (this.params._logo === 'none') this.set('_logo', 'br');
        refreshAssets();
        logoIn.value = '';
      });
      const refreshAssets = () => {
        fontName.textContent = b.font ? b.font.name : 'Aucune';
        logoName.textContent = b.logo ? b.logo.name : 'Aucun';
        fontDel.hidden = !b.font; logoDel.hidden = !b.logo;
        if (this.logoSection) this.logoSection.hidden = !b.logo;
        this.refreshVisibility();
      };
      const auto = el('input', { class: 'at-switch', type: 'checkbox', role: 'switch', id: 'at-brand-auto' });
      auto.checked = !!b.auto;
      auto.addEventListener('change', () => { b.auto = auto.checked; this.saveBrand(); });
      // Palettes du moodboard : un clic les essaie sur l'outil, « Garder » les met dans la charte.
      let tried = null;
      const keep = el('button', { class: 'at-btn at-small', type: 'button', hidden: true, onclick: () => { if (tried) this.setBrandColors(tried.colors); keep.hidden = true; } }, 'Garder comme charte');
      const pals = el('div', { class: 'at-pals' }, ...Object.values(PALETTES).map((p) => {
        const b = el('button', { class: 'at-pal', type: 'button', title: p.name, 'aria-label': `Palette ${p.name}`, onclick: () => {
          tried = p; this.apply(this.brandValues(p.colors));
          pals.querySelectorAll('.at-pal').forEach((x) => x.setAttribute('aria-pressed', x === b));
          keep.hidden = false; keep.textContent = `Garder « ${p.name} » comme charte`;
        } }, ...p.colors.map((c) => el('span', { style: `background:${c}` })));
        return b;
      }));
      render(); refreshAssets();
      return el('section', { class: 'at-section' }, el('h3', {}, 'Charte de marque'),
        el('p', { class: 'at-note' }, 'Partagée par tous les outils de cet appareil.'),
        el('div', { class: 'at-row at-full' }, el('label', {}, 'Couleurs'), swatches, hex),
        el('div', { class: 'at-presets' },
          el('button', { class: 'at-btn', type: 'button', onclick: () => this.applyBrand() }, 'Appliquer'),
          el('button', { class: 'at-btn', type: 'button', 'data-skip-test': true, onclick: () => pick.click() }, 'D\'une image'), pick),
        el('div', { class: 'at-row at-full' }, el('label', {}, 'Palettes du moodboard'), pals, keep),
        el('div', { class: 'at-row' }, el('label', { for: 'at-brand-auto' }, 'À l\'ouverture'), el('div', { class: 'at-ctl' }, auto, el('span', { class: 'at-note' }, 'appliquer la charte'))),
        el('div', { class: 'at-row' }, el('label', {}, 'Typo'), el('div', { class: 'at-ctl' }, fontName, fontDel,
          el('button', { class: 'at-btn at-small', type: 'button', 'data-skip-test': true, onclick: () => fontIn.click() }, 'Importer'), fontIn)),
        el('div', { class: 'at-row' }, el('label', {}, 'Logo'), el('div', { class: 'at-ctl' }, logoName, logoDel,
          el('button', { class: 'at-btn at-small', type: 'button', 'data-skip-test': true, onclick: () => logoIn.click() }, 'Importer'), logoIn)));
    }

    buildExport(pane) {
      const ex = this.opts.export || {};
      const name = ex.name || location.pathname.split('/').filter(Boolean).pop() || 'atelier';
      this.exportName = name;
      const btn = (label, onclick, accent) => el('button', { class: `at-btn${accent ? ' at-accent' : ''}`, type: 'button', 'data-skip-test': true, onclick }, label);
      const hasSrc = typeof ex.video === 'function' || (ex.video !== false && !!this.canvas);

      if (ex.png !== false && (ex.png || this.canvas)) {
        let type = 'png';
        this.exportSize = el('p', { class: 'at-note at-mono' });
        pane.append(el('section', { class: 'at-section' }, el('h3', {}, 'Image'),
          this.exportSize,
          this.segRow('Type', [['png', 'PNG'], ['jpeg', 'JPEG'], ['webp', 'WebP']], type, (v) => (type = v)),
          btn('Exporter l\'image', () => this.exportImage(type), true),
          typeof ClipboardItem !== 'undefined' ? btn('Copier dans le presse-papiers', (e) => this.copyImage(e.currentTarget)) : null,
          el('p', { class: 'at-note' }, 'La taille suit le format et la définition choisis dans Réglages.'),
          btn('Changer le format', () => { this.showTab('settings'); this.rows?._fmt?.scrollIntoView({ block: 'center' }); })));
      }
      if (ex.svg) pane.append(el('section', { class: 'at-section' }, el('h3', {}, 'Vectoriel'), btn('Exporter en SVG', () => this.exportSVG())));

      if (hasSrc && this.opts.animate) {
        const v = this.videoOpts = { fps: 60, dur: 6, mbps: 20 };
        const sec = el('section', { class: 'at-section' }, el('h3', {}, 'Animation'),
          this.segRow('Cadence', [[25, '25 i/s'], [30, '30 i/s'], [60, '60 i/s']], v.fps, (x) => (v.fps = x)),
          this.segRow('Durée', [[3, '3 s'], [6, '6 s'], [10, '10 s'], [20, '20 s']], v.dur, (x) => (v.dur = x)));
        if (typeof MediaRecorder !== 'undefined') {
          this.videoBtn = btn('Enregistrer la vidéo', () => this.exportVideo(v.dur));
          sec.append(this.segRow('Qualité', [[8, 'Web'], [20, 'Haute'], [50, 'Master']], v.mbps, (x) => (v.mbps = x)), this.videoBtn);
        }
        this.seqBtn = btn('Séquence PNG (.zip)', () => this.exportFrames(v.fps, v.dur));
        sec.append(this.seqBtn, el('p', { class: 'at-note' }, 'Vidéo : MP4 si le navigateur le permet, sinon WebM, enregistrée en temps réel. Séquence : images calculées une à une à la cadence choisie, pour After Effects ou Premiere.'));
        pane.append(sec);
      }
      if (ex.extra) for (const [label, fn] of Object.entries(ex.extra)) {
        pane.append(el('section', { class: 'at-section' }, el('h3', {}, label), btn(label, () => fn(this))));
      }
      const imp = el('input', { type: 'file', accept: 'application/json,.json', hidden: true });
      imp.addEventListener('change', async () => { if (imp.files[0]) this.importSettings(JSON.parse(await imp.files[0].text())); imp.value = ''; });
      pane.append(el('section', { class: 'at-section' }, el('h3', {}, 'Réglages'),
        el('div', { class: 'at-presets' }, btn('Exporter .json', () => this.exportSettings()), btn('Importer .json', () => imp.click()), imp),
        btn('Copier le lien', (e) => this.share(e.currentTarget))));
      pane.append(el('section', { class: 'at-section' }, el('p', { class: 'at-note' }, 'Raccourcis : espace = lecture/pause, R = nouvelle graine, X = explorer.')));
    }

    segRow(label, opts, value, onPick) {
      const seg = el('div', { class: 'at-seg', role: 'group', 'aria-label': label });
      for (const [v, l] of opts) {
        seg.append(el('button', { type: 'button', 'aria-pressed': String(v === value), onclick: (e) => {
          seg.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', 'false'));
          e.currentTarget.setAttribute('aria-pressed', 'true');
          onPick(v);
        } }, l));
      }
      return el('div', { class: 'at-row at-full' }, el('label', {}, label), el('div', { class: 'at-ctl' }, seg));
    }

    control(key, spec) {
      const id = `at-${key}`;
      const set = (v) => this.set(key, v);
      const label = el('label', { for: id, title: spec.label }, spec.label || key);
      let ctl, update;
      switch (spec.type) {
        case 'range': {
          const d = decimals(spec.step ?? 1);
          const range = el('input', { type: 'range', id, min: spec.min, max: spec.max, step: spec.step ?? 1, value: spec.value });
          const num = el('input', { class: 'at-num', type: 'number', min: spec.min, max: spec.max, step: spec.step ?? 1, value: spec.value, 'aria-label': spec.label });
          range.addEventListener('input', () => { num.value = (+range.value).toFixed(d); set(+range.value); });
          num.addEventListener('change', () => { const v = Math.min(spec.max, Math.max(spec.min, +num.value)); range.value = v; num.value = v.toFixed(d); set(v); });
          update = (v) => { range.value = v; num.value = (+v).toFixed(d); };
          ctl = el('div', { class: 'at-ctl' }, range, num);
          break;
        }
        case 'select':
        case 'font': {
          const s = el('select', { class: 'at-select', id });
          const fill = () => {
            const opts = options(spec.options || {});
            if (spec.type === 'font' && this.brand.font) opts.push([BRAND_FONT, `Charte · ${this.brand.font.name}`]);
            s.replaceChildren(...opts.map(([v, l]) => el('option', { value: v }, l)));
            s.value = this.params[key];
            if (s.selectedIndex < 0) s.selectedIndex = 0;
          };
          fill();
          if (spec.type === 'font') (this.fontFills ??= []).push(fill);
          s.addEventListener('change', () => set(s.value));
          update = (v) => { s.value = v; };
          ctl = el('div', { class: 'at-ctl' }, s);
          break;
        }
        case 'segmented': {
          const opts = options(spec.options);
          const seg = el('div', { class: `at-seg${opts.length > 5 ? ' at-wrap' : ''}`, role: 'group', id });
          const btns = opts.map(([v, l]) => el('button', { type: 'button', 'data-v': v, onclick: () => set(v) }, l));
          seg.append(...btns);
          update = (v) => btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === String(v))));
          ctl = el('div', { class: 'at-ctl' }, seg);
          break;
        }
        case 'color': {
          const sw = el('input', { class: 'at-swatch', type: 'color', id, value: spec.value });
          const hex = el('input', { class: 'at-hex', type: 'text', value: spec.value, maxlength: 7, 'aria-label': `${spec.label} (hex)` });
          sw.addEventListener('input', () => { hex.value = sw.value; set(sw.value); });
          hex.addEventListener('change', () => { if (/^#[0-9a-f]{6}$/i.test(hex.value)) { sw.value = hex.value; set(hex.value.toLowerCase()); } else hex.value = sw.value; });
          update = (v) => { sw.value = v; hex.value = v; };
          ctl = el('div', { class: 'at-ctl' }, sw, hex);
          break;
        }
        case 'palette': {
          const wrap = el('div', { class: 'at-colors', id, role: 'group', 'aria-label': spec.label });
          update = (v) => {
            wrap.replaceChildren(...v.map((c, i) => {
              const sw = el('input', { class: 'at-swatch', type: 'color', value: c, 'aria-label': `${spec.label} ${i + 1}` });
              sw.addEventListener('input', () => { const next = [...this.params[key]]; next[i] = sw.value; this.params[key] = next; this.changed(key); });
              return sw;
            }));
          };
          ctl = el('div', { class: 'at-ctl' }, wrap);
          break;
        }
        case 'toggle': {
          const t = el('input', { class: 'at-switch', type: 'checkbox', id, role: 'switch' });
          t.checked = !!spec.value;
          t.addEventListener('change', () => set(t.checked));
          update = (v) => { t.checked = !!v; };
          ctl = el('div', { class: 'at-ctl' }, t);
          break;
        }
        case 'text': {
          const t = el('input', { class: 'at-text', type: 'text', id, value: spec.value ?? '', placeholder: spec.placeholder, maxlength: spec.maxlength });
          t.addEventListener('input', () => set(t.value));
          update = (v) => { t.value = v; };
          ctl = el('div', { class: 'at-ctl' }, t);
          break;
        }
        case 'textarea': {
          const t = el('textarea', { class: 'at-textarea', id, placeholder: spec.placeholder, rows: spec.rows || 3 });
          t.value = this.params[key] ?? spec.value ?? '';
          t.addEventListener('input', () => set(t.value));
          this.controls[key] = (v) => { t.value = v; };
          return this.row(key, el('div', { class: 'at-ctl' }, t), label, true);
        }
        case 'file': {
          const input = el('input', { type: 'file', id, accept: spec.accept || 'image/*', hidden: true });
          const btn = el('button', { class: 'at-btn', type: 'button', 'data-skip-test': true, onclick: () => input.click() }, spec.button || 'Importer…');
          input.addEventListener('change', async () => {
            const file = input.files[0];
            if (!file) return;
            btn.textContent = file.name;
            set(await this.load(file));
          });
          update = () => {};
          ctl = el('div', { class: 'at-ctl' }, btn, input);
          break;
        }
        case 'button': {
          const b = el('button', { class: 'at-btn', type: 'button', id, onclick: () => spec.action(this) }, spec.label);
          return this.row(key, el('div', { class: 'at-ctl' }, b), null, true);
        }
        default:
          throw new Error(`Atelier : type de contrôle inconnu "${spec.type}" pour "${key}"`);
      }
      update(this.params[key] ?? spec.value);
      this.controls[key] = update;
      // Les groupes de boutons et les palettes prennent toute la largeur, libellé au-dessus.
      return this.row(key, ctl, label, spec.type === 'segmented' || spec.type === 'palette');
    }

    row(key, ctl, label, full = false) {
      const r = el('div', { class: `at-row${full ? ' at-full' : ''}`, 'data-key': key }, label, ctl);
      (this.rows ??= {})[key] = r;
      return r;
    }

    // Charge un fichier importé : image → HTMLImageElement (avec .svgText pour un SVG), texte → chaîne.
    load(file) {
      if (file.type.startsWith('image/')) {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = async () => { if (file.type === 'image/svg+xml') img.svgText = await file.text(); resolve(img); };
          img.onerror = reject;
          img.src = URL.createObjectURL(file);
        });
      }
      if (file.type.startsWith('video/')) {
        const v = el('video', { muted: true, loop: true, playsinline: true });
        v.src = URL.createObjectURL(file);
        return v.play().then(() => v);
      }
      if (file.type.startsWith('text/') || /\.(svg|json|txt)$/i.test(file.name)) return file.text();
      return Promise.resolve(file);
    }

    dataURL(file) {
      return new Promise((resolve) => { const r = new FileReader(); r.onload = () => resolve(r.result); r.readAsDataURL(file); });
    }

    // ——— État ———
    set(key, value, silent = false) {
      if (key === '__speed') { this.speed = value; return; }
      this.params[key] = value;
      this.controls[key]?.(value);
      if (!silent) this.changed(key);
    }

    changed(key) {
      this.refreshVisibility();
      if (this.specs[key]?.internal) return this.sync();
      this.presetBtns?.forEach((b) => b.setAttribute('aria-pressed', 'false'));
      this.opts.onChange?.(key, this.params[key], this.params);
    }

    apply(values, btn) {
      for (const [k, v] of Object.entries(values)) {
        if (k === 'seed') { this.seed = v; this.seedInput.value = v; this.random = rng(v); continue; }
        if (!(k in this.specs)) continue;
        this.params[k] = v;
        this.controls[k]?.(v);
      }
      this.refreshVisibility();
      this.sync();
      this.opts.onChange?.('*', null, this.params);
      if ('seed' in values) this.opts.onSeed?.(this.seed);
      this.presetBtns?.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    }

    // Un preset est un état complet : ce qu'il ne précise pas revient à la valeur par défaut
    // (le format, la charte et la gradient map restent tels quels).
    applyPreset(values, btn) {
      const base = {};
      for (const [k, v] of Object.entries(this.defaults)) if (!this.specs[k].internal) base[k] = structuredClone(v);
      this.apply({ ...base, ...values }, btn);
    }

    refreshVisibility() {
      for (const [key, spec] of Object.entries(this.specs)) {
        if (spec.show && this.rows?.[key]) this.rows[key].hidden = !spec.show(this.params);
      }
    }

    // Remet tous les réglages à leur valeur d'origine.
    reset() {
      this.apply(structuredClone(this.defaults));
    }

    // Varie au hasard les réglages numériques et les choix (les couleurs et textes seulement si spec.explore).
    explore() {
      const next = {};
      for (const [k, spec] of Object.entries(this.specs)) {
        if (spec.explore === false) continue;
        if (spec.type === 'range') {
          const n = Math.round((spec.min + Math.random() * (spec.max - spec.min)) / (spec.step || 1)) * (spec.step || 1);
          next[k] = +Math.min(spec.max, Math.max(spec.min, n)).toFixed(decimals(spec.step ?? 1));
        } else if (spec.type === 'select' || spec.type === 'segmented') {
          const opts = options(spec.options);
          next[k] = opts[Math.floor(Math.random() * opts.length)][0];
        } else if (spec.type === 'toggle' && spec.explore) next[k] = Math.random() < 0.5;
        else if (spec.type === 'color' && spec.explore) next[k] = '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
      }
      this.apply(next);
    }

    // État partageable : réglages + graine (+ couleurs de la charte) encodés dans l'URL.
    state() {
      const p = {};
      for (const [k, v] of Object.entries(this.params)) if (this.specs[k].type !== 'file') p[k] = v;
      return { p, s: this.seed, b: this.brand.colors };
    }

    readHash() {
      const m = location.hash.match(/^#r=([^&]+)/);
      if (!m) return false;
      try {
        const { p, s, b } = JSON.parse(decodeURIComponent(escape(atob(m[1]))));
        for (const [k, v] of Object.entries(p || {})) if (k in this.specs) this.params[k] = v;
        if (s) { this.seed = s; this.random = rng(s); }
        if (Array.isArray(b) && b.length) this.brand.colors = b;
        return true;
      } catch { return false; }
    }

    async share(btn) {
      const hash = '#r=' + btoa(unescape(encodeURIComponent(JSON.stringify(this.state()))));
      history.replaceState(null, '', hash);
      try { await navigator.clipboard.writeText(location.href); } catch { /* presse-papiers indisponible */ }
      this.flash(btn);
    }

    flash(btn) {
      if (!btn) return;
      btn.setAttribute('aria-pressed', 'true');
      setTimeout(() => btn.setAttribute('aria-pressed', 'false'), 1200);
    }

    exportSettings() {
      const data = { tool: this.exportName, kit: Atelier.version, ...this.state() };
      this.download(`${this.exportName}-${this.seed}.json`, new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    }

    importSettings(data) {
      if (!data || typeof data !== 'object') return;
      if (Array.isArray(data.b) && data.b.length) { this.brand.colors = data.b; this.renderBrandColors?.(); }
      this.apply({ ...(data.p || {}), ...(data.s ? { seed: data.s } : {}) });
    }

    // ——— Charte de marque ———
    loadBrand() {
      const b = store.get(BRAND_KEY) || {};
      return { colors: Array.isArray(b.colors) ? b.colors : [], auto: !!b.auto, font: b.font || null, logo: b.logo || null };
    }

    saveBrand() {
      if (!store.set(BRAND_KEY, this.brand)) {
        // Fichiers trop lourds pour le stockage local : on garde au moins les couleurs.
        store.set(BRAND_KEY, { ...this.brand, font: null, logo: null });
      }
    }

    brandChanged() {
      this.saveBrand();
      this.sync();
    }

    // Répartit la charte sur les réglages de couleur de l'outil (ou via opts.brand(colors, app)).
    brandValues(cols = this.brand.colors) {
      if (!cols.length) return {};
      if (typeof this.opts.brand === 'function') return this.opts.brand([...cols], this) || {};
      const out = {};
      const entries = Object.entries(this.specs).filter(([, s]) => !s.internal && s.brand !== false);
      const isBg = (k, s) => s.brand === 'background' || /fond|bg|back|papier|paper/i.test(`${k} ${s.label || ''}`);
      let bg = null;
      for (const [k, s] of entries) {
        if (s.type === 'color' && isBg(k, s)) {
          const cur = luma(this.params[k] || '#000000');
          bg = cols.reduce((a, c) => (Math.abs(luma(c) - cur) < Math.abs(luma(a) - cur) ? c : a), cols[0]);
          out[k] = bg;
        }
      }
      const inks = cols.filter((c) => c !== bg).sort((a, b) => Math.abs(luma(b) - luma(bg || '#808080')) - Math.abs(luma(a) - luma(bg || '#808080')));
      const pool = inks.length ? inks : cols;
      let i = 0;
      for (const [k, s] of entries) {
        if (s.type === 'color' && !(k in out)) out[k] = pool[i++ % pool.length];
        if (s.type === 'palette') out[k] = (this.params[k] || cols).map((_, j) => cols[j % cols.length]);
      }
      return out;
    }

    // Remplace les couleurs de la charte (partagée par tous les outils de l'appareil).
    setBrandColors(colors) {
      this.brand.colors = colors.slice(0, 12);
      this.renderBrandColors?.();
      this.brandChanged();
    }

    applyBrand() {
      if (!this.brand.colors.length) return;
      this.apply(this.brandValues());
    }

    async loadFont(f) {
      try {
        const face = new FontFace(BRAND_FONT, `url(${f.data})`);
        await face.load();
        document.fonts.add(face);
      } catch { /* fichier de typo illisible */ }
      this.fontsChanged();
    }

    fontsChanged() {
      this.fontFills?.forEach((fill) => fill());
      const keys = Object.entries(this.specs).filter(([, s]) => s.type === 'font').map(([k]) => k);
      if (keys.length) this.opts.onChange?.('*', null, this.params);
    }

    loadLogo(l) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          this.logoImg = img; this.logoEl.src = l.data;
          if (this.logoSection) this.logoSection.hidden = false;
          this.refreshVisibility(); this.sync(); resolve();
        };
        img.onerror = () => resolve();
        img.src = l.data;
      });
    }

    gradientStops() {
      const p = this.params;
      let stops = p._gmSrc === 'duo' ? [p._gmA, p._gmB] : p._gmSrc === 'trio' ? [p._gmA, p._gmM, p._gmB]
        : [...(this.brand.colors.length > 1 ? this.brand.colors : FALLBACK_STOPS)].sort((a, b) => luma(a) - luma(b));
      if (p._gmInv) stops = [...stops].reverse();
      return stops;
    }

    // Applique les réglages du kit : format, gradient map, logo.
    sync() {
      const p = this.params;
      this.layout();
      const gm = !!p._gm && !this.thumbnail;
      if (gm) {
        const lut = rampLUT(this.gradientStops());
        const table = (c) => Array.from({ length: 17 }, (_, i) => (lut[Math.min(255, i * 16) * 3 + c] / 255).toFixed(3)).join(' ');
        const funcs = this.defs.querySelectorAll('feComponentTransfer > *');
        funcs.forEach((f, c) => f.setAttribute('tableValues', table(c)));
        const comp = this.defs.querySelector('feComposite');
        comp.setAttribute('k2', p._gmAmt);
        comp.setAttribute('k3', 1 - p._gmAmt);
        this.lut = lut;
      }
      this.stage.style.filter = gm ? 'url(#at-gm)' : '';
      const logo = this.logoImg && p._logo && p._logo !== 'none' && !this.thumbnail;
      this.logoEl.hidden = !logo;
      if (logo) {
        const r = this.logoRect(this.size.w, this.size.h);
        Object.assign(this.logoEl.style, { left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px`, opacity: p._logoOp });
      }
    }

    logoRect(w, h) {
      const p = this.params, img = this.logoImg;
      const lw = w * p._logoSize, lh = lw * (img.naturalHeight || img.height || 1) / (img.naturalWidth || img.width || 1);
      const m = Math.min(w, h) * 0.05, pos = p._logo;
      const x = pos.endsWith('l') ? m : pos.endsWith('r') ? w - lw - m : (w - lw) / 2;
      const y = pos.startsWith('t') ? m : pos.startsWith('b') ? h - lh - m : (h - lh) / 2;
      return { x, y, w: lw, h: lh };
    }

    needsPost() {
      if (this.veil && (this.params.grain > 0 || this.params.vignette > 0)) return true;
      return (!!this.params._gm || (this.logoImg && this.params._logo && this.params._logo !== 'none')) && !this.thumbnail;
    }

    // Calque de finition (mode overlay), rafraîchi 12 fois par seconde.
    drawVeil() {
      const p = this.params, v = this.veil;
      const key = `${this.size.w}x${this.size.h}:${p.grain}:${p.vignette}:${Math.floor(this.time * 12)}`;
      if (key === this.veilKey) return;
      this.veilKey = key;
      v.width = Math.round(this.size.w * Math.min(this.size.dpr, 1.5)); v.height = Math.round(this.size.h * Math.min(this.size.dpr, 1.5));
      this.finish(v.getContext('2d'));
    }

    // Recopie une source dans un contexte 2D en appliquant gradient map et logo (exports).
    composite(x, src) {
      const c = x.canvas, p = this.params;
      x.save();
      x.setTransform(1, 0, 0, 1, 0, 0);
      x.clearRect(0, 0, c.width, c.height);
      if (p._gm && 'filter' in x && this.filterWorks !== false) {
        x.filter = 'url(#at-gm)';
        x.drawImage(src, 0, 0, c.width, c.height);
        x.filter = 'none';
      } else {
        x.drawImage(src, 0, 0, c.width, c.height);
        if (p._gm) this.lutPass(x);
      }
      if (this.veil) this.finish(x);
      if (this.logoImg && p._logo && p._logo !== 'none') {
        const r = this.logoRect(c.width, c.height);
        x.globalAlpha = p._logoOp;
        x.drawImage(this.logoImg, r.x, r.y, r.w, r.h);
      }
      x.restore();
    }

    // Repli si ctx.filter n'accepte pas les filtres SVG : gradient map calculée pixel par pixel.
    lutPass(x) {
      const { width: w, height: h } = x.canvas, img = x.getImageData(0, 0, w, h), d = img.data, lut = this.lut, a = this.params._gmAmt;
      for (let i = 0; i < d.length; i += 4) {
        const l = (d[i] * 54 + d[i + 1] * 183 + d[i + 2] * 19) >> 8;
        d[i] += (lut[l * 3] - d[i]) * a; d[i + 1] += (lut[l * 3 + 1] - d[i + 1]) * a; d[i + 2] += (lut[l * 3 + 2] - d[i + 2]) * a;
      }
      x.putImageData(img, 0, 0);
    }

    // Copie immédiate (dans la même tâche que le rendu, pour WebGL) puis post-traitement.
    snapshot(src) {
      const c = document.createElement('canvas');
      c.width = src.width; c.height = src.height;
      const x = c.getContext('2d', { willReadFrequently: !!this.params._gm });
      if (this.needsPost()) this.composite(x, src); else x.drawImage(src, 0, 0);
      return c;
    }

    // ——— Pointeur sur la scène (souris, stylet, toucher), en coordonnées du cadre ———
    bindPointer() {
      const p = this.pointer, o = this.opts.pointer || {};
      const at = (e) => {
        const r = this.frameEl.getBoundingClientRect();
        p.px = p.x; p.py = p.y;
        p.x = e.clientX - r.left; p.y = e.clientY - r.top;
        p.vx = p.x - p.px; p.vy = p.y - p.py;
        p.pressure = e.pressure || (p.down ? 0.5 : 0);
        p.shift = e.shiftKey; p.alt = e.altKey;
      };
      const s = this.stageEl;
      s.addEventListener('pointerdown', (e) => {
        if (e.target !== this.stage && !this.stage.contains(e.target)) return;
        at(e); p.vx = p.vy = 0; p.down = true; p.button = e.button;
        s.setPointerCapture(e.pointerId);
        this.hintEl?.classList.add('at-gone');
        o.down?.(p, e);
      });
      s.addEventListener('pointermove', (e) => { at(e); p.inside = true; (p.down ? o.drag : null)?.(p, e); o.move?.(p, e); });
      const up = (e) => { if (!p.down) return; at(e); p.down = false; o.up?.(p, e); };
      s.addEventListener('pointerup', up);
      s.addEventListener('pointercancel', up);
      s.addEventListener('pointerleave', () => { p.inside = false; });
      if (o.wheel) s.addEventListener('wheel', (e) => { e.preventDefault(); at(e); o.wheel(p, e.deltaY, e); }, { passive: false });
    }

    // Glisser-déposer une image ou une vidéo sur la scène → premier réglage « file » compatible.
    bindDrop() {
      const files = Object.entries(this.specs).filter(([, s]) => s.type === 'file');
      if (!files.length) return;
      const s = this.stageEl;
      s.addEventListener('dragover', (e) => { e.preventDefault(); s.classList.add('at-drop'); });
      s.addEventListener('dragleave', () => s.classList.remove('at-drop'));
      s.addEventListener('drop', async (e) => {
        e.preventDefault();
        s.classList.remove('at-drop');
        const file = e.dataTransfer.files[0];
        if (!file) return;
        const match = files.find(([, spec]) => {
          const acc = (spec.accept || 'image/*').split(',').map((a) => a.trim());
          return acc.some((a) => (a.endsWith('/*') ? file.type.startsWith(a.slice(0, -1)) : file.type === a || file.name.endsWith(a)));
        });
        if (match) this.set(match[0], await this.load(file));
      });
    }

    // ——— Finition commune : grain animé et vignette, appliqués sur un contexte 2D ———
    finish(ctx) {
      const { grain = 0, vignette = 0 } = this.params;
      const c = ctx.canvas, w = c.width, h = c.height;
      if (ctx === this.veil?.getContext('2d')) ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      if (vignette > 0) {
        const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.25, w / 2, h / 2, Math.hypot(w, h) * 0.6);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(1, `rgba(0,0,0,${vignette * 0.85})`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
      if (grain > 0) {
        if (!this.grainTile) {
          const t = document.createElement('canvas');
          t.width = t.height = 256;
          const tc = t.getContext('2d'), img = tc.createImageData(256, 256);
          for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
          tc.putImageData(img, 0, 0);
          this.grainTile = ctx.createPattern(t, 'repeat');
        }
        const k = Math.max(1, w / 1600);
        ctx.globalCompositeOperation = 'overlay';
        ctx.globalAlpha = grain * 0.6;
        ctx.translate(Math.random() * 256, Math.random() * 256);
        ctx.scale(k, k);
        ctx.fillStyle = this.grainTile;
        ctx.fillRect(-256, -256, w / k + 256, h / k + 256);
      }
      ctx.restore();
    }

    reseed(seed = newSeed()) {
      this.seed = seed;
      this.seedInput.value = seed;
      this.random = rng(seed);
      this.opts.onSeed?.(seed);
    }

    rng(offset = 0) { return rng(this.seed + offset); }

    toggle(force) {
      if (!this.opts.animate) return;
      this.playing = force ?? !this.playing;
      this.playBtn.innerHTML = this.playing ? ICON.pause : ICON.play;
    }

    toggleTheme() {
      const root = document.documentElement;
      const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
      root.dataset.theme = dark ? 'light' : 'dark';
    }

    showTab(name) {
      for (const [k, t] of Object.entries(this.tabs)) {
        t.setAttribute('aria-selected', String(k === name));
        this.panes[k].hidden = k !== name;
      }
    }

    // ——— Boucle d'animation ———
    // fn(t, dt) : t = temps écoulé en secondes (vitesse incluse), dt = delta de la frame.
    loop(fn) {
      this.frameFn = fn;
      let last = performance.now();
      const frame = (now) => {
        const dt = Math.min(0.1, (now - last) / 1000) * this.speed;
        last = now;
        if (!this.offline && (this.playing || !this.opts.animate)) {
          if (this.opts.animate) this.time += dt;
          fn(this.time, this.opts.animate ? dt : 0);
          if (this.veil) this.drawVeil();
          this.onFrame?.();
        }
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }

    // ——— Taille de la scène et format ———
    // Écran : le cadre remplit la scène. Format fixe : le canvas fait exactement la taille cible
    // (× définition) et s'affiche réduit, centré. L'outil dessine toujours en pixels d'affichage
    // (size.w × size.h) avec size.dpr pour passer à la résolution réelle.
    target() {
      const p = this.params, f = FORMATS[p._fmt] || FORMATS.screen;
      if (this.thumbnail || !p._fmt || p._fmt === 'screen') return null;
      return f.w ? { w: f.w, h: f.h } : { w: Math.round(p._w), h: Math.round(p._h) };
    }

    layout() {
      if (!this.stageEl) return;
      const r = this.stageEl.getBoundingClientRect();
      const t = this.target();
      let res = +this.params._res || 1, w, h, bw, bh;
      if (!t) {
        w = Math.max(1, Math.round(r.width)); h = Math.max(1, Math.round(r.height));
        const dpr = Math.min(window.devicePixelRatio || 1, this.opts.maxDpr || 2) * res;
        bw = Math.round(w * dpr); bh = Math.round(h * dpr);
      } else {
        const pad = r.width < 720 ? 12 : 32;
        const k = Math.min((r.width - pad * 2) / t.w, (r.height - pad * 2) / t.h);
        w = Math.max(1, Math.round(t.w * k)); h = Math.max(1, Math.round(t.h * k));
        bw = t.w * res; bh = t.h * res;
      }
      const fit = Math.min(1, MAX_SIDE / bw, MAX_SIDE / bh, Math.sqrt(MAX_AREA / (bw * bh)));
      bw = Math.round(bw * fit); bh = Math.round(bh * fit);
      Object.assign(this.frameEl.style, { width: `${w}px`, height: `${h}px`, left: `${Math.round((r.width - w) / 2)}px`, top: `${Math.round((r.height - h) / 2)}px` });
      this.frameEl.classList.toggle('at-framed', !!t);
      const label = `${bw} × ${bh} px${t ? '' : ' · taille de la fenêtre'}`;
      if (this.sizeNote) this.sizeNote.textContent = label;
      if (this.exportSize) this.exportSize.textContent = label;
      const dpr = bw / w;
      if (w === this.size.w && h === this.size.h && Math.abs(dpr - this.size.dpr) < 1e-6) return;
      this.size = { w, h, dpr };
      if (this.canvas && !this.opts.manualCanvasSize && (this.canvas.width !== bw || this.canvas.height !== bh)) {
        this.canvas.width = bw;
        this.canvas.height = bh;
      }
      if (this.ready) this.opts.onResize?.(this.size);
    }

    observe() {
      // Le premier calcul est silencieux : l'outil lit app.size après Atelier.app().
      this.layout();
      this.ready = true;
      new ResizeObserver(() => this.sync()).observe(this.stageEl);
    }

    keys() {
      addEventListener('keydown', (e) => {
        if (e.target.closest?.('input, textarea, select, [contenteditable]') || e.metaKey || e.ctrlKey || e.altKey) return;
        if (e.code === 'Space') { e.preventDefault(); this.toggle(); }
        if (e.key === 'r' || e.key === 'R') this.reseed();
        if (e.key === 'x' || e.key === 'X') this.explore();
      });
    }

    // ——— Exports ———
    download(filename, data) {
      const url = data instanceof Blob ? URL.createObjectURL(data) : data;
      const a = el('a', { href: url, download: filename });
      document.body.append(a);
      a.click();
      a.remove();
      if (data instanceof Blob) setTimeout(() => URL.revokeObjectURL(url), 4000);
    }

    // Source image pour les vidéos et séquences : le canvas, ou ce que fournit export.video(app).
    frameSource() {
      const ex = this.opts.export || {};
      if (typeof ex.video === 'function') return ex.video(this);
      return ex.video !== false && this.canvas ? this.canvas : null;
    }

    // Rend l'image finale (format, définition, gradient map, logo) dans un canvas.
    async renderImage() {
      const ex = this.opts.export || {};
      let out;
      if (typeof ex.png === 'function') {
        out = await ex.png(+this.params._res || 1, this);
        if (typeof out === 'string' || out instanceof Blob) {
          const img = new Image();
          img.src = typeof out === 'string' ? out : URL.createObjectURL(out);
          await img.decode();
          out = el('canvas', { width: img.naturalWidth, height: img.naturalHeight });
          out.getContext('2d').drawImage(img, 0, 0);
        }
      } else {
        // Un rendu frais dans la même tâche que la copie (indispensable pour WebGL).
        this.frameFn?.(this.time, 0);
        out = this.canvas;
      }
      return this.snapshot(out);
    }

    async exportImage(type = 'png') {
      const c = await this.renderImage();
      if (type === 'jpeg') { const x = el('canvas', { width: c.width, height: c.height }).getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(c, 0, 0); return this.saveCanvas(x.canvas, type); }
      this.saveCanvas(c, type);
    }

    saveCanvas(c, type) {
      const ext = type === 'jpeg' ? 'jpg' : type;
      c.toBlob((b) => this.download(`${this.exportName}-${this.seed}.${ext}`, b), `image/${type}`, 0.94);
    }

    exportPNG() { return this.exportImage('png'); }

    async copyImage(btn) {
      try {
        const c = await this.renderImage();
        const blob = await new Promise((r) => c.toBlob(r, 'image/png'));
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        this.flash(btn);
      } catch { /* presse-papiers indisponible */ }
    }

    exportSVG() {
      const text = this.opts.export.svg(this);
      this.download(`${this.exportName}-${this.seed}.svg`, new Blob([text], { type: 'image/svg+xml' }));
    }

    busy(on) {
      this.recording = on;
      this.root.classList.toggle('at-recording', on);
      if (this.videoBtn) this.videoBtn.disabled = on;
      if (this.seqBtn) this.seqBtn.disabled = on;
    }

    exportVideo(seconds) {
      if (this.recording) return;
      const src = this.frameSource();
      if (!src) return;
      const { fps = 60, mbps = 20 } = this.videoOpts || {};
      const type = ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'].find((t) => MediaRecorder.isTypeSupported(t));
      let source = src;
      if (this.needsPost()) {
        // Gradient map et logo : on enregistre une copie composée à chaque image.
        source = el('canvas', { width: src.width, height: src.height });
        const x = source.getContext('2d');
        this.onFrame = () => this.composite(x, src);
        this.onFrame();
      }
      const stream = source.captureStream(fps);
      const rec = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: mbps * 1e6 });
      const chunks = [];
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      rec.onstop = () => {
        this.onFrame = null;
        this.busy(false);
        const ext = type.startsWith('video/mp4') ? 'mp4' : 'webm';
        this.download(`${this.exportName}-${this.seed}-${fps}fps.${ext}`, new Blob(chunks, { type: type.split(';')[0] }));
      };
      this.busy(true);
      this.toggle(true);
      const start = performance.now();
      const tick = () => {
        const t = (performance.now() - start) / 1000;
        this.recLabel.textContent = `● REC ${t.toFixed(1)} / ${seconds} s`;
        if (t >= seconds) rec.stop(); else requestAnimationFrame(tick);
      };
      rec.start(250);
      tick();
    }

    // Séquence d'images calculées hors temps réel : chaque image avance d'exactement 1/fps.
    async exportFrames(fps, seconds) {
      if (this.recording || !this.frameFn) return;
      const src = this.frameSource();
      const n = Math.round(fps * seconds), dt = (1 / fps) * this.speed, files = [];
      this.busy(true);
      this.offline = true;
      try {
        for (let i = 0; i < n; i++) {
          this.time += dt;
          this.frameFn(this.time, dt);
          const c = this.snapshot(src);
          const blob = await new Promise((r) => c.toBlob(r, 'image/png'));
          const u8 = new Uint8Array(await blob.arrayBuffer());
          files.push({ name: `${this.exportName}_${String(i).padStart(5, '0')}.png`, blob, crc: crc32(u8), size: u8.length });
          this.recLabel.textContent = `● Image ${i + 1} / ${n}`;
        }
        this.download(`${this.exportName}-${this.seed}-${fps}fps.zip`, zip(files));
      } finally {
        this.offline = false;
        this.busy(false);
      }
    }
  }

  const Atelier = { app: (opts) => new App(opts), rng, extractPalette, PALETTES, version: '1.3.0', instance: null };
  window.Atelier = Atelier;
})();
