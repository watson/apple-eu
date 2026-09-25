// Anonymous custom events for Plausible (cookieless). Safe no-op when the
// script is blocked or absent. Event names are a small fixed set; props never
// contain free text or anything identifying.
export function track(event, props) {
  try {
    if (typeof window.plausible === 'function') window.plausible(event, props ? { props } : undefined);
  } catch { /* analytics must never break the page */ }
}
