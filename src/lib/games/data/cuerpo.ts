/** Contenido del mundo «La Casa de los Peques». */

import type { Category, Item, Pair } from '../generators';

// --- Las partes del cuerpo (84) -------------------------------------------------

/**
 * Fuera 👆 «el dedo»: a 32 px es una mano señalando y se confunde con ✋, así
 * que «la mano» sería una respuesta igual de defendible.
 */
export const BODY_PARTS: readonly Item[] = [
  { emoji: '👀', name: 'Los ojos' },
  { emoji: '👃', name: 'La nariz' },
  { emoji: '👂', name: 'La oreja' },
  { emoji: '👄', name: 'La boca' },
  { emoji: '👅', name: 'La lengua' },
  { emoji: '✋', name: 'La mano' },
  { emoji: '💪', name: 'El brazo' },
  { emoji: '🦶', name: 'El pie' },
  { emoji: '🦵', name: 'La pierna' },
  { emoji: '🦷', name: 'El diente' },
  { emoji: '🦴', name: 'El hueso' },
  { emoji: '🧠', name: 'El cerebro' },
  { emoji: '❤️', name: 'El corazón' },
];

// --- Los cinco sentidos (85) ----------------------------------------------------

const SENSE_ORGANS: ReadonlyArray<Item & { verb: string }> = [
  { emoji: '👀', name: 'los ojos', verb: 'vemos' },
  { emoji: '👂', name: 'las orejas', verb: 'oímos' },
  { emoji: '👃', name: 'la nariz', verb: 'olemos' },
  { emoji: '👅', name: 'la lengua', verb: 'saboreamos' },
  { emoji: '✋', name: 'las manos', verb: 'tocamos' },
];

/**
 * El verbo va en el enunciado («¿con qué **olemos** la flor?») y no se deja
 * genérico a propósito: una flor también se ve, así que sin el verbo habría dos
 * respuestas buenas y la prueba no tendría solución única.
 */
export const SENSE_VERBS: Readonly<Record<string, string>> = Object.fromEntries(
  SENSE_ORGANS.map((organ) => [organ.name, organ.verb]),
);

function organOf(name: string): Item {
  const organ = SENSE_ORGANS.find((candidate) => candidate.name === name);
  if (!organ) throw new Error(`SENSE_ORGANS no tiene «${name}».`);
  return { emoji: organ.emoji, name: organ.name };
}

const SENSED_THINGS: ReadonlyArray<{ emoji: string; name: string; organ: string }> = [
  { emoji: '🌈', name: 'el arcoíris', organ: 'los ojos' },
  { emoji: '⭐', name: 'la estrella', organ: 'los ojos' },
  { emoji: '📺', name: 'la tele', organ: 'los ojos' },
  { emoji: '🎵', name: 'la música', organ: 'las orejas' },
  { emoji: '🥁', name: 'el tambor', organ: 'las orejas' },
  { emoji: '🔔', name: 'la campana', organ: 'las orejas' },
  { emoji: '🎺', name: 'la trompeta', organ: 'las orejas' },
  { emoji: '🌸', name: 'la flor', organ: 'la nariz' },
  { emoji: '🧼', name: 'el jabón', organ: 'la nariz' },
  { emoji: '🍞', name: 'el pan recién hecho', organ: 'la nariz' },
  { emoji: '🍭', name: 'el caramelo', organ: 'la lengua' },
  { emoji: '🍋', name: 'el limón', organ: 'la lengua' },
  { emoji: '🍫', name: 'el chocolate', organ: 'la lengua' },
  { emoji: '🧊', name: 'el hielo', organ: 'las manos' },
  { emoji: '🧸', name: 'el peluche', organ: 'las manos' },
  { emoji: '🧶', name: 'la lana', organ: 'las manos' },
];

export const SENSES: readonly Pair[] = SENSED_THINGS.map((thing) => ({
  from: { emoji: thing.emoji, name: thing.name },
  to: organOf(thing.organ),
}));

// --- Qué me pongo (86) -----------------------------------------------------------

/**
 * Cada tiempo trae **varios dibujos** (`signs`) y varias prendas: con uno solo
 * de cada, la prueba tendría tres ejercicios contados y se memorizaría en dos
 * partidas. Las prendas no se repiten entre grupos, o habría dos respuestas
 * buenas (por eso las botas están solo en la lluvia).
 */
