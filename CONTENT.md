# Contenido del portfolio

La fuente de verdad de todos los textos de la web, en español. Sale del CV
(`references/cv_es_yeray_caturla.pdf`) y de las respuestas de Yeray; no se añade nada que no esté
aquí. En el código vive en `src/content/es.ts` (español) y `src/content/en.ts` (inglés): si cambia
algo aquí, cambia en los dos. Los dos idiomas, lado a lado, en **`/dev/textos`** (solo en
desarrollo).

---

## Pantalla de título

| Línea | Español | Inglés |
|---|---|---|
| Nombre | YERAY CATURLA | YERAY CATURLA |
| Créditos | DESARROLLADOR BACKEND JUNIOR · DEVOPS | JUNIOR BACKEND DEVELOPER · DEVOPS |
| Botones | PRESS START · SKIP INTRO | PRESS START · SKIP INTRO |

**Esquinas:** arriba a la izquierda, el pergamino del CV (nombre "CV"); arriba a la derecha, el
engranaje (nombre "AJUSTES" / "SETTINGS"), que abre la misma ventana de ajustes que la rueda, sin
"Volver al título".

PRESS START y SKIP INTRO son etiquetas de juego y se quedan en inglés en los dos idiomas.

---

## Página

**Pestaña del navegador y buscadores:**
- Título: "Yeray Caturla — Desarrollador Backend Junior" / "Yeray Caturla — Junior Backend Developer".
- Descripción: "Portfolio de Yeray Caturla, desarrollador backend junior (Node.js, Express, Java,
  Python, Docker, AWS), con forma de RPG de 16 bits." (en inglés: "Portfolio of Yeray Caturla,
  junior backend developer (…), shaped as a 16-bit RPG.")
- Texto alternativo de la imagen al compartir: "Pantalla de título del portfolio: «YERAY CATURLA»
  en letras doradas sobre un cielo nocturno de 16 bits."
- Encabezado de la página (solo para lectores de pantalla): "Yeray Caturla · Desarrollador
  Backend Junior".

**El CV es el PDF:** uno por idioma, tal cual (incluyen el teléfono, por decisión de Yeray).
`npm run cv` los copia de `references/cv_{es,en}_yeray_caturla.pdf` a
`public/cv/yeray-caturla-cv-{es,en}.pdf`. Se piden desde el pergamino del título y desde el CV de
la rueda; los dos abren la misma pregunta (ver "Campamento"), y cada idioma descarga el suyo.

**Sin JavaScript** (un aviso que solo ve quien lo tiene desactivado):

| Texto | Español | Inglés |
|---|---|---|
| Aviso | Este portfolio es un pequeño juego y necesita JavaScript. | This portfolio is a small game and needs JavaScript. |
| Enlace | Descargar mi CV en PDF (español) | Download my CV as a PDF (English) |

---

## Campamento

**La rueda.** Cada hueco lleva su nombre real encima del icono, siempre visible y traducido. El
título del banner (y de la ventana) es "nombre de juego — qué es".

| Hueco | Nombre (ES / EN) | Banner (ES) | Banner (EN) |
|---|---|---|---|
| Proyectos | PROYECTOS / PROJECTS | Alquimia — Proyectos | Alchemy — Projects |
| Stack | STACK / STACK | Equipo — Stack técnico | Equipment — Tech Stack |
| Perfil | PERFIL / PROFILE | Estadísticas — Perfil | Stats — Profile |
| Sobre mí | SOBRE MÍ / ABOUT ME | Diario — Sobre mí | Journal — About Me |
| Contacto | CONTACTO / CONTACT | Configuración — Contacto | Config — Contact |
| CV | CV / CV | Pergamino — Descargar CV | Scroll — Download CV |
| Ajustes | AJUSTES / SETTINGS | Engranaje — Ajustes | Gear — Settings |

**La ventana del CV:**

| Texto | Español | Inglés |
|---|---|---|
| Pregunta | ¿Descargar el CV en PDF? | Download the CV as a PDF? |
| Archivo | PDF · español · 3,1 MB | PDF · English · 3.1 MB |
| Respuestas | SÍ · NO | YES · NO |

El peso tiene que coincidir con el PDF real: una prueba lo comprueba.

