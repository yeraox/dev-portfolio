# Informe · Fase 4 — Ventanas con tu contenido

**Fecha de cierre:** 11 de noviembre de 2026
**Estado:** ✅ terminada, pendiente de tu revisión (sobre todo de los textos en inglés) y tu
commit.

## Ronda 2 — ventanas más grandes y secciones con la rueda (tu petición)

> "Las ventanas son demasiado pequeñas… los textos no se pueden leer bien… que pueda hacer scroll
> con la rueda para cambiar entre secciones dentro de una misma ventana."

### La causa
- **La ventana tenía un ancho máximo fijo** (1040 px) y **el texto un tamaño fijo** (20 px),
  mientras que la escena crece con la pantalla.
- En un portátil de 1440 la ventana se quedaba justa.
- En una pantalla de 1920 o mayor, la ventana y su texto quedaban pequeños dentro de una escena
  enorme.

### Qué cambia
1. **La ventana cubre la escena:**
   - 4 píxeles de interfaz hacia dentro de sus bordes; en el móvil, la pantalla entera.
   - El marco, el título y la ayuda quedan fijos.
2. **El texto y los marcos crecen con la pantalla** (`src/game/stage.ts`):

   | Pantalla | Texto | Texto pequeño | Títulos de ventana | Píxel de interfaz |
   |---|---|---|---|---|
   | Móvil | 16 px | 14 px | 20 px | 2 px |
   | Portátil 1440 | **26 px** (antes 20) | 21 px | 40 px | 4 px |
   | 1920×1080 | **39 px** | 32 px | 60 px | 6 px |
   | 2560×1440 | 52 px | 42 px | 80 px | 8 px |

   Jersey 10, la fuente de los títulos, se dibuja sobre una rejilla de 10 px, así que sus tamaños
   siempre son múltiplos de 10.
3. **Secciones con pestañas** (`src/windows/WindowSections.tsx`, componente nuevo):
   - **EQUIP:** cada proyecto es una sección. Con la ventana ancha, a la izquierda van el vídeo,
     su pie y la captura, y a la derecha el texto.
   - **STATS:** Perfil (retrato ×3 a la izquierda; ficha y bio a la derecha), Formación y
     Registro de misiones.
   - **ALCHEMY:** "Dominio" y "He trabajado con", una sección cada uno.
   - **COMMS:** cabe entero, así que se queda en una sola sección, sin pestañas.
4. **La rueda del ratón cambia de sección:**
   - Si la sección es más larga que la ventana, la rueda primero la recorre hasta el final; así no
     te saltas texto. El giro siguiente pasa a la siguiente sección.
   - **Un giro (o un gesto del trackpad) cambia una sola sección**, aunque sea largo.
   - Al volver hacia atrás con la rueda, entras por el final de la sección anterior.
   - También funcionan las flechas sobre las pestañas, Inicio y Fin, y el clic.
5. **En el móvil:** deslizar a los lados o tocar la pestaña.
6. **Flecha de "hay más":** un triangulito dorado parpadea abajo a la derecha mientras queda
   texto por debajo.
7. **La línea de ayuda** explica la rueda con ratón ("Rueda o ← → cambian de sección") y el gesto
   en el táctil ("Desliza a los lados o toca una pestaña…").

### Cómo se ha comprobado
- **`npm run check:windows`** suma 8 comprobaciones:
  - En ALCHEMY, la rueda abajo pasa a la sección siguiente y la rueda arriba vuelve.
  - Un giro largo cambia una sola sección.
  - En EQUIP, la rueda recorre Capyroad hasta el final antes de pasar a Pakito's Gambling, y la
    nueva sección empieza arriba.
  - En el móvil, deslizar en STATS pasa a Formación.
  - Pasan todas, en desarrollo y en producción.
- **4 pruebas nuevas de tamaños**: 130 en total.
- **Capturas a 390, 768, 1440 y 1920:** se lee bien a todos los tamaños.
- **Rendimiento:**
  - Lighthouse móvil: rendimiento 100 en el campamento y 98 en `/#equip` y `/#stats`;
    accesibilidad 100 en todo.
  - CLS de 0,014 como máximo.
  - JS inicial de 83,5 KB.
  - 60 fps también con la CPU ×4.

