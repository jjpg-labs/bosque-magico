import {
  genAdd,
  genCount,
  genFinalChallenge,
  genLetters,
  genMoreLess,
  genNumberSequence,
  genOddOne,
  genPatterns,
  genPhonics,
  genShapeMatch,
  genShapes,
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
];

export const TOTAL_GAMES = GAMES.length;

export function findGame(id: number): GameDefinition | undefined {
  return GAMES.find((g) => g.id === id);
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
];

export function stickerFor(gameId: number): Sticker | undefined {
  return STICKERS.find((s) => s.gameId === gameId);
}
