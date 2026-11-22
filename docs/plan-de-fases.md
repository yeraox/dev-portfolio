# Plan de fases — Portfolio "Yeray Caturla"

> Documento para leer y comentar **antes** de escribir código. Nada de lo que aparece aquí está
> hecho todavía. Todo se puede cambiar.

## Cómo leer y comentar este documento

Cada fase tiene siempre los mismos apartados:

- **Objetivo**: para qué sirve la fase, en una frase.
- **Qué se construye**: la lista de piezas que existirán al terminar.
- **Cómo se hace**: el método técnico, explicado sin dar nada por sabido.
- **Qué verás al terminar**: lo que te enseñaré para que lo revises.
- **Cómo compruebo que funciona**: las pruebas que hago yo antes de enseñártelo.
- **TypeScript que aprenderás**: los conceptos nuevos de esa fase.
- **Decisiones que puedes cambiar**: lo que he decidido yo y tú puedes vetar.
- **💬 Tus comentarios**: espacio vacío para que escribas.

Para comentar tienes dos opciones:
1. Escribe directamente debajo de cada "💬 Tus comentarios" y avísame.
2. Dímelo en el chat indicando la fase, por ejemplo: "Fase 3: prefiero que el menú gire más
   despacio".

**Regla de trabajo:** al terminar cada fase **me paro**, te enseño capturas a tres tamaños de
pantalla (móvil 390 px, tablet 768 px y escritorio 1440 px) y **no empiezo la siguiente sin tu
OK**.

**Informe de cada fase:** al cerrar cada fase escribo un documento en `docs/informes/`
(`fase-0-cimientos.md`, `fase-1-…`) con lo que se ha hecho exactamente, cómo se ha comprobado,
el TypeScript usado y la lista de archivos para tu commit.

---

## Visión general

### El recorrido del visitante

    PANTALLA DE TÍTULO  →  TRANSICIÓN  →  INTRO (sales de la cueva con Null)
            ↓                                         ↓
     (SKIP INTRO)  ───────────────────────→  CAMPAMENTO con menú circular
                                                      ↓
                                     VENTANA de la sección elegida (Esc para volver)

### Por qué este orden

1. **Primero lo que más riesgo visual tiene**: el aspecto de las ventanas (fase 1) y el
   parecido de los personajes (fase 2). Si eso no te convence, todo lo demás da igual.
2. **Después lo que más importa a un reclutador**: el menú y tu contenido profesional (fases 3
   y 4).
3. **Al final lo espectacular**: el título y la intro (fases 5 y 6). Son lo más vistoso, pero si
   faltaran, la web seguiría siendo útil.
4. **Cierre**: accesibilidad y vista CV (fase 7), mejoras tras tu revisión (fase 8), repaso y
   limpieza del código (fase 9) y publicación (fase 10).

Si el proyecto se parase a mitad, lo que ya existiera seguiría sirviendo.

### Resumen

| Fase | Nombre | Resultado que verás |
|---|---|---|
| 0 | Cimientos | Proyecto creado, documentos de diseño y página de muestra de colores y fuentes |
| 1 | El aspecto de las ventanas | La ventana STATS terminada, con tu contenido real, pero estática |
| 2 | Personajes: tú y Null | Página con todos los sprites animados junto a tus fotos de referencia |
| 3 | Campamento y menú circular | El campamento y el menú funcionando con teclado, ratón y táctil |
| 4 | Ventanas con tu contenido | EQUIP, ALCHEMY, STATS y COMMS completas en español e inglés |
| 5 | Pantalla de título | YERAY CATURLA en dorado, PRESS START y transición |
| 6 | Intro: salida de la cueva | Tú y Null salís de la cueva y llegáis al campamento |
| 7 | Vista CV, calidad y accesibilidad | Página CV en texto, auditorías y pruebas finales |
| 8 | Mejoras del portfolio | CV en inglés, rueda con nombres reales, iconos nuevos, CV e idioma; retratos y favicon nuevos, piel más clara, Null caminando bien; iconos del stack, animaciones en reposo; fuera BUFFS, CRAFT y la vista CV web |
| 8, ronda 2 | Mejoras 2 | Ajustes en el título y volver al título, ventanas de fondo plano que se manejan con ← →, la rueda sin tapar la hoguera, este portfolio como proyecto y una línea de privacidad |
| 9 | Revisión, refactor y limpieza | El mismo resultado con menos código, menos archivos y nada de ruido |
| 10 | Publicación | La web en internet con despliegue automático |

---

## Conceptos que aparecen en todo el proyecto

Léelos una vez; las fases los dan por explicados.

### 1. Resolución interna y escalado entero
Las consolas de 16 bits dibujaban en una pantalla diminuta que la tele ampliaba. Haremos lo
mismo: las escenas (título, cueva, campamento y personajes) se dibujan en un lienzo pequeño, que
es de **640×360 píxeles** (en la fase 0 elegimos 320×180; en la fase 2 la subimos para que tus
sprites conserven las gafas y la cara), y el navegador lo amplía por un **número entero**: ×2 da
1280×720 y ×3 da 1920×1080. Ampliar por un entero hace que cada píxel del dibujo se convierta en
un cuadrado perfecto de 4×4 o 6×6 píxeles reales. Así el pixel art se ve nítido y no borroso.

La propiedad CSS que evita el desenfoque es `image-rendering: pixelated`.

### 2. Escenas en `<canvas>` y texto en HTML normal
- **Canvas** es un lienzo donde se pinta píxel a píxel. Ahí van los fondos y los personajes.
- **Texto, ventanas y botones** son HTML de verdad, no dibujos. Así el texto se puede
  seleccionar, lo leen los lectores de pantalla, lo indexa Google y se puede traducir.

El HTML se coloca encima del canvas, alineado con la misma escala.

### 3. Personajes: tus referencias tal cual
**Desde la fase 2, los personajes son tus imágenes de referencia grandes tal cual** (opción A):
cada una se reconstruye en su rejilla de píxeles original con `npm run characters` y se muestra
ampliada por un número entero. Los iconos del menú (16×16) siguen siendo rejillas de letras
dibujadas con el motor. Ejemplo simplificado de la parte de arriba de tu cabeza:

    // . = transparente   o = contorno   h = pelo   H = brillo del pelo
    "....oooooo....",
    "..oohhHhhhoo..",
    ".ohhhHHhhhhho.",

Un pequeño "motor" lee estas rejillas y las pinta en el canvas. Ventajas:
- Puedo crearlas y retocarlas yo directamente.
- Si algún día encargas sprites dibujados a mano en PNG, se sustituyen sin tocar el resto del
  código.

### 4. Máquina de estados
La web siempre está en **un solo** estado: TÍTULO, TRANSICIÓN, INTRO, CAMPAMENTO o VENTANA (de
una sección concreta). Los cambios de estado están definidos de antemano: desde TÍTULO solo se
puede ir a TRANSICIÓN o, con SKIP, al CAMPAMENTO. Esto evita errores como "la intro sigue
sonando mientras la ventana está abierta". En React se hace con el hook `useReducer`.

### 5. El contenido, separado del código
Tus textos viven en archivos de datos (`src/content/es.ts` y `en.ts`), generados a partir de
`CONTENT.md`. Los componentes solo saben **cómo** mostrar las cosas; nunca contienen textos
escritos a mano. Para cambiar un texto o añadir un proyecto no hay que tocar ningún componente.

### 6. Movimiento "a saltos"
Las animaciones de las consolas no eran suaves: avanzaban por fotogramas. Usaremos
`steps()` en CSS y contaremos los fotogramas a 60 por segundo. Por ejemplo, una ventana se
abre en 6–8 fotogramas (unos 0,1 s) como una persiana de arriba abajo, y los personajes caminan
a 8–12 dibujos por segundo.

---

## Rendimiento: objetivos y cómo los mido

**¿Puedo asegurarte que irá bien?** Al 100 % no: depende del dispositivo y de la conexión de
cada visitante, y nadie puede prometer eso con honestidad. Lo que sí puedo asegurarte es que hay
**objetivos concretos y medibles**, que los mido en cada fase y que **una fase no se da por
terminada si no los cumple**.

### Por qué partimos con ventaja
- **El canvas es pequeño:** 640×360 son 230.400 píxeles, frente a los ~2 millones de una
  pantalla 1080p. Pintarlo 60 veces por segundo sigue siendo barato incluso para un móvil modesto.
- **Sin librerías pesadas:** nada de librerías de animación, de CSS ni motores de juego. Solo
  React.
- **Los sprites están en código:** no hay que descargar imágenes de personajes.
- **Cada ventana se descarga solo cuando se abre.**
- **El vídeo de Capyroad no se descarga** hasta que abres su ficha.
- **El bucle de animación se pausa** si cambias de pestaña.
- **Fuentes ligeras:** alojadas en el proyecto y recortadas a los caracteres que usamos.

### Objetivos (presupuesto de rendimiento)

| Métrica | Objetivo | Qué significa |
|---|---|---|
| JavaScript inicial (comprimido) | ≤ 100 KB | Solo React ya ocupa unos 45 KB |
| Peso total de la primera carga, sin vídeo ni capturas | ≤ 300 KB | Menos que una foto hecha con el móvil |
| LCP: cuándo aparece el contenido principal | ≤ 2,5 s en móvil con 4G lento simulado | Umbral "bueno" de Google |
| CLS: saltos de la página mientras carga | < 0,1 | Nada se mueve mientras lees |
| INP: tiempo de respuesta al pulsar | < 200 ms | El menú responde al instante |
| Fotogramas por segundo | 60 en un portátil normal; ≥ 30 estables con la CPU frenada ×4 | Fluido también en móviles modestos |
| Lighthouse, rendimiento y accesibilidad (móvil) | ≥ 95 | Puntuación de Google sobre 100 |
| Vídeo de Capyroad | ≤ 2 MB y sin precarga | No gasta datos si no se mira |

### Cómo lo mido
Desde la fase 3, que es cuando ya hay algo animado, cada informe de fase incluye:
1. **El tamaño del build**, que da `vite build`.
2. **Lighthouse en modo móvil.** Simula un teléfono de gama media con 4G lento.
3. **Una medición de fotogramas con la CPU frenada ×4** en Chromium, para imitar un móvil
   modesto.

Si una métrica se sale del objetivo, se arregla antes de pasar a la siguiente fase.

### Red de seguridad
- **Si un dispositivo no llega a 60 fps,** las animaciones bajan solas a 30 fps. A esa
  velocidad sigue pareciendo un juego de 16 bits.
- **Con "reducir movimiento" activado en el sistema,** no hay intro ni animaciones grandes.
- **La vista `/cv/`** es una página de texto ultraligera que funciona en cualquier caso. (Se
  quita en la fase 8, a petición tuya. Sin JavaScript queda un aviso con los enlaces a los PDF.)

---

## Fase 0 — Cimientos

**Objetivo:** dejar el proyecto creado y todas las decisiones de diseño escritas antes de
dibujar nada.

**Qué se construye**
- El proyecto Vite + React + TypeScript, con la demo inicial de Vite eliminada.
- Herramientas de calidad:
  - **TypeScript en modo estricto**: avisa de más errores.
  - **oxlint**: detecta código sospechoso (es el linter que trae ahora la plantilla oficial de Vite; hace lo mismo que ESLint pero mucho más rápido).
  - **Vitest**: pruebas automáticas de la lógica.
  - **Chromium sin interfaz (Playwright)**, como dependencia de desarrollo, para sacar las
    capturas y hacer las mediciones de Lighthouse.
- La estructura de carpetas:

      src/
        scenes/      Pantallas completas: Título, Intro, Campamento
        components/  Piezas reutilizables: Window, RingMenu, StatBar...
        engine/      Motor: bucle de animación, pintor de sprites, entrada de teclado/táctil
        assets/      Sprites como rejillas, iconos, texturas
        content/     Tus textos en es.ts / en.ts y su tipo común
        styles/      tokens.css (paleta y medidas) y estilos globales
      docs/          Este documento y otros que vayan surgiendo
      references/    Tus fotos y el CV (privado, nunca se publica)
      media-src/     Capturas y vídeo de proyectos (sí se publican, ya optimizados)

