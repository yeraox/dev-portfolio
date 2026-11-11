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
- **Content is data:** copy lives in `src/content/` (from `CONTENT.md`); components never
  hardcode user-facing text. Draft sections (`status: 'draft'`) are hidden in production.
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
| Command | Does |
|---|---|
| `npm run dev` | Dev server on http://localhost:5173 |
| `npm run typecheck` | `tsc -b` over app, node and test configs |
| `npm run lint` | oxlint |
| `npm test` | Vitest (palette, contrast; later reducer and ring math) |
| `npm run build` | Typecheck + production build (check gzip sizes against the budget) |
| `npm run characters` | Rebuild the character PNGs from `references/grandes/` on their native pixel grid, walk cycles included, and run their quality checks (needs ffmpeg) |
| `npm run shots -- <url> <name>` | Playwright screenshots at 390/768/1440 into `.screenshots/` + overflow and console-error check |

## Skills
- `impeccable` — primary design skill (mode: Experience). `audit` + `polish` in phase 7;
  regenerate `DESIGN.md` from the built world with `document` at the end.
- `emil-design-eng` — interaction feel, translated to stepped frame-based motion.
- `vercel-react-best-practices` — client-side rules only.
- Do NOT use `design-taste-frontend` (corporate-site rules contradict this brief).
