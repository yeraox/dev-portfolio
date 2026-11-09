// Dev-only page: /dev/specimen. Never shipped (see main.tsx).
// Purpose: show the phase 0 decisions (resolution, fonts, palette, contrast) in one place.
import '@fontsource/jersey-10';
import '@fontsource/pixelify-sans/400.css';
import '@fontsource/pixelify-sans/700.css';
import { useEffect, useRef, useState } from 'react';
import { CONTRAST_PAIRS, ratioFor } from '../styles/contrast';
import { AVATAR_PALETTE, NULL_PALETTE, UI_PALETTE, type Palette } from '../styles/palette';
import styles from './Specimen.module.css';

// TS concept — a `type` describing an object: every font candidate has these three fields.
type FontCandidate = {
  family: string;
  weight: number;
  note: string;
};

// Chosen by Yeray in phase 0.
const DISPLAY_FONTS: FontCandidate[] = [
  { family: 'Jersey 10', weight: 400, note: 'Elegida para el título y las etiquetas del juego.' },
];

const BODY_FONTS: FontCandidate[] = [
  { family: 'Pixelify Sans', weight: 400, note: 'Elegida para el texto de las ventanas.' },
];

const BIO =
  'Desarrollador backend junior, titulado en DAW y cursando la especialización en ' +
  'Administración de Recursos y Servicios en la Nube. Construyo APIs REST con Node.js y ' +
  'Express, automatizo procesos con Python y trabajo con bases de datos SQL y NoSQL.';

const STATS_ROWS: [string, string][] = [
  ['Clase', 'Desarrollador Backend Junior'],
  ['Base', 'Elda (Alicante)'],
  ['Idiomas', 'Español · Catalán · Inglés'],
];

