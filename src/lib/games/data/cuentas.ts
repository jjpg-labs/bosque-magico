/** Contenido del mundo «La Cueva de las Cuentas». */

/**
 * Un objeto contable con las formas que hacen falta para redactar el enunciado.
 *
 * El enunciado se lee en voz alta, así que no vale con el plural: «y 1 peras»
 * suena mal y a los cuatro años eso distrae más que el propio ejercicio. El
 * género decide además si la pregunta acaba en «¿Cuántos quedan?» o
 * «¿Cuántas quedan?».
 */
export interface Countable {
  emoji: string;
  /** Singular: «y 1 pera». */
  one: string;
  /** Plural: «3 peras». */
  many: string;
  fem: boolean;
}

/** Cosas que se reparten entre amigos: todas se cuentan de una en una. */
export const SHARE_TREATS: readonly Countable[] = [
  { emoji: '🍪', one: 'galleta', many: 'galletas', fem: true },
  { emoji: '🍓', one: 'fresa', many: 'fresas', fem: true },
  { emoji: '🌰', one: 'bellota', many: 'bellotas', fem: true },
  { emoji: '🍌', one: 'plátano', many: 'plátanos', fem: false },
  { emoji: '🥕', one: 'zanahoria', many: 'zanahorias', fem: true },
  { emoji: '🍇', one: 'racimo', many: 'racimos', fem: false },
];

/**
 * Los amigos entre los que se reparte. Todos los de una ronda son el mismo
 * animal: si fueran distintos, la niña se pondría a mirar quién es quién en vez
 * de contar cuántos hay.
 */
export const SHARE_FRIENDS: readonly string[] = ['🐻', '🐰', '🐱', '🐵', '🐼'];

/**
 * Lo que se echa a la cesta de la compra.
 *
 * Se pregunta «¿cuántas cosas hay?» y nunca «¿cuántas frutas?»: el tomate es
 * fruta botánicamente y la pregunta tendría dos respuestas defendibles.
 */
export const BASKET_ITEMS: readonly Countable[] = [
  { emoji: '🍎', one: 'manzana', many: 'manzanas', fem: true },
  { emoji: '🍐', one: 'pera', many: 'peras', fem: true },
  { emoji: '🍌', one: 'plátano', many: 'plátanos', fem: false },
  { emoji: '🍊', one: 'naranja', many: 'naranjas', fem: true },
  { emoji: '🍋', one: 'limón', many: 'limones', fem: false },
  { emoji: '🍓', one: 'fresa', many: 'fresas', fem: true },
  { emoji: '🥕', one: 'zanahoria', many: 'zanahorias', fem: true },
  { emoji: '🥔', one: 'patata', many: 'patatas', fem: true },
];

/** Escenas de resta: estaban aquí y se han ido a otro sitio, nunca ha pasado nada malo. */
export const LEAVE_SCENES: ReadonlyArray<{
  emoji: string;
  many: string;
  /** Adónde se han ido, en pasado: «se fueron volando». */
  gone: string;
  fem: boolean;
}> = [
  { emoji: '🐦', many: 'pajaritos', gone: 'se fueron volando', fem: false },
  { emoji: '🦋', many: 'mariposas', gone: 'se fueron volando', fem: true },
  { emoji: '🐝', many: 'abejas', gone: 'se fueron a las flores', fem: true },
  { emoji: '🐟', many: 'peces', gone: 'se escondieron', fem: false },
  { emoji: '🐰', many: 'conejos', gone: 'se fueron saltando', fem: false },
  { emoji: '🐌', many: 'caracoles', gone: 'se fueron despacito', fem: false },
  { emoji: '🐞', many: 'mariquitas', gone: 'se fueron a jugar', fem: true },
  { emoji: '🎈', many: 'globos', gone: 'se fueron al cielo', fem: false },
  { emoji: '🐤', many: 'pollitos', gone: 'se fueron con su mamá', fem: false },
  { emoji: '🐜', many: 'hormigas', gone: 'se fueron al hormiguero', fem: true },
];

/**
 * Plantillas de problema hablado.
 *
 * El dibujo solo enseña con cuántas cosas se empieza: lo que hay que sumar o
 * restar va únicamente en el enunciado, que por eso se mantiene corto.
 */
export interface WordProblem {
  /** Con artículo y mayúscula inicial: abre la frase. */
  character: string;
  object: Countable;
  /** Verbo en pasado para cuando consigue más: «encontró». */
  gain: string;
  /** Verbo en pasado para cuando se le van: «regaló». */
  loss: string;
}

export const WORD_PROBLEMS: readonly WordProblem[] = [
  {
    character: 'La ardilla',
    object: { emoji: '🌰', one: 'bellota', many: 'bellotas', fem: true },
    gain: 'encontró',
    loss: 'regaló',
  },
  {
    character: 'El conejo',
    object: { emoji: '🥕', one: 'zanahoria', many: 'zanahorias', fem: true },
    gain: 'recogió',
    loss: 'se comió',
  },
  {
    character: 'El osito',
    object: { emoji: '🍪', one: 'galleta', many: 'galletas', fem: true },
    gain: 'encontró',
    loss: 'se comió',
  },
  {
    character: 'El pájaro',
    object: { emoji: '🍒', one: 'cereza', many: 'cerezas', fem: true },
    gain: 'encontró',
    loss: 'se comió',
  },
  {
    character: 'El erizo',
    object: { emoji: '🍎', one: 'manzana', many: 'manzanas', fem: true },
    gain: 'recogió',
    loss: 'regaló',
  },
  {
    character: 'La tortuga',
    object: { emoji: '🍓', one: 'fresa', many: 'fresas', fem: true },
    gain: 'recogió',
    loss: 'se comió',
  },
  {
    character: 'El mono',
    object: { emoji: '🍌', one: 'plátano', many: 'plátanos', fem: false },
    gain: 'cogió',
    loss: 'se comió',
  },
  {
    character: 'La abeja',
    object: { emoji: '🌸', one: 'flor', many: 'flores', fem: true },
    gain: 'encontró',
    loss: 'regaló',
  },
];
