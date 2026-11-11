# Fondo del campamento: qué necesito de ti

> Para la fase 3. Mientras no llegue, la web usa un fondo provisional dibujado en código
> (`src/scenes/camp/provisionalBackground.ts`), que es solo de relleno.

## Qué es
**Una imagen** del campamento, sin personajes, que uso **tal cual**: la paso a su rejilla de
píxeles y la pinto detrás de ti y de Null, igual que hicimos con tus personajes. Es la misma
escena para la intro de la fase 6 (sales de la cueva hacia el campamento), así que la boca de
la cueva tiene que estar dentro.

## Requisitos técnicos

| Requisito | Valor | Por qué |
|---|---|---|
| Proporción | **16:9** (por ejemplo 1920×1080 o 1536×864) | Es la forma de la escena: 640×360 |
| Tamaño de píxel | Píxeles **grandes e iguales**, como si fuera una imagen de **320×180 ampliada ×6** (cada píxel ≈ 6×6 px a 1920 de ancho) | Cada píxel del fondo ocupa 2×2 de la escena. Más gordos que los tuyos: así el fondo queda detrás y no compite |
| Vista | **¾ desde arriba** (cámara alta y un poco de frente), como tus personajes | Para que tú y Null "estéis de pie" sobre ese suelo |
| Ambiente | **Noche**, luz cálida solo cerca de la hoguera, **poco contraste** y colores apagados (verdes oscuros, marrones, roca gris, sombras azul noche) | Los protagonistas son tú, Null y el menú |
| Prohibido | Personajes, animales, texto, logotipos, interfaz, marcos y bordes | Los pongo yo encima |
| Marca de agua | Mejor **sin ella**. Si tu generador la pone siempre, que vaya en la **esquina inferior derecha** | Ahí la tapa el retrato de Null en el ordenador, y en el móvil esa zona no se ve |

## Composición
Las posiciones van en porcentaje del ancho (x) y del alto (y) de la imagen, contando desde
arriba a la izquierda.

```
 x:  0%        25%                         75%        100%
    ┌──────────┬───────────────────────────┬──────────┐ y: 0%
    │ árboles  │  roca oscura (aquí va el  │ árboles  │
    │          │  banner, sin detalles)    │          │
    │ barra de │     ┌─────────────┐       │  tienda  │
    │dominadas │     │ BOCA CUEVA  │       │          │ ~35%
    │ entre 2  ├─────┴─────────────┴───────┤ mancuer- │
    │ árboles  │                           │ nas y    │
    │          │    CLARO DE TIERRA VACÍO  │ discos   │
    │ hoguera  │  (aquí estáis tú, Null y  │          │
    │ con trí- │   el menú: NADA dibujado) │ caja con │
    │ pode y   │                           │ tarro de │
    │ paellera │                           │ aceitunas│ ~80%
    │ suelo    │                           │  suelo   │
    │ liso     │                           │  liso    │
    └──────────┴───────────────────────────┴──────────┘ y: 100%
```

| Zona | Dónde | Qué |
|---|---|---|
| Arriba en el centro | x 25–75 %, y 0–18 % | Roca o sombra **sin detalles**: encima va el banner con el nombre de la sección |
| Boca de la cueva | Centrada; su borde inferior hacia y 35 %; ancho ≈ 15 % de la imagen | Abertura oscura en una pared de roca. De ahí sales en la intro |
| Claro | x 28–72 %, y 35–95 % | **Suelo de tierra llano y vacío**. Ahí estáis tú y Null, con el menú circular alrededor |
| Izquierda | x 0–25 % | Dos árboles con una **barra de dominadas** improvisada entre ellos (y 15–60 %). La **hoguera** con un trípode y una **paellera** humeante encima, hacia x 20–28 %, y 65–80 % |
| Derecha | x 72–100 % | Una **tienda** de lona (y 25–65 %). Delante de ella, **mancuernas y discos** (x 72–80 %), y una **caja** con un **tarro de cristal de aceitunas** |
| Esquinas de abajo | x 0–22 % y 78–100 %, y 80–100 % | **Suelo liso**: ahí van los retratos del HUD |

**Escala:** de pie en el claro medirías un **30 % del alto** de la imagen. La tienda es algo más
alta que tú y los árboles mucho más.

**En el móvil** se ve solo el centro: de x 22 % a x 78 %. Por eso la hoguera con la paellera y
las mancuernas van cerca de esos bordes, para que se vean también ahí.

## Opcional: fuego animado
Una segunda imagen con **3 o 4 dibujos de las llamas** de la hoguera, uno al lado de otro, sobre
fondo liso y con el mismo estilo y escala. Si el humo de la paellera sale también en 3 dibujos,
mejor. Con eso animo la hoguera. Sin ella, la hoguera queda quieta o le doy un parpadeo de color
sencillo.

## Instrucciones para el generador (en inglés)
```text
16-bit pixel art background, 16:9, large uniform square pixels as if a 320x180 image were
upscaled 6x, no anti-aliasing, no blur. Top-down 3/4 view (high camera, slightly in front), the
same view as a SNES action RPG. Night scene, low contrast, muted colours: dark greens, browns,
grey rock, deep blue shadows; warm orange light only around the campfire.
A small adventurer's camp in front of a cave: a rock wall across the top with a dark cave mouth
in the centre. In front of it, an empty, flat dirt clearing in the middle of the image (nothing
on it). On the left: two trees with an improvised pull-up bar between them, and a campfire with
a metal tripod holding a paella pan with a little steam. On the right: a canvas tent, dumbbells
and weight plates in front of it, and a wooden crate with a glass jar of olives. The bottom-left
and bottom-right corners are plain ground. The top centre is dark rock with no detail.
No characters, no people, no animals, no text, no logos, no UI, no border, no watermark.
```

## Cómo guardarla
- `references/grandes/campamento.png` (el fondo).
- `references/grandes/campamento_fuego.png` (las llamas, si las haces).

## Qué haré cuando llegue
1. La paso a su rejilla de píxeles, como a los personajes. Compruebo que salen unos 320×180
   píxeles y que la rejilla es regular. Si no lo es, te lo enseño con capturas antes de usarla.
2. Sustituyo el fondo provisional y coloco las sombras de tus pies y los de Null sobre el claro.
3. Si hay llamas, animo la hoguera a unos 6 dibujos por segundo, parada con "reducir
   movimiento".
4. Lo reviso con capturas reales a 390, 768 y 1440, contigo y Null encima.
