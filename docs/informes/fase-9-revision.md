# Informe · Fase 9 — Revisión, refactor y limpieza

**Fecha:** 20 de noviembre de 2026
**Estado:** ✅ terminada, pendiente de tu revisión y tu commit.
- **Parte 1:** la revisión y todos los cambios que no se ven.
- **Parte 2:** los borrados y tus cuatro decisiones (A–D). Ver "Parte 2", al final.

## Resumen
- **He revisado todo el código** con las guías de la skill `modern-web-guidance` (diálogos,
  movimiento, pestañas, menús, accesibilidad, rendimiento e imágenes) y con herramientas: tipos,
  oxlint, búsqueda de código sin usar y `npm audit`.
- **He hecho los cambios que no se ven:**
  - los diálogos y las pestañas, como piden las guías;
  - las animaciones, activadas solo si no se pide menos movimiento;
  - comentarios al día, exportaciones internas y una librería común para los scripts de
    comprobación;
  - dependencias actualizadas.
- **Las 42 capturas de antes y después son idénticas píxel a píxel.** Lighthouse y fps, iguales o
  mejores.
- **Necesito tu OK** para la lista de borrados (punto 4) y para cuatro decisiones que sí cambian
  lo que se ve (punto 3).

---

## 1. Cómo lo he revisado

**Referencia del "antes":**
- 42 capturas deterministas: título, pergamino del CV, campamento y las 4 ventanas, en los
  2 idiomas y los 3 tamaños. Con "reducir movimiento", para que no salgan la hoguera ni los
  gestos a medias.
- Hice la tanda dos veces y salieron idénticas: la comparación final es fiable.
- Métricas de Lighthouse y fps.

**Herramientas:**
- `tsc` y `oxlint`: limpios.
- **Código sin usar:** el plan decía `knip` con `npx`, pero el modo automático de Claude Code lo
  bloqueó (descarga y ejecuta un paquete externo). Hice la misma búsqueda con un script mío que solo
  lee el código: qué archivos no importa nadie y qué exportaciones solo se usan dentro de su archivo
  o solo en las pruebas.
- `npm audit`: 0 vulnerabilidades. `npm outdated`: solo actualizaciones menores.

**Guías de la skill** (leídas desde su carpeta, sin ejecutar su `npx`):
- `dialog`, `platform-controls-dismiss-dialog`, `motion`, `tabs` y `menu`;
- `accessibility`, `performance`, `optimize-image-priority` y `optimize-preload-priority`;
- `visually-stable-font-fallbacks` y `responsive-design`.

**Lo que ya cumplía:**
- Ventanas con el `<dialog>` nativo abierto con `showModal()`, nombradas con `aria-labelledby` y sin
  `role="dialog"` añadido.
- Rueda con el patrón de menú horizontal y pestañas con el patrón de pestañas.
- Nombres accesibles que empiezan por el texto visible y áreas táctiles de 44 px.
- Sin conversiones de tipo con `as` (solo `as const`).
- Imágenes con su tamaño puesto (CLS 0) y vídeo que no se descarga hasta abrir Proyectos.

**Lo que no he usado aún:** las revisiones automáticas de Claude Code (`code-review` y
`simplify`). Propongo pasarlas en la parte 2, sobre el código ya limpio.

## 2. Lo que he cambiado (nada visible)

