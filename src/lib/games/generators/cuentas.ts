/** Generadores del mundo «La Cueva de las Cuentas». */

import { pick, randomInt, sample } from '../../random';
import {
  BASKET_ITEMS,
  COUNTABLES,
  LEAVE_SCENES,
  SHARE_FRIENDS,
  SHARE_TREATS,
  WORD_PROBLEMS,
} from '../data';
import type { Countable } from '../data';
import { numberQuestion } from './factories';
import { numberOptions } from './options';
import type { RoundGenerator } from '../types';

/** `n` copias del mismo emoji: lo que se dibuja en un enunciado con cantidad. */
function repeat(n: number, emoji: string): string[] {
  return Array.from({ length: n }, () => emoji);
}

/**
 * «3 peras», pero «1 pera».
 *
 * El enunciado se locuta entero, y a los cuatro años un «1 peras» distrae más
 * que el propio ejercicio.
 */
function amount(n: number, thing: Countable): string {
  return `${n} ${n === 1 ? thing.one : thing.many}`;
}

/** «¿Cuántas quedan?» o «¿Cuántos quedan?», según lo que se esté contando. */
function howMany(thing: { fem: boolean }): string {
  return thing.fem ? 'Cuántas' : 'Cuántos';
}

// --- 3. Sumas ----------------------------------------------------------------

export const genAdd: RoundGenerator = (rng, tier = 0) => {
  const maxAddend = 4 + tier;
  const maxSum = 10 + tier * 2;
  const a = randomInt(rng, 1, maxAddend);
  const b = randomInt(rng, 1, Math.min(maxAddend, maxSum - a));
  const answer = a + b;

  return {
    question: `${a} más ${b} son...`,
    spoken: `¿Cuántas manzanas hay en total? ${a} manzanas más ${b} manzanas.`,
    prompt: {
      kind: 'equation',
      left: Array.from({ length: a }, () => '🍎'),
      op: '+',
      right: Array.from({ length: b }, () => '🍎'),
    },
    options: numberOptions(rng, answer, maxSum),
  };
};

// --- 4. Restas ---------------------------------------------------------------

export const genSub: RoundGenerator = (rng, tier = 0) => {
  const maxTotal = 10 + tier * 2;
  const total = randomInt(rng, 3, maxTotal);
  const eaten = randomInt(rng, 1, total - 1);
  const answer = total - eaten;

  return {
    question: `El monito tenía ${total} plátanos y se comió ${eaten}. ¿Cuántos quedan?`,
    spoken: `El monito tenía ${total} plátanos y se ha comido ${eaten}. ¿Cuántos plátanos le quedan?`,
    prompt: {
      kind: 'equation',
      left: Array.from({ length: total }, () => '🍌'),
      op: '−',
      right: Array.from({ length: eaten }, () => '🍌'),
    },
    options: numberOptions(rng, answer, maxTotal),
  };
};

// --- 41. Reparte por igual -----------------------------------------------------

/** Entre cuántos se reparte, según el nivel: primero solo entre dos. */
const SHARE_PARTS: readonly (readonly number[])[] = [[2], [2, 3], [2, 3, 4]];

/**
 * Como mucho doce cosas dibujadas: por encima, la caja del enunciado se va a
 * tres renglones y a 360 px ya no se cuentan de un vistazo.
 */
const MAX_SHARED = 12;

export const genShare: RoundGenerator = numberQuestion((rng, tier) => {
  const parts = pick(rng, SHARE_PARTS[Math.min(tier, SHARE_PARTS.length - 1)]);
  // El reparto tiene que salir exacto o la prueba no tendría respuesta: se
  // elige primero cuánto le toca a cada uno y el total se deriva de ahí.
  const each = randomInt(rng, 2, Math.min(4, Math.floor(MAX_SHARED / parts)));
  const total = each * parts;
  const treat = pick(rng, SHARE_TREATS);
  const friend = pick(rng, SHARE_FRIENDS);
  const how = howMany(treat);

  return {
    question: `${total} ${treat.many} para ${parts} amigos. ¿${how} le tocan a cada uno?`,
    spoken: `Reparte ${total} ${treat.many} entre ${parts} amigos. ¿${how} le tocan a cada uno?`,
    prompt: { kind: 'two-groups', a: repeat(total, treat.emoji), b: repeat(parts, friend) },
    answer: each,
    max: total,
  };
});

// --- 42. El doble ---------------------------------------------------------------

export const genDouble: RoundGenerator = numberQuestion((rng, tier) => {
  const n = randomInt(rng, 1, 5 + tier);
  const emoji = pick(rng, COUNTABLES);

  return {
    question: `¿Cuánto es el doble de ${n}?`,
    spoken: `El doble de ${n} es ${n} más ${n}. ¿Cuánto es?`,
    prompt: { kind: 'equation', left: repeat(n, emoji), op: '+', right: repeat(n, emoji) },
    answer: n * 2,
    max: 12 + tier * 2,
  };
});

