# Informe · Fase 3 — Campamento y menú circular

**Fecha de cierre:** 11 de noviembre de 2026
**Estado:** ✅ terminada, pendiente de tu revisión y tu commit. El fondo del campamento es
**provisional** hasta que generes el tuyo (`docs/fondo-campamento.md`).

## Resumen en tres líneas
- La página principal ya es el campamento: tú y Null, el menú circular a tu alrededor, el banner
  y el HUD. Funciona con teclado, ratón y toques, en el ordenador, la tablet y el móvil.
- Antes de construir adapté la fase a los cambios de la fase 2: escena de 640×360, personajes
  desde tus PNG, el píxel de las ventanas atado a la escena y el fondo generado por ti.
- Rendimiento dentro del presupuesto con margen:
  - Lighthouse móvil: 100 en rendimiento y 100 en accesibilidad.
  - JS inicial de 77,8 KB y 144 KB en total.
  - 60 fps también con la CPU frenada ×4.

---

## 1. Decisiones tomadas en esta fase

| Decisión | Resultado | Quién |
|---|---|---|
| Fondo del campamento | **Lo generas tú** con tu generador y lo uso tal cual. Instrucciones exactas en `docs/fondo-campamento.md`; mientras tanto, fondo provisional en código | Tú |
| Personajes en la escena | En el **canvas**, desde sus PNG de la fase 2, apoyados por la fila del suelo | Yo |
| Resolución del canvas | **Píxeles reales de la pantalla**, para que Null sentado (píxeles a mitad de tamaño) salga nítido | Yo |
| Tamaño de la escena | Número entero de píxeles de pantalla por píxel de escena; si pierde más del 20 %, ajuste exacto | Yo |
| `--u` (píxel de las ventanas) | 2 píxeles de escena, entre 2 y 4 px: 4 px en tu portátil, como en la fase 1 | Yo |
| Móvil y tablet en vertical | Se ve el **centro** de la escena (360 px), más grande; banner encima, HUD debajo, ventanas a todo lo ancho | Yo |
| Clic o toque en un icono | **Abre la sección directamente** (más rápido para quien busca proyectos o contacto) | Yo |
| Ventanas | `<dialog>` nativo con botón **[ESC] EXIT** (también para táctil) y cierre en 10 fotogramas | Yo |
| HUD | Retratos de tus referencias (tu cabeza hasta la perilla) y nombres. Sin barras ni números | Plan (podías cambiarlo) |
| Títulos del banner | Propuestos por mí: "Equipo — Proyectos", "Alquimia — Stack técnico"… (en `CONTENT.md`) | Yo (revísalos) |
| Imágenes dentro del JS | **Nunca**: cada PNG va aparte y solo se descarga cuando se dibuja | Yo (ver 5) |

---

## 2. Ajustes por los cambios de la fase 2

Lo que decía el plan original y cómo ha quedado:

| Plan original (320×180, sprites dibujados) | Ahora |
|---|---|
| Óvalo del anillo de 62×42 | **124×84**, alrededor de tu centro (escena 320, 241) |
| Iconos de 16×16 a escala de escena | 16×16 dibujados a **2 px de escena** por píxel (32×32) |
| `--u` = escala de la escena | `--u` = **2 píxeles de escena** (2–4 px). Sin esto las ventanas se verían a la mitad de grosor |
| Retratos de 48×48 | Tus retratos de referencia (64×94 y 50×47) en un marco de 64×76 |
| Personajes como rejillas en el canvas | Tus PNG de la fase 2, colocados por `ground` |
| Escena en móvil a ×1 (pequeña) | Se ve el centro de la escena, más grande |
| Fondo dibujado por mí | Generado por ti; provisional en código hasta entonces |

También actualicé:
- `docs/plan-de-fases.md`: la sección de la fase 3. Tu hueco de comentarios sigue ahí.
- `DESIGN.md`: escala, `--u`, anillo, HUD, escena y ventana. Quité además las "paletas de
  personajes", que ya no existen.
- `BRIEF.md`: la lista de sprites tenía aún los tamaños de 32×40.
- `CONTENT.md`: decía que la fase 3 convertía todo el contenido; es la fase 4. Añadí los títulos
  del banner.
- `CLAUDE.md`: los comandos nuevos.

---

## 3. Qué se ha hecho, paso a paso

### 3.1 Lógica pura, con pruebas (`src/game/`)
- **`state.ts`** — la máquina de estados:
  - Dos estados: `HUB`, con el anillo y la sección de arriba, y `WINDOW`, con la sección
    abierta.
  - Cuatro acciones: girar, abrir la de arriba, abrir una tocada y cerrar.
  - Con una ventana abierta, el anillo no se mueve.
- **`ring.ts`** — la geometría del anillo: el ángulo de cada icono, su posición en el óvalo, el
  giro por el camino corto y la posición en cada uno de los 8 fotogramas.
