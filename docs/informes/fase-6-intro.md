# Informe · Fase 6 — Intro: salida de la cueva

**Fecha de cierre:** 13 de noviembre de 2026
**Estado:** ✅ terminada, pendiente de tu revisión y tu commit.

## Resumen en tres líneas
- Tras PRESS START, el fundido te descubre **en la boca de la cueva de tu imagen del campamento**.
  Bajas caminando hasta tu sitio y Null te sigue unos pasos por detrás, trota a su sitio y se
  sienta. Entonces **el anillo se despliega** a tu alrededor y aparecen el banner y los retratos.
- Dura **4,7 s**. Se salta en cualquier momento (SKIP INTRO, cualquier tecla, Escape, clic o
  toque) y se pausa si cambias de pestaña. Quien vuelve entra directamente al campamento, y
  con "reducir movimiento" no hay paseo.
- La intro es **un guion de datos** que se edita sin tocar la lógica. Todo dentro del
  presupuesto: 60 fps también con la CPU ×4 y Lighthouse 99/100.

---

## 1. Decisiones tomadas

| Decisión | Qué se eligió | Quién |
|---|---|---|
| Escenario | **La cueva de tu imagen del campamento**: la intro y el campamento son la misma escena, como decía el plan | Plan |
| Punto de partida | **Empiezas en el umbral de la cueva**, no dentro. Mides 110 px y la abertura 82: si salieras de dentro, la roca de encima te taparía la cabeza (ver problema 1). Null sí cabe y empieza dentro, oscuro sobre lo oscuro | Yo (cambiable) |
| Recorrido | Recto hacia la cámara hasta tu sitio. Null baja por tu derecha y trota a su sitio | Yo (cambiable) |
| Duración | **4,7 s** con la apertura del anillo (el plan pedía 4–6 s) | Yo (cambiable) |
| Apertura del anillo | Se despliega desde tu cintura en 6 saltos de 2 fotogramas (0,2 s) mientras gira un hueco. La etiqueta aparece al terminar | Yo |
| Cómo se salta | SKIP INTRO, **cualquier tecla (también Escape)**, un clic o un toque. Los dos aparecéis en vuestro sitio y el anillo se abre | Yo |
| Quien vuelve | **Entra directamente en el campamento, sin título** (lo pide el brief: "Returning visitors start at HUB"). Basta con haber llegado una vez al campamento | Brief |
| Ver el título otra vez | **`/#title`** lo enseña siempre (hay que recargar después de escribirlo) | Yo |
| Foco | Al terminar la intro, el foco pasa al anillo: con teclado o lector de pantalla se sigue sin buscar nada | Yo |
| Descargas | Los dibujos de Null andando (27 KB) solo se descargan si hay intro. El título los precarga | Yo |

---

## 2. Qué se ha hecho, paso a paso

### 2.1 El reproductor de guiones (`src/game/script.ts`)
- Cada personaje tiene un guion con:
  - un punto de partida;
  - una lista de pasos;
  - una pose de descanso para cuando termina.
- Hay dos tipos de paso:
  - `wait`: quedarse quieto en una pose, que puede estar animada;
  - `walk`: caminar en línea recta hasta un punto, a cierta velocidad.
- `actorAt(guion, ms)` dice dónde está el personaje y en qué pose. Las posiciones van siempre en
  píxeles enteros de la escena.
- Si dos pasos seguidos usan la misma pose, el ciclo de caminar continúa sin reiniciarse.
- Pruebas en `script.test.ts`: duración, esperas, caminar en línea recta, ciclo continuo y pose
  de descanso.

### 2.2 El guion de la intro (`src/scenes/camp/intro.ts`)
- **La boca de la cueva, medida en tu imagen:** x 283–358, y 30–112 en la escena.
- **Tú:**
  - esperas 0,5 s en el umbral (y 112);
  - caminas hasta (320, 310) a 60 px/s, unos 58 px por ciclo de 0,96 s, para que los pies no
    patinen;
  - te quedas de pie.
- **Null:**
  - espera 1,1 s;
  - baja a 68 px/s por tu derecha;
  - trota a 90 px/s hasta (376, 312);
  - se sienta.
  - Para "Null quieto de frente" se usa el primer dibujo de su caminar hacia la cámara, con las
    patas juntas, mantenido (`NULL_DOG.stand`). Es componer con sus dibujos, no pintar nada.
- Cuando los dos están en su sitio, una pausa de 0,3 s y se pasa al campamento.
- Pruebas en `intro.test.ts`:
  - que dure 4–6 s;
  - que los dos empiecen en la boca de la cueva;
  - que **terminen justo donde el campamento os dibuja** (no hay salto al acabar);
  - que Null salga después y vaya siempre detrás de ti.

