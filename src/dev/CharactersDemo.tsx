// Dev-only page: /dev/personajes. Never shipped (see Root.tsx), so it may show the private
// reference images from references/.
import { Fragment } from 'react';
import { CHARACTER_IMAGES, NULL_DOG, YERAY, type CharacterImageName, type Pose } from '../assets/characters/characters';
import { PixelSprite } from '../components/PixelSprite';
import refFrontWalk from '../../references/grandes/front_walk_animation.png';
import refPortrait from '../../references/grandes/retrato_yeray.jpg';
import refSideWalk from '../../references/grandes/sidewalk_animation.png';
import refNull from '../../references/grandes/null.jpg';
import styles from './CharactersDemo.module.css';

const SCENE_UNIT = 2; // the scene scale on a 1440 px screen (640×360 ×2)
const REVIEW_UNIT = 3;

// What each of the 8 walk frames is, and how many pixels the body is lowered (docs/animacion-caminar.md).
const STEPS = ['Contacto +1', 'Bajada +2', 'Paso +1', 'Arriba 0', 'Contacto +1', 'Bajada +2', 'Paso +1', 'Arriba 0'];

// TS concept — object spread `{ ...a, ms }`: a copy of `a` with one field changed.
const SLOW = 4;
const WALKS = [
  { title: 'Hacia la cámara', walk: YERAY.walkDown, slow: { ...YERAY.walkDown, ms: YERAY.walkDown.ms * SLOW }, sheet: refFrontWalk },
  { title: 'De lado', walk: YERAY.walkSide, slow: { ...YERAY.walkSide, ms: YERAY.walkSide.ms * SLOW }, sheet: refSideWalk },
];

/** A single frame shown still. */
const still = (frame: CharacterImageName): Pose => ({ frames: [frame], ms: 1000, pixelSize: 1 });

type Row = { label: string; reference: string; pose: Pose; unit: number };

const ROWS: Row[] = [
  { label: 'Retrato', reference: refPortrait, pose: YERAY.portrait, unit: 3 },
  { label: 'Null sentado', reference: refNull, pose: NULL_DOG.sit, unit: 7 },
];

export default function CharactersDemo() {
  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <h1>Personajes · Fase 2</h1>
        <p>
          Tus referencias tal cual: cada imagen en su rejilla de píxeles original, con sus colores,
          ampliada por un número entero. Los paseos usan el sello: la misma cabeza en todos los
          fotogramas y el cuerpo bajando 0, 1 o 2 píxeles enteros.
        </p>
      </header>

      <section className={styles.section}>
        <h2>En escena (tamaño real en una pantalla de 1440 px)</h2>
        <div className={styles.scene}>
          <PixelSprite pose={YERAY.idle} unit={SCENE_UNIT} />
          <PixelSprite pose={YERAY.walkDown} unit={SCENE_UNIT} />
          <PixelSprite pose={YERAY.walkSide} unit={SCENE_UNIT} />
          <PixelSprite pose={YERAY.walkSide} unit={SCENE_UNIT} flip />
          <PixelSprite pose={NULL_DOG.sit} unit={SCENE_UNIT} />
          <PixelSprite pose={NULL_DOG.trotSide} unit={SCENE_UNIT} />
          <PixelSprite pose={NULL_DOG.walkDown} unit={SCENE_UNIT} />
        </div>
      </section>

      {WALKS.map(({ title, walk, slow, sheet }) => (
        <section key={title} className={styles.section}>
          <h2>Caminar · {title}</h2>

          <h3>Velocidad real y ×0,25</h3>
          <div className={styles.scene}>
            <PixelSprite pose={walk} unit={REVIEW_UNIT} />
            <PixelSprite pose={slow} unit={REVIEW_UNIT} />
          </div>

          <h3>Los 8 fotogramas</h3>
          <div className={styles.strip}>
            {walk.frames.map((frame, i) => (
              <Fragment key={i}>
                {i === 4 && <div className={styles.break} />}
                <figure className={styles.frame}>
                  <div className={styles.stage}>
                    <PixelSprite pose={still(frame)} unit={REVIEW_UNIT} />
                  </div>
                  <figcaption>
                    {i + 1} · {STEPS[i]}
                  </figcaption>
                </figure>
              </Fragment>
            ))}
          </div>

          <h3>Papel cebolla (el fotograma anterior, semitransparente, debajo)</h3>
          <div className={styles.strip}>
            {walk.frames.map((frame, i) => (
              <Fragment key={i}>
                {i === 4 && <div className={styles.break} />}
                <figure className={styles.frame}>
                  <div className={styles.stage}>
                    <div className={styles.onion}>
                      <PixelSprite
                        pose={still(walk.frames[(i + walk.frames.length - 1) % walk.frames.length])}
                        unit={REVIEW_UNIT}
                        className={styles.ghost}
                      />
                      <PixelSprite pose={still(frame)} unit={REVIEW_UNIT} />
                    </div>
                  </div>
                  <figcaption>
                    {i === 0 ? walk.frames.length : i} → {i + 1}
                  </figcaption>
                </figure>
              </Fragment>
            ))}
          </div>

          <h3>Referencia</h3>
          <img className={styles.sheet} src={sheet} alt={`Hoja de referencia: caminar ${title.toLowerCase()}`} />
          <p className={styles.note}>
            Lienzo de {CHARACTER_IMAGES[walk.frames[0]].width}×{CHARACTER_IMAGES[walk.frames[0]].height} px, suelo en
            la fila {CHARACTER_IMAGES[walk.frames[0]].ground}, {walk.ms} ms por fotograma.
          </p>
        </section>
      ))}

      <section className={styles.section}>
        <h2>Referencia · Personaje</h2>
        {ROWS.map((row) => (
          <figure key={row.label} className={styles.compare}>
            <figcaption>{row.label}</figcaption>
            <div className={styles.columns}>
              <img className={styles.reference} src={row.reference} alt={`Referencia: ${row.label}`} />
              <PixelSprite pose={row.pose} unit={row.unit} />
            </div>
          </figure>
        ))}
      </section>

      <section className={styles.section}>
        <h2>Retratos</h2>
        <div className={styles.scene}>
          <PixelSprite pose={YERAY.portrait} unit={3} />
          <PixelSprite pose={NULL_DOG.portrait} unit={4} />
        </div>
      </section>
    </main>
  );
}
