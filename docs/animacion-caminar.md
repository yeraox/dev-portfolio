# Animación de caminar de Yeray: análisis y ficha técnica

> Estado: **aprobada e implementada** el 11-11-2026: sello, espejo, pose nueva, 8 fotogramas,
> ahora como anexo de la fase 2. Lo que se construyó, y en qué se aparta de esta propuesta, está
> en la **sección 7** y en `docs/informes/fase-2-anexo-caminar.md`.
> Se usará sobre todo en la **fase 6** (sales de la cueva caminando hacia la cámara).
> Todas las cifras están medidas con nuestro pipeline (`scripts/sprites/lib.mjs`). No son estimaciones a ojo.

---

## 0. Resumen en 30 segundos

Has añadido dos hojas nuevas: `front_walk_animation.png` (4 frames de frente) y
`sidewalk_animation.png` (6 frames de lado). Tienen dos cosas buenas:
- A tamaño normal se ven muy bien.
- La ropa, el pelo, las gafas y los colores casan con tus poses aprobadas.

**Pero no sirven tal cual para un ciclo limpio, por cuatro motivos medidos:**

1. **No tienen una rejilla de píxeles real.**
   - Los "píxeles" miden entre 4 y 9 px de la imagen en vez de un tamaño fijo.
   - Al encajarlas en la rejilla del juego cambia entre el **18 % y el 27 % de los píxeles
     de la cara** de un frame a otro: gafas, ojos y bigote parpadean.
2. **No hay rebote.** La cabeza está exactamente a la misma altura en todos los frames
   (0 px de diferencia), así que camina "flotando", sin el peso de la mochila.
3. **De frente solo hay 2 dibujos distintos.**
   - Los frames 1 y 4 son la misma pose de pie.
   - Los frames 2 y 3 son el mismo paso, con la misma pierna.
   - Falta el paso con la otra pierna.
4. **De lado, el orden no forma un ciclo.**
   - La secuencia es paso, A, B, paso, B, A: las piernas se cruzan de golpe sin un frame
     intermedio.
   - En los frames "intermedios" los dos pies están apoyados.

**Mi recomendación ("sello"):**
- La cabeza sale de **un solo frame** y se reutiliza idéntica, píxel a píxel, en todos los
  demás. Solo cambian brazos y piernas.
- El rebote se añade moviendo el cuerpo píxeles enteros.
- Así las gafas y el bigote no pueden parpadear, y todo sigue siendo píxeles de tus
  referencias: no se pinta nada.
- Con lo que ya tienes salen **8 frames de frente y 8 de lado**.

Para seguir necesito que respondas a las preguntas de la sección 6.

---

## 1. Qué hay en `references/grandes/`

| Archivo | Contenido | Tamaño del personaje (px del juego) | Uso hoy |
|---|---|---|---|
| `frente_yeray.jpg` | De pie, de frente | 42×110 | ✅ Pose `idle` aprobada |
| `brazos_cruzados_yeray.jpg` | Brazos cruzados | 43×111 | ✅ Pose aprobada |
| `camina_grande_yeray.jpg` | Un paso de lado | 33×73 (dibujado ×1,5) | ✅ Pose `side` aprobada |
| `retrato_yeray.jpg` | Retrato | 64×94 | ✅ Retrato aprobado |
| `caminado_frente_yeray.jpg`, `caminando_yeray.jpg` | Hojas antiguas de caminar | 73 de alto: otra escala | ❌ Descartadas en la fase 2 |
| **`front_walk_animation.png`** | **4 frames de frente (nueva)** | **42–43×110** (113 con el pie adelantado) | Analizada aquí |
| **`sidewalk_animation.png`** | **6 frames de lado (nueva)** | **43–60×110** (ver 2.6) | Analizada aquí |

Las dos hojas nuevas llevan la marca de agua «Lumina» en una esquina. No afecta: el recorte
solo coge las figuras.

---

