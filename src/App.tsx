import { useEffect, useReducer } from 'react';
import { DitherTransition } from './components/DitherTransition';
import { LocaleProvider } from './content/LocaleProvider';
import { useReducedMotion, useStageLayout } from './engine/useScreen';
import { useUiTokens } from './engine/useUiTokens';
import { initialScreen, screenReducer } from './game/screens';
import { hasVisited, rememberVisit } from './game/visit';
import { CampScene } from './scenes/camp/CampScene';
import { TitleScreen } from './scenes/title/TitleScreen';

export default function App() {
  return (
    <LocaleProvider>
      <Game />
    </LocaleProvider>
  );
}

/** Title → dithered transition → cave intro → camp (BRIEF.md). */
function Game() {
  const layout = useStageLayout();
  const reducedMotion = useReducedMotion();
  useUiTokens(layout);
  // A link to a window (/#equip) and returning visitors skip the title; /#title always shows it.
  const [screen, dispatch] = useReducer(screenReducer, window.location.hash, (hash) =>
    initialScreen({ hash, visited: hasVisited() }),
  );

  // Reaching the camp once is enough: next time the site opens there.
  useEffect(() => {
    if (screen.name === 'CAMP') rememberVisit();
  }, [screen.name]);

  // The title stays on screen while it darkens; the camp appears once everything is dark. The
  // intro is the camp scene itself, with Yeray and Null still walking out of the cave.
  const showTitle = screen.name === 'TITLE' || (screen.name === 'TRANSITION' && screen.half === 'out');
  const intro = screen.name === 'INTRO' || (screen.name === 'TRANSITION' && screen.to === 'INTRO');

  return (
    <>
      {showTitle ? (
        <TitleScreen
          layout={layout}
          onStart={() => dispatch({ type: 'START', intro: !reducedMotion })} // reduced motion: no walk
          onSkip={() => dispatch({ type: 'START', intro: false })}
        />
      ) : (
        <CampScene intro={intro} onIntroEnd={() => dispatch({ type: 'INTRO_END' })} />
      )}
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
