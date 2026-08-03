import type { ShapeName } from './types';

export interface Critter {
  emoji: string;
  /** Nombre en español, con mayúscula inicial: la letra inicial es la respuesta. */
  name: string;
}

/** Animales cuyo nombre en español empieza por letras bien diferenciadas. */
export const CRITTERS: readonly Critter[] = [
  { emoji: '🐝', name: 'Abeja' },
  { emoji: '🐞', name: 'Mariquita' },
  { emoji: '🐛', name: 'Oruga' },
  { emoji: '🐸', name: 'Rana' },
  { emoji: '🐌', name: 'Caracol' },
  { emoji: '🦉', name: 'Búho' },
  { emoji: '🐱', name: 'Gato' },
  { emoji: '🐶', name: 'Perro' },
  { emoji: '🦔', name: 'Erizo' },
  { emoji: '🐵', name: 'Mono' },
  { emoji: '🦄', name: 'Unicornio' },
  { emoji: '🐘', name: 'Elefante' },
  { emoji: '🦁', name: 'León' },
  { emoji: '🐢', name: 'Tortuga' },
  { emoji: '🐟', name: 'Pez' },
  { emoji: '🦋', name: 'Mariposa' },
  { emoji: '🐰', name: 'Conejo' },
  { emoji: '🐻', name: 'Oso' },
  { emoji: '🦆', name: 'Pato' },
  { emoji: '🐴', name: 'Caballo' },
];

/** Palabras que empiezan por vocal, para el juego de sonidos iniciales. */
export const VOWEL_WORDS: readonly Critter[] = [
  { emoji: '🐝', name: 'Abeja' },
  { emoji: '🌳', name: 'Árbol' },
  { emoji: '✈️', name: 'Avión' },
  { emoji: '🐘', name: 'Elefante' },
  { emoji: '🦔', name: 'Erizo' },
  { emoji: '⭐', name: 'Estrella' },
  { emoji: '🏝️', name: 'Isla' },
  { emoji: '🧲', name: 'Imán' },
  { emoji: '🏠', name: 'Iglú' },
  { emoji: '🐻', name: 'Oso' },
  { emoji: '🐛', name: 'Oruga' },
  { emoji: '👁️', name: 'Ojo' },
  { emoji: '🦄', name: 'Unicornio' },
  { emoji: '🍇', name: 'Uva' },
  { emoji: '💅', name: 'Uña' },
];

export const VOWELS = ['A', 'E', 'I', 'O', 'U'] as const;

/** Emojis contables: formas simples y bien distinguibles a tamaño pequeño. */
export const COUNTABLES = ['🐞', '🐝', '🦋', '🐌', '🐛', '🌸', '🍄', '⭐'] as const;

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
];

/** Categorías para "El Intruso": el intruso sale de una categoría distinta. */
export const CATEGORIES: ReadonlyArray<{ name: string; items: readonly string[] }> = [
  { name: 'animales', items: ['🐶', '🐱', '🐰', '🐻', '🐸', '🦊'] },
  { name: 'frutas', items: ['🍎', '🍌', '🍇', '🍓', '🍊', '🍐'] },
  { name: 'vehículos', items: ['🚗', '🚌', '🚲', '✈️', '🚂', '🚚'] },
  { name: 'flores', items: ['🌸', '🌻', '🌷', '🌹', '🌼', '🪻'] },
];

/** Frases de ánimo tras un fallo. Nunca reprenden: el público tiene 4 años. */
export const ENCOURAGEMENTS: readonly string[] = [
  'Casi. ¡Prueba otra vez!',
  'Inténtalo de nuevo, ¡tú puedes!',
  'Uy, esa no era. ¡Otra vez!',
  'No pasa nada. ¡Vuelve a probar!',
];

export const PRAISES: readonly string[] = [
  '¡Muy bien!',
  '¡Genial!',
  '¡Perfecto!',
  '¡Estupendo!',
  '¡Lo has clavado!',
];