| Cambio | Por qué | Dónde |
|---|---|---|
| **Las ventanas ya no llevan una trampa de foco propia** (Tab desde el último botón volvía al primero) | La guía `dialog` lo prohíbe en un `<dialog>` modal: el navegador ya deja inerte el resto de la página. Con Tab solo se puede salir a la barra del propio navegador, como en cualquier modal | `SectionDialog.tsx` (−22 líneas). La comprobación de `check:camp` ahora exige lo que importa: "Tab nunca llega a la página de detrás" |
| **El scroll de una ventana no arrastra la página de detrás** (`overscroll-behavior: contain` en el diálogo y en su fondo) | La guía `dialog` lo marca como obligatorio | `SectionDialog.module.css` |
| **Pestañas sin `aria-controls`** | La guía `tabs`: ningún lector de pantalla lo usa | `WindowSections.tsx` |
| **La pestaña elegida se ve en el modo de alto contraste de Windows** (un contorno, solo en ese modo) | Ese modo borra fondos y sombras, y con ellos la placa y el punto que la marcan. Nunca solo con color (WCAG 1.4.1) | `WindowSections.module.css` |
| **Las animaciones solo se activan si el visitante no pide menos movimiento**: parpadeos de PRESS START y de la flecha de las secciones, barras del HUD, respiración de `PixelSprite` | La guía `motion`: activar el movimiento con `prefers-reduced-motion: no-preference`, no declararlo y anularlo después | 4 hojas CSS |
| **Comentarios al día:** fuera las etiquetas "(phase 8)" y "fase 6"; corregidos dos que mentían | `tokens.css` decía que la fase 3 pondría `--u` "más adelante" (ya lo hace); `App.tsx` citaba `/#equip`, que ya no existe | 25 archivos |
| **Lo que solo se usa dentro de su archivo ya no se exporta** (8 constantes y funciones) | Queda claro qué es interno y qué es para otros | `locale.ts`, `screens.ts`, `fireFlicker.ts`, `frameRate.ts`, `useIdleDirector.ts`, `textures.ts`, `contrast.ts` |
| **Librería común para los scripts de comprobación** (`scripts/lib/browser.mjs`): los 3 tamaños, la dirección que se prueba, el contador ✓/✗ y una página nueva con sus errores | Estaba copiado en 5 scripts. Ahora cada uno es más corto y solo dice lo suyo | `check:camp`, `check:title`, `check:intro`, `check:windows`, `shots`, `fps` |
| **Dependencias:** `vite` 8.3.8, `@vitejs/plugin-react` 6.3.0 y `oxlint` 1.94.0 | Parches y versiones menores. `playwright` se queda (un parche suyo puede cambiar el Chromium que usa Lighthouse) y `@types/node` 26 es un cambio mayor | `package.json`, `package-lock.json` |

## 3. Hallazgos que cambian lo que se ve: necesito tu decisión

**A. El contorno de las ventanas no se ve (fallo desde la fase 4).**
- **Qué pasa:** la animación de apertura acaba en `clip-path: inset(0)` y ese recorte se queda
  puesto. Recorta justo por el borde de la caja, así que el contorno exterior de tinta de 1 píxel
  (el CSS lo dibuja y el diálogo le reserva hueco) nunca aparece.
- **Mira:** `.screenshots/fase-9/contorno-ventana-ahora-vs-arreglado.png` (izquierda, ahora;
  derecha, arreglado).
- **Va unido a otra regla de la guía `motion`:** el reset global de "reducir movimiento"
  (`animation-duration: 0.01ms !important` para todo) no se debe usar. Al quitarlo, la ventana se
  abre sin animación, y sin recorte el contorno aparece.
- **Propongo hacer las dos cosas juntas:**
  - el recorte ya no se queda puesto al terminar la animación (el contorno se ve);
  - la animación de la ventana solo se activa si no se pide menos movimiento;
  - con "reducir movimiento", la ventana se cierra al instante, en vez de esperar 400 ms;
  - fuera el reset global.

**B. Un botón para pausar las animaciones (WCAG 2.2.2).**
- **Qué pasa:** el campamento se mueve siempre (la hoguera, la respiración y un gesto cada
  3–6 s).
- **Qué dice la guía:** lo que se mueve solo durante más de 5 segundos junto a otro contenido
  necesita un control visible para pararlo, y respetar "reducir movimiento" no lo sustituye.
- **Propongo:** un botón pequeño (por ejemplo, "ANIMACIÓN: SÍ/NO" en la línea de ayuda o junto al
  HUD) que pare la hoguera, la respiración y los gestos, y que se recuerde para la próxima visita.
- **Es una decisión de diseño:** dime si lo quieres y dónde.

**C. En la ventana Proyectos, las 3 pestañas se parten en 2 filas** en móvil y tableta (en los dos
idiomas).
- **Qué dice la guía `tabs`:** no partirlas, porque con dos filas cuesta seguir el orden y cuál
  está elegida.
- **Opciones:**
  1. que las no elegidas se encojan (con el texto recortado);
  2. una fila que se desliza de lado;
  3. textos de pestaña más cortos en móvil.
- **Mira:** `.screenshots/fase-9/pestanas-proyectos-2-filas-390.png`.

**D. Buscar en la página (Ctrl+F) solo encuentra la sección visible** de cada ventana.
- **Qué propone la guía `tabs`:** dejar las demás secciones ocultas con `hidden="until-found"`.
  Así el buscador del navegador las encuentra y abre la pestaña sola.