// --- 43. La cesta de la compra ---------------------------------------------------

export const genBasket: RoundGenerator = numberQuestion((rng, tier) => {
  const maxEach = 3 + tier;
  const [first, second] = sample(rng, BASKET_ITEMS, 2);
  const a = randomInt(rng, 1, maxEach);
  const b = randomInt(rng, 1, maxEach);

  return {
    // «Cosas» y no «frutas»: en la cesta hay zanahorias y patatas, y además el
    // tomate es fruta botánicamente. Preguntando por cosas no hay discusión.
    question: '¿Cuántas cosas hay en la cesta?',
    spoken: `Hay ${amount(a, first)} y ${amount(b, second)}. ¿Cuántas cosas hay?`,
    prompt: { kind: 'two-groups', a: repeat(a, first.emoji), b: repeat(b, second.emoji) },
    answer: a + b,
    max: maxEach * 2 + 2,
  };
});

// --- 44. El número secreto -------------------------------------------------------

export const genSecretNumber: RoundGenerator = numberQuestion((rng, tier) => {
  const total = randomInt(rng, 4, 6 + tier * 2);
  const have = randomInt(rng, 1, total - 1);
  const emoji = pick(rng, COUNTABLES);

  return {
    question: `¿Cuántos faltan para llegar a ${total}?`,
    spoken: `Hay ${have} y queremos ${total}. ¿Cuántos faltan?`,
    // El interrogante ocupa el sitio de lo que hay que averiguar: es la única
    // prueba en la que el hueco de la cuenta está a la derecha del signo.
    prompt: { kind: 'equation', left: repeat(have, emoji), op: '+', right: ['❓'] },
    answer: total - have,
    max: total,
  };
});

// --- 45. La mitad justa -----------------------------------------------------------

export const genHalf: RoundGenerator = numberQuestion((rng, tier) => {
  // Se elige la mitad y se dobla: así el total siempre es par y la mitad justa
  // existe. El dibujo enseña las dos partes ya separadas, que es lo que hay que
  // entender de «la mitad».
  const half = randomInt(rng, 2, 4 + tier);
  const total = half * 2;
  const emoji = pick(rng, COUNTABLES);

  return {
    question: `¿Cuál es la mitad de ${total}?`,
    spoken: `Parte ${total} en dos partes iguales. ¿Cuántos hay en cada parte?`,
    prompt: { kind: 'two-groups', a: repeat(half, emoji), b: repeat(half, emoji) },
    answer: half,
    max: total,
  };
});

// --- 46. Se fueron volando --------------------------------------------------------

export const genFlewAway: RoundGenerator = numberQuestion((rng, tier) => {
  const scene = pick(rng, LEAVE_SCENES);
  const total = randomInt(rng, 3, 8 + tier * 2);
  // Nunca se van todos: quedar en cero se lee como que algo ha salido mal.
  const leaving = randomInt(rng, 1, total - 1);
  const text = `Había ${total} ${scene.many} y ${leaving} ${scene.gone}. ¿${howMany(scene)} quedan?`;

  return {
    question: text,
    spoken: text,
    prompt: {
      kind: 'equation',
      left: repeat(total, scene.emoji),
      op: '−',
      right: repeat(leaving, scene.emoji),
    },
    answer: total - leaving,
    max: total,
  };
});

// --- 47. Problemas del bosque -------------------------------------------------------

export const genWordProblem: RoundGenerator = numberQuestion((rng, tier) => {
  const problem = pick(rng, WORD_PROBLEMS);
  const object = problem.object;
  const how = howMany(object);
  const adding = rng() < 0.5;
  const maxStart = 6 + tier * 2;
  const maxChange = 3 + tier;
  const start = randomInt(rng, 2, maxStart);
  // Al quitar, nunca más de lo que hay: la respuesta jamás es cero ni negativa.
  const change = randomInt(rng, 1, adding ? maxChange : Math.min(maxChange, start - 1));

  const text = adding
    ? `${problem.character} tenía ${amount(start, object)} y ${problem.gain} ${change} más. ¿${how} tiene ahora?`
    : `${problem.character} tenía ${amount(start, object)} y ${problem.loss} ${change}. ¿${how} le quedan?`;

  return {
    question: text,
    spoken: text,
    // El dibujo solo enseña con cuántas cosas se empieza: lo que se suma o se
    // resta va únicamente en el enunciado hablado, que es de lo que va la prueba.
    prompt: { kind: 'emoji-group', items: repeat(start, object.emoji) },
    answer: adding ? start + change : start - change,
    max: maxStart + maxChange,
  };
});
