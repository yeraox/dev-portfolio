// Which screen the site shows: TITLE → TRANSITION → INTRO → CAMP, and back to the title. Pure
// functions → tested in screens.test.ts.

// TS concept — another discriminated union: only a TRANSITION has a `half` (fading out of one
// screen, then fading into the next) and a `to` (what the fade reveals). It goes from the title to
// the intro or the camp, or back from the camp to the title.
export type Screen =
  | { name: 'TITLE' }
  | { name: 'TRANSITION'; half: 'out' | 'in'; to: 'INTRO' | 'CAMP' | 'TITLE' }
  | { name: 'INTRO' }
  | { name: 'CAMP' };

export type ScreenAction =
  | { type: 'START'; intro: boolean } // PRESS START (intro), SKIP INTRO (no intro)
  | { type: 'MIDPOINT' } // the screen is fully dark: swap one screen for the other
  | { type: 'DONE' } // the new screen is fully visible
  | { type: 'INTRO_END' } // the intro finished, or was skipped
  | { type: 'BACK_TO_TITLE' }; // SETTINGS' BACK TO TITLE, in the camp

type ScreenStart = {
  hash: string; // the address's #part: a window link (/#equip) skips the title
  visited: boolean; // this browser has reached the camp before
};

// The one link that always shows the title, even after a visit (to see it again, or show it).
const TITLE_HASH = '#title';

/** Links to a window and returning visitors go straight to the camp; first visits see the title. */
export function initialScreen({ hash, visited }: ScreenStart): Screen {
  if (hash === TITLE_HASH) return { name: 'TITLE' };
  if (hash.length > 1 || visited) return { name: 'CAMP' };
  return { name: 'TITLE' };
}

export function screenReducer(screen: Screen, action: ScreenAction): Screen {
  switch (screen.name) {
    case 'TITLE':
      return action.type === 'START'
        ? { name: 'TRANSITION', half: 'out', to: action.intro ? 'INTRO' : 'CAMP' }
        : screen;
    case 'TRANSITION':
      if (action.type === 'MIDPOINT' && screen.half === 'out') return { ...screen, half: 'in' };
      if (action.type === 'DONE' && screen.half === 'in') return { name: screen.to };
      // SKIP INTRO while the intro is still fading in: the fade goes on, into the camp.
      if (action.type === 'INTRO_END' && screen.half === 'in' && screen.to === 'INTRO') return { ...screen, to: 'CAMP' };
      return screen;
    case 'INTRO':
      return action.type === 'INTRO_END' ? { name: 'CAMP' } : screen;
    case 'CAMP':
      return action.type === 'BACK_TO_TITLE' ? { name: 'TRANSITION', half: 'out', to: 'TITLE' } : screen;
  }
}

/** True when the title is the screen on view: on its own, while it darkens before the intro or the
 *  camp, and while it appears again after BACK TO TITLE. */
export function titleOnScreen(screen: Screen): boolean {
  if (screen.name === 'TITLE') return true;
  if (screen.name !== 'TRANSITION') return false;
  const leavingTitle = screen.to !== 'TITLE';
  return screen.half === 'out' ? leavingTitle : !leavingTitle;
}