## 2. Diagnóstico frame a frame

En esta sección:
- Los frames se numeran **de izquierda a derecha empezando en 1**.
- Las letras F y L indican la hoja: F1–F4 son los de frente y L1–L6 los de lado.
- "px" son píxeles del juego, salvo que diga "px de la imagen".

### 2.1 La rejilla de píxeles

El pixel art de verdad tiene todos los píxeles del mismo tamaño. Medí el largo de los tramos
de color en filas de cada figura:

| Imagen | Tramos más frecuentes (px de la imagen) | Regularidad de la rejilla (0–1) |
|---|---|---|
| `frente_yeray.jpg` (aprobada) | 11, 23, 34: múltiplos exactos de 11,55 | **0,73** |
| `front_walk_animation.png` | Cualquier valor de 4 a 9 | **0,15–0,23** |
| `sidewalk_animation.png` | Cualquier valor de 2 a 9 | **0,11–0,19** |

**Conclusión:** las hojas nuevas imitan el pixel art, pero sus píxeles son de tamaños
distintos. Es típico de los generadores de imágenes. Para usarlas hay que encajarlas en una
rejilla, y cada frame encaja un poco distinto. De ahí sale el parpadeo de 2.2.

### 2.2 Estabilidad de cabeza, gafas y bigote

Encajé cada frame en la rejilla del juego, los alineé con el frame 1 (moviéndolos píxeles
enteros) y conté cuántos píxeles cambian en cada zona. El objetivo ideal es 0 %: la cabeza no
cambia de forma al andar.

**De frente:**

| Zona | F1 | F2 | F3 | F4 |
|---|---|---|---|---|
| Pelo | 0 % | 12 % | 13 % | 14 % |
| Cara, gafas y bigote | 0 % | 24 % | 27 % | 18 % |
| Chaleco y camiseta | 0 % | 43 % | 38 % | 28 % |
| Piernas y botas | 0 % | 55 % | 57 % | 23 % |

**De lado:**

| Zona | L1 | L2 | L3 | L4 | L5 | L6 |
|---|---|---|---|---|---|---|
| Pelo | 0 % | 5 % | 8 % | 5 % | 15 % | 5 % |
| Cara, gafas y bigote | 0 % | 17 % | 20 % | 15 % | 24 % | 10 % |

**Lo más revelador:** F1 y F4 son **la misma pose de pie** y aun así cambia el 18 % de la cara
y el 28 % del chaleco. Esa es la "deriva" del generador: redibuja un poco cada frame. Al
animarlo, la montura de las gafas cambia de grosor, los ojos cambian de forma (en F4 uno
pierde el brillo y parece medio cerrado), el bigote cambia de silueta y los bolsillos del chaleco "bailan".

### 2.3 Peso y rebote

Medí dónde queda la cabeza en cada frame:
- **De frente:** la misma fila exacta en los 4 frames.
- **De lado:** la misma fila en los 6 frames, con una diferencia de 1 px de la imagen como
  mucho (0,15 px del juego).

**No hay ningún rebote.** En un paso real el cuerpo baja al apoyar el pie y sube al pasar la
pierna. Sin eso no se nota el peso de la mochila ni de las botas.

### 2.4 Ciclo de frente (F1–F4)

| Frame | Qué es | Pierna adelantada | Brazo adelantado |
|---|---|---|---|
| F1 | De pie | — | — |
| F2 | Paso | Tu izquierda (cae 4 px más abajo: perspectiva) | Tu derecha ✅ opuesto a la pierna |
| F3 | **El mismo paso que F2** (las piernas difieren un 19 %, igual que la deriva de F1 frente a F4) | Tu izquierda | Tu derecha |
| F4 | **La misma pose que F1** | — | — |

- **Bien:** el brazo va opuesto a la pierna y el pie adelantado baja unos píxeles para dar
  profundidad.