- **Tres documentos de referencia:**
  - `CLAUDE.md`: las reglas que leeré en cada sesión nueva (stack, convenciones, TypeScript
    para principiante, no inventar datos sobre ti).
  - `PRODUCT.md`: quién eres, a quién va dirigida la web (reclutadores y responsables técnicos
    de backend), qué quieres que hagan (contactarte) y el tono.
  - `DESIGN.md`: la "biblia visual", con la paleta exacta (unos 32 colores con nombre), las
    fuentes, la resolución interna, las medidas de los marcos de ventana, los tiempos de
    animación en fotogramas y la lista de iconos del menú.
- **Una página de muestra** (`/dev/specimen`) con la paleta en cuadros de color y 2–3 fuentes
  candidatas escribiendo un párrafo real de tu bio. Solo existe mientras desarrollamos.

**Cómo se hace**
- El proyecto se crea con la plantilla oficial `react-ts` de Vite.
- `PRODUCT.md` y `DESIGN.md` se redactan con la skill **impeccable** (comandos `init` y
  `shape`) a partir del brief.
- Las fuentes salen de Google Fonts y se instalan con `@fontsource`, que las aloja dentro del
  proyecto en lugar de cargarlas de Google cada vez.

**Qué verás al terminar:** los tres documentos y la página de muestra en
`http://localhost:5173/dev/specimen`.

**Cómo compruebo que funciona:** `npm run build` y la comprobación de tipos terminan sin errores,
y la página de muestra carga a los tres tamaños.

**TypeScript que aprenderás**
- Qué es un archivo `.tsx`: JavaScript con tipos y JSX.
- Qué significa `strict: true` en `tsconfig.json`.
- Tu primer `type`.

**Decisiones que puedes cambiar**
- ✅ **Decidido: resolución interna 320×180** → ⚠️ **cambiada a 640×360 en la fase 2** (ver el
  informe de la fase 2). Las alternativas eran estas:
  - 320×180 tiene forma panorámica: llena las pantallas actuales sin bandas negras.
  - 256×224 es más fiel a la época, pero deja bandas a los lados que habría que decorar con un
    marco ornamental.
  - En móviles en vertical, cualquiera de las dos ocupa solo la franja superior. Las ventanas se
    abren entonces a pantalla completa por debajo y por encima.
- ✅ **Decidido: fuentes Jersey 10 (título y etiquetas del juego) y Pixelify Sans (texto de
  las ventanas).**
- ~~Commits~~ → **Decidido: git lo gestionas tú.** Yo no ejecuto ningún comando git (ni
  `init`, ni `commit`, ni `push`…) salvo que me lo pidas. Al cerrar cada fase te digo qué
  archivos han cambiado para que hagas tu commit.

**💬 Tus comentarios:**

  No hagas commits ya me encargare yo de hacerlos depues de cada fase
---

## Fase 1 — El aspecto de las ventanas

**Objetivo:** clavar el estilo de las ventanas antes de que nada se mueva. Es lo que el
visitante más tiempo va a mirar, porque ahí está tu contenido.

**Qué se construye**
- `tokens.css`: toda la paleta y las medidas como variables CSS (`--gold-3`, `--stone-2`…).
  Cambiar un color ahí lo cambia en toda la web.
- Componentes:
  - **Window**: panel con textura de piedra gris y marco biselado. Es la ventana base de todas
    las secciones.
  - **BannerWindow**: la barra superior azul con marco dorado de cuerda, que dice en qué
    sección estás.
  - **StatBar**: la barra horizontal roja para indicadores.
  - **Divider**: las líneas finas separadoras.
  - **HelpBar**: la línea de ayuda inferior ("Usa ←/→ para elegir").
  - **KeyHint**: las pistas de teclas arriba a la derecha ("ENTER SELECT · ESC EXIT").
- **La ventana STATS completa y estática**, con tu perfil, formación y experiencia reales.

**Cómo se hace**
- **Textura de piedra:** un azulejo de 32×32 píxeles generado por código con 3–4 grises,
  repetido como fondo. Al ampliarse con `pixelated` mantiene el grano de píxel.
- **Marco biselado:** varias capas de sombra interior de 1–2 píxeles, con luz arriba a la
  izquierda y sombra abajo a la derecha. Sin esquinas redondeadas ni desenfoques.
- **Marco de cuerda dorada:** dibujo un pequeño patrón de cuerda y lo aplico con
  `border-image`. Esa técnica corta una imagen en 9 trozos: las 4 esquinas se quedan fijas y los
  4 lados se repiten a lo largo del borde, así que el marco se adapta a cualquier tamaño.
- **Azul "tramado":** las consolas no podían hacer degradados suaves. En vez de un gradiente
  usamos un patrón de tablero de ajedrez con dos azules, que de lejos parece un tono intermedio.
  Esta técnica se llama *dithering*.
- **Apertura de ventana:** efecto persiana de arriba abajo en 6–8 fotogramas, con `steps()`.

**Qué verás al terminar:** una página `/dev/windows` con la ventana STATS a los tres tamaños de
pantalla, más el banner, las barras y la línea de ayuda por separado.

**Cómo compruebo que funciona**
- Capturas a los tres tamaños.
- Contraste de todos los textos con nivel AA de accesibilidad (la norma que garantiza que se
  lean bien).
- Que no aparezca barra de desplazamiento horizontal en el móvil.

**TypeScript que aprenderás**
- Tipar las *props* (los parámetros) de un componente:
  `type WindowProps = { title: string; children: ReactNode }`.
- Campos opcionales con `?`.
- Cómo TypeScript conoce los nombres de clase de un CSS Module.

**Decisiones que puedes cambiar:** el tono exacto de la piedra y del azul, el grosor de los
marcos y el tamaño del texto.

**💬 Tus comentarios:**

---

## Fase 2 — Personajes: tú y Null

**Objetivo:** que te reconozcas en tu sprite y reconozcas a Null **antes** de construir escenas
con ellos.

**Qué se construye**
- **El motor de sprites:** una función que pinta un fotograma de un sprite en una posición del
  canvas, con la opción de dibujarlo en espejo. Así una sola animación de caminar hacia la
  derecha sirve también hacia la izquierda.
- **Las animaciones como datos:** una lista de fotogramas con la duración de cada uno.
- **Tu avatar (32×40 px):**
  - De pie, respirando (2 fotogramas).
  - ~~Brazos cruzados~~: descartada el 11-11-2026; quizá añadas otras poses en los retoques
    finales.
  - Caminar hacia la cámara (8 fotogramas; ver `docs/animacion-caminar.md`).
  - Caminar de lado (8 fotogramas).
- **Null (24×20 px):**
  - Trote de lado y hacia la cámara.
  - Sentado jadeando, con la lengua animada.
  - De pie pidiendo, para "Null is waiting…".
  - Mover la cola de vez en cuando.
- **Retratos de 48×48 px** de los dos, para el HUD y la ventana STATS: el tuyo parpadea y el de
  Null jadea.
- **Los 6 iconos del menú (16×16 px):** chaleco para EQUIP, matraz para ALCHEMY, pergamino para
  STATS, mancuerna para BUFFS, paellera para CRAFT y carta para COMMS.

**Cómo se hace**
- Cada sprite se escribe como rejilla de letras sobre la paleta común de `DESIGN.md`, tomando
  como guía tus hojas de concepto. No se calcan: se redibujan limpios en la rejilla exacta.
- Prioridades de parecido:
  1. El **mullet rizado**.
  2. Las **gafas redondas**.
  3. El **bigote y la perilla**, sin barba.
- Null lleva la V color fuego en el pecho, las cejas color fuego y la barba.
- Contorno azul marino muy oscuro en vez de negro puro, para que tú y Null no desaparezcáis
  sobre fondos oscuros.

**Qué verás al terminar:** una página `/dev/sprites` con cada sprite animado a tamaño 1×, 4× y
8×, al lado de tus fotos y de las hojas de concepto. Esa página y tus fotos **solo existen en tu
ordenador mientras desarrollamos**: no entran en la web publicada.

**Cómo compruebo que funciona**
- Cada fotograma tiene exactamente el tamaño previsto.
- No hay píxeles semitransparentes.
- Las animaciones van a la velocidad definida.

**TypeScript que aprenderás**
- Describir un sprite con un tipo:
  `type Sprite = { width: number; height: number; frames: string[][] }`.
- **Tipos unión** para los nombres de animación (`'idle' | 'walkDown' | 'walkSide'`). TypeScript
  te avisa si escribes `'wlak'`.
- `Record`, para tablas del tipo "nombre de animación → fotogramas".

**Decisiones que puedes cambiar:** todo lo que sea parecido. Cuenta con 2–3 rondas de
ajustes ("el pelo más alto", "las gafas más grandes"…).

**Aviso honesto:** a 32×40 píxeles el parecido será **estilizado**, no un retrato. Se te
reconocerá por el pelo, las gafas y la perilla. El retrato de 48×48 tendrá más detalle. Si
después de los ajustes no te convence, el plan B es usar sprites PNG dibujados a mano, por ti o
por encargo. Se cambian sin tocar nada más.

**💬 Tus comentarios:**

---

## Fase 3 — Campamento y menú circular

> Actualizada al empezar la fase 3 (11-11-2026) para encajar con la fase 2: escena de 640×360,
> personajes a partir de tus imágenes y fondo generado por ti.

**Objetivo:** construir el corazón de la web. Tú y Null en el campamento, y el menú circular
funcionando con teclado, ratón y pantalla táctil.

**Qué se construye**
- **La escena del campamento en canvas (640×360):**
  - Tú de pie, respirando, en tu pose de frente. Null, sentado a tu lado. Los dos con una sombra
    tramada bajo los pies.
  - **El fondo lo has generado tú** (`references/grandes/campamento.jpg`, instrucciones en
    `docs/fondo-campamento.md`): boca de la cueva, claro, árboles con la barra de dominadas,
    hoguera con la paellera, tienda, mancuernas, discos y tarro de aceitunas.
    - Se usa tal cual, solo convertido a WebP (64 KB), ocupando todo el alto de la escena.
    - La llama de la hoguera parpadea: algunos de sus píxeles se apagan un poco, por turnos.
  - Los personajes se dibujan en el canvas desde sus PNG de la fase 2 y se apoyan por la fila
    del suelo (`ground`).
  - El canvas trabaja en píxeles reales de la pantalla. Así Null sentado, cuya imagen tiene
    píxeles de la mitad de tamaño, sale nítido.
- **El HUD inferior:**
  - Tu retrato abajo a la izquierda (la cabeza hasta la perilla) y el de Null abajo a la
    derecha, cada uno con su nombre.
  - Sin barras ni números inventados.
- **El bucle de juego (`useGameLoop`):**
  - Un único reloj compartido por todo lo que se mueve.
  - Se detiene si cambias de pestaña.
  - El canvas solo se redibuja cuando cambia algo.
- **La entrada (`useInput`):** teclado y deslizamientos con el dedo, traducidos a IZQUIERDA,
  DERECHA, CONFIRMAR y CANCELAR. Los clics y toques en los iconos son botones normales.
- **El menú circular (`RingMenu`):**
  - Los iconos de 16×16 se dibujan a 2 píxeles de escena por píxel, en un óvalo de 124×84
    alrededor de tu centro.
  - El seleccionado queda arriba, entre corchetes azules y con su nombre en verde sobre una
    placa oscura.
  - Gira en 8 fotogramas.
  - El banner superior muestra el nombre de la sección.
- **La máquina de estados** CAMPAMENTO ↔ VENTANA, con ventanas provisionales (el contenido real
  llega en la fase 4).
- **Secciones en borrador ocultas:** BUFFS y CRAFT no aparecen en la versión publicada. El menú
  funciona igual con 4, 5 o 6 opciones.
- **Pantallas en vertical (móvil y tablet):** se ve el centro de la escena (360 px de ancho), más
  grande, con el banner encima, el HUD debajo y las ventanas a todo lo ancho.

