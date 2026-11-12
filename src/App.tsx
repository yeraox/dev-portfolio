import { useReducer } from 'react';
import { DitherTransition } from './components/DitherTransition';
import { LocaleProvider } from './content/LocaleProvider';
import { useReducedMotion, useStageLayout } from './engine/useScreen';
import { useUiTokens } from './engine/useUiTokens';
import { initialScreen, screenReducer } from './game/screens';
import { CampScene } from './scenes/camp/CampScene';
import { TitleScreen } from './scenes/title/TitleScreen';

export default function App() {
  return (
    <LocaleProvider>
      <Game />
    </LocaleProvider>
  );
}

/** Title → dithered transition → camp. The cave intro (phase 6) will sit between the last two. */
function Game() {
  const layout = useStageLayout();
  const reducedMotion = useReducedMotion();
  useUiTokens(layout);
  // A link to a window (/#equip) skips the title.
  const [screen, dispatch] = useReducer(screenReducer, window.location.hash, (hash) => initialScreen(hash.length > 1));

  // The title stays on screen while it darkens; the camp appears once everything is dark.
  const showTitle = screen.name === 'TITLE' || (screen.name === 'TRANSITION' && screen.half === 'out');

  return (
    <>
      {showTitle ? <TitleScreen layout={layout} onStart={() => dispatch({ type: 'START' })} /> : <CampScene />}
      {screen.name === 'TRANSITION' && (
        <DitherTransition
          key={screen.half}
          half={screen.half}
          reducedMotion={reducedMotion}
          onEnd={() => dispatch({ type: screen.half === 'out' ? 'MIDPOINT' : 'DONE' })}
        />
      )}
    </>
  );
}