- **Falta:** el paso con la pierna derecha y el brazo izquierdo. Tal como está, el ciclo
  cojea: siempre avanza la misma pierna.

### 2.5 Ciclo de lado (L1–L6, mirando a la derecha)

- **Pierna cercana:** la que se ve clara, con el bolsillo cargo.
- **Pierna lejana:** la que se ve más oscura.

| Frame | Qué es | Pierna cercana | Brazo cercano |
|---|---|---|---|
| L1 | Pies juntos, los dos apoyados | Debajo | Colgando |
| L2 | Zancada **A** | Delante | Detrás ✅ |
| L3 | Zancada **B** | Detrás | Delante ✅ |
| L4 | Pies juntos (como L1) | Debajo | Colgando |
| L5 | Zancada **B** (como L3, algo distinta) | Detrás | Delante ✅ |
| L6 | Zancada **A** (como L2, algo distinta) | Delante | Detrás ✅ |

- **Bien:**
  - Cada zancada tiene el brazo opuesto a la pierna.
  - La amplitud del braceo es buena.
  - La mochila tiene volumen y las botas se ven pesadas.
- **Mal:**
  - Si se reproducen en orden, de L2 a L3 las piernas se cruzan de golpe.
  - L1 y L4 tienen los dos pies planos en el suelo: parecen "estar de pie" más que pasar la
    pierna.
- **Arreglo sin dibujar nada:** reordenar a **A (L2), pies juntos (L1), B (L3), pies juntos
  (L4)**.

### 2.6 Escala entre hojas

- **De frente:** encaja con claridad a **110 px de alto**, la misma escala que tu `idle`
  aprobado (42×110). Perfecto.
- **De lado:** su rejilla es tan irregular que admite dos lecturas: 85 px o 110 px de alto.
  - **A 110 px** tiene la misma altura que la de frente y se ve bien, con un pero: algunos
    contornos salen de 2 px en vez de 1.
  - **A 85 px** los contornos quedan más limpios, pero al girarse de frente a lado el
    personaje **encogería un 23 %**.
  - **Propuesta: 110 px.**

### 2.7 Píxeles sueltos y colores

- **Píxeles teñidos de fondo:** son píxeles azulados pegados al contorno, una mezcla del
  contorno con el fondo. Hay **27–59 por frame de frente** y 1–13 por frame de lado. Tu
  `idle` aprobado tiene 0. Se ven como motas turquesa en el borde.
- **Islas sueltas (≤ 3 px):** ninguna en ningún frame. ✅
- **Colores de los materiales:** muy parecidos a tus poses aprobadas.
  - Piel: `#a8714a` en la hoja de frente frente a `#9f6e4e` en el `idle`.
  - Camiseta: la hoja lateral la tiene algo más clara (`#e5dcc3` frente a `#c7c2ab`).
  - Si pasas del `idle` aprobado a caminar con estas hojas, se notará un pequeño cambio de
    color al arrancar (ver la pregunta 3 de la sección 6).

---

## 3. Ficha técnica del ciclo (el objetivo)

### 3.1 Lienzo, rejilla y anclaje

| Regla | Frente | Lado |
|---|---|---|
| Lienzo fijo, igual en todos los frames (construido) | 46×113 px | 65×110 px |
| Altura del personaje en el frame más alto | 110 px | 110 px |
| Fila de la parte de arriba del pelo en el frame más alto | 0 | 0 |
| Línea de suelo (última fila de las suelas) | 109 | 109 |
| Margen bajo el suelo | 3 px para el pie que avanza hacia la cámara | — |
| Eje fijo en todos los frames | Centro de la cabeza, en el centro del lienzo | Centro de la cabeza, en el centro del lienzo |

(La propuesta decía 48×116 y 64×116 con 2 px de margen arriba. El script calcula el lienzo
justo: el rebote solo baja el cuerpo, así que arriba no hace falta margen. Centrar el lienzo en
la cabeza hace que al girar a la izquierda, con el espejo, la cabeza no se mueva.)

