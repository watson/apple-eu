// Tiny DOM helpers. All text goes through textContent; `html` is only used for
// trusted static strings written in this repository.

export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
    else if (k === 'html') node.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else node.setAttribute(k, v === true ? '' : String(v));
  }
  append(node, children);
  return node;
}

export function svg(tag, attrs = {}, ...children) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else node.setAttribute(k, String(v));
  }
  append(node, children);
  return node;
}

function append(node, children) {
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
  return node;
}

export function mount(id, ...children) {
  const node = document.getElementById(id);
  if (!node) return null;
  clear(node);
  append(node, children);
  return node;
}

export function fmtMoney(value, currency, { maxFrac = 2 } = {}) {
  if (value == null || !currency) return '—';
  try {
    const minFrac = Math.min(maxFrac, Number.isInteger(value) ? 0 : 2);
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency, maximumFractionDigits: maxFrac, minimumFractionDigits: minFrac }).format(value);
  } catch {
    return `${value} ${currency}`;
  }
}

export function fmtDate(iso) {
  if (!iso) return 'undated';
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, (m || 1) - 1, d || 1));
  return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}
