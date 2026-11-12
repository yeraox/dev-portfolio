# DESIGN.md — v0 (specification)

> Status: **v0 spec written in phase 0, before the build.** Resolution and fonts confirmed by
> Yeray on `/dev/specimen` (2026-11-09). In phase 7 this file is regenerated from the built world with
> `impeccable document`; until then, where this file and the running code disagree, raise it.

## 1. World
An original 16-bit action-RPG world: a night-blue title screen with embossed gold lettering, a
cave mouth opening onto a small camp, and stone-and-gold interface windows. The interface is
part of the world, not a website laid over a game. Mood: quiet night, warm campfire, crisp
pixels. Never a copy of any existing game's assets.

## 2. Internal resolution and scaling
- **Scenes** (title, cave, camp, characters) are drawn on a `<canvas>` at a fixed internal
  resolution: **640×360** (changed from 320×180 in phase 2: the sprites extracted from Yeray's
  references need ~80 px of height for the glasses, mustache and goatee to read). 16:9; ×2 on
  1280×720 / 1440×900, ×3 on 1920×1080, ×4 on 2560×1440.
- **Scale** (`src/game/stage.ts`, tested): the largest whole number of *screen* pixels per scene
  pixel that fits (`floor(fit × devicePixelRatio)`), so every pixel is the same size — unless that
  leaves the scene under 80 % of the exact fit (e.g. 1366×657 laptops), then the exact fit.
  1440×900 → ×2 (1280×720), 1920×1080 → ×3, 2560×1440 → ×4. Letterboxed with `--night-0`.
- **Portrait screens (tall mode):** the camera shows the middle 360×360 of the scene (the ring,
  Yeray and Null fit in 290 px), bigger; the banner goes above the scene, the HUD below it, and
  windows open as full-width sheets. Phone 390×844 → 360×360 CSS px; tablet 768×1024 → 720×720.
- **UI pixel (`--u`)** = 2 scene pixels (the 320×180 grid the windows were designed on), clamped
  to 2–8 CSS px and set on `:root` from JavaScript: 2 px on phones, 4 px at 1440 (as approved in
  phase 1), 6 px at 1920, 8 px at 2560 — frames grow with the scene. The phase-1 media queries
  remain as the no-JS fallback.
- **Type grows with the scene too** (`src/game/stage.ts`, set on `:root` with `--u`): text =
  13 scene px (min 16), small = 10.5 scene px (min 14), display = Jersey 10 at 10 × round(1.5 ×
  scale) (min 20), window title = 10 × round(2 × scale). 1440: 26 / 21 / 30 / 40 px; 1920: 39 /
  32 / 50 / 60; phone: 16 / 14 / 20 / 20. (Phase 4, round 2: at a fixed 20 px the windows were
  hard to read, worse on big screens.)
- **The scene canvas works in screen pixels** (CSS size × devicePixelRatio), so characters drawn
  with half-size pixels (Null sitting, `pixelSize` 0.5) stay crisp wherever the screen has the
  pixels for them.
- Characters: Yeray's reference cut-outs (all poses 110 image px tall: walk canvases front 46×113,
  side 65×110), Null (sit 55×93 drawn at ½, trot ~50×38, front ~24×38),
  portraits 64×94 (Yeray) and 50×47 (Null), ring icons 16×16 drawn at 2 scene px per pixel.

## 3. Color
Source of truth: `src/styles/palette.ts` (mirrored in `src/styles/tokens.css`, enforced by
`palette.test.ts`).

### Interface and scenes (31/32)
| Role | Tokens | Rule |
|---|---|---|
| Outline | `ink` | Every sprite and frame outline. Never pure `#000`. |
| Night sky | `night-0..2`, `horizon`, `horizon-hi` | Title sky and scene darks; page background is `night-0`. |
| Banner blue | `blue-0..3` | Banner fill dithers `blue-1`/`blue-2`; `blue-3` = selection brackets and focus ring. |
| Stone | `stone-0..4` | **Text only ever sits on `stone-0`/`stone-1`.** `stone-2..4` are bevels, speckles under no text, and frame highlights. |
| Gold | `gold-0..4` | Title lettering (bands `gold-4`/`gold-3`/`gold-2`, extrusion `gold-1`/`gold-0`), rope frame, HUD caps, window headings (`gold-3`). |
| Text | `text`, `text-dim` | Body and secondary text. |
| Accents | `green-0/1`, `red-0/1`, `fire` | Ring label (`green-1` on an `ink` plate), stat bars (`red-1` fill in an `ink` track), campfire. |
| Camp | `forest-0..2`, `earth-0` | Low-contrast scenery so characters and UI dominate. |

