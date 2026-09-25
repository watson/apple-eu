// iPhone 18 Pro price explorer. Bars are always in euros, converted at the ECB
// twelve-month average rates (USD adjustable), so every storefront can sit on
// one axis. The "Show prices in €" toggle only changes the labels: local
// currency as advertised, or the converted euro figure.
import { el, svg, mount, fmtMoney, fmtDate } from '../dom.js';
import { getState, setState, subscribe } from '../state.js';
import { COUNTRIES } from '../data/countries.js';
import { PRICING } from '../data/pricing.js';
import { FX, toEUR } from '../data/fx.js';
import { attachTooltip } from '../components/tooltip.js';
import { sourceLinks } from '../components/chips.js';
import { fxToggle, exVatToggle } from '../components/fxToggle.js';
import { usStateSelect } from '../components/usStateSelect.js';
import { salesTaxFor } from '../data/us-sales-tax.js';

const US_LIST = PRICING.US.iphone18Pro.from; // USD, before sales tax
let panel = null; // which auxiliary panel is open: 'notes' | 'table' | 'sources' | null

function published() {
  return COUNTRIES
    .map((c) => ({ c, p: PRICING[c.code] }))
    .filter(({ p }) => p?.iphone18Pro?.from)
    .map(({ c, p }) => ({ code: c.code, name: c.name, flag: c.flag, price: p.iphone18Pro.from, currency: p.iphone18Pro.currency, vat: p.vatRate }));
}

export function initHardware() {
  render();
  subscribe((state, prev) => { if (['country', 'fx', 'exVat', 'convert', 'usState'].some((k) => state[k] !== prev[k])) render(); });
}

