/**
 * Piezas de bajo nivel para montar las opciones de una ronda.
 *
 * Las usan tanto las fábricas (`factories.ts`) como los generadores escritos a
 * mano de cada mundo.
 */

import { numericDistractors, shuffle } from '../../random';
import type { Rng } from '../../random';
import type { Option } from '../types';

export type OptionSeed = Omit<Option, 'id'>;

/** Baraja las opciones y les asigna ids estables dentro de la ronda. */
export function buildOptions(rng: Rng, seeds: OptionSeed[]): Option[] {
  return shuffle(rng, seeds).map((seed, index) => ({ ...seed, id: `opt-${index}` }));
}

export function textOption(text: string, correct: boolean): OptionSeed {
  return { label: text, display: { kind: 'text', text }, correct };
}

/** Cuatro números: la respuesta y tres vecinos dentro de [0, max]. */
export function numberOptions(rng: Rng, answer: number, max = 10): Option[] {
  const distractors = numericDistractors(rng, answer, 3, 0, max);
  return buildOptions(rng, [
    textOption(String(answer), true),
    ...distractors.map((n) => textOption(String(n), false)),
  ]);
}

/**
 * Cuántos distractores tocan en esta ronda: tres al principio, cuatro y cinco
 * según sube el nivel (o sea, de cuatro opciones a seis).
 *
 * Es el equivalente de lo que hacen las fábricas solas, para los generadores
 * escritos a mano. Úsalo en vez de un 3 fijo siempre que la prueba tenga
 * cuatro opciones; en las de dos o tres opciones no, que ahí el número es
 * parte del enunciado.
 *
 * No hace falta comprobar si el pool da de sí: `distinctDistractors` y
 * `sample` devuelven como mucho lo que haya.
 */
export function distractorCount(tier = 0, base = 3): number {
  return base + Math.min(Math.max(tier, 0), 2);
}
