/** Generadores del mundo «El Prado de las Medidas». */

import { pick, randomInt, sample } from '../../random';
import {
  HEIGHT_PAIRS,
  COUNTABLES,
  DAY_THINGS,
  LINE_THINGS,
  NIGHT_THINGS,
  ROUTINE_STEPS,
  SEASON_CLUES,
  STORY_STRIPS,
  TIME_PAIRS,
  WEEKDAYS,
  WEIGHT_PAIRS,
} from '../data';
import { distinctDistractors, emojiToName, orderedSequence } from './factories';
import { buildOptions, textOption } from './options';
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

// --- 66. Largo y corto ---------------------------------------------------------

/**
 * Las filas no pasan de cuatro: la opción mide diez rem de ancho, así que a
 * partir del quinto elemento hace dos renglones y deja de leerse como una fila.
 * Y sin fila, «largo» no significa nada.
 */
const MAX_LINE = 4;

export const genLongShort: RoundGenerator = (rng) => {
  const emoji = pick(rng, LINE_THINGS);
  const countA = randomInt(rng, 1, MAX_LINE);
  // Diferencia de dos como mínimo, igual que en «¿Dónde hay MÁS?»: tres frente
  // a cuatro no se distingue de un vistazo a los cuatro años.
  const lengths = Array.from({ length: MAX_LINE }, (_, i) => i + 1);
  const countB = pick(
    rng,
    lengths.filter((n) => Math.abs(n - countA) >= 2),
  );
  const askLong = rng() < 0.5;
  const aWins = askLong ? countA > countB : countA < countB;

  const row = (count: number) => ({
    label: `fila de ${count}`,
    display: { kind: 'group' as const, items: Array.from({ length: count }, () => emoji) },
  });

  return {
    question: askLong ? '¿Qué fila es más LARGA?' : '¿Qué fila es más CORTA?',
    spoken: askLong
      ? 'Mira las dos filas. ¿Cuál es más larga?'
      : 'Mira las dos filas. ¿Cuál es más corta?',
    prompt: { kind: 'none' },
    options: buildOptions(rng, [
      { ...row(countA), correct: aWins },
      { ...row(countB), correct: !aWins },
    ]),
  };
};

// --- 68. ¿Qué pesa más? ---------------------------------------------------------

export const genWeight: RoundGenerator = (rng) => {
  const pair = pick(rng, WEIGHT_PAIRS);
  const askHeavy = rng() < 0.5;

  return {
    question: askHeavy ? '¿Qué pesa MÁS?' : '¿Qué pesa MENOS?',
    spoken: askHeavy
      ? 'Mira los dos dibujos. ¿Cuál pesa más?'
      : 'Mira los dos dibujos. ¿Cuál pesa menos?',
    prompt: { kind: 'none' },
    options: buildOptions(rng, [
      {
        label: pair.heavy.name,
        display: { kind: 'emoji', emoji: pair.heavy.emoji },
        correct: askHeavy,
      },
      {
        label: pair.light.name,
        display: { kind: 'emoji', emoji: pair.light.emoji },
        correct: !askHeavy,
      },
    ]),
  };
};

// --- 69. ¿Antes o después? -------------------------------------------------------

export const genTimeBeforeAfter: RoundGenerator = (rng) => {
  const pair = pick(rng, TIME_PAIRS);
  const askFirst = rng() < 0.5;

  return {
    question: askFirst ? '¿Qué pasa PRIMERO?' : '¿Qué pasa DESPUÉS?',
    spoken: askFirst
      ? 'Mira los dos dibujos. ¿Qué pasa primero?'
      : 'Mira los dos dibujos. ¿Qué pasa después?',
    prompt: { kind: 'none' },
    options: buildOptions(rng, [
      {
        label: pair.first.name,
        display: { kind: 'emoji', emoji: pair.first.emoji },
        correct: askFirst,
      },
      {
        label: pair.then.name,
        display: { kind: 'emoji', emoji: pair.then.emoji },
        correct: !askFirst,
      },
    ]),
  };
};

