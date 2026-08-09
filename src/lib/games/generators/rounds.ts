/** Cómo se arma una tanda de rondas a partir de un generador. */

import type { Rng } from '../../random';
import type { Round, RoundGenerator } from '../types';

/**
 * Identifica un ejercicio concreto, no solo su enunciado.
 *
 * Deduplicar por `question` no servía de nada en los generadores cuyo
 * enunciado es siempre el mismo («¿Cómo se siente?», «¿Cuántos hay?»...): la
 * ronda se daba por distinta aunque saliera la misma cara. Comparando también
 * el dibujo del enunciado y la respuesta correcta, dos rondas solo cuentan
 * como iguales si de verdad piden lo mismo.
 */
function coreKey(round: Round): string {
  const correct = round.options.find((option) => option.correct);
  return [
    round.question,
    JSON.stringify(round.prompt),
    JSON.stringify(correct?.display),
  ].join('|');
}

/**
 * Genera `count` rondas evitando repetir el mismo ejercicio dentro de la tanda.
 * Se limita el número de reintentos para no bloquearse cuando el generador
 * tiene poca variedad: «¿Dónde hay MÁS?» solo produce dos enunciados, así que
 * a partir de la tercera ronda la repetición es inevitable y se acepta.
 */
export function generateRounds(
  generate: RoundGenerator,
  rng: Rng,
  count: number,
  tier = 0,
): Round[] {
  const rounds: Round[] = [];
  const used = new Set<string>();

  for (let i = 0; i < count; i++) {
    let round = generate(rng, tier);
    for (let attempt = 0; attempt < 12 && used.has(coreKey(round)); attempt++) {
      round = generate(rng, tier);
    }
    used.add(coreKey(round));
    rounds.push(round);
  }

  return rounds;
}
