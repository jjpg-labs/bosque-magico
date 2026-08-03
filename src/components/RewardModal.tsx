import { useEffect, useRef } from 'react';
import { GirlAvatar } from './GirlAvatar';
import { playSound } from '../lib/audio';
import type { Sticker } from '../lib/games/catalog';

interface RewardModalProps {
  sticker: Sticker;
  onClose: () => void;
}

export function RewardModal({ sticker, onClose }: RewardModalProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // El foco entra en el diálogo y Escape lo cierra: sin esto el teclado se
  // queda navegando por la página de detrás.
  useEffect(() => {
    buttonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reward-title"
        className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl border-4 border-yellow-300"
      >
        <div className="flex justify-center mb-2">
          <GirlAvatar size="lg" />
        </div>
        <div className="text-5xl mb-2" aria-hidden="true">
          {sticker.icon}
        </div>
        <h3 id="reward-title" className="text-2xl font-bold text-slate-800 mb-1">
          ¡NUEVA PEGATINA!
        </h3>
        <p className="text-emerald-600 font-medium text-lg mb-4">{sticker.name}</p>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => {
            playSound('pop');
            onClose();
          }}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-2xl shadow-lg text-lg active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400"
        >
          ¡Continuar Jugando! 🎉
        </button>
      </div>
    </div>
  );
}
