/**
 * Contenido que usan pruebas de varios mundos.
 *
 * Todo lo que solo sirve para un mundo va en `data/<mundo>.ts`: así un lote de
 * contenido nuevo toca un fichero propio y dos agentes trabajando a la vez no
 * chocan. Aquí solo lo verdaderamente compartido.
 */

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
