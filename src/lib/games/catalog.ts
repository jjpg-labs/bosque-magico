import {
  genAdd,
  genAnimalSound,
  genColors,
  genCount,
  genEmotion,
  genFinalChallenge,
  genLetters,
  genMoreLess,
  genNumberSequence,
  genOddOne,
  genPatterns,
  genPhonics,
  genRhyme,
  genRoutine,
  genShapeMatch,
  genShapes,
  genSize,
  genSub,
} from './generators';
import type { GameDefinition } from './types';

/** Las 13 pruebas, en el orden en que aparecen en el mapa. */
export const GAMES: readonly GameDefinition[] = [
  {
    id: 1,
    title: 'Letras Iniciales',
    desc: '¿Qué letra empieza como el animalito?',
    icon: '🔤',
    cat: 'Letras',
    kind: 'choice',
    roundsToWin: 3,
    generate: genLetters,
  },
  {
    id: 2,
    title: 'Cuenta los Bichitos',
    desc: 'Cuenta cuántos bichitos hay en el jardín',
    icon: '🔢',
    cat: 'Números',
    kind: 'choice',
    roundsToWin: 3,
    generate: genCount,
  },
  {
    id: 3,
    title: 'La Suma de las Manzanas',
    desc: 'Suma las manzanas del árbol',
    icon: '🍎',
    cat: 'Sumas',
    kind: 'choice',
    roundsToWin: 3,
    generate: genAdd,
  },
  {
    id: 4,
    title: 'La Resta del Monito',
    desc: 'El monito se come plátanos. ¿Cuántos quedan?',
    icon: '🍌',
    cat: 'Restas',
    kind: 'choice',
    roundsToWin: 3,
    generate: genSub,
  },
  {
    id: 5,
    title: 'Formas Geométricas',
    desc: 'Encuentra la figura geométrica correcta',
    icon: '📐',
    cat: 'Geometría',
    kind: 'choice',
    roundsToWin: 3,
    generate: genShapes,
  },
  {
    id: 6,
    title: 'Patrones Divertidos',
    desc: '¿Qué bichito sigue en la fila?',
    icon: '🧩',
    cat: 'Lógica',
    kind: 'choice',
    roundsToWin: 3,
    generate: genPatterns,
  },
  {
    id: 7,
    title: 'El Intruso',
    desc: '¿Cuál es diferente a los demás?',
    icon: '🔍',
    cat: 'Lógica',
    kind: 'choice',
    roundsToWin: 3,
    generate: genOddOne,
  },
  {
    id: 8,
    title: 'Memoria de Bichos',
    desc: 'Encuentra las parejas de animalitos iguales',
    icon: '🎴',
    cat: 'Lógica',
    kind: 'memory',
    roundsToWin: 1,
    pairCount: 4,
  },
  {
    id: 9,
    title: '¿Dónde hay MÁS?',
    desc: 'Elige el grupo que tiene más elementos',
    icon: '⚖️',
    cat: 'Comparación',
    kind: 'choice',
    roundsToWin: 3,
    generate: genMoreLess,
  },
  {
    id: 10,
    title: 'El Tren de los Números',
    desc: '¿Qué número falta en el vagón?',
    icon: '🚂',
    cat: 'Números',
    kind: 'choice',
    roundsToWin: 3,
    generate: genNumberSequence,
  },
  {
    id: 11,
    title: 'Sonidos e Iniciales',
    desc: 'Escucha la palabra e identifica la vocal inicial',
    icon: '🗣️',
    cat: 'Letras',
    kind: 'choice',
    roundsToWin: 3,
    generate: genPhonics,
  },
  {
    id: 12,
    title: 'Empareja las Formas',
    desc: 'Encaja cada figura en su lugar',
    icon: '⭐',
    cat: 'Geometría',
    kind: 'choice',
    roundsToWin: 3,
    generate: genShapeMatch,
  },
  {
    id: 13,
    title: 'El Gran Desafío Final',
    desc: 'Prueba combinada para ganar el trofeo',
    icon: '🏆',
    cat: 'Especial',
    kind: 'choice',
    roundsToWin: 5,
    generate: genFinalChallenge,
  },
  {
    id: 14,
    title: 'Colores del Bosque',
    desc: 'Descubre y toca cada color',
    icon: '🎨',
    cat: 'Colores',
    kind: 'choice',
    roundsToWin: 3,
    generate: genColors,
  },
  {
    id: 15,
    title: '¿Quién Hace Este Sonido?',
    desc: 'Escucha el sonido y adivina qué animal es',
    icon: '🔊',
    cat: 'Sonidos',
    kind: 'choice',
    roundsToWin: 3,
    generate: genAnimalSound,
  },
  {
    id: 16,
    title: '¿Cómo Se Siente?',
    desc: 'Reconoce las caras y sus emociones',
    icon: '😊',
    cat: 'Emociones',
    kind: 'choice',
    roundsToWin: 3,
    generate: genEmotion,
  },
  {
    id: 17,
    title: 'Rimas Divertidas',
    desc: 'Escucha una palabra y encuentra la que rima',
    icon: '🎵',
    cat: 'Letras',
    kind: 'choice',
    roundsToWin: 3,
    generate: genRhyme,
  },
  {
    id: 18,
    title: 'Grande y Pequeño',
    desc: 'Toca el que es más grande o más pequeño',
    icon: '📏',
    cat: 'Comparación',
    kind: 'choice',
    roundsToWin: 3,
    generate: genSize,
  },
  {
    id: 19,
    title: 'La Rutina del Día',
    desc: '¿Qué toca después en el día?',
    icon: '🕐',
    cat: 'Lógica',
    kind: 'choice',
    roundsToWin: 3,
    generate: genRoutine,
  },
];