export default function Specimen() {
  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <h1>Página de muestra · Fase 0</h1>
        <p>
          Decisiones de la fase 0: resolución, fuentes, paleta y contraste. Solo existe mientras
          desarrollamos; no entra en la web publicada.
        </p>
      </header>

      <section className={styles.section}>
        <h2>1. Resolución interna: 320×180</h2>
        <p className={styles.note}>
          Escena de prueba ampliada por un número entero. Los rectángulos son el tamaño real de tu
          sprite (32×40) y el de Null (24×20); los cuadros marcan dónde irían los iconos del menú
          (16×16) y la franja de arriba, el banner.
        </p>
        <div className={styles.resolutions}>
          <SceneCanvas width={320} height={180} label="320×180 · panorámica" />
        </div>
      </section>

      <section className={styles.section}>
        <h2>2. Fuente del título</h2>
        {DISPLAY_FONTS.map((font) => (
          <figure key={font.family} className={styles.titleSample}>
            <p className={styles.title} style={{ fontFamily: `'${font.family}'`, fontWeight: font.weight }}>
              YERAY CATURLA
            </p>
            <p className={styles.pressStart} style={{ fontFamily: `'${font.family}'`, fontWeight: font.weight }}>
              PRESS START
            </p>
            <figcaption className={styles.note}>
              <strong>{font.family}</strong> — {font.note}
            </figcaption>
          </figure>
        ))}
      </section>

      <section className={styles.section}>
        <h2>3. Fuente del texto de las ventanas</h2>
        <div className={styles.bodyGrid}>
          {BODY_FONTS.map((font) => (
            <figure key={font.family} className={styles.bodySample}>
              <div className={styles.panel} style={{ fontFamily: `'${font.family}'`, fontWeight: font.weight }}>
                <p className={styles.panelHeading}>STATS</p>
                <dl className={styles.rows}>
                  {STATS_ROWS.map(([label, value]) => (
                    <div key={label} className={styles.row}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
                <hr className={styles.divider} />
                <p className={styles.bio}>{BIO}</p>
                <p className={styles.credit}>BACKEND DEVELOPER · NODE.JS · EXPRESS · JAVA · DOCKER · AWS</p>
              </div>
              <figcaption className={styles.note}>
                <strong>{font.family}</strong> — {font.note}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>4. Paleta</h2>
        <PaletteSwatches title={`Interfaz y escenas (${Object.keys(UI_PALETTE).length}/32)`} palette={UI_PALETTE} />
        <PaletteSwatches title={`Tu sprite (${Object.keys(AVATAR_PALETTE).length}/15)`} palette={AVATAR_PALETTE} />
        <PaletteSwatches title={`Null (${Object.keys(NULL_PALETTE).length}/15)`} palette={NULL_PALETTE} />
      </section>

      <section className={styles.section}>
        <h2>5. Contraste (WCAG AA)</h2>
        <table className={styles.contrast}>
          <thead>
            <tr>
              <th>Uso</th>
              <th>Muestra</th>
              <th>Ratio</th>
              <th>Mínimo</th>
            </tr>
          </thead>
          <tbody>
            {CONTRAST_PAIRS.map((pair) => {
              const ratio = ratioFor(pair);
              return (
                <tr key={pair.use}>
                  <td>{pair.use}</td>
                  <td>
                    <span
                      className={styles.chip}
                      style={{ color: UI_PALETTE[pair.fg], background: UI_PALETTE[pair.bg] }}
                    >
                      {pair.fg} / {pair.bg}
                    </span>
                  </td>
                  <td className={ratio >= pair.min ? styles.pass : styles.fail}>{ratio.toFixed(2)}:1</td>
                  <td>{pair.min}:1</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </main>
  );
}

// TS concept — typed props: this component must receive a title (string) and a Palette.
function PaletteSwatches({ title, palette }: { title: string; palette: Palette }) {
  return (
    <div className={styles.paletteBlock}>
      <h3>{title}</h3>
      <ul className={styles.swatches}>
        {Object.entries(palette).map(([name, hex]) => (
          <li key={name}>
            <span className={styles.swatch} style={{ background: hex }} />
            <span className={styles.swatchName}>{name}</span>
            <span className={styles.swatchHex}>{hex}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SceneCanvas({ width, height, label }: { width: number; height: number; label: string }) {
  // TS concept — generics in React: useRef<HTMLCanvasElement> says what the ref will point to.
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Pick the biggest whole-number zoom that fits the available width.
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.max(1, Math.floor(entry.contentRect.width / width)));
    });
    observer.observe(box);
    return () => observer.disconnect();
  }, [width]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) drawTestScene(ctx, width, height);
  }, [width, height]);

  return (
    <figure ref={boxRef} className={styles.sceneBox}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width: width * scale, height: height * scale }}
      />
      <figcaption className={styles.note}>
        <strong>{label}</strong> — ampliado ×{scale} → {width * scale}×{height * scale} px
      </figcaption>
    </figure>
  );
}

// A throwaway test scene (the real ones come in phases 3–6). Pure pixel fills, no smoothing.
function drawTestScene(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const c = UI_PALETTE;
  const fill = (color: string, x: number, y: number, rw: number, rh: number) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, rw, rh);
  };
  // Checkerboard band between two colors: the 16-bit way to fake a gradient.
  const dither = (a: string, b: string, y: number, bandH: number) => {
    for (let yy = y; yy < y + bandH; yy++) {
      for (let x = 0; x < w; x++) fill((x + yy) % 2 === 0 ? a : b, x, yy, 1, 1);
    }
  };

  const horizonY = Math.round(h * 0.55);
  fill(c['night-0'], 0, 0, w, horizonY);
  dither(c['night-0'], c['night-1'], Math.round(horizonY * 0.45), 6);
  fill(c['night-1'], 0, Math.round(horizonY * 0.45) + 6, w, horizonY);
  dither(c['night-1'], c['night-2'], horizonY - 14, 6);
  fill(c['night-2'], 0, horizonY - 8, w, 8);
  fill(c.horizon, 0, horizonY, w, 2);
  fill(c['horizon-hi'], 0, horizonY, w, 1);
  fill(c['forest-0'], 0, horizonY + 2, w, h - horizonY);
  dither(c['forest-0'], c['forest-1'], horizonY + 20, 4);
  fill(c['forest-1'], 0, horizonY + 24, w, h);

  // Banner strip (top)
  fill(c['blue-1'], 8, 6, w - 16, 18);
  fill(c['gold-2'], 8, 6, w - 16, 2);
  fill(c['gold-2'], 8, 22, w - 16, 2);

  // Avatar (32×40) and Null (24×20) placeholders, feet on the same line.
  const cx = Math.round(w / 2);
  const feetY = Math.round(h * 0.82);
  const outlined = (color: string, x: number, y: number, rw: number, rh: number) => {
    fill(c.ink, x, y, rw, rh);
    fill(color, x + 1, y + 1, rw - 2, rh - 2);
  };
  outlined(AVATAR_PALETTE['vest-1'], cx - 16, feetY - 40, 32, 40);
  outlined(NULL_PALETTE['coat-1'], cx + 20, feetY - 20, 24, 20);

  // Ring menu: 6 icon slots (16×16) on an ellipse around the avatar.
  const ringCx = cx;
  const ringCy = feetY - 20;
  const rx = 62;
  const ry = 42;
  for (let i = 0; i < 6; i++) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
    const x = Math.round(ringCx + rx * Math.cos(angle) - 8);
    const y = Math.round(ringCy + ry * Math.sin(angle) - 8);
    outlined(i === 0 ? c['blue-3'] : c['stone-3'], x, y, 16, 16);
  }
}
