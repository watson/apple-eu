import { el, mount, clear } from '../dom.js';
import { getState, setState, subscribe } from '../state.js';
import { COUNTRIES, MAP_COLUMNS } from '../data/countries.js';
import { AVAILABILITY, RETAIL_STORE_COUNTS, TRANSIT_CITIES } from '../data/availability.js';
import { PRICING } from '../data/pricing.js';
import { attachTooltip } from '../components/tooltip.js';
import { sourceLinks } from '../components/chips.js';
import { MAP_FEATURES } from '../data/map-features.js';

export function initMap() {
  renderMap();
  renderSide();
  subscribe((state, prev) => {
    if (state.country !== prev.country || state.mapFeature !== prev.mapFeature) { renderMap(); renderSide(); }
  });
}

function current() { return MAP_FEATURES.find((m) => m.key === getState().mapFeature) || MAP_FEATURES[1]; }

function statusOf(feature, code) {
  if (feature.unknown && feature.unknown(code)) return 'unknown';
  return AVAILABILITY[feature.key]?.includes(code) ? 'on' : 'off';
}

function renderMap() {
  const state = getState();
  const feature = current();
  const root = clear(document.getElementById('tilemap'));
  root.style.gridTemplateColumns = `repeat(${MAP_COLUMNS}, minmax(0, 1fr))`;

  const usTile = el('div', { class: `tile us-ref ${feature.us ? '' : 'off'}`, role: 'img', 'aria-label': `United States: ${feature.label} ${feature.us ? 'available' : 'not available'}` },
    el('span', { class: 'flag' }, '🇺🇸'), el('span', { class: 'code' }, 'US'));
  attachTooltip(usTile, () => [{ b: 'United States' }, `${feature.label}: ${feature.us ? 'available' : 'not available'}`]);
  root.append(usTile);

  for (const c of COUNTRIES) {
    const s = statusOf(feature, c.code);
    const tile = el('button', {
      type: 'button',
      class: `tile ${s === 'on' ? 'on' : s === 'off' ? 'off' : ''} ${state.country === c.code ? 'me' : ''}`.trim(),
      style: { gridColumn: String(c.grid[0]), gridRow: String(c.grid[1]) },
      'aria-label': `${c.name}: ${feature.label} ${s === 'on' ? 'available' : s === 'off' ? 'not available' : 'not published'}${state.country === c.code ? ' (your country)' : ''}`,
      'aria-pressed': String(state.country === c.code),
      onclick: () => setState({ country: state.country === c.code ? null : c.code, langsManual: false }),
    }, el('span', { class: 'flag', 'aria-hidden': 'true' }, c.flag), el('span', { class: 'code' }, s === 'unknown' ? `${c.code}?` : c.code));
    attachTooltip(tile, () => [{ b: c.name }, `${feature.label}: ${s === 'on' ? 'available' : s === 'off' ? 'not available' : 'no Apple One page on apple.com'}`, extra(feature, c.code), state.country === c.code ? 'Your country · click to clear' : 'Click to make this your country']);
    root.append(tile);
  }
}

function extra(feature, code) {
  if (feature.key === 'retailStores' && RETAIL_STORE_COUNTS[code]) return `${RETAIL_STORE_COUNTS[code]} store${RETAIL_STORE_COUNTS[code] === 1 ? '' : 's'}`;
  if (feature.key === 'transitWallet' && TRANSIT_CITIES[code]) return Array.isArray(TRANSIT_CITIES[code]) ? TRANSIT_CITIES[code].join(', ') : String(TRANSIT_CITIES[code]);
  if (feature.key === 'appleOnePremier') {
    const p = PRICING[code]?.appleOne?.plans?.find((x) => x.tier === 'premier');
    if (p) return `${p.localName}: ${p.monthly} ${PRICING[code].currency}/month, ${p.services.length} services`;
  }
  if (feature.key === 'fitnessPlus') {
    const f = PRICING[code]?.fitnessPlus;
    if (f?.available && f.monthly) return `${f.monthly} ${PRICING[code].currency}/month`;
  }
  return null;
}

function renderSide() {
  const state = getState();
  const feature = current();
  const n = AVAILABILITY[feature.key]?.length ?? 0;
  const unknownCount = feature.unknown ? COUNTRIES.filter((c) => feature.unknown(c.code)).length : 0;

  const stat = el('div', {},
    el('div', { class: 'map-stat' }, `${n}`, el('small', {}, `of 27 EU countries`)),
    el('p', { class: 'secondary', style: { marginTop: '6px', fontSize: '14px' } },
      feature.label, feature.us ? ' · available in the US' : ' · not in the US',
      unknownCount ? ` · ${unknownCount} not published` : '',
    ),
    state.country ? el('p', { style: { fontSize: '14px', marginTop: '4px' } }, el('b', {}, `${COUNTRIES.find((c) => c.code === state.country).name}: `), statusText(statusOf(feature, state.country))) : null,
    el('div', { class: 'map-legend', style: { marginTop: '10px' } },
      el('span', {}, el('i', { style: { background: 'var(--eu)' } }), 'Available'),
      el('span', {}, el('i', { style: { background: 'var(--na-soft)', border: '1px solid var(--hair)' } }), 'Not listed'),
      unknownCount ? el('span', {}, el('i', { style: { background: 'var(--surface)', border: '1px solid var(--hair)' } }), 'Not published') : null,
      el('span', {}, el('i', { style: { background: 'var(--us)' } }), 'US reference'),
    ),
  );
  mount('map-foot', sourceLinks(feature.sources), feature.featureId ? el('a', { class: 'map-foot-link', href: `#feature-${feature.featureId}` }, 'See in scorecard ↓') : null);

  const list = el('div', { class: 'map-feature-list' });
  for (const m of MAP_FEATURES) {
    if (m.group) { list.append(el('div', { class: 'group' }, m.group)); continue; }
    list.append(el('button', { type: 'button', 'aria-pressed': String(m.key === feature.key), onclick: () => setState({ mapFeature: m.key }) },
      el('span', {}, m.label), el('span', { class: 'n' }, `${AVAILABILITY[m.key]?.length ?? 0}/27`)));
  }
  mount('map-side', stat, list);
}

function statusText(s) { return s === 'on' ? 'available' : s === 'off' ? 'not listed by Apple' : 'no Apple One page published'; }
