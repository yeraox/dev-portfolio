---
name: Yeray Caturla — 16-bit portfolio
description: A personal portfolio as an original 16-bit action-RPG night camp, with the CV one step away.
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
  red-2: "#ff6b5b"
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
---

# Design System: Yeray Caturla — 16-bit portfolio

> Colour hexes live in `src/styles/palette.ts` (mirrored in `tokens.css`; a test fails on drift);
> the frontmatter repeats them for tools. The sidecar `.impeccable/design.json` carries motion,
> shadows and component snippets. How the characters are made: `docs/sprites.md`.

## Overview

**Creative North Star: "The Campfire"**

A quiet night in an original 16-bit action-RPG: a night-blue title with embossed gold lettering, a
cave mouth opening onto a small camp, and stone-and-gold windows that hold Yeray's real CV. Warm
light appears only where it matters, like a campfire in the dark: the gold of the name, the key
caps, the selected tab, the chosen answer. Everything else is night, stone and crisp pixels. The
interface is part of the world, not a website laid over a game, and the world invites you to sit
for a while, but never makes you play: the CV is one step away from the first screen.

Density is low and deliberate: one scene, one ring of seven icons, one window at a time. Content
inside the world is plain, factual and fast to scan; the game frames it and never distorts it (no
invented levels, stats or percentages). Motion is stepped in whole frames, never eased; depth is
bevels and hard pixel edges, never blur. Never a copy of any existing game's assets.

**Key Characteristics:**
- Fixed 640×360 scene scaled by whole screen pixels; a UI pixel (`--u`) that grows with it.
- Night palette of 32 colours; gold is the only warm accent in the interface.
- Two self-hosted pixel faces: Jersey 10 for game labels, Pixelify Sans for reading.
- Flat stone windows with engraved bevels, a gold-rope banner, blue selection brackets.
- Stepped motion in frames; dithered fades; animations off by choice or by the system.
- Characters and backgrounds are Yeray's own images, shown as they are.

## Colors

A cold night palette (navy, granite, ink) with one warm voice, gold, and small functional
accents. Source of truth: `src/styles/palette.ts`.

### Primary
- **Campfire Gold** (`gold-3`): the interface's one warm accent. Title lettering band, window
  and section headings, key-cap letters, selected tab, tags, links, HUD names, hobby names, the
  chosen answer or setting. Its ramp: **Gold Shadow** (`gold-0`, extrusion), **Bronze** (`gold-1`,
  rope and hard underside), **Old Gold** (`gold-2`, title lower band, pixel bullets), **Pale Gold**
  (`gold-4`, title highlight band).

### Secondary
- **Banner Royal** (`blue-1`) and **Banner Bright** (`blue-2`): the banner's 2×2 checker dither,
  with **Banner Navy** (`blue-0`) for its inner lines. **Bracket Blue** (`blue-3`): selection
  brackets, every focus ring and the XP fill.

### Tertiary
- **Lime Label** (`green-1`): the ring's active name and the "in progress" status. **Moss**
  (`green-0`) is its shade. **Ember Red** (`red-1`) with **Blood** (`red-0`): the HP fill only.
  **Warning Red** (`red-2`): text, only the note under Animations in SETTINGS (5.2:1 on
  `stone-0`). **Campfire Orange** (`fire`): the scene's flame.

### Neutral
- **Midnight Ink** (`ink`): every outline, plate and track. Never pure black.
- **Deep Night** (`night-0`): page background, letterbox, title sky, dither fades. **Night
  Mountain** (`night-1`) and **Dusk Band** (`night-2`): title-sky bands and the mountain;
  **Horizon Blue** (`horizon`) and **Starlight Blue** (`horizon-hi`): the horizon glow and stars.
- **Granite** (`stone-0`, `stone-1`): `stone-0` is the flat fill of every window; the HUD panels
  keep a 32×32 granite tile of both. The only surfaces text may sit on in the interface.
  **Granite Bevels** (`stone-2`, `stone-3`, `stone-4`): bevels, engraved lines, plate undersides,
  the ring icons' outline; never under text.
