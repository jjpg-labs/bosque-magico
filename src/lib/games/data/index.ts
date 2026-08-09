/**
 * Barril del contenido del juego.
 *
 * Reexporta exactamente los mismos nombres que tenía el antiguo `data.ts`, así
 * que `import { CRITTERS } from '../lib/games/data'` sigue funcionando igual.
 *
 * Cada mundo tiene su fichero: un lote de contenido nuevo crea (o amplía) un
 * `data/<mundo>.ts` propio y añade **una línea** aquí. Es el único punto de
 * conflicto entre agentes trabajando en paralelo, y un conflicto de una línea
 * en un `export *` se resuelve solo.
 */

export * from './comun';
export * from './letras';
export * from './formas';
export * from './logica';
export * from './medidas';
export * from './natura';
export * from './emociones';
