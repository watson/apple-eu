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

/** Switch bound to state.exVat: show EU prices before VAT and US prices before sales tax. */
export function exVatToggle() {
  const input = el('input', { type: 'checkbox', checked: getState().exVat || null });
  input.addEventListener('change', () => setState({ exVat: input.checked }));
  return el('label', { class: 'toggle', title: 'EU prices before VAT at the standard national rate; US prices at list, without sales tax.' },
    input, el('span', {}, 'Remove VAT and sales tax'));
}

