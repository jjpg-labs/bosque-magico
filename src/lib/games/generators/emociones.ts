/** Generadores del mundo «La Plaza de las Emociones». */

import { pick } from '../../random';
import type { Rng } from '../../random';
import {
  EMOTIONS,
  EMOTION_SITUATIONS,
  INSTRUMENTS,
  KINDNESS,
  MAGIC_WORDS,
  MAGIC_WORD_LIST,
  emotion,
} from '../data';
import type { Emotion } from '../data';
import { distinctDistractors, emojiToName } from './factories';
import { buildOptions, textOption, distractorCount } from './options';
import type { Option, RoundGenerator } from '../types';

/**
 * Emociones que sirven de distractor para una dada: ni ella misma, ni ninguna
 * que un peque pudiera defender igual de bien mirando la misma cara.
 */
function otherEmotions(rng: Rng, answer: Emotion, count: number): Emotion[] {
  const banned = [answer.name, ...(answer.conflicts ?? [])];
  return distinctDistractors(rng, EMOTIONS, (e) => e.name, banned, count);
}

// --- 16. ¿Cómo se siente? ----------------------------------------------------

export const genEmotion: RoundGenerator = (rng, tier = 0) => {
  const answer = pick(rng, EMOTIONS);

  return {
    question: '¿Cómo se siente?',
    spoken: 'Mira la cara. ¿Cómo se siente?',
    prompt: { kind: 'emoji-single', item: answer.emoji },
    options: buildOptions(rng, [
      textOption(answer.name, true),
      ...otherEmotions(rng, answer, distractorCount(tier)).map((e) => textOption(e.name, false)),
    ]),
  };
};

// --- 92. ¿Cómo se siente ahora? ------------------------------------------------

/**
 * Aquí no se ve la cara: se escucha lo que ha pasado y hay que deducirla. Es
 * el paso siguiente a reconocer la emoción en un dibujo.
 */
export const genEmotionSituation: RoundGenerator = (rng, tier = 0) => {
  const situation = pick(rng, EMOTION_SITUATIONS);
  const answer = emotion(situation.feels);

  const emotionOption = (item: Emotion, correct: boolean): Omit<Option, 'id'> => ({
    label: item.name,
    display: { kind: 'emoji', emoji: item.emoji },
    correct,
  });

  return {
    question: `${situation.text}. ¿Cómo se siente?`,
    spoken: `${situation.text}. ¿Cómo se siente?`,
    prompt: { kind: 'none' },
    options: buildOptions(rng, [
      emotionOption(answer, true),
      ...otherEmotions(rng, answer, distractorCount(tier)).map((e) => emotionOption(e, false)),
    ]),
  };
};

// --- 93. ¿Cómo ayudo? ------------------------------------------------------------

export const genKindness: RoundGenerator = (rng) => {
  const scene = pick(rng, KINDNESS);

  return {
    question: `${scene.text}. ¿Qué haces?`,
    spoken: `${scene.text}. ¿Qué es lo que haces?`,
    prompt: { kind: 'none' },
    options: buildOptions(rng, [
      { label: scene.good.name, display: { kind: 'emoji', emoji: scene.good.emoji }, correct: true },
      ...scene.others.map((item) => ({
        label: item.name,
        display: { kind: 'emoji' as const, emoji: item.emoji },
        correct: false,
      })),
    ]),
  };
};

// --- 94. Los instrumentos --------------------------------------------------------

const genInstrumentBySight = emojiToName(INSTRUMENTS, {
  question: () => '¿Qué instrumento es?',
  spoken: () => 'Mira el dibujo. ¿Qué instrumento es este?',
});

/** Escuchando la onomatopeya, como en «¿Quién Hace Este Sonido?». */
const genInstrumentBySound: RoundGenerator = (rng, tier = 0) => {
  const answer = pick(rng, INSTRUMENTS);
  const others = distinctDistractors(rng, INSTRUMENTS, (i) => i.emoji, answer.emoji, distractorCount(tier));

  return {
    question: '¿Qué instrumento suena así?',
    spoken: `Escucha: ${answer.sound}. ¿Qué instrumento suena así?`,
    prompt: { kind: 'none' },
    options: buildOptions(rng, [
      { label: answer.name, display: { kind: 'emoji', emoji: answer.emoji }, correct: true },
      ...others.map((i) => ({
        label: i.name,
        display: { kind: 'emoji' as const, emoji: i.emoji },
        correct: false,
      })),
    ]),
  };
};

export const genInstruments: RoundGenerator = (rng, tier) =>
  rng() < 0.5 ? genInstrumentBySight(rng, tier) : genInstrumentBySound(rng, tier);

// --- 95. El ritmo de las palmas ----------------------------------------------------

/** Palma fuerte y palma floja: el motivo se repite y hay que seguirlo. */
const CLAPS = ['👏', '🤲'] as const;

export const genClapRhythm: RoundGenerator = (rng) => {
  // Motivos de dos y de tres, como en «Patrones Divertidos», pero con solo dos
  // símbolos: aquí lo que se practica es el ritmo, no distinguir dibujos.
  const motif = pick(rng, [
    ['👏', '🤲'],
    ['🤲', '👏'],
    ['👏', '👏', '🤲'],
    ['👏', '🤲', '🤲'],
    ['🤲', '👏', '👏'],
    ['🤲', '🤲', '👏'],
    ['👏', '👏', '🤲', '🤲'],
    ['🤲', '🤲', '👏', '👏'],
  ]);
  const visibleLength = motif.length * 2 + (rng() < 0.5 ? 0 : 1);
  const visible = Array.from({ length: visibleLength }, (_, i) => motif[i % motif.length]);
  const answer = motif[visibleLength % motif.length];
  const other = CLAPS.find((clap) => clap !== answer)!;

  return {
    question: '¿Qué palma viene ahora?',
    spoken: 'Sigue el ritmo de las palmas. ¿Cuál viene ahora?',
    prompt: { kind: 'sequence', items: [...visible, null] },
    options: buildOptions(rng, [
      { label: 'palma fuerte', display: { kind: 'emoji', emoji: answer }, correct: true },
      { label: 'palma floja', display: { kind: 'emoji', emoji: other }, correct: false },
    ]),
  };
};

// --- 96. Las palabras mágicas -----------------------------------------------------

export const genMagicWords: RoundGenerator = (rng, tier = 0) => {
  const scene = pick(rng, MAGIC_WORDS);
  const others = distinctDistractors(rng, MAGIC_WORD_LIST, (word) => word, scene.word, distractorCount(tier));

  return {
    question: `${scene.text}. ¿Qué dices?`,
    spoken: `${scene.text}. ¿Qué palabra mágica dices?`,
    prompt: { kind: 'none' },
    options: buildOptions(rng, [
      textOption(scene.word, true),
      ...others.map((word) => textOption(word, false)),
    ]),
  };
};
