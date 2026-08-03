import { Shape } from './Shape';
import type { Option } from '../lib/games/types';

export type OptionState = 'idle' | 'wrong' | 'right';

interface OptionButtonProps {
  option: Option;
  state: OptionState;
  disabled: boolean;
  onSelect: () => void;
}

const STATE_CLASSES: Record<OptionState, string> = {
  idle: 'bg-white border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 active:scale-95',
  right: 'bg-emerald-100 border-emerald-500 ring-4 ring-emerald-200',
  // Una opción descartada se atenúa en vez de desaparecer: quitarla movería
  // el resto de botones justo cuando la niña está mirando dónde tocar.
  wrong: 'bg-slate-100 border-slate-200 opacity-40',
};

export function OptionButton({ option, state, disabled, onSelect }: OptionButtonProps) {
  const isGroup = option.display.kind === 'group';

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled || state === 'wrong'}
      aria-label={option.label}
      className={`
        flex items-center justify-center rounded-3xl border-4 shadow-sm
        transition-all duration-150 disabled:cursor-not-allowed
        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400
        ${isGroup ? 'p-4 min-h-[7rem]' : 'p-4 min-h-[5.5rem]'}
        ${STATE_CLASSES[state]}
      `}
    >
      {option.display.kind === 'text' && (
        <span className="text-4xl md:text-5xl font-extrabold text-emerald-800">
          {option.display.text}
        </span>
      )}

      {option.display.kind === 'emoji' && (
        <span className="text-5xl leading-none">{option.display.emoji}</span>
      )}

      {option.display.kind === 'shape' && <Shape shape={option.display.shape} className="w-16 h-16" />}

      {option.display.kind === 'group' && (
        <span className="flex flex-wrap justify-center gap-1.5 max-w-[10rem]">
          {option.display.items.map((emoji, i) => (
            <span key={i} className="text-3xl leading-none">
              {emoji}
            </span>
          ))}
        </span>
      )}
    </button>
  );
}