**Cómo se hace**
- **Tamaño de la escena:**
  - Se elige el número entero de píxeles de pantalla por píxel de escena que más llene la
    pantalla, para que todos los píxeles midan lo mismo.
  - Si eso dejara la escena por debajo del 80 % de lo que cabe, se usa el ajuste exacto: más
    grande, aunque algún píxel mida uno más que otro.
- **`--u` (el píxel de las ventanas)** = 2 píxeles de escena, entre 2 y 4 px. En un portátil de
  1440 vale 4 px, igual que cuando aprobaste las ventanas en la fase 1.
- **Posición de cada icono:** se reparten los 360° entre las opciones disponibles (con 4
  opciones, una cada 90°). Al girar, todos los ángulos avanzan a la vez hasta que el elegido
  queda arriba.
- **Los iconos son botones HTML** colocados sobre el canvas. Funcionan con el tabulador, con
  lectores de pantalla, con el clic y con el toque.
  - Un clic o un toque abre la sección directamente.
  - El toque se lee del propio dedo: tras un deslizamiento rápido los móviles pueden tragarse el
    "clic".
- **Accesibilidad:**
  - El menú usa el patrón "menu" de ARIA: cada icono es una acción que abre una ventana. Las
    flechas cambian de opción, Enter abre y el foco sigue al icono de arriba.
  - Las ventanas son `<dialog>` nativos. El tabulador da la vuelta dentro de la ventana y Esc la
    cierra.
  - La ventana tiene además un botón [ESC] EXIT para ratón y táctil. Al cerrarse, el foco vuelve
    al menú.
- **Móvil:** toque en un icono para abrirlo y deslizar el dedo para girar el anillo.

**Qué verás al terminar:** el campamento funcionando en la página principal. Podrás moverte por
el menú y abrir y cerrar ventanas con teclado, ratón o el móvil.

**Cómo compruebo que funciona**
- **Pruebas automáticas (Vitest)** de la máquina de estados (que no existan transiciones
  imposibles), del cálculo de ángulos y del ajuste a cada tamaño de pantalla.
- **`npm run check:camp`:** un recorrido completo solo con teclado (portátil) y solo con toques
  (móvil), con capturas.
- **`npm run fps`:** fotogramas por segundo con la CPU normal y frenada ×4, y tiempo de respuesta
  a teclas y clics.
- **Lighthouse** en móvil y escritorio, y capturas a los tres tamaños.

**TypeScript que aprenderás**
- **Uniones discriminadas**, el concepto más útil del proyecto. Un estado se escribe como
  `{ scene: 'HUB' } | { scene: 'WINDOW'; section: SectionId }`, y TypeScript solo te deja leer
  `section` cuando el estado es `WINDOW`.
- Tipar un `useReducer`.
- Crear tus propios hooks con tipos.

**Decisiones que puedes cambiar:**
- La velocidad de giro y el tamaño del anillo.
- Qué muestra el HUD: retratos y nombres, sin números inventados.
- Los títulos del banner, que he propuesto yo (están en `CONTENT.md`).
- La composición del fondo (`docs/fondo-campamento.md`).

**💬 Tus comentarios:**

---

## Fase 4 — Ventanas con tu contenido

> Actualizada al terminar la fase 4 (11-11-2026) con lo que se construyó.

**Objetivo:** todo tu contenido profesional real, en español e inglés.

**Qué se construye**
- **Archivos de contenido:**
  - `src/content/types.ts`: la forma que debe tener el contenido.
  - `es.ts`: copiado de `CONTENT.md`.
  - `en.ts`: lo traduzco yo y lo revisas tú, con los dos idiomas lado a lado en `/dev/textos`.
- **El sistema de idioma (`useLocale`):**
  - Detecta el idioma del navegador y recuerda tu elección.
  - Selector ES/EN en COMMS.
  - Actualiza el idioma declarado en la página para Google y los lectores de pantalla.
  - El banner, el anillo y el HUD también cambian de idioma.
- **Las 4 ventanas profesionales:**
  - **EQUIP:** lista de proyectos a la izquierda y detalle a la derecha (patrón de pestañas:
    ↑/↓).
    - **Capyroad** va primero, con la etiqueta DESTACADO, su vídeo y su captura.
    - **Pakito's Gambling** muestra tu parte: backend, ruleta, blackjack y Capyroad.
    - Las herramientas de **Bosa Digital** llevan la etiqueta CLASIFICADO y solo las tres frases
      del CV.
  - **ALCHEMY:** los dos rangos ("Dominio" y "He trabajado con"), agrupados por categoría.
  - **STATS:** tu retrato, ficha, formación y "registro de misiones".
  - **COMMS:** GitHub, LinkedIn, email, ubicación, disponibilidad y el selector de idioma.
- **Los medios optimizados (`npm run media`):**
  - Las capturas, en WebP, a dos tamaños.
  - El vídeo de Capyroad recortado a 14 s, sin audio y recortado a la app, en dos formatos.
  - Una imagen fija de portada para el vídeo.
- **Enlaces directos a cada ventana:** `/#equip`, `/#stats`… abren esa ventana al cargar, y la
  dirección cambia al abrir y cerrar ventanas, para poder compartirla.

**Cómo se hace**
- ffmpeg ya estaba instalado.
- **Las capturas y el vídeo NO se pixelan:** se muestran nítidos dentro del marco de la
  ventana, como una "pantalla dentro de la pantalla". La idea es que un reclutador vea tu
  trabajo real con claridad.
- **El vídeo** solo se reproduce, en bucle y sin sonido, con la ventana abierta. Con "reducir
  movimiento" se ve la imagen fija, con controles para reproducirlo si se quiere.
- **Cada ventana se descarga aparte** (unos 4 KB entre todas):
  - Se precargan en cuanto el campamento está en pantalla.
  - Una ventana solo aparece cuando su contenido está listo, así que no "salta".
- **Ventanas grandes y por secciones** (segunda ronda, a petición tuya):
  - Cada ventana cubre la escena (en el móvil, la pantalla entera).
  - El texto crece con la pantalla: 26 px en un portátil de 1440 (antes 20) y 39 px en uno de
    1920.
  - Su contenido se divide en secciones con pestañas: proyectos en EQUIP; Perfil, Formación y
    Registro de misiones en STATS; los dos rangos en ALCHEMY.
  - **La rueda del ratón cambia de sección.** Si una sección es más larga que la ventana, primero
    la recorre hasta el final; un giro cambia una sola sección.
  - En el móvil se desliza a los lados o se toca la pestaña. Una flecha dorada avisa cuando hay
    más debajo.

**Qué verás al terminar:** las 4 ventanas completas. **Tendrás que leer todos los textos en los
dos idiomas** (en `/dev/textos` los tienes juntos).

**Cómo compruebo que funciona**
- Si falta un texto en `en.ts`, el proyecto no compila: TypeScript lo detecta.
- Pruebas: los dos idiomas tienen los mismos textos en los mismos sitios y los mismos datos
  (enlaces, fechas, centros). Ni teléfono ni marcas TODO. Bosa Digital solo con sus tres frases.
  ALCHEMY sin niveles.
- **`npm run check:windows`:**
  - Las 4 ventanas en los dos idiomas a los tres tamaños, con capturas.
  - Los enlaces, el cambio de idioma y que se recuerde.
  - Las pestañas de EQUIP y el vídeo (silencio, bucle, "reducir movimiento").
  - Que nada pesado se descargue antes de abrir una ventana.
- Peso del vídeo y de las imágenes, Lighthouse y fotogramas.

**TypeScript que aprenderás**
- Cómo `const en: Content = {...}` obliga a que el inglés tenga exactamente los mismos campos
  que el español.
- Arrays de objetos tipados.
- Context de React con tipos.

**Decisiones que puedes cambiar:** la redacción de cualquier texto (en los dos idiomas) y el
tramo del vídeo.

**💬 Tus comentarios:**

---

## Fase 5 — Pantalla de título

**Objetivo:** que la primera impresión enganche.

**Qué se construye**
- **Fondo en canvas, dibujado en código con la paleta** (ocupa toda la pantalla):
  - Cielo azul noche casi negro con estrellas sueltas, que se aclara por bandas y tramas de
    puntos hasta una línea fina de brillo azul en el horizonte.
  - La montaña de la cueva, con la boca oscura a sus pies, y un bosque de abetos puntiagudos
    que se solapan, con un claro delante de la cueva (enlaza con la intro y el campamento).
- **"YERAY CATURLA"** en dorado con relieve, grande: 120 px en un portátil de 1440, 180 px en
  uno de 1920 y 60 px en el móvil (nunca más del 90 % del ancho).
- **Línea de créditos**, que cambia con el idioma: "DESARROLLADOR BACKEND · NODE.JS · EXPRESS ·
  JAVA · DOCKER · AWS" / "BACKEND DEVELOPER · …". La del instituto se quitó a petición tuya.
- **"PRESS START"**, que parpadea a saltos (32 fotogramas encendido, 16 apagado), nunca con un
  fundido suave.
- **El selector ES/EN** arriba a la derecha y **"SKIP INTRO"** abajo a la derecha.
  - De momento SKIP INTRO hace lo mismo que empezar, porque la intro llega en la fase 6.
  - **El enlace a la vista CV se pospone a la fase 7**, cuando exista `/cv/`: un enlace que no
    lleva a ningún sitio sería peor que no tenerlo.
- **La transición: fundido a negro por pasos de la paleta con trama de puntos** (¼ → ½ → ¾ →
  negro; 16 fotogramas en cada sentido, poco más de medio segundo en total). El campamento
  aparece mientras todo está negro, así que no se ve ningún salto.

**Cómo se hace**
- **El título es texto real**, no una imagen, para que lo lea Google. El relieve dorado se
  consigue con bandas de color duras y sombras superpuestas sin desenfoque. No usamos ninguna
  tipografía ni logotipo de ningún juego.
- **Cualquier tecla, clic o toque arranca la partida**, salvo:
  - Tab (para moverse por los botones), Escape y las teclas modificadoras.
  - Pulsar los botones ES/EN, que solo cambian el idioma.
- **El campamento se descarga mientras miras el título**, así que la transición lo descubre ya
  listo.
- **Un enlace a una ventana (`/#equip`) se salta el título** y la abre directamente; `/#camp`
  lleva al campamento (lo usan las comprobaciones).
- Con **"reducir movimiento"**, PRESS START no parpadea y el campamento aparece al instante.

**Qué verás al terminar:** la pantalla de título y la transición enlazadas con el campamento.

**Cómo compruebo que funciona**
- **`npm run check:title`:**
  - Capturas en los dos idiomas a los tres tamaños.
  - Qué la arranca (tecla, clic, toque, SKIP INTRO) y qué no (Tab, ES/EN).
  - Los cinco pasos de la transición.
  - Que el campamento se descargue durante el título.
  - Los enlaces que se lo saltan y "reducir movimiento".
- Pruebas del paso de pantallas (`screens.ts`) y del tamaño del título.
- Repetir `check:camp`, `check:windows`, Lighthouse y fotogramas.

**TypeScript que aprenderás:** los tipos de los eventos del navegador (`KeyboardEvent`,
`MouseEvent`) y una máquina de pantallas con una unión discriminada y `useReducer`.

**Decisiones que puedes cambiar:** el efecto de transición, el texto de los créditos (y si se
traduce) y el paisaje del fondo (podrías generar una imagen como la del campamento).

**💬 Tus comentarios:**

---

## Fase 6 — Intro: salida de la cueva

**Objetivo:** una pequeña escena que cuenta "este soy yo" antes de enseñar el menú.

**Qué se construye**
- **La escena:**
  - La cueva es la de tu imagen del campamento, así que **la intro y el campamento son la misma
    escena** y no hace falta otra transición.
  - El fundido del título te descubre en la boca de la cueva, con Null un paso detrás, a tu
    derecha.
  - Bajas caminando hacia la cámara hasta tu sitio. Null sale un poco después, te sigue unos
    pasos por detrás, trota hasta su sitio y se sienta.
  - Al llegar, **el anillo se abre** desplegándose desde tu cintura mientras gira, y aparecen el
    banner y los retratos.
  - Dura **4,7 s** en total, con la apertura del anillo.
