// Refreshes the hardware rows of data/prices.csv (the products in src/data/hardware.js)
// from Apple's online store: one page per product per storefront, the sixteen EU
// storefronts and the US. Apple One and Fitness+ rows are left alone.
//
//   node scripts/fetch-prices.mjs                  # dry run: print every price and what differs from the CSV
//   node scripts/fetch-prices.mjs --write          # apply to data/prices.csv, then run npm test
//   node scripts/fetch-prices.mjs --json out.json  # also save the extracted figures (for research/raw/<date>/)
//   node scripts/fetch-prices.mjs --only iphoneDuo  # one product (comma-separate several); --country DK,US likewise
//
// Each store page embeds its prices. iPhone pages carry a <script id="metrics"> JSON with
// one entry per part number ("iPhone Duo 256GB Star White" with a fullPrice); Mac and Watch
// pages carry a price map keyed by configuration ("watch_cases-aluminum-42mm-gps": { amount }).
// PICK says which configuration each product's row is for and must agree with the `config`
// text in src/data/hardware.js. The page's schema.org lowPrice is printed as a cross-check.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseCsv } from './build.mjs';
import { HARDWARE } from '../src/data/hardware.js';
import { COUNTRIES } from '../src/data/countries.js';

const root = resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const write = args.includes('--write');
const jsonOut = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;
const only = args.includes('--only') ? args[args.indexOf('--only') + 1].split(',') : null;
const onlyCountries = args.includes('--country') ? args[args.indexOf('--country') + 1].split(',') : null;
const today = new Date().toISOString().slice(0, 10);

/** apple.com path segment of each storefront. The other eleven EU countries have no Apple online store. */
const STOREFRONTS = { US: '', AT: 'at', BE: 'be-fr', CZ: 'cz', DK: 'dk', FI: 'fi', FR: 'fr', DE: 'de', HU: 'hu', IE: 'ie', IT: 'it', LU: 'lu', NL: 'nl', PL: 'pl', PT: 'pt', ES: 'es', SE: 'se' };

/** How to find the priced configuration on each product's page. */
const PICK = {
  iphone18Pro: { sku: /^iPhone 18 Pro 256 ?GB\b/i }, // not "Pro Max"
  iphoneDuo: { sku: /^iPhone Duo 256 ?GB\b/i },
  macbookNeo: { priceKey: /^[a-z]+-6-5-256gb$/ }, // <colour>-<CPU cores>-<GPU cores>-<storage>
  watchSeries12: { priceKey: /^watch_cases-aluminum-42mm-gps$/ },
};

/** Wording that marks a storefront's prices as VAT-inclusive, used only for a storefront with no checked row yet;
 *  the CSV cell stays blank when the page does not say. Non-breaking spaces are normalised before matching. */
const VAT_WORDS = {
  AT: /(inkl\.?|inklusive|einschließlich) ?(MwSt|USt)/i, DE: /(inkl\.?|inklusive|einschließlich) ?(MwSt|USt)/i, BE: /TVA (incluse|comprise)|incl\. TVA|incl\. btw|TTC/i,
  FR: /TVA (incluse|comprise)|TTC/i, LU: /TVA (incluse|comprise)|TTC/i, CZ: /včetně DPH|vč\. DPH|s DPH/i,
  DK: /inkl(\.|usive)? moms/i, SE: /inkl(\.|usive)? moms/i, FI: /sis\.? ALV|sisältää ALV/i, HU: /ÁFA/i,
  IE: /incl(uding|\.)? VAT|VAT included/i, IT: /IVA inclusa|incl\. IVA/i, NL: /incl(usief|\.) btw/i,
  PL: /z VAT|w tym VAT|zawiera VAT/i, PT: /IVA inclu[íi]do|com IVA/i, ES: /IVA incluido|incl\. IVA/i,
};

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36';

function metricsProducts(html) {
  const m = html.match(/<script type="application\/json" id="metrics">([\s\S]*?)<\/script>/);
  if (!m) return [];
  try { const j = JSON.parse(m[1]); return (j.data || j).products || []; } catch { return []; }
}

function ldOffer(html) {
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      for (const o of [].concat(JSON.parse(m[1]))) {
        const offer = [].concat(o.offers || [])[0];
        if (offer) return { low: Number(offer.lowPrice ?? offer.price), currency: offer.priceCurrency };
      }
    } catch { /* not JSON we care about */ }
  }
  return null;
}

/** The configuration's price(s) on the page, plus what the page offers (for the error message when nothing matched).
 *  More than one distinct price means PICK is ambiguous. */
