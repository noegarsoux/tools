// Bibliothèque Atelier : channels (types) → blocks (outils) → vue block, routage par hash.
const $ = (s) => document.querySelector(s);
const AUTHORS = { claude: 'Claude', cursor: 'Cursor', human: 'Atelier' };
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const date = (d) => new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
const plural = (n, w) => `${n} ${w}${n > 1 ? 's' : ''}`;

const res = await fetch('tools.json', { cache: 'no-cache' }).catch(() => null);
if (!res?.ok) {
  $('#view').innerHTML = '<p class="empty">Impossible de charger la bibliothèque.</p>';
  throw new Error('tools.json');
}
const data = await res.json();
const { types, descriptions = {} } = data;

// Stockage local (favoris, outils supprimés en attente de republication, clé d'admin).
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del(k) { try { localStorage.removeItem(k); } catch {} },
};
const FAVS = 'atelier:favoris', GONE = 'atelier:supprimes', KEY = 'atelier:cle-admin';
// Un outil supprimé reste dans tools.json jusqu'à la republication du site : on le masque d'ici là.
const gone = store.get(GONE, []).filter((s) => data.tools.some((t) => t.slug === s));
store.set(GONE, gone);
let tools = data.tools.filter((t) => !gone.includes(t.slug));
let favs = new Set(store.get(FAVS, []).filter((s) => tools.some((t) => t.slug === s)));
const isFav = (slug) => favs.has(slug);
const favTools = () => tools.filter((t) => favs.has(t.slug));
function toggleFav(slug) {
  favs.has(slug) ? favs.delete(slug) : favs.add(slug);
  store.set(FAVS, [...favs]);
  updateFavUI(slug);
}
const STAR = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.6l1.95 4.1 4.45.55-3.27 3.08.84 4.42L8 11.6l-3.97 2.15.84-4.42L1.6 6.25l4.45-.55z"/></svg>';
const favLabel = (slug) => (isFav(slug) ? 'Retirer des favoris' : 'Ajouter aux favoris');
const favBtn = (t, cls = 'fav') => `<button type="button" class="${cls}" data-fav="${t.slug}" data-name="${esc(t.title)}" aria-pressed="${isFav(t.slug)}" aria-label="${favLabel(t.slug)} : ${esc(t.title)}" title="${favLabel(t.slug)}">${STAR}</button>`;
const byType = (t) => tools.filter((x) => x.type === t);
let list = tools; // liste courante, pour la navigation précédent/suivant dans la vue block

function blocks(items) {
  if (!items.length) return '<p class="empty">Aucun bloc pour l\'instant.</p>';
  return `<div class="blocks">${items.map((t) => `
    <div class="blk">
      <a class="hit" href="#/bloc/${t.slug}">
        <div class="frame"><img src="${t.thumbnail}" alt="" loading="lazy"></div>
        <div class="cap"><b>${esc(t.title)}</b><span>${esc(types[t.type])}</span></div>
      </a>
      ${favBtn(t)}
    </div>`).join('')}</div>`;
}

function home() {
  const updated = tools.reduce((m, t) => (t.created > m ? t.created : m), '');
  const order = Object.keys(types).sort((a, b) => (byType(b).length > 0) - (byType(a).length > 0));
  const chans = order.map((k) => {
    const items = byType(k);
    const last = items[0]?.created;
    return `<a class="channel${items.length ? '' : ' empty-ch'}" href="#/channel/${k}">
      <h2>${esc(types[k])}</h2>
      <span class="meta">${items.length ? plural(items.length, 'bloc') : 'Aucun bloc'}${last ? ` · ${date(last)}` : ''}</span>
      <div class="mosaic">${items.slice(0, 3).map((t) => `<img src="${t.thumbnail}" alt="" loading="lazy">`).join('')}</div>
    </a>`;
  }).join('');
  return `<section class="head">
      <h1>Outils de creative coding pour construire des identités de marque.</h1>
      <p>Chaque outil est une matière première : on y met sa marque, on explore, on exporte.</p>
      <span class="meta">${plural(tools.length, 'bloc')} · ${plural(Object.keys(types).filter((k) => byType(k).length).length, 'channel')}${updated ? ` · mis à jour le ${date(updated)}` : ''}</span>
    </section>
    <div class="channels">${chans}</div>
    ${favs.size ? `<h2 class="label">Favoris <a class="more" href="#/favoris">Tout voir</a></h2>${blocks(favTools().slice(0, 6))}` : ''}
    <h2 class="label">Derniers blocs</h2>
    ${blocks(tools.slice(0, 12))}`;
}

function channel(k) {
  const items = byType(k);
  list = items;
  return `<section class="head">
      <span class="crumbs"><a href="#/">Atelier</a> / ${esc(types[k])}</span>
      <h1>${esc(types[k])}</h1>
      ${descriptions[k] ? `<p>${esc(descriptions[k])}</p>` : ''}
      <span class="meta">${plural(items.length, 'bloc')}</span>
    </section>${blocks(items)}`;
}

