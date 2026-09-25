// Builds src/data/availability.js, src/data/pricing.js and
// src/data/language-support.js from the raw research JSON in research/raw/.
// Run: node scripts/build-data.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const raw = (name) => JSON.parse(readFileSync(resolve(root, 'research/raw', name), 'utf8'));

const EU = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE'];
const ios = raw('ios-feature-availability.json');
const watch = raw('watch-airpods-availability.json');
const svc = raw('services-availability.json');
const p1 = raw('apple-one-prices-part1.json');
const p2 = raw('apple-one-prices-part2.json');

const trueList = (map) => EU.filter((c) => map && map[c] === true);
const watchFeat = (id) => trueList(watch.features.find((f) => f.id === id)?.eu);
const mapsFeat = (headline) => ios.maps.features.find((f) => f.pageHeadline === headline)?.euCountriesIncluded || [];
const countryScoped = (headline) => ios.otherRegional.countryScoped.find((f) => f.pageHeadline === headline)?.euCountriesIncluded || [];
const media = (key) => EU.filter((c) => svc.mediaServices.countries[c]?.[key] === true);

const pricingCountries = { ...p1.countries, ...p2.countries };
const premierCountries = EU.filter((c) => (pricingCountries[c]?.appleOne?.plans || []).some((p) => p.tier === 'premier'));
const appleOnePagePublished = EU.filter((c) => (pricingCountries[c]?.appleOne?.plans || []).length > 0);

const availability = {
  // Subscriptions & media
  fitnessPlus: trueList(svc.fitnessPlus.eu),
  appleOneAny: media('appleOne'),
  appleOnePremier: premierCountries,
  appleOnePagePublished,
  newsPlus: trueList(svc.newsPlus.eu),
  buyTvShows: media('tvShowPurchases'),
  audiobooks: media('audiobooks'),
  // Apple's dedicated media-services register lists Apple TV in all 27; the general iOS table omits HR and RO.
  appleTvSubscription: media('tvSubscription'),
  // Satellite
  emergencySOS: trueList(svc.emergencySOS.eu),
  // The iPhone guide (S4) points to the Emergency SOS country list; the Watch page has its own, shorter list.
  findMySatellite: trueList(svc.emergencySOS.eu),
  messagesSatellite: trueList(svc.messagesViaSatellite.eu),
  roadsideSatellite: trueList(svc.roadsideViaSatellite.eu),
  // Wallet
  applePay: trueList(svc.applePay.eu),
  tapToPay: trueList(svc.tapToPay.eu),
  transitWallet: watchFeat('wallet_transit'),
  // Health, Watch, AirPods
  watchHealth: watchFeat('hypertension').filter((c) => watchFeat('ecg').includes(c) && watchFeat('irregular_rhythm').includes(c) && watchFeat('afib_history').includes(c) && watchFeat('sleep_apnea').includes(c)),
  bloodOxygen: watchFeat('blood_oxygen'),
  watchForKids: watchFeat('family_setup'),
  watchHikes: watchFeat('hikes_topo'),
  trackDetection: watchFeat('track_detection'),
  hearingTest: watchFeat('hearing_test'),
  hearingAid: watchFeat('hearing_aid'),
  hearingProtectionPro2: watchFeat('hearing_protection_pro2'),
  hearingProtectionPro3: watchFeat('hearing_protection_pro3'),
  communicationSafety: watchFeat('communication_safety'),
  weatherAQI: watchFeat('weather_aqi'),
  weatherNextHour: watchFeat('weather_next_hour'),
  healthRecords: countryScoped('Health: Download Health Records to iPhone'),
  // Maps
  mapsLookAround: mapsFeat('Maps: Look Around'),
  mapsCycling: mapsFeat('Maps: Cycling'),
  mapsTransit: mapsFeat('Maps: Transit'),
  mapsDetailedCity: mapsFeat('Maps: Detailed City Experience'),
  mapsIndoorAirports: mapsFeat('Maps: Indoor Maps Airports'),
  mapsSpeedLimits: mapsFeat('Maps: Speed Limits'),
  mapsLaneGuidance: mapsFeat('Maps: Lane Guidance'),
  mapsCustomRoute: mapsFeat('Maps: Custom Route Creation'),
  mapsFlyover: mapsFeat('Maps: Flyover'),
  mapsVisitedPlaces: mapsFeat('Maps: Visited Places'),
  // Hardware, buying & support
  visionPro: trueList(svc.visionPro.eu),
  appleCareOne: trueList(svc.appleCareOne.eu),
  selfServiceRepair: trueList(svc.selfServiceRepair.eu),
  retailStores: EU.filter((c) => svc.retailStores.eu[c]?.hasStores),
};

