# Informe · Fase 0 — Cimientos

**Fecha de cierre:** 9 de noviembre de 2026
**Estado:** ✅ terminada, pendiente de tu revisión y tu commit.

## Resumen en tres líneas
- El proyecto ya existe: Vite + React + TypeScript estricto, con linter, pruebas y capturas automáticas.
- Todas las decisiones de diseño de base están por escrito (`PRODUCT.md`, `DESIGN.md`, `CLAUDE.md`) y probadas en una página de muestra.
- Decidiste la resolución (320×180), la fuente del título (Jersey 10) y la del texto (Pixelify Sans).

---

## 1. Decisiones tomadas en esta fase

| Decisión | Resultado | Quién |
|---|---|---|
| Resolución interna | **320×180**, ampliada por números enteros | Tú |
| Fuente del título y de las etiquetas del juego | **Jersey 10** | Tú |
| Fuente del texto de las ventanas | **Pixelify Sans** | Tú |
| Git | **Lo gestionas tú.** Yo no ejecuto comandos git | Tú |
| Informe al final de cada fase | Un documento como este en `docs/informes/` | Tú |
| Linter | **oxlint** en vez de ESLint, porque es el que trae ahora la plantilla oficial de Vite y es mucho más rápido | Yo (avisado) |
| Paleta | Un único archivo fuente (`palette.ts`), con pruebas que impiden que se desincronice | Yo |
| Paletas de personajes | Una por personaje, de 15 colores como máximo, como en la SNES | Yo |
| `DESIGN.md` | Se escribe ahora como especificación v0 y se regenera en la fase 7 a partir de lo construido | Yo (avisado) |

---

## 2. Qué se ha hecho, paso a paso

### 2.1 Crear el proyecto
- Se generó la plantilla oficial `react-ts` de Vite en una carpeta temporal y se copió solo la
  configuración. Así no se pisó nada de lo que ya había (brief, contenido, fotos…).
- **Versiones:** Vite 8, React 19 y TypeScript 7.
- **Modo estricto** activado de forma explícita en TypeScript. Así TypeScript avisa de más
  errores posibles, por ejemplo usar algo que podría estar vacío.
- **Scripts de `package.json`:**

  | Comando | Para qué sirve |
  |---|---|
  | `npm run dev` | Arranca el servidor de desarrollo |
  | `npm run typecheck` | Comprueba los tipos |
  | `npm run lint` | Busca código sospechoso |
  | `npm test` | Ejecuta las pruebas |
  | `npm run build` | Genera la versión publicable |
  | `npm run shots` | Saca las capturas de revisión |

### 2.2 Herramientas de calidad
- **oxlint**, para detectar código sospechoso. Lo he configurado para que ignore las carpetas de
  skills (`.agents/`, `.claude/`), que no son código tuyo.
- **Vitest**, para las pruebas automáticas.
- **Playwright con Chromium sin interfaz**, para las capturas. El script
  `scripts/screenshot.mjs` hace capturas a 390, 768 y 1440 px y comprueba dos cosas en cada
  tamaño: que no haya desplazamiento horizontal y que no haya errores en la consola.
- **ffmpeg**, instalado para la fase 4 (el vídeo de Capyroad).

### 2.3 Estructura de carpetas
```
src/
  scenes/      (vacía) Título, Intro, Campamento → fases 3, 5 y 6
  components/  (vacía) Window, RingMenu… → fases 1 y 3
  engine/      (vacía) bucle, sprites, entrada → fases 2 y 3
  assets/      (vacía) sprites como rejillas → fase 2
  content/     (vacía) textos ES/EN → fase 4
  styles/      paleta, tokens, contraste y estilos globales
  dev/         página de muestra (solo en desarrollo)
scripts/       script de capturas
docs/          plan de fases e informes
```
Las carpetas vacías llevan un archivo `.gitkeep` para que git las guarde.

### 2.4 La paleta como única fuente de verdad
- **`src/styles/palette.ts`** contiene todos los colores del proyecto:
  - **31 colores de interfaz y escenas**, de un máximo de 32: noche, azules del banner, piedra,
    dorados, texto, acentos y bosque.
  - **15 colores para tu sprite y 10 para Null.**
