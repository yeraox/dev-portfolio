// Check of the title screen: screenshots in both languages at the three sizes, and how it starts
// (key, click, tap → the intro; SKIP INTRO → the camp), what must NOT start it (Tab, the SETTINGS
// gear and its window, the CV), the dithered transition, the camp preloading, links that skip the
// title and reduced motion; the CV's parchment and its question, the page's head tags, icons and
// PDFs, and what a browser without JavaScript shows.
// Usage: npm run check:title -- [url]   (default http://localhost:5173/)
import { mkdirSync } from 'node:fs';
import { DESKTOP, PHONE, SIZES, chromium, createChecks, newPage, siteUrl } from './lib/browser.mjs';

const url = siteUrl();
const OUT = '.screenshots/fase-5';
const { check, done } = createChecks();

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
/** A fresh page at `size`, in `lang`, loaded at `hash` with its fonts ready. */
const open = async (lang, size, hash = '', extra = {}) => {
  const opened = await newPage(browser, size, lang, extra);
  await opened.page.goto(`${url}${hash}`, { waitUntil: 'networkidle' });
  await opened.page.evaluate(() => document.fonts.ready);
  return opened;
};
const onTitle = (page) => page.getByRole('heading', { level: 1, name: 'YERAY CATURLA', exact: true }).isVisible();
const inCamp = async (page) => (await page.getByRole('menu').count()) === 1;
// Starting plays the cave intro; SKIP INTRO goes straight to the camp.
const inIntro = async (page) => (await page.locator('[data-scene="intro"]').count()) === 1;
const press = (page) => page.getByRole('button', { name: 'PRESS START' });

// ---------- Screenshots (with PRESS START lit) ----------
let shotErrors = 0;
for (const lang of ['es', 'en']) {
  for (const size of SIZES) {
    const { context, page, errors } = await open(lang, size);
    await page.waitForFunction(() => {
      const button = [...document.querySelectorAll('button')].find((b) => b.textContent === 'PRESS START');
      return button && getComputedStyle(button).visibility === 'visible';
    });
    // `animations: 'disabled'` freezes the blink at its first (lit) frame for the picture.
    await page.screenshot({ path: `${OUT}/titulo-${lang}-${size.width}.png`, animations: 'disabled' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    if (overflow) check(`no horizontal overflow at ${size.width} (${lang})`, false);
    shotErrors += errors.length;
    await context.close();
  }
}
check('6 title screens rendered without console errors', shotErrors === 0, `${shotErrors}`);

// ---------- Keyboard ----------
{
  const { context, page, errors } = await open('es', DESKTOP);
  check('the title is real text (h1 "YERAY CATURLA")', await onTitle(page));
  check('Spanish browser: Spanish credits, the role and DevOps', (await page.locator('main p').first().innerText()) === 'DESARROLLADOR BACKEND JUNIOR · DEVOPS');
  await page.keyboard.press('Tab');
  await page.waitForTimeout(300);
  check('the first Tab stop is the CV (the parchment), and it does not start', (await onTitle(page)) && (await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))) === 'CV: Pergamino — Descargar CV');
  const focusedLabel = () => page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
  await page.keyboard.press('Tab');
  await page.waitForTimeout(300);
  check('Tab moves to the SETTINGS gear (top right) without starting', (await onTitle(page)) && (await focusedLabel()) === 'AJUSTES');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(450);
  const dialog = page.getByRole('dialog');
  check('Enter on the gear opens SETTINGS (language and animations) and does not start', (await dialog.getByRole('heading', { name: 'Ajustes' }).isVisible()) && (await onTitle(page)));
  check('…with no VOLVER AL TÍTULO (this already is the title), but with the privacy line', (await dialog.getByRole('button', { name: 'VOLVER AL TÍTULO' }).count()) === 0 && (await dialog.getByText(/no usa cookies/).count()) === 1);
  await page.screenshot({ path: '.screenshots/fase-8/titulo-ajustes-1440.png', animations: 'disabled' });
  await page.keyboard.press('a');
  await dialog.getByRole('button', { name: 'English', exact: true }).click();
  await page.waitForTimeout(300);
  check('keys and clicks in SETTINGS do not start; English switches the language', (await onTitle(page)) && (await dialog.count()) === 1 && (await page.evaluate(() => document.documentElement.lang)) === 'en');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(450);
  check('Esc closes SETTINGS, with the focus back on the gear', (await dialog.count()) === 0 && (await onTitle(page)) && (await focusedLabel()) === 'SETTINGS');
  check('…the credits are now in English', (await page.locator('main p').first().innerText()) === 'JUNIOR BACKEND DEVELOPER · DEVOPS');
  check('the title no longer has its own ES / EN buttons', (await page.getByRole('button', { name: /^(ES|EN) / }).count()) === 0);
  // Watch the transition's darkness steps.
  await page.evaluate(() => {
    window.__steps = new Set();
    const watch = () => {
      const cover = document.querySelector('[data-darkness]');
      if (cover) window.__steps.add(cover.getAttribute('data-darkness'));
      requestAnimationFrame(watch);
    };
    watch();
  });
  await page.keyboard.press('a');
  await page.waitForTimeout(1200);
  const steps = await page.evaluate(() => [...window.__steps].sort().join(','));
  check('any other key starts (the intro plays)', !(await onTitle(page)) && (await inIntro(page)));
  check('the transition darkens in dithered steps and clears again', steps === '0,1,2,3,4', steps);
  check('the cover is gone afterwards', (await page.locator('[data-darkness]').count()) === 0);
  check('no console errors', errors.length === 0, errors.join(' | '));
  await context.close();
}

