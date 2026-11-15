import { Suspense, useEffect, useEffectEvent, useReducer, useRef, useState } from 'react';
import { BannerWindow } from '../../components/BannerWindow';
import { Hud } from '../../components/Hud';
import { HelpBar } from '../../components/HelpBar';
import { KeyHint } from '../../components/KeyHint';
import { RingMenu, type RingItem } from '../../components/RingMenu';
import { SectionDialog } from '../../components/SectionDialog';
import { SkipIntro } from '../../components/SkipIntro';
import { useLocale } from '../../content/useLocale';
import { visibleSections, type SectionId } from '../../content/sections';
import { isAnyKey } from '../../engine/anyKey';
import { useInput } from '../../engine/useInput';
import { useReducedMotion, useStageLayout } from '../../engine/useScreen';
import { gameReducer, initialState, sectionFromHash } from '../../game/state';
import { WINDOWS, preloadWindow } from '../../windows';
import { CampCanvas } from './CampCanvas';
import { CAMP } from './campLayout';
import styles from './CampScene.module.css';

// Drafts (BUFFS, CRAFT) only while developing: the live site never shows an empty window.
const SECTIONS = visibleSections(import.meta.env.DEV);
const RING = SECTIONS.map((section) => section.id);

type CampSceneProps = {
  intro: boolean; // Yeray and Null are still walking out of the cave: no menu yet
  onIntroEnd: () => void; // the intro finished, or the visitor skipped it
};

/** HUB: Yeray and Null at the camp, the ring menu around Yeray, the banner and the HUD. First,
 *  if `intro`, the two walk out of the cave to their places; then the ring opens. */
