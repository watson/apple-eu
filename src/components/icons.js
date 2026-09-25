import { svg } from '../dom.js';

/** Crisp status glyphs drawn as SVG strokes: 'yes' → tick, 'no' → cross. Other kinds fall back to text. */
export function glyph(kind) {
  const TEXT = { partial: '◐', na: '–' };
  if (kind === 'yes') {
    return svg('svg', { viewBox: '0 0 12 12', class: 'glyph', 'aria-hidden': 'true' },
      svg('path', { d: 'M2.5 6.5 L5 9 L9.5 3.5', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
  }
  if (kind === 'no') {
    return svg('svg', { viewBox: '0 0 12 12', class: 'glyph', 'aria-hidden': 'true' },
      svg('path', { d: 'M3 3 L9 9 M9 3 L3 9', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round' }));
  }
  return TEXT[kind] ?? '';
}
