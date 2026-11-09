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
  resolution: **320×180** (confirmed; 16:9, fills modern screens without side bars).
- **Scale** = the largest whole number that fits the viewport (`floor(min(vw/320, vh/180))`,
  min 1). The canvas is centered and letterboxed with `--night-0`.
- On portrait phones with devicePixelRatio ≥ 2, the scene may fit the viewport width with a
  non-integer CSS scale (pixel unevenness stays ≤ 1 device pixel). Windows then open as
  full-width sheets over the scene.
- **UI pixel (`--u`)**: the interface's own pixel unit for frames, bevels and gaps =
  the scene scale clamped to 2–4 CSS px, so frames line up with the scene's pixel grid.
- Characters: avatar 32×40, Null 24×20, portraits 48×48, ring icons 16×16 (scene pixels).

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

### Character palettes (≤ 15 + transparent each)
`AVATAR_PALETTE` (15) and `NULL_PALETTE` (10). Shared `ink` outline and warm `rim` light on the
campfire side. Null's black coat gets a blue-tinted highlight (`coat-hi`) so it never vanishes.

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
  drop-shadows (`gold-1`, `gold-0`, `ink`) offset by `--u`. 40px mobile, 80px ≥ 768px (×4 / ×8
  of Jersey 10's 10px grid).
- **Window text:** 20px desktop, 16px mobile; line-height 1.35; paragraphs ≤ 65ch; headings in
  Pixelify Sans 700 or Jersey 10 in `gold-3`.
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
| **Selection brackets** | (phase 3) Four `blue-3` corner brackets around the focused item; also the keyboard focus style. |

Window content patterns (from the STATS sheet): section headings Jersey 10 `gold-3`; entry
titles Pixelify Sans 700; meta lines small `text-dim`; "in progress" status `green-1`; bullets
are 2u `gold-2` squares with a `gold-0` pixel shadow; label/value rows use a 7em label column
from 480px up and stack below it. Two columns from 1024px, separated by an engraved line when
stacked. Portraits inside windows render at most ×3 (144px).

## 6. Ring menu (phase 3)
- Icons (16×16 scene px) on an ellipse centered on the avatar: rx 62, ry 42 at 320×180.
- Slots spread evenly over 360° for the *visible* slot count (4–6). Active slot at the top,
  inside selection brackets, label above in `green-1` on an `ink` plate.
- Rotation: 8 frames (~133 ms), all icons advance together. Banner shows the active section.

## 7. HUD (phase 3)
Bottom corners: 48×48 portrait (Yeray left, Null right) with name plate. No invented numbers;
bars only if they show real data.

## 8. Motion
All motion is stepped; 1 frame = 1/60 s.

| Moment | Frames | Notes |
|---|---|---|
| Window open | 18 (9 steps × 2) | Vertical wipe (clip-path in `steps(9)`). 7 frames was too fast to notice |
| Window close | 10 (5 steps × 2) | Reverse wipe, a bit faster than opening |
| Ring rotate | 8 | Per slot step |
| Walk cycle | 4 frames at 8–12 fps | Avatar and Null |
| PRESS START blink | 32 on / 16 off | Hard on/off, never a fade |
| Scene transition | 12–20 | Mosaic or palette-step fade to black |
| Campfire / steam | 2–3 frames at ~6 fps | Ambient |

`prefers-reduced-motion`: no intro walk, instant transitions, ambient loops paused. Adaptive
fallback to 30 fps when frames run long.

## 9. Iconography (16×16, phase 2)
EQUIP vest · ALCHEMY flask · STATS scroll · BUFFS dumbbell · CRAFT paella pan · COMMS letter.
Drawn as sprites on the shared palette. No emoji or unicode glyphs as icons anywhere.

## 10. Media inside windows
Project screenshots and the Capyroad video are **not** pixelated: they sit crisp inside a
1u `ink` + 1u `stone-3` inset frame, a "screen within the screen".

## 11. Never
Copied game assets · border-radius · blurred shadows · smooth gradients · emoji icons · raw hex
outside the palette files · text on `stone-2..4` · fake stats or percentages.