---

## Resumen en tres líneas
- Las cuatro ventanas profesionales tienen tu contenido real:
  - **EQUIP:** proyectos, con el vídeo de Capyroad.
  - **ALCHEMY:** stack técnico.
  - **STATS:** ficha, con tu retrato.
  - **COMMS:** contacto y selector de idioma.
- Toda la web está en **español e inglés**:
  - Detecta el idioma del navegador y recuerda tu elección.
  - Los dos idiomas tienen exactamente la misma forma, comprobada por TypeScript y por pruebas.
  - Puedes revisarlos lado a lado en `/dev/textos`.
- Sigue dentro del presupuesto:
  - JS inicial de 83,2 KB y primera carga de 209 KB.
  - Vídeo de 208 KB.
  - Lighthouse móvil de 98–99 en rendimiento y 100 en accesibilidad en todas las ventanas.

---

## 1. Decisiones tomadas

| Decisión | Resultado | Quién |
|---|---|---|
| Orden de EQUIP | **Capyroad primero** y seleccionado (DESTACADO), luego Pakito's Gambling y Bosa Digital | Yo |
| Tramo del vídeo | **Segundos 11–25 (14 s)**: un cruce, el cobro con el ovni, "¡¡¡Has ganado!!!", una ronda nueva, el atropello y "Has perdido :/". Se ven las dos salidas de "Cruzar o Cobrar" | Yo (puedes cambiarlo) |
| Recorte del vídeo | **Solo la app**: la grabación mostraba las pestañas, los marcadores y la barra lateral del navegador (correo, redes…) | Yo (privacidad) |
| Tamaño del vídeo | 1280 px de ancho: 208 KB en MP4 y 234 KB en WebM. Sobraba presupuesto para verlo nítido | Yo |
| Captura de Capyroad | Al final del detalle: el vídeo ya enseña el juego y las dos imágenes juntas empujaban el texto | Yo |
| Bosa Digital | Las tres frases del CV, etiqueta CLASIFICADO y la nota "Acuerdo de confidencialidad: sin capturas, cifras, código ni demo." | Yo (desde `CONTENT.md`; confírmalo, ver 7) |
| Idioma inicial | Tu elección guardada → navegador en español → español; cualquier otro idioma → inglés | Plan |
| Selector de idioma | En COMMS, como botones de opción nativos con aspecto de píxel | Yo |
| Enlaces directos | `/#equip`, `/#stats`… abren esa ventana, y la dirección cambia al abrir y cerrar | Yo (útil para compartir un proyecto) |
| Carga de ventanas | Cada una en su propio archivo (0,2–1,8 KB); todas se precargan al poco de ver el campamento | Yo |
| Vídeo con "reducir movimiento" | Imagen fija con controles: no arranca solo, pero se puede ver | Yo |

---

## 2. Qué se ha hecho, paso a paso

### 2.1 Medios (`npm run media`, `scripts/media.mjs`)
- **Capturas:**
  - Ruleta, blackjack y Capyroad en WebP a 640 y 1280 px. Pesan entre 6 y 28 KB cada una; los
    PNG originales, entre 170 y 330 KB.
  - Las pantallas de alta densidad cogen la grande.
- **Vídeo:**
  1. Saqué fotogramas de cada segundo para elegir el tramo.
  2. Lo recorté a la app (1810×830 desde la posición 70,114), dejando fuera el navegador.
  3. Lo dejé sin audio, a 30 fps y 1280×586, en MP4 (H.264) y WebM (VP9), con su portada (el
     primer fotograma).
  4. Lo revisé fotograma a fotograma: se leen los multiplicadores, el riesgo y los mensajes.
- El script falla si un vídeo pasa de 2 MB.

### 2.2 Contenido (`src/content/`)
- **`types.ts`:** la forma del contenido, con un tipo `Content`.
  - Los medios de cada proyecto son una unión discriminada: vídeo, capturas o "clasificado".
