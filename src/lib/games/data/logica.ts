/** Contenido del mundo «El Laberinto de la Lógica». */

import type { Category, Item, Pair } from '../generators';

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

/**
 * Clases para «¿Cuál es una fruta?».
 *
 * Tienen que ser **disjuntas** (lo comprueba `categoryMember` al construirse) y
 * además indiscutibles: nada de tomate, aguacate ni pepino en las frutas, que
 * botánicamente lo son y dejarían la pregunta con dos respuestas buenas.
 */
export const CLASS_SETS: readonly Category[] = [
  {
    name: 'fruta',
    article: 'una',
    items: [
      { emoji: '🍎', name: 'la manzana' },
      { emoji: '🍌', name: 'el plátano' },
      { emoji: '🍓', name: 'la fresa' },
      { emoji: '🍊', name: 'la naranja' },
      { emoji: '🍇', name: 'las uvas' },
      { emoji: '🍒', name: 'las cerezas' },
      { emoji: '🍉', name: 'la sandía' },
      { emoji: '🍐', name: 'la pera' },
    ],
  },
  {
    name: 'verdura',
    article: 'una',
    items: [
      { emoji: '🥕', name: 'la zanahoria' },
      { emoji: '🥦', name: 'el brócoli' },
      { emoji: '🌽', name: 'el maíz' },
      { emoji: '🥬', name: 'la lechuga' },
      { emoji: '🧅', name: 'la cebolla' },
      { emoji: '🥔', name: 'la patata' },
    ],
  },
  {
    name: 'animal',
    article: 'un',
    items: [
      { emoji: '🐶', name: 'el perro' },
      { emoji: '🐱', name: 'el gato' },
      { emoji: '🐰', name: 'el conejo' },
      { emoji: '🐻', name: 'el oso' },
      { emoji: '🦊', name: 'el zorro' },
      { emoji: '🐴', name: 'el caballo' },
      { emoji: '🐘', name: 'el elefante' },
      { emoji: '🦁', name: 'el león' },
    ],
  },
  {
    name: 'flor',
    article: 'una',
    items: [
      { emoji: '🌸', name: 'la flor de cerezo' },
      { emoji: '🌻', name: 'el girasol' },
      { emoji: '🌷', name: 'el tulipán' },
      { emoji: '🌹', name: 'la rosa' },
      { emoji: '🌼', name: 'la margarita' },
      { emoji: '🌺', name: 'la flor de hibisco' },
    ],
  },
  {
    // «vehículo» y no «coche»: la respuesta correcta puede ser el tren o el
    // autobús, y entonces «¿cuál es un coche?» no tendría respuesta buena.
    name: 'vehículo',
    article: 'un',
    items: [
      { emoji: '🚗', name: 'el coche' },
      { emoji: '🚌', name: 'el autobús' },
      { emoji: '🚲', name: 'la bicicleta' },
      { emoji: '🚂', name: 'el tren' },
      { emoji: '🚚', name: 'el camión' },
      { emoji: '🚕', name: 'el taxi' },
    ],
  },
  {
    name: 'instrumento',
    article: 'un',
    items: [
      { emoji: '🎸', name: 'la guitarra' },
      { emoji: '🥁', name: 'el tambor' },
      { emoji: '🎺', name: 'la trompeta' },
      { emoji: '🎷', name: 'el saxofón' },
      { emoji: '🎹', name: 'el piano' },
      { emoji: '🎻', name: 'el violín' },
    ],
  },
  {
    name: 'prenda de ropa',
    article: 'una',
    items: [
      { emoji: '👕', name: 'la camiseta' },
      { emoji: '👖', name: 'el pantalón' },
      { emoji: '🧦', name: 'el calcetín' },
      { emoji: '👗', name: 'el vestido' },
      { emoji: '🧥', name: 'el abrigo' },
      { emoji: '👟', name: 'la zapatilla' },
      { emoji: '🧤', name: 'el guante' },
      { emoji: '🧣', name: 'la bufanda' },
    ],
  },
  {
    name: 'pelota',
    article: 'una',
    items: [
      { emoji: '⚽', name: 'el balón de fútbol' },
      { emoji: '🏀', name: 'el balón de baloncesto' },
      { emoji: '🎾', name: 'la pelota de tenis' },
      { emoji: '🏈', name: 'el balón de rugby' },
      { emoji: '⚾', name: 'la pelota de béisbol' },
      { emoji: '🏐', name: 'el balón de voleibol' },
    ],
  },
];