- **`src/styles/tokens.css`** contiene los mismos colores como variables CSS (`--gold-3`…), que
  es lo que usan los estilos.
- **`src/styles/contrast.ts`** calcula el contraste según la norma WCAG y declara las 11
  combinaciones de texto y fondo permitidas.
- **`src/styles/palette.test.ts`** comprueba automáticamente cuatro cosas:
  1. Que no pasamos de 32 colores de interfaz ni de 15 por personaje.
  2. Que todos los colores tienen el formato correcto.
  3. Que `tokens.css` coincide exactamente con `palette.ts`, para que nadie cambie un color en un
     sitio y lo olvide en el otro.
  4. Que las 11 combinaciones cumplen el contraste AA. La más justa es el texto secundario sobre
     piedra, con 5,51:1 (el mínimo es 4,5:1).
- **Regla de diseño que sale de las pruebas:** el texto solo puede ir sobre los dos tonos de
  piedra más oscuros (`stone-0` y `stone-1`). Los tonos claros quedan para relieves y marcos.

### 2.5 Página de muestra (`/dev/specimen`)
- Enseña la escena de prueba a 320×180 con el tamaño real de tu sprite, el de Null, los huecos
  del menú circular y el banner; el título "YERAY CATURLA" en Jersey 10 con el dorado en relieve;
  una ventana STATS de prueba en Pixelify Sans con tus datos; la paleta completa y la tabla de
  contraste.
- Solo existe en desarrollo. **Comprobado:** no aparece en la versión publicada.
- Tras tu elección, desinstalé las fuentes descartadas (Silkscreen y VT323).

### 2.6 Documentos
- **`CLAUDE.md`**: las reglas que leo al empezar cada sesión. Incluye no tocar git, trabajar por
  fases, hablarte en español, no inventar datos, TypeScript para principiante y escribir estos
  informes.
- **`PRODUCT.md`**: tus respuestas sobre producto.
  - Público: todo tipo de personas, para abrir todas las puertas.
  - Éxito: que descarguen el CV, vean tu GitHub, te escriban o te recuerden.
  - Diferencia: ciclo completo, y constancia y disciplina.
- **`DESIGN.md`** (v0): resolución, paleta y sus reglas de uso, tipografía elegida, medidas de
  ventanas, menú y HUD, tiempos de animación en fotogramas y la lista de cosas prohibidas.
- **`docs/plan-de-fases.md`** y **`BRIEF.md`**, actualizados con todas las decisiones.

### 2.7 Una página provisional
`src/App.tsx` muestra de momento "Yeray Caturla · Portfolio en construcción". En desarrollo
incluye un enlace a la página de muestra. La sustituye la pantalla de título en la fase 5.

---

## 3. Cómo se ha comprobado

| Comprobación | Resultado |
|---|---|
| `npm run typecheck` | ✅ sin errores |
| `npm run lint` | ✅ sin avisos |
| `npm test` | ✅ 16 de 16 pruebas en verde |
| `npm run build` | ✅ JS inicial de **68,7 KB comprimido**, dentro del presupuesto de ≤ 100 KB; CSS de 0,7 KB |
| Página de muestra fuera del build | ✅ no se genera ningún archivo suyo |
| Capturas a 390 / 768 / 1440 | ✅ sin desplazamiento horizontal y sin errores de consola |

**Capturas** (solo en tu ordenador, no se suben a git):
- `.screenshots/specimen-390.png`, `specimen-768.png` y `specimen-1440.png`.
- `.screenshots/home-390.png`, `home-768.png` y `home-1440.png`.

---

## 4. TypeScript en esta fase

