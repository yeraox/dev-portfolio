import { describe, expect, it } from 'vitest';
import { XP_SECTIONS, addExplored, parseExplored } from './explored';

describe('explored sections (the XP bar)', () => {
  it('counts the four live sections, not the drafts', () => {
    expect(XP_SECTIONS).toEqual(['projects', 'stack', 'profile', 'contact']);
  });

  it('adds each section once, in ring order', () => {
    const once = addExplored([], 'contact');
    expect(once).toEqual(['contact']);
    const twice = addExplored(once, 'projects');
    expect(twice).toEqual(['projects', 'contact']);
    expect(addExplored(twice, 'contact')).toBe(twice); // already there: the same list back
    expect(addExplored(twice, 'about')).toBe(twice); // a draft never counts
  });

  it('reads back only real sections, whatever is stored', () => {
    expect(parseExplored('stack,projects')).toEqual(['projects', 'stack']);
    expect(parseExplored('stack,stack,nonsense,about')).toEqual(['stack']);
    expect(parseExplored(null)).toEqual([]);
    expect(parseExplored('')).toEqual([]);
  });
});
