// Phase-4 check of the content windows: every window in both languages at the three sizes (with
// screenshots), plus behaviour: contact links, the language switch, the project tabs, the video and
// what is (not) downloaded before a window opens. Prints ✓/✗ per check.
// Usage: npm run check:windows -- [url]   (default http://localhost:5173/)
import { mkdirSync } from 'node:fs';
import { DESKTOP, PHONE, SIZES, chromium, createChecks, newPage, siteUrl } from './lib/browser.mjs';

const url = siteUrl();
const OUT = '.screenshots/fase-4';
const SECTIONS = ['projects', 'stack', 'profile', 'contact'];
const PHONE_NUMBER = /\+?\d[\d .-]{8,}\d/; // anything that looks like a phone number
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

// ---------- Screenshots: 4 windows × 2 languages × 3 sizes ----------
let screenshotErrors = 0;
for (const lang of ['es', 'en']) {
  for (const size of SIZES) {
    for (const section of SECTIONS) {
      const { context, page, errors } = await open(lang, size, `#${section}`);
      await page.waitForTimeout(600); // the opening wipe
      await page.screenshot({ path: `${OUT}/${section}-${lang}-${size.width}.png` });
      // The whole window, scrolled content included: lift the height limits for this shot.
      await page.addStyleTag({ content: 'dialog, dialog * { max-height: none !important; overflow: visible !important; }' });
      await page.locator('dialog').screenshot({ path: `${OUT}/${section}-${lang}-${size.width}-full.png` });
      const text = await page.locator('dialog').innerText();
      if (PHONE_NUMBER.test(text)) check(`no phone number in ${section} (${lang})`, false, text.match(PHONE_NUMBER)[0]);
      screenshotErrors += errors.length;
      await context.close();
    }
  }
}
check('24 windows rendered without console errors', screenshotErrors === 0, `${screenshotErrors} errors`);
check(`screenshots saved in ${OUT}/`, true);


// ---------- Titles in both languages ----------
for (const [lang, expected] of [
  ['es', ['Alquimia — Proyectos', 'Equipo — Stack técnico', 'Estadísticas — Perfil', 'Configuración — Contacto']],
  ['en', ['Alchemy — Projects', 'Equipment — Tech Stack', 'Stats — Profile', 'Config — Contact']],
]) {
  const titles = [];
  for (const section of SECTIONS) {
    const { context, page } = await open(lang, DESKTOP, `#${section}`);
    titles.push(await page.locator('dialog h2').innerText());
    await context.close();
  }
  check(`window titles in ${lang.toUpperCase()}`, titles.join('|') === expected.join('|'), titles.join(' / '));
}

// ---------- CONTACT (COMMS): links, and no language choice any more ----------
{
  const { context, page, errors } = await open('es', DESKTOP, '#contact');
  const links = await page.locator('dialog a').evaluateAll((as) => as.map((a) => [a.getAttribute('href'), a.getAttribute('target'), a.getAttribute('rel')]));
  const hrefs = links.map(([href]) => href);
  check(
    'contact links point to GitHub, LinkedIn, email and the CV PDF (the CV is the PDF)',
    hrefs.join(' ') === 'https://github.com/yeraox https://www.linkedin.com/in/yeraycaturla mailto:yeraoxcaturlax@gmail.com /cv/yeray-caturla-cv-es.pdf',
    hrefs.join(' '),
  );
  check(
    'web links open in a new tab safely; email does not',
    links[0][1] === '_blank' && links[0][2] === 'noopener noreferrer' && links[2][1] === null,
  );
  check('the page starts in Spanish for a Spanish browser', (await page.evaluate(() => document.documentElement.lang)) === 'es');
  // The language is the ring's flag and the title's ES/EN (check:camp, check:title).
  check('CONTACT has no language choice any more', (await page.getByRole('dialog').getByRole('radio').count()) === 0);
  check('no console errors in CONTACT', errors.length === 0, errors.join(' | '));
  await context.close();
}

