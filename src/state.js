// Page state: chosen country, chosen languages, filters. Persisted in the URL
// (?country=DK) and localStorage so a shared link opens the same view.
import { COUNTRY_BY_CODE } from './data/countries.js';

const listeners = new Set();

const state = {
  country: null,      // EU country code or null
  langs: [],          // language codes used by the language checker
  langsManual: false, // true once the user picked a language explicitly
  mapFeature: 'fitnessPlus',
  filter: 'all',      // all | us | eu | same | depends
  category: 'all',
  query: '',
  fx: 1.14,           // USD per EUR (the EUR/USD quote), default from 25 Sep 2026
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

export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export function currentCountry() { return state.country ? COUNTRY_BY_CODE[state.country] : null; }
