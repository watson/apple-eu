// Data integrity checks for the site's datasets. Run: npm test
import { FEATURES, CATEGORIES } from '../src/data/features.js';
import { SOURCES } from '../src/data/sources.js';
import { AVAILABILITY } from '../src/data/availability.js';
import { LANGUAGE_SUPPORT } from '../src/data/language-support.js';
import { COUNTRIES, EU_CODES } from '../src/data/countries.js';
import { EU_LANGUAGES } from '../src/data/languages.js';
import { PRICING } from '../src/data/pricing.js';
import { TIMELINE } from '../src/data/timeline.js';
import { MAP_FEATURES } from '../src/data/map-features.js';

const problems = [];
const check = (ok, msg) => { if (!ok) problems.push(msg); };
const STATUSES = new Set(['yes', 'no', 'partial', 'na']);
const VERDICTS = new Set(['us', 'eu', 'same', 'depends', 'mixed']);
const LANG_CODES = new Set(EU_LANGUAGES.map((l) => l.code));

check(COUNTRIES.length === 27, `expected 27 EU countries, got ${COUNTRIES.length}`);
check(EU_LANGUAGES.length === 24, `expected 24 EU languages, got ${EU_LANGUAGES.length}`);
const grid = new Set();
for (const c of COUNTRIES) {
  check(c.flag && c.name && c.currency, `country ${c.code} incomplete`);
  const key = c.grid.join(',');
  check(!grid.has(key), `country ${c.code} shares a map tile with another country`);
  grid.add(key);
  for (const l of c.languages) check(LANG_CODES.has(l), `country ${c.code} has unknown language ${l}`);
}

const ids = new Set();
for (const f of FEATURES) {
  check(!ids.has(f.id), `duplicate feature id ${f.id}`); ids.add(f.id);
  check(CATEGORIES.some((c) => c.id === f.category), `feature ${f.id}: unknown category ${f.category}`);
  check(STATUSES.has(f.us.status) && STATUSES.has(f.eu.status), `feature ${f.id}: bad status`);
  check(!f.verdict || VERDICTS.has(f.verdict), `feature ${f.id}: bad verdict ${f.verdict}`);
  check(f.short && f.detail && f.title, `feature ${f.id}: missing text`);
  check(Array.isArray(f.sources) && f.sources.length > 0, `feature ${f.id}: no sources`);
  for (const s of f.sources || []) check(SOURCES[s], `feature ${f.id}: unknown source ${s}`);
  if (f.eu.avail) check(Array.isArray(AVAILABILITY[f.eu.avail]), `feature ${f.id}: unknown availability key ${f.eu.avail}`);
  if (f.eu.lang) check(Array.isArray(LANGUAGE_SUPPORT[f.eu.lang]), `feature ${f.id}: unknown language key ${f.eu.lang}`);
  if (f.eu.status === 'partial') check(f.eu.avail || f.eu.lang || f.verdict, `feature ${f.id}: partial EU status without a resolver or explicit verdict`);
}

for (const [key, list] of Object.entries(AVAILABILITY)) {
  check(Array.isArray(list), `availability ${key} is not a list`);
  for (const code of list) check(EU_CODES.includes(code), `availability ${key}: unknown code ${code}`);
  check(new Set(list).size === list.length, `availability ${key}: duplicate codes`);
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

check(PRICING.US?.iphone18Pro?.from > 0, 'US iPhone price missing');
for (const code of EU_CODES) check(PRICING[code], `pricing missing for ${code}`);
for (const [code, p] of Object.entries(PRICING)) for (const plan of p.appleOne.plans) check(['individual', 'family', 'premier'].includes(plan.tier) && plan.monthly > 0, `pricing ${code}: bad plan ${plan.tier}`);

if (problems.length) { console.error(`✖ ${problems.length} problem(s):\n- ` + problems.join('\n- ')); process.exit(1); }
console.log(`✔ data OK: ${FEATURES.length} features, ${Object.keys(AVAILABILITY).length} availability lists, ${Object.keys(SOURCES).length} sources, ${COUNTRIES.length} countries`);