- **1 píxel del frame = 1 píxel del juego.** Nada de medios píxeles ni suavizado.
- **El ciclo es "en el sitio":** los frames no avanzan; el juego mueve el personaje.
- **Hacia la izquierda = espejo del lado derecho.** Ya lo hacemos con la pose `side`.
- **Recortar cada frame por su borde rompe la alineación.** Por eso el lienzo es fijo. Hoy
  `cutout.mjs` recorta cada figura por su borde; para las hojas de animación hay que cambiarlo
  a lienzo fijo.

### 3.2 Partes rígidas: el "sello"

Los artistas de pixel art con personajes detallados no redibujan la cabeza en cada frame. La
dibujan una vez y la reutilizan en todos (en Aseprite se llaman *linked cels*, celdas
enlazadas). Aquí:

| Parte | Regla |
|---|---|
| **Cabeza:** pelo rizado, cara, gafas, ojos, bigote, perilla y orejas | **Idéntica píxel a píxel** en todos los frames de una dirección. Solo se mueve con el rebote. El pelo no se deforma, para no perder volumen. |
| **Tronco:** chaleco con bolsillos, camiseta y tirantes | Idéntico, movido con el rebote. Los brazos van por encima. |
| **Mochila** (de lado) | Propuesta: igual que el tronco, pero llegando **un frame tarde** a cada altura. **Construido: se mueve con el cuerpo, sin retraso** (separarla exige recortarla del tronco; queda como mejora posible). |
| **Bolsillos del pantalón** | Mismo tamaño en todos los frames. Viajan con el muslo. |
| **Botas** | Mismo dibujo. De lado, en 3 posiciones: talón, planta y punta. |
| **Brazos y piernas** | Lo único que cambia de verdad entre frames. |

### 3.3 Rebote (peso)

Cuántos píxeles baja el cuerpo (cabeza, tronco y brazos) respecto al frame más alto. Los pies
apoyados no se mueven: la diferencia la absorbe la cintura (el chaleco tapa 1–2 filas del
pantalón) y se lee como "doblar las rodillas".

| Momento | Cuerpo | Mochila (de lado) |
|---|---|---|
| Contacto (el talón toca el suelo) | +1 | igual que el frame anterior |
| Bajada (el peso cae sobre la pierna) | **+2** (punto más bajo) | +1 |
| Paso (la otra pierna cruza) | +1 | **+2** (llega tarde al fondo) |
| Arriba (impulso con la punta) | 0 (punto más alto) | +1 |

### 3.4 Desglose de lado: 8 frames mirando a la derecha

| # | Momento | Pierna cercana (clara) | Pierna lejana (oscura) | Brazo cercano | Cuerpo | Mochila | ¿Existe hoy? |
|---|---|---|---|---|---|---|---|
| 1 | Contacto A | Delante, talón apoyado, punta arriba | Detrás, solo la punta toca | Detrás | +1 | 0 | ✅ L2 (o L6) |
| 2 | Bajada A | Delante, pie plano, rodilla doblada | Detrás, despegando | Detrás, al máximo | +2 | +1 | 🔁 L2 con el cuerpo +2 |
| 3 | Paso A | Vertical bajo la cadera, sostiene | Levantada, rodilla doblada, cruzando | Junto al cuerpo | +1 | +2 | 🟡 L1 (los dos pies apoyados; mejor con la lejana levantada) |
| 4 | Arriba A | Detrás, empujando de punta | Delante, estirándose en el aire | Empieza a ir delante | 0 | +1 | 🔁 L1 con el cuerpo a 0 |
| 5 | Contacto B | Detrás, solo la punta toca | Delante, talón apoyado | Delante | +1 | 0 | ✅ L3 (o L5) |
| 6 | Bajada B | Detrás, despegando | Delante, pie plano, rodilla doblada | Delante, al máximo | +2 | +1 | 🔁 L3 con el cuerpo +2 |
| 7 | Paso B | Levantada, cruzando | Vertical, sostiene | Junto al cuerpo | +1 | +2 | 🟡 L1, igual que el 3 (L4 añadía deriva sin aportar nada) |
| 8 | Arriba B | Delante, estirándose | Detrás, empujando | Empieza a ir detrás | 0 | +1 | 🔁 L1 con el cuerpo a 0 |

