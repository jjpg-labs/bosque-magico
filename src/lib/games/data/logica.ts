/** Contenido del mundo «El Laberinto de la Lógica». */

/** Categorías para "El Intruso": el intruso sale de una categoría distinta. */
export const CATEGORIES: ReadonlyArray<{ name: string; items: readonly string[] }> = [
  { name: 'animales', items: ['🐶', '🐱', '🐰', '🐻', '🐸', '🦊'] },
  { name: 'frutas', items: ['🍎', '🍌', '🍇', '🍓', '🍊', '🍐'] },
  { name: 'vehículos', items: ['🚗', '🚌', '🚲', '✈️', '🚂', '🚚'] },
  // Nada de emojis de Unicode 14.0+ (🪻, 🫎...): en Android 10 y anteriores
  // se pintan como una caja vacía.
  { name: 'flores', items: ['🌸', '🌻', '🌷', '🌹', '🌼', '🌺'] },
  { name: 'ropa', items: ['👕', '👖', '🧦', '👗', '🧥', '👟'] },
  { name: 'instrumentos', items: ['🎸', '🥁', '🎺', '🎷', '🎹', '🎻'] },
  { name: 'comida', items: ['🍕', '🍔', '🍟', '🌮', '🍩', '🥐'] },
  { name: 'deportes', items: ['⚽', '🏀', '🎾', '🏈', '⚾', '🏐'] },
];
