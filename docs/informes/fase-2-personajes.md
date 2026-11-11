# Informe · Fase 2 — Personajes: tú y Null

**Fecha:** 9 de noviembre de 2026
**Estado:** ✅ **Terminada.** Elegiste la opción A: tus referencias tal cual.
**Dónde verla:** `npm run dev` → http://localhost:5173/dev/personajes

## Resultado final (léelo primero)
- **Los personajes son tus imágenes de referencia grandes tal cual.** Cada una está reconstruida
  en su rejilla de píxeles original, con sus colores, y guardada como PNG transparente en
  `src/assets/characters/`: 15 imágenes, unos 90 KB.
- **`src/assets/characters/characters.ts`** define las poses: qué imágenes forman cada una, su
  velocidad y su tamaño relativo, para que tus tres poses midan lo mismo.
- **`<PixelSprite>`** (`src/components/`) dibuja una pose con píxeles nítidos, recorre los
  fotogramas si tiene varios y hace un balanceo de 2 px a saltos si tiene un solo dibujo.
- **Se ha retirado todo el sistema anterior:** sprites dibujados a mano, extractor de rejillas,
  cabezas trasplantadas y página `/dev/sprites`. El motor de rejillas (`src/engine/`) se queda solo
  para los iconos de 16×16 del menú.
- **Tamaño en el juego:** en una pantalla de 1440 px mides unos 220 px de alto, más o menos el
  30 % de la escena.
- **Pendiente para más adelante** (no bloquea): para un ciclo de andar real necesitas más imágenes
  grandes tuyas andando. Ahora tus poses solo se balancean.

Las secciones siguientes son el **historial** de cómo se llegó aquí (rondas 1–7 y la opción A).
Describen sistemas que ya no existen.

## Resumen en tres líneas
- La ronda 1 (sprites dibujados a mano como texto) **no te gustó, con razón**: el parecido tenía un techo que no se podía superar.
- Cambiamos de enfoque. Ahora una herramienta convierte automáticamente tus imágenes de referencia grandes en sprites limpios para nuestro motor.
- Para que se conserven las gafas, el bigote y la perilla, el sprite necesita unos 80 px de alto, así que **la escena pasa de 320×180 a 640×360** (decisión tuya).

---

## 0e. Opción A: tus referencias tal cual (`/dev/opcion-a`)

Tras la ronda 7 preguntaste por alternativas al motor. La conclusión fue que el problema era el
arte, no el motor, y elegiste probar la **opción A**: usar tus imágenes grandes directamente.

**Cómo funciona.**
- `npm run characters` (`scripts/sprites/cutout.mjs`) reconstruye cada imagen en su **rejilla de
  píxeles original**: un píxel por cada "píxel" que dibujó la IA, con sus colores tal cual. Solo
  se quitan el fondo, el contorno de pegatina, el ruido JPEG y las islas sueltas.
- Cada figura se guarda como **PNG transparente** en `src/assets/characters/`: 15 imágenes, unos
  88 KB en total. Tu figura de frente, por ejemplo, mide 42×110.
- Se muestran ampliadas por un número entero con `image-rendering: pixelated`, así que se ven
  idénticas a tus referencias y nítidas.
- El código común de las dos herramientas está ahora en `scripts/sprites/lib.mjs`.

**Qué se ve en la página.**
- **"En escena":** tú de frente, con los brazos cruzados y de lado en los dos sentidos. Null
  sentado, trotando (6 fotogramas) y andando hacia la cámara (3 fotogramas).
- **Comparación** de cada pose entre tu referencia, la opción A y el sprite actual.
- **Los dos retratos.**

**Lo que implica elegir la A.**
- Tu personaje mide unas 110 filas de alto, contra las 88 previstas: en una escena de 640×360,
  más o menos el 30 % de la altura.
- La imagen de lado (73 filas) se amplía ×3 y las de frente (110 filas) ×2 para que midan lo
  mismo. Los "píxeles" de la vista de lado son, por tanto, algo más grandes.
- Animación: tus poses solo tienen un dibujo cada una, así que se mueven con un balanceo de 2 px.
  Null sí tiene ciclos reales de trote y de andar.
