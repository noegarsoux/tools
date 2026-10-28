const $ = (s) => document.querySelector(s);
const AUTHORS = { claude: 'Claude', cursor: 'Cursor', human: 'Humain' };

const res = await fetch('tools.json', { cache: 'no-cache' }).catch(() => null);
if (!res || !res.ok) {
  $('#status').textContent = "Impossible de charger la bibliothèque.";
  throw new Error('tools.json');
}
const { types, tools } = await res.json();

const state = { type: new URLSearchParams(location.search).get('type') || 'all', q: '' };

function chips() {
  const counts = Object.fromEntries(Object.keys(types).map((t) => [t, 0]));
  tools.forEach((t) => counts[t.type]++);
  const items = [['all', 'Tout', tools.length], ...Object.entries(types).filter(([t]) => counts[t]).map(([t, l]) => [t, l, counts[t]])];
  $('#chips').replaceChildren(...items.map(([key, label, n]) => {
    const b = document.createElement('button');
    b.className = 'chip';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', String(state.type === key));
    b.innerHTML = `${label}<span>${n}</span>`;
    b.onclick = () => { state.type = key; syncUrl(); chips(); render(); };
    return b;
  }));
}

function syncUrl() {
  const u = new URL(location);
  state.type === 'all' ? u.searchParams.delete('type') : u.searchParams.set('type', state.type);
  history.replaceState(null, '', u);
}

function card(t) {
  const el = $('#card').content.firstElementChild.cloneNode(true);
  el.querySelector('.thumb').href = el.querySelector('.open').href = t.url;
  const img = el.querySelector('img');
  img.src = t.thumbnail;
  img.alt = `Aperçu de ${t.title}`;
  el.querySelector('.type').textContent = types[t.type];
  el.querySelector('.author').textContent = AUTHORS[t.author] ?? t.author;
  el.querySelector('h3').textContent = t.title;
  el.querySelector('.desc').textContent = t.description;
  el.querySelector('.open').setAttribute('aria-label', `Ouvrir ${t.title} dans un nouvel onglet`);
  return el;
}

function render() {
  const q = state.q.trim().toLowerCase();
  const match = (t) => (state.type === 'all' || t.type === state.type)
    && (!q || [t.title, t.description, ...(t.tags || [])].join(' ').toLowerCase().includes(q));
  const visible = tools.filter(match);
  $('#count').textContent = `${tools.length} outil${tools.length > 1 ? 's' : ''} · ${Object.keys(types).filter((k) => tools.some((t) => t.type === k)).length} types`;

  if (!visible.length) {
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = tools.length ? 'Aucun outil ne correspond.' : 'La bibliothèque est encore vide.';
    return $('#library').replaceChildren(p);
  }
  const sections = Object.keys(types).map((type) => {
    const list = visible.filter((t) => t.type === type);
    if (!list.length) return null;
    const s = document.createElement('section');
    s.className = 'section';
    s.innerHTML = `<h2>${types[type]} · ${list.length}</h2>`;
    const g = document.createElement('div');
    g.className = 'grid';
    g.append(...list.map(card));
    s.append(g);
    return s;
  }).filter(Boolean);
  $('#library').replaceChildren(...sections);
}

$('#search').addEventListener('input', (e) => { state.q = e.target.value; render(); });
chips();
render();
