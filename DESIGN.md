---
name: Yeray Caturla — 16-bit portfolio
description: A personal portfolio as an original 16-bit action-RPG night camp, with a plain CV one click away.
colors:
  ink: "#0b0b1a"
  night-0: "#070912"
  night-1: "#0e1328"
  night-2: "#18203f"
  horizon: "#2f4a8a"
  horizon-hi: "#5b7fc7"
  blue-0: "#121a52"
  blue-1: "#1f2d8a"
  blue-2: "#2f45b8"
  blue-3: "#5d74e0"
  stone-0: "#2a2a2e"
  stone-1: "#45454b"
  stone-2: "#5f5f66"
  stone-3: "#7c7c84"
  stone-4: "#a3a3ab"
  gold-0: "#4a2c08"
  gold-1: "#8a5a12"
  gold-2: "#d19a22"
  gold-3: "#f2c84b"
  gold-4: "#fff0a8"
  text: "#f2f0e6"
  text-dim: "#c9c5b6"
  green-0: "#2a7a2a"
  green-1: "#6fdc5a"
  red-0: "#8a1a1a"
  red-1: "#d8483f"
  fire: "#e8742a"
  forest-0: "#0f2418"
  forest-1: "#1e3a24"
  forest-2: "#355a32"
  earth-0: "#2a1d14"
typography:
  display:
    fontFamily: "'Jersey 10', system-ui, sans-serif"
    fontSize: "10 × min(round(6 × scale), width cap) px (120px at 1440)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.02em"
  headline:
    fontFamily: "'Jersey 10', system-ui, sans-serif"
    fontSize: "var(--title-size)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.04em"
  title:
    fontFamily: "'Jersey 10', system-ui, sans-serif"
    fontSize: "var(--display-size)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "0.08em"
  body:
    fontFamily: "'Pixelify Sans', system-ui, sans-serif"
    fontSize: "var(--text-size)"
    fontWeight: 400
    lineHeight: 1.35
  body-strong:
    fontFamily: "'Pixelify Sans', system-ui, sans-serif"
    fontSize: "var(--text-size)"
    fontWeight: 700
    lineHeight: 1.35
  label:
    fontFamily: "'Pixelify Sans', system-ui, sans-serif"
    fontSize: "var(--text-small)"
    fontWeight: 400
    lineHeight: 1.35
rounded:
  none: "0px"
spacing:
  u: "var(--u)"
  u2: "calc(2 * var(--u))"
  u3: "calc(3 * var(--u))"
  u4: "calc(4 * var(--u))"
  u7: "calc(7 * var(--u))"
components:
  window:
    backgroundColor: "{colors.stone-0}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "{spacing.u7}"
  window-title:
    textColor: "{colors.gold-3}"
    typography: "{typography.headline}"
  banner:
    backgroundColor: "{colors.blue-1}"
    textColor: "{colors.text}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
  game-label-plate:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.text-dim}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "var(--u) calc(3 * var(--u)) 0"
  game-label-plate-active:
    backgroundColor: "{colors.gold-3}"
    textColor: "{colors.ink}"
  key-cap:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.gold-3}"
    padding: "var(--u) calc(2 * var(--u)) 0"
  ring-label:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.green-1}"
    typography: "{typography.title}"
  tab-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.gold-3}"
  tag:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.gold-3}"
  cv-download:
    backgroundColor: "{colors.gold-3}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "6px 16px 4px"
  cv-download-hover:
    backgroundColor: "{colors.gold-4}"
---

# Design System: Yeray Caturla — 16-bit portfolio

> Regenerated in phase 7 (2026-11-15) from the built world with `impeccable document`, merging the
> phase-0 spec and everything added in phases 1–7. Colour hexes live in `src/styles/palette.ts`
> (mirrored in `tokens.css`, a test fails on drift); the frontmatter repeats them for tools. The
> sidecar `.impeccable/design.json` carries motion, shadows and component snippets.

## Overview

**Creative North Star: "The Campfire"**

A quiet night in an original 16-bit action-RPG: a night-blue title with embossed gold lettering, a
cave mouth opening onto a small camp, and stone-and-gold windows that hold Yeray's real CV. Warm
light appears only where it matters, like a campfire in the dark: the gold of the name, the key
caps, the selected tab, the PDF button. Everything else is night, stone and crisp pixels. The
interface is part of the world, not a website laid over a game, and the world invites you to sit
for a while, but never makes you play: the plain CV is always one click away.

Density is low and deliberate: one scene, one ring of six icons, one window at a time. Content
inside the world is plain, factual and fast to scan; the game frames it and never distorts it (no
invented levels, stats or percentages). Motion is stepped in whole frames, never eased; depth is
bevels and hard pixel edges, never blur. Never a copy of any existing game's assets.

