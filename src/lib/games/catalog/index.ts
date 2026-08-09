/**
 * El catálogo: qué pruebas hay, en qué mundo está cada una y qué pegatina da.
 *
 * Se compone a partir de un fichero por mundo. Un lote de contenido nuevo
 * crea su `catalog/<mundo>.ts` con sus `GameDefinition[]` y sus `Sticker[]`, y
 * añade **una línea** en cada uno de los dos arrays de abajo.
 */

import { CUENTAS_GAMES, CUENTAS_STICKERS } from './cuentas';
import { EMOCIONES_GAMES, EMOCIONES_STICKERS } from './emociones';
import { ESPECIAL_STICKERS, especialGames } from './especial';
import { FORMAS_GAMES, FORMAS_STICKERS } from './formas';
import { LETRAS_GAMES, LETRAS_STICKERS } from './letras';
import { LOGICA_GAMES, LOGICA_STICKERS } from './logica';
import { MEDIDAS_GAMES, MEDIDAS_STICKERS } from './medidas';
import { NATURA_GAMES, NATURA_STICKERS } from './natura';
import { NUMEROS_GAMES, NUMEROS_STICKERS } from './numeros';
import { WORLDS, findWorld } from './worlds';
import type { GameDefinition, Sticker, World, WorldId } from '../types';

export { WORLDS, findWorld };
export type { Sticker } from '../types';

/**
 * Las pruebas con contenido propio, de las que se deriva la mezcla del trofeo.
 *
 * Ordenadas por id, no por mundo: el pool de la mezcla se construye a partir
 * de esta lista y `pick` elige por índice, así que el orden decide qué
 * ejercicio sale con cada semilla. Con los ids como criterio, reagrupar los
 * ficheros por mundo no cambia ni una ronda.
 */
const CONTENT_GAMES: readonly GameDefinition[] = [
  ...LETRAS_GAMES,
  ...NUMEROS_GAMES,
  ...CUENTAS_GAMES,
  ...FORMAS_GAMES,
  ...LOGICA_GAMES,
  ...MEDIDAS_GAMES,
  ...NATURA_GAMES,
  ...EMOCIONES_GAMES,
].sort((a, b) => a.id - b.id);

/**
 * Todas las pruebas, ordenadas por id. El orden del mapa lo pone `WORLDS`, y
 * el orden dentro de un mundo es el de los ids: el contenido nuevo de un mundo
 * se juega después del que ya había.
 */
export const GAMES: readonly GameDefinition[] = [
  ...CONTENT_GAMES,
  ...especialGames(CONTENT_GAMES),
].sort((a, b) => a.id - b.id);

/**
 * Los ids que existen de verdad, para validar el progreso guardado.
 *
 * No vale con comparar contra `GAMES.length`: hoy coincidiría por accidente
 * (ids 1..19 y 19 pruebas), pero en cuanto se reserven rangos de id por fase
 * habrá ids mayores que el total y el progreso de esas pruebas se descartaría
 * en silencio al recargar. Por eso tampoco existe un `TOTAL_GAMES` exportado:
 * era la vía fácil de volver a cometer ese error.
 */
export const GAME_IDS: ReadonlySet<number> = new Set(GAMES.map((g) => g.id));

export function findGame(id: number): GameDefinition | undefined {
  return GAMES.find((g) => g.id === id);
}

/** Las pruebas de un mundo, en el orden en que se juegan (por id). */
export function gamesOfWorld(worldId: WorldId): readonly GameDefinition[] {
  return GAMES.filter((game) => game.world === worldId);
}

export function worldOfGame(gameId: number): World | undefined {
  const game = findGame(gameId);
  return game && findWorld(game.world);
}

/** Mundos que tienen al menos una prueba: los vacíos no se pintan. */
export function populatedWorlds(): readonly World[] {
  return WORLDS.filter((world) => gamesOfWorld(world.id).length > 0);
}

/**
 * La prueba siguiente: la siguiente del mismo mundo y, si no queda ninguna, la
 * primera del mundo siguiente que tenga pruebas. `undefined` en la última.
 *
 * No vale con sumar 1 al id ni con avanzar en el catálogo plano: los ids se
 * reservan por rangos y tienen huecos, y «Siguiente» tiene que seguir el hilo
 * del mundo en el que se está jugando, no saltar a otro tema a media tanda.
 */
export function nextGameId(currentId: number): number | undefined {
  const game = findGame(currentId);
  if (!game) return undefined;

  const siblings = gamesOfWorld(game.world);
  const index = siblings.findIndex((g) => g.id === currentId);
  const nextInWorld = siblings[index + 1];
  if (nextInWorld) return nextInWorld.id;

  const worldIndex = WORLDS.findIndex((w) => w.id === game.world);
  for (const world of WORLDS.slice(worldIndex + 1)) {
    const first = gamesOfWorld(world.id)[0];
    if (first) return first.id;
  }
  return undefined;
}

/** La pegatina N se gana superando la prueba N. */
export const STICKERS: readonly Sticker[] = [
  ...LETRAS_STICKERS,
  ...NUMEROS_STICKERS,
  ...CUENTAS_STICKERS,
  ...FORMAS_STICKERS,
  ...LOGICA_STICKERS,
  ...MEDIDAS_STICKERS,
  ...NATURA_STICKERS,
  ...EMOCIONES_STICKERS,
  ...ESPECIAL_STICKERS,
].sort((a, b) => a.gameId - b.gameId);

export function stickerFor(gameId: number): Sticker | undefined {
  return STICKERS.find((s) => s.gameId === gameId);
}

/** Colores con los que pintar una pegatina: los suyos o, si no tiene, los de su mundo. */
export function stickerStyle(sticker: Sticker): { bg: string; color: string } {
  const world = worldOfGame(sticker.gameId);
  return {
    bg: sticker.bg ?? world?.bg ?? 'bg-slate-100',
    color: sticker.color ?? world?.color ?? 'text-slate-600',
  };
}