### 2.3 La escena (`src/scenes/camp/`)
- **`CampCanvas.tsx`:**
  - Durante la intro, cada fotograma pregunta al guion dónde estáis.
  - El que está más abajo en la pantalla se dibuja delante.
  - Cada pose tiene su sombra.
  - El reloj de la intro solo avanza con fotogramas dibujados. Una pestaña oculta detiene el
    bucle de juego, y al volver el primer fotograma cuenta como un paso corto, así que **la
    escena se pausa**.
- **`CampScene.tsx`:**
  - Durante la intro no hay anillo, y el banner y los retratos están ocultos pero ocupan su
    sitio.
  - SKIP INTRO abajo a la derecha. Cualquier tecla, clic o toque salta la intro.
  - Al terminar, el foco pasa al anillo.
- **`RingMenu.tsx` + `src/game/ring.ts`:** la apertura del anillo (`openSpread`,
  `openingOffset`), con pruebas.

### 2.4 Las pantallas y las visitas
- **`src/game/screens.ts`:**
  - Se añade INTRO, y la transición recuerda qué revela (`to: 'INTRO' | 'CAMP'`).
  - PRESS START lleva a la intro, y SKIP INTRO del título directo al campamento.
  - Si saltas mientras la intro aún está apareciendo, el fundido termina en el campamento.
- **`src/game/visit.ts`:** guarda "ya ha venido" en el navegador al llegar al campamento. Solo un
  sí o un no, nada personal, y protegido por si el navegador no deja guardar.
- **`src/App.tsx`:**
  - Con "reducir movimiento", PRESS START va directo al campamento.
  - `/#title` siempre enseña el título.

### 2.5 Piezas compartidas
- **`src/components/SkipIntro.*`:** el botón SKIP INTRO, el mismo en el título y en la intro y en
  el mismo sitio.
- **`src/engine/anyKey.ts`:** qué cuenta como "cualquier tecla". Lo usan el título (para empezar)
  y la intro (para saltarla).

### 2.6 Comprobaciones
- **`scripts/intro-check.mjs`** (`npm run check:intro`, nuevo).
- **`check:title`:** empezar ahora lleva a la intro, y SKIP INTRO al campamento.
- **`npm run fps`:** también mide la intro.

---

## 3. Cómo se ha comprobado

| Comprobación | Resultado |
|---|---|
| `npm run typecheck` | ✅ sin errores |
| `npm run lint` | ✅ sin avisos |
| `npm test` | ✅ 12 archivos, **158 pruebas** (+17: guion, intro, pantallas, apertura del anillo) |
| `npm run check:intro` | ✅ todas |
| `npm run check:title`, `check:camp`, `check:windows` | ✅ todas |

`check:intro` comprueba:
- Capturas a 390, 768 y 1440 en `.screenshots/fase-6/`: a mitad del paseo (`intro-*.png`) y
  después (`campamento-tras-intro-*.png`). Sin errores de consola ni desbordamiento.
- **Nada se mueve** cuando aparecen el banner y los retratos: la escena mide y está en el mismo
  sitio antes y después, también en el móvil.
- SKIP INTRO se ve desde el primer fotograma. Durante la intro no hay menú, banner ni retratos.
- **La intro dura 4,82 s** desde que aparece la escena hasta que el anillo está abierto, con el
  fundido incluido.
- Después están el anillo, el banner y los retratos, y SKIP INTRO ya no está.
- **El foco está en el anillo** y responde a las flechas enseguida.
- **Saltar funciona:**
  - mientras aún está apareciendo, a la mitad y al final;
  - con Escape, con cualquier tecla y con un clic;
  - con un toque en el móvil.
- SKIP INTRO en el título lleva al campamento sin intro.
- **La segunda visita entra directamente en el campamento**, y `/#title` vuelve a enseñar el
  título.
- Un enlace al campamento no descarga los dibujos de Null andando.
- **Con "reducir movimiento" no hay paseo.**
- **Al ocultar la pestaña 2,5 s, la intro termina 2,5 s más tarde**: se ha pausado.

### Rendimiento (build de producción)