const retailCounts = Object.fromEntries(EU.map((c) => [c, svc.retailStores.eu[c]?.count || 0]));
const transitCities = Object.fromEntries(
  Object.entries(watch.features.find((f) => f.id === 'wallet_transit')?.euCities || {}).filter(([c]) => EU.includes(c))
);
const tapToPayProviders = Object.fromEntries(EU.map((c) => [c, svc.tapToPay.providers?.[c] || []]));
const detailedCities = ios.maps.features.find((f) => f.pageHeadline === 'Maps: Detailed City Experience')?.euCities || null;

// ---- Language support ----
const euLangNames = { bg: 'Bulgarian', hr: 'Croatian', cs: 'Czech', da: 'Danish', nl: 'Dutch', en: 'English', et: 'Estonian', fi: 'Finnish', fr: 'French', de: 'German', el: 'Greek', hu: 'Hungarian', ga: 'Irish', it: 'Italian', lv: 'Latvian', lt: 'Lithuanian', mt: 'Maltese', pl: 'Polish', pt: 'Portuguese', ro: 'Romanian', sk: 'Slovak', sl: 'Slovenian', es: 'Spanish', sv: 'Swedish' };
const nameToCode = Object.fromEntries(Object.entries(euLangNames).map(([k, v]) => [v, k]));
const codesFromNames = (names) => names.map((n) => nameToCode[n]).filter(Boolean);
const langScoped = (headline) => codesFromNames(ios.otherRegional.languageScoped.find((f) => f.pageHeadline === headline)?.euLanguagesIncluded || []);
const aiFeature = (headline) => {
  const norm = (s) => String(s || '').replace(/[\u00a0\u2010-\u2015]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
  const f = (ios.appleIntelligenceFeatures.features || ios.appleIntelligenceFeatures).find((x) => norm(x.pageHeadline) === norm(headline));
  const langs = f?.languages || f?.rawList || [];
  return Object.keys(euLangNames).filter((code) => langs.some((l) => l.startsWith(euLangNames[code])));
};

const languageSupport = {
  appleIntelligence: Object.entries(ios.appleIntelligenceLanguages.euLanguages).filter(([, v]) => v.supported).map(([n]) => nameToCode[n]).filter(Boolean),
  siri: Object.entries(ios.siriLanguages.euLanguages).filter(([, v]) => v.supported === true || v === true).map(([n]) => nameToCode[n]).filter(Boolean),
  phoneLiveTranslation: aiFeature('Apple Intelligence: Live Translations in Phone and FaceTime'),
  airpodsLiveTranslation: aiFeature('Apple Intelligence: Live Translation with AirPods'),
  messagesLiveTranslation: aiFeature('Apple Intelligence: Live Translation in Messages'),
  notesTranscriptionSummaries: aiFeature('Apple Intelligence: Notes: Transcription Summaries'),
  notesTranscription: [...new Set(['en', ...langScoped('Notes: Audio Transcription')])],
  workoutBuddy: aiFeature('Apple Intelligence: Workout Buddy'),
  systemLanguage: langScoped('System Language'),
  dictation: langScoped('Dictation'),
  liveText: langScoped('Live Text'),
  translateApp: langScoped('Translate: Translate App'),
  safariTranslation: langScoped('Safari: Web Page Translation'),
  visualLookUp: langScoped('Visual Look Up'),
  liveCaptions: langScoped('Accessibility: Live Captions'),
};

// ---- Pricing ----
const VAT = { AT: 20, BE: 21, BG: 20, HR: 25, CY: 19, CZ: 21, DK: 25, EE: 24, FI: 25.5, FR: 20, DE: 19, GR: 24, HU: 27, IE: 23, IT: 22, LV: 21, LT: 21, LU: 17, MT: 18, NL: 21, PL: 23, PT: 23, RO: 21, SK: 23, SI: 22, ES: 21, SE: 25 };
const pricing = {};
for (const cc of [...EU, 'US']) {
  const c = pricingCountries[cc];
  const plans = (c?.appleOne?.plans || []).map((p) => ({ tier: p.tier, localName: p.localName, monthly: p.monthly, storageGB: p.storageGB, services: p.services, savingsMonthly: p.savingsMonthly ?? null }));
  pricing[cc] = {
    currency: c?.currency || (cc === 'US' ? 'USD' : null),
    appleOne: { url: c?.appleOne?.url || null, plans, notes: c?.appleOne?.notes || '' },
    fitnessPlus: { available: !!c?.fitnessPlus?.available, monthly: c?.fitnessPlus?.monthly ?? null, yearly: c?.fitnessPlus?.yearly ?? null, url: c?.fitnessPlus?.url || null },
    iphone18Pro: { from: c?.iphone18Pro?.from ?? null, currency: c?.iphone18Pro?.currency || c?.currency || null, vatIncluded: c?.iphone18Pro?.vatIncluded ?? null, url: c?.iphone18Pro?.url || null },
    vatRate: cc === 'US' ? null : VAT[cc],
  };
}
const icloud = svc.icloudPricing;

const header = (what) => `// GENERATED by scripts/build-data.mjs from research/raw/*.json — do not edit by hand.\n// ${what}\n// Snapshot: 2026-09-25.\n\n`;

writeFileSync(resolve(root, 'src/data/availability.js'),
  header('Per-country availability lists (EU member state codes) referenced from features.js via eu.avail.') +
  `export const AVAILABILITY = ${JSON.stringify(availability, null, 2)};\n\n` +
  `export const RETAIL_STORE_COUNTS = ${JSON.stringify(retailCounts)};\n\n` +
  `export const TRANSIT_CITIES = ${JSON.stringify(transitCities, null, 2)};\n\n` +
  `export const TAP_TO_PAY_PROVIDERS = ${JSON.stringify(tapToPayProviders, null, 2)};\n\n` +
  `export const DETAILED_CITY_CITIES = ${JSON.stringify(detailedCities, null, 2)};\n\n` +
  `export function isAvailable(key, code) {\n  const list = AVAILABILITY[key];\n  return Array.isArray(list) ? list.includes(code) : null;\n}\n`);

writeFileSync(resolve(root, 'src/data/language-support.js'),
  header('Which of the 24 official EU languages each language-gated feature supports (Apple iOS 27 feature availability page, source A4).') +
  `export const LANGUAGE_SUPPORT = ${JSON.stringify(languageSupport, null, 2)};\n`);

writeFileSync(resolve(root, 'src/data/pricing.js'),
  header('Apple One, Fitness+ and iPhone 18 Pro prices as advertised on apple.com local storefronts; iCloud+ from support.apple.com/108047. VAT rates are standard national rates (European Commission), used only to show ex-VAT prices.') +
  `export const PRICING = ${JSON.stringify(pricing, null, 2)};\n\n` +
  `export const ICLOUD_PRICING = ${JSON.stringify(icloud, null, 2)};\n`);

console.log('availability keys:', Object.keys(availability).length);
for (const [k, v] of Object.entries(availability)) console.log(`  ${k}: ${v.length}/27`);
console.log('languageSupport:'); for (const [k, v] of Object.entries(languageSupport)) console.log(`  ${k}: ${v.join(',')}`);
console.log('pricing: premier in', premierCountries.join(' '), '| pages published', appleOnePagePublished.length);
