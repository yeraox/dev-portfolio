# Informe · Fase 2 (anexo) — Caminar

**Fecha de cierre:** 11 de noviembre de 2026
**Estado:** ✅ terminado, pendiente de tu revisión y tu commit.
**Análisis previo y ficha técnica:** `docs/animacion-caminar.md`.

## Resumen en tres líneas
- Ya caminas en **8 fotogramas** hacia la cámara y de lado (y hacia la izquierda, en espejo).
  Salen de tus hojas nuevas con el **sello**: la misma cabeza, píxel a píxel, en todos los
  fotogramas, y el cuerpo bajando 0, 1 o 2 píxeles enteros.
- Tus **poses quietas de frente y de lado** son ahora el fotograma "Arriba" de cada ciclo. Al
  echar a andar o pararte no cambia nada del dibujo.
- `npm run characters` comprueba los 12 dibujos y se detiene si alguno falla. Hoy pasan todos:
  cabeza idéntica, rebote exacto, sin motas y con los pies en el suelo.

---

## 1. Decisiones tomadas

| Decisión | Resultado | Quién |
|---|---|---|
| Cómo hacer los ciclos | **Sello** (camino A): cabeza de un solo fotograma, rebote en píxeles enteros | Tú |
| Paso con la pierna derecha de frente | **Espejo** del paso con la izquierda; la cabeza no se refleja | Tú |
| Pose quieta | **La nueva**: el fotograma 1 de cada hoja. Sustituye a `frente_yeray` y `camina_grande` | Tú |
| Número de fotogramas | **8** por ciclo, 120 ms cada uno (0,96 s por ciclo de dos pasos) | Tú |
| Cuándo | **Ahora**, como anexo de la fase 2 | Tú |
| Escala de la hoja lateral | **110 px** de alto, igual que la de frente: al girarte no encoges | Yo (propuesto en el análisis) |
| Pasos intermedios ("Paso" A y B) | El mismo dibujo (L1 de lado, F1 de frente). L4 y F4 solo añadían deriva | Yo |
| Archivos | Los 6 dibujos de cada dirección en **un solo PNG**, uno debajo de otro | Yo (ver 2.4) |

---

## 2. Qué se ha hecho, paso a paso

### 2.1 El análisis
Medí tus dos hojas nuevas con el mismo pipeline de los personajes y escribí
`docs/animacion-caminar.md`. Ahí están el diagnóstico (rejilla irregular, cara que cambia un
10–27 % por fotograma, sin rebote, ciclos incompletos), la ficha técnica y el desglose de los 8
fotogramas.

### 2.2 El sello (`scripts/sprites/walk.mjs`, nuevo)
Por cada hoja:
1. **Encaja cada fotograma en su rejilla** de 110 px de alto, como el resto de personajes, y
   quita las motas turquesa del contorno.
2. **Lo coloca en un lienzo fijo**, el mismo para todos los fotogramas:
   - **Horizontal:** alineado por la cabeza. El script busca el desplazamiento entero con el
     que la cabeza encaja mejor con la del fotograma de referencia.
   - **Vertical:** de frente, por la cabeza. De lado, por el suelo, para que las suelas queden
     siempre en la misma fila.
   - El lienzo es simétrico alrededor de la cabeza, así que el espejo no la mueve.
3. **Borra la cabeza de ese fotograma** y pone la del fotograma de referencia: pelo, cara, gafas,
   ojos, bigote, perilla y orejas.
   - La zona de la cabeza se definió con un mapa de materiales de cada fila: las filas 0–37 (de
     frente) o 0–36 (de lado) enteras y, debajo, solo la barbilla.
   - Así el cuello del chaleco sigue siendo el de cada fotograma.
4. **Rebote:**
   - Baja 1 o 2 px todo lo que hay por encima de la cintura (fila 70).
   - Los brazos que cuelgan por debajo bajan enteros. Detecta la piel unida al brazo y corta
     cada columna bajo la mano, para no partir un antebrazo en diagonal.
   - Las piernas se quedan quietas y el chaleco tapa 1–2 filas del pantalón: se lee como doblar
     las rodillas.
