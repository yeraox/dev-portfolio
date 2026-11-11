import { useLayoutEffect, useReducer, useRef, useState } from 'react';
import { BannerWindow } from '../../components/BannerWindow';
import { Hud } from '../../components/Hud';
import { KeyHint } from '../../components/KeyHint';
import { RingMenu, type RingItem } from '../../components/RingMenu';
import { SectionDialog } from '../../components/SectionDialog';
import { ES } from '../../content/es';
import { visibleSections, type SectionId } from '../../content/sections';
import { useInput } from '../../engine/useInput';
import { useReducedMotion, useStageLayout } from '../../engine/useScreen';
import { gameReducer, initialState } from '../../game/state';
import { CampCanvas } from './CampCanvas';
import { CAMP } from './campLayout';
import styles from './CampScene.module.css';

// Drafts (BUFFS, CRAFT) only while developing: the live site never shows an empty window.
const ITEMS: RingItem[] = visibleSections(import.meta.env.DEV).map((section) => ({
  ...section,
  title: ES.sections[section.id].title,
}));

/** HUB: Yeray and Null at the camp, the ring menu around Yeray, the banner and the HUD. */
export function CampScene() {
  const layout = useStageLayout();
  const reducedMotion = useReducedMotion();
  // TS concept — useReducer(reducer, argument, init): the state's type comes from the reducer, so
  // `state.scene` can only be 'HUB' or 'WINDOW' and `state.section` only exists in 'WINDOW'.
  const [state, dispatch] = useReducer(
    gameReducer,
    ITEMS.map((item) => item.id),
    initialState,
  );
  const [shownSection, setShownSection] = useState<SectionId | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // --u follows the scene's zoom (DESIGN.md §2): one UI pixel = two scene pixels, 2–4 CSS px.
  useLayoutEffect(() => {
    document.documentElement.style.setProperty('--u', `${layout.uiUnit}px`);
  }, [layout.uiUnit]);

  // A window stays on screen while it plays its closing wipe, so the one on screen is tracked
  // apart. When a new one opens, React re-renders straight away with it (no effect needed).
  const openSection = state.scene === 'WINDOW' ? state.section : null;
  if (openSection && openSection !== shownSection) setShownSection(openSection);

  useInput(stageRef, (action) => {
    if (state.scene !== 'HUB') return false; // an open window handles its own keys
    if (action === 'LEFT') dispatch({ type: 'ROTATE', step: -1 });
    else if (action === 'RIGHT') dispatch({ type: 'ROTATE', step: 1 });
    else if (action === 'CONFIRM') dispatch({ type: 'OPEN' });
    else return false;
    return true;
  });

  const banner = (
    <BannerWindow
      title={ITEMS[state.active].title}
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
  const hud = <Hud zoom={layout.portraitZoom} names={ES.hud} compact={!wide} />;
  const stageWidth = layout.camera.width * layout.scale;

  return (
    <main className={styles.camp} data-mode={layout.mode}>
      <h1 className={styles.srOnly}>{ES.page.heading}</h1>
      {!wide && (
        <div className={styles.row} style={{ width: stageWidth }}>
          {banner}
        </div>
      )}
      <div
        ref={stageRef}
        className={styles.stage}
        style={{ width: stageWidth, height: layout.camera.height * layout.scale }}
      >
        <CampCanvas layout={layout} reducedMotion={reducedMotion} />
        <RingMenu
          items={ITEMS}
          active={state.active}
          center={CAMP.ringCenter}
          layout={layout}
          label={ES.ring.label}
          reducedMotion={reducedMotion}
          menuRef={menuRef}
          onPick={(index) => dispatch({ type: 'PICK', index })}
        />
        {wide && <div className={styles.bannerSlot}>{banner}</div>}
        {wide && <div className={styles.hudSlot}>{hud}</div>}
      </div>
      {!wide && (
        <div className={styles.row} style={{ width: stageWidth }}>
          {hud}
        </div>
      )}

      {shownSection && (
        <SectionDialog
          key={shownSection}
          title={ES.sections[shownSection].title}
          open={openSection === shownSection}
          tall={!wide}
          closeLabel={ES.window.close}
          onRequestClose={() => dispatch({ type: 'CLOSE' })}
          onClosed={() => {
            setShownSection(null);
            menuRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.focus();
          }}
        >
          <p className={styles.placeholder}>{ES.window.placeholder}</p>
        </SectionDialog>
      )}
    </main>
  );
}
