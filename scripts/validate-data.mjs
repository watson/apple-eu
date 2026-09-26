// Data integrity checks. Run: npm test
// Checks the CSV sources in data/, the hand-written datasets, and that every
// placeholder in the feature prose resolves.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseCsv } from './build.mjs';
import { FEATURES, CATEGORIES } from '../src/data/features.js';
import { SOURCES } from '../src/data/sources.js';
import { AVAILABILITY, UNKNOWN } from '../src/data/availability.js';
import { LANGUAGE_SUPPORT } from '../src/data/language-support.js';
import { COUNTRIES, EU_CODES } from '../src/data/countries.js';
import { EU_LANGUAGES } from '../src/data/languages.js';
import { PRICING } from '../src/data/pricing.js';
import { TIMELINE } from '../src/data/timeline.js';
import { MAP_FEATURES } from '../src/data/map-features.js';
import { SNAPSHOT } from '../src/data/snapshot.js';
import { HARDWARE } from '../src/data/hardware.js';

const root = resolve(import.meta.dirname, '..');
const problems = [];
const check = (ok, msg) => { if (!ok) problems.push(msg); };
const STATUSES = new Set(['yes', 'no', 'partial', 'na']);
const VERDICTS = new Set(['us', 'eu', 'same', 'depends', 'mixed']);
const LANG_CODES = new Set(EU_LANGUAGES.map((l) => l.code));
const RESOLVERS = new Set(['count', 'list', 'missing', 'unknown', 'unknowncount', 'missingcount', 'langs', 'langcount', 'langmissing']);

// --- CSV sources ---
const csv = (name) => parseCsv(readFileSync(resolve(root, 'data', name), 'utf8'));
const avail = csv('availability.csv');
for (const r of avail) {
  check(/^[a-zA-Z0-9]+$/.test(r.key), `availability.csv: bad key "${r.key}"`);
  check(['ios', 'watchos', 'airpods', 'manual'].includes(r.page), `availability.csv ${r.key}: page must be ios|watchos|airpods|manual`);
  check(r.page === 'manual' || r.section, `availability.csv ${r.key}: fetchable rows need a section id`);
  for (const c of EU_CODES) check(['Y', 'N', '?'].includes(r[c]), `availability.csv ${r.key}: ${c} must be Y, N or ? (got "${r[c]}")`);
  for (const s of r.sources.split(';').filter(Boolean)) check(SOURCES[s], `availability.csv ${r.key}: unknown source ${s}`);
}
const langs = csv('language-support.csv');
for (const r of langs) for (const l of LANG_CODES) check(['Y', 'N'].includes(r[l]), `language-support.csv ${r.key}: ${l} must be Y or N`);
const prices = csv('prices.csv');
for (const r of prices) {
  check([...EU_CODES, 'US'].includes(r.country), `prices.csv: unknown country ${r.country}`);
  check(['appleOne', 'fitnessPlus'].includes(r.product) || HARDWARE.some((h) => h.id === r.product), `prices.csv ${r.country}: unknown product ${r.product}`);
  check(Number(r.monthly) > 0, `prices.csv ${r.country} ${r.product} ${r.tier}: monthly must be a positive number`);
  check(/^[A-Z]{3}$/.test(r.currency), `prices.csv ${r.country} ${r.product}: currency must be a 3-letter code`);
  check(/^\d{4}-\d{2}-\d{2}$/.test(r.accessed), `prices.csv ${r.country} ${r.product}: accessed must be YYYY-MM-DD`);
}
const vat = csv('vat-rates.csv');
check(vat.length === 27 && vat.every((r) => Number(r.standardRate) > 0), 'vat-rates.csv must have 27 positive rates');
const tax = csv('us-sales-tax.csv');
check(tax.filter((r) => r.code !== 'AVG').length === 51, 'us-sales-tax.csv must have 50 states plus DC');
check(tax.some((r) => r.code === 'AVG'), 'us-sales-tax.csv needs an AVG row');
check(/^\d{4}-\d{2}-\d{2}$/.test(SNAPSHOT.asOf), 'snapshot.json asOf must be YYYY-MM-DD');

// --- reference data ---
check(COUNTRIES.length === 27, `expected 27 EU countries, got ${COUNTRIES.length}`);
check(EU_LANGUAGES.length === 24, `expected 24 EU languages, got ${EU_LANGUAGES.length}`);
const grid = new Set();
for (const c of COUNTRIES) {
  check(c.flag && c.name && c.currency, `country ${c.code} incomplete`);
  const key = c.grid.join(','); check(!grid.has(key), `country ${c.code} shares a map tile with another country`); grid.add(key);
  for (const l of c.languages) check(LANG_CODES.has(l), `country ${c.code} has unknown language ${l}`);
}

