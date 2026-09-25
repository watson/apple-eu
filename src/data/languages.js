// The 24 official languages of the European Union.
// `appleIntelligence`, `siri`, `phoneLiveTranslation` and `notesTranscription`
// are filled from Apple's iOS 27 feature availability page (source A4) and the
// support articles referenced in features.js. They are updated by the research
// step; see research/raw/ios-feature-availability.json.

export const EU_LANGUAGES = [
  { code: 'bg', name: 'Bulgarian' },
  { code: 'hr', name: 'Croatian' },
  { code: 'cs', name: 'Czech' },
  { code: 'da', name: 'Danish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'en', name: 'English' },
  { code: 'et', name: 'Estonian' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'el', name: 'Greek' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'ga', name: 'Irish' },
  { code: 'it', name: 'Italian' },
  { code: 'lv', name: 'Latvian' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'mt', name: 'Maltese' },
  { code: 'pl', name: 'Polish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ro', name: 'Romanian' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'es', name: 'Spanish' },
  { code: 'sv', name: 'Swedish' },
];

export const LANGUAGE_BY_CODE = Object.fromEntries(EU_LANGUAGES.map((l) => [l.code, l]));