**La ventana de ajustes** (desde el engranaje de la rueda o del título):

| Texto | Español | Inglés |
|---|---|---|
| Título | Ajustes | Settings |
| Idioma | Idioma: 🇪🇸 Español · 🇬🇧 English | Language: 🇪🇸 Español · 🇬🇧 English |
| Animaciones | Animaciones: SÍ · NO | Animations: ON · OFF |
| Aviso (SÍ), en rojo | Con animaciones: intro, transiciones, rueda girando, hoguera, Yeray y Null moviéndose y el vídeo de Capyroad en bucle. | With animations: intro, transitions, the ring turning, the campfire, Yeray and Null moving and the Capyroad video on a loop. |
| Aviso (NO), en rojo | Sin animaciones: sin intro ni transiciones; la rueda cambia al instante; la hoguera, Yeray y Null se quedan quietos; el vídeo no arranca solo. | Without animations: no intro or transitions; the ring changes at once; the campfire, Yeray and Null stand still; the video does not start by itself. |
| Antes del aviso, si lo pide el sistema | Tu sistema pide menos movimiento. | Your system asks for less motion. |
| Botón (solo en el campamento) | VOLVER AL TÍTULO | BACK TO TITLE |
| Privacidad (al final) | Esta web no usa cookies ni analítica. Solo guarda en tu navegador tu idioma, tus ajustes y tu progreso. | This site uses no cookies or analytics. It only keeps your language, settings and progress in your browser. |

Cada idioma lleva su bandera (España o Reino Unido) y la opción en uso se ve en dorado. Con
"Animaciones: NO" se para todo lo que se mueve solo. Si el visitante no ha elegido, manda su
sistema (si pide menos movimiento, empieza en NO y el aviso lo dice); si elige, manda su elección.
Las dos elecciones se recuerdan en la próxima visita.

**Lo legal:** sin aviso legal ni banner de cookies. La web no tiene actividad económica, no usa
cookies ni analítica y solo guarda en el navegador preferencias y el estado del juego
(`localStorage`: idioma, animaciones, `visited`, `explored`). Si algún día se añade analítica,
hay que revisarlo.

**Línea de ayuda de las ventanas** (abajo; con ratón y teclado / en pantallas táctiles):

| Ventana | Español | Inglés |
|---|---|---|
| Con secciones | ← → cambian de sección · Rueda o ↑ ↓ para leer · Esc vuelve al campamento. | ← → change section · Wheel or ↑ ↓ to read · Esc returns to camp. |
| (táctil) | Desliza a los lados o toca una pestaña para cambiar de sección. | Swipe sideways or tap a tab to change section. |
| Proyectos | ← → cambian de proyecto · Rueda o ↑ ↓ para leer · Esc vuelve al campamento. | ← → change project · Wheel or ↑ ↓ to read · Esc returns to camp. |
| (táctil) | Desliza a los lados o toca un proyecto para cambiar. | Swipe sideways or tap a project to change. |
| Contacto | Esc vuelve al campamento. | Esc returns to camp. |

**HUD:** "Yeray" y "Null", con las barras **HP** y **XP** (etiquetas de juego, iguales en los dos
idiomas). La XP se llena al explorar las secciones; un lector de pantalla oye "Experiencia: {n} de
5 secciones exploradas" / "Experience: {n} of 5 sections explored".

---

## STATS — Perfil

| Campo | Valor |
|---|---|
| Nombre | Yeray Caturla |
| Clase | Desarrollador Backend Junior |
| Especialidad | Node.js · Express · Java · Python · Docker · AWS |
| Base | Elda (Alicante), España |
| Idiomas | Español (nativo) · Catalán (nativo) · Inglés (competencia profesional) |

**Bio (corta):**
Desarrollador backend junior, titulado en DAW y cursando la especialización en Administración
de Recursos y Servicios en la Nube. Construyo APIs REST con Node.js y Express, automatizo
procesos con Python y Django, y trabajo con bases de datos SQL y NoSQL. Vengo de sistemas
(SMR) y me interesa el DevOps: Docker, Linux y Terraform. Mi objetivo es dominar todo el ciclo
de vida del software, desde la API hasta su despliegue automatizado.

