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
| Créditos | DESARROLLADOR BACKEND · NODE.JS · EXPRESS · JAVA · DOCKER · AWS | BACKEND DEVELOPER · NODE.JS · EXPRESS · JAVA · DOCKER · AWS |
| Botones | PRESS START · SKIP INTRO | PRESS START · SKIP INTRO |

La línea de créditos se traduce según el idioma (el brief la daba solo en inglés). La línea del
centro de estudios se quitó a petición tuya (12-11-2026): no es relevante en el título; PRESS START y
SKIP INTRO son etiquetas de juego y se quedan en inglés en los dos idiomas.

---

## Página del juego y vista CV (fase 7)

**Pestaña del navegador y buscadores** (página del juego):
- Título: "Yeray Caturla — Desarrollador Backend Junior" / "Yeray Caturla — Junior Backend Developer".
- Descripción: "Portfolio de Yeray Caturla, desarrollador backend junior (Node.js, Express, Java,
  Python, Docker, AWS), con forma de RPG de 16 bits." (en inglés: "Portfolio of Yeray Caturla,
  junior backend developer (…), shaped as a 16-bit RPG.")
- Texto alternativo de la imagen al compartir: "Pantalla de título del portfolio: «YERAY CATURLA»
  en letras doradas sobre un cielo nocturno de 16 bits."

**Enlace siempre visible en el juego:** "VER CV" / "VIEW CV".

**Vista CV** (`/cv/` en español, `/cv/en/` en inglés): se construye con este mismo contenido
(perfil, experiencia, formación, proyectos, stack y contacto), así que no hay que mantenerla
aparte. Textos propios:

| Texto | Español | Inglés |
|---|---|---|
| Título de la pestaña | CV · Yeray Caturla — Desarrollador Backend Junior | CV · Yeray Caturla — Junior Backend Developer |
| Descripción | CV de Yeray Caturla, desarrollador backend junior en Elda (Alicante): Node.js, Express, Java, Python, Docker y AWS. Proyectos, experiencia, formación y contacto. | CV of Yeray Caturla, junior backend developer in Elda (Alicante, Spain): Node.js, Express, Java, Python, Docker and AWS. Projects, experience, education and contact. |
| Botón del PDF | Descargar CV (PDF) | Download CV (PDF, in Spanish) |
| Volver | Volver al portfolio | Back to the portfolio |
| Otro idioma | English version | Versión en español |
| Apartados | Contacto · Perfil · Experiencia · Formación · Proyectos · Stack técnico | Contact · Profile · Experience · Education · Projects · Tech stack |

**PDF:** `references/cv_es_yeray_caturla.pdf` tal cual (incluye el teléfono: decisión tuya),
copiado con `npm run cv` a `public/cv/yeray-caturla-cv-es.pdf`. **No hay PDF en inglés** (TODO
tuyo): la versión inglesa enlaza el español y lo dice en el botón.

---

## Campamento (fase 3)

**Títulos del banner** (propuestos por mí a partir de la tabla de `BRIEF.md`; cámbialos si
quieres). La etiqueta del anillo sigue en inglés (EQUIP, ALCHEMY…).

| Etiqueta | Título del banner |
|---|---|
| EQUIP | Equipo — Proyectos |
| ALCHEMY | Alquimia — Stack técnico |
| STATS | Estadísticas — Perfil |
| BUFFS | Estado — Entrenamiento |
| CRAFT | Artesanía — Cocina |
| COMMS | Configuración — Contacto |

**HUD:** "Yeray" y "Null". **Encabezado de la página** (solo para lectores de pantalla):
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

## EQUIP — Proyectos

### Pakito's Gambling
- **Qué es:** plataforma web de recreación de juegos de azar con **moneda ficticia (sin dinero
  real)**.
- **Contexto:** Proyecto Final de DAW, equipo de 3 personas · feb. 2026 – jun. 2026.
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
- **Qué hice:** todo el ciclo, del backend al frontend en React.
- **Stack:** Node.js · Express · PostgreSQL · React.
- **Persistencia:** cada transacción (apuesta/cobro) se guarda en PostgreSQL asociada al id
  del usuario.
- **Repo:** https://github.com/yeraox/pakitos-gambling (dentro del proyecto).
- **Captura + vídeo:** `media-src/projects/capyroad.png` · `capyroad-raw.mp4`.

### Herramientas internas de automatización — Bosa Digital
- **Contexto:** prácticas, mar. 2026 – jun. 2026.
- **Stack:** Python · Django · APIs externas · Git.
- **Qué hice:** herramientas para automatizar procesos internos de ventas e integración de APIs
  externas y fuentes de datos.
- **Confidencial:** acuerdo de confidencialidad firmado. Mostrar solo lo de arriba, sin cifras,
  repo, demo ni capturas. En la ventana puede llevar una etiqueta tipo "[CLASIFICADO]" como guiño,
  sin insinuar más de lo que dice el CV.

---

## ALCHEMY — Stack técnico

Sin niveles numéricos: dos rangos según la confianza declarada por Yeray (confirmado).

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
| Lenguajes | PHP |
| Backend | Django |
| Frontend | HTML · CSS |
| Bases de datos | Oracle Database · MongoDB |
| DevOps y cloud | Terraform |

Nota: AWS no aparece en el CV actual; lo ha confirmado Yeray.

---

## BUFFS — Entrenamiento
`status: draft` (aplazado; oculto en producción hasta tener datos reales).
TODO: rutina de 6 días (división por días), sesiones/semana, constancia real.

## CRAFT — Cocina
`status: draft` (aplazado; oculto en producción hasta tener las recetas).
TODO: receta de paella valenciana y de aceitunas curadas.

---

## COMMS — Contacto

| Campo | Valor |
|---|---|
| GitHub | https://github.com/yeraox |
| LinkedIn | https://www.linkedin.com/in/yeraycaturla |
| Email | yeraoxcaturlax@gmail.com |
| Ubicación | Elda (Alicante), España |
| Disponibilidad | Disponible · presencial, híbrido o remoto |
| CV | Versión web → `/cv/` (en inglés, `/cv/en/`) |
| CV en PDF | Descargar → `/cv/yeray-caturla-cv-es.pdf` (solo existe en español) |


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

ffmpeg ya está instalado (lo usan también los scripts de personajes y escenas).
