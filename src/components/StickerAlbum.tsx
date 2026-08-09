import { playSound } from '../lib/audio';
import { STICKERS, populatedWorlds, stickerStyle, worldOfGame } from '../lib/games/catalog';
import { hasSticker, worldProgress } from '../lib/progress';
import type { Progress } from '../lib/progress';
import type { Sticker, World } from '../lib/games/types';

interface StickerAlbumProps {
  progress: Progress;
  onBack: () => void;
}

/**
 * El álbum se agrupa por mundo: cien pegatinas en una rejilla plana no son una
 * colección, son una lista. Por mundo hay además un objetivo intermedio real —
 * la medalla se gana al completar el mundo entero.
 */
export function StickerAlbum({ progress, onBack }: StickerAlbumProps) {
  const unlockedCount = STICKERS.filter((s) => hasSticker(progress, s.gameId)).length;
  const worlds = populatedWorlds().filter((world) => stickersOfWorld(world).length > 0);

  return (
    <section className="bg-white rounded-3xl p-4 md:p-6 shadow-xl border-4 border-yellow-200">
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

      {worlds.map((world) => {
        const entry = worldProgress(progress, world.id);
        const stickers = stickersOfWorld(world);
        const done = entry?.done ?? false;

        return (
          <section key={world.id} className="mb-8 last:mb-0">
            <h3 className="flex items-center gap-2 mb-3">
              <span
                aria-hidden="true"
                className={`text-2xl ${done ? 'drop-shadow' : 'opacity-60 grayscale'}`}
              >
                {done ? '🏅' : world.icon}
              </span>
              <span className={`font-extrabold ${world.color}`}>{world.name}</span>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full ml-auto whitespace-nowrap">
                {entry?.completed ?? 0} / {entry?.total ?? 0}
              </span>
            </h3>

            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 list-none p-0">
              {stickers.map((sticker) => {
                const unlocked = hasSticker(progress, sticker.gameId);
                const style = stickerStyle(sticker);

                return (
                  <li
                    key={sticker.gameId}
                    className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center text-center ${
                      unlocked ? `${style.bg} border-amber-300 shadow-md` : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span
                      className={`text-5xl mb-2 ${unlocked ? '' : 'opacity-30 grayscale'}`}
                      aria-hidden="true"
                    >
                      {unlocked ? sticker.icon : '❓'}
                    </span>
                    <span className={`font-bold text-sm ${unlocked ? style.color : 'text-slate-400'}`}>
                      {unlocked ? sticker.name : `Prueba ${sticker.gameId}`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </section>
  );
}

function stickersOfWorld(world: World): Sticker[] {
  return STICKERS.filter((sticker) => worldOfGame(sticker.gameId)?.id === world.id);
}
