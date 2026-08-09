import { beforeEach, describe, expect, it } from 'vitest';
import {
  emptyProgress,
  hasSticker,
  incrementPlayCount,
  isUnlocked,
  loadProgress,
  markCompleted,
  resetProgress,
  saveProgress,
  tierFor,
} from '../lib/progress';
import type { Progress } from '../lib/progress';
import { GAMES } from '../lib/games/catalog';

function progressWith(completed: number[], playCounts: Record<number, number> = {}): Progress {
  return { completed, playCounts };
}

describe('desbloqueo de pruebas', () => {
  it('la primera prueba está siempre disponible', () => {
    expect(isUnlocked(emptyProgress, 1)).toBe(true);
  });

  it('el resto exige haber superado la anterior', () => {
    expect(isUnlocked(emptyProgress, 2)).toBe(false);
    expect(isUnlocked(progressWith([1]), 2)).toBe(true);
    expect(isUnlocked(progressWith([1]), 3)).toBe(false);
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
