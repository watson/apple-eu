# Contributing

Corrections are the most valuable contribution to a project like this. If Apple has
changed something, or a claim on the page does not match its source, please
[open an issue](https://github.com/watson/apple-eu/issues) first and include a link to
the Apple page that shows the current position.

Please do not send a pull request without an issue behind it. Discussing the change
first avoids wasted work: many apparent differences turn out to hinge on which page,
language or account country was checked, and that is easier to settle in an issue than
in a review. Once the change is agreed, a pull request is very welcome, and the sections
below describe how to make one.

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
npm test             # regenerates src/data from data/ and validates everything
```

Run this before opening a pull request. It checks the CSV files (every cell a valid
value, every source ID known), the hand-written datasets (statuses, sources, categories),
and that every placeholder in the feature prose resolves to a real list.

## Where the data lives

`data/` is the single source of truth for everything that changes over time. The
JavaScript modules in `src/data/` that the site loads are **generated** from it by
`scripts/build.mjs`; CI fails if they are out of date, so never edit them by hand.

```
data/snapshot.json          the "as of" date shown on the page, and the tax/ECB windows
data/availability.csv       one row per availability list, one column per EU country (Y, N, or ? for not published)
data/language-support.csv   one row per language-gated feature, one column per official EU language
data/country-details.csv    per-country extras: store counts, transit cities, Tap to Pay providers, Detailed City cities
data/prices.csv             Apple One tiers, Fitness+ and iPhone 18 Pro prices per storefront, with URL and access date
data/vat-rates.csv          standard VAT rate per member state
data/us-sales-tax.csv       combined state + average local sales tax per US state, plus the AVG row
data/ecb-rates.csv          the ECB's daily euro reference rates for the averaging window (their CSV, unmodified)
data/sources.csv            the source register; IDs are cited from features, timeline and map entries
```

Hand-written, in `src/data/`: `features.js` (the comparison itself, with prose),
`timeline.js`, `map-features.js`, `countries.js`, `languages.js`.

Generated, in `src/data/`: `availability.js`, `language-support.js`, `pricing.js`,
`fx.js`, `sources.js`, `us-sales-tax.js`, `snapshot.js`.

The rest of the layout:

```
index.html                  page skeleton and static copy
src/main.js                 entry point, wires up all sections
src/text.js                 fills {count:key}-style placeholders in prose and data-fill spans in the HTML
src/state.js                selected country / language / controls
src/sections/*.js           one renderer per section
src/components/*.js         tooltip, chips, selects, toggles, tabs, settings
src/styles/main.css         design tokens, light and dark themes, components
scripts/build.mjs           data/ → src/data/ generator
scripts/fetch-availability.mjs  refreshes the two availability CSVs from Apple's pages
scripts/validate-data.mjs   the test
scripts/serve.mjs           zero-dependency static server
research/reports/           dated research and fact-check reports (immutable records)
research/raw/<date>/        the raw extracts a snapshot was built from (provenance)
```

## Prose that quotes the data

Feature text in `features.js` and copy in `index.html` must not hard-code counts or
country lists. Use placeholders, which are filled from the data at render time:

| Placeholder | Renders as |
|---|---|
| `{count:fitnessPlus}` | `12` |
| `{list:visionPro}` | `France and Germany` |
| `{missing:hearingAid}` | `Belgium, France and Spain` |
| `{missingcount:fitnessPlus}` | `15` |
| `{unknowncount:appleOnePremier}` | `11` (countries with `?` in the CSV) |
| `{langcount:appleIntelligence}` | `9` |
| `{langs:workoutBuddy}` | `English and Spanish` |
| `{asOf}`, `{year}` | the snapshot date |

In `index.html` use `<span data-fill="count:fitnessPlus">12</span>`; the number inside
is only a fallback for readers without JavaScript. A label on a per-country feature can
be omitted entirely; the site derives "12 of 27 countries" or "All 27 countries" itself.

## Adding or changing a feature

Features live in `src/data/features.js`. Each entry needs a unique `id`, a `category`,
a `title`, a one-line `short`, a `detail` paragraph, a status for `us` and `eu`
(`yes`, `no`, `partial` or `na`), and at least one source ID from `data/sources.csv`.

- If the EU side varies by member state, set `eu.status` to `partial` and point
  `eu.avail` at a row key in `data/availability.csv`.
- If it varies by language, point `eu.lang` at a row key in `data/language-support.csv`.
- Use `verdict` only to override the derived outcome (for example `mixed` for a trade-off).

Add new sources to `data/sources.csv` with the publisher, title, URL and the page's own
publication or update date. Write claims the way the source states them: "explicitly
unavailable" when Apple says so, "not listed" when a country or language is simply
missing from an availability page.

## Refreshing the snapshot

1. `npm run fetch` downloads Apple's iOS, watchOS and AirPods availability pages and
   prints every cell that differs from `data/availability.csv` and
   `data/language-support.csv`. Read the differences, then `npm run fetch -- --write`
   to apply them. Rows marked `manual` (support articles, price pages, the media
   register) are not touched: check their sources by hand and edit the CSV.
2. Update `data/prices.csv` from the local apple.com pages, `data/us-sales-tax.csv`
   from the Tax Foundation's latest table, and `data/ecb-rates.csv` from the ECB API
   (the URL is in the X2 source entry; change the dates).
3. Set the new dates in `data/snapshot.json`.
4. `npm test` regenerates `src/data/` and validates. Then read through
   `features.js` and `index.html` for prose that the changes made wrong: the numbers
   update themselves, the sentences around them do not.
5. Put the raw pages or extracts you worked from under `research/raw/<date>/` and, if
   the refresh was a substantial re-check, a dated report under `research/reports/`.
6. `npm run social-card` re-renders the link-preview image in `assets/` (needs Google
   Chrome) so the tallies and the date on it match the page. X, Facebook and the
   others cache the image by URL for days, so a refreshed picture shows up late.

## Style

Vanilla JavaScript, CSS and HTML; no framework, no build step, no runtime dependencies.
Text goes into the DOM through `textContent`, never through string-built HTML. Keep the
page working with JavaScript disabled where it can (static copy stays in `index.html`).