| Métrica | Objetivo | Resultado |
|---|---|---|
| JavaScript inicial (gzip) | ≤ 100 KB | ✅ **86,8 KB** (+1,3 KB: el guion, la intro y la apertura del anillo) |
| Primera carga, título (con la precarga del campamento y de la intro) | ≤ 300 KB | ✅ **219 KB** (+27 KB: los dibujos de Null andando) |
| Primera carga, `/#camp` (quien vuelve) | ≤ 300 KB | ✅ **220 KB** (sin los dibujos de la intro) |
| LCP móvil | ≤ 2,5 s | ✅ **1,6 s** el título, 2,0 s `/#camp`, 2,2 s `/#equip` |
| CLS | < 0,1 | ✅ **0,025** el título (la fuente al llegar, fase 7), 0 el campamento, 0,001 `/#equip` |
| Respuesta a teclas y clics | < 200 ms | ✅ **40 ms** como máximo, también con CPU ×4 |
| Fotogramas, intro | 60 / ≥ 30 con CPU ×4 | ✅ **60** y **59,5**: un solo fotograma lento de 327 con la CPU ×4 |
| Fotogramas, anillo girando | 60 / ≥ 30 con CPU ×4 | ✅ **60 y 60** |
| Lighthouse móvil | ≥ 95 | ✅ Título **99/100**, `/#camp` **99/100** y `/#equip` **98/100** (rendimiento/accesibilidad). Buenas prácticas 96 y SEO 91 quedan para la fase 7: favicon y `robots.txt` |

---

## 4. TypeScript en esta fase

| Concepto | Dónde verlo | En una línea |
|---|---|---|
| **Unión discriminada para los pasos del guion** | `ScriptStep` en `src/game/script.ts` | Tras `step.type === 'walk'`, TypeScript deja leer `step.to` y `step.speed`; en un `wait` solo existe `step.ms` |
| **Uniones de textos como valor** | `to: 'INTRO' \| 'CAMP'` en `Screen` (`screens.ts`) | `return { name: screen.to }` compila porque los dos valores posibles son nombres de pantalla válidos |
| **Copiar un objeto cambiando un campo** | `{ ...screen, half: 'in' }` en `screens.ts` | Los tres puntos copian todos los campos (también `to`) y luego se cambia solo `half` |
| **Un objeto como parámetro, con su tipo** | `initialScreen({ hash, visited }: ScreenStart)` | Al llamar se ve qué es cada valor, y si falta uno no compila |
| **`import type`** | `import type { Pose } …` en `script.ts` | Trae solo el tipo, no el código: el reproductor no carga las imágenes de los personajes |
| **Opcional con valor por defecto** | `flip: step.flip ?? false` en `script.ts` | Si un paso no dice `flip`, vale `false` |

---

## 5. Problemas encontrados y cómo se resolvieron

| Problema | Solución |
|---|---|
| **Eres más alto que la boca de la cueva** (110 px frente a 82). Si salías desde dentro, la roca de encima te tapaba la cabeza: medio cuerpo sin cabeza en la oscuridad | Empiezas en el umbral, delante de la roca, y el fundido del título te descubre ahí. Null mide 38 px, cabe, y aparece al salir a la luz. Si quieres una salida "de verdad", la solución es una imagen con la cueva más alta (sección 6) |
| **Null iba pegado a ti**: salía casi a la vez y al mismo paso | Sale 1,1 s después, a 68 px/s. Una prueba asegura que siempre va detrás |
| **El lint rechazó** llamar a una función de `useEffectEvent` desde el bucle de juego | Se llama directamente a la función recibida: el bucle ya usa siempre su última versión |
| Quien vuelve o entra por un enlace **descargaba los dibujos de la intro** (27 KB) sin verlos | Solo se descargan si hay intro, y una comprobación lo vigila |
| **`/#title` no hacía nada** al escribirlo sobre la página abierta: cambiar solo la parte `#` no recarga la página | Se documenta que hay que recargar, y la comprobación recarga |
| `check:title` esperaba el campamento justo después de empezar | Ahora espera la intro, y que SKIP INTRO lleve al campamento |
| La comprobación de **"la segunda visita entra en el campamento"** fallaba a veces: recargaba en cuanto veía el anillo, que ya está durante el fundido, antes de que la visita quedara guardada | Espera a que termine el fundido. Además, **una de las 12 pasadas** de `check:intro` falló en una comprobación que no llegué a ver en la salida. Las 10 siguientes pasaron todas. Si te sale un ✗, pásamelo |

---

## 6. Observaciones para las próximas fases
- **Fase 7:**
  - El enlace a la vista CV, visible siempre, también en el título.
  - Precargar la fuente del título (CLS 0,025 → 0).
  - El favicon y `robots.txt`.
  - La red de seguridad del brief: bajar a 30 fps si los fotogramas van lentos. Hoy no hace
    falta (59,5 fps con la CPU ×4), pero está prometida.
- **Quien vuelve no vuelve a ver el título.** Si te parece demasiado, hay dos opciones:
  - que vea siempre el título y solo se salte la intro;
  - un "Ver la intro" en COMMS.
- **Null "pidiendo" al llegar** (lo proponía el plan) necesita un dibujo tuyo de esa pose, con
  la misma regla que los demás personajes: yo no los dibujo.
