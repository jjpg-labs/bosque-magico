import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { OptionButton } from '../OptionButton';
import type { OptionState } from '../OptionButton';
import { PromptView } from '../PromptView';
import { playSound } from '../../lib/audio';
import { defaultRng, pick } from '../../lib/random';
import type { Rng } from '../../lib/random';
import { generateRounds } from '../../lib/games/generators';
import { ENCOURAGEMENTS, PRAISES } from '../../lib/games/data';
import type { RoundGenerator } from '../../lib/games/types';

/** Pausa tras acertar, para que dé tiempo a ver el acierto antes de avanzar. */
const ADVANCE_DELAY_MS = 1100;

interface ChoiceGameProps {
  generate: RoundGenerator;
  roundsToWin: number;
  onSpeak: (text: string) => void;
  onWin: () => void;
  rng?: Rng;
  /** Nivel de dificultad numérica (0-2) — ver `progress.ts:tierFor`. */
  tier?: number;
}

export function ChoiceGame({
  generate,
  roundsToWin,
  onSpeak,
  onWin,
  rng = defaultRng,
  tier = 0,
}: ChoiceGameProps) {
  // Las rondas se generan una sola vez por montaje: si se regenerasen en cada
  // render, la pregunta cambiaría bajo el dedo de la niña.
  const rounds = useMemo(
    () => generateRounds(generate, rng, roundsToWin, tier),
    [generate, roundsToWin, rng, tier],
  );

  const [index, setIndex] = useState(0);
  const [optionStates, setOptionStates] = useState<Record<string, OptionState>>({});
  const [locked, setLocked] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const round = rounds[index];

  useEffect(() => () => clearTimeout(timerRef.current), []);

  // Lee el enunciado al empezar cada ronda.
  useEffect(() => {
    onSpeak(round.spoken);
    // `onSpeak` cambia de identidad en cada render del padre; incluirlo en las
    // dependencias volvería a leer el enunciado sin parar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const handleSelect = useCallback(
    (optionId: string, correct: boolean) => {
      if (locked) return;

      if (!correct) {
        setOptionStates((prev) => ({ ...prev, [optionId]: 'wrong' }));
        playSound('retry');
        onSpeak(pick(rng, ENCOURAGEMENTS));
        return;
      }

      setOptionStates((prev) => ({ ...prev, [optionId]: 'right' }));
      setLocked(true);
      playSound('correct');
      onSpeak(pick(rng, PRAISES));

      const isLastRound = index + 1 >= rounds.length;
      timerRef.current = setTimeout(() => {
        if (isLastRound) {
          onWin();
        } else {
          setIndex((i) => i + 1);
          setOptionStates({});
          setLocked(false);
        }
      }, ADVANCE_DELAY_MS);
    },
    [index, locked, onSpeak, onWin, rng, rounds.length],
  );

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-5">
      <RoundProgress current={index} total={rounds.length} />

      <PromptView prompt={round.prompt} />

      <p className="text-lg md:text-xl font-bold text-slate-700 text-center" aria-live="polite">
        {round.question}
      </p>

      <div
        className={`grid gap-3 md:gap-4 w-full ${
          round.options.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'
        }`}
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
    </div>
  );
}

function RoundProgress({ current, total }: { current: number; total: number }) {
  return (
    <div
      className="flex items-center gap-2"
      role="status"
      aria-label={`Ronda ${current + 1} de ${total}`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`w-3 h-3 rounded-full transition-colors ${
            i < current ? 'bg-emerald-500' : i === current ? 'bg-amber-400 scale-125' : 'bg-slate-200'
          }`}
        />
      ))}
    </div>
  );
}
