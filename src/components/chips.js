import { el } from '../dom.js';
import { STATUS_LABEL, STATUS_GLYPH, VERDICT_LABEL } from '../context.js';
import { sourceList } from '../data/sources.js';
import { fill } from '../text.js';

export function statusChip(cell) {
  const status = cell?.status || 'na';
  return el('span', { class: `chip ${status}`, title: STATUS_LABEL[status] },
    el('span', { class: 'i', 'aria-hidden': 'true' }, STATUS_GLYPH[status]),
    el('span', {}, fill(cell?.label) || STATUS_LABEL[status]),
  );
}

export function verdictPill(verdict) {
  return el('span', { class: `verdict ${verdict}` }, VERDICT_LABEL[verdict] || verdict);
}

export function sourceLinks(ids) {
  return el('div', { class: 'sources' },
    el('span', { class: 'muted' }, 'Sources:'),
    sourceList(ids).map((s) => el('a', { href: s.url, target: '_blank', rel: 'noopener', title: `${s.pub}${s.date ? ' · ' + s.date : ''}` }, `${s.id} ${s.title}`)),
  );
}
