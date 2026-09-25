import { el, mount, fmtMoney, fmtDate } from '../dom.js';
import { getState, subscribe } from '../state.js';
import { COUNTRIES, COUNTRY_BY_CODE, US } from '../data/countries.js';
import { PRICING } from '../data/pricing.js';
import { AVAILABILITY } from '../data/availability.js';
import { FX, toEUR } from '../data/fx.js';
import { fxToggle, TAX_NOTE } from '../components/fxToggle.js';

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
  subscribe((state, prev) => { if (state.country !== prev.country || state.convert !== prev.convert) render(); });
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

/** Local price string, with a tax marker for the US and an optional euro approximation. */
function priceParts(amount, currency, state) {
  const local = fmtMoney(amount, currency) + (currency === 'USD' ? '*' : '');
  if (!state.convert || currency === 'EUR') return { local, approx: null };
  const eur = toEUR(amount, currency, state.fx);
  return { local, approx: eur == null ? null : `≈ ${fmtMoney(eur, 'EUR')}` };
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
  const { local, approx } = priceParts(plan.monthly, p.currency, state);
  return el('div', { class: `plan ${region}` },
    el('div', { class: 'region' }, `${c.flag} ${c.name}`),
    el('h4', { title: plan.localName !== tierName(plan, code) ? `Local name: ${plan.localName}` : null }, `Apple One ${tierName(plan, code)}`),
    el('div', { class: 'price' }, local, el('small', {}, ` / month${code === 'US' ? ', before sales tax' : ', VAT included'}`)),
    // Always rendered so switching the euro toggle does not change the card height.
    el('div', { class: 'approx plan-approx' }, approx ? `${approx} / month` : '\u00a0'),
    el('ul', {}, SERVICES.map((s) => {
      const has = plan.services.includes(s.key);
      return el('li', { class: has ? 'in' : 'out' }, el('i', { 'aria-hidden': 'true' }, has ? '✓' : '✕'), s.key === 'icloud' ? `${s.label} ${storage}` : s.label);
    })),
    plan.tier !== 'premier' ? el('p', { class: 'missing' }, 'Highest tier sold here. No Premier or Premium tier is offered.') : null,
  );
}

function conversionNote(state) {
  if (!state.convert) return null;
  return el('p', { class: 'tax-note' }, `Euro figures are approximate, converted at the European Central Bank’s average daily reference rates from ${fmtDate(FX.from)} to ${fmtDate(FX.to)} (USD ${state.fx.toFixed(2)}, DKK ${FX.rates.DKK.toFixed(2)}, SEK ${FX.rates.SEK.toFixed(2)}, PLN ${FX.rates.PLN.toFixed(2)}, CZK ${FX.rates.CZK.toFixed(2)}, HUF ${FX.rates.HUF.toFixed(0)} per euro).`);
}

function render() {
  const state = getState();
  const cards = [planCard('US', 'us', state)];
  if (state.country) cards.push(planCard(state.country, 'eu', state));
  else cards.push(planCard('DE', 'eu', state), planCard('NL', 'eu', state));
  mount('plan-compare',
    el('div', { class: 'filter-row', style: { marginTop: '0' } }, fxToggle()),
    el('div', { class: 'plan-compare' }, cards),
    el('p', { class: 'note', style: { marginTop: '12px' } }, state.country ? 'Top tier advertised in the US versus the top tier advertised in your country.' : 'Top tier advertised in the US, Germany (five-service Premium) and the Netherlands (no top tier). Pick a country to compare your own.'),
    el('p', { class: 'tax-note' }, TAX_NOTE),
  );
  renderMatrix(state);
}

function renderMatrix(state) {
  const rows = ['US', ...COUNTRIES.map((c) => c.code)].map((code) => ({ code, plan: topPlan(code), c: code === 'US' ? US : COUNTRY_BY_CODE[code] }));
  rows.sort((a, b) => {
    if (a.code === 'US') return -1; if (b.code === 'US') return 1;
    const ra = rank(a), rb = rank(b);
    return ra !== rb ? ra - rb : a.c.name.localeCompare(b.c.name);
  });
  const extraCols = state.convert ? 1 : 0;
  const table = el('table', { class: 'matrix' },
    el('thead', {}, el('tr', {}, el('th', {}, 'Country'), el('th', {}, 'Top tier'), el('th', {}, 'Monthly'), state.convert ? el('th', {}, '≈ € / month') : null, el('th', {}, 'Storage'), SERVICES.map((s) => el('th', {}, s.label.replace('Apple ', ''))))),
    el('tbody', {}, rows.map(({ code, plan, c }) => {
      const p = PRICING[code];
      const cls = code === 'US' ? 'us' : state.country === code ? 'me' : '';
      if (!plan) {
        return el('tr', { class: cls }, el('td', {}, el('span', { class: 'country' }, c.flag, ' ', c.name)),
          el('td', { colspan: String(3 + extraCols + SERVICES.length), class: 'muted', style: { textAlign: 'left' } }, AVAILABILITY.appleOneAny.includes(code) ? 'Apple One listed as available; no plan page published on apple.com' : 'Apple One not listed for this country'));
      }
      const { local, approx } = priceParts(plan.monthly, p.currency, state);
      return el('tr', { class: cls },
        el('td', {}, el('span', { class: 'country' }, c.flag, ' ', c.name)),
        el('td', { title: plan.localName !== tierName(plan, code) ? `Local name: ${plan.localName}` : null }, tierName(plan, code), plan.tier === 'premier' ? '' : el('span', { class: 'muted' }, ' (no top tier)')),
        el('td', { class: 'num' }, local),
        state.convert ? el('td', { class: 'num approx' }, approx || fmtMoney(plan.monthly, 'EUR')) : null,
        el('td', {}, plan.storageGB >= 1024 ? `${plan.storageGB / 1024} TB` : `${plan.storageGB} GB`),
        SERVICES.map((s) => el('td', {}, el('span', { class: `dot ${plan.services.includes(s.key) ? 'on' : 'off'}`, title: plan.services.includes(s.key) ? 'Included' : 'Not included' }), el('span', { class: 'visually-hidden' }, plan.services.includes(s.key) ? 'included' : 'not included'))),
      );
    })),
  );
  mount('apple-one-matrix',
    el('div', { class: 'filter-row', style: { marginTop: '0' } }, fxToggle()),
    el('div', { class: 'table-wrap' }, table),
    el('p', { class: 'tax-note' }, TAX_NOTE),
    conversionNote(state),
    el('p', { class: 'note', style: { marginTop: '10px' } }, 'Ireland calls its five-service tier "Premier" but it still omits News+. Finland and Portugal have their own price points. Sources: each country’s apple.com/apple-one page and Apple’s media services register, accessed 25 September 2026.'));
}

function rank(r) {
  if (!r.plan) return 3;
  if (r.plan.tier === 'premier') return 1;
  return 2;
}
