/** Contenido del mundo «El Claro de las Letras». */

import type { Critter } from './comun';

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
  { emoji: '⛪', name: 'Iglesia' },
  { emoji: '🐻', name: 'Oso' },
  { emoji: '🐛', name: 'Oruga' },
  { emoji: '👁️', name: 'Ojo' },
  { emoji: '🦄', name: 'Unicornio' },
  { emoji: '🍇', name: 'Uva' },
  { emoji: '💅', name: 'Uña' },
  { emoji: '🕷️', name: 'Araña' },
  { emoji: '💍', name: 'Anillo' },
  { emoji: '🪜', name: 'Escalera' },
  { emoji: '🪞', name: 'Espejo' },
  { emoji: '🦎', name: 'Iguana' },
  { emoji: '🐜', name: 'Insecto' },
  { emoji: '🐑', name: 'Oveja' },
  { emoji: '🌊', name: 'Ola' },
  { emoji: '1️⃣', name: 'Uno' },
  { emoji: '🐦', name: 'Urraca' },
];

export const VOWELS = ['A', 'E', 'I', 'O', 'U'] as const;

/**
 * Familias de palabras que riman entre sí en español, para conciencia
 * fonológica. Cada palabra lleva un emoji para no depender solo del texto.
 */
export const RHYME_FAMILIES: ReadonlyArray<
  ReadonlyArray<{ emoji: string; word: string }>
> = [
  [
    { emoji: '🐱', word: 'gato' },
    { emoji: '🦆', word: 'pato' },
    { emoji: '🍽️', word: 'plato' },
    { emoji: '👟', word: 'zapato' },
  ],
  [
    { emoji: '🌙', word: 'luna' },
    { emoji: '🍼', word: 'cuna' },
  ],
  [
    { emoji: '🌞', word: 'sol' },
    { emoji: '⚽', word: 'gol' },
    { emoji: '🥬', word: 'col' },
  ],
  [
    { emoji: '🌸', word: 'flor' },
    { emoji: '🎨', word: 'color' },
    { emoji: '🥁', word: 'tambor' },
  ],
  [
    // «lápiz» estaba aquí y no rima: es llana en -ápiz, no aguda en -íz.
    { emoji: '👃', word: 'nariz' },
    { emoji: '🌽', word: 'maíz' },
    { emoji: '😀', word: 'feliz' },
  ],
  [
    { emoji: '🐟', word: 'pez' },
    { emoji: '🌰', word: 'nuez' },
  ],
];
