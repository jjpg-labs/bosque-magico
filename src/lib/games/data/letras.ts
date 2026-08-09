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

/**
 * El abecedario español completo, con la K y la W.
 *
 * No es el mismo pool que `ALPHABET` (`generators/letras.ts`), que las deja
 * fuera por no ser iniciales útiles en español. Aquí sí hacen falta: en «El
 * Abecedario en Orden» lo que se pide es precisamente el orden, y saltarse dos
 * letras enseñaría un abecedario que no existe.
 */
export const FULL_ALPHABET: readonly string[] = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

/** Las letras con las que puede acabar una palabra en español. */
export const FINAL_LETTERS: readonly string[] = ['A', 'E', 'I', 'O', 'U', 'N', 'L', 'R', 'S', 'Z'];

export interface FinalLetterWord {
  emoji: string;
  /** En minúscula: se locuta, no se usa como respuesta. */
  word: string;
  /** La última letra, en mayúscula: es la respuesta. */
  last: string;
}

/**
 * Palabras para «¿Con Qué Letra Acaba?».
 *
 * Solo terminaciones limpias — vocal, `-n`, `-l`, `-r`, `-s`, `-z` —: son las
 * que se oyen con claridad al final. Nada de `-d` ni `-j`, que en habla normal
 * se comen o se confunden.
 *
 * El emoji es decorativo: la palabra se escribe en el enunciado y se lee en voz
 * alta, así que da igual que el dibujo admita más de un nombre.
 */
export const FINAL_LETTER_WORDS: readonly FinalLetterWord[] = [
  { emoji: '☀️', word: 'sol', last: 'L' },
  { emoji: '🌳', word: 'árbol', last: 'L' },
  { emoji: '🍯', word: 'miel', last: 'L' },
  { emoji: '🍞', word: 'pan', last: 'N' },
  { emoji: '🍋', word: 'limón', last: 'N' },
  { emoji: '🐭', word: 'ratón', last: 'N' },
  { emoji: '🚂', word: 'tren', last: 'N' },
  { emoji: '🧦', word: 'calcetín', last: 'N' },
  { emoji: '⚽', word: 'balón', last: 'N' },
  { emoji: '🐬', word: 'delfín', last: 'N' },
  { emoji: '🌸', word: 'flor', last: 'R' },
  { emoji: '🐟', word: 'pez', last: 'Z' },
  { emoji: '👃', word: 'nariz', last: 'Z' },
  { emoji: '💡', word: 'luz', last: 'Z' },
  { emoji: '✏️', word: 'lápiz', last: 'Z' },
  { emoji: '🚌', word: 'autobús', last: 'S' },
  { emoji: '🌵', word: 'cactus', last: 'S' },
  { emoji: '☂️', word: 'paraguas', last: 'S' },
  { emoji: '🐘', word: 'elefante', last: 'E' },
  { emoji: '🚗', word: 'coche', last: 'E' },
  { emoji: '🚀', word: 'cohete', last: 'E' },
  { emoji: '🚲', word: 'bici', last: 'I' },
  { emoji: '🌙', word: 'luna', last: 'A' },
  { emoji: '🐝', word: 'abeja', last: 'A' },
  { emoji: '🚪', word: 'puerta', last: 'A' },
  { emoji: '⭐', word: 'estrella', last: 'A' },
  { emoji: '🐔', word: 'gallina', last: 'A' },
  { emoji: '🥕', word: 'zanahoria', last: 'A' },
  { emoji: '🐢', word: 'tortuga', last: 'A' },
  { emoji: '🥄', word: 'cuchara', last: 'A' },
  { emoji: '🎂', word: 'tarta', last: 'A' },
  { emoji: '🍇', word: 'uva', last: 'A' },
  { emoji: '🐱', word: 'gato', last: 'O' },
  { emoji: '🎈', word: 'globo', last: 'O' },
  { emoji: '🎩', word: 'sombrero', last: 'O' },
  { emoji: '🧀', word: 'queso', last: 'O' },
  { emoji: '🎁', word: 'regalo', last: 'O' },
  { emoji: '🍌', word: 'plátano', last: 'O' },
  { emoji: '🦊', word: 'zorro', last: 'O' },
  { emoji: '🐧', word: 'pingüino', last: 'O' },
];

export interface SyllableWord {
  emoji: string;
  word: string;
  /** Sílabas en orden. La primera es la respuesta de «La Primera Sílaba». */
  syllables: readonly string[];
}