5. **Espejo** (solo el paso derecho de frente): se refleja el cuerpo antes de poner la cabeza.
6. **Comprobaciones:** cabeza idéntica, rebote pedido, cero píxeles teñidos de fondo, cero islas
   sueltas, pies en la fila del suelo.

### 2.3 Los dibujos y los ciclos

| Dibujo | De dónde sale | Cuerpo |
|---|---|---|
| `yeray-front` (quieto / "Arriba") | F1 | 0 |
| `yeray-front-pass` | F1 | +1 |
| `yeray-front-step-left` / `-down` | F2 (tu pierna izquierda delante) | +1 / +2 |
| `yeray-front-step-right` / `-down` | F2 en espejo | +1 / +2 |
| `yeray-side` (quieto / "Arriba") | L1 | 0 |
| `yeray-side-pass` | L1 | +1 |
| `yeray-side-step-a` / `-down` | L2 (pierna cercana delante) | +1 / +2 |
| `yeray-side-step-b` / `-down` | L3 (pierna lejana delante) | +1 / +2 |

Ciclos (`characters.ts`): Contacto → Bajada → Paso → Arriba con una pierna, y lo mismo con la
otra.
- `YERAY.walkDown` y `YERAY.walkSide`: 8 fotogramas × 120 ms.
- `YERAY.idle` y `YERAY.side` pasan a usar los dibujos nuevos.
- La pose de lado ya no necesita ampliarse ×1,5: ahora todas tus poses tienen la misma rejilla.

### 2.4 Un PNG por dirección
- Con un PNG por dibujo, los paseos ocupaban **108 KB**.
- Apilando los 6 dibujos de cada dirección en un solo PNG ocupan **43 KB**, porque la cabeza
  idéntica se comprime casi gratis:
  - `yeray-front-walk.png`: 46×678, 20,9 KB.
  - `yeray-side-walk.png`: 65×660, 21,7 KB.
- Además el ciclo no pide un archivo nuevo en cada fotograma, así que no parpadea la primera vez
  que se reproduce.
- Para eso:
  - `characters.gen.ts` guarda en cada imagen la fila donde empieza dentro de su PNG (`y`) y la
    fila del suelo (`ground`).
  - `<PixelSprite>` dibuja la pose como fondo y enseña solo esas filas.
- **Todos los personajes juntos: 96 KB**, frente a 88 KB antes, cuando no había paseos.

### 2.5 La página de revisión (`/dev/personajes`)
- **En escena**, a tamaño real: quieto, caminando hacia la cámara, de lado a la derecha y a la
  izquierda, brazos cruzados y Null.
- **Por cada dirección:**
  - El ciclo a velocidad real y a ×0,25.
  - Los 8 fotogramas, en dos filas: un paso arriba y el otro debajo.
  - El papel cebolla, con el fotograma anterior semitransparente debajo.
  - La hoja de referencia, con el tamaño del lienzo y la fila del suelo.

---

## 3. Cómo se ha comprobado

| Comprobación | Resultado |
|---|---|
| `npm run characters` (comprobaciones de los 12 dibujos) | ✅ Todas pasan |
| `npm run typecheck` | ✅ Sin errores |
| `npm run lint` | ✅ Sin avisos |
| `npm test` | ✅ 77 pruebas (antes 67): ciclos de 8, mismo lienzo y suelo en cada ciclo, la pose quieta forma parte del ciclo, tus tres poses miden lo mismo |
| `npm run build` | ✅ JS inicial **68,77 KB gzip** (sin cambios: los personajes aún solo están en páginas de desarrollo) |
| Referencias privadas en `dist/` | ✅ Ninguna |
| Capturas 390 / 768 / 1440 | ✅ Sin desbordamiento horizontal ni errores de consola: `.screenshots/personajes-caminar-*.png` |

