/**
 * Fábricas de generadores.
 *
 * Una prueba nueva es, casi siempre, **una tabla de datos y una llamada a una
 * fábrica**. Escribir el generador a mano solo hace falta cuando la prueba
 * plantea algo que ninguna fábrica cubre.
 *
 * Las ocho fábricas garantizan **por construcción** los dos invariantes que
 * comprueba el barrido genérico de `generators.test.ts`:
 *
 * 1. exactamente una opción con `correct: true`;
 * 2. ningún `display` repetido entre las opciones.
 *
 * Lo consiguen sacando siempre los distractores con `distinctDistractors`, que
 * deduplica por la clave visible, y validando la tabla de datos **al construir
 * el generador** (no al jugar): una tabla con la que no se puede montar una
 * ronda revienta al cargar el módulo, así que salta en el primer test y no
 * delante de la niña.
 *
 * ⚠️ **API congelada.** Varios lotes de contenido se escriben en paralelo
 * encima de estas firmas. Si un mundo necesita una fábrica nueva, la pone en
 * su propio `generators/<mundo>.ts`; se promociona aquí más tarde, aparte.
 */

import { numericDistractors, pick, randomInt, sample, seededRng, shuffle } from '../../random';
import type { Rng } from '../../random';
import { buildOptions, textOption } from './options';
import type { Option, Prompt, RoundGenerator } from '../types';

// --- Contrato común -----------------------------------------------------------

/** Lo mínimo que necesita un elemento de contenido: qué se dibuja y cómo se llama. */
export interface Item {
  /** Lo que se pinta. Normalmente un emoji; en las pruebas de letras, la letra. */
  emoji: string;
  /** Nombre en español. Con mayúscula inicial si es la respuesta escrita. */
  name: string;
}

/** Un conjunto de elementos que comparten clase: frutas, animales de granja... */
export interface Category {
  name: string;
  /** Para redactar el enunciado sin errores de concordancia: «un» pez, «una» fruta. */
  article: 'un' | 'una';
  items: readonly Item[];
}

/**
 * Los dos textos de la ronda. `question` se pinta; `spoken` se lee en voz alta
 * y va sin emojis, sin símbolos y por debajo de quince palabras.
 */
export interface Texts<T> {
  question: (subject: T) => string;
  spoken: (subject: T) => string;
}

export interface ChoiceOptions {
  /** Opciones totales, contando la correcta. Por defecto 4. */
  optionCount?: number;
}

const DEFAULT_OPTION_COUNT = 4;

/** Opciones extra como mucho, al subir de nivel: se acaba en seis. */
const MAX_EXTRA_OPTIONS = 2;

function optionCountOf(factory: string, opts: ChoiceOptions): number {
  const count = opts.optionCount ?? DEFAULT_OPTION_COUNT;
  if (!Number.isInteger(count) || count < 2) {
    throw new Error(`${factory}: optionCount tiene que ser un entero de 2 en adelante (era ${count}).`);
  }
  return count;
}

/**
 * Cuántas opciones tocan en esta ronda: cuatro al principio, cinco y seis
 * según sube el nivel.
 *
 * Es la forma barata de que **toda** prueba de fábrica escale, no solo las
 * que tienen un rango numérico que estirar. Un distractor más es una cosa más
 * que descartar, que es exactamente en lo que consiste la prueba.
 *
 * Un `optionCount` explícito manda y no crece: cuando una prueba pide tres
 * opciones es porque solo hay tres respuestas posibles (tierra, mar o aire),
 * y una cuarta tendría que repetir.
 *
 * No hace falta comprobar que el pool dé para tanto: `distinctDistractors` y
 * `numericDistractors` devuelven como mucho lo que haya, así que una prueba
 * con pool justo se queda en las opciones que puede y no rompe nada.
 */
function countForTier(base: number, opts: ChoiceOptions, tier: number): number {
  if (opts.optionCount !== undefined) return base;
  return base + Math.min(Math.max(tier, 0), MAX_EXTRA_OPTIONS);
}