- **Para qué te serviría:** un reclutador que busque "Docker" lo encontraría.
- **Soporte:** Chrome, Edge y Firefox. En Safari simplemente no pasa nada.
- **Es opcional:** dime si lo quieres.

## 4. Lo que propongo borrar (nada se ha borrado: espera tu OK)

| Qué | Por qué |
|---|---|
| `src/engine/grid.ts` y `src/engine/sprites.ts`, con sus pruebas en `engine.test.ts` | El dibujante antiguo de iconos de 16×16. Desde la fase 8 los iconos son tus PNG y solo los usan sus pruebas |
| `drawAnimation` (en `sprites.ts`) y `ROPE_SLICE` (en `textures.ts`) | No los usa nadie |
| Las páginas `/dev/specimen` y `/dev/windows`, y el componente `StatBar`, que solo usa `/dev/windows` | El plan propone quedarse solo con `/dev/textos` y `/dev/personajes`. `specimen` es de la fase 0 y está desfasada; `windows`, de las fases 1 y 4 |
| El trote de lado antiguo de Null: la pose `trotSide`, sus 6 PNG (`null-side-*.png`), su entrada en el generador y su bloque en `/dev/personajes` | Desde el bloque G de la fase 8 camina de frente; el dibujo de lado es más pequeño y no se usa |
| `.screenshots/`: 86 MB de capturas antiguas (fuera de git) | Los scripts regeneran las que hacen falta. Me quedaría con `fase-8/` y `fase-9/` |
| `docs/animacion-caminar.md` y `docs/fondo-campamento.md` → `docs/historial/` (archivar, no borrar) | Son análisis de fases pasadas. `CLAUDE.md` enlaza el primero: actualizaría el enlace |
| `.impeccable/design.json` | Está desfasado (todavía dice "VER CV"). Propongo regenerarlo al final con `impeccable`, igual que `DESIGN.md` |

**`references/` es tuyo y no lo toco.** Estos archivos no los usa ningún generador:
- **De `grandes/`:**
  - `brazos_cruzados_yeray.jpg`, `camina_grande_yeray.jpg`, `caminado_frente_yeray.jpg` y
    `caminando_yeray.jpg`;
  - `frente_yeray.jpg` y `retrato_yeray.jpg`;
  - `null_camina_frente.jpg`, `null_camina_lado.jpg` y `null_frente.jpg`;
  - `null_caminando.jpg` (solo lo usa el trote de lado de arriba).
- **De `grandes/reposo/`:** `cafe.jpg`, `gafas.jpg` y `pensar.jpg` (las hojas antiguas).
- **De `portraits/`:** `portrait_yeray.jpg`.
- **En la raíz:** `avatar-concept.png`, `null-concept.png`, `dog-griffon.jpg` y `yeray.jpg`.
- **Los 40 archivos `…:Zone.Identifier`:** son metadatos que Windows añade a lo descargado y no
  sirven de nada.

## 5. Comprobaciones: antes y después

| | Antes | Después |
|---|---|---|
| Capturas (42) | referencia | **idénticas píxel a píxel** |
| Pruebas | 208 | 208 ✓ |
| `check:camp`, `check:title`, `check:windows` | ✓ | ✓ |
| `check:intro` | ✓ | ✓ (duración de la intro 4,3–4,8 s) |
| Lighthouse título | 99 · 100 · 100 · 100, LCP 1,7 s, 237 KB | **100** · 100 · 100 · 100, LCP 1,7 s, 236 KB |
| Lighthouse campamento | 99 · 100 · 100 · 100, LCP 2,0 s, 244 KB | 99 · 100 · 100 · 100, LCP 1,9 s, 244 KB |
| fps (rueda e intro, CPU ×1 y ×4) | 60 / 60 / 60 / 59,6 | 60 / 60 / 60 / 59,6 |
| Respuesta más lenta a una tecla (×1 / ×4) | 32 / 32 ms | 24 / 32 ms |
| JavaScript inicial | 89,25 KB comprimido | 89,14 KB |
| Archivos en `src/` / `scripts/` | 163 / 17 | 163 / 18 (+ la librería común) |
| Líneas: TypeScript / CSS / scripts | 6.069 / 1.921 / 2.900 | 6.049 / 1.940 / 2.866 |

