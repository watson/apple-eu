// The hardware products in the price explorer. Each has one row per storefront in
// data/prices.csv (product = id, tier = from), refreshed by scripts/fetch-prices.mjs.
// Every price is for the configuration in `config`: the entry configuration Apple
// lists first on the product's store page, which is the same part number in every
// storefront and so compares like for like. `sources` are the product's technical
// specification pages (US and Denmark), cited from the chart's Sources tab.
export const HARDWARE = [
  {
    id: 'iphone18Pro',
    label: 'iPhone 18 Pro',
    config: '256 GB',
    configNote: 'the 256 GB model',
    store: 'buy-iphone/iphone-18-pro',
    sources: ['S18', 'S19'],
  },
  {
    id: 'iphoneDuo',
    label: 'iPhone Duo',
    config: '256 GB',
    configNote: 'the 256 GB model',
    store: 'buy-iphone/iphone-duo',
    sources: ['S35', 'S36'],
  },
  {
    id: 'macbookNeo',
    label: 'MacBook Neo',
    config: 'A18 Pro, 8 GB, 256 GB',
    configNote: 'the 13-inch model with the A18 Pro chip, 8 GB of unified memory and 256 GB of storage',
    store: 'buy-mac/macbook-neo',
    sources: ['S37', 'S38'],
  },
  {
    id: 'watchSeries12',
    label: 'Apple Watch Series 12',
    config: '42 mm aluminium, GPS',
    configNote: 'the 42 mm aluminium case with GPS only and a Sport Band',
    store: 'buy-watch/apple-watch',
    sources: ['S39', 'S40'],
  },
];

export const HARDWARE_BY_ID = Object.fromEntries(HARDWARE.map((h) => [h.id, h]));
export const DEFAULT_HARDWARE = HARDWARE[0].id;
