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
const { types, descriptions = {}, tools } = await res.json();
const byType = (t) => tools.filter((x) => x.type === t);
let list = tools; // liste courante, pour la navigation précédent/suivant dans la vue block

function blocks(items) {
  if (!items.length) return '<p class="empty">Aucun bloc pour l\'instant.</p>';
  return `<div class="blocks">${items.map((t) => `
    <a class="blk" href="#/bloc/${t.slug}">
      <div class="frame"><img src="${t.thumbnail}" alt="" loading="lazy"></div>
      <div class="cap"><b>${esc(t.title)}</b><span>${esc(types[t.type])}</span></div>
    </a>`).join('')}</div>`;
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
      <a class="open" href="${t.url}" target="_blank" rel="noopener">Ouvrir l'outil <span aria-hidden="true">↗</span></a>
      <dl class="facts">
        <dt>Ajouté par</dt><dd>${esc(AUTHORS[t.author] ?? t.author)}</dd>
        <dt>Le</dt><dd>${date(t.created)}</dd>
      </dl>
      <div class="conn"><h3>Connecté à</h3><a class="chan" href="#/channel/${t.type}">${esc(types[t.type])} <span class="meta">· ${plural(byType(t.type).length, 'bloc')}</span></a></div>
      ${t.tags?.length ? `<div class="conn"><h3>Tags</h3><div class="tags">${t.tags.map((g) => `<button type="button" data-tag="${esc(g)}">${esc(g)}</button>`).join('')}</div></div>` : ''}
    </aside>`;
  el.hidden = false;
  document.body.style.overflow = 'hidden';
  el.querySelector('.bv-close').onclick = closeBlock;
  el.querySelectorAll('[data-go]').forEach((b) => (b.onclick = () => (location.hash = `#/bloc/${b.dataset.go}`)));
  el.querySelectorAll('[data-tag]').forEach((b) => (b.onclick = () => { $('#q').value = b.dataset.tag; location.hash = `#/recherche/${encodeURIComponent(b.dataset.tag)}`; }));
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
  if ($('#block').hidden) return;
  if (e.key === 'Escape') closeBlock();
  if (e.key === 'ArrowLeft') $('#block .prev')?.click();
  if (e.key === 'ArrowRight') $('#block .next')?.click();
});
addEventListener('hashchange', route);
route();
