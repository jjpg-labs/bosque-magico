/**
 * Síntesis de voz en español.
 *
 * Chrome carga las voces de forma asíncrona: la primera llamada a getVoices()
 * suele devolver un array vacío, y entonces la instrucción se lee con la voz
 * por defecto del sistema (normalmente en inglés). Aquí se espera al evento
 * `voiceschanged` antes de hablar.
 */

let voicesReady = false;
let pendingResolvers: Array<() => void> = [];

function supported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function markReady(): void {
  voicesReady = true;
  pendingResolvers.forEach((resolve) => resolve());
  pendingResolvers = [];
}

if (supported()) {
  if (window.speechSynthesis.getVoices().length > 0) {
    voicesReady = true;
  } else {
    window.speechSynthesis.addEventListener('voiceschanged', markReady, { once: true });
    // Red de seguridad: algunos navegadores no llegan a emitir `voiceschanged`.
    // Pasado el plazo se habla igualmente con la voz por defecto.
    setTimeout(markReady, 1500);
  }
}

function whenVoicesReady(): Promise<void> {
  if (!supported() || voicesReady) return Promise.resolve();
  return new Promise((resolve) => pendingResolvers.push(resolve));
}

function pickSpanishVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang.replace('_', '-').toLowerCase() === 'es-es') ??
    voices.find((v) => v.lang.toLowerCase().startsWith('es'))
  );
}

export interface SpeakHandlers {
  onStart?: () => void;
  onEnd?: () => void;
}

/**
 * Lee un texto en voz alta, cancelando cualquier locución anterior.
 * Es seguro llamarla en navegadores sin soporte: simplemente no hace nada.
 */
export async function speak(text: string, handlers: SpeakHandlers = {}): Promise<void> {
  if (!supported()) {
    handlers.onEnd?.();
    return;
  }

  await whenVoicesReady();

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickSpanishVoice();
    if (voice) utterance.voice = voice;

    utterance.lang = 'es-ES';
    utterance.rate = 0.85; // despacio: el público objetivo tiene 4 años
    utterance.pitch = 1.1;

    utterance.onstart = () => handlers.onStart?.();
    utterance.onend = () => handlers.onEnd?.();
    utterance.onerror = () => handlers.onEnd?.();

    window.speechSynthesis.speak(utterance);
  } catch {
    handlers.onEnd?.();
  }
}

export function cancelSpeech(): void {
  if (!supported()) return;
  window.speechSynthesis.cancel();
}