function render() {
  const state = getState();
  const tax = salesTaxFor(state.usState);
  const US_PRICE = Math.round(US_LIST * (1 + tax.rate / 100) * 100) / 100; // USD incl. the selected sales tax
  const rows = published().map((r) => {
    const localAdj = state.exVat ? r.price / (1 + r.vat / 100) : r.price;
    const eurExVat = toEUR(r.price / (1 + r.vat / 100), r.currency, state.fx);
    return { ...r, localAdj, eur: toEUR(localAdj, r.currency, state.fx), eurExVat, breakEven: US_LIST / eurExVat, converted: r.currency !== 'EUR' };
  }).sort((a, b) => b.eur - a.eur);
  // The US row follows the tax switch: list price when all taxes are removed, otherwise list price plus the selected sales tax.
  const usShown = state.exVat ? US_LIST : US_PRICE;
  const usRow = { code: 'US', name: 'United States', flag: '🇺🇸', isUs: true, converted: true, price: US_LIST, localAdj: usShown, currency: 'USD', eur: usShown / state.fx, taxRate: state.exVat ? 0 : tax.rate };
  const bars = [usRow, ...rows];
  const max = Math.max(...bars.map((r) => r.eur));

  const valueLabel = (r) => state.convert
    ? `${r.converted ? '≈ ' : ''}${fmtMoney(Math.round(r.eur), 'EUR', { maxFrac: 0 })}`
    : fmtMoney(r.localAdj, r.currency, { maxFrac: 0 });

  // --- chart geometry ---
  const W = 720, rowH = 30, left = 150, right = 110, top = 8;
  const H = top + bars.length * rowH + 30;
  const scale = (v) => (v / (max * 1.06)) * (W - left - right);
  const ticks = niceTicks(max * 1.06, 5);
  const g = svg('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'iPhone 18 Pro starting price by country, bars in euros' });
  for (const t of ticks) {
    const x = left + scale(t);
    g.append(svg('line', { class: 'grid', x1: x, x2: x, y1: top, y2: top + bars.length * rowH }));
    g.append(svg('text', { class: 'axis-label', x, y: H - 8, 'text-anchor': 'middle' }, `€${t.toLocaleString('en-IE')}`));
  }
  g.append(svg('line', { class: 'baseline', x1: left, x2: left, y1: top, y2: top + bars.length * rowH }));
  const labelled = new Set(['US', state.country, rows[0]?.code, rows[rows.length - 1]?.code]);
  bars.forEach((r, i) => {
    const y = top + i * rowH + 4;
    const isMe = r.code === state.country;
    const w = Math.max(2, scale(r.eur));
    const fill = r.isUs ? 'var(--us)' : isMe ? 'var(--eu)' : 'var(--eu-mid, #86b6ef)';
    g.append(svg('text', { x: left - 10, y: y + 15, 'text-anchor': 'end', style: isMe || r.isUs ? 'font-weight:600;fill:var(--ink)' : '' }, `${r.flag} ${r.name}`));
    const bar = svg('path', { class: 'bar', d: roundedRight(left, y, w, 22, 4), fill });
    const hit = svg('rect', { class: 'bar-hit', x: 0, y: y - 4, width: W, height: rowH, fill: 'transparent', tabindex: '0' });
    attachTooltip(hit, () => tooltipLines(r, state));
    hit.addEventListener('pointerenter', () => bar.classList.add('hover'));
    hit.addEventListener('pointerleave', () => bar.classList.remove('hover'));
    g.append(bar, hit);
    if (labelled.has(r.code)) g.append(svg('text', { x: left + w + 8, y: y + 15, style: 'font-weight:600;fill:var(--ink)' }, valueLabel(r)));
  });

  // --- controls ---
  const panels = {
    notes: () => el('div', { class: 'chart-panel prose' },
      el('p', {}, `Apple\u2019s US list price is $${US_LIST.toLocaleString('en-US')} before sales tax, which depends on the delivery address. The chart adds the combined state and average local rate you choose (Tax Foundation, rates as of 1 July 2026); the default is the population-weighted US average. EU prices include VAT. Countries without an Apple online store (Bulgaria, Croatia, Cyprus, Estonia, Greece, Latvia, Lithuania, Malta, Romania, Slovakia, Slovenia) have no published Apple price.`),
      el('p', {}, `Bar lengths convert every price to euros using the European Central Bank\u2019s average daily reference rates from ${fmtDate(FX.from)} to ${fmtDate(FX.to)} (DKK ${FX.rates.DKK.toFixed(2)}, SEK ${FX.rates.SEK.toFixed(2)}, PLN ${FX.rates.PLN.toFixed(2)}, CZK ${FX.rates.CZK.toFixed(2)}, HUF ${FX.rates.HUF.toFixed(0)} per euro). The USD rate defaults to the same average (${FX.rates.USD.toFixed(2)}) and can be changed in the page settings (gear icon, top right). Hover a bar for that country\u2019s before-tax price and the exchange rate at which it would equal the US list price.`),
    ),
    table: () => el('div', { class: 'chart-panel' }, priceTable(rows, usRow, tax, state)),
    sources: () => el('div', { class: 'chart-panel' }, sourceLinks(['S18', 'S19', 'X2', 'X3'])),
  };
  const TABS = [['notes', 'Notes'], ['table', 'Table'], ['sources', 'Sources']];
  const tabs = el('div', { class: 'chart-tabs', role: 'tablist' }, TABS.map(([id, label]) => el('button', {
    type: 'button', role: 'tab', 'aria-selected': String(panel === id), 'aria-expanded': String(panel === id),
    onclick: () => { panel = panel === id ? null : id; render(); },
  }, label)));

  mount('price-chart',
    el('div', { class: 'chart-controls', style: { marginTop: '0', marginBottom: '16px' } }, fxToggle(), usStateSelect(), exVatToggle()),
    el('div', { class: 'chart' },
      el('div', { class: 'chart-head' },
        el('h4', {}, `iPhone 18 Pro starting price${state.exVat ? ', all taxes removed' : ', taxes included'}. Bars in euros; labels ${state.convert ? 'in euros' : 'in local currency'}.`),
        el('div', { class: 'legend' },
          el('span', {}, el('i', { style: { background: 'var(--eu)' } }), 'EU storefront', state.exVat ? ' (ex-VAT)' : ' (VAT incl.)'),
          el('span', {}, el('i', { style: { background: 'var(--us)' } }), state.exVat ? 'US list price, no sales tax' : `US incl. sales tax (${tax.label})`)),
      ),
      g,
      tabs,
      panel ? panels[panel]() : null,
    ),
  );
}

function priceTable(rows, usRow, tax, state) {
  return el('table', {},
    el('thead', {}, el('tr', {}, el('th', {}, 'Country'), el('th', {}, 'With tax'), el('th', {}, 'Tax'), el('th', {}, 'Before tax'), el('th', {}, '≈ € as charted'), el('th', {}, 'Break-even USD per €'))),
    el('tbody', {},
      el('tr', {}, el('td', {}, '🇺🇸 United States'), el('td', {}, `${fmtMoney(Math.round(usRow.price * (1 + tax.rate / 100)), 'USD', { maxFrac: 0 })} (${tax.label})`), el('td', {}, `${tax.rate.toFixed(2)}% sales tax`), el('td', {}, fmtMoney(usRow.price, 'USD', { maxFrac: 0 })), el('td', {}, `≈ ${fmtMoney(Math.round(usRow.eur), 'EUR', { maxFrac: 0 })}`), el('td', {}, '—')),
      rows.map((r) => el('tr', {}, el('td', {}, `${r.flag} ${r.name}`), el('td', {}, fmtMoney(r.price, r.currency, { maxFrac: 0 })), el('td', {}, `${r.vat}%`), el('td', {}, fmtMoney(r.price / (1 + r.vat / 100), r.currency, { maxFrac: 0 })), el('td', {}, `${r.converted ? '≈ ' : ''}${fmtMoney(Math.round(r.eur), 'EUR', { maxFrac: 0 })}`), el('td', {}, r.breakEven.toFixed(2)))),
    ),
  );
}

function tooltipLines(r, state) {
  if (r.isUs) return [{ b: 'United States' }, `$${US_LIST.toLocaleString('en-US')} list price`, r.taxRate ? `$${Math.round(r.localAdj).toLocaleString('en-US')} with ${r.taxRate.toFixed(2)}% sales tax` : 'No sales tax added', `≈ ${fmtMoney(Math.round(r.eur), 'EUR', { maxFrac: 0 })} at ${state.fx.toFixed(2)} USD per euro`];
  const lines = [
    { b: r.name },
    `Advertised: ${fmtMoney(r.price, r.currency, { maxFrac: 0 })} incl. ${r.vat}% VAT`,
    `Before VAT: ${fmtMoney(r.price / (1 + r.vat / 100), r.currency, { maxFrac: 0 })}`,
  ];
  if (r.converted) lines.push(`≈ ${fmtMoney(Math.round(r.eur), 'EUR', { maxFrac: 0 })} at ${FX.rates[r.currency]} ${r.currency} per euro`);
  lines.push(`Tax-free, would equal the US list price at ${r.breakEven.toFixed(2)} USD per euro`);
  return lines;
}

function roundedRight(x, y, w, h, r) {
  const rr = Math.min(r, w / 2);
  return `M${x},${y} H${x + w - rr} a${rr},${rr} 0 0 1 ${rr},${rr} V${y + h - rr} a${rr},${rr} 0 0 1 -${rr},${rr} H${x} Z`;
}

function niceTicks(max, n) {
  const raw = max / n;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= raw) || raw;
  const out = [];
  for (let v = 0; v <= max; v += step) out.push(Math.round(v));
  return out;
}