| Concepto | Explicación en una línea | Dónde verlo |
|---|---|---|
| `strict: true` | Activa todas las comprobaciones de seguridad de TypeScript | `tsconfig.app.json` |
| `type` de objeto | Describe la forma de un objeto: qué campos tiene y de qué tipo | `FontCandidate` en `src/dev/Specimen.tsx` |
| `Record<K, V>` | Un objeto cuyas claves son de tipo K y cuyos valores son de tipo V | `Palette` en `src/styles/palette.ts` |
| `satisfies` | Comprueba que un objeto cumple un tipo sin perder los nombres exactos de sus claves; por eso `UI_PALETTE['gold-9']` da error | `src/styles/palette.ts` |
| Tipos unión de valores | `min: 4.5 \| 3` solo admite esos dos números | `ContrastPair` en `src/styles/contrast.ts` |
| `keyof typeof` | Saca la lista de claves de un objeto como tipo; `UiColor` solo admite nombres reales de la paleta | `src/styles/palette.ts` |
| Props tipadas | Un componente declara qué recibe (`{ title: string; palette: Palette }`) | `PaletteSwatches` en `Specimen.tsx` |
| Genéricos en `useRef` | `useRef<HTMLCanvasElement>` le dice a TS a qué elemento apuntará la referencia | `SceneCanvas` en `Specimen.tsx` |
| `!` (non-null) | "Te garantizo que esto no es nulo"; solo cuando estás seguro | `src/main.tsx` |

**Curiosidad que salió en esta fase:** las pruebas usan `node:fs` para leer archivos, pero el
código de la web no puede usar cosas de Node, porque se ejecuta en el navegador. Por eso hay un
`tsconfig.test.json` aparte, que solo da acceso a Node a los archivos `.test.ts`.

---

## 5. Problemas encontrados y cómo se resolvieron

| Problema | Solución |
|---|---|
| TypeScript no reconocía `node:fs` en las pruebas | Configuración de TS separada para las pruebas (`tsconfig.test.json`) |
| El linter revisaba el código de las skills instaladas y daba decenas de avisos | `ignorePatterns` en `.oxlintrc.json` |
| A Chromium le faltaban librerías del sistema | Las instalaste tú con `sudo` desde una terminal aparte |
| `sudo` no funciona con el prefijo `!` dentro de Claude Code, porque no puede pedir la contraseña | Anotado en mi memoria: los comandos con `sudo` siempre en una terminal aparte |

---

## 6. Observaciones para las próximas fases
- **Escena en el móvil:** a 390 px la escena se ve a ×1 (320×180) y queda pequeña. En la fase 3
  se ajustará al ancho en móviles de alta densidad, como dice `DESIGN.md`.
- **Pixelify Sans a 16 px en el móvil:** algunas filas de STATS pasan a dos líneas, por ejemplo
  "Desarrollador Backend Junior". La maquetación de la ventana de la fase 1 lo tendrá en cuenta,
  por ejemplo poniendo la etiqueta encima del valor en pantallas estrechas.
- **Precarga de fuentes:** al construir el título (fase 5) se precargarán las dos fuentes de la
  primera pantalla, para que el texto no "salte" al cargar.

---

## 7. Archivos para tu commit

Como todavía no hay ningún commit, entra todo lo del proyecto. Esto es lo nuevo o modificado en
esta fase:

| Archivo | Qué es |
|---|---|
| `package.json`, `package-lock.json` | Dependencias y scripts |
| `index.html` | Página base: idioma `es`, título y descripción |
| `vite.config.ts` | Configuración de Vite y Vitest |
| `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.test.json` | Configuración de TypeScript |
| `.oxlintrc.json` | Configuración del linter |
| `.gitignore` | Añadidos `references/`, `.screenshots/`, las carpetas de Playwright, los vídeos en bruto y `.claude/settings.local.json` |
| `src/main.tsx`, `src/Root.tsx`, `src/App.tsx`, `src/App.module.css` | Arranque de la app y página provisional |
| `src/styles/palette.ts`, `tokens.css`, `contrast.ts`, `palette.test.ts`, `global.css` | Paleta, tokens, contraste y pruebas |
| `src/dev/Specimen.tsx`, `Specimen.module.css` | Página de muestra (solo desarrollo) |
| `src/{scenes,components,engine,assets,content}/.gitkeep` | Carpetas reservadas |
| `scripts/screenshot.mjs` | Capturas de revisión |
| `CLAUDE.md`, `PRODUCT.md`, `DESIGN.md` | Documentos de referencia |
| `BRIEF.md`, `docs/plan-de-fases.md` | Actualizados con las decisiones |
| `docs/informes/fase-0-cimientos.md` | Este informe |

