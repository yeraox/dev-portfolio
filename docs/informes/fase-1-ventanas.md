# Informe · Fase 1 — El aspecto de las ventanas

**Fecha de cierre:** 9 de noviembre de 2026
**Estado:** ✅ terminada, pendiente de tu revisión y tu commit.
**Dónde verla:** `npm run dev` → http://localhost:5173/dev/windows

## Resumen en tres líneas
- Existe el sistema de ventanas completo: ventana de piedra, banner con cuerda dorada, barras de stats, separadores, línea de ayuda y pistas de teclas.
- Las texturas (piedra, tramado azul y cuerda) se generan por código a partir de la paleta. No hay imágenes que descargar y una prueba garantiza que el texto siempre se lee.
- La ventana STATS está montada con tus datos reales (perfil, formación y registro de misiones) y se adapta a móvil, tablet y escritorio.

---

## 1. Decisiones tomadas en esta fase

| Decisión | Resultado | Quién |
|---|---|---|
| Cómo se hacen las texturas | Generadas por código como SVG diminutos a partir de `palette.ts`, sin archivos de imagen | Yo |
| Grano de la piedra | Granito fino (manchas de 2 px). La primera versión, con manchas de 4 px, parecía camuflaje y distraía detrás del texto | Yo, tras revisar las capturas |
| Proporción de la piedra | Mayoritariamente oscura con motas claras, para que el texto pequeño no "baile" | Yo, tras revisar las capturas |
| Cuerda del banner | 6 píxeles de grosor, con nudos en las esquinas y trenzado en diagonal en cuatro dorados | Yo |
| Unidad de píxel de interfaz (`--u`) | 2 px por defecto, 3 px a partir de 960×540 y 4 px a partir de 1280×720. En la fase 3 la calculará JavaScript con la escala real de la escena | Yo |
| Tamaños de texto | 20 px en escritorio y 16 px en móvil; títulos de 30 y 20 px | Yo (según `DESIGN.md`) |
| Ventana STATS en escritorio | Dos columnas: a la izquierda retrato, identidad, especialidad, idiomas y bio; a la derecha formación y registro de misiones | Yo |
| Identidad junto al retrato | "Desarrollador Backend Junior" y "Elda (Alicante), España" al lado del retrato, en vez de filas estrechas que se partían | Yo, tras revisar las capturas |
| Duración de la apertura | **18 fotogramas (0,3 s) en 9 pasos.** La primera versión (7 fotogramas, 0,12 s) era tan rápida que casi no se notaba | Tú |
| StatBar en STATS | **No se usa en STATS**, porque tu perfil no tiene números reales que medir. Queda lista para BUFFS cuando tengas datos de entrenamiento | Yo (regla de no inventar datos) |

---

## 2. Qué se ha hecho, paso a paso

### 2.1 Fuentes y medidas (`src/styles/`)
- **`fonts.css`** carga Jersey 10 y Pixelify Sans (normal y negrita) desde el propio proyecto,
  solo con el subconjunto latino, que cubre el español y el catalán (á, ñ, ¿, l·l…).
- **`tokens.css`** añade:
  - `--u`, el tamaño de un "píxel de arte" en marcos y relieves, que crece con la pantalla.
  - `--font-display` (Jersey 10) y `--font-text` (Pixelify Sans).
  - Tamaños de texto que cambian a partir de 768 px.
  - `--frame`, la duración de un fotograma a 60 fps, base de todas las animaciones.

### 2.2 Texturas generadas por código (`src/assets/textures.ts`)
- **`makeTexture`** recibe un tamaño y una función que dice de qué color es cada píxel, y
  devuelve un SVG listo para CSS. Une los píxeles seguidos del mismo color en un solo rectángulo
  para que el archivo sea pequeño.
- **Piedra (32×32):** "ruido" con semilla fija, así que siempre sale igual. Mezcla los dos grises
  oscuros con algún punto de tinta y encaja sin costuras al repetirse.
- **Tramado azul (2×2):** tablero de ajedrez con los dos azules del banner.
- **Cuerda dorada (18×18):** una imagen de 9 trozos (3×3). CSS usa las 4 esquinas tal cual y
  repite los lados a lo largo del borde (`border-image`), así que el marco vale para cualquier
  tamaño.
- **`textures.test.ts`** comprueba que la piedra solo usa colores sobre los que el texto cumple
  el contraste AA, que el tramado usa los dos azules y que la cuerda solo usa dorados y tinta.

