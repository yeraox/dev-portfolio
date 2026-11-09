// Single source of truth for every color in the project.
// - UI_PALETTE: scenes + interface (max 32 colors). Mirrored as CSS variables in tokens.css;
//   a test fails if both files drift apart.
// - AVATAR_PALETTE / NULL_PALETTE: one palette per character, max 15 colors + transparent,
//   like a real 16-bit sprite palette.

// TS concept — `Record<K, V>`: an object whose keys are of type K and values of type V.
// Here: any string name → a hex color string.
export type Palette = Record<string, string>;

export const UI_PALETTE = {
  // Outline / darkest ink (never pure black)
  ink: '#0b0b1a',

  // Night sky (title screen, scene darks)
  'night-0': '#070912',
  'night-1': '#0e1328',
  'night-2': '#18203f',
  horizon: '#2f4a8a',
  'horizon-hi': '#5b7fc7',

  // Banner blue (dithered pairs) + selection brackets
  'blue-0': '#121a52',
  'blue-1': '#1f2d8a',
  'blue-2': '#2f45b8',
  'blue-3': '#5d74e0',

  // Stone window panels (0–1 = text background, 2–4 = bevels and frames only)
  'stone-0': '#2a2a2e',
  'stone-1': '#45454b',
  'stone-2': '#5f5f66',
  'stone-3': '#7c7c84',
  'stone-4': '#a3a3ab',

  // Gold (title lettering, rope frame, HUD caps)
  'gold-0': '#4a2c08',
  'gold-1': '#8a5a12',
  'gold-2': '#d19a22',
  'gold-3': '#f2c84b',
  'gold-4': '#fff0a8',

  // Text
  text: '#f2f0e6',
  'text-dim': '#c9c5b6',

  // Accents
  'green-0': '#2a7a2a',
  'green-1': '#6fdc5a',
  'red-0': '#8a1a1a',
  'red-1': '#d8483f',
  fire: '#e8742a',

  // Forest + earth (camp scene)
  'forest-0': '#0f2418',
  'forest-1': '#1e3a24',
  'forest-2': '#355a32',
  'earth-0': '#2a1d14',
} satisfies Palette;
// TS concept — `satisfies`: checks the object matches `Palette` but keeps the exact key names,
// so `UI_PALETTE['gold-3']` autocompletes and a typo like `UI_PALETTE['gold-9']` is an error.

export type UiColor = keyof typeof UI_PALETTE;

// Shared by both characters so they read the same against dark scenes.
const RIM_LIGHT = '#f2a65a'; // warm campfire-side highlight

export const AVATAR_PALETTE = {
  ink: UI_PALETTE.ink,
  'hair-0': '#3b2418', // also mustache and darkest boot shade
  'hair-1': '#5a3a26', // also goatee
  'hair-2': '#7a5236', // curl highlights, backpack straps
  'skin-0': '#e8b896',
  'skin-1': '#c48e6c',
  'vest-0': '#4f5d2f',
  'vest-1': '#6b7a3d',
  'vest-2': '#8a9a52',
  'tee-0': '#e8e4d8', // also glasses glint
  'tee-1': '#b8b2a2',
  'cargo-0': '#b89a6a',
  'cargo-1': '#8f7650',
  boots: '#5a3a22',
  rim: RIM_LIGHT,
} satisfies Palette;

export const NULL_PALETTE = {
  ink: UI_PALETTE.ink,
  'coat-0': '#1e1a1a',
  'coat-1': '#3a3030',
  'coat-hi': '#4a5068', // blue-tinted highlight so the black coat never vanishes
  'tan-0': '#b07a3c',
  'tan-1': '#d39a55',
  'eye-white': '#ffffff',
  'tongue-0': '#e06a8a',
  'tongue-1': '#a8405e',
  rim: RIM_LIGHT,
} satisfies Palette;

export const UI_PALETTE_MAX = 32;
export const SPRITE_PALETTE_MAX = 15; // + transparent = 16
