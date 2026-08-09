/** Contenido del mundo «El Bosque de los Animales». */

import type { Item, Pair } from '../generators';

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
  { emoji: '🐭', name: 'el ratón', sound: 'Ii ii ii' },
  { emoji: '🦉', name: 'el búho', sound: 'Uu uu' },
  { emoji: '🐝', name: 'la abeja', sound: 'Bzzzz' },
  { emoji: '🐦', name: 'el pájaro', sound: 'Pío pío' },
  { emoji: '🐘', name: 'el elefante', sound: 'Prrruuu' },
  { emoji: '🐒', name: 'el mono', sound: 'Uh uh ah ah' },
];

// --- Dónde vive cada animal (74) y de dónde es (77) ---------------------------

/** Las zonas donde viven los animales, con el dibujo que las representa. */
export const ANIMAL_HOMES: readonly Item[] = [
  { emoji: '🏠', name: 'La granja' },
  { emoji: '🌊', name: 'El mar' },
  { emoji: '🌴', name: 'La selva' },
  { emoji: '🌲', name: 'El bosque' },
  { emoji: '🏜️', name: 'El desierto' },
];

/**
 * Animales **monohábitat**: cada uno vive en una sola de esas zonas.
 *
 * Nada de ranas (estanque *y* tierra) ni tortugas (mar *y* tierra): con un
 * animal de dos casas, dos opciones serían defendibles a la vez y la prueba
 * dejaría de tener respuesta única.
 */
const ZONED_ANIMALS: ReadonlyArray<{ emoji: string; name: string; home: string }> = [
  { emoji: '🐟', name: 'el pez', home: 'El mar' },
  { emoji: '🐬', name: 'el delfín', home: 'El mar' },
  { emoji: '🐙', name: 'el pulpo', home: 'El mar' },
  { emoji: '🐳', name: 'la ballena', home: 'El mar' },
  { emoji: '🐒', name: 'el mono', home: 'La selva' },
  { emoji: '🐅', name: 'el tigre', home: 'La selva' },
  { emoji: '🦜', name: 'el loro', home: 'La selva' },
  { emoji: '🦍', name: 'el gorila', home: 'La selva' },
  { emoji: '🐄', name: 'la vaca', home: 'La granja' },
  { emoji: '🐖', name: 'el cerdo', home: 'La granja' },
  { emoji: '🐓', name: 'el gallo', home: 'La granja' },
  { emoji: '🐑', name: 'la oveja', home: 'La granja' },
  { emoji: '🐐', name: 'la cabra', home: 'La granja' },
  { emoji: '🐎', name: 'el caballo', home: 'La granja' },
  { emoji: '🦊', name: 'el zorro', home: 'El bosque' },
  { emoji: '🦌', name: 'el ciervo', home: 'El bosque' },
  { emoji: '🐻', name: 'el oso', home: 'El bosque' },
  { emoji: '🐿️', name: 'la ardilla', home: 'El bosque' },
  { emoji: '🦉', name: 'el búho', home: 'El bosque' },
  { emoji: '🐪', name: 'el camello', home: 'El desierto' },
];

function homeOf(name: string): Item {
  const home = ANIMAL_HOMES.find((candidate) => candidate.name === name);
  if (!home) throw new Error(`ANIMAL_HOMES no tiene «${name}».`);
  return home;
}

/**
 * Las dos pruebas de hábitat salen de la **misma** tabla a propósito: si cada
 * una tuviera la suya, un día dirían que el zorro vive en el bosque y la otra
 * que en la granja.
 */
export const HABITATS: readonly Pair[] = ZONED_ANIMALS.map((animal) => ({
  from: { emoji: animal.emoji, name: animal.name },
  to: homeOf(animal.home),
}));

/** El mismo animal, pero la respuesta es el nombre escrito de su zona. */
export const ANIMAL_ZONES: readonly Item[] = ZONED_ANIMALS.map((animal) => ({
  emoji: animal.emoji,
  name: animal.home,
}));

// --- Cuántas patas tiene (75) --------------------------------------------------

/** Las únicas respuestas posibles: siempre se ofrecen las cuatro. */
export const LEG_COUNTS: readonly number[] = [2, 4, 6, 8];

/**
 * Animales con un número de patas que se puede contar sin discusión. Fuera
 * los que no tienen (peces, serpientes, caracoles) y fuera el pulpo, que tiene
 * ocho *tentáculos* y no ocho patas.
 */
