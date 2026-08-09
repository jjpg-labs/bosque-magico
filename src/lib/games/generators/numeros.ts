/** Generadores del mundo «El Río de los Números». */

import { numericDistractors, pick, randomInt, sample } from '../../random';
import type { Rng } from '../../random';
import { COUNTABLES, CRITTERS } from '../data';
import { numberQuestion } from './factories';
import { buildOptions, numberOptions, textOption } from './options';
import type { Option, RoundGenerator } from '../types';

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

// --- Piezas compartidas ------------------------------------------------------

/** Cuántos vagones se enseñan en las dos pruebas de serie numérica nuevas. */
const TRAIN_LENGTH = 5;

/**
 * Cuatro números: la respuesta y tres vecinos dentro de `[min, max]`.
 *
 * Es `numberOptions` con suelo elegible. Las pruebas de este mundo cuentan
 * desde el uno, y un cero suelto entre las opciones no significa nada todavía
 * para quien está aprendiendo a contar bichitos.
 */
function numbersFrom(rng: Rng, answer: number, min: number, max: number): Option[] {
  return buildOptions(rng, [
    textOption(String(answer), true),
    ...numericDistractors(rng, answer, 3, min, max).map((n) => textOption(String(n), false)),
  ]);
}

/**
 * Una serie de cinco números con un hueco.
 *
 * La comparten «El Tren al Revés» (paso −1) y «De Dos en Dos» (paso +2): entre
 * las dos solo cambian el paso y de dónde arranca la fila.
 */
function numberTrain(rng: Rng, start: number, step: number) {
  const numbers = Array.from({ length: TRAIN_LENGTH }, (_, i) => start + i * step);
  // El primero siempre se ve: sin él no hay forma de saber hacia dónde va.
  const hidden = randomInt(rng, 1, TRAIN_LENGTH - 1);

  return {
    items: numbers.map((n, i) => (i === hidden ? null : n)),
    answer: numbers[hidden],
    floor: Math.min(...numbers),
    ceiling: Math.max(...numbers),
  };
}

/** Más de siete bichitos no caben dentro de un botón a 360 píxeles de ancho. */
const MAX_IN_GROUP = 7;

/**
 * Cuatro montones del mismo emoji, y solo uno con la cantidad pedida.
 *
 * Los tamaños de los tres montones falsos salen de `numericDistractors`, así
 * que quedan cerca del bueno: si uno tuviera dos y otro nueve se acertaría de
 * un vistazo, sin contar.
 */
function groupOptions(rng: Rng, emoji: string, answer: number): Option[] {
  const groupOf = (count: number, correct: boolean) => ({
    label: String(count),
    display: { kind: 'group' as const, items: Array.from({ length: count }, () => emoji) },
    correct,
  });

  return buildOptions(rng, [
    groupOf(answer, true),
    ...numericDistractors(rng, answer, 3, 1, MAX_IN_GROUP).map((size) => groupOf(size, false)),
  ]);
}

// --- 31. Toca el número ------------------------------------------------------

export const genTouchNumber: RoundGenerator = numberQuestion((rng, tier) => {
  // Hasta el catorce ya de salida. Aquí no hay que operar, solo reconocer el
  // número, y con diez la prueba se sabe de memoria en tres partidas.
  const max = 14 + tier * 3;
  const answer = randomInt(rng, 1, max);

  return {
    question: `Toca el número ${answer}`,
    spoken: `Busca el número ${answer} y tócalo.`,
    prompt: { kind: 'none' },
    answer,
    min: 1,
    max,
  };
});

// --- 32. ¿Cuál es mayor? -----------------------------------------------------

export const genBiggerNumber: RoundGenerator = (rng, tier = 0) => {
  const max = 12 + tier * 4;
  const numbers = sample(
    rng,
    Array.from({ length: max }, (_, i) => i + 1),
    4,
  );
  const wantsBiggest = rng() < 0.5;
  const answer = wantsBiggest ? Math.max(...numbers) : Math.min(...numbers);

  return {
    question: `¿Cuál es el número MÁS ${wantsBiggest ? 'GRANDE' : 'PEQUEÑO'}?`,
    spoken: `Mira los cuatro números. ¿Cuál es el más ${wantsBiggest ? 'grande' : 'pequeño'}?`,
    prompt: { kind: 'none' },
    options: buildOptions(
      rng,
      numbers.map((n) => textOption(String(n), n === answer)),
    ),
  };
};

// --- 33. Antes y después -----------------------------------------------------

export const genNumberBeforeAfter: RoundGenerator = numberQuestion((rng, tier) => {
  const max = 12 + tier * 4;
  const after = rng() < 0.5;
  // Hacia atrás se arranca del dos: el cero no se ha presentado todavía.
  const from = after ? randomInt(rng, 1, max - 1) : randomInt(rng, 2, max);
  const answer = after ? from + 1 : from - 1;

  return {
    question: `¿Qué número va justo ${after ? 'después' : 'antes'} del ${from}?`,
    spoken: `¿Qué número viene justo ${after ? 'después' : 'antes'} del ${from}?`,
    prompt: { kind: 'none' },
    answer,
    min: 1,
    max,
  };
});