- **Las reglas de la intro:**
  - "SKIP INTRO" se ve desde el primer fotograma (en el título y en la intro).
  - **Se salta con** SKIP INTRO, cualquier tecla (también Escape), un clic o un toque.
  - **Quien ya ha llegado al campamento una vez** entra directamente en él la próxima vez (se
    recuerda en el navegador). `/#title` enseña siempre el título.
  - Con **"reducir movimiento"**, PRESS START lleva directo al campamento y el anillo no se
    despliega.
  - **Si cambias de pestaña, la escena se pausa** y sigue donde estaba al volver.

**Cómo se hace**
- **La intro es un "guion" de datos** (`src/scenes/camp/intro.ts`): una lista de pasos como
  "espera 0,5 s" o "camina hasta (320, 310) a 60 px/s". Los tiempos se cambian editando la lista;
  el reproductor (`src/game/script.ts`) no se toca.
- **Velocidades pensadas para que los pies no patinen:** tú, 60 px/s (un ciclo de 0,96 s cada
  58 px); Null, 68 px/s andando y 90 trotando.
- **El banner y los retratos ocupan su sitio durante la intro, pero no se ven:** al aparecer no
  se mueve nada.
- **Los dibujos de Null andando solo se descargan si hay intro** (27 KB). Quien entra por un
  enlace o vuelve no los necesita.

**Qué verás al terminar:** el recorrido completo desde el título hasta el menú.

**Cómo compruebo que funciona**
- Pruebas del guion (duración, posiciones, que terminen justo donde el campamento os dibuja, que
  Null vaya detrás), de la máquina de pantallas y de la apertura del anillo.
- **`npm run check:intro`:**
  - Capturas a los tres tamaños.
  - Cuánto dura.
  - SKIP en cualquier momento y de todas las formas.
  - El foco en el anillo al terminar.
  - Que no se mueva nada al aparecer el banner.
  - La segunda visita, `/#title` y "reducir movimiento".
  - La pausa al cambiar de pestaña.
- Fotogramas de la intro con la CPU ×4, Lighthouse y el resto de comprobaciones.

**TypeScript que aprenderás:** otra unión discriminada, ahora para los pasos del guion
(`{ type: 'walk'; to: Point; … } | { type: 'wait'; ms: number; … }`).

**Decisiones que puedes cambiar:** la duración, el recorrido, si Null hace algo especial al
llegar (por ejemplo, ponerse a pedir) y si quien vuelve debe ver el título.

**💬 Tus comentarios:**

---

## Fase 7 — Vista CV, calidad y accesibilidad

**Objetivo:** que la web funcione para todo el mundo, también para quien tiene prisa.

**Qué se construye**
- **La página CV** (`/cv/` en español y `/cv/en/` en inglés):
  - Tu CV en texto limpio, generado al compilar con los mismos archivos de contenido que el
    juego. Así nunca puede quedar desactualizado respecto a él.
  - Es **HTML sin nada de JavaScript**: pesa 39 KB, aparece en 1,2 s y Google la lee tal cual.
  - Contacto, perfil, experiencia, formación, proyectos y stack.
  - Botón para descargar el PDF, enlace al otro idioma y enlace para volver al juego.
  - **Se imprime bien**: tinta sobre papel, sin botones, en 3 hojas A4.
  - El PDF es el tuyo tal cual (`npm run cv` lo copia). Solo existe en español, y la versión
    inglesa lo dice en el botón.
- **"VER CV" / "VIEW CV" siempre visible** en el título, la intro y el campamento:
  - Arriba a la izquierda, y es la primera parada al tabular.
  - En el móvil y la tablet en vertical, el campamento lo pone entre los dos retratos, donde no
    lo tapa el banner y llega el pulgar.
  - Además, **COMMS tiene dos filas nuevas**: el CV en versión web y el PDF para descargar.
- **Lo que se ve al compartir el enlace**, generado desde el contenido:
  - El título y la descripción de cada página, en su idioma.
  - La imagen de vista previa: una captura de la pantalla de título, 1200×630, hecha con
    `npm run share`.
  - El icono de la pestaña: la cara de Null tal cual, sin redibujar.
- **Los archivos para buscadores:**
  - `robots.txt` siempre.
  - El `sitemap.xml`, la dirección canónica y la URL completa de la imagen al compartir llegan
    cuando se fije **`SITE_URL`**, la dirección final, en la fase 10 (Cloudflare Pages + tu
    dominio .dev).
- **La red de seguridad de los 30 fps:** si un dispositivo no aguanta 60 fps, el juego pasa a
  30 constantes en lugar de dar tirones.

**Cómo se hace**
- **La skill impeccable:**
  - una auditoría técnica (`audit`): 17/20;
  - un repaso de detalles (`polish`): zonas táctiles de 44 px en el móvil, puntos de referencia
    para lectores de pantalla y sin palabras sueltas al final de los párrafos;
  - DESIGN.md reorganizado desde lo construido (`document`), con la idea central "La hoguera del
    campamento".
- **Lighthouse** en el título, el campamento, EQUIP y las dos vistas CV: entre 98 y 100 en todo.
- **Recorridos completos:** solo con teclado, solo con táctil y revisando el árbol que leen los
  lectores de pantalla.

**Qué verás al terminar:**
- La web completa.
- Los informes de Lighthouse, en `.screenshots/fase-7/lighthouse/`.
- La lista final de TODOs: BUFFS, CRAFT, el PDF en inglés y `SITE_URL`.

**Cómo compruebo que funciona**
- Ningún error en la consola.
- Sin desplazamiento horizontal a ningún tamaño.
- Contraste AA en todos los textos, también en la vista CV y al imprimir.
- Todas las pruebas y comprobaciones en verde, con una nueva: **`npm run check:cv`**.

**TypeScript que aprenderás:** nada nuevo. Es una fase de repaso: el informe señala dónde se usa
cada concepto aprendido.

**Decisiones que puedes cambiar:**
- El diseño de la vista CV: ahora es sobria con detalles retro (el nombre dorado, los títulos con
  la letra del juego y las viñetas cuadradas).
- Dónde va "VER CV".
- Los textos de compartir.

**💬 Tus comentarios:**

---

## Fase 8 — Mejoras del portfolio

> Fase añadida el 17/11/2026, tras revisar la fase 7. Lista de cambios que pediste.

**Objetivo:** pulir lo que ya funciona con tus cambios: la rueda más clara, tus retratos nuevos y
los personajes como tú quieres, antes de repasar el código y publicar.

**Cambios en las secciones (17/11/2026):**
- **BUFFS y CRAFT desaparecen** del todo: de la rueda y del código (bloque H).
- **Llega una sección nueva, "Sobre mí".** Su icono ya está, pero cómo se organiza queda
  pendiente y no es prioritario. No entra en esta fase.

### Lo que necesito de ti

| Qué | Dónde dejarlo | Para qué bloque | Estado |
|---|---|---|---|
| Las referencias de los iconos | `references/icons/` | C | ✅ Ya están (las 8) |
| Las referencias nuevas de Null caminando de frente | `references/grandes/null_front_walk_animation.jpg` | G | ✅ Ya está (8 fotogramas, 19/11) |
| De lado: solo si el diagnóstico dice que también falla | `references/grandes/` | G | Según diagnóstico |
| Las 6 acciones en reposo elegidas, una hoja de fotogramas por acción | `references/grandes/reposo/` | K | Pendiente |

Ya están en `references/`:
- el CV en inglés (`cv_en_yeray_caturla.pdf`);
- los retratos nuevos (`portraits/portrait_yeray.jpg` y `portraits/portrait_null.jpg`);
- los 8 iconos (`icons/`).

### Orden de trabajo

Todo menos K se puede hacer ya. K empieza en cuanto me pases las hojas de fotogramas. Si llegan
tarde, te enseño la fase en dos rondas.

### A. El CV en inglés

**Qué se construye**
- `npm run cv` copia también `references/cv_en_yeray_caturla.pdf`, tal cual, a
  `public/cv/yeray-caturla-cv-en.pdf`.
- **Cada idioma descarga su PDF:**
  - la fila "CV en PDF" de COMMS;
  - el icono del CV en la rueda (bloque C).
- Desaparece el aviso de que el PDF solo existe en español.

**A tener en cuenta:** pesa 3,1 MB, como el español, por la foto.

### B. La rueda: el intercambio y los nombres reales

**1. El intercambio**
- **EQUIP** (el equipamiento) pasa a ser tu **stack técnico**.
- **ALCHEMY** (la alquimia) pasa a ser tus **proyectos**.
- El contenido de las ventanas no cambia; solo cambia qué sección es cuál.
- Los títulos de las ventanas quedan así: "Equipo — Stack técnico" y "Alquimia — Proyectos".

**2. Los nombres reales**
- Los seis elementos de la rueda (las cuatro secciones, más el CV y el idioma del bloque C)
  llevan su nombre real:

  | | Español | Inglés |
  |---|---|---|
  | Proyectos | PROYECTOS | PROJECTS |
  | Stack | STACK | STACK |
  | Perfil | PERFIL | PROFILE |
  | Contacto | CONTACTO | CONTACT |
  | CV | CV | CV |
  | Idioma | IDIOMA | LANGUAGE |

- Como ahora dependen del idioma, esos nombres pasan a los archivos de contenido (`es.ts` y
  `en.ts`).
- El nombre de juego (EQUIP, ALCHEMY, STATS, COMMS) sigue en el título de la ventana.
- **Orden propuesto:** Proyectos, Stack, Perfil, Contacto, CV, Idioma. Proyectos va primero
  porque es lo que más mira un reclutador, y las dos acciones van juntas al final.

**3. Siempre visibles**
- Hoy solo se ve el nombre del icono activo, encima de la rueda.
- Ahora **cada icono lleva su nombre todo el rato**, también mientras gira.
- **Encima del icono, no debajo** (cambiado al hacerlo, 19/11/2026): el icono de abajo de la
  rueda queda bajo tus botas, casi en el borde de la escena, y en el móvil su nombre no cabe
  debajo.
- El activo sigue destacado con los corchetes azules y su nombre más brillante. Los demás, en un
  tono más apagado, pero con contraste AA (un par nuevo en `CONTRAST_PAIRS`).
- **El riesgo es el móvil.** A 390 px, seis nombres alrededor de ti podrían tocarse o tapar la
  hoguera. Además, en la fase 3 vimos que con seis huecos el icono de arriba a la izquierda tapa
  la paellera del fondo. Ajusto el tamaño de los iconos y la letra, y la forma de la rueda, hasta
  que no pase. Las capturas a los tres tamaños lo demuestran.

**4. El código**
- Los identificadores internos pasan a decir lo que son: `projects`, `stack`, `profile` y
  `contact`, en lugar de `equip`, `alchemy`, `stats` y `comms`.
- Los enlaces directos cambian igual: `/#projects`, `/#stack`… La web aún no está publicada,
  así que nadie tiene guardados los antiguos.
- Actualizo con ello `CONTENT.md`, `BRIEF.md`, `DESIGN.md`, `CLAUDE.md` y los scripts de
  comprobación.

### C. Iconos nuevos, todos dentro de la rueda

**Tus referencias** (`references/icons/`, 1024×1024 cada una, pixel art):

| Archivo | Elemento de la rueda |
|---|---|
| `alchemy_icon.jpg` (el frasco azul) | Proyectos |
| `equip_icon.jpg` (el chaleco) | Stack |
| `stats_icon.jpg` (la silueta) | Perfil |
| `contact_icon.jpg` (el teléfono) | Contacto |
| `cv_icon.jpg` (el pergamino) | CV |
| `spain_icon.jpg` y `uk_icon.jpg` | Idioma |
| `aboutme_icon.jpg` (el libro) | Sobre mí, cuando llegue. Lo dejo preparado |

**Cómo los uso** (actualizado al hacerlo, 19/11/2026)
- Un script nuevo, `npm run icons`, les quita el fondo y los guarda sin redibujar nada.
- **No pueden ir "tal cual":** están dibujados con 80–250 píxeles de lado, y el hueco de la rueda
  mide 28 píxeles de escena. Tal cual, cada icono sería tan grande como tu personaje.
- **Así que el script los reduce a la rejilla de la escena:** cada píxel del icono es la media de
  los píxeles de tu imagen que tapa, y mide lo mismo que un píxel tuyo o de Null.
