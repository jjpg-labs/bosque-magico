/** Pruebas y pegatinas del mundo «El Río de los Números». */

import {
  genCount,
  genNumberSequence,
} from '../generators';
import type { GameDefinition, Sticker } from '../types';

export const NUMEROS_GAMES: readonly GameDefinition[] = [
  {
    id: 2,
    title: 'Cuenta los Bichitos',
    desc: 'Cuenta cuántos bichitos hay en el jardín',
    icon: '🔢',
    cat: 'Números',
    world: 'numeros',
    kind: 'choice',
    roundsToWin: 3,
    generate: genCount,
  },
  {
    id: 10,
    title: 'El Tren de los Números',
    desc: '¿Qué número falta en el vagón?',
    icon: '🚂',
    cat: 'Números',
    world: 'numeros',
    kind: 'choice',
    roundsToWin: 3,
    generate: genNumberSequence,
  },
];

export const NUMEROS_STICKERS: readonly Sticker[] = [
  { gameId: 2, name: 'Oruga Saltarina', icon: '🐛', bg: 'bg-green-100', color: 'text-green-600' },
  { gameId: 10, name: 'Erizito Dulce', icon: '🦔', bg: 'bg-stone-100', color: 'text-stone-600' },
];