function pickPrice(html, pick) {
  if (pick.sku) {
    const all = metricsProducts(html);
    const hits = all.filter((p) => pick.sku.test((p.name || '').replace(/\u00a0/g, ' '))); // names use non-breaking spaces
    return { prices: [...new Set(hits.map((p) => Number(p.price?.fullPrice)).filter(Number.isFinite))], names: [...new Set(hits.map((p) => p.name))], candidates: [...new Set(all.map((p) => p.name))].slice(0, 6) };
  }
  const prices = new Set(); const names = new Set(); const candidates = new Set();
  for (const m of html.matchAll(/"([a-z0-9_-]+)":\{/g)) {
    const amt = html.slice(m.index, m.index + 1500).match(/"amount":([0-9.]+)/);
    if (!amt) continue;
    if (candidates.size < 8) candidates.add(m[1]);
    if (!pick.priceKey.test(m[1])) continue;
    prices.add(Number(amt[1])); names.add(m[1]);
  }
  return { prices: [...prices], names: [...names], candidates: [...candidates] };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchOne(product, cc, attempt = 1) {
  const url = `https://www.apple.com/${STOREFRONTS[cc] ? STOREFRONTS[cc] + '/' : ''}shop/${product.store}`;
  let html;
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(30000) });
    if (!res.ok) return { product: product.id, country: cc, url, error: `HTTP ${res.status}` };
    html = await res.text();
  } catch (e) {
    if (attempt < 3) { await sleep(2000 * attempt); return fetchOne(product, cc, attempt + 1); }
    return { product: product.id, country: cc, url, error: `network: ${e.cause?.code || e.name || e.message}` };
  }
  const { prices, names, candidates } = pickPrice(html, PICK[product.id]);
  // Apple's store sometimes answers a burst of requests with a page that lacks the price data; try again once.
  if (!prices.length && attempt < 3) { await sleep(1500 * attempt); return fetchOne(product, cc, attempt + 1); }
  const ld = ldOffer(html);
  const expected = cc === 'US' ? 'USD' : COUNTRIES.find((c) => c.code === cc)?.currency;
  const currency = ld?.currency || expected;
  const problems = [];
  if (prices.length !== 1) problems.push(prices.length ? `ambiguous: ${prices.join('/')}` : `configuration not found; the page offers ${candidates.length ? candidates.join(' | ') : 'no price data'} (${html.length} bytes)`);
  if (currency !== expected) problems.push(`currency ${currency}, expected ${expected}`);
  if (ld && prices.length === 1 && ld.low !== prices[0]) problems.push(`page "from" price is ${ld.low}`);
  const vat = cc === 'US' ? 'N' : (VAT_WORDS[cc]?.test(html.replace(/&nbsp;|\u00a0/g, ' ')) ? 'Y' : '');
  return { product: product.id, country: cc, url, price: prices[0] ?? null, currency, names, lowPrice: ld?.low ?? null, vatIncluded: vat, error: problems.join('; ') || null };
}

async function pool(tasks, n) {
  const out = []; let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < tasks.length) { const k = i++; out[k] = await tasks[k](); } }));
  return out;
}

const csvQuote = (v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
const serialise = (header, rows) => [header.join(','), ...rows.map((r) => header.map((h) => csvQuote(r[h] ?? '')).join(','))].join('\n') + '\n';

async function main() {
  const file = resolve(root, 'data/prices.csv');
  const text = readFileSync(file, 'utf8');
  const header = text.split('\n')[0].split(',');
  const rows = parseCsv(text);
  if (serialise(header, rows) !== text) throw new Error('data/prices.csv would not round-trip unchanged; refusing to rewrite it');

  const tasks = [];
  for (const product of HARDWARE) if (!only || only.includes(product.id)) for (const cc of Object.keys(STOREFRONTS)) if (!onlyCountries || onlyCountries.includes(cc)) tasks.push(() => fetchOne(product, cc));
  const results = await pool(tasks, 4);

  let changed = 0, added = 0, failed = 0;
  for (const r of results) {
    const existing = rows.find((x) => x.country === r.country && x.product === r.product);
    let status;
    if (r.error && r.price == null) { status = `FAILED: ${r.error}`; failed++; }
    else if (!existing) { status = 'new'; added++; }
    else if (Number(existing.monthly) !== r.price) { status = `was ${existing.monthly}`; changed++; }
    else status = 'unchanged';
    const warn = r.error && r.price != null ? `  ⚠ ${r.error}` : '';
    console.log(`${r.country.padEnd(3)} ${r.product.padEnd(14)} ${String(r.price ?? '—').padStart(9)} ${r.currency || '   '}  vat:${(r.vatIncluded || '-').padEnd(1)}  ${status}${warn}`);
    if (r.price == null) continue;
    // VAT inclusion is stated per storefront, not per product: keep the value already checked for this storefront's hardware rows.
    const storefront = rows.find((x) => x.country === r.country && HARDWARE.some((h) => h.id === x.product));
    const row = { country: r.country, product: r.product, tier: 'from', localName: '', monthly: String(r.price), yearly: '', storageGB: '', services: '', currency: r.currency, vatIncluded: existing?.vatIncluded ?? storefront?.vatIncluded ?? r.vatIncluded, url: r.url, accessed: status === 'unchanged' ? existing.accessed : today };
    if (existing) { if (status !== 'unchanged') Object.assign(existing, row); }
    else {
      // Keep the file grouped by country: insert after the country's last row (or at the end).
      let at = rows.length; for (let i = rows.length - 1; i >= 0; i--) if (rows[i].country === r.country) { at = i + 1; break; }
      rows.splice(at, 0, row);
    }
  }
  console.log(`\n${results.length} prices: ${added} new, ${changed} changed, ${failed} failed`);
  if (jsonOut) writeFileSync(resolve(jsonOut), JSON.stringify({ fetched: today, results }, null, 2) + '\n');
  if (failed) { console.error('Not writing: fix the failures first.'); process.exitCode = 1; return; }
  if (write) { writeFileSync(file, serialise(header, rows)); console.log('wrote data/prices.csv; now run npm test'); }
  else console.log('dry run; add --write to apply');
}

main().catch((e) => { console.error(e); process.exit(1); });