/**
 * `count` distractores garantizando que ninguna clave visible se repite (ni
 * entre ellos, ni con la respuesta correcta).
 *
 * Baraja **antes** de deduplicar: así, cuando varios elementos comparten clave
 * (ocho animales cuya respuesta es «la granja»), el representante que sale
 * cambia de ronda en ronda en vez de ser siempre el primero de la tabla.
 *
 * ```ts
 * // tres animales distintos del pool, ninguno el de la respuesta
 * distinctDistractors(rng, ANIMALS, (a) => a.emoji, answer.emoji, 3);
 * ```
 */
export function distinctDistractors<T>(
  rng: Rng,
  pool: readonly T[],
  keyOf: (item: T) => string,
  exclude: string | readonly string[],
  count: number,
): T[] {
  const banned = new Set(typeof exclude === 'string' ? [exclude] : exclude);
  const seen = new Set<string>();
  const candidates: T[] = [];

  for (const item of shuffle(rng, pool)) {
    const key = keyOf(item);
    if (banned.has(key) || seen.has(key)) continue;
    seen.add(key);
    candidates.push(item);
  }

  return candidates.slice(0, count);
}

function distinctKeys<T>(pool: readonly T[], keyOf: (item: T) => string): number {
  return new Set(pool.map(keyOf)).size;
}

function assertEnough(factory: string, available: number, needed: number, what: string): void {
  if (available < needed) {
    throw new Error(
      `${factory}: para rondas de ${needed} opciones hacen falta al menos ${needed} ${what} distintos, y hay ${available}.`,
    );
  }
}

/** Ningún elemento puede estar en dos categorías, o la respuesta sería discutible. */
function assertDisjoint(factory: string, categories: readonly Category[]): void {
  const owner = new Map<string, string>();
  for (const category of categories) {
    for (const item of category.items) {
      const previous = owner.get(item.emoji);
      if (previous !== undefined && previous !== category.name) {
        throw new Error(
          `${factory}: ${item.emoji} está en «${previous}» y en «${category.name}»; la respuesta sería ambigua.`,
        );
      }
      owner.set(item.emoji, category.name);
    }
  }
}

function displayKey(display: Option['display']): string {
  return JSON.stringify(display);
}

function emojiOption(item: Item, correct: boolean): Omit<Option, 'id'> {
  return { label: item.name, display: { kind: 'emoji', emoji: item.emoji }, correct };
}

// --- 1. Del dibujo a la palabra ------------------------------------------------

/**
 * Se enseña un dibujo y se elige **cómo se llama**, entre cuatro nombres.
 *
 * Los distractores salen del mismo pool con un `name` distinto, así que sirve
 * igual para «¿qué animal es?» (un nombre por elemento) que para clasificar
 * («¿de dónde es este animal?»: muchos elementos comparten el nombre de su
 * grupo y la fábrica elige uno de cada grupo).
 *
 * ```ts
 * export const genBodyParts = emojiToName(BODY_PARTS, {
 *   question: () => '¿Qué parte del cuerpo es?',
 *   spoken: () => 'Mira el dibujo. ¿Qué parte del cuerpo es?',
 * });
 * ```
 */
export function emojiToName(
  pool: readonly Item[],
  texts: Texts<Item>,
  opts: ChoiceOptions = {},
): RoundGenerator {
  const baseCount = optionCountOf('emojiToName', opts);
  assertEnough('emojiToName', distinctKeys(pool, (item) => item.name), baseCount, 'nombres');

  return (rng, tier = 0) => {
    const count = countForTier(baseCount, opts, tier);
    const answer = pick(rng, pool);
    const others = distinctDistractors(rng, pool, (item) => item.name, answer.name, count - 1);

    return {
      question: texts.question(answer),
      spoken: texts.spoken(answer),
      prompt: { kind: 'emoji-single', item: answer.emoji },
      options: buildOptions(rng, [
        textOption(answer.name, true),
        ...others.map((item) => textOption(item.name, false)),
      ]),
    };
  };
}