**Formación:**
| Título | Centro | Fechas | Estado |
|---|---|---|---|
| C.E. Administración de Recursos y Servicios en la Nube | IES Poeta Paco Mollà | 2026 – 2027 | En curso · DevOps, Terraform, Docker |
| Técnico Superior en Desarrollo de Aplicaciones Web (DAW) | IES Poeta Paco Mollà | 2024 – 2026 | Completado |
| Técnico en Sistemas Microinformáticos y Redes (SMR) | IES Poeta Paco Mollà | 2022 – 2024 | Completado |

**Experiencia (registro de misiones):**
1. **Desarrollador de Software Junior (prácticas)** — Sistemas de Innovación Bosa Digital SL ·
   Elda (Alicante) · Híbrido · mar. 2026 – jun. 2026
   - Herramientas en Python para automatizar procesos internos del área de ventas.
   - Investigación e integración de APIs externas y fuentes de datos para herramientas internas.
   - Lógica de backend con Django en el entorno de desarrollo de la empresa, con Git.
   - ⚠️ Acuerdo de confidencialidad: usar SOLO estas tres frases (ya públicas en el CV). No
     añadir detalles, cifras, nombres de herramientas, capturas ni repos. Por eso no es un
     proyecto.
2. **Técnico de Sistemas (prácticas)** — VKOficinas · 2024
   - Instalación, despliegue y configuración de sistemas operativos en equipos de clientes y
     centros educativos.
   - Montaje, reparación y mantenimiento de hardware; soporte técnico a usuarios.

---

## Proyectos (ALCHEMY)

Tres proyectos, en este orden en la ventana: Capyroad, Pakito's Gambling y este portfolio. Cada
uno lleva **"Por qué" / "Why"** justo después del resumen: el porqué del proyecto, con las razones
de Yeray, en primera persona.

### Capyroad ★ (destacado)
- **Qué es:** juego original dentro de Pakito's Gambling. Un capibara cruza una carretera
  saltando de calle en calle. Cada calle sube el multiplicador del premio (1.25x → 1.48x →
  1.74x → …) y también el riesgo de atropello (visible en %). En cada turno el jugador elige
  **Cruzar** (seguir arriesgando) o **Cobrar** (retirarse con lo ganado).
- **Contexto:** juego dentro de Pakito's Gambling · moneda ficticia.
- **Por qué:** El capibara era la mascota de nuestro casino: un animal que nos hacía gracia a todo
  el equipo. El backend avanzó rápido y sentía que al casino le faltaban juegos, así que aproveché
  el tiempo que quedaba hasta la entrega para inventar uno propio. Acabó siendo el más popular
  entre el jurado de la presentación.
- **Qué hice:** todo el ciclo, del backend al frontend en React.
- **Stack:** Node.js · Express · PostgreSQL · React.
- **Persistencia:** cada transacción (apuesta/cobro) se guarda en PostgreSQL asociada al id
  del usuario.
- **Repo:** https://github.com/yeraox/pakitos-gambling (dentro del proyecto).
- **Captura + vídeo:** `media-src/projects/capyroad.png` · `capyroad-raw.mp4`.

### Pakito's Gambling
- **Qué es:** plataforma web de recreación de juegos de azar con **moneda ficticia (sin dinero
  real)**.
- **Contexto:** Proyecto Final de DAW · equipo de 4 personas · feb. 2026 – jun. 2026.
- **Por qué:** Queríamos salir de lo típico: ni una tienda online ni una red social, sino algo
  grande, con una lógica compleja detrás y mucha seguridad. Con moneda ficticia, sin dinero real,
  para evitar problemas legales. Siendo cuatro, pudimos hacerlo a lo grande. Yo prefiero el
  backend, así que me encargué de esa parte, aunque acabé tocando también el frontend.
- **Qué hice:** backend de la plataforma (diseño de la API REST y del modelo de datos) y
  backend de varios juegos simulados:
  - **Ruleta** europea y americana (backend).
  - **Blackjack** (backend).
  - **Capyroad** (backend + frontend en React, de principio a fin).
  - Trabajo colaborativo con Git y GitHub.
