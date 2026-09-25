import { el, mount, fmtDate } from '../dom.js';
import { SOURCES, ACCESSED } from '../data/sources.js';

const GROUPS = [
  ['A', 'Apple Intelligence, Siri and languages'],
  ['B', 'Subscriptions and media'],
  ['S', 'Satellite, Wallet, Watch, hardware and AppleCare'],
  ['P', 'Platform, DMA and warranty'],
  ['H', 'Historical announcements'],
  ['R', 'Additional Apple pages gathered for this site'],
  ['T', 'Independent reporting'],
  ['X', 'Exchange rates and taxes'],
];

export function initSources() {
  const entries = Object.entries(SOURCES);
  mount('sources',
    el('p', { class: 'note', style: { marginBottom: '16px', columnSpan: 'all' } }, `All sources accessed ${fmtDate(ACCESSED)}. Dates shown are the publisher’s own publication or update dates; "undated" means none was displayed.`),
    GROUPS.map(([prefix, title]) => {
      const items = entries.filter(([id]) => id.startsWith(prefix));
      if (!items.length) return null;
      return el('div', { style: { breakInside: 'avoid', marginBottom: '16px' } },
        el('h4', { style: { fontSize: '14px', margin: '0 0 8px' } }, title),
        el('ol', {}, items.map(([id, s]) => el('li', {}, el('code', {}, id), ' ', el('a', { href: s.url, target: '_blank', rel: 'noopener' }, s.title), ` — ${s.pub}, ${s.date ? fmtDate(s.date) : 'undated'}`, s.note ? el('span', { class: 'muted' }, ` (${s.note})`) : null))),
      );
    }),
  );
}
