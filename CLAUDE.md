# CLAUDE.md — Yeray Caturla portfolio

A personal portfolio presented as an original 16-bit action-RPG world (title screen → cave
intro → camp hub with a ring menu → SNES-style windows with real CV content).

## Read first
| File | What it owns |
|---|---|
| `BRIEF.md` | Full build brief: creative direction, sprites, stack rules, accessibility, i18n, performance budget, phases |
| `PRODUCT.md` | Audiences, purpose, positioning, evidence on hand (impeccable product record) |
| `DESIGN.md` | Visual system: resolution, palette, type, window/ring/HUD specs, motion |
| `CONTENT.md` | All copy (Spanish source of truth). Never invent facts beyond it |
| `docs/plan-de-fases.md` | Human-readable phase plan Yeray reviews and comments on (Spanish) |

## Hard rules
- **Git: never run any git command** (init, add, commit, push, branch…) unless Yeray explicitly
  asks. He commits after each approved phase. At the end of a phase, list the changed files.
- **Work phase by phase** (`docs/plan-de-fases.md`). After each phase: screenshots at
  390/768/1440 (`npm run shots -- <url> <name>`), performance numbers (from phase 3), a
  "TypeScript in this phase" section, the changed-files list — then STOP for approval.
- **Phase report:** at the end of every phase write `docs/informes/fase-N-<slug>.md` in Spanish
  (same structure as `fase-0-cimientos.md`): decisions, step-by-step work, verification,
  TypeScript concepts, problems, observations, files for his commit, next phase.
  Always include the recommended `git add` + `git commit` commands for him to run: English,
  Conventional Commits (`type(scope): imperative summary`), split into logical commits.
- `sudo` cannot prompt for a password from Claude Code (not even with `!`): ask Yeray to run
  sudo commands in a separate WSL terminal.
- **Talk to Yeray in Spanish.** Code, identifiers and code comments in English.
- **Content is data:** copy lives in `src/content/es.ts` + `en.ts` (typed by `Content` in
  `types.ts`, from `CONTENT.md`); components read it with `useLocale()` and never hardcode
  user-facing text. Change a fact in CONTENT.md and both dictionaries together; Yeray reviews
  English at `/dev/textos`. Draft sections (`status: 'draft'`) are hidden in production.
- **Project media** (`npm run media`): screenshots/video from `media-src/projects/`; the raw video
  shows the browser's tabs and bookmarks — always crop to the app.
- **Never fabricate** metrics, dates, levels or claims. Bosa Digital internship is under NDA:
  only its three CV sentences. The phone number never appears on the web (PDF only).
- **Original art only.** Nothing copied from any existing game (logo, lettering, sprites,
  fonts, music, character names or outfits).
- **Characters are Yeray's references as they are** (`npm run characters` →
  `src/assets/characters/`, poses in `characters.ts`, drawn with `<PixelSprite>`). Never redraw,
  repaint or resample them; never hand-edit the generated PNGs. Review them against the
  references with real page screenshots at the same scale.
- **Skin tone exception (phase 8):** the only colour change allowed on the characters is Yeray's
  skin, made by the generator (`scripts/sprites/skin.mjs`, `npm run characters -- --skin=N`):
  only skin pixels, by a fixed ramp per tone, with a check that nothing else changed. Never by hand.
- **Ring icons are Yeray's references too** (`npm run icons` → `src/assets/icons/`): cut out of
  their background and reduced to the scene grid by averaging (28 px, 1 icon px = 1 scene px),
  never redrawn; they keep their colours. A light 1-scene-px outline is added in CSS.
- **Walk cycles use the approved "sello"** (`scripts/sprites/walk.mjs`, `docs/animacion-caminar.md`):
  one head stamped on every frame, whole-pixel body bob, mirrored front step. Composing frames
  this way is allowed; painting pixels is not. Keep the generator's quality checks passing.
- **Scene backgrounds are Yeray's generated images as they are** (`npm run scenes`): only
  re-encoded, never snapped to a grid (it blurred their half-pixel details), repainted or
  redrawn. Ambient animation may only re-tone the image's own pixels (the campfire flicker).
- `references/` is private (git-ignored): never import it from production code. `/dev/*`
  pages exist only behind `import.meta.env.DEV`.
- **One page:** the game (`index.html`). Its `<head>` tags and its `<noscript>` note (the CV PDFs,
  for browsers without JavaScript) are generated at build time from `src/content` by
  `src/site/html.ts` (Vite plugin in `vite.config.ts`). The CV web view (`/cv/`) was removed in
  phase 8: the CV is the PDF, asked for from the title's parchment and the ring's CV slot.
  `SITE_URL` (env, set at publish time) adds the canonical URL, the absolute share image and the
  sitemap; without it the build warns and leaves them out.

## TypeScript (Yeray is learning it with this project)
- Beginner-readable: `type`/`interface`, unions, optional fields, typed props and hooks,
  `Record`, `satisfies`, simple generics only where React needs them.
- No conditional/mapped types; avoid `as` and `any` — explain when unavoidable.
- Let inference work. First time a concept appears, one short `// TS concept — …` comment.
- When reviewing his TS, explain the compiler error before the fix.

