import { Suspense, useEffect, useEffectEvent, useReducer, useRef, useState } from 'react';
import { ICONS } from '../../assets/icons/icons';
import { BannerWindow } from '../../components/BannerWindow';
import { CvDownloadDialog } from '../../components/CvDownloadDialog';
import { Hud } from '../../components/Hud';
import { HelpBar } from '../../components/HelpBar';
import { KeyHint } from '../../components/KeyHint';
import { RingMenu, type RingItem } from '../../components/RingMenu';
import { SectionDialog } from '../../components/SectionDialog';
import { SettingsDialog } from '../../components/SettingsDialog';
import { SkipIntro } from '../../components/SkipIntro';
import { useLocale } from '../../content/useLocale';
import { isSection, visibleSlots, type SectionId, type SlotId } from '../../content/sections';
import { isAnyKey } from '../../engine/anyKey';
import { useInput } from '../../engine/useInput';
import { useReducedMotion } from '../../engine/motion';
import { useStageLayout } from '../../engine/useScreen';
import { XP_SECTIONS, addExplored, readExplored, saveExplored } from '../../game/explored';
import { gameReducer, initialState, sectionFromHash } from '../../game/state';
import { WINDOWS, preloadWindow } from '../../windows';
import { CampCanvas } from './CampCanvas';
import { CAMP } from './campLayout';
import { useIdleDirector } from './useIdleDirector';
import styles from './CampScene.module.css';

// Drafts (ABOUT ME) only while developing: the live site never shows an empty window.
const RING = visibleSlots(import.meta.env.DEV);
const SECTIONS = RING.filter(isSection);

type CampSceneProps = {
  intro: boolean; // Yeray and Null are still walking out of the cave: no menu yet
  leaving: boolean; // going back to the title: the camp darkens and takes no more input
  onIntroEnd: () => void; // the intro finished, or the visitor skipped it
  onBackToTitle: () => void; // SETTINGS' BACK TO TITLE, once its window has closed
};

/** HUB: Yeray and Null at the camp, the ring menu around Yeray, the banner and the HUD. First,
 *  if `intro`, the two walk out of the cave to their places; then the ring opens. */
