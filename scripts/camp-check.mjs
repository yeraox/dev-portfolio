// Walkthrough of the camp, the way a visitor uses it: keyboard only on a laptop and touch only on a
// phone; every ring slot's name always visible and on top of nothing (3 sizes × 2 languages); the
// HUD's experience, the idle actions, the CV slot's question and SETTINGS. Prints ✓/✗ per
// check and saves screenshots in .screenshots/camp/ (git-ignored).
// Usage: npm run check:camp -- [url]   (default http://localhost:5173/)
import { mkdirSync } from 'node:fs';
import { SIZES, chromium, createChecks, newPage, siteUrl } from './lib/browser.mjs';

// The title screen comes first; any #hash skips it and goes straight to the camp.
const url = `${siteUrl()}#camp`;
const { check, done } = createChecks();

const OUT = '.screenshots/camp';
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const activeLabel = (page) => page.locator('[role="menuitem"][data-active="true"]').getAttribute('aria-label');
const focusIsActiveItem = (page) =>
  page.evaluate(() => document.activeElement?.getAttribute('data-active') === 'true');

// ---------- Keyboard only (1440×900) ----------
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
  await page.goto(url, { waitUntil: 'networkidle' });

  const count = await page.getByRole('menuitem').count();
  check('the ring shows its 7 slots', count === 7, `${count}`);
  check('the menu has an accessible name', (await page.getByRole('menu').getAttribute('aria-label')) !== null);

  const first = await activeLabel(page);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(250);
  const second = await activeLabel(page);
  check('→ brings the next section to the top', second !== first, `${first} → ${second}`);
  check('focus follows the section at the top', await focusIsActiveItem(page));
  const expectedTitle = second?.split(': ')[1] ?? '—';
  check('the banner names the active section', await page.getByText(expectedTitle, { exact: true }).isVisible(), expectedTitle);
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(250);
  check('← turns back', (await activeLabel(page)) === first);
  await page.screenshot({ path: `${OUT}/ring-keyboard-1440.png` });

  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  const dialog = page.getByRole('dialog');
  check('Enter opens the section window', await dialog.isVisible());
  const title = await dialog.getByRole('heading', { level: 2 }).textContent();
  check('the window is named after its section', first?.endsWith(title ?? '—') ?? false, title ?? '');
  await page.screenshot({ path: `${OUT}/window-1440.png` });

  // The rest of the page is inert while the window is open: Tab goes through the window and, like
  // any native modal, may reach the browser's own toolbar (focus on <body>), never the page behind.
  let inside = true;
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab');
    inside &&= await page.evaluate(() => {
      const focused = document.activeElement;
      return !focused || focused === document.body || Boolean(focused.closest('dialog'));
    });
  }
  check('Tab never reaches the page behind the open window', inside);
  await page.keyboard.press('ArrowRight'); // must not turn the ring behind the window
  await page.keyboard.press('Escape');
  await page.waitForTimeout(450);
  check('Esc closes the window', (await dialog.count()) === 0);
  check('the ring did not move while the window was open', (await activeLabel(page)) === first);
  check('focus goes back to the ring', await focusIsActiveItem(page));

  check('no console errors', errors.length === 0, errors.join(' | '));
  await page.close();
}

// ---------- Touch only (phone 390×844) ----------
{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  const before = await activeLabel(page);

  const box = await page.locator('main canvas').first().boundingBox();
  const cdp = await context.newCDPSession(page);
  const y = box.y + box.height * 0.85;
  const touch = (type, x) =>
    cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
  await touch('touchStart', box.x + box.width * 0.75);
  for (let step = 1; step <= 6; step++) await touch('touchMove', box.x + box.width * (0.75 - step * 0.08));
  await touch('touchEnd');
  await page.waitForTimeout(300);
  const after = await activeLabel(page);
  check('a swipe to the left turns the ring', after !== before, `${before} → ${after}`);
  check('the swipe did not open a window', (await page.getByRole('dialog').count()) === 0);

  const target = page.locator('[role="menuitem"]:not([data-active="true"])').first();
  const tapped = await target.getAttribute('aria-label');
  await target.tap();
  await page.waitForTimeout(450);
  const dialog = page.getByRole('dialog');
  check('tapping a section opens it', await dialog.isVisible(), tapped ?? '');
  await page.screenshot({ path: `${OUT}/window-390.png` });
  await dialog.getByRole('button').tap();
  await page.waitForTimeout(450);
  check('the close button closes it', (await dialog.count()) === 0);
  check('the tapped section is now at the top', (await activeLabel(page)) === tapped);
  await context.close();
}

