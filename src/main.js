import { initHero } from './sections/hero.js';
import { initOverview } from './sections/overview.js';
import { initScorecard } from './sections/scorecard.js';
import { initMap } from './sections/map.js';
import { initIntelligence } from './sections/intelligence.js';
import { initSubscriptions } from './sections/subscriptions.js';
import { initPlatform } from './sections/platform.js';
import { initHardware } from './sections/hardware.js';
import { initSources } from './sections/sources.js';

function initTheme() {
  const btn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const current = () => root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  btn?.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch { /* ignore */ }
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
initNavHighlight();

// Open a scorecard row when navigated to by hash.
window.addEventListener('hashchange', () => {
  const id = location.hash.replace('#feature-', '');
  const row = document.getElementById(`feature-${id}`);
  if (row && row.getAttribute('aria-expanded') === 'false') row.click();
});
