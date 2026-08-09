import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { OptionButton } from '../OptionButton';
import type { OptionState } from '../OptionButton';
import { PromptView } from '../PromptView';
import { optionGridClass } from './optionGrid';
import { playSound } from '../../lib/audio';
import { defaultRng, pick } from '../../lib/random';
import type { Rng } from '../../lib/random';
import { generateRounds } from '../../lib/games/generators';
import { ENCOURAGEMENTS, PRAISES } from '../../lib/games/data';
import type { Round, RoundGenerator } from '../../lib/games/types';

const ADVANCE_DELAY_MS = 1100;

/** Rondas que se preparan de golpe. Se pide otra tanda cuando se acaban. */
const BATCH = 12;

interface MarathonGameProps {
  generate: RoundGenerator;
  /** Aciertos necesarios para ganar la pegatina. A partir de ahí, se sigue por gusto. */
  roundsToWin: number;
  onSpeak: (text: string) => void;
  onWin: () => void;
  onExit: () => void;
  /** Mejor marca guardada, para poder superarla. */
  best?: number;
  onRecord: (hits: number) => void;
  rng?: Rng;
}

/**
 * Rondas sin fin: se sale cuando se quiere y **no se pierde nunca**.
 *
 * Cuenta aciertos totales, no aciertos seguidos. Un contador de racha que se
 * pone a cero al fallar castiga el error, y en este juego un fallo no se
 * penaliza jamás: solo anima a probar otra vez.
 */
export function MarathonGame({
  generate,
  roundsToWin,
  onSpeak,
  onWin,
  onExit,
  best = 0,
  onRecord,
  rng = defaultRng,
}: MarathonGameProps) {
  const firstBatch = useMemo(() => generateRounds(generate, rng, BATCH), [generate, rng]);
  const [rounds, setRounds] = useState<Round[]>(firstBatch);
  const [index, setIndex] = useState(0);
  const [hits, setHits] = useState(0);
  const [optionStates, setOptionStates] = useState<Record<string, OptionState>>({});
  const [locked, setLocked] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const wonRef = useRef(false);

  const round = rounds[index];

  useEffect(() => () => clearTimeout(timerRef.current), []);

  useEffect(() => {
    onSpeak(round.spoken);
    // `onSpeak` cambia de identidad en cada render del padre; incluirlo aquí
    // volvería a leer el enunciado sin parar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const finish = useCallback(() => {
    clearTimeout(timerRef.current);
    onRecord(hits);
    onExit();
  }, [hits, onExit, onRecord]);

  const handleSelect = useCallback(
    (optionId: string, correct: boolean) => {
      if (locked) return;

      if (!correct) {
        setOptionStates((prev) => ({ ...prev, [optionId]: 'wrong' }));
        playSound('retry');
        onSpeak(pick(rng, ENCOURAGEMENTS));
        return;
      }

      const total = hits + 1;
      setHits(total);
      setOptionStates((prev) => ({ ...prev, [optionId]: 'right' }));
      setLocked(true);
      playSound('correct');
      onSpeak(pick(rng, PRAISES));

      // La pegatina se gana una sola vez, al llegar al objetivo, y la maratón
      // sigue: el premio no puede ser el motivo para dejar de jugar.
      if (total >= roundsToWin && !wonRef.current) {
        wonRef.current = true;
        onWin();
      }

      timerRef.current = setTimeout(() => {
        setIndex((i) => {
          const next = i + 1;
          if (next >= rounds.length - 1) {
            setRounds((prev) => [...prev, ...generateRounds(generate, rng, BATCH)]);
          }
          return next;
        });
        setOptionStates({});
        setLocked(false);
      }, ADVANCE_DELAY_MS);
    },
    [generate, hits, locked, onSpeak, onWin, rng, rounds.length, roundsToWin],
  );

  const record = Math.max(best, hits);

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-5">
      <div className="flex items-center gap-4 text-sm font-bold" role="status">
        <span className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-2xl">
          Aciertos: {hits}
        </span>
        {record > 0 && (
          <span className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-2xl">
            Tu récord: {record}
          </span>
        )}
      </div>

      <PromptView prompt={round.prompt} />

      <p className="text-lg md:text-xl font-bold text-slate-700 text-center" aria-live="polite">
        {round.question}
      </p>

      <div
        className={`grid gap-3 md:gap-4 w-full ${optionGridClass(round.options.length)}`}
      >
        {round.options.map((option) => (
          <OptionButton
            key={option.id}
            option={option}
            state={optionStates[option.id] ?? 'idle'}
            disabled={locked}
            onSelect={() => handleSelect(option.id, option.correct)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          playSound('pop');
          finish();
        }}
        className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-6 py-2.5 rounded-2xl active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400"
      >
        Ya está 👋
      </button>
    </div>
  );
}
