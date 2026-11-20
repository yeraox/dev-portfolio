// What the ring menu shows, in ring order (BRIEF.md). Four sections open a window; the CV slot
// asks before downloading the PDF and the language slot switches ES ↔ EN. `status: 'draft'` = no
// real content yet → hidden in production, shown in dev (ABOUT ME, until it has its content).
// TS concept — a union of string literals: a SectionId can only be one of these five words.
export type SectionId = 'projects' | 'stack' | 'profile' | 'contact' | 'about';

// A slot of the ring is a section or one of the two actions. Joining both unions gives every slot
// an id TypeScript can check, e.g. in the `Record<SlotId, string>` of the names under the icons.
export type SlotId = SectionId | 'cv' | 'language';

export type Slot = {
  id: SlotId;
  status: 'ready' | 'draft';
};

export const SLOTS: Slot[] = [
  { id: 'projects', status: 'ready' },
  { id: 'stack', status: 'ready' },
  { id: 'profile', status: 'ready' },
  { id: 'contact', status: 'ready' },
  { id: 'about', status: 'draft' },
  { id: 'cv', status: 'ready' },
  { id: 'language', status: 'ready' },
];

/** The slots the ring shows, in order: drafts only while developing. */
export function visibleSlots(includeDrafts: boolean): SlotId[] {
  return SLOTS.filter((slot) => includeDrafts || slot.status === 'ready').map((slot) => slot.id);
}

/** Whether a slot opens a section window (and is not one of the two actions). */
// TS concept — a type guard (`slot is SectionId`): after `if (isSection(slot))`, TypeScript knows
// `slot` is a SectionId, so it can use it where only sections are allowed (WINDOWS[slot]…).
export function isSection(slot: SlotId): slot is SectionId {
  return slot !== 'cv' && slot !== 'language';
}
