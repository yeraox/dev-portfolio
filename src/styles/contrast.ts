import { UI_PALETTE, type UiColor } from './palette';

// WCAG 2.x relative luminance of a #rrggbb color.
function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(a: string, b: string): number {
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
  { fg: 'text', bg: 'stone-0', min: 4.5, use: 'Window text on dark stone; the STACK icons' },
  { fg: 'text', bg: 'stone-1', min: 4.5, use: 'Window text and STACK icons on stone (worst texture pixel)' },
  { fg: 'text-dim', bg: 'stone-1', min: 4.5, use: 'Secondary window text; the HUD\'s HP and XP labels' },
  { fg: 'text-dim', bg: 'stone-0', min: 4.5, use: 'The HUD\'s HP and XP labels on the darkest stone pixels' },
  { fg: 'gold-3', bg: 'stone-1', min: 4.5, use: 'Window headings' },
  { fg: 'green-1', bg: 'stone-1', min: 4.5, use: 'Status "in progress" in windows' },
  { fg: 'gold-3', bg: 'ink', min: 4.5, use: 'Key caps in KeyHint; the title\'s CV name, hovered or focused' },
  { fg: 'ink', bg: 'gold-3', min: 4.5, use: 'Key cap of the close button, hovered or focused; the chosen CV answer (YES / NO)' },
  { fg: 'gold-3', bg: 'stone-0', min: 4.5, use: 'HUD names and gold headings on the darkest stone pixels' },
  { fg: 'text', bg: 'blue-1', min: 4.5, use: 'Banner title' },
  { fg: 'text', bg: 'blue-2', min: 4.5, use: 'Banner title (dither light pixel)' },
  { fg: 'gold-3', bg: 'night-0', min: 4.5, use: 'Title lettering; the CV links of the no-JavaScript note' },
  { fg: 'text', bg: 'night-1', min: 4.5, use: 'Credit lines, help bar' },
  { fg: 'text', bg: 'night-0', min: 4.5, use: 'Title credits and PRESS START over the night sky; the no-JavaScript note' },
  { fg: 'text-dim', bg: 'ink', min: 4.5, use: 'Language buttons, SKIP INTRO, the ring names and the CV answers (ink plates)' },
  { fg: 'green-1', bg: 'ink', min: 4.5, use: 'Name of the active ring slot (on its ink plate)' },
  { fg: 'blue-3', bg: 'ink', min: 3, use: 'Selection brackets / focus ring; the HUD\'s XP fill in its ink track' },
  { fg: 'stone-3', bg: 'earth-0', min: 3, use: 'Light outline of the ring icons over the camp\'s dark earth' },
  { fg: 'red-1', bg: 'ink', min: 3, use: 'Stat bar and HUD HP fill in their ink track' },
];

export function ratioFor(pair: ContrastPair): number {
  return contrastRatio(UI_PALETTE[pair.fg], UI_PALETTE[pair.bg]);
}