- **Un contorno claro de 1 píxel**, sin desenfoque, para que los oscuros (chaleco, silueta,
  teléfono) se vean sobre la tierra del campamento.
- Sustituyen a los iconos de 16×16 que dibujé yo en `icons.ts`, que desaparecen.
- Conservan sus colores, como los personajes. `CLAUDE.md` lo dice.

**CV**
- Al elegirlo, se abre una **ventana de confirmación** con el estilo del juego: "¿Descargar el
  CV en PDF?", con **SÍ** y **NO** (en inglés, "Download the CV as a PDF?", **YES** y **NO**).
- La ventana dice también el idioma y el peso del archivo (PDF · 3,1 MB). Así nadie se lleva
  una sorpresa con los datos del móvil.
- **SÍ** descarga el PDF del idioma en el que estés (bloque A) y cierra la ventana. **NO**,
  Escape o tocar fuera la cierran sin descargar.
- **Cómo se maneja:**
  - con teclado: ←/→ para elegir, Enter para confirmar. Empieza marcado SÍ;
  - con ratón o dedo: un clic o un toque en el botón.
- Al cerrarse, la rueda recupera el foco en el icono del CV, como al cerrar cualquier ventana.
- Usa la misma ventana que el resto de secciones (`Window`), así que no hay estilos nuevos.
- **Es un único componente** (`CvDownloadDialog`), que usan la rueda y el pergamino del título
  (bloque I). Los dos se comportan exactamente igual.

**Idioma**
- Muestra la bandera del idioma actual: España en español y Reino Unido en inglés.
- Al elegirlo, cambia al otro idioma al momento. Tampoco abre ventana.
- Su nombre para lectores de pantalla dice el idioma con palabras ("Cambiar a English"). Así no
  depende solo de la bandera, que no todo el mundo asocia a un idioma.

**Por qué en la rueda:** todo se hace desde el mismo menú del juego, sin botones sueltos que
rompan la experiencia. Se manejan como el resto: flechas y Enter, ratón o dedo.

### D. Retratos nuevos

**Qué se construye**
- `portrait_yeray.jpg` y `portrait_null.jpg` sustituyen a los retratos actuales del HUD.
- Pasan por `npm run characters`: rejilla nativa y tal cual, sin redibujar.

**A tener en cuenta**
- Los nuevos son cuadrados y traen su propio marco dorado y fondo azul oscuro.
- El HUD ya pone un marco de piedra alrededor.
- Propongo usarlos **tal cual, con su marco dorado**, y quitar el marco de piedra del retrato
  para no tener dos marcos. El HUD cambia su medida a la de los retratos nuevos.
- Tu retrato lleva también el tono de piel nuevo (bloque F).
- **Cambiado al hacerlo (19/11/2026, a petición tuya), en dos rondas:**
  1. tu retrato pasa a ser tu cara del juego ampliada, para no perder el estilo pixel art;
  2. vuelve el marco de piedra del HUD (sin el marco dorado de los retratos), y tu cara se ve más
     grande (×3 respecto a Null, del pelo a la barbilla);
  3. al final, un poco menos (×2): del pelo a los hombros, con el cuello y algo de ropa.

  El retrato de Null es su imagen sin el marco dorado.

### E. Favicon con tu cara

- `npm run share` hace el icono de la pestaña (`favicon.png`) y el de iPhone
  (`apple-touch-icon.png`) con **tu cara**: la cabeza de tu dibujo del juego (hecho: de tu pose
  quieta, no del retrato, porque a ese tamaño solo encaja sin reescalar).
- Hasta ahora era la de Null.
- A 32 px solo cabe la cabeza, así que recorto del pelo a la barbilla y la amplío por un número
  entero, sin suavizar.
- Lleva el mismo tono de piel que elijas en el bloque F.
- La imagen para compartir (`og-image.png`) no cambia.

### F. Tu tono de piel, más claro

**Qué cambia**
- **Solo el color de los píxeles de piel**: cara, cuello, brazos y manos.
- Afecta a todos tus dibujos: quieto, caminar de frente y de lado, y el retrato.
- La forma, los fotogramas y la animación quedan exactamente igual.

**Cómo se hace**
- Lo hace el propio generador (`npm run characters`), nunca a mano sobre los PNG. Así se puede
  repetir siempre igual.
- Después de pasar tu referencia a su rejilla nativa, aplica una **tabla de colores**: "tono de
  piel actual → tono nuevo".
- Los tonos de piel son pocos: luz, medio, sombra y contorno. Cada uno se cambia por uno nuevo
  del mismo orden de claro a oscuro, así las sombras siguen donde estaban.
- **El sello del caminar no se toca.** La cabeza estampada en cada fotograma recibe el mismo
  cambio, así que sigue siendo idéntica en todos.
- **Cuidado con los marrones parecidos.** La barba, las cejas, el pelo, el chaleco y la mochila
  tienen tonos cercanos a la piel. La tabla solo se aplica dentro de las zonas de piel y una
  comprobación lo vigila.

**Cómo eliges el tono:** te enseño tres tonos en `/dev/personajes`, junto a la referencia, a la
misma escala que en la web. Eliges uno.

**Comprobaciones automáticas**
- Mismas medidas y mismos píxeles opacos que antes.
- Los únicos píxeles que cambian son los de la tabla de piel.
- Las comprobaciones de calidad del caminar siguen pasando.

**Regla del proyecto:** hasta ahora era "nunca repintar". Pasa a tener una excepción escrita en
`CLAUDE.md`: el color de piel, con una tabla fija y desde el generador.

### G. El caminar de Null

> Hecho el 19/11/2026: diagnóstico y resultado en `docs/animacion-caminar.md`, sección 8. Null
> ya no trota de lado en la intro (su dibujo de lado es más pequeño): baja de frente hasta su
> sitio.

**Cómo está hoy**
- **De lado:** 6 dibujos de `null_caminando.jpg`, a 110 ms cada uno.
- **De frente:** 3 dibujos de `null_frente.jpg`, en ida y vuelta (0-1-2-1), a 160 ms cada uno.

**Primero, el diagnóstico.** Antes de cambiar nada, escribo qué falla exactamente en
`docs/animacion-caminar.md` (una sección nueva para Null). Puede ser:
- el orden de los fotogramas;
- dibujos de distinto tamaño, que hacen que el perro dé saltitos;
- patas que patinan porque su velocidad de avance no cuadra con el paso;
- el ritmo.

Te lo enseño en `/dev/personajes`, con la tira de fotogramas.

**Después, con tus referencias nuevas** (`null_front_walk_animation.jpg`: 8 fotogramas de
frente, en dos filas de 4)
- Uso el mismo método que con tu caminar: hojas de fotogramas en su rejilla nativa, el sello si
  sirve para un perro, y sus comprobaciones de calidad.
- Ajusto su velocidad en la intro y el campamento para que las patas no patinen.
- Miraré también `null_camina_frente.jpg` y `null_camina_lado.jpg`, que ya están en
  `references/grandes/` y no se usan.

### H. Fuera BUFFS y CRAFT

- Se borra todo lo suyo: las secciones, sus textos en `es.ts`, `en.ts` y `CONTENT.md`, sus
  iconos y sus menciones en `BRIEF.md`, `DESIGN.md` y las pruebas.
- Sus objetos siguen en el fondo del campamento, porque son parte de tu imagen.
- El mecanismo de "borrador" (secciones que solo se ven mientras desarrollamos) se queda: lo
  usará "Sobre mí" hasta que tenga contenido.

### I. Fuera la vista CV web

**Qué se quita**
- Las páginas `/cv/` y `/cv/en/`, con su estilo (`src/cv/cv.css`) y sus archivos de entrada
  (`cv/index.html` y `cv/en/index.html`).
- La parte de `src/site/html.ts` que genera el CV. **Se queda** la que genera las etiquetas
  `<head>` de la página del juego: título, descripción e imagen al compartir.
- El enlace **"VER CV" / "VIEW CV"** de la intro y del campamento (`CvLink`). En el título se
  cambia por el pergamino del CV (abajo).
- La fila **"CV — Versión web"** de COMMS. Se queda la del PDF.
- La comprobación `npm run check:cv`. Lo que sigue teniendo sentido (los PDF, las etiquetas
  `<head>` y los iconos) pasa a otra comprobación.
- Las menciones en `BRIEF.md`, `PRODUCT.md`, `DESIGN.md`, `CLAUDE.md` y en este plan.

**Lo que cambia para el visitante**
- **El CV en la pantalla de título (tu decisión, 17/11/2026).** Donde estaba "VER CV", arriba a
  la izquierda, va el **pergamino del CV** con su nombre ("CV"):
  - al pulsarlo se abre **la misma ventana de confirmación que en la rueda** (bloque C);
  - **no empieza el juego.** Hoy cualquier tecla, clic o toque en el título empieza. El
    pergamino y todo lo que pase dentro de la ventana quedan fuera de eso, como ya pasa con
    Tab y con ES/EN;
  - con teclado, es la primera parada al tabular, como lo era "VER CV";
  - zona táctil de 44 px;
  - al cerrar la ventana, el título sigue como estaba, esperando a que empieces.
- **Dónde está el CV en cada pantalla:**
  - **Título:** el pergamino, arriba a la izquierda.
  - **Intro:** sin acceso. Dura 4–6 s y SKIP INTRO lleva al campamento.
  - **Campamento:** el CV de la rueda.
  - **Quien vuelve** entra directo al campamento, con la rueda.

  Así el CV está a un paso nada más llegar, como pide la idea de "el juego invita, nunca
  bloquea".
- **Sin JavaScript** ya no habría nada que leer. Propongo un `<noscript>` mínimo en la página del
  juego, con los dos enlaces a los PDF. No se ve nunca salvo en ese caso.
- **Google** sigue leyendo el título y la descripción de la página. Los textos de las ventanas
  los lee peor que una página de texto, porque los pinta JavaScript. Para un portfolio que se
  comparte por enlace importa poco.
- La red de seguridad para móviles lentos (30 fps y "reducir movimiento") sigue igual.

### J. Iconos del stack técnico

> Hecho el 19/11/2026 con la opción B. Sin logo en Simple Icons: SQL y APIs REST (no tienen), Java
> y Oracle (retirados por su empresa), AWS y WSL. Llevan un icono genérico: tabla, flechas, taza,
> base de datos, nube y terminal.

> Añadido el 17/11/2026.

**Para qué:** que cada tecnología de la ventana Stack se reconozca de un vistazo, con su icono al
lado del nombre.

**Qué se construye**
- **Un icono por tecnología**, a la izquierda de su nombre. Son 22, las mismas en español y en
  inglés:
  - **Dominio:** JavaScript, Java, Python, SQL, Node.js, Express, APIs REST, React, PostgreSQL,
    Docker, AWS, Linux, WSL, Git y GitHub.
  - **He trabajado con:** PHP, Django, HTML, CSS, Oracle Database, MongoDB y Terraform.
- **Todos al mismo tamaño**, a la altura de una línea de texto, y escalados por números enteros,
  como el resto del pixel art.
- **SQL y APIs REST** no tienen un logo propio conocido: necesitan un icono genérico (por
  ejemplo, una tabla y dos flechas).

**De dónde salen los iconos: opción B (tu decisión, 19/11/2026)**
- Los logos oficiales en SVG de **Simple Icons**, un catálogo de logos de tecnologías con licencia
  libre (CC0).
- Un script nuevo, `npm run stack-icons`, los pasa a píxeles:
  - a un tamaño fijo, de 16×16 o el que mejor se lea a la altura del texto;
  - sin suavizado: cada píxel está pintado o vacío, como el resto del pixel art;
  - en un solo color de la paleta, para que encajen con las ventanas.
- El script se ejecuta una vez y guarda el resultado en el proyecto. La web no depende de Simple
  Icons.
- **Si alguna marca no está en Simple Icons** (algunas empresas han pedido retirar su logo), uso
  un icono genérico. Lo compruebo al empezar y te digo cuáles son.
- **Si algún logo no se reconoce a 16 px** (los que llevan letras pequeñas), pruebo un tamaño
  mayor para todos o un icono genérico para ese.
