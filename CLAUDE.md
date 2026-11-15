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
- **Walk cycles use the approved "sello"** (`scripts/sprites/walk.mjs`, `docs/animacion-caminar.md`):
  one head stamped on every frame, whole-pixel body bob, mirrored front step. Composing frames
  this way is allowed; painting pixels is not. Keep the generator's quality checks passing.
- **Scene backgrounds are Yeray's generated images as they are** (`npm run scenes`): only
  re-encoded, never snapped to a grid (it blurred their half-pixel details), repainted or
  redrawn. Ambient animation may only re-tone the image's own pixels (the campfire flicker).
- `references/` is private (git-ignored): never import it from production code. `/dev/*`
  pages exist only behind `import.meta.env.DEV`.

## TypeScript (Yeray is learning it with this project)
- Beginner-readable: `type`/`interface`, unions, optional fields, typed props and hooks,
  `Record`, `satisfies`, simple generics only where React needs them.
- No conditional/mapped types; avoid `as` and `any` — explain when unavoidable.
- Let inference work. First time a concept appears, one short `// TS concept — …` comment.
- When reviewing his TS, explain the compiler error before the fix.

## Styling
- CSS Modules + `src/styles/tokens.css`. No CSS frameworks, UI kits, animation libs or engines.
- UI colors come only from the palette (characters keep their references' colours): `src/styles/palette.ts` is the source of truth;
  `tokens.css` mirrors it and `palette.test.ts` fails on drift. Add a color in both, never a
  raw hex in a component.
- Every text/background combination used must be listed in `CONTRAST_PAIRS`
  (`src/styles/contrast.ts`) and pass its test.
- Pixel rules: no border-radius, no blurred shadows, no smooth gradients (dither or hard
  bands), `image-rendering: pixelated` on scaled pixel art, motion in frame steps.

## Commands
First visit: title → cave intro → camp. Any `#hash` skips the title (`/#camp` goes straight to the
camp — the camp, window and fps checks use it), and so does a returning visitor (localStorage
`visited`); `/#title` always shows the title (reload after typing it).

| Command | Does |
|---|---|
| `npm run dev` | Dev server on http://localhost:5173 |
| `npm run typecheck` | `tsc -b` over app, node and test configs |
| `npm run lint` | oxlint |
| `npm test` | Vitest (palette, contrast, textures, characters, state machine, ring maths, stage layout, content ES/EN) |
| `npm run build` | Typecheck + production build (check gzip sizes against the budget) |
| `npm run characters` | Rebuild the character PNGs from `references/grandes/` on their native pixel grid, walk cycles included, and run their quality checks (needs ffmpeg) |
| `npm run media` | Project screenshots → WebP 640/1280 and the Capyroad video → 14 s MP4 + WebM + poster in `src/assets/projects/` (fails over 2 MB) |
| `npm run scenes` | Re-encode Yeray's scene backgrounds (`references/grandes/campamento.jpg`) as WebP into `src/assets/scenes/`, as they are, and report their pixel grid (needs ffmpeg) |
| `npm run shots -- <url> <name>` | Playwright screenshots at 390/768/1440 (phone and tablet as touch devices) into `.screenshots/` + overflow and console-error check |
| `npm run check:camp -- [url]` | Camp walkthrough: keyboard only (1440) and touch only (phone), ✓/✗ per check + screenshots |
| `npm run check:title -- [url]` | Title screen in ES/EN at 390/768/1440 (`.screenshots/fase-5/`) + what starts it (key, click, tap, SKIP INTRO) and what doesn't (Tab, ES/EN), the dithered transition, camp preloading, reduced motion |
| `npm run check:intro -- [url]` | Cave intro: screenshots at 390/768/1440 (`.screenshots/fase-6/`), 4–6 s long, SKIP at any moment (button, Escape, any key, click, tap), returning visitors, `/#title`, reduced motion, hidden-tab pause |
| `npm run check:windows -- [url]` | The 4 content windows in ES/EN at 390/768/1440 (screenshots in `.screenshots/fase-4/`) + links, language switch, EQUIP tabs, video, lazy downloads |
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
- Do NOT use `design-taste-frontend` (corporate-site rules contradict this brief).
