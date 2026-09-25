import { el } from '../dom.js';

/**
 * A quiet row of text tabs that opens one panel at a time (or none).
 * tabs: [[id, label], ...]; panels: { id: () => Node }; active: id | null; onSelect(id | null).
 * Returns [strip, panelNode | null].
 */
export function tabPanels(tabs, panels, active, onSelect) {
  const strip = el('div', { class: 'chart-tabs', role: 'tablist' }, tabs.map(([id, label]) => el('button', {
    type: 'button', role: 'tab', 'aria-selected': String(active === id), 'aria-expanded': String(active === id),
    onclick: () => onSelect(active === id ? null : id),
  }, label)));
  return [strip, active && panels[active] ? panels[active]() : null];
}
