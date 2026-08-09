/** Generadores del mundo «El Prado de las Medidas». */

import { pick, randomInt, sample } from '../../random';
import { COUNTABLES, ROUTINE_STEPS } from '../data';
import { buildOptions } from './options';
import type { RoundGenerator } from '../types';

// --- 9. Más o menos ----------------------------------------------------------

export const genMoreLess: RoundGenerator = (rng, tier = 0) => {
  const emoji = pick(rng, COUNTABLES);
  const max = 8 + tier * 2;
  const countA = randomInt(rng, 1, max);
  // Se exige una diferencia de al menos 2: a simple vista, 4 contra 5 es
  // demasiado sutil a los 4 años. Se elige entre los valores válidos en vez de
  // sumar un delta y recortar, porque recortar puede igualar los dos grupos.
  const range = Array.from({ length: max }, (_, i) => i + 1);
  const candidates = range.filter((n) => Math.abs(n - countA) >= 2);
  const countB = pick(rng, candidates);
  const askMore = rng() < 0.5;

  const aWins = askMore ? countA > countB : countA < countB;

  return {
    question: askMore ? '¿Dónde hay MÁS?' : '¿Dónde hay MENOS?',
    spoken: askMore
      ? 'Toca el grupo que tiene más bichitos.'
      : 'Toca el grupo que tiene menos bichitos.',
    prompt: { kind: 'none' },
    options: buildOptions(rng, [
      {
        label: `grupo de ${countA}`,
        display: { kind: 'group', items: Array.from({ length: countA }, () => emoji) },
        correct: aWins,
      },
      {
        label: `grupo de ${countB}`,
        display: { kind: 'group', items: Array.from({ length: countB }, () => emoji) },
        correct: !aWins,
      },
    ]),
  };
};

// --- 18. Grande y pequeño ----------------------------------------------------

export const genSize: RoundGenerator = (rng) => {
  const emoji = pick(rng, COUNTABLES);
  const askBig = rng() < 0.5;

  return {
    question: askBig ? '¿Cuál es el GRANDE?' : '¿Cuál es el PEQUEÑO?',
    spoken: askBig ? 'Toca el que es más grande.' : 'Toca el que es más pequeño.',
    prompt: { kind: 'none' },
    options: buildOptions(rng, [
      { label: 'grande', display: { kind: 'emoji', emoji, scale: 'lg' }, correct: askBig },
      { label: 'pequeño', display: { kind: 'emoji', emoji, scale: 'sm' }, correct: !askBig },
    ]),
  };
};

// --- 19. La rutina del día ---------------------------------------------------

export const genRoutine: RoundGenerator = (rng) => {
  const windowLen = 4;
  const start = randomInt(rng, 0, ROUTINE_STEPS.length - windowLen);
  const window = ROUTINE_STEPS.slice(start, start + windowLen);
  // Nunca se oculta el primero: hace falta una referencia para saber por dónde va el día.
  const hiddenIndex = randomInt(rng, 1, windowLen - 1);
  const answer = window[hiddenIndex];
  const others = sample(
    rng,
    ROUTINE_STEPS.filter((s) => s.label !== answer.label),
    3,
  );

  return {
    question: '¿Qué toca ahora?',
    spoken: 'Mira los pasos del día. ¿Qué toca ahora?',
    prompt: {
      kind: 'sequence',
      items: window.map((s, i) => (i === hiddenIndex ? null : s.emoji)),
    },
    options: buildOptions(rng, [
      { label: answer.label, display: { kind: 'emoji', emoji: answer.emoji }, correct: true },
      ...others.map((s) => ({
        label: s.label,
        display: { kind: 'emoji' as const, emoji: s.emoji },
        correct: false,
      })),
    ]),
  };
};
