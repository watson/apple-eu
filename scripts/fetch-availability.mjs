// Refreshes data/availability.csv and data/language-support.csv from Apple's
// three feature-availability pages (iOS, watchOS, AirPods Pro) and reports what
// changed. Rows whose `page` is "manual" or "derived" are left alone.
//
//   node scripts/fetch-availability.mjs           # dry run: print the differences
//   node scripts/fetch-availability.mjs --write   # apply them to the CSV files
//
// Apple's pages are one <section id="…"> per feature with an <h2> and a <ul> of
// countries, cities or languages. A country counts as listed when an entry is
// the country's name or ends with ", <country name>" (city entries).
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseCsv } from './build.mjs';

const root = resolve(import.meta.dirname, '..');
const write = process.argv.includes('--write');

const PAGES = {
  ios: 'https://www.apple.com/ios/feature-availability/',
  watchos: 'https://www.apple.com/watchos/feature-availability/',
  airpods: 'https://www.apple.com/airpods-pro/feature-availability/',
};
const EU = { AT: 'Austria', BE: 'Belgium', BG: 'Bulgaria', HR: 'Croatia', CY: 'Cyprus', CZ: 'Czechia', DK: 'Denmark', EE: 'Estonia', FI: 'Finland', FR: 'France', DE: 'Germany', GR: 'Greece', HU: 'Hungary', IE: 'Ireland', IT: 'Italy', LV: 'Latvia', LT: 'Lithuania', LU: 'Luxembourg', MT: 'Malta', NL: 'Netherlands', PL: 'Poland', PT: 'Portugal', RO: 'Romania', SK: 'Slovakia', SI: 'Slovenia', ES: 'Spain', SE: 'Sweden' };
const LANGS = { bg: 'Bulgarian', hr: 'Croatian', cs: 'Czech', da: 'Danish', nl: 'Dutch', en: 'English', et: 'Estonian', fi: 'Finnish', fr: 'French', de: 'German', el: 'Greek', hu: 'Hungarian', ga: 'Irish', it: 'Italian', lv: 'Latvian', lt: 'Lithuanian', mt: 'Maltese', pl: 'Polish', pt: 'Portuguese', ro: 'Romanian', sk: 'Slovak', sl: 'Slovenian', es: 'Spanish', sv: 'Swedish' };

const decode = (s) => s.replace(/<[^>]+>/g, '').replace(/&nbsp;| /g, ' ').replace(/&amp;/g, '&').replace(/&#8209;|‑/g, '-').replace(/\s+/g, ' ').trim();

/** Parse a page into { sectionId: { title, items, text } }. */
function parsePage(html) {
  const sections = {};
  const re = /<section[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/section>/g;
  let m;
  while ((m = re.exec(html))) {
    const [, id, body] = m;
    const title = decode((body.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [])[1] || '');
    const items = [...body.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((x) => decode(x[1])).filter(Boolean);
    const text = decode(body.replace(/<h2[\s\S]*?<\/h2>/, ''));
    sections[id] = { title, items, text };
  }
  return sections;
}

// Apple is not consistent about country names between lists.
const ALIASES = { Czechia: ['Czech Republic'], Netherlands: ['The Netherlands'], Slovakia: ['Slovak Republic'] };
function countryListed(items, text, name) {
  if (!items.length && /available worldwide/i.test(text)) return true;
  const names = [name, ...(ALIASES[name] || [])];
  return items.some((it) => names.some((n) => it === n || it.endsWith(`, ${n}`) || it.startsWith(`${n} (`) || it.endsWith(` (${n})`)));
}
function languageListed(items, name) {
  return items.some((it) => it === name || it.startsWith(`${name} (`) || it.startsWith(`${name},`));
}

const csvQuote = (v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
function writeCsv(file, header, rows) {
  writeFileSync(file, [header, ...rows.map((r) => header.map((h) => csvQuote(r[h] ?? '')))].map((r) => (Array.isArray(r) ? r.join(',') : r.join(','))).join('\n') + '\n');
}

async function main() {
  const pages = {};
  for (const [key, url] of Object.entries(PAGES)) {
    const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (apple-eu data refresh)' } });
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    pages[key] = parsePage(await res.text());
    console.log(`${key}: ${Object.keys(pages[key]).length} sections`);
  }

  const changes = [];
  const missing = [];

  // --- availability.csv ---
  const availFile = resolve(root, 'data/availability.csv');
  const availText = readFileSync(availFile, 'utf8');
  const availHeader = availText.split('\n')[0].split(',');
  const avail = parseCsv(availText);
  for (const row of avail) {
    if (!PAGES[row.page]) continue;
    const sec = pages[row.page][row.section];
    if (!sec) { missing.push(`${row.key}: section "${row.section}" not found on ${row.page}`); continue; }
    for (const [code, name] of Object.entries(EU)) {
      const val = countryListed(sec.items, sec.text, name) ? 'Y' : 'N';
      if (row[code] !== val) { changes.push(`${row.key} ${code}: ${row[code]} -> ${val}`); row[code] = val; }
    }
  }

  // --- language-support.csv ---
  const langFile = resolve(root, 'data/language-support.csv');
  const langText = readFileSync(langFile, 'utf8');
  const langHeader = langText.split('\n')[0].split(',');
  const langs = parseCsv(langText);
  for (const row of langs) {
    if (!PAGES[row.page]) continue;
    const sec = pages[row.page][row.section];
    if (!sec) { missing.push(`${row.key}: section "${row.section}" not found on ${row.page}`); continue; }
    for (const [code, name] of Object.entries(LANGS)) {
      const val = languageListed(sec.items, name) ? 'Y' : 'N';
      if (row[code] !== val) { changes.push(`${row.key} ${code}: ${row[code]} -> ${val}`); row[code] = val; }
    }
  }

  if (missing.length) console.log('\nSections not found (check the ids in the CSV):\n- ' + missing.join('\n- '));
  if (!changes.length) console.log('\nNo differences: the CSV files match Apple’s pages.');
  else {
    console.log(`\n${changes.length} cell(s) differ from Apple’s pages:\n- ` + changes.join('\n- '));
    if (write) {
      writeCsv(availFile, availHeader, avail);
      writeCsv(langFile, langHeader, langs);
      console.log('\nCSV files updated. Now run: node scripts/build.mjs, review the feature text, and bump data/snapshot.json.');
    } else console.log('\nDry run. Re-run with --write to apply.');
  }
  if (missing.length) process.exitCode = 2;
}

main().catch((e) => { console.error(e); process.exit(1); });