Las líneas apenas bajan en esta parte. La bajada grande vendrá con los borrados del punto 4.

**Problemas por el camino:**
- **`check:intro` midió una vez 7,9 s.** Repetida, salió 4,3 s y 4,8 s, y el script anterior da
  4,8 s: fue la máquina cargada por las cuatro comprobaciones seguidas.
- **Lighthouse del campamento salió una vez 98 con LCP 2,3 s.** Repetido dos veces, salió 99 con
  1,9 s: variación normal.
- **El elemento LCP del campamento es el retrato de Null** (una imagen de fondo CSS).
  - La guía recomienda precargar la imagen LCP con `fetchpriority="high"`.
  - Pero la entrada normal es el título, cuyo LCP es el texto, y ahí la precarga competiría con
    las fuentes.
  - Con 1,9 s ya está bien (menos de 2,5 s), así que lo dejo como está.

## 6. TypeScript en esta fase

**Lo que no se exporta es privado del archivo.**

```ts
// Antes: cualquier archivo podía importarlo, aunque solo lo usa locale.ts
export const LOCALE_STORAGE_KEY = 'locale';
// Después: solo existe dentro de locale.ts
const LOCALE_STORAGE_KEY = 'locale';
```

- Un módulo de TypeScript (un archivo con `import` o `export`) es una caja cerrada: solo sale lo
  que lleva `export`.
- Quitarlo cuando nadie lo importa deja claro qué es la "puerta" del archivo y qué es detalle
  interno.
- Si algún día otro archivo lo necesita, el compilador avisa con
  `Module '"./locale"' has no exported member 'LOCALE_STORAGE_KEY'`.

**Menos código, menos tipos.**
- La trampa de foco quitada necesitaba `KeyboardEvent<HTMLDialogElement>`, el tipo genérico de
  React para un evento de teclado sobre un `<dialog>`.
- Al quitar el código, ese tipo deja de hacer falta.

## 7. Archivos para tu commit

(La tabla dice qué ha cambiado en esta fase. Parte ya entró en tus commits de las 18:50: abajo
están los commits que quedan.)

| Archivo | Cambio |
|---|---|
| `CLAUDE.md` | La skill `modern-web-guidance` en el apartado de skills |
| `src/components/SectionDialog.tsx`, `SectionDialog.module.css` | Sin trampa de foco; scroll contenido |
| `src/windows/WindowSections.tsx`, `WindowSections.module.css` | Sin `aria-controls`; alto contraste; parpadeo solo con movimiento |
| `src/scenes/title/TitleScreen.module.css`, `src/components/HudBar.module.css`, `src/components/PixelSprite.module.css` | Movimiento solo si no se pide menos |
| `src/content/locale.ts`, `src/game/screens.ts`, `src/scenes/camp/fireFlicker.ts`, `src/engine/frameRate.ts`, `src/scenes/camp/useIdleDirector.ts`, `src/assets/textures.ts`, `src/styles/contrast.ts` | Exportaciones internas |
| `src/App.tsx`, `src/styles/tokens.css`, `src/windows/StackWindow.tsx`, `src/windows/ContactWindow.tsx`, `src/scenes/camp/intro.ts`, `src/scenes/camp/CampScene.tsx`, `src/scenes/title/titleBackground.ts`, `src/assets/characters/characters.ts`, `src/components/CvDownloadDialog.tsx`, `src/components/Hud.tsx`, `src/components/Portrait.tsx`, `src/game/explored.ts`, `src/game/idle.ts` | Comentarios al día |
| `scripts/lib/browser.mjs` (nuevo), `scripts/camp-check.mjs`, `scripts/title-check.mjs`, `scripts/intro-check.mjs`, `scripts/windows-check.mjs`, `scripts/screenshot.mjs`, `scripts/fps.mjs` | Librería común de las comprobaciones |
| `scripts/share-assets.mjs`, `scripts/stack-icons.mjs`, `scripts/sprites/cutout.mjs`, `scripts/sprites/icons.mjs`, `scripts/sprites/idle.mjs`, `scripts/sprites/skin.mjs` | Comentarios al día |
| `package.json`, `package-lock.json` | Dependencias actualizadas |
| `docs/informes/fase-9-revision.md` | Este informe |

### Commits recomendados