// --- 2. De la palabra al dibujo ------------------------------------------------

export interface NameToEmojiOptions extends ChoiceOptions {
  /**
   * Qué se pinta en las opciones: el `emoji` (por defecto) o el `name`, para
   * las pruebas cuya respuesta es una letra o una palabra.
   */
  as?: 'emoji' | 'text';
}

/**
 * El enunciado nombra algo y hay que tocarlo entre cuatro dibujos. Sin prompt
 * visual: la pregunta lo dice todo.
 *
 * ```ts
 * export const genTouchLetter = nameToEmoji(LETTERS, {
 *   question: (letter) => `Toca la letra ${letter.name}`,
 *   spoken: (letter) => `Busca la letra ${letter.name} y tócala.`,
 * }, { as: 'text' });
 * ```
 */
export function nameToEmoji(
  pool: readonly Item[],
  texts: Texts<Item>,
  opts: NameToEmojiOptions = {},
): RoundGenerator {
  const baseCount = optionCountOf('nameToEmoji', opts);
  const asText = opts.as === 'text';
  const keyOf = (item: Item) => (asText ? item.name : item.emoji);
  assertEnough('nameToEmoji', distinctKeys(pool, keyOf), baseCount, asText ? 'textos' : 'emojis');

  return (rng, tier = 0) => {
    const count = countForTier(baseCount, opts, tier);
    const answer = pick(rng, pool);
    const others = distinctDistractors(rng, pool, keyOf, keyOf(answer), count - 1);
    const seed = (item: Item, correct: boolean) =>
      asText ? textOption(item.name, correct) : emojiOption(item, correct);

    return {
      question: texts.question(answer),
      spoken: texts.spoken(answer),
      prompt: { kind: 'none' },
      options: buildOptions(rng, [
        seed(answer, true),
        ...others.map((item) => seed(item, false)),
      ]),
    };
  };
}

// --- 3. Emparejar ---------------------------------------------------------------

/** Una relación de uno a uno: el animal y su casa, la herramienta y su oficio. */
export interface Pair {
  from: Item;
  to: Item;
}

/**
 * Se enseña un elemento y hay que tocar el que le corresponde.
 *
 * Varios `from` pueden compartir `to` (seis objetos que van al mismo cubo de
 * reciclaje): eso no genera ambigüedad y los distractores se deduplican por
 * `to.emoji`. Lo que sí revienta al construir es que un mismo `from` aparezca
 * con dos `to` distintos, porque entonces la pregunta tendría dos respuestas.
 *
 * ```ts
 * export const genHabitats = pairMatch(HABITATS, {
 *   question: (pair) => `¿Dónde vive ${pair.from.name}?`,
 *   spoken: (pair) => `Mira. ¿Dónde vive ${pair.from.name}?`,
 * });
 * ```
 */
export function pairMatch(
  pairs: readonly Pair[],
  texts: Texts<Pair>,
  opts: ChoiceOptions = {},
): RoundGenerator {
  const baseCount = optionCountOf('pairMatch', opts);

  const answers = new Map<string, string>();
  for (const pair of pairs) {
    const previous = answers.get(pair.from.emoji);
    if (previous !== undefined && previous !== pair.to.emoji) {
      throw new Error(
        `pairMatch: ${pair.from.emoji} aparece con dos respuestas distintas (${previous} y ${pair.to.emoji}).`,
      );
    }
    answers.set(pair.from.emoji, pair.to.emoji);
  }

  const targets = pairs.map((pair) => pair.to);
  assertEnough('pairMatch', distinctKeys(targets, (item) => item.emoji), baseCount, 'respuestas');

  return (rng, tier = 0) => {
    const count = countForTier(baseCount, opts, tier);
    const answer = pick(rng, pairs);
    const others = distinctDistractors(
      rng,
      targets,
      (item) => item.emoji,
      answer.to.emoji,
      count - 1,
    );

    return {
      question: texts.question(answer),
      spoken: texts.spoken(answer),
      prompt: { kind: 'emoji-single', item: answer.from.emoji },
      options: buildOptions(rng, [
        emojiOption(answer.to, true),
        ...others.map((item) => emojiOption(item, false)),
      ]),
    };
  };
}

