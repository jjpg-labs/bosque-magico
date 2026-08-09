import { Shape } from './Shape';
import { unhandled } from '../lib/exhaustive';
import type { Prompt } from '../lib/games/types';

/**
 * Rejilla de emojis agrupados de cinco en cinco.
 * Contar en filas de cinco es mucho más fácil a los 4 años que contar en una
 * fila larga y continua.
 */
function EmojiGrid({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <div className={`flex flex-wrap justify-center gap-2 max-w-[15rem] ${className}`}>
      {items.map((emoji, i) => (
        <span key={i} className="text-4xl md:text-5xl leading-none">
          {emoji}
        </span>
      ))}
    </div>
  );
}

/** Zona superior de la ronda: lo que hay que mirar antes de responder. */
export function PromptView({ prompt }: { prompt: Prompt }) {
  switch (prompt.kind) {
    case 'none':
      return null;

    case 'emoji-single':
      return (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl px-8 py-6 inline-block">
          <span className="text-7xl leading-none">{prompt.item}</span>
        </div>
      );

    case 'emoji-group':
      return (
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-5 inline-block">
          <EmojiGrid items={prompt.items} />
        </div>
      );

    case 'equation':
      return (
        <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-5 flex flex-wrap items-center justify-center gap-3">
          <EmojiGrid items={prompt.left} className="max-w-[9rem]" />
          <span className="text-4xl font-bold text-red-500">{prompt.op}</span>
          <EmojiGrid items={prompt.right} className="max-w-[9rem]" />
          <span className="text-4xl font-bold text-red-500">=</span>
          <span className="text-4xl font-bold text-slate-400">?</span>
        </div>
      );

    case 'sequence':
      return (
        <div className="bg-purple-50 border-2 border-purple-200 rounded-3xl p-5 flex flex-wrap items-center justify-center gap-2">
          {prompt.items.map((item, i) =>
            item === null ? (
              <span
                key={i}
                className="w-12 h-12 md:w-14 md:h-14 rounded-2xl border-4 border-dashed border-purple-300 flex items-center justify-center text-2xl text-purple-400 font-bold"
              >
                ?
              </span>
            ) : (
              <span key={i} className="text-4xl md:text-5xl leading-none">
                {item}
              </span>
            ),
          )}
        </div>
      );

    case 'number-sequence':
      return (
        <div className="bg-sky-50 border-2 border-sky-200 rounded-3xl p-5 flex flex-wrap items-center justify-center gap-2">
          <span className="text-4xl mr-1">🚂</span>
          {prompt.items.map((item, i) => (
            <span
              key={i}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-extrabold ${
                item === null
                  ? 'border-4 border-dashed border-sky-400 text-sky-400'
                  : 'bg-sky-500 text-white shadow'
              }`}
            >
              {item ?? '?'}
            </span>
          ))}
        </div>
      );

    case 'two-groups':
      return (
        <div className="bg-teal-50 border-2 border-teal-200 rounded-3xl p-5 flex items-center justify-center gap-4">
          <EmojiGrid items={prompt.a} />
          <span className="text-3xl font-bold text-teal-400" aria-hidden="true">
            |
          </span>
          <EmojiGrid items={prompt.b} />
        </div>
      );

    case 'shape':
      return (
        <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-5 inline-block">
          <Shape shape={prompt.shape} className="w-24 h-24" />
        </div>
      );

    case 'listen':
      return (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl px-8 py-6 inline-flex flex-col items-center gap-2">
          <span className="text-7xl leading-none">{prompt.emoji}</span>
          <span className="text-xl font-bold text-amber-800">{prompt.word}</span>
        </div>
      );

    default:
      return unhandled(prompt);
  }
}
