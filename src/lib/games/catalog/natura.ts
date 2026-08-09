/** Pruebas y pegatinas del mundo «El Bosque de los Animales». */

import {
  genAnimalSound,
} from '../generators';
import type { GameDefinition, Sticker } from '../types';

export const NATURA_GAMES: readonly GameDefinition[] = [
  {
    id: 15,
    title: '¿Quién Hace Este Sonido?',
    desc: 'Escucha el sonido y adivina qué animal es',
    icon: '🔊',
    cat: 'Sonidos',
    world: 'natura',
    kind: 'choice',
    roundsToWin: 3,
    generate: genAnimalSound,
  },
];

export const NATURA_STICKERS: readonly Sticker[] = [
  { gameId: 15, name: 'Grillo Cantarín', icon: '🦗', bg: 'bg-lime-100', color: 'text-lime-600' },
];