**Lo que ya estaba guardado.** Tus commits de las 18:50 (los de los bloques B, C y H de la fase
8) se hicieron con comandos que añadían archivos y carpetas enteras, así que también se llevaron
cambios posteriores:
- de la fase 8: bloques D, E, F, G, I, J, K, L y M;
- de esta fase: el diálogo, las pestañas, el CSS de movimiento, los comentarios y `CLAUDE.md`.

Sus mensajes no lo cuentan todo, pero el trabajo está guardado.

**El último commit no compila:** `App.tsx` todavía importa `CvLink`, cuyo borrado ya está guardado.
Lo arregla el commit 1 de abajo. Entre los diez cubren los 48 cambios pendientes (lo comprobé con
`git status`).

```bash
# 1. The CV web view is gone: one page, its head and no-JavaScript note generated
git add cv src/cv index.html vite.config.ts src/App.tsx
git commit -m "feat(site): drop the CV web view and generate the page head and noscript note"

# 2. Characters: skin tone, portraits, Null's front walk and the idle actions
git add scripts/sprites/skin.mjs scripts/sprites/idle.mjs src/assets/characters docs/animacion-caminar.md
git commit -m "feat(characters): add skin tone, portraits, Null's front walk and idle actions"

# 3. The game loop survives a pose asked for before it starts (Null vanishing)
git add src/engine/drawCharacter.ts src/engine/drawCharacter.test.ts src/engine/useGameLoop.ts
git commit -m "fix(engine): never draw a pose before its start and keep the game loop alive on errors"

# 4. STACK window icons
git add scripts/stack-icons.mjs src/assets/stack
git commit -m "feat(stack): generate pixel icons for every technology from Simple Icons"

# 5. Lock file: simple-icons, and vite, the React plugin and oxlint updated
git add package-lock.json
git commit -m "chore(deps): lock simple-icons and update vite, react plugin and oxlint"

# 6. Favicon and touch icon from Yeray's face
git add public/favicon.png public/apple-touch-icon.png scripts/share-assets.mjs
git commit -m "feat(seo): make the favicon and touch icon from Yeray's in-game face"

# 7. Browser checks: the new features, and a shared setup
git add scripts/lib scripts/camp-check.mjs scripts/title-check.mjs scripts/intro-check.mjs scripts/windows-check.mjs scripts/screenshot.mjs scripts/fps.mjs
git commit -m "test: cover the new camp, title and window features and share the checks' setup"

# 8. Module internals kept private
git add src/assets/textures.ts src/engine/frameRate.ts
git commit -m "refactor: keep texture and frame-rate internals private"

# 9. The modern-web-guidance skill
git add .agents/skills/modern-web-guidance .claude/skills/modern-web-guidance skills-lock.json
git commit -m "chore(skills): add the modern-web-guidance skill"

# 10. This report
git add docs/informes/fase-9-revision.md
git commit -m "docs: add the phase 9 review report (part 1)"
```

## 8. Lo que necesito de ti
1. **OK o cambios a la lista de borrados** (punto 4).
2. **Las cuatro decisiones del punto 3:**
   - A: contorno y movimiento reducido; 
   - B: botón de pausa;
   - C: pestañas de Proyectos;
   - D: buscar en la página.
3. **Si paso las revisiones automáticas** `code-review` y `simplify` en la parte 2, sobre el código
   ya limpio.

---

# Parte 2 (20/11): borrados y decisiones A–D

## Resumen
- **Borrado lo que sobraba**, dejando lo necesario para futuros cambios. Se quedan los generadores,
  `/dev/textos`, `/dev/personajes`, los dos documentos de análisis (`CLAUDE.md` cita
  `animacion-caminar.md` como especificación del "sello") y tu carpeta `references/` entera.
- **A:** las ventanas enseñan por fin su contorno de tinta, y "menos movimiento" se trata
  animación por animación, sin el ajuste global.
- **B:** el engranaje sustituye a la bandera en la rueda y abre **AJUSTES**:
  - el idioma, cada uno con su bandera;
  - las animaciones, SÍ o NO.

  Con NO se para todo lo que se mueve solo, y las dos elecciones se recuerdan.
- **C:** las pestañas de Proyectos ya no se parten en dos filas.
- **D:** Ctrl+F encuentra texto en todas las secciones de todas las ventanas y abre la suya.

## 1. Lo borrado

