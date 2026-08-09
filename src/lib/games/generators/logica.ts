/** Generadores del mundo «El Laberinto de la Lógica». */

import { pick, randomInt, sample } from '../../random';
import { CATEGORIES, COUNTABLES } from '../data';
import { buildOptions } from './options';
import type { RoundGenerator } from '../types';

function repeatToLength(motif: string[], length: number): string[] {
  return Array.from({ length }, (_, i) => motif[i % motif.length]);
}

// --- 6. Patrones -------------------------------------------------------------

export const genPatterns: RoundGenerator = (rng) => {
  const motifLength = pick(rng, [2, 2, 3]);
  const motif = sample(rng, COUNTABLES, motifLength);
  // Se muestran 2 ciclos completos más un desplazamiento aleatorio: si
  // siempre se mostrasen exactamente 2 ciclos, el hueco caería siempre justo
  // al reiniciar el motivo y la respuesta sería siempre motif[0] — nunca
  // exigiría predecir a mitad de secuencia.
  const extra = randomInt(rng, 0, motifLength - 1);
  const visibleLength = motifLength * 2 + extra;
  const visible = repeatToLength(motif, visibleLength);
  const answer = motif[visibleLength % motif.length];
  const others = sample(rng, COUNTABLES.filter((e) => e !== answer), 3);

  return {
    question: '¿Qué viene después?',
    spoken: 'Mira la fila de bichitos. ¿Cuál viene después?',
    prompt: { kind: 'sequence', items: [...visible, null] },
    options: buildOptions(rng, [
      { label: 'este', display: { kind: 'emoji', emoji: answer }, correct: true },
      ...others.map((e) => ({
        label: 'este',
        display: { kind: 'emoji' as const, emoji: e },
        correct: false,
      })),
    ]),
  };
};

// --- 7. El intruso -----------------------------------------------------------

export const genOddOne: RoundGenerator = (rng) => {
  const [family, stranger] = sample(rng, CATEGORIES, 2);
  const familyItems = sample(rng, family.items, 3);
  const intruder = pick(rng, stranger.items);

  return {
    question: '¿Cuál es diferente?',
    spoken: `Tres de estos son ${family.name}. ¿Cuál es el intruso?`,
    prompt: { kind: 'none' },
    options: buildOptions(rng, [
      { label: 'el intruso', display: { kind: 'emoji', emoji: intruder }, correct: true },
      ...familyItems.map((e) => ({
        label: family.name,
        display: { kind: 'emoji' as const, emoji: e },
        correct: false,
      })),
    ]),
  };
};