// --- features ---
const ids = new Set();
const placeholders = (text) => [...String(text || '').matchAll(/\{(\w+):(\w+)\}/g)];
for (const f of FEATURES) {
  check(!ids.has(f.id), `duplicate feature id ${f.id}`); ids.add(f.id);
  check(CATEGORIES.some((c) => c.id === f.category), `feature ${f.id}: unknown category ${f.category}`);
  check(STATUSES.has(f.us.status) && STATUSES.has(f.eu.status), `feature ${f.id}: bad status`);
  check(!f.verdict || VERDICTS.has(f.verdict), `feature ${f.id}: bad verdict ${f.verdict}`);
  check(f.short && f.detail && f.title, `feature ${f.id}: missing text`);
  check(Array.isArray(f.sources) && f.sources.length > 0, `feature ${f.id}: no sources`);
  for (const s of f.sources || []) check(SOURCES[s], `feature ${f.id}: unknown source ${s}`);
  if (f.eu.avail) check(Array.isArray(AVAILABILITY[f.eu.avail]), `feature ${f.id}: unknown availability key ${f.eu.avail}`);
  if (f.eu.known) check(Array.isArray(AVAILABILITY[f.eu.known]), `feature ${f.id}: unknown availability key ${f.eu.known}`);
  if (f.eu.lang) check(Array.isArray(LANGUAGE_SUPPORT[f.eu.lang]), `feature ${f.id}: unknown language key ${f.eu.lang}`);
  if (f.eu.status === 'partial') check(f.eu.avail || f.eu.lang || f.verdict || f.eu.label, `feature ${f.id}: partial EU status needs a resolver, a label or an explicit verdict`);
  for (const text of [f.short, f.detail, f.us.label, f.eu.label]) for (const [, fn, key] of placeholders(text)) {
    check(RESOLVERS.has(fn), `feature ${f.id}: unknown placeholder {${fn}:${key}}`);
    if (fn.startsWith('lang')) check(Array.isArray(LANGUAGE_SUPPORT[key]), `feature ${f.id}: placeholder {${fn}:${key}} references an unknown language list`);
    else check(Array.isArray(AVAILABILITY[key]), `feature ${f.id}: placeholder {${fn}:${key}} references an unknown availability list`);
  }
  // Prose must not hard-code counts that a data refresh would silently outdate.
  for (const text of [f.short]) check(!/\b\d+ of 27\b/.test(text), `feature ${f.id}: "N of 27" in short text should be a {count:key} placeholder`);
}

for (const [key, list] of Object.entries(AVAILABILITY)) {
  for (const code of list) check(EU_CODES.includes(code), `availability ${key}: unknown code ${code}`);
  for (const code of UNKNOWN[key] || []) check(!list.includes(code), `availability ${key}: ${code} is both listed and unknown`);
}
for (const [key, list] of Object.entries(LANGUAGE_SUPPORT)) for (const l of list) check(LANG_CODES.has(l), `language support ${key}: unknown language ${l}`);

for (const m of MAP_FEATURES) {
  if (m.group) continue;
  check(Array.isArray(AVAILABILITY[m.key]), `map feature ${m.key}: no availability list`);
  for (const s of m.sources) check(SOURCES[s], `map feature ${m.key}: unknown source ${s}`);
  if (m.featureId) check(ids.has(m.featureId), `map feature ${m.key}: unknown featureId ${m.featureId}`);
}
for (const t of TIMELINE) for (const s of t.sources) check(SOURCES[s], `timeline ${t.date}: unknown source ${s}`);
for (const [id, s] of Object.entries(SOURCES)) check(/^https?:\/\//.test(s.url) && s.title && s.pub, `source ${id} incomplete`);
check(new Set(HARDWARE.map((h) => h.id)).size === HARDWARE.length, 'duplicate hardware id');
for (const h of HARDWARE) {
  check(h.id && h.label && h.config && h.configNote && h.store, `hardware ${h.id}: needs id, label, config, configNote and store`);
  check(PRICING.US?.hardware?.[h.id]?.from > 0, `hardware ${h.id}: US price missing`);
  check(EU_CODES.some((c) => PRICING[c]?.hardware?.[h.id]?.from > 0), `hardware ${h.id}: no EU price`);
  for (const s of h.sources || []) check(SOURCES[s], `hardware ${h.id}: unknown source ${s}`);
}
for (const code of EU_CODES) check(PRICING[code], `pricing missing for ${code}`);

// Static markup placeholders
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
for (const [, spec] of html.matchAll(/data-fill="([^"]+)"/g)) {
  if (spec === 'asOf' || spec === 'year') continue;
  const [fn, key] = spec.split(':');
  check(RESOLVERS.has(fn), `index.html: unknown placeholder ${spec}`);
  check(fn.startsWith('lang') ? Array.isArray(LANGUAGE_SUPPORT[key]) : Array.isArray(AVAILABILITY[key]), `index.html: placeholder ${spec} references an unknown list`);
}

if (problems.length) { console.error(`✖ ${problems.length} problem(s):\n- ` + problems.join('\n- ')); process.exit(1); }
console.log(`✔ data OK: ${FEATURES.length} features, ${avail.length} availability rows, ${langs.length} language rows, ${prices.length} price rows, ${Object.keys(SOURCES).length} sources, snapshot ${SNAPSHOT.asOf}`);
