> **Note.** This report was produced by an independent review in a separate working copy of the repository and is kept here as a dated record. Its statement that corrections "have been applied" refers to that working copy. The corrections adopted on the published site, and the two proposals not adopted, are listed in `RESEARCH-2026-09-25.md` under "Corrections after the 25 September 2026 fact-check".

# Repository fact-check: 25 September 2026

The review found incorrect availability labels, unsupported generalisations and price-calculation assumptions. The advertised Apple One, Fitness+ and iPhone amounts and the stored ECB observations matched the sources. Corrections have been applied to the website, generators, raw data and research report.

This is a review of published documentation as accessed on 25 September 2026, not a device test, purchase quote or guarantee that a service activates for a particular account. Apple's documents sometimes disagree; those cases remain explicit below.

## Scope and evidence

Reviewed all 66 scorecard entries and their short/detail text; static page copy; language checker, map and price displays; all 10 timeline entries; README and research claims; five raw JSON datasets; generated datasets; source links; tax tables; and conversion calculations. Design choices and subjective judgments such as which region comes out ahead are not independently measurable facts. Counts describe this comparison's entries, not all Apple features.

The initial source sweep retrieved 190 distinct URLs from the repository's source register and raw extracts. Additional targeted official pages resolved errors and ambiguities. A successful HTTP response was not treated as proof of a claim: article text, lists, dates, currencies, plan contents and redirects were inspected. Expected absent local storefront pages are retained as missing evidence, not proof that a service is unavailable.

| Check | Result |
|---|---|
| Apple One, Fitness+ and iPhone amounts | 94 published amounts matched: 42 Apple One monthly prices, 26 Fitness+ monthly/annual prices and 26 iPhone Pro/Pro Max starting-price observations. The UI uses 17 Pro prices. |
| iCloud+ | 50 amounts in 10 source rows matched. Five Bulgarian BGN amounts are not verified current billing prices. |
| ECB data | All 1,530 currency/date/value observations exactly matched a fresh ECB response; 255 per currency. |
| VAT | All 27 stored standard national rates matched the EU rate table. |
| US sales tax | All 51 state/DC rows matched the Tax Foundation table, including separately rounded state, local and combined columns; national average 7.53% confirmed. |
| Availability extracts | All 211 represented iOS, watchOS and AirPods list/prose sections matched fresh source extracts after whitespace and footnote normalisation. |
| Watch/AirPods geographic derivations | All 1,161 country flags in 43 geographic sections checked against the lists; removed country inferences from 14 language sections. |
| iOS geographic derivations | 60 country lists checked; airport coverage checked by the named airport locations. A city/airport entry does not establish nationwide coverage. |
| Apple retail | Eight EU markets and their counts verified: AT 1, BE 1, FR 20, DE 16, IT 17, NL 3, ES 12, SE 3. US directory covers 44 states plus DC. |
| Dates and links | Checked source dates and timeline claims; replaced two guide-home redirects and one broken historical Vision Pro URL. Future October changes remain labelled upcoming. |

## Material corrections

1. **Subscription taxes:** removed general US sales-tax estimates and standard-VAT removal from Apple One. State/local general rates do not establish digital-subscription taxability, and a bundle cannot safely be assigned the hardware VAT rate. The subscription display preserves advertised prices, with US prices before applicable tax and EU prices tax-inclusive. The hardware controls apply only to hardware.
2. **Unknown Apple One tiers:** absence of a local plan page is no longer resolved to “unavailable.” Seven EU pages advertise Premier/Premium, nine advertise only Individual/Family, nine additional countries list Apple One but have unverified tiers, and Croatia/Romania do not list the service.
3. **Apple TV:** the dedicated media register lists all 27 EU countries. It takes precedence over the general iOS table, which omits Croatia and Romania. The disagreement remains documented.
4. **Satellite device scope:** iPhone Find My follows the iPhone SOS list, including Luxembourg. The previous nine-country result came from Watch documentation.
5. **Other geographic claims:** Tap to Pay and Self Service Repair cover all 27 EU countries on the cited lists. Apple retail does not cover every US state. Alternative distribution, browser engines and app deletion are not globally exclusive to the EU.
6. **Language versus geography:** removed inferred country eligibility from the raw Watch language sections. The picker and scorecard now use the same selected language; translation displays retain regional variants. Italian Notes-summary support is marked uncertain because Apple pages disagree.
7. **Hardware:** narrowed the cited EU SIM/radio/battery comparison to Danish specifications; removed unverified claims about battery capacity, SIM-tray causation and network deployment. Blood Oxygen excludes Watch SE. Hearing Test, Hearing Aid and Pro 2/3 Hearing Protection are treated separately.
8. **Units and precision:** Apple One 2 TB is represented as 2,000 decimal GB rather than 2,048 GB. Luxembourg's €1,430.10 starting price retains its cents. Converted amounts are approximate historical comparisons.
9. **Source hygiene:** replaced stale translation links, removed the claim that a redirecting guide still publishes an AirPods EU exclusion, linked actual VAT and ECB data, and removed the unused spot-rate source.
10. **Scope of conclusions:** MLS is limited to supported markets; Apple programme absence does not imply an absence of all competing programmes; the EU legal guarantee is distinguished from Apple's warranty and from unreviewed US state rights. The CC BY description now mentions attribution, license links and changes; facts are not described as owned by the source publishers.

