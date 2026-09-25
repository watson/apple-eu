import { el, mount, fmtDate } from '../dom.js';
import { getState, setState, subscribe } from '../state.js';
import { TIMELINE } from '../data/timeline.js';
import { EU_LANGUAGES, LANGUAGE_BY_CODE } from '../data/languages.js';
import { LANGUAGE_SUPPORT } from '../data/language-support.js';
import { COUNTRY_BY_CODE } from '../data/countries.js';
import { sourceLinks } from '../components/chips.js';

const CHECKS = [
  { key: 'systemLanguage', title: 'iPhone system language', text: 'Can the iPhone interface itself run in this language?', sources: ['A4'] },
  { key: 'siri', title: 'Siri (classic)', text: 'Apple lists Siri by country and language.', sources: ['A4'] },
  { key: 'appleIntelligence', title: 'Apple Intelligence', text: 'Writing Tools, Genmoji, summaries, Image Playground and more. Device and Siri language must match.', sources: ['A1', 'A4'] },
  { key: 'siriAI', title: 'Siri AI (new Siri)', text: 'English only, and not on EU iPhones, iPads or Watches at all.', sources: ['A2'], override: (lang, state) => state.country ? { status: 'no', note: 'Not on iPhone, iPad or Watch in the EU; Mac and Vision Pro in English only.' } : { status: lang === 'en' ? 'partial' : 'no', note: lang === 'en' ? 'English only; excluded on EU iPhone, iPad and Watch.' : 'English only.' } },
  { key: 'messagesLiveTranslation', title: 'Live Translation in Messages', text: 'Text translation inside conversations.', sources: ['A4', 'A6'] },
  { key: 'phoneLiveTranslation', title: 'Live Translation in Phone and FaceTime', text: 'Spoken translation during calls.', sources: ['A4', 'A7'] },
  { key: 'airpodsLiveTranslation', title: 'Live Translation with AirPods', text: 'Face-to-face conversation translation.', sources: ['A4', 'A8'] },
  { key: 'notesTranscription', title: 'Notes audio transcription', text: 'Recording transcription in Notes (iPhone 12 or later).', sources: ['A4', 'A11'] },
  { key: 'notesTranscriptionSummaries', title: 'Notes transcription summaries', text: 'AI summaries of transcribed recordings.', sources: ['A4'] },
  { key: 'workoutBuddy', title: 'Workout Buddy', text: 'Spoken workout coaching on Apple Watch.', sources: ['A4', 'A10'] },
  { key: 'dictation', title: 'Dictation', text: 'Keyboard dictation.', sources: ['A4'] },
  { key: 'liveText', title: 'Live Text', text: 'Recognising text in photos and camera.', sources: ['A4'] },
  { key: 'translateApp', title: 'Translate app', text: 'Apple’s own translation app.', sources: ['A4'] },
  { key: 'safariTranslation', title: 'Safari web page translation', text: 'Built-in page translation.', sources: ['A4'] },
  { key: 'visualLookUp', title: 'Visual Look Up', text: 'Identify objects, plants, landmarks.', sources: ['A4'] },
  { key: 'liveCaptions', title: 'Live Captions (accessibility)', text: 'Real-time captions for audio.', sources: ['A4'] },
];

export function initIntelligence() {
  renderTimeline();
  renderLangPicker();
  renderLangCheck();
  renderLangGrid();
  subscribe((state, prev) => {
    if (state.langs !== prev.langs || state.country !== prev.country) { renderLangPicker(); renderLangCheck(); renderLangGrid(); }
  });
}

function renderTimeline() {
  mount('timeline', TIMELINE.map((t) => el('div', { class: `tl-item ${t.side} ${t.future ? 'future' : ''}` },
    el('div', { class: 'tl-date' }, fmtDate(t.date)),
    el('div', { class: 'tl-dot', 'aria-hidden': 'true' }),
    el('div', { class: 'tl-body' },
      el('h4', {}, t.title, el('span', { class: `verdict ${t.side}` }, t.side === 'us' ? 'US' : t.side === 'eu' ? 'EU' : 'Both'), t.future ? el('span', { class: 'tag' }, 'Upcoming') : null),
      el('p', {}, t.text),
      el('div', { style: { fontSize: '12px', marginTop: '4px' } }, sourceLinks(t.sources)),
    ),
  )));
}

