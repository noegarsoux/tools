// Construit dist/ : le site + tous les outils valides + l'index tools.json.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, TOOLS_DIR, listToolDirs, readMeta } from './lib.mjs';
import { TYPES, TYPE_DESCRIPTIONS } from './types.mjs';

const DIST = path.join(ROOT, 'dist');
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, 'tools'), { recursive: true });

for (const f of ['index.html', 'assets']) fs.cpSync(path.join(ROOT, f), path.join(DIST, f), { recursive: true });

const tools = [];
let failed = false;
for (const dir of listToolDirs()) {
  const { meta, errors } = readMeta(dir);
  const thumb = path.join(TOOLS_DIR, dir, 'thumbnail.jpg');
  if (!fs.existsSync(thumb)) errors.push('thumbnail.jpg manquant (lancer `npm run validate -- ' + dir + '`)');
  if (errors.length) {
    failed = true;
    console.error(`✗ ${dir}\n  - ${errors.join('\n  - ')}`);
    continue;
  }
  fs.cpSync(path.join(TOOLS_DIR, dir), path.join(DIST, 'tools', dir), { recursive: true });
  tools.push({ ...meta, tags: meta.tags ?? [], url: `tools/${dir}/`, thumbnail: `tools/${dir}/thumbnail.jpg` });
}

tools.sort((a, b) => b.created.localeCompare(a.created) || a.title.localeCompare(b.title));
const index = { generated: new Date().toISOString(), types: TYPES, descriptions: TYPE_DESCRIPTIONS, tools };
fs.writeFileSync(path.join(DIST, 'tools.json'), JSON.stringify(index, null, 2));
console.log(`${tools.length} outil(s) publié(s) dans dist/`);
if (failed) process.exit(1);
