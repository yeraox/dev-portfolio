// Idle actions: what Yeray and Null do in the camp every few seconds.
// The generated sheets (references/grandes/reposo/) start and end on the still pose, but the image
// generator redraws it a little differently each time. So no sheet frame is used whole:
//   1. Every frame is rebuilt on its native grid (like the characters).
//   2. Each frame is compared with the sheet's own first frame: only what CHANGED (a tilted head,
//      a raised arm, a mug, a wagging tail) is kept, in groups of touching pixels. In sheets that redraw the still parts
//      a little off (`redrawn`), a line up to that far off is not a change (its colour is still
//      there, 1 px away); and skin appearing where there was none (a hand over the vest) always
//      is, even when the colours are close (dark skin over a dark vest).
//   3. Each group is laid over the character's in-game still drawing, group by group, because the
//      generator may draw one part of the figure a pixel off (a group may move up to 1 px to fit
//      its own surroundings). With `region`, a group comes with that many px of its surroundings
//      from the same frame, so a feature is never half old, half new (a whole hand with its mug).
//   4. A face (`face`) is one thing: when a frame's face differs from the still one (eyes that
//      close or look up, a raised brow, a finger on the nose), its whole inner face is laid over
//      the drawing — brows, eyes, glasses, nose and moustache move together.
//   5. The generator's noise is left out: specks of a few pixels, thin streaks (an outline redrawn
//      further off), groups lying only along the outline and groups whose surroundings do not
//      match the drawing even then. Everything else IS the in-game drawing, so an action starts
//      and ends without a jump. Nothing is painted: every pixel comes from a reference.
//   6. The canvas grows evenly left and right (and upwards) to fit what sticks out, so the
//      character keeps its centre and its ground line.
import { backgroundMask, dropTinted, figures, islands, loadImage, nativeGrid, peelLightFringe } from './lib.mjs';
import { isSkin } from './skin.mjs';

const CHANGED = 60; // colour distance (sum of the three channels) above which a pixel changed
const SPECK = 4; // changed groups smaller than this are the generator's noise
const HOLE = 12; // unchanged groups up to this size, enclosed by a change, belong to it
const SEAM = 2; // a group's seam: the still drawing's pixels up to this far around it
const MAX_SEAM = 0.25; // a group whose seam differs more than this (share) does not fit: noise
const FACE_CHANGED = 0.04; // a face differing more than this (share) from the still one has moved
const MARGIN = 8; // room around a frame for what sticks out
// A group may move this much to fit (0 first: when two places fit equally, it stays).
const NUDGES = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]];

const dist = (a, b) => (a && b ? Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) : a || b ? 999 : 0);

/** The shift (dx, dy) that lays `grid` over `target` with the fewest different pixels:
 *  target[y][x] ≈ grid[y + dy][x + dx]. */
function bestShift(target, grid, range = 8) {
  let best = { bad: Infinity, dx: 0, dy: 0 };
  for (let dy = -range; dy <= range; dy++) for (let dx = -range; dx <= range; dx++) {
    let bad = 0;
    for (let y = 0; y < target.length; y++) for (let x = 0; x < target[0].length; x++) {
      if (dist(target[y][x], grid[y + dy]?.[x + dx] ?? null) > CHANGED) bad++;
    }
    if (bad < best.bad) best = { bad, dx, dy };
  }
  return best;
}

