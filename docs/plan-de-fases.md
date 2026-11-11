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
4. **Cierre**: accesibilidad, vista CV y publicación (fases 7 y 8).

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
| 8 | Publicación | La web en internet con despliegue automático |

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
- **La vista `/cv/`** es una página de texto ultraligera que funciona en cualquier caso.

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
  - Brazos cruzados: aparece tras unos 3 s quieto.
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
- **Tipos unión** para los nombres de animación (`'idle' | 'walk' | 'armsCrossed'`). TypeScript
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

**Objetivo:** construir el corazón de la web. Tú y Null en el campamento, y el menú circular
funcionando con teclado, ratón y pantalla táctil.

**Qué se construye**
- **La escena del campamento en canvas:**
  - Suelo, árboles y tienda.
  - Hoguera animada, con una paellera humeante encima.
  - Mancuernas y discos junto a la tienda, y una barra de dominadas entre dos árboles.
  - Un tarro de aceitunas sobre una caja.

  Todo con poco contraste, para que no compita con vosotros.
- **El HUD inferior:** tu retrato abajo a la izquierda y el de Null abajo a la derecha, con su
  nombre.
- **El bucle de juego (`useGameLoop`):** un único "reloj" que avanza las animaciones unas 60
  veces por segundo. Se detiene si cambias de pestaña, para no gastar batería.
- **La entrada (`useInput`):** traduce teclado, ratón y táctil a cuatro acciones comunes
  (IZQUIERDA, DERECHA, CONFIRMAR, CANCELAR). Así el menú no necesita saber de dónde viene cada
  orden.
- **El menú circular (`RingMenu`):**
  - Los iconos se reparten en un óvalo alrededor de tu personaje.
  - El seleccionado queda arriba, dentro de corchetes azules y con su nombre en verde.
  - Al girar, el anillo rota en unos 8 fotogramas.
  - El banner superior muestra el nombre de la sección.
- **La máquina de estados** de CAMPAMENTO ↔ VENTANA, con ventanas provisionales: el contenido
  real llega en la fase 4.
- **Secciones en borrador ocultas:** BUFFS y CRAFT no aparecen en la versión publicada. El menú
  funciona igual con 4, 5 o 6 opciones.

**Cómo se hace**
- **Posición de cada icono:** se reparten los 360° entre las opciones disponibles (con 4
  opciones, una cada 90°). Al girar, todos los ángulos avanzan a la vez hasta que el elegido
  queda arriba.
- **Los iconos son botones HTML** colocados sobre el canvas, no dibujos dentro de él. Por eso
  funcionan con el tabulador, con lectores de pantalla y con el clic.
- **Accesibilidad:**
  - El menú usa el patrón estándar de "menú" de ARIA (las etiquetas que explican a un lector de
    pantalla qué es cada cosa). Las flechas cambian de opción y Enter abre.
  - El foco visible tiene la forma de los corchetes azules.
  - Con una ventana abierta, el tabulador no se escapa de ella.
  - Esc cierra la ventana y devuelve el foco al menú.
- **Móvil:** toque en un icono para elegir y deslizar el dedo para girar el anillo.

**Qué verás al terminar:** el campamento funcionando en el navegador. Podrás moverte por el menú
y abrir y cerrar ventanas con teclado, ratón o el móvil.

**Cómo compruebo que funciona**
- **Pruebas automáticas (Vitest)** de la máquina de estados (que no existan transiciones
  imposibles) y del cálculo de ángulos.
- Recorrido completo solo con teclado y solo con táctil.
- Capturas a los tres tamaños.

**TypeScript que aprenderás**
- **Uniones discriminadas**, el concepto más útil del proyecto. Un estado se escribe como
  `{ scene: 'HUB' } | { scene: 'WINDOW'; section: SectionId }`, y TypeScript solo te deja leer
  `section` cuando el estado es `WINDOW`.
- Tipar un `useReducer`.
- Crear tus propios hooks con tipos.

**Decisiones que puedes cambiar:** la velocidad de giro, el tamaño del anillo, qué muestra el
HUD (propongo solo retratos y nombres, sin números inventados) y la disposición de los objetos
del campamento.

**💬 Tus comentarios:**

---

## Fase 4 — Ventanas con tu contenido

**Objetivo:** todo tu contenido profesional real, en español e inglés.

**Qué se construye**
- **Archivos de contenido:**
  - `src/content/types.ts`: la forma que debe tener el contenido.
  - `es.ts`: copiado de `CONTENT.md`.
  - `en.ts`: lo traduzco yo y lo revisas tú.
- **El sistema de idioma (`useLocale`):**
  - Detecta el idioma del navegador y recuerda tu elección.
  - Selector ES/EN.
  - Actualiza el idioma declarado en la página para Google y los lectores de pantalla.