- **Parchment** (`text`) and **Weathered Parchment** (`text-dim`): body and secondary text; `text`
  is also the colour of the STACK and hobby icons.
- **Forest** (`forest-0..2`) and **Earth** (`earth-0`): low-contrast scenery, so characters and
  UI dominate.

Characters (Yeray, Null, portraits), ring icons and scene backgrounds keep their references' own
colours: they are Yeray's images, not drawn with this palette.

### Named Rules
**The One Warm Light Rule.** Gold is the only warm colour in the interface. If something new
needs emphasis, it gets gold or nothing; never a new hue. (Red is a warning, never emphasis.)

**The Listed Pairs Rule.** Every text/background combination in use is listed in
`CONTRAST_PAIRS` (`src/styles/contrast.ts`) and tested: 4.5:1 for text, 3:1 for brackets, bars
and focus rings. Lowest text pair: `text-dim` on `stone-1` (the HUD's labels on the granite tile).

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
  letter-spacing 0.08em, uppercase): game labels, banner title, section headings, HUD names,
  SKIP INTRO, the title's CV and SETTINGS plates, SETTINGS' rows and choices, the CV question's
  YES / NO, title credits (10 × round(scale)).
- **Body** (Pixelify Sans 400, `--text-size` = 13 scene px, min 16: 26 px at 1440, 39 at 1920;
  line-height 1.35; paragraphs ≤ 65ch): everything inside windows. Entry titles in 700.
- **Label** (Pixelify Sans 400, `--text-small` = 10.5 scene px, min 14): meta lines, help line,
  SETTINGS' note and privacy line, the ring's names (uppercase, letter-spacing 0.04em: they are
  real names in the visitor's language, so Pixelify speaks; at 14 px all seven fit around Yeray on
  a phone).
- **No-JavaScript note** (rem): Pixelify 1.125rem / 1.5 in `text` on `night-0`, links `gold-3`.

### Named Rules
**The Two Voices Rule.** Jersey 10 speaks for the game (labels, titles, buttons); Pixelify Sans
speaks for Yeray (facts to read). Never set a paragraph in Jersey 10 or a game label in Pixelify.

**The English Labels Rule.** Game labels stay English in both languages (PRESS START, SKIP INTRO,
the key hints, ESC EXIT, HP, XP); the ring's names, titles, help and content are translated. The
game names of the sections (ALCHEMY, EQUIP, STATS, JOURNAL, COMMS) live in the window titles,
translated.

## Layout

- **Scene:** a fixed internal resolution of **640×360** (16:9), drawn on a `<canvas>` in screen
  pixels. Scale = the largest whole number of screen pixels per scene pixel that fits, unless
  that leaves the scene under 80 % of the exact fit, then the exact fit. 1440×900 → ×2,
  1920×1080 → ×3, 2560×1440 → ×4. Letterboxed in `night-0`.
- **Portrait screens (tall mode):** the camera shows the middle 360×360 of the scene (the ring,
  Yeray and Null fit in it), with the banner above the scene and the HUD below. Phone 390×844
  → 360×360 CSS px; tablet 768×1024 → 720×720. Windows open as full-screen sheets.
- **UI pixel (`--u`)** = 2 scene pixels, clamped 2–8 CSS px: 2 on phones, 4 at 1440, 6 at 1920,
  8 at 2560. Every frame, bevel, gap and padding is a multiple of it; media queries in
  `tokens.css` are the fallback until JavaScript sets the tokens.
- **Windows** cover the scene, 4u in from its edges; the frame, title and help line stay put while
  the content changes, and only the text scrolls. Inside: label/value rows with an 8.5em label
  column from 480 px (stacked below), two columns from 820–1024 px of window, section layouts by
  the window's own width (container queries).
