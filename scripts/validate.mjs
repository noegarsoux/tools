// Garde-fou qualité : un outil n'est publié que s'il passe tous ces contrôles.
// Usage : node scripts/validate.mjs [slug ...] [--thumbs]
//   sans slug  → valide tous les outils
//   --thumbs   → régénère thumbnail.jpg même s'il existe déjà
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { ROOT, TOOLS_DIR, listToolDirs, readMeta, serve } from './lib.mjs';

const args = process.argv.slice(2);
const forceThumbs = args.includes('--thumbs');
const only = args.filter((a) => !a.startsWith('--'));
const dirs = only.length ? only : listToolDirs();

const MAX_BYTES = 3 * 1024 * 1024;
const TEXT_EXT = new Set(['.html', '.js', '.mjs', '.css', '.glsl', '.json']);
const UNFINISHED = /\b(TODO|FIXME|XXX|lorem ipsum|coming soon|placeholder text|à venir|work in progress)\b/i;
// Seules ces sources externes sont autorisées, et toujours avec une version exacte.
const CDN = /^https:\/\/(cdn\.jsdelivr\.net\/npm\/|cdnjs\.cloudflare\.com\/ajax\/libs\/|unpkg\.com\/|fonts\.googleapis\.com\/|fonts\.gstatic\.com\/)/;
const PINNED = /@\d+\.\d+\.\d+|\/\d+\.\d+\.\d+\/|fonts\.(googleapis|gstatic)\.com/;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]);
}

