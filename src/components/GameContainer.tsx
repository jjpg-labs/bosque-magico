import { useCallback, useEffect, useState } from 'react';
import { GirlAvatar } from './GirlAvatar';
import { ChoiceGame } from './games/ChoiceGame';
import { MemoryGame } from './games/MemoryGame';
import { playSound } from '../lib/audio';
import { nextGameId } from '../lib/games/catalog';
import type { GameDefinition } from '../lib/games/types';

interface GameContainerProps {
  game: GameDefinition;
  onBack: () => void;
  onSpeak: (text: string) => void;
  onComplete: (gameId: number) => void;
  onNext: () => void;
  /** Nivel de dificultad numérica (0-2) — ver `progress.ts:tierFor`. */
  tier?: number;
}

export function GameContainer({ game, onBack, onSpeak, onComplete, onNext, tier = 0 }: GameContainerProps) {
  const [passed, setPassed] = useState(false);

  // Reinicia al cambiar de prueba (el componente se reutiliza entre juegos).
  useEffect(() => {
    setPassed(false);
  }, [game.id]);

  const handleWin = useCallback(() => {
    setPassed(true);
    onComplete(game.id);
  }, [game.id, onComplete]);

  const isLastGame = nextGameId(game.id) === undefined;

  return (
    <section className="bg-white rounded-3xl p-4 md:p-6 shadow-xl border-4 border-emerald-200 min-h-[480px] flex flex-col">
      <header className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4 gap-2">
        <button
          type="button"
          onClick={() => {
            playSound('pop');
            onBack();
          }}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl text-sm flex items-center gap-1 active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400"
        >
          <span aria-hidden="true">⬅️</span> Mapa
        </button>

        <h2 className="font-bold text-slate-800 text-lg md:text-xl flex items-center gap-2 min-w-0">
          <span aria-hidden="true">{game.icon}</span>
          <span className="truncate">{game.title}</span>
        </h2>

        <button
          type="button"
          onClick={() => {
            playSound('pop');
            onSpeak(`${game.title}. ${game.desc}`);
          }}
          aria-label="Escuchar la instrucción otra vez"
          className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold px-3 py-2 rounded-2xl shadow-md border-2 border-amber-200 flex items-center gap-1.5 active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400"
        >
          <span className="text-xl" aria-hidden="true">
            🔊
          </span>
          <span className="text-xs hidden sm:inline">Escuchar</span>
        </button>
      </header>

      <p className="bg-emerald-50 text-emerald-900 px-4 py-2.5 rounded-2xl text-center font-medium text-sm md:text-base mb-4">
        <span aria-hidden="true">💡 </span>
        {game.desc}
      </p>

      <div className="flex-1 flex flex-col items-center justify-center py-2">
        {passed ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <GirlAvatar size="xl" />
            </div>
            <h3 className="text-3xl font-extrabold text-emerald-600 mb-2">¡LO HAS HECHO GENIAL!</h3>
            <p className="text-slate-600 font-medium mb-6">¡Has ganado una pegatina!</p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  playSound('pop');
                  onBack();
                }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-6 py-3 rounded-2xl text-lg active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400"
              >
                Mapa
              </button>
              <button
                type="button"
                onClick={() => {
                  playSound('pop');
                  onNext();
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-2xl text-lg shadow-lg active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400"
              >
                {isLastGame ? 'Volver al mapa 🎉' : 'Siguiente ➡️'}
              </button>
            </div>
          </div>
        ) : game.kind === 'memory' ? (
          <MemoryGame pairCount={game.pairCount ?? 4} onSpeak={onSpeak} onWin={handleWin} />
        ) : (
          game.generate && (
            <ChoiceGame
              // Fuerza un remontaje al cambiar de prueba, para regenerar rondas.
              key={game.id}
              generate={game.generate}
              roundsToWin={game.roundsToWin}
              onSpeak={onSpeak}
              onWin={handleWin}
              tier={tier}
            />
          )
        )}
      </div>
    </section>
  );
}
