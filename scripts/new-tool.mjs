// Crée tools/<slug>/ à partir du gabarit. Usage : npm run new -- <slug> "<Titre>" <type> <claude|cursor|human>
import fs from 'node:fs';
import path from 'node:path';
import { TOOLS_DIR } from './lib.mjs';
import { TYPES } from './types.mjs';

const [slug, title, type, author = 'human'] = process.argv.slice(2);
if (!slug || !title || !(type in TYPES)) {
  console.error(`Usage : npm run new -- <slug> "<Titre>" <${Object.keys(TYPES).join('|')}> <claude|cursor|human>`);
  process.exit(1);
}
const dest = path.join(TOOLS_DIR, slug);
if (fs.existsSync(dest)) { console.error(`tools/${slug} existe déjà`); process.exit(1); }
fs.cpSync(path.join(TOOLS_DIR, '_template'), dest, { recursive: true });
const html = path.join(dest, 'index.html');
fs.writeFileSync(html, fs.readFileSync(html, 'utf8').replaceAll('{{TITLE}}', title));
fs.writeFileSync(path.join(dest, 'tool.json'), JSON.stringify({
  slug, title, type, description: '', tags: [], inspiration: [], author,
  created: new Date().toISOString().slice(0, 10), status: 'finished',
}, null, 2) + '\n');
console.log(`tools/${slug}/ créé. Compléter index.html et la description, puis : npm run validate -- ${slug}`);
