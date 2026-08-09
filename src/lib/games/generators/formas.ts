/** Generadores del mundo «La Montaña de las Formas». */

import { pick, sample } from '../../random';
import type { Rng } from '../../random';
import { COLORS, SHAPES, SHAPE_OBJECTS } from '../data';
import { buildOptions } from './options';
import type { Option, RoundGenerator, ShapeName } from '../types';
import type { OptionSeed } from './options';

function shapeOption(shape: ShapeName, correct: boolean): OptionSeed {
  return { label: shape, display: { kind: 'shape', shape }, correct };
}

/** Cuatro figuras geométricas distintas, una de ellas la correcta. */
export function shapeOptions(rng: Rng, answer: ShapeName): Option[] {
  const others = sample(rng, SHAPES.filter((s) => s !== answer), 3);
  return buildOptions(rng, [
    shapeOption(answer, true),
    ...others.map((s) => shapeOption(s, false)),
  ]);
}

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

// --- 14. Colores del bosque --------------------------------------------------

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
