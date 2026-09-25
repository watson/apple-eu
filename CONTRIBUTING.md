# Contributing

Corrections are the most valuable contribution to a project like this. If Apple has
changed something, or a claim on the page does not match its source, open an issue or a
pull request with a link to the Apple page that shows the current position.

## Run it locally

No build step and no dependencies. Node.js 22 or newer (an `.nvmrc` selects Node 26 for
nvm users), or any static file server.

```sh
npm run dev          # serves the site at http://localhost:5173
```

or, without Node:

```sh
python3 -m http.server 5173
```

Then open <http://localhost:5173>. A country can be preselected with `?country=DK` (any
EU ISO code). The site uses ES modules, so it must be served over HTTP rather than opened
as a `file://` URL.

## Check the data

```sh
npm test             # validates the datasets (ids, statuses, sources, country codes)
```

Run this before opening a pull request. It checks that every feature has valid statuses
and at least one source, that every source ID exists, that every per-country list uses
real EU codes, and that every map feature points at an existing list.

## Project layout

```
index.html                    page skeleton and static copy
src/main.js                   entry point, wires up all sections
src/state.js                  selected country / language / filters (URL + localStorage)
src/sections/*.js             one renderer per section (hero, scorecard, map, …)
src/components/*.js           tooltip, status chips, country select, toggles, tabs, settings
src/styles/main.css           design tokens, light and dark themes, components
src/data/features.js          the feature-by-feature comparison (hand-written, cited)
src/data/sources.js           source register (IDs match the research document)
src/data/countries.js         the 27 member states, currencies, languages, map tiles
src/data/languages.js         the 24 official EU languages
src/data/timeline.js          key dates
src/data/map-features.js      which availability lists can be painted on the map
src/data/us-sales-tax.js      combined state + local sales tax rates (Tax Foundation)
src/data/availability.js      GENERATED per-country lists
src/data/language-support.js  GENERATED per-language lists
src/data/pricing.js           GENERATED Apple One / Fitness+ / iPhone / iCloud+ prices
src/data/fx.js                GENERATED ECB 12-month average exchange rates
scripts/build-data.mjs        regenerates the three GENERATED data modules from research/raw
scripts/build-fx.mjs          regenerates fx.js from the ECB rates CSV in research/raw
scripts/validate-data.mjs     the test
scripts/serve.mjs             zero-dependency static server
research/RESEARCH-2026-09-25.md   the underlying research report
research/raw/*.json           structured extracts of Apple's availability and price pages
research/raw/*.csv            ECB daily reference rates used for the conversion averages
```

## Adding or changing a feature

Features live in `src/data/features.js`. Each entry needs a unique `id`, a `category`,
a `title`, a one-line `short`, a `detail` paragraph, a status for `us` and `eu`
(`yes`, `no`, `partial` or `na`), and at least one source ID from `src/data/sources.js`.

- If the EU side varies by member state, set `eu.status` to `partial` and point
  `eu.avail` at a list in `src/data/availability.js`.
- If it varies by language, point `eu.lang` at a list in `src/data/language-support.js`.
- Use `verdict` only to override the derived outcome (for example `mixed` for a trade-off).

Add new sources to `src/data/sources.js` with the publisher, title, URL and the page's own
publication or update date. Write claims the way the source states them: "explicitly
unavailable" when Apple says so, "not listed" when a country or language is simply
missing from an availability page.

## Updating the snapshot

1. Re-fetch Apple's availability pages and refresh the JSON in `research/raw/` (each file
   keeps the raw list text next to every derived value so it can be audited).
2. Fetch fresh ECB reference rates into `research/raw/` and run `node scripts/build-fx.mjs`.
3. Run `node scripts/build-data.mjs` to regenerate the data modules.
4. Update `src/data/features.js`, `src/data/timeline.js` and `src/data/us-sales-tax.js`
   by hand where the published position has changed, and add new sources.
5. Change the "as of" date in `index.html`, the accessed date in `src/data/sources.js`,
   and the year in the footer.
6. Run `npm test`.

## Style

Vanilla JavaScript, CSS and HTML; no framework, no build step, no runtime dependencies.
Text goes into the DOM through `textContent`, never through string-built HTML. Keep the
page working with JavaScript disabled where it can (static copy stays in `index.html`).
