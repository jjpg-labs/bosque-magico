/** Pruebas y pegatinas del mundo «La Montaña de las Formas». */

import {
  genColors,
  genShapeMatch,
  genShapes,
} from '../generators';
import type { GameDefinition, Sticker } from '../types';

export const FORMAS_GAMES: readonly GameDefinition[] = [
  {
    id: 5,
    title: 'Formas Geométricas',
    desc: 'Encuentra la figura geométrica correcta',
    icon: '📐',
    cat: 'Geometría',
    world: 'formas',
    kind: 'choice',
    roundsToWin: 3,
    generate: genShapes,
  },
  {
    id: 12,
    title: 'Empareja las Formas',
    desc: 'Encaja cada figura en su lugar',
    icon: '⭐',
    cat: 'Geometría',
    world: 'formas',
    kind: 'choice',
    roundsToWin: 3,
    generate: genShapeMatch,
  },
  {
    id: 14,
    title: 'Colores del Bosque',
    desc: 'Descubre y toca cada color',
    icon: '🎨',
    cat: 'Colores',
    world: 'formas',
    kind: 'choice',
    roundsToWin: 3,
    generate: genColors,
  },
];

export const FORMAS_STICKERS: readonly Sticker[] = [
  { gameId: 5, name: 'Caracol Veloz', icon: '🐌', bg: 'bg-orange-100', color: 'text-orange-500' },
  { gameId: 12, name: 'Unicornio Bebé', icon: '🦄', bg: 'bg-fuchsia-100', color: 'text-fuchsia-500' },
  { gameId: 14, name: 'Loro Multicolor', icon: '🦜', bg: 'bg-teal-100', color: 'text-teal-600' },
];
