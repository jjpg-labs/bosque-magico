/** Generadores del mundo «La Plaza de las Emociones». */

import { pick, sample } from '../../random';
import { EMOTIONS } from '../data';
import { buildOptions, textOption } from './options';
import type { RoundGenerator } from '../types';

// --- 16. ¿Cómo se siente? ----------------------------------------------------

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
