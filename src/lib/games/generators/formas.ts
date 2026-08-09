/** Generadores del mundo «La Montaña de las Formas». */

import { pick, randomInt, sample } from '../../random';
import type { Rng } from '../../random';
import {
  COLORS,
  COLOR_OBJECTS,
  CONTAINERS,
  GEOMETRIC_EMOJI,
  SCENE_ITEMS,
  ROLLING_OBJECTS,
  SHAPES,
  SHAPE_COLOR_NAMES,
  SHAPE_OBJECTS,
  SHAPE_SIDES,
} from '../data';
import { distinctDistractors } from './factories';
import { buildOptions, textOption, distractorCount } from './options';
import type { Option, RoundGenerator, ScenePosition, ShapeName } from '../types';
import type { OptionSeed } from './options';

function shapeOption(shape: ShapeName, correct: boolean): OptionSeed {
  return { label: shape, display: { kind: 'shape', shape }, correct };
}

/** Figuras geométricas distintas, una de ellas la correcta. Cuatro, o más si el nivel ha subido. */
export function shapeOptions(rng: Rng, answer: ShapeName, tier = 0): Option[] {
  const others = sample(rng, SHAPES.filter((s) => s !== answer), distractorCount(tier));
  return buildOptions(rng, [
    shapeOption(answer, true),
    ...others.map((s) => shapeOption(s, false)),
  ]);
}

// --- 5. Formas geométricas ---------------------------------------------------

/** Se ve el nombre y hay que tocar la figura. */
const genShapeByName: RoundGenerator = (rng, tier = 0) => {
  const answer = pick(rng, SHAPES);

  return {
    question: `Toca el ${answer}`,
    spoken: `Busca el ${answer} y tócalo.`,
    prompt: { kind: 'none' },
    options: shapeOptions(rng, answer, tier),
  };
};

/**
 * Se ve la figura y hay que decir cómo se llama. Estrena el prompt `shape`,
 * que estaba implementado en `PromptView` desde el principio sin que ningún
 * generador lo usara.
 */
const genShapeNaming: RoundGenerator = (rng, tier = 0) => {
  const answer = pick(rng, SHAPES);
  const others = sample(rng, SHAPES.filter((s) => s !== answer), distractorCount(tier));

  return {
    question: '¿Cómo se llama esta figura?',
    spoken: 'Mira la figura. ¿Cómo se llama?',
    prompt: { kind: 'shape', shape: answer },
    options: buildOptions(rng, [
      textOption(answer, true),
      ...others.map((s) => textOption(s, false)),
    ]),
  };
};

// Reconocer la figura y saber nombrarla son dos cosas distintas, y alternarlas
// multiplica además los ejercicios posibles de una prueba que solo tenía seis.
export const genShapes: RoundGenerator = (rng, tier) =>
  rng() < 0.5 ? genShapeByName(rng, tier) : genShapeNaming(rng, tier);

// --- 53. ¿Cuántos lados tiene? -------------------------------------------------

export const genShapeSides: RoundGenerator = (rng, tier = 0) => {
  const entry = pick(rng, SHAPE_SIDES);
  const askCount = rng() < 0.5;

  if (askCount) {
    const others = distinctDistractors(
      rng,
      [2, 3, 4, 5, 6, 7, 8],
      (n) => String(n),
      String(entry.sides),
      distractorCount(tier),
    );
    return {
      question: '¿Cuántos lados tiene?',
      spoken: 'Cuenta los lados de la figura. ¿Cuántos son?',
      prompt: { kind: 'shape', shape: entry.shape },
      options: buildOptions(rng, [
        textOption(String(entry.sides), true),
        ...others.map((n) => textOption(String(n), false)),
      ]),
    };
  }

  // Al revés: se dice el número de lados y hay que encontrar la figura. Los
  // distractores tienen que tener otro número de lados, o habría dos buenas
  // (el cuadrado, el rombo y el rectángulo tienen cuatro los tres).
  const others = distinctDistractors(
    rng,
    SHAPE_SIDES,
    (s) => String(s.sides),
    String(entry.sides),
    distractorCount(tier),
  );
  return {
    question: `¿Qué figura tiene ${entry.sides} lados?`,
    spoken: `Busca la figura que tiene ${entry.sides} lados.`,
    prompt: { kind: 'none' },
    options: buildOptions(rng, [
      { label: entry.shape, display: { kind: 'shape', shape: entry.shape }, correct: true },
      ...others.map((s) => ({
        label: s.shape,
        display: { kind: 'shape' as const, shape: s.shape },
        correct: false,
      })),
    ]),
  };
};

