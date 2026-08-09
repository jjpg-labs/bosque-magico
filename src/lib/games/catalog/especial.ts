/**
 * Pruebas y pegatinas del mundo «La Torre del Trofeo».
 *
 * Es el único mundo cuyas pruebas no traen contenido propio: remezclan el de
 * las demás. Por eso se construye con una función a la que el barril le pasa
 * el resto del catálogo, en vez de con un array suelto — así la mezcla incluye
 * sola cada prueba nueva y no hay ninguna lista que mantener a mano.
 */

import { makeDailyGenerator, makeMixGenerator } from '../generators';
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
    {
      id: 101,
      title: 'La Aventura del Día',
      desc: 'Una aventura distinta cada día',
      icon: '🗺️',
      cat: 'Aventura',
      world: 'especial',
      kind: 'choice',
      roundsToWin: 8,
      // Solo mezcla lo que ya se ha superado: la aventura del día nunca saca
      // una prueba que la niña todavía no ha visto.
      generateFor: (completedIds) => {
        const known = pool.filter((game) => completedIds.includes(game.id));
        const source = known.length > 0 ? known : pool;
        return makeDailyGenerator(source.flatMap((game) => game.generate ?? []));
      },
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
  { gameId: 101, name: 'Mapa del Tesoro', icon: '🗺️' },
];
