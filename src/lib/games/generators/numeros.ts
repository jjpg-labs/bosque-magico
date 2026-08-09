/** Generadores del mundo «El Río de los Números». */

import { pick, randomInt } from '../../random';
import { COUNTABLES } from '../data';
import { numberOptions } from './options';
import type { RoundGenerator } from '../types';

// --- 2. Contar ---------------------------------------------------------------

export const genCount: RoundGenerator = (rng, tier = 0) => {
  const emoji = pick(rng, COUNTABLES);
  const total = randomInt(rng, 3, 10 + tier * 2);

  return {
    question: '¿Cuántos hay?',
    spoken: 'Cuenta despacio cuántos bichitos hay y toca el número.',
    prompt: { kind: 'emoji-group', items: Array.from({ length: total }, () => emoji) },
    options: numberOptions(rng, total, 10 + tier * 2),
  };
};

// --- 10. El tren de los números ----------------------------------------------

export const genNumberSequence: RoundGenerator = (rng, tier = 0) => {
  const start = randomInt(rng, 1, 8 + tier * 2);
  const numbers = Array.from({ length: 5 }, (_, i) => start + i);
  // Nunca se oculta el primero: hace falta una referencia para deducir el paso.
  const hiddenIndex = randomInt(rng, 1, 4);
  const answer = numbers[hiddenIndex];

  return {
    question: '¿Qué número falta en el tren?',
    spoken: 'Mira los vagones del tren. ¿Qué número falta?',
    prompt: {
      kind: 'number-sequence',
      items: numbers.map((n, i) => (i === hiddenIndex ? null : n)),
    },
    options: numberOptions(rng, answer, start + 5),
  };
};
