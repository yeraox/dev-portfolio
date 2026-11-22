# Contenido del portfolio (fuente en español)

Fuente: `references/cv_es_yeray_caturla.pdf` (CV, nov. 2026). Este archivo es la fuente de
verdad del contenido. Desde la fase 4 está en `src/content/es.ts` (español) y `src/content/en.ts`
(inglés, traducido por mí, pendiente de tu revisión). Los dos idiomas, lado a lado, en
**`/dev/textos`** (solo en desarrollo). Si cambias algo aquí, cámbialo también en los dos
archivos (o pídemelo).
`TODO` = falta un dato que solo puede dar Yeray. `PREGUNTA` = pendiente de confirmar.

---

## Pantalla de título (fase 5)

| Línea | Español | Inglés |
|---|---|---|
| Nombre | YERAY CATURLA | YERAY CATURLA |
| Créditos | DESARROLLADOR BACKEND JUNIOR · DEVOPS | JUNIOR BACKEND DEVELOPER · DEVOPS |
| Botones | PRESS START · SKIP INTRO | PRESS START · SKIP INTRO |

**Esquinas** (desde la fase 8): arriba a la izquierda el pergamino del CV (nombre "CV") y, desde
la ronda 2 de la fase 8, arriba a la derecha el engranaje (nombre "AJUSTES" / "SETTINGS"), que
abre la misma ventana de ajustes que la rueda, sin "Volver al título". Los botones ES/EN del
título se quitaron: el idioma se elige en Ajustes.

La línea de créditos se traduce según el idioma (el brief la daba solo en inglés). Desde el
22/11/2026 (bloque T de la fase 8) dice solo el puesto y DevOps: quien busque eso entra y ve el
stack dentro. Antes: "DESARROLLADOR BACKEND · NODE.JS · EXPRESS · JAVA · DOCKER · AWS". La línea del
centro de estudios se quitó a petición tuya (12-11-2026): no es relevante en el título; PRESS START y
SKIP INTRO son etiquetas de juego y se quedan en inglés en los dos idiomas.

---

## Página del juego (fase 7; sin vista CV desde la fase 8)

**Pestaña del navegador y buscadores:**
- Título: "Yeray Caturla — Desarrollador Backend Junior" / "Yeray Caturla — Junior Backend Developer".
- Descripción: "Portfolio de Yeray Caturla, desarrollador backend junior (Node.js, Express, Java,
  Python, Docker, AWS), con forma de RPG de 16 bits." (en inglés: "Portfolio of Yeray Caturla,
  junior backend developer (…), shaped as a 16-bit RPG.")
- Texto alternativo de la imagen al compartir: "Pantalla de título del portfolio: «YERAY CATURLA»
  en letras doradas sobre un cielo nocturno de 16 bits."

**El CV es el PDF.** La vista CV web (`/cv/`) y el enlace "VER CV" se quitaron en la fase 8. El CV
se pide desde el pergamino del título (arriba a la izquierda, con su nombre "CV") y desde el CV
de la rueda. Los dos abren la misma pregunta (ver "Campamento").

**Sin JavaScript** (un aviso que solo ve quien lo tiene desactivado):

| Texto | Español | Inglés |
|---|---|---|
| Aviso | Este portfolio es un pequeño juego y necesita JavaScript. | This portfolio is a small game and needs JavaScript. |
| Enlace | Descargar mi CV en PDF (español) | Download my CV as a PDF (English) |

**PDF:** uno por idioma, tal cual (incluyen el teléfono: decisión tuya). `npm run cv` los copia:
- `references/cv_es_yeray_caturla.pdf` → `public/cv/yeray-caturla-cv-es.pdf`;
- `references/cv_en_yeray_caturla.pdf` → `public/cv/yeray-caturla-cv-en.pdf` (fase 8).

Cada idioma descarga el suyo.

---

## Campamento (fase 3; la rueda, desde la fase 8)

**La rueda.** Cada hueco lleva su nombre real encima del icono, siempre visible y traducido. El
título del banner (y de la ventana) es "nombre de juego — qué es". Desde la fase 8, el equipo
(EQUIP) es tu stack y la alquimia (ALCHEMY) tus proyectos. BUFFS y CRAFT ya no existen.

| Hueco | Nombre (ES / EN) | Banner (ES) | Banner (EN) |
|---|---|---|---|
| Proyectos | PROYECTOS / PROJECTS | Alquimia — Proyectos | Alchemy — Projects |
| Stack | STACK / STACK | Equipo — Stack técnico | Equipment — Tech Stack |
| Perfil | PERFIL / PROFILE | Estadísticas — Perfil | Stats — Profile |
| Contacto | CONTACTO / CONTACT | Configuración — Contacto | Config — Contact |
| CV | CV / CV | Pergamino — Descargar CV | Scroll — Download CV |
| Ajustes | AJUSTES / SETTINGS | Engranaje — Ajustes | Gear — Settings |
| Sobre mí (borrador, solo en desarrollo) | SOBRE MÍ / ABOUT ME | Diario — Sobre mí | Journal — About Me |

