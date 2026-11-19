# Informe · Fase 7 — Vista CV, calidad y accesibilidad

**Fecha de cierre:** 15 de noviembre de 2026
**Estado:** ✅ terminada, pendiente de tu revisión y tu commit.

## Resumen en tres líneas
- **Tu CV en una página aparte**, `/cv/` en español y `/cv/en/` en inglés:
  - generada al compilar con el mismo contenido que el juego y sin JavaScript;
  - pesa 39 KB, aparece en 1,2 s, se imprime en 3 hojas y tiene el botón de tu PDF.
- **"VER CV" en todas las pantallas del juego** y dos filas nuevas en COMMS (web y PDF).
  Además: título y descripción, imagen para compartir, icono con la cara de Null, `robots.txt`
  y la red de seguridad de 30 fps.
- **Calidad:** auditoría impeccable de 17/20, con todo lo importante corregido después.
  Lighthouse da 98–100 en todas las páginas: buenas prácticas y SEO pasan de 96/91 a 100/100.
  DESIGN.md queda reorganizado desde lo construido.

---

## 1. Decisiones tomadas

| Decisión | Qué se eligió | Quién |
|---|---|---|
| Cómo se hace la vista CV | **HTML generado al compilar** a partir de `src/content` (`src/site/html.ts` + un plugin de Vite). No hay React ni nada de JavaScript: carga al instante, se imprime bien y Google la lee tal cual | Yo |
| Idiomas | **Dos páginas**: `/cv/` (español) y `/cv/en/` (inglés), enlazadas entre sí y marcadas para que Google muestre la que toca | Yo |
| Diseño de la vista CV | **Sobria con detalles retro**: el nombre dorado con canto duro, los títulos con la letra del juego, viñetas cuadradas doradas y el botón del PDF como una tecla dorada. Para leer, Pixelify Sans en tamaños que respetan el tamaño de letra del navegador | Yo (cambiable) |
| PDF | **Tu PDF tal cual** (`npm run cv` lo copia a `public/cv/`). Lleva tu teléfono y tu foto, como decidiste. En inglés no hay PDF, así que la versión inglesa enlaza el español y lo dice: "Download CV (PDF, in Spanish)" | Brief |
| Enlace "VER CV" | Arriba a la izquierda en el título, la intro y el campamento, y es la primera parada al tabular. **En vertical, el campamento lo pone entre los dos retratos**: arriba lo tapaba el banner, y abajo queda al alcance del pulgar | Yo (cambiable) |
| COMMS | Dos filas nuevas: "CV · Versión web" (pestaña nueva) y "CV en PDF · Descargar" | Yo |
| Dirección de la web | **`SITE_URL`, un único ajuste** que se pone al publicar. Me dijiste que probablemente usarás Cloudflare Pages con un dominio .dev, pero aún no está claro. Sin él, la web funciona igual; solo faltan el sitemap, la dirección canónica y la URL completa de la imagen al compartir | Tú + yo |
| Imagen para compartir | Una captura real de la pantalla de título (1200×630, 15 KB), sin botones, con PRESS START encendido | Yo |
| Icono de pestaña | **La cara de Null tal cual** (50×47 → 50×50 con una fila transparente, sin tocar un píxel). Para iPhone, ampliada ×3 píxel a píxel sobre el cielo nocturno | Yo |
| 30 fps | Si durante un segundo los fotogramas van por debajo de 45 fps de media, el juego pasa a 30 constantes **durante el resto de la visita** | Yo |
| DESIGN.md | **Fusionado** en el formato estándar con la idea central **"La hoguera del campamento"** (*The Campfire*) | Tú |
| Excepción del detector | El relleno dorado por bandas del título es intencionado (lo fijan el brief y DESIGN.md). Queda apuntado como excepción, con su motivo, solo para ese archivo, en `.impeccable/config.json` | Yo |

---

## 2. Qué se ha hecho, paso a paso

### 2.1 La vista CV
- **`src/site/html.ts`:**
  - `renderCv(locale)` monta la página del CV con tu contenido: contacto, perfil, experiencia,
    formación, proyectos y stack.
  - `renderHead(página, idioma, SITE_URL)` monta las etiquetas de `<head>`: título, descripción,
    iconos y lo que se ve al compartir.
  - Todo el texto pasa por `escapeHtml`, así que un `<` o un `&` en el contenido nunca rompe la
    página.
  - Pruebas en `html.test.ts`: están todas las partes, los enlaces y el PDF; no hay teléfono; y
    Bosa Digital solo tiene sus tres frases.