- **`stage.ts`** — cómo cabe la escena en cada pantalla: el modo (horizontal o vertical), la
  cámara, la escala, `--u` y el tamaño de los retratos.

### 3.2 Hooks y dibujo (`src/engine/`)
- **`useGameLoop`:**
  - Un único `requestAnimationFrame` compartido por todo lo que se mueve.
  - Solo funciona mientras alguien lo usa y la pestaña está visible.
- **`useInput`:**
  - Las flechas, Enter, Espacio y Esc se convierten en acciones, en toda la página.
  - Un deslizamiento lateral sobre la escena gira el anillo.
  - Los botones siguen reaccionando a Enter por sí mismos.
- **`useScreen`:** el tamaño de la ventana y "reducir movimiento", leídos con
  `useSyncExternalStore`.
- **`drawCharacter`:**
  - Dibuja una pose (fotograma y respiración) con los pies en su suelo, en píxeles enteros de
    pantalla.
  - También dibuja la sombra tramada: la mitad de los píxeles en `ink`, sin transparencias.

### 3.3 Componentes (`src/components/`)
- **`RingMenu`:**
  - Un botón por sección, con el icono de 16×16.
  - Los corchetes azules son un *nine-slice* nuevo (`BRACKETS`) y la etiqueta va sobre una placa
    `ink`.
  - El giro dura 8 fotogramas con el bucle compartido, y es instantáneo con "reducir
    movimiento".
  - El foco sigue al icono de arriba.
- **`Hud`:**
  - Dos paneles de piedra con el bisel de las ventanas, el retrato en una "pantalla" oscura y el
    nombre en dorado.
  - En vertical, el nombre va al lado del retrato.
- **`SectionDialog`:**
  - La ventana de cada sección como `<dialog>` modal nativo.
  - El tabulador da la vuelta dentro y Esc o [ESC] EXIT la cierran con la cortina inversa.
  - Un clic fuera también la cierra, y el foco vuelve al anillo.
- **`IconCanvas`:** pinta un icono de 16×16 en un canvas diminuto.
- **Cambios en componentes de la fase 1:**
  - `Window` admite `closing` (la cortina de cierre) y `titleId`.
  - `BannerWindow` admite un hueco a la derecha para las teclas.

### 3.4 La escena (`src/scenes/camp/`)
- **`CampScene`:**
  - Une el estado, la entrada, el canvas, el anillo, el banner, el HUD y la ventana.
  - BUFFS y CRAFT solo aparecen en desarrollo.
- **`CampCanvas`:**
  - Dibuja el fondo, las sombras, a ti y a Null.
  - El bucle pregunta en cada fotograma, pero solo redibuja si algo cambió: una pose, una
    respiración o el tamaño.
- **`provisionalBackground`:** el fondo provisional, de 320×180 píxeles de la paleta: pared de
  roca con la cueva, masas de árboles, suelo y claro.
- **`campLayout`:** dónde está cada cosa. A los 3 s sin tocar el menú cruzas los brazos.

### 3.5 Herramientas
- **`npm run check:camp`:** un recorrido de 18 comprobaciones solo con teclado (1440) y solo con
  toques (móvil), con capturas.
- **`npm run fps`:** fotogramas por segundo con el anillo girando sin parar, con la CPU ×1 y ×4,
  y el tiempo de respuesta más lento a una tecla o un clic.
- **`npm run shots`:** ahora el móvil y la tablet se emulan como táctiles, como los de verdad
  (por ejemplo, no muestran las teclas).

---

## 4. Cómo se ha comprobado

| Comprobación | Resultado |
|---|---|
| `npm run typecheck` / `npm run lint` | ✅ Sin errores ni avisos |
| `npm test` | ✅ 111 pruebas (antes 77): máquina de estados, geometría del anillo, ajuste a pantallas, textura de corchetes |
| `npm run check:camp` en desarrollo (6 secciones) | ✅ 18/18 |
| `npm run check:camp` en el build de producción (4 secciones), 3 veces seguidas | ✅ 18/18 las tres |
| Capturas 390 / 768 / 1440 | ✅ Sin desbordamiento ni errores de consola: `.screenshots/fase-3-campamento-*.png`, más `camp-check-*.png` (ventana abierta, brazos cruzados) |
| Página de ventanas de la fase 1 | ✅ Igual que antes |

**Las comprobaciones del recorrido:**
- **Teclado:**
  - → y ← giran el anillo y el foco le sigue.
  - El banner nombra la sección y Enter la abre.
  - La ventana lleva el nombre de su sección y el tabulador no sale de ella.
  - Esc la cierra, el anillo no se movió mientras estaba abierta y el foco vuelve al anillo.
  - Sin errores de consola.