export const CLOTHES_WEATHER: ReadonlyArray<{
  name: string;
  signs: readonly string[];
  clothes: readonly Item[];
}> = [
  {
    name: 'hace frío',
    signs: ['❄️', '⛄', '🌨️'],
    clothes: [
      { emoji: '🧥', name: 'el abrigo' },
      { emoji: '🧣', name: 'la bufanda' },
      { emoji: '🧤', name: 'los guantes' },
      { emoji: '🧦', name: 'los calcetines de lana' },
    ],
  },
  {
    name: 'hace calor',
    signs: ['☀️', '🌞'],
    clothes: [
      { emoji: '👕', name: 'la camiseta' },
      { emoji: '🩳', name: 'el pantalón corto' },
      { emoji: '👒', name: 'el sombrero' },
      { emoji: '🧢', name: 'la gorra' },
      { emoji: '🕶️', name: 'las gafas de sol' },
      { emoji: '🩱', name: 'el bañador' },
    ],
  },
  {
    name: 'llueve',
    signs: ['🌧️'],
    clothes: [
      { emoji: '🌂', name: 'el paraguas' },
      { emoji: '🥾', name: 'las botas de agua' },
    ],
  },
];

// --- Frutas y verduras (87) ------------------------------------------------------

/**
 * Dos opciones nada más, que son las dos de la pregunta.
 *
 * Ni tomate, ni aguacate, ni pepino, ni berenjena, ni pimiento: todos son fruta
 * botánicamente, así que «una verdura» sería discutible. Tampoco el maíz, que
 * es un cereal, ni la seta, que no es ni una cosa ni la otra.
 */
export const FRUIT_VEG: readonly Item[] = [
  { emoji: '🍎', name: 'Una fruta' },
  { emoji: '🍐', name: 'Una fruta' },
  { emoji: '🍊', name: 'Una fruta' },
  { emoji: '🍋', name: 'Una fruta' },
  { emoji: '🍌', name: 'Una fruta' },
  { emoji: '🍉', name: 'Una fruta' },
  { emoji: '🍇', name: 'Una fruta' },
  { emoji: '🍓', name: 'Una fruta' },
  { emoji: '🍒', name: 'Una fruta' },
  { emoji: '🍑', name: 'Una fruta' },
  { emoji: '🍍', name: 'Una fruta' },
  { emoji: '🥝', name: 'Una fruta' },
  { emoji: '🍈', name: 'Una fruta' },
  { emoji: '🥭', name: 'Una fruta' },
  { emoji: '🥥', name: 'Una fruta' },
  { emoji: '🥕', name: 'Una verdura' },
  { emoji: '🥦', name: 'Una verdura' },
  { emoji: '🥬', name: 'Una verdura' },
  { emoji: '🧅', name: 'Una verdura' },
  { emoji: '🧄', name: 'Una verdura' },
  { emoji: '🥔', name: 'Una verdura' },
];

// --- ¿De dónde viene? (88) --------------------------------------------------------

/** Nada de carne: aquí no se relaciona un animal con comérselo. */
export const FOOD_ORIGIN: readonly Pair[] = [
  { from: { emoji: '🥛', name: 'la leche' }, to: { emoji: '🐄', name: 'la vaca' } },
  { from: { emoji: '🧀', name: 'el queso' }, to: { emoji: '🐄', name: 'la vaca' } },
  { from: { emoji: '🧈', name: 'la mantequilla' }, to: { emoji: '🐄', name: 'la vaca' } },
  { from: { emoji: '🥚', name: 'el huevo' }, to: { emoji: '🐔', name: 'la gallina' } },
  { from: { emoji: '🍯', name: 'la miel' }, to: { emoji: '🐝', name: 'la abeja' } },
  { from: { emoji: '🧶', name: 'la lana' }, to: { emoji: '🐑', name: 'la oveja' } },
  { from: { emoji: '🍎', name: 'la manzana' }, to: { emoji: '🌳', name: 'el árbol' } },
  { from: { emoji: '🍐', name: 'la pera' }, to: { emoji: '🌳', name: 'el árbol' } },
  { from: { emoji: '🍊', name: 'la naranja' }, to: { emoji: '🌳', name: 'el árbol' } },
  { from: { emoji: '🍒', name: 'las cerezas' }, to: { emoji: '🌳', name: 'el árbol' } },
  { from: { emoji: '🍋', name: 'el limón' }, to: { emoji: '🌳', name: 'el árbol' } },
  { from: { emoji: '🥥', name: 'el coco' }, to: { emoji: '🌳', name: 'el árbol' } },
  { from: { emoji: '🍞', name: 'el pan' }, to: { emoji: '🌾', name: 'el trigo' } },
  { from: { emoji: '🥐', name: 'el cruasán' }, to: { emoji: '🌾', name: 'el trigo' } },
  { from: { emoji: '🍝', name: 'la pasta' }, to: { emoji: '🌾', name: 'el trigo' } },
];

// --- ¿Para qué lo usamos? (89) ------------------------------------------------------