// --- 4. Clasificar: el que pertenece --------------------------------------------

export interface CategoryPick {
  category: Category;
  item: Item;
}

/**
 * «¿Cuál de estos es una fruta?»: una opción de la categoría pedida y las
 * demás de **categorías distintas entre sí**.
 *
 * Exige que las categorías sean disjuntas y lo comprueba al construir: si un
 * emoji estuviera en dos, habría dos respuestas defendibles.
 *
 * ```ts
 * export const genWhichFruit = categoryMember(CLASS_SETS, {
 *   question: (pick) => `¿Cuál es ${pick.category.article} ${pick.category.name}?`,
 *   spoken: (pick) => `Busca el que es ${pick.category.article} ${pick.category.name}.`,
 * });
 * ```
 */
export function categoryMember(
  categories: readonly Category[],
  texts: Texts<CategoryPick>,
  opts: ChoiceOptions = {},
): RoundGenerator {
  const baseCount = optionCountOf('categoryMember', opts);
  assertDisjoint('categoryMember', categories);
  assertEnough('categoryMember', categories.length, baseCount, 'categorías');

  for (const category of categories) {
    if (category.items.length === 0) {
      throw new Error(`categoryMember: la categoría «${category.name}» está vacía.`);
    }
  }

  return (rng, tier = 0) => {
    const count = countForTier(baseCount, opts, tier);
    // Una categoría por opción: como son disjuntas, no hay emojis repetidos.
    const [category, ...strangers] = sample(rng, categories, count);
    const item = pick(rng, category.items);
    const subject = { category, item };

    return {
      question: texts.question(subject),
      spoken: texts.spoken(subject),
      prompt: { kind: 'none' },
      options: buildOptions(rng, [
        emojiOption(item, true),
        ...strangers.map((stranger) => emojiOption(pick(rng, stranger.items), false)),
      ]),
    };
  };
}

// --- 5. Clasificar: el intruso ---------------------------------------------------

export interface OddOnePick {
  family: Category;
  intruder: Item;
}

/**
 * Tres (o `optionCount - 1`) de la misma clase y uno de otra: hay que tocar el
 * que sobra. Es `genOddOne` con la tabla inyectable.
 *
 * ```ts
 * export const genColorIntruder = oddOneOut(COLOR_GROUPS, {
 *   question: () => '¿Cuál es de otro color?',
 *   spoken: () => 'Tres son del mismo color. ¿Cuál es el intruso?',
 * });
 * ```
 */
export function oddOneOut(
  categories: readonly Category[],
  texts: Texts<OddOnePick>,
  opts: ChoiceOptions = {},
): RoundGenerator {
  const baseCount = optionCountOf('oddOneOut', opts);
  assertDisjoint('oddOneOut', categories);
  assertEnough('oddOneOut', categories.length, 2, 'categorías');

  // La familia tiene que dar baseCount - 1 miembros; el intruso, con uno le basta.
  const families = categories.filter((category) => category.items.length >= baseCount - 1);
  if (families.length === 0) {
    throw new Error(
      `oddOneOut: ninguna categoría tiene los ${baseCount - 1} elementos que hacen falta para formar la familia.`,
    );
  }
  for (const category of categories) {
    if (category.items.length === 0) {
      throw new Error(`oddOneOut: la categoría «${category.name}» está vacía.`);
    }
  }

  return (rng, tier = 0) => {
    const count = countForTier(baseCount, opts, tier);
    const family = pick(rng, families);
    const stranger = pick(
      rng,
      categories.filter((category) => category.name !== family.name),
    );
    const members = sample(rng, family.items, count - 1);
    const intruder = pick(rng, stranger.items);
    const subject = { family, intruder };

    return {
      question: texts.question(subject),
      spoken: texts.spoken(subject),
      prompt: { kind: 'none' },
      options: buildOptions(rng, [
        emojiOption(intruder, true),
        ...members.map((member) => emojiOption(member, false)),
      ]),
    };
  };
}