- **Táctil:**
  - Deslizar gira el anillo sin abrir nada.
  - Tocar un icono lo abre, el botón de cerrar funciona y la sección tocada queda arriba.

### Rendimiento (build de producción)

| Métrica | Objetivo | Resultado |
|---|---|---|
| JavaScript inicial (gzip) | ≤ 100 KB | ✅ **77,8 KB** |
| Peso total de la primera carga | ≤ 300 KB | ✅ **144 KB** (Lighthouse) |
| LCP móvil (4G lento + CPU ×4 simulados) | ≤ 2,5 s | ✅ **1,7 s** (escritorio 0,4 s) |
| CLS | < 0,1 | ✅ **0,001** |
| Respuesta a teclas y clics (idea del INP) | < 200 ms | ✅ **32 ms** como máximo, también con CPU ×4. El bloqueo total (TBT) en Lighthouse móvil es de 30 ms |
| Fotogramas por segundo | 60 / ≥ 30 con CPU ×4 | ✅ **60 y 60**: ningún fotograma por encima de 33 ms |
| Lighthouse móvil | ≥ 95 en rendimiento y accesibilidad | ✅ **100 / 100** (escritorio 100 / 100) |

**Lighthouse:**
- Se ejecutó una vez con `npx`. No está instalado en el proyecto.
- "Buenas prácticas" da 96 y SEO 91 por dos cosas de la fase 7:
  - Falta el favicon: el navegador pide `/favicon.ico` y da un 404.
  - Falta `robots.txt`.

---

## 5. TypeScript en esta fase

| Concepto | Dónde verlo | En una línea |
|---|---|---|
| **Unión discriminada** | `src/game/state.ts` (`GameState`) | Tras `if (state.scene === 'WINDOW')`, TypeScript sabe que existe `state.section`; en `HUB` no te deja leerla |
| **`useReducer` tipado** | `src/scenes/camp/CampScene.tsx` | El tipo del estado sale del reductor: `dispatch` solo acepta las cuatro acciones de `GameAction` |
| **Hooks propios con tipos** | `src/engine/useGameLoop.ts`, `useInput.ts` | Sus parámetros son funciones con tipo (`(now: number) => void`), así que un mal uso se marca al escribirlo |
| **Unión de textos** | `SectionId` en `src/content/sections.ts` | Solo seis palabras válidas: un `'equp'` mal escrito es un error |
| **`satisfies Record<SectionId, …>`** | `src/content/es.ts` | Si añades una sección y olvidas su título, no compila |
| **`instanceof` para estrechar** | `src/engine/useInput.ts` | Dentro del `if`, `event.target` ya es un `Element` y se puede usar `closest()` |
| **Tuplas en tablas de pruebas** | `src/game/stage.test.ts` | `[ancho, alto, dpr, modo, escala, u]`: cada posición con su tipo |

---

## 6. Problemas encontrados y cómo se resolvieron

| Problema | Solución |
|---|---|
| **El JS inicial subió a 102,7 KB** (presupuesto 100): Vite mete en el JS, en base64, las imágenes de menos de 4 KB, que son los 9 fotogramas de Null que la escena ni usa | `assetsInlineLimit: 0` en `vite.config.ts`: cada PNG va aparte y solo se descarga al dibujarse. El JS bajó a **77,8 KB** |
| Al cerrar la ventana, el foco no volvía al anillo | El `<dialog>` seguía abierto en modo modal y el resto de la página no admite foco. Ahora se cierra antes de devolver el foco |
| El tabulador salía de la ventana hacia la barra del navegador | Bucle de foco dentro de la ventana (patrón ARIA de diálogo modal) |
| **Un toque justo después de deslizar no abría nada** (fallaba 2 de cada 3 veces en producción) | Había dos causas. Mi código se "tragaba" el siguiente clic tras un deslizamiento; ahora solo durante 400 ms y se reinicia al tocar otra vez. Además, Chrome no genera el clic de un toque que llega justo después de un deslizamiento rápido. Por eso los iconos leen el toque del propio dedo (`touchend`) y cancelan el clic sintético. Probado 8 de 8 y luego 3 recorridos completos |
| En la tablet, el HUD se salía por abajo | El hueco reservado crece con `--u`, y en vertical el HUD es compacto (nombre al lado del retrato) |
| El linter avisó de un `setState` dentro de un efecto, y de un `useEffectEvent` llamado desde un evento | El primero, con el patrón de React de ajustar el estado durante el renderizado. El segundo, separando la función normal de la del temporizador |

---

## 7. Observaciones para las próximas fases
- **Tu fondo:** cuando lo generes, lo integro sin tocar el resto, porque ya ocupa 320×180 a
  2 píxeles de escena. Si haces la hoja de llamas, animo la hoguera.
- **Brazos cruzados:** su piel es algo más clara que la de la pose quieta, y al cruzarlos se nota
  el cambio de color. Si generas esa pose en el estilo de las hojas nuevas, se cambia en un
  minuto.
