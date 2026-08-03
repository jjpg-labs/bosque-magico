import { useMemo, useState } from 'react';
import { PromptView } from './PromptView';
import { Shape } from './Shape';
import { playSound } from '../lib/audio';
import { GAMES } from '../lib/games/catalog';
import { generateRounds } from '../lib/games/generators';
import { defaultRng } from '../lib/random';
import type { Option } from '../lib/games/types';

const EXERCISES_PER_SHEET = 6;

/** Solo las pruebas que producen rondas imprimibles (la de memoria no lo es). */
const PRINTABLE_GAMES = GAMES.filter((game) => game.generate !== undefined);

interface PrintableWorksheetsProps {
  onBack: () => void;
}

/**
 * Fichas para imprimir generadas con los mismos generadores que los juegos:
 * cada vez que se pulsa «Otra ficha» salen ejercicios distintos, así que la
 * misma prueba sirve para muchas sesiones en papel.
 */
export function PrintableWorksheets({ onBack }: PrintableWorksheetsProps) {
  const [gameId, setGameId] = useState(PRINTABLE_GAMES[0].id);
  const [seed, setSeed] = useState(0);

  const game = PRINTABLE_GAMES.find((g) => g.id === gameId) ?? PRINTABLE_GAMES[0];

  const rounds = useMemo(
    () => (game.generate ? generateRounds(game.generate, defaultRng, EXERCISES_PER_SHEET) : []),
    // `seed` no se usa dentro: solo fuerza a regenerar los ejercicios.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [game, seed],
  );

  return (
    <section className="bg-white rounded-3xl p-6 shadow-xl border-4 border-sky-200">
      <header className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-200 pb-4 mb-6 no-print">
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

        <h2 className="text-xl md:text-2xl font-extrabold text-slate-800">
          <span aria-hidden="true">🖨️</span> Fichas para Imprimir
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="worksheet-game" className="sr-only">
            Elige la prueba
          </label>
          <select
            id="worksheet-game"
            value={gameId}
            onChange={(event) => setGameId(Number(event.target.value))}
            className="border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-bold bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400"
          >
            {PRINTABLE_GAMES.map((g) => (
              <option key={g.id} value={g.id}>
                {g.id}. {g.title}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setSeed((s) => s + 1)}
            className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold px-4 py-2 rounded-xl text-sm active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400"
          >
            Otra ficha 🎲
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-sm active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400"
          >
            Imprimir 🖨️
          </button>
        </div>
      </header>

      <div id="printable-area" className="border-2 border-dashed border-slate-300 p-6 md:p-8 rounded-2xl">
        <h1 className="text-2xl font-black mb-1">
          {game.id}. {game.title}
        </h1>
        <p className="text-slate-600 mb-1">{game.desc}</p>
        <p className="text-slate-600 mb-6 mt-4">Nombre: ______________________</p>

        <ol className="grid sm:grid-cols-2 gap-6 list-none p-0 m-0">
          {rounds.map((round, i) => (
            <li key={i} className="border-2 border-slate-200 rounded-2xl p-4 break-inside-avoid">
              <p className="font-bold text-slate-700 mb-3">
                {i + 1}. {round.question}
              </p>

              <div className="flex justify-center mb-3">
                <PromptView prompt={round.prompt} />
              </div>

              <p className="text-xs text-slate-500 mb-2">Rodea la respuesta correcta:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {round.options.map((option) => (
                  <WorksheetOption key={option.id} option={option} />
                ))}
              </div>
            </li>
          ))}
        </ol>

        <p className="text-xs text-slate-400 mt-6 text-center">
          El Bosque Mágico de los Bichitos — ficha generada para practicar en papel
        </p>
      </div>
    </section>
  );
}

/** Opción impresa, sin pistas de cuál es la correcta. */
function WorksheetOption({ option }: { option: Option }) {
  return (
    <span className="w-16 h-16 border-2 border-slate-300 rounded-2xl flex items-center justify-center">
      {option.display.kind === 'text' && (
        <span className="text-3xl font-extrabold text-slate-700">{option.display.text}</span>
      )}
      {option.display.kind === 'emoji' && <span className="text-3xl">{option.display.emoji}</span>}
      {option.display.kind === 'shape' && <Shape shape={option.display.shape} className="w-10 h-10" />}
      {option.display.kind === 'group' && (
        <span className="flex flex-wrap justify-center gap-0.5 p-1">
          {option.display.items.map((emoji, i) => (
            <span key={i} className="text-sm leading-none">
              {emoji}
            </span>
          ))}
        </span>
      )}
    </span>
  );
}
