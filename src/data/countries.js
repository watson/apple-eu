// The 27 EU member states. `grid` is a [column, row] position on a schematic
// tile map (1-indexed CSS grid), not a geographic projection.
// `languages` lists the official language(s) most people in the country use with
// their devices, using the codes from languages.js.

export const COUNTRIES = [
  { code: 'AT', name: 'Austria',     flag: '🇦🇹', currency: 'EUR', languages: ['de'],             grid: [4, 6], sitePath: 'at' },
  { code: 'BE', name: 'Belgium',     flag: '🇧🇪', currency: 'EUR', languages: ['nl', 'fr', 'de'], grid: [2, 5], sitePath: 'befr' },
  { code: 'BG', name: 'Bulgaria',    flag: '🇧🇬', currency: 'EUR', languages: ['bg'],             grid: [6, 7], sitePath: 'bg' },
  { code: 'HR', name: 'Croatia',     flag: '🇭🇷', currency: 'EUR', languages: ['hr'],             grid: [5, 7], sitePath: 'hr' },
  { code: 'CY', name: 'Cyprus',      flag: '🇨🇾', currency: 'EUR', languages: ['el'],             grid: [7, 8], sitePath: null },
  { code: 'CZ', name: 'Czechia',     flag: '🇨🇿', currency: 'CZK', languages: ['cs'],             grid: [4, 5], sitePath: 'cz' },
  { code: 'DK', name: 'Denmark',     flag: '🇩🇰', currency: 'DKK', languages: ['da'],             grid: [4, 3], sitePath: 'dk' },
  { code: 'EE', name: 'Estonia',     flag: '🇪🇪', currency: 'EUR', languages: ['et'],             grid: [6, 2], sitePath: 'ee' },
  { code: 'FI', name: 'Finland',     flag: '🇫🇮', currency: 'EUR', languages: ['fi', 'sv'],       grid: [6, 1], sitePath: 'fi' },
  { code: 'FR', name: 'France',      flag: '🇫🇷', currency: 'EUR', languages: ['fr'],             grid: [2, 6], sitePath: 'fr' },
  { code: 'DE', name: 'Germany',     flag: '🇩🇪', currency: 'EUR', languages: ['de'],             grid: [4, 4], sitePath: 'de' },
  { code: 'GR', name: 'Greece',      flag: '🇬🇷', currency: 'EUR', languages: ['el'],             grid: [5, 8], sitePath: 'gr' },
  { code: 'HU', name: 'Hungary',     flag: '🇭🇺', currency: 'HUF', languages: ['hu'],             grid: [5, 6], sitePath: 'hu' },
  { code: 'IE', name: 'Ireland',     flag: '🇮🇪', currency: 'EUR', languages: ['en', 'ga'],       grid: [1, 3], sitePath: 'ie' },
  { code: 'IT', name: 'Italy',       flag: '🇮🇹', currency: 'EUR', languages: ['it'],             grid: [3, 7], sitePath: 'it' },
  { code: 'LV', name: 'Latvia',      flag: '🇱🇻', currency: 'EUR', languages: ['lv'],             grid: [6, 3], sitePath: 'lv' },
  { code: 'LT', name: 'Lithuania',   flag: '🇱🇹', currency: 'EUR', languages: ['lt'],             grid: [6, 4], sitePath: 'lt' },
  { code: 'LU', name: 'Luxembourg',  flag: '🇱🇺', currency: 'EUR', languages: ['fr', 'de'],       grid: [3, 5], sitePath: 'lu' },
  { code: 'MT', name: 'Malta',       flag: '🇲🇹', currency: 'EUR', languages: ['mt', 'en'],       grid: [3, 8], sitePath: 'mt' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', currency: 'EUR', languages: ['nl'],             grid: [3, 4], sitePath: 'nl' },
  { code: 'PL', name: 'Poland',      flag: '🇵🇱', currency: 'PLN', languages: ['pl'],             grid: [5, 4], sitePath: 'pl' },
  { code: 'PT', name: 'Portugal',    flag: '🇵🇹', currency: 'EUR', languages: ['pt'],             grid: [1, 7], sitePath: 'pt' },
  { code: 'RO', name: 'Romania',     flag: '🇷🇴', currency: 'RON', languages: ['ro'],             grid: [6, 6], sitePath: 'ro' },
  { code: 'SK', name: 'Slovakia',    flag: '🇸🇰', currency: 'EUR', languages: ['sk'],             grid: [5, 5], sitePath: 'sk' },
  { code: 'SI', name: 'Slovenia',    flag: '🇸🇮', currency: 'EUR', languages: ['sl'],             grid: [4, 7], sitePath: 'si' },
  { code: 'ES', name: 'Spain',       flag: '🇪🇸', currency: 'EUR', languages: ['es'],             grid: [2, 7], sitePath: 'es' },
  { code: 'SE', name: 'Sweden',      flag: '🇸🇪', currency: 'SEK', languages: ['sv'],             grid: [5, 1], sitePath: 'se' },
];

export const US = { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', languages: ['en'] };

export const EU_CODES = COUNTRIES.map((c) => c.code);

export const COUNTRY_BY_CODE = Object.fromEntries(COUNTRIES.map((c) => [c.code, c]));

export const MAP_COLUMNS = 7;
export const MAP_ROWS = 8;
