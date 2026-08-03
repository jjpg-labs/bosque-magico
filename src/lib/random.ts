/**
 * Utilidades de aleatoriedad.
 *
 * Todo recibe un `rng` inyectable para que los tests puedan fijar una semilla:
 * las preguntas se generan al vuelo y deben ser reproducibles al comprobarlas.
 */

export type Rng = () => number;

export const defaultRng: Rng = Math.random;

/** Generador determinista (mulberry32) — usado en tests. */
export function seededRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Entero aleatorio en [min, max], ambos incluidos. */
export function randomInt(rng: Rng, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

export function pick<T>(rng: Rng, items: readonly T[]): T {
  if (items.length === 0) throw new Error('pick() recibió una lista vacía');
  return items[randomInt(rng, 0, items.length - 1)];
}

/** Copia barajada (Fisher-Yates). No muta la entrada. */
export function shuffle<T>(rng: Rng, items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomInt(rng, 0, i);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** `count` elementos distintos, elegidos al azar. */
export function sample<T>(rng: Rng, items: readonly T[], count: number): T[] {
  return shuffle(rng, items).slice(0, count);
}

/**
 * Distractores numéricos cercanos a la respuesta correcta.
 * Se mantienen dentro de [min, max] para no ofrecer opciones absurdas.
 */
export function numericDistractors(
  rng: Rng,
  answer: number,
  count: number,
  min = 0,
  max = 10,
): number[] {
  const candidates = new Set<number>();
  for (let delta = 1; delta <= 4 && candidates.size < count * 3; delta++) {
    if (answer - delta >= min) candidates.add(answer - delta);
    if (answer + delta <= max) candidates.add(answer + delta);
  }
  return sample(rng, [...candidates], count);
}
