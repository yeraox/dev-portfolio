# Portfolio "YERAY CATURLA" — 16-bit action-RPG portfolio

## Role & way of working
Act as a senior frontend engineer with a pixel-art / SNES-era UI eye. Work in the phases below.
After each phase: run the dev server, screenshot at 1440×900, 768×1024 and 390×844, fix what you
see, then STOP and show me before continuing. Ask before inventing any fact about me.

### Skills
- `impeccable` — primary design skill. Surface mode: **Experience**. Phase 0: run `init`
  (PRODUCT.md) and `shape` (DESIGN.md) from this brief. Final phase: `audit` + `polish`.
  The 16-bit era aesthetic is pinned by this brief — honor it over generic taste.
- `emil-design-eng` — interaction feel (input response, ring rotation, window open/close),
  translated to stepped, frame-based motion.
- `vercel-react-best-practices` — client-side rules only (`rerender-*`, `rendering-*`,
  `bundle-*`, `js-*`). No Next.js; ignore `server-*` / `async-api-*`.
- Do NOT use `design-taste-frontend`: its corporate-site rules contradict this brief.

## Creative direction — original work in a genre, not a copy
The attached screenshots are mood references from a 1995 SNES action-RPG. Capture the era's
conventions; do NOT reproduce its logo, title lettering, sprites, backgrounds, icons, font or music.
Every asset is original.

Genre vocabulary to reinterpret:
- Title screen: near-black navy sky, large embossed golden title, small white pixel credit lines,
  dark silhouetted scenery in the lower third over a thin blue horizon glow.
- Ring menu: icons orbit the character; the active icon sits at the top inside blue corner
  brackets with a green pixel label; a top banner window (blue dithered fill, ornate gold rope
  frame) names the active slot.
- Info windows: grey stone-texture panel, bevelled inset frame, label-left / value-right
  columns, thin divider rules, horizontal dark-red bar gauges.
- Selector rows of alternating blue/grey tiles; a footer help line ("Use ←/→ to choose.")
  and key hints top-right ("ENTER SELECT · ESC EXIT").
- HUD: small portrait + number + gold-capped bar in the bottom corners.

Rendering rules:
- Scenes (title backdrop, cave, camp, characters) render on <canvas> at a fixed low internal
  resolution of **640×360** (320×180 in phase 0, raised in phase 2 so the sprites extracted from my references keep their detail), integer-scaled, `image-rendering: pixelated`,
  letterboxed.
- Windows and all text are real DOM (selectable, accessible, indexable). Pixel-font sizes are
  integer multiples of the font's grid.
- Limited palette (~32 colors) as CSS custom properties in one `tokens.css`. Dithering instead of
  smooth gradients. Hard 1–2px offset shadows, no blur, no border-radius.
- Motion is stepped: `steps()` / frame counts at 60fps. Yeray's walk cycles: 8 frames × 120 ms;
  Null's trot ~9 fps.
  Window open = vertical wipe in ~6–8 frames. Scene transitions = mosaic/pixelate or
  fade-to-black in palette steps.

## Assets
Characters are my large pixel-art references USED AS THEY ARE (option A, chosen in phase 2):
`npm run characters` rebuilds each one on its native pixel grid as a transparent PNG in
`src/assets/characters/`, shown with `<PixelSprite>` at whole-number zooms. Hand-drawn sprites
and grid conversions were tried in phase 2 and rejected (likeness). Ring icons stay hand-drawn
(16×16 grids drawn by `src/engine/`).
Walk cycles (approved 2026-11-11, `docs/animacion-caminar.md`) come from my walk sheets through
the "sello": one head stamped pixel for pixel on every frame, a 0/1/2 px body bob by whole
pixels, and the front step with the other leg mirrored. Nothing is painted. The idle front and
side poses are frames of those sheets, so starting to walk never changes the drawing.