function all() {
  list = tools;
  return `<section class="head"><span class="crumbs"><a href="#/">Atelier</a> / Tous les blocs</span><h1>Tous les blocs</h1>
    <span class="meta">${plural(tools.length, 'bloc')}, du plus récent au plus ancien</span></section>${blocks(tools)}`;
}

function favorites() {
  const items = favTools();
  list = items;
  return `<section class="head"><span class="crumbs"><a href="#/">Atelier</a> / Favoris</span><h1>Favoris</h1>
    <span class="meta">${items.length ? plural(items.length, 'bloc') : 'Ajoutez des outils avec l\'étoile pour les retrouver ici.'}</span></section>${items.length ? blocks(items) : ''}`;
}

function search(q) {
  const s = q.toLowerCase();
  const items = tools.filter((t) => [t.title, t.description, types[t.type], ...(t.tags || [])].join(' ').toLowerCase().includes(s));
  list = items;
  return `<section class="head"><span class="crumbs"><a href="#/">Atelier</a> / Recherche</span><h1>« ${esc(q)} »</h1>
    <span class="meta">${plural(items.length, 'résultat')}</span></section>${blocks(items)}`;
}

function openBlock(slug) {
  const t = tools.find((x) => x.slug === slug);
  const el = $('#block');
  if (!t) { el.hidden = true; return; }
  const seq = list.some((x) => x.slug === slug) ? list : tools;
  const i = seq.findIndex((x) => x.slug === slug);
  const prev = seq[i - 1], next = seq[i + 1];
  el.innerHTML = `
    <div class="bv-stage">
      <button class="bv-close" type="button">← Fermer</button>
      ${prev ? `<button class="bv-nav prev" type="button" aria-label="Bloc précédent" data-go="${prev.slug}">←</button>` : ''}
      <img src="${t.thumbnail}" alt="Aperçu de ${esc(t.title)}">
      ${next ? `<button class="bv-nav next" type="button" aria-label="Bloc suivant" data-go="${next.slug}">→</button>` : ''}
    </div>
    <aside class="bv-side">
      <h1 id="bv-title">${esc(t.title)}</h1>
      <p>${esc(t.description)}</p>
      <div class="actions">
        <a class="open" href="${t.url}" target="_blank" rel="noopener">Ouvrir l'outil <span aria-hidden="true">↗</span></a>
        ${favBtn(t, 'fav-lg')}
      </div>
      <dl class="facts">
        <dt>Ajouté par</dt><dd>${esc(AUTHORS[t.author] ?? t.author)}</dd>
        <dt>Le</dt><dd>${date(t.created)}</dd>
      </dl>
      <div class="conn"><h3>Connecté à</h3><a class="chan" href="#/channel/${t.type}">${esc(types[t.type])} <span class="meta">· ${plural(byType(t.type).length, 'bloc')}</span></a></div>
      ${t.tags?.length ? `<div class="conn"><h3>Tags</h3><div class="tags">${t.tags.map((g) => `<button type="button" data-tag="${esc(g)}">${esc(g)}</button>`).join('')}</div></div>` : ''}
      <button class="delete" type="button">Supprimer l'outil</button>
    </aside>`;
  el.hidden = false;
  document.body.style.overflow = 'hidden';
  el.querySelector('.bv-close').onclick = closeBlock;
  el.querySelectorAll('[data-go]').forEach((b) => (b.onclick = () => (location.hash = `#/bloc/${b.dataset.go}`)));
  el.querySelectorAll('[data-tag]').forEach((b) => (b.onclick = () => { $('#q').value = b.dataset.tag; location.hash = `#/recherche/${encodeURIComponent(b.dataset.tag)}`; }));
  el.querySelector('.delete').onclick = () => askDelete(t);
}

// Favoris : un clic sur une étoile, où qu'elle soit (grille ou vue block).
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-fav]');
  if (!b) return;
  e.preventDefault();
  toggleFav(b.dataset.fav);
});
function updateFavUI(slug) {
  const on = isFav(slug);
  document.querySelectorAll(`[data-fav="${slug}"]`).forEach((b) => {
    b.setAttribute('aria-pressed', on);
    b.title = favLabel(slug);
    b.setAttribute('aria-label', `${b.title} : ${b.dataset.name}`);
  });
  // La page Favoris et la section Favoris de l'accueil dépendent de la liste : on les redessine.
  if (underlying === '#/favoris' || underlying === '#/') {
    const y = scrollY;
    render(underlying);
    scrollTo(0, y);
  }
}