### Characters
Since phase 2 the characters keep their references' own colours (no character palettes). The
UI palette above covers the interface. Scene backgrounds (Yeray's generated images) also keep
their own colours.

### Contrast
Every allowed text/background pair is listed in `CONTRAST_PAIRS` (`src/styles/contrast.ts`) and
tested: 4.5:1 for text, 3:1 for bars, brackets and focus rings. Lowest current text pair:
`text-dim` on `stone-1`.

### Gradients
None smooth. Fake gradients with 2-color checkerboard dithering (scenes, banner) or hard color
bands (title lettering).

## 4. Typography (confirmed)
| Role | Face | Package | Use |
|---|---|---|---|
| Display | **Jersey 10** (400) | `@fontsource/jersey-10` | Title "YERAY CATURLA", PRESS START, game labels (EQUIP, STATS…), ring labels, banner titles |
| Text | **Pixelify Sans** (400, 700) | `@fontsource/pixelify-sans` | Everything inside windows: rows, paragraphs, help bar, CV view |

- **Title treatment:** banded gold fill (`gold-4` / `gold-3` / `gold-2`) + stacked zero-blur
  drop-shadows (`gold-1`, `gold-0`, `ink`) offset by `--u`. Size (`titleNameSize`, tested):
  10 × round(6 × scale), capped so the name fills at most 90 % of the width, minimum 40 — 390:
  60 px, 768 and 1440: 120 px, 1920: 180 px (multiples of Jersey 10's 10px grid).
- **Window text:** 13 scene px (26 px at 1440, 16 px minimum on phones); line-height 1.35;
  paragraphs ≤ 65ch; headings in Pixelify Sans 700 or Jersey 10 in `gold-3`.
- **Game labels:** Jersey 10, uppercase, letter-spacing ≈ 0.08em. Stat numerals tabular.
- Self-hosted with `@fontsource`, Latin subset only; preload the two files used on the first
  screen to protect LCP and CLS.

## 5. Window system (built in phase 1 — `src/components/`)
Measures in `--u` (UI pixel: 2px by default, 3px at ≥ 960×540, 4px at ≥ 1280×720; JS-driven
from phase 3). Textures are generated from the palette as tiny SVGs in `src/assets/textures.ts`.

| Component | Spec |
|---|---|
| **Window** | Fill: 32×32 granite tile (2-px value-noise grain: mostly `stone-0`, `stone-1` flecks, rare `ink` pits — a test locks these colors). Bevel: 1u `stone-3` top-left, 1u `ink` bottom-right, 1u `ink` outer outline. Engraved groove 3u inside the edge (`ink` top-left, `stone-3` bottom-right). Padding 7u. Optional title (Jersey 10, `gold-3`), top-right hint slot, bottom help slot. Opens with a top-to-bottom `clip-path` wipe: 18 frames (0.3 s) in 9 steps. |
| **BannerWindow** | Gold rope nine-slice (18×18 image, 6-px cells: knot corners, twisted rope edges in `gold-1..4` + `ink`), drawn 6u thick with `border-image-repeat: round`. Fill: `blue-1`/`blue-2` 2×2 checker dither, 1u `blue-0` inner lines top and bottom. Title: Jersey 10, `text`, 1u `ink` hard shadow. |
| **Divider** | 1u `ink` over 1u `stone-3` (engraved). 5u margin above and below. |
| **StatBar** | Label (`text-dim`) · value (tabular) · gauge. Track `ink`, 4u tall with 1u padding; fill `red-1` with 1u `red-0` bottom shade. `role="meter"` with min/max/now/valuetext. Real values only. |
| **HelpBar** | Engraved top line, `text-dim`, small size. |
| **KeyHint** | Jersey 10, letter-spacing 0.08em. Keys are `<kbd>` caps: `gold-3` on `ink` with a 1u `stone-2` bottom edge. |
| **Selection brackets** | Four `blue-3` corners: an 8×8 nine-slice texture (`BRACKETS`, 3-px corner cells) drawn as a `border-image`, 1u thick, 2u outside the active ring icon; it is also that icon's focus style. |
| **Section window (phase 3)** | A native modal `<dialog>` holding a `Window` (`SectionDialog`): Tab wraps inside it, Esc and a `[ESC] EXIT` button (also for touch) close it with a 10-frame reverse wipe (5 steps), then focus returns to the ring. No backdrop dimming (SNES style). Portrait screens: full-width sheet. |

Window content patterns (from the STATS sheet): section headings Jersey 10 `gold-3`; entry
titles Pixelify Sans 700; meta lines small `text-dim`; "in progress" status `green-1`; bullets
are 2u `gold-2` squares with a `gold-0` pixel shadow; label/value rows use a 7em label column
from 480px up and stack below it. Two columns from 1024px, separated by an engraved line when
stacked. Portraits inside windows render at most ×3 (144px).

## 5b. Content windows (phase 4 — `src/windows/`)
- One lazy chunk per section (`React.lazy`, a few hundred bytes to 2 KB each), all preloaded after
  the camp is on screen. A window only appears once its content is ready (no fallback state), so
  opening from a link (`/#equip`) does not shift the layout.
- **Size:** a window covers the scene, 4 UI pixels in from its edges (`--stage-width/height`); on
  portrait screens, the whole screen. The frame, title and help line stay put.
- **Sections** (`WindowSections`, phase 4 round 2): each window's content is split into sections,
  one on screen at a time, with ARIA tabs on top (←/→/↑/↓, Home, End, click). The **mouse wheel**
  moves between sections: a section longer than the window is read to its end first (the browser
  scrolls it), and one flick or spin changes one section only (events closer than 200 ms are one
  burst; a burst that scrolled content does not also change section; a trackpad must travel 30 px).
  Going back with the wheel lands at the end of the previous section. **Touch:** a sideways swipe
  (≥ 60 px, mostly horizontal). A gold pixel arrow blinks (32 on / 16 off frames) at the bottom
  right while there is more below. Sections lay out by the window's width (container queries).
  EQUIP = one section per project; STATS = Profile · Education · Quest log; ALCHEMY = one per
  tier; COMMS = a single section (no tabs). Help line: wheel/keys with a mouse, swipe/tap on touch.
- Shared patterns (`sheet.module.css`): label/value rows with an 8.5em label column from 480 px;
  Jersey 10 `gold-3` headings;
  entry title 700 + `text-dim` meta line; 2u gold square bullets; `tag` badge (Jersey 10 `gold-3`
  on `ink`: DESTACADO / FEATURED, CLASIFICADO / CLASSIFIED).
- **Tabs:** the chosen one on an `ink` plate in `gold-3` with the pixel bullet as a cursor; an
  engraved line under the row.
- **EQUIP:** wide windows (≥ 820 px) put the pictures on the left (Capyroad: video, caption, still)
  and the text on the right: name + tag, context, summary, "what I did", facts (stack, notes, repo
  link, demo). Narrow: stacked. Bosa Digital: text only.
- **ALCHEMY:** each tier as rows (group → items joined by ·). No levels.
- **STATS:** Profile = the portrait in an ink "screen" (×round(1.5 × scale), min ×2: ×3 at 1440)
  with name (Jersey 10 `gold-3`) and role, then rows + bio beside it on wide windows; Education;
  Quest log.
- **COMMS:** rows with links (web ones open a new tab, with a hidden "(opens in a new tab)");
  language as a native radio group with pixel radios (5u ink square, 1u `stone-4` edge, gold
  centre when chosen).


## 6. Ring menu (phase 3 — `src/components/RingMenu.tsx`, geometry in `src/game/ring.ts`)
- Icons: 16×16 grids drawn at 2 scene px per icon pixel (32×32 scene px), on an ellipse of
  **rx 124, ry 84** around Yeray's middle (scene 320, 255).
- Slots spread evenly over 360° for the *visible* slot count (4–6). Active slot at the top,
  inside the selection brackets; its label above in Jersey 10, `green-1` on an `ink` plate.
- Rotation: 8 whole frames (~133 ms), all icons advance together, the short way round. Banner
  shows the active section's title and, on mouse-and-keyboard devices, `[← →] ROTATE · [ENTER]
  OPEN`.
- Input: ←/→ turn, Enter/Space open; click or tap opens a slot directly; a sideways swipe on
  the scene turns the ring. ARIA `menu` pattern with roving focus on the active slot.

## 6b. Camp scene (phase 3 — `src/scenes/camp/`)
- Layout (scene px): Yeray at x 320 with his feet on y 310 (the clearing's lower edge, where the
  path starts — low enough for the ring's left icon to pass under the campfire); Null sitting at
  x 376, y 312; both on a dithered `ink` shadow ellipse (half the pixels, no transparency).
- Background: **Yeray's generated camp image as it is** (`references/grandes/campamento.jpg`,
  1376×768) — `npm run scenes` only re-encodes it as WebP q85 (564 → 64 KB, indistinguishable at
  2× zoom) into `src/assets/scenes/`. It fills the scene's height (0.469 scene px per image px)
  and overhangs 2.5 px left and right. Its art pixels measure 5.74 image px (grid score 0.64, a
  240×134 grid), but it also draws details at half a pixel (outlines, highlights, the tripod's
  legs, the tent's rope): snapped to its grid those turned into blobs and dotted lines, so the
  image is drawn unsnapped, nearest-neighbour (smoothed only below 0.75×).
- Campfire: the image's still flame flickers by palette steps — 3 variants where random whole art
  pixels of the flame burn dimmer, shown every 110 ms in a restless order
  (`src/scenes/camp/fireFlicker.ts`); still with reduced motion. Nothing else in the image changes.
- With 6 sections (drafts shown in dev), the ring's upper-left slot sits over the paella pan; with
  the 4 live sections the left slot passes under the fire. Revisit when BUFFS/CRAFT are ready.
- Yeray stands in his front pose, breathing. (The arms-crossed idle was dropped on 2026-11-11;
  Yeray may add poses in the final touches.)
- The canvas redraws only when a pose, a breath or the size changes.

## 6c. Title screen (phase 5 — `src/scenes/title/`)
- Landscape drawn in code from the palette (`titleBackground.ts`, 1 art pixel = 2 scene px),
  filling the whole screen: `night-0` sky with sparse stars, hard bands and checker dithers down
  to a `horizon` glow line; the cave mountain (`night-1`) with the dark cave arch at its foot; a
  dense treeline (`night-0`) of pointed firs — one-pixel tips, four stepped branch tiers, bases
  wider than their spacing so they always overlap (lone round-topped trees read badly) — with a
  clearing of whole trees in front of the cave.
- Centre, in the sky above the peak: the gold name (§4), the credits line in Jersey 10 `text`
  (10 × round(scale), min 20), then PRESS START (`--title-size`).
- ES/EN top right and SKIP INTRO bottom right: Jersey 10 `text-dim` on `ink` plates with a 1u
  `stone-2` underside; the active language `ink` on `gold-3`.
- Any key, click or tap starts, except Tab/modifiers/Escape and the controls themselves. A focused
  PRESS START never blinks; with reduced motion it doesn't blink and the camp appears at once.

## 7. HUD (phase 3 — `src/components/Hud.tsx`)
Bottom corners of the scene: small stone panels (window bevel) with the portrait in an `ink`
"screen" of 64×76 portrait px — Yeray's head down to the goatee and vest collar (top 76 rows of
his 64×94 portrait), Null's 50×47 face centred — and the name in Jersey 10 `gold-3` below. Zoom
= `round(scale / 2)` (1× up to 1440, 2× from 1920). Portrait screens: below the scene, name beside
the portrait. No bars: there are no real numbers to show.

## 8. Motion
All motion is stepped; 1 frame = 1/60 s.

| Moment | Frames | Notes |
|---|---|---|
| Window open | 18 (9 steps × 2) | Vertical wipe (clip-path in `steps(9)`). 7 frames was too fast to notice |
| Window close | 10 (5 steps × 2) | Reverse wipe, a bit faster than opening (built in phase 3) |
| Ring rotate | 8 | Per slot step, driven by the shared game loop |
| Walk cycle | Yeray 8 frames × 120 ms (body bob 0/1/2 px); Null trot 6 × 110 ms, front 4 × 160 ms | `docs/animacion-caminar.md` |
| PRESS START blink | 32 on / 16 off | Hard on/off, never a fade |
| Scene transition | 16 out + 16 in | Dithered palette steps (4×4 Bayer: ¼ → ½ → ¾ → solid `night-0`), 4 frames each; the next scene appears while fully dark (`DitherTransition`) |
| Campfire / steam | 2–3 frames at ~6 fps | Ambient |

`prefers-reduced-motion`: no intro walk, instant transitions, ambient loops paused. Adaptive
fallback to 30 fps when frames run long.

## 9. Iconography (16×16, phase 2)
EQUIP vest · ALCHEMY flask · STATS scroll · BUFFS dumbbell · CRAFT paella pan · COMMS letter.
Drawn as sprites on the shared palette. No emoji or unicode glyphs as icons anywhere.

## 9b. Characters (phase 2 — Yeray's references as they are)
- **Source of truth:** Yeray's big references in `references/grandes/` (private). `npm run
  characters` (`scripts/sprites/cutout.mjs`, shared code in `scripts/sprites/lib.mjs`) rebuilds
  each figure on its **native pixel grid** — one pixel per pseudo-pixel the image was drawn with,
  original colours — removing only the background, the light "sticker" fringe, JPEG noise and
  tiny islands. Output: transparent PNGs in `src/assets/characters/` (≈ 96 KB for all) plus
  `characters.gen.ts` (sizes, ground row, row inside the png). Never edited by hand.
- **Walk cycles — the "sello"** (`scripts/sprites/walk.mjs`, approved 2026-11-11): Yeray's walk
  sheets (`front_walk_animation.png`, `sidewalk_animation.png`) have no regular pixel grid, so
  snapped frames drift (10–27 % of the face changed per frame). Instead every frame shares one
  fixed canvas, symmetric around the head; the reference frame's head (hair, glasses, eyes,
  moustache, goatee) is stamped pixel for pixel on all of them; the body bobs by whole pixels
  (everything above the waist plus the arms, whole, moves down 0/1/2 px; legs stay planted);
  the front step with the right leg is the left step mirrored (head not mirrored). The 6
  drawings of each direction are stacked in one png (43 KB for both instead of 108). The
  script checks every image: head identical, bob as specified, no background-tinted pixels or
  loose specks, feet on the ground row — and fails otherwise.
- **Poses** live in `src/assets/characters/characters.ts`: which images form each pose, the time
  per frame, and `pixelSize` (relative size of one image pixel) so every pose of a character is
  the same height: Yeray idle/side/arms/walks 110 rows ×1; Null sit ×0.5, trot/walk ×1. The idle
  front and side poses are frame "up" of each walk, so starting or stopping never jumps.
- **Rendering:** `<PixelSprite pose unit flip>` (`src/components/`) draws a pose as a background
  (several frames can share one png) with `image-rendering: pixelated` at a whole number of CSS
  px per image pixel
  (`round(pixelSize × unit)`), cycles multi-frame poses and gives single-drawing poses a 2 px
  stepped bob (off with reduced motion). On a 1440 px screen (unit 2) Yeray is ~220 CSS px tall.
- Character colours come from the references and are not limited to the UI palette.
- Hand-drawn sprites and the grid extractor were tried and rejected in phase 2
  (likeness); the grid engine in `src/engine/` remains only for the 16×16 ring icons.
- Yeray walks in 8 frames toward the camera and sideways (flip for left); his portrait is a
  single drawing. The arms-crossed pose was dropped (2026-11-11). Null has a 6-frame trot and a 3-frame front walk.
- Known limits of the walks: the "passing" frames have both feet on the ground (the sheets have
  no lifted-leg drawing); the backpack moves with the body (no 1-frame lag yet).

## 10. Media inside windows
Project screenshots and the Capyroad video are **not** pixelated: they sit crisp inside a
1u `ink` + 1u `stone-3` frame, a "screen within the screen". Screenshots: WebP at 640/1280 px
(`srcset`), lazy-loaded, with width/height reserved. Video: 14 s, muted, 1280×586, MP4 (208 KB)
first + WebM (234 KB), poster = first frame; autoplay + loop only without reduced motion (then
controls, `preload="none"`). Both live in `src/assets/projects/` (`npm run media`).

## 11. Never
Copied game assets · border-radius · blurred shadows · smooth gradients · emoji icons · raw hex
outside the palette files · text on `stone-2..4` · fake stats or percentages.