- **Iconos genéricos** (SQL, APIs REST y los que falten): los dibujo yo en píxeles, como los
  iconos de la rueda que había hasta ahora. No son personajes, así que la regla de "tal cual" no
  se aplica.

Usar el logo de una tecnología para decir que la usas es lo habitual en un portfolio. Lo que hay
que evitar es que parezca que la marca te patrocina.

**Cómo se hace**
- **Los iconos van juntos en una sola imagen** (un "atlas"), en vez de 22 archivos sueltos. Se
  descarga una vez, junto con la ventana, y cada icono es un recorte de ella.
- **Los textos no cambian.** Las tecnologías siguen en `es.ts` y `en.ts`. Cada una lleva un
  identificador (`'react'`, `'docker'`…) que dice qué icono le toca.
- **Para los lectores de pantalla los iconos son decorativos.** El nombre ya está en texto, así
  que no se lee dos veces.

### K. Animaciones en reposo: que no estéis quietos

> 19/11/2026: hechas las de Null (ladear la cabeza, mover la cola, rascarse la oreja) y el
> "director". 20/11/2026: arreglado el fallo de Null que desaparecía, y hechas las tuyas (gafas,
> café, pensar) con tus hojas nuevas (`*_new.jpg`), hechas desde tu dibujo del juego. Ronda 2
> (20/11, tras tu revisión): el café ya no se rompe, y los gestos salen cada 3–6 s por rondas
> (los seis por turnos), también mientras se usa la rueda.

> Añadido el 19/11/2026.

**Para qué:** en el campamento, hoy estás siempre de pie con los brazos abajo y Null sentado, los
dos con una respiración de 1 píxel. La idea es que, de vez en cuando, cada uno haga algo, como en
los juegos de la época cuando dejas el mando.

**Cómo funcionaría**
- **Tras unos segundos sin tocar nada** (propongo 6–10 s, al azar), uno de los dos hace una
  acción de una lista, la termina y vuelve a su pose de siempre.
- **Nunca repite la misma acción dos veces seguidas** y nunca actúan los dos a la vez, salvo en
  las acciones pensadas para los dos.
- **Se interrumpe al momento** si el visitante toca algo: girar la rueda o abrir una ventana
  devuelve al personaje a su pose base en el siguiente fotograma.
- **Con "reducir movimiento"** no hay acciones, solo la respiración de siempre.
- **No pesan en la carga inicial.** Las animaciones se descargan después de que el campamento
  esté listo. Si aún no han llegado, simplemente no se usan.
- **Cuidado con la rueda.** Los iconos y sus nombres están alrededor de ti. Las acciones que
  sacan los brazos de tu silueta (estirarse, saludar) tienen que caber sin tapar ningún icono.
  Lo compruebo en las capturas.

**Ideas para ti (Yeray)**

| Acción | Qué hace | Por qué encaja | Fotogramas aprox. |
|---|---|---|---|
| Ajustarse las gafas | Sube una mano y se recoloca las gafas | Pequeña, no sale de tu silueta | 3–4 |
| Café | Saca una taza, bebe un sorbo y la baja | El tópico del desarrollador, se entiende al momento | 5–6 |
| Mirar el portátil | Abre un portátil pequeño, teclea un poco y lo cierra | Dice "backend" sin palabras | 6–8 |
| Pensar | Mano en la barbilla, mira a un lado | Muy barata y expresiva | 3–4 |
| Estirarse | Brazos arriba, se estira y vuelve | La más visible. Ojo con los iconos de arriba de la rueda | 4–6 |
| Bostezar | Boca abierta y mano delante | Le da vida tras un rato largo sin tocar nada | 3–4 |
| Saludar | Levanta la mano y saluda | Al llegar al campamento o al cerrar una ventana | 3–4 |
| Calentarse las manos | Se gira hacia la hoguera y extiende las manos | Usa el fondo del campamento | 4 (de lado) |

**Ideas para Null**

| Acción | Qué hace | Por qué encaja | Fotogramas aprox. |
|---|---|---|---|
| Ladear la cabeza | Inclina la cabeza a un lado, como cuando oye algo | La más tierna y la más barata | 2–3 |
| Mover la cola | Sentado, mueve la cola | Se puede repetir a menudo sin cansar | 2–3 en bucle |
| Rascarse la oreja | Con la pata trasera | Clásica de perro, muy reconocible | 4–6 |
| Bostezar | Abre mucho la boca y se relame | Pareja del bostezo tuyo | 3–4 |
| Tumbarse y dormir | Se tumba, cierra los ojos y salen "Z" | Para cuando el visitante lleva mucho rato sin tocar nada | 4 + 2 en bucle |
| Olfatear | Baja el hocico al suelo y lo mueve | Fácil de leer incluso a tamaño pequeño | 3–4 |
| Sacudirse | Se sacude entero | Muy dinámica | 4–6 |
| Estirarse | Patas delanteras estiradas y el trasero arriba | Muy de perro | 3–4 |

**Ideas para los dos**
- **Acariciar a Null:** te agachas, le acaricias y él mueve la cola.
- **Lanzarle algo:** lanzas un palo fuera de la escena, Null sale corriendo y vuelve con él.

Son las más bonitas, pero también las más difíciles: os tenéis que mover en coordinación, y
Null sale de su sitio. Propongo dejarlas para más adelante.

**Elegidas (19/11/2026), las que propuse:**
- **Tú:** ajustarte las gafas, el café y pensar.
- **Null:** ladear la cabeza, mover la cola y rascarse la oreja.

Son las que mejor se leen, las que menos se salen de la silueta y las más baratas de generar.
Luego se pueden añadir más sin tocar el código: cada acción es una línea de datos.

**Lo que necesito de ti por cada acción**
- **Una hoja de fotogramas en fila**, como `front_walk_animation.png`:
  - fondo liso;
  - el mismo estilo, tamaño y ropa que tu pose quieta de frente (o la de Null sentado);
  - de frente, salvo "calentarse las manos".
- **El primer y el último fotograma, iguales a la pose base**: tu pose quieta de ahora, o Null
  sentado. Así la acción empieza y termina sin salto.
- **Si la cabeza no se mueve en la acción**, mejor que sea la misma en todos los fotogramas.
  Así puedo estampar la cabeza aprobada, como con el sello del caminar, y no cambia de un
  fotograma a otro.
- **El orden y, si quieres, el ritmo**: por ejemplo, "el fotograma 3 se queda medio segundo, que
  es el sorbo".
- **Dónde dejarlas:** `references/grandes/reposo/`, con nombres como `yeray_gafas.png` o
  `null_cola.png`.

**Cómo las uso**
- `npm run characters` las pasa a su rejilla nativa y las guarda tal cual, como el resto de tus
  sprites. Tu piel nueva (bloque F) se les aplica sola.
- Cada acción es una pose más en `characters.ts`, y un pequeño "director" elige cuál toca y
  cuándo.
- Las comprobaciones de calidad vigilan lo mismo que en el caminar: tamaño, apoyo en el suelo y
  que la cabeza no tiemble.

### M. Barras de vida y experiencia en el HUD

> Añadido el 19/11/2026, a petición tuya: "para que la inmersión aumente".

- Al lado de cada retrato: el nombre, una barra **HP** (vida) y una **XP** (experiencia).
- **HP siempre llena:** no hay nada real que medir.
- **XP crece al explorar:** un cuarto por cada sección abierta (Proyectos, Stack, Perfil,
  Contacto), compartida por Yeray y Null, y recordada en el navegador. Mide la visita, nunca a
  Yeray: no hay números inventados.

### L. Fuera el idioma de la ventana de Contacto

> Añadido el 19/11/2026.

- **Qué se quita:** la elección de idioma ("Idioma: Español / English") del final de la ventana
  de Contacto, con sus estilos.
- **Por qué:** ahora el idioma se cambia desde la rueda (la bandera) y desde la pantalla de
  título. Tres sitios eran demasiados.
- **Se quedan:** la bandera de la rueda y el ES/EN del título.
- Lo hago junto con el bloque I, porque los dos tocan la ventana de Contacto.

### Qué verás al terminar
- **La rueda** con sus nombres reales siempre visibles y los iconos nuevos, en español e inglés,
  a 390, 768 y 1440 px.
- **El CV y el idioma** funcionando desde la rueda, con teclado, ratón y táctil.
- **La ventana Stack** con un icono junto a cada tecnología.
- **Las acciones en reposo**, en el campamento y en `/dev/personajes`, una a una.
- **Los retratos nuevos** en el HUD y tu cara en la pestaña.
- **En `/dev/personajes`:** tu piel nueva al lado de la anterior y el caminar de Null nuevo.
- **El informe** `docs/informes/fase-8-mejoras.md`.

### Cómo compruebo que funciona
- Todas las pruebas y comprobaciones en verde (`check:camp`, `check:windows`, `check:title`,
  `check:intro`), actualizadas a los nombres nuevos.
- **Los iconos del stack:**
  - una prueba falla si una tecnología no tiene icono;
  - en el móvil, los grupos siguen cabiendo sin desplazamiento horizontal;
  - el atlas pesa pocos KB y no retrasa la apertura de la ventana.
- **Las acciones en reposo:**
  - empiezan y terminan en la pose base sin salto;
  - se cortan al girar la rueda o abrir una ventana;
  - no aparecen con "reducir movimiento";
  - no tapan ningún icono de la rueda;
  - los 60 fps se mantienen.
- **La ventana del CV**, desde la rueda y desde el título:
  - SÍ descarga el PDF correcto en cada idioma;
  - en el título, ni el pergamino ni la ventana empiezan el juego (`check:title`);
  - NO, Escape y tocar fuera no descargan nada;
  - funciona con teclado, ratón y táctil.
- **La vista CV ya no existe:**
  - `/cv/` ya no se genera al compilar;
  - ningún enlace apunta a ella;
  - el `<noscript>` enlaza a los dos PDF.
- **Las comprobaciones de calidad de los sprites:**
  - las del caminar;
  - las nuevas de la piel;
  - las del caminar de Null.
- Contraste AA en los nombres de la rueda y en los iconos.
- Sin desplazamiento horizontal y ningún error en la consola.
- Rendimiento: los mismos 60 fps al girar la rueda y el mismo presupuesto de peso.

### TypeScript que aprenderás
- **Dejar que el compilador te guíe en un cambio de nombre.** Cambio el tipo unión `SectionId`
  (`'equip' | 'alchemy' | …` → `'projects' | 'stack' | …`) y TypeScript señala cada sitio que
  hay que actualizar. Ninguno se queda olvidado.
- **`Record<Locale, string>`** para la ruta del PDF de cada idioma: si algún día hubiera un
  tercer idioma, el compilador exigiría su PDF.
- **Uniones con una etiqueta común** (*discriminated unions*). Los elementos de la rueda ya no
  hacen todos lo mismo: unos abren una ventana, otro descarga y otro cambia el idioma. Un campo
  `kind` lo dice (`{ kind: 'window', section } | { kind: 'download' } | { kind: 'language' }`) y
  TypeScript obliga a tratar cada caso.
- **Un `Record` que obliga a estar completo** (iconos del stack). El tipo unión `TechId`
  (`'react' | 'docker' | …`) y un `Record<TechId, IconRect>` con la posición de cada icono en el
  atlas. Si añades una tecnología y olvidas su icono, el compilador te avisa.

### Lo que ya has decidido (17/11/2026)
- Todos los iconos van **dentro de la rueda**, también el CV y el idioma.
- La bandera del inglés es la de **Reino Unido**.
- Tu retrato y el favicon llevan **el tono de piel nuevo**.
- **PERFIL** en español (PROFILE en inglés), en lugar de STATS.
- BUFFS y CRAFT desaparecen. "Sobre mí" llegará más adelante.
- **La vista CV web se quita**, junto con "VER CV" (bloque I).
- El icono del CV abre una **ventana que pregunta si quieres descargarlo** (bloque C).
- **Los iconos del stack entran en esta fase** (bloque J), no en una aparte, con la **opción B**:
  logos de Simple Icons pasados a píxeles.