export function CampScene({ intro, leaving, onIntroEnd, onBackToTitle }: CampSceneProps) {
  const layout = useStageLayout();
  const reducedMotion = useReducedMotion();
  const { t } = useLocale();
  // What each slot is: its title for the banner and screen readers, and its icon.
  const titleOf = (slot: SlotId) => {
    if (slot === 'cv') return t.cvDownload.banner;
    if (slot === 'settings') return t.settings.banner;
    return t.sections[slot].title; // TypeScript knows: by now `slot` is a SectionId
  };
  const items: RingItem[] = RING.map((slot) => ({
    id: slot,
    name: t.ring.names[slot],
    title: titleOf(slot),
    icon: ICONS[slot],
  }));
  // TS concept — useReducer(reducer, argument, init): the state's type comes from the reducer, so
  // `state.scene` can only be 'HUB' or 'WINDOW' and `state.section` only exists in 'WINDOW'.
  // A link like /#projects opens that window straight away.
  const [state, dispatch] = useReducer(gameReducer, RING, (ring) =>
    initialState(ring, sectionFromHash(window.location.hash, ring)),
  );
  const [shownSection, setShownSection] = useState<SlotId | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  // BACK TO TITLE was chosen: SETTINGS closes first (a window would stay above the transition),
  // then the camp hands over to the title.
  const toTitle = useRef(false);
  // The ring spreads out when it appears after an intro (with reduced motion there is none).
  const [afterIntro] = useState(intro);

  const stageWidth = layout.camera.width * layout.scale;
  const stageHeight = layout.camera.height * layout.scale;

  // A window stays on screen while it plays its closing wipe, so the one on screen is tracked
  // apart. When a new one opens, React re-renders straight away with it (no effect needed).
  const openSection = state.scene === 'WINDOW' ? state.section : null;
  if (openSection && openSection !== shownSection) setShownSection(openSection);

  // Experience (the HUD's XP bar): every section window opened for the first time adds a step.
  // TS concept — `useState(readExplored)`: passing the function (not its result) reads the
  // browser's storage only once, on the first render.
  const [explored, setExplored] = useState(readExplored);
  // Like `shownSection` above: when a new section opens, React re-renders straight away with it.
  if (openSection && isSection(openSection)) {
    const next = addExplored(explored, openSection);
    if (next !== explored) setExplored(next);
  }
  useEffect(() => saveExplored(explored), [explored]);
  const xpText = t.hud.explored.replace('{n}', String(explored.length)).replace('{total}', String(XP_SECTIONS.length));

  // The address follows the open section (#projects…), so it can be shared or reloaded. The CV's
  // question and SETTINGS have no address of their own.
  useEffect(() => {
    const hash = openSection && isSection(openSection) ? `#${openSection}` : '';
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${hash}`);
    }
  }, [openSection]);

  // Windows are downloaded before they are opened: the one at the top of the ring right away,
  // the rest a moment after the camp is on screen (a few KB in all).
  const activeSlot = RING[state.active];
  useEffect(() => {
    if (isSection(activeSlot)) preloadWindow(activeSlot);
  }, [activeSlot]);
  useEffect(() => {
    const timer = window.setTimeout(() => SECTIONS.forEach(preloadWindow), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  // Opening a slot (a click, a tap or Enter): the state machine brings it to the top and opens its
  // window.
  const pick = (index: number) => dispatch({ type: 'PICK', index });

  // Idle actions: only while the camp is on screen with no window, after the intro, and
  // never with reduced motion.
  const idle = useIdleDirector(!intro && state.scene === 'HUB' && !reducedMotion);

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
    if (intro || leaving || state.scene !== 'HUB') return false; // an open window handles its own keys
    if (action === 'LEFT') dispatch({ type: 'ROTATE', step: -1 });
    else if (action === 'RIGHT') dispatch({ type: 'ROTATE', step: 1 });
    else if (action === 'CONFIRM') pick(state.active);
    else return false;
    return true;
  });

  // A window has finished closing: the focus goes back to the slot that opened it.
  const afterClose = () => {
    setShownSection(null);
    menuRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.focus();
  };

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
  const hud = (
    <Hud zoom={layout.portraitZoom} texts={t.hud} xp={explored.length / XP_SECTIONS.length} xpText={xpText} compact={!wide} />
  );
  // The banner and the HUD keep their room during the intro (nothing moves when they appear).
  const waiting = intro ? styles.waiting : undefined;

  // Help line: windows with sections explain the arrows and the wheel (mouse) or the swipe (touch).
  const sectionHelp = shownSection === 'projects' ? t.help.projects : t.help.sections;
  const help =
    shownSection === 'contact' || shownSection === 'about' ? (
      <HelpBar>{t.help.back}</HelpBar>
    ) : (
      <HelpBar>
        <span className={styles.pointerOnly}>{sectionHelp.pointer}</span>
        <span className={styles.touchOnly}>{sectionHelp.touch}</span>
      </HelpBar>
    );

  return (
    <main
      className={styles.camp}
      data-mode={layout.mode}
      data-scene={intro ? 'intro' : 'hub'}
      inert={leaving}
      onClick={intro ? onIntroEnd : undefined}
    >
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
        <CampCanvas layout={layout} reducedMotion={reducedMotion} intro={intro} onIntroEnd={onIntroEnd} idle={idle} />
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
            onPick={pick}
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

      {shownSection === 'cv' && (
        <CvDownloadDialog
          open={openSection === 'cv'}
          onRequestClose={() => dispatch({ type: 'CLOSE' })}
          onClosed={afterClose}
        />
      )}
      {shownSection === 'settings' && (
        <SettingsDialog
          open={openSection === 'settings'}
          onRequestClose={() => dispatch({ type: 'CLOSE' })}
          onBackToTitle={() => {
            toTitle.current = true;
            dispatch({ type: 'CLOSE' });
          }}
          onClosed={() => {
            if (!toTitle.current) return afterClose();
            setShownSection(null);
            onBackToTitle();
          }}
        />
      )}

      {/* The window only appears once its content has downloaded, so it opens at its final size
          (nothing jumps). Usually it is already there, preloaded. */}
      {shownSection && isSection(shownSection) && (
        <Suspense fallback={null}>
          <SectionDialog
            key={shownSection}
            title={t.sections[shownSection].title}
            open={openSection === shownSection}
            tall={!wide}
            closeLabel={t.window.close}
            help={help}
            onRequestClose={() => dispatch({ type: 'CLOSE' })}
            onClosed={afterClose}
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
