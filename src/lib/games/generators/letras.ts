/** Generadores del mundo «El Claro de las Letras». */

import { pick, randomInt, sample } from '../../random';
import type { Rng } from '../../random';
import {
  CRITTERS,
  EVERYDAY_OBJECTS,
  FINAL_LETTERS,
  FINAL_LETTER_WORDS,
  FULL_ALPHABET,
  ONE_VOWEL_WORDS,
  RHYME_FAMILIES,
  SYLLABLE_WORDS,
  VOWELS,
  VOWEL_WORDS,
  WORDS_BY_INITIAL,
} from '../data';
import type { SyllableWord } from '../data';
import {
  distinctDistractors,
  emojiToName,
  listenAndPick,
  nameToEmoji,
  numberQuestion,
} from './factories';
import { buildOptions, textOption } from './options';
import type { RoundGenerator } from '../types';

/** Marcas diacríticas Unicode, para poder comparar «Á» con «A». */
const COMBINING_MARKS = /[\u0300-\u036f]/g;

// Alfabeto completo salvo la K y la W, que en español solo aparecen en
// extranjerismos y no son iniciales útiles a esta edad. La Ñ, la Q, la X, la
// Y y la Z sí: hacen falta como distractores en cuanto el pool tiene palabras
// como «Queso», «Zapato» o «Yogur».
export const ALPHABET = 'ABCDEFGHIJLMNÑOPQRSTUVXYZ'.split('');

/** Palabra en mayúsculas y sin tildes, lista para deletrear: «Delfín» → «DELFIN». */
function spellable(word: string): string {
  return word.normalize('NFD').replace(COMBINING_MARKS, '').toUpperCase();
}