/**
 * Palabras separadas en sílabas, para las tres pruebas de sílabas: contar
 * palmadas (23), la sílaba inicial (24) y palabra larga o corta (28).
 *
 * De una a cinco sílabas, con suficientes de cada longitud para que la prueba
 * de palmadas pueda escalar por `tier` sin quedarse sin material.
 */
export const SYLLABLE_WORDS: readonly SyllableWord[] = [
  { emoji: '☀️', word: 'sol', syllables: ['sol'] },
  { emoji: '🍞', word: 'pan', syllables: ['pan'] },
  { emoji: '🌸', word: 'flor', syllables: ['flor'] },
  { emoji: '🐟', word: 'pez', syllables: ['pez'] },
  { emoji: '🚂', word: 'tren', syllables: ['tren'] },
  { emoji: '💡', word: 'luz', syllables: ['luz'] },
  { emoji: '🐱', word: 'gato', syllables: ['ga', 'to'] },
  { emoji: '🐶', word: 'perro', syllables: ['pe', 'rro'] },
  { emoji: '🏠', word: 'casa', syllables: ['ca', 'sa'] },
  { emoji: '🌙', word: 'luna', syllables: ['lu', 'na'] },
  { emoji: '✋', word: 'mano', syllables: ['ma', 'no'] },
  { emoji: '📕', word: 'libro', syllables: ['li', 'bro'] },
  { emoji: '🧀', word: 'queso', syllables: ['que', 'so'] },
  { emoji: '🎈', word: 'globo', syllables: ['glo', 'bo'] },
  { emoji: '☁️', word: 'nube', syllables: ['nu', 'be'] },
  { emoji: '🐸', word: 'rana', syllables: ['ra', 'na'] },
  { emoji: '🐄', word: 'vaca', syllables: ['va', 'ca'] },
  { emoji: '🚗', word: 'coche', syllables: ['co', 'che'] },
  { emoji: '🚪', word: 'puerta', syllables: ['puer', 'ta'] },
  { emoji: '🐭', word: 'ratón', syllables: ['ra', 'tón'] },
  { emoji: '👞', word: 'zapato', syllables: ['za', 'pa', 'to'] },
  { emoji: '🍎', word: 'manzana', syllables: ['man', 'za', 'na'] },
  { emoji: '🍌', word: 'plátano', syllables: ['plá', 'ta', 'no'] },
  { emoji: '🐢', word: 'tortuga', syllables: ['tor', 'tu', 'ga'] },
  { emoji: '🐴', word: 'caballo', syllables: ['ca', 'ba', 'llo'] },
  { emoji: '⚽', word: 'pelota', syllables: ['pe', 'lo', 'ta'] },
  { emoji: '🦒', word: 'jirafa', syllables: ['ji', 'ra', 'fa'] },
  { emoji: '🐜', word: 'hormiga', syllables: ['hor', 'mi', 'ga'] },
  { emoji: '🐝', word: 'abeja', syllables: ['a', 'be', 'ja'] },
  { emoji: '🐌', word: 'caracol', syllables: ['ca', 'ra', 'col'] },
  { emoji: '⭐', word: 'estrella', syllables: ['es', 'tre', 'lla'] },
  { emoji: '🍉', word: 'sandía', syllables: ['san', 'dí', 'a'] },
  { emoji: '🎸', word: 'guitarra', syllables: ['gui', 'ta', 'rra'] },
  { emoji: '☂️', word: 'paraguas', syllables: ['pa', 'ra', 'guas'] },
  { emoji: '👕', word: 'camiseta', syllables: ['ca', 'mi', 'se', 'ta'] },
  { emoji: '🦋', word: 'mariposa', syllables: ['ma', 'ri', 'po', 'sa'] },
  { emoji: '🐘', word: 'elefante', syllables: ['e', 'le', 'fan', 'te'] },
  { emoji: '🚲', word: 'bicicleta', syllables: ['bi', 'ci', 'cle', 'ta'] },
  { emoji: '💻', word: 'ordenador', syllables: ['or', 'de', 'na', 'dor'] },
  { emoji: '☎️', word: 'teléfono', syllables: ['te', 'lé', 'fo', 'no'] },
  { emoji: '🐞', word: 'mariquita', syllables: ['ma', 'ri', 'qui', 'ta'] },
  { emoji: '🍫', word: 'chocolate', syllables: ['cho', 'co', 'la', 'te'] },
  { emoji: '🐊', word: 'cocodrilo', syllables: ['co', 'co', 'dri', 'lo'] },
  { emoji: '🍊', word: 'mandarina', syllables: ['man', 'da', 'ri', 'na'] },
  { emoji: '🚁', word: 'helicóptero', syllables: ['he', 'li', 'cóp', 'te', 'ro'] },
  { emoji: '🦏', word: 'rinoceronte', syllables: ['ri', 'no', 'ce', 'ron', 'te'] },
];

