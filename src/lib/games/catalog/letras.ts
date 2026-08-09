/** Pruebas y pegatinas del mundo «El Claro de las Letras». */

import {
  genLetters,
  genPhonics,
  genRhyme,
} from '../generators';
import type { GameDefinition, Sticker } from '../types';

export const LETRAS_GAMES: readonly GameDefinition[] = [
  {
    id: 1,
    title: 'Letras Iniciales',
    desc: '¿Qué letra empieza como el animalito?',
    icon: '🔤',
    cat: 'Letras',
    world: 'letras',
    kind: 'choice',
    roundsToWin: 3,
    generate: genLetters,
  },
  {
    id: 11,
    title: 'Sonidos e Iniciales',
    desc: 'Escucha la palabra e identifica la vocal inicial',
    icon: '🗣️',
    cat: 'Letras',
    world: 'letras',
    kind: 'choice',
    roundsToWin: 3,
    generate: genPhonics,
  },
  {
    id: 17,
    title: 'Rimas Divertidas',
    desc: 'Escucha una palabra y encuentra la que rima',
    icon: '🎵',
    cat: 'Letras',
    world: 'letras',
    kind: 'choice',
    roundsToWin: 3,
    generate: genRhyme,
  },
];

export const LETRAS_STICKERS: readonly Sticker[] = [
  { gameId: 1, name: 'Mariquita Risueña', icon: '🐞', bg: 'bg-red-100', color: 'text-red-500' },
  { gameId: 11, name: 'Monito Risueño', icon: '🐵', bg: 'bg-amber-200', color: 'text-amber-800' },
  { gameId: 17, name: 'Ruiseñor Cantor', icon: '🐦', bg: 'bg-rose-100', color: 'text-rose-500' },
];