// --- 6. Secuencias con un hueco ---------------------------------------------------

export interface SequencePick {
  /** El paso que falta: la respuesta. */
  item: Item;
  /** Su posición dentro de la ventana que se enseña. */
  index: number;
  /** Los pasos que se enseñan, con el que falta incluido. */
  window: readonly Item[];
}

export interface OrderedSequenceOptions extends ChoiceOptions {
  /** Cuántos pasos se enseñan. Por defecto 4, o la secuencia entera si es más corta. */
  windowLen?: number;
}

/**
 * Una fila de pasos en orden con un hueco: el ciclo de la mariposa, el orden
 * de un cuento, la rutina de lavarse los dientes.
 *
 * Se pasa una **lista de secuencias**, no una sola: casi todo el contenido de
 * este tipo son varias tiras cortas (cuatro ciclos de vida de cuatro pasos)
 * en vez de una tira larga. Para una única secuencia, se pasa `[PASOS]`.
 *
 * El hueco nunca cae en la primera posición: sin un paso visible delante no
 * hay forma de saber por dónde va la fila.
 *
 * ```ts
 * export const genLifeCycles = orderedSequence(LIFE_CYCLES, {
 *   question: () => '¿Qué pasa después?',
 *   spoken: () => 'Mira cómo crece. ¿Qué falta?',
 * });
 * ```
 */
export function orderedSequence(
  sequences: readonly (readonly Item[])[],
  texts: Texts<SequencePick>,
  opts: OrderedSequenceOptions = {},
): RoundGenerator {
  const baseCount = optionCountOf('orderedSequence', opts);
  const windowLen = opts.windowLen ?? 4;
  if (windowLen < 2) {
    throw new Error('orderedSequence: windowLen tiene que ser 2 o más para dejar una referencia visible.');
  }
  if (sequences.length === 0) {
    throw new Error('orderedSequence: hace falta al menos una secuencia.');
  }
  for (const sequence of sequences) {
    if (sequence.length < 2) {
      throw new Error('orderedSequence: cada secuencia necesita al menos dos pasos.');
    }
  }

  const everyStep = sequences.flat();
  assertEnough('orderedSequence', distinctKeys(everyStep, (item) => item.emoji), baseCount, 'pasos');

  return (rng, tier = 0) => {
    const count = countForTier(baseCount, opts, tier);
    const sequence = pick(rng, sequences);
    const length = Math.min(windowLen, sequence.length);
    const start = randomInt(rng, 0, sequence.length - length);
    const window = sequence.slice(start, start + length);
    const index = randomInt(rng, 1, length - 1);
    const item = window[index];
    const others = distinctDistractors(
      rng,
      everyStep,
      (step) => step.emoji,
      item.emoji,
      count - 1,
    );
    const subject = { item, index, window };

    return {
      question: texts.question(subject),
      spoken: texts.spoken(subject),
      prompt: {
        kind: 'sequence',
        items: window.map((step, i) => (i === index ? null : step.emoji)),
      },
      options: buildOptions(rng, [
        emojiOption(item, true),
        ...others.map((step) => emojiOption(step, false)),
      ]),
    };
  };
}

// --- 7. Preguntas cuya respuesta es un número --------------------------------------

export interface NumberSpec {
  question: string;
  spoken: string;
  prompt: Prompt;
  answer: number;
  /** Tope del rango del que salen los distractores. */
  max: number;
  /** Suelo del rango. Por defecto 0. */
  min?: number;
}

