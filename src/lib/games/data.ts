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
  { emoji: '🦒', name: 'Jirafa' },
  { emoji: '🦭', name: 'Foca' },
  { emoji: '🐬', name: 'Delfín' },
  { emoji: '🐍', name: 'Serpiente' },
  { emoji: '🐄', name: 'Vaca' },
  { emoji: '🐜', name: 'Hormiga' },
  { emoji: '🦓', name: 'Cebra' },
  { emoji: '🐿️', name: 'Ardilla' },
  { emoji: '🐷', name: 'Cerdito' },
  { emoji: '🐑', name: 'Oveja' },
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

/** Emojis contables: formas simples y bien distinguibles a tamaño pequeño. */
export const COUNTABLES = [
  '🐞',
  '🐝',
  '🦋',
  '🐌',
  '🐛',
  '🌸',
  '🍄',
  '⭐',
  '🌼',
  '🍀',
  '🐚',
  '🎈',
] as const;

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

/** Categorías para "El Intruso": el intruso sale de una categoría distinta. */
export const CATEGORIES: ReadonlyArray<{ name: string; items: readonly string[] }> = [
  { name: 'animales', items: ['🐶', '🐱', '🐰', '🐻', '🐸', '🦊'] },
  { name: 'frutas', items: ['🍎', '🍌', '🍇', '🍓', '🍊', '🍐'] },
  { name: 'vehículos', items: ['🚗', '🚌', '🚲', '✈️', '🚂', '🚚'] },
  { name: 'flores', items: ['🌸', '🌻', '🌷', '🌹', '🌼', '🪻'] },
  { name: 'ropa', items: ['👕', '👖', '🧦', '👗', '🧥', '👟'] },
  { name: 'instrumentos', items: ['🎸', '🥁', '🎺', '🎷', '🎹', '🎻'] },
  { name: 'comida', items: ['🍕', '🍔', '🍟', '🌮', '🍩', '🥐'] },
  { name: 'deportes', items: ['⚽', '🏀', '🎾', '🏈', '⚾', '🏐'] },
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

/** Sonidos de animales (onomatopeyas), para el juego de escuchar y adivinar. */
export const ANIMAL_SOUNDS: ReadonlyArray<{ emoji: string; name: string; sound: string }> = [
  { emoji: '🐶', name: 'el perro', sound: 'Guau guau' },
  { emoji: '🐱', name: 'el gato', sound: 'Miau' },
  { emoji: '🐄', name: 'la vaca', sound: 'Muu' },
  { emoji: '🐑', name: 'la oveja', sound: 'Beee' },
  { emoji: '🐷', name: 'el cerdito', sound: 'Oinc oinc' },
  { emoji: '🐔', name: 'la gallina', sound: 'Kikirikí' },
  { emoji: '🦆', name: 'el pato', sound: 'Cuac cuac' },
  { emoji: '🐴', name: 'el caballo', sound: 'Iiiii' },
  { emoji: '🦁', name: 'el león', sound: 'Rrroar' },
  { emoji: '🐸', name: 'la rana', sound: 'Croac croac' },
];

/** Caras con una emoción clara, para reconocer y nombrar cómo se siente alguien. */
export const EMOTIONS: ReadonlyArray<{ emoji: string; name: string }> = [
  { emoji: '😀', name: 'Feliz' },
  { emoji: '😢', name: 'Triste' },
  { emoji: '😠', name: 'Enfadado' },
  { emoji: '😴', name: 'Con sueño' },
  { emoji: '😲', name: 'Sorprendido' },
  { emoji: '😨', name: 'Asustado' },
];

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
    { emoji: '👃', word: 'nariz' },
    { emoji: '✏️', word: 'lápiz' },
    { emoji: '🌽', word: 'maíz' },
  ],
  [
    { emoji: '🐟', word: 'pez' },
    { emoji: '🌰', word: 'nuez' },
  ],
];

/** Pasos del día, en orden fijo: la rutina no es cíclica como un patrón. */
export const ROUTINE_STEPS: ReadonlyArray<{ emoji: string; label: string }> = [
  { emoji: '☀️', label: 'Despertar' },
  { emoji: '🪥', label: 'Lavarse los dientes' },
  { emoji: '🍳', label: 'Desayunar' },
  { emoji: '🎒', label: 'Ir al cole' },
  { emoji: '🍽️', label: 'Comer' },
  { emoji: '🛁', label: 'Bañarse' },
  { emoji: '🌙', label: 'Dormir' },
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