| Qué | Por qué |
|---|---|
| `src/engine/grid.ts`, `src/engine/sprites.ts` y `src/engine/engine.test.ts` | El dibujante antiguo de iconos: solo lo usaban sus pruebas |
| `ROPE_SLICE` (en `textures.ts`) | No lo usaba nadie (`ROPE_FRAME` sí se usa: es el marco de cuerda del cartel) |
| `/dev/specimen` y `/dev/windows` (`Specimen.*`, `WindowsDemo.*`), y `StatBar.*` | Páginas de las fases 0, 1 y 4, desfasadas; `StatBar` solo vivía en `/dev/windows` |
| El trote de lado de Null: la pose `trotSide`, sus 6 PNG `null-side-*`, su entrada en el generador y su sombra | Sin uso desde que camina de frente. Tu `null_caminando.jpg` sigue en `references/` por si un día vuelve |
| Capturas viejas de `.screenshots/` (de 86 a 33 MB) | Las regeneran los scripts. Quedan `fase-8/` y `fase-9/` |

`.impeccable/design.json` está desfasado, pero no lo he tocado: lo propongo regenerar con
`impeccable` cuando cerremos la web, junto a `DESIGN.md`.

## 2. A — El contorno de las ventanas y el movimiento reducido
- **El contorno:** la animación de apertura ya no deja su recorte puesto al terminar
  (`animation-fill-mode: backwards`), así que el contorno de tinta de 1u aparece alrededor de cada
  ventana.
- **La animación de las ventanas solo se activa si hay movimiento.** Sin él (preferencia del sistema
  o animaciones en NO), la ventana aparece y desaparece al instante, y `SectionDialog` se cierra sin
  esperar los 400 ms del cierre.
- **Fuera el ajuste global** `animation-duration: 0.01ms !important`, que la guía `motion`
  desaconseja.

## 3. B — El engranaje y la ventana de AJUSTES
- **El icono:** tu `references/icons/engranaje.jpg` pasa por `npm run icons` como los demás:
  recortado, reducido a 28 px y sin repintar.
  - Es el sexto hueco de la rueda, después del CV.
  - Banner: "Engranaje — Ajustes" / "Gear — Settings".
- **La ventana**, compacta como la pregunta del CV, pero con su botón ESC EXIT:
  - **Idioma:** "🇪🇸 Español" y "🇬🇧 English", con tus banderas en píxeles enteros (nítidas).
  - **Animaciones:** SÍ / NO (ON / OFF en inglés).
  - Cada fila es un grupo de dos botones; el que está en uso, pulsado (`aria-pressed`) y en dorado.
  - Empieza con el foco en el idioma en uso.
- **Animaciones NO** para la hoguera, la respiración, los gestos, los parpadeos (PRESS START y la
  flecha), la cortinilla de las ventanas, el giro de la rueda, el fundido del título y la intro.
  - Es exactamente lo mismo que pedir "menos movimiento" al sistema.
  - Con esto se cumple WCAG 2.2.2 (pausar lo que se mueve solo).
- **Cómo funciona:**
  - `src/engine/motion.ts` guarda la elección en el navegador y la expone a React
    (`useReducedMotion`, `useAnimations`) y al CSS (`<html data-motion="off">`).
  - Cada animación se activa con
    `@media (prefers-reduced-motion: no-preference) { :root:not([data-motion='off']) … }`.
- **El idioma se sigue cambiando también en el título** (ES/EN). La rueda ya no tiene hueco de
  idioma.

## 4. C — Las pestañas en una fila
- Las pestañas ya no se parten (estrategia 3 de la guía `tabs`):
  - las no elegidas pueden encogerse y acabar en "…";
  - la elegida se ve siempre entera.
- **La etiqueta va dentro del nombre**, detrás: al recortar, se pierde antes la etiqueta que el
  nombre.
- **La pestaña de Bosa se llama "Bosa Digital"** (dato nuevo `tab` en los textos). El nombre completo
  sigue en el encabezado de su sección.
- **Mira:** `.screenshots/fase-9/pestanas-proyectos-1-fila-390.png` (antes:
  `pestanas-proyectos-2-filas-390.png`).

## 5. D — Buscar en toda la página
- **Las secciones no elegidas siguen en la página**, ocultas con `hidden="until-found"`:
  - el buscador del navegador (Ctrl+F) las encuentra;
  - al encontrar algo, el navegador muestra esa sección y la ventana cambia de pestaña sola.
