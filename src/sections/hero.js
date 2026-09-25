import { el, mount } from '../dom.js';
import { getState, setState, subscribe } from '../state.js';
import { countrySelect, syncCountrySelects } from '../components/countrySelect.js';
import { tally } from '../context.js';
import { FEATURES } from '../data/features.js';

const TILES = [
  { key: 'us', label: 'US-only advantages', hint: 'Things a US customer gets that an EU customer does not' },
  { key: 'eu', label: 'EU-only advantages', hint: 'Things an EU customer gets that a US customer does not' },
  { key: 'same', label: 'Same on both sides', hint: 'Available in both regions, sometimes with caveats' },
  { key: 'depends', label: 'Depends on where in the EU', hint: 'Varies by member state or language' },
];

const shown = {};

export function initHero() {
  mount('hero-picker',
    el('label', { for: 'hero-country' }, 'Where are you?'),
    countrySelect({ id: 'hero-country' }),
    el('button', { class: 'btn', type: 'button', onclick: () => setState({ country: null, langsManual: false }) }, 'Clear'),
  );
  mount('topbar-country', countrySelect({ id: 'topbar-country-select', placeholder: 'EU country' }));
  renderKpis();
  subscribe(() => { syncCountrySelects(); renderKpis(); });
}

function renderKpis() {
  const state = getState();
  const counts = tally(state);
  counts.depends += counts.mixed || 0;
  const total = FEATURES.length;
  mount('kpis',
    TILES.map((t) => {
      const value = el('div', { class: 'value' }, String(shown[t.key] ?? counts[t.key]));
      animateNumber(value, shown[t.key] ?? counts[t.key], counts[t.key]);
      shown[t.key] = counts[t.key];
      return el('div', { class: `stat ${t.key}` },
        el('div', { class: 'label' }, t.label),
        value,
        el('div', { class: 'hint' }, t.hint + (state.country && t.key === 'depends' ? '. Pick a language below to resolve the rest.' : '')),
      );
    }),
  );
  const note = document.querySelector('#kpis')?.parentElement?.querySelector('.hero-meta');
  if (note && !note.querySelector('.total')) note.prepend(el('span', { class: 'total' }, el('b', {}, `${total} documented differences`), ' compared.'));
}

function animateNumber(node, from, to) {
  if (from === to || matchMedia('(prefers-reduced-motion: reduce)').matches) { node.textContent = String(to); return; }
  const start = performance.now(); const dur = 500;
  const step = (now) => {
    const p = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    node.textContent = String(Math.round(from + (to - from) * eased));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