- **Las 4 ventanas profesionales:**
  - **EQUIP:** lista de proyectos a la izquierda y detalle a la derecha.
    - **Capyroad ★** va destacado, con su vídeo y su captura.
    - **Pakito's Gambling** muestra tu parte: backend, ruleta, blackjack y Capyroad.
    - Las herramientas de **Bosa Digital** llevan la etiqueta [CLASIFICADO] y solo las tres
      frases del CV.
  - **ALCHEMY:** los dos rangos ("Dominio" y "He trabajado con"), agrupados por categoría.
  - **STATS:** retrato, ficha (clase, base, idiomas), formación y "registro de misiones".
  - **COMMS:** GitHub, LinkedIn, email, ubicación, disponibilidad y el selector de idioma.
- **Los medios optimizados:**
  - Las capturas, en WebP, un formato más ligero.
  - El vídeo de Capyroad recortado a 10–15 s, sin audio y por debajo de 2 MB, en dos formatos
    para que funcione en todos los navegadores.
  - Una imagen fija de portada para el vídeo.

**Cómo se hace**
- Para el vídeo necesito **ffmpeg**: tendrás que ejecutar `! sudo apt install ffmpeg`. Con él
  sacaré fotogramas del vídeo para elegir el mejor tramo.
- **Las capturas y el vídeo NO se pixelan:** se muestran nítidos dentro del marco de la
  ventana, como una "pantalla dentro de la pantalla". La idea es que un reclutador vea tu
  trabajo real con claridad.
- **El vídeo** solo se reproduce, en bucle y sin sonido, con la ventana abierta. Si el
  visitante tiene activado "reducir movimiento", solo se ve la imagen fija.
- **Cada ventana se descarga solo cuando se abre** (*lazy loading*), así la carga inicial es
  más rápida.

**Qué verás al terminar:** las 4 ventanas completas. **Tendrás que leer todos los textos en los
dos idiomas.**

**Cómo compruebo que funciona**
- Si falta un texto en `en.ts`, el proyecto no compila: TypeScript lo detecta.
- Todos los enlaces abren su destino correcto.
- Medición del peso del vídeo y de las imágenes.
- Capturas en los dos idiomas a los tres tamaños.

**TypeScript que aprenderás**
- Cómo `const en: Content = {...}` obliga a que el inglés tenga exactamente los mismos campos
  que el español.
- Arrays de objetos tipados.
- Context de React con tipos.

**Decisiones que puedes cambiar:** la redacción de cualquier texto y el tramo del vídeo.

**💬 Tus comentarios:**

---

## Fase 5 — Pantalla de título

**Objetivo:** que la primera impresión enganche.

**Qué se construye**
- **Fondo en canvas:**
  - Cielo azul noche casi negro.
  - Siluetas del paisaje en el tercio inferior (la montaña de la cueva y el bosque del
    campamento, para enlazar con lo que viene después).
  - Una línea fina de brillo azul en el horizonte.
- **"YERAY CATURLA"** en dorado con relieve.
- **Líneas de créditos:**
  - "BACKEND DEVELOPER · NODE.JS · EXPRESS · JAVA · DOCKER · AWS"
  - "IES POETA PACO MOLLÀ"
- **"PRESS START"**, que parpadea a saltos y no con un fundido suave.
- **El selector ES/EN, "SKIP INTRO" y el enlace a la vista CV**, siempre visibles.
- **La transición:** efecto mosaico (la imagen se pixela cada vez más) o fundido a negro por
  pasos de la paleta.

**Cómo se hace**
- **El título es texto real**, no una imagen, para que lo lea Google. El relieve dorado se
  consigue con varias sombras de texto superpuestas: brillo arriba, dorado, dorado oscuro y
  contorno. No usamos ninguna tipografía ni logotipo del juego original.
- **Cualquier tecla, clic o toque arranca la partida.** El enlace a la vista CV no la arranca.

**Qué verás al terminar:** la pantalla de título y la transición enlazadas con el campamento.

**Cómo compruebo que funciona:** capturas a los tres tamaños, que funcione con teclado, ratón y
táctil, y que el título se lea bien en el móvil.

**TypeScript que aprenderás:** los tipos de los eventos del navegador (`KeyboardEvent`,
`PointerEvent`).

**Decisiones que puedes cambiar:** el efecto de transición (mosaico o fundido), el texto de los
créditos y el paisaje del fondo.

**💬 Tus comentarios:**

---

## Fase 6 — Intro: salida de la cueva

**Objetivo:** una pequeña escena que cuenta "este soy yo" antes de enseñar el menú.