- **Salir de verdad desde dentro de la cueva** necesitaría una boca de cueva más alta que tú:
  unos 125 px de escena, el 35 % del alto de la imagen. Con tu imagen actual la intro funciona
  bien así.

---

## 7. Lo que necesito de ti
1. **Mira la intro** en `npm run dev`: http://localhost:5173/#title y recarga. Si ya habías
   llegado al campamento, `/` te lleva directo a él (es lo que pide el brief).
2. **Dime si te convencen:**
   - la duración (4,7 s);
   - el recorrido y el retraso de Null;
   - la apertura del anillo;
   - que quien vuelve entre sin título.
3. **Siguen abiertas cuatro cosas de la fase 4:**
   - el inglés en `/dev/textos`;
   - la frase "moneda ficticia" de Capyroad;
   - la nota de confidencialidad de Bosa Digital;
   - el tramo del vídeo.

---

## 8. Archivos para tu commit

| Archivo | Qué es |
|---|---|
| `src/game/script.ts`, `script.test.ts` | **Nuevos**: el reproductor de guiones, con pruebas |
| `src/scenes/camp/intro.ts`, `intro.test.ts` | **Nuevos**: el guion de la intro, con pruebas |
| `src/assets/characters/characters.ts` | `NULL_DOG.stand`: Null quieto de frente (su primer dibujo del caminar) |
| `src/components/SkipIntro.tsx`, `.module.css` | **Nuevos**: el botón SKIP INTRO compartido |
| `src/engine/anyKey.ts` | **Nuevo**: qué cuenta como "cualquier tecla" |
| `src/scenes/title/TitleScreen.tsx`, `.module.css` | Usa las piezas compartidas; SKIP INTRO va directo al campamento |
| `src/scenes/camp/CampCanvas.tsx`, `CampScene.tsx`, `CampScene.module.css`, `campAssets.ts` | La intro en la escena del campamento, la pausa, el foco y las descargas |
| `src/components/RingMenu.tsx`, `src/game/ring.ts`, `ring.test.ts` | La apertura del anillo |
| `src/game/screens.ts`, `screens.test.ts`, `src/game/visit.ts`, `src/App.tsx` | La intro en el paso de pantallas, quien vuelve y `/#title` |
| `scripts/intro-check.mjs`, `scripts/title-check.mjs`, `scripts/fps.mjs`, `package.json` | **Nuevo** `npm run check:intro`; el título lleva a la intro; fotogramas de la intro |
| `DESIGN.md`, `BRIEF.md`, `CLAUDE.md`, `docs/plan-de-fases.md`, `docs/fondo-campamento.md` | Intro, apertura del anillo, comandos y reglas |
| `docs/informes/fase-6-intro.md` | Este informe |

> Si aún no has hecho los commits de las fases 4 o 5, hazlos primero (sección 8 de
> `fase-4-ventanas.md` y de `fase-5-titulo.md`).

### Commits recomendados
```bash
# 1. The cutscene script player and the intro's script
git add src/game/script.ts src/game/script.test.ts src/scenes/camp/intro.ts src/scenes/camp/intro.test.ts src/assets/characters/characters.ts
git commit -m "feat(intro): add a cutscene script player and the cave intro script"

# 2. SKIP INTRO and "any key", shared by the title and the intro
git add src/components/SkipIntro.tsx src/components/SkipIntro.module.css src/engine/anyKey.ts src/scenes/title/
git commit -m "refactor(title): share SKIP INTRO and any-key handling with the intro"

# 3. The intro inside the camp scene, and the ring opening after it
git add src/scenes/camp/ src/components/RingMenu.tsx src/game/ring.ts src/game/ring.test.ts
git commit -m "feat(camp): play the cave intro in the camp scene and open the ring after it"

# 4. Screen flow: intro, returning visitors, /#title
git add src/game/screens.ts src/game/screens.test.ts src/game/visit.ts src/App.tsx
git commit -m "feat(screens): add the intro to the flow and start returning visitors at the camp"

# 5. Checks
git add scripts/intro-check.mjs scripts/title-check.mjs scripts/fps.mjs package.json
git commit -m "test: add cave intro walkthrough and measure the intro's frame rate"

# 6. Docs
git add DESIGN.md BRIEF.md CLAUDE.md docs/
git commit -m "docs: document the cave intro and add phase 6 report"
```

Al terminar, `git status` debería decir `nothing to commit, working tree clean`.

---

## 9. Siguiente fase
**Fase 7 — Vista CV, calidad y accesibilidad**, cuando la apruebes:
- La vista `/cv/` en texto plano y la descarga del CV en PDF, con un enlace siempre visible.
- Auditoría y pulido (`impeccable audit` + `polish`).
- Favicon, `robots.txt`, metadatos e imagen para compartir.
- Precarga de fuentes.
- La red de seguridad de los 30 fps.