/**
 * Analogías: A va con B como C va con D.
 *
 * El generador las plantea también al revés (C/D primero y se pregunta por B),
 * así que cada cuarteto da dos ejercicios distintos.
 *
 * Lo delicado aquí no es el cuarteto, es que **ninguna respuesta de otro
 * cuarteto sea defendible**: por eso no conviven la vaca y el queso (la leche
 * también sale de la vaca), ni el huevo y el pollito en cuartetos distintos.
 */
export interface Analogy {
  a: Item;
  b: Item;
  c: Item;
  d: Item;
}

export const ANALOGIES: readonly Analogy[] = [
  {
    a: { emoji: '🐶', name: 'el perro' },
    b: { emoji: '🦴', name: 'el hueso' },
    c: { emoji: '🐱', name: 'el gato' },
    d: { emoji: '🐟', name: 'el pez' },
  },
  {
    a: { emoji: '🐭', name: 'el ratón' },
    b: { emoji: '🧀', name: 'el queso' },
    c: { emoji: '🐘', name: 'el elefante' },
    d: { emoji: '🥜', name: 'el cacahuete' },
  },
  {
    a: { emoji: '🐔', name: 'la gallina' },
    b: { emoji: '🥚', name: 'el huevo' },
    c: { emoji: '🐑', name: 'la oveja' },
    d: { emoji: '🧶', name: 'la lana' },
  },
  {
    a: { emoji: '☀️', name: 'el sol' },
    b: { emoji: '🕶️', name: 'las gafas de sol' },
    c: { emoji: '🌧️', name: 'la lluvia' },
    d: { emoji: '☔', name: 'el paraguas' },
  },
  {
    a: { emoji: '🐟', name: 'el pez' },
    b: { emoji: '🌊', name: 'el mar' },
    c: { emoji: '🐫', name: 'el camello' },
    d: { emoji: '🏜️', name: 'el desierto' },
  },
  {
    a: { emoji: '🚗', name: 'el coche' },
    b: { emoji: '🛣️', name: 'la carretera' },
    c: { emoji: '🚂', name: 'el tren' },
    d: { emoji: '🛤️', name: 'las vías' },
  },
  {
    a: { emoji: '🐛', name: 'la oruga' },
    b: { emoji: '🦋', name: 'la mariposa' },
    c: { emoji: '🐣', name: 'el pollito' },
    d: { emoji: '🐔', name: 'la gallina' },
  },
  {
    a: { emoji: '🧤', name: 'el guante' },
    b: { emoji: '✋', name: 'la mano' },
    c: { emoji: '👟', name: 'la zapatilla' },
    d: { emoji: '🦶', name: 'el pie' },
  },
  {
    a: { emoji: '🐒', name: 'el mono' },
    b: { emoji: '🍌', name: 'el plátano' },
    c: { emoji: '🐰', name: 'el conejo' },
    d: { emoji: '🥕', name: 'la zanahoria' },
  },
  {
    a: { emoji: '🍞', name: 'el pan' },
    b: { emoji: '🌾', name: 'el trigo' },
    c: { emoji: '🍟', name: 'las patatas fritas' },
    d: { emoji: '🥔', name: 'la patata' },
  },
];

