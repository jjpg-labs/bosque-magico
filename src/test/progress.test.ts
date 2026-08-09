import { beforeEach, describe, expect, it } from 'vitest';
import {
  allWorldProgress,
  currentWorldId,
  emptyProgress,
  hasSticker,
  incrementPlayCount,
  isUnlocked,
  isWorldUnlocked,
  loadProgress,
  markCompleted,
  resetProgress,
  saveProgress,
  tierFor,
  worldProgress,
} from '../lib/progress';
import type { Progress } from '../lib/progress';
import { GAMES, WORLDS, gamesOfWorld, populatedWorlds } from '../lib/games/catalog';

function progressWith(completed: number[], playCounts: Record<number, number> = {}): Progress {
  return { completed, playCounts };
}

/** Todas las pruebas de los mundos indicados, para dar por hecho un mundo entero. */
function idsOf(...worlds: Array<Parameters<typeof gamesOfWorld>[0]>): number[] {
  return worlds.flatMap((world) => gamesOfWorld(world).map((game) => game.id));
}

describe('apertura de mundos', () => {
  it('los mundos «always» están abiertos desde el primer día', () => {
    const open = WORLDS.filter((world) => world.unlock.kind === 'always');
    // Varios a la vez: es lo que evita quedarse atascada detrás de una prueba.
    expect(open.length).toBeGreaterThanOrEqual(4);
    for (const world of open) {
      expect(isWorldUnlocked(emptyProgress, world.id), world.name).toBe(true);
    }
  });

  it('un mundo dependiente sigue cerrado hasta cumplir su condición', () => {
    // «La Cueva de las Cuentas» pide pruebas superadas de «El Río de los Números».
    expect(isWorldUnlocked(emptyProgress, 'cuentas')).toBe(false);
    expect(isWorldUnlocked(progressWith(idsOf('numeros')), 'cuentas')).toBe(true);
  });

  it('el requisito se recorta a las pruebas que existen de verdad', () => {
    // Los mundos se dimensionaron para cien pruebas. Mientras el catálogo se
    // llena por fases, un mundo con menos pruebas que su requisito quedaría
    // cerrado para siempre si no se recortase.
    for (const world of WORLDS) {
      if (world.unlock.kind !== 'world') continue;
      const source = gamesOfWorld(world.unlock.world);
      expect(isWorldUnlocked(progressWith(source.map((g) => g.id)), world.id), world.name).toBe(
        true,
      );
    }
  });

  it('la torre del trofeo se abre al llevar superado el resto del catálogo', () => {
    const rest = GAMES.filter((game) => game.world !== 'especial').map((game) => game.id);
    expect(isWorldUnlocked(emptyProgress, 'especial')).toBe(false);
    expect(isWorldUnlocked(progressWith(rest), 'especial')).toBe(true);
  });
});

describe('desbloqueo de pruebas', () => {
  it('la primera prueba de cada mundo abierto está disponible sin jugar nada', () => {
    for (const world of populatedWorlds()) {
      if (!isWorldUnlocked(emptyProgress, world.id)) continue;
      const first = gamesOfWorld(world.id)[0];
      expect(isUnlocked(emptyProgress, first.id), world.name).toBe(true);
    }
  });

  it('dentro de un mundo, cada prueba exige la anterior de ese mundo', () => {
    const [primera, segunda, tercera] = gamesOfWorld('letras');
    expect(isUnlocked(emptyProgress, segunda.id)).toBe(false);
    expect(isUnlocked(progressWith([primera.id]), segunda.id)).toBe(true);
    expect(isUnlocked(progressWith([primera.id]), tercera.id)).toBe(false);
  });

  it('las cadenas ya no cruzan de un mundo a otro', () => {
    // Regresión del desbloqueo lineal: la prueba 2 exigía la 1 solo porque
    // eran consecutivas en el catálogo, aunque son de mundos distintos.
    expect(isUnlocked(emptyProgress, 2)).toBe(true);
  });

  it('un mundo cerrado mantiene bloqueadas todas sus pruebas', () => {
    for (const game of gamesOfWorld('cuentas')) {
      expect(isUnlocked(emptyProgress, game.id)).toBe(false);
    }
  });

  it('una prueba ya superada no se vuelve a bloquear nunca', () => {
    // Aunque cambien las condiciones de los mundos con el catálogo: quitarle
    // acceso a algo que ya se ganó sería incomprensible desde el otro lado.
    const game = gamesOfWorld('cuentas')[0];
    expect(isUnlocked(progressWith([game.id]), game.id)).toBe(true);
  });

  it('una prueba que no existe no está desbloqueada', () => {
    expect(isUnlocked(emptyProgress, 9999)).toBe(false);
  });
});