// ---------- the ring's names, always visible and on top of nothing ----------
// Yeray and Null in scene px (CAMP in src/scenes/camp/campLayout.ts and their image sizes). The
// names and icons must not cover them. Null sits in a narrow shape — ears wide, body narrower,
// paws narrower still — so he is three boxes that follow his real pixels (null-sit.png), not one
// rectangle whose empty corners would count as Null.
const CHARACTERS = [
  { who: 'Yeray', x0: 297, y0: 200, x1: 343, y1: 311 },
  { who: 'Null', x0: 362, y0: 266, x1: 390, y1: 276 }, // ears
  { who: 'Null', x0: 363, y0: 276, x1: 389, y1: 310.5 }, // body
  { who: 'Null', x0: 367, y0: 310.5, x1: 384, y1: 312 }, // paws
];
const overlap = (a, b) => a.x < b.x + b.width - 0.5 && b.x < a.x + a.width - 0.5 && a.y < b.y + b.height - 0.5 && b.y < a.y + a.height - 0.5;
const inside = (a, b) => a.x >= b.x - 0.5 && a.y >= b.y - 0.5 && a.x + a.width <= b.x + b.width + 0.5 && a.y + a.height <= b.y + b.height + 0.5;

for (const size of SIZES) {
  for (const locale of ['es', 'en']) {
    const { context, page } = await newPage(browser, size, locale);
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.getByRole('menu').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    // The ring can stop with any slot at the top, and each stop puts every name in another place:
    // check them all, turning one slot at a time (with →, as a visitor would).
    const stops = await page.getByRole('menuitem').count();
    for (let stop = 0; stop < stops; stop++) {
      if (stop > 0) {
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(250); // 8 frames
      }
      const where = `${size.width}, ${locale}, stop ${stop + 1}/${stops}`;
      const { stage, slots, hud } = await page.evaluate(() => {
        const box = (element) => {
          const r = element.getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width, height: r.height };
        };
        return {
          stage: box(document.querySelector('canvas').parentElement),
          hud: [...document.querySelectorAll('figure')].map(box),
          slots: [...document.querySelectorAll('[role="menuitem"]')].map((button) => {
            const name = button.querySelector('span');
            return { label: button.getAttribute('aria-label'), icon: box(button), name: name ? box(name) : null, text: name?.textContent ?? '' };
          }),
        };
      });
      // The scene → CSS px: portrait screens show the middle 360 scene px (stage.ts).
      const tall = size.width < size.height;
      const scale = stage.width / (tall ? 360 : 640);
      const cameraX = tall ? 140 : 0;
      const people = CHARACTERS.map((c) => ({ who: c.who, x: stage.x + (c.x0 - cameraX) * scale, y: stage.y + c.y0 * scale, width: (c.x1 - c.x0) * scale, height: (c.y1 - c.y0) * scale }));
      const names = slots.map((slot) => slot.name);
      // Drafts (none today) would add slots while developing: the layout is checked on the live
      // ring of 7. Run this against `npx vite preview` to be sure.
      const draftRing = slots.length !== 7;
      if (stop === 0) check(`${where}: every slot shows its name`, names.every((name) => name && name.width > 0) && slots.every((slot) => slot.label.startsWith(slot.text)), slots.map((slot) => slot.text).join(' · '));
      const clashes = [];
      slots.forEach((a, i) => {
        if (!a.name) return;
        slots.forEach((b, j) => {
          if (j > i && b.name && overlap(a.name, b.name)) clashes.push(`${a.text}/${b.text}`);
          if (overlap(a.name, b.icon)) clashes.push(`${a.text}/icon ${b.text}`);
        });
        for (const person of people) if (overlap(a.name, person) || overlap(a.icon, person)) clashes.push(`${a.text}/${person.who}`);
        for (const panel of hud) if (overlap(a.name, panel) || overlap(a.icon, panel)) clashes.push(`${a.text}/HUD`);
        if (!inside(a.name, stage) || !inside(a.icon, stage)) clashes.push(`${a.text} outside the scene`);
      });
      if (draftRing) console.log(`– ${where}: ${slots.length} slots (a draft?): layout not checked — run against the build (npx vite preview)${clashes.length ? `; touching: ${clashes.join(', ')}` : ''}`);
      else check(`${where}: no name covers another name, an icon, Yeray, Null or the HUD, and all stay in the scene`, clashes.length === 0, clashes.join(', '));
      if (stop === 0) await page.screenshot({ path: `${OUT}/ring-${locale}-${size.width}.png` });
    }
    await context.close();
  }
}