- Los colores son los de tus referencias, sin aclarar la piel. Si la quieres más clara, se puede
  aplicar el mismo ajuste que antes.

## 0d. Ronda 7: revisión exhaustiva con capturas de la web

**Método.** Capturas de cada pose en la propia página `/dev/sprites`, a ×4 y en varios momentos de
cada animación, puestas al lado de su referencia grande al mismo tamaño.

| Lo que mostraban las capturas | Causa | Solución |
|---|---|---|
| Andar de frente y de lado: cuerpo borroso y en bloques, más ancho que la pose de pie, con motas grises | Los cuerpos venían de las hojas pequeñas ampliadas | **Todo sale de tus 3 imágenes grandes.** Andar de frente = tu imagen de frente levantando un pie y luego el otro. Andar de lado = tu zancada y la misma con las piernas invertidas. Mismo cuerpo, cara y estilo en todos los fotogramas |
| La camiseta del centro salía verde oscuro | Era un hueco: el gris de la camiseta estaba dentro del margen para quitar el fondo | El fondo se quita solo si está conectado con los bordes de la imagen. Los huecos interiores solo si son casi idénticos al fondo |
| Las gafas salían grises o negras | El azul-violeta de la montura tiene pocos píxeles y la paleta lo sustituía, y la regla anti-aura lo volvía negro | El azul-violeta siempre está en la paleta. La montura (píxeles azul marino de la cabeza que tocan piel u ojo) pasa a `#3a3258`. La neutralización del contorno solo afecta al **borde exterior** |
| Líneas violetas en los brazos | La regla de las gafas tocaba también los contornos de los brazos | Limitada a la cabeza (el 40 % superior) |

**Revisado y correcto:** los dos retratos y las tres poses de Null frente a sus referencias, y la
página a 390, 768 y 1440 px sin desbordamiento ni errores.

## 0c. Ronda 6: "céntrate únicamente en las referencias grandes"

**Qué estaba mal.**
- **La cabeza dibujada a mano no encajaba con el cuerpo.** Medía 30 filas sobre un cuerpo de 73
  (un 41 % de la altura); en tu referencia la cabeza es un 36 %.
- **Las imágenes grandes se reducían mal,** porque la herramienta detectaba la mitad de su tamaño
  de píxel real. Por eso los ojos salían duplicados.

**Qué se ha hecho.**
1. **Fuera todo lo hecho a mano.** Sin retoques de cara y sin mullet: solo tus referencias grandes.
2. **Las imágenes grandes se extraen con su tamaño de píxel real:** 11,55 px en
   `frente_yeray.jpg`, 17,6 px en `camina_grande_yeray.jpg` y 11,6 px en
   `brazos_cruzados_yeray.jpg`, todas a 88 px de alto. Son las poses de pie, de lado y de brazos
   cruzados.
3. **En las hojas de andar solo se aprovecha el cuerpo.** La cabeza se sustituye por la de tu
   imagen grande de esa vista (de frente o de lado), **encajada cuello con cuello**. El cuello es
   la fila más estrecha entre la cabeza y los hombros.
4. **Cada hoja de andar se escala** para que su cuerpo, del cuello a los pies, mida lo mismo que el
   de tu imagen grande. Así la cabeza tiene el tamaño correcto para los hombros y todas las poses
   miden lo mismo.

## 0b. Ronda 5: "mira las referencias y arregla esa cara"

**Qué fallaba de verdad.** Al poner tu referencia y el sprite lado a lado y al mismo tamaño, el
problema eran las **proporciones**, no los detalles. En tu referencia las gafas son grandes y
redondas (cada lente ocupa casi un tercio de la cara), el iris es marrón y grande, las cejas casi
no se ven, el bigote es poblado y la cúpula de rizos es más ancha que la cara. En el sprite las
gafas eran dos rectángulos pequeños, los ojos puntos, las cejas gruesas y la cara cuadrada.

**Cómo se ha arreglado.**
1. **Plantilla:** reduzco tu imagen grande de frente (`frente_yeray.jpg`) y la de lado
   (`camina_grande_yeray.jpg`) al tamaño exacto de la cabeza del sprite y paso sus colores a la
   paleta. Así cada rasgo queda en el sitio donde está en tu referencia.
