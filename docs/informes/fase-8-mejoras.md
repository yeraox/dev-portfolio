# Informe · Fase 8 — Mejoras del portfolio

**Estado:** 🔄 en curso. Se hace bloque a bloque: cada bloque se añade aquí cuando está hecho y se
para hasta que lo revisas.

| Bloque | Qué | Estado |
|---|---|---|
| A | El CV en inglés | ✅ Hecho (19/11/2026), pendiente de tu revisión |
| B | La rueda: el intercambio y los nombres reales | ✅ Hecho (19/11/2026), pendiente de tu revisión |
| C | Iconos nuevos, todos dentro de la rueda | ✅ Hecho (19/11/2026), pendiente de tu revisión |
| D | Retratos nuevos | ✅ Hecho (19/11/2026), pendiente de tu revisión |
| E | Favicon con tu cara | ✅ Hecho (19/11/2026), pendiente de tu revisión |
| F | Tu tono de piel, más claro | ✅ Hecho con el tono 2 (19/11/2026), pendiente de tu revisión |
| G | El caminar de Null | ✅ Hecho (19/11/2026), pendiente de tu revisión |
| H | Fuera BUFFS y CRAFT | ✅ Hecho (19/11/2026), pendiente de tu revisión |
| I | Fuera la vista CV web | ✅ Hecho (19/11/2026), pendiente de tu revisión |
| J | Iconos del stack técnico | ✅ Hecho (19/11/2026), pendiente de tu revisión |
| K | Animaciones en reposo | ✅ Hecho (19–20/11/2026), pendiente de tu revisión |
| L | Fuera el idioma de la ventana de Contacto (añadido el 19/11) | ✅ Hecho (19/11/2026), pendiente de tu revisión |
| M | Barras de vida y experiencia en el HUD (añadido el 19/11) | ✅ Hecho (19/11/2026), pendiente de tu revisión |

El plan de cada bloque está en `docs/plan-de-fases.md`, "Fase 8 — Mejoras del portfolio".

---

## Bloque A — El CV en inglés

### Resumen
- **Tu PDF en inglés ya está en la web:** `/cv/yeray-caturla-cv-en.pdf`, copiado tal cual por
  `npm run cv`, igual que el español.
- **Cada idioma descarga el suyo:**
  - el botón de la vista CV (`/cv/` → español, `/cv/en/` → inglés);
  - la fila "CV en PDF" / "CV as PDF" de COMMS.
- **Desaparece el aviso** "(PDF, in Spanish)" / "(in Spanish)" de los textos en inglés.

### 1. Decisiones tomadas

| Decisión | Por qué | Quién |
|---|---|---|
| Copiar `references/cv_en_yeray_caturla.pdf` **tal cual** | Como el español: es tu documento | Tú (brief) |
| Nombre público `yeray-caturla-cv-en.pdf` | El mismo patrón que el español (`…-cv-es.pdf`) | Yo |
| COMMS sigue descargando **directamente**, sin ventana de confirmación | La fila ya dice "Descargar". La ventana de "¿Descargar el CV?" es para el icono del CV de la rueda y el del título (bloques C e I) | Yo |
| Sigue existiendo la vista CV web | Se quita en el bloque I. Mientras exista, su botón descarga el PDF de su idioma | Plan |

### 2. Qué se ha hecho, paso a paso
1. **Comprobé que el PDF en inglés es de verdad tu CV en inglés.** Sin herramientas de PDF
   instaladas, saqué su texto con Node: "Yeray Caturla · Junior Backend Developer | Node.js ·
   Java · Python · Docker · Elda (Alicante), Spain…". Pesa 3,1 MB, como el español.
2. **`npm run cv`** (`scripts/cv-pdf.mjs`) copia ahora los dos PDF y dice cuánto pesa cada uno.
   Si falta alguno en `references/`, avisa y no copia nada.
3. **Una ruta por idioma** (`src/site/paths.ts`): `PATHS.pdf` era una sola ruta y ahora es un
   objeto con `es` y `en`.
4. **La vista CV** (`src/site/html.ts`) enlaza `PATHS.pdf[locale]`: cada página, su PDF.
5. **Los textos en inglés** (`src/content/en.ts`):
   - el botón pasa de "Download CV (PDF, in Spanish)" a "Download CV (PDF)";
   - la fila de COMMS pasa de "Download (in Spanish)" a "Download" y apunta al PDF inglés.
6. **Documentos al día:** `CONTENT.md`, `BRIEF.md`, `PRODUCT.md` y `CLAUDE.md` ya no dicen que
   falte el PDF en inglés.

### 3. Cómo se ha comprobado
- **Tipos, lint y pruebas:** todo en verde, con **182 pruebas** (antes 180). Las dos nuevas:
  - el PDF de cada idioma existe de verdad en `public/` (si un día faltara, la prueba falla);
  - COMMS enlaza el PDF de su idioma y no el del otro.
- **`npm run check:cv`**, con comprobaciones nuevas, todo ✓:
  - los dos PDF se sirven (200, `application/pdf`);
  - la página española descarga el español y la inglesa el inglés, sin decir "in Spanish";
  - COMMS en inglés: "CV as PDF · Download" descarga el PDF inglés.
- **`npm run check:windows`:** sin cambios, todo ✓.
- **Copias idénticas:** los dos PDF de `public/cv/` son byte a byte iguales a los tuyos.
- **Capturas** a 390, 768 y 1440 px en `.screenshots/fase-8/`:
  - `fase-8-a-cv-en-*.png`: la vista CV en inglés, con "Download CV (PDF)";
  - `fase-8-a-comms-en-*.png`: COMMS en inglés, con "CV as PDF · Download".
  - Sin desplazamiento horizontal y sin errores en la consola.

### 4. TypeScript en este bloque
**`Record<Locale, string>`** (`src/site/paths.ts`):

```ts
const PDF: Record<Locale, string> = {
  es: '/cv/yeray-caturla-cv-es.pdf',
  en: '/cv/yeray-caturla-cv-en.pdf',
};
```

- `Record<Locale, string>` significa "un texto por cada idioma de `Locale`".
- Si un día añadieras un tercer idioma a `Locale` (`'es' | 'en' | 'ca'`), este objeto dejaría de
  compilar hasta que tuviera su PDF. Así no se puede olvidar.
- Para elegir el del idioma actual basta con `PATHS.pdf[locale]`: como `locale` solo puede ser
  `'es'` o `'en'`, TypeScript sabe que el resultado siempre existe.

### 5. Problemas encontrados
- **No hay herramientas de PDF en el sistema** (`pdftotext`). Para comprobar el idioma del PDF
  leí su texto con un pequeño script de Node, sin instalar nada.
- **Empecé la fase sin tu permiso** (el 19/11, antes de este bloque). Lo deshice entero, a petición
  tuya, y comprobé que todo volvía a estar en verde. Desde entonces no toco código sin que me lo
  digas.

### 6. Lo que necesito de ti
1. **Prueba las descargas:** en http://localhost:5173/cv/en/ el botón, y en el juego COMMS en
   inglés. Las dos deben bajar tu CV en inglés.
2. **Si te parece bien, apruébalo** y paso al bloque B (la rueda).

### 7. Archivos para tu commit

**Importante:** algunos de estos archivos nacieron en la fase 7 (`scripts/cv-pdf.mjs`,
`scripts/cv-check.mjs`, `src/site/` y `public/`). Si la fase 7 aún no está en un commit, haz
primero sus commits (`docs/informes/fase-7-cv-calidad.md`, apartado 8). Si no, este commit se
llevaría también el trabajo de la fase 7.

| Archivo | Cambio |
|---|---|
| `public/cv/yeray-caturla-cv-en.pdf` | **Nuevo**: tu CV en inglés, tal cual |
| `scripts/cv-pdf.mjs` | Copia los dos PDF |
| `src/site/paths.ts` | Una ruta de PDF por idioma |
| `src/site/html.ts` | La vista CV enlaza el PDF de su idioma |
| `src/site/html.test.ts` | Pruebas: el PDF existe y COMMS enlaza el de su idioma |
| `src/content/en.ts` | Textos sin "in Spanish" y COMMS → PDF inglés |
| `scripts/cv-check.mjs` | Comprueba los dos PDF y COMMS en inglés |
| `CONTENT.md`, `BRIEF.md`, `PRODUCT.md`, `CLAUDE.md` | Ya hay PDF en inglés |
| `docs/plan-de-fases.md` | El plan de la fase 8 (bloques A–K) y la renumeración de las fases |
| `docs/informes/fase-8-mejoras.md` | **Nuevo**: este informe |

### Commits recomendados

```bash
# 1. The English CV PDF, each language linking its own
git add public/cv/yeray-caturla-cv-en.pdf scripts/cv-pdf.mjs src/site/paths.ts src/site/html.ts src/site/html.test.ts src/content/en.ts scripts/cv-check.mjs
git commit -m "feat(cv): add the English CV PDF and link each language to its own"

# 2. Docs: phase 8 plan, block A report and the PDF in the project docs
git add CONTENT.md BRIEF.md PRODUCT.md CLAUDE.md docs/plan-de-fases.md docs/informes/fase-8-mejoras.md
git commit -m "docs: plan phase 8 improvements and report the English CV"
```

---

## Bloques B, C y H — La rueda

Los tres bloques que tocan la rueda, hechos juntos porque cambian las mismas piezas.

### Resumen
- **La rueda tiene 6 huecos:**
  - Proyectos, Stack, Perfil y Contacto abren su ventana;
  - CV pregunta antes de descargar;
  - Idioma cambia de idioma.
- **Cada hueco lleva su nombre real encima del icono, siempre visible** y en tu idioma:
  PROYECTOS, STACK, PERFIL, CONTACTO, CV, IDIOMA (en inglés PROJECTS, STACK, PROFILE, CONTACT,
  CV, LANGUAGE).
- **EQUIP (el chaleco) es ahora tu stack y ALCHEMY (el frasco) tus proyectos.** El nombre de juego
  sigue en el título de cada ventana: "Alquimia — Proyectos", "Equipo — Stack técnico".
- **Tus 8 iconos** sustituyen a los que dibujé yo, incluidas las dos banderas y el libro de
  "Sobre mí".
- **El CV** abre una ventana pequeña: "¿Descargar el CV en PDF?", con el idioma y el peso del
  archivo, y SÍ / NO.
- **La bandera** es la del idioma actual (España o Reino Unido). Al elegirla, cambia al otro
  idioma al momento, sin ventana.
- **BUFFS y CRAFT ya no existen** en el código. "Sobre mí" queda como borrador: solo se ve
  mientras desarrollamos.

### 1. Decisiones tomadas

| Decisión | Por qué | Quién |
|---|---|---|
| Todos los iconos dentro de la rueda, también el CV y el idioma | No rompe la experiencia del juego | Tú |
| Bandera de Reino Unido para el inglés | — | Tú |
| PERFIL en lugar de STATS | Se entiende mejor | Tú |
| BUFFS y CRAFT fuera; "Sobre mí" llegará | — | Tú |
| La ventana del CV pregunta antes de descargar | — | Tú |
| **Iconos reducidos a la rejilla de la escena, no "tal cual"** | Tus imágenes tienen 80–250 píxeles de lado y el hueco mide 28 píxeles de escena. Tal cual, cada icono sería del tamaño de tu personaje. Reducidos, cada píxel del icono mide lo mismo que un píxel tuyo o de Null | Yo |
| **Un contorno claro de 1 píxel** (`stone-3`, sin desenfoque) alrededor de cada icono | El chaleco, la silueta y el teléfono son oscuros y se perdían sobre la tierra | Yo |
| **Nombres encima del icono, no debajo** (el plan decía debajo) | El icono de abajo de la rueda queda bajo tus botas, a 3 píxeles del borde de la escena: su nombre no cabe debajo | Yo |
| Nombres en Pixelify (la letra de leer), en mayúsculas, sobre una placa de tinta. El activo en verde, el resto en gris claro | Son nombres reales en tu idioma, no etiquetas de juego. A 14 px caben seis alrededor de ti en el móvil | Yo |
| La rueda un poco más ancha y alta (rx 124 → 136, ry 84 → 88) | Para que los nombres no tapen tu cabeza, tus botas ni a Null | Yo |
| Orden: Proyectos, Stack, Perfil, Contacto, CV, Idioma | Proyectos primero porque es lo que más mira un reclutador; las dos acciones juntas al final | Plan |
| Títulos del banner del CV e idioma: "Pergamino — Descargar CV" e "Idioma — Cambiar a English" | El mismo patrón "nombre de juego — qué es" que las secciones | Yo |
| En la ventana del CV, **SÍ empieza marcado** y el ratón mueve la marca | Como un menú de juego: siempre se ve qué elige Enter | Yo |
| La ventana del CV no tiene botón "ESC EXIT" | NO ya la cierra (y Esc, y tocar fuera) | Yo |
| Los enlaces directos pasan a `/#projects`, `/#stack`, `/#profile` y `/#contact` | El código dice lo que es cada cosa. La web aún no está publicada | Plan |
| La fila "CV en PDF" de COMMS sigue descargando sin preguntar | Ya dice "Descargar" | Yo (bloque A) |
| La elección de idioma de COMMS se queda | Es la forma de siempre para un lector de pantalla; ahora hay tres sitios para cambiar de idioma | Yo |