function staticChecks(dir) {
  const errors = [];
  const base = path.join(TOOLS_DIR, dir);
  if (!fs.existsSync(path.join(base, 'index.html'))) errors.push('index.html manquant');
  const files = walk(base);
  const size = files.reduce((s, f) => s + fs.statSync(f).size, 0);
  if (size > MAX_BYTES) errors.push(`dossier trop lourd : ${(size / 1e6).toFixed(1)} Mo (max 3 Mo)`);
  for (const f of files) {
    if (!TEXT_EXT.has(path.extname(f)) || f.endsWith('tool.json')) continue;
    const src = fs.readFileSync(f, 'utf8');
    const rel = path.relative(base, f);
    const m = src.match(UNFINISHED);
    if (m) errors.push(`${rel} : marqueur d'outil inachevé « ${m[0]} »`);
    for (const [, url] of src.matchAll(/(?:src|href)\s*=\s*["'](https?:\/\/[^"']+)["']|import\s[^'"]*["'](https?:\/\/[^"']+)["']/g)) {
      if (!url) continue;
      if (!CDN.test(url)) errors.push(`${rel} : ressource externe non autorisée ${url}`);
      else if (!PINNED.test(url)) errors.push(`${rel} : version non figée pour ${url}`);
    }
  }
  return errors;
}

// Mesure la variance de l'image pour détecter un rendu vide ou uni.
async function imageVariance(page, png) {
  return page.evaluate(async (b64) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + b64;
    await img.decode();
    const c = new OffscreenCanvas(160, 100);
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0, 160, 100);
    const d = ctx.getImageData(0, 0, 160, 100).data;
    let sum = 0, sq = 0, n = d.length / 4;
    for (let i = 0; i < d.length; i += 4) {
      const l = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      sum += l; sq += l * l;
    }
    return sq / n - (sum / n) ** 2;
  }, png.toString('base64'));
}

async function browserChecks(browser, origin, dir) {
  const errors = [];
  const url = `${origin}/tools/${dir}/`;
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 750 }, acceptDownloads: true });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`erreur JS : ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console.error : ${m.text()}`); });
  page.on('requestfailed', (r) => errors.push(`requête échouée : ${r.url()}`));
  page.on('response', (r) => { if (r.status() >= 400) errors.push(`HTTP ${r.status()} : ${r.url()}`); });
  page.on('dialog', (d) => d.dismiss());

  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(2500);

  const info = await page.evaluate(() => ({
    kit: !!(window.Atelier && window.Atelier.instance && document.querySelector('.at-app .at-stage')),
    ownPanel: !!document.querySelector('body > :not(.at-app):not(script):not(template) input, body > :not(.at-app):not(script):not(template) button'),
    title: document.title.trim(),
    controls: document.querySelectorAll('input, select, button, textarea, [contenteditable="true"]').length,
    lang: document.documentElement.lang,
    viewport: !!document.querySelector('meta[name="viewport"]'),
  }));
  if (!info.kit) errors.push("l'outil n'utilise pas le kit d'interface commun (Atelier.app, voir AGENTS.md)");
  if (info.ownPanel) errors.push("contrôles hors du panneau Atelier : tous les réglages doivent passer par Atelier.app({ params })");
  if (!info.title) errors.push('<title> vide');
  if (!info.viewport) errors.push('balise <meta name="viewport"> manquante');
  if (info.controls === 0) errors.push("aucun contrôle interactif : un outil doit exposer au moins un réglage");

  // Barre de qualité : réglages, presets, interaction directe, inspiration.
  if (info.kit) {
    const q = await page.evaluate(() => {
      const a = window.Atelier.instance, o = a.opts;
      const own = Object.entries(a.specs).filter(([k, s]) => !s.internal && !['grain', 'vignette'].includes(k)).length;
      return { own, presets: Object.keys(o.presets || {}).length, pointer: !!o.pointer && Object.keys(o.pointer).length > 0, hint: !!o.hint, version: window.Atelier.version };
    });
    if (q.own < 10) errors.push(`seulement ${q.own} réglages propres à l'outil (minimum 10) : tout ce qui influence le rendu doit être réglable`);
    if (q.presets < 4) errors.push(`seulement ${q.presets} presets (minimum 4)`);
    if (!q.pointer) errors.push("pas d'interaction sur la scène : déclare pointer: { down, drag, move… } dans Atelier.app");
    if (q.pointer && !q.hint) errors.push("interaction non annoncée : ajoute hint: 'Glissez pour …' dans Atelier.app");
  }
  const { meta } = readMeta(dir);
  if (!meta?.inspiration?.length) errors.push("tool.json : champ inspiration manquant (sources de references/ qui ont nourri l'outil)");

  const shot = await page.screenshot();
  if ((await imageVariance(page, shot)) < 20) errors.push('rendu vide ou uni après 2,5 s');

  // Test de fumée : on manipule chaque contrôle et on vérifie qu'aucune erreur n'apparaît.
  const before = errors.length;
  const controls = await page.$$('input[type=range], input[type=checkbox], input[type=color], select, button:not([data-skip-test])');
  for (const el of controls.slice(0, 120)) {
    if (!(await el.isVisible())) continue;
    const kind = await el.evaluate((e) => e.tagName.toLowerCase() + ':' + (e.type || ''));
    try {
      if (kind === 'input:range') await el.evaluate((e) => { e.value = +e.min + Math.random() * (+e.max - +e.min); e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); });
      else if (kind === 'input:color') await el.evaluate((e) => { e.value = '#ff3366'; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); });
      else if (kind.startsWith('select')) await el.evaluate((e) => { e.selectedIndex = (e.selectedIndex + 1) % e.options.length; e.dispatchEvent(new Event('change', { bubbles: true })); });
      else await el.click({ timeout: 1000 });
    } catch { /* contrôle masqué ou recouvert : ignoré */ }
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(500);
  if (errors.length > before) errors.push('(erreurs déclenchées en manipulant les contrôles)');

  // Formats : chaque format doit rendre sans erreur, et l'export d'image doit produire la bonne taille.
  if (info.kit) {
    const beforeFmt = errors.length;
    await page.evaluate(() => window.Atelier.instance.reset());
    for (const fmt of ['9:16', '1:1', '16:9']) {
      await page.evaluate((f) => window.Atelier.instance.apply({ _fmt: f, _res: 1 }), fmt);
      await page.waitForTimeout(700);
      const fshot = await page.locator('.at-frame').screenshot();
      if ((await imageVariance(page, fshot)) < 20) errors.push(`rendu vide ou uni au format ${fmt}`);
    }
    const out = await page.evaluate(async () => {
      const c = await window.Atelier.instance.renderImage();
      return [c.width, c.height];
    }).catch((e) => { errors.push(`export d'image : ${e.message}`); return null; });
    if (out && (out[0] !== 1920 || out[1] !== 1080)) errors.push(`export 16:9 attendu en 1920×1080, obtenu ${out[0]}×${out[1]}`);
    await page.evaluate(() => window.Atelier.instance.reset());
    if (errors.length > beforeFmt) errors.push('(erreurs liées aux formats ou aux exports)');
  }

  // Mobile : pas de défilement horizontal.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(800);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 1) errors.push(`déborde horizontalement de ${overflow}px sur mobile (390px)`);

  // Miniature : capture 1200×750 après rechargement propre.
  const thumb = path.join(TOOLS_DIR, dir, 'thumbnail.jpg');
  if (forceThumbs || !fs.existsSync(thumb)) {
    // Mode miniature du kit : seule la scène est affichée, en plein cadre.
    await page.setViewportSize({ width: 1200, height: 750 });
    await page.goto(url + '?thumbnail', { waitUntil: 'load' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: thumb, type: 'jpeg', quality: 82 });
  }
  await ctx.close();
  return errors;
}

const server = await serve(ROOT);
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
let failed = 0;
for (const dir of dirs) {
  if (!fs.existsSync(path.join(TOOLS_DIR, dir))) { console.error(`✗ ${dir} : dossier introuvable`); failed++; continue; }
  const errors = [...readMeta(dir).errors, ...staticChecks(dir)];
  if (fs.existsSync(path.join(TOOLS_DIR, dir, 'index.html'))) errors.push(...(await browserChecks(browser, origin, dir)));
  const unique = [...new Set(errors)];
  if (unique.length) { failed++; console.error(`✗ ${dir}\n  - ${unique.join('\n  - ')}`); }
  else console.log(`✓ ${dir}`);
}
await browser.close();
server.close();
console.log(`\n${dirs.length - failed}/${dirs.length} outil(s) valide(s)`);
process.exit(failed ? 1 : 0);
