import { describe, expect, it } from 'vitest';
import { RING } from '../../game/ring';
import { ICONS } from './icons';

describe.each(Object.entries(ICONS))('icon %s', (_name, icon) => {
  it('fills the ring slot along its longest side, on the scene grid', () => {
    expect(Math.max(icon.width, icon.height)).toBe(RING.icon);
    expect(Math.min(icon.width, icon.height)).toBeGreaterThan(0);
    expect(icon.src).toBeTruthy();
  });
});
