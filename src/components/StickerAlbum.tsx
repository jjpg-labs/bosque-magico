import { playSound } from '../lib/audio';
import { STICKERS } from '../lib/games/catalog';
import { hasSticker } from '../lib/progress';
import type { Progress } from '../lib/progress';

interface StickerAlbumProps {
  progress: Progress;
  onBack: () => void;
}

export function StickerAlbum({ progress, onBack }: StickerAlbumProps) {
  const unlockedCount = STICKERS.filter((s) => hasSticker(progress, s.gameId)).length;

  return (
    <section className="bg-white rounded-3xl p-6 shadow-xl border-4 border-yellow-200">
      <header className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6 gap-2">
        <button
          type="button"
          onClick={() => {
            playSound('pop');
            onBack();
          }}
          className="bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400"
        >
          <span aria-hidden="true">⬅️</span> Volver
        </button>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 flex items-center gap-2">
          <span aria-hidden="true">🌟</span> Álbum
        </h2>
        <p className="text-sm font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full whitespace-nowrap">
          {unlockedCount} / {STICKERS.length}
        </p>
      </header>

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 list-none p-0">
        {STICKERS.map((sticker) => {
          const unlocked = hasSticker(progress, sticker.gameId);

          return (
            <li
              key={sticker.gameId}
              className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center text-center ${
                unlocked ? `${sticker.bg} border-amber-300 shadow-md` : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className={`text-5xl mb-2 ${unlocked ? '' : 'opacity-30 grayscale'}`} aria-hidden="true">
                {unlocked ? sticker.icon : '❓'}
              </span>
              <span className={`font-bold text-sm ${unlocked ? sticker.color : 'text-slate-400'}`}>
                {unlocked ? sticker.name : `Prueba ${sticker.gameId}`}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
