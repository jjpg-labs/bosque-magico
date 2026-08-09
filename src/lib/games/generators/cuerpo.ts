/** Generadores del mundo «La Casa de los Peques». */

import { pick } from '../../random';
import {
  BODY_COUNTS,
  BODY_PARTS,
  CARE_ROUTINES,
  CLOTHES_WEATHER,
  FOOD_ORIGIN,
  FRUIT_VEG,
  HOUSE_USES,
  SENSES,
  SENSE_VERBS,
} from '../data';
import {
  categoryMember,
  distinctDistractors,
  emojiToName,
  numberQuestion,
  orderedSequence,
  pairMatch,
} from './factories';
import { buildOptions, distractorCount } from './options';
import type { RoundGenerator } from '../types';

// --- 84. Las partes del cuerpo ------------------------------------------------

export const genBodyParts: RoundGenerator = emojiToName(BODY_PARTS, {
  question: () => '¿Qué parte del cuerpo es?',
  spoken: () => 'Mira el dibujo. ¿Qué parte del cuerpo es?',
});

// --- 85. Los cinco sentidos ---------------------------------------------------

export const genSenses: RoundGenerator = pairMatch(SENSES, {
  question: (pair) => `¿Con qué ${SENSE_VERBS[pair.to.name] ?? 'notamos'} ${pair.from.name}?`,
  spoken: (pair) => `¿Con qué ${SENSE_VERBS[pair.to.name] ?? 'notamos'} ${pair.from.name}?`,
});

// --- 86. ¿Qué me pongo? -------------------------------------------------------

/**
 * Los distractores salen siempre de **otros** tiempos: si vinieran del mismo,
 * la bufanda y los guantes serían las dos buenas para el mismo día de frío.
 */
export const genClothesWeather: RoundGenerator = (rng, tier = 0) => {
  const weather = pick(rng, CLOTHES_WEATHER);
  const sign = pick(rng, weather.signs);
  const answer = pick(rng, weather.clothes);
  const strangers = CLOTHES_WEATHER.filter((other) => other.name !== weather.name).flatMap(
    (other) => other.clothes,
  );
  const others = distinctDistractors(rng, strangers, (item) => item.emoji, answer.emoji, distractorCount(tier));

  return {
    question: `¿Qué nos ponemos cuando ${weather.name}?`,
    spoken: `Mira el tiempo. ¿Qué nos ponemos cuando ${weather.name}?`,
    prompt: { kind: 'emoji-single', item: sign },
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

// --- 87. Frutas y verduras ----------------------------------------------------

/** Dos opciones: son las dos de la pregunta, no hay una tercera que ofrecer. */
export const genFruitVeg: RoundGenerator = emojiToName(
  FRUIT_VEG,
  {
    question: () => '¿Es una fruta o una verdura?',
    spoken: () => 'Mira bien. ¿Es una fruta o una verdura?',
  },
  { optionCount: 2 },
);

// --- 88. ¿De dónde viene? -----------------------------------------------------

export const genFoodOrigin: RoundGenerator = pairMatch(FOOD_ORIGIN, {
  question: (pair) => `¿De dónde viene ${pair.from.name}?`,
  spoken: (pair) => `¿De dónde viene ${pair.from.name}?`,
});

// --- 89. ¿Para qué lo usamos? -------------------------------------------------

export const genHouseUses: RoundGenerator = categoryMember(HOUSE_USES, {
  question: (choice) => `¿Cuál usamos ${choice.category.name}?`,
  spoken: (choice) => `Busca el que usamos ${choice.category.name}.`,
});

// --- 90. ¿Cuántos tenemos? ----------------------------------------------------

/** `min: 1` para que ningún distractor sea «cero manos». */
export const genBodyCount: RoundGenerator = numberQuestion((rng) => {
  const item = pick(rng, BODY_COUNTS);
  return {
    question: item.question,
    spoken: `Piensa en tu cuerpo. ${item.question}`,
    prompt: { kind: 'emoji-single', item: '🧒' },
    answer: item.answer,
    min: 1,
    max: 5,
  };
});

// --- 91. Paso a paso ----------------------------------------------------------

export const genCareRoutines: RoundGenerator = orderedSequence(
  CARE_ROUTINES,
  {
    question: () => '¿Qué falta?',
    spoken: () => 'Mira los pasos. ¿Cuál falta en el hueco?',
  },
  { windowLen: 3 },
);
