// The images a browser or a chat app shows for the site, into public/:
// - og-image.png (1200×630): what LinkedIn, WhatsApp… show when the link is shared — a capture of
//   the real title screen (controls hidden, PRESS START lit).
// - favicon.png and apple-touch-icon.png: Yeray's face (it is his portfolio): the head
//   and collar of his in-game drawing (the front walk's still image, skin tone included), exactly
//   as it is — cut out, padded to a square, and for the phone icon enlarged ×3 pixel by pixel on
//   the night sky (phones don't show transparency).
// Usage: npm run share -- [url]   (needs the dev server: npm run dev; and ffmpeg)
import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';
import { chromium } from 'playwright';

const url = (process.argv[2] ?? 'http://localhost:5173/').replace(/#.*$/, '');
// Yeray's still front drawing is the first image (113 rows) of the front walk sheet.
const SHEET = 'src/assets/characters/yeray-front-walk.png';
const FACE = 46; // the head and collar: the drawing's full width, and as many rows from the hair
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

// ---------- Icons: Yeray's face as it is ----------
const ffmpeg = (...args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args]);
// Where the hair starts: the first row of the sheet with a visible pixel.
const [width] = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=width', '-of', 'csv=p=0', SHEET]).toString().trim().split(',').map(Number);
const pixels = execFileSync('ffmpeg', ['-v', 'error', '-i', SHEET, '-f', 'rawvideo', '-pix_fmt', 'rgba', '-']);
let top = 0;
while ([...Array(width).keys()].every((x) => pixels[(top * width + x) * 4 + 3] === 0)) top++;
// 46×46 (head and collar) → 48×48 with one transparent pixel around: no pixel changed.
ffmpeg('-i', SHEET, '-vf', `crop=${FACE}:${FACE}:0:${top},pad=48:48:1:1:color=0x00000000`, 'public/favicon.png');
// ×3 nearest neighbour (each pixel becomes a 3×3 block, nothing invented) laid over a 180×180
// night square: the face's transparent background becomes night too.
ffmpeg(
  '-f', 'lavfi', '-i', `color=c=${NIGHT}:s=180x180`,
  '-i', SHEET,
  '-filter_complex', `[1]crop=${FACE}:${FACE}:0:${top},scale=${FACE * 3}:${FACE * 3}:flags=neighbor[face];[0][face]overlay=21:21`,
  '-frames:v', '1',
  'public/apple-touch-icon.png',
);

for (const file of ['public/og-image.png', 'public/favicon.png', 'public/apple-touch-icon.png']) {
  console.log(`✓ ${file} (${(statSync(file).size / 1024).toFixed(1)} KB)`);
}