**Qué se construye**
- **La escena:**
  - Boca de la cueva en vista ¾ (desde arriba y un poco de frente).
  - Sales caminando hacia la cámara y Null trota detrás de ti con un pequeño retraso.
  - Llegáis al campamento, Null se sienta y se abre el menú.
  - Dura 4–6 segundos en total.
- **Las reglas de la intro:**
  - "SKIP INTRO" siempre visible.
  - Quien ya ha visitado la web entra directamente al campamento (se recuerda en el
    navegador).
  - Quien tiene activado "reducir movimiento" en su sistema se salta la intro entera.
  - Si cambias de pestaña, la escena se pausa.

**Cómo se hace**
- **La cueva y el campamento son la misma escena**: el campamento está justo delante de la
  cueva. Así no hace falta otra transición.
- **La intro se escribe como un "guion" de datos:** una lista de pasos del tipo "camina hasta
  (x, y) a esta velocidad", "espera 0,5 s" o "reproduce esta animación". Los tiempos se cambian
  editando la lista, sin tocar la lógica.

**Qué verás al terminar:** el recorrido completo desde el título hasta el menú.

**Cómo compruebo que funciona**
- La intro no dura más de 6 s.
- SKIP funciona en cualquier momento.
- La segunda visita entra directamente al campamento.
- Con "reducir movimiento" activado no hay paseo.

**TypeScript que aprenderás:** otra unión discriminada, ahora para los pasos del guion
(`{ type: 'walk'; to: Point } | { type: 'wait'; ms: number }`).

**Decisiones que puedes cambiar:** la duración, el recorrido y si Null hace algo especial al
llegar (por ejemplo, ponerse a pedir).

**💬 Tus comentarios:**

---

## Fase 7 — Vista CV, calidad y accesibilidad

**Objetivo:** que la web funcione para todo el mundo, también para quien tiene prisa.

**Qué se construye**
- **La página CV** (`/cv/`):
  - Tu CV en texto limpio, en ES y EN, sacado de los mismos archivos de contenido. Así nunca
    puede quedar desactualizada respecto al juego.
  - Se puede imprimir bien.
  - Botón para descargar el PDF.
  - Es una página aparte y ligera, que carga al instante y que Google indexa bien.
- **Un enlace "Ver CV"** siempre visible desde cualquier pantalla del juego.
- **Lo que se ve al compartir el enlace:**
  - El título y la descripción de la página.
  - La imagen de vista previa para LinkedIn y WhatsApp (una captura de la pantalla de título).
  - Un icono de pestaña en pixel art (la cara de Null).
- **Los archivos para buscadores:** `robots.txt` y `sitemap`.

**Cómo se hace**
- La skill **impeccable** pasa una auditoría técnica (`audit`) y un repaso final de detalles
  (`polish`).
- **Lighthouse**, la herramienta de Google que puntúa una web, con objetivo de 95 o más en
  accesibilidad y rendimiento.
- Recorrido completo solo con teclado, solo con táctil y con lector de pantalla.

**Qué verás al terminar:**
- La web completa.
- El informe de Lighthouse.
- La lista final de los TODOs que queden: BUFFS, CRAFT y el CV en inglés.

**Cómo compruebo que funciona**
- Ningún error en la consola.
- Sin desplazamiento horizontal a ningún tamaño.
- Contraste AA en todos los textos.
- Todas las pruebas automáticas en verde.

**TypeScript que aprenderás:** nada nuevo. Es una fase de repaso: te señalo dónde se usa cada
concepto aprendido.

**Decisiones que puedes cambiar:** el diseño de la vista CV (sobria o con algún detalle retro).

**💬 Tus comentarios:**

---

## Fase 8 — Publicación

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
- **BUFFS (entrenamiento) y CRAFT (cocina):** existen en el código pero están ocultos hasta que
  tengas los datos. Sí se ven sus objetos en el campamento.
- **Audio y música.**
- **Vistas de espalda de los personajes.**
- **El CV en PDF en inglés:** la vista CV en inglés sí estará.

## Riesgos y cómo los gestiono
| Riesgo | Cómo lo gestiono |
|---|---|
| El sprite no se parece lo suficiente | La revisión de la fase 2 va antes de cualquier escena. Plan B: sprites PNG dibujados a mano |
| La intro aburre o retrasa a los reclutadores | SKIP siempre visible, segunda visita directa al campamento, enlace "Ver CV" en todas las pantallas |
| Problemas legales con el juego original | Todo el arte, las fuentes y los textos son originales. Las capturas del juego solo se usan como referencia de ambiente |
| Mal rendimiento en móviles antiguos | Ver la sección "Rendimiento: objetivos y cómo los mido". Objetivos medidos en cada fase desde la 3, bajada automática a 30 fps y vista `/cv/` ultraligera |
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