**Revisión a ojo:**
- Miré costuras de cuello y cintura, brazos y pies con zoom ×8 en los fotogramas con más rebote,
  y luego en las capturas de la página.
- En el papel cebolla la cabeza coincide exacta entre fotogramas: no deja fantasma.
- El brazo va siempre opuesto a la pierna.

---

## 4. TypeScript en esta fase

| Concepto | Dónde | Qué hace |
|---|---|---|
| Ampliar un tipo generado | `characters.gen.ts`: `CharacterImage` gana `ground` e `y` | El `satisfies` obliga a que las 25 imágenes los tengan |
| Array con tipo explícito | `const WALK_DOWN: CharacterImageName[]` en `characters.ts` | Un nombre de fotograma mal escrito es un error de compilación, aunque la lista esté fuera de la pose |
| `Set` para comprobar "todos iguales" | `characters.test.ts` | `new Set(valores).size === 1` significa que todos los fotogramas tienen el mismo tamaño |
| Pruebas con tabla (`describe.each`) | `characters.test.ts` | La misma batería de pruebas para los dos ciclos |
| Copia con un campo cambiado (`{ ...pose, ms }`) | `CharactersDemo.tsx` | El ciclo a ×0,25 es una copia de la pose con más milisegundos |
| El `style` de React tiene tipo | `PixelSprite.tsx` | `backgroundPosition`, `backgroundSize`… se comprueban: una propiedad mal escrita da error |

---

## 5. Problemas encontrados y cómo se resolvieron

| Problema | Solución |
|---|---|
| **`npm run characters` borraba la carpeta `src/assets/characters/` entera**, también `characters.ts` y `characters.test.ts`, que viven ahí. Al regenerar se borraron. | Recuperé los dos archivos íntegros de la transcripción de la sesión anterior (la prueba coincide carácter a carácter con la que leí al empezar esta sesión). Ahora el script **solo borra lo que genera él** (`*.png` y `characters.gen.ts`). Comprobado: tras regenerar, los dos archivos siguen ahí. |
| Las motas turquesa del contorno se parecen a dos colores buenos: el azul marino del contorno y el brillo azul de las gafas | Solo se quitan las que tienen al menos un 40 % de fondo y menos azul que las gafas. Las más oscuras son contorno de verdad y se quedan |
| Al bajar el cuerpo cortando por la cintura, un antebrazo en diagonal quedaría partido | Los brazos bajan enteros: el corte de cada columna va por debajo de la mano |
| Un script de análisis escribió por error sus imágenes de prueba en la raíz del proyecto | Las moví al momento a la carpeta temporal de la sesión. En el proyecto no queda nada |

---

## 6. Observaciones para las próximas fases
- **Los fotogramas de "Paso" tienen los dos pies apoyados.** Tus hojas no tienen un dibujo con la
  pierna levantada. Si un día generas uno, se cambia solo el dibujo de origen (camino B del
  análisis).
- **La mochila no lleva el retraso de un fotograma.** Separarla del tronco es posible, pero
  laborioso; lo dejo como mejora.
- **Brazos cruzados:** sigue saliendo de su propia referencia y su piel es algo más clara que la
  de las hojas nuevas. Se nota poco, pero en la fase 3 estará junto a la pose quieta. Si generas
  una versión con el mismo estilo que las hojas, se cambia en un minuto.
- **Fase 3, rendimiento:**
  - Vite mete dentro del JavaScript las imágenes de menos de 4 KB. Los fotogramas de Null
    (2–3 KB cada uno) irían al bundle al usarse en la escena.
  - Si el presupuesto lo pide, se apilan como los tuyos: un PNG por animación.
- **Fase 3, anclaje:** cada imagen sabe ya en qué fila apoya los pies (`ground`). La escena
  colocará a los personajes por ese punto, no por el borde de la imagen.

---

## 7. Archivos para tu commit

