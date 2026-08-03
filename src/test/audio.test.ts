import { beforeEach, describe, expect, it, vi } from 'vitest';
import { playSound, resetAudioForTests, unlockAudio } from '../lib/audio';

describe('efectos de sonido', () => {
  beforeEach(() => {
    resetAudioForTests();
    vi.clearAllMocks();
  });

  it('reutiliza un único AudioContext', () => {
    // Regresión: la versión original creaba un AudioContext por efecto. Los
    // navegadores limitan a unos 6 por página, así que el sonido enmudecía
    // tras unas cuantas interacciones.
    const spy = vi.spyOn(globalThis, 'AudioContext' as never);

    for (let i = 0; i < 30; i++) {
      playSound('pop');
      playSound('correct');
      playSound('win');
    }

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('no lanza si el navegador no tiene Web Audio', () => {
    vi.stubGlobal('AudioContext', undefined);
    resetAudioForTests();
    expect(() => playSound('win')).not.toThrow();
    expect(() => unlockAudio()).not.toThrow();
  });
});
