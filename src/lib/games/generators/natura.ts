/** Generadores del mundo «El Bosque de los Animales». */

import { pick, sample } from '../../random';
import {
  ANIMAL_FOOD,
  ANIMAL_LEGS,
  ANIMAL_MOVES,
  ANIMAL_SOUNDS,
  ANIMAL_ZONES,
  HABITATS,
  LEG_COUNTS,
  LIFE_CYCLES,
  NOT_PLANT_NEEDS,
  PLANTS,
  PLANT_KINDS,
  PLANT_NEEDS,
  RECYCLING,
  WEATHER,
} from '../data';
import { distinctDistractors, emojiToName, orderedSequence, pairMatch } from './factories';
import { buildOptions, textOption, distractorCount } from './options';
import type { RoundGenerator } from '../types';

// --- 15. ¿Quién hace este sonido? --------------------------------------------

export const genAnimalSound: RoundGenerator = (rng, tier = 0) => {
  const answer = pick(rng, ANIMAL_SOUNDS);
  const others = sample(
    rng,
    ANIMAL_SOUNDS.filter((a) => a.name !== answer.name),
    distractorCount(tier),
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

// --- 74. ¿Dónde vive? ---------------------------------------------------------

export const genHabitats: RoundGenerator = pairMatch(HABITATS, {
  question: (pair) => `¿Dónde vive ${pair.from.name}?`,
  spoken: (pair) => `Mira el animal. ¿Dónde vive ${pair.from.name}?`,
});

// --- 75. ¿Cuántas patas tiene? ------------------------------------------------

/**
 * Las cuatro respuestas posibles salen siempre, en vez de sacar distractores
 * numéricos cercanos: con `numericDistractors` aparecerían tres o siete patas,
 * que no las tiene ningún animal y despistan en vez de enseñar.
 */
export const genAnimalLegs: RoundGenerator = (rng) => {
  const animal = pick(rng, ANIMAL_LEGS);
  const others = LEG_COUNTS.filter((count) => count !== animal.legs);

  return {
    question: `¿Cuántas patas tiene ${animal.name}?`,
    spoken: `Cuenta las patas. ¿Cuántas patas tiene ${animal.name}?`,
    prompt: { kind: 'emoji-single', item: animal.emoji },
    options: buildOptions(rng, [
      textOption(String(animal.legs), true),
      ...others.map((count) => textOption(String(count), false)),
    ]),
  };
};

// --- 76. ¿Qué come? -----------------------------------------------------------

export const genAnimalFood: RoundGenerator = pairMatch(ANIMAL_FOOD, {
  question: (pair) => `¿Qué come ${pair.from.name}?`,
  spoken: (pair) => `Mira el animal. ¿Qué come ${pair.from.name}?`,
});

// --- 77. Granja, selva o mar --------------------------------------------------

export const genAnimalZones: RoundGenerator = emojiToName(ANIMAL_ZONES, {
  question: () => '¿De dónde es este animal?',
  spoken: () => 'Mira el animal. ¿De dónde es?',
});

// --- 78. ¿Vuela, nada o anda? -------------------------------------------------

/** Tres opciones, que son las tres del título: siempre salen las tres. */
export const genAnimalMoves: RoundGenerator = emojiToName(
  ANIMAL_MOVES,
  {
    question: () => '¿Cómo se mueve?',
    spoken: () => 'Mira el animal. ¿Vuela, nada o anda?',
  },
  { optionCount: 3 },
);

// --- 79. Del huevo a la mariposa ----------------------------------------------

export const genLifeCycles: RoundGenerator = orderedSequence(
  LIFE_CYCLES,
  {
    question: () => '¿Qué falta?',
    spoken: () => 'Mira cómo va creciendo. ¿Qué falta en el hueco?',
  },
  { windowLen: 3 },
);

// --- 80. ¿Qué tiempo hace? ----------------------------------------------------

export const genWeather: RoundGenerator = emojiToName(WEATHER, {
  question: () => '¿Qué tiempo hace?',
  spoken: () => 'Mira el cielo. ¿Qué tiempo hace hoy?',
});

// --- 81. Flores, hojas y frutos -----------------------------------------------

export const genPlantKinds: RoundGenerator = emojiToName(PLANT_KINDS, {
  question: () => '¿Qué es?',
  spoken: () => 'Mira bien. ¿Es una flor, una hoja o un fruto?',
});

// --- 82. ¿Qué necesita una planta? --------------------------------------------

/**
 * El agua y el sol son las dos respuestas correctas, así que la que no sale
 * como respuesta **tampoco sale de distractor**: los tres distractores vienen
 * siempre de las cosas que no hacen crecer nada.
 */
export const genPlantNeeds: RoundGenerator = (rng, tier = 0) => {
  const plant = pick(rng, PLANTS);
  const need = pick(rng, PLANT_NEEDS);
  const others = distinctDistractors(
    rng,
    NOT_PLANT_NEEDS,
    (item) => item.emoji,
    need.emoji,
    distractorCount(tier),
  );

  return {
    question: `¿Qué necesita ${plant.name} para crecer?`,
    spoken: `¿Qué necesita ${plant.name} para crecer?`,
    prompt: { kind: 'emoji-single', item: plant.emoji },
    options: buildOptions(rng, [
      { label: need.name, display: { kind: 'emoji', emoji: need.emoji }, correct: true },
      ...others.map((item) => ({
        label: item.name,
        display: { kind: 'emoji' as const, emoji: item.emoji },
        correct: false,
      })),
    ]),
  };
};

// --- 83. Cuidamos el bosque ---------------------------------------------------

/** Tres cubos y siempre los tres: es lo que hay en casa de verdad. */
export const genRecycling: RoundGenerator = pairMatch(
  RECYCLING,
  {
    question: (pair) => `¿En qué cubo va ${pair.from.name}?`,
    spoken: (pair) => `Vamos a reciclar. ¿En qué cubo va ${pair.from.name}?`,
  },
  { optionCount: 3 },
);