Reference photos (git-ignored, never published, never shipped in the build):
- `references/yeray.jpg` — me. Use for the avatar and portrait.
- `references/dog-griffon.jpg` — the companion dog's look.
- `references/avatar-concept.png` — approved concept sheet for my avatar (views, poses,
  palette, portrait). **This is the visual target.**
- `references/null-concept.png` — approved concept sheet for Null (trot, sit, panting, begging
  pose, portrait, palette). **This is the visual target.**
Open all four before drawing any character sprite. The concept sheets are style guides, not
assets: their pixels are soft/irregular, so redraw every sprite clean on the exact target grid
(no tracing, no anti-aliasing, no partial-alpha pixels). Where a concept sheet and the text
below disagree, the text wins.

### Avatar — me (chibi SNES proportions, ~2.5 heads tall)
- **Hair:** dark brown, curly **short mullet**: voluminous curly top, short faded sides, and
  curls falling slightly longer at the nape (visible in side and back views). The irregular
  curly silhouette is the #1 recognition cue — keep it even at sprite size.
- **Face:** light skin, dark eyebrows, **round dark-framed glasses** (#2 cue),
  **mustache + chin goatee only — NO beard on the cheeks or jawline**. Clean-shaven cheeks.
- **Outfit — original 90s RPG adventurer (do NOT use the clothes from the photo, and do not
  imitate any existing game character's outfit):** olive-green quilted vest over a white
  t-shirt, beige cargo trousers, brown boots, small backpack with crossing straps. No bracers,
  no wristbands.
- **Idle:** standing front pose, breathing. (The arms-crossed idle was dropped on 2026-11-11: it
  did not convince me. I may add more poses during the final touches.)
- **Readability:** use a 1px very dark navy outline (not pure #000) and warm rim-light pixels on
  the side facing the campfire. The dark hair must stay separate from the dark background, so
  give the curls a lighter highlight row.
- **Starting palette (adjust in DESIGN.md):** hair #3b2418 / #5a3a26 / #7a5236 · skin #e8b896 /
  #c48e6c · glasses #1a1418 · mustache #3a2618 · goatee #5a3a26 ·
  vest #4f5d2f / #6b7a3d / #8a9a52 (diamond-quilted pattern) · t-shirt #e8e4d8 / #b8b2a2 ·
  cargo #b89a6a / #8f7650 · boots #5a3a22 / #3a2416 · backpack straps #6a4a2e ·
  outline #0b0b1a.

### Companion — Griffon Belge (black & tan rough-coated griffon)
Always with me: follows ~1 tile behind with a few frames of lag, sits beside me in the HUB.
- **Coat:** black, wiry and scruffy, with tan markings on eyebrows, muzzle/beard, chest and lower
  legs/paws.
- **Face:** very short pushed-in muzzle, big round dark eyes with 1px catchlight, bushy beard
  and whiskers, small semi-erect ears. Pink tongue out.
- **Body:** small, compact, short tail held up.
- **Markings detail (from concept):** tan V on the chest, tan eyebrow dots, tan muzzle beard.
- **Animations:** trot (4 frames), sit idle with 2-frame panting tongue, occasional tail wag,
  and a begging pose (standing on hind legs) used for "Null is waiting…".
- **Readability:** a black dog on dark scenes must not vanish. Render the black coat as charcoal
  with blue-tinted highlights, with the same navy outline and campfire rim light as the avatar.
- **Palette:** coat #1e1a1a / #3a3030 · tan #b07a3c / #d39a55 · eyes #0a0a0a + #ffffff ·
  tongue #e06a8a.
- **Name:** **Null**. Shown under the dog's HUD portrait. Feel free to use it in light, dev-flavored
  microcopy (e.g. "Null is waiting…"), sparingly.

### Sprite list
| Sprite | Size (px) | Frames |
|---|---|---|
Sizes are larger than typical 16-bit sprites so the glasses, mustache, goatee and Null's tan
markings stay readable; confirm against the internal resolution in DESIGN.md.

| Sprite | Size (px) | Frames |
|---|---|---|
| Avatar walk down (toward camera) | 46×113 canvas (figure 110 tall) | 8 |
| Avatar walk side (mirror for the other side) | 65×110 canvas | 8 |
| Avatar idle front | frame "up" of the front walk (46×113) | 1 (+1 px breathing) |
| Avatar portrait (HUD left, STATS window header) | 64×94 (HUD shows the top 64×76) | 1 |
| Null trot side (mirror for the other side) | ~50×38 | 6 |
| Null walk down | ~24×38 | 3 (4-step cycle) |
| Null sit | 55×93 drawn at ½ | 1 (+1 px breathing) |
| Null begging pose | — | not available yet (needs a reference) |
| Null portrait (HUD right) | 50×47 | 1 |
| Ring icons (one per slot) | 16×16, drawn at 2 scene px per pixel | 1 |
| Camp background | Yeray's generated image, 1376×768 (art pixels of 5.74 px), filling the scene's height | 1 + a 3-variant flame flicker |

Back views from the concept sheets are not needed in v1.

Fonts (confirmed): **Jersey 10** for the title, PRESS START and game labels; **Pixelify Sans**
for all window text. Self-hosted via @fontsource.

## Stack & code standards
- Vite + React 19 + TypeScript (`strict: true`). CSS Modules + global `tokens.css`.
  No Tailwind/Bootstrap/UI kits, no animation libs, no game engines.
- **I'm learning TypeScript with this project.** Keep it beginner-readable:
  - Use only `type`/`interface`, unions, optional fields, typed props, typed `useState`/`useReducer`,
    and simple generics only where React requires them. No conditional/mapped types, no
    `as` casts or `any` unless unavoidable, and explain why when they are.
  - Let inference work; don't annotate what TS already knows.
  - The first time a TS concept appears, add one short comment explaining it.
  - End every phase report with a "TypeScript in this phase" section: 3–5 concepts used, each
    with a one-line explanation and the file where to see it.
  - When I write TS myself and ask for review, explain the error message before giving the fix.
- Scene flow is a finite state machine with `useReducer`:
  `TITLE → TRANSITION → INTRO → HUB → WINDOW(sectionId)`, with explicit back transitions.
- One `useGameLoop` hook (single requestAnimationFrame, paused when the tab is hidden).
- One `useInput` hook that normalizes keyboard / pointer / touch into actions
  (LEFT, RIGHT, CONFIRM, CANCEL).
- All content lives in typed data files in `src/content/`. The ring menu is generated from
  that list; nothing is hardcoded in components.
- Section windows lazy-loaded with `React.lazy`.
- Folders: `src/scenes` (camp), `src/components` (RingMenu, Hud, SectionDialog, Window,
  BannerWindow, StatBar, HelpBar…), `src/engine` (game loop, input, screen hooks, sprite and
  character drawing), `src/game` (pure logic: state machine, ring maths, stage layout),
  `src/content`, `src/styles`.

## Input & accessibility (non-negotiable)
- Keyboard: ←/→ rotate ring, Enter/Space select, Esc back; Tab order stays sane.
  Mouse: click any ring item. Touch: tap items, swipe to rotate.
- Ring menu has correct ARIA semantics (choose and justify the pattern) and a visible focus state
  in the bracket style. Focus is trapped in an open window and returned to the ring on close.
- "SKIP INTRO" is visible from the first frame. Returning visitors start at HUB
  (localStorage, wrapped in try/catch). `prefers-reduced-motion` → no walk sequence, instant
  transitions.
- A recruiter reaches projects + contact in under 10 seconds: an always-visible small link to a
  plain-text CV view, plus a CV PDF download (see "Downloadable CV").
- WCAG AA contrast for all window text. Proper `<title>`, meta description, OpenGraph image.
- No audio in v1.

## User journey
A. TITLE — "YERAY CATURLA" in the golden embossed treatment. Credit lines:
   "BACKEND DEVELOPER · NODE.JS · EXPRESS · JAVA · DOCKER · AWS" (the school line was dropped
   at Yeray's request in phase 5: not relevant on the title).
   Blinking "PRESS START" (blink in steps, not a fade); any key / click / tap starts.
   Built in phase 5: the credits line is translated per locale; the night landscape is drawn in
   code from the palette; the camp downloads while the title is shown; the transition is a
   dithered palette-step fade (16 frames out, 16 in); any `#hash` link skips the title.
B. INTRO — pixel transition into a ¾ top-down cave mouth. The avatar walks out toward a small
   base camp (campfire flicker, tent) with the dog trotting behind. ~4–6 s max; skippable.
   Built in phase 6: the camp image's own cave mouth, a data script (`src/scenes/camp/intro.ts`),
   4.7 s including the ring opening; any key, click or SKIP INTRO skips; `/#title` shows the
   title even to returning visitors.
C. HUB — the avatar stands at camp with the dog sitting beside him. The ring menu opens around
   him and the banner window shows the active slot. Bottom HUD: my portrait bottom-left, the
   dog's bottom-right; propose what the bars show using real data only, or show portraits alone.
   Selecting a slot opens its window; Esc returns to the ring. Every window has its own link
   (`/#equip`, `/#stats`…) that opens it directly, so it can be shared.
   **Camp props (background, decorative):** hint at my hobbies before any window opens:
   - Gym: a few dumbbells/plates next to the tent and a pull-up bar improvised between two trees
     or tent poles; optionally a kettlebell by the fire.
   - Kitchen: a paella pan on a tripod over the campfire (subtle steam, 2–3 frames) and a glass
     jar of olives on a crate.
   Original pixel art, small, low contrast so they never compete with the avatar, Null or the
   ring. No brand logos.

## Ring slots & content (data only — never invent metrics, dates, employers or claims)
All content lives in `CONTENT.md` (Spanish source of truth, extracted from my CV). Use it
verbatim; `TODO` / `PREGUNTA` items there are still open.

**Priority:** the professional sections (EQUIP, ALCHEMY, STATS, COMMS) and the CV view come
first. BUFFS and CRAFT are deferred: each content section has a `status: 'ready' | 'draft'`
field; `draft` slots are hidden from the ring in production builds and shown in dev, so the
live site never shows an empty window. The ring layout must work with 4, 5 or 6 slots.

**Downloadable CV:** `references/cv_es_yeray_caturla.pdf` (Spanish; includes my phone — OK in
the PDF, never on the web). Copy it to `public/cv/` at build time; English PDF TODO.

| Ring label | Banner title | Section in CONTENT.md | Window layout |
|---|---|---|---|
| EQUIP | Equipment — Projects | EQUIP | item list left (icon + name), detail panel right |
| ALCHEMY | Alchemy — Tech Stack | ALCHEMY | two tiers (Mastery / Worked with), grouped ingredient lists, no numeric levels or % |
| STATS | Stats — Profile | STATS (profile, education, quest log) | stats-sheet layout (portrait + label/value columns + dividers) |
| BUFFS | Status — Training | BUFFS | active-buff list with red bar gauges |
| CRAFT | Crafting — Kitchen | CRAFT | recipe card: ingredients → steps → result |
| COMMS | Config — Contact | COMMS | option list with links + ES/EN toggle |

## Language — bilingual ES/EN with typed dictionaries (no i18n library)
- One dictionary per locale: `src/content/es.ts` and `src/content/en.ts`, both typed against a
  shared `Content` type, so a missing or misspelled translation is a compile error.
- A small `LocaleProvider` + `useLocale()` hook (React context) exposes `locale`, `setLocale`
  and `t` (the active dictionary).
- Initial locale: saved choice (localStorage, try/catch) → else `navigator.language` starting
  with `es` → `es`, otherwise `en`. Update `<html lang>` on change.
- ES/EN toggle on the TITLE screen and inside the CONFIG/COMMS window, keyboard accessible.
- Game labels stay English in both locales (EQUIP, ALCHEMY, STATS, BUFFS, CRAFT, COMMS,
  PRESS START, SKIP INTRO). Banner titles, help lines, window content, CV view and meta
  description are translated.
- Workflow: I write content in Spanish; you draft the English version and I review it. Never
  machine-pad missing text — if a Spanish source is a TODO, the English one is too.
- Keep it migratable to react-i18next later (flat, serializable data; no JSX inside dictionaries).

## Phases (stop for review after each)
Human-readable explanation of every phase: `docs/plan-de-fases.md` (keep both in sync).

0. Foundations: Vite + React + TS (strict), oxlint, Vitest, Playwright Chromium (dev), folder structure;
   write CLAUDE.md, PRODUCT.md, DESIGN.md (palette, fonts, frame/window specs, motion specs,
   internal resolution 640×360 since phase 2); `/dev/specimen` page with palette + chosen fonts.
1. Window look: tokens + fonts + `Window`, `BannerWindow`, `StatBar`, `Divider`, `HelpBar`,
   `KeyHint`; the STATS window rendered statically on `/dev/windows`.
2. Characters: sprite renderer (with horizontal flip) + avatar + Null + portraits + ring icons.
   `/dev/sprites` preview at 1×, 4× and 8× next to the reference photos; iterate on likeness.
3. Camp + ring menu: HUB scene (characters on a screen-pixel canvas, my generated camp
   background used as it is, flickering campfire), HUD, `useGameLoop`, `useInput`, `RingMenu`,
   HUB ↔ WINDOW state machine with placeholder windows (native `<dialog>`); draft sections hidden
   in production; portrait-screen layout. Vitest for reducer, ring math and stage layout;
   `npm run check:camp` walkthrough; `npm run fps`; Lighthouse.
4. Content windows: typed ES/EN dictionaries + `useLocale`; EQUIP, ALCHEMY, STATS, COMMS;
   optimized media (WebP, trimmed muted video < 2 MB, poster); lazy-loaded windows.
5. TITLE screen + transition.
6. INTRO cave walk (scripted steps) + skip / reduced-motion / returning-visitor logic.
7. Plain-text CV page (`/cv/`, Vite multi-page), meta/OG/favicon, robots/sitemap,
   `impeccable audit` + `polish`, Lighthouse (aim ≥ 95 a11y/perf).
8. Publish: I prepare the GitHub Actions workflow (GitHub Pages; alternatives Vercel/Netlify),
   the README for recruiters and a step-by-step guide; Yeray creates the repo, pushes and
   enables Pages.

## Git
Never run any git command (init, add, commit, push, branch…) unless I explicitly ask. I commit
myself after each approved phase: at the end of a phase, list the files that changed.

## Performance budget
A phase isn't done until it meets this budget (measured from phase 3 on, reported each phase:
`vite build` sizes, Lighthouse mobile, frame timing with 4× CPU throttle in Chromium).

| Metric | Budget |
|---|---|
| Initial JS (gzip) | ≤ 100 KB |
| Initial total transfer, excluding video/screenshots | ≤ 300 KB |
| LCP (Lighthouse mobile, slow 4G) | ≤ 2.5 s |
| CLS | < 0.1 |
| INP | < 200 ms |
| Frame rate | 60 fps on a normal laptop; stable ≥ 30 fps at 4× CPU throttle |
| Lighthouse performance + accessibility (mobile) | ≥ 95 |
| Capyroad video | ≤ 2 MB, `preload="none"` |

Safety net: adaptive fallback to 30 fps when frames run long; reduced motion skips the intro;
`/cv/` stays an ultra-light text page.

## Definition of done
Works at 390 / 768 / 1440 with no horizontal scroll. Fully playable with keyboard only and with
touch only. No console errors. Every `TODO` is either filled by me or listed in a final report.