/**
 * Categorías **disjuntas**: ningún dibujo aparece en dos, o habría dos
 * respuestas buenas (lo comprueba `categoryMember` al construirse).
 *
 * `article` no se usa aquí — el enunciado es «¿Cuál usamos para lavarnos?», sin
 * artículo — pero el tipo `Category` lo pide, así que va relleno.
 */
export const HOUSE_USES: readonly Category[] = [
  {
    name: 'para lavarnos',
    article: 'un',
    items: [
      { emoji: '🧼', name: 'el jabón' },
      { emoji: '🚿', name: 'la ducha' },
      { emoji: '🛁', name: 'la bañera' },
      { emoji: '🧴', name: 'el champú' },
      { emoji: '🧽', name: 'la esponja' },
    ],
  },
  {
    name: 'para comer',
    article: 'un',
    items: [
      { emoji: '🍴', name: 'el tenedor' },
      { emoji: '🥄', name: 'la cuchara' },
      { emoji: '🍽️', name: 'el plato' },
      { emoji: '🥢', name: 'los palillos' },
    ],
  },
  {
    name: 'para jugar',
    article: 'un',
    items: [
      { emoji: '⚽', name: 'la pelota' },
      { emoji: '🧸', name: 'el osito' },
      { emoji: '🎈', name: 'el globo' },
      { emoji: '🪀', name: 'el yoyó' },
      { emoji: '🧩', name: 'el puzle' },
    ],
  },
  {
    name: 'para vestirnos',
    article: 'un',
    items: [
      { emoji: '👕', name: 'la camiseta' },
      { emoji: '👟', name: 'las zapatillas' },
      { emoji: '🧦', name: 'los calcetines' },
      { emoji: '🧢', name: 'la gorra' },
    ],
  },
  {
    name: 'para pintar',
    article: 'un',
    items: [
      { emoji: '✏️', name: 'el lápiz' },
      { emoji: '🖍️', name: 'la cera' },
      { emoji: '🖌️', name: 'el pincel' },
      { emoji: '🎨', name: 'la paleta' },
    ],
  },
];

// --- ¿Cuántos tenemos? (90) ------------------------------------------------------

/**
 * El dibujo del enunciado es siempre el mismo peque, no la parte que se cuenta:
 * 👂 es **una** oreja y la respuesta son dos, así que enseñarla sería enseñar la
 * respuesta equivocada.
 */
export const BODY_COUNTS: ReadonlyArray<{ question: string; answer: number }> = [
  { question: '¿Cuántos ojos tenemos?', answer: 2 },
  { question: '¿Cuántas orejas tenemos?', answer: 2 },
  { question: '¿Cuántas manos tenemos?', answer: 2 },
  { question: '¿Cuántos pies tenemos?', answer: 2 },
  { question: '¿Cuántas piernas tenemos?', answer: 2 },
  { question: '¿Cuántos brazos tenemos?', answer: 2 },
  { question: '¿Cuántas rodillas tenemos?', answer: 2 },
  { question: '¿Cuántos codos tenemos?', answer: 2 },
  { question: '¿Cuántos hombros tenemos?', answer: 2 },
  { question: '¿Cuántas narices tenemos?', answer: 1 },
  { question: '¿Cuántas bocas tenemos?', answer: 1 },
  { question: '¿Cuántas cabezas tenemos?', answer: 1 },
  { question: '¿Cuántas lenguas tenemos?', answer: 1 },
  { question: '¿Cuántos dedos tenemos en una mano?', answer: 5 },
  { question: '¿Cuántos dedos tenemos en un pie?', answer: 5 },
];

// --- Paso a paso (91) --------------------------------------------------------------

/**
 * Rutinas cuyo orden es **forzoso**: primero el grifo y luego el jabón, no al
 * revés. Nada de «calcetines antes o después del pantalón», que admite las dos.
 */
export const CARE_ROUTINES: ReadonlyArray<readonly Item[]> = [
  [
    { emoji: '🚰', name: 'abrir el grifo' },
    { emoji: '🧼', name: 'el jabón' },
    { emoji: '👏', name: 'frotar las manos' },
    { emoji: '💧', name: 'aclarar' },
    { emoji: '✨', name: 'manos limpias' },
  ],
  [
    { emoji: '🥖', name: 'el pan' },
    { emoji: '🧀', name: 'el queso' },
    { emoji: '🥪', name: 'el bocadillo' },
  ],
  [
    { emoji: '🌙', name: 'se hace de noche' },
    { emoji: '🛁', name: 'el baño' },
    { emoji: '📖', name: 'el cuento' },
    { emoji: '🛏️', name: 'la cama' },
  ],
  [
    { emoji: '📄', name: 'el papel' },
    { emoji: '✏️', name: 'el lápiz' },
    { emoji: '🖍️', name: 'los colores' },
    { emoji: '🖼️', name: 'el dibujo' },
  ],
];