export const ANIMAL_LEGS: ReadonlyArray<{ emoji: string; name: string; legs: number }> = [
  { emoji: '🐦', name: 'el pájaro', legs: 2 },
  { emoji: '🐔', name: 'la gallina', legs: 2 },
  { emoji: '🦆', name: 'el pato', legs: 2 },
  { emoji: '🦉', name: 'el búho', legs: 2 },
  { emoji: '🐧', name: 'el pingüino', legs: 2 },
  { emoji: '🦩', name: 'el flamenco', legs: 2 },
  { emoji: '🐕', name: 'el perro', legs: 4 },
  { emoji: '🐈', name: 'el gato', legs: 4 },
  { emoji: '🐄', name: 'la vaca', legs: 4 },
  { emoji: '🐘', name: 'el elefante', legs: 4 },
  { emoji: '🐎', name: 'el caballo', legs: 4 },
  { emoji: '🦁', name: 'el león', legs: 4 },
  { emoji: '🐖', name: 'el cerdo', legs: 4 },
  { emoji: '🐇', name: 'el conejo', legs: 4 },
  { emoji: '🦊', name: 'el zorro', legs: 4 },
  { emoji: '🐜', name: 'la hormiga', legs: 6 },
  { emoji: '🐝', name: 'la abeja', legs: 6 },
  { emoji: '🐞', name: 'la mariquita', legs: 6 },
  { emoji: '🦗', name: 'el grillo', legs: 6 },
  { emoji: '🦋', name: 'la mariposa', legs: 6 },
  { emoji: '🕷️', name: 'la araña', legs: 8 },
];

// --- Qué come cada animal (76) -------------------------------------------------

/**
 * Parejas de las de toda la vida: el conejo y la zanahoria, el ratón y el
 * queso. Cada animal tiene **una** comida asociada, la que se enseña a esta
 * edad, para que el distractor nunca se pueda defender.
 */
export const ANIMAL_FOOD: readonly Pair[] = [
  { from: { emoji: '🐇', name: 'el conejo' }, to: { emoji: '🥕', name: 'la zanahoria' } },
  { from: { emoji: '🐁', name: 'el ratón' }, to: { emoji: '🧀', name: 'el queso' } },
  { from: { emoji: '🐻', name: 'el oso' }, to: { emoji: '🍯', name: 'la miel' } },
  { from: { emoji: '🐄', name: 'la vaca' }, to: { emoji: '🌿', name: 'la hierba' } },
  { from: { emoji: '🐑', name: 'la oveja' }, to: { emoji: '🌿', name: 'la hierba' } },
  { from: { emoji: '🐐', name: 'la cabra' }, to: { emoji: '🌿', name: 'la hierba' } },
  { from: { emoji: '🐎', name: 'el caballo' }, to: { emoji: '🌿', name: 'la hierba' } },
  { from: { emoji: '🐒', name: 'el mono' }, to: { emoji: '🍌', name: 'el plátano' } },
  { from: { emoji: '🐕', name: 'el perro' }, to: { emoji: '🦴', name: 'el hueso' } },
  { from: { emoji: '🐈', name: 'el gato' }, to: { emoji: '🐟', name: 'el pescado' } },
  { from: { emoji: '🐧', name: 'el pingüino' }, to: { emoji: '🐟', name: 'el pescado' } },
  { from: { emoji: '🐬', name: 'el delfín' }, to: { emoji: '🐟', name: 'el pescado' } },
  { from: { emoji: '🐿️', name: 'la ardilla' }, to: { emoji: '🌰', name: 'la castaña' } },
  { from: { emoji: '🐝', name: 'la abeja' }, to: { emoji: '🌸', name: 'la flor' } },
  { from: { emoji: '🦋', name: 'la mariposa' }, to: { emoji: '🌸', name: 'la flor' } },
  { from: { emoji: '🐦', name: 'el pájaro' }, to: { emoji: '🐛', name: 'el gusano' } },
  { from: { emoji: '🐓', name: 'el gallo' }, to: { emoji: '🌾', name: 'el trigo' } },
];

// --- Cómo se mueve cada animal (78) --------------------------------------------

/**
 * Tres formas de moverse, y solo animales que hacen **una**: nada de patos ni
 * tortugas, que andan y nadan, ni de gallinas, que andan y aletean.
 */
