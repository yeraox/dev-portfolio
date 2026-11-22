// Single source of truth for every color in the project.
// - UI_PALETTE: scenes + interface (max 32 colors). Mirrored as CSS variables in tokens.css;
//   a test fails if both files drift apart.
// - Characters (Yeray, Null, portraits) and the ring icons are NOT drawn with this palette: they
//   are Yeray's reference images (src/assets/characters and src/assets/icons, made by
//   scripts/sprites/cutout.mjs and icons.mjs) and keep the references' own colours.

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
  'red-2': '#ff6b5b', // red text on the window's dark stone (the note under Animations)
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

export const UI_PALETTE_MAX = 32;
