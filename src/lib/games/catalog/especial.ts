/**
 * Pruebas y pegatinas del mundo «La Torre del Trofeo».
 *
 * Es el único mundo cuyas pruebas no traen contenido propio: remezclan el de
 * las demás. Por eso se construye con una función a la que el barril le pasa
 * el resto del catálogo, en vez de con un array suelto — así la mezcla incluye
 * sola cada prueba nueva y no hay ninguna lista que mantener a mano.
 */

import { makeMixGenerator } from '../generators';
import type { GameDefinition, Sticker } from '../types';

export function especialGames(pool: readonly GameDefinition[]): readonly GameDefinition[] {
  const generators = pool.flatMap((game) => game.generate ?? []);

  return [
    {
      id: 13,
      title: 'El Gran Desafío Final',
      desc: 'Prueba combinada para ganar el trofeo',
      icon: '🏆',
      cat: 'Especial',
      world: 'especial',
      kind: 'choice',
      roundsToWin: 5,
      generate: makeMixGenerator(generators),
    },
  ];
}

export const ESPECIAL_STICKERS: readonly Sticker[] = [
  {
    gameId: 13,
    name: 'Super Bichito Dorado',
    icon: '👑',
    bg: 'bg-yellow-200',
    color: 'text-yellow-700',
  },
];
