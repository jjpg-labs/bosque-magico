/**
 * Generadores de rondas.
 *
 * Cada prueba genera sus preguntas al vuelo. La versión original tenía las
 * respuestas fijas en el JSX (siempre la abeja, siempre 5 mariquitas), así que
 * bastaban dos partidas para memorizar la posición del botón correcto en vez
 * de resolver el ejercicio.
 */

import { pick, numericDistractors, randomInt, sample, shuffle } from '../random';
import type { Rng } from '../random';
import {
  CATEGORIES,
  COUNTABLES,
  CRITTERS,
  SHAPES,
  SHAPE_OBJECTS,
  VOWELS,
  VOWEL_WORDS,
} from './data';
import type { Option, Round, RoundGenerator, ShapeName } from './types';

/** Marcas diacríticas Unicode, para poder comparar «Á» con «A». */
const COMBINING_MARKS = /[\u0300-\u036f]/g;

const ALPHABET = 'ABCDEFGHIJKLMNOPRSTUV'.split('');

/** Letra inicial en mayúscula y sin tilde: «Árbol» → «A». */
export function initialLetter(word: string): string {
  return word
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .charAt(0)
    .toUpperCase();
}

type OptionSeed = Omit<Option, 'id'>;

/** Baraja las opciones y les asigna ids estables dentro de la ronda. */
function buildOptions(rng: Rng, seeds: OptionSeed[]): Option[] {
  return shuffle(rng, seeds).map((seed, index) => ({ ...seed, id: `opt-${index}` }));
}

function textOption(text: string, correct: boolean): OptionSeed {
  return { label: text, display: { kind: 'text', text }, correct };
}

function numberOptions(rng: Rng, answer: number, max = 10): Option[] {
  const distractors = numericDistractors(rng, answer, 3, 0, max);
  return buildOptions(rng, [
    textOption(String(answer), true),
    ...distractors.map((n) => textOption(String(n), false)),
  ]);
}

function shapeOption(shape: ShapeName, correct: boolean): OptionSeed {
  return { label: shape, display: { kind: 'shape', shape }, correct };
}

function shapeOptions(rng: Rng, answer: ShapeName): Option[] {
  const others = sample(rng, SHAPES.filter((s) => s !== answer), 3);
  return buildOptions(rng, [
    shapeOption(answer, true),
    ...others.map((s) => shapeOption(s, false)),
  ]);
}

function repeatToLength(motif: string[], length: number): string[] {
  return Array.from({ length }, (_, i) => motif[i % motif.length]);
}

// --- 1. Letras iniciales -----------------------------------------------------

export const genLetters: RoundGenerator = (rng) => {
  const critter = pick(rng, CRITTERS);
  const answer = initialLetter(critter.name);
  const others = sample(rng, ALPHABET.filter((l) => l !== answer), 3);

  return {
    question: `¿Con qué letra empieza ${critter.name}?`,
    spoken: `¿Con qué letra empieza la palabra ${critter.name}?`,
    prompt: { kind: 'emoji-single', item: critter.emoji },
    options: buildOptions(rng, [
      textOption(answer, true),
      ...others.map((l) => textOption(l, false)),
    ]),
  };
};

// --- 2. Contar ---------------------------------------------------------------

export const genCount: RoundGenerator = (rng) => {
  const emoji = pick(rng, COUNTABLES);
  const total = randomInt(rng, 3, 8);

  return {
    question: '¿Cuántos hay?',
    spoken: 'Cuenta despacio cuántos bichitos hay y toca el número.',
    prompt: { kind: 'emoji-group', items: Array.from({ length: total }, () => emoji) },
    options: numberOptions(rng, total),
  };
};

// --- 3. Sumas ----------------------------------------------------------------

export const genAdd: RoundGenerator = (rng) => {
  const a = randomInt(rng, 1, 4);
  const b = randomInt(rng, 1, Math.min(4, 6 - a));
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
    options: numberOptions(rng, answer),
  };
};

// --- 4. Restas ---------------------------------------------------------------