**La ventana del CV** (al elegir el CV en la rueda):

| Texto | Español | Inglés |
|---|---|---|
| Pregunta | ¿Descargar el CV en PDF? | Download the CV as a PDF? |
| Archivo | PDF · español · 3,1 MB | PDF · English · 3.1 MB |
| Respuestas | SÍ · NO | YES · NO |

El peso tiene que coincidir con el PDF real: una prueba lo comprueba.

**La ventana de ajustes** (al elegir el engranaje en la rueda):

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
"Animaciones: NO" se para todo lo que se mueve solo (la intro, las transiciones, el giro de la
rueda, la hoguera, la respiración, los gestos, los parpadeos y la cortinilla de las ventanas).
Si el visitante no ha elegido, manda su sistema (si pide menos movimiento, empieza en NO y el
aviso lo dice); si elige, manda su elección. Las dos elecciones se recuerdan en la próxima visita.
La misma ventana se abre desde el engranaje del título, sin "Volver al título" (ronda 2 de la
fase 8). **Lo legal** (ronda 2): sin aviso legal ni banner de cookies, porque la web no tiene
actividad económica, no usa cookies ni analítica y solo guarda en el navegador preferencias y
estado del juego (`localStorage`: idioma, animaciones, `visited`, `explored`). Si algún día se
añade analítica, hay que revisarlo.

**Línea de ayuda de las ventanas** (abajo; con ratón y teclado / en pantallas táctiles):

| Ventana | Español | Inglés |
|---|---|---|
| Con secciones | ← → cambian de sección · Rueda o ↑ ↓ para leer · Esc vuelve al campamento. | ← → change section · Wheel or ↑ ↓ to read · Esc returns to camp. |
| (táctil) | Desliza a los lados o toca una pestaña para cambiar de sección. | Swipe sideways or tap a tab to change section. |
| Proyectos | ← → cambian de proyecto · Rueda o ↑ ↓ para leer · Esc vuelve al campamento. | ← → change project · Wheel or ↑ ↓ to read · Esc returns to camp. |
| (táctil) | Desliza a los lados o toca un proyecto para cambiar. | Swipe sideways or tap a project to change. |
| Contacto | Esc vuelve al campamento. | Esc returns to camp. |

Desde la ronda 2 de la fase 8 la rueda del ratón solo desplaza el texto: ya no cambia de sección.

**HUD:** "Yeray" y "Null", con las barras **HP** y **XP** (etiquetas de juego, iguales en los dos idiomas). La XP se llena al explorar las secciones; un lector de pantalla oye "Experiencia: {n} de 4 secciones exploradas" / "Experience: {n} of 4 sections explored". **Encabezado de la página** (solo para lectores de pantalla):
"Yeray Caturla · Desarrollador Backend Junior".

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
     añadir detalles, cifras, nombres de herramientas, capturas ni repos.
2. **Técnico de Sistemas (prácticas)** — VKOficinas · 2024
   - Instalación, despliegue y configuración de sistemas operativos en equipos de clientes y
     centros educativos.
   - Montaje, reparación y mantenimiento de hardware; soporte técnico a usuarios.

---

## Proyectos (ALCHEMY)

Tres proyectos, en este orden en la ventana: Capyroad, Pakito's Gambling y este portfolio. Cada
uno lleva **"Por qué" / "Why"** justo después del resumen (bloque S de la fase 8, 22/11/2026):
el porqué del proyecto, con las razones de Yeray, en primera persona. Bosa Digital ya no es un
proyecto: está solo en el Registro de misiones de Perfil (decisión de Yeray, 22/11/2026; por el NDA
no enseñaba nada más).

### Pakito's Gambling
- **Qué es:** plataforma web de recreación de juegos de azar con **moneda ficticia (sin dinero
  real)**.
- **Contexto:** Proyecto Final de DAW, equipo de 4 personas · feb. 2026 – jun. 2026 (eran 4:
  corregido por Yeray el 22/11/2026).
- **Por qué:** Queríamos salir de lo típico: ni una tienda online ni una red social, sino algo
  grande, con una lógica compleja detrás y mucha seguridad. Con moneda ficticia, sin dinero real,
  para evitar problemas legales. Siendo cuatro, pudimos hacerlo a lo grande. Yo prefiero el
  backend, así que me encargué de esa parte, aunque acabé tocando también el frontend.
- **Stack:** Node.js · Express · PostgreSQL · Git/GitHub.
- **Qué hice:** backend de la plataforma (diseño de la API REST y del modelo de datos) y
  backend de varios juegos simulados:
  - **Ruleta** europea y americana (backend).
  - **Blackjack** (backend).
  - **Capyroad** (backend + frontend en React, de principio a fin) → ver ficha propia abajo.
  - Trabajo colaborativo con Git y GitHub.
- **Repo:** https://github.com/yeraox/pakitos-gambling
- **Demo:** no hay demo desplegada.
- **Capturas:** `pakitos-ruleta.png`, `pakitos-blackjack.png` (ver "Material visual").