/** Letra inicial en mayúscula y sin tilde: «Árbol» → «A». */
export function initialLetter(word: string): string {
  return spellable(word).charAt(0);
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

// --- 17. Rimas divertidas ----------------------------------------------------

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

// --- Piezas compartidas por las pruebas de letras sueltas --------------------

/**
 * Cuatro opciones de texto: la letra correcta y tres más que no se repiten.
 *
 * `exclude` suele ser solo la respuesta, pero en el abecedario en orden son
 * todas las letras que ya están a la vista: ofrecer como distractor una letra
 * que se ve en la fila la delata sola.
 */
function letterOptions(
  rng: Rng,
  answer: string,
  pool: readonly string[],
  exclude: string | readonly string[],
) {
  const others = distinctDistractors(rng, pool, (letter) => letter, exclude, 3);
  return buildOptions(rng, [
    textOption(answer, true),
    ...others.map((letter) => textOption(letter, false)),
  ]);
}

// --- 20. Toca la letra -------------------------------------------------------

const LETTER_ITEMS = ALPHABET.map((letter) => ({ emoji: letter, name: letter }));

export const genTouchLetter: RoundGenerator = nameToEmoji(
  LETTER_ITEMS,
  {
    question: (letter) => `Toca la letra ${letter.name}`,
    spoken: (letter) => `Busca la letra ${letter.name} y tócala.`,
  },
  { as: 'text' },
);

// --- 21. Letras pequeñitas ---------------------------------------------------

/**
 * La mayúscula se enseña y la minúscula se elige. Es la misma letra en dos
 * trajes distintos, que a esta edad todavía parecen dos letras diferentes.
 */
const LOWERCASE_LETTERS = ALPHABET.map((letter) => ({
  emoji: letter,
  name: letter.toLowerCase(),
}));

export const genLowercaseLetter: RoundGenerator = emojiToName(LOWERCASE_LETTERS, {
  question: () => '¿Cuál es la misma letra en pequeñita?',
  spoken: () => 'Mira la letra grande. Busca la misma en pequeñita.',
});

// --- 22. ¿Con qué letra acaba? ----------------------------------------------

export const genFinalLetter: RoundGenerator = (rng) => {
  const entry = pick(rng, FINAL_LETTER_WORDS);

  return {
    question: `¿Con qué letra acaba «${entry.word}»?`,
    spoken: `Escucha: ${entry.word}. ¿Con qué letra acaba?`,
    prompt: { kind: 'emoji-single', item: entry.emoji },
    // Los distractores salen de las terminaciones posibles, no del abecedario
    // entero: una Q o una B se descartarían sin pensar.
    options: letterOptions(rng, entry.last, FINAL_LETTERS, entry.last),
  };
};

// --- 23. Cuenta las palmadas -------------------------------------------------

/** Hasta cuántas sílabas se pregunta en cada nivel: 3, 4 y 5. */
const SYLLABLE_POOLS: ReadonlyArray<readonly SyllableWord[]> = [3, 4, 5].map((max) =>
  SYLLABLE_WORDS.filter((word) => word.syllables.length <= max),
);

export const genSyllableClaps: RoundGenerator = numberQuestion((rng, tier) => {
  const word = pick(rng, SYLLABLE_POOLS[Math.min(tier, SYLLABLE_POOLS.length - 1)]);

  return {
    question: '¿Cuántas palmadas tiene?',
    spoken: `Escucha: ${word.word}. Da una palmada por sílaba. ¿Cuántas son?`,
    prompt: { kind: 'listen', word: word.word, emoji: word.emoji },
    answer: word.syllables.length,
    min: 1,
    max: 5,
  };
});

// --- 24. La primera sílaba ---------------------------------------------------

const firstSyllableOf = (word: SyllableWord) => word.syllables[0].toUpperCase();

export const genFirstSyllable: RoundGenerator = (rng) => {
  const word = pick(rng, SYLLABLE_WORDS);
  const answer = firstSyllableOf(word);
  const others = distinctDistractors(rng, SYLLABLE_WORDS, firstSyllableOf, answer, 3);

  return {
    question: '¿Por qué sílaba empieza?',
    spoken: `Escucha: ${word.word}. ¿Por qué sílaba empieza?`,
    prompt: { kind: 'listen', word: word.word, emoji: word.emoji },
    options: buildOptions(rng, [
      textOption(answer, true),
      ...others.map((other) => textOption(firstSyllableOf(other), false)),
    ]),
  };
};

// --- 25. Empiezan igual ------------------------------------------------------

export const genSameInitialSound: RoundGenerator = listenAndPick(
  WORDS_BY_INITIAL,
  {
    targetOf: (word) => ({ word: word.word, emoji: word.emoji }),
    // Por sonido, no por letra: «casa» y «queso» empiezan igual; «casa» y
    // «cebra», no. La tabla ya trae la clave fonética resuelta.
    matchesOf: (word, pool) =>
      pool.filter((other) => other.emoji !== word.emoji && other.sound === word.sound),
    optionOf: (word) => ({
      label: word.word,
      display: { kind: 'emoji', emoji: word.emoji },
    }),
  },
  {
    question: (round) => `¿Cuál empieza como ${round.target.word}?`,
    spoken: (round) => `Escucha: ${round.target.word}. ¿Cuál empieza con el mismo sonido?`,
  },
);

// --- 26. La letra perdida ----------------------------------------------------

/**
 * Bichitos de nombre corto para deletrear con un hueco.
 *
 * Fuera los de más de siete letras (no caben en una fila a 360 píxeles) y los
 * que llevan hache: si el hueco cae justo en una letra que no suena, la
 * pregunta no tiene forma de resolverse escuchando.
 */
const MISSING_LETTER_WORDS = CRITTERS.filter(
  (critter) => critter.name.length <= 7 && !critter.name.toLowerCase().includes('h'),
).map((critter) => ({ word: critter.name.toLowerCase(), letters: spellable(critter.name).split('') }));

export const genMissingLetter: RoundGenerator = (rng) => {
  const entry = pick(rng, MISSING_LETTER_WORDS);
  // Nunca la primera: sin ninguna letra delante no hay por dónde empezar.
  const gap = randomInt(rng, 1, entry.letters.length - 1);
  const answer = entry.letters[gap];

  return {
    question: '¿Qué letra falta en la palabra?',
    // La palabra va solo en la voz: escrita en el enunciado, bastaría copiarla.
    spoken: `La palabra es ${entry.word}. ¿Qué letra le falta?`,
    prompt: {
      kind: 'sequence',
      items: entry.letters.map((letter, i) => (i === gap ? null : letter)),
    },
    options: letterOptions(rng, answer, FULL_ALPHABET, answer),
  };
};

// --- 27. El abecedario en orden ----------------------------------------------

const ALPHABET_WINDOW = 4;

export const genAlphabetOrder: RoundGenerator = (rng) => {
  const start = randomInt(rng, 0, FULL_ALPHABET.length - ALPHABET_WINDOW);
  const shown = FULL_ALPHABET.slice(start, start + ALPHABET_WINDOW);
  const gap = randomInt(rng, 1, ALPHABET_WINDOW - 1);
  const answer = shown[gap];

  return {
    question: '¿Qué letra falta en el abecedario?',
    spoken: 'Mira estas letras en orden. ¿Cuál falta?',
    prompt: { kind: 'sequence', items: shown.map((letter, i) => (i === gap ? null : letter)) },
    options: letterOptions(rng, answer, FULL_ALPHABET, shown),
  };
};

// --- 28. Palabras largas y cortas --------------------------------------------

export const genWordLength: RoundGenerator = (rng) => {
  const first = pick(rng, SYLLABLE_WORDS);
  // Dos sílabas de diferencia como mínimo: con una sola, «gato» y «abeja»
  // suenan casi igual de largas y la respuesta sería discutible.
  const second = pick(
    rng,
    SYLLABLE_WORDS.filter(
      (word) => Math.abs(word.syllables.length - first.syllables.length) >= 2,
    ),
  );
  const [longer, shorter] =
    first.syllables.length > second.syllables.length ? [first, second] : [second, first];
  const wantsLongest = rng() < 0.5;
  const answer = wantsLongest ? longer : shorter;
  const other = wantsLongest ? shorter : longer;
  const adjective = wantsLongest ? 'larga' : 'corta';

  return {
    question: `¿Qué palabra es más ${adjective}: ${first.word} o ${second.word}?`,
    spoken: `Escucha: ${first.word}, ${second.word}. ¿Cuál es más ${adjective}?`,
    prompt: { kind: 'none' },
    options: buildOptions(rng, [
      { label: answer.word, display: { kind: 'emoji', emoji: answer.emoji }, correct: true },
      { label: other.word, display: { kind: 'emoji', emoji: other.emoji }, correct: false },
    ]),
  };
};

// --- 29. ¿Con qué empieza? ---------------------------------------------------

export const genObjectInitials: RoundGenerator = (rng) => {
  const object = pick(rng, EVERYDAY_OBJECTS);
  const answer = initialLetter(object.name);

  return {
    question: `¿Con qué letra empieza ${object.name}?`,
    spoken: `¿Con qué letra empieza la palabra ${object.name}?`,
    prompt: { kind: 'emoji-single', item: object.emoji },
    options: letterOptions(rng, answer, ALPHABET, answer),
  };
};

// --- 30. La vocal escondida --------------------------------------------------

export const genHiddenVowel: RoundGenerator = (rng) => {
  const entry = pick(rng, ONE_VOWEL_WORDS);
  const others = sample(
    rng,
    VOWELS.filter((vowel) => vowel !== entry.vowel),
    3,
  );

  return {
    question: '¿Qué vocal se oye dentro?',
    spoken: `Escucha: ${entry.word}. ¿Qué vocal se oye dentro?`,
    prompt: { kind: 'listen', word: entry.word, emoji: entry.emoji },
    options: buildOptions(rng, [
      textOption(entry.vowel, true),
      ...others.map((vowel) => textOption(vowel, false)),
    ]),
  };
};
