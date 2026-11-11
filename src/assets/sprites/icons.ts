// 16×16 ring-menu icons, one per section. Drawn on the shared palettes; never emoji.
import type { FrameGrid } from '../../engine/grid';
import { anim, type SpriteSheet } from '../../engine/sprites';
import { UI_PALETTE as U } from '../../styles/palette';

function icon(legend: Record<string, string>, grid: FrameGrid): SpriteSheet {
  return { width: 16, height: 16, legend, animations: { still: anim([grid], 1000) } };
}

const BLANK = '................';

// EQUIP — the quilted adventurer vest
const VEST = icon({ o: U.ink, V: U['forest-1'], v: U['forest-2'], q: U['green-0'], w: U.text }, [
  BLANK,
  '...ooo....ooo...',
  '..oqvvo..ovvqo..',
  '..oqvvvoovvvqo..',
  '.oqvvVvowovVvqo.',
  '.ovvVvvowovvVvo.',
  '.ovVvvVowoVvvVo.',
  '.oVvvVvowovVvvo.',
  '.ovvVvvowovvVvo.',
  '.ovVvvVowoVvvVo.',
  '.oVvvVvowovVvvo.',
  '.ovvVvvowovvVvo.',
  '.oVVVVVowoVVVVo.',
  '.oooooooooooooo.',
  BLANK,
  BLANK,
]);

// ALCHEMY — flask with blue liquid
const FLASK = icon(
  { o: U.ink, c: U['gold-1'], g: U['stone-4'], w: U.text, B: U['blue-3'], b: U['blue-2'] },
  [
    '......oooo......',
    '......occo......',
    '......oooo......',
    '......ogwo......',
    '......ogwo......',
    '.....oggwgo.....',
    '....oggggwgo....',
    '...oggggggwgo...',
    '..oBBBBBBBBBBo..',
    '..obbBbbbbbbBo..',
    '..obbbbbBbbbbo..',
    '..obBbbbbbbbbo..',
    '..obbbbbbbBbbo..',
    '...obbbbbbbbo...',
    '....oooooooo....',
    BLANK,
  ],
);

// STATS — parchment scroll
const SCROLL = icon(
  { o: U.ink, r: U['gold-2'], R: U['gold-1'], p: U.text, d: U['text-dim'], l: U['stone-3'] },
  [
    BLANK,
    '..oooooooooooo..',
    '.orrrrrrrrrrrro.',
    '.oRRRRRRRRRRRRo.',
    '..oppppppppppo..',
    '..opllllllllpo..',
    '..oppppppppppo..',
    '..oplllllpppdo..',
    '..oppppppppppo..',
    '..opllllllllpo..',
    '..oppppppppddo..',
    '..oplllllpppdo..',
    '..oppppppppddo..',
    '.orrrrrrrrrrrro.',
    '.oRRRRRRRRRRRRo.',
    '..oooooooooooo..',
  ],
);

// BUFFS — dumbbell
const DUMBBELL = icon({ o: U.ink, P: U['stone-4'], p: U['stone-2'], w: U.text, h: U['stone-3'] }, [
  BLANK,
  BLANK,
  BLANK,
  BLANK,
  '.ooo........ooo.',
  'oPPPo......oPPPo',
  'oPppooooooooppPo',
  'oPppwwwwwwwwppPo',
  'oPpphhhhhhhhppPo',
  'oPppooooooooppPo',
  'oPPPo......oPPPo',
  '.ooo........ooo.',
  BLANK,
  BLANK,
  BLANK,
  BLANK,
]);

// CRAFT — paella pan seen from above: rice, peppers, green beans
const PAELLA = icon(
  { o: U.ink, k: U['stone-2'], K: U['stone-1'], Y: U['gold-3'], y: U['gold-2'], R: U['red-1'], G: U['green-1'] },
  [
    BLANK,
    BLANK,
    BLANK,
    '....oooooooo....',
    '..ookkkkkkkkoo..',
    '.okYYyYYYYyYYko.',
    'okYRYYGYYyYRYYko',
    'oKYYyYYRYYGYyYKo',
    'oKYGYYyYYYYRYYKo',
    '.oKYYRYYGyYYYKo.',
    '..ooKKKKKKKKoo..',
    '....oooooooo....',
    BLANK,
    BLANK,
    BLANK,
    BLANK,
  ],
);

// COMMS — sealed letter
const LETTER = icon({ o: U.ink, w: U.text, d: U['text-dim'], R: U['red-1'], r: U['red-0'] }, [
  BLANK,
  BLANK,
  BLANK,
  '.oooooooooooooo.',
  '.odwwwwwwwwwwdo.',
  '.owdwwwwwwwwdwo.',
  '.owwdwwwwwwdwwo.',
  '.owwwdwwwwdwwwo.',
  '.owwwwdRRdwwwwo.',
  '.owwwwwRrwwwwwo.',
  '.owwwwwwwwwwwwo.',
  '.owwwwwwwwwwwwo.',
  '.oooooooooooooo.',
  BLANK,
  BLANK,
  BLANK,
]);

// Keys are the section ids used by the ring menu in phase 3.
export const ICONS = {
  equip: VEST,
  alchemy: FLASK,
  stats: SCROLL,
  buffs: DUMBBELL,
  craft: PAELLA,
  comms: LETTER,
};
