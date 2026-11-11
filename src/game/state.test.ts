import { describe, expect, it } from 'vitest';
import { SECTIONS, visibleSections } from '../content/sections';
import { gameReducer, initialState, wrap, type GameAction, type GameState } from './state';

const RING_ALL = visibleSections(true).map((section) => section.id);
const RING_LIVE = visibleSections(false).map((section) => section.id);

describe('sections', () => {
  it('hides drafts in production: BUFFS and CRAFT', () => {
    expect(RING_ALL).toHaveLength(SECTIONS.length);
    expect(RING_LIVE).toEqual(['equip', 'alchemy', 'stats', 'comms']);
  });
});

describe('gameReducer', () => {
  const hub = initialState(RING_LIVE);

  it('starts at the camp with the first section at the top', () => {
    expect(hub).toEqual({ scene: 'HUB', ring: RING_LIVE, active: 0 });
  });

  it('rotates both ways and wraps around', () => {
    expect(gameReducer(hub, { type: 'ROTATE', step: -1 }).active).toBe(3);
    const twice = gameReducer(gameReducer(hub, { type: 'ROTATE', step: 1 }), { type: 'ROTATE', step: 1 });
    expect(twice.active).toBe(2);
  });

  it('opens the active section and closes back to it', () => {
    const turned = gameReducer(hub, { type: 'ROTATE', step: 1 });
    const open = gameReducer(turned, { type: 'OPEN' });
    expect(open).toEqual({ scene: 'WINDOW', ring: RING_LIVE, active: 1, section: 'alchemy' });
    expect(gameReducer(open, { type: 'CLOSE' })).toEqual({ scene: 'HUB', ring: RING_LIVE, active: 1 });
  });

  it('opens a clicked slot and ignores slots that do not exist', () => {
    expect(gameReducer(hub, { type: 'PICK', index: 3 })).toMatchObject({ scene: 'WINDOW', section: 'comms' });
    expect(gameReducer(hub, { type: 'PICK', index: 4 })).toBe(hub);
    expect(gameReducer(hub, { type: 'PICK', index: -1 })).toBe(hub);
  });

  it('keeps the ring still while a window is open', () => {
    const open = gameReducer(hub, { type: 'OPEN' });
    for (const action of [{ type: 'ROTATE', step: 1 }, { type: 'OPEN' }, { type: 'PICK', index: 2 }] satisfies GameAction[]) {
      expect(gameReducer(open, action)).toBe(open);
    }
  });

  it('has no impossible states, whatever the order of actions', () => {
    const actions: GameAction[] = [
      { type: 'ROTATE', step: 1 },
      { type: 'ROTATE', step: -1 },
      { type: 'PICK', index: 2 },
      { type: 'OPEN' },
      { type: 'CLOSE' },
    ];
    for (const ring of [RING_LIVE, RING_ALL.slice(0, 5), RING_ALL]) {
      let state: GameState = initialState(ring);
      for (let i = 0; i < 500; i++) {
        state = gameReducer(state, actions[(i * 7 + (i >> 2)) % actions.length]);
        expect(state.active).toBeGreaterThanOrEqual(0);
        expect(state.active).toBeLessThan(ring.length);
        if (state.scene === 'WINDOW') expect(state.section).toBe(ring[state.active]);
      }
    }
  });

  it('wraps indexes in both directions', () => {
    expect(wrap(-1, 4)).toBe(3);
    expect(wrap(4, 4)).toBe(0);
    expect(wrap(9, 4)).toBe(1);
  });
});