// --- 54. Formas de colores ------------------------------------------------------

export const genColorShapes: RoundGenerator = (rng) => {
  const shape = pick(rng, SHAPES);
  const color = pick(rng, SHAPE_COLOR_NAMES);
  // Los distractores cambian la forma o el color, nunca los dos a la vez: así
  // hay que fijarse en las dos cosas y no basta con mirar una.
  const otherShapes = sample(rng, SHAPES.filter((s) => s !== shape), 2);
  const otherColor = pick(rng, SHAPE_COLOR_NAMES.filter((c) => c !== color));

  return {
    question: `Toca el ${shape} ${color}`,
    spoken: `Busca el ${shape} de color ${color} y tócalo.`,
    prompt: { kind: 'none' },
    options: buildOptions(rng, [
      { label: `${shape} ${color}`, display: { kind: 'shape', shape, color }, correct: true },
      {
        label: `${shape} ${otherColor}`,
        display: { kind: 'shape', shape, color: otherColor },
        correct: false,
      },
      ...otherShapes.map((s) => ({
        label: `${s} ${color}`,
        display: { kind: 'shape' as const, shape: s, color },
        correct: false,
      })),
    ]),
  };
};

// --- 55. El patrón de las formas ---------------------------------------------------

export const genShapePattern: RoundGenerator = (rng, tier = 0) => {
  const motifLength = pick(rng, [2, 2, 3]);
  const motif = sample(rng, GEOMETRIC_EMOJI, motifLength);
  const extra = randomInt(rng, 0, motifLength - 1);
  const visibleLength = motifLength * 2 + extra;
  const visible = Array.from({ length: visibleLength }, (_, i) => motif[i % motif.length]);
  const answer = motif[visibleLength % motif.length];
  const others = distinctDistractors(rng, GEOMETRIC_EMOJI, (e) => e, answer, distractorCount(tier));

  return {
    question: '¿Qué figura sigue?',
    spoken: 'Mira la fila de figuras. ¿Cuál viene después?',
    prompt: { kind: 'sequence', items: [...visible, null] },
    options: buildOptions(rng, [
      { label: 'esta', display: { kind: 'emoji', emoji: answer }, correct: true },
      ...others.map((e) => ({
        label: 'esta',
        display: { kind: 'emoji' as const, emoji: e },
        correct: false,
      })),
    ]),
  };
};

// --- 56. Cuerpos que ruedan ----------------------------------------------------------

export const genRolling: RoundGenerator = (rng, tier = 0) => {
  const askRolls = rng() < 0.5;
  const answer = pick(rng, ROLLING_OBJECTS.filter((o) => o.rolls === askRolls));
  const others = distinctDistractors(
    rng,
    ROLLING_OBJECTS.filter((o) => o.rolls !== askRolls),
    (o) => o.emoji,
    answer.emoji,
    distractorCount(tier),
  );

  return {
    question: askRolls ? '¿Cuál RUEDA?' : '¿Cuál NO rueda?',
    spoken: askRolls
      ? 'Toca la cosa que rueda cuando la empujas.'
      : 'Toca la cosa que no rueda cuando la empujas.',
    prompt: { kind: 'none' },
    options: buildOptions(rng, [
      { label: answer.name, display: { kind: 'emoji', emoji: answer.emoji }, correct: true },
      ...others.map((o) => ({
        label: o.name,
        display: { kind: 'emoji' as const, emoji: o.emoji },
        correct: false,
      })),
    ]),
  };
};

// --- 12. Empareja las formas -------------------------------------------------

