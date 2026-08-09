import { Shape } from './Shape';
import { unhandled } from '../lib/exhaustive';
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
      <OptionDisplay display={option.display} />
    </button>
  );
}

/**
 * Una letra o un número caben a `text-5xl`, pero una palabra como
 * «Con sueño» se sale del botón. El tamaño baja según la longitud para que
 * las respuestas puedan ser palabras y no solo símbolos.
 */
function textSizeFor(text: string): string {
  if (text.length <= 2) return 'text-4xl md:text-5xl';
  if (text.length <= 6) return 'text-2xl md:text-3xl';
  return 'text-lg md:text-xl';
}

function OptionDisplay({ display }: { display: Option['display'] }) {
  switch (display.kind) {
    case 'text':
      return (
        <span className={`font-extrabold text-emerald-800 text-center ${textSizeFor(display.text)}`}>
          {display.text}
        </span>
      );

    case 'emoji':
      return (
        <span
          className={`leading-none ${
            display.scale === 'lg' ? 'text-7xl' : display.scale === 'sm' ? 'text-2xl' : 'text-5xl'
          }`}
        >
          {display.emoji}
        </span>
      );

    case 'shape':
      return <Shape shape={display.shape} className="w-16 h-16" />;

    case 'group':
      return (
        <span className="flex flex-wrap justify-center gap-1.5 max-w-[10rem]">
          {display.items.map((emoji, i) => (
            <span key={i} className="text-3xl leading-none">
              {emoji}
            </span>
          ))}
        </span>
      );

    default:
      return unhandled(display);
  }
}