export interface InitialSoundWord {
  emoji: string;
  word: string;
  /**
   * El **sonido** inicial, no la letra.
   *
   * En «Empiezan Igual» los distractores son los que no comparten esta clave,
   * así que agrupar por letra daría dos respuestas defendibles: «casa» y
   * «queso» empiezan igual al oído aunque se escriban con C y con Q, y «cebra»
   * no empieza como «casa» aunque las dos lleven C. Por eso `sound` es una
   * clave fonética (`K`, `Z`, `J`...) y no la inicial escrita.
   *
   * Por lo mismo no hay ni una palabra con V en la tabla: en español suena
   * exactamente igual que la B.
   */
  sound: string;
}

/**
 * Palabras agrupadas por sonido inicial, para «Empiezan Igual».
 *
 * Aquí el emoji **sí** tiene que ser inequívoco: sale como opción y la niña lo
 * nombra para sí misma. Si un dibujo admitiera dos nombres con sonidos
 * iniciales distintos, podría haber dos respuestas buenas.
 */
export const WORDS_BY_INITIAL: readonly InitialSoundWord[] = [
  { emoji: '🦋', word: 'mariposa', sound: 'M' },
  { emoji: '🍎', word: 'manzana', sound: 'M' },
  { emoji: '✋', word: 'mano', sound: 'M' },
  { emoji: '🐒', word: 'mono', sound: 'M' },
  { emoji: '🐶', word: 'perro', sound: 'P' },
  { emoji: '🍐', word: 'pera', sound: 'P' },
  { emoji: '🦆', word: 'pato', sound: 'P' },
  { emoji: '🐧', word: 'pingüino', sound: 'P' },
  { emoji: '🍌', word: 'plátano', sound: 'P' },
  { emoji: '☀️', word: 'sol', sound: 'S' },
  { emoji: '🐍', word: 'serpiente', sound: 'S' },
  { emoji: '🎩', word: 'sombrero', sound: 'S' },
  { emoji: '🍉', word: 'sandía', sound: 'S' },
  { emoji: '🐱', word: 'gato', sound: 'G' },
  { emoji: '🧢', word: 'gorra', sound: 'G' },
  { emoji: '🍪', word: 'galleta', sound: 'G' },
  { emoji: '🎸', word: 'guitarra', sound: 'G' },
  { emoji: '🐔', word: 'gallina', sound: 'G' },
  { emoji: '🐢', word: 'tortuga', sound: 'T' },
  { emoji: '🍅', word: 'tomate', sound: 'T' },
  { emoji: '🚂', word: 'tren', sound: 'T' },
  { emoji: '🎺', word: 'trompeta', sound: 'T' },
  { emoji: '🌙', word: 'luna', sound: 'L' },
  { emoji: '📕', word: 'libro', sound: 'L' },
  { emoji: '🍋', word: 'limón', sound: 'L' },
  { emoji: '🦁', word: 'león', sound: 'L' },
  { emoji: '🏠', word: 'casa', sound: 'K' },
  { emoji: '🚗', word: 'coche', sound: 'K' },
  { emoji: '🧀', word: 'queso', sound: 'K' },
  { emoji: '🐰', word: 'conejo', sound: 'K' },
  { emoji: '🥥', word: 'coco', sound: 'K' },
  { emoji: '🌸', word: 'flor', sound: 'F' },
  { emoji: '🍓', word: 'fresa', sound: 'F' },
  { emoji: '🦩', word: 'flamenco', sound: 'F' },
  { emoji: '🚲', word: 'bicicleta', sound: 'B' },
  { emoji: '👢', word: 'bota', sound: 'B' },
  { emoji: '🐋', word: 'ballena', sound: 'B' },
  { emoji: '🐭', word: 'ratón', sound: 'R' },
  { emoji: '🐸', word: 'rana', sound: 'R' },
  { emoji: '🌹', word: 'rosa', sound: 'R' },
  { emoji: '🎁', word: 'regalo', sound: 'R' },
  { emoji: '🐬', word: 'delfín', sound: 'D' },
  { emoji: '🦷', word: 'diente', sound: 'D' },
  { emoji: '🎲', word: 'dado', sound: 'D' },
  { emoji: '💰', word: 'dinero', sound: 'D' },
  { emoji: '🥕', word: 'zanahoria', sound: 'Z' },
  { emoji: '👞', word: 'zapato', sound: 'Z' },
  { emoji: '🦊', word: 'zorro', sound: 'Z' },
  { emoji: '🦓', word: 'cebra', sound: 'Z' },
  { emoji: '🍒', word: 'cerezas', sound: 'Z' },
  { emoji: '🦒', word: 'jirafa', sound: 'J' },
  { emoji: '🧼', word: 'jabón', sound: 'J' },
  { emoji: '🌻', word: 'girasol', sound: 'J' },
  { emoji: '🌰', word: 'nuez', sound: 'N' },
  { emoji: '☁️', word: 'nube', sound: 'N' },
  { emoji: '👃', word: 'nariz', sound: 'N' },
  { emoji: '❄️', word: 'nieve', sound: 'N' },
  { emoji: '🐝', word: 'abeja', sound: 'A' },
  { emoji: '🌳', word: 'árbol', sound: 'A' },
  { emoji: '✈️', word: 'avión', sound: 'A' },
  { emoji: '💍', word: 'anillo', sound: 'A' },
  { emoji: '🐘', word: 'elefante', sound: 'E' },
  { emoji: '🦔', word: 'erizo', sound: 'E' },
  { emoji: '⭐', word: 'estrella', sound: 'E' },
  { emoji: '🧹', word: 'escoba', sound: 'E' },
  { emoji: '🐻', word: 'oso', sound: 'O' },
  { emoji: '🐛', word: 'oruga', sound: 'O' },
  { emoji: '👁️', word: 'ojo', sound: 'O' },
  { emoji: '🐑', word: 'oveja', sound: 'O' },
  { emoji: '🧲', word: 'imán', sound: 'I' },
  { emoji: '🏝️', word: 'isla', sound: 'I' },
  { emoji: '⛪', word: 'iglesia', sound: 'I' },
  { emoji: '🦎', word: 'iguana', sound: 'I' },
  { emoji: '🍇', word: 'uvas', sound: 'U' },
  { emoji: '🦄', word: 'unicornio', sound: 'U' },
  { emoji: '💅', word: 'uñas', sound: 'U' },
];

