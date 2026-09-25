// Renders scripts/social-card.html to assets/social-card.png (2400×1260, a 1.91:1
// image that X, Facebook, LinkedIn, Bluesky, Mastodon and iMessage all accept).
// Needs Google Chrome; set CHROME to its binary if it is not in the default place.
// Usage: node scripts/social-card.mjs
import { spawn } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'assets/social-card.png');
const chromePath = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if (!existsSync(chromePath)) {
  console.error(`Google Chrome not found at ${chromePath}; set CHROME=/path/to/chrome`);
  process.exit(1);
}

const WIDTH = 1200, HEIGHT = 630, SCALE = 2;
const port = 9700 + Math.floor(Math.random() * 200);
const cdpPort = port + 1000;

const server = spawn(process.execPath, [resolve(root, 'scripts/serve.mjs'), String(port)], { stdio: 'ignore' });
const chrome = spawn(chromePath, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  `--remote-debugging-port=${cdpPort}`, `--user-data-dir=/tmp/apple-eu-social-card-${cdpPort}`,
  `--window-size=${WIDTH},${HEIGHT}`, 'about:blank',
], { stdio: 'ignore' });
const cleanup = () => { chrome.kill(); server.kill(); };
const killTimer = setTimeout(() => { console.error('Timed out'); cleanup(); process.exit(2); }, 30000);

async function targets() {
  for (let i = 0; i < 40; i++) {
    try { return await (await fetch(`http://127.0.0.1:${cdpPort}/json`)).json(); } catch { await sleep(250); }
  }
  throw new Error('Chrome did not start');
}
const page = (await targets()).find((t) => t.type === 'page');
const sock = new WebSocket(page.webSocketDebuggerUrl);
let id = 0; const pending = new Map();
sock.onmessage = (m) => { const msg = JSON.parse(m.data); if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); sock.send(JSON.stringify({ id: i, method, params })); });
await new Promise((r) => { sock.onopen = r; });

await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'light' }] });
await send('Emulation.setDeviceMetricsOverride', { width: WIDTH, height: HEIGHT, deviceScaleFactor: SCALE, mobile: false });
await send('Page.navigate', { url: `http://127.0.0.1:${port}/scripts/social-card.html` });
for (let i = 0; i < 40; i++) {
  const { result } = await send('Runtime.evaluate', { expression: 'window.__ready === true', returnByValue: true });
  if (result?.result?.value) break;
  await sleep(250);
}
await sleep(300);
const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT, scale: 1 } });
writeFileSync(out, Buffer.from(shot.result.data, 'base64'));
console.log(`Wrote ${out} (${WIDTH * SCALE}×${HEIGHT * SCALE})`);
clearTimeout(killTimer);
sock.close();
cleanup();