// ---------- Mouse, SKIP INTRO, touch ----------
{
  const { context, page } = await open('es', DESKTOP);
  await page.mouse.click(60, 450); // the sky, away from every control
  await page.waitForTimeout(1200);
  check('a click anywhere starts', await inIntro(page));
  await context.close();
}
{
  const { context, page } = await open('es', DESKTOP);
  await page.getByRole('button', { name: 'SKIP INTRO' }).click();
  await page.waitForTimeout(1200);
  check('SKIP INTRO goes straight to the camp', (await inCamp(page)) && !(await inIntro(page)));
  await context.close();
}
{
  const { context, page } = await open('es', PHONE);
  await press(page).tap();
  await page.waitForTimeout(1200);
  check('a tap on PRESS START starts (phone)', await inIntro(page));
  await context.close();
}

// ---------- The camp downloads while the title is on screen ----------
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'es-ES' });
  const page = await context.newPage();
  const images = [];
  page.on('request', (request) => request.resourceType() === 'image' && images.push(request.url()));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  // Yeray's HUD portrait is his walk drawing (yeray-front-walk); Null's is a picture of its own.
  check('the camp image, the characters and Null\'s HUD portrait download during the title', images.some((u) => /camp/.test(u)) && images.some((u) => /yeray-front-walk/.test(u)) && images.some((u) => /null-portrait/.test(u)));
  await context.close();
}

// ---------- Links skip the title; reduced motion ----------
{
  const { context, page } = await open('es', DESKTOP, '#contact');
  check('a window link (/#contact) skips the title', !(await onTitle(page)) && (await page.getByRole('dialog').count()) === 1);
  await context.close();
}
{
  const { context, page } = await open('es', DESKTOP, '', { reducedMotion: 'reduce' });
  const animation = await press(page).evaluate((b) => getComputedStyle(b).animationName);
  check('reduced motion: PRESS START does not blink', animation === 'none', animation);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(250);
  check('reduced motion: the camp appears at once, without the intro', (await inCamp(page)) && !(await inIntro(page)));
  await context.close();
}

