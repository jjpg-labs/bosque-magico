/** Contenido del mundo «El Prado de las Medidas». */

import type { Item } from '../generators';

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

/**
 * Cosas que puestas en fila se leen como una fila: vagones, patos, hormigas.
 *
 * La prueba de largo y corto pinta dos filas y pregunta cuál es más larga, así
 * que las filas nunca pasan de cuatro elementos: a partir de ahí la opción hace
 * dos renglones y deja de parecer una fila.
 */
export const LINE_THINGS: readonly string[] = ['🚃', '🐜', '🦆', '🐛', '🔗', '🚗', '🐤', '🐧'];

/**
 * Parejas de peso con una diferencia enorme y evidente.
 *
 * Nada de comparar dos cosas parecidas: a los cuatro años «¿qué pesa más, la
 * silla o la mesa?» no tiene respuesta de un vistazo. Cada pareja enfrenta algo
 * grandísimo con algo diminuto.
 */
export const WEIGHT_PAIRS: ReadonlyArray<{ heavy: Item; light: Item }> = [
  { heavy: { emoji: '🐘', name: 'el elefante' }, light: { emoji: '🐜', name: 'la hormiga' } },
  { heavy: { emoji: '🚚', name: 'el camión' }, light: { emoji: '🚲', name: 'la bicicleta' } },
  { heavy: { emoji: '🐳', name: 'la ballena' }, light: { emoji: '🐟', name: 'el pez' } },
  { heavy: { emoji: '🏠', name: 'la casa' }, light: { emoji: '🔑', name: 'la llave' } },
  { heavy: { emoji: '🐴', name: 'el caballo' }, light: { emoji: '🐭', name: 'el ratón' } },
  { heavy: { emoji: '🚂', name: 'el tren' }, light: { emoji: '🛴', name: 'el patinete' } },
  { heavy: { emoji: '🦏', name: 'el rinoceronte' }, light: { emoji: '🦋', name: 'la mariposa' } },
  { heavy: { emoji: '🗻', name: 'la montaña' }, light: { emoji: '🌰', name: 'la bellota' } },
  { heavy: { emoji: '🐻', name: 'el oso' }, light: { emoji: '🐝', name: 'la abeja' } },
  { heavy: { emoji: '🚌', name: 'el autobús' }, light: { emoji: '⚽', name: 'la pelota' } },
  { heavy: { emoji: '🦒', name: 'la jirafa' }, light: { emoji: '🐌', name: 'el caracol' } },
  { heavy: { emoji: '🛏️', name: 'la cama' }, light: { emoji: '🧦', name: 'el calcetín' } },
  { heavy: { emoji: '🐄', name: 'la vaca' }, light: { emoji: '🐤', name: 'el pollito' } },
  { heavy: { emoji: '⛵', name: 'el barco' }, light: { emoji: '🎈', name: 'el globo' } },
  { heavy: { emoji: '🌳', name: 'el árbol' }, light: { emoji: '🍃', name: 'la hoja' } },
  { heavy: { emoji: '🚜', name: 'el tractor' }, light: { emoji: '🥕', name: 'la zanahoria' } },
];

/** Parejas de orden en el tiempo: qué va antes y qué va después. */
export const TIME_PAIRS: ReadonlyArray<{ first: Item; then: Item }> = [
  { first: { emoji: '🌱', name: 'la semilla' }, then: { emoji: '🌳', name: 'el árbol' } },
  { first: { emoji: '🥚', name: 'el huevo' }, then: { emoji: '🐣', name: 'el pollito' } },
  { first: { emoji: '🍳', name: 'el desayuno' }, then: { emoji: '🍽️', name: 'la cena' } },
  { first: { emoji: '🐛', name: 'la oruga' }, then: { emoji: '🦋', name: 'la mariposa' } },
  { first: { emoji: '👶', name: 'el bebé' }, then: { emoji: '🧒', name: 'el niño' } },
  { first: { emoji: '☀️', name: 'el día' }, then: { emoji: '🌙', name: 'la noche' } },
  { first: { emoji: '🚿', name: 'la ducha' }, then: { emoji: '🛏️', name: 'la cama' } },
  { first: { emoji: '🌧️', name: 'la lluvia' }, then: { emoji: '🌈', name: 'el arcoíris' } },
  { first: { emoji: '🎒', name: 'ir al cole' }, then: { emoji: '🏠', name: 'volver a casa' } },
  { first: { emoji: '🧦', name: 'el calcetín' }, then: { emoji: '👟', name: 'la zapatilla' } },
  { first: { emoji: '🌅', name: 'el amanecer' }, then: { emoji: '🌇', name: 'el atardecer' } },
  { first: { emoji: '🧺', name: 'la compra' }, then: { emoji: '🎂', name: 'la tarta' } },
];

/** Los días, en orden. La semana es cíclica: después del domingo viene el lunes. */
export const WEEKDAYS: readonly string[] = [
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
  'domingo',
];

/**
 * Pistas de cada estación. Varias comparten `name` a propósito: la fábrica
 * `emojiToName` agrupa por nombre y saca una pista de cada estación.
 */
