/**
 * Efectos de sonido sintetizados con la Web Audio API.
 *
 * Un único AudioContext para toda la app: los navegadores limitan el número de
 * contextos por página (~6 en Chrome), así que crear uno por efecto agota la
 * cuota y el sonido deja de oírse tras unas cuantas interacciones.
 */

export type SoundName = 'correct' | 'pop' | 'win' | 'retry';

let ctx: AudioContext | null = null;
let unlocked = false;

type AudioContextCtor = typeof AudioContext;

function audioContextCtor(): AudioContextCtor | undefined {
  if (typeof window === 'undefined') return undefined;
  return (
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext
  );
}

function getContext(): AudioContext | null {
  if (ctx) return ctx;
  const Ctor = audioContextCtor();
  if (!Ctor) return null;
  try {
    ctx = new Ctor();
  } catch {
    return null;
  }
  return ctx;
}

/**
 * Los navegadores móviles mantienen el audio suspendido hasta que hay un gesto
 * del usuario. Se llama en el primer toque para reanudar el contexto.
 */
export function unlockAudio(): void {
  const context = getContext();
  if (context && context.state === 'suspended') {
    void context.resume();
  }
  if (unlocked) return;
  unlocked = true;
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
}

function tone(
  context: AudioContext,
  { type, from, to, at, duration, volume }: {
    type: OscillatorType;
    from: number;
    to?: number;
    at: number;
    duration: number;
    volume: number;
  },
): void {
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.connect(gain);
  gain.connect(context.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(from, at);
  if (to !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(to, at + duration);
  }

  // exponentialRamp no admite 0 como destino, de ahí el 0.0001.
  gain.gain.setValueAtTime(volume, at);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);

  osc.start(at);
  osc.stop(at + duration);
}

export function playSound(name: SoundName): void {
  const context = getContext();
  if (!context) return;
  if (context.state === 'suspended') void context.resume();

  const now = context.currentTime;

  switch (name) {
    case 'correct':
      tone(context, { type: 'sine', from: 523.25, to: 880, at: now, duration: 0.3, volume: 0.25 });
      break;
    case 'pop':
      tone(context, { type: 'triangle', from: 300, to: 600, at: now, duration: 0.1, volume: 0.18 });
      break;
    case 'retry':
      // Descendente y suave: señala "otra vez" sin sonar a castigo.
      tone(context, { type: 'sine', from: 400, to: 300, at: now, duration: 0.18, volume: 0.15 });
      break;
    case 'win':
      [440, 554.37, 659.25, 880].forEach((freq, i) => {
        tone(context, {
          type: 'sine',
          from: freq,
          at: now + i * 0.12,
          duration: 0.25,
          volume: 0.2,
        });
      });
      break;
  }
}

/** Solo para tests: descarta el contexto memorizado. */
export function resetAudioForTests(): void {
  ctx = null;
  unlocked = false;
}
