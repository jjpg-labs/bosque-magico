import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { playSound } from '../../lib/audio';
import { defaultRng, pick, sample, shuffle } from '../../lib/random';
import type { Rng } from '../../lib/random';
import { CRITTERS } from '../../lib/games/data';
import { PRAISES } from '../../lib/games/data';
import type { MemoryCard } from '../../lib/games/types';

/** Tiempo que quedan visibles dos cartas que no hacen pareja. */
const PEEK_MS = 900;

function buildDeck(rng: Rng, pairCount: number): MemoryCard[] {
  const chosen = sample(rng, CRITTERS, pairCount);
  const cards = chosen.flatMap((critter, pairIndex) =>
    [0, 1].map((copy) => ({
      id: `card-${pairIndex}-${copy}`,
      pairId: `pair-${pairIndex}`,
      emoji: critter.emoji,
      label: critter.name,
    })),
  );
  return shuffle(rng, cards);
}

interface MemoryGameProps {
  pairCount: number;
  onSpeak: (text: string) => void;
  onWin: () => void;
  rng?: Rng;
}

export function MemoryGame({ pairCount, onSpeak, onWin, rng = defaultRng }: MemoryGameProps) {
  const deck = useMemo(() => buildDeck(rng, pairCount), [rng, pairCount]);

  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const allMatched = matched.length === pairCount;

  useEffect(() => {
    if (!allMatched) return;
    const timer = setTimeout(onWin, 600);
    return () => clearTimeout(timer);
  }, [allMatched, onWin]);

  const handleFlip = useCallback(
    (card: MemoryCard) => {
      // Bloqueado mientras se comparan dos cartas, o si esta ya está resuelta.
      if (flipped.length >= 2) return;
      if (flipped.includes(card.id) || matched.includes(card.pairId)) return;

      const next = [...flipped, card.id];
      setFlipped(next);
      playSound('pop');

      if (next.length < 2) return;

      const [firstId, secondId] = next;
      const first = deck.find((c) => c.id === firstId);
      const second = deck.find((c) => c.id === secondId);

      if (first && second && first.pairId === second.pairId) {
        playSound('correct');
        onSpeak(`${pick(rng, PRAISES)} ¡Pareja de ${first.label}!`);
        setMatched((prev) => [...prev, first.pairId]);
        setFlipped([]);
      } else {
        timerRef.current = setTimeout(() => setFlipped([]), PEEK_MS);
      }
    },
    [deck, flipped, matched, onSpeak, rng],
  );

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-4">
      <p className="text-sm font-bold text-emerald-700" role="status">
        Parejas encontradas: {matched.length} de {pairCount}
      </p>

      <div className="grid grid-cols-4 gap-3 w-full">
        {deck.map((card) => {
          const isMatched = matched.includes(card.pairId);
          const isFaceUp = isMatched || flipped.includes(card.id);

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleFlip(card)}
              disabled={isMatched}
              aria-label={isFaceUp ? card.label : 'Carta boca abajo'}
              aria-pressed={isFaceUp}
              className={`
                aspect-square rounded-2xl border-4 flex items-center justify-center
                text-4xl transition-all duration-200
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400
                ${
                  isMatched
                    ? 'bg-emerald-100 border-emerald-400'
                    : isFaceUp
                      ? 'bg-white border-amber-400'
                      : 'bg-emerald-500 border-emerald-600 hover:bg-emerald-400 active:scale-95'
                }
              `}
            >
              <span aria-hidden="true">{isFaceUp ? card.emoji : '🍃'}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