// --- 70. Los días de la semana ----------------------------------------------------

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const genWeekdays: RoundGenerator = (rng) => {
  const index = randomInt(rng, 0, WEEKDAYS.length - 1);
  const day = WEEKDAYS[index];
  const askNext = rng() < 0.5;
  // La semana da la vuelta: después del domingo viene el lunes, y antes del
  // lunes está el domingo. Sumar el paso en módulo lo resuelve en los dos
  // sentidos sin casos especiales.
  const step = askNext ? 1 : WEEKDAYS.length - 1;
  const answer = WEEKDAYS[(index + step) % WEEKDAYS.length];
  const others = sample(
    rng,
    WEEKDAYS.filter((other) => other !== answer),
    3,
  );
  // Los nombres de los días no caben dibujados en fila a tamaño de enunciado,
  // así que la serie va dicha y no pintada: el enunciado nombra el día de
  // referencia y las opciones son los nombres de los días.
  const question = askNext
    ? `¿Qué día viene después del ${day}?`
    : `¿Qué día viene antes del ${day}?`;

  return {
    question,
    spoken: question,
    prompt: { kind: 'none' },
    options: buildOptions(rng, [
      textOption(capitalize(answer), true),
      ...others.map((other) => textOption(capitalize(other), false)),
    ]),
  };
};

// --- 71. Las cuatro estaciones -------------------------------------------------------

export const genSeasons: RoundGenerator = emojiToName(SEASON_CLUES, {
  question: () => '¿De qué estación es?',
  spoken: () => 'Mira el dibujo. ¿De qué estación del año es?',
});

// --- 72. De día y de noche -------------------------------------------------------------

export const genDayNight: RoundGenerator = (rng) => {
  const byDay = rng() < 0.5;
  const family = byDay ? DAY_THINGS : NIGHT_THINGS;
  const strangers = byDay ? NIGHT_THINGS : DAY_THINGS;
  const answer = pick(rng, family);
  const others = distinctDistractors(rng, strangers, (item) => item.emoji, [], 3);

  return {
    question: byDay ? '¿Cuál es de día?' : '¿Cuál es de noche?',
    spoken: byDay ? 'Busca el dibujo que es de día.' : 'Busca el dibujo que es de noche.',
    prompt: { kind: 'emoji-single', item: byDay ? '☀️' : '🌙' },
    options: buildOptions(rng, [
      { label: answer.name, display: { kind: 'emoji', emoji: answer.emoji }, correct: true },
      ...others.map((item) => ({
        label: item.name,
        display: { kind: 'emoji' as const, emoji: item.emoji },
        correct: false,
      })),
    ]),
  };
};

// --- 73. Ordena el cuento -----------------------------------------------------------------

export const genStoryOrder: RoundGenerator = orderedSequence(
  STORY_STRIPS,
  {
    question: (step) =>
      step.index === step.window.length - 1 ? '¿Cómo acaba el cuento?' : '¿Qué pasa en medio?',
    spoken: (step) =>
      step.index === step.window.length - 1
        ? 'Mira el cuento. ¿Cómo acaba?'
        : 'Mira el cuento. ¿Qué pasa en medio?',
  },
  { windowLen: 3 },
);

// --- 67. Alto y bajo ---------------------------------------------------------------

export const genTallShort: RoundGenerator = (rng) => {
  const pair = pick(rng, HEIGHT_PAIRS);
  const askTall = rng() < 0.5;

  return {
    question: askTall ? '¿Cuál es más ALTO?' : '¿Cuál es más BAJO?',
    spoken: askTall ? 'Toca el que es más alto.' : 'Toca el que es más bajo.',
    prompt: { kind: 'none' },
    options: buildOptions(rng, [
      {
        label: pair.tall.name,
        display: { kind: 'emoji', emoji: pair.tall.emoji },
        correct: askTall,
      },
      {
        label: pair.short.name,
        display: { kind: 'emoji', emoji: pair.short.emoji },
        correct: !askTall,
      },
    ]),
  };
};
