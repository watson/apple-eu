import { el, mount, fmtMoney } from '../dom.js';
import { getState, subscribe } from '../state.js';
import { COUNTRIES, COUNTRY_BY_CODE, US } from '../data/countries.js';
import { PRICING } from '../data/pricing.js';
import { AVAILABILITY } from '../data/availability.js';

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
  subscribe((state, prev) => { if (state.country !== prev.country) render(); });
}

function topPlan(code) {
  const plans = PRICING[code]?.appleOne?.plans || [];
  return plans.find((p) => p.tier === 'premier') || plans.find((p) => p.tier === 'family') || null;
}

function planCard(code, region) {
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
  return el('div', { class: `plan ${region}` },
    el('div', { class: 'region' }, `${c.flag} ${c.name}`),
    el('h4', {}, `Apple One ${plan.localName}`),
    el('div', { class: 'price' }, fmtMoney(plan.monthly, p.currency), el('small', {}, ` / month${code === 'US' ? ', before tax' : ', tax incl.'}`)),
    el('ul', {}, SERVICES.map((s) => {
      const has = plan.services.includes(s.key);
      return el('li', { class: has ? 'in' : 'out' }, el('i', { 'aria-hidden': 'true' }, has ? '✓' : '✕'), s.key === 'icloud' ? `${s.label} ${storage}` : s.label);
    })),
    plan.tier !== 'premier' ? el('p', { class: 'missing' }, 'Highest tier sold here. No Premier or Premium tier is offered.') : null,
  );
}

function render() {
  const state = getState();
  const cards = [planCard('US', 'us')];
  if (state.country) cards.push(planCard(state.country, 'eu'));
  else cards.push(planCard('DE', 'eu'), planCard('NL', 'eu'));
  mount('plan-compare', el('div', { class: 'plan-compare' }, cards),
    el('p', { class: 'note', style: { marginTop: '12px' } }, state.country ? 'Top tier advertised in the US versus the top tier advertised in your country.' : 'Top tier advertised in the US, Germany (five-service Premium) and the Netherlands (no top tier). Pick a country to compare your own.'));

  renderMatrix(state);
}

function renderMatrix(state) {
  const rows = ['US', ...COUNTRIES.map((c) => c.code)].map((code) => ({ code, plan: topPlan(code), c: code === 'US' ? US : COUNTRY_BY_CODE[code] }));
  rows.sort((a, b) => {
    if (a.code === 'US') return -1; if (b.code === 'US') return 1;
    const ra = rank(a), rb = rank(b);
    return ra !== rb ? ra - rb : a.c.name.localeCompare(b.c.name);
  });
  const table = el('table', { class: 'matrix' },
    el('thead', {}, el('tr', {}, el('th', {}, 'Country'), el('th', {}, 'Top tier'), el('th', {}, 'Monthly'), el('th', {}, 'Storage'), SERVICES.map((s) => el('th', {}, s.label.replace('Apple ', ''))))),
    el('tbody', {}, rows.map(({ code, plan, c }) => {
      const p = PRICING[code];
      const cls = code === 'US' ? 'us' : state.country === code ? 'me' : '';
      if (!plan) {
        return el('tr', { class: cls }, el('td', {}, el('span', { class: 'country' }, c.flag, ' ', c.name)),
          el('td', { colspan: String(3 + SERVICES.length), class: 'muted', style: { textAlign: 'left' } }, AVAILABILITY.appleOneAny.includes(code) ? 'Apple One listed as available; no plan page published on apple.com' : 'Apple One not listed for this country'));
      }
      return el('tr', { class: cls },
        el('td', {}, el('span', { class: 'country' }, c.flag, ' ', c.name)),
        el('td', {}, plan.localName, plan.tier === 'premier' ? '' : el('span', { class: 'muted' }, ' (no top tier)')),
        el('td', { class: 'num' }, fmtMoney(plan.monthly, p.currency)),
        el('td', {}, plan.storageGB >= 1024 ? `${plan.storageGB / 1024} TB` : `${plan.storageGB} GB`),
        SERVICES.map((s) => el('td', {}, el('span', { class: `dot ${plan.services.includes(s.key) ? 'on' : 'off'}`, title: plan.services.includes(s.key) ? 'Included' : 'Not included' }), el('span', { class: 'visually-hidden' }, plan.services.includes(s.key) ? 'included' : 'not included'))),
      );
    })),
  );
  mount('apple-one-matrix', el('div', { class: 'table-wrap' }, table),
    el('p', { class: 'note', style: { marginTop: '10px' } }, 'Ireland calls its five-service tier "Premier" but it still omits News+. Finland and Portugal have their own price points. Sources: each country’s apple.com/apple-one page and Apple’s media services register, accessed 25 September 2026.'));
}

function rank(r) {
  if (!r.plan) return 3;
  if (r.plan.tier === 'premier') return 1;
  return 2;
}
