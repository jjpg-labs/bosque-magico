/** Pruebas y pegatinas del mundo «El Prado de las Medidas». */

import {
  genMoreLess,
  genRoutine,
  genSize,
} from '../generators';
import type { GameDefinition, Sticker } from '../types';

export const MEDIDAS_GAMES: readonly GameDefinition[] = [
  {
    id: 9,
    title: '¿Dónde hay MÁS?',
    desc: 'Elige el grupo que tiene más elementos',
    icon: '⚖️',
    cat: 'Comparación',
    world: 'medidas',
    kind: 'choice',
    roundsToWin: 3,
    generate: genMoreLess,
  },
  {
    id: 18,
    title: 'Grande y Pequeño',
    desc: 'Toca el que es más grande o más pequeño',
    icon: '📏',
    cat: 'Comparación',
    world: 'medidas',
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
    world: 'medidas',
    kind: 'choice',
    roundsToWin: 3,
    generate: genRoutine,
  },
];

export const MEDIDAS_STICKERS: readonly Sticker[] = [
  { gameId: 9, name: 'Perrito Juguetón', icon: '🐶', bg: 'bg-amber-100', color: 'text-amber-600' },
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
