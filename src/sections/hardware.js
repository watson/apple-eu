// iPhone 18 Pro price explorer: euro-priced EU storefronts versus the US,
// converted at an adjustable EUR/USD rate, with an optional ex-VAT view.
import { el, svg, mount, fmtMoney } from '../dom.js';
import { getState, setState, subscribe } from '../state.js';
import { COUNTRIES } from '../data/countries.js';
import { PRICING } from '../data/pricing.js';
import { attachTooltip } from '../components/tooltip.js';
import { sourceLinks } from '../components/chips.js';

const US_PRICE = PRICING.US.iphone18Pro.from;

function euroRows() {
  return COUNTRIES
    .map((c) => ({ c, p: PRICING[c.code] }))
    .filter(({ p }) => p?.iphone18Pro?.from && p.iphone18Pro.currency === 'EUR')
    .map(({ c, p }) => ({ code: c.code, name: c.name, flag: c.flag, eur: p.iphone18Pro.from, vat: p.vatRate }));
}

function otherRows() {
  return COUNTRIES
    .map((c) => ({ c, p: PRICING[c.code] }))
    .filter(({ p }) => p?.iphone18Pro?.from && p.iphone18Pro.currency !== 'EUR')
    .map(({ c, p }) => ({ code: c.code, name: c.name, flag: c.flag, price: p.iphone18Pro.from, currency: p.iphone18Pro.currency, vat: p.vatRate }));
}

export function initHardware() {
  render();
  subscribe((state, prev) => { if (state.country !== prev.country || state.fx !== prev.fx || state.exVat !== prev.exVat) render(); });
}