function primaryLang(state) { return state.langs[0] || 'en'; }

function renderLangPicker() {
  const state = getState();
  const sel = el('select', { class: 'select', 'aria-label': 'Language' },
    EU_LANGUAGES.map((l) => el('option', { value: l.code }, l.name)),
  );
  sel.value = primaryLang(state);
  sel.addEventListener('change', () => setState({ langs: [sel.value], langsManual: true }));
  const c = state.country ? COUNTRY_BY_CODE[state.country] : null;
  const hint = c && !state.langsManual ? `Pre-selected from ${c.name}.` : state.langsManual ? 'Chosen manually.' : 'Default: English.';
  mount('lang-picker',
    el('label', { style: { fontWeight: '600' } }, 'I use my iPhone in'),
    sel,
    el('span', { class: 'note' }, hint),
    state.langsManual && c ? el('button', { class: 'btn', type: 'button', onclick: () => setState({ langsManual: false, langs: [...c.languages] }) }, `Reset to ${c.name}`) : null,
  );
}

function renderLangCheck() {
  const state = getState();
  const lang = primaryLang(state);
  const name = LANGUAGE_BY_CODE[lang]?.name || lang;
  const items = CHECKS.map((c) => {
    let status, note;
    if (c.override) ({ status, note } = c.override(lang, state));
    else {
      const ok = (LANGUAGE_SUPPORT[c.key] || []).includes(lang);
      status = ok ? 'yes' : 'no';
      note = ok ? `Supported in ${name}.` : `Not listed for ${name}${lang !== 'en' ? '; works if you switch the device to a supported language such as English' : ''}.`;
    }
    return el('div', { class: `lang-item ${status}` },
      el('div', { class: 'icon', 'aria-hidden': 'true' }, status === 'yes' ? '✓' : status === 'partial' ? '◐' : '✕'),
      el('div', {}, el('h4', {}, c.title), el('p', {}, c.text, ' ', el('b', {}, note))),
    );
  });
  const supported = items.filter((n) => n.classList.contains('yes')).length;
  mount('lang-check',
    el('p', { class: 'secondary', style: { fontSize: '15px' } }, el('b', {}, `${name}: `), `${supported} of ${CHECKS.length} language-gated features support it.`),
    el('div', { class: 'lang-check' }, items),
  );
}

function renderLangGrid() {
  const state = getState();
  const mine = new Set(state.langs);
  const supported = EU_LANGUAGES.filter((l) => LANGUAGE_SUPPORT.appleIntelligence.includes(l.code)).length;
  mount('lang-grid',
    el('div', { class: 'lang-legend' },
      el('b', {}, `${supported} of ${EU_LANGUAGES.length} supported.`),
      el('span', {}, el('span', { class: 'i', style: { background: 'var(--same)' }, 'aria-hidden': 'true' }, '✓'), 'Supported by Apple Intelligence'),
      el('span', {}, el('span', { class: 'i', style: { background: 'var(--na)' }, 'aria-hidden': 'true' }, '✕'), 'Not supported'),
    ),
    el('div', { class: 'lang-grid' }, EU_LANGUAGES.map((l) => {
      const ok = LANGUAGE_SUPPORT.appleIntelligence.includes(l.code);
      return el('div', { class: `lang-pill ${ok ? 'yes' : 'no'} ${mine.has(l.code) ? 'me' : ''}`.trim(), title: ok ? 'Apple Intelligence supported' : 'Not supported by Apple Intelligence' },
        el('span', { class: 'i', 'aria-hidden': 'true' }, ok ? '✓' : '✕'), l.name, el('span', { class: 'visually-hidden' }, ok ? ' supported' : ' not supported'));
    })),
  );
}
