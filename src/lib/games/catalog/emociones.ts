/** Pruebas y pegatinas del mundo «La Plaza de las Emociones». */

import {
  genEmotion,
} from '../generators';
import type { GameDefinition, Sticker } from '../types';

export const EMOCIONES_GAMES: readonly GameDefinition[] = [
  {
    id: 16,
    title: '¿Cómo Se Siente?',
    desc: 'Reconoce las caras y sus emociones',
    icon: '😊',
    cat: 'Emociones',
    world: 'emociones',
    kind: 'choice',
    roundsToWin: 3,
    generate: genEmotion,
  },
];

export const EMOCIONES_STICKERS: readonly Sticker[] = [
  { gameId: 16, name: 'Koala Cariñoso', icon: '🐨', bg: 'bg-cyan-100', color: 'text-cyan-600' },
];
