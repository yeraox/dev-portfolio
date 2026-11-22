// The images a browser or a chat app shows for the site, into public/:
// - og-image.png (1200×630): what LinkedIn, WhatsApp… show when the link is shared — a capture of
//   the real title screen (controls hidden, PRESS START lit).
// - favicon.png and apple-touch-icon.png: Yeray's face (it is his portfolio): the head
//   and collar of his in-game drawing (the front walk's still image, skin tone included), exactly
//   as it is — cut out, padded to a square, and for the phone icon enlarged ×3 pixel by pixel on
//   the night sky (phones don't show transparency).
// And this portfolio's own picture for the PROJECTS window, into media-src/projects/portfolio.png
// (then `npm run media` makes it light): the camp with its ring, still (animations off), at 1440.
// Usage: npm run share -- [url]   (needs a running site with no drafts: npx vite preview, at
// http://localhost:4173/; the dev ring has the ABOUT ME draft. And ffmpeg)
import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';
import { chromium } from 'playwright';

const url = (process.argv[2] ?? 'http://localhost:4173/').replace(/#.*$/, '');
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

// ---------- This portfolio in the PROJECTS window: the camp ----------
const camp = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, locale: 'es-ES', reducedMotion: 'reduce' });
await camp.goto(`${url}#camp`, { waitUntil: 'networkidle' });
await camp.evaluate(() => document.fonts.ready);
const slots = await camp.getByRole('menuitem').count();
if (slots !== 7) throw new Error(`The ring has ${slots} slots, not 7: run this against the build (npx vite preview).`);
// The stage only (scene, ring, banner and HUD: 1280×720 at 1440), without the page around it.
await camp.locator('main canvas').first().locator('..').screenshot({ path: 'media-src/projects/portfolio.png', animations: 'disabled' });
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

for (const file of ['public/og-image.png', 'public/favicon.png', 'public/apple-touch-icon.png', 'media-src/projects/portfolio.png']) {
  console.log(`✓ ${file} (${(statSync(file).size / 1024).toFixed(1)} KB)`);
}