- **`cv/index.html` y `cv/en/index.html`:** plantillas mínimas. El plugin `sitePages` de
  `vite.config.ts` rellena sus huecos al compilar (y en `npm run dev` al pedir la página).
- **`src/cv/cv.css`:**
  - Los colores de la paleta, tamaños en `rem` y párrafos sin una palabra suelta al final.
  - Una versión para imprimir: tinta sobre papel, sin botones y sin cortar un apartado entre dos
    hojas.
- **`npm run cv`** copia tu PDF de `references/` a `public/cv/yeray-caturla-cv-es.pdf`.

### 2.2 Los caminos hasta el CV
- **`src/components/CvLink.*`:**
  - "VER CV" / "VIEW CV", según el idioma.
  - En la esquina va dentro de un `<header>`, para que los lectores de pantalla lo encuentren.
  - Junto a los retratos, en vertical, va como `inline`.
- **`src/App.tsx`** lo pone el primero de la página (primera parada del tabulador). En el
  campamento en vertical no lo pone, porque lo pinta el HUD (`Hud` tiene ahora un hueco
  `middle`).
- **COMMS:** el CV web abre en pestaña nueva y el PDF se descarga directamente (`download`).

### 2.3 Lo que ven buscadores y apps al compartir
- `index.html` ya no lleva textos escritos a mano: título, descripción, iconos y etiquetas para
  compartir salen de `src/content`. El título de la pestaña cambia con el idioma.
- **`npm run share`** (`scripts/share-assets.mjs`) genera `public/og-image.png`,
  `public/favicon.png` y `public/apple-touch-icon.png`.
- **`robots.txt`** se genera siempre. Con `SITE_URL` también salen el `sitemap.xml`, la URL
  canónica, la imagen con su dirección completa y los enlaces entre idiomas. Lo he probado con
  una dirección de ejemplo.
- **Precarga de fuentes:** el navegador pide la letra del título desde el primer momento. El
  salto de diseño del título (CLS) baja de 0,025 a 0.

### 2.4 La red de seguridad de 30 fps
- **`src/engine/frameRate.ts`** es lógica pura con pruebas:
  - Mide el ritmo de fotogramas, ignorando las pausas (pestaña oculta).
  - Si va lento, el bucle de juego solo trabaja una de cada dos veces.
  - Las animaciones van por reloj, así que mantienen su velocidad.
- **`useGameLoop.ts`** la usa y marca `<html data-fps="30">` cuando ocurre. En las mediciones no
  salta: vamos a 60 fps incluso con la CPU ×4.

### 2.5 Auditoría y repaso (skill impeccable)
Ver la sección 3.2. Correcciones del repaso:
- **Zonas táctiles:**
  - En pantallas táctiles, la X de cerrar ventana (63×18 px), ES/EN, SKIP INTRO y VER CV
    reciben **44 px de alto** para el dedo, sin cambiar su aspecto.
- **Lectores de pantalla:**
  - VER CV queda dentro de un punto de referencia (`<header>`).
  - Cada ventana ya no se anuncia dos veces: como diálogo y además como región con el mismo
    nombre.
- **Texto:** `text-wrap: pretty` en párrafos, filas y listas de las ventanas y de la vista CV.
  Ya no queda "AWS" o "Git." solo en la última línea.
- **Vista CV:** tamaños en `rem`, que respetan el tamaño de letra que cada uno tenga en su
  navegador.
- **DESIGN.md:**
  - Fusionado en el formato estándar: fichas de colores y letras arriba, y 8 apartados fijos.
  - No se ha perdido nada de lo que decía: escena, anillo, intro, personajes, medios y tiempos
    de animación.
  - Aparecen la idea central y unas reglas con nombre, por ejemplo **"La regla de la única luz
    cálida"**: el oro es el único color cálido de la interfaz.
- **`.impeccable/design.json`:** fichero complementario con tiempos de animación, sombras y
  componentes de muestra.

### 2.6 Comprobaciones
- **`scripts/cv-check.mjs`** (`npm run check:cv`, nuevo).
- **`check:title`:** ahora la primera parada del tabulador es VER CV.
- **`check:windows`:** COMMS tiene ahora los dos enlaces del CV.

---

## 3. Cómo se ha comprobado