- **Animaciones en reposo** para ti y para Null (bloque K): tú, **gafas, café y pensar**; Null,
  **ladear la cabeza, mover la cola y rascarse la oreja** (19/11/2026).
- **Además de en la rueda, el CV solo está en la pantalla de título**: el pergamino, arriba a la
  izquierda, abre la misma ventana y no empieza el juego (bloque I). La intro no tiene acceso.

### Decisiones que puedes cambiar
- El orden de la rueda: Proyectos, Stack, Perfil, Contacto, CV, Idioma.
- Mantener el nombre de juego (EQUIP, ALCHEMY, STATS, COMMS) en el título de cada ventana.
- Los identificadores y enlaces nuevos (`/#projects`, `/#stack`…).
- Los retratos tal cual con su marco dorado, sin el marco de piedra.
- El `<noscript>` con los enlaces a los PDF.
- Iconos del stack: los genéricos de SQL y APIs REST, y el icono a la izquierda del nombre (la
  otra opción es encima, en formato rejilla).


**💬 Tus comentarios:**

---

## Fase 8, ronda 2 — Mejoras 2

> Añadida el 21/11/2026, antes de publicar: volvemos a la fase 8 con 9 mejoras tuyas (bloques
> N–R). **Hecha el 21/11/2026**, los cinco bloques seguidos (lo pediste así). Informe: sección
> "Ronda 2" de `docs/informes/fase-8-mejoras.md`. Lo que queda de la fase 9 (`code-review`,
> `simplify` y regenerar `DESIGN.md`) va después de esta ronda.

**Objetivo:** dejar la web a punto para publicarla: ajustes en el título, ventanas más cómodas de
leer, una rueda que no tape la hoguera y este portfolio como proyecto.

### N. AJUSTES en todas partes (tus puntos 1, 2 y 3)

**1. El engranaje en el título**
- El ES/EN de arriba a la derecha se cambia por el **engranaje con su nombre (AJUSTES)**, con el
  mismo estilo que el pergamino del CV de la izquierda.
- Abre **la misma ventana de Ajustes** que la rueda: idioma y animaciones.
- Como el pergamino: ni el engranaje ni su ventana empiezan el juego.
- **A tener en cuenta:** el idioma queda un paso más lejos. En la primera visita ya sale del
  idioma del navegador, así que un reclutador inglés ve la web en inglés desde el principio.

**2. Volver al título**
- Un botón **VOLVER AL TÍTULO / BACK TO TITLE** dentro de Ajustes, como en los juegos.
- **Solo en el campamento:** en los Ajustes del título no aparece.
- Hace la transición de puntos al revés (campamento → título). Desde ahí, PRESS START vuelve a
  poner la intro.
- No pregunta antes: no se pierde nada (el idioma, las animaciones y la XP se quedan).

**3. Aviso en rojo en Animaciones**
- Debajo de la fila de Animaciones, una línea en rojo que cambia con la elección:
  - **SÍ:** "Con animaciones: intro, transiciones, rueda girando, hoguera, Yeray y Null
    moviéndose y el vídeo de Capyroad en bucle."
  - **NO:** "Sin animaciones: sin intro ni transiciones; la rueda cambia al instante; la hoguera,
    Yeray y Null se quedan quietos; el vídeo no arranca solo."
- Los lectores de pantalla la leen al cambiar.
- **Un rojo nuevo en la paleta:** el actual (`red-1`) sobre el gris de la ventana da unos 3,3:1,
  por debajo del mínimo AA (4,5:1). Añado uno más claro (la paleta lleva 31 de 32 colores) y su
  par en `CONTRAST_PAIRS`.
- **Un fallo que arreglo de paso:** si tu sistema pide "reducir movimiento", hoy la ventana marca
  SÍ con las animaciones apagadas. Pasará a marcar NO, y elegir SÍ mandará sobre el sistema.

**Y una línea de privacidad** (tu punto 9, ver bloque R) al final de la ventana.

### O. Ventanas: fondo plano, flechas y rueda del ratón (tus puntos 4, 5 y 6)

**4. Fondo gris plano**
- En todas las ventanas: las secciones, Ajustes y la pregunta del CV.
- El mismo gris oscuro de ahora (`stone-0`), **sin la textura de piedra**.
- Se quedan el bisel y la ranura del marco: sigue pareciendo una ventana de juego.
- El HUD conserva la piedra: no tiene texto largo.

**5. Las flechas: un fallo real**
- Hoy ← → solo funcionan cuando el foco está en las pestañas.
- Al abrir la ventana el foco no está ahí, y para llegar hay que usar Tab.

**6. Cómo se maneja a partir de ahora**

| Qué haces | Qué pasa |
|---|---|
| ← → | Cambias de sección o de proyecto, esté donde esté el foco dentro de la ventana |
| Clic en una pestaña | Vas a ella |
| Rueda, ↑ ↓, RePág/AvPág | Solo mueves el texto; **nunca** cambias de sección |
| Móvil | Tocas la pestaña o deslizas a los lados (como ahora) |

- Al abrir, el foco va al texto, así que ↑ ↓ funcionan desde el principio.
- La línea de ayuda dice lo que funciona de verdad: "← → cambian de proyecto · Rueda o ↑ ↓
  para leer · Esc vuelve al campamento".

### P. La rueda: que no tape la hoguera (tu punto 7)

- **La hoguera no se mueve:** es parte de tu imagen del campamento, y moverla sería repintarla.
- **El icono de encima de tu cabeza se queda exactamente donde está**, y el de debajo de tus
  botas también (21/11/2026, decisión tuya).
- **Solo se acercan los de los lados:**
  - **los de arriba**, hasta dejar la hoguera entera a la vista: de 118 a 70 px de escena de tu
    centro (hecho: más de lo previsto, para que tampoco tapen el trípode). De paso se ven también
    las pesas, que antes tapaba el de la derecha;
  - **los de abajo**, un poco, lo que deje Null: de 118 a 113 px (hecho). En el móvil los nombres
    son más anchos, y con la rueda girada PROYECTOS queda junto a Null: no hay sitio para más.
- Por eso la rueda deja de ser una elipse: su anchura cambia con la altura. Cada icono sigue el
  mismo camino al girar, sin saltos.
- Mientras gira, los iconos siguen pasando por encima de todo. Lo que cambia es dónde se paran.
- Cuando llegue "Sobre mí" (7 iconos), las posiciones cambian y lo vuelvo a medir.

### Q. Este portfolio como proyecto, y TypeScript en el Stack (tu punto 8)

**El proyecto** (decidido el 21/11/2026: entra, con tu papel y cómo se ha desarrollado)
- Cuarta pestaña de Proyectos, con la etiqueta **ESTÁS AQUÍ / YOU ARE HERE**, al estilo de
  DESTACADO y CLASIFICADO.