export function CampScene({ intro, onIntroEnd }: CampSceneProps) {
  const layout = useStageLayout();
  const reducedMotion = useReducedMotion();
  const { t } = useLocale();
  const items: RingItem[] = SECTIONS.map((section) => ({ ...section, title: t.sections[section.id].title }));
  // TS concept — useReducer(reducer, argument, init): the state's type comes from the reducer, so
  // `state.scene` can only be 'HUB' or 'WINDOW' and `state.section` only exists in 'WINDOW'.
  // A link like /#equip opens that window straight away.
  const [state, dispatch] = useReducer(gameReducer, RING, (ring) =>
    initialState(ring, sectionFromHash(window.location.hash, ring)),
  );
  const [shownSection, setShownSection] = useState<SectionId | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  // The ring spreads out when it appears after an intro (with reduced motion there is none).
  const [afterIntro] = useState(intro);

  const stageWidth = layout.camera.width * layout.scale;
  const stageHeight = layout.camera.height * layout.scale;

  // A window stays on screen while it plays its closing wipe, so the one on screen is tracked
  // apart. When a new one opens, React re-renders straight away with it (no effect needed).
  const openSection = state.scene === 'WINDOW' ? state.section : null;
  if (openSection && openSection !== shownSection) setShownSection(openSection);

  // The address follows the open window (#equip…), so it can be shared or reloaded.
  useEffect(() => {
    const hash = openSection ? `#${openSection}` : '';
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${hash}`);
    }
  }, [openSection]);

  // Windows are downloaded before they are opened: the one at the top of the ring right away,
  // the rest a moment after the camp is on screen (a few KB in all).
  const activeSection = RING[state.active];
  useEffect(() => preloadWindow(activeSection), [activeSection]);
  useEffect(() => {
    const timer = window.setTimeout(() => RING.forEach(preloadWindow), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  // During the intro, any key (Escape too) or a click anywhere skips it.
  const skip = useEffectEvent(onIntroEnd);
  useEffect(() => {
    if (!intro) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape' && !isAnyKey(event)) return;
      event.preventDefault();
      skip();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [intro]);

  // When the intro ends, keyboard and screen-reader users land on the ring (unless they had
  // already moved the focus somewhere themselves).
  useEffect(() => {
    if (intro || !afterIntro) return;
    const focused = document.activeElement;
    if (focused && focused !== document.body) return;
    menuRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.focus({ preventScroll: true });
  }, [intro, afterIntro]);

  useInput(stageRef, (action) => {
    if (intro || state.scene !== 'HUB') return false; // an open window handles its own keys
    if (action === 'LEFT') dispatch({ type: 'ROTATE', step: -1 });
    else if (action === 'RIGHT') dispatch({ type: 'ROTATE', step: 1 });
    else if (action === 'CONFIRM') dispatch({ type: 'OPEN' });
    else return false;
    return true;
  });

  const banner = (
    <BannerWindow
      title={items[state.active].title}
      hint={
        <span className={styles.keys}>
          <KeyHint
            items={[
              { key: '← →', action: 'ROTATE' },
              { key: 'ENTER', action: 'OPEN' },
            ]}
          />
        </span>
      }
    />
  );
  const wide = layout.mode === 'wide';
  const hud = <Hud zoom={layout.portraitZoom} names={t.hud} compact={!wide} />;
  // The banner and the HUD keep their room during the intro (nothing moves when they appear).
  const waiting = intro ? styles.waiting : undefined;

  // Help line: windows with sections explain the wheel (mouse) or the swipe (touch).
  const sectionHelp = shownSection === 'equip' ? t.help.projects : t.help.sections;
  const help =
    shownSection === 'comms' || shownSection === 'buffs' || shownSection === 'craft' ? (
      <HelpBar>{t.help.back}</HelpBar>
    ) : (
      <HelpBar>
        <span className={styles.pointerOnly}>{sectionHelp.pointer}</span>
        <span className={styles.touchOnly}>{sectionHelp.touch}</span>
      </HelpBar>
    );

  return (
    <main className={styles.camp} data-mode={layout.mode} data-scene={intro ? 'intro' : 'hub'} onClick={intro ? onIntroEnd : undefined}>
      <h1 className={styles.srOnly}>{t.page.heading}</h1>
      {!wide && (
        <div className={`${styles.row} ${waiting ?? ''}`} style={{ width: stageWidth }}>
          {banner}
        </div>
      )}
      <div
        ref={stageRef}
        className={styles.stage}
        style={{ width: stageWidth, height: stageHeight }}
      >
        <CampCanvas layout={layout} reducedMotion={reducedMotion} intro={intro} onIntroEnd={onIntroEnd} />
        {!intro && (
          <RingMenu
            items={items}
            active={state.active}
            center={CAMP.ringCenter}
            layout={layout}
            label={t.ring.label}
            reducedMotion={reducedMotion}
            opening={afterIntro && !reducedMotion}
            menuRef={menuRef}
            onPick={(index) => dispatch({ type: 'PICK', index })}
          />
        )}
        {wide && <div className={`${styles.bannerSlot} ${waiting ?? ''}`}>{banner}</div>}
        {wide && <div className={`${styles.hudSlot} ${waiting ?? ''}`}>{hud}</div>}
      </div>
      {!wide && (
        <div className={`${styles.row} ${waiting ?? ''}`} style={{ width: stageWidth }}>
          {hud}
        </div>
      )}
      {intro && <SkipIntro label={t.title.skip} onSkip={onIntroEnd} />}

      {/* The window only appears once its content has downloaded, so it opens at its final size
          (nothing jumps). Usually it is already there, preloaded. */}
      {shownSection && (
        <Suspense fallback={null}>
          <SectionDialog
            key={shownSection}
            title={t.sections[shownSection].title}
            open={openSection === shownSection}
            tall={!wide}
            closeLabel={t.window.close}
            help={help}
            onRequestClose={() => dispatch({ type: 'CLOSE' })}
            onClosed={() => {
              setShownSection(null);
              menuRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.focus();
            }}
          >
            <SectionWindow section={shownSection} />
          </SectionDialog>
        </Suspense>
      )}
    </main>
  );
}

/** The window content of a section (downloaded the first time it opens). */
function SectionWindow({ section }: { section: SectionId }) {
  const Window = WINDOWS[section];
  return <Window />;
}
