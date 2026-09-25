import { el, mount, clear } from '../dom.js';
import { getState, setState, subscribe } from '../state.js';
import { evaluate, VERDICT_LABEL } from '../context.js';
import { CATEGORIES } from '../data/features.js';
import { COUNTRIES } from '../data/countries.js';
import { AVAILABILITY } from '../data/availability.js';
import { statusChip, verdictPill, sourceLinks } from '../components/chips.js';

const expanded = new Set();
const lastRows = new Map(); // feature id -> { f, verdict, eu } from the latest render
const FILTERS = ['all', 'us', 'eu', 'same', 'depends'];

export function initScorecard() {
  renderFilters();
  renderList();
  subscribe((state, prev) => {
    if (state.country !== prev.country || state.langs !== prev.langs) { renderFilters(); renderList(); }
  });
}

function renderFilters() {
  const state = getState();
  const rows = evaluate(state);
  const count = (v) => v === 'all' ? rows.length : rows.filter((r) => r.verdict === v || (v === 'depends' && r.verdict === 'mixed')).length;

  const seg = el('div', { class: 'segmented', role: 'group', 'aria-label': 'Filter by outcome' },
    FILTERS.map((v) => el('button', {
      type: 'button', 'aria-pressed': String(state.filter === v),
      onclick: () => { setState({ filter: v }); renderFilters(); renderList(); },
    }, v === 'all' ? 'All' : VERDICT_LABEL[v], el('span', { class: 'count' }, String(count(v))))),
  );

  const cat = el('select', { class: 'select', 'aria-label': 'Category' },
    el('option', { value: 'all' }, 'All categories'),
    CATEGORIES.map((k) => el('option', { value: k.id }, k.name)),
  );
  cat.value = state.category;
  cat.addEventListener('change', () => { setState({ category: cat.value }); renderList(); });

  const search = el('input', { class: 'search', type: 'search', placeholder: 'Search features…', value: state.query, 'aria-label': 'Search features' });
  search.addEventListener('input', () => { setState({ query: search.value }); renderList(); });

  mount('scorecard-filters', el('div', { class: 'filter-row' }, seg, cat, el('span', { class: 'spacer' }), search));
}

function renderList() {
  const state = getState();
  const rows = evaluate(state);
  const q = state.query.trim().toLowerCase();
  const visible = rows.filter(({ f, verdict }) => {
    if (state.filter !== 'all' && !(verdict === state.filter || (state.filter === 'depends' && verdict === 'mixed'))) return false;
    if (state.category !== 'all' && f.category !== state.category) return false;
    if (q && !`${f.title} ${f.short} ${f.detail}`.toLowerCase().includes(q)) return false;
    return true;
  });

  const root = clear(document.getElementById('scorecard-list'));
  if (!visible.length) { root.append(el('div', { class: 'empty' }, 'Nothing matches those filters.')); return; }

  root.append(el('div', { class: 'scorecard-head' }, el('span', {}, 'Feature'), el('span', {}, 'United States'), el('span', {}, state.country ? `EU · ${state.country}` : 'European Union'), el('span', {}, 'Who is ahead'), el('span', {})));

  lastRows.clear();
  for (const r of rows) lastRows.set(r.f.id, r);
  for (const cat of CATEGORIES) {
    const items = visible.filter((r) => r.f.category === cat.id);
    if (!items.length) continue;
    root.append(el('div', { class: 'category-head' }, el('h3', {}, cat.name), el('span', { class: 'count' }, `${items.length}`)));
    const list = el('div', { class: 'scorecard' });
    for (const r of items) list.append(row(r, state));
    root.append(list);
  }
}

function row({ f, verdict, eu }, state) {
  const isOpen = expanded.has(f.id);
  const detail = isOpen ? detailPanel(f, eu, state) : null;
  const btn = el('div', {
    class: 'score-row', role: 'button', tabindex: '0', 'aria-expanded': String(isOpen), id: `feature-${f.id}`,
    onclick: () => toggle(f.id),
    onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(f.id); } },
  },
    el('div', {}, el('div', { class: 'title' }, f.title), el('div', { class: 'short' }, f.short)),
    el('div', { class: 'cell us' }, el('span', { class: 'region' }, 'US'), statusChip(f.us)),
    el('div', { class: 'cell eu' }, el('span', { class: 'region' }, state.country || 'EU'), statusChip(eu)),
    el('div', { class: 'cell' }, verdictPill(verdict)),
    el('span', { class: 'caret', 'aria-hidden': 'true' }, '⌄'),
  );
  const wrap = el('div', {}, btn, detail);
  return wrap;
}

// Expand or collapse a single row in place, so the page keeps its scroll position.
function toggle(id) {
  const btn = document.getElementById(`feature-${id}`);
  const r = lastRows.get(id);
  if (!btn || !r) return;
  const wrap = btn.parentElement;
  if (expanded.has(id)) {
    expanded.delete(id);
    wrap.querySelector('.score-detail')?.remove();
    btn.setAttribute('aria-expanded', 'false');
  } else {
    expanded.add(id);
    wrap.append(detailPanel(r.f, r.eu, getState()));
    btn.setAttribute('aria-expanded', 'true');
  }
}

function detailPanel(f, eu, state) {
  const parts = [el('p', {}, f.detail)];
  if (f.eu.avail && AVAILABILITY[f.eu.avail]) {
    const list = AVAILABILITY[f.eu.avail];
    parts.push(el('p', { class: 'muted', style: { marginTop: '10px', fontSize: '13px' } }, `EU member states where Apple lists it (${list.length} of 27):`));
    parts.push(el('div', { class: 'country-list' },
      COUNTRIES.map((c) => el('span', { class: `${list.includes(c.code) ? '' : 'off'} ${state.country === c.code ? 'me' : ''}`.trim(), title: c.name }, `${c.flag} ${c.code}`)),
    ));
  }
  if (f.tags?.includes('dma')) parts.push(el('p', { style: { marginTop: '10px' } }, el('span', { class: 'tag' }, 'Digital Markets Act')));
  parts.push(sourceLinks(f.sources));
  return el('div', { class: 'score-detail' }, parts);
}
