import { el, mount } from '../dom.js';
import { fill } from '../text.js';
import { getState, subscribe, currentCountry } from '../state.js';
import { evaluate } from '../context.js';
import { LANGUAGE_BY_CODE } from '../data/languages.js';
import { PRICING } from '../data/pricing.js';

export function initOverview() {
  render();
  subscribe(render);
}

function render() {
  const state = getState();
  const c = currentCountry();
  const rows = evaluate(state);
  const by = (v) => rows.filter((r) => r.verdict === v);

  if (c) {
    const langs = state.langs.map((l) => LANGUAGE_BY_CODE[l]?.name).filter(Boolean).join(', ');
    const cur = PRICING[c.code]?.currency || c.currency;
    mount('country-banner',
      el('div', { class: 'country-banner' },
        el('div', { class: 'flag', 'aria-hidden': 'true' }, c.flag),
        el('div', {},
          el('h4', {}, `Your view: ${c.name}`),
          el('p', {}, `Resolved for ${c.name} (${cur}) and ${langs || 'no language selected'}. Change the language in the Intelligence section if you use your iPhone in another language.`),
        ),
      ),
    );
  } else {
    mount('country-banner',
      el('div', { class: 'country-banner' },
        el('div', { class: 'flag', 'aria-hidden': 'true' }, '🇪🇺'),
        el('div', {},
          el('h4', {}, 'Viewing the EU as a whole'),
          el('p', {}, 'Pick your country above to resolve the "depends" items for where you live and the languages you use.'),
        ),
      ),
    );
  }

  const list = (items, limit = 7) => el('ul', {},
    items.slice(0, limit).map(({ f }) => el('li', {}, el('div', {}, el('b', {}, f.title), el('span', {}, fill(f.short))))),
    items.length > limit ? el('li', { class: 'more' }, el('div', {}, el('a', { href: '#scorecard' }, `and ${items.length - limit} more in the scorecard`))) : null,
  );

  const depends = [...by('depends'), ...by('mixed')];
  mount('versus',
    el('div', { class: 'versus' },
      el('div', { class: 'col eu' }, el('h4', {}, `The EU gets, the US does not · ${by('eu').length}`), list(by('eu'))),
      el('div', { class: 'col us' }, el('h4', {}, `The US gets, the EU does not · ${by('us').length}`), list(by('us'))),
      el('div', { class: 'col' }, el('h4', {}, c ? `Still depends on language or provider · ${depends.length}` : `Depends on the member state · ${depends.length}`),
        depends.length ? list(depends) : el('p', { class: 'muted' }, 'Everything resolved for your selection.')),
    ),
  );
}