export const ANIMAL_MOVES: readonly Item[] = [
  { emoji: '🦋', name: 'Vuela' },
  { emoji: '🐝', name: 'Vuela' },
  { emoji: '🦅', name: 'Vuela' },
  { emoji: '🦉', name: 'Vuela' },
  { emoji: '🐦', name: 'Vuela' },
  { emoji: '🦜', name: 'Vuela' },
  { emoji: '🐞', name: 'Vuela' },
  { emoji: '🦇', name: 'Vuela' },
  { emoji: '🐟', name: 'Nada' },
  { emoji: '🐬', name: 'Nada' },
  { emoji: '🐳', name: 'Nada' },
  { emoji: '🐙', name: 'Nada' },
  { emoji: '🦐', name: 'Nada' },
  { emoji: '🦑', name: 'Nada' },
  { emoji: '🐕', name: 'Anda' },
  { emoji: '🐈', name: 'Anda' },
  { emoji: '🐄', name: 'Anda' },
  { emoji: '🐘', name: 'Anda' },
  { emoji: '🐎', name: 'Anda' },
  { emoji: '🦁', name: 'Anda' },
  { emoji: '🐖', name: 'Anda' },
  { emoji: '🐐', name: 'Anda' },
  { emoji: '🐒', name: 'Anda' },
];

// --- Cómo crecen los seres vivos (79) ------------------------------------------

/**
 * Tiras cortas en orden. Se enseñan de tres en tres (`windowLen: 3`), que a
 * los tres años es lo que se abarca de un vistazo y lo que cabe a 360 px.
 */
export const LIFE_CYCLES: ReadonlyArray<readonly Item[]> = [
  [
    { emoji: '🥚', name: 'el huevo' },
    { emoji: '🐣', name: 'el pollito que sale' },
    { emoji: '🐤', name: 'el pollito' },
    { emoji: '🐔', name: 'la gallina' },
  ],
  [
    { emoji: '🥚', name: 'el huevo' },
    { emoji: '🐛', name: 'la oruga' },
    { emoji: '🦋', name: 'la mariposa' },
  ],
  [
    { emoji: '🌰', name: 'la semilla' },
    { emoji: '🌱', name: 'el brote' },
    { emoji: '🌿', name: 'la planta' },
    { emoji: '🌻', name: 'el girasol' },
  ],
  [
    { emoji: '👶', name: 'el bebé' },
    { emoji: '🧒', name: 'la niña' },
    { emoji: '👩', name: 'la mamá' },
    { emoji: '👵', name: 'la abuela' },
  ],
];

// --- Qué tiempo hace (80) -------------------------------------------------------

/** Varios dibujos por tipo de tiempo: así no se memoriza «el copo es nieve». */
export const WEATHER: readonly Item[] = [
  { emoji: '☀️', name: 'El sol' },
  { emoji: '🌞', name: 'El sol' },
  { emoji: '🌧️', name: 'La lluvia' },
  { emoji: '☔', name: 'La lluvia' },
  { emoji: '❄️', name: 'La nieve' },
  { emoji: '⛄', name: 'La nieve' },
  { emoji: '🌨️', name: 'La nieve' },
  { emoji: '🌬️', name: 'El viento' },
  { emoji: '💨', name: 'El viento' },
  { emoji: '🪁', name: 'El viento' },
  { emoji: '☁️', name: 'Las nubes' },
  { emoji: '🌈', name: 'El arcoíris' },
  { emoji: '🌫️', name: 'La niebla' },
];

// --- Flores, hojas y frutos (81) ------------------------------------------------

/**
 * Clasificar lo que da una planta. Ningún dibujo está en dos grupos: 🌿 se
 * queda fuera de las hojas porque en «¿Qué come?» ya es la hierba.
 */
export const PLANT_KINDS: readonly Item[] = [
  { emoji: '🌸', name: 'La flor' },
  { emoji: '🌺', name: 'La flor' },
  { emoji: '🌻', name: 'La flor' },
  { emoji: '🌹', name: 'La flor' },
  { emoji: '🌷', name: 'La flor' },
  { emoji: '🌼', name: 'La flor' },
  { emoji: '🍃', name: 'La hoja' },
  { emoji: '🍀', name: 'La hoja' },
  { emoji: '🍁', name: 'La hoja' },
  { emoji: '🍂', name: 'La hoja' },
  { emoji: '🍎', name: 'El fruto' },
  { emoji: '🍐', name: 'El fruto' },
  { emoji: '🍊', name: 'El fruto' },
  { emoji: '🍋', name: 'El fruto' },
  { emoji: '🍇', name: 'El fruto' },
  { emoji: '🍓', name: 'El fruto' },
  { emoji: '🌳', name: 'El árbol' },
  { emoji: '🌲', name: 'El árbol' },
  { emoji: '🌴', name: 'El árbol' },
];