export const TOTAL_GAMES = GAMES.length;

/**
 * Los ids que existen de verdad, para validar el progreso guardado.
 *
 * No vale con comparar contra `TOTAL_GAMES`: hoy coincide por accidente
 * (ids 1..19 y 19 pruebas), pero en cuanto se reserven rangos de id por fase
 * habrá ids mayores que `GAMES.length` y el progreso de esas pruebas se
 * descartaría en silencio al recargar.
 */
export const GAME_IDS: ReadonlySet<number> = new Set(GAMES.map((g) => g.id));

export function findGame(id: number): GameDefinition | undefined {
  return GAMES.find((g) => g.id === id);
}

/**
 * La prueba siguiente en el orden del mapa, o `undefined` si es la última.
 *
 * Se recorre el catálogo en vez de sumar 1 al id: en cuanto los ids dejen de
 * ser consecutivos, «Siguiente» saltaría a un id inexistente y la pantalla se
 * quedaría en blanco.
 */
export function nextGameId(currentId: number): number | undefined {
  const index = GAMES.findIndex((g) => g.id === currentId);
  if (index === -1) return undefined;
  return GAMES[index + 1]?.id;
}

export interface Sticker {
  /** Coincide con el id de la prueba que la desbloquea. */
  gameId: number;
  name: string;
  icon: string;
  bg: string;
  color: string;
}

/** La pegatina N se gana superando la prueba N. */
export const STICKERS: readonly Sticker[] = [
  { gameId: 1, name: 'Mariquita Risueña', icon: '🐞', bg: 'bg-red-100', color: 'text-red-500' },
  { gameId: 2, name: 'Oruga Saltarina', icon: '🐛', bg: 'bg-green-100', color: 'text-green-600' },
  { gameId: 3, name: 'Abeja Bailarina', icon: '🐝', bg: 'bg-yellow-100', color: 'text-yellow-600' },
  { gameId: 4, name: 'Ranita Sonriente', icon: '🐸', bg: 'bg-emerald-100', color: 'text-emerald-600' },
  { gameId: 5, name: 'Caracol Veloz', icon: '🐌', bg: 'bg-orange-100', color: 'text-orange-500' },
  { gameId: 6, name: 'Axolote Curioso', icon: '🦎', bg: 'bg-pink-100', color: 'text-pink-500' },
  { gameId: 7, name: 'Búho Sabihondo', icon: '🦉', bg: 'bg-purple-100', color: 'text-purple-600' },
  { gameId: 8, name: 'Gatito Mágico', icon: '🐱', bg: 'bg-indigo-100', color: 'text-indigo-500' },
  { gameId: 9, name: 'Perrito Juguetón', icon: '🐶', bg: 'bg-amber-100', color: 'text-amber-600' },
  { gameId: 10, name: 'Erizito Dulce', icon: '🦔', bg: 'bg-stone-100', color: 'text-stone-600' },
  { gameId: 11, name: 'Monito Risueño', icon: '🐵', bg: 'bg-amber-200', color: 'text-amber-800' },
  { gameId: 12, name: 'Unicornio Bebé', icon: '🦄', bg: 'bg-fuchsia-100', color: 'text-fuchsia-500' },
  {
    gameId: 13,
    name: 'Super Bichito Dorado',
    icon: '👑',
    bg: 'bg-yellow-200',
    color: 'text-yellow-700',
  },
  { gameId: 14, name: 'Loro Multicolor', icon: '🦜', bg: 'bg-teal-100', color: 'text-teal-600' },
  { gameId: 15, name: 'Grillo Cantarín', icon: '🦗', bg: 'bg-lime-100', color: 'text-lime-600' },
  { gameId: 16, name: 'Koala Cariñoso', icon: '🐨', bg: 'bg-cyan-100', color: 'text-cyan-600' },
  { gameId: 17, name: 'Ruiseñor Cantor', icon: '🐦', bg: 'bg-rose-100', color: 'text-rose-500' },
  {
    gameId: 18,
    name: 'Elefantito Curioso',
    icon: '🐘',
    bg: 'bg-violet-100',
    color: 'text-violet-600',
  },
  {
    gameId: 19,
    name: 'Zorrito Madrugador',
    icon: '🦊',
    bg: 'bg-orange-200',
    color: 'text-orange-700',
  },
];

export function stickerFor(gameId: number): Sticker | undefined {
  return STICKERS.find((s) => s.gameId === gameId);
}