/**
 * En qué se convierte cada cosa. Se juegan como secuencias de dos pasos.
 *
 * Ninguna causa puede tener dos efectos defendibles entre los de la tabla: por
 * eso está la bellota (que solo da árbol) y no la semilla (que igual da flor
 * que árbol), y por eso no hay ni gota de agua ni arcoíris a la vez.
 */
export const CAUSE_EFFECT: ReadonlyArray<readonly Item[]> = [
  [
    { emoji: '🐛', name: 'la oruga' },
    { emoji: '🦋', name: 'la mariposa' },
  ],
  [
    { emoji: '🥚', name: 'el huevo' },
    { emoji: '🐣', name: 'el pollito' },
  ],
  [
    { emoji: '🌾', name: 'el trigo' },
    { emoji: '🍞', name: 'el pan' },
  ],
  [
    { emoji: '🐑', name: 'la oveja' },
    { emoji: '🧶', name: 'la lana' },
  ],
  [
    { emoji: '🥛', name: 'la leche' },
    { emoji: '🧀', name: 'el queso' },
  ],
  [
    { emoji: '🥔', name: 'la patata' },
    { emoji: '🍟', name: 'las patatas fritas' },
  ],
  [
    { emoji: '🐝', name: 'la abeja' },
    { emoji: '🍯', name: 'la miel' },
  ],
  [
    { emoji: '🌽', name: 'el maíz' },
    { emoji: '🍿', name: 'las palomitas' },
  ],
  [
    { emoji: '☁️', name: 'la nube' },
    { emoji: '🌧️', name: 'la lluvia' },
  ],
  [
    { emoji: '🌰', name: 'la bellota' },
    { emoji: '🌳', name: 'el árbol' },
  ],
  [
    { emoji: '🍊', name: 'la naranja' },
    { emoji: '🧃', name: 'el zumo' },
  ],
  [
    { emoji: '🧱', name: 'los ladrillos' },
    { emoji: '🏠', name: 'la casa' },
  ],
  [
    { emoji: '🌧️', name: 'la lluvia' },
    { emoji: '🌈', name: 'el arcoíris' },
  ],
];

/**
 * Grupos de cosas del mismo color, para el intruso por color.
 *
 * Solo objetos de un color liso y evidente: nada de manzanas (rojas *y*
 * verdes) ni de mazorcas (amarillas *y* verdes).
 */
