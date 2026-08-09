/** Generadores del mundo «La Ciudad de los Oficios». */

import { emojiToName, pairMatch } from './factories';
import { JOBS, JOB_TOOLS, TOWN_PLACES, TRANSPORT_ZONES } from '../data/oficios';

// --- 97. ¿Quién lo hace? ------------------------------------------------------

export const genJobTools = pairMatch(JOB_TOOLS, {
  question: (pair) => `¿Quién usa ${pair.from.name}?`,
  spoken: (pair) => `Mira la herramienta. ¿Quién usa ${pair.from.name}?`,
});

// --- 98. Los oficios del pueblo -----------------------------------------------

export const genJobs = emojiToName(JOBS, {
  question: () => '¿A qué se dedica?',
  spoken: () => 'Mira el dibujo. ¿A qué se dedica esta persona?',
});

// --- 99. Por tierra, mar o aire -----------------------------------------------

/**
 * Solo hay tres respuestas posibles —tierra, mar y aire—, así que la ronda va
 * con tres opciones en vez de cuatro: una cuarta tendría que repetir una de
 * las tres y habría dos botones buenos.
 */
export const genTransportZones = emojiToName(
  TRANSPORT_ZONES,
  {
    question: () => '¿Por dónde va?',
    spoken: () => 'Mira este transporte. ¿Va por tierra, por mar o por aire?',
  },
  { optionCount: 3 },
);

// --- 100. Los sitios del pueblo -----------------------------------------------

export const genTownPlaces = emojiToName(TOWN_PLACES, {
  question: () => '¿Qué sitio es?',
  spoken: () => 'Mira el dibujo. ¿Qué sitio del pueblo es este?',
});
