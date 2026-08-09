/** Pruebas y pegatinas del mundo «El Laberinto de la Lógica». */

import {
  genOddOne,
  genPatterns,
} from '../generators';
import type { GameDefinition, Sticker } from '../types';

export const LOGICA_GAMES: readonly GameDefinition[] = [
  {
    id: 6,
    title: 'Patrones Divertidos',
    desc: '¿Qué bichito sigue en la fila?',
    icon: '🧩',
    cat: 'Lógica',
    world: 'logica',
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
    world: 'logica',
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
    world: 'logica',
    kind: 'memory',
    roundsToWin: 1,
    pairCount: 4,
  },
];

export const LOGICA_STICKERS: readonly Sticker[] = [
  { gameId: 6, name: 'Axolote Curioso', icon: '🦎', bg: 'bg-pink-100', color: 'text-pink-500' },
  { gameId: 7, name: 'Búho Sabihondo', icon: '🦉', bg: 'bg-purple-100', color: 'text-purple-600' },
  { gameId: 8, name: 'Gatito Mágico', icon: '🐱', bg: 'bg-indigo-100', color: 'text-indigo-500' },
];