- **Stack:** Node.js · Express · PostgreSQL · Git · GitHub.
- **Repo:** https://github.com/yeraox/pakitos-gambling
- **Demo:** no hay demo desplegada.
- **Capturas:** `pakitos-ruleta.png`, `pakitos-blackjack.png`.

### Este portfolio (ESTÁS AQUÍ)
- **Pestaña:** "Portfolio" en los dos idiomas. **Etiqueta:** ESTÁS AQUÍ / YOU ARE HERE.
- **Nombre:** Este portfolio / This portfolio.
- **Contexto:** Proyecto personal · nov. 2026 · desarrollado con Claude Code.
- **Resumen:** Portfolio con forma de RPG de 16 bits: pantalla de título, intro saliendo de la
  cueva y un campamento con un menú en rueda que abre mi CV por secciones. Sin motor de juegos:
  React, TypeScript y Canvas.
- **Por qué:** Quería un portfolio que se recordara: en vez de otra web con secciones, un pequeño
  juego donde cada parte de mi CV es un lugar del campamento. Está inspirado en Secret of Evermore,
  el primer videojuego al que jugué, junto a mi padre, y le tengo un cariño muy especial.
  (Nombrarlo como inspiración no choca con la regla de arte original: no se usa nada del juego.)
- **Qué hice:**
  - La idea y la dirección del proyecto: el mundo, cada pantalla y cada decisión de diseño.
  - Las referencias de arte: los personajes, los iconos y el fondo del campamento.
  - El desarrollo, con Claude Code (un agente de IA), fase a fase: en cada una revisé el
    resultado con capturas en móvil, tablet y escritorio antes de aprobarla.
  - Aprendí TypeScript con este proyecto.
- **Stack:** React · TypeScript · Vite · Canvas · Vitest · Playwright.
- **Accesibilidad:** se maneja con teclado, ratón o pantalla táctil, con lector de pantalla y sin
  animaciones.
- **Repo:** cuando sea público. **Demo:** es esta misma web, así que no lleva enlace.
- **Captura:** `media-src/projects/portfolio.png`, el campamento.

---

## Stack técnico (EQUIP)

Sin niveles numéricos: dos rangos según la confianza que declara Yeray. Cada tecnología lleva su
icono: el logo de Simple Icons pasado a píxeles, o uno genérico para SQL, APIs REST, Java, AWS,
WSL y Oracle Database, que no tienen logo allí. (AWS no aparece en el CV; lo confirmó Yeray.)

**Rango 1 — Dominio:**

| Grupo | Tecnologías |
|---|---|
| Lenguajes | JavaScript · Java · Python · SQL |
| Backend | Node.js · Express · APIs REST |
| Frontend | React |
| Bases de datos | PostgreSQL |
| DevOps y cloud | Docker · AWS · Linux · WSL |
| Herramientas | Git · GitHub |

**Rango 2 — He trabajado con:**

| Grupo | Tecnologías |
|---|---|
| Lenguajes | PHP · TypeScript |
| Backend | Django |
| Frontend | HTML · CSS |
| Bases de datos | Oracle Database · MongoDB |
| DevOps y cloud | Terraform |

---

## Sobre mí (DIARIO)

Con las respuestas de Yeray, adaptadas y validadas por él. Solo cuenta lo que él ha escrito: nada
más de su familia ni de dónde vive, más allá de Elda.

**Pestañas:** Desarrollador / Developer · Personal / Personal.

**Desarrollador** (cinco párrafos; lo que no está en el CV):
1. Siempre he estado rodeado de tecnología: mi tío, mi primo y mis amigos más cercanos se dedican a
   esto, así que en cierto modo sentía que estaba destinado a ello. En la ESO tuve mi primer
   ordenador y ahí empezó todo. Llegué por la FP: de los sistemas (SMR) al código (DAW), y ahora la
   nube. Ese camino me ha dado algo que valoro mucho: entender el software desde la máquina hasta
   que está desplegado.
2. Me gustan los retos y la parte técnica del backend, pero sabía que para destacar no bastaba con
   una capa: quería cubrir el ciclo completo del software. Por eso ahora me estoy especializando en
   la nube y DevOps.