### Capyroad ★ (destacado)
- **Qué es:** juego original dentro de Pakito's Gambling. Un capibara cruza una carretera
  saltando de calle en calle. Cada calle sube el multiplicador del premio (1.25x → 1.48x →
  1.74x → …) y también el riesgo de atropello (visible en %). En cada turno el jugador elige
  **Cruzar** (seguir arriesgando) o **Cobrar** (retirarse con lo ganado).
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

### Este portfolio — ESTÁS AQUÍ (ronda 2 de la fase 8)
Decidido por Yeray el 21/11/2026: entra, con su papel y cómo se ha desarrollado. **Pendiente de su
revisión** (texto escrito por mí a partir del plan).
- **Pestaña:** "Portfolio" en los dos idiomas. **Etiqueta:** ESTÁS AQUÍ / YOU ARE HERE.
- **Nombre:** Este portfolio / This portfolio.
- **Contexto:** Proyecto personal · nov. 2026 · desarrollado con Claude Code.
- **Resumen:** Portfolio con forma de RPG de 16 bits: pantalla de título, intro saliendo de la
  cueva y un campamento con un menú en rueda que abre mi CV por secciones. Sin motor de juegos:
  React, TypeScript y Canvas.
- **Por qué:** Quería un portfolio que se recordara: en vez de otra web con secciones, un pequeño
  juego donde cada parte de mi CV es un lugar del campamento. Está inspirado en Secret of Evermore,
  el primer videojuego al que jugué, junto a mi padre, y le tengo un cariño muy especial. (Nombrarlo
  como inspiración no choca con la regla de arte original: no se usa nada del juego.)
- **Qué hice:**
  - La idea y la dirección del proyecto: el mundo, cada pantalla y cada decisión de diseño.
  - Las referencias de arte: los personajes, los iconos y el fondo del campamento.
  - El desarrollo, con Claude Code (un agente de IA), fase a fase: en cada una revisé el
    resultado con capturas en móvil, tablet y escritorio antes de aprobarla.
  - Aprendí TypeScript con este proyecto.
- **Stack:** React · TypeScript · Vite · Canvas · Vitest · Playwright.
- **Accesibilidad:** se maneja con teclado, ratón o pantalla táctil, con lector de pantalla y sin
  animaciones.
- **Repo:** cuando sea público (fase 10). **Demo:** es esta misma web, así que no lleva enlace.
- **Captura:** `media-src/projects/portfolio.png`, el campamento (ver "Material visual").
- **Si quieres** contar cómo hiciste las referencias de arte, se añade a "Qué hice".

---

## Stack técnico (EQUIP)

Sin niveles numéricos: dos rangos según la confianza declarada por Yeray (confirmado).

Cada tecnología lleva su icono (fase 8): el logo de Simple Icons pasado a píxeles, o uno genérico
para SQL, APIs REST, Java, AWS, WSL y Oracle Database, que no tienen logo allí.

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

Nota: AWS no aparece en el CV actual; lo ha confirmado Yeray. TypeScript entra en "He trabajado
con" en la ronda 2 de la fase 8 (decisión de Yeray, 21/11/2026: lo está aprendiendo con este
portfolio).

---

## Sobre mí
`status: draft`: sección nueva (fase 8), oculta en producción. Cómo se organiza y qué cuenta
queda pendiente de decidir contigo. (BUFFS y CRAFT se quitaron en la fase 8.)

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


Teléfono: **no se publica en la web** (sí aparece en el PDF descargable, decisión de Yeray).

---

## Material visual

Carpeta: `media-src/projects/` (NO está en .gitignore: esto sí se publica, salvo el vídeo en
bruto). `npm run media` lo optimiza en la fase 4 y lo deja en `src/assets/projects/`:
capturas en WebP a 640 y 1280 px de ancho (6–28 KB cada una) y el vídeo de Capyroad recortado a
los segundos 11–25 (14 s: un cruce, el cobro, "¡¡¡Has ganado!!!", una ronda nueva, el atropello y
"Has perdido :/"), sin audio, a 1280×586, en MP4 (208 KB) y WebM (234 KB), con su portada.
**El vídeo se recorta a la app:** la grabación original muestra las pestañas, los marcadores y la
barra lateral del navegador (correo, redes…), que no deben publicarse.

| Archivo | Contenido | Estado |
|---|---|---|
| `capyroad.png` | Capyroad, calle 4, 1.74x, riesgo 25 % | ✅ Usar (imagen principal de Capyroad) |
| `capyroad-raw.mp4` | Partida de Capyroad, 26 s, H.264, ~11 MB | ✅ Hecho: 14 s, sin audio, solo la app, 208 KB |
| `pakitos-ruleta.png` | Ruleta americana, tablero completo | ✅ Usar |
| `pakitos-blackjack.png` | Blackjack con mano repartida | ✅ Usar |
| `portfolio.png` | El campamento de este portfolio, quieto, a 1440 (escenario 1280×720) | ✅ Hecho por `npm run share` contra `npx vite preview` (sin el borrador de "Sobre mí"); rehacer si cambia el campamento |

ffmpeg ya está instalado (lo usan también los scripts de personajes y escenas).