export const genShapeMatch: RoundGenerator = (rng, tier = 0) => {
  const object = pick(rng, SHAPE_OBJECTS);

  return {
    question: `¿Qué forma tiene ${object.name}?`,
    spoken: `Mira ${object.name}. ¿Qué forma geométrica tiene?`,
    prompt: { kind: 'emoji-single', item: object.emoji },
    options: shapeOptions(rng, object.shape, tier),
  };
};

// --- 14. Colores del bosque --------------------------------------------------

/** Se dice el color y hay que tocarlo. */
const genColorByName: RoundGenerator = (rng, tier = 0) => {
  const answer = pick(rng, COLORS);
  const others = sample(
    rng,
    COLORS.filter((c) => c.name !== answer.name),
    distractorCount(tier),
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

/** Se ve un objeto y hay que decir de qué color es. */
const genObjectColor: RoundGenerator = (rng, tier = 0) => {
  const object = pick(rng, COLOR_OBJECTS);
  const answer = COLORS.find((c) => c.name === object.color)!;
  const others = distinctDistractors(rng, COLORS, (c) => c.name, answer.name, distractorCount(tier));

  return {
    question: `¿De qué color es ${object.name}?`,
    spoken: `Mira ${object.name}. ¿De qué color es?`,
    prompt: { kind: 'emoji-single', item: object.emoji },
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

// Nombrar el color de algo es el paso siguiente a reconocerlo suelto, y saca
// la prueba de los nueve ejercicios que tenía.
export const genColors: RoundGenerator = (rng, tier) =>
  rng() < 0.5 ? genColorByName(rng, tier) : genObjectColor(rng, tier);

// --- 48-51. Orientación espacial ------------------------------------------------

/**
 * Las cuatro pruebas de orientación comparten forma: se dibuja el objeto
 * colocado en algún sitio y se elige la palabra que lo describe. Cambia el
 * par (o el trío) de posiciones que se enfrentan, y nada más.
 *
 * Las opciones son las palabras y no dibujos: lo que se aprende aquí es el
 * vocabulario —dentro, fuera, encima, debajo—, no reconocer la escena.
 */
/** Cómo se dice cada posición en la opción: «medio» a secas no se entiende. */
const POSITION_LABELS: Record<ScenePosition, string> = {
  dentro: 'dentro',
  fuera: 'fuera',
  encima: 'encima',
  debajo: 'debajo',
  izquierda: 'izquierda',
  derecha: 'derecha',
  arriba: 'arriba',
  medio: 'en medio',
  abajo: 'abajo',
};

export { POSITION_LABELS };

function makeScenePrueba(
  positions: readonly ScenePosition[],
  texts: { question: string; spoken: string },
): RoundGenerator {
  return (rng) => {
    const container = pick(rng, CONTAINERS);
    const item = pick(rng, SCENE_ITEMS);
    const answer = pick(rng, positions);

    return {
      question: texts.question,
      spoken: texts.spoken,
      prompt: { kind: 'scene', container, item, position: answer },
      options: buildOptions(
        rng,
        positions.map((position) => textOption(POSITION_LABELS[position], position === answer)),
      ),
    };
  };
}

export const genInsideOutside = makeScenePrueba(['dentro', 'fuera'], {
  question: '¿Está dentro o fuera?',
  spoken: 'Mira dónde está. ¿Está dentro o está fuera?',
});

export const genAboveBelow = makeScenePrueba(['encima', 'debajo'], {
  question: '¿Está encima o debajo?',
  spoken: 'Mira dónde está. ¿Está encima o está debajo?',
});

export const genLeftRight = makeScenePrueba(['izquierda', 'derecha'], {
  question: '¿Está a la izquierda o a la derecha?',
  spoken: 'Mira dónde está. ¿Está a la izquierda o a la derecha?',
});

export const genThreeFloors = makeScenePrueba(['arriba', 'medio', 'abajo'], {
  question: '¿En qué piso está?',
  spoken: 'Mira la torre de tres pisos. ¿En qué piso está?',
});
