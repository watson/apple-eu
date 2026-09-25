import { el, mount, fmtMoney, fmtDate } from '../dom.js';
import { getState, subscribe } from '../state.js';
import { COUNTRIES, COUNTRY_BY_CODE, US } from '../data/countries.js';
import { PRICING } from '../data/pricing.js';
import { AVAILABILITY } from '../data/availability.js';
import { FX, toEUR } from '../data/fx.js';
import { fxToggle } from '../components/fxToggle.js';
import { usStateSelect } from '../components/usStateSelect.js';
import { salesTaxFor } from '../data/us-sales-tax.js';

const SERVICES = [
  { key: 'music', label: 'Apple Music' },
  { key: 'tv', label: 'Apple TV' },
  { key: 'arcade', label: 'Apple Arcade' },
  { key: 'icloud', label: 'iCloud+' },
  { key: 'fitness', label: 'Apple Fitness+' },
  { key: 'news', label: 'Apple News+' },
];

export function initSubscriptions() {
  render();
  subscribe((state, prev) => { if (['country', 'convert', 'usState', 'fx'].some((k) => state[k] !== prev[k])) render(); });
}

/** English tier name. The top tier is "Premier" in the US (the only bundle with News+) and shown as
 *  "Premium" for every EU country, which is Apple's name in all but Ireland; the local name stays on hover. */
function tierName(plan, code) {
  if (plan.tier === 'premier') return code === 'US' ? 'Premier' : 'Premium';
  if (plan.tier === 'family') return 'Family';
  return 'Individual';
}

function topPlan(code) {
  const plans = PRICING[code]?.appleOne?.plans || [];
  return plans.find((p) => p.tier === 'premier') || plans.find((p) => p.tier === 'family') || null;
}

/** Price to display for the current mode (local currency, or euros when the switch is on), plus the other one for tooltips.
 *  US prices get the sales tax of the chosen state added (see TAX_NOTE). */
function priceParts(listAmount, currency, state) {
  const tax = salesTaxFor(state.usState);
  const isUs = currency === 'USD';
  const amount = isUs ? listAmount * (1 + tax.rate / 100) : listAmount;
  const local = fmtMoney(amount, currency) + (isUs ? '*' : '');
  const basis = isUs ? `${fmtMoney(listAmount, 'USD')} list${tax.rate ? ` + ${tax.rate.toFixed(2)}% sales tax` : ', no sales tax'}` : `${local} as advertised`;
  if (!state.convert || currency === 'EUR') return { shown: local, alt: isUs ? basis : null };
  const eur = toEUR(amount, currency, state.fx);
  return { shown: eur == null ? local : `≈ ${fmtMoney(eur, 'EUR')}${isUs ? '*' : ''}`, alt: basis };
}

function taxNote(state) {
  const tax = salesTaxFor(state.usState);
  return tax.rate
    ? `* US prices include ${tax.label} sales tax, as chosen above. Sales tax applies to digital subscriptions only in states that tax them, which varies. EU prices include VAT.`
    : '* US prices are list prices with no sales tax, as chosen above. EU prices include VAT.';
}

function planCard(code, region, state) {
  const c = code === 'US' ? US : COUNTRY_BY_CODE[code];
  const p = PRICING[code];
  const plan = topPlan(code);
  if (!plan) {
    return el('div', { class: `plan ${region}` },
      el('div', { class: 'region' }, `${c.flag} ${c.name}`),
      el('h4', {}, 'No Apple One page'),
      el('p', { class: 'missing' }, AVAILABILITY.appleOneAny.includes(code)
        ? 'Apple’s services register lists Apple One as available here, but apple.com publishes no local plan page, so tiers and prices could not be verified.'
        : 'Apple’s services register does not list Apple One for this country.'),
    );
  }
  const storage = plan.storageGB >= 1024 ? `${plan.storageGB / 1024} TB` : `${plan.storageGB} GB`;
  const { shown, alt } = priceParts(plan.monthly, p.currency, state);
  return el('div', { class: `plan ${region}` },
    el('div', { class: 'region' }, `${c.flag} ${c.name}`),
    el('h4', { title: plan.localName !== tierName(plan, code) ? `Local name: ${plan.localName}` : null }, `Apple One ${tierName(plan, code)}`),
    el('div', { class: 'price' }, shown, el('small', {}, ` / month${code === 'US' ? (salesTaxFor(state.usState).rate ? ', sales tax incl.' : ', no sales tax') : ', VAT included'}`)),
    // Always rendered so switching the euro toggle does not change the card height.
    el('div', { class: 'approx plan-approx' }, alt || '\u00a0'),
    el('ul', {}, SERVICES.map((s) => {
      const has = plan.services.includes(s.key);
      return el('li', { class: has ? 'in' : 'out' }, el('i', { 'aria-hidden': 'true' }, has ? '✓' : '✕'), s.key === 'icloud' ? `${s.label} ${storage}` : s.label);
    })),
    plan.tier !== 'premier' ? el('p', { class: 'missing' }, 'Highest tier sold here. No Premier or Premium tier is offered.') : null,
  );
}

