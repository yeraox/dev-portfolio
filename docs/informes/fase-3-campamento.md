# Informe · Fase 3 — Campamento y menú circular

**Fecha de cierre:** 11 de noviembre de 2026
**Estado:** ✅ terminada, pendiente de tu revisión y tu commit. El fondo del campamento es **tu
imagen** (`references/grandes/campamento.jpg`), integrada el mismo día (sección 3.6).

## Resumen en tres líneas
- La página principal ya es el campamento: tú y Null delante de la cueva, sobre tu fondo, con la
  hoguera parpadeando, el menú circular a tu alrededor, el banner y el HUD. Funciona con teclado,
  ratón y toques, en el ordenador, la tablet y el móvil.
- Antes de construir adapté la fase a los cambios de la fase 2: escena de 640×360, personajes
  desde tus PNG, el píxel de las ventanas atado a la escena y el fondo generado por ti.
- Rendimiento dentro del presupuesto con margen:
  - Lighthouse móvil: 99 en rendimiento y 100 en accesibilidad.
  - JS inicial de 77,9 KB y 208 KB en total con tu fondo.
  - 60 fps también con la CPU frenada ×4.

---

## 1. Decisiones tomadas en esta fase

| Decisión | Resultado | Quién |
|---|---|---|
| Fondo del campamento | **Lo generas tú** con tu generador y lo uso tal cual (instrucciones en `docs/fondo-campamento.md`) | Tú |
| Cómo usar tu fondo | **Tal cual, sin encajarlo en su rejilla**: encajado perdía los detalles a medio píxel. Solo se convierte a WebP (564 → 64 KB) | Yo (ver 3.6) |
| Dónde estáis tú y Null | Pies en la línea 310, el borde inferior del claro: el icono izquierdo del anillo pasa bajo la hoguera, no encima | Yo |
| Hoguera animada | Sin hoja de llamas: la llama parpadea apagando por turnos algunos de sus propios píxeles | Yo (lo proponían las instrucciones del fondo) |
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
| Fondo dibujado por mí | Generado por ti y usado tal cual |

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
- **`campLayout`:** dónde está cada cosa: el fondo, tus pies, los de Null y el centro del anillo.
  Estás siempre en tu pose de frente, respirando (ver 3.7).
- **`fireFlicker`:** el parpadeo de la hoguera (ver 3.6).
- El fondo provisional dibujado en código, que usé mientras no llegaba el tuyo, ya está borrado.

### 3.5 Herramientas
- **`npm run scenes`** (`scripts/sprites/scene.mjs`): convierte tus fondos a WebP, tal cual, y
  mide su rejilla.
- **`npm run check:camp`:** un recorrido de 18 comprobaciones solo con teclado (1440) y solo con
  toques (móvil), con capturas.
- **`npm run fps`:** fotogramas por segundo con el anillo girando sin parar, con la CPU ×1 y ×4,
  y el tiempo de respuesta más lento a una tecla o un clic.
- **`npm run shots`:** ahora el móvil y la tablet se emulan como táctiles, como los de verdad
  (por ejemplo, no muestran las teclas).

### 3.6 Tu fondo del campamento
1. **Lo medí:**
   - 1376×768 px, sin marca de agua y con todos los elementos pedidos.
   - Sus píxeles miden 5,74 px, con una rejilla bastante regular (0,64 en x y 0,71 en y; tu
     pose de frente da 0,73). Equivale a un pixel art de unos 240×134.
2. **Probé a encajarlo en su rejilla**, como a los personajes:
   - Los detalles finos, más pequeños que un píxel, salían mal: patas del trípode, humo,
     brillos de las mancuernas y cuerda de la tienda.
   - Una regla para conservar líneas finas mejoró el trípode, pero las mancuernas seguían siendo
     manchas y la cuerda desaparecía.
   - Comparé las dos opciones a tamaño real en 1440, y tu imagen original ganaba con claridad.
3. **Se usa tal cual:**
   - `npm run scenes` solo la convierte a WebP con calidad 85: pasa de 564 KB a 64 KB y no se
     nota la diferencia ni ampliada al doble.
   - Ocupa todo el alto de la escena. Al ser un poco más ancha que 16:9 sobran 2,5 px a cada
     lado.
   - Se dibuja a píxel exacto; solo se suaviza si hubiera que reducirla mucho.
4. **Escala:** de pie mides justo el 30 % del alto de la imagen, lo que pedían las instrucciones.
   La tienda queda algo más alta que tú.
5. **Posiciones:**
   - Tus pies pasan de la línea 296 a la **310**, el borde inferior del claro donde empieza el
     camino, y los de Null a la 312.
   - Con el anillo un poco más abajo, en la versión publicada (4 secciones) la carta de COMMS
     queda justo debajo de la hoguera, sobre el resplandor, sin tapar la paellera.
