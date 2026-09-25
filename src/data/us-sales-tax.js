// Combined state + average local sales tax rates, as of 1 July 2026.
// Source: Tax Foundation, "State and Local Sales Tax Rates, Midyear 2026"
// (Abir Mandal, published 6 July 2026). Local rates are population-weighted
// averages within each state. Snapshot taken 2026-09-25.

export const US_SALES_TAX_SOURCE = 'X3';

/** Population-weighted national average combined rate, per the same report. */
export const US_AVERAGE_RATE = 7.53;

export const US_STATES = [
  { code: 'AL', name: 'Alabama', state: 4.00, local: 5.46, combined: 9.46 },
  { code: 'AK', name: 'Alaska', state: 0.00, local: 1.82, combined: 1.82 },
  { code: 'AZ', name: 'Arizona', state: 5.60, local: 2.94, combined: 8.54 },
  { code: 'AR', name: 'Arkansas', state: 6.50, local: 2.98, combined: 9.48 },
  { code: 'CA', name: 'California', state: 7.25, local: 1.78, combined: 9.03 },
  { code: 'CO', name: 'Colorado', state: 2.90, local: 4.99, combined: 7.89 },
  { code: 'CT', name: 'Connecticut', state: 6.35, local: 0.00, combined: 6.35 },
  { code: 'DE', name: 'Delaware', state: 0.00, local: 0.00, combined: 0.00 },
  { code: 'DC', name: 'District of Columbia', state: 6.00, local: 0.00, combined: 6.00 },
  { code: 'FL', name: 'Florida', state: 6.00, local: 0.98, combined: 6.98 },
  { code: 'GA', name: 'Georgia', state: 4.00, local: 3.56, combined: 7.56 },
  { code: 'HI', name: 'Hawaii', state: 4.00, local: 0.50, combined: 4.50 },
  { code: 'ID', name: 'Idaho', state: 6.00, local: 0.03, combined: 6.03 },
  { code: 'IL', name: 'Illinois', state: 6.25, local: 2.73, combined: 8.98 },
  { code: 'IN', name: 'Indiana', state: 7.00, local: 0.00, combined: 7.00 },
  { code: 'IA', name: 'Iowa', state: 6.00, local: 0.94, combined: 6.94 },
  { code: 'KS', name: 'Kansas', state: 6.50, local: 2.21, combined: 8.71 },
  { code: 'KY', name: 'Kentucky', state: 6.00, local: 0.00, combined: 6.00 },
  { code: 'LA', name: 'Louisiana', state: 5.00, local: 5.13, combined: 10.13 },
  { code: 'ME', name: 'Maine', state: 5.50, local: 0.00, combined: 5.50 },
  { code: 'MD', name: 'Maryland', state: 6.00, local: 0.00, combined: 6.00 },
  { code: 'MA', name: 'Massachusetts', state: 6.25, local: 0.00, combined: 6.25 },
  { code: 'MI', name: 'Michigan', state: 6.00, local: 0.00, combined: 6.00 },
  { code: 'MN', name: 'Minnesota', state: 6.88, local: 1.26, combined: 8.14 },
  { code: 'MS', name: 'Mississippi', state: 7.00, local: 0.06, combined: 7.06 },
  { code: 'MO', name: 'Missouri', state: 4.23, local: 4.22, combined: 8.44 },
  { code: 'MT', name: 'Montana', state: 0.00, local: 0.00, combined: 0.00 },
  { code: 'NE', name: 'Nebraska', state: 5.50, local: 1.48, combined: 6.98 },
  { code: 'NV', name: 'Nevada', state: 6.85, local: 1.39, combined: 8.24 },
  { code: 'NH', name: 'New Hampshire', state: 0.00, local: 0.00, combined: 0.00 },
  { code: 'NJ', name: 'New Jersey', state: 6.63, local: -0.02, combined: 6.60 },
  { code: 'NM', name: 'New Mexico', state: 4.88, local: 2.80, combined: 7.68 },
  { code: 'NY', name: 'New York', state: 4.00, local: 4.54, combined: 8.54 },
  { code: 'NC', name: 'North Carolina', state: 4.75, local: 2.35, combined: 7.10 },
  { code: 'ND', name: 'North Dakota', state: 5.00, local: 2.09, combined: 7.09 },
  { code: 'OH', name: 'Ohio', state: 5.75, local: 1.54, combined: 7.29 },
  { code: 'OK', name: 'Oklahoma', state: 4.50, local: 4.56, combined: 9.06 },
  { code: 'OR', name: 'Oregon', state: 0.00, local: 0.00, combined: 0.00 },
  { code: 'PA', name: 'Pennsylvania', state: 6.00, local: 0.34, combined: 6.34 },
  { code: 'RI', name: 'Rhode Island', state: 7.00, local: 0.00, combined: 7.00 },
  { code: 'SC', name: 'South Carolina', state: 6.00, local: 1.49, combined: 7.49 },
  { code: 'SD', name: 'South Dakota', state: 4.20, local: 1.91, combined: 6.11 },
  { code: 'TN', name: 'Tennessee', state: 7.00, local: 2.61, combined: 9.61 },
  { code: 'TX', name: 'Texas', state: 6.25, local: 1.95, combined: 8.20 },
  { code: 'UT', name: 'Utah', state: 6.10, local: 1.32, combined: 7.42 },
  { code: 'VT', name: 'Vermont', state: 6.00, local: 0.43, combined: 6.43 },
  { code: 'VA', name: 'Virginia', state: 5.30, local: 0.47, combined: 5.77 },
  { code: 'WA', name: 'Washington', state: 6.50, local: 3.07, combined: 9.57 },
  { code: 'WV', name: 'West Virginia', state: 6.00, local: 0.60, combined: 6.60 },
  { code: 'WI', name: 'Wisconsin', state: 5.00, local: 0.72, combined: 5.72 },
  { code: 'WY', name: 'Wyoming', state: 4.00, local: 1.39, combined: 5.39 },
];

export const US_STATE_BY_CODE = Object.fromEntries(US_STATES.map((s) => [s.code, s]));

/** Resolve the selection ('AVG' | 'NONE' | state code) to { rate, label }. */
export function salesTaxFor(selection) {
  if (selection === 'NONE') return { rate: 0, label: 'no sales tax (list price)' };
  const s = US_STATE_BY_CODE[selection];
  if (s) return { rate: s.combined, label: `${s.name}, ${s.combined.toFixed(2)}%` };
  return { rate: US_AVERAGE_RATE, label: `US average, ${US_AVERAGE_RATE.toFixed(2)}%` };
}
