// Spanish copy (source of truth: CONTENT.md). Phase 4 adds en.ts, the language switch and the
// real window content; for now it holds what the camp needs.
import type { SectionId } from './sections';

export const ES = {
  page: {
    heading: 'Yeray Caturla · Desarrollador Backend Junior',
  },
  ring: {
    label: 'Menú del campamento',
  },
  // Banner titles: "game label — what it is" (BRIEF.md table), in Spanish.
  sections: {
    equip: { title: 'Equipo — Proyectos' },
    alchemy: { title: 'Alquimia — Stack técnico' },
    stats: { title: 'Estadísticas — Perfil' },
    buffs: { title: 'Estado — Entrenamiento' },
    craft: { title: 'Artesanía — Cocina' },
    comms: { title: 'Configuración — Contacto' },
  } satisfies Record<SectionId, { title: string }>,
  window: {
    placeholder: 'Esta ventana se llena con su contenido real en la fase 4.',
    close: 'Cerrar ventana',
  },
  hud: {
    yeray: 'Yeray',
    null: 'Null',
  },
};