// ---------- the CV's parchment on the title ----------
const overlaps = (a, b) => a && b && a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
mkdirSync('.screenshots/fase-8', { recursive: true });
for (const size of SIZES) {
  const { context, page } = await open('es', size);
  const scroll = page.getByRole('button', { name: /^CV:/ });
  const box = await scroll.boundingBox();
  const gear = page.getByRole('button', { name: 'AJUSTES' });
  const gearBox = await gear.boundingBox();
  const controls = await Promise.all(
    [press(page), page.getByRole('button', { name: 'SKIP INTRO' }), page.getByRole('heading', { level: 1 })].map((locator) => locator.boundingBox()),
  );
  check(`title (${size.width}): the CV parchment is visible, with its name, and covers nothing`, (await scroll.isVisible()) && (await scroll.innerText()) === 'CV' && [gearBox, ...controls].every((control) => !overlaps(box, control)));
  check(`title (${size.width}): the SETTINGS gear too`, (await gear.isVisible()) && (await gear.innerText()) === 'AJUSTES' && controls.every((control) => !overlaps(gearBox, control)));
  await page.screenshot({ path: `.screenshots/fase-8/titulo-cv-${size.width}.png`, animations: 'disabled' });
  await context.close();
}
{
  const { context, page, errors } = await open('es', DESKTOP);
  const downloads = [];
  page.on('download', (download) => downloads.push(download.suggestedFilename()));
  const dialog = page.getByRole('dialog');
  const scroll = page.getByRole('button', { name: /^CV:/ });
  await scroll.click();
  await page.waitForTimeout(450);
  check('clicking the parchment asks "¿Descargar el CV en PDF?" and does not start', (await dialog.getByRole('heading', { name: '¿Descargar el CV en PDF?' }).isVisible()) && (await onTitle(page)));
  await page.screenshot({ path: '.screenshots/fase-8/titulo-cv-pregunta-1440.png', animations: 'disabled' });
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('a');
  await dialog.getByText('PDF · español · 3,1 MB').click();
  await page.waitForTimeout(300);
  check('keys and clicks inside the question do not start the game', (await onTitle(page)) && (await dialog.count()) === 1 && !(await inIntro(page)));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(450);
  check('Esc closes it: no download, still on the title, focus back on the parchment', (await dialog.count()) === 0 && downloads.length === 0 && (await onTitle(page)) && (await page.evaluate(() => document.activeElement?.getAttribute('aria-label')?.startsWith('CV:') ?? false)));
  await page.keyboard.press('Enter');
  await page.waitForTimeout(450);
  await page.keyboard.press('Enter'); // SÍ is focused
  await page.waitForTimeout(800);
  check('Enter, Enter: SÍ downloads the Spanish PDF; still on the title', downloads.join() === 'yeray-caturla-cv-es.pdf' && (await dialog.count()) === 0 && (await onTitle(page)), downloads.join());
  await page.keyboard.press('a');
  await page.waitForTimeout(1200);
  check('afterwards, any key starts again', await inIntro(page));
  check('no console errors', errors.length === 0, errors.join(' | '));
  await context.close();
}
{
  const { context, page } = await open('en', PHONE);
  await page.getByRole('button', { name: /^CV:/ }).tap();
  await page.waitForTimeout(450);
  const dialog = page.getByRole('dialog');
  check('phone, English: tapping the parchment asks in English, for the English PDF', (await dialog.getByRole('heading', { name: 'Download the CV as a PDF?' }).isVisible()) && (await dialog.getByRole('link', { name: 'YES' }).getAttribute('href')) === '/cv/yeray-caturla-cv-en.pdf');
  await page.screenshot({ path: '.screenshots/fase-8/titulo-cv-pregunta-390.png', animations: 'disabled' });
  await dialog.getByRole('button', { name: 'NO' }).tap();
  await page.waitForTimeout(450);
  check('phone: NO closes it and the title is still there', (await dialog.count()) === 0 && (await onTitle(page)) && !(await inIntro(page)));
  await page.getByRole('button', { name: 'SETTINGS' }).tap();
  await page.waitForTimeout(450);
  check('phone: tapping the gear opens SETTINGS and does not start', (await dialog.getByRole('heading', { name: 'Settings' }).isVisible()) && (await onTitle(page)));
  await page.screenshot({ path: '.screenshots/fase-8/titulo-ajustes-390.png', animations: 'disabled' });
  await dialog.getByRole('button', { name: /^ESC EXIT/ }).tap();
  await page.waitForTimeout(450);
  check('phone: ESC EXIT closes it, still on the title', (await dialog.count()) === 0 && (await onTitle(page)) && !(await inIntro(page)));
  await context.close();
}

// ---------- head tags, icons, PDFs; no JavaScript ----------
{
  const { context, page } = await open('es', DESKTOP);
  const head = await page.evaluate(() => ({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
    ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
    icon: document.querySelector('link[rel="icon"]')?.getAttribute('href'),
  }));
  check('the page: title, description and share tags', head.title.startsWith('Yeray Caturla') && !!head.description && !!head.ogTitle && head.icon === '/favicon.png');
  const base = url.replace(/\/$/, '');
  for (const [file, type] of [['/favicon.png', 'image/png'], ['/apple-touch-icon.png', 'image/png'], ['/og-image.png', 'image/png'], ['/cv/yeray-caturla-cv-es.pdf', 'pdf'], ['/cv/yeray-caturla-cv-en.pdf', 'pdf']]) {
    const response = await page.request.get(`${base}${file}`);
    check(`${file} is served`, response.ok() && (response.headers()['content-type'] ?? '').includes(type));
  }
  const cvPage = await page.request.get(`${base}/cv/`);
  check('the CV web view is gone (/cv/ is not a page any more)', !(await cvPage.text()).includes('<h1>Yeray Caturla</h1>'));
  await context.close();
}
{
  const { context, page } = await open('es', PHONE, '', { javaScriptEnabled: false });
  const links = await page.locator('noscript a, .noscript a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  const text = await page.locator('body').innerText();
  check('without JavaScript: a note with both CV PDFs', text.includes('necesita JavaScript') && text.includes('needs JavaScript') && links.join(' ') === '/cv/yeray-caturla-cv-es.pdf /cv/yeray-caturla-cv-en.pdf', links.join(' '));
  await page.screenshot({ path: '.screenshots/fase-8/sin-javascript-390.png' });
  await context.close();
}

await browser.close();
done();