export const COLOR_GROUPS: readonly Category[] = [
  {
    name: 'rojo',
    article: 'un',
    items: [
      { emoji: '🔴', name: 'el círculo rojo' },
      { emoji: '🍓', name: 'la fresa' },
      { emoji: '🌹', name: 'la rosa' },
      { emoji: '🚒', name: 'el camión de bomberos' },
      { emoji: '❤️', name: 'el corazón' },
      { emoji: '🍒', name: 'las cerezas' },
    ],
  },
  {
    name: 'amarillo',
    article: 'un',
    items: [
      { emoji: '🟡', name: 'el círculo amarillo' },
      { emoji: '🍋', name: 'el limón' },
      { emoji: '🌻', name: 'el girasol' },
      { emoji: '🧀', name: 'el queso' },
      { emoji: '🐥', name: 'el pollito' },
      { emoji: '⭐', name: 'la estrella' },
    ],
  },
  {
    name: 'verde',
    article: 'un',
    items: [
      { emoji: '🟢', name: 'el círculo verde' },
      { emoji: '🥦', name: 'el brócoli' },
      { emoji: '🐸', name: 'la rana' },
      { emoji: '🌲', name: 'el pino' },
      { emoji: '🥬', name: 'la lechuga' },
      { emoji: '🍀', name: 'el trébol' },
    ],
  },
  {
    name: 'azul',
    article: 'un',
    items: [
      { emoji: '🔵', name: 'el círculo azul' },
      { emoji: '💙', name: 'el corazón azul' },
      { emoji: '🌊', name: 'la ola' },
      { emoji: '🐳', name: 'la ballena' },
      { emoji: '👖', name: 'el pantalón vaquero' },
    ],
  },
  {
    name: 'naranja',
    article: 'un',
    items: [
      { emoji: '🟠', name: 'el círculo naranja' },
      { emoji: '🍊', name: 'la naranja' },
      { emoji: '🥕', name: 'la zanahoria' },
      { emoji: '🎃', name: 'la calabaza' },
      { emoji: '🦊', name: 'el zorro' },
      { emoji: '🏀', name: 'el balón de baloncesto' },
    ],
  },
  {
    name: 'morado',
    article: 'un',
    items: [
      { emoji: '🟣', name: 'el círculo morado' },
      { emoji: '🍇', name: 'las uvas' },
      { emoji: '🍆', name: 'la berenjena' },
      { emoji: '💜', name: 'el corazón morado' },
      { emoji: '👾', name: 'el marcianito' },
    ],
  },
  {
    name: 'marrón',
    article: 'un',
    items: [
      { emoji: '🟤', name: 'el círculo marrón' },
      { emoji: '🐻', name: 'el oso' },
      { emoji: '🍫', name: 'la chocolatina' },
      { emoji: '🥔', name: 'la patata' },
      { emoji: '🌰', name: 'la bellota' },
    ],
  },
  {
    name: 'blanco',
    article: 'un',
    items: [
      { emoji: '⚪', name: 'el círculo blanco' },
      { emoji: '🥚', name: 'el huevo' },
      { emoji: '☁️', name: 'la nube' },
      { emoji: '🦢', name: 'el cisne' },
      { emoji: '🤍', name: 'el corazón blanco' },
    ],
  },
  {
    name: 'negro',
    article: 'un',
    items: [
      { emoji: '⚫', name: 'el círculo negro' },
      { emoji: '🖤', name: 'el corazón negro' },
      { emoji: '🎩', name: 'la chistera' },
      { emoji: '🕷️', name: 'la araña' },
      { emoji: '🐜', name: 'la hormiga' },
    ],
  },
];

/**
 * Cada cosa con su dueño. Se enseña el objeto y hay que tocar de quién es.
 *
 * Todos los dueños son distintos y ninguno podría reclamar el objeto de otro:
 * el gato se queda sin pingüino al lado precisamente por el pez.
 */
export const BELONGINGS: readonly Pair[] = [
  { from: { emoji: '🐚', name: 'la concha' }, to: { emoji: '🐌', name: 'el caracol' } },
  { from: { emoji: '🍯', name: 'la miel' }, to: { emoji: '🐝', name: 'la abeja' } },
  { from: { emoji: '🧶', name: 'la lana' }, to: { emoji: '🐑', name: 'la oveja' } },
  { from: { emoji: '🕸️', name: 'la telaraña' }, to: { emoji: '🕷️', name: 'la araña' } },
  { from: { emoji: '🥚', name: 'el huevo' }, to: { emoji: '🐔', name: 'la gallina' } },
  { from: { emoji: '🌰', name: 'la bellota' }, to: { emoji: '🐿️', name: 'la ardilla' } },
  { from: { emoji: '🍌', name: 'el plátano' }, to: { emoji: '🐒', name: 'el mono' } },
  { from: { emoji: '🥕', name: 'la zanahoria' }, to: { emoji: '🐰', name: 'el conejo' } },
  { from: { emoji: '🧀', name: 'el queso' }, to: { emoji: '🐭', name: 'el ratón' } },
  { from: { emoji: '🦴', name: 'el hueso' }, to: { emoji: '🐶', name: 'el perro' } },
  { from: { emoji: '🥛', name: 'la leche' }, to: { emoji: '🐄', name: 'la vaca' } },
  { from: { emoji: '🐟', name: 'el pez' }, to: { emoji: '🐱', name: 'el gato' } },
  { from: { emoji: '🍼', name: 'el biberón' }, to: { emoji: '👶', name: 'el bebé' } },
];
