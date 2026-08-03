import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  localStorage.clear();
});

// jsdom no implementa la Web Audio API ni la síntesis de voz. Se sustituyen por
// dobles vacíos para que los componentes puedan llamarlas sin romper el test.
class FakeAudioContext {
  state = 'running';
  currentTime = 0;
  destination = {};
  resume = vi.fn();
  createOscillator = () => ({
    type: 'sine',
    frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  });
  createGain = () => ({
    gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    connect: vi.fn(),
  });
}

vi.stubGlobal('AudioContext', FakeAudioContext);

vi.stubGlobal('speechSynthesis', {
  getVoices: () => [],
  speak: vi.fn(),
  cancel: vi.fn(),
  resume: vi.fn(),
  pause: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
});

vi.stubGlobal(
  'SpeechSynthesisUtterance',
  class {
    text: string;
    lang = '';
    rate = 1;
    pitch = 1;
    onstart: (() => void) | null = null;
    onend: (() => void) | null = null;
    onerror: (() => void) | null = null;
    constructor(text: string) {
      this.text = text;
    }
  },
);

// matchMedia tampoco existe en jsdom; se usa para `prefers-reduced-motion`.
vi.stubGlobal(
  'matchMedia',
  vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
);
