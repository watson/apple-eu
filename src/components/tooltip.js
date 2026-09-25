import { el, clear } from '../dom.js';

const tip = () => document.getElementById('tooltip');

export function showTooltip(target, lines, evt) {
  const t = tip(); if (!t) return;
  clear(t);
  for (const line of lines) {
    if (line == null) continue;
    if (typeof line === 'string') t.append(el('div', {}, line));
    else t.append(el('div', {}, el('b', {}, line.b), line.text ? ` ${line.text}` : ''));
  }
  t.classList.add('show');
  position(evt || target);
}

export function moveTooltip(evt) { if (tip()?.classList.contains('show')) position(evt); }

export function hideTooltip() { tip()?.classList.remove('show'); }

function position(evtOrEl) {
  const t = tip();
  let x, y;
  if (evtOrEl && 'clientX' in evtOrEl) { x = evtOrEl.clientX; y = evtOrEl.clientY; }
  else if (evtOrEl?.getBoundingClientRect) { const r = evtOrEl.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top; }
  else return;
  const w = t.offsetWidth, h = t.offsetHeight;
  let left = x + 14, top = y - h - 10;
  if (left + w > innerWidth - 8) left = x - w - 14;
  if (top < 8) top = y + 18;
  t.style.left = `${Math.max(8, left)}px`;
  t.style.top = `${top}px`;
}

/** Attach hover + keyboard tooltip behaviour to an element. `getLines` returns an array for showTooltip. */
export function attachTooltip(node, getLines) {
  node.addEventListener('pointerenter', (e) => showTooltip(node, getLines(), e));
  node.addEventListener('pointermove', moveTooltip);
  node.addEventListener('pointerleave', hideTooltip);
  node.addEventListener('focus', () => showTooltip(node, getLines()));
  node.addEventListener('blur', hideTooltip);
}
