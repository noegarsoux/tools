// Construit puis sert dist/ sur http://localhost:4173
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { ROOT, serve } from './lib.mjs';

execFileSync(process.execPath, [path.join(ROOT, 'scripts/build.mjs')], { stdio: 'inherit' });
await serve(path.join(ROOT, 'dist'), 4173);
console.log('→ http://localhost:4173');
