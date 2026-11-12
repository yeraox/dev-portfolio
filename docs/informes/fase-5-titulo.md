# Informe · Fase 5 — Pantalla de título

**Fecha de cierre:** 12 de noviembre de 2026
**Estado:** ✅ terminada, pendiente de tu revisión y tu commit.

## Ronda 2 — tus anotaciones

> "Lo de IES Poeta Paco Mollà me lo quitas, eso no es para nada relevante; los árboles parecen
> penes, arréglalos… todo lo demás me gusta mucho."

1. **Fuera la línea del instituto.**
   - Se ha quitado del título y del contenido (`title.school` ya no existe en `types.ts`, `es.ts`
     ni `en.ts`), y también de `CONTENT.md`, `BRIEF.md` y el plan.
   - El instituto sigue en STATS, en la formación, que es donde importa.
2. **Árboles nuevos.**
   - **La causa:** cada árbol era una columna estrecha y separada de las demás, con la punta
     redondeada y los pisos abultados.
   - **Ahora son abetos puntiagudos:**
     - un solo píxel en la punta;
     - cuatro pisos de ramas que se escalonan hacia fuera;
     - la base es más ancha que la distancia entre árboles, así que **siempre se solapan** y
       forman una línea de bosque continua y dentada;
     - las alturas y las posiciones varían un poco de un árbol a otro.
   - El claro delante de la cueva sigue quitando árboles enteros.
3. **Comprobado:** `check:title` ✅, tipos, lint y pruebas ✅. Capturas nuevas en
   `.screenshots/fase-5/`.

---

## Resumen en tres líneas
- La web ya empieza como un juego: cielo de noche, montaña con la cueva, abetos, **"YERAY
  CATURLA"** grande en oro con relieve, créditos, **PRESS START** parpadeando a saltos, ES/EN y
  SKIP INTRO.
- Cualquier tecla, clic o toque arranca. Se pasa al campamento con un **fundido a negro por pasos
  de la paleta con trama de puntos**, y el campamento se ha descargado mientras mirabas el título.
- Los enlaces a ventanas (`/#equip`) se saltan el título. Todo dentro del presupuesto:
  Lighthouse 99/100, 60 fps también con la CPU ×4.

---

## 1. Decisiones tomadas

| Decisión | Qué se eligió | Quién |
|---|---|---|
| Transición | **Fundido por pasos con trama de puntos** (¼ → ½ → ¾ → negro), 16 fotogramas de ida y 16 de vuelta. El plan dejaba elegir entre esto y un mosaico; el mosaico necesita fotografiar la pantalla, y la ventana del título es texto real, no canvas | Yo |
| Fondo | **Dibujado en código con la paleta** (montaña, cueva, abetos, estrellas). Así no hay imagen que descargar y llena cualquier pantalla. Si prefieres una imagen generada, como la del campamento, se sustituye | Yo (cambiable) |
| Tamaño del nombre | 120 px en 1440, 180 px en 1920, 60 px en el móvil. Nunca pasa del 90 % del ancho | Yo |
| Instituto en el título | **Quitado** (ronda 2, a petición tuya) | Tú |
| Créditos | **Se traducen**: "DESARROLLADOR BACKEND · …" en español y "BACKEND DEVELOPER · …" en inglés. El brief los daba solo en inglés | Yo (cambiable) |
| PRESS START y SKIP INTRO | En inglés en los dos idiomas: son etiquetas de juego, como EQUIP | Brief |
| SKIP INTRO | De momento hace lo mismo que empezar: la intro llega en la fase 6 | Yo |
| Enlace a la vista CV | **Se pospone a la fase 7**: `/cv/` todavía no existe y un enlace roto sería peor que ninguno | Yo |
| Enlaces a ventanas | Cualquier `#` en la dirección se salta el título. `/#camp` lleva al campamento (lo usan las comprobaciones) | Yo |
| Precarga | El fondo del campamento y los personajes se descargan mientras el título está en pantalla | Yo |

---

## 2. Qué se ha hecho, paso a paso

### 2.1 El paso entre pantallas (`src/game/screens.ts`)
- Una máquina de pantallas pequeña, como la del campamento:
  - **TITLE** → (empezar) → **TRANSITION ida** → (todo negro) → **TRANSITION vuelta** → (claro)
    → **CAMP**.
  - Un enlace con `#` empieza directamente en CAMP.
- `src/App.tsx` la usa con `useReducer`:
  - Durante la ida se ve el título oscureciéndose.
  - Durante la vuelta, el campamento aclarándose.
  - El cambio ocurre cuando la pantalla está del todo negra, así que no se ve ningún salto.
- Pruebas en `screens.test.ts`: cada paso, y que las acciones fuera de orden no hacen nada.