// Suppression définitive : fenêtre de confirmation, puis appel à la fonction serveur.
const dlg = $('#confirm');
function askDelete(t) {
  const saved = store.get(KEY, '');
  dlg.innerHTML = `
    <form method="dialog" class="cf">
      <h2 id="cf-title">Supprimer « ${esc(t.title)} » ?</h2>
      <p>L'outil sera retiré du dépôt et du site pour tout le monde. Cette action est définitive.</p>
      <label class="cf-key"${saved ? ' hidden' : ''}>
        <span>Clé d'administration</span>
        <input name="key" type="password" autocomplete="current-password" value="${esc(saved)}" required>
      </label>
      <label class="cf-check"><input name="ok" type="checkbox" required> Je confirme la suppression définitive</label>
      <p class="cf-err" role="alert" hidden></p>
      <div class="cf-btns">
        <button type="button" value="cancel" class="cf-cancel">Annuler</button>
        <button type="submit" value="delete" class="cf-go" disabled>Supprimer définitivement</button>
      </div>
    </form>`;
  const form = dlg.querySelector('form');
  const go = form.querySelector('.cf-go');
  const err = form.querySelector('.cf-err');
  const sync = () => (go.disabled = !form.ok.checked || !form.key.value.trim());
  form.addEventListener('input', sync);
  form.querySelector('.cf-cancel').onclick = () => dlg.close();
  form.onsubmit = async (e) => {
    e.preventDefault();
    go.disabled = true;
    go.textContent = 'Suppression…';
    err.hidden = true;
    const key = form.key.value.trim();
    try {
      const r = await fetch('api/delete-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({ slug: t.slug }),
      });
      const out = await r.json().catch(() => null);
      // Pas de réponse JSON : le site est servi sans la fonction serveur (GitHub Pages, serveur local).
      if (!out) throw new Error('La suppression n\'est disponible que sur le site publié par Vercel.');
      if (r.status === 401) { store.del(KEY); form.querySelector('.cf-key').hidden = false; }
      // 404 avec message : l'outil n'est déjà plus dans le dépôt, on le retire simplement de l'affichage.
      if (!r.ok && r.status !== 404) throw new Error(out.error || `Erreur ${r.status}`);
      store.set(KEY, key);
      removeLocally(t.slug);
      dlg.close();
      toast(`« ${t.title} » a été supprimé. Le site se met à jour d'ici une minute.`);
    } catch (x) {
      err.textContent = x.message;
      err.hidden = false;
      go.textContent = 'Supprimer définitivement';
      sync();
    }
  };
  dlg.showModal();
  (saved ? form.ok : form.key).focus();
}

function removeLocally(slug) {
  store.set(GONE, [...new Set([...store.get(GONE, []), slug])]);
  tools = tools.filter((t) => t.slug !== slug);
  list = list.filter((t) => t.slug !== slug);
  if (favs.delete(slug)) store.set(FAVS, [...favs]);
  const back = underlying;
  $('#block').hidden = true;
  document.body.style.overflow = '';
  render(back);
  history.replaceState(null, '', back);
}

function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.setAttribute('role', 'status');
  el.textContent = msg;
  document.body.append(el);
  setTimeout(() => el.remove(), 5000);
}

let underlying = '#/';
function closeBlock() {
  $('#block').hidden = true;
  document.body.style.overflow = '';
  location.hash = underlying;
}

function route() {
  const [, page, arg] = (location.hash || '#/').split('/');
  if (page === 'bloc') {
    if ($('#view').dataset.ready !== '1') render('#/');
    return openBlock(arg);
  }
  $('#block').hidden = true;
  document.body.style.overflow = '';
  underlying = location.hash || '#/';
  render(underlying);
}

function render(hash) {
  const [, page, arg] = hash.split('/');
  let html;
  if (page === 'channel' && types[arg]) html = channel(arg);
  else if (page === 'tous') html = all();
  else if (page === 'favoris') html = favorites();
  else if (page === 'recherche' && arg) html = search(decodeURIComponent(arg));
  else { list = tools; html = home(); }
  $('#view').innerHTML = html;
  $('#view').dataset.ready = '1';
  document.querySelectorAll('.nav a').forEach((a) => a.setAttribute('aria-current', a.getAttribute('href') === hash ? 'page' : 'false'));
  scrollTo(0, 0);
}

let timer;
$('#q').addEventListener('input', (e) => {
  clearTimeout(timer);
  const v = e.target.value.trim();
  timer = setTimeout(() => { location.hash = v ? `#/recherche/${encodeURIComponent(v)}` : '#/'; }, 200);
});
addEventListener('keydown', (e) => {
  if ($('#block').hidden || dlg.open) return;
  if (e.key === 'Escape') closeBlock();
  if (e.key === 'ArrowLeft') $('#block .prev')?.click();
  if (e.key === 'ArrowRight') $('#block .next')?.click();
});
addEventListener('hashchange', route);
route();
