/** Generadores del mundo «La Cueva de las Cuentas». */

import { randomInt } from '../../random';
import { numberOptions } from './options';
import type { RoundGenerator } from '../types';

// --- 3. Sumas ----------------------------------------------------------------

export const genAdd: RoundGenerator = (rng, tier = 0) => {
  const maxAddend = 4 + tier;
  const maxSum = 10 + tier * 2;
  const a = randomInt(rng, 1, maxAddend);
  const b = randomInt(rng, 1, Math.min(maxAddend, maxSum - a));
  const answer = a + b;

  return {
    question: `${a} más ${b} son...`,
    spoken: `¿Cuántas manzanas hay en total? ${a} manzanas más ${b} manzanas.`,
    prompt: {
      kind: 'equation',
      left: Array.from({ length: a }, () => '🍎'),
      op: '+',
      right: Array.from({ length: b }, () => '🍎'),
    },
    options: numberOptions(rng, answer, maxSum),
  };
};

// --- 4. Restas ---------------------------------------------------------------

export const genSub: RoundGenerator = (rng, tier = 0) => {
  const maxTotal = 10 + tier * 2;
  const total = randomInt(rng, 3, maxTotal);
  const eaten = randomInt(rng, 1, total - 1);
  const answer = total - eaten;

  return {
    question: `El monito tenía ${total} plátanos y se comió ${eaten}. ¿Cuántos quedan?`,
    spoken: `El monito tenía ${total} plátanos y se ha comido ${eaten}. ¿Cuántos plátanos le quedan?`,
    prompt: {
      kind: 'equation',
      left: Array.from({ length: total }, () => '🍌'),
      op: '−',
      right: Array.from({ length: eaten }, () => '🍌'),
    },
    options: numberOptions(rng, answer, maxTotal),
  };
};
