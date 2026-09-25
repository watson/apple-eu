import { el } from '../dom.js';
import { getState, setState } from '../state.js';
import { US_STATES, US_AVERAGE_RATE } from '../data/us-sales-tax.js';

/** Dropdown bound to state.usState: which US sales-tax rate to add to US prices. */
export function usStateSelect() {
  const sel = el('select', { class: 'select', 'aria-label': 'US state for sales tax' },
    el('option', { value: 'AVG' }, `US average (${US_AVERAGE_RATE.toFixed(2)}% sales tax)`),
    el('option', { value: 'NONE' }, 'List price, no sales tax'),
    US_STATES.map((s) => el('option', { value: s.code }, `${s.name} (${s.combined.toFixed(2)}%)`)),
  );
  sel.value = getState().usState;
  sel.addEventListener('change', () => setState({ usState: sel.value }));
  return el('label', { class: 'toggle' }, el('span', { class: 'muted', style: { fontWeight: '500' } }, 'US sales tax'), sel);
}