- **Title:** the landscape fills the screen; the name, credits and PRESS START sit in the sky
  above the peak; SKIP INTRO bottom right, and in the top corners (4u in) the ring's own icons at
  the scene's pixel size under their name plates: the CV's parchment (left) and the SETTINGS gear
  (right). They open the same windows as the ring's CV and gear (SETTINGS without BACK TO TITLE)
  and never start the game. The intro and the camp have no corner link: the camp's CV is in the
  ring.

## Elevation & Depth

Flat pixel depth only: bevels, engraved grooves and hard offset edges, never blur or
transparency. Raised surfaces (windows, HUD panels) have a light bevel top-left and an ink edge
bottom-right; recessed things (portrait screens, dividers, the engraved groove) invert it. The
banner is lifted by its gold rope frame, not by a shadow. Ground shadows under the characters are
dithered ellipses: half the pixels in `ink`, no alpha.

### Shadow Vocabulary
- **Window bevel** (`inset var(--u) var(--u) 0 stone-3, inset calc(-1 * var(--u)) calc(-1 * var(--u)) 0 ink, 0 0 0 var(--u) ink`):
  every window and HUD panel.
- **Plate underside** (`inset 0 calc(-1 * var(--u)) 0 stone-2`): ink plates of key caps,
  SKIP INTRO, the title's CV and SETTINGS plates, SETTINGS' choices and the CV question's answers.
- **Icon outline** (four zero-blur `drop-shadow`s of one scene pixel in `stone-3`): the ring's icons
  and the title's parchment and gear.
- **Title extrusion** (`drop-shadow(0 var(--u) 0 gold-1) drop-shadow(0 var(--u) 0 gold-0) drop-shadow(var(--u) var(--u) 0 ink)`):
  the gold name only.

### Named Rules
**The Zero-Blur Rule.** Every shadow has a blur of 0 and a whole-pixel offset. A soft shadow is a
different era.

## Shapes

Square everywhere: no border-radius on anything (`rounded.none`). Corners and edges are drawn
as pixel art: the HUD's granite is a 32×32 generated tile, the banner's gold rope is an 18×18
nine-slice (6-px cells: knot corners, twisted edges), the selection brackets an 8×8 nine-slice of
four blue corners. Scaled pixel art always uses `image-rendering: pixelated`; bullets are 2u
squares with a pixel shadow.

**The Square Pixel Rule.** If it isn't a whole number of pixels, square, it doesn't belong.

## Components

### Window (`src/components/Window`)
Flat `stone-0` panel (one even colour behind long text), the window bevel, an engraved groove 3u
inside the edge (`ink` top-left, `stone-3` bottom-right), padding 7u. Optional title (headline,
`gold-3`), top-right hint slot, bottom help slot. Opens with a top-to-bottom `clip-path` wipe (18
frames in 9 steps), closes with a 10-frame reverse; once open nothing stays clipped, so the 1u
`ink` outline around it shows. With animations off it simply appears and disappears.

### Section window (`SectionDialog`)
A native modal `<dialog>` holding a Window (`showModal`: the rest of the page is inert, no focus
trap of our own; scroll never chains to the page behind). It opens with the focus on the dialog
itself (`tabindex="-1"`, no focus ring: it is not a control); the CV's question and SETTINGS then
focus their first answer. Esc or the `[ESC] EXIT` button closes it, then focus returns to the slot
that opened it. No backdrop dimming. It only appears once its content has downloaded, so nothing
shifts. On touch screens the close button's hit area reaches 44 px.

