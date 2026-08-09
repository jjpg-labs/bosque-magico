/** Generadores del mundo «El Claro de las Letras». */

import { pick, sample } from '../../random';
import { CRITTERS, RHYME_FAMILIES, VOWELS, VOWEL_WORDS } from '../data';
import { buildOptions, textOption } from './options';
import type { RoundGenerator } from '../types';

/** Marcas diacríticas Unicode, para poder comparar «Á» con «A». */
const COMBINING_MARKS = /[\u0300-\u036f]/g;

// Alfabeto completo salvo la K y la W, que en español solo aparecen en
// extranjerismos y no son iniciales útiles a esta edad. La Ñ, la Q, la X, la
// Y y la Z sí: hacen falta como distractores en cuanto el pool tiene palabras
// como «Queso», «Zapato» o «Yogur».
export const ALPHABET = 'ABCDEFGHIJLMNÑOPQRSTUVXYZ'.split('');

/** Letra inicial en mayúscula y sin tilde: «Árbol» → «A». */
export function initialLetter(word: string): string {
  return word
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .charAt(0)
    .toUpperCase();
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
