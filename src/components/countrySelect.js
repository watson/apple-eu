import { el } from '../dom.js';
import { COUNTRIES } from '../data/countries.js';
import { getState, setState } from '../state.js';

export function countrySelect({ id, placeholder = 'Choose your EU country' } = {}) {
  const sel = el('select', { class: 'select', id, 'aria-label': 'Your EU country' },
    el('option', { value: '' }, placeholder),
    COUNTRIES.map((c) => el('option', { value: c.code }, `${c.flag} ${c.name}`)),
  );
  sel.value = getState().country || '';
  sel.addEventListener('change', () => setState({ country: sel.value || null, langsManual: false }));
  return sel;
}

export function syncCountrySelects() {
  const value = getState().country || '';
  document.querySelectorAll('select.select[aria-label="Your EU country"]').forEach((s) => { if (s.value !== value) s.value = value; });
}
