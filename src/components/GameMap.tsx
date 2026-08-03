import { useEffect } from 'react';
import { GirlAvatar } from './GirlAvatar';
import { playSound } from '../lib/audio';
import { GAMES } from '../lib/games/catalog';
import { isUnlocked } from '../lib/progress';
import type { Progress } from '../lib/progress';

interface GameMapProps {
  progress: Progress;
  onSpeak: (text: string) => void;
  onSelectGame: (id: number) => void;
}

export function GameMap({ progress, onSpeak, onSelectGame }: GameMapProps) {
  useEffect(() => {
    onSpeak('¡Hola! Toca una prueba para jugar y conseguir pegatinas de bichitos.');
    // Solo al entrar en el mapa.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white p-5 rounded-3xl shadow-lg w-full mb-8 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-1">¡El Mapa del Bosque! 🌳</h2>
          <p className="text-emerald-50 text-sm md:text-base">
            Completa las {GAMES.length} pruebas para conseguir todos los bichitos
          </p>
        </div>
        <GirlAvatar size="lg" className="hidden sm:block shrink-0" />
      </div>

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 w-full list-none p-0">
        {GAMES.map((game) => {
          const completed = progress.completed.includes(game.id);
          const unlocked = isUnlocked(progress, game.id);

          return (
            <li key={game.id} className="relative">
              <button
                type="button"
                disabled={!unlocked}
                onClick={() => {
                  playSound('pop');
                  onSelectGame(game.id);
                }}
                aria-label={`Prueba ${game.id}: ${game.title}. ${
                  completed ? 'Completada' : unlocked ? 'Disponible' : 'Bloqueada'
                }`}
                className={`
                  w-full h-full flex flex-col items-center justify-between gap-2 p-4
                  rounded-3xl border-4 text-center transition-all
                  focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400
                  ${
                    completed
                      ? 'bg-yellow-50 border-yellow-400 shadow-md'
                      : unlocked
                        ? 'bg-white border-emerald-300 hover:border-emerald-500 shadow-md hover:shadow-lg active:scale-95'
                        : 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                  }
                `}
              >
                <span
                  aria-hidden="true"
                  className={`absolute -top-3 -left-3 w-8 h-8 rounded-full font-bold flex items-center justify-center text-sm shadow ${
                    completed ? 'bg-yellow-400 text-yellow-950' : 'bg-emerald-500 text-white'
                  }`}
                >
                  {game.id}
                </span>

                {completed && (
                  <span
                    aria-hidden="true"
                    className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm shadow"
                  >
                    ✓
                  </span>
                )}

                <span className="text-4xl md:text-5xl my-1" aria-hidden="true">
                  {unlocked ? game.icon : '🔒'}
                </span>

                <span>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider bg-emerald-100 px-2 py-0.5 rounded-full">
                    {game.cat}
                  </span>
                  <span className="block font-bold text-slate-800 text-sm md:text-base mt-1 leading-tight">
                    {game.title}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
