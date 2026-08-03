import { GirlAvatar } from './GirlAvatar';

interface SpeechBubbleProps {
  text: string;
  onDismiss: () => void;
}

/** Bocadillo flotante con la instrucción que se está leyendo en voz alta. */
export function SpeechBubble({ text, onDismiss }: SpeechBubbleProps) {
  return (
    // Anclado abajo a propósito: arriba tapaba los botones «Mapa» y «Escuchar»
    // de la cabecera del juego justo mientras se leía la instrucción.
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-md bg-white rounded-3xl p-4 shadow-2xl border-4 border-amber-300 flex items-center gap-3 no-print"
      role="status"
      aria-live="polite"
    >
      <GirlAvatar size="sm" />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-bold uppercase text-amber-600 tracking-wider">
          Leyendo instrucción
        </div>
        <p className="text-slate-800 font-bold text-sm md:text-base leading-snug">{text}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Callar la voz"
        className="text-slate-400 hover:text-slate-600 font-bold p-2 text-lg rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400"
      >
        ✕
      </button>
    </div>
  );
}