- Una captura del campamento, hecha con el propio juego.
- El enlace al repositorio cuando sea público (fase 10).
- **Borrador para que lo corrijas** (pasa a `CONTENT.md`, y de ahí a `es.ts` y `en.ts`, solo con
  tu OK):
  - **Nombre:** Este portfolio.
  - **Contexto:** Proyecto personal · nov. 2026 · desarrollado con Claude Code.
  - **Resumen:** Portfolio con forma de RPG de 16 bits: pantalla de título, intro saliendo de la
    cueva y un campamento con un menú en rueda que abre mi CV por secciones. Sin motor de
    juegos: React, TypeScript y Canvas.
  - **Qué hice:**
    - La idea y la dirección del proyecto: el mundo, cada pantalla y cada decisión de diseño.
    - Las referencias de arte: los personajes, los iconos y el fondo del campamento.
    - El desarrollo, con Claude Code (un agente de IA), fase a fase: en cada una revisé el
      resultado con capturas en móvil, tablet y escritorio antes de aprobarla. (Hecho: "fase a
      fase" en lugar de "en 10 fases", porque son 11, de la 0 a la 10.)
    - Aprendí TypeScript con este proyecto.
  - **Stack:** React · TypeScript · Vite · Canvas · Vitest · Playwright.
  - **Nota, Accesibilidad:** se maneja con teclado, ratón o pantalla táctil, con lector de
    pantalla y sin animaciones.
  - **Pendiente de ti:** si quieres contar cómo hiciste las referencias de arte, dímelo y lo
    añado.
- **Riesgo:** en el móvil, con cuatro pestañas cada una se encoge más. (Hecho: su pestaña dice
  solo "Portfolio", como la de Bosa dice "Bosa Digital".)

**TypeScript en el Stack**
- Entra en **"He trabajado con" → Lenguajes**.
- Su icono sale de Simple Icons con `npm run stack-icons`, como los demás.

### R. Aviso legal, cookies y privacidad (tu punto 9)

**Lo que dice la ley** (no soy abogado, pero tu caso es claro)
- **Aviso legal (LSSI, art. 10): no hace falta.** Solo obliga a webs con actividad económica
  (ventas, anuncios, servicios de pago). Si un día ofreces servicios como autónomo, sí.
- **Banner de cookies (LSSI, art. 22.2, y guía de la AEPD, que incluye `localStorage`): no hace
  falta.**
  - La web no usa cookies.
  - Solo guarda 4 cosas en tu navegador, que nunca salen de él: el idioma y las animaciones (las
    eliges tú) y `visited` y `explored` (estado del propio juego, sin datos personales).
  - Las fuentes se sirven desde la propia web (no desde Google Fonts) y no hay analítica.
- **Política de privacidad (RGPD): no es obligatoria.** No recoges datos de nadie: no hay
  formularios ni analítica.

**Lo que se hace** (decidido el 21/11/2026)
- **Una línea al final de Ajustes**, en el título y en el campamento:
  - "Esta web no usa cookies ni analítica. Solo guarda en tu navegador tu idioma, tus ajustes y
    tu progreso."
  - "This site uses no cookies or analytics. It only keeps your language, settings and progress
    in your browser."
- Los créditos (licencias de las fuentes y Simple Icons) van al README, en la fase 10.
- **En la fase 10:** si se añade analítica, esto se revisa. Google Analytics necesitaría banner;
  Cloudflare Web Analytics no usa cookies y no lo necesita.

### Qué verás al terminar
- Capturas a 390, 768 y 1440 px, en español e inglés: el título con el engranaje, Ajustes en el
  título y en el campamento (con el aviso rojo y la línea de privacidad), las ventanas con fondo
  plano, la rueda con la hoguera a la vista y la pestaña del portfolio.
- El informe, añadido a `docs/informes/fase-8-mejoras.md`.

### Cómo compruebo que funciona
- Todas las pruebas y comprobaciones en verde, actualizadas:
  - `check:title`: el engranaje abre Ajustes y no empieza el juego; ya no hay ES/EN;
  - `check:camp`: volver al título, el aviso de animaciones y los nombres de la rueda sin tocarse
    ni tocar a Null;
  - `check:windows`: ← → cambian de sección desde el texto; la rueda solo desplaza.
- Contraste AA del rojo nuevo y de la línea de privacidad.
- Sin desplazamiento horizontal, sin errores en la consola, los mismos 60 fps y el mismo
  presupuesto de peso.

### TypeScript que aprenderás
- **Una prop opcional que es una función** (`onBackToTitle?: () => void`): el campamento se la
  pasa a Ajustes y el título no, y el botón solo aparece si existe.
- **Ampliar una unión con una etiqueta común:** la transición sabe ir también hacia el título
  (`to: 'INTRO' | 'CAMP' | 'TITLE'`), y el compilador señala cada sitio que tiene que tratar el
  caso nuevo.
- **El `Record` que obliga a estar completo**, otra vez: añadir `'typescript'` a `TechId` hace
  que el compilador exija su icono.

### Orden de trabajo
- Hecho en este orden, todo seguido y revisado al final (21/11/2026): **O**, **N**, **P**, **Q** y
  **R**.

### S. El porqué de cada proyecto, y fuera Bosa de Proyectos

> Añadido el 22/11/2026, a petición tuya: "no habla del porqué de cada proyecto". **Hecho el
> 22/11/2026.** Informe: sección "Bloque S" al final de `docs/informes/fase-8-mejoras.md`.

**Qué cambia**
- **Una sección "Por qué" / "Why"** en cada proyecto:
  - va **justo después del resumen**, antes de "Qué hice" (tu elección). Así la ficha se lee como una
    historia: qué es → por qué → qué hice → datos, y el porqué se ve sin desplazar;
  - va en primera persona, con 2–4 frases cortas.
- **Bosa Digital sale de Proyectos** (tu decisión). Por el NDA no enseñaba nada, y ya está entera
  en el Registro de misiones de Perfil, que no cambia. Proyectos queda con tres pestañas: Capyroad,
  Pakito's Gambling y Portfolio.
- **Pakito's Gambling: equipo de 4 personas**, no de 3 (corregido por ti). Cambia la línea de
  contexto en los dos idiomas.

**Los textos** (adaptados de lo que me contaste; pasan a `CONTENT.md` y de ahí a `es.ts` y `en.ts`)
- **Capyroad:**
  - "El capibara era la mascota de nuestro casino: un animal que nos hacía gracia a todo el equipo.
    El backend avanzó rápido y sentía que al casino le faltaban juegos, así que aproveché el tiempo
    que quedaba hasta la entrega para inventar uno propio. Acabó siendo el más popular entre el
    jurado de la presentación."
  - "The capybara was our casino's mascot: an animal the whole team found funny. The backend moved
    fast and I felt the casino was short of games, so I used the time left before the deadline to
    invent one of our own. It ended up being the jury's favourite at the presentation."
- **Pakito's Gambling:**
  - "Queríamos salir de lo típico: ni una tienda online ni una red social, sino algo grande, con
    una lógica compleja detrás y mucha seguridad. Con moneda ficticia, sin dinero real, para evitar
    problemas legales. Siendo cuatro, pudimos hacerlo a lo grande. Yo prefiero el backend, así que
    me encargué de esa parte, aunque acabé tocando también el frontend."
  - "We wanted to get away from the usual: not an online shop or a social network, but something
    big, with complex logic behind it and strong security. With play money, no real money, to stay
    clear of legal issues. Being four of us, we could go big. I prefer the backend, so I took that
    part, though I ended up working on the frontend too."
- **Este portfolio:**
  - "Quería un portfolio que se recordara: en vez de otra web con secciones, un pequeño juego donde
    cada parte de mi CV es un lugar del campamento. Está inspirado en Secret of Evermore, el primer
    videojuego al que jugué, junto a mi padre, y le tengo un cariño muy especial."
  - "I wanted a portfolio people would remember: instead of another website with sections, a small
    game where each part of my CV is a place in the camp. It's inspired by Secret of Evermore, the
    first video game I ever played, with my dad, and it's very special to me."
- Nombrar *Secret of Evermore* como inspiración no choca con la regla de arte original: no se usa
  nada del juego, solo cuentas de dónde viene la idea.

**Cómo se hace**
- **Tipos.** `Project` gana un campo obligatorio `why: string`: si un proyecto no lo tiene en algún
  idioma, no compila.
- **Fuera lo que solo usaba Bosa:**
  - el tipo de imagen `'classified'` (proyecto sin capturas ni vídeo), con su caso en la ventana;
  - la etiqueta CLASIFICADO / CLASSIFIED;
  - Bosa en el `id` de los proyectos.

  `BOSA_TASKS` se queda: lo usa el Registro de misiones.
- **La ventana.** "Por qué" se pinta tras el resumen, con el mismo estilo de subtítulo que "Qué
  hice".
- **Documentos.** `CONTENT.md` (los porqués, Pakito's con 4 personas y Bosa solo en Perfil),
  `DESIGN.md`, `BRIEF.md` y `PRODUCT.md` donde hablen de Bosa en Proyectos.

**Cómo compruebo que funciona**
- `check:windows`:
  - Proyectos tiene tres pestañas;
  - cada proyecto muestra "Por qué" justo después del resumen y antes de "Qué hice";
  - Bosa ya no está en Proyectos, pero sí en Perfil;
  - las flechas y Fin siguen llegando al último (Portfolio).
- Pruebas, tipos y lint en verde; capturas a 390, 768 y 1440 en los dos idiomas.
- El informe, añadido a `docs/informes/fase-8-mejoras.md`.

**TypeScript que aprenderás**
- **Quitar un caso de una unión.** Al borrar `'classified'` de `ProjectMedia`, el compilador señala
  el código que lo trataba (`media.kind === 'classified'`), porque compararía con un valor que ya no
  puede existir.
- **Un campo obligatorio nuevo.** Con `why: string` en `Project`, el compilador avisa en cada
  proyecto de `es.ts` y `en.ts` que no lo tenga.

**Pendiente de ti**
- Tu CV en PDF: si en Pakito's pone "3 personas", corrígelo tú, para que la web y el PDF digan lo
  mismo (el PDF se copia tal cual).

**💬 Tus comentarios:**

---

## Fase 9 — Revisión, refactor y limpieza

> 20/11/2026: parte 1 (revisión con la skill `modern-web-guidance` y cambios que no se ven;
> capturas idénticas) y parte 2 hechas: borrados, el contorno de las ventanas, el engranaje con
> AJUSTES (idioma y animaciones), las pestañas en una fila y Ctrl+F en todas las secciones.
> Informe: `docs/informes/fase-9-revision.md`.

**Objetivo:** que el código que vea un reclutador en GitHub esté igual de cuidado que la web.

**Qué se hace**
- **Revisión de todo el código.** Busco:
  - errores;
  - código repetido;
  - nombres poco claros;
  - componentes demasiado grandes;
  - comentarios que se han quedado viejos (por ejemplo, los que hablan de "hasta la fase 6");
  - código que ya no se usa.
- **Refactor solo donde aporte**, sin cambiar el resultado. Un ejemplo: los scripts de
  comprobación (`check:*`, `shots` y `fps`) repiten código que puede ir a una librería común.
- **Limpieza de carpetas:**
  - capturas e informes de Lighthouse viejos en `.screenshots/`;
  - imágenes y archivos que ya no se usan;
  - páginas `/dev/*` que ya no sirvan;
  - documentos de análisis de fases pasadas (`animacion-caminar.md`, `fondo-campamento.md`), que
    se pueden archivar en `docs/historial/`.
- **Dependencias:** quitar las que no se usen, actualizar las que lo necesiten y revisar
  `npm audit`.
- **Documentación al día:** `CLAUDE.md`, `BRIEF.md`, `DESIGN.md` y `CONTENT.md` reflejan cómo es
  la web de verdad.

**Cómo se hace**
- **Herramientas:**
  - la revisión de código de Claude Code (`code-review` y `simplify`);
  - oxlint;
  - TypeScript;
  - una búsqueda de archivos y exportaciones sin usar con `knip`. Lo ejecuto una vez con `npx`,
    sin añadirlo al proyecto.
- **Nada se borra sin tu OK.** Te paso la lista de lo que propongo borrar, con el porqué de cada
  cosa, y espero tu respuesta.
- **`references/` es tuyo:** como mucho te digo qué sobra, pero no lo toco.
- **Antes y después:** capturo todas las pantallas antes de empezar y las comparo píxel a píxel
  al terminar. El refactor no debe cambiar nada visible.

**Qué verás al terminar:** un informe con el antes y el después:
- número de archivos;
- líneas de código;
- peso del JavaScript;
- puntuaciones de Lighthouse y fps;
- lista de lo borrado y por qué.

**Cómo compruebo que funciona**
- Todas las pruebas y comprobaciones en verde.
- Capturas idénticas a las de antes.
- Lighthouse y fps iguales o mejores.

**TypeScript que aprenderás:** repaso. El informe enseña cada mejora de tipos con el antes y el
después, por ejemplo quitar algún `as` que quede o un tipo que se pueda simplificar.

**Decisiones que puedes cambiar:**
- Cuánto refactor hacer. Propongo un refactor conservador: solo lo que se lee peor o se repite.
- Qué páginas `/dev/*` se quedan. Propongo dejar `/dev/textos` y `/dev/personajes`.
- Si los documentos de análisis se archivan o se borran.

**💬 Tus comentarios:**

---

## Fase 10 — Publicación

**Objetivo:** la web en internet, con despliegue automático.

**Quién hace qué**
- **Yo:** preparo el archivo del *workflow* de GitHub Actions, el `README.md` y una guía paso a
  paso.
- **Tú:** creas el repositorio, haces el push y activas GitHub Pages siguiendo esa guía. Yo no
  toco git.

**Qué se construye**
- **El repositorio en tu GitHub.** La carpeta `references/` (tus fotos y el CV original) nunca
  se sube, porque está excluida en `.gitignore`.
- **Publicación automática:** cada vez que subas cambios a la rama principal, la web se
  actualiza sola.
- **Un `README.md` cuidado**, porque muchos reclutadores miran el repositorio. Incluye:
  - Captura de la web.
  - Stack técnico.
  - Decisiones de arquitectura.
  - Cómo ejecutarla en local.

**Cómo se hace**
- **Propongo GitHub Pages con GitHub Actions.** Es gratis y la web queda junto a tu perfil.
- Además, el *workflow* que la construye y la publica demuestra conocimientos de **CI/CD**, que
  encaja con tu especialización en Cloud y DevOps.
- Alternativas: Vercel o Netlify (igual de gratis y algo más sencillos de configurar).
- Un dominio propio, como `yeraycaturla.dev`, es opcional y cuesta unos 10–15 € al año.

**Qué verás al terminar:** la URL pública funcionando.

**Cómo compruebo que funciona:** la web publicada se carga y funciona igual que en local, y la
vista previa al compartirla en LinkedIn se ve bien.

**Decisiones que puedes cambiar:** GitHub Pages, Vercel o Netlify, y si quieres dominio propio.

**💬 Tus comentarios:**

---

## Qué NO entra en la primera versión
- **"Sobre mí":** sección nueva, pendiente de decidir cómo se organiza. Su icono ya está.
- (BUFFS y CRAFT se quitan del todo en la fase 8. Sus objetos siguen en el fondo del
  campamento.)
- **Audio y música.**
- **Vistas de espalda de los personajes.**

(El CV en PDF en inglés estaba aquí; entra en la fase 8.)

## Riesgos y cómo los gestiono
| Riesgo | Cómo lo gestiono |
|---|---|
| El sprite no se parece lo suficiente | La revisión de la fase 2 va antes de cualquier escena. Plan B: sprites PNG dibujados a mano |
| La intro aburre o retrasa a los reclutadores | SKIP siempre visible, segunda visita directa al campamento, el CV en PDF desde el título y la rueda |
| Problemas legales con el juego original | Todo el arte, las fuentes y los textos son originales. Las capturas del juego solo se usan como referencia de ambiente |
| Mal rendimiento en móviles antiguos | Ver la sección "Rendimiento: objetivos y cómo los mido". Objetivos medidos en cada fase desde la 3, bajada automática a 30 fps y el CV en PDF a un paso desde la rueda |
| Se publica algo privado | `references/` está en `.gitignore`. Las páginas `/dev/*` no entran en la versión publicada. El teléfono solo aparece en el PDF |

## Glosario rápido
- **Sprite:** dibujo pequeño de un personaje u objeto, normalmente con varios fotogramas.
- **Fotograma (frame):** cada uno de los dibujos que forman una animación.
- **Canvas:** lienzo HTML donde se pinta píxel a píxel con código.
- **DOM / HTML:** los elementos normales de una página (textos, botones, enlaces).
- **Tokens de diseño:** variables con los colores y las medidas, definidas una sola vez.
- **CSS Modules:** archivos CSS cuyos estilos solo afectan a su componente.
- **Hook:** función de React que empieza por `use` y da "superpoderes" a un componente (estado,
  efectos…).
- **Reducer:** función que recibe el estado actual y una acción, y devuelve el nuevo estado.
- **Lazy loading:** cargar una parte del código solo cuando se necesita.
- **ARIA:** etiquetas que explican a los lectores de pantalla qué es cada elemento.
- **Lighthouse:** herramienta de Google que puntúa rendimiento, accesibilidad y SEO.
- **Open Graph (OG):** la imagen y el texto que aparecen al compartir un enlace.
- **CI/CD:** construir y publicar automáticamente cada vez que subes cambios.
