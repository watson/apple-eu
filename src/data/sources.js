// Source register. IDs match the research document (research/RESEARCH-2026-09-25.md).
// All sources were accessed on 2026-09-25 unless noted. `date` is the publisher's
// displayed publication/update date; null means undated.

export const ACCESSED = '2026-09-25';

export const SOURCES = {
  // --- Apple Intelligence, Siri, languages ---
  A1:  { pub: 'Apple Support', title: 'How to get the next generation of Apple Intelligence', url: 'https://support.apple.com/en-us/121115', date: '2026-09-14' },
  A2:  { pub: 'Apple Support', title: 'How to get Siri AI', url: 'https://support.apple.com/en-us/127893', date: '2026-09-22' },
  A3:  { pub: 'Apple Newsroom', title: 'Siri AI is here', url: 'https://www.apple.com/newsroom/2026/09/siri-ai-a-profoundly-more-capable-and-personal-assistant-is-here/', date: '2026-09-14' },
  A4:  { pub: 'Apple', title: 'iOS and iPadOS 27 feature availability', url: 'https://www.apple.com/ios/feature-availability/', date: null },
  A5:  { pub: 'Apple Support', title: 'Use Writing Tools on iPhone (European guide)', url: 'https://support.apple.com/en-euro/guide/iphone/iph6f08da1d2/ios', date: null },
  A6:  { pub: 'Apple Support', title: 'Translate messages and calls on Mac', url: 'https://support.apple.com/en-my/guide/mac-help/mchl58dfbdba/mac', date: null },
  A7:  { pub: 'Apple Support', title: 'Translate messages, calls, and conversations on iPhone', url: 'https://support.apple.com/en-gb/guide/iphone/iph22b72984d/ios', date: null, note: 'Contains a conflicting note about AirPods Live Translation in the EU.' },
  A8:  { pub: 'Apple Support', title: 'Use Live Translation with your AirPods', url: 'https://support.apple.com/en-us/123185', date: '2026-09-14' },
  A9:  { pub: 'Apple Newsroom', title: 'Live Translation on AirPods expands to the EU', url: 'https://www.apple.com/ie/newsroom/2025/11/live-translation-on-airpods-expands-to-the-eu/', date: '2025-11-04' },
  A10: { pub: 'Apple Support', title: 'Use Workout Buddy in Workout on Apple Watch', url: 'https://support.apple.com/en-au/guide/watch/apd65c7938e6/watchos', date: null },
  A11: { pub: 'Apple Support', title: 'Record and transcribe audio in Notes on iPhone', url: 'https://support.apple.com/en-euro/guide/iphone/iphbe11247b5/ios', date: null },
  A12: { pub: 'Apple Support', title: 'Change the language and region on iPhone', url: 'https://support.apple.com/guide/iphone/change-the-language-and-region-iphce20717a3/27/ios/27', date: null },
  A13: { pub: 'Apple Support', title: 'Change Siri settings on iPhone', url: 'https://support.apple.com/guide/iphone/change-siri-settings-iphc28624b81abc/27/ios/27', date: null },
  A14: { pub: 'Apple Newsroom', title: 'Apple Intelligence features expand to new languages and regions today', url: 'https://www.apple.com/newsroom/2025/03/apple-intelligence-features-expand-to-new-languages-and-regions-today/', date: '2025-03-31' },
  A15: { pub: 'Apple Newsroom', title: 'Apple Intelligence features are now available in India', url: 'https://www.apple.com/in/newsroom/2025/03/apple-intelligence-features-are-now-available-in-india/', date: '2025-03-31' },
  A16: { pub: 'Apple', title: 'AirPods Pro 3 (Ireland)', url: 'https://www.apple.com/ie/airpods-pro/', date: null },

  // --- Subscriptions and media ---
  B1:  { pub: 'Apple', title: 'Apple One (US)', url: 'https://www.apple.com/apple-one/', date: null },
  B2:  { pub: 'Apple', title: 'Apple One (Denmark)', url: 'https://www.apple.com/dk/apple-one/', date: null },
  B3:  { pub: 'Apple', title: 'Apple One (Germany)', url: 'https://www.apple.com/de/apple-one/', date: null },
  B4:  { pub: 'Apple', title: 'Apple One (France)', url: 'https://www.apple.com/fr/apple-one/', date: null },
  B5:  { pub: 'Apple', title: 'Apple One (Netherlands)', url: 'https://www.apple.com/nl/apple-one/', date: null },
  B6:  { pub: 'Apple', title: 'Apple One (Sweden)', url: 'https://www.apple.com/se/apple-one/', date: null },
  B7:  { pub: 'Apple Support', title: 'iCloud+ plans and pricing', url: 'https://support.apple.com/en-us/108047', date: '2026-09-16' },
  B8:  { pub: 'Apple Support', title: 'Subscribe to Apple News+', url: 'https://support.apple.com/en-us/102209', date: '2025-10-23' },
  B9:  { pub: 'Apple', title: 'Apple News+ (US)', url: 'https://www.apple.com/apple-news/', date: null },
  B10: { pub: 'Apple', title: 'Apple Fitness+', url: 'https://www.apple.com/apple-fitness-plus/', date: null },
  B11: { pub: 'Apple Newsroom', title: 'Apple Fitness+ expands to 28 new markets', url: 'https://www.apple.com/newsroom/2025/12/apple-fitness-plus-expands-to-28-new-markets/', date: '2025-12-08' },
  B12: { pub: 'Apple Newsroom', title: 'Formula 1 begins this weekend exclusively on Apple TV in the US', url: 'https://www.apple.com/newsroom/2026/03/formula-1-begins-this-weekend-exclusively-on-apple-tv-in-the-us/', date: '2026-03-05' },
  B13: { pub: 'Apple Newsroom (Denmark)', title: 'Major League Soccer is coming to Apple TV starting in 2026', url: 'https://www.apple.com/dk/newsroom/2025/11/major-league-soccer-is-coming-to-apple-tv-starting-in-2026/', date: '2025-11-13' },
  B14: { pub: 'Apple TV', title: 'MLS on Apple TV (Denmark)', url: 'https://tv.apple.com/dk/channel/mls/tvs.sbd.7000?l=da', date: null },
  B15: { pub: 'Apple Newsroom', title: 'Friday Night Baseball returns to Apple TV on March 27 for its fifth season', url: 'https://www.apple.com/newsroom/2026/03/friday-night-baseball-returns-to-apple-tv-on-march-27-for-its-fifth-season/', date: '2026-03-11' },
  B16: { pub: 'Apple Support', title: 'Availability of Apple Media Services', url: 'https://support.apple.com/en-us/118205', date: '2026-09-15' },
  B17: { pub: 'Apple Legal', title: 'Apple Media Services terms (Denmark), section A', url: 'https://www.apple.com/legal/internet-services/itunes/dk/terms.html', date: '2026-09-14' },
  B18: { pub: 'Apple', title: 'Apple Creator Studio', url: 'https://www.apple.com/apple-creator-studio/', date: null },
  B19: { pub: 'Apple Newsroom (Denmark)', title: 'Introducing Apple Creator Studio', url: 'https://www.apple.com/dk/newsroom/2026/01/introducing-apple-creator-studio-an-inspiring-collection-of-creative-apps/', date: '2026-01-13' },
  B20: { pub: 'Apple Support', title: 'About Apple Creator Studio', url: 'https://support.apple.com/en-us/125029', date: '2026-06-30' },
  B21: { pub: 'Apple Support', title: 'What happens to iCloud storage with Apple One', url: 'https://support.apple.com/en-us/108104', date: '2026-01-14' },

  // --- Satellite, Wallet, Watch, hardware, AppleCare ---
  S1:  { pub: 'Apple Support', title: 'Emergency SOS via satellite', url: 'https://support.apple.com/en-us/101573', date: '2026-07-22' },
  S2:  { pub: 'Apple Support', title: 'Messages via satellite', url: 'https://support.apple.com/en-us/120930', date: '2026-05-15' },
  S3:  { pub: 'Apple Support', title: 'Roadside Assistance via satellite', url: 'https://support.apple.com/en-us/105098', date: '2025-11-04' },
  S4:  { pub: 'Apple Support', title: 'Send your location via satellite (iPhone User Guide, iOS 27)', url: 'https://support.apple.com/guide/iphone/send-your-location-via-satellite-iph2aac8ae20/27/ios/27', date: null },
  S5:  { pub: 'Apple Support', title: 'Countries and regions that support Apple Pay', url: 'https://support.apple.com/en-us/102775', date: '2026-09-09' },
  S6:  { pub: 'Apple Support', title: 'Add money to Apple Cash', url: 'https://support.apple.com/en-us/108370', date: '2026-09-14' },
  S7:  { pub: 'Apple Support', title: 'Apply for Apple Card', url: 'https://support.apple.com/en-us/104952', date: '2026-09-14' },
  S8:  { pub: 'Apple Support', title: 'Apple Card Savings eligibility', url: 'https://support.apple.com/en-us/102676', date: '2026-09-23' },
  S9:  { pub: 'Apple Support', title: "Add your driver's license or state ID to Wallet", url: 'https://support.apple.com/en-us/111803', date: '2026-05-27' },
  S10: { pub: 'Apple Support', title: 'Digital ID in Wallet', url: 'https://support.apple.com/en-us/123719', date: '2026-09-14' },
  S11: { pub: 'Apple Newsroom', title: 'Apple brings Tap to Pay on iPhone to eight more European countries', url: 'https://www.apple.com/mt/newsroom/2025/05/apple-brings-tap-to-pay-on-iphone-to-eight-more-european-countries/', date: '2025-05-27' },
  S12: { pub: 'Apple Developer', title: 'Tap to Pay on iPhone: countries and payment providers', url: 'https://developer.apple.com/tap-to-pay/regions/', date: null },
  S13: { pub: 'Apple', title: 'watchOS 27 feature availability', url: 'https://www.apple.com/watchos/feature-availability/', date: null },
  S14: { pub: 'Apple', title: 'AirPods Pro Hearing Health feature availability', url: 'https://www.apple.com/airpods-pro/feature-availability/', date: null },
  S15: { pub: 'Apple Support', title: 'Blood Oxygen app on Apple Watch', url: 'https://support.apple.com/en-us/120358', date: '2026-09-14' },
  S16: { pub: 'Apple Support', title: 'Ride transit using Apple Pay', url: 'https://support.apple.com/en-us/118625', date: '2026-07-29' },
  S18: { pub: 'Apple', title: 'iPhone 18 Pro technical specifications (Denmark)', url: 'https://www.apple.com/dk/iphone-18-pro/specs/', date: null },
  S19: { pub: 'Apple', title: 'iPhone 18 Pro technical specifications (US)', url: 'https://www.apple.com/iphone-18-pro/specs/', date: null },
  S20: { pub: 'Apple Newsroom', title: 'Apple Arcade update (Vision Pro country list, footnote 4)', url: 'https://www.apple.com/nz/newsroom/2026/08/exciting-updates-for-sneaky-sasquatch-come-to-apple-arcade/', date: '2026-08-28' },
  S21: { pub: 'Apple', title: 'Apple Vision Pro purchase FAQ', url: 'https://www.apple.com/shop/buy-vision/apple-vision-pro', date: null },
  S22: { pub: 'Apple Support', title: 'AppleCare One device and country eligibility', url: 'https://support.apple.com/en-us/122224', date: '2026-09-14' },
  S23: { pub: 'Apple Support', title: 'AppleCare One Family', url: 'https://support.apple.com/en-us/148275', date: '2026-09-14' },
  S24: { pub: 'Apple', title: 'AppleCare (US)', url: 'https://www.apple.com/applecare/', date: null },
  S25: { pub: 'Apple', title: 'AppleCare (Denmark)', url: 'https://www.apple.com/dk/applecare/', date: null },
  S26: { pub: 'Apple Newsroom', title: 'Apple Upgrade launches in the United States', url: 'https://www.apple.com/newsroom/2026/07/apple-upgrade-launches-in-the-united-states/', date: '2026-07-28' },
  S29: { pub: 'Apple Support', title: 'Charge iPhone with cleaner energy sources (iOS 27 guide)', url: 'https://support.apple.com/guide/iphone/charge-with-cleaner-energy-sources-iphc49d61e92/27/ios/27', date: null },
  S30: { pub: 'Apple Developer', title: 'EnergyKit', url: 'https://developer.apple.com/energykit/', date: null },

  // --- Platform, DMA, warranty ---
  P01: { pub: 'Apple Support', title: 'iPhone Mirroring: use your iPhone from your Mac', url: 'https://support.apple.com/en-us/120421', date: '2026-09-14' },
  P02: { pub: 'Apple Support', title: 'Record and transcribe a call (iPhone User Guide, iOS 27)', url: 'https://support.apple.com/en-mt/guide/iphone/iph57c6590e9/27/ios/27', date: null },
  P03: { pub: 'Apple Support', title: 'About alternative app distribution in the European Union', url: 'https://support.apple.com/en-us/118110', date: '2026-06-18' },
  P04: { pub: 'Apple Support', title: 'Change your default apps on iPhone', url: 'https://support.apple.com/en-us/121430', date: '2025-12-18' },
  P05: { pub: 'Apple Support', title: 'Delete certain built-in apps in the EU', url: 'https://support.apple.com/en-us/121327', date: '2026-01-26' },
  P06: { pub: 'Apple Developer', title: 'Using alternative browser engines in the European Union', url: 'https://developer.apple.com/support/alternative-browser-engines/', date: null },
  P07: { pub: 'Apple Developer', title: 'HCE-based contactless NFC transactions in the EEA', url: 'https://developer.apple.com/support/hce-transactions-in-apps/', date: null },
  P08: { pub: 'Apple Developer', title: 'NFC & SE platform for secure contactless transactions', url: 'https://developer.apple.com/support/nfc-se-platform/', date: null },
  P09: { pub: 'Apple Developer', title: 'Proximity-triggered pairing in the EU', url: 'https://developer.apple.com/proximity-pairing/', date: null },
  P10: { pub: 'Apple Developer', title: 'Changes for apps in the European Union', url: 'https://developer.apple.com/support/apps-in-the-eu/', date: null, note: 'Cites terms effective 2026-10-01.' },
  P11: { pub: 'Apple Developer', title: 'App Review Guidelines, section 3.1.1(a)', url: 'https://developer.apple.com/app-store/review/guidelines/#business', date: '2026-06-08' },
  P12: { pub: 'Apple Newsroom', title: 'Due to DMA, Siri AI delayed in the EU for iOS 27 and iPadOS 27', url: 'https://www.apple.com/newsroom/2026/06/due-to-dma-siri-ai-delayed-in-eu-for-ios-27-and-ipados-27/', date: '2026-06-08' },
  P13: { pub: 'European Commission', title: 'Digital Markets Act: questions and answers for EU citizens', url: 'https://digital-markets-act.ec.europa.eu/citizens-and-whistleblower-portal/eu-citizens-qa_en', date: null },
  P14: { pub: 'European Commission (Your Europe)', title: 'Guarantees and returns for goods bought in the EU', url: 'https://europa.eu/youreurope/citizens/consumers/shopping/guarantees/indexamp_en.htm', date: '2026-08-20' },
  P15: { pub: 'Apple Legal', title: 'Apple One-Year Limited Warranty (Denmark)', url: 'https://www.apple.com/legal/warranty/products/denmark-universal-warranty.html', date: '2023-03-01' },
  P16: { pub: 'Apple Legal', title: 'Apple One-Year Limited Warranty for iOS devices (US)', url: 'https://www.apple.com/legal/warranty/products/ios-warranty-document-us.html', date: null },

  // --- Additional sources gathered for the website (2026-09-25) ---
  H1:  { pub: 'Apple Newsroom', title: 'Apple Intelligence is available today on iPhone, iPad, and Mac', url: 'https://www.apple.com/newsroom/2024/10/apple-intelligence-is-available-today-on-iphone-ipad-and-mac/', date: '2024-10-28' },
  H2:  { pub: 'Apple Newsroom', title: 'Apple announces changes to iOS, Safari, and the App Store in the European Union', url: 'https://www.apple.com/newsroom/2024/01/apple-announces-changes-to-ios-safari-and-the-app-store-in-the-european-union/', date: '2024-01-25' },
  R1:  { pub: 'Apple Support', title: 'Self Service Repair', url: 'https://support.apple.com/self-service-repair', date: null },
  R2:  { pub: 'Apple', title: 'Apple Store list (per-country retail pages)', url: 'https://www.apple.com/retail/storelist/', date: null },
  R3:  { pub: 'Apple Newsroom', title: 'Apple Vision Pro with M5 (country list footnote)', url: 'https://www.apple.com/newsroom/2025/10/apple-unveils-new-apple-vision-pro-with-m5-chip/', date: '2025-10-15' },
  R4:  { pub: 'European Commission', title: 'VAT rates applied in the member states of the European Union', url: 'https://taxation-customs.ec.europa.eu/taxation/vat/vat-rates_en', date: null },
  X1:  { pub: 'Trading Economics', title: 'Euro US Dollar exchange rate (EUR/USD), 25 September 2026', url: 'https://tradingeconomics.com/euro-area/currency', date: '2026-09-25' },
};

export function sourceList(ids = []) {
  return ids.map((id) => ({ id, ...SOURCES[id] })).filter((s) => s.url);
}
