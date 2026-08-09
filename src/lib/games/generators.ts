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
  ANIMAL_SOUNDS,
  CATEGORIES,
  COLORS,
  COUNTABLES,
  CRITTERS,
  EMOTIONS,
  RHYME_FAMILIES,
  ROUTINE_STEPS,
  SHAPES,
  SHAPE_OBJECTS,
  VOWELS,
  VOWEL_WORDS,
} from './data';
import type { Option, Round, RoundGenerator, ShapeName } from './types';

/** Marcas diacríticas Unicode, para poder comparar «Á» con «A». */
const COMBINING_MARKS = /[\u0300-\u036f]/g;

// Alfabeto completo salvo la K y la W, que en español solo aparecen en
// extranjerismos y no son iniciales útiles a esta edad. La Ñ, la Q, la X, la
// Y y la Z sí: hacen falta como distractores en cuanto el pool tiene palabras
// como «Queso», «Zapato» o «Yogur».
const ALPHABET = 'ABCDEFGHIJLMNÑOPQRSTUVXYZ'.split('');

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

// --- 14. Colores del bosque ---------------------------------------------------

export const genColors: RoundGenerator = (rng) => {
  const answer = pick(rng, COLORS);
  const others = sample(
    rng,
    COLORS.filter((c) => c.name !== answer.name),
    3,
  );

  return {
    question: `Toca el color ${answer.name}`,
    spoken: `Busca el color ${answer.name} y tócalo.`,
    prompt: { kind: 'none' },
    options: buildOptions(rng, [
      { label: answer.name, display: { kind: 'emoji', emoji: answer.emoji }, correct: true },
      ...others.map((c) => ({
        label: c.name,
        display: { kind: 'emoji' as const, emoji: c.emoji },
        correct: false,
      })),
    ]),
  };
};

// --- 15. ¿Quién hace este sonido? ---------------------------------------------

export const genAnimalSound: RoundGenerator = (rng) => {
  const answer = pick(rng, ANIMAL_SOUNDS);
  const others = sample(
    rng,
    ANIMAL_SOUNDS.filter((a) => a.name !== answer.name),
    3,
  );

  return {
    question: '¿Quién hace este sonido?',
    spoken: `Escucha: ${answer.sound}. ¿Quién hace este sonido?`,
    prompt: { kind: 'none' },
    options: buildOptions(rng, [
      { label: answer.name, display: { kind: 'emoji', emoji: answer.emoji }, correct: true },
      ...others.map((a) => ({
        label: a.name,
        display: { kind: 'emoji' as const, emoji: a.emoji },
        correct: false,
      })),
    ]),
  };
};

// --- 16. ¿Cómo se siente? -------------------------------------------------------

export const genEmotion: RoundGenerator = (rng) => {
  const answer = pick(rng, EMOTIONS);
  const others = sample(
    rng,
    EMOTIONS.filter((e) => e.name !== answer.name),
    3,
  );

  return {
    question: '¿Cómo se siente?',
    spoken: 'Mira la cara. ¿Cómo se siente?',
    prompt: { kind: 'emoji-single', item: answer.emoji },
    options: buildOptions(rng, [
      textOption(answer.name, true),
      ...others.map((e) => textOption(e.name, false)),
    ]),
  };
};

// --- 17. Rimas divertidas -------------------------------------------------------

export const genRhyme: RoundGenerator = (rng) => {
  const family = pick(rng, RHYME_FAMILIES);
  const [target, match] = sample(rng, family, 2);
  const distractorFamilies = sample(
    rng,
    RHYME_FAMILIES.filter((f) => f !== family),
    2,
  );
  const distractors = distractorFamilies.map((f) => pick(rng, f));

  return {
    question: `¿Qué rima con ${target.word}?`,
    spoken: `Escucha esta palabra: ${target.word}. ¿Cuál de estas rima con ${target.word}?`,
    prompt: { kind: 'listen', word: target.word, emoji: target.emoji },
    options: buildOptions(rng, [
      { label: match.word, display: { kind: 'emoji', emoji: match.emoji }, correct: true },
      ...distractors.map((d) => ({
        label: d.word,
        display: { kind: 'emoji' as const, emoji: d.emoji },
        correct: false,
      })),
    ]),
  };
};

// --- 18. Grande y pequeño --------------------------------------------------------

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

// --- 19. La rutina del día --------------------------------------------------------

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
  genColors,
  genAnimalSound,
  genEmotion,
  genRhyme,
  genSize,
  genRoutine,
];

// El `tier` se propaga al generador elegido: sin esto, el desafío final era
// la única prueba que nunca subía de dificultad por muchas veces que se jugara.
export const genFinalChallenge: RoundGenerator = (rng, tier = 0) =>
  pick(rng, CHALLENGE_POOL)(rng, tier);

/**
 * Identifica un ejercicio concreto, no solo su enunciado.
 *
 * Deduplicar por `question` no servía de nada en los siete generadores cuyo
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
