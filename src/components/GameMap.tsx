import { useEffect, useMemo, useState } from 'react';
import { GirlAvatar } from './GirlAvatar';
import { playSound } from '../lib/audio';
import { gamesOfWorld } from '../lib/games/catalog';
import { allWorldProgress, currentWorldId, isUnlocked } from '../lib/progress';
import type { Progress, WorldProgress } from '../lib/progress';
import type { WorldId } from '../lib/games/types';

interface GameMapProps {
  progress: Progress;
  onSpeak: (text: string) => void;
  onSelectGame: (id: number) => void;
}

/**
 * El mapa tiene dos niveles: primero los mundos, luego las pruebas del mundo
 * elegido.
 *
 * Una rejilla plana con cien pruebas son cincuenta filas de scroll en móvil, y
 * encontrar «la de los animales» sin saber leer es imposible. Con mundos, cada
 * pantalla cabe de una vez y el mundo en curso sale el primero para poder
 * seguir por donde iba.
 */
export function GameMap({ progress, onSpeak, onSelectGame }: GameMapProps) {
  const [openWorld, setOpenWorld] = useState<WorldId | null>(null);

  const worlds = useMemo(() => {
    const all = allWorldProgress(progress);
    const currentId = currentWorldId(progress);
    // El mundo en curso el primero; los demás en el orden del mapa.
    return [...all].sort((a, b) => {
      const aIsCurrent = a.world.id === currentId ? 0 : 1;
      const bIsCurrent = b.world.id === currentId ? 0 : 1;
      return aIsCurrent - bIsCurrent;
    });
  }, [progress]);

  const current = useMemo(
    () => worlds.find((entry) => entry.world.id === openWorld),
    [worlds, openWorld],
  );

  useEffect(() => {
    if (current) onSpeak(`${current.world.name}. ${current.world.desc}`);
    else onSpeak('¡Hola! Elige un mundo del bosque para jugar y conseguir pegatinas.');
    // Solo al cambiar de nivel del mapa.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openWorld]);

  if (current) {
    return (
      <WorldView
        entry={current}
        progress={progress}
        onSelectGame={onSelectGame}
        onBack={() => {
          playSound('pop');
          setOpenWorld(null);
        }}
      />
    );
  }

  const totalDone = worlds.reduce((sum, entry) => sum + entry.completed, 0);
  const total = worlds.reduce((sum, entry) => sum + entry.total, 0);

  return (
    <div className="flex flex-col items-center">
      <div className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white p-5 rounded-3xl shadow-lg w-full mb-6 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-1">¡El Mapa del Bosque! 🌳</h2>
          <p className="text-emerald-50 text-sm md:text-base">
            Elige un mundo y sigue la aventura ({totalDone} de {total} pruebas)
          </p>
        </div>
        <GirlAvatar size="lg" className="hidden sm:block shrink-0" />
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full list-none p-0">
        {worlds.map((entry, index) => (
          <li key={entry.world.id}>
            <WorldCard
              entry={entry}
              highlighted={index === 0 && entry.unlocked && !entry.done}
              onOpen={() => {
                playSound('pop');
                setOpenWorld(entry.world.id);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function WorldCard({
  entry,
  highlighted,
  onOpen,
}: {
  entry: WorldProgress;
  highlighted: boolean;
  onOpen: () => void;
}) {
  const { world, completed, total, unlocked, done } = entry;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <button
      type="button"
      disabled={!unlocked}
      onClick={onOpen}
      aria-label={`Mundo ${world.name}. ${
        unlocked ? `${completed} de ${total} pruebas superadas` : 'Todavía cerrado'
      }`}
      className={`
        w-full flex items-center gap-3 p-3 md:p-4 rounded-3xl border-4 text-left transition-all
        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400
        ${
          !unlocked
            ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
            : done
              ? `${world.bg} ${world.border} shadow-md`
              : `bg-white ${world.border} shadow-md hover:shadow-lg active:scale-95`
        }
        ${highlighted ? 'ring-4 ring-emerald-300' : ''}
      `}
    >
      <span className="text-4xl md:text-5xl shrink-0 leading-none" aria-hidden="true">
        {unlocked ? world.icon : '🔒'}
      </span>

      <span className="min-w-0 flex-1">
        <span className={`block font-extrabold leading-tight ${unlocked ? world.color : 'text-slate-500'}`}>
          {world.name}
        </span>
        <span className="block text-xs text-slate-500 leading-tight mt-0.5">
          {unlocked ? world.desc : 'Se abre jugando otros mundos'}
        </span>

        {unlocked && (
          <span className="flex items-center gap-2 mt-2">
            <span className="h-2 flex-1 rounded-full bg-slate-200 overflow-hidden" aria-hidden="true">
              <span
                className={`block h-full rounded-full ${done ? 'bg-yellow-400' : 'bg-emerald-400'}`}
                style={{ width: `${percent}%` }}
              />
            </span>
            <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
              {completed}/{total}
            </span>
          </span>
        )}
      </span>

      {done && (
        <span className="text-2xl shrink-0" aria-hidden="true">
          🏅
        </span>
      )}
      {highlighted && !done && (
        <span className="text-xl shrink-0" aria-hidden="true">
          ▶️
        </span>
      )}
    </button>
  );
}

function WorldView({
  entry,
  progress,
  onSelectGame,
  onBack,
}: {
  entry: WorldProgress;
  progress: Progress;
  onSelectGame: (id: number) => void;
  onBack: () => void;
}) {
  const { world, completed, total } = entry;
  const games = gamesOfWorld(world.id);

  return (
    <div className="flex flex-col items-center">
      {/* Dos filas y no una: a 360 px, botón + título + contador en la misma
          línea aplasta el nombre del mundo hasta hacerlo ilegible. */}
      <div className={`${world.bg} border-4 ${world.border} p-4 rounded-3xl shadow-md w-full mb-6`}>
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBack}
            className="bg-white/80 hover:bg-white px-3 py-2 rounded-xl text-sm font-bold shrink-0 active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400"
          >
            <span aria-hidden="true">⬅️</span> Mundos
          </button>

          <p className="text-sm font-bold text-slate-600 bg-white/80 px-3 py-1 rounded-full whitespace-nowrap">
            {completed} / {total}
          </p>
        </div>

        <h2 className={`text-xl md:text-2xl font-extrabold flex items-center gap-2 mt-3 ${world.color}`}>
          <span aria-hidden="true">{world.icon}</span>
          <span className="min-w-0">{world.name}</span>
        </h2>
        <p className="text-sm text-slate-600 mt-1">{world.desc}</p>
      </div>

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 w-full list-none p-0">
        {games.map((game) => {
          const done = progress.completed.includes(game.id);
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
                  done ? 'Completada' : unlocked ? 'Disponible' : 'Bloqueada'
                }`}
                className={`
                  w-full h-full flex flex-col items-center justify-between gap-2 p-4
                  rounded-3xl border-4 text-center transition-all
                  focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400
                  ${
                    done
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
                    done ? 'bg-yellow-400 text-yellow-950' : 'bg-emerald-500 text-white'
                  }`}
                >
                  {game.id}
                </span>

                {done && (
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