2. **Limpieza a mano** sobre esa plantilla:
   - Monturas redondas en el **azul-violeta de tus referencias**.
   - Ojo con **iris marrón** (`#8b5a3c`), pupila, brillo y blanco solo en las esquinas.
   - Bigote poblado que cae por los lados y perilla pequeña.
   - Orejas y laterales rapados oscuros.
   - Mullet por detrás de la mandíbula (de frente) y por la nuca (de lado).
3. **Colores nuevos:** si un retoque necesita un color que la paleta extraída no tiene (el iris y
   la montura), la herramienta lo añade.
4. **Una cabeza por vista:** la de frente y la de lado se colocan en todos los fotogramas de su
   vista, como en la ronda 4.

## 0a. Ronda 4: tus comentarios y qué se ha cambiado

| Tu comentario | Causa real | Solución |
|---|---|---|
| "El mullet es inexistente al caminar de lado (normal y espejo)" | El mullet automático no encontraba bien la nuca en las vistas de lado | El mullet de lado está **dibujado a mano sobre la cabeza de lado**: una masa de rizos de 9 filas que cae por la nuca. Como esa cabeza se usa en todos los fotogramas de lado, sale siempre, también en espejo |
| "Al respirar, con los brazos cruzados y al caminar hacia la cámara el ojo se ve raro o desaparece" | Las hojas de andar miden 73 px por figura y las estiraba a 80: se duplicaban 7 filas, a veces justo en los ojos | Las hojas se usan **a su tamaño exacto (73 px)**, sin estirar. La zona de ojos, gafas y cejas está **limpiada a mano**: blanco del ojo, pupila de 2×2, montura y puente definidos |
| "En cada cambio de fotograma parece una persona diferente" | Cada fotograma se reducía por separado y la cara salía distinta en cada uno | **Una sola cabeza por vista** (frente y lado), copiada en todos los fotogramas. Cambia el cuerpo, la cara nunca |
| (detectado por mí) Al neutralizar el contorno, tres colores de la paleta quedaron iguales | — | Se fusionan los colores repetidos |
| (detectado por mí) Las cejas oscuras daban cara de enfado y el ojo de lado parecía un círculo blanco | — | Cejas en marrón medio y ojo de lado pequeño (blanco + pupila mirando al frente) |

**Cómo están hechas ahora las cabezas.** En `scripts/sprites/sources.mjs` hay dos retoques,
`FRONT_FIX` y `SIDE_FIX`, con las filas limpiadas a mano. Usan colores con nombre (contorno, piel,
cristal, pelo…), no las letras de la paleta, así que **no se rompen si vuelves a extraer**. La
herramienta toma la cabeza retocada de un fotograma (`walkFront1` de frente y `walkSide2` de lado)
y la coloca, alineada, en todos los fotogramas de esa vista.

**Tamaño:** tu sprite pasa a 36×73. Sigue a 640×360; solo es un poco más bajo.

## 0. Ronda 3: tus comentarios y qué se ha cambiado

| Tu comentario | Causa | Solución |
|---|---|---|
| "Errores en algunos rasgos como los ojos" | La pose de pie salía de tu imagen más grande; al reducirla tanto, las gafas y los ojos se duplicaban | La pose de pie usa ahora un fotograma de tu hoja de andar de frente, que tiene los ojos limpios. Además, los brillos de 1 píxel (reflejos de las gafas y ojos de Null) se conservan al reducir |
| "Un aura azul rara alrededor" | Tus referencias tienen el contorno azul marino saturado (`#030421`) y un púrpura muy oscuro | Esos colores pasan a un negro neutro (`#0e0b0e`) |
| "Mi personaje lleva un mullet corto" | Tus referencias no lo dibujan | La herramienta lo añade. **De lado**, rizos que caen por la nuca, cada vez más estrechos. **De frente**, rizos por detrás del cuello entre la mandíbula y los hombros. Solo pinta sobre el cuello o el fondo, nunca sobre la ropa ni la mochila |
| "Aclara un poco el tono de la piel" | La piel salía de las referencias | Los tonos de piel suben un 12 % de luminosidad. Pelo, botas y mochila no cambian. Se ajusta con `skinLighten` en `scripts/sprites/sources.mjs` |
| Dos referencias nuevas de Null | — | **Trote de lado:** 6 fotogramas de `null_caminando.jpg`. **Andando hacia la cámara:** los 3 de frente de `null_frente.jpg` |
| (detectado por mí) Un remolino encima de la cabeza parecía una antena | El remolino de las referencias, reducido | Se recortan las filas superiores mucho más estrechas que la cabeza |

