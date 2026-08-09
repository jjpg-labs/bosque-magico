/** Contenido del mundo «La Ciudad de los Oficios». */

import type { Item, Pair } from '../generators';

// --- Los oficios del pueblo (98) ------------------------------------------------

/**
 * Oficios repartidos a partes iguales entre ellas y ellos, y a propósito con
 * mujeres en los que se dibujan siempre con un hombre (bombera, policía,
 * mecánica no, pero médica sí).
 *
 * Están elegidos para **distinguirse a 32 px**: cada uno lleva un color o un
 * gorro distinto. Por eso no está la científica, que es otra bata blanca y se
 * confundiría con la médica.
 */
export const JOBS: readonly Item[] = [
  { emoji: '👩‍⚕️', name: 'La médica' },
  { emoji: '👨‍🍳', name: 'El cocinero' },
  { emoji: '👩‍🚒', name: 'La bombera' },
  { emoji: '👮‍♀️', name: 'La policía' },
  { emoji: '👨‍🌾', name: 'El granjero' },
  { emoji: '👷', name: 'El albañil' },
  { emoji: '👨‍🚀', name: 'El astronauta' },
  { emoji: '👩‍🏫', name: 'La maestra' },
  { emoji: '👨‍🔧', name: 'El mecánico' },
  { emoji: '👩‍🎨', name: 'La pintora' },
  { emoji: '👨‍✈️', name: 'El piloto' },
  { emoji: '👩‍🎤', name: 'La cantante' },
  { emoji: '👨‍💻', name: 'El informático' },
];

function job(name: string): Item {
  const found = JOBS.find((candidate) => candidate.name === name);
  if (!found) throw new Error(`JOBS no tiene «${name}».`);
  return found;
}

// --- ¿Quién lo hace? (97) ---------------------------------------------------------

/**
 * La herramienta y quien la usa. Sale de `JOBS` para que las dos pruebas de
 * oficios no puedan acabar diciendo cosas distintas del mismo dibujo.
 */
export const JOB_TOOLS: readonly Pair[] = [
  { from: { emoji: '🩺', name: 'el estetoscopio' }, to: job('La médica') },
  { from: { emoji: '🩹', name: 'la tirita' }, to: job('La médica') },
  { from: { emoji: '🍳', name: 'la sartén' }, to: job('El cocinero') },
  { from: { emoji: '🥘', name: 'la cazuela' }, to: job('El cocinero') },
  { from: { emoji: '🚒', name: 'el camión de bomberos' }, to: job('La bombera') },
  { from: { emoji: '🧯', name: 'el extintor' }, to: job('La bombera') },
  { from: { emoji: '🚓', name: 'el coche de policía' }, to: job('La policía') },
  { from: { emoji: '🚜', name: 'el tractor' }, to: job('El granjero') },
  { from: { emoji: '🌾', name: 'el trigo' }, to: job('El granjero') },
  { from: { emoji: '🧱', name: 'el ladrillo' }, to: job('El albañil') },
  { from: { emoji: '🔨', name: 'el martillo' }, to: job('El albañil') },
  { from: { emoji: '🚀', name: 'el cohete' }, to: job('El astronauta') },
  { from: { emoji: '📚', name: 'los libros' }, to: job('La maestra') },
  { from: { emoji: '🔧', name: 'la llave inglesa' }, to: job('El mecánico') },
  { from: { emoji: '🔩', name: 'el tornillo' }, to: job('El mecánico') },
  { from: { emoji: '🎨', name: 'la paleta de pintura' }, to: job('La pintora') },
  { from: { emoji: '🎤', name: 'el micrófono' }, to: job('La cantante') },
  { from: { emoji: '💻', name: 'el ordenador' }, to: job('El informático') },
];

// --- Por tierra, mar o aire (99) ----------------------------------------------------

/**
 * Tres opciones, las tres del título. Fuera el cohete, que no va por el aire
 * sino al espacio, y fuera el globo 🎈, que a esta edad es un juguete.
 */
export const TRANSPORT_ZONES: readonly Item[] = [
  { emoji: '🚗', name: 'Por tierra' },
  { emoji: '🚌', name: 'Por tierra' },
  { emoji: '🚲', name: 'Por tierra' },
  { emoji: '🏍️', name: 'Por tierra' },
  { emoji: '🚂', name: 'Por tierra' },
  { emoji: '🚚', name: 'Por tierra' },
  { emoji: '🚕', name: 'Por tierra' },
  { emoji: '🛴', name: 'Por tierra' },
  { emoji: '🚢', name: 'Por mar' },
  { emoji: '⛵', name: 'Por mar' },
  { emoji: '🛶', name: 'Por mar' },
  { emoji: '⛴️', name: 'Por mar' },
  { emoji: '🚤', name: 'Por mar' },
  { emoji: '✈️', name: 'Por aire' },
  { emoji: '🚁', name: 'Por aire' },
  { emoji: '🛩️', name: 'Por aire' },
  { emoji: '🪂', name: 'Por aire' },
];

// --- Los sitios del pueblo (100) -------------------------------------------------

/**
 * Sitios que se reconocen de un vistazo y que no se solapan: nada de tener a la
 * vez «la tienda» 🏪 y «el centro comercial» 🏬, que serían dos respuestas
 * buenas para el mismo dibujo.
 */
export const TOWN_PLACES: readonly Item[] = [
  { emoji: '🏥', name: 'El hospital' },
  { emoji: '🏫', name: 'El cole' },
  { emoji: '🏪', name: 'La tienda' },
  { emoji: '🏦', name: 'El banco' },
  { emoji: '🏛️', name: 'El museo' },
  { emoji: '🎪', name: 'El circo' },
  { emoji: '🏟️', name: 'El estadio' },
  { emoji: '🏞️', name: 'El parque' },
  { emoji: '🏖️', name: 'La playa' },
  { emoji: '🚉', name: 'La estación' },
  { emoji: '🏰', name: 'El castillo' },
  { emoji: '⛲', name: 'La fuente' },
  { emoji: '🎡', name: 'La noria' },
  { emoji: '🏭', name: 'La fábrica' },
];