### 2.2 La transición (`src/components/DitherTransition.*`)
- **Una capa que cubre la página** con una trama de 4×4 (Bayer) en `night-0`:
  - 4 escalones (¼, ½, ¾ y negro sólido), 4 fotogramas cada uno.
  - Usa el bucle de juego compartido, así que va a saltos de fotograma.
- Los patrones de la trama están en `src/assets/textures.ts` (`DARKEN_STEPS`), con su prueba.
- Con "reducir movimiento" salta directamente al final.

### 2.3 La pantalla de título (`src/scenes/title/`)
- **`titleBackground.ts`**: el paisaje píxel a píxel, solo con colores de la paleta.
  - Cielo `night-0` con estrellas sueltas, que se aclara por bandas y tramas hasta la línea de
    brillo del horizonte.
  - La montaña (`night-1`), con la boca de la cueva a sus pies.
  - Un bosque de abetos puntiagudos que se solapan, con un claro delante de la cueva (ronda 2).
- **`TitleScreen.tsx`**:
  - El nombre es un `h1` de texto real.
  - Línea de créditos en Jersey 10.
  - PRESS START, ES/EN y SKIP INTRO son botones de verdad, accesibles con teclado.
  - Escucha teclas en toda la página y clics en toda la pantalla, salvo en los botones.
- **`TitleScreen.module.css`**:
  - Letras doradas en bandas duras con sombras sin desenfoque.
  - Parpadeo de 48 fotogramas en `steps(1)`.
  - Si PRESS START tiene el foco no parpadea, para que nunca desaparezca lo que vas a pulsar.

### 2.4 Cambios para que el título y el campamento convivan
- **`src/engine/useUiTokens.ts`** (nuevo): los tamaños de interfaz (`--u`, texto, títulos) se
  ponen en la página desde `App`. Antes los ponía el campamento, y ahora el título los necesita
  antes.
- **`src/scenes/camp/campAssets.ts`** (nuevo):
  - La carga del fondo del campamento y de las poses.
  - El título la lanza al aparecer y el campamento reutiliza lo ya descargado.
- **`src/game/stage.ts`**:
  - El diseño de pantalla guarda también el tamaño de la ventana del navegador.
  - `titleNameSize` calcula el tamaño del nombre, con pruebas.
- **Contenido**: `title` (nombre, créditos, PRESS START, SKIP INTRO) en `types.ts`, `es.ts` y
  `en.ts`; sección nueva en `CONTENT.md`.
- **Contraste**: dos parejas nuevas en `contrast.ts`:
  - `text` sobre `night-0`, para los créditos;
  - `text-dim` sobre `ink`, para ES/EN y SKIP INTRO.

### 2.5 Comprobaciones
- **`scripts/title-check.mjs`** (`npm run check:title`, nuevo).
- **`camp-check`, `windows-check` y `fps`** ahora entran por `/#camp`: si no, se encontraban el
  título.

---

## 3. Cómo se ha comprobado

| Comprobación | Resultado |
|---|---|
| `npm run typecheck` | ✅ sin errores |
| `npm run lint` | ✅ sin avisos |
| `npm test` | ✅ 10 archivos, **141 pruebas** (nuevas: pantallas, tamaño del título, tramas de la transición) |
| `npm run check:title` | ✅ todas |
| `npm run check:camp` | ✅ todas (entrando por `/#camp`) |
| `npm run check:windows` | ✅ todas |

`check:title` comprueba:
- 6 capturas (ES/EN × 390/768/1440) en `.screenshots/fase-5/`, sin errores de consola ni
  desbordamiento lateral.
- El título es un `h1` real.
- Un navegador en español ve los créditos en español.
- **Tab** pasa a los botones sin empezar.
- **Enter sobre EN** cambia el idioma sin empezar, y los créditos pasan al inglés.
- **Cualquier otra tecla** empieza.
- La transición pasa por los **5 escalones** (0–4) y la capa desaparece al final.
- Un **clic** en el cielo empieza, **SKIP INTRO** va al campamento y un **toque** en el móvil
  empieza.
- El **fondo del campamento y el caminar de Yeray se descargan durante el título**.
- **`/#comms`** se salta el título y abre la ventana.
- Con **"reducir movimiento"**, PRESS START no parpadea y el campamento aparece enseguida.

### Rendimiento (build de producción)

