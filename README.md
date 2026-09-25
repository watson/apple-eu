# Apple in the EU vs the US

A single-page, interactive infographic comparing what an Apple customer gets in the
European Union versus the United States: Apple Intelligence and Siri, subscriptions,
app-store freedoms under the Digital Markets Act, satellite services, Wallet, health
features, hardware, pricing and consumer rights.

The audience is anyone living in one of the 27 EU member states. Pick your country and
the page resolves every "depends on the member state" item for you, pre-selects your
official language for the language checker, and shows your local Apple One tier and
iPhone price against the US.

**Data snapshot: 25 September 2026.** Everything comes from Apple's own support, product,
developer and legal pages, plus the European Commission for the legal position.

## Run it locally

No build step and no dependencies. Node.js 22 or newer (an `.nvmrc` selects Node 26 for nvm users). Any static file server works; the repo ships a tiny one:

```sh
npm run dev          # serves the site at http://localhost:5173
```

or, without Node:

```sh
python3 -m http.server 5173
```

Then open <http://localhost:5173>. A country can be preselected with `?country=DK`
(any EU ISO code).

The site uses ES modules, so it must be served over HTTP rather than opened as a `file://` URL.

## Check the data

```sh
npm test             # validates the datasets (ids, statuses, sources, country codes)
```

## Project layout

```
index.html                  page skeleton and static copy
src/main.js                 entry point, wires up all sections
src/state.js                selected country / language / filters (URL + localStorage)
src/sections/*.js           one renderer per section (hero, scorecard, map, …)
src/components/*.js         tooltip, status chips, country select
src/styles/main.css         design tokens, light and dark themes, components
src/data/features.js        the feature-by-feature comparison (hand-written, cited)
src/data/sources.js         source register (IDs match the research document)
src/data/countries.js       the 27 member states, currencies, languages, map tiles
src/data/languages.js       the 24 official EU languages
src/data/timeline.js        key dates
src/data/map-features.js    which availability lists can be painted on the map
src/data/availability.js    GENERATED per-country lists
src/data/language-support.js GENERATED per-language lists
src/data/pricing.js         GENERATED Apple One / Fitness+ / iPhone / iCloud+ prices
src/data/fx.js              GENERATED ECB 12-month average exchange rates (conversion toggle)
scripts/build-data.mjs      regenerates the three GENERATED data modules from research/raw
scripts/build-fx.mjs        regenerates fx.js from the ECB rates CSV in research/raw
scripts/validate-data.mjs   the test
scripts/serve.mjs           zero-dependency static server
research/RESEARCH-2026-09-25.md   the underlying research report
research/raw/*.json         structured extracts of Apple's availability and price pages
```

## Updating the snapshot

1. Re-fetch Apple's availability pages and refresh the JSON in `research/raw/`
   (each file keeps the raw list text next to every derived value so it can be audited).
2. Run `node scripts/build-data.mjs` to regenerate the data modules.
3. Update `src/data/features.js` and `src/data/timeline.js` by hand where Apple's
   published position has changed, and add new sources to `src/data/sources.js`.
4. Change the snapshot date in `index.html` and `src/data/sources.js`.
5. Run `npm test`.

## How to read the comparison

- **Explicitly unavailable** means Apple states a restriction. **Not listed** means a
  country or language is missing from Apple's availability page.
- Prices are advertised standard prices in local currency. EU prices include VAT; US
  prices exclude sales tax and are marked with an asterisk. Currency conversion is off by
  default; when on, it uses the ECB's average daily reference rates over the last twelve
  months (the USD rate is adjustable in the price explorer).
- The site records what Apple publishes, not device tests.

Not affiliated with or endorsed by Apple Inc.
