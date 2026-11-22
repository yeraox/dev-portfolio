// Phase-4 check of the content windows: every window in both languages at the three sizes (with
// screenshots), plus behaviour: contact links, the project tabs, ← → from anywhere in a window,
// the wheel that only scrolls, the swipe, the video and what is (not) downloaded before a window
// opens. Prints ✓/✗ per check.
// Usage: npm run check:windows -- [url]   (default http://localhost:5173/)
import { mkdirSync } from 'node:fs';
import { DESKTOP, PHONE, SIZES, chromium, createChecks, newPage, siteUrl } from './lib/browser.mjs';

const url = siteUrl();
const OUT = '.screenshots/fase-4';
const SECTIONS = ['projects', 'stack', 'profile', 'about', 'contact'];
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

// ---------- Screenshots: 5 windows × 2 languages × 3 sizes ----------
let screenshotErrors = 0;
const wrapped = []; // windows whose tabs needed a second row
const clipped = []; // windows still clipped once open (their 1u ink outline hidden)
const bodyScrolls = []; // windows whose body scrolls as well as their text (a second scrollbar)
for (const lang of ['es', 'en']) {
  for (const size of SIZES) {
    for (const section of SECTIONS) {
      const { context, page, errors } = await open(lang, size, `#${section}`);
      await page.waitForTimeout(600); // the opening wipe
      await page.screenshot({ path: `${OUT}/${section}-${lang}-${size.width}.png` });
      const { rows, clip, extra } = await page.evaluate(() => {
        // The Window's body: the part between the title and the help line that may scroll.
        const body = [...document.querySelectorAll('dialog section > div')].find((div) => getComputedStyle(div).overflowY === 'auto');
        return {
          rows: new Set([...document.querySelectorAll('[role="tab"]')].map((tab) => Math.round(tab.getBoundingClientRect().top))).size,
          clip: getComputedStyle(document.querySelector('dialog').firstElementChild).clipPath,
          extra: body ? body.scrollHeight - body.clientHeight : 0,
        };
      });
      if (rows > 1) wrapped.push(`${section} ${lang} ${size.width}`);
      if (clip !== 'none') clipped.push(`${section} ${lang} ${size.width}: ${clip}`);
      if (extra > 1) bodyScrolls.push(`${section} ${lang} ${size.width}: +${extra}px`);
      // The whole window, scrolled content included: lift the height limits for this shot.
      await page.addStyleTag({ content: 'dialog, dialog * { max-height: none !important; overflow: visible !important; }' });
      await page.locator('dialog').screenshot({ path: `${OUT}/${section}-${lang}-${size.width}-full.png` });
      // Every section, the hidden ones too (they are in the page for find-in-page).
      const text = (await page.locator('dialog').textContent()) ?? '';
      if (PHONE_NUMBER.test(text)) check(`no phone number in ${section} (${lang})`, false, text.match(PHONE_NUMBER)[0]);
      screenshotErrors += errors.length;
      await context.close();
    }
  }
}
check('30 windows rendered without console errors', screenshotErrors === 0, `${screenshotErrors} errors`);
check('the tabs always fit on one row', wrapped.length === 0, wrapped.join(', '));
check('open windows are not clipped: their ink outline shows', clipped.length === 0, clipped.join(', '));
check('only the text scrolls: no window body has a scrollbar of its own (it left the window blank)', bodyScrolls.length === 0, bodyScrolls.join(', '));

// ---------- Find in the page (Ctrl+F) reaches every section ----------
{
  const { context, page } = await open('es', DESKTOP, '#stack');
  await page.waitForTimeout(600);
  const hidden = await page.evaluate(() => [...document.querySelector('[role="tabpanel"]').children].map((part) => part.getAttribute('hidden')));
  check('the other sections are there, hidden "until found"', hidden.join() === ',until-found', hidden.join());
  // A text-fragment link uses the browser's own find, as Ctrl+F does: "Terraform" is in tab 2.
  await page.evaluate(() => {
    window.location.href = `${window.location.pathname}#stack:~:text=Terraform`;
  });
  await page.waitForTimeout(800);
  const selected = await page.locator('[role="tab"][aria-selected="true"]').innerText();
  check('finding "Terraform" opens its section by itself', selected.includes('He trabajado con'), selected);
  await context.close();
}
check(`screenshots saved in ${OUT}/`, true);