// ---------- the HUD's bars; experience grows as the visitor explores ----------
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'es-ES' });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.getByRole('menu').waitFor();
  const xp = () => page.locator('[role="meter"]').getAttribute('aria-valuenow');
  const bars = await page.locator('figure').evaluateAll((figures) => figures.map((f) => f.textContent));
  check('HUD: each portrait has its name, HP and XP', bars.length === 2 && bars.every((text) => text.includes('HP') && text.includes('XP')), bars.join(' | '));
  check('a first visit starts with no experience', (await xp()) === '0');
  check('a screen reader hears the experience in words', (await page.locator('[role="meter"]').getAttribute('aria-valuetext')) === 'Experiencia: 0 de 5 secciones exploradas');
  for (const [step, expected] of [['ArrowRight', '20'], ['ArrowRight', '40']]) {
    await page.keyboard.press(step);
    await page.waitForTimeout(250);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(450);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(450);
    check(`opening a new section fills a fifth more (${expected} %)`, (await xp()) === expected, await xp());
  }
  await page.keyboard.press('Enter'); // the same section again
  await page.waitForTimeout(450);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(450);
  check('the same section twice counts once', (await xp()) === '40');
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('menu').waitFor();
  check('the experience is remembered after reloading', (await xp()) === '40');
  await page.screenshot({ path: `${OUT}/hud-xp-1440.png` });
  await context.close();
}

