/** Contenido del mundo «La Montaña de las Formas». */

import type { ShapeName } from '../types';

export const SHAPES: readonly ShapeName[] = [
  'círculo',
  'cuadrado',
  'triángulo',
  'estrella',
  'corazón',
  'rombo',
  'rectángulo',
  'óvalo',
  'pentágono',
  'hexágono',
];

/**
 * Cuántos lados tiene cada figura.
 *
 * Ni la estrella ni el corazón están: los picos de la estrella no son lados
 * y el corazón no tiene ninguno recto, así que preguntarlo tendría más de
 * una respuesta defendible.
 */
export const SHAPE_SIDES: ReadonlyArray<{ shape: ShapeName; sides: number }> = [
  { shape: 'triángulo', sides: 3 },
  { shape: 'cuadrado', sides: 4 },
  { shape: 'rectángulo', sides: 4 },
  { shape: 'rombo', sides: 4 },
  { shape: 'pentágono', sides: 5 },
  { shape: 'hexágono', sides: 6 },
];

export { SHAPE_COLOR_NAMES } from '../../shape-colors';

/**
 * Figuras de colores en emoji, para las filas de patrones. Todas son de
 * Unicode 12.0 o anterior y se distinguen bien a 32 px.
 */
export const GEOMETRIC_EMOJI: readonly string[] = [
  '🔴',
  '🟠',
  '🟡',
  '🟢',
  '🔵',
  '🟣',
  '🟥',
  '🟧',
  '🟨',
  '🟩',
  '🟦',
  '🟪',
];

/**
 * Cosas que ruedan y cosas que no. Las que no ruedan son planas o tienen
 * esquinas; nada de casos discutibles como una lata tumbada.
 */
export const ROLLING_OBJECTS: ReadonlyArray<{ emoji: string; name: string; rolls: boolean }> = [
  { emoji: '⚽', name: 'la pelota', rolls: true },
  { emoji: '🏀', name: 'el balón de baloncesto', rolls: true },
  { emoji: '🍊', name: 'la naranja', rolls: true },
  { emoji: '🌍', name: 'la bola del mundo', rolls: true },
  { emoji: '🥎', name: 'la pelota blanda', rolls: true },
  { emoji: '🥥', name: 'el coco', rolls: true },
  { emoji: '📦', name: 'la caja', rolls: false },
  { emoji: '📕', name: 'el libro', rolls: false },
  { emoji: '🧱', name: 'el ladrillo', rolls: false },
  { emoji: '🪑', name: 'la silla', rolls: false },
  { emoji: '🎁', name: 'el regalo', rolls: false },
  { emoji: '🚪', name: 'la puerta', rolls: false },
];

/** Objetos cotidianos con una forma geométrica inequívoca. */
export const SHAPE_OBJECTS: ReadonlyArray<{ emoji: string; name: string; shape: ShapeName }> = [
  { emoji: '⚽', name: 'la pelota', shape: 'círculo' },
  { emoji: '🍪', name: 'la galleta', shape: 'círculo' },
  { emoji: '🍕', name: 'la porción de pizza', shape: 'triángulo' },
  { emoji: '🪟', name: 'la ventana', shape: 'cuadrado' },
  { emoji: '📦', name: 'la caja', shape: 'cuadrado' },
  { emoji: '⭐', name: 'la estrella', shape: 'estrella' },
  { emoji: '❤️', name: 'el corazón', shape: 'corazón' },
  { emoji: '🔶', name: 'el diamante', shape: 'rombo' },
  { emoji: '🍩', name: 'la rosquilla', shape: 'círculo' },
  { emoji: '🎲', name: 'el dado', shape: 'cuadrado' },
  { emoji: '🍫', name: 'la chocolatina', shape: 'cuadrado' },
  { emoji: '⛰️', name: 'la montaña', shape: 'triángulo' },
  { emoji: '🎖️', name: 'la medalla', shape: 'estrella' },
  { emoji: '🪁', name: 'la cometa', shape: 'rombo' },
];

/** Colores básicos, representados como círculos de color (emoji nativo). */
export const COLORS: ReadonlyArray<{ emoji: string; name: string }> = [
  { emoji: '🔴', name: 'rojo' },
  { emoji: '🟠', name: 'naranja' },
  { emoji: '🟡', name: 'amarillo' },
  { emoji: '🟢', name: 'verde' },
  { emoji: '🔵', name: 'azul' },
  { emoji: '🟣', name: 'morado' },
  { emoji: '🟤', name: 'marrón' },
  { emoji: '⚪', name: 'blanco' },
  { emoji: '⚫', name: 'negro' },
];

/**
 * Objetos de un solo color indiscutible, para preguntar «¿de qué color es?».
 *
 * Aquí es donde es fácil colar una ambigüedad: la manzana 🍎 es roja **y**
 * verde, el maíz 🌽 amarillo **y** verde. Ninguno de los dos está.
 */
export const COLOR_OBJECTS: ReadonlyArray<{ emoji: string; name: string; color: string }> = [
  { emoji: '🍅', name: 'el tomate', color: 'rojo' },
  { emoji: '🍓', name: 'la fresa', color: 'rojo' },
  { emoji: '🥕', name: 'la zanahoria', color: 'naranja' },
  { emoji: '🍊', name: 'la naranja', color: 'naranja' },
  { emoji: '🍌', name: 'el plátano', color: 'amarillo' },
  { emoji: '🌻', name: 'el girasol', color: 'amarillo' },
  { emoji: '🥦', name: 'el brócoli', color: 'verde' },
  { emoji: '🐸', name: 'la rana', color: 'verde' },
  { emoji: '🌊', name: 'el mar', color: 'azul' },
  { emoji: '👖', name: 'los vaqueros', color: 'azul' },
  { emoji: '🍇', name: 'las uvas', color: 'morado' },
  { emoji: '🍆', name: 'la berenjena', color: 'morado' },
  { emoji: '🐻', name: 'el oso', color: 'marrón' },
  { emoji: '🍫', name: 'el chocolate', color: 'marrón' },
  { emoji: '⛄', name: 'el muñeco de nieve', color: 'blanco' },
  { emoji: '🥛', name: 'la leche', color: 'blanco' },
  { emoji: '🎩', name: 'la chistera', color: 'negro' },
];