| Métrica | Objetivo | Resultado |
|---|---|---|
| JavaScript inicial (gzip) | ≤ 100 KB | ✅ **85,5 KB** (+2 KB: el título, la transición y las pantallas) |
| Primera carga, título (con la precarga del campamento) | ≤ 300 KB | ✅ **192 KB** |
| Primera carga, `/#camp` | ≤ 300 KB | ✅ **219 KB** |
| LCP móvil | ≤ 2,5 s | ✅ **1,7 s** el título (el elemento es el nombre); 1,9 s `/#camp` |
| CLS | < 0,1 | ✅ **0 a 0,027** en el título según la pasada (al llegar la fuente, el bloque central se recoloca un poco); 0 en el campamento |
| Respuesta a teclas y clics | < 200 ms | ✅ **32 ms** (CPU ×1) y **40 ms** (CPU ×4) como máximo |
| Fotogramas, anillo girando | 60 / ≥ 30 con CPU ×4 | ✅ **60 y 60** |
| Fotogramas, transición | 60 / ≥ 30 con CPU ×4 | ✅ **60** y **58** de media con CPU ×4; un solo fotograma de 50 ms cuando aparece el campamento |
| Lighthouse móvil, título | ≥ 95 | ✅ Rendimiento **99**, accesibilidad **100** (buenas prácticas 96 y SEO 91: favicon y `robots.txt`, fase 7) |
| Lighthouse móvil, `/#camp` | ≥ 95 | ✅ **99** y **100** |

---

## 4. TypeScript en esta fase

| Concepto | Dónde verlo | En una línea |
|---|---|---|
| **Tipos de eventos del navegador** | `onKeyDown(event: KeyboardEvent)` en `TitleScreen.tsx` | TypeScript sabe que el evento trae `key`, `repeat`, `ctrlKey`…; si escribes `event.kye`, no compila |
| **Eventos de React frente a los del navegador** | `onClick(event: MouseEvent<HTMLElement>)` en `TitleScreen.tsx` | El `MouseEvent` de React es un tipo genérico: entre `<>` va el elemento que escucha |
| **`instanceof` para estrechar tipos** | `event.target instanceof Element` en `TitleScreen.tsx` | `target` podría ser cualquier cosa; tras la comprobación TypeScript deja usar `closest()` |
| **Unión discriminada (pantallas)** | `Screen` en `src/game/screens.ts` | Solo `TRANSITION` tiene `half`; tras `screen.name === 'TRANSITION'`, TypeScript deja leer `screen.half` |
| **`useReducer` con función de inicio** | `useReducer(screenReducer, location.hash, hash => initialScreen(…))` en `App.tsx` | El estado inicial se calcula una sola vez a partir de la dirección, y su tipo sale de `initialScreen` |
| **Uniones de textos literales** | `half: 'out' \| 'in'` en `DitherTransition.tsx` | Solo valen esas dos palabras; `'fuera'` no compila |
| **`??=`** | `start.current ??= now` en `DitherTransition.tsx` | "Si todavía no tiene valor, dale este": guarda el instante del primer fotograma |
| **Tipo de una propiedad nueva** | `viewport: { width; height }` en `StageLayout` (`stage.ts`) | Al añadirla al tipo, el compilador señaló cada sitio que construía un `StageLayout` sin ella |

---

## 5. Problemas encontrados y cómo se resolvieron

| Problema | Solución |
|---|---|
| Algunas capturas salían **sin PRESS START**: se hacían justo en la parte apagada del parpadeo | `check:title` espera a que esté encendido y congela las animaciones al hacer la foto |
| **El nombre se veía pequeño** y la montaña se confundía con el cielo | Tamaño propio para el nombre (`titleNameSize`), y bandas del cielo reordenadas para que la montaña destaque sobre un tono más claro |
| `check:title` daba **fallos falsos**: buscaba el `h1` del título y encontraba el encabezado oculto del campamento, que empieza igual | Búsqueda por el nombre exacto |
| **Los abetos parecían triángulos**, y en el borde del claro había árboles cortados por la mitad | El claro decide por árbol entero. En la ronda 2 cambió la forma de los árboles (ver arriba) |
| **Lighthouse avisó** de que los botones ES/EN se llamaban "Español"/"English" para el lector de pantalla y "ES"/"EN" en pantalla (quien maneja la web por voz dice lo que ve) | Ahora se llaman "ES Español" y "EN English": primero lo visible y luego el nombre completo, oculto |
| Las comprobaciones del campamento, las ventanas y los fotogramas **se encontraban el título** | Entran por `/#camp` |

---

## 6. Observaciones para las próximas fases
- **Fase 6 (intro):** SKIP INTRO pasará a saltarse de verdad la intro de la cueva.
  - Quien vuelva a la web debería poder saltarla sin tener que pulsar nada.
  - La transición ya está lista para enlazar título → cueva → campamento.
- **Fase 7:**
  - El enlace a la vista CV en el título.
  - Precargar la fuente Jersey 10 para dejar el CLS del título en 0.
  - El favicon (hoy da un 404 en consola) y `robots.txt`.
- **El paisaje del título está hecho en código.** Si quieres más detalle, puedes generar una
  imagen como la del campamento y se usaría tal cual.