### Window sections (`WindowSections`)
Content split into sections, one at a time, with ARIA tabs on top. ← → change section from
anywhere in the window (on a tab the focus follows; Home and End too), a click or tap on a tab
opens it, a sideways swipe on touch. The mouse wheel, ↑ ↓, Page Up / Down and (off the tabs)
Home / End only scroll the section's text, from anywhere in the window too, so the text is not a
focus stop and never shows a focus ring. Only the text scrolls: it is the containing block of
anything positioned inside it (the hidden "(opens in a new tab)" notes), so nothing stretches the
window's body. The selected tab sits on an `ink` plate in `gold-3` with the pixel bullet as cursor
(an outline in Windows' high-contrast mode). The tabs stay on one row: the ones not chosen shrink
and end in "…", the chosen one always shows its whole label (badges sit inside the label, so they
are cut first). The other sections stay in the page hidden "until found": the browser's
find-in-page searches them and a match opens its section. A gold pixel arrow blinks (32 on / 16
off) while there is more below. Paragraphs, rows and list items wrap without a lonely last word.

### Content windows (`src/windows/`)
- **Projects (ALCHEMY):** one section per project (Capyroad, Pakito's Gambling, this portfolio).
  Wide windows (≥ 820 px) put the pictures left and the text right: name + tag, context, summary,
  "why" (Yeray's reasons, right after the summary: the story before the details), "what I did",
  facts (stack, notes, repo, demo). The Bosa Digital internship is not a project (its NDA leaves
  nothing to show); it lives in the profile's quest log.
- **Stack (EQUIP):** one section per tier, rows of group → technologies, each with its 16×16
  icon before its name (`npm run stack-icons`: Simple Icons logos without smoothing, generic pixel
  icons for SQL, REST APIs, Java, AWS, WSL and Oracle), in `text`, about as tall as a line (32 CSS
  px at 1440, 16 on a phone, whole screen pixels). No levels.
- **Profile (STATS):** Profile (portrait in an ink screen at ×round(1.5 × scale), name, role, rows,
  bio), Education, Quest log.
- **About me (JOURNAL):** Developer: five short paragraphs (where he comes from, what hooks him,
  how he works, in a team, what he is looking for). Personal: a line, then six hobbies (two
  columns from 820 px of window), each with a 16×16 icon in `text` (`npm run hobby-icons`: star,
  gamepad, dumbbell, basketball, frying pan, paw print, drawn in code like STACK's generic icons),
  its name as a gold game label and two or three sentences.
- **Contact (COMMS):** contact rows (web links open a new tab with a hidden "(opens in a new
  tab)", the PDF downloads, email opens the mail app). The language is chosen in SETTINGS.
- **Media** inside windows is not pixelated: screenshots (WebP 640/1280, lazy, sizes reserved) and
  the 14 s muted Capyroad video sit crisp in a 1u `ink` + 1u `stone-3` frame, a screen within the
  screen. Autoplay and loop only with animations on.

### Banner (`BannerWindow`)
Gold rope nine-slice drawn 6u thick (`border-image-repeat: round`) around a `blue-1`/`blue-2`
2×2 checker fill with 1u `blue-0` inner lines. Title in `text` with a 1u `ink` hard shadow; on
mouse-and-keyboard devices a `[← →] ROTATE · [ENTER] OPEN` hint.

### Ring menu (`RingMenu`, geometry in `src/game/ring.ts`)
Seven slots: projects (a flask), stack (a vest), profile (a silhouette), about me (a book),
contact (a telephone), CV (a parchment), settings (a gear). Icons 28 scene px on their longest
side, 1 icon pixel = 1 scene pixel, each with a hard 1-scene-pixel `stone-3` outline (zero-blur
drop shadows) so the dark ones read on the earth.

An egg around Yeray's middle (320, 255), not an ellipse: a half-width that grows evenly from the
top (`rxTop` 56) to the bottom (`rxBottom` 156), and a lower half deeper than the upper one
(`ryTop` 88, `ryBottom` 101). The active slot sits over Yeray's head; the upper side slots sit
58.5 px from him, leaving the campfire and the dumbbells in view; the side ones 114 px, beside
Null; the lower ones 91 px below the centre, their names under Null's paws.

**Every slot shows its name above its icon, always:** Pixelify `--text-small` uppercase on an
`ink` plate, `text-dim`; the active one sits at the top inside the blue brackets, its name in
`green-1` above them. No name ever covers another name, an icon, Yeray, Null or the HUD, in any
of the seven positions the ring can stop in (`check:camp` measures it at 390/768/1440 in both
languages, against Null's real outline).

Turns in 8 whole frames, the short way round; after the intro it opens by spreading out from
Yeray in 6 steps of 2 frames while turning one slot; the names appear once it has opened. ARIA
`menu` with roving focus; ←/→ turn, Enter/Space open, a click or tap opens a slot, a sideways
swipe turns.

- **CV:** a compact question window ("Download the CV as a PDF?", the file's language and size,
  YES / NO on `ink` plates, the chosen one `ink` on `gold-3`, YES first).
- **SETTINGS:** a compact window with ESC EXIT. Language (Español / English, each with its flag)
  and Animations (ON / OFF), two toggle buttons per row on `ink` plates, the one in use `ink` on
  `gold-3`; it starts on the language in use. Under Animations, a note in `red-2` (a polite live
  region, the row's description) says what moves or what stands still. Animations OFF stops
  everything that moves by itself; without a choice, the system's reduced-motion preference
  decides (and the note says so), and a choice wins over it (`src/engine/motion.ts`, CSS
  `:root[data-motion='on']`); both choices are remembered. In the camp, a BACK TO TITLE plate
  closes SETTINGS and fades back to the title. At the bottom, after an engraved line, a `text-dim`
  line: no cookies or analytics, only the language, settings and progress kept in the browser.

### HUD (`Hud`)
Bottom corners of the scene: two granite panels (window bevel), Yeray's on the left and Null's on
the right, mirrored so both portraits sit at the outer edges. In each: the portrait in an `ink`
screen with the engraved `stone-3` edge (`night-1` behind), and beside it the name in `gold-3` and
two game gauges, **HP** and **XP** (Jersey labels in `text-dim`, 24u ink tracks with a 1u margin).
- **Portraits:** Null's is his portrait picture without its gold frame (115×115 on its native
  grid). Yeray's is his in-game drawing (the front image, skin tone included) at twice Null's
  zoom, framed from the hair to the shoulders, centred in whole pixels. The screen is 115 of
  Null's pixels in whole screen pixels: up to 36 UI pixels (115 CSS px on a 1440 laptop), up to 46
  on portrait screens, where the HUD sits in its own row below the scene.
- **HP** (`red-1` fill) is always full: there is nothing real to measure, so screen readers
  don't hear it. **XP** (`blue-3` fill) is the party's experience: a fifth for every section the
  visitor has opened, remembered in the browser (`explored`), heard as "Experiencia: 2 de 5
  secciones exploradas". It grows in 4 hard steps over 16 frames. Never a number about Yeray.
- The profile window shows Yeray's face the same way in an ink screen, from the hair to the
  collar, up to 48 UI pixels (about 140 CSS px on portrait screens).

### Game labels on ink plates (SKIP INTRO, the title's CV and SETTINGS, YES / NO, key caps)
Jersey 10 `text-dim` on `ink` with the plate underside; hover turns the text `gold-3`; a chosen
option (SETTINGS, the CV question) is `ink` on `gold-3`. Key caps are `<kbd>` in `gold-3` on `ink`.
On touch screens the hit area grows to 44 px tall without changing the look.

### Title screen (`src/scenes/title/`)
Landscape drawn in code from the palette (1 art pixel = 2 scene px): `night-0` sky with sparse
stars, hard bands and checker dithers down to a `horizon` glow line, the cave mountain in
`night-1` with the dark arch at its foot, and a dense treeline of pointed firs (one-pixel tips,
four stepped tiers, bases wider than their spacing so they always overlap) with a clearing of
whole trees before the cave. Credits: "DESARROLLADOR BACKEND JUNIOR · DEVOPS". Any key, click or
tap starts (not Tab, modifiers, Escape or the controls); PRESS START blinks 32 on / 16 off, never
when focused or with animations off.

### Camp scene and cave intro (`src/scenes/camp/`)
Yeray's generated camp image as it is (re-encoded WebP, never snapped to a grid), filling the
scene's height. Yeray stands at x 320 with his feet on y 310, Null sits at (376, 312), both on
dithered shadow ellipses. The campfire flickers by re-toning the image's own flame pixels in 3
variants every 110 ms. The intro happens in the same scene: the fade reveals Yeray at the cave
mouth (x 283–358, floor y 112) with Null a step behind; a data script walks Yeray down at 60 px/s
and Null at 65 px/s, facing the camera and drifting to his spot, then a sit; 4.7 s with the ring
opening; skippable by any key, click or SKIP INTRO; paused while the tab is hidden; none with
animations off.

### Scene transition (`DitherTransition`)
A full-page cover that darkens through 4×4 Bayer steps (¼ → ½ → ¾ → solid `night-0`), 4 frames
each, 16 out and 16 in; the next scene appears while it is fully dark. The same fade goes from the
title to the camp and, with BACK TO TITLE, back.

### Characters
Yeray's references on their native pixel grid (`npm run characters`), never redrawn, repainted or
resampled; drawn at whole CSS px per image pixel (`docs/sprites.md`).
- **Walks** use the "sello": one head stamped on every frame, whole-pixel body bob, the front step
  mirrored. Yeray: 8 frames × 120 ms, front and side. Null: front walk from his 8-frame sheet
  through the same sello (8 frames × 70 ms), drawn at ½ like his sit, so he is one size standing,
  walking and sitting.
- **Idle actions:** Yeray pushes up his glasses, drinks his coffee or thinks (hand on chin); Null
  tilts his head, wags his tail or scratches his ear. Each is built on the in-game still drawing
  (only what changes in the generated sheets is laid over it, as whole regions), so it starts and
  ends without a jump and nothing outside the moving part flickers. Every 3–6 s one plays once
  (0.7–1.6 s), in rounds where each of the six plays once in a random order and the two take
  turns; never both at once; they keep breathing meanwhile; none while a window is open or with
  animations off. Each action's drawings download the first time it plays.
- **Ring icons** (`npm run icons`): Yeray's pixel-art references, cut out of their background and
  reduced to the scene grid, keeping their own colours. The Spanish and UK flags, from the same
  references, mark the languages in SETTINGS.

### Without JavaScript
The game can't run, so a `<noscript>` note (made at build time from the content) says so and links
both CV PDFs, each sentence in its language. Nobody with JavaScript ever sees it.

### Motion timing
All motion is stepped; 1 frame = 1/60 s. If a device can't hold 60 fps, the game loop drops to a
steady 30 (every other refresh) for the rest of the visit.

| Moment | Frames | Notes |
|---|---|---|
| Window open / close | 18 (9 steps) / 10 (5 steps) | Vertical `clip-path` wipe |
| Ring rotate | 8 | Per slot, shared game loop |
| Ring opening | 12 (6 steps × 2) | After the intro |
| Cave intro | ≈ 280 (4.7 s) | Scripted walk |
| Walk cycles | Yeray 8 × 120 ms; Null 8 × 70 ms | `docs/sprites.md` |
| Idle actions | 0.7–1.6 s, every 3–6 s | One at a time |
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
- **Do** animate in whole frames with `steps()` or the game loop, only under
  `:root[data-motion='on']` or `useReducedMotion()`, and give animations off an instant
  equivalent that keeps the same state change.
- **Do** keep the CV one step away: the title's parchment and the ring's CV slot (both ask, then
  download the PDF); keep the facts plain.
- **Do** show Yeray's characters, icons and backgrounds exactly as he made them.

### Don't:
- **Don't** use border-radius, blurred shadows, transparency for shading or smooth gradients.
- **Don't** put text on `stone-2`, `stone-3` or `stone-4`.
- **Don't** use emoji or unicode glyphs as icons.
- **Don't** write raw hex outside the palette files.
- **Don't** invent stats, levels or percentages, or show the phone number on the web.
- **Don't** copy any existing game's logo, lettering, sprites, fonts, music, names or outfits.
