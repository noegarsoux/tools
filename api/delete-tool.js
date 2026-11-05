// Fonction Vercel : supprime définitivement un outil du dépôt (tools/<slug>/) par un commit sur main.
// Le site se republie ensuite tout seul (Vercel et GitHub Pages suivent main).
//
// Variables d'environnement (réglages du projet Vercel) :
//   ATELIER_ADMIN_KEY  clé demandée dans la fenêtre de confirmation (choisie par l'équipe)
//   GITHUB_TOKEN       jeton GitHub avec le droit Contents: write sur le dépôt
//   GITHUB_REPO        facultatif, "propriétaire/dépôt" (par défaut noegarsoux/tools)
//   GITHUB_BRANCH      facultatif, branche publiée (par défaut main)
import crypto from 'node:crypto';

const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
};

const sameKey = (a, b) => {
  const x = crypto.createHash('sha256').update(String(a)).digest();
  const y = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
};

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  let raw = '';
  for await (const chunk of req) raw += chunk;
  return JSON.parse(raw || '{}');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Méthode non autorisée.' });

  const { ATELIER_ADMIN_KEY: adminKey, GITHUB_TOKEN: token } = process.env;
  const repo = process.env.GITHUB_REPO || 'noegarsoux/tools';
  const branch = process.env.GITHUB_BRANCH || 'main';
  if (!adminKey || !token) return json(res, 503, { error: 'La suppression n\'est pas encore configurée sur le serveur (ATELIER_ADMIN_KEY et GITHUB_TOKEN).' });

  let body;
  try { body = await readBody(req); } catch { return json(res, 400, { error: 'Requête illisible.' }); }
  const slug = String(body.slug || '');
  const key = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!key || !sameKey(key, adminKey)) return json(res, 401, { error: 'Clé d\'administration incorrecte.' });
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return json(res, 400, { error: 'Identifiant d\'outil invalide.' });

  const gh = async (path, init = {}) => {
    const r = await fetch(`https://api.github.com/repos/${repo}${path}`, {
      ...init,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'atelier-delete-tool',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      },
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(data.message || `GitHub ${r.status}`), { status: r.status });
    return data;
  };

  try {
    // Deux essais : si main a bougé entre-temps, la mise à jour de la référence échoue et on recommence.
    for (let attempt = 0; ; attempt++) {
      const ref = await gh(`/git/ref/heads/${branch}`);
      const head = await gh(`/git/commits/${ref.object.sha}`);
      const tree = await gh(`/git/trees/${head.tree.sha}?recursive=1`);
      if (tree.truncated) return json(res, 500, { error: 'Arbre du dépôt trop grand pour être lu en une fois.' });
      const prefix = `tools/${slug}/`;
      const files = tree.tree.filter((e) => e.type === 'blob' && e.path.startsWith(prefix));
      if (!files.length) return json(res, 404, { error: 'Cet outil n\'existe plus dans le dépôt.' });

      const next = await gh('/git/trees', {
        method: 'POST',
        body: JSON.stringify({ base_tree: head.tree.sha, tree: files.map((f) => ({ path: f.path, mode: f.mode, type: 'blob', sha: null })) }),
      });
      const commit = await gh('/git/commits', {
        method: 'POST',
        body: JSON.stringify({ message: `Suppression de l'outil ${slug}`, tree: next.sha, parents: [head.sha] }),
      });
      try {
        await gh(`/git/refs/heads/${branch}`, { method: 'PATCH', body: JSON.stringify({ sha: commit.sha, force: false }) });
        return json(res, 200, { ok: true, slug, commit: commit.sha });
      } catch (e) {
        if (attempt >= 1 || e.status !== 422) throw e;
      }
    }
  } catch (e) {
    const status = e.status === 401 || e.status === 403 || e.status === 404 ? 502 : 500;
    return json(res, status, { error: `GitHub a refusé la suppression : ${e.message}` });
  }
}