export interface OneVowelWord {
  emoji: string;
  word: string;
  /** La única vocal que suena dentro. */
  vowel: string;
}

/**
 * Palabras con una sola vocal, para «La Vocal Escondida».
 *
 * «Una sola vocal» quiere decir una sola vocal **distinta**: «coco» y «bebé»
 * valen igual que «sol», porque la respuesta sigue siendo una y solo una. Lo
 * que no entra es nada con dos vocales diferentes, ni diptongos como «rey» o
 * «nuez», donde se oyen dos.
 */
export const ONE_VOWEL_WORDS: readonly OneVowelWord[] = [
  { emoji: '🍞', word: 'pan', vowel: 'A' },
  { emoji: '🧂', word: 'sal', vowel: 'A' },
  { emoji: '🌊', word: 'mar', vowel: 'A' },
  { emoji: '🐸', word: 'rana', vowel: 'A' },
  { emoji: '🐄', word: 'vaca', vowel: 'A' },
  { emoji: '🏠', word: 'casa', vowel: 'A' },
  { emoji: '🛏️', word: 'cama', vowel: 'A' },
  { emoji: '🍮', word: 'flan', vowel: 'A' },
  { emoji: '🚂', word: 'tren', vowel: 'E' },
  { emoji: '🐟', word: 'pez', vowel: 'E' },
  { emoji: '3️⃣', word: 'tres', vowel: 'E' },
  { emoji: '📅', word: 'mes', vowel: 'E' },
  { emoji: '👶', word: 'bebé', vowel: 'E' },
  { emoji: '🍵', word: 'té', vowel: 'E' },
  { emoji: '🥅', word: 'red', vowel: 'E' },
  { emoji: '🏁', word: 'fin', vowel: 'I' },
  { emoji: '✅', word: 'sí', vowel: 'I' },
  { emoji: '🚲', word: 'bici', vowel: 'I' },
  { emoji: '🥝', word: 'kiwi', vowel: 'I' },
  { emoji: '☀️', word: 'sol', vowel: 'O' },
  { emoji: '🌸', word: 'flor', vowel: 'O' },
  { emoji: '2️⃣', word: 'dos', vowel: 'O' },
  { emoji: '⚽', word: 'gol', vowel: 'O' },
  { emoji: '❌', word: 'no', vowel: 'O' },
  { emoji: '👁️', word: 'ojo', vowel: 'O' },
  { emoji: '🐻', word: 'oso', vowel: 'O' },
  { emoji: '🥥', word: 'coco', vowel: 'O' },
  { emoji: '🏍️', word: 'moto', vowel: 'O' },
  { emoji: '🎈', word: 'globo', vowel: 'O' },
  { emoji: '🦜', word: 'loro', vowel: 'O' },
  { emoji: '🐂', word: 'toro', vowel: 'O' },
  { emoji: '💡', word: 'luz', vowel: 'U' },
  { emoji: '🚌', word: 'bus', vowel: 'U' },
  { emoji: '🧭', word: 'sur', vowel: 'U' },
];