## 1. Qué pasó en la ronda 1 y por qué se descartó
- **Cómo se hizo:** dibujé los sprites letra a letra, con un tamaño de 32×40 para ti y 24×20 para
  Null.
- **El problema:** al dibujar como texto no veo el resultado mientras trabajo, solo después en
  capturas. Corregí tres veces el pelo, las gafas y la cara de Null, pero el resultado seguía muy
  lejos de tus referencias.
- **Tu valoración:** "me parece horrible". Tenías razón.
- **La lección:** para el parecido hace falta partir de tus imágenes, no de mi dibujo.

## 2. Decisiones tomadas en esta fase

| Decisión | Resultado | Quién |
|---|---|---|
| Origen de los sprites | **Extraídos automáticamente de tus imágenes** de `references/grandes/` | Yo propuse, tú aportaste las imágenes |
| Resolución de la escena | **640×360** en lugar de 320×180. Se amplía ×2 en portátiles y ×3 en Full HD | Tú |
| Tamaño de tu sprite | 39×80 px. Por debajo de unos 72 px de alto las gafas desaparecen | Yo, tras comparar 64, 72, 80 y 88 |
| Colores de los personajes | Salen de tus imágenes: hasta 18 para ti y 12 para Null. Antes eran 15 elegidos a mano | Yo, tras comparar 15, 18 y 20 |
| Límite de colores por sprite | Sube de 15 a 24. Inspirado en la SNES pero no estricto; así el verde del chaleco y el caqui del cargo no se mezclan | Yo |
| Iconos del menú | Siguen dibujados a mano (16×16), ahora solo con colores de la interfaz | Yo |
| Motor de sprites | **Se mantiene igual**: solo cambia de dónde salen las rejillas | Yo |

## 3. Cómo funciona la herramienta (`scripts/sprites/`)

`npm run sprites` lee `sources.mjs` (qué imagen se convierte en qué) y, para cada imagen:

1. **La lee con ffmpeg.**
2. **Quita el fondo liso:** lo rellena desde los bordes y aplica un margen de color que también se
   lleva el borde suavizado.
3. **Separa cada figura,** porque algunas imágenes traen varias poses, y las ordena por filas y de
   izquierda a derecha.
4. **Detecta el tamaño real del "píxel"** de la imagen, midiendo cada cuánto se repiten los
   cambios de color.
5. **Reconstruye la figura en su rejilla original**, tomando el color del centro de cada píxel.
6. **Quita el contorno claro de pegatina** que traen algunas hojas. Solo el frío y azulado, para no
   tocar tu camiseta blanca.
7. **Saca una paleta común por personaje** (corte por la mediana más ajuste fino), así todos los
   fotogramas comparten colores.
8. **Reduce todas las figuras de una misma hoja con el mismo factor,** para que no cambies de
   tamaño al andar. Cada celda toma el color mayoritario.
9. **Limpia** los píxeles sueltos y las islas diminutas.
10. **Centra cada fotograma abajo en un lienzo común** y escribe `src/assets/sprites/generated/*.gen.ts`.

Con `npm run sprites:preview` también deja imágenes ampliadas ×8 en `.screenshots/sprites/`.

**Si cambias o añades una referencia,** basta con volver a ejecutar `npm run sprites`. Los archivos
`generated/` no se editan a mano.

## 4. Qué hay ahora en `/dev/sprites`
- **Tú (36×73):**
  - De pie respirando.
  - Brazos cruzados.
  - Andando hacia la cámara, con los 6 fotogramas de tu hoja.
  - Andando de lado, con los 8 fotogramas de tu hoja, y en espejo.
- **Null (lienzo de 38×36):** sentado, trote de lado (6 fotogramas) y andando hacia la cámara
  (3 fotogramas).
