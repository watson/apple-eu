// Page-wide settings popover behind the gear button in the top bar.
import { el, clear, fmtDate } from '../dom.js';
import { getState, setState, subscribe } from '../state.js';
import { FX } from '../data/fx.js';

export function initSettings() {
  const btn = document.getElementById('settings-toggle');
  const panel = document.getElementById('settings-panel');
  if (!btn || !panel) return;

  const render = () => {
    const state = getState();
    const rate = el('input', { type: 'number', step: '0.01', min: '0.5', max: '2', value: state.fx.toFixed(2), id: 'setting-fx' });
    rate.addEventListener('change', () => { const n = Number(rate.value); if (n > 0.3 && n < 3) setState({ fx: n }); });
    clear(panel);
    panel.append(
      el('h4', {}, 'Settings'),
      el('div', { class: 'setting' },
        el('label', { for: 'setting-fx' }, 'US dollars per euro'),
        el('div', { class: 'setting-row' }, rate, el('button', { class: 'btn', type: 'button', onclick: () => setState({ fx: FX.rates.USD }) }, 'Reset')),
        el('p', { class: 'note' }, `Used for every euro conversion on this page. Default ${FX.rates.USD.toFixed(2)} is the European Central Bank\u2019s average daily reference rate from ${fmtDate(FX.from)} to ${fmtDate(FX.to)}. Other currencies use the same average and are not adjustable.`),
      ),
    );
  };

  const open = () => { render(); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); panel.querySelector('input')?.focus(); };
  const close = () => { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (panel.hidden ? open() : close()));
  document.addEventListener('click', (e) => { if (!panel.hidden && !panel.contains(e.target) && e.target !== btn) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { close(); btn.focus(); } });
  subscribe((state, prev) => { if (!panel.hidden && state.fx !== prev.fx) render(); });
}
