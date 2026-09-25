import { initHero } from './sections/hero.js';
import { initOverview } from './sections/overview.js';
import { initScorecard } from './sections/scorecard.js';
import { initMap } from './sections/map.js';
import { initIntelligence } from './sections/intelligence.js';
import { initSubscriptions } from './sections/subscriptions.js';
import { initPlatform } from './sections/platform.js';
import { initHardware } from './sections/hardware.js';
import { initSources } from './sections/sources.js';
import { initSettings } from './components/settings.js';

// Three-state theme control: System → Light → Dark → System. A manual choice is
// remembered; "System" clears it so the page follows the OS again.
const THEME_MODES = [
  { id: 'system', label: 'Auto', glyph: '◐', title: 'follows system' },
  { id: 'light', label: 'Light', glyph: '○', title: 'light' },
  { id: 'dark', label: 'Dark', glyph: '●', title: 'dark' },
];

function initTheme() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const root = document.documentElement;
  const read = () => { try { const t = localStorage.getItem('theme'); return t === 'dark' || t === 'light' ? t : 'system'; } catch { return 'system'; } };
  const apply = (mode) => {
    if (mode === 'system') { delete root.dataset.theme; try { localStorage.removeItem('theme'); } catch { /* ignore */ } }
    else { root.dataset.theme = mode; try { localStorage.setItem('theme', mode); } catch { /* ignore */ } }
    const m = THEME_MODES.find((x) => x.id === mode);
    const next = THEME_MODES[(THEME_MODES.indexOf(m) + 1) % THEME_MODES.length];
    btn.querySelector('.glyph').textContent = m.glyph;
    btn.querySelector('.label').textContent = m.label;
    btn.title = `Theme: ${m.title}`;
    btn.setAttribute('aria-label', `Theme: ${m.title}. Click to switch to ${next.title}.`);
  };
  apply(read());
  btn.addEventListener('click', () => {
    const i = THEME_MODES.findIndex((x) => x.id === read());
    apply(THEME_MODES[(i + 1) % THEME_MODES.length].id);
  });
}

function initNavHighlight() {
  const links = [...document.querySelectorAll('.nav a')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      links.forEach((a) => a.setAttribute('aria-current', a.getAttribute('href') === `#${e.target.id}` ? 'true' : 'false'));
    }
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach((s) => io.observe(s));
}

initTheme();
initHero();
initOverview();
initScorecard();
initMap();
initIntelligence();
initSubscriptions();
initPlatform();
initHardware();
initSources();
initSettings();
initNavHighlight();

// Open a scorecard row when navigated to by hash.
window.addEventListener('hashchange', () => {
  const id = location.hash.replace('#feature-', '');
  const row = document.getElementById(`feature-${id}`);
  if (row && row.getAttribute('aria-expanded') === 'false') row.click();
});