- **Los dos retratos**, extraídos de tus imágenes.
- **"Juntos a escala real del juego (×2)":** cómo os veréis en la escena de 640×360.
- **"Todos tus fotogramas extraídos":** cada fotograma por separado, para revisar el orden de las
  secuencias de andar.
- Los iconos del menú, los fondos alternativos y las referencias, como antes.

## 5. Cómo se ha comprobado

| Comprobación | Resultado |
|---|---|
| `npm run typecheck` / `npm run lint` | ✅ sin errores ni avisos |
| `npm test` | ✅ 92 de 92. Cada sprite generado tiene el tamaño exacto, todos sus píxeles están en la leyenda y todos sus colores están en `palette.ts` |
| Capturas a 390 / 768 / 1440 | ✅ sin desplazamiento horizontal y sin errores de consola |
| Revisión visual | Varias rondas con hojas de contacto de los 20 fotogramas. Corregidos el halo azul, la camiseta que se borraba, el chaleco gris y los píxeles sueltos |

## 6. TypeScript en esta fase

| Concepto | Explicación en una línea | Dónde verlo |
|---|---|---|
| `readonly string[]` | Un array que no se modifica; las funciones devuelven uno nuevo | `FrameGrid` en `src/engine/grid.ts` |
| Parámetros por defecto | `by = 1`: si no lo pasas, vale 1 | `shiftRowsDown` en `grid.ts` |
| Unión `number \| number[]` | Admite un número o una lista, y `typeof` distingue cuál es | `anim` en `src/engine/sprites.ts` |
| Tupla | `[number, number, number]`: exactamente tres números | `hexToRgb` en `sprites.ts` |
| `WeakMap<K, V>` | Mapa con objetos como clave, usado como caché | `rasterCache` en `sprites.ts` |
| Anotar un tipo al exportar | `AVATAR_PALETTE: Palette = AVATAR_GEN.palette` fija la forma aunque el dato venga de un archivo generado | `src/styles/palette.ts` |
| `keyof typeof` | Los nombres de las claves de un objeto como tipo | `IconId` en `src/dev/SpritesDemo.tsx` |
| `satisfies` | Cada hoja de sprites cumple `SpriteSheet` sin perder los nombres de sus animaciones | `avatar.ts`, `nullDog.ts` |
| Pruebas parametrizadas | `describe.each` repite las pruebas para cada sprite | `sprites.test.ts` |

## 7. Problemas encontrados y cómo se resolvieron

| Problema | Solución |
|---|---|
| Los sprites dibujados a mano no se parecían | Extraerlos de tus referencias |
| Reducir una imagen directamente mezclaba colores y perdía las gafas | Reconstruir primero su rejilla original y después reducir por color mayoritario |
| A 48–64 px de alto se perdía la cara | Sprite de 80 px y escena de 640×360 |
| Halo azul claro alrededor de las figuras | Más margen al quitar el fondo y pelado del contorno de pegatina |
| El pelado borraba tu camiseta | Solo se pelan los píxeles claros azulados; la camiseta es un blanco cálido |
| Chaleco gris en lugar de verde | Paleta de 18 colores en lugar de 15 |
| El editor no dejaba sobrescribir archivos modificados con scripts | Se reescribieron desde la terminal |

## 8. Lo que necesito de ti

1. **Revisa el parecido** en `/dev/sprites`. Si algo no te convence, lo más eficaz es cambiar la
   imagen de referencia y volver a extraer, en vez de retocar a mano.
2. **Revisa el orden de las secuencias de andar** en "Todos tus fotogramas extraídos". Uso las
   imágenes en el orden de la hoja: `walkSide0`–`walkSide7` y `walkFront0`–`walkFront5`. Si algún
   paso "salta", dime qué fotogramas quitar o reordenar.
3. ✅ **Null:** con tus dos hojas nuevas ya trota y anda con fotogramas reales. Opcional para más
   adelante: sentado jadeando y de pie pidiendo ("Null is waiting…").
4. ✅ **Tono de piel:** aclarado un 12 %. Si lo quieres más o menos claro, es un número en
   `sources.mjs`.

