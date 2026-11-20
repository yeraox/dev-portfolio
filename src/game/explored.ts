// The party's experience: the HUD's XP bar fills as the visitor explores the camp, one
// step for every section window opened. It measures the visit, never Yeray: no invented numbers.
// Remembered in this browser (like `visited`), so a returning visitor keeps what they explored.
import { SLOTS, isSection, type SectionId } from '../content/sections';

const EXPLORED_KEY = 'explored';

/** The live sections (drafts don't count): the XP bar is full when all of them were opened. */
export const XP_SECTIONS: SectionId[] = SLOTS.filter((slot) => slot.status === 'ready')
  .map((slot) => slot.id)
  .filter(isSection);

/** The sections in `saved` (the stored text) that still exist, each once. Pure: tested. */
export function parseExplored(saved: string | null): SectionId[] {
  const names = (saved ?? '').split(',');
  return XP_SECTIONS.filter((section) => names.includes(section));
}

/** `explored` plus `section`, in ring order (the same list back when nothing is new). */
export function addExplored(explored: SectionId[], section: SectionId): SectionId[] {
  if (explored.includes(section) || !XP_SECTIONS.includes(section)) return explored;
  return XP_SECTIONS.filter((each) => each === section || explored.includes(each));
}

// Storage can be missing or blocked (private mode, strict settings): the bar then starts empty
// on every visit, which is fine.
export function readExplored(): SectionId[] {
  try {
    return parseExplored(window.localStorage.getItem(EXPLORED_KEY));
  } catch {
    return [];
  }
}

export function saveExplored(explored: SectionId[]): void {
  try {
    window.localStorage.setItem(EXPLORED_KEY, explored.join(','));
  } catch {
    // Not saved: it still counts until the page is closed.
  }
}
