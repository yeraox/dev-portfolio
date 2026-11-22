import { describe, expect, it } from 'vitest';
import { SLOTS, isSection, visibleSlots } from '../content/sections';
import { gameReducer, initialState, sectionFromHash, wrap, type GameAction, type GameState } from './state';

const RING_ALL = visibleSlots(true);
const RING_LIVE = visibleSlots(false);

describe('ring slots', () => {
  it('shows the five sections (ABOUT ME after PROFILE), then the CV and SETTINGS; no drafts now', () => {
    expect(RING_ALL).toHaveLength(SLOTS.length);
    expect(RING_LIVE).toEqual(['projects', 'stack', 'profile', 'about', 'contact', 'cv', 'settings']);
    expect(RING_LIVE).toEqual(RING_ALL); // what you see while developing is what goes live
  });

  it('tells the sections apart from the two actions', () => {
    expect(RING_ALL.filter(isSection)).toEqual(['projects', 'stack', 'profile', 'about', 'contact']);
  });
});

describe('gameReducer', () => {
  const hub = initialState(RING_LIVE);
  const CV = RING_LIVE.indexOf('cv');
  const SETTINGS = RING_LIVE.indexOf('settings');

  it('starts at the camp with the first slot at the top', () => {
    expect(hub).toEqual({ scene: 'HUB', ring: RING_LIVE, active: 0 });
  });

  it('rotates both ways and wraps around', () => {
    expect(gameReducer(hub, { type: 'ROTATE', step: -1 }).active).toBe(RING_LIVE.length - 1);
    const twice = gameReducer(gameReducer(hub, { type: 'ROTATE', step: 1 }), { type: 'ROTATE', step: 1 });
    expect(twice.active).toBe(2);
  });

  it('opens the active section and closes back to it', () => {
    const turned = gameReducer(hub, { type: 'ROTATE', step: 1 });
    const open = gameReducer(turned, { type: 'OPEN' });
    expect(open).toEqual({ scene: 'WINDOW', ring: RING_LIVE, active: 1, section: 'stack' });
    expect(gameReducer(open, { type: 'CLOSE' })).toEqual({ scene: 'HUB', ring: RING_LIVE, active: 1 });
  });

  it('opens a clicked slot and ignores slots that do not exist', () => {
    expect(gameReducer(hub, { type: 'PICK', index: 3 })).toMatchObject({ scene: 'WINDOW', section: 'about' });
    expect(gameReducer(hub, { type: 'PICK', index: RING_LIVE.length })).toBe(hub);
    expect(gameReducer(hub, { type: 'PICK', index: -1 })).toBe(hub);
  });

  it('asks before downloading the CV: its slot opens the question window', () => {
    expect(gameReducer(hub, { type: 'PICK', index: CV })).toEqual({ scene: 'WINDOW', ring: RING_LIVE, active: CV, section: 'cv' });
  });

  it('opens SETTINGS from the gear, by click or with Enter at the top', () => {
    expect(gameReducer(hub, { type: 'PICK', index: SETTINGS })).toEqual({ scene: 'WINDOW', ring: RING_LIVE, active: SETTINGS, section: 'settings' });
    const atTop: GameState = { scene: 'HUB', ring: RING_LIVE, active: SETTINGS };
    expect(gameReducer(atTop, { type: 'OPEN' })).toMatchObject({ scene: 'WINDOW', section: 'settings' });
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
      { type: 'PICK', index: SETTINGS },
      { type: 'OPEN' },
      { type: 'CLOSE' },
    ];
    for (const ring of [RING_LIVE, RING_ALL.slice(0, 5), RING_ALL]) {
      let state: GameState = initialState(ring);
      for (let i = 0; i < 500; i++) {
        state = gameReducer(state, actions[(i * 7 + (i >> 2)) % actions.length]);
        expect(state.active).toBeGreaterThanOrEqual(0);
        expect(state.active).toBeLessThan(ring.length);
        if (state.scene === 'WINDOW') {
          expect(state.section).toBe(ring[state.active]);
        }
      }
    }
  });

  it('opens the window of a section link (/#contact) when the ring shows it', () => {
    expect(initialState(RING_LIVE, 'contact')).toEqual({ scene: 'WINDOW', ring: RING_LIVE, active: 4, section: 'contact' });
    expect(initialState(RING_LIVE, 'about')).toEqual({ scene: 'WINDOW', ring: RING_LIVE, active: 3, section: 'about' });
    const withoutAbout = RING_LIVE.filter((slot) => slot !== 'about'); // a ring without it (as a draft)
    expect(initialState(withoutAbout, 'about')).toEqual(initialState(withoutAbout));
    expect(sectionFromHash('#profile', RING_LIVE)).toBe('profile');
    expect(sectionFromHash('#about', RING_LIVE)).toBe('about');
    expect(sectionFromHash('#about', withoutAbout)).toBeNull();
    expect(sectionFromHash('#cv', RING_LIVE)).toBeNull(); // the two actions have no link
    expect(sectionFromHash('#language', RING_LIVE)).toBeNull();
    expect(sectionFromHash('', RING_LIVE)).toBeNull();
  });

  it('wraps indexes in both directions', () => {
    expect(wrap(-1, 4)).toBe(3);
    expect(wrap(4, 4)).toBe(0);
    expect(wrap(9, 4)).toBe(1);
  });
});