// ---------- PROJECTS (ALCHEMY): tabs and video ----------
{
  const { context, page, errors } = await open('es', DESKTOP, '#projects');
  await page.waitForTimeout(1200);
  const tabs = page.getByRole('tab');
  check('PROJECTS lists the three projects', (await tabs.count()) === 3);
  check('Capyroad is chosen first', (await tabs.first().getAttribute('aria-selected')) === 'true');
  const video = page.locator('dialog video');
  const state = await video.evaluate((v) => ({ muted: v.muted, loop: v.loop, autoplay: v.autoplay, paused: v.paused, src: v.currentSrc }));
  check('the Capyroad video plays muted and in a loop', state.muted && state.loop && state.autoplay && !state.paused, JSON.stringify(state));
  await tabs.first().focus();
  await page.keyboard.press('ArrowDown');
  check('↓ chooses the next project', (await tabs.nth(1).getAttribute('aria-selected')) === 'true');
  check("…and shows Pakito's Gambling", (await page.getByRole('tabpanel').locator('h3').innerText()).startsWith("Pakito's Gambling"));
  await page.keyboard.press('End');
  const panel = await page.getByRole('tabpanel').innerText();
  check('End reaches Bosa Digital, marked CLASIFICADO', panel.includes('CLASIFICADO'));
  check('Bosa shows no images or video', (await page.getByRole('tabpanel').locator('img, video').count()) === 0);
  check('no console errors in PROJECTS', errors.length === 0, errors.join(' | '));
  await context.close();
}
{
  const { context, page } = await open('es', DESKTOP, '#projects', { reducedMotion: 'reduce' });
  await page.waitForTimeout(800);
  const state = await page.locator('dialog video').evaluate((v) => ({ autoplay: v.autoplay, controls: v.controls, paused: v.paused }));
  check('with reduced motion the video waits, with controls', !state.autoplay && state.controls && state.paused, JSON.stringify(state));
  await context.close();
}

// ---------- Sections: the wheel and the swipe ----------
{
  const { context, page, errors } = await open('es', DESKTOP, '#stack');
  await page.waitForTimeout(800);
  const selected = () => page.getByRole('tab', { selected: true }).innerText();
  const panel = page.getByRole('tabpanel');
  const box = await panel.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(0, 120);
  await page.waitForTimeout(300);
  check('STACK: the wheel down goes to the next section', (await selected()).includes('He trabajado con'));
  await page.mouse.wheel(0, -120);
  await page.waitForTimeout(300);
  check('…and the wheel up comes back', (await selected()).includes('Dominio'));
  // One long spin (many events with no pause) changes one section only.
  for (let i = 0; i < 8; i++) await page.mouse.wheel(0, 100);
  await page.waitForTimeout(300);
  check('one spin changes one section only', (await selected()).includes('He trabajado con'));
  check('no console errors in STACK', errors.length === 0, errors.join(' | '));
  await context.close();
}
{
  const { context, page } = await open('es', DESKTOP, '#projects');
  await page.waitForTimeout(1200);
  const panel = page.getByRole('tabpanel');
  const box = await panel.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  let scrolledFirst = false;
  let reached = false;
  for (let i = 0; i < 20 && !reached; i++) {
    await page.mouse.wheel(0, 150);
    await page.waitForTimeout(350);
    const tab = await page.getByRole('tab', { selected: true }).innerText();
    if (tab.startsWith('Capyroad') && (await panel.evaluate((el) => el.scrollTop)) > 0) scrolledFirst = true;
    reached = tab.startsWith("Pakito's");
  }
  check('PROJECTS: the wheel reads Capyroad to its end first', scrolledFirst);
  check("…then moves on to Pakito's Gambling", reached);
  check('the new section starts at its top', (await panel.evaluate((el) => el.scrollTop)) === 0);
  await context.close();
}
{
  const { context, page } = await open('es', PHONE, '#profile');
  await page.waitForTimeout(800);
  const box = await page.getByRole('tabpanel').boundingBox();
  const cdp = await context.newCDPSession(page);
  const y = box.y + 60;
  const touch = (type, x) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
  await touch('touchStart', box.x + box.width * 0.8);
  for (let step = 1; step <= 6; step++) await touch('touchMove', box.x + box.width * (0.8 - step * 0.1));
  await touch('touchEnd');
  await page.waitForTimeout(300);
  check('PROFILE on a phone: a swipe to the left shows the next section', (await page.getByRole('tab', { selected: true }).innerText()).includes('Formación'));
  await context.close();
}

// ---------- Nothing heavy before a window opens ----------
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'es-ES' });
  const page = await context.newPage();
  // Real downloads of pictures and video (not the dev server's "?import" module requests).
  const media = [];
  page.on('request', (request) => {
    const type = request.resourceType();
    if ((type === 'media' || type === 'image') && /capyroad|pakitos/.test(request.url())) media.push(request.url());
  });
  await page.goto(`${url}#camp`, { waitUntil: 'networkidle' }); // #camp: straight past the title
  await page.waitForTimeout(500);
  check('the camp does not download the video or screenshots', media.length === 0, media.join(' '));
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1500);
  check('opening PROJECTS downloads them', media.some((r) => /\.(mp4|webm)/.test(r)), `${media.length} files`);
  await context.close();
}

await browser.close();
done();
