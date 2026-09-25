// Page state: chosen country, chosen languages, filters. Persisted in the URL
// (?country=DK) and localStorage so a shared link opens the same view.
import { COUNTRY_BY_CODE } from './data/countries.js';
import { FX } from './data/fx.js';
import { track } from './analytics.js';

const listeners = new Set();

const state = {
  country: null,      // EU country code or null
  langs: [],          // language codes used by the language checker
  langsManual: false, // true once the user picked a language explicitly
  mapFeature: 'fitnessPlus',
  filter: 'all',      // all | us | eu | same | depends
  category: 'all',
  query: '',
  convert: false,     // show approximate euro conversions next to non-euro prices
  usState: 'AVG',     // 'AVG' | 'NONE' | US state code: sales tax added to US hardware prices
  fx: FX.rates.USD,   // USD per EUR used for conversions; defaults to the ECB 12-month average
  exVat: false,
};

function readInitial() {
  const params = new URLSearchParams(location.search);
  const fromUrl = (params.get('country') || '').toUpperCase();
  let code = null;
  if (COUNTRY_BY_CODE[fromUrl]) code = fromUrl;
  else {
    try { const saved = localStorage.getItem('country'); if (COUNTRY_BY_CODE[saved]) code = saved; } catch { /* ignore */ }
  }
  if (code) { state.country = code; state.langs = [...COUNTRY_BY_CODE[code].languages]; }
}
readInitial();

export function getState() { return state; }

export function setState(patch) {
  const prev = { ...state };
  Object.assign(state, patch);
  recordEvents(patch, prev);
  if ('country' in patch) {
    const c = COUNTRY_BY_CODE[state.country];
    if (!state.langsManual) state.langs = c ? [...c.languages] : [];
    try { state.country ? localStorage.setItem('country', state.country) : localStorage.removeItem('country'); } catch { /* ignore */ }
    const url = new URL(location.href);
    if (state.country) url.searchParams.set('country', state.country); else url.searchParams.delete('country');
    history.replaceState(null, '', url);
  }
  for (const fn of listeners) fn(state, prev);
}

// User-initiated changes only: the initial country from the URL or storage does not go through here.
function recordEvents(patch, prev) {
  if ('country' in patch && patch.country !== prev.country) track('Country', { country: patch.country || 'none' });
  if ('langs' in patch && patch.langsManual && patch.langs?.[0] && patch.langs[0] !== prev.langs?.[0]) track('Language', { language: patch.langs[0] });
  if ('mapFeature' in patch && patch.mapFeature !== prev.mapFeature) track('Map feature', { feature: patch.mapFeature });
  if ('convert' in patch && patch.convert !== prev.convert) track('Prices', { control: 'euro', value: patch.convert ? 'on' : 'off' });
  if ('exVat' in patch && patch.exVat !== prev.exVat) track('Prices', { control: 'taxes', value: patch.exVat ? 'removed' : 'included' });
  if ('usState' in patch && patch.usState !== prev.usState) track('Prices', { control: 'us-state', value: patch.usState });
  if ('filter' in patch && patch.filter !== prev.filter) track('Filter', { filter: patch.filter });
}

export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export function currentCountry() { return state.country ? COUNTRY_BY_CODE[state.country] : null; }