/**
 * Cualquier prueba cuya respuesta sea un número. Se le pasa una función que
 * arma el enunciado y dice cuál es la respuesta y en qué rango se mueve; la
 * fábrica pone las opciones con `numericDistractors`, que ya garantiza que no
 * se repiten y que se quedan dentro del rango.
 *
 * Es la única fábrica que recibe el `tier`, porque es la única cuyo contenido
 * tiene un rango numérico natural que escalar.
 *
 * Ojo con el rango: los distractores salen de `answer ± 4` recortado a
 * `[min, max]`, así que `max - min` debe dar de sí para `optionCount - 1`
 * valores distintos o la ronda saldrá con menos opciones.
 *
 * ```ts
 * export const genDouble = numberQuestion((rng, tier) => {
 *   const n = randomInt(rng, 1, 5 + tier);
 *   return {
 *     question: `¿Cuánto es el doble de ${n}?`,
 *     spoken: `El doble de ${n}. ¿Cuánto es?`,
 *     prompt: { kind: 'equation', left: rep(n), op: '+', right: rep(n) },
 *     answer: n * 2,
 *     max: 12 + tier * 2,
 *   };
 * });
 * ```
 */
export function numberQuestion(
  build: (rng: Rng, tier: number) => NumberSpec,
  opts: ChoiceOptions = {},
): RoundGenerator {
  const baseCount = optionCountOf('numberQuestion', opts);

  return (rng, tier = 0) => {
    const count = countForTier(baseCount, opts, tier);
    const spec = build(rng, tier);
    const distractors = numericDistractors(
      rng,
      spec.answer,
      count - 1,
      spec.min ?? 0,
      spec.max,
    );
    if (distractors.length === 0) {
      throw new Error(
        `numberQuestion: el rango [${spec.min ?? 0}, ${spec.max}] no da para ningún distractor de ${spec.answer}.`,
      );
    }

    return {
      question: spec.question,
      spoken: spec.spoken,
      prompt: spec.prompt,
      options: buildOptions(rng, [
        textOption(String(spec.answer), true),
        ...distractors.map((n) => textOption(String(n), false)),
      ]),
    };
  };
}

// --- 8. Escuchar y elegir ------------------------------------------------------------

export interface ListenPick<T> {
  /** Lo que se escucha. */
  target: T;
  /** Lo que hay que tocar. */
  match: T;
}

export interface ListenRelation<T> {
  /** La palabra que se locuta y el dibujo que la acompaña. */
  targetOf: (item: T) => { word: string; emoji: string };
  /**
   * Los elementos del pool que «casan» con el objetivo: los que riman con él,
   * los que empiezan por su misma sílaba... Nunca debe incluir al propio
   * objetivo.
   */
  matchesOf: (item: T, pool: readonly T[]) => readonly T[];
  /** Cómo se pinta cada elemento cuando sale como opción. */
  optionOf: (item: T) => { label: string; display: Option['display'] };
}

/**
 * Se escucha una palabra y hay que tocar la que guarda cierta relación con
 * ella: la que rima, la que empieza igual, la que tiene esa vocal.
 *
 * Los distractores se sacan de los elementos que **no** cumplen la relación,
 * deduplicados por lo que se dibuja.
 *
 * ```ts
 * export const genSameInitial = listenAndPick(WORDS_BY_INITIAL, {
 *   targetOf: (w) => ({ word: w.name, emoji: w.emoji }),
 *   matchesOf: (w, pool) => pool.filter((o) => o !== w && o.initial === w.initial),
 *   optionOf: (w) => ({ label: w.name, display: { kind: 'emoji', emoji: w.emoji } }),
 * }, {
 *   question: (p) => `¿Cuál empieza como ${p.target.name}?`,
 *   spoken: (p) => `Escucha: ${p.target.name}. ¿Cuál empieza igual?`,
 * });
 * ```
 */