- **En el móvil, la línea de créditos se parte en dos** y deja un "·" al final de la primera.
  Si te molesta, se puede acortar la línea o poner un salto de línea fijo.

---

## 7. Lo que necesito de ti
1. **Mira el título** en `npm run dev` (http://localhost:5173/) o en las capturas de
   `.screenshots/fase-5/`. Para volver a verlo desde el campamento, quita el `#…` de la
   dirección y recarga.
2. **Dime si te convencen:**
   - el paisaje;
   - el tamaño del nombre;
   - la transición;
   - que los créditos se traduzcan.
3. **Pendiente de la fase 4** (la aprobaste, pero quedaron abiertas):
   - el inglés en `/dev/textos`;
   - la frase de Capyroad ("moneda ficticia");
   - la nota de confidencialidad de Bosa Digital;
   - el tramo del vídeo.

---

## 8. Archivos para tu commit

| Archivo | Qué es |
|---|---|
| `src/game/screens.ts`, `screens.test.ts` | **Nuevos**: título → transición → campamento, con pruebas |
| `src/components/DitherTransition.tsx`, `.module.css` | **Nuevos**: el fundido por pasos con trama |
| `src/assets/textures.ts`, `textures.test.ts` | Las tramas de la transición (`BAYER_4`, `DARKEN_STEPS`) |
| `src/scenes/title/*` | **Nuevos**: pantalla de título, estilos y paisaje |
| `src/engine/useUiTokens.ts` | **Nuevo**: tamaños de interfaz puestos desde `App` |
| `src/scenes/camp/campAssets.ts`, `CampCanvas.tsx`, `CampScene.tsx` | Carga compartida del campamento (para la precarga); el campamento ya no pone los tamaños |
| `src/game/stage.ts`, `stage.test.ts` | Tamaño de la ventana del navegador y `titleNameSize` |
| `src/App.tsx` | El paso entre pantallas |
| `src/content/types.ts`, `es.ts`, `en.ts` | Textos del título |
| `src/styles/contrast.ts` | Dos parejas de contraste nuevas |
| `scripts/title-check.mjs`, `package.json` | **Nuevo**: `npm run check:title` |
| `scripts/camp-check.mjs`, `scripts/fps.mjs`, `scripts/windows-check.mjs` | Entran por `/#camp` |
| `CONTENT.md`, `DESIGN.md`, `BRIEF.md`, `CLAUDE.md`, `docs/plan-de-fases.md` | Título, transición, comandos |
| `docs/informes/fase-5-titulo.md` | Este informe |

> **Si todavía no has hecho los commits de la fase 4**, hazlos primero
> (`docs/informes/fase-4-ventanas.md`, sección 8). Varios archivos (`App.tsx`, `stage.ts`,
> `es.ts`, `en.ts`, `types.ts`, `contrast.ts`, `CampScene.tsx`, `windows-check.mjs`…) tienen
> cambios de las dos fases. Entrarán en el commit de la fase 4 que los añada primero, y los
> commits de abajo recogerán lo que quede.

### Commits recomendados
```bash
# 1. Screen flow and the dithered transition
git add src/game/screens.ts src/game/screens.test.ts src/components/DitherTransition.tsx src/components/DitherTransition.module.css src/assets/textures.ts src/assets/textures.test.ts src/App.tsx
git commit -m "feat(screens): add title-to-camp flow with a dithered palette-step transition"

# 2. The title screen
git add src/scenes/title/ src/game/stage.ts src/game/stage.test.ts src/content/ src/styles/contrast.ts
git commit -m "feat(title): add title screen with gold name, credits, blinking PRESS START and ES/EN"

# 3. Camp assets shared with the title, UI tokens set from the app
git add src/engine/useUiTokens.ts src/scenes/camp/
git commit -m "refactor(camp): share camp asset loading for preloading and set UI tokens from the app"

# 4. Checks
git add scripts/title-check.mjs scripts/camp-check.mjs scripts/fps.mjs scripts/windows-check.mjs package.json
git commit -m "test: add title screen walkthrough and enter the other checks through #camp"

# 5. Docs
git add CONTENT.md DESIGN.md BRIEF.md CLAUDE.md docs/
git commit -m "docs: document the title screen and transition, add phase 5 report"
```

Al terminar, `git status` debería decir `nothing to commit, working tree clean`.

---

## 9. Siguiente fase
**Fase 6 — Intro: salida de la cueva**, cuando la apruebes:
- La boca de la cueva en vista ¾ desde arriba.
- Yeray sale caminando con el "sello" aprobado y Null trota detrás, hasta el campamento.
- Entre 4 y 6 segundos, y se puede saltar.
- Quien vuelve a la web se la salta.
- Sin intro con "reducir movimiento".