✅ = existe. 🔁 = sale de un frame existente moviendo el cuerpo, sin dibujar. 🟡 = sirve, pero
mejoraría con un dibujo nuevo.

### 3.5 Desglose de frente: 8 frames hacia la cámara

Reglas de perspectiva:
- **El pie que avanza** baja 2–4 px y la bota se ve entera.
- **El pie que queda atrás** sube 1–2 px y la bota se ve más corta, tapada por el pantalón.
- **El brazo que avanza:** el puño se acerca al centro del cuerpo (como en F2).
- **El brazo que va atrás:** se estrecha y se ve menos mano.

| # | Momento | Pierna adelantada | Brazo adelantado | Cuerpo | ¿Existe hoy? |
|---|---|---|---|---|---|
| 1 | Contacto izq. | Tu izquierda (baja 4 px) | Tu derecha | +1 | ✅ F2 |
| 2 | Bajada izq. | Tu izquierda, pie plano | Tu derecha, al máximo | +2 | 🔁 F2 con el cuerpo +2 |
| 3 | Paso | Pies juntos (mejor con uno levantado) | Brazos junto al cuerpo | +1 | 🟡 F1 |
| 4 | Arriba | Pies juntos | Brazos junto al cuerpo | 0 | 🔁 F1 con el cuerpo a 0 |
| 5 | Contacto der. | Tu derecha | Tu izquierda | +1 | 🪞 F2 en espejo (solo el cuerpo; la cabeza no se refleja) |
| 6 | Bajada der. | Tu derecha, pie plano | Tu izquierda, al máximo | +2 | 🪞🔁 |
| 7 | Paso | Pies juntos | Brazos junto al cuerpo | +1 | 🟡 F1 (F4 añadía deriva) |
| 8 | Arriba | Pies juntos | Brazos junto al cuerpo | 0 | 🔁 |

🪞 = espejo. Reflejar el paso para obtener el de la otra pierna es un truco clásico de los RPG
de 16 bits en la vista de frente. Funciona porque tu ropa es casi simétrica: chaleco,
bolsillos y tirantes. La cabeza se pone siempre sin reflejar, así el pelo no cambia de lado.

**Variantes más cortas** (por si el ciclo de 8 resulta demasiado):
- **6 frames:** se quitan los dos "Arriba". Quedan Contacto (+1), Bajada (+2) y Paso (0).
- **4 frames:** Contacto (+1), Paso (0), Contacto con la otra pierna (+1), Paso (0). Es lo
  que dice hoy `DESIGN.md`.

### 3.6 Ritmo y velocidad

- **Duración del ciclo:** la misma con cualquier número de frames, **≈ 0,96 s por ciclo**
  (dos pasos, unos 125 pasos por minuto: paso tranquilo con mochila).
  - 8 frames × 120 ms
  - 6 frames × 160 ms
  - 4 frames × 240 ms
- **Los pies no deben patinar.** La velocidad de desplazamiento tiene que ser el largo de un
  paso dividido entre la duración de un paso (0,48 s). Mediremos el largo del paso entre los
  talones del frame de contacto cuando estén los frames definitivos.
- **La posición en pantalla siempre en píxeles enteros del juego.**
- **Null trota a 6 × 110 ms = 0,66 s.** Da más pasitos que tú y lo deja atrás: encaja con
  "Null trota detrás de ti" de la fase 6.

---

## 4. Control de calidad

Cuando decidas el camino, añadiré estas comprobaciones a `npm run characters`. Si una falla,
el comando avisa.