// --- Qué necesita una planta (82) -----------------------------------------------

export const PLANTS: readonly Item[] = [
  { emoji: '🌻', name: 'el girasol' },
  { emoji: '🌷', name: 'el tulipán' },
  { emoji: '🌹', name: 'la rosa' },
  { emoji: '🌳', name: 'el árbol' },
  { emoji: '🌱', name: 'el brote' },
  { emoji: '🌸', name: 'la flor' },
  { emoji: '🍀', name: 'el trébol' },
  { emoji: '🌲', name: 'el pino' },
  { emoji: '🌵', name: 'el cactus' },
];

/**
 * Lo que de verdad necesita para crecer. Van de una en una a la ronda: el agua
 * y el sol son las dos correctas, así que **nunca** pueden salir juntas.
 */
export const PLANT_NEEDS: readonly Item[] = [
  { emoji: '💧', name: 'el agua' },
  { emoji: '☀️', name: 'el sol' },
];

/** Cosas estupendas que, sin embargo, no hacen crecer a una planta. */
export const NOT_PLANT_NEEDS: readonly Item[] = [
  { emoji: '⚽', name: 'la pelota' },
  { emoji: '🚗', name: 'el coche' },
  { emoji: '📺', name: 'la tele' },
  { emoji: '🎈', name: 'el globo' },
  { emoji: '🔑', name: 'la llave' },
  { emoji: '📚', name: 'los libros' },
  { emoji: '🥁', name: 'el tambor' },
  { emoji: '🎩', name: 'el sombrero' },
  { emoji: '🧦', name: 'los calcetines' },
  { emoji: '🪀', name: 'el yoyó' },
];

// --- En qué cubo va cada cosa (83) ----------------------------------------------

/**
 * Tres cubos, que son los que hay en casa: azul de papel, amarillo de envases
 * y marrón de restos de comida. El verde se queda fuera porque los únicos
 * emojis de botella de vidrio son de bebida de mayores.
 */
export const RECYCLING: readonly Pair[] = [
  { from: { emoji: '📰', name: 'el periódico' }, to: { emoji: '🟦', name: 'el cubo azul' } },
  { from: { emoji: '📦', name: 'la caja' }, to: { emoji: '🟦', name: 'el cubo azul' } },
  { from: { emoji: '📄', name: 'el papel' }, to: { emoji: '🟦', name: 'el cubo azul' } },
  { from: { emoji: '✉️', name: 'el sobre' }, to: { emoji: '🟦', name: 'el cubo azul' } },
  { from: { emoji: '📔', name: 'el cuaderno' }, to: { emoji: '🟦', name: 'el cubo azul' } },
  { from: { emoji: '🥤', name: 'el vaso de plástico' }, to: { emoji: '🟨', name: 'el cubo amarillo' } },
  { from: { emoji: '🧴', name: 'el bote de champú' }, to: { emoji: '🟨', name: 'el cubo amarillo' } },
  { from: { emoji: '🥫', name: 'la lata' }, to: { emoji: '🟨', name: 'el cubo amarillo' } },
  { from: { emoji: '🛍️', name: 'la bolsa' }, to: { emoji: '🟨', name: 'el cubo amarillo' } },
  { from: { emoji: '🧃', name: 'el brik de zumo' }, to: { emoji: '🟨', name: 'el cubo amarillo' } },
  { from: { emoji: '🍌', name: 'la piel del plátano' }, to: { emoji: '🟫', name: 'el cubo marrón' } },
  { from: { emoji: '🍎', name: 'el resto de la manzana' }, to: { emoji: '🟫', name: 'el cubo marrón' } },
  { from: { emoji: '🥚', name: 'la cáscara del huevo' }, to: { emoji: '🟫', name: 'el cubo marrón' } },
  { from: { emoji: '🍞', name: 'el pan duro' }, to: { emoji: '🟫', name: 'el cubo marrón' } },
  { from: { emoji: '🥕', name: 'la punta de la zanahoria' }, to: { emoji: '🟫', name: 'el cubo marrón' } },
];