describe('progreso por mundo', () => {
  it('cuenta las pruebas superadas de cada mundo', () => {
    const letras = gamesOfWorld('letras');
    const entry = worldProgress(progressWith([letras[0].id]), 'letras')!;
    expect(entry.total).toBe(letras.length);
    expect(entry.completed).toBe(1);
    expect(entry.done).toBe(false);
  });

  it('marca el mundo como terminado al superarlo entero (medalla)', () => {
    const entry = worldProgress(progressWith(idsOf('letras')), 'letras')!;
    expect(entry.done).toBe(true);
  });

  it('solo lista los mundos que tienen pruebas', () => {
    const listed = allWorldProgress(emptyProgress);
    expect(listed.every((entry) => entry.total > 0)).toBe(true);
    expect(listed.map((entry) => entry.world.id)).toEqual(populatedWorlds().map((w) => w.id));
  });

  it('el mundo en curso es el primero abierto y sin terminar', () => {
    expect(currentWorldId(emptyProgress)).toBe(populatedWorlds()[0].id);
    // Con un mundo empezado a medias, ese pasa a ser el mundo en curso.
    const started = progressWith([gamesOfWorld('numeros')[0].id]);
    expect(currentWorldId(started)).toBe('numeros');
  });
});

describe('pegatinas', () => {
  it('la pegatina N se gana superando la prueba N', () => {
    const progress = progressWith([1]);
    expect(hasSticker(progress, 1)).toBe(true);
    expect(hasSticker(progress, 2)).toBe(false);
  });

  it('completar una prueba concede exactamente una pegatina', () => {
    // Regresión: la versión original añadía `gameId` y `gameId + 1` al álbum,
    // así que la prueba 1 regalaba también la pegatina 2.
    const progress = markCompleted(emptyProgress, 1);
    const owned = [1, 2, 3].filter((id) => hasSticker(progress, id));
    expect(owned).toEqual([1]);
  });

  it('no duplica una prueba ya superada', () => {
    const once = markCompleted(emptyProgress, 5);
    const twice = markCompleted(once, 5);
    expect(twice.completed).toEqual([5]);
    expect(twice).toBe(once);
  });

  it('mantiene las pruebas ordenadas', () => {
    const progress = markCompleted(markCompleted(emptyProgress, 3), 1);
    expect(progress.completed).toEqual([1, 3]);
  });

  it('markCompleted conserva los playCounts existentes', () => {
    const withPlays = incrementPlayCount(emptyProgress, 1);
    const progress = markCompleted(withPlays, 1);
    expect(progress.playCounts).toEqual({ 1: 1 });
  });
});

describe('dificultad escalonada', () => {
  it('empieza en tier 0 sin partidas jugadas', () => {
    expect(tierFor(emptyProgress, 3)).toBe(0);
  });

  it('sube de tier cada 3 partidas, con tope en 2', () => {
    let progress = emptyProgress;
    for (let i = 0; i < 3; i++) progress = incrementPlayCount(progress, 3);
    expect(tierFor(progress, 3)).toBe(1);

    for (let i = 0; i < 3; i++) progress = incrementPlayCount(progress, 3);
    expect(tierFor(progress, 3)).toBe(2);

    for (let i = 0; i < 30; i++) progress = incrementPlayCount(progress, 3);
    expect(tierFor(progress, 3)).toBe(2);
  });

  it('el contador es independiente por prueba', () => {
    let progress = incrementPlayCount(emptyProgress, 1);
    progress = incrementPlayCount(progress, 1);
    expect(progress.playCounts).toEqual({ 1: 2 });
    expect(tierFor(progress, 2)).toBe(0);
  });
});