export interface EverydayObject {
  emoji: string;
  /** Con mayúscula inicial: la letra inicial es la respuesta. */
  name: string;
}

/**
 * Cosas del día a día para «¿Con Qué Empieza?».
 *
 * Cada dibujo tiene que tener **un** nombre claro en español de España, porque
 * la respuesta es su letra inicial: fuera el reloj (¿o despertador?), el
 * portátil (¿u ordenador?) y el velero (¿o barco?, y además B y V suenan
 * igual). Fuera también los dígrafos, CH y LL, que se escriben con dos letras
 * y aquí solo cabe una.
 */
export const EVERYDAY_OBJECTS: readonly EverydayObject[] = [
  { emoji: '🎒', name: 'Mochila' },
  { emoji: '🧀', name: 'Queso' },
  { emoji: '👞', name: 'Zapato' },
  { emoji: '📕', name: 'Libro' },
  { emoji: '✏️', name: 'Lápiz' },
  { emoji: '🚗', name: 'Coche' },
  { emoji: '🏠', name: 'Casa' },
  { emoji: '🥄', name: 'Cuchara' },
  { emoji: '🚪', name: 'Puerta' },
  { emoji: '🧼', name: 'Jabón' },
  { emoji: '🧦', name: 'Calcetines' },
  { emoji: '👕', name: 'Camiseta' },
  { emoji: '🧤', name: 'Guantes' },
  { emoji: '🧣', name: 'Bufanda' },
  { emoji: '👜', name: 'Bolso' },
  { emoji: '☂️', name: 'Paraguas' },
  { emoji: '🎈', name: 'Globo' },
  { emoji: '🥁', name: 'Tambor' },
  { emoji: '🎸', name: 'Guitarra' },
  { emoji: '✂️', name: 'Tijeras' },
  { emoji: '📏', name: 'Regla' },
  { emoji: '🚲', name: 'Bicicleta' },
  { emoji: '🚂', name: 'Tren' },
  { emoji: '✈️', name: 'Avión' },
  { emoji: '🚀', name: 'Cohete' },
  { emoji: '🍞', name: 'Pan' },
  { emoji: '🍎', name: 'Manzana' },
  { emoji: '🍓', name: 'Fresa' },
  { emoji: '🥕', name: 'Zanahoria' },
  { emoji: '🍪', name: 'Galleta' },
  { emoji: '🔔', name: 'Campana' },
  { emoji: '🎁', name: 'Regalo' },
  { emoji: '🔦', name: 'Linterna' },
  { emoji: '🧲', name: 'Imán' },
  { emoji: '🎹', name: 'Piano' },
  { emoji: '🎺', name: 'Trompeta' },
  { emoji: '🛏️', name: 'Cama' },
  { emoji: '🧹', name: 'Escoba' },
  { emoji: '🔨', name: 'Martillo' },
  { emoji: '🧢', name: 'Gorra' },
  { emoji: '🕶️', name: 'Gafas' },
  { emoji: '🛁', name: 'Bañera' },
];