### 2.3 Componentes (`src/components/`)
| Componente | Qué hace |
|---|---|
| `Window` | Panel de piedra con relieve, contorno de tinta y una ranura grabada por dentro. Tiene título opcional en dorado, un hueco arriba a la derecha para pistas y otro abajo para ayuda. Se abre con un efecto persiana de 18 fotogramas (0,3 s) en 9 pasos |
| `BannerWindow` | La barra superior: azul tramado dentro de la cuerda dorada, con el nombre de la sección |
| `StatBar` | Etiqueta, número y barra roja dentro de un carril de tinta. Para lectores de pantalla es un "medidor" (`role="meter"`) |
| `Divider` | Línea grabada: tinta encima y piedra clara debajo |
| `HelpBar` | La línea de ayuda del pie de la ventana |
| `KeyHint` | Las pistas de teclas, con teclas reales (`<kbd>`): **ENTER** SELECT · **ESC** EXIT |

### 2.4 La ventana STATS (`/dev/windows`)
- **Cabecera:** "Yeray Caturla" en dorado y la pista **ESC** EXIT.
- **Columna izquierda:**
  - El hueco del retrato (48×48), que se rellena en la fase 2.
  - Tu clase y tu base.
  - Las filas de especialidad e idiomas.
  - Una línea grabada y tu bio.
- **Columna derecha:**
  - **Formación:** los 3 títulos con centro y fechas. La especialización en Cloud aparece
    marcada "En curso" en verde.
  - **Registro de misiones:** Bosa Digital, solo con las tres frases del CV, y VKOficinas, con
    viñetas de píxel dorado.
- **Pie:** "Esc para volver al campamento".
- **Botón "Repetir la animación de apertura"**, para que veas el efecto persiana.
- **Debajo, cada pieza por separado.** Las barras rojas usan valores de ejemplo, rotulados como
  tales.
- **De dónde salen los datos:** de momento son una copia de `CONTENT.md` dentro de la página de
  desarrollo. En la fase 4 pasan a `src/content/es.ts` y `en.ts`, y esta maqueta se convierte en
  la ventana STATS real.

### 2.5 Otros cambios
- **`src/Root.tsx`:** las páginas de desarrollo están ahora en una tabla (`/dev/specimen` y
  `/dev/windows`), así que añadir más es una línea.
- **`src/styles/contrast.ts`:** dos pares nuevos que se usan en la interfaz, el verde "En curso"
  sobre piedra y las teclas doradas sobre tinta. Los dos pasan.
- **`DESIGN.md`:** la sección 5 recoge las medidas reales de cada componente.

---

## 3. Cómo se ha comprobado

| Comprobación | Resultado |
|---|---|
| `npm run typecheck` | ✅ sin errores |
| `npm run lint` | ✅ sin avisos |
| `npm test` | ✅ 23 de 23 pruebas: paleta, contraste (13 pares) y texturas |
| Detector de impeccable sobre componentes, estilos y la página | ✅ sin hallazgos |
| `npm run build` | ✅ JS de 68,8 KB comprimido; fuentes `.woff2` de unos 29 KB en total; las páginas de desarrollo no entran |
| Capturas a 390 / 768 / 1440 | ✅ sin desplazamiento horizontal y sin errores de consola |
| Revisión visual | Hecha en tres rondas. Correcciones: grano de la piedra, proporción de tonos y filas del perfil |

**Capturas:** `.screenshots/windows-390.png`, `windows-768.png` y `windows-1440.png` (solo en tu
ordenador).

**Pendiente de que lo veas tú:** la animación de apertura. Las capturas son imágenes fijas;
pulsa "Repetir la animación de apertura" en la página.

---

## 4. TypeScript en esta fase

| Concepto | Explicación en una línea | Dónde verlo |
|---|---|---|
| Tipo función | `PixelFn = (x: number, y: number) => UiColor \| null` describe "una función que recibe x e y y devuelve un color o nada" | `src/assets/textures.ts` |
| Props opcionales | `title?: string`: el padre puede no pasarlo y dentro vale `string \| undefined` | `src/components/Window.tsx` |
| `ReactNode` e `import type` | `ReactNode` es "cualquier cosa que React sabe pintar"; `import type` importa solo el tipo, que desaparece al compilar | `Window.tsx`, `HelpBar.tsx` |
| Tipo array | `KeyHintItem[]` es una lista de objetos `KeyHintItem` | `src/components/KeyHint.tsx` |
| `export type` | Compartir un tipo entre archivos, como `KeyHintItem` y `Texture` | `KeyHint.tsx`, `textures.ts` |
| Genéricos en colecciones | `new Set<UiColor>()` es un conjunto que solo admite nombres de la paleta | `textures.ts` |
| Tuplas | `[string, string][]` es una lista de pares (etiqueta, valor) | `PROFILE_ROWS` en `src/dev/WindowsDemo.tsx` |
| `??` | "Usa esto, y si es `null` o `undefined`, esto otro": `valueText ?? value` | `src/components/StatBar.tsx` |
| Tipos de React para carga diferida | `Record<string, LazyExoticComponent<ComponentType>>`, una tabla de páginas que se cargan solo cuando se visitan | `src/Root.tsx` |

---

## 5. Problemas encontrados y cómo se resolvieron