3. Soy perseverante y trabajo duro. Mi tiempo libre también lo dedico a investigar sobre
   desarrollo e inteligencia artificial, y ahora mismo lo que más me motiva es desarrollar con IA:
   este portfolio, de hecho, lo he hecho con Claude Code.
4. En equipo me adapto: sé liderar y sé seguir. Donde trabajo suele haber buen rollo, y si no lo
   hay, lo creo: se me da bien desescalar tensiones y mediar en los conflictos. En la cancha era el
   base, el que organiza el juego, y en un equipo de trabajo hago algo parecido.
5. Busco un puesto junior en backend, full stack, frontend o DevOps. El próximo año quiero
   especializarme en DevOps.

**Personal:** "Fuera del código soy competitivo y muy constante. Esto es lo que me mueve:", y seis
aficiones, cada una con su icono de 16×16:

| Afición (icono) | Texto |
|---|---|
| Anime (estrella) | Me encantan los de deporte: mis favoritos son Haikyuu!! y Hajime no Ippo. Esa obsesión de sus personajes por conseguir lo que quieren es lo que me define. Y Boku no Hero Academia, que me ha acompañado desde que empecé a ver anime: para mí, una obra maestra. |
| Videojuegos (mando) | Todo empezó con Secret of Evermore, junto a mi padre; de ahí sale este portfolio. Tengo espíritu competitivo y juego mucho online, pero también me encantan los indies como Hades o Sea of Stars, y la saga Persona. |
| Gym (mancuerna) | Mi templo, mi lugar de tranquilidad. Entreno desde 2023, cuatro días a la semana, y me encanta sentirme en forma. Si te fijas, en el campamento están mis pesas. |
| Basket (balón) | Jugué de los 6 a los 18 años, de base titular y capitán, y subía de categoría para ayudar a los mayores: era el que orquestaba el juego. Las lesiones me obligaron a dejarlo, y así encontré mi pasión en el gym. |
| Cocina (sartén) | Cocino de todo y he aprendido solo. Mi plato estrella: solomillo al roquefort. Y sí, la paellera del campamento no está ahí por casualidad. |
| Null (huella) | No es mi perro de verdad: como el chico de Secret of Evermore, yo también quería ir con perro. Es un grifón de Bruselas, una raza que me encanta, y sus colores son un guiño al perro de mi pareja. Se llama Null por el valor null de la programación. |

---

## Contacto (COMMS)

| Campo | Valor |
|---|---|
| GitHub | https://github.com/yeraox |
| LinkedIn | https://www.linkedin.com/in/yeraycaturla |
| Email | yeraoxcaturlax@gmail.com |
| Ubicación | Elda (Alicante), España |
| Disponibilidad | Disponible · presencial, híbrido o remoto |
| CV en PDF | Descargar → `/cv/yeray-caturla-cv-es.pdf` (en inglés, «CV as PDF · Download» → `/cv/yeray-caturla-cv-en.pdf`) |

Teléfono: **no se publica en la web** (sí aparece en el PDF descargable, por decisión de Yeray).

---

## Material visual

Carpeta `media-src/projects/`: se publica, salvo el vídeo en bruto. `npm run media` lo deja en
`src/assets/projects/`: capturas en WebP a 640 y 1280 px de ancho, y el vídeo de Capyroad
recortado a los segundos 11–25 (14 s: un cruce, el cobro, "¡¡¡Has ganado!!!", una ronda nueva, el
atropello y "Has perdido :/"), sin audio, a 1280×586, en MP4 y WebM, con su portada. **El vídeo se
recorta a la app:** la grabación original muestra las pestañas, los marcadores y la barra lateral
del navegador, que no deben publicarse.

| Archivo | Contenido |
|---|---|
| `capyroad.png` | Capyroad, calle 4, 1.74x, riesgo 25 % (imagen principal de Capyroad) |
| `capyroad-raw.mp4` | Partida de Capyroad, 26 s (no se publica; sale el recorte de 14 s) |
| `pakitos-ruleta.png` | Ruleta americana, tablero completo |
| `pakitos-blackjack.png` | Blackjack con mano repartida |
| `portfolio.png` | El campamento de este portfolio, quieto, a 1440 (escenario 1280×720), hecho por `npm run share`; rehacer si cambia el campamento |