export const SEASON_CLUES: readonly Item[] = [
  { emoji: '🌷', name: 'Primavera' },
  { emoji: '🌸', name: 'Primavera' },
  { emoji: '🌼', name: 'Primavera' },
  { emoji: '🌱', name: 'Primavera' },
  { emoji: '🐝', name: 'Primavera' },
  { emoji: '☀️', name: 'Verano' },
  { emoji: '🏖️', name: 'Verano' },
  { emoji: '🍉', name: 'Verano' },
  { emoji: '🩴', name: 'Verano' },
  { emoji: '🕶️', name: 'Verano' },
  { emoji: '🍂', name: 'Otoño' },
  { emoji: '🍁', name: 'Otoño' },
  { emoji: '🌰', name: 'Otoño' },
  { emoji: '🍄', name: 'Otoño' },
  { emoji: '🎃', name: 'Otoño' },
  { emoji: '❄️', name: 'Invierno' },
  { emoji: '⛄', name: 'Invierno' },
  { emoji: '🧣', name: 'Invierno' },
  { emoji: '🧤', name: 'Invierno' },
  { emoji: '🎿', name: 'Invierno' },
];

/**
 * Qué es de día y qué es de noche.
 *
 * Solo cosas que caen claramente de un lado: el fútbol y la playa son de día,
 * el murciélago y las estrellas son de noche. Nada de leer un cuento o ducharse,
 * que valen para las dos.
 */
export const DAY_THINGS: readonly Item[] = [
  { emoji: '🎒', name: 'ir al cole' },
  { emoji: '🍳', name: 'el desayuno' },
  { emoji: '🏖️', name: 'la playa' },
  { emoji: '🚲', name: 'la bicicleta' },
  { emoji: '⚽', name: 'el fútbol' },
  { emoji: '🧺', name: 'el picnic' },
  { emoji: '🛒', name: 'la compra' },
  { emoji: '🌈', name: 'el arcoíris' },
];

export const NIGHT_THINGS: readonly Item[] = [
  { emoji: '🛏️', name: 'la cama' },
  { emoji: '😴', name: 'dormir' },
  { emoji: '⭐', name: 'las estrellas' },
  { emoji: '🦉', name: 'el búho' },
  { emoji: '🦇', name: 'el murciélago' },
  { emoji: '🔦', name: 'la linterna' },
];

/**
 * Cuentos de tres viñetas en orden. Son rutinas y escenas de la vida diaria: lo
 * de «en qué se convierte cada cosa» ya lo trabaja el mundo de la lógica.
 */
export const STORY_STRIPS: ReadonlyArray<readonly Item[]> = [
  [
    { emoji: '☀️', name: 'despertarse' },
    { emoji: '🍳', name: 'desayunar' },
    { emoji: '🎒', name: 'ir al cole' },
  ],
  [
    { emoji: '⚽', name: 'jugar' },
    { emoji: '🚿', name: 'la ducha' },
    { emoji: '🛏️', name: 'la cama' },
  ],
  [
    { emoji: '🧺', name: 'la compra' },
    { emoji: '🥣', name: 'la masa' },
    { emoji: '🎂', name: 'la tarta' },
  ],
  [
    { emoji: '👶', name: 'el bebé' },
    { emoji: '🧒', name: 'el niño' },
    { emoji: '🧑', name: 'la persona mayor' },
  ],
  [
    { emoji: '🥚', name: 'el huevo' },
    { emoji: '🐣', name: 'el pollito' },
    { emoji: '🐔', name: 'la gallina' },
  ],
  [
    { emoji: '🌱', name: 'la semilla' },
    { emoji: '🌿', name: 'el brote' },
    { emoji: '🌻', name: 'el girasol' },
  ],
  [
    { emoji: '🍽️', name: 'poner la mesa' },
    { emoji: '🍝', name: 'comer' },
    { emoji: '🧽', name: 'fregar' },
  ],
  [
    { emoji: '🚗', name: 'el coche' },
    { emoji: '⛽', name: 'la gasolinera' },
    { emoji: '🏖️', name: 'la playa' },
  ],
  [
    { emoji: '👕', name: 'la camiseta' },
    { emoji: '🧥', name: 'el abrigo' },
    { emoji: '🚪', name: 'salir a la calle' },
  ],
];

/**
 * Parejas con una diferencia de altura evidente.
 *
 * Alto y bajo no es lo mismo que grande y pequeño, y por eso van con objetos
 * reales en vez de con el mismo dibujo a dos tamaños: lo que se aprende aquí
 * es que la jirafa es alta, no que un emoji esté más ampliado que otro.
 */
export const HEIGHT_PAIRS: ReadonlyArray<{
  tall: { emoji: string; name: string };
  short: { emoji: string; name: string };
}> = [
  { tall: { emoji: '🦒', name: 'la jirafa' }, short: { emoji: '🐁', name: 'el ratón' } },
  { tall: { emoji: '🌳', name: 'el árbol' }, short: { emoji: '🌼', name: 'la margarita' } },
  { tall: { emoji: '🏢', name: 'el edificio' }, short: { emoji: '🏠', name: 'la casa' } },
  { tall: { emoji: '🗼', name: 'la torre' }, short: { emoji: '⛺', name: 'la tienda de campaña' } },
  { tall: { emoji: '🐘', name: 'el elefante' }, short: { emoji: '🐌', name: 'el caracol' } },
  { tall: { emoji: '🌵', name: 'el cactus' }, short: { emoji: '🍄', name: 'la seta' } },
  { tall: { emoji: '🏔️', name: 'la montaña' }, short: { emoji: '🪨', name: 'la piedra' } },
  { tall: { emoji: '🦓', name: 'la cebra' }, short: { emoji: '🐇', name: 'el conejo' } },
  { tall: { emoji: '🚌', name: 'el autobús' }, short: { emoji: '🛴', name: 'el patinete' } },
  { tall: { emoji: '🦕', name: 'el dinosaurio' }, short: { emoji: '🐢', name: 'la tortuga' } },
];
