/** Generadores del mundo «El Bosque de los Animales». */

import { pick, sample } from '../../random';
import { ANIMAL_SOUNDS } from '../data';
import { buildOptions } from './options';
import type { RoundGenerator } from '../types';

// --- 15. ¿Quién hace este sonido? --------------------------------------------

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
