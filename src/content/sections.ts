// The ring menu's sections, in ring order (BRIEF.md). Labels are game labels: English in both
// languages. `status: 'draft'` = no real content yet → hidden in production, shown in dev.
// TS concept — a union of string literals: a SectionId can only be one of these six words.
export type SectionId = 'equip' | 'alchemy' | 'stats' | 'buffs' | 'craft' | 'comms';

export type Section = {
  id: SectionId;
  label: string;
  status: 'ready' | 'draft';
};

export const SECTIONS: Section[] = [
  { id: 'equip', label: 'EQUIP', status: 'ready' },
  { id: 'alchemy', label: 'ALCHEMY', status: 'ready' },
  { id: 'stats', label: 'STATS', status: 'ready' },
  { id: 'buffs', label: 'BUFFS', status: 'draft' },
  { id: 'craft', label: 'CRAFT', status: 'draft' },
  { id: 'comms', label: 'COMMS', status: 'ready' },
];

/** The sections the ring shows: drafts only while developing. */
export function visibleSections(includeDrafts: boolean): Section[] {
  return SECTIONS.filter((section) => includeDrafts || section.status === 'ready');
}