- **`es.ts`:** copiado de `CONTENT.md`. Las tres frases de Bosa Digital están en una sola
  constante que comparten STATS y EQUIP, así que no pueden divergir.
- **`en.ts`:** traducido por mí. Los títulos del banner salen de la tabla de `BRIEF.md` y no
  añade ningún dato.
- **Idioma:**
  - `locale.ts` lo elige y lo guarda; si el navegador bloquea el guardado, la web funciona igual.
  - `LocaleProvider.tsx` (componente) y `useLocale.ts` (hook) lo ponen a disposición de toda la
    app y actualizan `<html lang>`.
- **`texts.ts`:** convierte un diccionario en una lista de rutas y textos, para las pruebas y para
  `/dev/textos`.

### 2.3 Ventanas (`src/windows/`)
- **`sheet.module.css`:** los patrones comunes, nacidos de la ficha STATS de la fase 1: hoja de
  dos columnas, filas etiqueta–valor, títulos dorados, viñetas de píxel, la etiqueta (DESTACADO,
  CLASIFICADO) y el marco de "pantalla dentro de la pantalla".
- **EQUIP:**
  - Pestañas verticales (↑/↓, Inicio, Fin); el proyecto elegido va sobre una placa oscura con el
    cuadradito dorado como cursor.
  - Detalle: nombre, etiqueta, contexto, vídeo o capturas, resumen, "Qué hice", stack, notas,
    repositorio y demo.
  - Bosa Digital no tiene imágenes ni repositorio.
- **ALCHEMY:** los dos rangos en columnas, cada grupo con sus tecnologías.
- **STATS:** tu retrato de referencia a ×2, nombre, puesto, especialidad, base, idiomas, bio,
  formación (la que está "En curso", en verde) y el registro de misiones.
- **COMMS:**
  - GitHub y LinkedIn se abren en otra pestaña (con aviso para lectores de pantalla); el email
    abre el correo.
  - Después vienen la ubicación, la disponibilidad y el selector de idioma.
- **Borradores:** BUFFS y CRAFT (solo en desarrollo) muestran "Sección en preparación".
- **`index.ts`:** el registro de carga diferida y la precarga.

### 2.4 El campamento, conectado
- **Textos:** el banner, las etiquetas accesibles del anillo, el HUD y el encabezado salen del
  idioma activo.
- **Ventana:** cada sección abre la suya, con su línea de ayuda (en EQUIP explica ↑/↓).
- **Enlaces directos:** `/#seccion` abre esa ventana al cargar, y la dirección se actualiza al
  abrir y cerrar.
- **Cambios en los componentes de ventana:**
  - El marco de la ventana es fijo y solo se desplaza el cuerpo.
  - La ventana mide hasta 1040 px de ancho.
  - El botón [ESC] EXIT anuncia "ESC EXIT · Cerrar ventana".

### 2.5 Páginas de desarrollo
- **`/dev/textos` (nueva):** todos los textos de la web en español y en inglés, lado a lado y
  agrupados. Las filas iguales en los dos idiomas (nombres y tecnologías) van atenuadas.
- **`/dev/windows`:** usa ya la ventana STATS real, con un botón para cambiar de idioma. La copia
  de tus datos que tenía desde la fase 1 se ha borrado.

### 2.6 Herramientas
- **`npm run check:windows`:**
  - Las 4 ventanas en los dos idiomas a los tres tamaños: 24 capturas de pantalla y 24 de la
    ventana completa, en `.screenshots/fase-4/`.
  - Además, 20 comprobaciones de comportamiento (lista en el apartado 3).

---

## 3. Cómo se ha comprobado

| Comprobación | Resultado |
|---|---|
| `npm run typecheck` / `npm run lint` | ✅ Sin errores ni avisos |
| `npm test` | ✅ 130 pruebas (antes 109). Nuevas: los dos idiomas con los mismos textos en los mismos sitios y los mismos datos (enlaces, centros, fechas); sin teléfono ni TODO; enlaces https o mailto; Bosa Digital solo con sus tres frases y sin medios; ALCHEMY sin niveles; elección de idioma; enlaces directos |
| `npm run check:windows` en desarrollo y en producción | ✅ Todo |
| `npm run check:camp` en desarrollo y en producción | ✅ 18/18 |
| Capturas | ✅ Sin errores de consola: `.screenshots/fase-4/` y `/dev/textos`, `/dev/windows` sin desbordamiento |