| # | Comprobación | Objetivo | Antes del sello (hojas tal cual) |
|---|---|---|---|
| 1 | Cabeza idéntica entre frames tras alinear | 0 píxeles distintos | 10–27 % ❌ (con el sello: 0 % por construcción) |
| 2 | Altura del personaje en el frame más alto | 110 px | 110 ✅ |
| 3 | Suelas en la línea de suelo cuando el pie apoya | Fila 111 | Sin lienzo fijo ❌ |
| 4 | Centro de la cadera fijo | ± 0 px | Sin lienzo fijo ❌ |
| 5 | Rebote presente y con los valores de 3.3 | 0 / +1 / +2 | 0 en todos ❌ |
| 6 | Píxeles teñidos de fondo en el contorno | 0 | 1–59 por frame ❌ (se limpian como el borde azulado de la fase 2) |
| 7 | Islas sueltas de ≤ 3 px | 0 | 0 ✅ |
| 8 | Brazo opuesto a la pierna en cada contacto | Siempre | ✅ en todos los pasos |

**Revisión a ojo, con capturas de la página como en la fase 2:**
- Una sección en `/dev/personajes` con la tira de frames a escala real.
- Papel cebolla: cada frame encima del anterior, semitransparente.
- Reproducción a velocidad real y a ×0,25.
- La referencia al lado.

---

## 5. Cómo conseguir los frames: tres caminos

### A. Sello con lo que ya tienes ⭐ recomendado

Un script monta los 8 + 8 frames así:
1. **Cabeza:** la de un único frame, puesta en todos.
2. **Brazos y piernas:** los de cada frame de tus hojas.
3. **Paso con la otra pierna de frente:** el cuerpo de F2 en espejo.
4. **Rebote:** el cuerpo se mueve 0, 1 o 2 px enteros.

**A favor:**
- Elimina el parpadeo de gafas, ojos, bigote y pelo por construcción.
- No se pinta ni un píxel: todo sale de tus referencias.
- Se puede hacer ya.

**En contra:**
- Es componer frames, un paso más allá de "tal cual". Por eso necesito tu OK.
- Los frames de "paso" seguirán teniendo los dos pies apoyados.
- Hay que vigilar la costura del cuello. Lo reviso con capturas.

**Por fases:** primero el sello de la cabeza. Si después ves que los bolsillos del chaleco
"bailan", hago lo mismo con el tronco. Es más laborioso, porque los brazos lo tapan.

### B. Regenerar con tu generador y aplicar después el sello

Pídele **solo los dibujos que faltan o mejoran**: los dos "pasos" con una pierna levantada, de
lado y de frente. Los generadores no mantienen la cabeza idéntica ni una rejilla exacta, así
que **el sello de A se aplica igual**. Usa la misma ropa, el mismo fondo liso, una sola fila
y el mismo tamaño que tus hojas actuales. Instrucciones en inglés para el generador:

```text
Pixel art sprite sheet, single row, 4 frames, flat solid teal background, same character,
same outfit and same scale as the attached reference (curly hair, round navy glasses,
moustache and small goatee, olive tactical vest with pockets, off-white t-shirt, khaki cargo
trousers, brown hiking boots, dark brown backpack). Side view facing right.
Frame 1: passing pose, near leg straight under the hip, far leg lifted with bent knee
crossing behind it. Frame 2: same but mirrored roles (far leg straight, near leg lifted).
Frames 3-4: the same two poses seen from the front, walking toward the camera.
Strict pixel grid: every pixel the same size, no anti-aliasing, no blur, 1-pixel dark outline,
no drop shadow, full body visible, feet on the same ground line in every frame.
```

### C. Limpieza a mano en Aseprite

- **Cómo:** tú o un artista importáis los frames encajados como capas, enlazáis la cabeza y
  corregís piernas y píxeles a mano.
