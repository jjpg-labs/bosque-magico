/** Generadores del mundo «El Laberinto de la Lógica». */

import { pick, randomInt, sample } from '../../random';
import {
  ANALOGIES,
  BELONGINGS,
  CATEGORIES,
  CAUSE_EFFECT,
  CLASS_SETS,
  COLOR_GROUPS,
  COLORS,
  COUNTABLES,
} from '../data';
import {
  categoryMember,
  distinctDistractors,
  oddOneOut,
  orderedSequence,
  pairMatch,
} from './factories';
import type { Item } from './factories';
import { buildOptions } from './options';
import type { RoundGenerator } from '../types';

function repeatToLength(motif: string[], length: number): string[] {
  return Array.from({ length }, (_, i) => motif[i % motif.length]);
}

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

// --- 57. Patrón de colores -------------------------------------------------------

export const genColorPattern: RoundGenerator = (rng) => {
  const motifLength = pick(rng, [2, 2, 3]);
  const motif = sample(rng, COLORS, motifLength);
  // Mismo truco que en «Patrones Divertidos»: se enseñan dos ciclos completos
  // más un desplazamiento, para que el hueco no caiga siempre justo al
  // reiniciarse el motivo y la respuesta no sea siempre el primer color.
  const visibleLength = motifLength * 2 + randomInt(rng, 0, motifLength - 1);
  const visible = repeatToLength(
    motif.map((color) => color.emoji),
    visibleLength,
  );
  const answer = motif[visibleLength % motifLength];
  const others = sample(
    rng,
    COLORS.filter((color) => color.name !== answer.name),
    3,
  );

  return {
    question: '¿Qué color sigue?',
    spoken: 'Mira la fila de colores. ¿Cuál sigue?',
    prompt: { kind: 'sequence', items: [...visible, null] },
    options: buildOptions(rng, [
      { label: answer.name, display: { kind: 'emoji', emoji: answer.emoji }, correct: true },
      ...others.map((color) => ({
        label: color.name,
        display: { kind: 'emoji' as const, emoji: color.emoji },
        correct: false,
      })),
    ]),
  };
};

// --- 58. El hueco del medio --------------------------------------------------------

export const genMiddleGap: RoundGenerator = (rng) => {
  const motifLength = pick(rng, [2, 2, 3]);
  const motif = sample(rng, COUNTABLES, motifLength);
  const visibleLength = motifLength * 2 + randomInt(rng, 1, motifLength);
  const row = repeatToLength(motif, visibleLength);
  // El hueco cae por dentro, nunca en el primero ni en el último: si cayera al
  // final sería la misma prueba que «Patrones Divertidos», y al principio no
  // habría nada delante de lo que deducir el motivo.
  const gap = randomInt(rng, 1, visibleLength - 2);
  const answer = row[gap];
  const others = sample(
    rng,
    COUNTABLES.filter((emoji) => emoji !== answer),
    3,
  );

  return {
    question: '¿Qué falta en la fila?',
    spoken: 'Falta un bichito en medio de la fila. ¿Cuál es?',
    prompt: { kind: 'sequence', items: row.map((emoji, i) => (i === gap ? null : emoji)) },
    options: buildOptions(rng, [
      { label: 'este', display: { kind: 'emoji', emoji: answer }, correct: true },
      ...others.map((emoji) => ({
        label: 'este',
        display: { kind: 'emoji' as const, emoji },
        correct: false,
      })),
    ]),
  };
};

// --- 59. ¿Cuál es una fruta? --------------------------------------------------------

export const genClassMember: RoundGenerator = categoryMember(CLASS_SETS, {
  question: (choice) => `¿Cuál es ${choice.category.article} ${choice.category.name}?`,
  spoken: (choice) => `Busca el que es ${choice.category.article} ${choice.category.name}.`,
});

// --- 60. La pareja lógica -------------------------------------------------------------

/** De dónde salen los distractores: todas las respuestas de la tabla. */
const ANALOGY_TARGETS: readonly Item[] = ANALOGIES.flatMap((analogy) => [analogy.b, analogy.d]);

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const genAnalogy: RoundGenerator = (rng) => {
  const analogy = pick(rng, ANALOGIES);
  // El cuarteto se plantea igual en un sentido que en el otro, así que la tabla
  // da el doble de ejercicios sin escribir ni una analogía más.
  const [first, second, third, answer] =
    rng() < 0.5
      ? [analogy.a, analogy.b, analogy.c, analogy.d]
      : [analogy.c, analogy.d, analogy.a, analogy.b];
  const others = distinctDistractors(
    rng,
    ANALOGY_TARGETS,
    (item) => item.emoji,
    [first.emoji, second.emoji, third.emoji, answer.emoji],
    3,
  );

  return {
    question: `${capitalize(first.name)} va con ${second.name}. ¿Y ${third.name}?`,
    spoken: `${capitalize(first.name)} va con ${second.name}. ¿Con qué va ${third.name}?`,
    prompt: { kind: 'sequence', items: [first.emoji, second.emoji, third.emoji, null] },
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

// --- 61. ¿Qué pasa después? -------------------------------------------------------------

export const genCauseEffect: RoundGenerator = orderedSequence(
  CAUSE_EFFECT,
  {
    question: (step) => `¿En qué se convierte ${step.window[0].name}?`,
    spoken: (step) => `Mira el dibujo. ¿En qué se convierte ${step.window[0].name}?`,
  },
  // Dos pasos: se ve la causa y el hueco. Con la ventana de cuatro por defecto
  // se enseñarían pares sueltos que no tienen nada que ver entre sí.
  { windowLen: 2 },
);

// --- 62. El intruso por color -------------------------------------------------------------

export const genColorIntruder: RoundGenerator = oddOneOut(COLOR_GROUPS, {
  question: () => '¿Cuál es de otro color?',
  spoken: () => 'Tres son del mismo color. ¿Cuál es distinto?',
});

// --- 65. ¿De quién es? -------------------------------------------------------------------

export const genBelongings: RoundGenerator = pairMatch(BELONGINGS, {
  question: (pair) => `¿Quién va con ${pair.from.name}?`,
  spoken: (pair) => `Mira el dibujo. ¿Quién va con ${pair.from.name}?`,
});

// --- 64. De pequeño a grande -----------------------------------------------------

/**
 * Cuatro veces el mismo dibujo a cuatro tamaños. Es el mismo dibujo a
 * propósito: si cambiara también el objeto, se podría acertar por otra vía
 * que no fuese comparar tamaños.
 */
const SIZE_STEPS = ['xs', 'sm', 'lg', 'xl'] as const;

export const genSizeOrder: RoundGenerator = (rng) => {
  const emoji = pick(rng, COUNTABLES);
  const askSmallest = rng() < 0.5;
  const winner = askSmallest ? 'xs' : 'xl';

  return {
    question: askSmallest ? '¿Cuál es el MÁS PEQUEÑO?' : '¿Cuál es el MÁS GRANDE?',
    spoken: askSmallest
      ? 'Míralos todos. Toca el más pequeño de los cuatro.'
      : 'Míralos todos. Toca el más grande de los cuatro.',
    prompt: { kind: 'none' },
    options: buildOptions(
      rng,
      SIZE_STEPS.map((scale) => ({
        label: scale === winner ? 'este' : 'otro',
        display: { kind: 'emoji' as const, emoji, scale },
        correct: scale === winner,
      })),
    ),
  };
};
