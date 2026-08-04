import type { Rng } from '../random';

export type ShapeName = 'círculo' | 'cuadrado' | 'triángulo' | 'estrella' | 'corazón' | 'rombo';

/** Lo que se muestra encima de las opciones. */
export type Prompt =
  /** Las opciones ya contienen toda la información; no hay enunciado visual. */
  | { kind: 'none' }
  | { kind: 'emoji-single'; item: string }
  | { kind: 'emoji-group'; items: string[] }
  | { kind: 'equation'; left: string[]; op: '+' | '−'; right: string[] }
  | { kind: 'sequence'; items: Array<string | null> }
  | { kind: 'number-sequence'; items: Array<number | null> }
  | { kind: 'two-groups'; a: string[]; b: string[] }
  | { kind: 'shape'; shape: ShapeName }
  | { kind: 'listen'; word: string; emoji: string };

export interface Option {
  /** Estable dentro de una ronda; sirve de key de React. */
  id: string;
  /** Texto leído por lectores de pantalla y por la voz. */
  label: string;
  /** Qué se pinta: una letra o número, un emoji, una figura o un grupo de emojis. */
  display:
    | { kind: 'text'; text: string }
    /** `scale` es opcional: solo lo usa "Grande y Pequeño" para variar el tamaño visual. */
    | { kind: 'emoji'; emoji: string; scale?: 'sm' | 'lg' }
    | { kind: 'shape'; shape: ShapeName }
    | { kind: 'group'; items: string[] };
  correct: boolean;
}

export interface Round {
  /** Enunciado mostrado en pantalla. */
  question: string;
  /** Enunciado leído en voz alta (puede ser más largo y explicativo). */
  spoken: string;
  prompt: Prompt;
  options: Option[];
}

/**
 * `tier` sube la dificultad numérica (0, 1 o 2) según cuántas veces se ha
 * jugado la prueba — ver `progress.ts:tierFor`. Es opcional: los generadores
 * sin rango numérico natural (letras, formas, patrones...) lo ignoran.
 */
export type RoundGenerator = (rng: Rng, tier?: number) => Round;

export interface MemoryCard {
  id: string;
  pairId: string;
  emoji: string;
  label: string;
}

export type GameKind = 'choice' | 'memory';

export interface GameDefinition {
  id: number;
  title: string;
  desc: string;
  icon: string;
  cat: string;
  kind: GameKind;
  /** Rondas correctas necesarias para superar la prueba. */
  roundsToWin: number;
  /** Solo en juegos de tipo 'choice'. */
  generate?: RoundGenerator;
  /** Solo en juegos de tipo 'memory'. */
  pairCount?: number;
}