- **A favor:** es la mejor calidad posible.
- **En contra:**
  - Unas 2–4 horas por dirección para alguien con soltura.
  - Ya no serían "tus referencias tal cual".

---

## 6. Qué necesito de ti

1. **Camino:**
   - **A (sello)** — recomendado.
   - **A y luego B** si quieres los "pasos" con la pierna levantada.
   - **C.**
2. **Espejo:** ¿te vale que el paso con la pierna derecha de frente sea el de la izquierda
   reflejado (sin reflejar la cabeza)?
3. **Pose de reposo de frente:**
   - **(a)** Pasa a ser F1 de la hoja nueva: el arranque al caminar es perfecto, sin cambio
     de color ni de forma.
   - **(b)** Se mantiene el `idle` aprobado: al empezar a andar puede notarse un leve cambio
     de color en la piel y la camiseta.
   - **Recomiendo (a).** Lo mismo aplica a la pose de lado: la hoja nueva sustituiría a
     `camina_grande` y quedaría a la misma escala que la de frente.
4. **Número de frames:** 8 (recomendado: la intro se ve de cerca), 6 o 4. Si eliges 8 o 6,
   actualizo `DESIGN.md`, `BRIEF.md` y el plan, que hoy dicen 4.
5. **Cuándo:** al empezar la **fase 6**, que es donde se camina, o ahora como un anexo de la
   fase 2. No afecta a la fase 3: en el campamento estás quieto.

**Respuestas (11-11-2026):** camino A, espejo sí, pose nueva, 8 fotogramas, ahora.

---

## 7. Resultado (11-11-2026)

**Cómo quedó:**
- `npm run characters` monta los dos ciclos con `scripts/sprites/walk.mjs`.
- Cada dirección son **6 dibujos** guardados en **un solo PNG**, uno debajo de otro:
  - `yeray-front-walk.png`: 46×678, 20 KB.
  - `yeray-side-walk.png`: 65×660, 22 KB.
- Los ciclos de 8 fotogramas los reutilizan (`characters.ts`).
- **La pose quieta de frente y la de lado** son el fotograma "Arriba" de cada ciclo. Al echar a
  andar o pararse no cambia nada del dibujo.

**Comprobaciones de la sección 4, en los 12 dibujos:**

| Comprobación | Resultado |
|---|---|
| Cabeza idéntica al sello | 0 píxeles distintos ✅ |
| Rebote | 0 / +1 / +2 exactamente como en 3.3 ✅ |
| Píxeles teñidos de fondo | 0 ✅ |
| Islas sueltas | 0 ✅ |
| Pies de lado | Siempre en la fila 109 ✅ |
| Pies de frente | En la fila 109 o por debajo (pie adelantado) ✅ |

Si alguna falla, el script se detiene con error.

**Cómo se hace el rebote:**
- Baja todo lo que está por encima de la cintura (fila 70 del frame de referencia).
- Los brazos que cuelgan por debajo bajan enteros. Si se cortaran a la altura de la cintura, un
  antebrazo en diagonal quedaría partido.
- Las piernas no se mueven. El chaleco tapa 1–2 filas del pantalón.

**Revisión:** en `/dev/personajes` puedes ver:
- Los dos ciclos a velocidad real y a ×0,25.
- Los 8 fotogramas en dos filas, una por paso.
- El papel cebolla: la cabeza coincide exacta de un fotograma a otro.
- La hoja de referencia.

**Límites conocidos (no bloquean):**
- Los fotogramas de "Paso" tienen los dos pies apoyados: tus hojas no tienen un dibujo con la
  pierna levantada. Se mejoraría con el camino B (sección 5).
- La mochila no lleva el retraso de un fotograma.
- Quedan algunos píxeles del contorno algo azulados (mezcla de contorno y fondo con más de un
  60 % de contorno). Son contorno de verdad: quitarlos abriría huecos.
- La pose de brazos cruzados sigue saliendo de su referencia. Su piel es algo más clara que la
  de las hojas nuevas.
