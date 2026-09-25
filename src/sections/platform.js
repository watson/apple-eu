import { el, mount } from '../dom.js';
import { FEATURES } from '../data/features.js';

export function initPlatform() {
  const gains = FEATURES.filter((f) => f.category === 'platform' && f.eu.status === 'yes' && f.us.status !== 'yes');
  const losses = FEATURES.filter((f) => f.tags?.includes('dma') && f.us.status === 'yes' && f.eu.status === 'no');
  const same = FEATURES.filter((f) => f.category === 'platform' && f.eu.status === 'yes' && f.us.status === 'yes');
  const item = (f) => el('li', {}, el('div', {}, el('b', {}, el('a', { href: `#feature-${f.id}`, style: { color: 'inherit' } }, f.title)), el('span', {}, f.short)));
  mount('platform-versus',
    el('div', { class: 'versus' },
      el('div', { class: 'col eu' }, el('h4', {}, 'Only in the EU'), el('ul', {}, gains.map(item))),
      el('div', { class: 'col us' }, el('h4', {}, 'Withheld from the EU, Apple cites the DMA'), el('ul', {}, losses.map(item))),
      el('div', { class: 'col same' }, el('h4', {}, 'Not as different as you heard'), el('ul', {}, same.map(item))),
    ),
  );
}
