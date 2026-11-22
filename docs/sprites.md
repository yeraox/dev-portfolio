# How the art is made

Every character, ring icon and background in the game is one of Yeray's own reference images
(`references/`, private and git-ignored: they are never published as they are, and production
code never imports them). Scripts turn them into the small files the game uses. They **cut out,
find the image's real pixel grid, re-tone the skin and compose frames**; they never paint a pixel.
Each script runs quality checks and stops with an error when one fails.

| Command | Makes | From |
|---|---|---|
| `npm run characters` | `src/assets/characters/*.png` + `characters.gen.ts` | `references/grandes/`, `references/portraits/` |
| `npm run icons` | `src/assets/icons/*.png` + `icons.gen.ts` (the ring's icons and the flags) | `references/icons/` |
| `npm run scenes` | `src/assets/scenes/*.webp` + `scenes.gen.ts` | `references/grandes/campamento.jpg` |
| `npm run stack-icons` | `src/assets/stack/` (one 16×16 atlas) | Simple Icons (CC0) + generic icons drawn in code |
| `npm run hobby-icons` | `src/assets/about/` (one 16×16 atlas) | generic icons drawn in code |

The first three need ffmpeg. Review them on `/dev/personajes` (development only), next to the
references, at the scale the game uses.

## Characters: the native grid

The references are pixel art drawn bigger than they look: each "pixel" is a block of 3–11 image
pixels, blurred by JPEG. `scripts/sprites/cutout.mjs` (with `lib.mjs`):
1. measures that block size (the pitch) or takes it from the image's settings;
2. rebuilds the figure at one pixel per block, in its original colours;
3. removes the background, its tinted fringe and loose specks;
4. saves a tiny transparent PNG.

The game draws it at a whole number of screen pixels per pixel, with `image-rendering:
pixelated`, so it looks exactly like the reference. Yeray's images are drawn at 1 scene pixel per
pixel; Null's at ½ (his references are drawn finer).

## Walk cycles: the "sello"

Detailed pixel-art characters keep their head identical on every frame; only arms and legs
change. `scripts/sprites/walk.mjs` builds each cycle from the walk sheets that way:

| Rule | Value |
|---|---|
| Canvas | fixed for every frame of a direction, centred on the head (Yeray front 46×113, side 65×110) |
| Ground | the soles' row, 109; the cycle walks "on the spot" and the game moves the character |
| Head | taken from one reference frame and **stamped on every frame**: 0 different pixels |
| Bob | everything above the waist (row 70) moves down 0, 1 or 2 pixels; arms hanging below it move whole; legs stay on the ground |
| Frames | 8 per cycle: contact (+1), down (+2), pass (+1), up (0), and the same with the other leg |
| Front step | the other leg's step is the first one **mirrored**; the head is never mirrored, so the hair stays on its side |
| Left | the right-facing side cycle, flipped |
| Timing | Yeray 8 × 120 ms (≈ 0.96 s, two steps); Null 8 × 70 ms |

Each direction is one PNG with its drawings stacked; `characters.ts` lists the frames of each
pose. Still poses are the cycle's "up" frame, so starting or stopping a walk changes nothing.

**Null** walks from his own 8-frame front sheet (pitch 3.75), through the same method: the head
(rows 0–44) of frame 0 stamped, frame 3 as the step and its mirror, the waist at row 70. He is
drawn at ½ like his sitting picture, so he is one size standing, walking and sitting.

**Checks** (`npm run characters` stops if one fails): the head is identical on every frame; the
bob is exactly 0 / +1 / +2; no background-tinted pixels on the outline; no loose islands; the feet
on the ground row.

## Yeray's skin tone

His generated references draw his skin darker than it is, so `scripts/sprites/skin.mjs` re-tones
**only the skin pixels** of his images:
1. a pixel is skin when its colour has skin proportions (green and blue against red) and it is
   above the knees (boots and trousers have browns too);
2. each image measures its own skin (5th, 50th and 99th percentile of brightness);
3. each skin pixel takes the chosen tone's colour at its brightness (shadow, main, light), so the
   shading keeps its order.

A check makes sure nothing but skin changed. The tone is a constant in `cutout.mjs` (`SKIN_TONE`,
tone 2, "claro"); `npm run characters -- --skin=1|2|3|none` tries another.

## Idle actions

Yeray pushes up his glasses, drinks his coffee and thinks; Null tilts his head, wags his tail and
scratches his ear. The action sheets (`references/grandes/reposo/`) start and end on the still
pose, but the image generator redraws it a little differently each time. So
`scripts/sprites/idle.mjs` never uses a sheet frame whole:
1. each frame is rebuilt on its native grid and compared with the sheet's own first frame;
2. only what changed (a tilted head, a raised arm, a mug, a wagging tail) is kept, in groups of
   touching pixels;
3. each group is laid over the character's in-game still drawing, moved up to 1 px to fit its own
   surroundings. A changed face is laid as a whole (eyes, brows, glasses, moustache together), and
   a hand comes with what it holds;
4. the generator's noise is left out: specks, thin streaks, groups only along the outline, and
   groups that do not fit their surroundings.

Everything else *is* the in-game drawing, so an action starts and ends without a jump. Checks:
frame 0 is identical to the still drawing; the sheet's first frame differs from the drawing in at
most 12 % of its pixels (25 % for parts that stick out, like a tail); the seam around each change
stays under 6 %.

## Portraits

Null's HUD portrait is his portrait picture whole, minus its 11-pixel gold frame (115×115).
Yeray's is no file: the HUD shows his in-game front drawing itself, enlarged, so it keeps the
game's pixels.

## Ring icons and flags

`scripts/sprites/icons.mjs` removes each icon's background (a fill from the image's border that
stops at the icon's dark outline) and reduces it to the scene's grid by averaging: 28 scene pixels
on its longest side, 1 icon pixel = 1 scene pixel, its own colours. The light 1-pixel outline that
makes the dark ones readable on the camp's earth is added in CSS.

## STACK and hobby icons

16×16, in the palette's `text` colour, all of a window's icons in one PNG (an atlas) and a
generated index that must name every technology or hobby (TypeScript fails otherwise).
`scripts/stack-icons.mjs` draws each Simple Icons logo 8× bigger in a browser canvas and lights a
pixel when the logo covers half of it; technologies without a logo, and every hobby
(`scripts/hobby-icons.mjs`), get a generic icon drawn as a 16×16 grid of `#` in the script. Both
share `scripts/lib/atlas.mjs`.

## Scenes

`scripts/sprites/scene.mjs` only re-encodes the camp background as WebP. Snapping it to its pixel
grid blurred its half-pixel details (the dumbbells, the tent's rope, the tripod), so it is used as
it is, filling the scene's height. The campfire's flicker re-tones the image's own flame pixels in
three variants; nothing is drawn over it.
