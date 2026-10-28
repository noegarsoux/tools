/* Atelier — kit d'interface commun à tous les outils.
 *
 * Structure inspirée de Figma : barre du haut, scène au centre, panneau de propriétés à droite.
 * Un outil ne construit jamais sa propre interface : il décrit ses paramètres et le kit s'occupe
 * du rendu, des presets, de la graine, de l'animation et des exports. Voir AGENTS.md.
 *
 *   const app = Atelier.app({
 *     stage: document.querySelector('canvas'),
 *     params: { 'Forme': { count: { type: 'range', label: 'Nombre', min: 1, max: 100, value: 20 } } },
 *     presets: { 'Calme': { count: 10 } },
 *     seed: true, animate: true,
 *     export: { png: true, video: true },
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
  const svg = (d) => `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICON = {
    play: svg('<path d="M5 3.5v9l7-4.5z" fill="currentColor" stroke="none"/>'),
    pause: svg('<path d="M5.5 3.5v9M10.5 3.5v9"/>'),
    dice: svg('<rect x="2.5" y="2.5" width="11" height="11" rx="2.5"/><circle cx="5.7" cy="5.7" r=".9" fill="currentColor"/><circle cx="10.3" cy="10.3" r=".9" fill="currentColor"/><circle cx="8" cy="8" r=".9" fill="currentColor"/>'),
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

      for (const group of Object.values(opts.params || {})) {
        for (const [key, spec] of Object.entries(group)) {
          this.specs[key] = spec;
          if (spec.type !== 'button') this.params[key] = spec.value ?? (spec.type === 'toggle' ? false : null);
        }
      }
      if (this.thumbnail) document.documentElement.classList.add('at-thumb');
      this.build();
      this.observe();
      this.keys();
      Atelier.instance = this;
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
          el('button', { class: 'at-iconbtn at-hide-sm', type: 'button', html: ICON.theme, 'aria-label': 'Thème clair / sombre', title: 'Thème clair / sombre', onclick: () => this.toggleTheme(), 'data-skip-test': true }),
        ),
        el('button', { class: 'at-primary', type: 'button', onclick: () => this.showTab('export'), 'data-skip-test': true }, 'Exporter'),
      );

      const settings = el('div', { class: 'at-pane', role: 'tabpanel', id: 'at-pane-settings' });
      if (o.presets && Object.keys(o.presets).length) {
        this.presetBtns = Object.entries(o.presets).map(([name, values]) =>
          el('button', { class: 'at-preset', type: 'button', 'aria-pressed': 'false', onclick: (e) => this.apply(values, e.currentTarget) }, name));
        settings.append(el('section', { class: 'at-section' }, el('h3', {}, 'Presets'), el('div', { class: 'at-presets' }, ...this.presetBtns)));
      }
      for (const [name, group] of Object.entries(o.params || {})) {
        const sec = el('section', { class: 'at-section' }, el('h3', {}, name));
        for (const [key, spec] of Object.entries(group)) sec.append(this.control(key, spec));
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

      this.stageEl = el('main', { class: 'at-stage' }, this.stage);
      this.root = el('div', { class: 'at-app' }, topbar, this.stageEl,
        el('aside', { class: 'at-sidebar', 'aria-label': 'Propriétés' }, el('div', { class: 'at-tabs', role: 'tablist' }, this.tabs.settings, this.tabs.export), settings, exp));
      document.body.prepend(this.root);
      this.refreshVisibility();

      fetch('tool.json').then((r) => (r.ok ? r.json() : null)).then((m) => { if (m) this.typeLabel.textContent = TYPES[m.type] || ''; }).catch(() => {});
    }

    buildExport(pane) {
      const ex = this.opts.export || {};
      const name = ex.name || location.pathname.split('/').filter(Boolean).pop() || 'atelier';
      this.exportName = name;
      if (ex.png !== false && (ex.png || this.canvas)) {
        let scale = typeof ex.png === 'function' ? 2 : 1;
        const sec = el('section', { class: 'at-section' }, el('h3', {}, 'Image PNG'));
        if (typeof ex.png === 'function') {
          sec.append(this.segRow('Échelle', [[1, '×1'], [2, '×2'], [4, '×4']], scale, (v) => (scale = v)));
        }
        sec.append(el('button', { class: 'at-btn at-accent', type: 'button', 'data-skip-test': true, onclick: () => this.exportPNG(scale) }, 'Exporter en PNG'));
        pane.append(sec);
      }
      if (ex.svg) {
        pane.append(el('section', { class: 'at-section' }, el('h3', {}, 'Vectoriel SVG'),
          el('button', { class: 'at-btn', type: 'button', 'data-skip-test': true, onclick: () => this.exportSVG() }, 'Exporter en SVG')));
      }
      const videoCanvas = typeof ex.video === 'function' || (ex.video && this.canvas);
      if (videoCanvas && typeof MediaRecorder !== 'undefined') {
        let dur = 6;
        this.videoBtn = el('button', { class: 'at-btn', type: 'button', 'data-skip-test': true, onclick: () => this.exportVideo(dur) }, 'Enregistrer la vidéo');
        pane.append(el('section', { class: 'at-section' }, el('h3', {}, 'Vidéo'),
          this.segRow('Durée', [[3, '3 s'], [6, '6 s'], [10, '10 s'], [20, '20 s']], dur, (v) => (dur = v)),
          this.videoBtn,
          el('p', { class: 'at-note' }, "Enregistre la scène telle qu'elle s'affiche, en WebM (ou MP4 si le navigateur le permet).")));
      }
      if (ex.extra) for (const [label, fn] of Object.entries(ex.extra)) {
        pane.append(el('section', { class: 'at-section' }, el('h3', {}, label),
          el('button', { class: 'at-btn', type: 'button', 'data-skip-test': true, onclick: () => fn(this) }, label)));
      }
      pane.append(el('section', { class: 'at-section' }, el('p', { class: 'at-note' }, 'Raccourcis : espace = lecture/pause, R = nouvelle graine.')));
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
      return el('div', { class: 'at-row' }, el('label', {}, label), el('div', { class: 'at-ctl' }, seg));
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
        case 'select': {
          const s = el('select', { class: 'at-select', id }, ...options(spec.options).map(([v, l]) => el('option', { value: v }, l)));
          s.value = spec.value;
          s.addEventListener('change', () => set(s.value));
          update = (v) => { s.value = v; };
          ctl = el('div', { class: 'at-ctl' }, s);
          break;
        }
        case 'segmented': {
          const seg = el('div', { class: 'at-seg', role: 'group', id });
          const btns = options(spec.options).map(([v, l]) => el('button', { type: 'button', 'data-v': v, onclick: () => set(v) }, l));
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
          t.value = spec.value ?? '';
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

    // ——— État ———
    set(key, value, silent = false) {
      if (key === '__speed') { this.speed = value; return; }
      this.params[key] = value;
      this.controls[key]?.(value);
      if (!silent) this.changed(key);
    }

    changed(key) {
      this.presetBtns?.forEach((b) => b.setAttribute('aria-pressed', 'false'));
      this.refreshVisibility();
      this.opts.onChange?.(key, this.params[key], this.params);
    }

    apply(values, btn) {
      for (const [k, v] of Object.entries(values)) {
        if (k === 'seed') { this.seed = v; this.seedInput.value = v; this.random = rng(v); continue; }
        this.params[k] = v;
        this.controls[k]?.(v);
      }
      this.refreshVisibility();
      this.opts.onChange?.('*', null, this.params);
      if ('seed' in values) this.opts.onSeed?.(this.seed);
      this.presetBtns?.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    }

    refreshVisibility() {
      for (const [key, spec] of Object.entries(this.specs)) {
        if (spec.show && this.rows?.[key]) this.rows[key].hidden = !spec.show(this.params);
      }
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
      let last = performance.now();
      const frame = (now) => {
        const dt = Math.min(0.1, (now - last) / 1000) * this.speed;
        last = now;
        if (this.playing || !this.opts.animate) {
          if (this.opts.animate) this.time += dt;
          fn(this.time, this.opts.animate ? dt : 0);
        }
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }

    // ——— Taille de la scène ———
    observe() {
      // Le premier calcul est silencieux : l'outil lit app.size après Atelier.app().
      const apply = (initial) => {
        const r = this.stageEl.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, this.opts.maxDpr || 2);
        const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
        if (w === this.size.w && h === this.size.h && dpr === this.size.dpr) return;
        this.size = { w, h, dpr };
        if (this.canvas && !this.opts.manualCanvasSize) {
          this.canvas.width = Math.round(w * dpr);
          this.canvas.height = Math.round(h * dpr);
        }
        if (initial !== true) this.opts.onResize?.(this.size);
      };
      apply(true);
      new ResizeObserver(() => apply()).observe(this.stageEl);
    }

    keys() {
      addEventListener('keydown', (e) => {
        if (e.target.closest?.('input, textarea, select, [contenteditable]') || e.metaKey || e.ctrlKey || e.altKey) return;
        if (e.code === 'Space') { e.preventDefault(); this.toggle(); }
        if (e.key === 'r' || e.key === 'R') this.reseed();
      });
    }

    // ——— Exports ———
    download(filename, data) {
      const url = data instanceof Blob ? URL.createObjectURL(data) : data;
      const a = el('a', { href: url, download: filename });
      document.body.append(a);
      a.click();
      a.remove();
      if (data instanceof Blob) setTimeout(() => URL.revokeObjectURL(url), 2000);
    }

    async exportPNG(scale) {
      const ex = this.opts.export || {};
      let out = typeof ex.png === 'function' ? await ex.png(scale, this) : this.canvas;
      if (typeof out === 'string') return this.download(`${this.exportName}-${this.seed}.png`, out);
      if (out instanceof Blob) return this.download(`${this.exportName}-${this.seed}.png`, out);
      out.toBlob((b) => this.download(`${this.exportName}-${this.seed}.png`, b), 'image/png');
    }

    exportSVG() {
      const text = this.opts.export.svg(this);
      this.download(`${this.exportName}-${this.seed}.svg`, new Blob([text], { type: 'image/svg+xml' }));
    }

    exportVideo(seconds) {
      if (this.recording) return;
      const ex = this.opts.export;
      const source = typeof ex.video === 'function' ? ex.video(this) : this.canvas;
      const type = ['video/mp4;codecs=avc1', 'video/webm;codecs=vp9', 'video/webm'].find((t) => MediaRecorder.isTypeSupported(t));
      const stream = source.captureStream(60);
      const rec = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 16e6 });
      const chunks = [];
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      rec.onstop = () => {
        this.recording = false;
        this.root.classList.remove('at-recording');
        this.videoBtn.disabled = false;
        const ext = type.startsWith('video/mp4') ? 'mp4' : 'webm';
        this.download(`${this.exportName}-${this.seed}.${ext}`, new Blob(chunks, { type: type.split(';')[0] }));
      };
      this.recording = true;
      this.videoBtn.disabled = true;
      this.root.classList.add('at-recording');
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
  }

  const Atelier = { app: (opts) => new App(opts), rng, version: '1.0.0', instance: null };
  window.Atelier = Atelier;
})();
