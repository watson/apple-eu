import { el, fmtDate } from '../dom.js';
import { getState, setState } from '../state.js';
import { FX } from '../data/fx.js';

/** A labelled checkbox bound to state.convert. Sections re-render on change, so each instance is rebuilt in sync. */
export function fxToggle() {
  const input = el('input', { type: 'checkbox', checked: getState().convert || null });
  input.addEventListener('change', () => setState({ convert: input.checked }));
  return el('label', { class: 'toggle', title: `Approximate: converted at the European Central Bank\u2019s average daily reference rates from ${fmtDate(FX.from)} to ${fmtDate(FX.to)}.` },
    input, el('span', {}, 'Show prices in €'));
}

export const TAX_NOTE = '* US prices are before sales tax. Whether a US state taxes digital subscriptions at all varies, so none is added here; hardware prices in the iPhone chart do include the sales tax of a chosen state. EU prices include VAT.';