| Archivo | Qué es |
|---|---|
| `scripts/sprites/walk.mjs` | **Nuevo**: el sello (ciclos de caminar) y sus comprobaciones |
| `scripts/sprites/cutout.mjs` | Hojas de caminar, un PNG por dirección, `ground`/`y` en el manifiesto, comprobaciones y borrado solo de lo generado |
| `scripts/sprites/lib.mjs` | Limpieza compartida: motas de fondo e islas |
| `src/assets/characters/*.png`, `characters.gen.ts` | **Regenerados**: `yeray-front-walk.png` y `yeray-side-walk.png` sustituyen a `yeray-front.png` y `yeray-side.png` |
| `src/assets/characters/characters.ts`, `characters.test.ts` | Ciclos de 8 fotogramas, poses nuevas y sus pruebas |
| `src/components/PixelSprite.tsx`, `.module.css` | Dibuja una fila de un PNG compartido |
| `src/dev/CharactersDemo.tsx`, `.module.css` | Revisión fotograma a fotograma |
| `DESIGN.md`, `BRIEF.md`, `CLAUDE.md`, `docs/plan-de-fases.md` | Ciclos de 8 fotogramas y el sello |
| `docs/animacion-caminar.md` | **Nuevo**: análisis, ficha técnica y resultado |
| `docs/informes/fase-2-anexo-caminar.md` | Este informe |

### Commits recomendados

Al empezar esta sesión los commits de la fase 2 aún no estaban hechos. Mira `git log --oneline -3`
y elige el caso que te toque.

**Caso 1 — todavía no has hecho los commits de la fase 2.** Usa esta lista **en lugar** de la del
informe de la fase 2: cubre la fase y este anexo, con los mismos 5 commits.
```bash
# 1. Grid engine (used by the ring icons)
git add src/engine/ src/assets/sprites/
git commit -m "feat(engine): add pixel grid renderer and 16x16 ring menu icons"

# 2. Character tools: native-grid cut-out and walk-cycle builder
git add scripts/sprites/ package.json
git commit -m "feat(scripts): add native-grid cut-out and stamped walk-cycle builder"

# 3. Characters, walk cycles and the component that draws them
git add src/assets/characters/ src/components/PixelSprite.tsx src/components/PixelSprite.module.css
git commit -m "feat(characters): add Yeray and Null from reference art with 8-frame walk cycles"

# 4. Palette cleanup and dev review page
git add src/styles/palette.ts src/styles/palette.test.ts src/dev/ src/Root.tsx
git commit -m "feat(dev): add characters review page with frame-by-frame walk review"

# 5. Docs
git add DESIGN.md BRIEF.md CLAUDE.md docs/
git commit -m "docs: document character system, walk cycles and phase 2 reports"
```

**Caso 2 — ya hiciste los commits de la fase 2.** Solo el anexo:
```bash
# 1. Walk-cycle builder
git add scripts/sprites/
git commit -m "feat(scripts): build 8-frame walk cycles with a stamped head and whole-pixel bob"

# 2. Walk cycles and stacked sprite sheets
git add src/assets/characters/ src/components/PixelSprite.tsx src/components/PixelSprite.module.css
git commit -m "feat(characters): add Yeray walk cycles and draw frames from stacked sheets"

# 3. Review page
git add src/dev/CharactersDemo.tsx src/dev/CharactersDemo.module.css
git commit -m "feat(dev): add frame-by-frame walk review to the characters page"

# 4. Docs
git add DESIGN.md BRIEF.md CLAUDE.md docs/
git commit -m "docs: add walk-cycle analysis and phase 2 annex report"
```

En los dos casos, al terminar, `git status` debería decir
`nothing to commit, working tree clean`. En el caso 2, `git add src/assets/characters/` también
registra el borrado de `yeray-front.png` y `yeray-side.png`.

---

## 8. Siguiente fase
**Fase 3 — Campamento y menú circular**, cuando la apruebes. Los personajes entran en la escena
con `<PixelSprite>`, anclados por la fila del suelo. En el campamento estás quieto: los paseos
se usan en la fase 6, en la intro.