// ---------- idle actions ----------
// Every 3–6 s one of the two plays an idle action, whatever the visitor is doing; in rounds where
// each of the six plays once and the two take turns.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'es-ES' });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.getByRole('menu').waitFor();
  const idle = () => page.locator('main canvas').getAttribute('data-idle');
  const playing = () => page.waitForFunction(() => document.querySelector('main canvas')?.getAttribute('data-idle'), null, { timeout: 15000 }).then(() => true).catch(() => false);
  const started = Date.now();
  await playing();
  const first = await idle();
  const waited = (Date.now() - started) / 1000;
  // 3–6 s, plus the first download of the action's drawings (slower on the dev server).
  check('a character plays an idle action after 3–6 s', Boolean(first) && waited >= 2.5 && waited <= 10, `${first} after ${waited.toFixed(1)} s`);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(100);
  check('turning the ring does not stop it', (await idle()) === first);
  // Keep turning the ring for 17 s: the actions go on. (Two new ones start within ~15 s even at
  // the slowest: the rest of this one, 6 s, an action of 1.6 s, 6 s; plus their downloads.)
  const seen = [];
  let last = await idle();
  for (const until = Date.now() + 17000; Date.now() < until; ) {
    await page.keyboard.press('ArrowRight');
    for (let i = 0; i < 10; i++) {
      const now = await idle();
      if (now && now !== last) seen.push(now);
      last = now;
      await page.waitForTimeout(50);
    }
  }
  check('while the visitor turns the ring, they keep playing actions', seen.length >= 2, seen.join(', '));
  await page.keyboard.press('Enter');
  await page.waitForTimeout(8000);
  check('no idle action while a window is open', !(await idle()));
  await context.close();
}
{
  // The waits shortened (3–6 s → 0.15 s) to watch whole rounds.
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'es-ES' });
  await context.addInitScript(() => {
    const real = window.setTimeout;
    window.setTimeout = (fn, ms, ...args) => real(fn, ms >= 3000 && ms <= 6000 ? 150 : ms, ...args);
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.getByRole('menu').waitFor();
  const order = [];
  let last = '';
  for (const until = Date.now() + 40000; Date.now() < until && order.length < 12; ) {
    const now = (await page.locator('main canvas').getAttribute('data-idle')) ?? '';
    if (now && now !== last) order.push(now);
    last = now;
    await page.waitForTimeout(25);
  }
  const rounds = [order.slice(0, 6), order.slice(6, 12)];
  const whole = rounds.every((round) => new Set(round).size === 6);
  check('every action plays once a round (two rounds watched)', whole, rounds.map((r) => r.join(' ')).join(' / '));
  const turns = order.every((name, i) => i === 0 || name.split(':')[0] !== order[i - 1].split(':')[0]);
  check('Yeray and Null take turns, so no action plays twice in a row', turns && order.length === 12);
  await context.close();
}
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'es-ES', reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.getByRole('menu').waitFor();
  await page.waitForTimeout(9000);
  check('reduced motion: no idle actions', !(await page.locator('main canvas').getAttribute('data-idle')));
  await context.close();
}