## Prices

Amounts below are standard advertised prices, not checkout transactions, promotions, trade-ins or financing instalments. “Not advertised” applies only where a local plan page was inspected. “Unverified” means a service listing exists but a local tier/price page was not found.

EU consumer prices must disclose taxes; the hardware comparison uses standard national VAT rates and excludes special territorial regimes. Some local shop pages do not separately spell out VAT inclusion, so that treatment also relies on the EU consumer-pricing rule, not a claim that every page contains the same VAT footnote. [R11](https://europa.eu/youreurope/citizens/consumers/shopping/pricing-payments/index_en.htm), [R4](https://europa.eu/youreurope/business/finance-and-tax/vat/vat-rules-rates/index_en.htm)

| Market | Currency | Individual / month | Family / month | Premier or Premium / month | iPhone 18 Pro from | Sources |
|---|---|---:|---:|---:|---:|---|
| United States | USD | 21.95 | 27.95 | 39.95 | 1,199.00 | [Plans](https://www.apple.com/apple-one/), [iPhone](https://www.apple.com/shop/buy-iphone/iphone-18-pro) |
| Austria | EUR | 19.95 | 25.95 | 34.95 | 1,449.00 | [Plans](https://www.apple.com/at/apple-one/), [iPhone](https://www.apple.com/at/shop/buy-iphone/iphone-18-pro) |
| Belgium | EUR | 19.95 | 25.95 | Not advertised | 1,479.00 | [Plans](https://www.apple.com/befr/apple-one/), [iPhone](https://www.apple.com/be-fr/shop/buy-iphone/iphone-18-pro) |
| Bulgaria | EUR | Unverified | Unverified | Unverified | Unverified | [Service register](https://support.apple.com/en-us/118205) |
| Croatia | EUR | Not listed | Not listed | Not listed | Unverified | [Service register](https://support.apple.com/en-us/118205) |
| Cyprus | EUR | Unverified | Unverified | Unverified | Unverified | [Service register](https://support.apple.com/en-us/118205) |
| Czechia | CZK | 339 | 449 | Not advertised | 34,990.00 | [Plans](https://www.apple.com/cz/apple-one/), [iPhone](https://www.apple.com/cz/shop/buy-iphone/iphone-18-pro) |
| Denmark | DKK | 179 | 239 | Not advertised | 10,999.00 | [Plans](https://www.apple.com/dk/apple-one/), [iPhone](https://www.apple.com/dk/shop/buy-iphone/iphone-18-pro) |
| Estonia | EUR | Unverified | Unverified | Unverified | Unverified | [Service register](https://support.apple.com/en-us/118205) |
| Finland | EUR | 20.95 | 27.95 | Not advertised | 1,509.00 | [Plans](https://www.apple.com/fi/apple-one/), [iPhone](https://www.apple.com/fi/shop/buy-iphone/iphone-18-pro) |
| France | EUR | 19.95 | 25.95 | 34.95 | 1,479.00 | [Plans](https://www.apple.com/fr/apple-one/), [iPhone](https://www.apple.com/fr/shop/buy-iphone/iphone-18-pro) |
| Germany | EUR | 19.95 | 25.95 | 34.95 | 1,449.00 | [Plans](https://www.apple.com/de/apple-one/), [iPhone](https://www.apple.com/de/shop/buy-iphone/iphone-18-pro) |
| Greece | EUR | Unverified | Unverified | Unverified | Unverified | [Service register](https://support.apple.com/en-us/118205) |
| Hungary | HUF | 4590 | 5990 | Not advertised | 549,990.00 | [Plans](https://www.apple.com/hu/apple-one/), [iPhone](https://www.apple.com/hu/shop/buy-iphone/iphone-18-pro) |
| Ireland | EUR | 19.95 | 27.95 | 36.95 | 1,489.00 | [Plans](https://www.apple.com/ie/apple-one/), [iPhone](https://www.apple.com/ie/shop/buy-iphone/iphone-18-pro) |
| Italy | EUR | 19.95 | 25.95 | 34.95 | 1,489.00 | [Plans](https://www.apple.com/it/apple-one/), [iPhone](https://www.apple.com/it/shop/buy-iphone/iphone-18-pro) |
| Latvia | EUR | Unverified | Unverified | Unverified | Unverified | [Service register](https://support.apple.com/en-us/118205) |
| Lithuania | EUR | Unverified | Unverified | Unverified | Unverified | [Service register](https://support.apple.com/en-us/118205) |
| Luxembourg | EUR | 19.95 | 27.95 | Not advertised | 1,430.10 | [Plans](https://www.apple.com/lu/apple-one/), [iPhone](https://www.apple.com/lu/shop/buy-iphone/iphone-18-pro) |
| Malta | EUR | Unverified | Unverified | Unverified | Unverified | [Service register](https://support.apple.com/en-us/118205) |
| Netherlands | EUR | 19.95 | 25.95 | Not advertised | 1,479.00 | [Plans](https://www.apple.com/nl/apple-one/), [iPhone](https://www.apple.com/nl/shop/buy-iphone/iphone-18-pro) |
| Poland | PLN | 42.99 | 59.99 | Not advertised | 6,299.00 | [Plans](https://www.apple.com/pl/apple-one/), [iPhone](https://www.apple.com/pl/shop/buy-iphone/iphone-18-pro) |
| Portugal | EUR | 16.95 | 21.95 | 30.95 | 1,499.00 | [Plans](https://www.apple.com/pt/apple-one/), [iPhone](https://www.apple.com/pt/shop/buy-iphone/iphone-18-pro) |
| Romania | RON | Not listed | Not listed | Not listed | Unverified | [Service register](https://support.apple.com/en-us/118205) |
| Slovakia | EUR | Unverified | Unverified | Unverified | Unverified | [Service register](https://support.apple.com/en-us/118205) |
| Slovenia | EUR | Unverified | Unverified | Unverified | Unverified | [Service register](https://support.apple.com/en-us/118205) |
| Spain | EUR | 19.95 | 25.95 | 34.95 | 1,469.00 | [Plans](https://www.apple.com/es/apple-one/), [iPhone](https://www.apple.com/es/shop/buy-iphone/iphone-18-pro) |
| Sweden | SEK | 215 | 295 | Not advertised | 16,495.00 | [Plans](https://www.apple.com/se/apple-one/), [iPhone](https://www.apple.com/se/shop/buy-iphone/iphone-18-pro) |

The 16 EU iPhone prices and US price refer to the 256 GB starting configuration. Pro Max observations are retained in the raw extracts but are not a second plotted product. Eleven EU countries lack a verified direct Apple online price in this dataset; reseller prices were not substituted.

Fitness+ prices and all five iCloud tier amounts were checked in their own local page/currency rows. Other monetary claims were checked at their cited sources: News+ $12.99 monthly; Creator Studio $12.99 monthly/$129 annually in the US and Danish launch prices of 99/990 DKK (19 DKK monthly education); AppleCare One Individual from $19.99, extra devices $5.99, and Family $49.99 monthly. These amounts are not automatically comparable bundles or tax-inclusive US bills.

The Danish Apple One arithmetic is correct: 25 + 79 + 199 + 59 = 362 DKK separately; 362 − 239 = 123 DKK saved. Family plus separate 2 TB iCloud+ is 239 + 89 = 328 DKK, with 200 GB + 2 TB = 2.2 TB. The extra storage does not add News+ or Fitness+.

[B2](https://www.apple.com/dk/apple-one/), [B7](https://support.apple.com/en-us/108047), [B9](https://www.apple.com/apple-news/), [B18](https://www.apple.com/apple-creator-studio/), [B19](https://www.apple.com/dk/newsroom/2026/01/introducing-apple-creator-studio-an-inspiring-collection-of-creative-apps/), [B21](https://support.apple.com/en-us/108104), [S24](https://www.apple.com/applecare/)

## Currency conversion and hardware tax arithmetic

The fixed window is **25 September 2025 through 24 September 2026**. The stored rates are arithmetic means of daily ECB currency-per-euro reference rates, rounded to four decimals. They are not the rate on the snapshot date, a bank quote, or the average of reciprocals. No exchange markup or card fee is included.

| Currency | Units per €1 | Observations |
|---|---:|---:|
| CZK | 24.2793 | 255 |
| DKK | 7.4718 | 255 |
| HUF | 373.7045 | 255 |
| PLN | 4.2606 | 255 |
| SEK | 10.9067 | 255 |
| USD | 1.1622 | 255 |

Source: [X2](https://data-api.ecb.europa.eu/service/data/EXR/D.USD+DKK+SEK+PLN+CZK+HUF.EUR.SP00.A?startPeriod=2025-09-25&endPeriod=2026-09-24&format=csvdata). The 24 September USD observation is 1.1367; the historical mean used by default is 1.1622. This difference is intentional.

The calculations checked are:

- Euro equivalent = local amount ÷ currency units per euro.
- Hardware price before VAT = VAT-inclusive amount ÷ (1 + VAT rate / 100).
- Estimated US hardware price = $1,199 × (1 + selected state-plus-average-local rate / 100).
- Tax-free break-even USD/EUR = $1,199 ÷ the EU price before VAT expressed in euros.

The custom USD rate affects US euro conversions only. It also affects subscription conversions when enabled; it does not add or remove subscription taxes. Hardware bars share a euro axis even when their labels display local currency. Rounded labels do not change the underlying conversion.

All 27 standard VAT inputs match the official table, including Estonia 24%, Finland 25.5%, Romania 21% and Slovakia 23%. US combined rates range from 0% to 10.13%. Five states have no statewide sales tax, but Alaska has average local tax of 1.82%; only four rows have zero combined general tax. Exact checkout tax depends on address and applicable rules. Do not recompute rounded combined table values by adding rounded component values.

[R4](https://europa.eu/youreurope/business/finance-and-tax/vat/vat-rules-rates/index_en.htm), [X3](https://taxfoundation.org/data/all/state/2026-sales-tax-rates-midyear/)

## Feature-by-feature disposition

“Confirmed” means the cited published statement supports the repository's scoped claim on the access date. It does not mean tested activation or independently verified product performance. Corrections also apply wherever the same claim appeared in static copy or the research report.

| Feature ID | Result after review | Evidence |
|---|---|---|
| `apple-intelligence` | Confirmed dates; daily limits and future paid access distinguished from a current paid plan. | [A1](https://support.apple.com/en-us/121115), [A14](https://www.apple.com/newsroom/2025/03/apple-intelligence-features-expand-to-new-languages-and-regions-today/), [H1](https://www.apple.com/newsroom/2024/10/apple-intelligence-is-available-today-on-iphone-ipad-and-mac/) |
| `ai-language` | Confirmed matching device/Siri languages; 9 of 24 official EU languages, with feature exceptions. | [A1](https://support.apple.com/en-us/121115), [A4](https://www.apple.com/ios/feature-availability/), [A12](https://support.apple.com/guide/iphone/change-the-language-and-region-iphce20717a3/27/ios/27), [A13](https://support.apple.com/guide/iphone/change-siri-settings-iphc28624b81abc/27/ios/27) |
| `siri-ai-iphone` | Confirmed English beta, waitlist and EU mobile exclusion; October languages remain announced. | [A2](https://support.apple.com/en-us/127893), [A3](https://www.apple.com/newsroom/2026/09/siri-ai-a-profoundly-more-capable-and-personal-assistant-is-here/), [P12](https://www.apple.com/newsroom/2026/06/due-to-dma-siri-ai-delayed-in-eu-for-ios-27-and-ipados-27/), [P13](https://digital-markets-act.ec.europa.eu/citizens-and-whistleblower-portal/eu-citizens-qa_en) |
| `siri-ai-mac` | Confirmed English eligibility on Mac/Vision Pro in the EU; waitlist still applies. | [A2](https://support.apple.com/en-us/127893) |
| `writing-tools-chatgpt` | Confirmed EU Writing Tools and supported content-language behaviour. | [A5](https://support.apple.com/en-euro/guide/iphone/iph6f08da1d2/ios), [A15](https://www.apple.com/in/newsroom/2025/03/apple-intelligence-features-are-now-available-in-india/) |
| `live-translation-messages` | Replaced redirecting guide link. Danish text support confirmed. | [A6](https://support.apple.com/en-gb/guide/iphone/iphyrz4rgtgk/ios), [A4](https://www.apple.com/ios/feature-availability/) |
| `live-translation-calls` | Replaced redirecting guide link; retained locale qualifiers, including Brazilian Portuguese. | [A7](https://support.apple.com/en-gb/guide/iphone/ly3pl0v38sek/ios), [A17](https://support.apple.com/en-gb/guide/iphone/iphb41156356/ios), [A4](https://www.apple.com/ios/feature-availability/) |
| `live-translation-airpods` | EU expansion supported. Removed a purported current guide conflict whose URL now redirects. | [A8](https://support.apple.com/en-us/123185), [A9](https://www.apple.com/ie/newsroom/2025/11/live-translation-on-airpods-expands-to-the-eu/), [A16](https://www.apple.com/ie/airpods-pro/) |
| `notes-transcription` | Confirmed iPhone 12+ and the listed languages. Italian AI-summary documents conflict separately. | [A11](https://support.apple.com/en-euro/guide/iphone/iphbe11247b5/ios) |
| `workout-buddy` | Confirmed English/Spanish and paired-device requirements. | [A10](https://support.apple.com/en-au/guide/watch/apd65c7938e6/watchos) |
| `call-recording` | Confirmed explicit EU product exclusion; no inference about national recording law. | [P02](https://support.apple.com/en-mt/guide/iphone/iph57c6590e9/27/ios/27) |
| `iphone-mirroring` | Confirmed EU exclusion. Apple and Commission explanations remain attributed. | [P01](https://support.apple.com/en-us/120421), [P13](https://digital-markets-act.ec.europa.eu/citizens-and-whistleblower-portal/eu-citizens-qa_en) |
| `apple-one-basic` | Corrected to 25 EU countries listed; verified four services in the sampled plans. | [B1](https://www.apple.com/apple-one/), [B2](https://www.apple.com/dk/apple-one/), [B3](https://www.apple.com/de/apple-one/), [B4](https://www.apple.com/fr/apple-one/), [B5](https://www.apple.com/nl/apple-one/), [B6](https://www.apple.com/se/apple-one/), [B16](https://support.apple.com/en-us/118205) |
| `apple-one-premier` | Seven confirmed, nine lower-tier-only pages, nine unverified tiers, two countries not listed. | [B1](https://www.apple.com/apple-one/), [B3](https://www.apple.com/de/apple-one/), [B4](https://www.apple.com/fr/apple-one/), [B5](https://www.apple.com/nl/apple-one/), [B6](https://www.apple.com/se/apple-one/), [B21](https://support.apple.com/en-us/108104), [R5](https://www.apple.com/ie/apple-one/), [B16](https://support.apple.com/en-us/118205) |
| `news-plus` | Confirmed four markets, $12.99 monthly, 500+ publishers and family sharing. | [B8](https://support.apple.com/en-us/102209), [B9](https://www.apple.com/apple-news/) |
| `fitness-plus` | Confirmed 12 EU markets, prices and language limits; seven subtitle languages include English. | [B10](https://www.apple.com/apple-fitness-plus/), [B11](https://www.apple.com/newsroom/2025/12/apple-fitness-plus-expands-to-28-new-markets/) |
| `apple-tv-f1` | Confirmed US-only 2026 rights and F1 TV Premium inclusion. | [B12](https://www.apple.com/newsroom/2026/03/formula-1-begins-this-weekend-exclusively-on-apple-tv-in-the-us/) |
| `apple-tv-mls` | Qualified to supported markets, including Denmark; not universal availability. | [B13](https://www.apple.com/dk/newsroom/2025/11/major-league-soccer-is-coming-to-apple-tv-starting-in-2026/), [B14](https://tv.apple.com/dk/channel/mls/tvs.sbd.7000?l=da) |
| `apple-tv-baseball` | Qualified international Friday Night Baseball versus US daily programming; no complete EU rights matrix inferred. | [B15](https://www.apple.com/newsroom/2026/03/friday-night-baseball-returns-to-apple-tv-on-march-27-for-its-fifth-season/) |
| `media-core` | Corrected Apple TV to all 27 using the dedicated media register; documented conflicting iOS omissions. | [B16](https://support.apple.com/en-us/118205), [A4](https://www.apple.com/ios/feature-availability/) |
| `audiobooks` | Confirmed 14 purchase markets; Croatia public-domain-only and 12 book-only markets. | [B16](https://support.apple.com/en-us/118205) |
| `communication-safety` | Confirmed seven EU countries on the published country lists. No inference from a translated support page. | [A4](https://www.apple.com/ios/feature-availability/), [S13](https://www.apple.com/watchos/feature-availability/) |
| `buy-tv-shows` | Confirmed country-specific purchases; France and Germany are the listed EU TV-show markets. | [B16](https://support.apple.com/en-us/118205) |
| `creator-studio` | Confirmed current US prices and bundle. Danish figures explicitly remain January launch prices. | [B18](https://www.apple.com/apple-creator-studio/), [B19](https://www.apple.com/dk/newsroom/2026/01/introducing-apple-creator-studio-an-inspiring-collection-of-creative-apps/), [B20](https://support.apple.com/en-us/125029), [B16](https://support.apple.com/en-us/118205) |
| `icloud-plus` | Confirmed tier sizes and published amounts; Bulgarian currency issue flagged in raw/generated data. | [B7](https://support.apple.com/en-us/108047), [B21](https://support.apple.com/en-us/108104) |
| `eu-portability` | Confirmed temporary-stay rule in Danish media terms; no new home-country entitlement inferred. | [B17](https://www.apple.com/legal/internet-services/itunes/dk/terms.html) |
| `alt-app-stores` | Removed EU-only global framing; Brazil/Japan also have marketplaces. EU eligibility and travel limits confirmed. | [P03](https://support.apple.com/en-us/118110), [P10](https://developer.apple.com/support/apps-in-the-eu/), [H2](https://www.apple.com/newsroom/2024/01/apple-announces-changes-to-ios-safari-and-the-app-store-in-the-european-union/) |
| `browser-engines` | Distinguished entitlement from shipped browsers; added Japan iOS 26.2+ exception to EU-only framing. | [P06](https://developer.apple.com/support/alternative-browser-engines/), [P17](https://developer.apple.com/support/alternative-browser-engines-jp/) |
| `default-apps` | Confirmed additional EU app-installation, navigation, SMS/RCS and call-handler choices. | [P04](https://support.apple.com/en-us/121430) |
| `delete-builtin-apps` | Confirmed EU list; source title now acknowledges Japan too. | [P05](https://support.apple.com/en-us/121327) |
| `nfc-payments` | Confirmed both regions, with distinct HCE and NFC/Secure Element mechanisms. | [P07](https://developer.apple.com/support/hce-transactions-in-apps/), [P08](https://developer.apple.com/support/nfc-se-platform/) |
| `proximity-pairing` | Confirmed EU iOS 26.5+ programme and accessory/provider conditions. | [P09](https://developer.apple.com/proximity-pairing/) |
| `external-payment-links` | Confirmed US storefront exception; not an exclusively EU capability. | [P11](https://developer.apple.com/app-store/review/guidelines/#business) |
| `home-screen-web-apps` | Confirmed March 2024 reversal; not a current EU loss. | [P13](https://digital-markets-act.ec.europa.eu/citizens-and-whistleblower-portal/eu-citizens-qa_en) |
| `sos-satellite` | Confirmed 10 EU countries and physical-location/purchase-origin conditions. | [S1](https://support.apple.com/en-us/101573) |
| `messages-satellite` | Confirmed US, Canada, Mexico and Japan; no EU member listed. | [S2](https://support.apple.com/en-us/120930) |
| `roadside-satellite` | Confirmed Australia, UK and US; provider charges are separate. | [S3](https://support.apple.com/en-us/105098) |
| `findmy-satellite` | Corrected iPhone list to the same 10 as SOS, including Luxembourg; Watch list was the wrong source. | [S4](https://support.apple.com/guide/iphone/send-your-location-via-satellite-iph2aac8ae20/27/ios/27), [S1](https://support.apple.com/en-us/101573) |
| `apple-pay` | Confirmed all 27 EU countries, subject to issuer/card eligibility. | [S5](https://support.apple.com/en-us/102775) |
| `apple-cash` | Confirmed US residency and territorial conditions. | [S6](https://support.apple.com/en-us/108370) |
| `apple-card` | Confirmed US application/address requirements; financing is a separate eligible-purchase condition. | [S7](https://support.apple.com/en-us/104952) |
| `apple-card-savings` | Confirmed Apple Card ownership, residence and tax-identifier prerequisites. | [S8](https://support.apple.com/en-us/102676) |
| `wallet-id` | Confirmed participating US issuers and device-region condition; region setting alone is insufficient. | [S9](https://support.apple.com/en-us/111803) |
| `digital-id-passport` | Confirmed unexpired US passport and eligible hardware/account; not a travel-document replacement. | [S10](https://support.apple.com/en-us/123719) |
| `tap-to-pay` | Corrected partial-country label: all 27 EU countries listed, participating provider required. | [S11](https://www.apple.com/mt/newsroom/2025/05/apple-brings-tap-to-pay-on-iphone-to-eight-more-european-countries/), [S12](https://developer.apple.com/tap-to-pay/regions/) |
| `transit-cards` | Confirmed selected systems in France, Finland and Sweden; city coverage does not mean nationwide coverage. | [S13](https://www.apple.com/watchos/feature-availability/), [S16](https://support.apple.com/en-us/118625) |
| `watch-heart` | Confirmed five health lists cover all 27. Generator now explicitly intersects irregular-rhythm support too. | [S13](https://www.apple.com/watchos/feature-availability/) |
| `health-records` | Confirmed separate US/UK/Canada and US-only lists; ordinary Health tracking distinguished. | [A4](https://www.apple.com/ios/feature-availability/) |
| `blood-oxygen` | Qualified to supported hardware variants; added SE exclusion. | [S15](https://support.apple.com/en-us/120358) |
| `airpods-hearing` | Separated Hearing Aid (24 EU) from Hearing Test (26 EU); exclusions confirmed. | [S14](https://www.apple.com/airpods-pro/feature-availability/) |
| `airpods-hearing-protection` | Corrected Pro 2/3 comparison: zero versus 27 EU countries, so not identical support. | [S14](https://www.apple.com/airpods-pro/feature-availability/) |
| `watch-kids` | Confirmed selected-country family setup. | [S13](https://www.apple.com/watchos/feature-availability/) |
| `watch-hikes` | Confirmed eight EU countries. | [S13](https://www.apple.com/watchos/feature-availability/) |
| `maps-features` | Scoped the scorecard row to Look Around; cycling/city experiences remain separate map entries. | [A4](https://www.apple.com/ios/feature-availability/) |
| `iphone-sim` | Scoped the cited EU specification to Denmark. Removed unsupported battery-capacity causation. | [S18](https://www.apple.com/dk/iphone-18-pro/specs/), [S19](https://www.apple.com/iphone-18-pro/specs/) |
| `iphone-battery` | Confirmed advertised 36/45 US versus 34/43 Danish hours, streaming figures and weights; not device testing. | [S18](https://www.apple.com/dk/iphone-18-pro/specs/), [S19](https://www.apple.com/iphone-18-pro/specs/) |
| `iphone-mmwave` | Confirmed US/Danish specification difference; removed uncited network-deployment generalisation. | [S18](https://www.apple.com/dk/iphone-18-pro/specs/), [S19](https://www.apple.com/iphone-18-pro/specs/) |
| `iphone-price` | Confirmed advertised amounts. Preserved Luxembourg cents; tax estimates and FX basis made explicit. | [S18](https://www.apple.com/dk/iphone-18-pro/specs/), [S19](https://www.apple.com/iphone-18-pro/specs/), [R6](https://www.apple.com/shop/buy-iphone/iphone-18-pro), [R4](https://europa.eu/youreurope/business/finance-and-tax/vat/vat-rules-rates/index_en.htm), [R11](https://europa.eu/youreurope/citizens/consumers/shopping/pricing-payments/index_en.htm), [X3](https://taxfoundation.org/data/all/state/2026-sales-tax-rates-midyear/) |
| `vision-pro` | Confirmed France/Germany within the EU; replaced stale inferred market list and broken historical link. | [S20](https://www.apple.com/nz/newsroom/2026/08/exciting-updates-for-sneaky-sasquatch-come-to-apple-arcade/), [S21](https://www.apple.com/shop/buy-vision/apple-vision-pro) |
| `applecare-one` | Confirmed Individual markets, US-only Family and $19.99/$5.99/$49.99 advertised monthly amounts. | [S22](https://support.apple.com/en-us/122224), [S23](https://support.apple.com/en-us/148275), [S24](https://www.apple.com/applecare/), [S25](https://www.apple.com/dk/applecare/) |
| `apple-upgrade` | Confirmed US programme and lease terms. No claim that Europe lacks other leasing programmes. | [S26](https://www.apple.com/newsroom/2026/07/apple-upgrade-launches-in-the-united-states/) |
| `clean-energy-charging` | Confirmed US charging restriction; EnergyKit specifically contiguous US. | [S29](https://support.apple.com/guide/iphone/charge-with-cleaner-energy-sources-iphc49d61e92/27/ios/27), [S30](https://developer.apple.com/energykit/) |
| `self-service-repair` | Corrected to all 27 EU countries; supported products/parts remain conditional. | [R1](https://support.apple.com/self-service-repair), [R10](https://www.apple.com/newsroom/2023/12/apple-expands-self-service-repair-and-introduces-new-diagnostics-process/) |
| `apple-stores` | Corrected US coverage to 44 states plus DC; verified eight EU countries and each store count. | [R2](https://www.apple.com/retail/storelist/) |
| `legal-guarantee` | Scoped minimum two years to new consumer goods; second-hand exception and US state-law limitation stated. | [P14](https://europa.eu/youreurope/citizens/consumers/shopping/guarantees/indexamp_en.htm), [P15](https://www.apple.com/legal/warranty/products/denmark-universal-warranty.html), [P16](https://www.apple.com/legal/warranty/products/ios-warranty-document-us.html) |
| `alt-purchases-parental` | Confirmed excluded Apple purchase controls versus retained Screen Time controls. | [P03](https://support.apple.com/en-us/118110) |

## Timeline and supporting datasets

All ten timeline entries were checked against their linked announcements/support pages. The November 2025 AirPods entry is an announcement of a December expansion, not a claim that it shipped on the announcement date. The December Fitness+ event uses the rollout date, while the source was published earlier. The October 2026 app-terms entry remains future-dated. The Apple Upgrade entry now states that this Apple programme is absent from the EU, rather than claiming there is no EU leasing equivalent.

The 27-country and 24-official-language reference sets match EU institutional pages. Country language arrays are UI defaults drawn from those 24 languages, not exhaustive national/minority-language lists and not a claim about residents' device settings. Bulgaria's national currency is EUR in this snapshot. The schematic country tiles are not geographic coordinates. The map describes member-state listings and selected cities; it is not a territorial coverage map. In particular, a separate Réunion entry is not evidence of nationwide French Visited Places coverage.

[R7](https://european-union.europa.eu/principles-countries-history/eu-countries_en), [R8](https://european-union.europa.eu/principles-countries-history/languages_en), [R9](https://www.consilium.europa.eu/en/policies/join-the-euro-area/timeline-joining-the-euro-area/), [A4](https://www.apple.com/ios/feature-availability/)

The 42 generated availability lists were reviewed for source choice, platform scope and country derivation. The source-specific Watch satellite lists remain in the raw extraction and were not rewritten to imitate iPhone support. The 16 language checks use published language support, with locale detail and an uncertainty override for Italian Notes summaries. The raw data preserves source limitations instead of filling missing prices with guesses.

README run commands and the no-dependency static-site description match `package.json` and the code. The project licenses remain MIT for implementation and CC BY 4.0 for original text/data selection; this is not a review of ownership of every third-party mark or extract. The attribution summary was checked against the [CC BY 4.0 deed](https://creativecommons.org/licenses/by/4.0/).

## Unresolved or deliberately limited

- **Apple TV in Croatia/Romania:** dedicated media register says listed, general iOS table omits them. The site follows the dedicated register.
- **Italian Notes transcription summaries:** the Apple Intelligence support article includes Italian; the feature table omits it. The UI reports uncertainty.
- **Bulgarian iCloud pricing:** Apple still publishes BGN amounts despite euro adoption. Those source amounts are preserved and flagged `currentPriceVerified: false`; no current EUR billing price was inferred.
- **Nine Apple One tier sets and eleven direct iPhone prices:** not verified. A missing local page is insufficient evidence of service unavailability.
- **Future events:** announced October Siri AI languages and EU app terms require a later check; announcements are not present availability.
- **Eligibility and coverage:** hardware, OS, account country, physical location, language variant, issuer/provider and local regulatory conditions may still control access. City coverage and developer entitlements do not imply nationwide or shipped third-party support.
- **Tax and purchasing:** no checkout, subscription billing or address-specific tax test; no claim about reduced bundle VAT rates or special territorial regimes. No real-device performance tests.

## Validation

`npm test` checks dataset integrity plus the corrected tier-resolution, device-list, language-locale, storage-unit, Bulgarian-price, FX and subscription-tax regressions. FX tests independently recalculate the means from all 1,530 CSV observations. Both data generators were rerun and checked for reproducibility; JavaScript syntax and whitespace checks passed.

No controllable browser was available in this session, so visual/browser interaction testing was not completed. That limitation does not affect the external source comparisons or calculation checks above.
