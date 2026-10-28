import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { TYPES } from './types.mjs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const TOOLS_DIR = path.join(ROOT, 'tools');

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const TAG = /^[a-z0-9-]+$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const KEYS = ['slug', 'title', 'type', 'description', 'tags', 'inspiration', 'author', 'created', 'status'];

export function listToolDirs() {
  if (!fs.existsSync(TOOLS_DIR)) return [];
  return fs.readdirSync(TOOLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('_') && !d.name.startsWith('.'))
    .map((d) => d.name)
    .sort();
}

// Vérifie tool.json sans dépendance externe. Miroir de schema/tool.schema.json.
export function readMeta(dir) {
  const errors = [];
  const file = path.join(TOOLS_DIR, dir, 'tool.json');
  if (!fs.existsSync(file)) return { meta: null, errors: ['tool.json manquant'] };
  let meta;
  try {
    meta = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return { meta: null, errors: [`tool.json invalide : ${e.message}`] };
  }
  for (const k of Object.keys(meta)) if (!KEYS.includes(k)) errors.push(`clé inconnue "${k}"`);
  const str = (k, min, max) => {
    if (typeof meta[k] !== 'string') return errors.push(`"${k}" doit être une chaîne`);
    if (meta[k].length < min || meta[k].length > max) errors.push(`"${k}" doit faire ${min} à ${max} caractères (actuel : ${meta[k].length})`);
  };
  if (meta.slug !== dir) errors.push(`"slug" doit être égal au nom du dossier (${dir})`);
  if (!SLUG.test(dir)) errors.push('le nom du dossier doit être en kebab-case');
  str('title', 3, 40);
  str('description', 40, 180);
  if (!(meta.type in TYPES)) errors.push(`"type" doit être l'un de : ${Object.keys(TYPES).join(', ')}`);
  if (meta.tags !== undefined && (!Array.isArray(meta.tags) || meta.tags.length > 6 || meta.tags.some((t) => !TAG.test(t)))) {
    errors.push('"tags" : 6 max, en kebab-case');
  }
  if (meta.inspiration !== undefined && (!Array.isArray(meta.inspiration) || meta.inspiration.length > 5 || meta.inspiration.some((t) => typeof t !== 'string' || t.length < 3 || t.length > 160))) {
    errors.push('"inspiration" : 1 à 5 sources de 3 à 160 caractères');
  }
  if (!['claude', 'cursor', 'human'].includes(meta.author)) errors.push('"author" doit être claude, cursor ou human');
  if (!DATE.test(meta.created ?? '')) errors.push('"created" doit être au format AAAA-MM-JJ');
  if (meta.status !== 'finished') errors.push('"status" doit être "finished" (seuls les outils terminés sont publiés)');
  return { meta, errors };
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm', '.woff2': 'font/woff2', '.glsl': 'text/plain', '.mp3': 'audio/mpeg', '.wav': 'audio/wav',
};

// Petit serveur statique, utilisé par `npm run dev` et par la validation.
export function serve(dir, port = 0) {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = path.join(dir, p);
    if (!file.startsWith(dir)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) return res.writeHead(404).end('Not found');
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
}