- **Si la sección encontrada estaba debajo de una larga**, la ventana corrige el scroll para que el
  texto no se mueva de su sitio.
- **Proyectos no carga fotos ni vídeo** de las secciones ocultas: solo su texto.
- Funciona en Chrome, Edge y Firefox. En Safari, Ctrl+F solo busca en la sección abierta, como
  antes.
- **Mira:** `.screenshots/fase-9/buscar-terraform-1440.png` (buscando "Terraform" se abre "He
  trabajado con").

## 6. Comprobaciones
- **Tipos, lint y 196 pruebas** en verde. Hay 13 pruebas menos porque eran las del dibujante borrado;
  las del hueco del idioma ahora prueban el engranaje.
- **Capturas** de la parte 1 comparadas con las de ahora:
  - **título: idéntico** en los 2 idiomas y los 3 tamaños;
  - **Stack, Perfil, Contacto y la pregunta del CV:** solo cambia el contorno (0 píxeles fuera de
    él);
  - **Proyectos:** además, la pestaña de Bosa y, en móvil y tableta, el contenido sube una fila;
  - **campamento:** el engranaje en lugar de la bandera.
- **`check:windows`**, comprobaciones nuevas:
  - las pestañas caben siempre en una fila (4 ventanas × 2 idiomas × 3 tamaños);
  - las ventanas abiertas no quedan recortadas;
  - las secciones ocultas están "hasta que se encuentren";
  - buscar "Terraform" abre su sección (con la maquinaria real de búsqueda del navegador).
- **`check:camp`**, comprobaciones nuevas:
  - el engranaje abre AJUSTES con el foco en el idioma en uso;
  - English cambia la página, la ventana y la rueda a la vez;
  - Animaciones NO pone `data-motion="off"`, cierra al instante y para los gestos;
  - las dos elecciones se recuerdan al recargar;
  - en el móvil, a toques.
- **`check:title` y `check:intro`:** todo ✓.
- **fps:** 60 con la rueda girando (CPU ×1 y ×4); intro 60 / 59,5.
- **Lighthouse:**
  - título: 99 · 100 · 100 · 100, LCP 1,7 s, 237 KB;
  - campamento: 99 · 100 · 100 · 100, LCP 1,9–2,0 s, 245 KB.
- **JavaScript inicial:** 89,4 KB comprimido.

**Antes y después de toda la fase 9:**

| | Antes | Después |
|---|---|---|
| Archivos en `src/` (TS / CSS) | 163 (95 / 32) | 152 (91 / 30) |
| Líneas de TypeScript (sin generados) / pruebas | 6.069 / 981 | 5.611 / 919 |
| Líneas de CSS | 1.921 | 1.693 |
| Líneas de scripts | 2.900 | 2.907 (con la librería común y las comprobaciones nuevas) |
| JavaScript inicial | 89,25 KB | 89,4 KB (con la ventana de ajustes) |
| Lighthouse campamento | 99 · 100 · 100 · 100 | 99 · 100 · 100 · 100 |

## 7. TypeScript en la parte 2

**Una unión con una función** (`WindowSections.tsx`):

```ts
content: ReactNode | ((shown: boolean) => ReactNode);
// …
typeof item.content === 'function' ? item.content(index === selected) : item.content
```

- Una sección da su contenido tal cual, o una función que recibe si está a la vista.
- `typeof … === 'function'` le dice a TypeScript cuál de los dos es. Dentro del `?` sabe que se
  puede llamar.

**Dejar que el compilador encuentre los cambios:**
- Al cambiar `SlotId` de `'language'` a `'settings'`, `tsc` marcó, uno por uno, todos los sitios que
  aún esperaban el idioma: los textos de los dos idiomas, los iconos y la prueba del estado.
- `Record<SlotId, string>` obliga a que cada hueco tenga su nombre en cada idioma.

**Un tipo de dos valores con nombre propio:** `type Animations = 'on' | 'off'`. Con
`useSyncExternalStore`, React vuelve a dibujar todo lo que lo lee cuando cambia.

## 8. Archivos para tu commit

| Archivo | Cambio |
|---|---|
| `src/engine/grid.ts`, `sprites.ts`, `engine.test.ts`; `src/dev/Specimen.*`, `WindowsDemo.*`; `src/components/StatBar.*` | **Borrados** |
| `src/Root.tsx`, `src/assets/textures.ts`, `scripts/screenshot.mjs` | Sin las páginas y la constante borradas |
| `src/assets/characters/` (6 PNG `null-side-*` borrados, `characters.gen.ts`, `characters.ts`), `scripts/sprites/cutout.mjs`, `src/scenes/camp/CampCanvas.tsx`, `src/dev/CharactersDemo.tsx` | Sin el trote de lado |
| `scripts/sprites/icons.mjs`, `src/assets/icons/settings.png` (nuevo), `icons.gen.ts`, `icons.ts` | El engranaje |
| `src/engine/motion.ts` (nuevo), `src/engine/useScreen.ts`, `src/App.tsx` | Menos movimiento: sistema o ajustes |
| `src/components/SettingsDialog.tsx` + `.module.css` (nuevos), `SectionDialog.tsx`, `RingMenu.tsx`, `src/scenes/camp/CampScene.tsx` | AJUSTES desde el engranaje |
| `src/content/sections.ts`, `types.ts`, `es.ts`, `en.ts`, `src/game/state.ts`, `state.test.ts` | El hueco `settings`, sus textos y la pestaña corta de Bosa |
| `src/components/Window.module.css`, `src/styles/global.css`, `HudBar.module.css`, `PixelSprite.module.css`, `src/scenes/title/TitleScreen.module.css` | El contorno y el movimiento por animación |
| `src/windows/WindowSections.tsx` + `.module.css`, `src/windows/ProjectsWindow.tsx` | Pestañas en una fila y búsqueda en todas las secciones |
| `scripts/camp-check.mjs`, `scripts/windows-check.mjs` | Las comprobaciones nuevas |
| `CLAUDE.md`, `DESIGN.md`, `BRIEF.md`, `CONTENT.md`, `docs/plan-de-fases.md`, `docs/informes/fase-9-revision.md` | Documentación |

### Commits recomendados (parte 2)

Si aún no has hecho los diez de la parte 1, hazlos primero (están más arriba).

```bash
# 1. Dead code, old dev pages and Null's unused side trot
git add src/engine/grid.ts src/engine/sprites.ts src/engine/engine.test.ts src/dev src/components/StatBar.tsx src/components/StatBar.module.css src/Root.tsx src/assets/textures.ts scripts/screenshot.mjs src/assets/characters scripts/sprites/cutout.mjs src/scenes/camp/CampCanvas.tsx
git commit -m "chore: remove dead code, outdated dev pages and Null's unused side trot"

# 2. The gear icon
git add scripts/sprites/icons.mjs src/assets/icons
git commit -m "feat(icons): add the gear icon from Yeray's reference"

# 3. SETTINGS, the window outline, motion per animation, one-row tabs and find-in-page
git add src/engine/motion.ts src/engine/useScreen.ts src/App.tsx src/components src/scenes src/content src/game src/styles/global.css src/windows
git commit -m "feat(ui): add a SETTINGS gear with language and an animations switch" -m "Windows show their ink outline once open; motion is opted into per animation (system preference or the switch); tabs stay on one row; find-in-page reaches every window section."

# 4. Checks
git add scripts/camp-check.mjs scripts/windows-check.mjs
git commit -m "test: check SETTINGS, one-row tabs, window outlines and find-in-page"

# 5. Docs
git add CLAUDE.md DESIGN.md BRIEF.md CONTENT.md docs/plan-de-fases.md docs/informes/fase-9-revision.md
git commit -m "docs: describe SETTINGS and report phase 9 part 2"
```

Algunos archivos llevan cambios de varias decisiones a la vez (por ejemplo, `es.ts` tiene los
textos de AJUSTES y la pestaña de Bosa), por eso el commit 3 los junta.

## 9. Lo que necesito de ti
1. **Mira AJUSTES** en http://localhost:5173/#camp: el engranaje es el último hueco de la rueda.
   Prueba el idioma, las animaciones en NO y recarga.
2. **Mira las pestañas de Proyectos en el móvil** y prueba **Ctrl+F** en una ventana: por ejemplo,
   "Terraform" en Stack.
3. **Lo que queda de la fase 9:** pasar las revisiones automáticas `code-review` y `simplify` sobre
   el código ya limpio, y regenerar `.impeccable/design.json` y `DESIGN.md` con `impeccable`. Dime si
   lo hago, o si pasamos a la fase 10 (publicar).
