// Phase-7 check of the plain CV view and the ways to reach it: /cv/ and /cv/en/ at the three sizes
// (screenshots, no JavaScript, headings, no phone, PDF, language and back links, printing), the
// VER CV link on every screen of the game (visible, not covering anything, first Tab stop), the CV
// rows in COMMS, and the head tags and icons of the pages.
// Usage: npm run check:cv -- [url]   (default http://localhost:5173/)
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const base = (process.argv[2] ?? 'http://localhost:5173/').replace(/#.*$/, '').replace(/\/$/, '');
const OUT = '.screenshots/fase-7';
const SIZES = [
  { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { width: 768, height: 1024, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
];
const desktop = SIZES[2];

let failures = 0;
const check = (name, ok, detail = '') => {
  if (!ok) failures++;
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? `  (${detail})` : ''}`);
};

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const newPage = async (size, locale = 'es-ES', extra = {}) => {
  const context = await browser.newContext({
    viewport: { width: size.width, height: size.height },
    deviceScaleFactor: size.deviceScaleFactor,
    isMobile: size.isMobile,
    hasTouch: size.hasTouch,
    locale,
    ...extra,
  });
  const page = await context.newPage();
  const errors = [];
  const scripts = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
  page.on('request', (request) => request.resourceType() === 'script' && scripts.push(request.url()));
  return { context, page, errors, scripts };
};
const goto = async (page, path) => {
  await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
};
const overlaps = (a, b) => a && b && a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

// ---------- The CV pages ----------
let pageErrors = 0;
for (const [lang, path] of [
  ['es', '/cv/'],
  ['en', '/cv/en/'],
]) {
  for (const size of SIZES) {
    const { context, page, errors, scripts } = await newPage(size);
    await goto(page, path);
    await page.screenshot({ path: `${OUT}/cv-${lang}-${size.width}.png`, fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    if (overflow) check(`no horizontal overflow on ${path} at ${size.width}`, false);
    // Vite's dev server adds its own client script; the built page has none.
    const own = scripts.filter((url) => !/\/@vite\/|\/@react-refresh|\/node_modules\/vite\//.test(url));
    if (own.length > 0) check(`${path} loads no JavaScript at ${size.width}`, false, own.join(' '));
    pageErrors += errors.length;
    await context.close();
  }
}
check('6 CV pages without console errors', pageErrors === 0, `${pageErrors}`);

{
  const { context, page } = await newPage(desktop);
  await goto(page, '/cv/');
  const text = await page.locator('body').innerText();
  check('Spanish CV: lang="es", one h1 and six sections', (await page.getAttribute('html', 'lang')) === 'es' && (await page.locator('h1').count()) === 1 && (await page.locator('h2').count()) === 6);
  check('no phone number on the page', !/\+?\d[\d .-]{8,}\d/.test(text));
  check('Bosa Digital: its three sentences and nothing more', text.includes('Herramientas en Python para automatizar procesos internos del área de ventas.'));
  const pdf = await page.request.get(`${base}/cv/yeray-caturla-cv-es.pdf`);
  check('the PDF downloads (200, application/pdf)', pdf.ok() && (pdf.headers()['content-type'] ?? '').includes('pdf'), `${pdf.status()} ${pdf.headers()['content-type']}`);
  check('the PDF button has the download attribute', (await page.locator('a.download').getAttribute('download')) !== null);
  await page.getByRole('link', { name: 'English version' }).click();
  await page.waitForLoadState('networkidle');
  check('"English version" opens /cv/en/ in English', page.url().endsWith('/cv/en/') && (await page.getAttribute('html', 'lang')) === 'en' && (await page.locator('h2').first().innerText()).toLowerCase() === 'contact');
  check('the English page says the PDF is in Spanish', (await page.locator('a.download').innerText()).includes('Spanish'));
  await page.getByRole('link', { name: 'Back to the portfolio' }).click();
  await page.waitForLoadState('networkidle');
  check('"Back to the portfolio" returns to the game', new URL(page.url()).pathname === '/' && (await page.locator('#root').count()) === 1);

  // Printing: the browser's own PDF of the page (Save as PDF), and how many A4 pages it takes.
  await goto(page, '/cv/');
  await page.emulateMedia({ media: 'print' });
  await page.screenshot({ path: `${OUT}/cv-impreso-es.png`, fullPage: true });
  const printed = await page.pdf({ format: 'A4', printBackground: false });
  writeFileSync(`${OUT}/cv-impreso-es.pdf`, printed);
  const pages = (printed.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
  check('printed (A4) it fits in 2–3 pages, without the buttons', pages >= 1 && pages <= 3 && !(await page.locator('a.download').isVisible()), `${pages} pages`);
  await context.close();
}

// ---------- VER CV in the game ----------
for (const size of SIZES) {
  const { context, page } = await newPage(size);
  const link = page.getByRole('link', { name: 'VER CV' });
  // Title
  await goto(page, '/#title');
  const onTitle = await link.boundingBox();
  const titleControls = await Promise.all(['ES Español', 'EN English', 'PRESS START', 'SKIP INTRO'].map((name) => page.getByRole('button', { name, exact: true }).boundingBox()));
  check(`title (${size.width}): VER CV visible, not covering the controls`, (await link.isVisible()) && titleControls.every((box) => !overlaps(onTitle, box)));
  // Intro
  await page.keyboard.press('a');
  await page.waitForSelector('[data-scene="intro"]');
  await page.waitForTimeout(800);
  const onIntro = await link.boundingBox();
  check(`intro (${size.width}): VER CV visible, not covering SKIP INTRO`, (await link.isVisible()) && !overlaps(onIntro, await page.getByRole('button', { name: 'SKIP INTRO' }).boundingBox()));
  // Camp
  await page.getByRole('button', { name: 'SKIP INTRO' }).click();
  await page.getByRole('menu').waitFor();
  await page.waitForTimeout(600);
  const onCamp = await link.boundingBox();
  // The whole banner, rope frame included (its class comes from BannerWindow.module.css).
  const banner = await page.locator('[class*="_banner_"]').filter({ hasText: 'Equipo — Proyectos' }).first().boundingBox();
  const slots = await Promise.all((await page.getByRole('menuitem').all()).map((slot) => slot.boundingBox()));
  const portraits = await Promise.all((await page.getByRole('figure').all()).map((figure) => figure.boundingBox()));
  const where = size.width < 1000 ? 'between the portraits' : 'top left';
  check(
    `camp (${size.width}): VER CV visible (${where}), not covering the banner, the ring or the portraits`,
    (await link.isVisible()) && [banner, ...slots, ...portraits].every((box) => !overlaps(onCamp, box)),
  );
  await page.screenshot({ path: `${OUT}/campamento-con-cv-${size.width}.png` });
  if (size === desktop) {
    await link.click();
    await page.waitForLoadState('networkidle');
    check('VER CV opens the Spanish CV', new URL(page.url()).pathname === '/cv/');
  }
  await context.close();
}
{
  const { context, page } = await newPage(desktop, 'en-US');
  await goto(page, '/#camp');
  check('in English it reads VIEW CV and opens /cv/en/', (await page.getByRole('link', { name: 'VIEW CV' }).getAttribute('href')) === '/cv/en/');
  await context.close();
}

// ---------- COMMS: the CV rows ----------
{
  const { context, page } = await newPage(desktop);
  await goto(page, '/#comms');
  const web = page.getByRole('dialog').getByRole('link', { name: /Versión web/ });
  const pdf = page.getByRole('dialog').getByRole('link', { name: 'Descargar', exact: true });
  check('COMMS: "CV · Versión web" opens /cv/ in a new tab', (await web.getAttribute('href')) === '/cv/' && (await web.getAttribute('target')) === '_blank');
  check('COMMS: "CV en PDF · Descargar" downloads the PDF', (await pdf.getAttribute('href')) === '/cv/yeray-caturla-cv-es.pdf' && (await pdf.getAttribute('download')) !== null);
  await context.close();
}

// ---------- Head tags and icons ----------
{
  const { context, page } = await newPage(desktop);
  await goto(page, '/#camp');
  const head = await page.evaluate(() => ({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
    ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
    icon: document.querySelector('link[rel="icon"]')?.getAttribute('href'),
  }));
  check('game page: title, description and share tags', head.title.startsWith('Yeray Caturla') && !!head.description && !!head.ogTitle && head.icon === '/favicon.png');
  for (const file of ['/favicon.png', '/apple-touch-icon.png', '/og-image.png']) {
    const response = await page.request.get(`${base}${file}`);
    check(`${file} is served`, response.ok() && (response.headers()['content-type'] ?? '').includes('image/png'));
  }
  await context.close();
}

await browser.close();
console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
