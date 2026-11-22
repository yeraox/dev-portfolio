# CLAUDE.md — Yeray Caturla portfolio

A personal portfolio presented as an original 16-bit action-RPG world: title screen → cave intro
→ camp with a ring menu → SNES-style windows with Yeray's real CV content.

## Read first
| File | What it owns |
|---|---|
| `README.md` | The project for visitors of the repository: what it is, how it is built, how to run it |
| `PRODUCT.md` | Audiences, purpose, positioning, evidence on hand (impeccable's product record) |
| `DESIGN.md` | Visual system: scene, palette, type, windows, ring, HUD, motion (impeccable's design record) |
| `CONTENT.md` | All copy, in Spanish (the source of truth). Never invent facts beyond it |
| `docs/proceso.md` | How the site was built, phase by phase, and where it stands |
| `docs/sprites.md` | How the characters, icons and backgrounds are made from Yeray's references |

## Working with Yeray
- **Talk to Yeray in Spanish.** Code, identifiers and code comments in English.
- **Git: never run any git command** (not even read-only or dry runs) unless Yeray explicitly
  asks. He commits himself. At the end of a task, list the changed files and give him the
  commands to run, explained step by step (he is learning git): English Conventional Commits
  (`type(scope): imperative summary`), split into logical commits.
- **Nothing starts without his explicit "empieza".** Answers to plan questions are not a go.
  **Nothing is deleted without his OK** on the list.
- **Work phase by phase.** A plan in Spanish → his go → the work → screenshots at 390/768/1440
  (`npm run shots -- <url> <name>`), performance numbers, a "TypeScript in this phase" section and
  the changed files → STOP for his review. When a phase closes, add a short summary of it to
  `docs/proceso.md` (English).
- `sudo` cannot prompt for a password from Claude Code (not even with `!`): ask Yeray to run sudo
  commands in a separate WSL terminal.

## Content and facts
- **Content is data:** copy lives in `src/content/es.ts` + `en.ts` (typed by `Content` in
  `types.ts`, from `CONTENT.md`); components read it with `useLocale()` and never hardcode
  user-facing text. Change a fact in `CONTENT.md` and both dictionaries together; Yeray reviews
  the English at `/dev/textos`. Draft sections (`status: 'draft'`) are hidden in production.
- **Never fabricate** metrics, dates, levels or claims. The Bosa Digital internship is under NDA:
  only its three CV sentences, in the profile's quest log. The phone number never appears on the
  web (PDF only).
- **Languages:** Spanish and English, no i18n library. First visit: the saved choice, else
  Spanish for a Spanish browser, else English; `<html lang>` follows. Game labels stay English in
  both (PRESS START, SKIP INTRO, ESC EXIT, the key hints, HP, XP); everything else is translated.
- **Project media** (`npm run media`): screenshots and video from `media-src/projects/`; the raw
  video shows the browser's tabs and bookmarks, so it is always cropped to the app.

## Art (details in `docs/sprites.md`)
- **Original art only.** Nothing copied from any existing game (logo, lettering, sprites, fonts,
  music, character names or outfits).
- **Characters are Yeray's references as they are** (`npm run characters` →
  `src/assets/characters/`, poses in `characters.ts`, drawn with `<PixelSprite>` or the camp
  canvas). Never redraw, repaint or resample them; never hand-edit the generated PNGs. Review
  them against the references with real page screenshots at the same scale.
- **The only colour change allowed** on the characters is Yeray's skin, made by the generator
  (`scripts/sprites/skin.mjs`): only skin pixels, by a fixed ramp per tone, with a check that
  nothing else changed.
- **Walk cycles use the "sello"** (`scripts/sprites/walk.mjs`): one head stamped on every frame,
  whole-pixel body bob, mirrored front step. Composing frames is allowed; painting pixels is not.
  Idle actions are laid over the still drawing (`scripts/sprites/idle.mjs`). Keep the
  generators' quality checks passing.
- **Ring icons are Yeray's references too** (`npm run icons`): cut out and reduced to the scene
  grid by averaging (28 px, 1 icon px = 1 scene px), never redrawn, in their own colours. Their
  light 1-scene-px outline is added in CSS.
- **Scene backgrounds are Yeray's images as they are** (`npm run scenes`): only re-encoded, never
  snapped to a grid, repainted or redrawn. Ambient animation may only re-tone the image's own
  pixels (the campfire flicker).
- `references/` is private (git-ignored): never import it from production code. `/dev/*` pages
  exist only behind `import.meta.env.DEV`.

## Code
- Vite + React 19 + TypeScript (`strict`). No CSS frameworks, UI kits, animation libraries or
  game engines.
- **One page:** the game (`index.html`). Its `<head>` tags and its `<noscript>` note (the CV
  PDFs, for browsers without JavaScript) are generated at build time from `src/content` by
  `src/site/html.ts` (Vite plugin in `vite.config.ts`). The CV is the PDF, asked for from the
  title's parchment and the ring's CV slot. `SITE_URL` (env, set at publish time) adds the
  canonical URL, the absolute share image and the sitemap; without it the build warns and leaves
  them out.
- **Folders:** `src/game` (pure logic with tests: screens, camp state machine, ring maths, stage
  layout, scripts, idle director), `src/engine` (game loop, input, motion, screen hooks, character
  drawing), `src/scenes` (title, camp and intro), `src/components`, `src/windows` (one lazily
  loaded window per section), `src/content`, `src/styles`, `src/site` (build-time HTML), `src/dev`.
- One `useGameLoop` (a single `requestAnimationFrame`, paused when the tab is hidden, 30 fps
  fallback on slow devices) and one `useInput` (keyboard, pointer and touch → LEFT, RIGHT,
  CONFIRM, CANCEL).
- **Motion:** animations run only under `<html data-motion="on">` (CSS) or when
  `useReducedMotion()` is false (JS): the visitor's choice in SETTINGS, else the system's
  `prefers-reduced-motion` (`src/engine/motion.ts`). Never a global reset.

## TypeScript (Yeray is learning it with this project)
- Beginner-readable: `type`/`interface`, unions, optional fields, typed props and hooks,
  `Record`, `satisfies`, simple generics only where React needs them.
- No conditional/mapped types; avoid `as` and `any` — explain when unavoidable.
- Let inference work. First time a concept appears, one short `// TS concept — …` comment.
- **Functions:** `function` declarations for everything named at module level, components
  included (`export function X()`, `export default function X()`; never
  `export const X = () => …`), so each file reads top-down with its helpers below. Arrow
  functions only for values passed around inside them: event handlers, callbacks (`.map`,
  listeners) and short local helpers (`const close = () => …`).
- Export only what another file imports.
- When reviewing his TS, explain the compiler error before the fix.

## Styling
- CSS Modules + `src/styles/tokens.css`.
- UI colours come only from the palette (characters, ring icons and scenes keep their
  references' colours): `src/styles/palette.ts` is the source of truth; `tokens.css` mirrors it
  and `palette.test.ts` fails on drift. Add a colour in both, never a raw hex in a component.
- Every text/background combination used must be listed in `CONTRAST_PAIRS`
  (`src/styles/contrast.ts`) and pass its test.
- Pixel rules: no border-radius, no blurred shadows, no smooth gradients (dither or hard bands),
  `image-rendering: pixelated` on scaled pixel art, motion in frame steps.

## Accessibility (non-negotiable)
- Fully usable with keyboard only and with touch only; mouse too. The ring is an ARIA `menu`
  with a visible focus state in the bracket style; windows are native modal dialogs and give the
  focus back to the ring when they close.
- WCAG 2.2 AA contrast for all text. Animations off by choice or by the system, with an instant
  equivalent for every animated change. SKIP INTRO visible from the first frame.
- A recruiter reaches the CV and the contact in seconds: the CV is one step away from the first
  screen.
- Done means: works at 390, 768 and 1440 px with no horizontal scroll and no console errors.

## Performance budget
Measured on every phase that touches the site (`npm run build` sizes, Lighthouse mobile,
`npm run fps`):

| Metric | Budget |
|---|---|
| Initial JS (gzip) | ≤ 100 KB |
| Initial transfer, without video or screenshots | ≤ 300 KB |
| LCP (Lighthouse mobile, slow 4G) | ≤ 2.5 s |
| CLS / INP | < 0.1 / < 200 ms |
| Frame rate | 60 fps on a normal laptop; ≥ 30 fps stable at 4× CPU throttle |
| Lighthouse performance + accessibility (mobile) | ≥ 95 |
| Capyroad video | ≤ 2 MB, not preloaded |

## Commands
First visit: title → cave intro → camp. Any `#hash` skips the title (`/#camp` goes straight to the
camp — the camp, window and fps checks use it; `/#projects`, `/#stack`, `/#profile`, `/#about`,
`/#contact` open that window), and so does a returning visitor (localStorage `visited`);
`/#title` always shows the title (reload after typing it).

| Command | Does |
|---|---|
| `npm run dev` | Dev server on http://localhost:5173 |
| `npm run typecheck` | `tsc -b` over app, node and test configs |
| `npm run lint` | oxlint |
| `npm test` | Vitest: palette, contrast, textures, characters and idle actions, ring icons, STACK icons, state machines, idle director, screens, ring maths, stage layout, intro script, content ES/EN, head and no-JavaScript HTML, CV PDFs, frame-rate fallback |
| `npm run build` | Typecheck + production build (check gzip sizes against the budget) |
| `npm run characters` | Rebuild the character PNGs from `references/grandes/` and `references/portraits/` (walks and idle actions included, Yeray's skin tone; `-- --skin=1\|2\|3\|none` to try another) and run their quality checks (needs ffmpeg) |
| `npm run icons` | The ring icons and flags from `references/icons/*.jpg` into `src/assets/icons/`, with their checks |
| `npm run stack-icons` | The STACK window's 16×16 technology icons (Simple Icons, CC0 dev dependency, plus generic icons) in one atlas, `src/assets/stack/` |
| `npm run hobby-icons` | The ABOUT ME window's six 16×16 hobby icons, drawn in code, in one atlas, `src/assets/about/` |
| `npm run media` | Project screenshots → WebP 640/1280 and the Capyroad video → 14 s MP4 + WebM + poster in `src/assets/projects/` (fails over 2 MB). Restore `capyroad.webm` afterwards if only the screenshots changed: VP9 never re-encodes byte-identical |
| `npm run cv` | Copy Yeray's CV PDFs (Spanish and English) as they are from `references/` to `public/cv/yeray-caturla-cv-{es,en}.pdf` |
| `npm run share -- [url]` | `public/og-image.png` (1200×630 capture of the title), favicon and apple-touch-icon (Yeray's in-game face, ×1 and ×3) and this portfolio's own picture, `media-src/projects/portfolio.png` (then `npm run media`). Run it against `npx vite preview` (port 4173, the default) |
| `npm run scenes` | Re-encode the camp background (`references/grandes/campamento.jpg`) as WebP into `src/assets/scenes/`, as it is, and report its pixel grid (needs ffmpeg) |
| `npm run shots -- <url> <name>` | Playwright screenshots at 390/768/1440 (phone and tablet as touch devices) into `.screenshots/` + overflow and console-error check |
| `npm run check:camp -- [url]` | Camp walkthrough: keyboard only (1440) and touch only (phone); the ring's names on top of nothing (nor Null's real outline) at 390/768/1440 in ES/EN, in all seven stops of the ring; the CV question (YES downloads, NO/Esc don't); SETTINGS (language, animations with the red note, the system's reduced motion and a choice that wins over it, remembered, the privacy line, BACK TO TITLE); the HUD's XP; the idle actions (`data-idle` on the canvas). Screenshots in `.screenshots/camp/` |
| `npm run check:title -- [url]` | Title screen in ES/EN at 390/768/1440: what starts it (key, click, tap, SKIP INTRO) and what doesn't (Tab, the SETTINGS gear and its window, the CV), the dithered transition, camp preloading, reduced motion; the CV parchment and its question, head tags, icons, both PDFs and the no-JavaScript note. Screenshots in `.screenshots/title/` |
| `npm run check:intro -- [url]` | Cave intro at 390/768/1440: 4–6 s long, SKIP at any moment (button, Escape, any key, click, tap), returning visitors, `/#title`, reduced motion, hidden-tab pause. Screenshots in `.screenshots/intro/` |
| `npm run check:windows -- [url]` | The 5 content windows in ES/EN at 390/768/1440: tabs on one row, windows unclipped, only the text scrolls, find-in-page across sections, links, the projects and their "why", ← → and the reading keys from anywhere (focus on the window, no outline), the wheel that only scrolls, the swipe, ABOUT ME's sections and hobbies, Bosa only in PROFILE, video, lazy downloads. Screenshots in `.screenshots/windows/` |
| `npm run fps -- [url]` | Frames per second while the ring turns and during the intro, CPU ×1 and ×4, plus the slowest answer to a key or click |

Run the `check:*` scripts, `fps` and `share` against `npx vite preview` (port 4173): the build is
what goes live.

**Lighthouse** (one-off, not a dependency): run it from the scratchpad, never from the repo — on
WSL it leaves a throwaway Chromium profile in the current folder, named like
`C:\Users\…\AppData\Local\lighthouse.XXXX` (ignored by `.gitignore` as `C:*`, but delete any you see):
`cd <scratchpad> && CHROME_PATH=~/.cache/ms-playwright/chromium-1254/chrome-linux64/chrome npx -y lighthouse@12.8.2 <url> --chrome-flags="--headless=new --no-sandbox"`

## Skills (`.agents/skills/`, linked into `.claude/skills/`)
- `impeccable` — the primary design skill (mode: Experience): `audit`, `polish`, and `document`
  to refresh `DESIGN.md` and `.impeccable/design.json` when the design changes.
- `emil-design-eng` — interaction feel, translated to stepped, frame-based motion.
- `vercel-react-best-practices` — client-side rules only.
- `modern-web-guidance` (Google Chrome) — modern HTML/CSS/client-side JS practices:
  accessibility, performance (LCP/INP/CLS), CSS, dialogs, security. Its guides are bundled in
  `.agents/skills/modern-web-guidance/guides/`: read them there; do not run its
  `npx modern-web-guidance@latest` CLI unless Yeray asks.
- Do NOT use `design-taste-frontend` (its corporate-site rules contradict this game world).
