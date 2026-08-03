import { beforeEach, describe, expect, it } from 'vitest';
import {
  emptyProgress,
  hasSticker,
  isUnlocked,
  loadProgress,
  markCompleted,
  resetProgress,
  saveProgress,
} from '../lib/progress';

describe('desbloqueo de pruebas', () => {
  it('la primera prueba está siempre disponible', () => {
    expect(isUnlocked(emptyProgress, 1)).toBe(true);
  });

  it('el resto exige haber superado la anterior', () => {
    expect(isUnlocked(emptyProgress, 2)).toBe(false);
    expect(isUnlocked({ completed: [1] }, 2)).toBe(true);
    expect(isUnlocked({ completed: [1] }, 3)).toBe(false);
  });
});

describe('pegatinas', () => {
  it('la pegatina N se gana superando la prueba N', () => {
    const progress = { completed: [1] };
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
});

describe('persistencia', () => {
  beforeEach(() => localStorage.clear());

  it('guarda y recupera el progreso', () => {
    saveProgress({ completed: [1, 2] }, localStorage);
    expect(loadProgress(localStorage)).toEqual({ completed: [1, 2] });
  });

  it('empieza de cero si no hay nada guardado', () => {
    expect(loadProgress(localStorage)).toEqual({ completed: [] });
  });

  it('no rompe con JSON corrupto', () => {
    localStorage.setItem('bosque_magico_progress_v2', '{esto no es json');
    expect(loadProgress(localStorage)).toEqual({ completed: [] });
  });

  it('descarta ids fuera de rango o de tipo incorrecto', () => {
    localStorage.setItem(
      'bosque_magico_progress_v2',
      JSON.stringify({ completed: [1, 99, -3, 'dos', null, 2, 2] }),
    );
    expect(loadProgress(localStorage)).toEqual({ completed: [1, 2] });
  });

  it('migra el progreso de la versión anterior en HTML', () => {
    localStorage.setItem(
      'bosque_bichitos_progress',
      JSON.stringify({ completed: [1, 2, 3], stickers: [1, 2, 3, 4] }),
    );
    // Se conservan las pruebas superadas, no las pegatinas infladas del bug.
    expect(loadProgress(localStorage)).toEqual({ completed: [1, 2, 3] });
  });

  it('borra el progreso al reiniciar', () => {
    saveProgress({ completed: [1, 2] }, localStorage);
    expect(resetProgress(localStorage)).toEqual({ completed: [] });
    expect(loadProgress(localStorage)).toEqual({ completed: [] });
  });

  it('funciona sin localStorage disponible', () => {
    expect(loadProgress(undefined)).toEqual({ completed: [] });
    expect(() => saveProgress({ completed: [1] }, undefined)).not.toThrow();
  });
});