**Lo que comprueba `check:windows`:**
- Títulos de las cuatro ventanas en ES y EN.
- Enlaces exactos: GitHub, LinkedIn y email. Los web se abren en otra pestaña de forma segura; el
  email, no.
- Un navegador en español empieza en español.
- Elegir English cambia `<html lang>` y los textos, y se recuerda al recargar.
- EQUIP lista 3 proyectos con Capyroad primero.
- El vídeo suena en silencio, en bucle y en marcha; con "reducir movimiento" espera, con
  controles.
- ↓ y Fin recorren los proyectos y Bosa Digital no tiene imágenes ni vídeo.
- El campamento no descarga ni vídeo ni capturas, y abrir EQUIP sí.
- No hay teléfono en ninguna ventana ni errores de consola.

### Rendimiento (build de producción)

| Métrica | Objetivo | Resultado |
|---|---|---|
| JavaScript inicial (gzip) | ≤ 100 KB | ✅ **83,5 KB** (+5,7 KB: los dos diccionarios, el idioma y las secciones) |
| Cada ventana | — | 0,2–1,8 KB de JS + 0,1–0,6 KB de CSS (gzip), descargadas aparte |
| Primera carga (campamento) | ≤ 300 KB | ✅ **216 KB** |
| Vídeo de Capyroad | ≤ 2 MB | ✅ **208 KB** (MP4) / 234 KB (WebM). Solo se descarga al abrir EQUIP |
| LCP móvil | ≤ 2,5 s | ✅ **1,9 s** el campamento; 2,1 s abriendo `/#equip` o `/#comms` directamente |
| CLS | < 0,1 | ✅ **0,001** el campamento; entre **0,001 y 0,014** abriendo una ventana por enlace (era 0,41, ver 5) |
| Respuesta a teclas y clics | < 200 ms | ✅ **32 ms** como máximo, también con CPU ×4 |
| Fotogramas por segundo | 60 / ≥ 30 con CPU ×4 | ✅ **60 y 60** |
| Lighthouse móvil, campamento | ≥ 95 | ✅ Rendimiento **100**, accesibilidad **100** (buenas prácticas 96 y SEO 91: favicon y `robots.txt`, fase 7) |
| Lighthouse móvil, `/#equip` y `/#stats` | ≥ 95 | ✅ **98** en rendimiento, **100** en accesibilidad |
| Accesibilidad de `/#comms` y `/#alchemy` | ≥ 95 | ✅ **100** |

---

## 4. TypeScript en esta fase

| Concepto | Dónde verlo | En una línea |
|---|---|---|
| **`const EN: Content = {…}`** | `src/content/en.ts` | Si falta, sobra o se escribe mal un campo respecto al español, no compila |
| **Arrays de objetos tipados** | `src/content/types.ts` (`Education[]`, `Project[]`, `Row[]`) | Cada elemento de la lista tiene que tener la forma del tipo |
| **Campos opcionales** | `note?`, `tag?`, `repo?`, `demo?` en `types.ts` | Pueden faltar; antes de usarlos hay que comprobar que están (`{project.repo && …}`) |
| **Context de React con tipos** | `src/content/useLocale.ts` | `createContext<LocaleValue \| null>`: el hook devuelve siempre `LocaleValue` o da un error claro |
| **Unión discriminada (otra vez)** | `ProjectMedia` en `types.ts`, usada en `EquipWindow.tsx` | Tras `if (media.kind === 'video')`, TypeScript sabe que existe `media.videoLabel` |
| **`unknown` y comprobaciones** | `src/content/texts.ts` | Un valor `unknown` solo se puede usar después de probar con `typeof` o `Array.isArray` qué es |
| **`keyof typeof`** | `Screenshot` en `EquipWindow.tsx` | El `id` de una captura solo puede ser una de las que existen en `media.gen.ts` |
| **Eventos con tipo** | `onWheel(event: WheelEvent<HTMLDivElement>)` en `WindowSections.tsx` | TypeScript sabe que el evento trae `deltaY` y que `currentTarget` es el `div`: no hay que adivinar nada |
| **Props con un array de objetos** | `sections: WindowSection[]` en `WindowSections.tsx` | Cada ventana le pasa sus secciones (`id`, `label`, `tag?`, `content`) y el componente las pinta todas igual |

