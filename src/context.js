// Shared resolution context and helpers used by several sections.
import { FEATURES, verdictFor, resolveEu } from './data/features.js';
import { AVAILABILITY, UNKNOWN } from './data/availability.js';
import { LANGUAGE_SUPPORT } from './data/language-support.js';
import { COUNTRY_BY_CODE } from './data/countries.js';

export function ctxFor(state) {
  const c = state.country ? COUNTRY_BY_CODE[state.country] : null;
  return { availability: AVAILABILITY, unknown: UNKNOWN, languageSupport: LANGUAGE_SUPPORT, countryName: c?.name || null, total: 27 };
}

export function selection(state) {
  return { country: state.country, langCodes: state.langs };
}

/** All features with their verdict and resolved EU cell for the current state. */
export function evaluate(state) {
  const ctx = ctxFor(state);
  const sel = selection(state);
  return FEATURES.map((f) => ({ f, verdict: verdictFor(f, sel, ctx), eu: resolveEu(f, sel, ctx) }));
}

export function tally(state) {
  const counts = { us: 0, eu: 0, same: 0, depends: 0, mixed: 0 };
  for (const { verdict } of evaluate(state)) counts[verdict] = (counts[verdict] || 0) + 1;
  return counts;
}

export const VERDICT_LABEL = {
  us: 'US ahead',
  eu: 'EU ahead',
  same: 'Same',
  depends: 'Depends',
  mixed: 'Mixed',
};

export const STATUS_LABEL = { yes: 'Available', no: 'Not available', partial: 'Partial', na: 'N/A' };
export const STATUS_GLYPH = { yes: '✓', no: '×', partial: '◐', na: '–' };