export function listenAndPick<T>(
  pool: readonly T[],
  relation: ListenRelation<T>,
  texts: Texts<ListenPick<T>>,
  opts: ChoiceOptions = {},
): RoundGenerator {
  const baseCount = optionCountOf('listenAndPick', opts);
  const keyOf = (item: T) => displayKey(relation.optionOf(item).display);

  // Solo sirven de objetivo los que tienen con quién casar, y solo si además
  // queda material suficiente para los distractores. Se comprueba aquí, con la
  // tabla entera delante, y no jugando.
  const usable = pool.filter((item) => {
    const matches = relation.matchesOf(item, pool);
    if (matches.length === 0) return false;
    const related = new Set([keyOf(item), ...matches.map(keyOf)]);
    return distinctKeys(pool.filter((other) => !related.has(keyOf(other))), keyOf) >= baseCount - 1;
  });

  if (usable.length === 0) {
    throw new Error(
      `listenAndPick: ninguna palabra del pool tiene pareja y a la vez ${baseCount - 1} distractores ajenos.`,
    );
  }

  return (rng, tier = 0) => {
    const count = countForTier(baseCount, opts, tier);
    const target = pick(rng, usable);
    const matches = relation.matchesOf(target, pool);
    const match = pick(rng, matches);
    const related = new Set([keyOf(target), ...matches.map(keyOf)]);
    const strangers = pool.filter((item) => !related.has(keyOf(item)));
    const others = distinctDistractors(rng, strangers, keyOf, [], count - 1);

    const heard = relation.targetOf(target);
    const subject = { target, match };
    const seed = (item: T, correct: boolean) => ({ ...relation.optionOf(item), correct });

    return {
      question: texts.question(subject),
      spoken: texts.spoken(subject),
      prompt: { kind: 'listen', word: heard.word, emoji: heard.emoji },
      options: buildOptions(rng, [
        seed(match, true),
        ...others.map((item) => seed(item, false)),
      ]),
    };
  };
}

// --- Remezcla ----------------------------------------------------------------------

/**
 * Un generador que, en cada ronda, plantea el ejercicio de otra prueba.
 *
 * Antes el pool era una lista escrita a mano con los diecisiete generadores
 * del momento. Con cien pruebas serían noventa y nueve entradas que nadie va a
 * acordarse de actualizar: el desafío «final» acabaría remezclando solo las
 * pruebas viejas. Recibiendo el pool por parámetro, el catálogo se lo pasa
 * derivado de sí mismo y no hay nada que mantener sincronizado.
 *
 * El `tier` se propaga al generador elegido: sin eso, la prueba de remezcla
 * sería la única que nunca sube de dificultad por muchas veces que se juegue.
 *
 * ```ts
 * // en catalog/especial.ts, con el pool derivado de las demás pruebas
 * generate: makeMixGenerator(pool.flatMap((game) => game.generate ?? [])),
 * ```
 */
export function makeMixGenerator(pool: readonly RoundGenerator[]): RoundGenerator {
  if (pool.length === 0) {
    throw new Error('makeMixGenerator necesita al menos un generador en el pool');
  }
  return (rng, tier = 0) => pick(rng, pool)(rng, tier);
}

/**
 * Semilla derivada de la fecha: la misma durante todo el día y distinta
 * mañana. Es lo que hace que «La Aventura del Día» se pueda contar en la
 * merienda («¡me ha salido la de las ranas!») y que rejugarla no la cambie.
 */
export function daySeed(date = new Date()): number {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

/**
 * Como `makeMixGenerator`, pero con la aleatoriedad fijada al día: ignora a
 * propósito el `rng` que recibe y usa el suyo, sembrado con la fecha.
 *
 * Cada llamada avanza ese `rng` interno, así que las rondas de una misma
 * tanda salen distintas entre sí pero iguales en cada partida del mismo día.
 */
export function makeDailyGenerator(
  pool: readonly RoundGenerator[],
  date = new Date(),
): RoundGenerator {
  if (pool.length === 0) {
    throw new Error('makeDailyGenerator necesita al menos un generador en el pool');
  }
  const daily = seededRng(daySeed(date));
  return (_rng, tier = 0) => pick(daily, pool)(daily, tier);
}