6. **La hoguera:**
   - Tres variantes de la llama en las que se apagan un poco, por turnos, algunos de sus propios
     píxeles (píxeles de arte enteros), cada 110 ms en un orden irregular.
   - Lo comprobé con capturas seguidas: cambian hasta 477 píxeles, todos dentro de la llama.
   - La paellera y el resto no se tocan, y con "reducir movimiento" la llama se queda quieta.
   - Se dibuja con la misma transformación que el fondo, para que encaje exacto.

### 3.7 Sin brazos cruzados (tu decisión, 11-11-2026)
La pose de brazos cruzados no te convencía, así que la he quitado del todo:
- Ya no se genera `yeray-arms.png`: salió de la lista de `cutout.mjs`. Tu referencia
  `brazos_cruzados_yeray.jpg` sigue en `references/`, intacta.
- Ya no existe `YERAY.armsCrossed`, ni el temporizador de 3 s que la activaba en el campamento.
- Tampoco sale en la página `/dev/personajes` ni en el recorrido automático.

En el campamento estás siempre en tu pose de frente, respirando. Las poses que añadas en los
retoques finales entrarán por el mismo camino que las demás.

---

## 4. Cómo se ha comprobado

| Comprobación | Resultado |
|---|---|
| `npm run typecheck` / `npm run lint` | ✅ Sin errores ni avisos |
| `npm test` | ✅ 111 pruebas (antes 77): máquina de estados, geometría del anillo, ajuste a pantallas, textura de corchetes |
| `npm run check:camp` en desarrollo (6 secciones) | ✅ 18/18 |
| `npm run check:camp` en el build de producción (4 secciones), 3 veces seguidas | ✅ 18/18 las tres |
| Capturas 390 / 768 / 1440 | ✅ Sin desbordamiento ni errores de consola: `.screenshots/fase-3-campamento-*.png`, más `camp-check-*.png` (anillo y ventana abierta) |
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
Medido con tu fondo ya puesto (antes de tenerlo: 144 KB en total y rendimiento 100).

| Métrica | Objetivo | Resultado |
|---|---|---|
| JavaScript inicial (gzip) | ≤ 100 KB | ✅ **77,9 KB** |
| Peso total de la primera carga | ≤ 300 KB | ✅ **208 KB** (Lighthouse), de los que 64 KB son tu fondo |
| LCP móvil (4G lento + CPU ×4 simulados) | ≤ 2,5 s | ✅ **1,6 s** (escritorio 0,4 s) |
| CLS | < 0,1 | ✅ **0,001** |
| Respuesta a teclas y clics (idea del INP) | < 200 ms | ✅ **32 ms** como máximo, también con CPU ×4. El bloqueo total (TBT) en Lighthouse móvil es de 0 ms |
| Fotogramas por segundo | 60 / ≥ 30 con CPU ×4 | ✅ **60 y 60**, con la hoguera parpadeando: ningún fotograma por encima de 33 ms |
| Lighthouse móvil | ≥ 95 en rendimiento y accesibilidad | ✅ **99 / 100** (escritorio 100 / 100) |

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
| Encajado en su rejilla, tu fondo perdía los detalles a medio píxel: mancuernas como manchas, cuerda de la tienda borrada, trípode a trozos | Se usa tal cual, solo convertido a WebP. Lo decidí comparando las dos opciones a tamaño real (sección 3.6) |
| **El JS inicial subió a 102,7 KB** (presupuesto 100): Vite mete en el JS, en base64, las imágenes de menos de 4 KB, que son los 9 fotogramas de Null que la escena ni usa | `assetsInlineLimit: 0` en `vite.config.ts`: cada PNG va aparte y solo se descarga al dibujarse. El JS bajó a **77,8 KB** |
| Al cerrar la ventana, el foco no volvía al anillo | El `<dialog>` seguía abierto en modo modal y el resto de la página no admite foco. Ahora se cierra antes de devolver el foco |
| El tabulador salía de la ventana hacia la barra del navegador | Bucle de foco dentro de la ventana (patrón ARIA de diálogo modal) |
| **Un toque justo después de deslizar no abría nada** (fallaba 2 de cada 3 veces en producción) | Había dos causas. Mi código se "tragaba" el siguiente clic tras un deslizamiento; ahora solo durante 400 ms y se reinicia al tocar otra vez. Además, Chrome no genera el clic de un toque que llega justo después de un deslizamiento rápido. Por eso los iconos leen el toque del propio dedo (`touchend`) y cancelan el clic sintético. Probado 8 de 8 y luego 3 recorridos completos |
| En la tablet, el HUD se salía por abajo | El hueco reservado crece con `--u`, y en vertical el HUD es compacto (nombre al lado del retrato) |
| El linter avisó de un `setState` dentro de un efecto, y de un `useEffectEvent` llamado desde un evento | El primero, con el patrón de React de ajustar el estado durante el renderizado. El segundo, separando la función normal de la del temporizador |

---

