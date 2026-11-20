import { describe, expect, it } from 'vitest';
import { EN } from '../../content/en';
import { ES } from '../../content/es';
import { STACK_ATLAS, STACK_ICONS } from './stack-icons.gen';

describe('STACK icons', () => {
  it('every technology of the window, in both languages, has its icon', () => {
    for (const content of [ES, EN]) {
      for (const tier of content.stack.tiers) {
        for (const group of tier.groups) {
          for (const tech of group.items) expect(STACK_ICONS[tech.id], tech.name).toBeLessThan(STACK_ATLAS.count);
        }
      }
    }
  });

  it('each icon has its own place in the atlas', () => {
    const places = Object.values(STACK_ICONS);
    expect(new Set(places).size).toBe(places.length);
    expect(places.length).toBe(STACK_ATLAS.count);
  });
});