### 2. Qué se ha hecho, paso a paso

**2.1 Los iconos: `npm run icons`** (`scripts/sprites/icons.mjs`, nuevo)
1. **Medí tus iconos.** Son pixel art generado, cada uno a una rejilla distinta (entre 3 y 11
   píxeles de imagen por píxel de dibujo, según la medida), con 80–250 píxeles de lado.
2. **Quitar el fondo sin comerse los iconos oscuros.** El recorte de los personajes trataba como
   fondo el chaleco, la silueta y el teléfono, porque se parecen al verde oliva del fondo. El
   recorte nuevo avanza desde el borde de la imagen solo a pasos pequeños de color, así que se
   para en el contorno oscuro de cada icono. Comparé los dos a la vez antes de elegir.
3. **Reducirlos a 28 píxeles** por su lado largo. Cada píxel nuevo es la media de los píxeles de
   tu imagen que tapa, y solo existe si el icono cubre al menos la mitad. No se dibuja nada.
4. **Comprobaciones del script:** el lado largo mide 28, el icono llena su caja (el fondo no se
   lo comió) y llega a sus cuatro bordes. Los 8 pasan.
5. **Resultado:** 8 PNG de 0,7 a 1,9 KB en `src/assets/icons/`. `icons.ts` exige un icono por
   sección, el CV y cada idioma: si falta uno, no compila.
6. **De paso:** la función que guarda los PNG (`writePng`) estaba dentro del script de los
   personajes. La moví a la librería común (`lib.mjs`) para usarla en los dos. Comprobé que
   `npm run characters` genera tus personajes **idénticos byte a byte**.
7. **Los iconos antiguos de 16×16** (`src/assets/sprites/`) y el componente que los pintaba
   (`IconCanvas`) **se han borrado**, como decía el plan.

**2.2 Las secciones, con sus nombres reales**
- `src/content/sections.ts`: los huecos de la rueda son `projects`, `stack`, `profile`,
  `contact`, `about` (borrador), `cv` y `language`.
- Los textos (`es.ts`, `en.ts`) cambian de nombre igual:
  - `stats` → `profile`;
  - `equip` → `projects` (y la lista de proyectos, `projects.list`);
  - `alchemy` → `stack`;
  - `comms` → `contact`.
- **Textos nuevos:**
  - los nombres de la rueda (`ring.names`);
  - la ventana del CV (`cvDownload`);
  - el idioma (`language`, que antes vivía dentro de `comms`).
- **Las ventanas cambian de archivo:** `EquipWindow` → `ProjectsWindow`, `AlchemyWindow` →
  `StackWindow`, `StatsWindow` → `ProfileWindow`, `CommsWindow` → `ContactWindow`. Por dentro
  son iguales.

**2.3 La rueda** (`RingMenu`)
- Cada hueco es un botón con su icono y, encima, su nombre. El nombre forma parte del botón:
  también se puede pulsar o tocar, y en el móvil la zona táctil crece.
- Los nombres aparecen cuando la rueda termina de abrirse tras la intro.
- El lector de pantalla oye "PROYECTOS: Alquimia — Proyectos": empieza por lo que se ve.

**2.4 El campamento** (`CampScene` y la máquina de estados `state.ts`)
- La máquina de estados sabe que el CV abre una ventana (su pregunta) y que el idioma no abre
  ninguna: solo sube a lo alto de la rueda. El cambio de idioma lo hace el campamento.
- Con el idioma arriba, la pista del banner dice `ENTER SWITCH` en lugar de `ENTER OPEN`.
- La dirección de la página nunca muestra `#cv`: la pregunta no es una sección.

**2.5 La ventana del CV** (`CvDownloadDialog`, nueva)
- Es la misma ventana de piedra que las secciones, en tamaño pequeño y centrada. Le añadí a
  `SectionDialog` una variante `compact`, sin estilos nuevos de marco.
- **SÍ** es un enlace de descarga de verdad al PDF del idioma actual. **NO**, Esc o tocar fuera
  la cierran.
- Teclado: ← → cambian de respuesta, Enter elige. Al cerrarse, el foco vuelve al CV de la rueda.
- El lector de pantalla oye la pregunta y también "PDF · español · 3,1 MB".

**2.6 Fuera BUFFS y CRAFT**
- Sus secciones, textos, iconos y títulos han desaparecido del código y de los documentos.
- Sus objetos siguen en tu imagen del campamento (las pesas, la paellera).
- El mecanismo de borradores se queda para "Sobre mí", que de momento muestra "Sección en
  preparación." en desarrollo.

**2.7 Documentos:** `CONTENT.md`, `BRIEF.md`, `DESIGN.md`, `PRODUCT.md`, `CLAUDE.md` y el plan
cuentan la rueda nueva.

### 3. Cómo se ha comprobado

**Pruebas y herramientas**
- Tipos y lint sin errores. **179 pruebas** en verde (antes 182). Salen las del dibujo de los
  iconos antiguos y entran:
  - la máquina de estados con el CV y el idioma;
  - los 8 iconos nuevos;
  - la ventana dice el peso real del PDF.

**`npm run check:camp`**, ampliado, contra la versión de producción: **todo ✓**.
- **Los nombres de la rueda**, a 390, 768 y 1440 px, en español y en inglés:
  - todos visibles;
  - ninguno pisa otro nombre, un icono, a ti o a Null;
  - todos dentro de la escena.
- **El CV con teclado:**
  - Enter pregunta, con SÍ marcado y enlazado al PDF español;
  - → pasa a NO, y NO cierra sin descargar;
  - Esc cierra sin descargar;
  - SÍ descarga `yeray-caturla-cv-es.pdf` y cierra;
  - el foco vuelve al CV y la dirección nunca muestra `#cv`.
- **El idioma con teclado:**
  - bandera española en español y británica en inglés;
  - Enter cambia de idioma sin abrir ventana;
  - en inglés, el CV pregunta en inglés y enlaza el PDF inglés.
- **Con el dedo, en el móvil:** tocar la bandera cambia el idioma y tocar el CV pregunta; NO
  cierra.

**Las demás comprobaciones**
- `check:windows`, `check:title`, `check:intro` y `check:cv`: todo ✓, con los nombres nuevos.

**Rendimiento** (build de producción)

| Medida | Objetivo | Ahora | Fase 7 |
|---|---|---|---|
| JavaScript inicial (gzip) | ≤ 100 KB | **87,7 KB** | 87,8 KB |
| Peso total del campamento | ≤ 300 KB | **244 KiB** | — |
| Lighthouse móvil, campamento | ≥ 95 | **99** rendimiento · **100** accesibilidad, buenas prácticas y SEO | — |
| LCP campamento (móvil) | ≤ 2,5 s | **1,9 s** | 2,0 s |
| CLS | < 0,1 | **0** | — |
| Rueda girando, CPU ×1 / ×4 | ≥ 30 fps con ×4 | **60 / 60 fps** | 60 / 60 |
| Respuesta más lenta a una tecla o clic | < 200 ms | **40 ms** | — |

**Capturas** (versión de producción, en `.screenshots/fase-8/`):
- `rueda-es-*.png` y `rueda-en-*.png`: la rueda a 390, 768 y 1440 px;
- `cv-pregunta-390.png` y `cv-pregunta-1440.png`: la ventana del CV.

### 4. TypeScript en estos bloques

**Un guardián de tipo** (`isSection`, en `sections.ts`):

```ts
export function isSection(slot: SlotId): slot is SectionId {
  return slot !== 'cv' && slot !== 'language';
}
```

- `slot is SectionId` es una promesa a TypeScript: "si devuelvo `true`, el hueco es una sección".
- Después de `if (isSection(slot))`, TypeScript deja usar `slot` donde solo valen secciones, como
  `WINDOWS[slot]` o `preloadWindow(slot)`.

**Estrechar con `===`** (`state.ts` y `CampScene.tsx`):

```ts
if (slot === 'cv') return t.cvDownload.banner;
if (slot === 'language') return t.language.banner;
return t.sections[slot].title; // aquí `slot` ya solo puede ser una sección
```

- Cada `if` que devuelve algo descarta un valor de la unión.
- En la última línea TypeScript sabe que ya no puede ser `'cv'` ni `'language'`, y por eso
  `t.sections[slot]` compila. Si quitaras un `if`, no compilaría.

**Uniones unidas** (`SlotId = SectionId | 'cv' | 'language'`) **y uniones dentro de un
`Record`** (`Record<SectionId | 'cv' | Locale, IconImage>`)
- La rueda, los textos y los iconos se comprueban con los mismos nombres.
- Un icono o un nombre que falte es un error de compilación, no un hueco vacío en la web.

**Dejar que el compilador te guíe en un cambio de nombre**
- Cambié `SectionId` y el compilador marcó **107 errores**: cada sitio que había que actualizar.
  Los fui arreglando hasta dejarlo en 0.

### 5. Problemas encontrados y cómo se resolvieron

| Problema | Solución |
|---|---|
| Tus iconos son demasiado grandes para usarlos tal cual | Reducirlos a la rejilla de la escena por medias, sin dibujar nada. Te lo cuento arriba para que decidas |
| El recorte de fondo se comía el chaleco, la silueta y el teléfono | Un recorte nuevo que solo avanza a pasos pequeños de color y se para en el contorno |
| Los iconos oscuros no se veían sobre la tierra | El contorno claro de 1 píxel |
| Con los nombres debajo, el de abajo no cabía en el móvil | Nombres encima, y la rueda algo más grande. `check:camp` lo mide |
| En el móvil, la ventana del CV salía pegada arriba | Su altura pasa a `fit-content`: el navegador ya la centra |
| En el móvil, el foco caía en el panel de la ventana, no en SÍ | La zona táctil ampliada de los botones hacía que el panel tuviera 8 px de desplazamiento, y Chrome deja enfocar esos paneles. Ahora no desborda, y además la ventana pone el foco en SÍ ella misma |
| `check:windows` confundía el botón de idioma de la rueda con la opción "English" de COMMS | La comprobación busca la opción solo dentro de la ventana |
| `check:windows` tomaba el icono `projects.png` por una captura de proyecto | Solo cuenta los archivos de Capyroad y Pakito's |

### 6. Observaciones y TODOs
- **"Sobre mí" (7 huecos):** en desarrollo la rueda tiene 7. Con 7, los nombres de abajo rozan
  tus botas y a Null. `check:camp` lo avisa sin fallar. Cuando decidamos cómo es "Sobre mí", hay
  que ajustar la rueda para 7.
- **La bandera queda sobre el trípode de la hoguera** en la posición de reposo. Antes pasaba lo
  mismo con el icono de COMMS. Se lee bien, pero si te molesta se puede girar el orden.
- **"VER CV" sigue arriba a la izquierda** hasta el bloque I, en el que se quita con la vista CV.
- **Para la fase 9:**
  - el dibujante de rejillas (`src/engine/grid.ts` y `sprites.ts`) ya solo lo usan sus propias
    pruebas, porque pintaba los iconos antiguos;
  - la página `/dev/specimen` aún enseña la maqueta de la fase 0, con iconos de 16×16.
- **Revisa el inglés nuevo en `/dev/textos`:** los nombres de la rueda, "Scroll — Download CV",
  "Download the CV as a PDF?" y "Language — Switch to Español".

