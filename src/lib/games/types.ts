import type { Rng } from '../random';
import type { ShapeColor } from '../shape-colors';

export type ShapeName =
  | 'círculo'
  | 'cuadrado'
  | 'triángulo'
  | 'estrella'
  | 'corazón'
  | 'rombo'
  | 'rectángulo'
  | 'óvalo'
  | 'pentágono'
  | 'hexágono';

/**
 * Los mundos del mapa. Cada prueba pertenece exactamente a uno.
 *
 * El mapa dejó de ser una lista plana en cuanto el catálogo empezó a crecer:
 * con cien pruebas en una sola rejilla no hay forma de encontrar «la de los
 * animales» sin saber leer, y una única cadena de desbloqueo dejaría fuera de
 * alcance todo lo que viniera detrás de una prueba que no apetezca.
 */
export type WorldId =
  | 'letras'
  | 'numeros'
  | 'cuentas'
  | 'formas'
  | 'logica'
  | 'medidas'
  | 'natura'
  | 'cuerpo'
  | 'emociones'
  | 'oficios'
  | 'especial';

/**
 * Condición de apertura de un mundo.
 *
 * - `always`: abierto desde el primer día. Varios mundos lo son a la vez para
 *   que siempre haya de dónde elegir.
 * - `world`: hacen falta `count` pruebas superadas de otro mundo.
 * - `total`: hacen falta `count` pruebas superadas en todo el catálogo
 *   (fuera del propio mundo).
 */
export type WorldUnlock =
  | { kind: 'always' }
  | { kind: 'world'; world: WorldId; count: number }
  | { kind: 'total'; count: number };

export interface World {
  id: WorldId;
  /** Nombre largo, el que se pinta en la tarjeta y se lee en voz alta. */
  name: string;
  icon: string;
  /** Una línea; se lee en voz alta al entrar en el mundo. */
  desc: string;
  /**
   * Colores del mundo (clases de Tailwind). Las pegatinas que no traigan
   * `bg`/`color` propios los heredan de aquí: con cien pegatinas no hay pares
   * de color distinguibles para todas, y escribirlos a mano una a una es
   * trabajo que no aporta nada.
   */
  bg: string;
  color: string;
  border: string;
  unlock: WorldUnlock;
}

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
    /** `color` solo lo usa «Formas de Colores»; sin él, la figura usa el suyo. */
    | { kind: 'shape'; shape: ShapeName; color?: ShapeColor }
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
  /** Etiqueta corta de la tarjeta del mapa: máximo 11 caracteres. */
  cat: string;
  /** Mundo al que pertenece; determina dónde sale en el mapa y su color. */
  world: WorldId;
  kind: GameKind;
  /** Rondas correctas necesarias para superar la prueba. */
  roundsToWin: number;
  /** Solo en juegos de tipo 'choice'. */
  generate?: RoundGenerator;
  /** Solo en juegos de tipo 'memory'. */
  pairCount?: number;
}

export interface Sticker {
  /** Coincide con el id de la prueba que la desbloquea. */
  gameId: number;
  name: string;
  icon: string;
  /**
   * Colores propios. Opcionales a propósito: una pegatina que no los traiga
   * hereda los de su mundo (ver `stickerStyle` en el catálogo). Con cien
   * pegatinas no hay pares `bg-*`/`text-*` distinguibles para todas, y
   * elegirlos a mano una a una es trabajo sin retorno.
   */
  bg?: string;
  color?: string;
}