| Comprobación | Resultado |
|---|---|
| `npm run typecheck` | ✅ sin errores |
| `npm run lint` | ✅ sin avisos |
| `npm test` | ✅ 14 archivos, **180 pruebas** (+22: HTML del CV y de `<head>`, red de 30 fps, contenido) |
| `npm run check:cv` | ✅ todas (nuevo) |
| `check:title`, `check:intro`, `check:camp`, `check:windows` | ✅ todas |
| Detector de impeccable | ✅ sin hallazgos (aparte de la excepción documentada del título dorado) |

`check:cv` comprueba:
- **Las vistas CV a 390, 768 y 1440:**
  - capturas de página completa en `.screenshots/fase-7/`;
  - sin errores, sin desbordamiento lateral y **sin JavaScript propio**.
- **La estructura:**
  - un `h1` y seis apartados;
  - sin teléfono;
  - Bosa Digital con sus tres frases.
- **El PDF:** se sirve como PDF y el botón lo descarga.
- **Los enlaces:** "English version" lleva a `/cv/en/` (en inglés y avisando de que el PDF está
  en español), y "Back to the portfolio" vuelve al juego.
- **Imprimir:**
  - PDF A4 generado por el navegador en `.screenshots/fase-7/cv-impreso-es.pdf`;
  - 3 hojas, sin botones.
- **VER CV en el título, la intro y el campamento a los tres tamaños:**
  - se ve y no tapa ningún control, el banner, el anillo ni los retratos;
  - abre el CV en el idioma correcto.
- **COMMS:** "Versión web" en pestaña nueva y "Descargar" con `download`.
- **Las etiquetas:** título, descripción y etiquetas para compartir en la página del juego, y los
  tres iconos e imágenes se sirven.

**Lector de pantalla:**
- He revisado el árbol de accesibilidad de cada pantalla (título, campamento, las cuatro ventanas
  y la vista CV): nombres, roles, encabezados y puntos de referencia.
- No he podido probarlo con un lector real. Si quieres hacerlo tú: NVDA en Windows es gratis.

### 3.1 Rendimiento (build de producción)

| Métrica | Objetivo | Resultado |
|---|---|---|
| JavaScript inicial (gzip) | ≤ 100 KB | ✅ **87,8 KB** (+1 KB: VER CV y la red de 30 fps) |
| Primera carga, título / campamento | ≤ 300 KB | ✅ **225 KB** / **226 KB** |
| Vista CV | "ultraligera" | ✅ **39 KB** en total, 0 KB de JavaScript |
| LCP móvil | ≤ 2,5 s | ✅ título **1,6 s**, campamento 2,0 s, `/#equip` 2,2 s, vista CV **1,2 s** |
| CLS | < 0,1 | ✅ **0** en todas (el título bajaba a 0,025: arreglado con la precarga de la fuente) |
| Respuesta a teclas y clics | < 200 ms | ✅ **32 ms** como máximo, también con CPU ×4 |
| Fotogramas | 60 / ≥ 30 con CPU ×4 | ✅ anillo **60 y 60**; intro **60 y 59,8** |
| PDF del CV | — | 3,1 MB: solo se descarga al pulsar (ver sección 6) |

**Lighthouse móvil** (informes completos en `.screenshots/fase-7/lighthouse/*.report.html`;
ábrelos con el navegador):

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|
| Título (`/`) | 99 | 100 | **100** (antes 96) | **100** (antes 91) |
| Campamento (`/#camp`) | 99 | 100 | 100 | 100 |
| EQUIP (`/#equip`) | 98 | 100 | 100 | 100 |
| Vista CV (`/cv/`) | **100** | 100 | 100 | 100 |
| Vista CV inglés (`/cv/en/`) | **100** | 100 | 100 | 100 |

### 3.2 Auditoría técnica (impeccable `audit`)

| # | Dimensión | Nota | Hallazgo principal |
|---|---|---|---|
| 1 | Accesibilidad | 3/4 | En el móvil, la X de cerrar ventana medía 63×18 px: por debajo de lo cómodo para un dedo |
| 2 | Rendimiento | 4/4 | — (solo detalles: la intro repinta el fondo en cada fotograma; el PDF pesa 3,1 MB) |
| 3 | Temas y colores | 4/4 | Ni un color fuera de la paleta; contraste probado; versión para imprimir |
| 4 | Adaptación a pantallas | 3/4 | Zonas táctiles de 24 px en las etiquetas de juego; los tamaños en px ignoraban el tamaño de letra del navegador en la vista CV |
| 5 | Coherencia de la implementación | 3/4 | El detector solo marcó el dorado por bandas del título (intencionado), sombras duras (el estilo de píxel) y palabras sueltas al final de líneas en la vista CV |
| **Total** | | **17/20** | **Bueno** |