| Problema | Solución |
|---|---|
| La piedra parecía camuflaje y distraía detrás del texto | Grano de 2 px en vez de 4 y menos puntos de tinta |
| La piedra seguía "bailando" detrás del texto pequeño | Más proporción de tono oscuro, con motas claras |
| En escritorio, las filas del perfil se partían en varias líneas al lado del retrato | Clase y base junto al retrato, y el resto de filas a ancho completo |
| La animación de apertura (7 fotogramas) casi no se notaba | 18 fotogramas en 9 pasos de 2 |
| En móvil, las dos columnas apiladas no tenían separación | Línea grabada entre columnas cuando están apiladas |

---

## 6. Observaciones para las próximas fases
- **Tamaño del retrato en el HUD (fase 3):** un retrato de 48×48 dentro de la escena ampliada a
  ×4 mediría 192 px, demasiado para el HUD. Propondré una variante más pequeña (32×32 o la misma
  a menos escala) cuando dibuje los retratos en la fase 2. Dentro de las ventanas se queda en
  ×3 como máximo (144 px).
- **Texto pequeño en móvil (14 px):** las líneas secundarias, como centro, fechas y empresa, se
  leen, pero están al límite. En la fase 7 (auditoría) decidiremos si suben a 16 px.
- **`--u` provisional:** de momento depende del tamaño de pantalla con reglas CSS. En la fase 3
  pasará a calcularse con la escala real de la escena, para que marcos y escena encajen píxel a
  píxel.
- **Menú circular y foco de teclado:** los corchetes azules de selección están especificados
  pero se construyen en la fase 3, junto con el menú.

---

## 7. Archivos para tu commit

| Archivo | Cambio |
|---|---|
| `src/styles/fonts.css` | **Nuevo**: carga de fuentes |
| `src/styles/tokens.css` | Medidas, fuentes y fotograma |
| `src/styles/contrast.ts` | Dos pares de contraste nuevos |
| `src/main.tsx` | Importa las fuentes |
| `src/dev/Specimen.tsx` | Ya no importa las fuentes por su cuenta |
| `src/assets/textures.ts`, `src/assets/textures.test.ts` | **Nuevos**: texturas y sus pruebas |
| `src/assets/.gitkeep` | **Borrado**: la carpeta ya tiene archivos |
| `src/components/Window.tsx` y `.module.css` | **Nuevos** |
| `src/components/BannerWindow.tsx` y `.module.css` | **Nuevos** |
| `src/components/StatBar.tsx` y `.module.css` | **Nuevos** |
| `src/components/Divider.tsx` y `.module.css` | **Nuevos** |
| `src/components/HelpBar.tsx` y `.module.css` | **Nuevos** |
| `src/components/KeyHint.tsx` y `.module.css` | **Nuevos** |
| `src/components/.gitkeep` | **Borrado** |
| `src/dev/WindowsDemo.tsx` y `.module.css` | **Nuevos**: página `/dev/windows` |
| `src/Root.tsx` | Tabla de páginas de desarrollo |
| `DESIGN.md` | Sección 5 con las medidas reales |
| `docs/informes/fase-1-ventanas.md` | **Nuevo**: este informe |

### Commits recomendados
Conventional Commits, en inglés. `git add` sobre una carpeta también registra los archivos
borrados dentro de ella, como los `.gitkeep`.

```bash
# 1. Fonts and measure tokens
git add src/styles/fonts.css src/styles/tokens.css src/main.tsx src/dev/Specimen.tsx
git commit -m "feat(styles): add self-hosted pixel fonts and measure, type and frame tokens"

# 2. Palette-generated textures
git add src/assets/
git commit -m "feat(assets): generate stone, dither and rope textures from the palette"

# 3. Window system components
git add src/components/ src/styles/contrast.ts
git commit -m "feat(ui): add window system components with stone panel and rope banner"

# 4. Dev page with the static STATS window
git add src/dev/WindowsDemo.tsx src/dev/WindowsDemo.module.css src/Root.tsx
git commit -m "feat(dev): add windows demo page with static STATS window"

# 5. Docs
git add DESIGN.md docs/informes/fase-1-ventanas.md
git commit -m "docs: document window system specs and add phase 1 report"
```

Al terminar, `git status` debería decir `nothing to commit, working tree clean`.

---

## 8. Siguiente fase
**Fase 2 — Personajes: tú y Null.** Construiré el motor de sprites (rejillas de letras sobre la
paleta, con espejo horizontal y animaciones como datos). Con él dibujaré tu avatar (32×40: de pie,
brazos cruzados, caminando de frente y de lado), a Null (24×20: trote, sentado jadeando y
pidiendo), los dos retratos y los 6 iconos del menú. Lo verás en `/dev/sprites`, junto a tus
fotos y las hojas de concepto, y haremos rondas de ajustes hasta que te reconozcas.
