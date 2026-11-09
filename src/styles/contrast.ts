import { UI_PALETTE, type UiColor } from './palette';

// WCAG 2.x relative luminance of a #rrggbb color.
export function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// TS concept — `type` with a union: `min` can only be one of these two numbers.
// 4.5 = WCAG AA for body text; 3 = large text and graphical parts (bars, icons, focus rings).
export type ContrastPair = {
  fg: UiColor;
  bg: UiColor;
  min: 4.5 | 3;
  use: string;
};

// Every foreground/background combination the UI is allowed to use.
// palette.test.ts fails if any of them drops below its minimum.
export const CONTRAST_PAIRS: ContrastPair[] = [
  { fg: 'text', bg: 'stone-0', min: 4.5, use: 'Window text on dark stone' },
  { fg: 'text', bg: 'stone-1', min: 4.5, use: 'Window text on stone (worst texture pixel)' },
  { fg: 'text-dim', bg: 'stone-1', min: 4.5, use: 'Secondary window text' },
  { fg: 'gold-3', bg: 'stone-1', min: 4.5, use: 'Window headings' },
  { fg: 'text', bg: 'blue-1', min: 4.5, use: 'Banner title' },
  { fg: 'text', bg: 'blue-2', min: 4.5, use: 'Banner title (dither light pixel)' },
  { fg: 'gold-3', bg: 'night-0', min: 4.5, use: 'Title lettering' },
  { fg: 'text', bg: 'night-1', min: 4.5, use: 'Credit lines, help bar' },
  { fg: 'green-1', bg: 'ink', min: 4.5, use: 'Ring label (drawn on an ink plate)' },
  { fg: 'blue-3', bg: 'ink', min: 3, use: 'Selection brackets / focus ring' },
  { fg: 'red-1', bg: 'ink', min: 3, use: 'Stat bar fill in its ink track' },
];

export function ratioFor(pair: ContrastPair): number {
  return contrastRatio(UI_PALETTE[pair.fg], UI_PALETTE[pair.bg]);
}