**Veredicto de coherencia: aprobado.** Es un sistema propio y coherente: paleta única con prueba
de deriva, `--u` en todas las medidas, nada de bordes redondeados ni desenfoques, y personajes y
fondos tuyos tal cual.

**Hallazgos y qué se hizo:**

| Prioridad | Hallazgo | Corrección |
|---|---|---|
| P2 | X de cerrar ventana de 63×18 px en el móvil; ES/EN, SKIP INTRO y VER CV de 24 px | Zona táctil de 44 px en pantallas táctiles, con el mismo aspecto |
| P2 | En la tablet vertical, VER CV pisaba la esquina del banner | Pasa a la fila de los retratos en vertical |
| P3 | VER CV fuera de cualquier punto de referencia | Dentro de un `<header>` |
| P3 | Cada ventana se anunciaba como diálogo y además como región con el mismo nombre | Ahora solo como diálogo |
| P3 | Palabras sueltas al final de párrafos y filas | `text-wrap: pretty` |
| P3 | La vista CV ignoraba el tamaño de letra del navegador | Tamaños en `rem` |
| P3 | "Reducir movimiento" anula todas las animaciones CSS de golpe | Se deja así: los cambios de estado se mantienen (las ventanas aparecen ya abiertas) |

**Lo que funciona bien:**
- La paleta y el contraste están protegidos por pruebas.
- El anillo y las ventanas siguen patrones ARIA correctos (menú, diálogo, pestañas).
- Se puede usar todo con teclado y con táctil.
- Las ventanas se cargan aparte y ninguna página tiene saltos de diseño.
- "Reducir movimiento" se respeta en todo.

---

## 4. TypeScript: repaso de lo aprendido

Esta fase no trae conceptos nuevos (salvo `Map<clave, valor>`). Aquí tienes dónde ver cada uno
de los que has ido aprendiendo:

| Concepto | Dónde verlo | En una línea |
|---|---|---|
| **`type` y props con tipo** | `CvLinkProps` en `src/components/CvLink.tsx` | Qué recibe un componente y de qué tipo; `inline?` es opcional |
| **Uniones de textos** | `type Locale = 'es' \| 'en'` en `src/content/types.ts` | Solo valen esos valores |
| **Uniones discriminadas** | `Screen` (`screens.ts`), `ScriptStep` (`script.ts`), `ProjectMedia` (`types.ts`) | El campo `name`/`type`/`kind` dice qué otros campos existen |
| **`Record<K, V>`** | `DICTIONARIES: Record<Locale, Content>` en `locale.ts`; `OG_LOCALE` en `src/site/html.ts` | Un objeto con una entrada por cada clave posible |
| **`satisfies`** | `UI_PALETTE` en `palette.ts`, `YERAY` en `characters.ts` | Comprueba la forma sin perder los nombres exactos |
| **`as const`** | `PATHS` en `src/site/paths.ts` | Valores de solo lectura y exactos: `PATHS.cv.en` es `'/cv/en/'`, no un texto cualquiera |
| **`keyof typeof`** | `CharacterImageName` en `characters.ts` | La unión de los nombres de las claves de un objeto |
| **Genéricos de React** | `useState<CampBackground \| null>`, `useRef<HTMLCanvasElement>` | Le dices a React qué guarda |
| **`Map<clave, valor>`** (nuevo) | `PAGES` en `vite.config.ts` | Como un `Record`, pero `get()` acepta cualquier texto y devuelve `PageTarget \| undefined`, sin forzar tipos con `as` |
| **Tipos de función** | `FrameCallback` en `useGameLoop.ts`, `PixelFn` en `textures.ts` | Una función como valor, con sus parámetros tipados |
| **Eventos del navegador** | `KeyboardEvent` en `anyKey.ts`, `MouseEvent<HTMLElement>` en `TitleScreen.tsx` | El evento trae sus campos con tipo |
| **`unknown` + comprobaciones** | `src/content/texts.ts` | Solo se usa después de comprobar qué es |
| **`instanceof` para estrechar** | `isOnControl` en `src/engine/anyKey.ts` | Tras comprobarlo, TypeScript deja usar `closest()` |
| **`??` y `??=`** | `step.flip ?? false` (`script.ts`), `start.current ??= now` | "Si no hay valor, usa este" |
| **`import type`** | `src/game/script.ts` | Trae solo el tipo, no el código |
| **Copiar con `...`** | `{ ...screen, half: 'in' }` en `screens.ts` | Copia todos los campos y cambia uno |