// ---------- Titles in both languages ----------
for (const [lang, expected] of [
  ['es', ['Alquimia — Proyectos', 'Equipo — Stack técnico', 'Estadísticas — Perfil', 'Diario — Sobre mí', 'Configuración — Contacto']],
  ['en', ['Alchemy — Projects', 'Equipment — Tech Stack', 'Stats — Profile', 'Journal — About Me', 'Config — Contact']],
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
  // The language is in SETTINGS, from the ring's gear and the title's (check:camp, check:title).
  check('CONTACT has no language choice any more', (await page.getByRole('dialog').getByRole('radio').count()) === 0);
  check('no console errors in CONTACT', errors.length === 0, errors.join(' | '));
  await context.close();
}

// ---------- PROJECTS (ALCHEMY): tabs and video ----------
{
  const { context, page, errors } = await open('es', DESKTOP, '#projects');
  await page.waitForTimeout(1200);
  const tabs = page.getByRole('tab');
  const heading = () => page.getByRole('tabpanel').locator('h3:visible').innerText();
  const tabTexts = await tabs.allInnerTexts(); // a tab's badge follows its name: "CapyroadDESTACADO"
  const expectedTabs = ['Capyroad', "Pakito's Gambling", 'Portfolio'];
  check("PROJECTS lists three projects: Capyroad, Pakito's Gambling and this portfolio (no Bosa)", tabTexts.length === 3 && expectedTabs.every((name, index) => tabTexts[index].startsWith(name)), tabTexts.join(' · '));
  check('Capyroad is chosen first', (await tabs.first().getAttribute('aria-selected')) === 'true');
  const video = page.locator('dialog video');
  const state = await video.evaluate((v) => ({ muted: v.muted, loop: v.loop, autoplay: v.autoplay, paused: v.paused, src: v.currentSrc }));
  check('the Capyroad video plays muted and in a loop', state.muted && state.loop && state.autoplay && !state.paused, JSON.stringify(state));
  const focus = () =>
    page.evaluate(() => {
      const element = document.activeElement;
      return { tag: element?.tagName, outline: element ? getComputedStyle(element).outlineStyle : '', textTabStop: document.querySelector('[role="tabpanel"]')?.hasAttribute('tabindex') };
    });
  const opened = await focus();
  check('the window opens with the focus on itself, with no outline, and the text is not a Tab stop', opened.tag === 'DIALOG' && opened.outline === 'none' && !opened.textTabStop, JSON.stringify(opened));
  await page.keyboard.press('ArrowRight');
  check("→ from the window shows the next project, Pakito's Gambling", (await heading()).startsWith("Pakito's Gambling"));
  check('…and the focus stays on the window', (await focus()).tag === 'DIALOG');
  const textTop = () => page.getByRole('tabpanel').evaluate((panel) => panel.scrollTop);
  await page.keyboard.press('PageDown');
  await page.keyboard.press('ArrowDown');
  const scrolled = await textTop();
  check('Page Down and ↓ from the window scroll the text, without changing project', scrolled > 0 && (await heading()).startsWith("Pakito's Gambling"), `${scrolled}px`);
  await page.keyboard.press('Home');
  check('Home from the window takes the text back to its top', (await textTop()) === 0);
  await tabs.nth(1).focus();
  await page.keyboard.press('ArrowDown');
  check('↓ on a tab scrolls the text and does not change project', (await tabs.nth(1).getAttribute('aria-selected')) === 'true' && (await textTop()) > 0);
  await page.keyboard.press('End');
  check('End on a tab reaches the last one: this portfolio, YOU ARE HERE', (await page.getByRole('tabpanel').innerText()).includes('ESTÁS AQUÍ'));
  check('…with the focus on its tab', (await page.evaluate(() => document.activeElement?.getAttribute('aria-selected'))) === 'true');
  await page.keyboard.press('ArrowLeft');
  check("← goes back to Pakito's Gambling", (await heading()).startsWith("Pakito's Gambling"));
  // From the close button too: the arrows work wherever the focus is in the window.
  await page.getByRole('dialog').getByRole('button', { name: /EXIT/ }).focus();
  await page.keyboard.press('ArrowRight');
  check('→ with the focus on ESC EXIT also changes project', (await heading()).startsWith('Este portfolio'));
  // Every project tells why it exists right after what it is: summary → Por qué → Qué hice.
  const order = [];
  for (let index = 0; index < 3; index++) {
    await tabs.nth(index).click();
    order.push(
      await page.getByRole('tabpanel').locator('article:visible').evaluate((article) => {
        const headings = [...article.querySelectorAll('h4')];
        const why = headings[0];
        return `${why?.previousElementSibling?.tagName}>${why?.textContent}>${why?.nextElementSibling?.tagName}>${headings[1]?.textContent}`;
      }),
    );
  }
  check('each project has "Por qué" right after its summary, before "Qué hice"', order.every((item) => item === 'P>Por qué>P>Qué hice'), order.join(' | '));
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

// ---------- ABOUT ME: as a developer, and the personal side with its hobbies ----------
{
  const { context, page, errors } = await open('es', DESKTOP, '#about');
  await page.waitForTimeout(800);
  const tabs = await page.getByRole('tab').allInnerTexts();
  check('ABOUT ME has two sections: Desarrollador and Personal', tabs.join() === 'Desarrollador,Personal', tabs.join(' · '));
  check('…the developer one, five paragraphs', (await page.getByRole('tabpanel').locator('p:visible').count()) === 5);
  await page.keyboard.press('ArrowRight');
  const hobbies = await page.getByRole('tabpanel').locator('li:visible').evaluateAll((items) =>
    items.map((item) => `${item.querySelector('h3')?.textContent}:${item.querySelector('[aria-hidden="true"]') ? 'icon' : 'no icon'}`),
  );
  check('the personal one: six hobbies, each with its icon', hobbies.join() === 'Anime:icon,Videojuegos:icon,Gym:icon,Basket:icon,Cocina:icon,Null:icon', hobbies.join(' · '));
  check('no console errors in ABOUT ME', errors.length === 0, errors.join(' | '));
  await context.close();
}

// ---------- Bosa Digital: only in the profile's quest log ----------
{
  const { context, page } = await open('es', DESKTOP, '#profile');
  const text = (await page.locator('dialog').textContent()) ?? '';
  check('Bosa Digital is still in PROFILE (quest log), with its three CV sentences', text.includes('Sistemas de Innovación Bosa Digital SL') && text.includes('Herramientas en Python para automatizar procesos internos del área de ventas.'));
  await context.close();
}

// ---------- Sections: ← →, the wheel (only scrolls) and the swipe ----------
{
  const { context, page, errors } = await open('es', DESKTOP, '#stack');
  await page.waitForTimeout(800);
  const selected = () => page.getByRole('tab', { selected: true }).innerText();
  await page.keyboard.press('ArrowRight');
  check('STACK: → goes to the next section', (await selected()).includes('He trabajado con'));
  await page.keyboard.press('ArrowLeft');
  check('…and ← comes back', (await selected()).includes('Dominio'));
  await page.getByRole('tab', { name: /He trabajado con/ }).click();
  check('a click on a tab opens it', (await selected()).includes('He trabajado con'));
  check('no console errors in STACK', errors.length === 0, errors.join(' | '));
  await context.close();
}
{
  const { context, page } = await open('es', DESKTOP, '#projects');
  await page.waitForTimeout(1200);
  const panel = page.getByRole('tabpanel');
  const box = await panel.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  // Many flicks of the wheel, far past the end of Capyroad: it scrolls, and stays on Capyroad.
  for (let i = 0; i < 20; i++) {
    await page.mouse.wheel(0, 150);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(300);
  const tab = await page.getByRole('tab', { selected: true }).innerText();
  check('PROJECTS: the wheel scrolls Capyroad', (await panel.evaluate((el) => el.scrollTop)) > 0);
  check('…and never changes project, even past its end', tab.startsWith('Capyroad'), tab);
  await page.keyboard.press('ArrowRight');
  check("→ then shows Pakito's Gambling, from its top", (await panel.evaluate((el) => el.scrollTop)) === 0);
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