// --- 34. El tren al revés ----------------------------------------------------

export const genCountBackwards: RoundGenerator = (rng, tier = 0) => {
  // Arranca lo bastante arriba para que la cuenta atrás no baje del uno.
  const start = randomInt(rng, TRAIN_LENGTH, 9 + tier * 3);
  const train = numberTrain(rng, start, -1);

  return {
    question: '¿Qué número falta en el tren?',
    spoken: 'Este tren cuenta hacia atrás. ¿Qué número falta?',
    prompt: { kind: 'number-sequence', items: train.items },
    options: numbersFrom(rng, train.answer, train.floor, train.ceiling),
  };
};

// --- 35. De dos en dos -------------------------------------------------------

export const genCountByTwos: RoundGenerator = (rng, tier = 0) => {
  const start = randomInt(rng, 1, 4 + tier * 2);
  const train = numberTrain(rng, start, 2);

  return {
    question: '¿Qué número falta?',
    spoken: 'Este tren va dando saltos de dos. ¿Qué número falta?',
    prompt: { kind: 'number-sequence', items: train.items },
    options: numbersFrom(rng, train.answer, 1, train.ceiling),
  };
};

// --- 36. Toca el grupo correcto ----------------------------------------------

export const genPickGroup: RoundGenerator = (rng, tier = 0) => {
  const emoji = pick(rng, COUNTABLES);
  const answer = randomInt(rng, 2, 5 + tier);

  return {
    question: `Toca el grupo que tiene ${answer}`,
    spoken: `Cuenta con el dedo. ¿Qué grupo tiene ${answer}?`,
    prompt: { kind: 'none' },
    options: groupOptions(rng, emoji, answer),
  };
};

// --- 37. ¿Cuántos faltan? ----------------------------------------------------

export const genHowManyMissing: RoundGenerator = (rng, tier = 0) => {
  const emoji = pick(rng, COUNTABLES);
  const total = randomInt(rng, 4, 5 + tier * 2);
  const placed = randomInt(rng, 1, total - 1);

  return {
    question: `¿Cuántos faltan para llegar a ${total}?`,
    spoken: `Aquí caben ${total}. ¿Cuántos faltan para llenar los huecos?`,
    prompt: {
      kind: 'sequence',
      items: Array.from({ length: total }, (_, i) => (i < placed ? emoji : null)),
    },
    options: numbersFrom(rng, total - placed, 1, total),
  };
};

// --- 38. ¿Quién va el primero? -----------------------------------------------

const ORDINALS = ['primero', 'segundo', 'tercero', 'cuarto', 'quinto'] as const;

export const genOrdinals: RoundGenerator = (rng) => {
  const length = randomInt(rng, 3, ORDINALS.length);
  const queue = sample(rng, CRITTERS, length);
  const position = randomInt(rng, 0, length - 1);
  const answer = queue[position];

  return {
    question: `¿Quién va el ${ORDINALS[position]}?`,
    spoken: `Mira la fila. ¿Quién va el ${ORDINALS[position]}?`,
    prompt: { kind: 'sequence', items: queue.map((critter) => critter.emoji) },
    // Las opciones son los mismos de la fila: lo que se pregunta es el puesto,
    // no el animal, así que reconocerlo fuera de la fila no debería bastar.
    options: buildOptions(
      rng,
      queue.map((critter) => ({
        label: critter.name,
        display: { kind: 'emoji' as const, emoji: critter.emoji },
        correct: critter.emoji === answer.emoji,
      })),
    ),
  };
};

// --- 39. Los mismos que aquí -------------------------------------------------

export const genSameAmount: RoundGenerator = (rng, tier = 0) => {
  // Dos dibujos distintos a propósito: con el mismo arriba y abajo se acierta
  // comparando manchas, sin llegar a contar.
  const [shown, offered] = sample(rng, COUNTABLES, 2);
  const answer = randomInt(rng, 2, 5 + tier);

  return {
    question: '¿Qué grupo tiene los mismos?',
    spoken: 'Cuenta los de arriba. Busca el grupo que tiene los mismos.',
    prompt: { kind: 'emoji-group', items: Array.from({ length: answer }, () => shown) },
    options: groupOptions(rng, offered, answer),
  };
};

// --- 40. Uno más, uno menos --------------------------------------------------

export const genOneMoreOneLess: RoundGenerator = numberQuestion((rng, tier) => {
  const emoji = pick(rng, COUNTABLES);
  const max = 6 + tier * 2;
  const more = rng() < 0.5;
  const total = more ? randomInt(rng, 1, max - 1) : randomInt(rng, 2, max);

  return {
    question: more ? 'Si viene uno más, ¿cuántos hay?' : 'Si se va uno, ¿cuántos quedan?',
    spoken: more
      ? 'Mira cuántos hay. Si viene uno más, ¿cuántos hay?'
      : 'Mira cuántos hay. Si se va uno, ¿cuántos quedan?',
    prompt: { kind: 'emoji-group', items: Array.from({ length: total }, () => emoji) },
    answer: more ? total + 1 : total - 1,
    min: 1,
    max: max + 1,
  };
});
