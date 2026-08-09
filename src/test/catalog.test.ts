import { describe, expect, it } from 'vitest';
import {
  GAMES,
  GAME_IDS,
  STICKERS,
  WORLDS,
  findGame,
  gamesOfWorld,
  nextGameId,
  populatedWorlds,
  stickerFor,
  stickerStyle,
  worldOfGame,
} from '../lib/games/catalog';

describe('catálogo', () => {
  it('cada prueba pertenece a un mundo que existe', () => {
    for (const game of GAMES) {
      expect(WORLDS.some((world) => world.id === game.world), game.title).toBe(true);
    }
  });

  it('los mundos cubren el catálogo entero sin dejarse ninguna prueba', () => {
    const covered = populatedWorlds().flatMap((world) => gamesOfWorld(world.id).map((g) => g.id));
    expect(covered.sort((a, b) => a - b)).toEqual(GAMES.map((g) => g.id));
  });

  it('las pruebas de un mundo van en orden de id', () => {
    for (const world of populatedWorlds()) {
      const ids = gamesOfWorld(world.id).map((game) => game.id);
      expect(ids, world.name).toEqual([...ids].sort((a, b) => a - b));
    }
  });

  it('hay exactamente una pegatina por prueba', () => {
    expect(STICKERS).toHaveLength(GAMES.length);
    for (const game of GAMES) {
      expect(stickerFor(game.id), `prueba ${game.id}`).toBeDefined();
    }
    for (const sticker of STICKERS) {
      expect(GAME_IDS.has(sticker.gameId), `pegatina ${sticker.gameId}`).toBe(true);
    }
  });

  it('la pegatina sin colores propios los hereda de su mundo', () => {
    const world = worldOfGame(1)!;
    expect(stickerStyle({ gameId: 1, name: 'x', icon: '🐞' })).toEqual({
      bg: world.bg,
      color: world.color,
    });
    // Y las que sí los traen (las 19 originales) los conservan.
    expect(stickerStyle(stickerFor(1)!)).toEqual({ bg: 'bg-red-100', color: 'text-red-500' });
  });
});

describe('nextGameId', () => {
  it('avanza a la siguiente prueba del mismo mundo', () => {
    const [primera, segunda] = gamesOfWorld('letras');
    expect(nextGameId(primera.id)).toBe(segunda.id);
  });

  it('al acabar un mundo salta a la primera del mundo siguiente', () => {
    const letras = gamesOfWorld('letras');
    const ultima = letras[letras.length - 1];
    expect(nextGameId(ultima.id)).toBe(gamesOfWorld('numeros')[0].id);
  });

  it('se salta los mundos que todavía no tienen pruebas', () => {
    // «natura» solo tiene una prueba y los dos mundos siguientes con
    // contenido no son el inmediato del orden de WORLDS.
    const siguiente = nextGameId(gamesOfWorld('natura')[0].id);
    expect(siguiente).toBe(gamesOfWorld('emociones')[0].id);
  });

  it('devuelve undefined en la última prueba del catálogo', () => {
    const ultimoMundo = populatedWorlds()[populatedWorlds().length - 1];
    const ultimas = gamesOfWorld(ultimoMundo.id);
    expect(nextGameId(ultimas[ultimas.length - 1].id)).toBeUndefined();
  });

  it('nunca lleva a un id que no exista', () => {
    // Con ids reservados por rangos hay huecos: sumar 1 al id llevaba a una
    // prueba inexistente y la pantalla se quedaba en blanco.
    for (const game of GAMES) {
      const next = nextGameId(game.id);
      if (next === undefined) continue;
      expect(findGame(next), `desde la prueba ${game.id}`).toBeDefined();
    }
  });

  it('recorre el catálogo entero sin repetir ni dejarse ninguna', () => {
    const visited: number[] = [];
    let current: number | undefined = populatedWorlds()[0].id
      ? gamesOfWorld(populatedWorlds()[0].id)[0].id
      : undefined;

    while (current !== undefined && visited.length <= GAMES.length) {
      visited.push(current);
      current = nextGameId(current);
    }

    expect(new Set(visited).size).toBe(visited.length);
    expect(visited).toHaveLength(GAMES.length);
  });

  it('devuelve undefined para una prueba que no existe', () => {
    expect(nextGameId(9999)).toBeUndefined();
  });
});