---

## 5. Problemas encontrados y cómo se resolvieron

| Problema | Solución |
|---|---|
| **La página del juego salió en blanco** al generar la imagen para compartir. El servidor de desarrollo se reinició justo cuando yo editaba `package.json`, lo leyó a medio escribir y se quedó con el error guardado | Toqué `vite.config.ts` para que se reiniciara él solo. Ninguna línea de código cambió por esto |
| **Lighthouse dejaba carpetas `C:\…\lighthouse.XXXX`** (lo que viste antes de esta fase) | Esta vez lo lancé desde mi carpeta temporal y las borré al terminar: el proyecto sigue limpio |
| **VER CV pisaba la esquina del banner** a 768 en vertical. Mi comprobación miraba el texto del banner, no su marco | Pasa a la fila de los retratos en vertical, y la comprobación ahora mide el banner entero y los retratos |
| `check:cv` contaba como JavaScript los scripts del servidor de desarrollo de Vite | Se ignoran: en el build no existen |
| El plugin necesitaba forzar un tipo con `as` para buscar la página | Se usa un `Map`, sin `as` (sección 4) |

---

## 6. Observaciones y TODOs finales

**TODOs que dependen de ti:**

| TODO | Dónde | Qué pasa mientras |
|---|---|---|
| **BUFFS** (entrenamiento): rutina de 6 días, sesiones por semana, constancia real | `CONTENT.md` | Oculto en la web publicada |
| **CRAFT** (cocina): receta de paella valenciana y de aceitunas curadas | `CONTENT.md` | Oculto en la web publicada |
| **CV en PDF en inglés** | `references/` | La vista CV en inglés enlaza el PDF español y lo dice |
| **`SITE_URL`** (la dirección final) | Fase 8 | Sin sitemap, sin dirección canónica y sin URL completa en la imagen al compartir |
| **Revisar el inglés** en `/dev/textos` (desde la fase 4), ahora también los textos del CV | — | — |
| La frase "moneda ficticia" de Capyroad, la nota de Bosa Digital y el tramo del vídeo (fase 4) | — | — |

**Observaciones:**
- **Tu PDF pesa 3,1 MB por la foto**: una imagen de 2162 px de ancho; el texto es real, de
  LaTeX. Solo se descarga al pulsar el botón, pero en el móvil con datos tarda. Exportándolo con
  la foto más pequeña bajaría a unos 200–300 KB. No lo he tocado: el brief dice "tal cual".
- **El PDF va en el repositorio**, en `public/cv/`, porque el sitio publicado lo necesita y
  `references/` no se sube. Incluye tu teléfono y tu foto, como decidiste. Cualquiera que vea el
  repositorio en GitHub podrá descargarlo, igual que desde la web.
- **La intro repinta el fondo entero en cada fotograma.** Va a 60 fps con la CPU ×4, así que no
  hace falta más. Si algún móvil muy lento sufriera, salta la red de 30 fps.
- Hay disponible una versión nueva de la skill impeccable (v4.9.1; tienes la 4.8.0). Se
  actualiza con `npx impeccable update` cuando quieras.

---

## 7. Lo que necesito de ti
1. **Mira la vista CV:**
   - http://localhost:5173/cv/ y `/cv/en/`;
   - imprímela (Ctrl+P) o mira `.screenshots/fase-7/cv-impreso-es.pdf`.
2. **Mira dónde está VER CV:**
   - arriba a la izquierda en el ordenador;
   - entre los retratos en el móvil vertical.
   - Dime si lo quieres en otro sitio o con otro texto.
3. **Dime si te convencen:**
   - la imagen para compartir (`public/og-image.png`);
   - el icono de Null (`public/favicon.png`).
4. **Cuando sepas la dirección final**, dímela para fijar `SITE_URL` en la fase 8.

---

## 8. Archivos para tu commit