describe('persistencia', () => {
  beforeEach(() => localStorage.clear());

  it('guarda y recupera el progreso', () => {
    const progress = incrementPlayCount(progressWith([1, 2]), 3);
    saveProgress(progress, localStorage);
    expect(loadProgress(localStorage)).toEqual(progress);
  });

  it('empieza de cero si no hay nada guardado', () => {
    expect(loadProgress(localStorage)).toEqual(emptyProgress);
  });

  it('no rompe con JSON corrupto', () => {
    localStorage.setItem('bosque_magico_progress_v2', '{esto no es json');
    expect(loadProgress(localStorage)).toEqual(emptyProgress);
  });

  it('descarta ids que no existen en el catálogo o de tipo incorrecto', () => {
    const inexistente = Math.max(...GAMES.map((g) => g.id)) + 1;
    localStorage.setItem(
      'bosque_magico_progress_v2',
      JSON.stringify({ completed: [1, inexistente, -3, 'dos', null, 2, 2] }),
    );
    expect(loadProgress(localStorage)).toEqual(progressWith([1, 2]));
  });

  it('un progreso ya guardado sobrevive intacto a la recarga', () => {
    // El caso concreto que hay que proteger al reestructurar el catálogo: lo
    // que la niña ya tenía guardado antes del cambio. El formato de
    // `bosque_magico_progress_v2` no se toca y los ids 1..19 no se reasignan.
    const guardado = { version: 2, completed: [1, 2, 3], playCounts: { 1: 5, 2: 2, 3: 7 } };
    localStorage.setItem('bosque_magico_progress_v2', JSON.stringify(guardado));

    const loaded = loadProgress(localStorage);
    expect(loaded.completed).toEqual([1, 2, 3]);
    expect(loaded.playCounts).toEqual({ 1: 5, 2: 2, 3: 7 });
    // Y la dificultad escalonada sigue donde estaba.
    expect(tierFor(loaded, 3)).toBe(2);
  });

  it('conserva íntegro el progreso de todas las pruebas del catálogo', () => {
    // Regresión de pérdida de datos: `sanitize` validaba contra `TOTAL_GAMES`
    // en vez de contra los ids reales. Funcionaba de casualidad porque los
    // ids eran 1..19 y había 19 pruebas; en cuanto el catálogo tenga huecos
    // de id, esa versión borraba en silencio las pruebas superadas y las
    // pegatinas ganadas al recargar.
    const completed = GAMES.map((g) => g.id);
    const playCounts = Object.fromEntries(GAMES.map((g) => [g.id, 4]));
    saveProgress({ completed, playCounts }, localStorage);

    const loaded = loadProgress(localStorage);
    expect(loaded.completed).toEqual(completed);
    expect(loaded.playCounts).toEqual(playCounts);
  });

  it('migra un progreso v2 sin playCounts a un objeto vacío', () => {
    localStorage.setItem('bosque_magico_progress_v2', JSON.stringify({ version: 2, completed: [1, 2] }));
    expect(loadProgress(localStorage)).toEqual(progressWith([1, 2]));
  });

  it('migra el progreso de la versión anterior en HTML', () => {
    localStorage.setItem(
      'bosque_bichitos_progress',
      JSON.stringify({ completed: [1, 2, 3], stickers: [1, 2, 3, 4] }),
    );
    // Se conservan las pruebas superadas, no las pegatinas infladas del bug.
    expect(loadProgress(localStorage)).toEqual(progressWith([1, 2, 3]));
  });

  it('borra el progreso al reiniciar', () => {
    saveProgress(progressWith([1, 2]), localStorage);
    expect(resetProgress(localStorage)).toEqual(emptyProgress);
    expect(loadProgress(localStorage)).toEqual(emptyProgress);
  });

  it('funciona sin localStorage disponible', () => {
    expect(loadProgress(undefined)).toEqual(emptyProgress);
    expect(() => saveProgress(progressWith([1]), undefined)).not.toThrow();
  });
});
