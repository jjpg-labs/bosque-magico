/**
 * Fábricas de generadores.
 *
 * ⚠️ **API congelada.** Varios lotes de contenido se escriben en paralelo
 * encima de estas firmas. Si un mundo necesita una fábrica nueva, la pone en
 * su propio `generators/<mundo>.ts`; se promociona aquí más tarde, aparte.
 */

import { pick } from '../../random';
import type { RoundGenerator } from '../types';

/**
 * Un generador que, en cada ronda, plantea el ejercicio de otra prueba.
 *
 * Antes el pool era una lista escrita a mano con los diecisiete generadores
 * del momento. Con cien pruebas serían noventa y nueve entradas que nadie va a
 * acordarse de actualizar: el desafío «final» acabaría remezclando solo las
 * pruebas viejas. Recibiendo el pool por parámetro, el catálogo se lo pasa
 * derivado de sí mismo y no hay nada que mantener sincronizado.
 *
 * El `tier` se propaga al generador elegido: sin eso, la prueba de remezcla
 * sería la única que nunca sube de dificultad por muchas veces que se juegue.
 *
 * ```ts
 * // en catalog/especial.ts, con el pool derivado de las demás pruebas
 * generate: makeMixGenerator(pool.flatMap((game) => game.generate ?? [])),
 * ```
 */
export function makeMixGenerator(pool: readonly RoundGenerator[]): RoundGenerator {
  if (pool.length === 0) {
    throw new Error('makeMixGenerator necesita al menos un generador en el pool');
  }
  return (rng, tier = 0) => pick(rng, pool)(rng, tier);
}