- **Fase 4:**
  - Las ventanas provisionales se llenan con tu contenido.
  - La ventana STATS de `/dev/windows` aún tiene el hueco de 48×48 para el retrato; usará tu
    retrato de referencia.
  - Aquí entran también `en.ts` y el cambio de idioma.
- **Fase 7:** favicon y `robots.txt`, que son los únicos avisos de Lighthouse.
- **Null pidiendo** ("Null is waiting…") no tiene referencia todavía.

---

## 8. Archivos para tu commit

| Archivo | Qué es |
|---|---|
| `src/game/state.ts`, `ring.ts`, `stage.ts` + sus `.test.ts` | **Nuevos**: lógica pura y sus pruebas |
| `src/content/sections.ts`, `src/content/es.ts` | **Nuevos**: secciones del anillo y textos del campamento |
| `src/content/.gitkeep`, `src/scenes/.gitkeep` | **Borrados** (las carpetas ya tienen archivos) |
| `src/engine/useGameLoop.ts`, `useInput.ts`, `useScreen.ts`, `drawCharacter.ts` | **Nuevos**: reloj, entrada, pantalla y dibujo de personajes |
| `src/components/RingMenu.*`, `Hud.*`, `SectionDialog.*`, `IconCanvas.tsx` | **Nuevos** |
| `src/components/Window.*`, `BannerWindow.*` | Cortina de cierre, `titleId` y hueco para las teclas |
| `src/assets/textures.ts`, `textures.test.ts` | Textura de los corchetes |
| `src/styles/contrast.ts` | Dos combinaciones nuevas (tecla resaltada y nombres del HUD) |
| `src/scenes/camp/*` | **Nuevos**: la escena |
| `src/App.tsx`, `src/App.module.css` | La portada provisional pasa a ser el campamento (el `.css` se borra) |
| `vite.config.ts` | Sin imágenes dentro del JS |
| `scripts/camp-check.mjs`, `scripts/fps.mjs` | **Nuevos**: recorrido y rendimiento |
| `scripts/screenshot.mjs`, `package.json` | Móvil y tablet táctiles; scripts `check:camp` y `fps` |
| `DESIGN.md`, `BRIEF.md`, `CONTENT.md`, `CLAUDE.md`, `docs/plan-de-fases.md` | Ajustes por la fase 2 y lo construido |
| `docs/fondo-campamento.md` | **Nuevo**: qué necesito para el fondo |
| `docs/informes/fase-3-campamento.md` | Este informe |

### Commits recomendados
Si aún no has hecho los de la fase 2 y su anexo, haz esos primero (están en
`docs/informes/fase-2-anexo-caminar.md`).

```bash
# 1. Pure logic: state machine, ring geometry, stage layout
git add src/game/ src/content/
git commit -m "feat(game): add camp state machine, ring geometry and stage layout"

# 2. Engine hooks and canvas character drawing
git add src/engine/useGameLoop.ts src/engine/useInput.ts src/engine/useScreen.ts src/engine/drawCharacter.ts
git commit -m "feat(engine): add shared game loop, input, screen hooks and character drawing"

# 3. UI pieces: ring menu, HUD, section dialog, brackets
git add src/components/ src/assets/textures.ts src/assets/textures.test.ts src/styles/contrast.ts
git commit -m "feat(ui): add ring menu, HUD and section dialog with closing wipe"

# 4. The camp scene as the home page
git add src/scenes/ src/App.tsx src/App.module.css
git commit -m "feat(camp): add camp hub scene with provisional background"

# 5. Build: keep images out of the JavaScript
git add vite.config.ts
git commit -m "build: never inline images into the JavaScript bundle"

# 6. Checks: walkthrough, frame rate, touch screenshots
git add scripts/ package.json
git commit -m "test: add camp walkthrough and frame-rate checks, emulate touch in screenshots"

# 7. Docs
git add DESIGN.md BRIEF.md CONTENT.md CLAUDE.md docs/
git commit -m "docs: adapt phase 3 to the 640x360 character system and add camp background brief"
```

Al terminar, `git status` debería decir `nothing to commit, working tree clean`.

---

## 9. Siguiente paso
- **Tú:**
  - Revisa el campamento en **http://localhost:5173/**.
  - Genera el fondo siguiendo `docs/fondo-campamento.md` cuando puedas. No bloquea: lo integro
    en cuanto llegue, en cualquier fase.
- **Fase 4 — Ventanas con tu contenido**, cuando la apruebes:
  - Los diccionarios ES/EN con `useLocale`.
  - Las ventanas EQUIP, ALCHEMY, STATS y COMMS con tus datos reales.
  - Las capturas de los proyectos en WebP y el vídeo de Capyroad recortado (≤ 2 MB).
