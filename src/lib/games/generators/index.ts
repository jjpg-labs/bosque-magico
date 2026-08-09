/**
 * Barril de los generadores de rondas.
 *
 * Reexporta exactamente los mismos nombres que tenía el antiguo
 * `generators.ts`, así que `import { generateRounds } from
 * '../lib/games/generators'` sigue funcionando igual en los componentes y en
 * los tests.
 *
 * Cada prueba genera sus preguntas al vuelo. La versión original tenía las
 * respuestas fijas en el JSX (siempre la abeja, siempre 5 mariquitas), así que
 * bastaban dos partidas para memorizar la posición del botón correcto en vez
 * de resolver el ejercicio.
 *
 * Un lote de contenido nuevo crea su `generators/<mundo>.ts` y añade **una
 * línea** aquí.
 */

export * from './options';
export * from './factories';
export * from './rounds';

export * from './letras';
export * from './numeros';
export * from './cuentas';
export * from './formas';
export * from './logica';
export * from './medidas';
export * from './natura';
export * from './cuerpo';
export * from './oficios';
export * from './emociones';