/**
 * Builds the images of one idle action.
 *   action: { file, pitch, frames: [k…] (the sheet frames to use, from 1), mode, …options }
 *     mode 'changed': every changed pixel (a head that tilts, an arm that rises)
 *     mode 'added':   only pixels the frame adds outside the first frame's figure (a tail; the
 *                     body of that sheet may be drawn at another size, so nothing else is taken)
 *     skin: true when a character's skin moves over his clothes (Yeray)
 *     redrawn: how far off (px) the sheet redraws what does not move (0 = compare in place). A
 *       colour found that close in the other frame, both ways, is the same line redrawn.
 *     region: px of surroundings pasted with each change, from the same frame (0 = none). Only
 *       the figure's own pixels are swapped there: the outline neither grows nor shrinks.
 *     face: { x: [x0, x1], y: [y0, y1] }, the inner face in still-drawing coordinates
 *     together: true when, outside the face, only one thing moves (an arm with its hand and mug):
 *       the biggest movement and what touches it are kept, patches far from it are noise
 *   base: the in-game still drawing (grid)
 * Returns { images: [grid…] (image 0 = the still drawing on the new canvas), checks: one per
 * frame { frame, pasted, seam, dropped, face }, firstVsBase, side, up }.
 */
export function buildIdle(action, base) {
  const img = loadImage(action.file);
  const mask = backgroundMask(img);
  const boxes = figures(img, mask, 0.25);
  const grids = boxes.map((box) => dropTinted(peelLightFringe(nativeGrid(img, mask, box, action.pitch))));
  // What each frame is compared with (the sheet's first frame), and where it sits over the
  // in-game drawing (as a whole).
  const ref = grids[0];
  const refOn = bestShift(base, ref);

  // The still drawing's outline band: pixels whose 3×3 neighbourhood has both figure and
  // background (the figure's outermost ring and the ring just outside it).
  const opaque = (x, y) => Boolean(base[y]?.[x]);
  const onOutline = (x, y) => {
    let inside = false, outside = false;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (opaque(x + dx, y + dy)) inside = true;
      else outside = true;
    }
    return inside && outside;
  };

  /** Cell (x, y) of a frame's change map → still-drawing coordinates, nudged by (nx, ny). */
  const toBase = (x, y, nx, ny) => [x - MARGIN - refOn.dx + nx, y - MARGIN - refOn.dy + ny];
  /** …and back. */
  const toCell = (bx, by, nx, ny) => [bx + MARGIN + refOn.dx - nx, by + MARGIN + refOn.dy - ny];

  /** The seam of a group nudged by (nx, ny): the still drawing's pixels within SEAM px of it
   *  that are not changed themselves, compared with what the sheet has there (`sample`). */
  function seamFit(cells, changed, sample, nx, ny) {
    let seam = 0, bad = 0;
    const seen = new Set();
    for (const [x, y] of cells) for (let dy = -SEAM; dy <= SEAM; dy++) for (let dx = -SEAM; dx <= SEAM; dx++) {
      const sx = x + dx, sy = y + dy;
      if (changed[sy]?.[sx] || seen.has(`${sx},${sy}`)) continue;
      seen.add(`${sx},${sy}`);
      const [bx, by] = toBase(sx, sy, nx, ny);
      const sheet = sample(sx, sy), still = base[by]?.[bx] ?? null;
      if (!sheet && !still) continue;
      seam++;
      if (dist(sheet, still) > CHANGED) bad++;
    }
    return { seam, bad };
  }

  // Each frame → what to lay over the still drawing, in still-drawing coordinates:
  // face (whole inner face, or null), pieces: [{ cells: [[x, y, colour | 'gone']], margin, seam }].
  const frames = action.frames.map((k) => {
    const frame = grids[k];
    const { dx, dy } = bestShift(ref, frame); // the frames of a sheet are in different columns
    const height = Math.max(ref.length, frame.length) + 2 * MARGIN;
    const width = Math.max(ref[0].length, frame[0].length) + 2 * MARGIN;
    const after = (x, y) => frame[y - MARGIN + dy]?.[x - MARGIN + dx] ?? null;
    const before = (x, y) => ref[y - MARGIN]?.[x - MARGIN] ?? null;
    // What continues into the drawing around a group: the sheet's first frame (the group comes
    // from its coordinates).
    const sample = before;
    // Two pixels alike: close colours, and both skin or both not (when skin moves in this sheet).
    const alike = (a, b) => dist(a, b) <= CHANGED && (!action.skin || isSkin(a) === isSkin(b));
    const reach = action.redrawn ?? 0;
    const near = (get, x, y, c) => {
      for (let ny = -reach; ny <= reach; ny++) for (let nx = -reach; nx <= reach; nx++) {
        if (alike(get(x + nx, y + ny), c)) return true;
      }
      return false;
    };
    const changed = Array.from({ length: height }, () => Array(width).fill(null)); // colour or 'gone'
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const was = before(x, y), now = after(x, y);
      if (alike(was, now)) continue;
      if (action.mode === 'added') {
        if (was || !now) continue;
      } else if (reach > 0 && was && now && near(after, x, y, was) && near(before, x, y, now)) {
        // A line redrawn 1 px off inside the figure: each colour is still there, 1 px away. (A
        // pixel that appears or disappears always counts: the outline of a hand that moved away
        // must go. An outline merely redrawn off is caught as noise further down.)
        continue;
      }
      changed[y][x] = now ?? 'gone';
    }
    // Fill the small holes of a change: inside a moving hand, a pixel whose colour happens to be
    // close to what was behind it is part of the hand too, so it takes the frame's colour
    // instead of showing the still drawing through the hand.
    if (action.mode === 'changed') {
      const unchanged = changed.map((row) => row.map((c) => (c ? null : [0, 0, 0])));
      for (const cells of islands(unchanged)) {
        const enclosed = cells.every(([x, y]) => x > 0 && y > 0 && x < width - 1 && y < height - 1);
        if (!enclosed || cells.length > HOLE) continue;
        for (const [x, y] of cells) if (after(x, y)) changed[y][x] = after(x, y);
      }
    }

    // The face: if this frame's inner face differs from the still one, all of it is laid over
    // the drawing (figure pixels for figure pixels), at the nudge where it matches best.
    let face = null;
    const box = action.face;
    const inFace = (bx, by) => Boolean(face) && bx >= box.x[0] && bx <= box.x[1] && by >= box.y[0] && by <= box.y[1];
    if (box) {
      let best = null;
      for (const [nx, ny] of NUDGES) {
        let all = 0, bad = 0;
        const cells = [];
        for (let by = box.y[0]; by <= box.y[1]; by++) for (let bx = box.x[0]; bx <= box.x[1]; bx++) {
          const c = after(...toCell(bx, by, nx, ny));
          all++;
          if (dist(c, base[by][bx]) > CHANGED) bad++;
          if (c && base[by][bx]) cells.push([bx, by, c]);
        }
        if (!best || bad < best.bad) best = { bad, share: bad / all, cells };
      }
      if (best.share > FACE_CHANGED) face = best.cells;
    }

    // Sort the groups: what moves, and the generator's noise.
    const moving = [];
    const noise = [];
    for (const cells of islands(changed.map((row) => row.map((c) => (c ? [0, 0, 0] : null))))) {
      // Inside a face laid over whole: already there.
      if (cells.every(([x, y]) => inFace(...toBase(x, y, 0, 0)))) continue;
      if (cells.length < SPECK) {
        noise.push(cells); // a speck
        continue;
      }
      // The nudge where the group's surroundings match the drawing best. A tail ('added') is
      // not nudged: what surrounds it is a body drawn at another size.
      let best = null;
      for (const [nx, ny] of action.mode === 'changed' ? NUDGES : [[0, 0]]) {
        const fit = seamFit(cells, changed, sample, nx, ny);
        if (!best || fit.bad < best.bad) best = { nx, ny, ...fit };
      }
      const seam = best.seam ? best.bad / best.seam : 0;
      // A thin streak (at most 2 px thick, 3 times as long): an outline the generator redrew
      // further off. What really moves is a patch: an arm, a mug, an eye that closes (7×5).
      const xs = cells.map(([x]) => x), ys = cells.map(([, y]) => y);
      const across = Math.max(...xs) - Math.min(...xs) + 1, down = Math.max(...ys) - Math.min(...ys) + 1;
      const streak = action.mode === 'changed' && Math.min(across, down) <= 2 && Math.max(across, down) >= 3 * Math.min(across, down);
      // (Not for a tail: lying close along the body is exactly what a wagging tail does.)
      const jitter = action.mode === 'changed' && cells.every(([x, y]) => onOutline(...toBase(x, y, best.nx, best.ny)));
      if (jitter || streak || (action.mode === 'changed' && seam > MAX_SEAM)) noise.push(cells);
      else moving.push(cells);
    }
    // Noise touching what moves (within `region` px) is part of that movement: the last pixel of a
    // shoulder's outline when the arm rises. Only noise far from everything is left out.
    const around = action.region ?? 0;
    let dropped = 0;
    if (around > 0) {
      const owner = new Map();
      moving.forEach((cells, i) => cells.forEach(([x, y]) => owner.set(`${x},${y}`, i)));
      for (const cells of noise) {
        let to = -1;
        for (const [x, y] of cells) for (let my = -around; my <= around && to < 0; my++) for (let mx = -around; mx <= around && to < 0; mx++) {
          to = owner.get(`${x + mx},${y + my}`) ?? -1;
        }
        if (to >= 0) moving[to].push(...cells);
        else dropped += cells.length;
      }
    } else {
      dropped = noise.reduce((sum, cells) => sum + cells.length, 0);
    }

    // One movement (`together`): the biggest group and the groups touching it, step by step
    // (within `region` px, at least 2). A patch far from it — a boot, the other shoulder,
    // redrawn differently in this frame — is noise: it would flicker.
    if (action.together && moving.length > 1) {
      const reachTo = Math.max(around, 2);
      const byCell = new Map();
      moving.forEach((cells, i) => cells.forEach(([x, y]) => byCell.set(`${x},${y}`, i)));
      const biggest = moving.reduce((best, cells, i) => (cells.length > moving[best].length ? i : best), 0);
      const kept = new Set([biggest]);
      for (let queue = [biggest]; queue.length > 0; ) {
        const i = queue.pop();
        for (const [x, y] of moving[i]) for (let my = -reachTo; my <= reachTo; my++) for (let mx = -reachTo; mx <= reachTo; mx++) {
          const j = byCell.get(`${x + mx},${y + my}`);
          if (j !== undefined && !kept.has(j)) {
            kept.add(j);
            queue.push(j);
          }
        }
      }
      for (let i = moving.length - 1; i >= 0; i--) {
        if (kept.has(i)) continue;
        dropped += moving[i].length;
        moving.splice(i, 1);
      }
    }

    // Trim what only runs along the outline (`together`): a movement keeps the outline cells next
    // to its inside (the edge of an arm that moves away), not a strip continuing down the body
    // (a trouser's edge redrawn 1 px off in this frame, which would make the leg wobble).
    if (action.together) {
      for (const [i, cells] of moving.entries()) {
        const inside = new Set(cells.filter(([x, y]) => !onOutline(...toBase(x, y, 0, 0))).map(([x, y]) => `${x},${y}`));
        const kept = cells.filter(([x, y]) => {
          if (inside.has(`${x},${y}`)) return true;
          for (let my = -1; my <= 1; my++) for (let mx = -1; mx <= 1; mx++) if (inside.has(`${x + mx},${y + my}`)) return true;
          return false;
        });
        dropped += cells.length - kept.length;
        moving[i] = kept;
      }
    }

    const pieces = moving.map((cells) => {
      // Where something left (`together`: an arm that rises), the still drawing's outer outline
      // right next to it goes too when the frame has nothing there: the drawing may draw that
      // arm 1 px wider than the sheet, and that last pixel would stick out of the new contour.
      if (action.together) {
        const inGroup = new Set(cells.map(([x, y]) => `${x},${y}`));
        const extra = [];
        for (const [x, y] of cells) {
          if (changed[y][x] !== 'gone') continue;
          for (let my = -1; my <= 1; my++) for (let mx = -1; mx <= 1; mx++) {
            const nx = x + mx, ny = y + my, key = `${nx},${ny}`;
            const [bx, by] = toBase(nx, ny, 0, 0);
            if (inGroup.has(key) || !base[by]?.[bx] || after(nx, ny) || !onOutline(bx, by)) continue;
            inGroup.add(key);
            extra.push([nx, ny]);
            changed[ny][nx] = 'gone';
          }
        }
        cells = [...cells, ...extra];
      }
      // Its surroundings (`region` px around it), and the nudge where the whole fits best.
      const margin = [];
      const seen = new Set(cells.map(([x, y]) => `${x},${y}`));
      for (const [x, y] of cells) for (let my = -around; my <= around; my++) for (let mx = -around; mx <= around; mx++) {
        const key = `${x + mx},${y + my}`;
        if (seen.has(key)) continue;
        seen.add(key);
        margin.push([x + mx, y + my]);
      }
      let best = null;
      for (const [nx, ny] of action.mode === 'changed' ? NUDGES : [[0, 0]]) {
        const fit = seamFit([...cells, ...margin], changed, sample, nx, ny);
        if (!best || fit.bad < best.bad) best = { nx, ny, ...fit };
      }
      return {
        cells: cells.map(([x, y]) => [...toBase(x, y, best.nx, best.ny), changed[y][x]]),
        // In the surroundings only figure pixels are swapped for the frame's figure pixels.
        margin: margin.flatMap(([x, y]) => {
          const [bx, by] = toBase(x, y, best.nx, best.ny);
          const c = after(x, y);
          return c && base[by]?.[bx] ? [[bx, by, c]] : [];
        }),
        seam: best.seam ? best.bad / best.seam : 0,
        size: cells.length,
      };
    });
    return { k, face, pieces, dropped };
  });

  // The canvas: the still drawing, widened evenly left/right and upwards to fit every piece.
  let left = 0, right = 0, up = 0;
  for (const { pieces } of frames) for (const { cells } of pieces) for (const [bx, by, c] of cells) {
    if (c === 'gone') continue;
    left = Math.max(left, -bx);
    right = Math.max(right, bx - (base[0].length - 1));
    up = Math.max(up, -by);
  }
  const side = Math.max(left, right);
  const width = base[0].length + 2 * side, height = base.length + up;
  const canvas = () => Array.from({ length: height }, (_, y) => Array.from({ length: width }, (_, x) => base[y - up]?.[x - side] ?? null));

  const images = [canvas()];
  const checks = [];
  for (const { k, face, pieces, dropped } of frames) {
    const out = canvas();
    let pasted = 0;
    // The face first, then the surroundings, then what changes (where they overlap, the change wins).
    const layers = [...(face ?? []), ...pieces.flatMap((p) => p.margin), ...pieces.flatMap((p) => p.cells)];
    for (const [bx, by, c] of layers) {
      const x = bx + side, y = by + up;
      if (y < 0 || x < 0 || y >= height || x >= width) continue;
      // Below the still drawing's ground line nothing is added: the character stays on the floor.
      if (y > up + base.length - 1) continue;
      out[y][x] = c === 'gone' ? null : c;
      pasted++;
    }
    images.push(out);
    // The frame's seam: how well, all together, its pieces fit the drawing around them.
    const total = pieces.reduce((sum, p) => sum + p.size, 0);
    const seam = total ? pieces.reduce((sum, p) => sum + p.seam * p.size, 0) / total : 0;
    checks.push({ frame: k, pasted, seam, dropped, face: Boolean(face) });
  }
  return { images, checks, firstVsBase: refOn.bad / (base.length * base[0].length), side, up };
}
