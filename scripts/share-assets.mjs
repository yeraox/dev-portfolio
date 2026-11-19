// The images a browser or a chat app shows for the site, into public/:
// - og-image.png (1200×630): what LinkedIn, WhatsApp… show when the link is shared — a capture of
//   the real title screen (controls hidden, PRESS START lit).
// - favicon.png and apple-touch-icon.png: Null's portrait exactly as it is (his reference, never
//   redrawn): padded to a square, and for the phone icon enlarged ×3 pixel by pixel on the night
//   sky (phones don't show transparency).
// Usage: npm run share -- [url]   (needs the dev server: npm run dev; and ffmpeg)
import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';
import { chromium } from 'playwright';

const url = (process.argv[2] ?? 'http://localhost:5173/').replace(/#.*$/, '');
const PORTRAIT = 'src/assets/characters/null-portrait.png'; // 50×47
const NIGHT = '0x070912'; // night-0 (src/styles/palette.ts)

// ---------- Share image: the title screen ----------
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, locale: 'es-ES' });
await page.goto(`${url}#title`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
// Only the name, the credits and PRESS START: every other control is hidden for the picture.
await page.evaluate(() => {
  for (const control of document.querySelectorAll('button, a')) {
    if (control.textContent !== 'PRESS START') control.style.visibility = 'hidden';
  }
});
await page.screenshot({ path: 'public/og-image.png', animations: 'disabled' });
await browser.close();

// ---------- Icons: Null's portrait as it is ----------
const ffmpeg = (...args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args]);
// 50×47 → 50×50: one transparent row above and two below, no pixel changed.
ffmpeg('-i', PORTRAIT, '-vf', 'pad=50:50:0:1:color=0x00000000', 'public/favicon.png');
// ×3 nearest neighbour (each pixel becomes a 3×3 block, nothing invented) on a 180×180 night square.
ffmpeg('-i', PORTRAIT, '-vf', `scale=150:141:flags=neighbor,pad=180:180:15:20:color=${NIGHT}`, 'public/apple-touch-icon.png');

for (const file of ['public/og-image.png', 'public/favicon.png', 'public/apple-touch-icon.png']) {
  console.log(`✓ ${file} (${(statSync(file).size / 1024).toFixed(1)} KB)`);
}
