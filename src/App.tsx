import { useCallback, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { GameContainer } from './components/GameContainer';
import { GameMap } from './components/GameMap';
import { GirlAvatar } from './components/GirlAvatar';
import { PrintableWorksheets } from './components/PrintableWorksheets';
import { RewardModal } from './components/RewardModal';
import { SpeechBubble } from './components/SpeechBubble';
import { StickerAlbum } from './components/StickerAlbum';
import { useSpeech } from './hooks/useSpeech';
import { playSound, unlockAudio } from './lib/audio';
import { findGame, stickerFor, STICKERS, TOTAL_GAMES } from './lib/games/catalog';
import type { Sticker } from './lib/games/catalog';
import {
  emptyProgress,
  hasSticker,
  incrementPlayCount,
  loadProgress,
  markCompleted,
  resetProgress,
  saveProgress,
  tierFor,
} from './lib/progress';
import type { Progress } from './lib/progress';

type View = 'map' | 'game' | 'album' | 'printables';

function celebrate() {
  // Nada de confeti si el sistema pide movimiento reducido.
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  void confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
}

export default function App() {
  const [view, setView] = useState<View>('map');
  const [currentGameId, setCurrentGameId] = useState(1);
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [reward, setReward] = useState<Sticker | null>(null);
  const { speak, stop, spokenText } = useSpeech();

  // localStorage se lee tras montar, no durante el render.
  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const handleComplete = useCallback(
    (gameId: number) => {
      // Rejugar una prueba ya superada no vuelve a dar pegatina ni confeti.
      if (hasSticker(progress, gameId)) return;

      const next = markCompleted(progress, gameId);
      setProgress(next);
      saveProgress(next);

      playSound('win');
      celebrate();
      setReward(stickerFor(gameId) ?? null);
    },
    [progress],
  );

  const handleReset = useCallback(() => {
    if (!window.confirm('¿Seguro que quieres borrar todas las pegatinas y empezar de nuevo?')) {
      return;
    }
    setProgress(resetProgress());
    setView('map');
  }, []);

  const goToMap = useCallback(() => setView('map'), []);

  const handleSelectGame = useCallback(
    (gameId: number) => {
      const next = incrementPlayCount(progress, gameId);
      setProgress(next);
      saveProgress(next);
      setCurrentGameId(gameId);
      setView('game');
    },
    [progress],
  );

  const unlockedCount = STICKERS.filter((s) => hasSticker(progress, s.gameId)).length;
  const currentGame = findGame(currentGameId);

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col" onPointerDown={unlockAudio}>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:font-bold"
      >
        Saltar al contenido
      </a>

      <header className="bg-emerald-600 text-white p-3 md:p-4 shadow-md rounded-b-3xl sticky top-0 z-30 no-print">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              playSound('pop');
              goToMap();
            }}
            aria-label="Ir al mapa del bosque"
            className="flex items-center gap-3 rounded-2xl p-1 hover:bg-emerald-500 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
          >
            <GirlAvatar size="md" className="ring-2 ring-white rounded-full bg-yellow-300" />
            <span className="text-left">
              <span className="block text-lg md:text-2xl font-bold tracking-wide leading-tight">
                El Bosque Mágico
              </span>
              <span className="hidden sm:block text-xs text-emerald-100">
                ¡Aprende letras, números y formas!
              </span>
            </span>
          </button>

          <nav className="flex items-center gap-2" aria-label="Secciones">
            <button
              type="button"
              onClick={() => {
                playSound('pop');
                setView('album');
              }}
              className="bg-yellow-400 hover:bg-yellow-300 text-yellow-950 font-bold px-3 py-2 rounded-2xl flex items-center gap-2 shadow-sm border-2 border-yellow-200 text-sm md:text-base active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
            >
              <span className="text-xl" aria-hidden="true">
                🌟
              </span>
              <span>
                Álbum ({unlockedCount}/{TOTAL_GAMES})
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                playSound('pop');
                setView('printables');
              }}
              aria-label="Fichas para imprimir"
              className="bg-sky-400 hover:bg-sky-300 text-sky-950 font-bold px-3 py-2 rounded-2xl flex items-center gap-1.5 shadow-sm border-2 border-sky-200 text-sm md:text-base active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
            >
              <span className="text-xl" aria-hidden="true">
                🖨️
              </span>
              <span className="hidden md:inline">Fichas</span>
            </button>
          </nav>
        </div>
      </header>

      {spokenText && <SpeechBubble text={spokenText} onDismiss={stop} />}

      <main id="contenido" className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6">
        {view === 'map' && (
          <GameMap progress={progress} onSpeak={speak} onSelectGame={handleSelectGame} />
        )}

        {view === 'game' && currentGame && (
          <GameContainer
            key={currentGame.id}
            game={currentGame}
            onBack={goToMap}
            onSpeak={speak}
            onComplete={handleComplete}
            tier={tierFor(progress, currentGame.id)}
            onNext={() => {
              if (currentGame.id < TOTAL_GAMES) handleSelectGame(currentGame.id + 1);
              else goToMap();
            }}
          />
        )}

        {view === 'album' && <StickerAlbum progress={progress} onBack={goToMap} />}

        {view === 'printables' && <PrintableWorksheets onBack={goToMap} />}
      </main>

      {reward && <RewardModal sticker={reward} onClose={() => setReward(null)} />}

      <footer className="text-center py-4 px-4 text-xs text-slate-500 no-print">
        <p>Aventura educativa para peques • Aprende jugando</p>
        <p className="mt-1">
          Sin anuncios, sin cuentas y sin recogida de datos. El progreso se guarda solo en este
          dispositivo.{' '}
          <button
            type="button"
            onClick={handleReset}
            className="underline hover:text-slate-700 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            Borrar progreso
          </button>
        </p>
      </footer>
    </div>
  );
}