| Archivo | Qué es |
|---|---|
| `cv/index.html`, `cv/en/index.html` | **Nuevos**: las plantillas de la vista CV |
| `src/site/html.ts`, `html.test.ts`, `paths.ts` | **Nuevos**: el HTML del CV y de `<head>`, con pruebas, y las rutas del sitio |
| `src/cv/cv.css` | **Nuevo**: estilos de la vista CV (pantalla e impresión) |
| `vite.config.ts`, `index.html` | Plugins `sitePages` y `preloadFonts`, tres páginas; `index.html` sin textos a mano |
| `src/content/types.ts`, `es.ts`, `en.ts`, `content.test.ts`, `LocaleProvider.tsx` | Textos de la página, del CV y de compartir; filas del CV en COMMS; título de pestaña según idioma |
| `src/components/CvLink.tsx`, `CvLink.module.css` | **Nuevos**: VER CV |
| `src/components/Hud.tsx`, `Hud.module.css`, `src/scenes/camp/CampScene.tsx`, `src/App.tsx` | VER CV en la esquina o entre los retratos |
| `src/windows/CommsWindow.tsx` | El CV web en pestaña nueva y el PDF con descarga |
| `src/engine/frameRate.ts`, `frameRate.test.ts`, `src/engine/useGameLoop.ts` | **Nuevo**: red de seguridad de 30 fps |
| `src/components/SectionDialog.module.css`, `SkipIntro.module.css`, `Window.tsx`, `src/scenes/title/TitleScreen.module.css`, `src/windows/sheet.module.css` | Repaso: zonas táctiles, ventanas sin doble anuncio, texto sin palabras sueltas |
| `src/styles/contrast.ts` | Parejas de contraste de la vista CV y de la impresión |
| `public/` (todo) | **Nuevos**: `cv/yeray-caturla-cv-es.pdf`, `og-image.png`, `favicon.png`, `apple-touch-icon.png` |
| `scripts/cv-pdf.mjs`, `scripts/share-assets.mjs`, `scripts/cv-check.mjs`, `package.json` | **Nuevos** `npm run cv`, `npm run share`, `npm run check:cv` |
| `scripts/title-check.mjs`, `scripts/windows-check.mjs` | VER CV en el orden del tabulador; filas del CV en COMMS |
| `.impeccable/config.json`, `.impeccable/design.json` | **Nuevos**: la excepción del título dorado y el fichero complementario de DESIGN.md |
| `DESIGN.md`, `CONTENT.md`, `BRIEF.md`, `CLAUDE.md`, `docs/plan-de-fases.md` | DESIGN.md reorganizado; textos del CV; comandos y reglas nuevas |
| `docs/informes/fase-7-cv-calidad.md` | Este informe |

### Commits recomendados
```bash
# 1. The CV view: static pages made from the content at build time
git add cv/ src/site/ src/cv/ vite.config.ts index.html src/content/ scripts/cv-pdf.mjs public/cv/
git commit -m "feat(cv): add static CV pages in Spanish and English generated from the content"

# 2. The way to the CV from the game
git add src/components/CvLink.tsx src/components/CvLink.module.css src/components/Hud.tsx src/components/Hud.module.css src/scenes/camp/CampScene.tsx src/App.tsx src/windows/CommsWindow.tsx
git commit -m "feat(ui): add an always-visible CV link and CV rows in COMMS"

# 3. Share preview and icons
git add scripts/share-assets.mjs public/og-image.png public/favicon.png public/apple-touch-icon.png
git commit -m "feat(seo): add share image, favicon and touch icon"

# 4. 30 fps safety net
git add src/engine/frameRate.ts src/engine/frameRate.test.ts src/engine/useGameLoop.ts
git commit -m "feat(engine): drop to a steady 30 fps when a device can't hold 60"

# 5. Audit fixes
git add src/components/SectionDialog.module.css src/components/SkipIntro.module.css src/components/Window.tsx src/scenes/title/TitleScreen.module.css src/windows/sheet.module.css src/styles/contrast.ts .impeccable/config.json
git commit -m "fix(a11y): enlarge touch targets, drop duplicate window landmark, avoid orphan words"

# 6. Checks
git add scripts/cv-check.mjs scripts/title-check.mjs scripts/windows-check.mjs package.json
git commit -m "test: add CV view walkthrough and update title and windows checks"

# 7. Docs
git add DESIGN.md .impeccable/design.json CONTENT.md BRIEF.md CLAUDE.md docs/
git commit -m "docs: regenerate DESIGN.md from the built world and add phase 7 report"
```

Al terminar, `git status` debería decir `nothing to commit, working tree clean`.

---

## 9. Siguiente fase
**Fase 8 — Publicación**, cuando la apruebes:
- Yo preparo la publicación automática (Cloudflare Pages, si lo confirmas), el README para
  reclutadores y la guía paso a paso.
- Tú creas el repositorio, haces push, conectas Cloudflare Pages y tu dominio.
- Fijamos `SITE_URL` y se generan el sitemap y las direcciones completas.