Ya existían antes de la fase y también entran en tu primer commit: `CONTENT.md`, `media-src/`,
`skills-lock.json`, `.agents/` y `.claude/skills/`.

**Quedan fuera automáticamente** por `.gitignore`: `node_modules/`, `dist/`, `.screenshots/`,
`references/` (tus fotos y el CV original), `media-src/projects/capyroad-raw.mp4` y
`.claude/settings.local.json`.

### ✅ Añadido al `.gitignore` (por petición tuya)
- `media-src/**/*-raw.*`: el vídeo en bruto de Capyroad (11 MB) se queda solo en tu ordenador.
  La versión optimizada de la fase 4 (< 2 MB) sí se subirá.
- `.claude/settings.local.json`: tus permisos locales de Claude Code.

### Commits recomendados

Siguen la convención **Conventional Commits** (`tipo(ámbito): descripción`, en inglés,
en imperativo y sin punto final):

| Tipo | Cuándo se usa |
|---|---|
| `feat` | Funcionalidad nueva |
| `fix` | Corrección de un error |
| `docs` | Solo documentación |
| `chore` | Configuración, herramientas, dependencias |
| `test` | Pruebas |
| `refactor` | Cambio de código que no altera el comportamiento |
| `style` | Formato, sin cambios de lógica |

Como el repositorio aún no existe, el primer paso es crearlo. Antes de cada commit puedes
ejecutar `git status` para ver qué está preparado.

```bash
# 0. Create the repository (only this first time)
git init -b main

# 1. Project scaffold and tooling
git add package.json package-lock.json index.html vite.config.ts \
  tsconfig.json tsconfig.app.json tsconfig.node.json tsconfig.test.json \
  .oxlintrc.json .gitignore \
  src/main.tsx src/Root.tsx src/App.tsx src/App.module.css \
  src/scenes/.gitkeep src/components/.gitkeep src/engine/.gitkeep \
  src/assets/.gitkeep src/content/.gitkeep
git commit -m "chore: scaffold Vite + React + TypeScript project with oxlint and Vitest"

# 2. Palette, design tokens and contrast tests
git add src/styles/
git commit -m "feat(styles): add 16-bit palette, design tokens and WCAG contrast tests"

# 3. Dev-only specimen page
git add src/dev/
git commit -m "feat(dev): add specimen page for resolution, fonts and palette review"

# 4. Screenshot script
git add scripts/screenshot.mjs
git commit -m "chore(scripts): add Playwright screenshot script for phase reviews"

# 5. Project documentation
git add BRIEF.md PRODUCT.md DESIGN.md CONTENT.md CLAUDE.md
git commit -m "docs: add project brief, product record, design spec and content source"

# 6. Phase plan and phase 0 report
git add docs/
git commit -m "docs: add phase plan and phase 0 report"

# 7. Agent skills used to build the project
git add .agents/ .claude/skills/ skills-lock.json
git commit -m "chore: add design and React agent skills"

# 8. Project media sources (screenshots only; the raw video is git-ignored)
git add media-src/
git commit -m "chore(media): add Pakito's Gambling and Capyroad screenshots"
```

Al terminar, `git status` debería decir `nothing to commit, working tree clean`. Si aparece
algún archivo sin añadir, avísame y te digo a qué commit pertenece.

---

## 8. Siguiente fase
**Fase 1 — El aspecto de las ventanas.** Construiré los tokens de medidas y las fuentes
definitivas, y los componentes Window (piedra con relieve), BannerWindow (azul tramado con marco
de cuerda dorada), StatBar, Divider, HelpBar y KeyHint. Con ellos montaré la ventana STATS
completa con tus datos reales, en `/dev/windows`.
