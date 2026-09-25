// Fills data placeholders in prose so counts and country lists never go stale.
//   {count:key}   number of EU countries on the availability list `key`
//   {list:key}    names of the EU countries on the list, joined with commas and "and"
//   {missing:key} names of the EU countries not on the list (and not unknown)
//   {unknown:key} names of the EU countries with no published data for the list
//   {langs:key}   names of the EU languages on the language-support list `key`
//   {langcount:key}
//   {asOf}        the snapshot date, written out
import { AVAILABILITY, UNKNOWN } from './data/availability.js';
import { LANGUAGE_SUPPORT } from './data/language-support.js';
import { COUNTRIES, COUNTRY_BY_CODE } from './data/countries.js';
import { EU_LANGUAGES } from './data/languages.js';
import { SNAPSHOT } from './data/snapshot.js';
import { fmtDateLong } from './dom.js';

const joinNames = (names) => names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
const namesOf = (codes) => COUNTRIES.filter((c) => codes.includes(c.code)).map((c) => c.name);

const RESOLVERS = {
  count: (key) => String(AVAILABILITY[key]?.length ?? '?'),
  list: (key) => joinNames(namesOf(AVAILABILITY[key] || [])),
  missing: (key) => joinNames(namesOf(COUNTRIES.map((c) => c.code).filter((c) => !AVAILABILITY[key]?.includes(c) && !UNKNOWN[key]?.includes(c)))),
  unknown: (key) => joinNames(namesOf(UNKNOWN[key] || [])),
  unknowncount: (key) => String(UNKNOWN[key]?.length ?? 0),
  missingcount: (key) => String(COUNTRIES.filter((c) => !AVAILABILITY[key]?.includes(c.code) && !UNKNOWN[key]?.includes(c.code)).length),
  langs: (key) => joinNames(EU_LANGUAGES.filter((l) => LANGUAGE_SUPPORT[key]?.includes(l.code)).map((l) => l.name)),
  langcount: (key) => String(LANGUAGE_SUPPORT[key]?.length ?? '?'),
  langmissing: (key) => joinNames(EU_LANGUAGES.filter((l) => !LANGUAGE_SUPPORT[key]?.includes(l.code)).map((l) => l.name)),
};

export function fill(text) {
  if (!text || !text.includes('{')) return text;
  return text
    .replace(/\{asOf\}/g, fmtDateLong(SNAPSHOT.asOf))
    .replace(/\{year\}/g, SNAPSHOT.asOf.slice(0, 4))
    .replace(/\{(\w+):(\w+)\}/g, (m, fn, key) => (RESOLVERS[fn] ? RESOLVERS[fn](key) : m));
}

/** Fill every element carrying data-fill="…" in static markup. */
export function fillStatic(root = document) {
  root.querySelectorAll('[data-fill]').forEach((el) => { el.textContent = fill(`{${el.dataset.fill}}`); });
}

void COUNTRY_BY_CODE;