// ---------- the CV slot asks before downloading; the gear opens SETTINGS ----------
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'es-ES' });
  const page = await context.newPage();
  const downloads = [];
  page.on('download', (download) => downloads.push(download.suggestedFilename()));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.getByRole('menu').waitFor();
  const banner = (text) => page.getByText(text, { exact: true }).isVisible();
  const slot = (name) => page.getByRole('menuitem', { name: new RegExp(`^${name}:`) });
  const dialog = page.getByRole('dialog');

  // From the first slot, ← twice reaches the CV (the CV and the gear close the ring).
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(200);
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(250);
  check('CV slot: the banner says what it does', await banner('Pergamino — Descargar CV'));
  check('CV slot: a screen reader hears "CV: Pergamino — Descargar CV" and that it opens a window', (await slot('CV').getAttribute('aria-haspopup')) === 'dialog');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(450);
  check('Enter on the CV asks first: "¿Descargar el CV en PDF?"', (await dialog.getByRole('heading', { name: '¿Descargar el CV en PDF?' }).isVisible()) && (await dialog.getByText('PDF · español · 3,1 MB').isVisible()));
  await page.screenshot({ path: `${OUT}/cv-question-1440.png` });
  const described = await page.evaluate(() => {
    const id = document.querySelector('dialog')?.getAttribute('aria-describedby');
    return id ? document.getElementById(id)?.textContent : null;
  });
  check('…and a screen reader hears which file it is with the question', described === 'PDF · español · 3,1 MB', described ?? 'none');
  const focused = () => page.evaluate(() => document.activeElement?.textContent ?? '');
  check('…with SÍ focused, a link to the Spanish PDF that downloads', (await focused()) === 'SÍ' && (await dialog.getByRole('link', { name: 'SÍ' }).getAttribute('href')) === '/cv/yeray-caturla-cv-es.pdf');
  await page.keyboard.press('ArrowRight');
  check('→ moves to NO', (await focused()) === 'NO');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(450);
  check('NO closes it without downloading anything', (await dialog.count()) === 0 && downloads.length === 0);
  check('…and the focus is back on the CV slot', await page.evaluate(() => document.activeElement?.getAttribute('aria-label')?.startsWith('CV:') ?? false));
  await page.keyboard.press('Enter');
  await page.waitForTimeout(450);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(450);
  check('Esc closes it without downloading anything', (await dialog.count()) === 0 && downloads.length === 0);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(450);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(800);
  check('SÍ downloads the Spanish PDF and closes the window', downloads.join() === 'yeray-caturla-cv-es.pdf' && (await dialog.count()) === 0, downloads.join());
  check('the address never shows #cv', !page.url().includes('#cv'));

  // SETTINGS, right after the CV: the gear opens the language and the animations.
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(250);
  const gear = () => slot('(AJUSTES|SETTINGS)').locator('img').getAttribute('src');
  check('SETTINGS slot: the gear, and the banner says what it is', /\/settings(-[\w-]+)?\.png/.test((await gear()) ?? '') && (await banner('Engranaje — Ajustes')), (await gear()) ?? '');
  check('SETTINGS slot: it opens a window', (await slot('AJUSTES').getAttribute('aria-haspopup')) === 'dialog');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(450);
  const choice = (name) => dialog.getByRole('button', { name, exact: true });
  const pressed = async (name) => (await choice(name).getAttribute('aria-pressed')) === 'true';
  check('Enter opens SETTINGS, starting on the language in use', (await dialog.getByRole('heading', { name: 'Ajustes' }).isVisible()) && (await focused()) === 'Español' && (await pressed('Español')));
  check('…with animations on', (await pressed('SÍ')) && (await page.evaluate(() => document.documentElement.dataset.motion)) === 'on');
  const note = dialog.locator('[aria-live="polite"]');
  const noteColour = await note.evaluate((element) => getComputedStyle(element).color);
  check('a red note says what the animations do (red-2), and it is the row\'s description', (await note.innerText()).startsWith('Con animaciones:') && noteColour === 'rgb(255, 107, 91)' && (await dialog.getByRole('group', { name: 'Animaciones' }).getAttribute('aria-describedby')) === (await note.getAttribute('id')), noteColour);
  check('SETTINGS in the camp offers VOLVER AL TÍTULO', await dialog.getByRole('button', { name: 'VOLVER AL TÍTULO' }).isVisible());
  check('…and says what the site keeps: no cookies, anonymous visits with Cloudflare Web Analytics', (await dialog.getByText(/no usa cookies\. Cuenta las visitas de forma anónima con Cloudflare Web Analytics/).count()) === 1);
  await page.screenshot({ path: `${OUT}/settings-1440.png` });
  await choice('English').click();
  await page.waitForTimeout(300);
  check('English: the page, the window and the ring switch at once', (await page.evaluate(() => document.documentElement.lang)) === 'en' && (await dialog.getByRole('heading', { name: 'Settings' }).isVisible()) && (await slot('PROJECTS').count()) === 1 && (await pressed('English')));
  await choice('OFF').click();
  await page.waitForTimeout(200);
  check('Animations OFF: everything that moves by itself stops (<html data-motion="off">)', (await pressed('OFF')) && (await page.evaluate(() => document.documentElement.dataset.motion)) === 'off');
  check('…and the red note now says what stands still', (await note.innerText()).startsWith('Without animations:'));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(450);
  check('Esc closes SETTINGS (at once: no closing wipe without animations), focus back on the gear', (await dialog.count()) === 0 && (await page.evaluate(() => document.activeElement?.getAttribute('aria-label')?.startsWith('SETTINGS:') ?? false)));
  check('the address never shows #settings', !page.url().includes('#settings'));
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(250);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(450);
  check('in English the CV asks in English and links the English PDF', (await dialog.getByRole('heading', { name: 'Download the CV as a PDF?' }).isVisible()) && (await dialog.getByRole('link', { name: 'YES' }).getAttribute('href')) === '/cv/yeray-caturla-cv-en.pdf');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(450);
  await page.waitForTimeout(7500);
  check('with animations off, no idle actions', !(await page.locator('main canvas').getAttribute('data-idle')));
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('menu').waitFor();
  check('language and animations are remembered after reloading', (await page.evaluate(() => [document.documentElement.lang, document.documentElement.dataset.motion].join())) === 'en,off' && (await slot('PROJECTS').count()) === 1);

  // BACK TO TITLE: SETTINGS closes, the camp darkens into the title, and the title starts again.
  await slot('SETTINGS').click();
  await page.waitForTimeout(450);
  await dialog.getByRole('button', { name: 'BACK TO TITLE' }).click();
  await page.waitForTimeout(800);
  const title = page.getByRole('button', { name: 'PRESS START' });
  check('BACK TO TITLE shows the title screen, with no window left open', (await title.isVisible()) && (await dialog.count()) === 0 && (await page.getByRole('menu').count()) === 0);
  check('…and the address has no #hash', new URL(page.url()).hash === '');
  await page.getByRole('button', { name: /^SETTINGS/ }).click();
  await page.waitForTimeout(300);
  check("the title's SETTINGS has no BACK TO TITLE (it already is the title)", (await dialog.isVisible()) && (await dialog.getByRole('button', { name: 'BACK TO TITLE' }).count()) === 0);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  await title.click();
  await page.getByRole('menu').waitFor({ timeout: 5000 });
  check('PRESS START from there goes back to the camp (animations off: no intro)', (await page.getByRole('menu').isVisible()) && (await page.locator('[data-scene="hub"]').count()) === 1);
  await context.close();
}
{
  // A system that asks for less motion: SETTINGS says so and starts on NO; choosing YES wins.
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'es-ES', reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.getByRole('menuitem', { name: /^AJUSTES:/ }).click();
  await page.waitForTimeout(300);
  const dialog = page.getByRole('dialog');
  const pressed = async (name) => (await dialog.getByRole('button', { name, exact: true }).getAttribute('aria-pressed')) === 'true';
  const motion = () => page.evaluate(() => document.documentElement.dataset.motion);
  const note = () => dialog.locator('[aria-live="polite"]').innerText();
  check('system asks for less motion: SETTINGS shows NO and says why', (await pressed('NO')) && (await motion()) === 'off' && (await note()).startsWith('Tu sistema pide menos movimiento. Sin animaciones:'));
  await dialog.getByRole('button', { name: 'SÍ', exact: true }).click();
  await page.waitForTimeout(200);
  check('…choosing SÍ turns them on all the same (the visitor\'s choice wins)', (await pressed('SÍ')) && (await motion()) === 'on' && (await note()).startsWith('Con animaciones:'));
  await context.close();
}
{
  // The same with a finger, on a phone.
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-ES' });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.getByRole('menu').waitFor();
  await page.getByRole('menuitem', { name: /^AJUSTES:/ }).tap();
  await page.waitForTimeout(450);
  await page.getByRole('dialog').getByRole('button', { name: 'English', exact: true }).tap();
  await page.waitForTimeout(300);
  await page.getByRole('dialog').getByRole('button', { name: /^ESC EXIT/ }).tap();
  await page.waitForTimeout(450);
  check('phone: the gear opens SETTINGS, tapping English switches, ESC EXIT closes it', (await page.evaluate(() => document.documentElement.lang)) === 'en' && (await page.getByRole('dialog').count()) === 0);
  await page.getByRole('menuitem', { name: /^CV:/ }).tap();
  await page.waitForTimeout(450);
  const dialog = page.getByRole('dialog');
  check('phone: tapping the CV asks first', await dialog.getByRole('heading', { name: 'Download the CV as a PDF?' }).isVisible());
  await page.screenshot({ path: `${OUT}/cv-question-390.png` });
  await dialog.getByRole('button', { name: 'NO' }).tap();
  await page.waitForTimeout(450);
  check('phone: tapping NO closes it', (await dialog.count()) === 0);
  await context.close();
}

await browser.close();
done();