**Key Characteristics:**
- Fixed 640×360 scene scaled by whole screen pixels; a UI pixel (`--u`) that grows with it.
- Night palette of 31 colours; gold is the only warm accent in the interface.
- Two self-hosted pixel faces: Jersey 10 for game labels, Pixelify Sans for reading.
- Stone windows with engraved bevels, a gold-rope banner, blue selection brackets.
- Stepped motion in frames; dithered fades; reduced motion honoured everywhere.
- Characters and backgrounds are Yeray's own images, shown as they are.

## Colors

A cold night palette (navy, granite, ink) with one warm voice, gold, and small functional
accents. Source of truth: `src/styles/palette.ts`.

### Primary
- **Campfire Gold** (`gold-3`): the interface's one warm accent. Title lettering band, window
  and section headings, key-cap letters, selected tab, tags, links, HUD names, the CV page's
  name, headings and PDF button. Its ramp: **Gold Shadow** (`gold-0`, extrusion), **Bronze**
  (`gold-1`, rope and hard underside), **Old Gold** (`gold-2`, title lower band, pixel bullets),
  **Pale Gold** (`gold-4`, title highlight band, PDF hover).

### Secondary
- **Banner Royal** (`blue-1`) and **Banner Bright** (`blue-2`): the banner's 2×2 checker dither,
  with **Banner Navy** (`blue-0`) for its inner lines. **Bracket Blue** (`blue-3`): selection
  brackets and every focus ring.

### Tertiary
- **Lime Label** (`green-1`): the ring's active label and the "in progress" status. **Moss**
  (`green-0`) is its shade. **Ember Red** (`red-1`) with **Blood** (`red-0`): stat-bar fills
  only. **Campfire Orange** (`fire`): the scene's flame.

### Neutral
- **Midnight Ink** (`ink`): every outline, plate and track. Never pure black.
- **Deep Night** (`night-0`): page background on every page, letterbox, title sky, dither fades.
  **Night Mountain** (`night-1`) and **Dusk Band** (`night-2`): title-sky bands and the
  mountain; **Horizon Blue** (`horizon`) and **Starlight Blue** (`horizon-hi`): the horizon glow
  and stars.
- **Granite** (`stone-0`, `stone-1`): window fills; the only surfaces text may sit on inside
  windows. **Granite Bevels** (`stone-2`, `stone-3`, `stone-4`): bevels, engraved lines, plate
  undersides, radio edges; never under text.
- **Parchment** (`text`) and **Weathered Parchment** (`text-dim`): body and secondary text.
- **Forest** (`forest-0..2`) and **Earth** (`earth-0`): low-contrast scenery, so characters and
  UI dominate.

Characters (Yeray, Null, portraits) and scene backgrounds keep their references' own colours:
they are Yeray's images, not drawn with this palette.

### Named Rules
**The One Warm Light Rule.** Gold is the only warm colour in the interface. If something new
needs emphasis, it gets gold or nothing; never a new hue.

**The Listed Pairs Rule.** Every text/background combination in use is listed in
`CONTRAST_PAIRS` (`src/styles/contrast.ts`) and tested: 4.5:1 for text, 3:1 for brackets, bars
and focus rings. Lowest text pair: `text-dim` on `stone-1`. Printed CV: `ink` and `stone-1` on
paper.

**The Dither Rule.** No smooth gradients. Transitions between colours are 2-colour checker
dithers (sky, banner), 4×4 Bayer steps (scene fades) or hard bands (title lettering).

## Typography

**Display Font:** Jersey 10 (with system-ui)
**Body Font:** Pixelify Sans 400/700 (with system-ui)

**Character:** Jersey 10 is the game's voice, tall condensed pixel capitals for labels and
titles; Pixelify Sans is the reading voice, a legible pixel text face for everything a recruiter
actually reads. Self-hosted with `@fontsource`, Latin subset only (Spanish and Catalan); the
first screen's face is preloaded so nothing jumps when it arrives.

### Hierarchy
Sizes grow with the scene (`src/game/stage.ts`, set on `:root` as CSS variables). Jersey 10 is
drawn on a 10 px grid, so its sizes stay multiples of 10.
- **Display** (Jersey 10 400, 10 × round(6 × scale), capped at 90 % of the width, min 40 px:
  60 / 120 / 120 / 180 px at 390 / 768 / 1440 / 1920): "YERAY CATURLA" on the title. Banded gold
  fill (`gold-4` 0–24 %, `gold-3` 24–60 %, `gold-2` 60–100 %) and stacked zero-blur drop shadows
  (`gold-1`, `gold-0`, `ink`) one `--u` apart. Real text, not an image.