---

## 5. Problemas encontrados y cómo se resolvieron

| Problema | Solución |
|---|---|
| **El vídeo original mostraba el navegador**: pestañas, marcadores y barra lateral con correo y redes | Recortado a la app. Queda anotado en `CLAUDE.md` para que no se repita |
| En las ventanas largas se desplazaba la ventana entera: el texto pasaba por encima del borde y la ayuda quedaba fuera | El marco, el título y la ayuda quedan fijos; solo se desplaza el cuerpo |
| **Abriendo `/#equip` directamente, la página saltaba** (CLS 0,41, rendimiento 79): la ventana salía con "Cargando…" y luego crecía | La ventana solo aparece cuando su contenido está listo, y todas se precargan al poco de ver el campamento. CLS 0,001 y rendimiento 98 |
| Lighthouse: el nombre accesible de [ESC] EXIT ("Cerrar ventana") no incluía el texto visible (WCAG 2.5.3) | Ahora se anuncia "ESC EXIT · Cerrar ventana" |
| En ALCHEMY, "Bases de datos" y "DevOps y cloud" se partían en dos líneas | Columna de etiquetas algo más ancha en todas las ventanas |
| Una prueba confundía "todo el ciclo" con la marca TODO | La prueba busca la marca en mayúsculas |
| En desarrollo, Vite pide `capyroad.mp4?import` como módulo y parecía que se descargaba el vídeo | La comprobación mira el tipo real de recurso (imagen o vídeo) |
| El linter avisó: un archivo con componente y hook a la vez estropea la recarga en caliente | Separados en `LocaleProvider.tsx` y `useLocale.ts` |
| `check:camp` esperaba un solo encabezado por ventana | Lee solo el título (`h2`) |

---

## 6. Observaciones para las próximas fases
- **Fase 7:** favicon, `robots.txt`, la vista de CV en texto y la descarga del PDF. Son los únicos
  avisos de Lighthouse.
- **Línea de ayuda en el móvil:** la de EQUIP habla de ↑/↓, que en táctil no aplica. En la fase 7
  (pulido) puede cambiar según el tipo de puntero.
- **Banner con ventana abierta:** cuando la ventana es corta, el banner sigue viéndose encima con
  ROTATE y OPEN. Es inofensivo; se puede atenuar en el pulido.
- **Con 6 secciones**, el icono de arriba a la izquierda sigue cayendo sobre la paellera (fase 3).
- **El vídeo** muestra la interfaz de Pakito's en español (Cruzar, Cobrar). En inglés el texto
  dice "Cross" y "Cash out", que es la traducción.

---

## 7. Lo que necesito de ti
1. **Revisa los textos en `/dev/textos`**, sobre todo el inglés. Algunas decisiones de traducción:
   - "C.E. Administración de Recursos y Servicios en la Nube" → *Specialization Course in Cloud
     Resource and Service Administration*.
   - "Técnico Superior en Desarrollo de Aplicaciones Web" → *Higher Technician in Web Application
     Development*.
   - "Registro de misiones" → *Quest log*.
   - Las tres frases de Bosa Digital, traducidas literalmente.
2. **Dos frases que he escrito yo a partir de `CONTENT.md`**; confírmalas o cámbialas:
   - Capyroad: "Juego dentro de Pakito's Gambling · moneda ficticia". La moneda ficticia sale de
     la descripción de Pakito's.
   - Bosa Digital: "Acuerdo de confidencialidad: sin capturas, cifras, código ni demo." Sale de
     las instrucciones de confidencialidad de `CONTENT.md`. ¿Te parece bien decirlo así en
     público?
