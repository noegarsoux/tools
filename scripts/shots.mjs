// Captures de critique visuelle pour un outil : formats, presets, état après interaction.
// Usage : npm run shots -- <slug>   → images dans .shots/<slug>/ (non versionnées)
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { ROOT, serve } from './lib.mjs';

const slug = process.argv[2];
if (!slug) { console.error('Usage : npm run shots -- <slug>'); process.exit(1); }
const out = path.join(ROOT, '.shots', slug);
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const server = await serve(ROOT);
const url = `http://127.0.0.1:${server.address().port}/tools/${slug}/`;
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
const shot = async (name) => { await page.locator('.at-frame').screenshot({ path: path.join(out, `${name}.png`) }); console.log(`  ${name}.png`); };
const app = (fn, arg) => page.evaluate(fn, arg);

await page.goto(url + '?thumbnail', { waitUntil: 'load' });
await page.waitForTimeout(3000);
await page.screenshot({ path: path.join(out, 'miniature.png') });
console.log('  miniature.png');

await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(2500);
await page.screenshot({ path: path.join(out, 'interface.png') });
console.log('  interface.png');
for (const f of ['16:9', '9:16', '1:1', '4:5']) {
  await app((v) => Atelier.instance.apply({ _fmt: v }), f);
  await page.waitForTimeout(1500);
  await shot(`format-${f.replace(':', 'x')}`);
}
await app(() => Atelier.instance.apply({ _fmt: '16:9' }));
const presets = await app(() => Object.keys(Atelier.instance.opts.presets || {}));
for (const [i, name] of presets.entries()) {
  await app((n) => Atelier.instance.applyPreset(Atelier.instance.opts.presets[n]), name);
  await page.waitForTimeout(1800);
  await shot(`preset-${i + 1}-${name.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-')}`);
}
// Geste au pointeur : un tracé en S au travers de la scène.
await app(() => Atelier.instance.reset());
await page.waitForTimeout(800);
const box = await page.locator('.at-frame').boundingBox();
await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.3);
await page.mouse.down();
for (let i = 0; i <= 40; i++) {
  const u = i / 40;
  await page.mouse.move(box.x + box.width * (0.2 + 0.6 * u), box.y + box.height * (0.5 + 0.25 * Math.sin(u * Math.PI * 2)));
  await page.waitForTimeout(25);
}
await page.mouse.up();
await page.waitForTimeout(600);
await shot('apres-interaction');
await app(() => { const a = Atelier.instance; a.brand.colors = ['#0e0e10', '#ff4d1a', '#3d2bff', '#f4efe6']; a.applyBrand(); });
await page.waitForTimeout(1200);
await shot('charte-appliquee');
await app(() => Atelier.instance.apply({ _gm: true }));
await page.waitForTimeout(800);
await shot('gradient-map');

await browser.close();
server.close();
if (errors.length) { console.error('Erreurs JS :\n' + errors.join('\n')); process.exit(1); }
console.log(`Captures dans ${path.relative(ROOT, out)}/ : regarde chacune avant de publier.`);