### 7. Lo que necesito de ti
1. **Mira la rueda** en `npm run dev` (http://localhost:5173/#camp). Allí verás 7 huecos, con
   "Sobre mí". Para ver la de la web, con 6:

   ```bash
   npm run build && npx vite preview
   ```

   y abre http://localhost:4173/#camp.
2. **Dime si te gustan:**
   - **tus iconos reducidos** a 28 píxeles y **el contorno claro**;
   - **los nombres encima** de los iconos, en la letra de leer;
   - **el orden** de la rueda;
   - los títulos "Pergamino — Descargar CV" e "Idioma — Cambiar a English".
3. **Prueba el CV** (SÍ, NO y Esc) y **la bandera**, con teclado, ratón y, si puedes, en el móvil.

### 8. Archivos para tu commit

Si el bloque A aún no está en un commit, haz primero el suyo (arriba). Algunos archivos, como
`en.ts`, `html.ts` y los documentos, cambian en los dos bloques.

| Archivo | Cambio |
|---|---|
| `scripts/sprites/icons.mjs` | **Nuevo**: `npm run icons` |
| `scripts/sprites/lib.mjs`, `scripts/sprites/cutout.mjs` | `writePng` pasa a la librería común (personajes idénticos) |
| `package.json` | El comando `icons` |
| `src/assets/icons/` (8 PNG, `icons.gen.ts`, `icons.ts`, `icons.test.ts`) | **Nuevos**: tus iconos |
| `src/assets/sprites/icons.ts`, `src/assets/sprites/sprites.test.ts`, `src/components/IconCanvas.tsx` | **Borrados**: los iconos antiguos |
| `src/components/CvDownloadDialog.tsx` + `.module.css` | **Nuevo**: la ventana del CV |
| `src/components/RingMenu.tsx` + `.module.css` | Nombres siempre visibles, iconos nuevos, contorno |
| `src/components/SectionDialog.tsx` + `.module.css` | La variante pequeña (`compact`) y la descripción para lectores |
| `src/content/sections.ts`, `types.ts`, `es.ts`, `en.ts`, `content.test.ts` | Huecos y textos nuevos, BUFFS y CRAFT fuera |
| `src/game/state.ts`, `state.test.ts`, `ring.ts`, `ring.test.ts` | El CV y el idioma en la máquina de estados; la rueda más grande |
| `src/scenes/camp/CampScene.tsx` | La rueda nueva, el cambio de idioma y la ventana del CV |
| `src/scenes/title/TitleScreen.tsx`, `src/site/html.ts`, `src/site/html.test.ts`, `src/dev/WindowsDemo.tsx` | Los textos con sus nombres nuevos |
| `src/windows/` | Los cuatro archivos renombrados (y sus estilos), `index.ts` y `DraftWindow.tsx` |
| `src/styles/contrast.ts`, `src/styles/palette.ts` | Pares de contraste de los nombres, el contorno y las respuestas; los iconos guardan sus colores |
| `scripts/camp-check.mjs` | La rueda, el CV y el idioma |
| `scripts/windows-check.mjs`, `scripts/title-check.mjs`, `scripts/cv-check.mjs` | Los nombres nuevos |
| `CLAUDE.md`, `BRIEF.md`, `DESIGN.md`, `CONTENT.md`, `PRODUCT.md`, `docs/plan-de-fases.md` | La rueda nueva |
| `docs/informes/fase-8-mejoras.md` | Este informe |

### Commits recomendados

`git add -A` con una carpeta o archivo también registra lo borrado y lo renombrado dentro de él.

```bash
# 1. The icon pipeline and the icons from Yeray's references
git add scripts/sprites/icons.mjs scripts/sprites/lib.mjs scripts/sprites/cutout.mjs package.json src/assets/icons
git commit -m "feat(icons): cut the ring icons out of Yeray's references and reduce them to the scene grid"

# 2. The ring: real names always visible, new icons, the CV question and the language slot; BUFFS and CRAFT gone
git add -A src/assets/sprites src/components src/content src/game src/scenes src/site src/dev src/windows src/styles
git commit -m "feat(ring): show every slot's name, add the CV and language slots and drop BUFFS and CRAFT"

# 3. Checks
git add scripts/camp-check.mjs scripts/windows-check.mjs scripts/title-check.mjs scripts/cv-check.mjs
git commit -m "test(checks): check the ring layout, the CV question and the language slot"

# 4. Docs
git add CLAUDE.md BRIEF.md DESIGN.md CONTENT.md PRODUCT.md docs/plan-de-fases.md docs/informes/fase-8-mejoras.md
git commit -m "docs: describe the new ring and report phase 8 blocks B, C and H"
```

---

## Bloques I y L — Fuera la vista CV web y el idioma de Contacto

Los dos tocan la ventana de Contacto, así que van juntos.

### Resumen
- **La vista CV web ya no existe.** Desaparecen `/cv/` y `/cv/en/`, el enlace "VER CV" del
  título, la intro y el campamento, y la fila "CV — Versión web" de Contacto.
- **El CV es el PDF**, y se pide en dos sitios:
  - **en el título**, con el pergamino de arriba a la izquierda;
  - **en el campamento**, con el CV de la rueda.

  Los dos abren la misma pregunta: "¿Descargar el CV en PDF?".
- **La intro no tiene acceso al CV.** Dura 4–6 s y se puede saltar.
- **Sin JavaScript**, la página muestra un aviso con los dos PDF. Quien tiene JavaScript no lo ve
  nunca.
- **La ventana de Contacto ya no tiene elección de idioma (bloque L).** Se cambia con la bandera
  de la rueda y con el ES/EN del título.

### 1. Decisiones tomadas

| Decisión | Por qué | Quién |
|---|---|---|
| Quitar la vista CV web | No te gusta ni te convence | Tú |
| El CV solo en el título y en la rueda | Desde la primera pantalla, a un paso | Tú |
| Quitar el idioma de Contacto | Tres sitios para lo mismo eran demasiados | Tú |
| **El pergamino del título lleva su placa "CV" con el mismo aspecto que ES/EN**, en la esquina opuesta | Al principio usé la placa pequeña de la rueda, pero al lado de ES/EN parecía menos importante. Así los dos controles de las esquinas pesan igual | Yo |
| El icono del pergamino, a la escala de la escena, con su contorno, como en la rueda | Es el mismo objeto en las dos pantallas | Yo |
| Mientras la pregunta está abierta, ni teclas ni clics empiezan el juego. Al cerrarla, el foco vuelve al pergamino | Si no, pulsar → para elegir "NO" empezaba la partida | Yo |
| El aviso sin JavaScript, en los dos idiomas a la vez | Sin JavaScript no se sabe el idioma del visitante | Yo (el plan lo proponía) |
| Las etiquetas de la página siguen generándose al compilar; el `sitemap.xml` solo tiene la página del juego | Es la única página | Yo |

### 2. Qué se ha hecho, paso a paso

**2.1 Fuera la vista CV**
- **Borrados:**
  - `cv/index.html` y `cv/en/index.html`;
  - el estilo de la vista (`src/cv/cv.css`);
  - el enlace `CvLink` y sus estilos;
  - la comprobación `check:cv` (`scripts/cv-check.mjs`).
- **`src/site/html.ts`** se queda con dos funciones: las etiquetas `<head>` del juego y el aviso
  sin JavaScript. Se va la parte que montaba el CV en HTML.
- **`vite.config.ts`** construye una sola página.
- **Los textos** pierden todo lo de la vista CV (`cv`: título, descripción, "Volver al portfolio",
  apartados…) y ganan el aviso (`page.noscript`).
- **El HUD** pierde el hueco entre los retratos que solo usaba "VER CV" en el móvil.

**2.2 El pergamino del título** (`CvScroll`, nuevo)
- Un botón arriba a la izquierda, el primero al tabular: la placa "CV" y, debajo, el pergamino.
- El lector de pantalla oye "CV: Pergamino — Descargar CV" y sabe que abre una ventana.
- Abre la misma ventana del CV que la rueda (`CvDownloadDialog`).
- La pantalla de título guarda si la pregunta está cerrada, abierta o cerrándose, y mientras no
  esté cerrada no deja empezar.

**2.3 El aviso sin JavaScript**
- `index.html` tiene un hueco que se rellena al compilar con un `<noscript>`:
  - "Este portfolio es un pequeño juego y necesita JavaScript. **Descargar mi CV en PDF
    (español)**";
  - lo mismo en inglés, con el PDF inglés.
- Tiene el fondo de noche, la letra de leer y los enlaces en dorado.

**2.4 Contacto sin idioma (bloque L)**
- Fuera la elección de idioma (los dos botones redondos) y sus estilos.
- Fuera el par de contraste del borde de esos botones, y los cuatro pares que solo usaba la vista
  CV.

**2.5 Documentos:** `CLAUDE.md` (una sola página, comandos), `BRIEF.md`, `PRODUCT.md`,
`DESIGN.md` y `CONTENT.md`.

### 3. Cómo se ha comprobado

**Pruebas y herramientas**
- Tipos y lint sin errores. **168 pruebas** en verde (antes 179):
  - salen las de la página CV;
  - entran las del aviso sin JavaScript: dice que hace falta JavaScript, enlaza los dos PDF y no
    muestra ningún teléfono;
  - el `<head>` ya no lleva enlaces a otros idiomas.

**`npm run check:title`**, ampliado, contra la versión de desarrollo y la de producción: **todo ✓**.
- **El pergamino a 390, 768 y 1440 px:**
  - se ve, con su nombre;
  - no tapa ES/EN, PRESS START, SKIP INTRO ni tu nombre.
- **Con ratón y teclado:**
  - pulsarlo pregunta y no empieza;
  - teclas (→, ←, "a") y clics dentro de la pregunta no empiezan;
  - Esc cierra sin descargar y devuelve el foco al pergamino;
  - Enter, Enter descarga el PDF español;
  - después, cualquier tecla vuelve a empezar.
- **En el móvil y en inglés:** pregunta en inglés con el PDF inglés, y NO cierra sin empezar.
- **Lo que antes miraba `check:cv`:**
  - las etiquetas del `<head>`;
  - el icono, el de iPhone y la imagen para compartir;
  - los dos PDF;
  - y que `/cv/` ya no es una página.
- **Sin JavaScript:** el aviso con los dos enlaces.

**Las demás comprobaciones**
- **`check:camp`** (contra producción): todo ✓. Nueva: el idioma elegido con la bandera se
  recuerda al recargar (antes lo comprobaba Contacto).
- **`check:windows`:** todo ✓. Contacto enlaza GitHub, LinkedIn, el email y el PDF, y ya no tiene
  elección de idioma.
- **`check:intro`:** todo ✓, tras arreglar un fallo intermitente que no venía de estos cambios
  (ver Problemas).

**Rendimiento** (build de producción)

| Medida | Objetivo | Ahora | Antes |
|---|---|---|---|
| JavaScript inicial (gzip) | ≤ 100 KB | **87,5 KB** | 87,7 KB |
| Lighthouse móvil, título | ≥ 95 | **100** en todo · LCP 1,7 s · 227 KiB | — |
| Lighthouse móvil, campamento | ≥ 95 | **99** · 100 · 100 · 100 · LCP 2,0 s · 243 KiB | 99 |
| Rueda e intro, CPU ×4 | ≥ 30 fps | **60 fps** | 60 |
| Respuesta más lenta | < 200 ms | **32 ms** | 40 ms |

**Capturas** en `.screenshots/fase-8/`:
- `titulo-cv-*.png`: el título a 390, 768 y 1440 px;
- `titulo-cv-pregunta-390.png` (en inglés) y `titulo-cv-pregunta-1440.png`: la pregunta;
- `sin-javascript-390.png`: el aviso.

### 4. TypeScript en estos bloques

**Un estado con tres valores posibles** (`TitleScreen.tsx`):

```ts
const [cv, setCv] = useState<'closed' | 'open' | 'closing'>('closed');
```

- Una unión de textos en lugar de dos `boolean` (`open`, `shown`).
- Con dos booleanos podría existir el caso imposible "cerrada pero mostrándose". Con la unión
  solo existen los tres estados reales, y TypeScript no deja escribir otro.

**`ref` como una prop normal** (`CvScroll.tsx`, React 19):

```ts
type CvScrollProps = { /* … */ ref?: Ref<HTMLButtonElement> };
```

- `Ref<HTMLButtonElement>` es la "caja" que React llena con el `<button>`.
- Antes de React 19 hacía falta `forwardRef`; ahora basta con declararla como cualquier otra prop.

**Que el compilador te diga qué sobra.** Al quitar `cv` del tipo `Content`, TypeScript marcó cada
sitio que aún leía los textos de la vista CV: la página, sus pruebas y los enlaces. No quedó
ninguno olvidado.

### 5. Problemas encontrados y cómo se resolvieron

| Problema | Solución |
|---|---|
| Con la pregunta abierta en el título, una flecha empezaba el juego (cualquier tecla empieza) | El título no deja empezar mientras la pregunta no esté cerrada. También los clics: la ventana vive dentro del título y sus clics le llegaban |
| `check:intro` fallaba a veces al pulsar SKIP INTRO "al final del todo" | La prueba pulsaba a los 4,1 s y la escena de la intro dura unos 4,5 s: con el equipo cargado, a veces ya había terminado. Ahora pulsa a los 3,7 s y, si llega tarde, marca ✗ en vez de romper el script. Pasó 3 veces seguidas |

### 6. Observaciones
- **`.impeccable/design.json` aún nombra "VER CV".** Se regenera desde `DESIGN.md` con la skill
  impeccable al final del proyecto (fase 9).
- **`public/cv/` se queda:** son los PDF. Pedir `/cv/` ya no da ninguna página.
- **Google lee el título y la descripción** de la página. Los textos de las ventanas los pinta
  JavaScript: Google los lee peor que la antigua vista CV. Para un portfolio que se comparte por
  enlace importa poco (lo comentamos en el plan).

### 7. Lo que necesito de ti
1. **Mira el título** (http://localhost:5173/#title y recarga): el pergamino arriba a la
   izquierda, su pregunta, y que nada empiece el juego mientras está abierta.
2. **Dime si te convence la placa "CV"** con el mismo aspecto que ES/EN.
3. **Si quieres ver el aviso sin JavaScript**, desactívalo en el navegador. En Chrome:
   DevTools → Ctrl+Shift+P → "Disable JavaScript".

### 8. Archivos para tu commit

Si los bloques anteriores no están en un commit, haz primero los suyos: `en.ts`, `es.ts`,
`types.ts`, `html.ts`, `CampScene.tsx` y los documentos cambian también aquí.

| Archivo | Cambio |
|---|---|
| `cv/index.html`, `cv/en/index.html`, `src/cv/cv.css` | **Borrados**: la vista CV |
| `src/components/CvLink.tsx` + `.module.css`, `scripts/cv-check.mjs` | **Borrados**: "VER CV" y su comprobación |
| `src/components/CvScroll.tsx` + `.module.css` | **Nuevo**: el pergamino del título |
| `src/scenes/title/TitleScreen.tsx` | El pergamino y su pregunta |
| `src/App.tsx`, `src/scenes/camp/CampScene.tsx`, `src/components/Hud.tsx` + `.module.css` | Sin "VER CV" |
| `src/site/html.ts`, `src/site/html.test.ts`, `src/site/paths.ts`, `vite.config.ts`, `index.html` | Una sola página: el `<head>` y el aviso sin JavaScript |
| `src/content/types.ts`, `es.ts`, `en.ts` | Sin los textos de la vista CV; con el aviso; sin la fila "Versión web" |
| `src/windows/ContactWindow.tsx` + `.module.css` | Sin elección de idioma |
| `src/assets/icons/icons.ts`, `src/components/RingMenu.tsx` | El contorno de los iconos, compartido por la rueda y el título |
| `src/styles/global.css`, `src/styles/contrast.ts` | El estilo del aviso; los pares de contraste al día |
| `package.json` | Sin `check:cv` |
| `scripts/title-check.mjs`, `scripts/camp-check.mjs`, `scripts/windows-check.mjs`, `scripts/intro-check.mjs` | El pergamino, el `<head>`, los PDF y el aviso; el idioma recordado; Contacto sin idioma; el margen de SKIP |
| `CLAUDE.md`, `BRIEF.md`, `PRODUCT.md`, `DESIGN.md`, `CONTENT.md`, `docs/plan-de-fases.md` | Una sola página, el CV en el título y en la rueda, Contacto sin idioma |
| `docs/informes/fase-8-mejoras.md` | Este informe |

### Commits recomendados

```bash
# 1. Remove the CV web view and the VER CV link (the texts go too; the no-JavaScript note comes in)
git add -A cv src/cv src/components/CvLink.tsx src/components/CvLink.module.css scripts/cv-check.mjs src/site vite.config.ts index.html src/App.tsx src/scenes/camp/CampScene.tsx src/components/Hud.tsx src/components/Hud.module.css src/content src/styles/global.css package.json
git commit -m "feat(cv): remove the CV web view and keep the PDF, with a no-JavaScript note"

# 2. The CV parchment on the title screen
git add src/components/CvScroll.tsx src/components/CvScroll.module.css src/scenes/title/TitleScreen.tsx src/assets/icons/icons.ts src/components/RingMenu.tsx src/styles/contrast.ts
git commit -m "feat(title): ask for the CV from a parchment on the title screen"

# 3. No language choice in the contact window
git add src/windows/ContactWindow.tsx src/windows/ContactWindow.module.css
git commit -m "feat(contact): drop the language choice now that the ring and the title switch it"

# 4. Checks
git add scripts/title-check.mjs scripts/camp-check.mjs scripts/windows-check.mjs scripts/intro-check.mjs
git commit -m "test(checks): check the title's CV, head tags, PDFs and no-JavaScript note"

# 5. Docs
git add CLAUDE.md BRIEF.md PRODUCT.md DESIGN.md CONTENT.md docs/plan-de-fases.md docs/informes/fase-8-mejoras.md
git commit -m "docs: describe the single page and the CV on the title, and report blocks I and L"
```

---

## Bloques D, E, F y M — Retratos, tu tono de piel, el favicon y las barras del HUD

Van juntos porque salen del generador de personajes, dependen del tono de piel que elegiste (el
**2, "claro"**) y cambian el mismo HUD. Este apartado recoge el resultado final, tras las dos
rondas de cambios que pediste sobre tu retrato.

### Resumen
- **Tu piel, más clara (F)**, en todos tus dibujos: quieto, caminando de frente y de lado. Solo
  cambian los píxeles de piel; la forma y la animación son las mismas.
- **El HUD (D) mantiene su marco de piedra**, como antes:
  - **Null:** su retrato nuevo, sin el marco dorado.
  - **Tú:** tu dibujo del juego, del pelo a los hombros (con el cuello y algo de ropa), el doble de grande que el de Null por píxel (×2).
  - La ventana de Perfil enseña tu cara igual.
- **Al lado de cada retrato (M):** el nombre, una barra de vida (HP) y una de experiencia (XP).
  - **La vida está siempre llena.**
  - **La experiencia crece al explorar:** un cuarto por cada sección que abre el visitante. Se
    recuerda al volver, y Yeray y Null la comparten.
- **El icono de la pestaña y el de iPhone (E)** son tu cara del juego, tal cual, con el tono
  nuevo.

### 1. Decisiones tomadas

| Decisión | Por qué | Quién |
|---|---|---|
| Tono 2, "claro" | — | Tú |
| Tu retrato: tu cara del juego, ampliada | "Que no pierda ese estilo pixel art" | Tú |
| Vuelve el marco de piedra; tu cara, con el cuello y algo de ropa | "Me gustaba como estaba antes con la piedra"; "que se me vea el cuello y algo de ropa" | Tú |
| Barras de vida y experiencia al lado de cada retrato | "Para que la inmersión aumente" | Tú |
| **Tu cara sale directamente de tu dibujo del juego** (el mismo archivo que el campamento), sin un retrato aparte | Así no se compone ni se dibuja nada; el HUD la muestra más grande. `portrait_yeray.jpg` ya no se usa | Yo |
| Tu dibujo a ×2 la escala de Null, del pelo a los hombros | Primero lo puse a ×3 (del pelo a la barbilla) y te pareció demasiado. No hay término medio: ×2,5 haría píxeles desiguales en un portátil. Centrado en píxeles enteros | Tú y yo |
| El retrato de Null, sin su marco dorado (115×115) | El marco de piedra ya lo enmarca | Yo |
| **La vida siempre llena**, y los lectores de pantalla no la oyen | No hay nada real que medir. Inventar un número iría contra la regla de no inventar datos | Yo |
| **La experiencia mide la visita, no a ti:** 25 % por cada sección abierta (Proyectos, Stack, Perfil, Contacto) | Un valor fijo sería un dato inventado. Así además anima a explorar | Yo |
| La experiencia se recuerda en el navegador (`explored`) y la comparten Yeray y Null | Como un grupo de RPG; quien vuelve la conserva | Yo |
| La barra de XP crece en 4 saltos en 16 fotogramas; sin animación con "reducir movimiento" | Movimiento a saltos, como el resto del juego | Yo |
| Tamaños en **píxeles de pantalla enteros** | Un píxel del retrato es siempre 1, 2… píxeles reales: nunca se emborrona | Yo |
| **El favicon sale de tu dibujo del juego** | El retrato habría que reducirlo, y eso es reescalar un personaje. Tu dibujo (46 px) cabe tal cual | Yo |
| La piel, por **proporciones de color** y solo por encima de las rodillas; cada hoja se mide a sí misma | No toca ojos, iris, pelo, barba, mochila ni botas, y tus dos hojas acaban con el mismo color | Yo |

### 2. Qué se ha hecho, paso a paso

**2.1 La piel (F)** (`scripts/sprites/skin.mjs`, nuevo; el tono, en `cutout.mjs`)
1. **Qué es piel:** colores con proporciones de piel (verde y azul respecto al rojo), no
   demasiado oscuros, y solo por encima de las rodillas.
2. **Cada hoja se mide entera** (brillo de su sombra, su tono principal y su luz). Así sus
   fotogramas siguen idénticos entre sí, y la cabeza estampada del caminar no cambia de un paso
   a otro.
3. **Cada píxel de piel toma el color del tono 2** a su mismo brillo: sombra (170,118,96), tono
   principal (228,178,142) y luz (246,208,176).
4. **El generador comprueba en cada pasada** que solo cambia la piel: 3782 píxeles en la hoja de
   frente y 2914 en la de lado. Si cambiara otra cosa, falla.
5. **Para probar otro tono:** `npm run characters -- --skin=1` (o `3`, o `none`). El tono fijo
   (`SKIN_TONE = 2`) está en `cutout.mjs`.

**2.2 Los retratos (D)**
- **El generador** acepta imágenes enteras con un margen de marco que quitar: el retrato de Null
  sale de 115×115 sin su marco dorado. También apunta en qué fila empieza cada dibujo (`top`).
- **`Portrait`** muestra:
  - el retrato de Null;
  - o tu dibujo quieto (el mismo del campamento), encuadrado desde el pelo.

  Siempre en una pantalla cuadrada, a un número entero de píxeles de pantalla por píxel
  (`devicePixelZoom`, en `stage.ts`).
- **Tamaños:**

  | | Portátil 1440 | Móvil |
  |---|---|---|
  | Pantalla del HUD | 115 px | 57 o 77 px |
  | Tu cara en Perfil | 138 px | 138 px |

- **El título descarga el retrato de Null** mientras lo miras. El tuyo ya venía con tus dibujos.

**2.3 Las barras (M)**
- **`HudBar`** (nuevo): la etiqueta (HP o XP) y una pista de tinta con el relleno. Rojo para la
  vida y azul para la experiencia.
- **`src/game/explored.ts`** (nuevo, con pruebas): qué secciones se han abierto. Cada una cuenta
  una vez, los borradores no cuentan, y se guarda en el navegador.
- **El campamento suma una sección** a la experiencia la primera vez que se abre su ventana.
- **El HUD** (`Hud.tsx`): panel de piedra, retrato en su pantalla y, al lado, nombre, HP y XP. El
  de Null va reflejado, para que los dos retratos queden en los bordes.

**2.4 El favicon (E)** (`scripts/share-assets.mjs`)
- **`favicon.png`:** la cabeza y el cuello de tu dibujo quieto (46×46 píxeles, del primer pelo
  hacia abajo), con un píxel transparente alrededor: 48×48.
- **`apple-touch-icon.png`:** lo mismo ampliado ×3 sobre un cuadro de noche de 180×180, porque
  los móviles no muestran transparencia.
- **`og-image.png`:** se ha vuelto a capturar; es la misma pantalla de título, sin botones.

### 3. Cómo se ha comprobado

**Pruebas y herramientas**
- **Tipos, lint y 177 pruebas** en verde. Las nuevas:
  - los tamaños del retrato en pantallas de 1×, 2× y 3×;
  - el retrato de Null cabe exacto en la pantalla del HUD;
  - la experiencia: cada sección cuenta una vez, en orden, sin borradores, y se lee bien lo
    guardado;
  - un par de contraste nuevo para las etiquetas HP y XP.
- **`npm run characters`:** las comprobaciones de piel y las del caminar, todo ✓.

**`check:camp`**, ampliado, contra producción: **todo ✓**.
- **La rueda no pisa el HUD**, a los tres tamaños y en los dos idiomas.
- **El HUD:** cada retrato con su nombre, HP y XP.
- **La experiencia:**
  - empieza en 0 %, y el lector de pantalla oye "Experiencia: 0 de 4 secciones exploradas";
  - sube al 25 % y al 50 % al abrir dos secciones;
  - abrir la misma otra vez no suma;
  - se recuerda al recargar.

**Las demás comprobaciones**
- **`check:title`** (comprueba que el retrato de Null se descarga durante el título),
  **`check:intro`** y **`check:windows`**: todo ✓, en desarrollo y en producción.
- **Sin desbordamiento** a 390, 768 y 1440 px.

**Rendimiento** (build de producción)

| Medida | Objetivo | Ahora | Antes del bloque D |
|---|---|---|---|
| JavaScript inicial (gzip) | ≤ 100 KB | **88,0 KB** | 87,5 KB |
| Peso total del campamento | ≤ 300 KB | **242 KiB** | 243 KiB |
| Lighthouse móvil, campamento | ≥ 95 | **99** · 100 · 100 · 100 | 99 |
| LCP campamento (móvil) | ≤ 2,5 s | **2,0 s** | 2,0 s |
| Rueda e intro, CPU ×4 | ≥ 30 fps | **60 fps** | 60 |

El LCP lo marca tu retrato del HUD, como antes. La ronda con el marco dorado llegó a 263 KiB y
2,3 s; al usar tu dibujo del juego en vez de un retrato aparte, ha vuelto a lo de antes.

**Capturas** en `.screenshots/fase-8/`:
- `fase-8-hud-x2-*.png`: el campamento con el HUD final a 390, 768 y 1440 px;
- `hud-xp-1440.png`: la experiencia al 50 %;
- `perfil-es-390.png` y `perfil-es-1440.png`: la ventana de Perfil;
- `piel-tonos.png`: la comparación de tonos que elegiste.

### 4. TypeScript en estos bloques

**El tipo de un campo de otro tipo** (`Hud.tsx`):

```ts
type HudProps = { texts: Content['hud']; /* … */ };
```

- `Content['hud']` es "el tipo del campo `hud` de `Content`": los nombres y las etiquetas HP y XP.
- Si mañana añades un texto al HUD en `types.ts`, las props del componente lo tienen solas.

**Pasar una función a `useState`** (`CampScene.tsx`):

```ts
const [explored, setExplored] = useState(readExplored);
```

- Sin paréntesis, React llama a `readExplored` una sola vez, en el primer render.
- Con `useState(readExplored())` leería el almacenamiento del navegador en cada render.

**Un filtro que estrecha el tipo** (`explored.ts`):

```ts
SLOTS.filter(…).map((slot) => slot.id).filter(isSection)
```

`isSection` es un guardián de tipo (`slot is SectionId`, del bloque B). Usado en `filter`,
TypeScript sabe que el resultado es una lista de `SectionId`, sin el CV ni el idioma.

### 5. Problemas encontrados y cómo se resolvieron

| Problema | Solución |
|---|---|
| La detección de la rejilla de los retratos daba 20,9 o 5,1 | Medí a ojo, ampliando: 7,5. El marco dorado está dibujado a otra rejilla y confundía la detección |
| La prueba de piel antigua cogía el blanco de los ojos y trozos de las botas | Una prueba nueva por proporciones de color, solo por encima de las rodillas |
| El icono de iPhone salía con el fondo transparente | La cara se pone encima de un cuadro de noche |
| El lint avisó de una actualización de estado dentro de un efecto (la experiencia) | Se calcula durante el render, como ya hacía el campamento con la ventana abierta |
| `check:intro` midió 7,7 s dos veces | Pasó justo después de regenerar los personajes y los iconos: el servidor de desarrollo recargaba la página. Medida aparte, 4,6 s; repetida, 4,8 s |

### 6. Observaciones
- **El degradado de las patillas** (entre el pelo y la oreja) es pelo y no cambia de color: con la
  piel más clara se nota algo más.
- **`references/portraits/portrait_yeray.jpg` ya no se usa:** tu retrato es tu dibujo del juego.
  Lo dejo donde está, por si lo quieres más adelante.
- **Las hojas de las animaciones en reposo** (bloque K) recibirán el tono 2 solas al pasar por el
  generador.
- **La experiencia cuenta las 4 secciones de ahora.** Cuando llegue "Sobre mí", contará 5.

### 7. Lo que necesito de ti
1. **Mira el HUD** (`npm run dev`, http://localhost:5173/#camp): abre secciones y mira cómo sube
   la XP. Para empezar de cero, borra los datos del sitio en el navegador.
2. **Dime si te convencen:**
   - el tamaño de tu retrato (×2, del pelo a los hombros);
   - las barras: colores, tamaño y que la vida esté siempre llena.

### 8. Archivos para tu commit

| Archivo | Cambio |
|---|---|
| `scripts/sprites/skin.mjs` | **Nuevo**: el cambio de piel y su comprobación |
| `scripts/sprites/cutout.mjs` | El tono 2, `--skin`, el retrato de Null sin marco y `top` |
| `src/assets/characters/` (los PNG, `characters.gen.ts`, `characters.ts`, `characters.test.ts`) | Piel nueva, el retrato nuevo de Null, sin las "poses" de retrato |
| `src/components/Portrait.tsx` + `.module.css` | **Nuevo**: los retratos en su pantalla |
| `src/components/HudBar.tsx` + `.module.css` | **Nuevo**: las barras HP y XP |
| `src/components/Hud.tsx` + `.module.css` | El HUD con piedra, retratos y barras |
| `src/game/explored.ts`, `explored.test.ts` | **Nuevos**: la experiencia |
| `src/game/stage.ts`, `stage.test.ts` | `devicePixelZoom` y el tamaño de los retratos |
| `src/scenes/camp/CampScene.tsx`, `src/scenes/camp/campAssets.ts` | La experiencia; el título descarga el retrato de Null |
| `src/content/types.ts`, `es.ts`, `en.ts` | Los textos HP, XP y de la experiencia |
| `src/windows/ProfileWindow.tsx` + `.module.css` | Tu cara en Perfil |
| `src/dev/CharactersDemo.tsx` | Los retratos junto a sus referencias |
| `src/styles/contrast.ts` | Los pares del HUD |
| `scripts/share-assets.mjs`, `public/favicon.png`, `public/apple-touch-icon.png`, `public/og-image.png` | Los iconos con tu cara |
| `scripts/camp-check.mjs`, `scripts/title-check.mjs` | El HUD contra la rueda, la experiencia, la descarga del retrato |
| `CLAUDE.md`, `BRIEF.md`, `DESIGN.md`, `CONTENT.md`, `docs/plan-de-fases.md` | La piel, los retratos, el HUD y el favicon |
| `docs/informes/fase-8-mejoras.md` | Este informe |

### Commits recomendados

```bash
# 1. The generator: Yeray's lighter skin (tone 2) and Null's new portrait
git add scripts/sprites/skin.mjs scripts/sprites/cutout.mjs src/assets/characters
git commit -m "feat(characters): lighten Yeray's skin and add Null's new portrait"

# 2. The HUD: stone panels with the portraits, HP and XP bars; Yeray's face in the profile
git add src/components/Portrait.tsx src/components/Portrait.module.css src/components/HudBar.tsx src/components/HudBar.module.css src/components/Hud.tsx src/components/Hud.module.css src/game/explored.ts src/game/explored.test.ts src/game/stage.ts src/game/stage.test.ts src/scenes/camp/CampScene.tsx src/scenes/camp/campAssets.ts src/content/types.ts src/content/es.ts src/content/en.ts src/windows/ProfileWindow.tsx src/windows/ProfileWindow.module.css src/dev/CharactersDemo.tsx src/styles/contrast.ts
git commit -m "feat(hud): show the portraits with life and experience bars"

# 3. The icons with Yeray's face
git add scripts/share-assets.mjs public/favicon.png public/apple-touch-icon.png public/og-image.png
git commit -m "feat(icons): make the favicon and the phone icon from Yeray's face"

# 4. Checks
git add scripts/camp-check.mjs scripts/title-check.mjs
git commit -m "test(checks): check the HUD bars, the experience and the portrait download"

# 5. Docs
git add CLAUDE.md BRIEF.md DESIGN.md CONTENT.md docs/plan-de-fases.md docs/informes/fase-8-mejoras.md
git commit -m "docs: describe the skin tone, the portraits and the HUD bars, and report blocks D, E, F and M"
```

---

## Bloque G — El caminar de Null

### Resumen
- **Null camina de frente con tu hoja nueva** (`null_front_walk_animation.jpg`), con el mismo
  "sello" que tu caminar:
  - una sola cabeza en todos los fotogramas, sin temblores;
  - un paso y su reflejo para la otra pata;
  - el cuerpo botando por píxeles enteros.
- **Ya no cojea:** antes solo movía una pata.
- **Mide lo mismo de pie, andando y sentado.** Antes crecía un 22 % al sentarse.
- **En la intro baja de frente hasta su sitio**, sin el trote de lado, que seguía roto y era más
  pequeño.

### 1. Diagnóstico (lo que fallaba)
Escrito con detalle en `docs/animacion-caminar.md`, sección 8.

| Qué | Problema |
|---|---|
| De frente (3 dibujos, ida y vuelta) | Solo un dibujo adelantaba una pata: parecía que cojeaba. La cabeza cambiaba en cada uno |
| De lado (6 dibujos) | Anchos distintos: el cuerpo se desplazaba a saltos. La cabeza subía y bajaba sin orden |
| Tamaño | Andando medía 38 px y sentado 46,5: crecía al sentarse |

### 2. Decisiones tomadas

| Decisión | Por qué | Quién |
|---|---|---|
| El mismo sello que tu caminar: la cabeza del fotograma 0 estampada, el paso del fotograma 3 y su reflejo | Es el método aprobado. Tus 8 fotogramas tienen la cabeza y el cuerpo algo distintos en cada uno: tal cual, temblarían | Yo |
| El fotograma 3 como paso | Es el más claro: una pata delantera adelantada hacia la cámara y la otra levantada | Yo |
| A medio píxel de escena, como su dibujo sentado | Tu hoja está dibujada a la misma resolución que el sentado: así mide lo mismo andando y sentado | Yo |
| 8 fotogramas × 70 ms (0,56 s por dos pasos) | El paso más rápido de un perro pequeño. Tu caminar va a 120 ms | Yo |
| **En la intro, sin trote de lado:** baja de frente en diagonal hasta su sitio, a 65 px/s | El dibujo de lado es más pequeño que el nuevo de frente y no se puede reescalar. La intro dura lo mismo (4,8 s) | Yo |
| El trote de lado se queda en `/dev/personajes` | Para cuando haya una hoja de lado nueva | Yo |

### 3. Qué se ha hecho, paso a paso
1. **Medí tu hoja:** 8 figuras bien separadas, a 3,75 píxeles de imagen por píxel (la detección
   y la vista ampliada coinciden). Cada fotograma sale de unos 55×96.
2. **Busqué los límites en el fotograma 0**, con un mapa de materiales fila a fila: la cabeza
   acaba en la fila 44 (el final de la barba) y las patas se separan desde la fila 70.
3. **Añadí su caminar al generador** (`cutout.mjs`), con las 6 imágenes del ciclo. Todas pasan
   las comprobaciones:
   - cabeza idéntica (lo verifiqué también píxel a píxel);
   - bote correcto;
   - sin motas;
   - patas en el suelo.
4. **Sus poses** (`characters.ts`):
   - `stand` es el dibujo quieto nuevo;
   - `walkDown` es el ciclo de 8;
   - los dos, a medio píxel como `sit`.

   Su sombra, al caminar, es tan ancha como sentado.
5. **La intro** (`intro.ts`): Null espera en la cueva, baja de frente hasta su sitio y se sienta.
6. **`/dev/personajes`** enseña su caminar como el tuyo: a velocidad real y a ×0,25, los 8
   fotogramas, el papel cebolla y la referencia.

### 4. Cómo se ha comprobado
- **Tipos, lint y 181 pruebas** en verde. Las nuevas:
  - Null mide lo mismo de pie y sentado (±3 px);
  - su caminar es un ciclo de 8 con un solo lienzo y una sola línea de suelo, y empieza y
    acaba en su pose quieta.
- **`check:intro`, `check:camp` y `check:title`:** todo ✓, en desarrollo y en producción. La
  intro dura 4,81 s.
- **Rendimiento:**
  - intro a 60 fps con la CPU ×1 y 59,6 con ×4;
  - Lighthouse del título 99 · 100 · 100 · 100, con 235 KiB. Son 8 KiB más, porque la hoja de
    Null (19,5 KB) es más detallada.
- **Capturas** de la intro (Null bajando y sentándose) y de `/dev/personajes` en
  `.screenshots/fase-8/fase-8-g-personajes-*.png`.

### 5. TypeScript en este bloque
Nada nuevo. Se reutiliza la lista tipada de nombres de imagen (`CharacterImageName[]`) del
caminar de Yeray: escribir mal un nombre de fotograma no compila.

### 6. Observaciones
- **Para recuperar el trote de lado** hace falta una hoja de lado a la misma resolución que la de
  frente. Con ella aplico el mismo método.
- **`null_frente.jpg` ya no se usa** (su sitio lo ocupa la hoja nueva). Lo dejo en `references/`.

### 7. Lo que necesito de ti
1. **Mira a Null caminar** en la intro (http://localhost:5173/#title, recarga y pulsa una tecla)
   y en `/dev/personajes`, a velocidad real y a ×0,25.
2. **Dime si te convence el ritmo** (70 ms por fotograma) y si quieres recuperar el trote de lado
   con una hoja nueva.

### 8. Archivos para tu commit

| Archivo | Cambio |
|---|---|
| `scripts/sprites/cutout.mjs` | El caminar de frente de Null con el sello; fuera `null_frente.jpg` |
| `src/assets/characters/` (`null-front-walk.png` nuevo, fuera `null-front-0/1/2.png`, `characters.gen.ts`) | Las imágenes nuevas |
| `src/assets/characters/characters.ts`, `characters.test.ts` | Sus poses y sus pruebas |
| `src/scenes/camp/intro.ts`, `src/scenes/camp/CampCanvas.tsx` | La intro sin trote de lado; su sombra |
| `src/dev/CharactersDemo.tsx` | Su caminar en la página de personajes |
| `docs/animacion-caminar.md`, `DESIGN.md`, `BRIEF.md`, `docs/plan-de-fases.md` | El diagnóstico y el resultado |
| `docs/informes/fase-8-mejoras.md` | Este informe |

### Commits recomendados

```bash
# 1. Null's front walk through the sello, at the size of his sitting picture
git add -A scripts/sprites/cutout.mjs src/assets/characters src/scenes/camp/intro.ts src/scenes/camp/CampCanvas.tsx src/dev/CharactersDemo.tsx
git commit -m "feat(characters): give Null a stamped front walk and drop the side trot from the intro"

# 2. Docs
git add docs/animacion-caminar.md DESIGN.md BRIEF.md docs/plan-de-fases.md docs/informes/fase-8-mejoras.md
git commit -m "docs: diagnose Null's old walk and report block G"
```

Si los commits de los bloques D, E, F y M aún no están hechos, haz los suyos primero: tocan los
mismos archivos de `src/assets/characters/`.

---

## Bloque J — Iconos del stack técnico

### Resumen
- **Cada una de las 22 tecnologías de la ventana Stack lleva su icono** delante del nombre, en
  píxeles, del color del texto y a su altura.
- **16 son su logo de Simple Icons** (opción B), pasado a una rejilla de 16×16 sin suavizar.
- **6 llevan un icono genérico dibujado por mí**, porque no tienen logo en Simple Icons.
- **Todos van en una sola imagen de 1,1 KB**, que se descarga con la ventana.

### 1. Decisiones tomadas

| Decisión | Por qué | Quién |
|---|---|---|
| Logos de Simple Icons (CC0) en píxeles, en un solo color | Opción B | Tú |
| **Seis iconos genéricos:** SQL (tabla), APIs REST (dos flechas), Java (taza de café), Oracle Database (base de datos), AWS (nube) y WSL (terminal) | SQL y REST no tienen logo; Java y Oracle los retiró su empresa; AWS y WSL no están | Yo |
| 16×16, a la altura de una línea de texto, en píxeles de pantalla enteros: 32 CSS px en el portátil y 16 en el móvil | Encaja con el texto y con el resto del pixel art | Yo |
| Color `text` de la paleta (el mismo que los nombres) | Se leen como parte de la fila, no compiten con los títulos dorados | Yo |
| Un píxel se enciende si el logo cubre al menos la mitad, salvo en tres: Python (0,65), PostgreSQL (0,25) y Linux (0,35) | Con la mitad, Python era una mancha y el elefante y el pingüino se rompían en puntos. Lo comparé umbral a umbral | Yo |
| `simple-icons` como dependencia de desarrollo | Solo lo usa el script al generar. La web no lo descarga ni depende de él | Yo |
| Cada tecnología lleva un identificador (`id`) en los textos | Así el icono no depende de cómo se escriba el nombre en cada idioma ("APIs REST" / "REST APIs") | Yo |

Usar el logo de una tecnología para decir que la usas es lo habitual en un portfolio. No sugiere
que la marca te patrocine.

### 2. Qué se ha hecho, paso a paso
1. **`npm install --save-dev simple-icons@16.38.0`**: licencia CC0 y 0 vulnerabilidades.
2. **Busqué tus 22 tecnologías en Simple Icons:** 16 están y 6 no.
3. **Script nuevo, `npm run stack-icons`** (`scripts/stack-icons.mjs`):
   - dibuja cada logo 8 veces más grande en un lienzo del navegador (Playwright);
   - lo reduce a 16×16 (cada bloque de 8×8 se convierte en un píxel encendido o apagado);
   - añade los seis genéricos, dibujados como rejillas de 16×16 en el propio script;
   - lo junta todo en `src/assets/stack/stack-icons.png`, en el color `text` que lee de la
     paleta;
   - escribe `stack-icons.gen.ts` con el sitio de cada icono.
4. **Comprobaciones del script:** cada icono mide 16×16 y tiene al menos 20 píxeles (la reducción
   no lo ha borrado).
5. **Los textos:** cada tecnología pasa de ser un texto a ser `{ id, name }`. Un tipo nuevo,
   `TechId`, reúne los 22 identificadores.
6. **La ventana Stack** pinta cada tecnología con su icono (`TechIcon`, que recorta su trozo de la
   imagen) y las agrupa en filas que se reparten solas, sin los "·" de antes.

### 3. Cómo se ha comprobado
- **Tipos, lint y 183 pruebas** en verde. Las nuevas:
  - cada tecnología de los dos idiomas tiene icono;
  - cada icono tiene su propio sitio en la imagen;
  - los dos idiomas tienen las mismas tecnologías en el mismo orden.
- **`check:windows`:** todo ✓, incluido que la ventana no descarga nada pesado antes de abrirse.
- **Peso:** la imagen pesa 1,1 KB y la ventana Stack, 0,7 KB comprimida. El JavaScript inicial,
  88,1 KB.
- **Capturas** en `.screenshots/fase-8/`: `stack-es-1440.png`, `stack-es-390.png` y
  `stack-en-768.png`.

### 4. TypeScript en este bloque
**Un `Record` que obliga a estar completo** (`stack-icons.gen.ts`):

```ts
export const STACK_ICONS = {
  javascript: 0,
  java: 1,
  // …
} satisfies Record<TechId, number>;
```

- `TechId` es la unión de las 22 tecnologías (`'javascript' | 'java' | …`).
- `satisfies Record<TechId, number>` exige un número para cada una. Si añades una tecnología a
  `TechId` y no regeneras los iconos, el compilador señala exactamente cuál falta.

**Un tipo pequeño reutilizado:**
- `Tech = { id: TechId; name: string }` describe cada tecnología.
- `Tier` lo usa en sus listas (`items: Tech[]`), así los textos y los iconos comparten el mismo
  identificador.

### 5. Problemas encontrados y cómo se resolvieron

| Problema | Solución |
|---|---|
| Java, Oracle, AWS y WSL no están en Simple Icons | Iconos genéricos dibujados en píxeles |
| A 16 px, Python era una mancha y PostgreSQL y Linux se rompían | Un umbral de cobertura distinto para esos tres, comparado uno a uno |

### 6. Observaciones
- **Express** se lee como una caja con "ex", y **PHP** como un óvalo con "php": son así sus
  logos, y a 16 px dan para poco.
- **Si un día cambias tus tecnologías**, añádelas en `es.ts` y `en.ts` con su `id`, súmala a
  `TechId` y ejecuta `npm run stack-icons`.

### 7. Lo que necesito de ti
1. **Mira la ventana Stack** (http://localhost:5173/#stack): las dos pestañas, en el ordenador y en
   el móvil.
2. **Dime si te convencen los iconos genéricos** (taza, tabla, flechas, base de datos, nube,
   terminal) y el color.

### 8. Archivos para tu commit

| Archivo | Cambio |
|---|---|
| `package.json`, `package-lock.json` | `simple-icons` (desarrollo) y el comando `stack-icons` |
| `scripts/stack-icons.mjs` | **Nuevo**: el generador de los iconos |
| `src/assets/stack/` (`stack-icons.png`, `stack-icons.gen.ts`, `stack-icons.test.ts`) | **Nuevos**: los iconos y su prueba |
| `src/content/types.ts`, `es.ts`, `en.ts`, `content.test.ts` | `TechId`, `Tech` y las tecnologías con su `id` |
| `src/windows/StackWindow.tsx`, `StackWindow.module.css` (nuevo), `TechIcon.tsx` + `.module.css` (nuevos) | La ventana con sus iconos |
| `src/styles/contrast.ts` | Los iconos en el par del texto sobre piedra |
| `CLAUDE.md`, `DESIGN.md`, `BRIEF.md`, `CONTENT.md`, `docs/plan-de-fases.md` | Los iconos del stack |
| `docs/informes/fase-8-mejoras.md` | Este informe |

### Commits recomendados

```bash
# 1. The icon generator and the icons
git add package.json package-lock.json scripts/stack-icons.mjs src/assets/stack
git commit -m "feat(stack): generate pixel icons for every technology from Simple Icons"

# 2. The STACK window with its icons
git add src/content/types.ts src/content/es.ts src/content/en.ts src/content/content.test.ts src/windows/StackWindow.tsx src/windows/StackWindow.module.css src/windows/TechIcon.tsx src/windows/TechIcon.module.css src/styles/contrast.ts
git commit -m "feat(stack): show each technology with its icon"

# 3. Docs
git add CLAUDE.md DESIGN.md BRIEF.md CONTENT.md docs/plan-de-fases.md docs/informes/fase-8-mejoras.md
git commit -m "docs: describe the STACK icons and report block J"
```

---

## Bloque K — Animaciones en reposo

### Resumen
- **Ya no estáis quietos.** Cada 3–6 segundos, uno de los dos hace un gesto y vuelve a su pose,
  también mientras se usa la rueda; los seis van por rondas y os turnáis:
  - **tú:** te subes las gafas, das un sorbo de café o te quedas pensando con la mano en la barbilla;
  - **Null:** ladea la cabeza, mueve la cola o se rasca la oreja.
- **Cada gesto empieza y acaba en el dibujo del juego**, sin saltos: de tus hojas solo se toma lo que
  se mueve, y tu tono de piel sale idéntico al de tu dibujo quieto.
- **19/11:** las de Null y el "director". **20/11:** arreglado el fallo de Null que desaparecía, y
  hechas las tuyas con tus hojas nuevas (`gafas_new.jpg`, `cafe_new.jpg`, `pensar_new.jpg`).
- **Ronda 2 (20/11, tras tu revisión):** el café ya no se rompe, pensar sale tanto como las demás y
  los gestos ya no esperan a que el visitante esté AFK. Ver "Ronda 2" más abajo.
- **Ronda 3 (20/11, tras tu revisión):** el café y los ojos de pensar, revisados píxel a píxel contra
  tus hojas y fotograma a fotograma en movimiento. Ver "Ronda 3" más abajo.

### 1. Diagnóstico: cuánto se parece cada hoja a vuestro dibujo del juego
Comparé el primer fotograma de cada hoja (la pose quieta) con el dibujo que ya sale en el juego:

| Hoja | Diferente del dibujo del juego | Qué pasa |
|---|---|---|
| `ladear_cabeza.jpg` | 1 % | Es el mismo Null: vale |
| `rascar_oreja.jpg` | 2 % | Vale |
| `mover_cola.jpg` | 16 % (lo dibuja un 4 % más pequeño) | Vale solo la cola, que es lo único que cambia y sobresale |
| `gafas.jpg`, `cafe.jpg`, `pensar.jpg` (19/11) | 42–45 % (cuerpo de 42 px de ancho en vez de 46; cabeza un 25–30 % distinta) | No vale: se vería otro Yeray durante la acción. No se usan |
| **`gafas_new.jpg`** (20/11) | **0,2 %** | Es tu dibujo exacto: perfecta |
| **`cafe_new.jpg`**, **`pensar_new.jpg`** (20/11) | 8,3 % y 7,0 % | Valen. Casi toda la diferencia está en tu lado derecho, dibujado 1 píxel desplazado, donde no se mueve nada |

### 2. Decisiones tomadas

| Decisión | Por qué | Quién |
|---|---|---|
| **De cada hoja solo se toma lo que cambia** respecto a su primer fotograma (el brazo, la taza, la cabeza, la pata, la cola), y se pone encima del dibujo del juego | Todo lo demás *es* el dibujo del juego, así que la acción empieza y acaba sin salto. No se pinta nada: cada píxel sale de tus imágenes | Yo |
| **Lo que cambia se coloca grupo a grupo**, y cada grupo se puede mover hasta 1 píxel para encajar con lo que lo rodea | El generador de imágenes dibuja a veces un lado de la figura 1 píxel desplazado. Sin esto, el ojo que se cierra al beber quedaba torcido | Yo |
| **Se deja fuera el ruido del generador:** motas de menos de 4 píxeles, cambios que solo siguen el contorno (el contorno redibujado 1 píxel más allá) y grupos que ni moviéndolos encajan | No son movimiento. En tus hojas eran 0–32 píxeles por fotograma | Yo |
| **Los huecos pequeños dentro de lo que se mueve** toman el color de la hoja | La sombra de la mano tiene un color muy parecido al verde oscuro del chaleco, y sin esto el chaleco se veía a través de la mano | Yo |
| **Tu tono de piel se aplica con la misma rampa que tu dibujo quieto** | Así cada píxel de tu dibujo conserva exactamente su color del juego, y la mano que se mueve tiene el mismo tono que la cara | Yo |
| **Comprobaciones del generador:** la figura entera no puede diferir más de un 12 % (las hojas antiguas daban 42–45 %); la **costura** (los píxeles de tu dibujo que rodean lo pegado) no más de un 6 %; y la imagen de partida tiene que ser el dibujo del juego píxel a píxel | El 5 % del 19/11 medía la figura entera y paraba hojas buenas por un desfase donde no se pega nada. Lo que de verdad importa es que no se note un corte donde lo pegado se junta con tu dibujo | Yo |
| ~~Tras 6–10 s sin tocar nada, una acción al azar~~ → **cada 3–6 s, por rondas** (ronda 2) | Ver "Ronda 2" | Tú |
| **Seguís respirando durante la acción** (con el mismo reloj que en reposo) | Si no, cuando el gesto empezaba en la mitad "abajo" de la respiración, daba un saltito de 1 píxel al empezar y al acabar | Yo |
| ~~Cualquier tecla o toque la corta al instante~~ → **usar la rueda no la corta** (ronda 2) | Ver "Ronda 2" | Tú |
| Ninguna con una ventana abierta, durante la intro ni con "reducir movimiento" | Accesibilidad y foco en el contenido | Yo |
| **Cada acción se descarga la primera vez que va a salir** (9–22 KB) | Al principio las descargaba a los 2 s y el campamento pasaba de 244 a 285 KB en Lighthouse. Así no pesan nada en la primera carga | Yo |
| Duraciones: gafas 1,0 s, café 1,6 s, pensar 1,5 s; ladear 0,7 s, cola 0,9 s, rascarse 1,1 s. Se repiten fotogramas para sostener la pose (el sorbo, la mano en la barbilla) | Cortas, como un gesto; el café y pensar piden una pausa | Yo |

### 3. Qué se ha hecho, paso a paso
1. **`scripts/sprites/idle.mjs` (nuevo)**, para cada fotograma de una hoja:
   - lo reconstruye en su rejilla nativa, como los personajes;
   - lo compara con el primer fotograma de la misma hoja y se queda con lo que cambia, en grupos
     de píxeles que se tocan, con sus huecos pequeños rellenos;
   - coloca cada grupo sobre el dibujo del juego donde mejor encaja su costura (hasta 1 píxel de
     ajuste) y deja fuera el ruido;
   - agranda el lienzo por igual a izquierda y derecha (y hacia arriba) si algo sobresale, sin
     mover el centro ni la línea del suelo.
2. **`cutout.mjs`:**
   - la lista `IDLES` con las seis acciones y sus comprobaciones;
   - se construyen después de los paseos, porque tu dibujo quieto sale de la hoja de caminar;
   - `npm run characters` genera `yeray-glasses.png`, `yeray-coffee.png`, `yeray-think.png`,
     `null-tilt.png`, `null-tail.png` y `null-scratch.png`.
3. **`characters.ts`:** seis poses nuevas (`YERAY.glasses`, `coffee`, `think`; `NULL_DOG.tilt`,
   `wag`, `scratch`).
4. **`src/game/idle.ts` (nuevo):** las reglas del director, como funciones puras con su prueba:
   cuánto esperar, qué acción toca y cuánto dura.
5. **`src/scenes/camp/useIdleDirector.ts` (nuevo):** el hook que espera, elige, descarga y reproduce
   la acción, y la corta con cualquier tecla o toque.
6. **`CampCanvas.tsx`:**
   - dibuja la acción si hay una en marcha, con la respiración de la pose quieta;
   - marca el lienzo con `data-idle` ("yeray:coffee") para que las comprobaciones sepan qué pasa.
7. **`/dev/personajes`:** una sección con las seis acciones a tamaño de revisión.

### 4. Cómo se ha comprobado
- **Tipos, lint y 207 pruebas** en verde. Las nuevas:
  - el director espera entre 6 y 10 s, nunca repite la acción anterior y sabe cuánto dura cada una;
  - cada una de las seis acciones tiene su línea del suelo y su centro iguales a los del dibujo
    quieto;
  - un instante antes de empezar, una pose da su primer fotograma (la corrección del 20/11).
- **Comprobaciones del generador**, todas ✓:
  - las seis acciones empiezan en el dibujo del juego píxel a píxel, tono de piel incluido;
  - figura entera: gafas 0,2 %, café 8,3 %, pensar 7,0 %; ladear 1,0 %, rascarse 1,8 % (máx. 12 %);
    cola 15,7 % (máx. 25 %);
  - costura por fotograma: gafas 0,3–0,9 %, café 1,8–3,9 %, pensar 1,2–2,8 %, ladear 1,0 %,
    rascarse 1,7–3,2 % (máx. 6 %);
  - tu tono de piel: "nada más tocado" en las tres hojas.
- **La cola de Null sale idéntica** byte a byte a la del 19/11. Ladear y rascarse, prácticamente
  iguales (las comparé fotograma a fotograma).
- **`check:camp`** (desarrollo y producción), cuatro comprobaciones nuevas:
  - sin tocar nada, uno de los dos hace una acción (a los 5,7–12 s; incluye la primera descarga);
  - una tecla la corta al instante;
  - con una ventana abierta no hay acciones;
  - con "reducir movimiento" tampoco.
- **Prueba larga en producción** (las esperas acortadas a 0,15 s): 131 acciones seguidas de los dos
  en 3 minutos, sin errores.
- **`check:intro`:** todo ✓.
- **Rendimiento (`npm run fps`, producción):**
  - 60 fps con la rueda girando, en CPU ×1 y ×4;
  - intro: 60 fps (×1) y 59,8 fps (×4);
  - respuesta más lenta a una tecla: 24 ms (×1) y 32 ms (×4).
- **Lighthouse del campamento:** rendimiento 99, accesibilidad 100, buenas prácticas 100, SEO 100.
  LCP 2,0 s, CLS 0, 244 KB en total (igual que sin acciones). JavaScript inicial: 89,2 KB comprimido.
- **Capturas** en `.screenshots/fase-8/`, las acciones en el juego fotograma a fotograma:
  - `yeray-reposo-secuencia.png`: gafas, café y pensar;
  - `null-reposo-secuencia.png`: cola, rascarse y ladear la cabeza.

### 5. TypeScript en este bloque
**Una intersección de tipos** (`useIdleDirector.ts` y `CampCanvas.tsx`):

```ts
export type IdleNow = IdleAction & { start: number };
type CampActor = ActorFrame & { breathe?: Pose };
```

- `&` junta dos tipos: un `IdleNow` tiene todo lo de `IdleAction` (`actor`, `name`, `pose`) y
  además `start`.
- No hace falta repetir los campos, y si `IdleAction` cambia, `IdleNow` cambia con él.
- `CampActor` añade un campo **opcional** (`breathe?`) a lo que ya describía a un personaje en
  escena: solo el campamento lo usa, la intro no.

**`RefObject` como prop:**
- El hook devuelve un `RefObject<IdleNow | null>` y `CampCanvas` lo recibe como prop opcional
  (`idle?:`).
- El lienzo lo lee en cada fotograma sin que React vuelva a pintar nada: cambiar `ref.current` no
  provoca un re-render.

**Funciones puras con el azar como parámetro:**
- `quietMs(random)` y `pickAction(actions, previous, random)` reciben la función de azar.
- En el juego se les pasa `Math.random`; en las pruebas, `() => 0.5`. Así el resultado es
  predecible y se puede comprobar.

### 6. Problemas encontrados y cómo se resolvieron

| Problema | Solución |
|---|---|
| Tus primeras hojas te dibujaban un 42–45 % distinto del dibujo del juego | No se usan. Hiciste hojas nuevas desde tu dibujo |
| `mover_cola.jpg` dibuja a Null un 4 % más pequeño | Solo se toma lo que sobresale de su figura: la cola |
| `cafe_new.jpg` y `pensar_new.jpg` pasaban del 5 % por un desfase de 1 píxel en tu lado derecho | La comprobación mide ahora la costura de lo que se pega; cada grupo se ajusta hasta 1 píxel |
| Una columna oscura junto al pelo y un píxel junto a las gafas en "pensar" | Eran el contorno redibujado 1 píxel más allá: se dejan fuera los cambios que solo siguen el contorno |
| La regla del contorno borraba la cola de Null en un fotograma (va pegada al cuerpo) | La regla no se aplica a la cola, que solo añade |
| El chaleco se veía a través de tu mano | Los huecos pequeños de lo que se mueve toman el color de la hoja |
| Un saltito de 1 píxel al empezar o acabar un gesto | Seguís respirando durante la acción |
| Precargar las acciones subía el campamento de 244 a 285 KB | Cada acción se descarga la primera vez que va a salir |
| En desarrollo, la primera acción llegó a los 12,2 s (la descarga es más lenta) | La comprobación admite hasta 14 s: 6–10 s de espera más la descarga |
| **(20/11, lo encontraste tú) Tras un rato de acciones, Null desaparecía y no volvía** | Ver abajo, "Corrección del 20/11" |

#### Ronda 2 (20/11): el café, pensar y gestos sin estar AFK
Lo que encontraste al revisarlo:
1. **"La de beber café se rompe en algunos fotogramas."**
2. **"La de pensar la hace muy poco."**
3. **"Que las hagan sin necesidad de estar AFK, así tiene más vida la página."**

**1. El café.** Marqué fotograma a fotograma todo lo que cambiaba respecto a tu dibujo quieto
(en rosa), y aparecieron dos fallos:
- **En el fotograma 4** (la taza otra vez en el pecho), tu hoja redibuja el torso **1 píxel
  desplazado**. Como el generador comparaba píxel a píxel, cada línea movida del chaleco contaba como
  "cambio" y se pegaba sobre tu dibujo: salían dos chalecos mezclados (746 píxeles pegados; ahora 313).
  Lo mismo, en pequeño, en el borde derecho de la cara, el hombro y las piernas: parpadeaban.
- **La mano tenía píxeles verdes:** la sombra de tu mano en la hoja (piel oscura) tiene casi el mismo
  color que el verde oscuro del chaleco, así que no contaba como cambio y se veía el chaleco. Con tu
  tono de piel más claro se notaba mucho.

Arreglos en `scripts/sprites/idle.mjs`:
- **Una línea redibujada hasta 1 píxel más allá no es un cambio** (opción `redrawn: 1`): solo cuenta lo
  que no aparece en ningún sitio a 1 píxel en el otro fotograma, en los dos sentidos. La taza, el
  brazo y los ojos que se cierran siguen contando (el blanco del ojo no está a 1 píxel en el
  fotograma con los ojos cerrados).
- **Solo en tus hojas.** Probé a aplicarla también a Null y le estropeaba la cabeza: su pelaje es tan
  uniforme que la cabeza ladeada pasaba por la quieta. Con `redrawn` solo en las tuyas, Null queda
  como estaba (lo comparé con el del 19/11, ampliado).
- **Piel donde antes no la había siempre es un cambio** (y al revés), aunque los colores se parezcan:
  arregla la mano.
- **Se descartan las rayas finas** (como mucho 2 píxeles de grosor y 3 veces más largas que anchas):
  son contornos redibujados más lejos. Lo que se mueve de verdad es una mancha: el ojo que se cierra
  mide 7×5. La cola de Null queda fuera de esta regla.

**2. Pensar casi no salía.** El director elegía al azar entre seis (solo evitando repetir la
anterior), y por mala suerte un gesto podía tardar mucho en salir. Ahora van **por rondas**: en cada
ronda salen los seis una vez, en orden aleatorio, turnándoos (tú, Null, tú, Null…). Así pensar sale
una vez cada seis gestos, y nunca se repite un gesto seguido.

**3. Sin estar AFK.** Los gestos salen **cada 3–6 s pase lo que pase**: girar la rueda ya no los corta
ni reinicia la espera. Siguen sin salir con una ventana abierta (la ventana tapa el campamento),
durante la intro y con "reducir movimiento". Con las duraciones de los gestos, cada uno de los dos
hace algo cada ~11 s.

**Cómo se ha comprobado:**
- **Generador:** todo ✓. Pegado por fotograma: café 301 / 429 / 449 / 313 px, con costura del 1,4–2,9 %;
  gafas 316–408 px (0,3–0,4 %); pensar 339–357 px (1,4–2,5 %). La cola de Null sale idéntica.
- **Tipos, lint y 208 pruebas** en verde. Las del director son nuevas: espera 3–6 s, barajar no
  pierde ni repite gestos, cada ronda tiene los seis turnándoos, y nunca se repite uno seguido
  (tampoco entre una ronda y la siguiente).
- **`check:camp`** (producción), comprobaciones nuevas:
  - el primer gesto sale a los 3–6 s;
  - girar la rueda no lo corta;
  - mientras se gira la rueda 17 s, siguen saliendo gestos (salieron 3);
  - con las esperas acortadas, dos rondas seguidas: los seis en cada una, turnándoos;
  - sin gestos con una ventana abierta ni con "reducir movimiento".
- **Prueba larga en producción** (esperas acortadas): 107 gestos en 2,5 minutos, sin errores.
- **Rendimiento (`npm run fps`):**
  - 60 fps con la rueda girando, en CPU ×1 y ×4;
  - intro: 60 fps (×1) y 59,5 fps (×4);
  - respuesta más lenta a una tecla: 24 ms (×1) y 48 ms (×4), muy por debajo del presupuesto
    (INP < 200 ms).
- **Lighthouse del campamento:** 98 / 100 / 100 / 100, LCP 2,2 s, CLS 0, 244 KB. JavaScript inicial:
  89,3 KB comprimido.
- **Captura nueva:** `.screenshots/fase-8/yeray-reposo-secuencia.png`, tus tres gestos en el juego.

#### Ronda 3 (20/11): cada píxel, como en tu hoja
Lo que encontraste: **"el café aún queda un poco raro"** y **"en pensar quedan un poco raros los
ojos"**.

**Cómo lo revisé.** Para cada fotograma, lado a lado y muy ampliado: el fotograma de tu hoja colocado
sobre tu dibujo, lo que generaba el generador y dónde difieren. Además, una prueba de **movimiento**:
qué cambia entre cada fotograma y el siguiente tal como se reproducen. Fuera del brazo y la cara no
debería cambiar nada.

**Lo que encontré:**
1. **Ojos mezclados.** En pensar, un ojo salía con la pupila de tu dibujo quieto y el blanco de la hoja
   (forma de "<"), y las cejas no se levantaban. En el café, al cerrar los ojos a uno le quedaba un
   píxel blanco. El generador pegaba solo los píxeles "cambiados", y en un ojo que se mueve 1–2
   píxeles muchos parecían "redibujados" y no se pegaban.
2. **Las cejas y el bigote no acompañaban** a la expresión: son movimientos de 1 píxel, y la
   tolerancia de la ronda 2 los tomaba por líneas redibujadas.
3. **Restos de tu brazo quieto:** píxeles de su contorno que quedaban sueltos al levantar el brazo (el
   codo con un píxel saliente, el hombro, la cadera). Tu dibujo dibuja ese brazo 1 píxel más ancho
   que la hoja.
4. **Parpadeos:** la bota izquierda, el lado derecho de la cabeza, el hombro derecho y el contorno de
   la pierna cambiaban entre fotogramas. Tu hoja los redibuja distinto en cada fotograma.

**Arreglos** (`scripts/sprites/idle.mjs`; las acciones de Null no cambian, comprobado byte a byte):
- **Regiones:** lo que se mueve se pega entero, con 2 píxeles de su alrededor del mismo fotograma (la
  mano entera con la taza). En ese margen solo se cambian píxeles de la figura por píxeles de la
  figura: el contorno ni engorda ni se encoge.
- **La cara como una unidad:** si la cara de un fotograma difiere de la tuya (ojos cerrados o mirando
  arriba, ceja levantada, dedo en las gafas, taza en la boca), se pega la cara interior entera de ese
  fotograma: cejas, ojos, gafas, nariz y bigote, sin orejas ni contorno. Ojos, cejas y bigote quedan
  idénticos a tu hoja (lo comparé ampliado).
- **La tolerancia de 1 píxel solo dentro de la figura:** un píxel que aparece o desaparece siempre
  cuenta, así se borra el contorno del brazo que se va.
- **Un solo movimiento:** fuera de la cara, se conserva el movimiento principal (el brazo con su mano y
  su taza) y lo que lo toca. Las manchas sueltas lejos de él (la bota, el otro hombro) son ruido.
- **Sin tiras de contorno:** dentro de un movimiento, el contorno solo se conserva junto a la parte
  "de dentro" (el borde del brazo), no una tira que siga por la pierna.
- **El contorno exterior del brazo que se va también se va** cuando el fotograma no tiene nada ahí.

**Cómo se ha comprobado:**
- **En movimiento:** entre cada par de fotogramas seguidos solo cambian el brazo (columnas 0–35, hasta
  la fila 80) y la cara. Antes cambiaban también la bota, el lado derecho y la pierna.
- **Contra tus hojas:** cada fotograma ampliado frente a su hoja. Las únicas diferencias que quedan
  están donde tu hoja está desplazada respecto a tu dibujo (su lado derecho, el torso del café 4).
  Ahí se mantiene tu dibujo a propósito, para que nada salte.
- **Generador:** todo ✓; costura del 0,2–2,8 %. Null, idéntico byte a byte.
- **Tipos, lint, 208 pruebas y `check:camp`** (producción), todo ✓. Sin errores en la consola.
- **Captura nueva:** `.screenshots/fase-8/yeray-reposo-secuencia.png`.

**Un límite de la hoja del café:** la taza aparece de golpe en tu mano en el primer fotograma, y
desaparece al volver a la pose quieta, porque así está dibujada (no hay ningún fotograma en que
la cojas). Si quieres que la saques de algún sitio, haría falta un fotograma más en la hoja.

#### Corrección del 20/11: Null desaparecía para siempre
**Qué pasaba:**
1. Cuando empieza una acción, el director apunta la hora con `performance.now()`.
2. El bucle del juego dibuja con la hora en que *empezó* el fotograma de pantalla, que a veces es
   unos milisegundos anterior.
3. En ese caso el tiempo transcurrido salía negativo, y `poseFrame` pedía el fotograma `frames[-1]`,
   que no existe. `drawPose` fallaba con `Cannot read properties of undefined (reading 'src')`.
4. El error ocurría dentro del bucle del juego, antes de pedir el siguiente fotograma: **el bucle
   se paraba para siempre**. El campamento se quedaba a medio dibujar: el fondo, las sombras y
   Yeray sí, Null no. También se paraban la hoguera y el giro de la rueda.

Pasaba de vez en cuando (en mi prueba, en la acción número 76), por eso tardaba un rato.

**Arreglo:**
- **La causa** (`drawCharacter.ts`): `poseFrame` y `poseBob` cuentan un tiempo negativo como 0, el
  primer fotograma de la pose.
- **La red de seguridad** (`useGameLoop.ts`): si algo falla al dibujar, el error sale en la consola
  (`reportError`), pero el bucle sigue y el siguiente fotograma se dibuja con normalidad. Un fallo
  ya nunca congela el juego entero.

**Cómo se ha comprobado:**
- **Reproducido** en la versión de producción, con las esperas de 6–10 s acortadas a 0,15 s: tras 76
  acciones salta el error y Null desaparece.
- **Prueba forzada:** adelantando 30 ms el reloj de `performance.now()`, *todas* las acciones empiezan
  "antes" del fotograma.
  - El código viejo falla en la primera acción (0,7 s).
  - El arreglado aguanta 55 acciones en 60 s sin errores.
- **Prueba larga sin forzar nada:** 207 acciones en 4 minutos, sin errores.
- **Una prueba nueva** (`drawCharacter.test.ts`): un instante antes de empezar, la pose da su primer
  fotograma y nunca "nada". Tipos, lint y 198 pruebas en verde; `check:camp` todo ✓.

### 7. Observaciones
- **Tus hojas antiguas** `gafas.jpg`, `cafe.jpg` y `pensar.jpg` ya no se usan. Están en
  `references/` (privado, fuera de git): bórralas cuando quieras, o lo vemos en la fase 9.
- **Si un día rehaces una hoja**, guárdala con el mismo nombre y ejecuta `npm run characters`: el
  generador te dice si encaja (figura, costura y dibujo de partida).

### 8. Lo que necesito de ti
1. **Míralas en el juego:** http://localhost:5173/#camp. Salen solas cada 3–6 s, también mientras
   giras la rueda. Todas juntas, a tamaño grande: http://localhost:5173/dev/personajes.
2. **Dime si te convencen** el café arreglado y el ritmo. Si lo quieres más tranquilo o más vivo, es
   un número (`BETWEEN_MS` en `src/game/idle.ts`).

### 9. Archivos para tu commit

| Archivo | Cambio |
|---|---|
| `scripts/sprites/idle.mjs` | **Nuevo**: construye las acciones sobre el dibujo del juego |
| `scripts/sprites/cutout.mjs` | La lista `IDLES`, sus comprobaciones y el tono de piel con la rampa del dibujo quieto |
| `src/assets/characters/yeray-glasses.png`, `yeray-coffee.png`, `yeray-think.png`, `null-tilt.png`, `null-tail.png`, `null-scratch.png` | **Nuevas**: las seis acciones |
| `src/assets/characters/characters.gen.ts`, `characters.ts`, `characters.test.ts` | Las imágenes, las poses y su prueba |
| `src/dev/CharactersDemo.tsx` | Las acciones en `/dev/personajes` |
| `src/engine/drawCharacter.ts`, `drawCharacter.test.ts` (nuevo) | Corrección del 20/11: nunca un tiempo negativo |
| `src/engine/useGameLoop.ts` | Corrección del 20/11: un fallo al dibujar ya no para el bucle |
| `src/game/idle.ts`, `idle.test.ts` | **Nuevos**: las reglas del director y su prueba |
| `src/scenes/camp/useIdleDirector.ts` | **Nuevo**: el director |
| `src/scenes/camp/CampCanvas.tsx`, `CampScene.tsx` | Dibujan la acción en marcha, respirando |
| `scripts/camp-check.mjs` | Las comprobaciones de las acciones |
| `CLAUDE.md`, `DESIGN.md`, `BRIEF.md`, `docs/plan-de-fases.md` | Las acciones en reposo |
| `docs/informes/fase-8-mejoras.md` | Este informe |

### Commits recomendados

```bash
# 1. The generator: idle actions laid over the in-game still drawings
git add scripts/sprites/idle.mjs scripts/sprites/cutout.mjs src/assets/characters/yeray-glasses.png src/assets/characters/yeray-coffee.png src/assets/characters/yeray-think.png src/assets/characters/null-tilt.png src/assets/characters/null-tail.png src/assets/characters/null-scratch.png src/assets/characters/characters.gen.ts src/assets/characters/characters.ts src/assets/characters/characters.test.ts src/dev/CharactersDemo.tsx
git commit -m "feat(sprites): build Yeray's and Null's idle actions over their still drawings"

# 2. The fix of 2026-11-20 (before the director, so no commit has the bug)
git add src/engine/drawCharacter.ts src/engine/drawCharacter.test.ts src/engine/useGameLoop.ts
git commit -m "fix(engine): never draw a pose before its start and keep the game loop alive on errors"

# 3. The idle director in the camp
git add src/game/idle.ts src/game/idle.test.ts src/scenes/camp/useIdleDirector.ts src/scenes/camp/CampCanvas.tsx src/scenes/camp/CampScene.tsx scripts/camp-check.mjs
git commit -m "feat(camp): play idle actions every few seconds, in rounds"

# 4. Docs
git add CLAUDE.md DESIGN.md BRIEF.md docs/plan-de-fases.md docs/informes/fase-8-mejoras.md
git commit -m "docs: describe the idle actions and report block K"
```