## 9. Observaciones para las próximas fases
- **Unidad de píxel de las ventanas (`--u`):** sigue con los valores de la fase 1. En la fase 3,
  al poner las ventanas sobre la escena de 640×360, decidiremos cómo encajan las dos escalas.
- **Escenas:** con 640×360 los fondos del campamento, la cueva y el título necesitan más detalle.
  La misma herramienta puede extraer escenarios si me pasas imágenes de referencia de esos fondos.
  Lo propondré en la fase 3.
- **Fotogramas sin usar:** la imagen grande de lado (`sideStride`) y las 3 poses de lado de la hoja
  de frente (`walkFront6`–`walkFront8`) están extraídas pero no se usan. Pueden servir para la
  intro.

## 10. Archivos para tu commit

Estado final de la fase 2: solo hace falta subir lo que existe ahora. El historial de rondas de
este informe explica cómo se llegó hasta aquí.

| Archivo | Qué es |
|---|---|
| `scripts/sprites/lib.mjs` | **Nuevo**: código común (leer imagen, quitar fondo, separar figuras, rejilla original) |
| `scripts/sprites/cutout.mjs` | **Nuevo**: genera los PNG de los personajes (`npm run characters`) |
| `src/assets/characters/*.png`, `characters.gen.ts` | **Nuevos (generados)**: tus 15 imágenes y sus tamaños |
| `src/assets/characters/characters.ts`, `characters.test.ts` | **Nuevos**: poses y sus pruebas |
| `src/components/PixelSprite.tsx`, `.module.css` | **Nuevos**: componente para dibujar una pose |
| `src/assets/sprites/icons.ts`, `src/assets/sprites/sprites.test.ts` | **Nuevos**: iconos del menú y sus pruebas |
| `src/engine/grid.ts`, `src/engine/sprites.ts`, `src/engine/engine.test.ts` | **Nuevos**: motor de rejillas (para los iconos) |
| `src/engine/.gitkeep` | **Borrado** |
| `src/dev/CharactersDemo.tsx`, `.module.css` | **Nuevos**: página `/dev/personajes` |
| `src/dev/Specimen.tsx` | Ya no muestra paletas de personajes |
| `src/Root.tsx` | Ruta `/dev/personajes` |
| `src/styles/palette.ts`, `src/styles/palette.test.ts` | Sin paletas de personajes (los personajes usan sus colores) |
| `package.json` | Script `characters` |
| `DESIGN.md`, `BRIEF.md`, `CLAUDE.md`, `docs/plan-de-fases.md` | Resolución de 640×360 y sistema de personajes |
| `docs/informes/fase-2-personajes.md` | Este informe |

Tus imágenes de `references/` siguen fuera de git. Lo que se sube son los PNG generados a partir
de ellas.

### Commits recomendados
```bash
# 1. Grid engine (used by the ring icons)
git add src/engine/ src/assets/sprites/
git commit -m "feat(engine): add pixel grid renderer and 16x16 ring menu icons"

# 2. Character cut-out tool
git add scripts/sprites/ package.json
git commit -m "feat(scripts): add native-grid cut-out of reference character art"

# 3. Characters and the component that draws them
git add src/assets/characters/ src/components/PixelSprite.tsx src/components/PixelSprite.module.css
git commit -m "feat(characters): add Yeray and Null from reference art with PixelSprite"

# 4. Palette cleanup and dev review page
git add src/styles/palette.ts src/styles/palette.test.ts src/dev/ src/Root.tsx
git commit -m "feat(dev): add characters review page and drop character palettes"

# 5. Docs
git add DESIGN.md BRIEF.md CLAUDE.md docs/
git commit -m "docs: raise resolution to 640x360, document character system and phase 2 report"
```

Al terminar, `git status` debería decir `nothing to commit, working tree clean`.

## 11. Siguiente paso
**Fase 3: campamento y menú circular.** La escena del campamento con la hoguera, la paellera, las
mancuernas y el tarro de aceitunas; el HUD con los retratos; el bucle de juego; la entrada de
teclado, ratón y táctil; y el menú circular con los 6 iconos. Tú y Null iréis con `<PixelSprite>`.
También habrá que decidir cómo encajan la escala de la escena y la de las ventanas.