export const genSub: RoundGenerator = (rng) => {
  const total = randomInt(rng, 3, 6);
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
    options: numberOptions(rng, answer),
  };
};

// --- 5. Formas geométricas ---------------------------------------------------

export const genShapes: RoundGenerator = (rng) => {
  const answer = pick(rng, SHAPES);

  return {
    question: `Toca el ${answer}`,
    spoken: `Busca el ${answer} y tócalo.`,
    prompt: { kind: 'none' },
    options: shapeOptions(rng, answer),
  };
};

// --- 6. Patrones -------------------------------------------------------------

export const genPatterns: RoundGenerator = (rng) => {
  const motifLength = pick(rng, [2, 2, 3]);
  const motif = sample(rng, COUNTABLES, motifLength);
  const visibleLength = motifLength * 2;
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

// --- 9. Más o menos ----------------------------------------------------------

export const genMoreLess: RoundGenerator = (rng) => {
  const emoji = pick(rng, COUNTABLES);
  const countA = randomInt(rng, 1, 8);
  // Se exige una diferencia de al menos 2: a simple vista, 4 contra 5 es
  // demasiado sutil a los 4 años. Se elige entre los valores válidos en vez de
  // sumar un delta y recortar, porque recortar puede igualar los dos grupos.
  const candidates = [1, 2, 3, 4, 5, 6, 7, 8].filter((n) => Math.abs(n - countA) >= 2);
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

// --- 10. El tren de los números ----------------------------------------------

export const genNumberSequence: RoundGenerator = (rng) => {
  const start = randomInt(rng, 1, 5);
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

// --- 11. Sonidos e iniciales -------------------------------------------------

export const genPhonics: RoundGenerator = (rng) => {
  const word = pick(rng, VOWEL_WORDS);
  const answer = initialLetter(word.name);
  const others = sample(rng, VOWELS.filter((v) => v !== answer), 3);

  return {
    question: `¿Con qué vocal empieza ${word.name}?`,
    spoken: `Escucha: ${word.name}. ${word.name} empieza por... ¿qué vocal?`,
    prompt: { kind: 'listen', word: word.name, emoji: word.emoji },
    options: buildOptions(rng, [
      textOption(answer, true),
      ...others.map((v) => textOption(v, false)),
    ]),
  };
};

// --- 12. Empareja las formas -------------------------------------------------

export const genShapeMatch: RoundGenerator = (rng) => {
  const object = pick(rng, SHAPE_OBJECTS);

  return {
    question: `¿Qué forma tiene ${object.name}?`,
    spoken: `Mira ${object.name}. ¿Qué forma geométrica tiene?`,
    prompt: { kind: 'emoji-single', item: object.emoji },
    options: shapeOptions(rng, object.shape),
  };
};

// --- 13. El gran desafío final ----------------------------------------------

const CHALLENGE_POOL: readonly RoundGenerator[] = [
  genLetters,
  genCount,
  genAdd,
  genSub,
  genShapes,
  genPatterns,
  genOddOne,
  genMoreLess,
  genNumberSequence,
  genPhonics,
  genShapeMatch,
];

export const genFinalChallenge: RoundGenerator = (rng) => pick(rng, CHALLENGE_POOL)(rng);

/**
 * Genera `count` rondas evitando repetir la misma pregunta dentro de la tanda.
 * Se limita el número de reintentos para no bloquearse cuando el generador
 * tiene poca variedad: «¿Dónde hay MÁS?» solo produce dos enunciados, así que
 * a partir de la tercera ronda la repetición es inevitable y se acepta.
 */
export function generateRounds(generate: RoundGenerator, rng: Rng, count: number): Round[] {
  const rounds: Round[] = [];
  const used = new Set<string>();

  for (let i = 0; i < count; i++) {
    let round = generate(rng);
    for (let attempt = 0; attempt < 12 && used.has(round.question); attempt++) {
      round = generate(rng);
    }
    used.add(round.question);
    rounds.push(round);
  }

  return rounds;
}