- **Headline** (Jersey 10 400, `--title-size` = 10 × round(2 × scale), min 20: 40 px at 1440):
  window titles, PRESS START.
- **Title** (Jersey 10 400, `--display-size` = 10 × round(1.5 × scale), min 20: 30 px at 1440,
  letter-spacing 0.08em, uppercase): game labels (EQUIP, STATS…), ring label, banner title,
  section headings, HUD names, ES/EN, SKIP INTRO, VER CV, title credits (10 × round(scale)).
- **Body** (Pixelify Sans 400, `--text-size` = 13 scene px, min 16: 26 px at 1440, 39 at 1920;
  line-height 1.35; paragraphs ≤ 65ch): everything inside windows. Entry titles in 700.
- **Label** (Pixelify Sans 400, `--text-small` = 10.5 scene px, min 14): meta lines, help line.
- **CV page** (rem, follows the reader's own text size): body Pixelify 1.125rem / 1.5; name
  Jersey 10 3.75rem `gold-3` with a hard 3 px `gold-1` underside; section headings Jersey 10 2rem
  uppercase over a 2 px `stone-2` rule; print 10.5 pt in `ink`.

### Named Rules
**The Two Voices Rule.** Jersey 10 speaks for the game (labels, titles, buttons); Pixelify Sans
speaks for Yeray (facts to read). Never set a paragraph in Jersey 10 or a game label in Pixelify.

**The English Labels Rule.** Game labels stay English in both languages (EQUIP, ALCHEMY, STATS,
BUFFS, CRAFT, COMMS, PRESS START, SKIP INTRO); titles, help and content are translated.

## Layout

- **Scene:** a fixed internal resolution of **640×360** (16:9), drawn on a `<canvas>` in screen
  pixels. Scale = the largest whole number of screen pixels per scene pixel that fits, unless
  that leaves the scene under 80 % of the exact fit, then the exact fit. 1440×900 → ×2,
  1920×1080 → ×3, 2560×1440 → ×4. Letterboxed in `night-0`.
- **Portrait screens (tall mode):** the camera shows the middle 360×360 of the scene (the ring,
  Yeray and Null fit in 290 px), with the banner above the scene and the HUD below. Phone 390×844
  → 360×360 CSS px; tablet 768×1024 → 720×720. Windows open as full-screen sheets.
- **UI pixel (`--u`)** = 2 scene pixels, clamped 2–8 CSS px: 2 on phones, 4 at 1440, 6 at 1920,
  8 at 2560. Every frame, bevel, gap and padding is a multiple of it; the phase-1 media queries
  remain as the no-JS fallback.
- **Windows** cover the scene, 4u in from its edges; the frame, title and help line stay put while
  the content changes. Inside: label/value rows with an 8.5em label column from 480 px (stacked
  below), two columns from 1024 px, section layouts by the window's own width (container queries).
- **Title:** the landscape fills the screen; the name, credits and PRESS START sit in the sky
  above the peak; ES/EN top right, SKIP INTRO bottom right, VER CV top left.
- **VER CV** is fixed top left (4u in) on every screen; on portrait screens the camp moves it
  between the two HUD portraits, where the banner can't cover it and the thumb reaches it.
- **CV page:** one column, max 46rem, 16 px gutters; contact, profile, experience, education,
  projects and stack as sections; rows with a 9em label column from 560 px.

## Elevation & Depth

Flat pixel depth only: bevels, engraved grooves and hard offset edges, never blur or
transparency. Raised surfaces (windows, HUD panels) have a light bevel top-left and an ink edge
bottom-right; recessed things (portrait screens, dividers, the engraved groove) invert it. The
banner is lifted by its gold rope frame, not by a shadow. Ground shadows under the characters are
dithered ellipses: half the pixels in `ink`, no alpha.

### Shadow Vocabulary
- **Window bevel** (`inset var(--u) var(--u) 0 stone-3, inset calc(-1 * var(--u)) calc(-1 * var(--u)) 0 ink, 0 0 0 var(--u) ink`):
  every window and HUD panel.
- **Plate underside** (`inset 0 calc(-1 * var(--u)) 0 stone-2`): ink plates of key caps, ES/EN,
  SKIP INTRO and VER CV.
- **Key-cap edge** (`0 4px 0 gold-1`): the CV page's PDF button; pressing it drops the button
  4 px and removes the edge.
- **Title extrusion** (`drop-shadow(0 var(--u) 0 gold-1) drop-shadow(0 var(--u) 0 gold-0) drop-shadow(var(--u) var(--u) 0 ink)`):
  the gold name only.

### Named Rules
**The Zero-Blur Rule.** Every shadow has a blur of 0 and a whole-pixel offset. A soft shadow is a
different era.

## Shapes

Square everywhere: no border-radius on anything (`rounded.none`). Corners and edges are drawn
as pixel art: the window granite is a 32×32 generated tile, the banner's gold rope is an 18×18
nine-slice (6-px cells: knot corners, twisted edges), the selection brackets an 8×8 nine-slice of
four blue corners. Scaled pixel art always uses `image-rendering: pixelated`; bullets are 2u
squares with a pixel shadow; radios are 5u ink squares.

**The Square Pixel Rule.** If it isn't a whole number of pixels, square, it doesn't belong.

## Components

### Window (`src/components/Window`)
Stone panel: 32×32 granite fill (mostly `stone-0`, `stone-1` flecks, rare `ink` pits), the
window bevel, an engraved groove 3u inside the edge (`ink` top-left, `stone-3` bottom-right),
padding 7u. Optional title (headline, `gold-3`), top-right hint slot, bottom help slot. Opens
with a top-to-bottom `clip-path` wipe (18 frames in 9 steps), closes with a 10-frame reverse.

### Section window (`SectionDialog`)
A native modal `<dialog>` holding a Window: Tab wraps inside, Esc or the `[ESC] EXIT` button
closes it, then focus returns to the ring. No backdrop dimming. It only appears once its content
has downloaded, so nothing shifts. On touch screens the close button's hit area reaches 44 px.

### Window sections (`WindowSections`)
Content split into sections, one at a time, with ARIA tabs on top (arrows, Home, End, click). The
mouse wheel changes section after reading a long one to its end (one flick = one section: events
within 200 ms are a burst; a trackpad must travel 30 px); a sideways swipe on touch. The selected
tab sits on an `ink` plate in `gold-3` with the pixel bullet as cursor. A gold pixel arrow blinks
(32 on / 16 off) while there is more below. Paragraphs, rows and list items wrap without a
lonely last word.

### Content windows (`src/windows/`)
- **EQUIP:** one section per project. Wide windows (≥ 820 px) put the pictures left and the text
  right: name + tag, context, summary, "what I did", facts (stack, notes, repo, demo). Bosa
  Digital: text only, tag CLASIFICADO / CLASSIFIED.
- **ALCHEMY:** one section per tier, rows of group → items joined by ·. No levels.
- **STATS:** Profile (portrait in an ink screen at ×round(1.5 × scale), name, role, rows, bio),
  Education, Quest log.
- **COMMS:** contact rows (web links and the CV page open a new tab with a hidden "(opens in a new
  tab)", the PDF downloads, email opens the mail app) and the language as a native radio group
  with pixel radios.
- **Media** inside windows is not pixelated: screenshots (WebP 640/1280, lazy, sizes reserved) and
  the 14 s muted Capyroad video sit crisp in a 1u `ink` + 1u `stone-3` frame, a screen within the
  screen. Autoplay and loop only without reduced motion.

### Banner (`BannerWindow`)
Gold rope nine-slice drawn 6u thick (`border-image-repeat: round`) around a `blue-1`/`blue-2`
2×2 checker fill with 1u `blue-0` inner lines. Title in `text` with a 1u `ink` hard shadow; on
mouse-and-keyboard devices a `[← →] ROTATE · [ENTER] OPEN` hint.

### Ring menu (`RingMenu`, geometry in `src/game/ring.ts`)
16×16 icons drawn at 2 scene px per pixel on an ellipse (rx 124, ry 84) around Yeray's middle
(320, 255); slots spread over 360° for the visible count (4 live, 6 in development). The active
slot sits at the top inside the blue brackets, its label above in `green-1` on an `ink` plate.
Turns in 8 whole frames, the short way round; after the intro it opens by spreading out from
Yeray in 6 steps of 2 frames while turning one slot. ARIA `menu` with roving focus; ←/→ turn,
Enter/Space open, a click or tap opens a slot, a sideways swipe turns.

### HUD (`Hud`)
Bottom corners of the scene: stone panels (window bevel) with the portrait in an `ink` screen of
64×76 portrait px (Yeray's head to the vest collar; Null's face centred) and the name in `gold-3`.
Zoom round(scale / 2). Portrait screens: below the scene, name beside the portrait, VER CV in the
middle. No bars: there are no real numbers to show.

### Game labels on ink plates (ES/EN, SKIP INTRO, VER CV, key caps)
Jersey 10 `text-dim` on `ink` with the plate underside; hover turns the text `gold-3`; the active
language is `ink` on `gold-3`. Key caps are `<kbd>` in `gold-3` on `ink`. On touch screens the hit
area grows to 44 px tall without changing the look.

### Title screen (`src/scenes/title/`)
Landscape drawn in code from the palette (1 art pixel = 2 scene px): `night-0` sky with sparse
stars, hard bands and checker dithers down to a `horizon` glow line, the cave mountain in
`night-1` with the dark arch at its foot, and a dense treeline of pointed firs (one-pixel tips,
four stepped tiers, bases wider than their spacing so they always overlap) with a clearing of
whole trees before the cave. Any key, click or tap starts (not Tab, modifiers, Escape or the
controls); PRESS START blinks 32 on / 16 off, never when focused or with reduced motion.

### Camp scene and cave intro (`src/scenes/camp/`)
Yeray's generated camp image as it is (re-encoded WebP, never snapped to a grid), filling the
scene's height. Yeray stands at x 320 with his feet on y 310, Null sits at (376, 312), both on
dithered shadow ellipses. The campfire flickers by re-toning the image's own flame pixels in 3
variants every 110 ms. The intro happens in the same scene: the fade reveals Yeray at the cave
mouth (x 283–358, floor y 112) with Null a step behind; a data script walks Yeray down at 60 px/s
and Null at 68 px/s, then a trot to his spot and a sit; 4.7 s with the ring opening; skippable by
any key, click or SKIP INTRO; paused while the tab is hidden.

### Scene transition (`DitherTransition`)
A full-page cover that darkens through 4×4 Bayer steps (¼ → ½ → ¾ → solid `night-0`), 4 frames
each, 16 out and 16 in; the next scene appears while it is fully dark.

### Characters
Yeray's references on their native pixel grid (`npm run characters`), never redrawn, repainted or
resampled; drawn at whole CSS px per image pixel. Walk cycles use the approved "sello": one head
stamped on every frame, whole-pixel body bob, the front step mirrored (8 frames × 120 ms). Null:
sit (drawn at ½), 6-frame trot, 3-frame front walk, the front walk's first drawing as a still.
Ring icons (16×16): EQUIP vest, ALCHEMY flask, STATS scroll, BUFFS dumbbell, CRAFT paella pan,
COMMS letter, drawn on the shared palette.

### CV page (`/cv/`, `/cv/en/`)
Plain HTML made at build time from the same content, no JavaScript. `night-0` page, Pixelify body,
`gold-3` Jersey name and headings, square gold bullets, label/value rows like the windows, a gold
key-cap PDF button. Print: ink on paper, no buttons, nothing split across pages (2–3 A4 pages).

### Motion timing
All motion is stepped; 1 frame = 1/60 s. If a device can't hold 60 fps, the game loop drops to a
steady 30 (every other refresh) for the rest of the visit.

| Moment | Frames | Notes |
|---|---|---|
| Window open / close | 18 (9 steps) / 10 (5 steps) | Vertical `clip-path` wipe |
| Ring rotate | 8 | Per slot, shared game loop |
| Ring opening | 12 (6 steps × 2) | After the intro |
| Cave intro | ≈ 280 (4.7 s) | Scripted walk |
| Walk cycles | Yeray 8 × 120 ms; Null trot 6 × 110 ms, front 4 × 160 ms | `docs/animacion-caminar.md` |
| PRESS START, "more below" arrow | 32 on / 16 off | Hard on/off |
| Scene transition | 16 out + 16 in | Bayer dither steps |
| Campfire | 3 variants, 110 ms | Ambient |

## Do's and Don'ts

### Do:
- **Do** measure every frame, gap and padding in `--u` (2–8 CSS px) and every scene position in
  whole scene pixels.
- **Do** take colours only from `palette.ts` / `tokens.css` and list every new text/background
  pair in `CONTRAST_PAIRS`.
- **Do** keep gold as the single warm accent (The One Warm Light Rule).
- **Do** animate in whole frames with `steps()` or the game loop, and give reduced motion an
  instant equivalent that keeps the same state change.
- **Do** keep the CV reachable from every screen in one click (VER CV) and the facts plain.
- **Do** show Yeray's characters and backgrounds exactly as he made them.

### Don't:
- **Don't** use border-radius, blurred shadows, transparency for shading or smooth gradients.
- **Don't** put text on `stone-2`, `stone-3` or `stone-4`.
- **Don't** use emoji or unicode glyphs as icons.
- **Don't** write raw hex outside the palette files.
- **Don't** invent stats, levels or percentages, or show the phone number on the web.
- **Don't** copy any existing game's logo, lettering, sprites, fonts, music, names or outfits.