/** Always shown, so toggling the euro switch never adds or removes a paragraph. */
function conversionNote(state) {
  return el('p', { class: 'tax-note' }, `Euro figures, when shown, are approximate: converted at the European Central Bank’s average daily reference rates from ${fmtDate(FX.from)} to ${fmtDate(FX.to)} (USD ${state.fx.toFixed(2)}, DKK ${FX.rates.DKK.toFixed(2)}, SEK ${FX.rates.SEK.toFixed(2)}, PLN ${FX.rates.PLN.toFixed(2)}, CZK ${FX.rates.CZK.toFixed(2)}, HUF ${FX.rates.HUF.toFixed(0)} per euro).`);
}

function render() {
  const state = getState();
  const cards = [planCard('US', 'us', state)];
  if (state.country) cards.push(planCard(state.country, 'eu', state));
  else cards.push(planCard('DE', 'eu', state), planCard('NL', 'eu', state));
  mount('plan-compare',
    el('div', { class: 'chart-controls', style: { marginTop: '0', marginBottom: '16px' } }, fxToggle(), usStateSelect()),
    el('div', { class: 'plan-compare' }, cards),
    el('p', { class: 'note', style: { marginTop: '12px' } }, state.country ? 'Top tier advertised in the US versus the top tier advertised in your country.' : 'Top tier advertised in the US, Germany (five-service Premium) and the Netherlands (no top tier). Pick a country to compare your own.'),
    el('p', { class: 'tax-note' }, taxNote(state)),
  );
  renderMatrix(state);
}

function renderMatrix(state) {
  const rows = ['US', ...COUNTRIES.map((c) => c.code)].map((code) => ({ code, plans: PRICING[code]?.appleOne?.plans || [], plan: topPlan(code), c: code === 'US' ? US : COUNTRY_BY_CODE[code] }));
  rows.sort((a, b) => {
    if (a.code === 'US') return -1; if (b.code === 'US') return 1;
    const ra = rank(a), rb = rank(b);
    return ra !== rb ? ra - rb : a.c.name.localeCompare(b.c.name);
  });
  const TIERS = [['individual', 'Individual'], ['family', 'Family'], ['premier', 'Premium']];
  const tierCell = (row, tier) => {
    const plan = row.plans.find((p) => p.tier === tier);
    if (!plan) return el('td', { class: 'muted unsold' }, el('span', { class: 'dot off', title: 'Not sold here' }), el('span', { class: 'visually-hidden' }, 'not sold'));
    const { shown, alt } = priceParts(plan.monthly, PRICING[row.code].currency, state);
    const title = [alt, plan.localName !== tierName(plan, row.code) ? `Local name: ${plan.localName}` : null].filter(Boolean).join(' · ');
    return el('td', { class: 'num', title: title || null }, shown);
  };
  const table = el('table', { class: 'matrix' },
    el('thead', {}, el('tr', {}, el('th', {}, 'Country'), TIERS.map(([, label]) => el('th', { class: 'num' }, label === 'Premium' ? 'Premium / Premier' : label)), el('th', {}, 'Top-tier storage'), el('th', {}, 'Fitness+'), el('th', {}, 'News+'))),
    el('tbody', {}, rows.map((row) => {
      const { code, plan, c } = row;
      const cls = code === 'US' ? 'us' : state.country === code ? 'me' : '';
      if (!plan) {
        return el('tr', { class: cls }, el('td', {}, el('span', { class: 'country' }, c.flag, ' ', c.name)),
          el('td', { colspan: '6', class: 'muted', style: { textAlign: 'left' } }, AVAILABILITY.appleOneAny.includes(code) ? 'Apple One listed as available; no plan page published on apple.com' : 'Apple One not listed for this country'));
      }
      const has = (key) => plan.services.includes(key);
      const dot = (on, label) => [el('span', { class: `dot ${on ? 'on' : 'off'}`, title: on ? `${label} included in the top tier` : `${label} not included` }), el('span', { class: 'visually-hidden' }, on ? 'included' : 'not included')];
      return el('tr', { class: cls },
        el('td', {}, el('span', { class: 'country' }, c.flag, ' ', c.name)),
        TIERS.map(([tier]) => tierCell(row, tier)),
        el('td', {}, plan.storageGB >= 1024 ? `${plan.storageGB / 1024} TB` : `${plan.storageGB} GB`),
        el('td', {}, dot(has('fitness'), 'Fitness+')),
        el('td', {}, dot(has('news'), 'News+')),
      );
    })),
  );
  mount('apple-one-matrix',
    el('div', { class: 'chart-controls', style: { marginTop: '0', marginBottom: '16px' } }, fxToggle(), usStateSelect()),
    el('div', { class: 'table-wrap' }, table),
    el('p', { class: 'tax-note' }, taxNote(state)),
    conversionNote(state),
    el('p', { class: 'note', style: { marginTop: '10px' } }, 'Monthly prices in local currency. Every tier everywhere includes Apple Music, Apple TV, Apple Arcade and iCloud+ (50 GB Individual, 200 GB Family, 2 TB Premium); the top tier adds Fitness+, and in the US also News+. Ireland calls its five-service tier "Premier". Sources: each country\u2019s apple.com/apple-one page and Apple\u2019s media services register, accessed 25 September 2026.'));
}

function rank(r) {
  if (!r.plan) return 3;
  if (r.plan.tier === 'premier') return 1;
  return 2;
}
