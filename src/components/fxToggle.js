import { el, fmtDate } from '../dom.js';
import { getState, setState } from '../state.js';
import { FX } from '../data/fx.js';

/** A labelled checkbox bound to state.convert. Sections re-render on change, so each instance is rebuilt in sync. */
export function fxToggle() {
  const input = el('input', { type: 'checkbox', checked: getState().convert || null });
  input.addEventListener('change', () => setState({ convert: input.checked }));
  return el('label', { class: 'toggle', title: `ECB reference rates averaged ${fmtDate(FX.from)} to ${fmtDate(FX.to)}` },
    input, el('span', {}, 'Convert prices to €'), el('span', { class: 'note' }, '(approximate, 12-month average)'));
}

export const TAX_NOTE = '* US prices are before state and local sales tax (0 to about 10%). EU prices include VAT.';