function render() {
  const state = getState();
  const fx = state.fx;
  const rows = euroRows().map((r) => {
    const eurAdj = state.exVat ? r.eur / (1 + r.vat / 100) : r.eur;
    return { ...r, eurAdj, usd: eurAdj * fx, breakEven: US_PRICE / (r.eur / (1 + r.vat / 100)) };
  });
  rows.sort((a, b) => b.usd - a.usd);
  const all = [{ code: 'US', name: 'United States', flag: '🇺🇸', usd: US_PRICE, isUs: true }, ...rows];
  const max = Math.max(...all.map((r) => r.usd));

  // --- chart geometry ---
  const W = 720, rowH = 30, left = 150, right = 90, top = 8;
  const H = top + all.length * rowH + 30;
  const scale = (v) => (v / (max * 1.06)) * (W - left - right);
  const ticks = niceTicks(max * 1.06, 5);
  const g = svg('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'iPhone 18 Pro starting price by country converted to US dollars' });
  for (const t of ticks) {
    const x = left + scale(t);
    g.append(svg('line', { class: 'grid', x1: x, x2: x, y1: top, y2: top + all.length * rowH }));
    g.append(svg('text', { class: 'axis-label', x, y: H - 8, 'text-anchor': 'middle' }, `$${t.toLocaleString('en-US')}`));
  }
  g.append(svg('line', { class: 'baseline', x1: left, x2: left, y1: top, y2: top + all.length * rowH }));
  const labelled = new Set(['US', state.country, rows[0]?.code, rows[rows.length - 1]?.code]);
  all.forEach((r, i) => {
    const y = top + i * rowH + 4;
    const w = Math.max(2, scale(r.usd));
    const isMe = r.code === state.country;
    const fill = r.isUs ? 'var(--us)' : isMe ? 'var(--eu)' : 'var(--eu-mid, #86b6ef)';
    g.append(svg('text', { x: left - 10, y: y + 15, 'text-anchor': 'end', style: isMe || r.isUs ? 'font-weight:600;fill:var(--ink)' : '' }, `${r.flag} ${r.name}`));
    const bar = svg('path', { class: 'bar', d: roundedRight(left, y, w, 22, 4), fill });
    const hit = svg('rect', { class: 'bar-hit', x: 0, y: y - 4, width: W, height: rowH, fill: 'transparent', tabindex: '0' });
    attachTooltip(hit, () => tooltipLines(r, state));
    hit.addEventListener('pointerenter', () => bar.classList.add('hover'));
    hit.addEventListener('pointerleave', () => bar.classList.remove('hover'));
    g.append(hit, bar);
    if (labelled.has(r.code)) {
      g.append(svg('text', { x: left + w + 8, y: y + 15, style: 'font-weight:600;fill:var(--ink)' }, `$${Math.round(r.usd).toLocaleString('en-US')}`));
    }
  });

  // --- controls ---
  const rate = el('input', { type: 'number', step: '0.01', min: '0.5', max: '2', value: fx.toFixed(2), 'aria-label': 'EUR/USD exchange rate' });
  const slider = el('input', { type: 'range', min: '0.80', max: '1.60', step: '0.01', value: String(fx), 'aria-label': 'EUR/USD exchange rate slider' });
  const onRate = (v) => { const n = Number(v); if (n > 0.3 && n < 3) setState({ fx: n }); };
  rate.addEventListener('change', () => onRate(rate.value));
  slider.addEventListener('input', () => onRate(slider.value));
  const exVat = el('input', { type: 'checkbox', checked: state.exVat || null, 'aria-label': 'Remove VAT from EU prices' });
  exVat.addEventListener('change', () => setState({ exVat: exVat.checked }));

  const me = rows.find((r) => r.code === state.country);
  const meText = me
    ? `${me.name}: ${fmtMoney(me.eur, 'EUR')} incl. ${me.vat}% VAT = ${fmtMoney(me.eur / (1 + me.vat / 100), 'EUR', { maxFrac: 0 })} before VAT. At ${fx.toFixed(2)} that is $${Math.round((me.eur / (1 + me.vat / 100)) * fx).toLocaleString('en-US')} versus $${US_PRICE.toLocaleString('en-US')} in the US before sales tax. The two would match at a rate of ${me.breakEven.toFixed(2)}.`
    : `Pick a country to see its break-even exchange rate. Even before VAT, most EU storefronts sit above the US pre-tax price at today’s rate.`;

  const others = otherRows();
  mount('price-chart',
    el('div', { class: 'chart' },
      el('div', { class: 'chart-head' },
        el('h4', {}, `iPhone 18 Pro starting price${state.exVat ? ', VAT removed' : ', as advertised'}, in US dollars at ${fx.toFixed(2)} USD per EUR`),
        el('div', { class: 'legend' }, el('span', {}, el('i', { style: { background: 'var(--us)' } }), 'US, before sales tax'), el('span', {}, el('i', { style: { background: 'var(--eu)' } }), 'EU storefront', state.exVat ? ' (ex-VAT)' : ' (VAT incl.)')),
      ),
      g,
      el('div', { class: 'chart-controls' },
        el('label', {}, 'EUR/USD ', rate), slider,
        el('label', {}, exVat, ' Remove VAT from EU prices'),
        el('button', { class: 'btn', type: 'button', onclick: () => setState({ fx: 1.14 }) }, 'Reset to 1.14'),
      ),
      el('p', { class: 'chart-foot' }, meText),
      el('p', { class: 'chart-foot' }, 'Euro-priced storefronts with a published price. Default rate 1.14 USD per EUR, 25 September 2026. US price excludes state and local sales tax (0 to about 10%). EU prices include the standard national VAT rate. Countries without an Apple online store (Bulgaria, Croatia, Cyprus, Estonia, Greece, Latvia, Lithuania, Malta, Romania, Slovakia, Slovenia) have no published Apple price.'),
      el('details', { class: 'table-view' },
        el('summary', {}, 'Table view, including non-euro countries'),
        el('table', {},
          el('thead', {}, el('tr', {}, el('th', {}, 'Country'), el('th', {}, 'Advertised'), el('th', {}, 'VAT'), el('th', {}, 'Before VAT'), el('th', {}, 'In USD at rate'), el('th', {}, 'Break-even EUR/USD'))),
          el('tbody', {},
            el('tr', {}, el('td', {}, '🇺🇸 United States'), el('td', {}, fmtMoney(US_PRICE, 'USD')), el('td', {}, 'sales tax extra'), el('td', {}, '—'), el('td', {}, fmtMoney(US_PRICE, 'USD')), el('td', {}, '—')),
            rows.map((r) => el('tr', {}, el('td', {}, `${r.flag} ${r.name}`), el('td', {}, fmtMoney(r.eur, 'EUR')), el('td', {}, `${r.vat}%`), el('td', {}, fmtMoney(r.eur / (1 + r.vat / 100), 'EUR', { maxFrac: 0 })), el('td', {}, `$${Math.round(r.usd).toLocaleString('en-US')}`), el('td', {}, r.breakEven.toFixed(2)))),
            others.map((r) => el('tr', {}, el('td', {}, `${r.flag} ${r.name}`), el('td', {}, fmtMoney(r.price, r.currency, { maxFrac: 0 })), el('td', {}, `${r.vat}%`), el('td', {}, fmtMoney(r.price / (1 + r.vat / 100), r.currency, { maxFrac: 0 })), el('td', { class: 'muted' }, 'no rate set'), el('td', {}, '—'))),
          ),
        ),
      ),
      el('div', { style: { marginTop: '8px' } }, sourceLinks(['S18', 'S19', 'X1'])),
    ),
  );
}

function tooltipLines(r, state) {
  if (r.isUs) return [{ b: 'United States' }, `$${US_PRICE.toLocaleString('en-US')} before sales tax`];
  return [
    { b: r.name },
    `Advertised: ${fmtMoney(r.eur, 'EUR')} incl. ${r.vat}% VAT`,
    `Before VAT: ${fmtMoney(r.eur / (1 + r.vat / 100), 'EUR', { maxFrac: 0 })}`,
    `${state.exVat ? 'Ex-VAT' : 'Advertised'} in USD at ${state.fx.toFixed(2)}: $${Math.round(r.usd).toLocaleString('en-US')}`,
    `Break-even rate vs US: ${r.breakEven.toFixed(2)}`,
  ];
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