## 7. Observaciones para las próximas fases
- **Con 6 secciones**, que es como se ve en desarrollo con BUFFS y CRAFT, el icono de arriba a la
  izquierda cae sobre la paellera. Con las 4 publicadas no pasa. No hay forma del anillo que
  esquive la hoguera sin salirse de la escena. Cuando esas dos secciones tengan contenido,
  decidimos: mover tu posición, otro óvalo o aceptarlo.
- **El banner tapa la parte alta de la boca de la cueva** en el ordenador. Tu imagen la puso algo
  más arriba de lo pedido. En el móvil y en la intro (fase 6) se ve entera.
- **Llamas de verdad:** si algún día generas la hoja de llamas, el parpadeo se cambia por una
  animación dibujada.
- **Más poses:** cuando añadas poses nuevas en los retoques finales, entran por el mismo camino:
  `npm run characters`, una entrada en `characters.ts` y su comprobación con capturas.
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
| `src/scenes/camp/*` | **Nuevos**: la escena, su colocación y el parpadeo de la hoguera |
| `scripts/sprites/scene.mjs` | **Nuevo**: tus fondos a WebP, tal cual (`npm run scenes`) |
| `src/assets/scenes/camp.webp`, `scenes.gen.ts` | **Nuevos (generados)**: tu fondo (64 KB) y sus medidas |
| `scripts/sprites/cutout.mjs`, `src/assets/characters/` (`yeray-arms.png` **borrado**, `characters.gen.ts`, `characters.ts`, `characters.test.ts`), `src/dev/CharactersDemo.tsx` | Sin la pose de brazos cruzados (3.7) |
| `src/App.tsx`, `src/App.module.css` | La portada provisional pasa a ser el campamento (el `.css` se borra) |
| `vite.config.ts` | Sin imágenes dentro del JS |
| `scripts/camp-check.mjs`, `scripts/fps.mjs` | **Nuevos**: recorrido y rendimiento |
| `scripts/screenshot.mjs`, `package.json` | Móvil y tablet táctiles; scripts `scenes`, `check:camp` y `fps` |
| `DESIGN.md`, `BRIEF.md`, `CONTENT.md`, `CLAUDE.md`, `docs/plan-de-fases.md` | Ajustes por la fase 2 y lo construido |
| `docs/fondo-campamento.md` | **Nuevo**: lo que te pedí para el fondo y cómo se ha usado |
| `docs/informes/fase-3-campamento.md` | Este informe |

### Commits recomendados
Si aún no has hecho los de la fase 2 y su anexo, haz esos primero (están en
`docs/informes/fase-2-anexo-caminar.md`).

```bash
# 0. Drop the arms-crossed pose
git add scripts/sprites/cutout.mjs src/assets/characters/ src/dev/CharactersDemo.tsx
git commit -m "refactor(characters): drop the arms-crossed pose"

# 1. Pure logic: state machine, ring geometry, stage layout
git add src/game/ src/content/
git commit -m "feat(game): add camp state machine, ring geometry and stage layout"

# 2. Engine hooks and canvas character drawing
git add src/engine/useGameLoop.ts src/engine/useInput.ts src/engine/useScreen.ts src/engine/drawCharacter.ts
git commit -m "feat(engine): add shared game loop, input, screen hooks and character drawing"

# 3. UI pieces: ring menu, HUD, section dialog, brackets
git add src/components/ src/assets/textures.ts src/assets/textures.test.ts src/styles/contrast.ts
git commit -m "feat(ui): add ring menu, HUD and section dialog with closing wipe"

# 4. Scene backgrounds: Yeray's camp image as WebP
git add scripts/sprites/scene.mjs src/assets/scenes/
git commit -m "feat(scenes): add scene background pipeline with the generated camp image"

# 5. The camp scene as the home page
git add src/scenes/ src/App.tsx src/App.module.css
git commit -m "feat(camp): add camp hub scene with flickering campfire"

# 6. Build: keep images out of the JavaScript
git add vite.config.ts
git commit -m "build: never inline images into the JavaScript bundle"

# 7. Checks: walkthrough, frame rate, touch screenshots (+ the new npm scripts)
git add scripts/ package.json
git commit -m "test: add camp walkthrough and frame-rate checks, emulate touch in screenshots"

# 8. Docs
git add DESIGN.md BRIEF.md CONTENT.md CLAUDE.md docs/
git commit -m "docs: adapt phase 3 to the 640x360 character system and add camp background brief"
```

Al terminar, `git status` debería decir `nothing to commit, working tree clean`.

---

## 9. Siguiente paso
- **Tú:** revisa el campamento en **http://localhost:5173/**, ya con tu fondo.
- **Fase 4 — Ventanas con tu contenido**, cuando la apruebes:
  - Los diccionarios ES/EN con `useLocale`.
  - Las ventanas EQUIP, ALCHEMY, STATS y COMMS con tus datos reales.
  - Las capturas de los proyectos en WebP y el vídeo de Capyroad recortado (≤ 2 MB).