## Styling
- CSS Modules + `src/styles/tokens.css`. No CSS frameworks, UI kits, animation libs or engines.
- UI colors come only from the palette (characters and ring icons keep their references' colours): `src/styles/palette.ts` is the source of truth;
  `tokens.css` mirrors it and `palette.test.ts` fails on drift. Add a color in both, never a
  raw hex in a component.
- Every text/background combination used must be listed in `CONTRAST_PAIRS`
  (`src/styles/contrast.ts`) and pass its test.
- Pixel rules: no border-radius, no blurred shadows, no smooth gradients (dither or hard
  bands), `image-rendering: pixelated` on scaled pixel art, motion in frame steps.

## Commands
First visit: title → cave intro → camp. Any `#hash` skips the title (`/#camp` goes straight to the
camp — the camp, window and fps checks use it; `/#projects`, `/#stack`, `/#profile`, `/#contact`
open that window), and so does a returning visitor (localStorage
`visited`); `/#title` always shows the title (reload after typing it).

| Command | Does |
|---|---|
| `npm run dev` | Dev server on http://localhost:5173 |
| `npm run typecheck` | `tsc -b` over app, node and test configs |
| `npm run lint` | oxlint |
| `npm test` | Vitest (palette, contrast, textures, characters (idle actions included), ring icons, STACK icons, state machine, idle director, screens, ring maths, stage layout, intro script, content ES/EN, head and no-JavaScript HTML, CV PDFs, frame-rate fallback) |
| `npm run build` | Typecheck + production build (check gzip sizes against the budget) |
| `npm run characters` | Rebuild the character PNGs from `references/grandes/` and `references/portraits/` on their native pixel grid, walk cycles and idle actions (`reposo/`, laid over the still drawing) included, with Yeray's skin tone (`-- --skin=1\|2\|3\|none` to try another), and run their quality checks (needs ffmpeg) |
| `npm run icons` | Cut the ring icons out of `references/icons/*.jpg` and reduce them to the scene grid (28 px) into `src/assets/icons/`, with their checks |
| `npm run stack-icons` | The STACK window's 16×16 technology icons: Simple Icons logos (CC0 dev dependency) without smoothing in the `text` colour, plus generic pixel icons for those without one, in one atlas `src/assets/stack/` |
| `npm run media` | Project screenshots → WebP 640/1280 and the Capyroad video → 14 s MP4 + WebM + poster in `src/assets/projects/` (fails over 2 MB) |
| `npm run cv` | Copy Yeray's CV PDFs (Spanish and English) as they are from `references/` to `public/cv/yeray-caturla-cv-{es,en}.pdf` |
| `npm run share -- [url]` | Share image `public/og-image.png` (1200×630 capture of the title, needs `npm run dev`) + favicon and apple-touch-icon from Yeray's face as it is (his in-game front drawing: head and collar, ×1 and ×3) |
| `npm run scenes` | Re-encode Yeray's scene backgrounds (`references/grandes/campamento.jpg`) as WebP into `src/assets/scenes/`, as they are, and report their pixel grid (needs ffmpeg) |
| `npm run shots -- <url> <name>` | Playwright screenshots at 390/768/1440 (phone and tablet as touch devices) into `.screenshots/` + overflow and console-error check |
| `npm run check:camp -- [url]` | Camp walkthrough: keyboard only (1440) and touch only (phone); the ring's names on top of nothing at 390/768/1440 in ES/EN (screenshots in `.screenshots/fase-8/`; run it against `npx vite preview`: the dev ring has the ABOUT ME draft); the CV question (YES downloads, NO/Esc don't), the language slot, the HUD's XP and the idle actions (`data-idle` on the canvas) |
| `npm run check:title -- [url]` | Title screen in ES/EN at 390/768/1440 (`.screenshots/fase-5/`) + what starts it (key, click, tap, SKIP INTRO) and what doesn't (Tab, ES/EN, the CV), the dithered transition, camp preloading, reduced motion; the CV parchment and its question (`.screenshots/fase-8/`), head tags, icons, both PDFs and the no-JavaScript note |
| `npm run check:intro -- [url]` | Cave intro: screenshots at 390/768/1440 (`.screenshots/fase-6/`), 4–6 s long, SKIP at any moment (button, Escape, any key, click, tap), returning visitors, `/#title`, reduced motion, hidden-tab pause |
| `npm run check:windows -- [url]` | The 4 content windows in ES/EN at 390/768/1440 (screenshots in `.screenshots/fase-4/`) + links, language switch, project tabs, video, lazy downloads |
| `npm run fps -- [url]` | Frames per second while the ring turns and during the intro, CPU ×1 and ×4, plus the slowest answer to a key/click (run against `npx vite preview`) |

**Lighthouse** (one-off, not a dependency): run it from the scratchpad, never from the repo — on
WSL it leaves a throwaway Chromium profile in the current folder, named like
`C:\Users\…\AppData\Local\lighthouse.XXXX` (ignored by `.gitignore` as `C:*`, but delete any you see):
`cd <scratchpad> && CHROME_PATH=~/.cache/ms-playwright/chromium-1254/chrome-linux64/chrome npx -y lighthouse@12.8.2 <url> --chrome-flags="--headless=new --no-sandbox"`
(against `npx vite preview` on port 4173).

## Skills
- `impeccable` — primary design skill (mode: Experience). `audit` + `polish` in phase 7;
  regenerate `DESIGN.md` from the built world with `document` at the end.
- `emil-design-eng` — interaction feel, translated to stepped frame-based motion.
- `vercel-react-best-practices` — client-side rules only.
- `modern-web-guidance` (Google Chrome) — modern HTML/CSS/client-side JS practices: accessibility,
  performance (LCP/INP/CLS), CSS, dialogs, security. Its guides are bundled in
  `.agents/skills/modern-web-guidance/guides/`: read them there; do not run its
  `npx modern-web-guidance@latest` CLI unless Yeray asks. Used for the phase 9 review.
- Do NOT use `design-taste-frontend` (corporate-site rules contradict this brief).
