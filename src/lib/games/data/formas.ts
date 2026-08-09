/** Contenido del mundo «La Montaña de las Formas». */

import type { ShapeName } from '../types';

export const SHAPES: readonly ShapeName[] = [
  'círculo',
  'cuadrado',
  'triángulo',
  'estrella',
  'corazón',
  'rombo',
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
