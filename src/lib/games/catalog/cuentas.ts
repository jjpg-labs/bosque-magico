/** Pruebas y pegatinas del mundo «La Cueva de las Cuentas». */

import {
  genAdd,
  genSub,
} from '../generators';
import type { GameDefinition, Sticker } from '../types';

export const CUENTAS_GAMES: readonly GameDefinition[] = [
  {
    id: 3,
    title: 'La Suma de las Manzanas',
    desc: 'Suma las manzanas del árbol',
    icon: '🍎',
    cat: 'Sumas',
    world: 'cuentas',
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
    world: 'cuentas',
    kind: 'choice',
    roundsToWin: 3,
    generate: genSub,
  },
];

export const CUENTAS_STICKERS: readonly Sticker[] = [
  { gameId: 3, name: 'Abeja Bailarina', icon: '🐝', bg: 'bg-yellow-100', color: 'text-yellow-600' },
  { gameId: 4, name: 'Ranita Sonriente', icon: '🐸', bg: 'bg-emerald-100', color: 'text-emerald-600' },
];