3. **El tramo del vídeo** (11–25 s). Si prefieres otro, se cambia una línea de
   `scripts/media.mjs`.

---

## 8. Archivos para tu commit

| Archivo | Qué es |
|---|---|
| `src/content/types.ts`, `en.ts`, `locale.ts`, `LocaleProvider.tsx`, `useLocale.ts`, `texts.ts`, `content.test.ts` | **Nuevos**: forma del contenido, inglés, idioma y pruebas |
| `src/content/es.ts` | Todo el contenido en español |
| `scripts/media.mjs` | **Nuevo**: optimiza capturas y vídeo (`npm run media`) |
| `src/assets/projects/*` | **Nuevos (generados)**: 6 WebP, MP4, WebM, portada y `media.gen.ts` |
| `src/windows/*` | **Nuevos**: las ventanas, las secciones con la rueda (`WindowSections`), sus estilos y el registro de carga |
| `src/game/stage.ts`, `stage.test.ts` | Texto y marcos que crecen con la pantalla |
| `src/styles/tokens.css` | Token `--title-size` (títulos de ventana) |
| `src/components/SectionDialog.*`, `Window.module.css` | Ventana que cubre la escena (o la pantalla en el móvil), marco fijo, títulos más grandes, ayuda, nombre del botón cerrar |
| `src/styles/contrast.ts` | Borde de los botones de idioma (`stone-4` sobre piedra, 3:1) |
| `src/scenes/camp/CampScene.*` | Idioma, ventanas reales, enlaces directos y precarga |
| `src/game/state.ts`, `state.test.ts` | Ventana abierta desde un enlace (`/#equip`) |
| `src/App.tsx`, `src/Root.tsx` | Proveedor de idioma y ruta `/dev/textos` |
| `src/dev/TextsReview.*`, `src/dev/WindowsDemo.*` | Revisión de textos y STATS real en `/dev/windows` |
| `scripts/windows-check.mjs`, `scripts/camp-check.mjs`, `package.json` | Comprobación de ventanas; scripts `media` y `check:windows` |
| `CONTENT.md`, `DESIGN.md`, `BRIEF.md`, `CLAUDE.md`, `docs/plan-de-fases.md` | Contenido, ventanas, medios y reglas |
| `docs/informes/fase-4-ventanas.md` | Este informe |

El vídeo en bruto (`media-src/projects/capyroad-raw.mp4`) sigue fuera de git.

### Commits recomendados
```bash
# 1. Typed content in two languages
git add src/content/
git commit -m "feat(content): add typed ES/EN dictionaries with locale detection and tests"

# 2. Project media
git add scripts/media.mjs src/assets/projects/
git commit -m "feat(media): add WebP screenshots and a trimmed, cropped Capyroad video"

# 3. The content windows: big, scaled, in sections switched with the mouse wheel
git add src/windows/ src/components/ src/styles/
git commit -m "feat(windows): add EQUIP, ALCHEMY, STATS and COMMS windows in wheel-driven sections"

# 4. The camp: translated, linked, and UI sizes that grow with the screen
git add src/scenes/ src/game/ src/App.tsx
git commit -m "feat(camp): translate the camp, scale UI type with the scene and link windows"

# 5. Dev pages
git add src/dev/ src/Root.tsx
git commit -m "feat(dev): add ES/EN texts review page and show the real STATS window"

# 6. Checks
git add scripts/windows-check.mjs scripts/camp-check.mjs package.json
git commit -m "test: add content windows walkthrough in both languages"

# 7. Docs
git add CONTENT.md DESIGN.md BRIEF.md CLAUDE.md docs/
git commit -m "docs: document content windows, project media and phase 4 report"
```

Al terminar, `git status` debería decir `nothing to commit, working tree clean`.

---

## 9. Siguiente fase
**Fase 5 — Pantalla de título**, cuando la apruebes:
- "YERAY CATURLA" con letras doradas en relieve.
- Las líneas de créditos.
- PRESS START parpadeando a saltos.
- El selector ES/EN.
- La transición al campamento.
