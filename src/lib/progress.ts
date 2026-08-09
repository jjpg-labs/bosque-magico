/**
 * Progreso de la niña, persistido en localStorage.
 *
 * Solo se guarda qué pruebas se han superado. No hay cuentas, ni servidor, ni
 * ningún dato personal: ver la sección de privacidad del README.
 *
 * El estado real es una única lista, `completed`. Todo lo demás (qué pegatinas
 * se tienen, qué pruebas están desbloqueadas) se deriva de ella. La versión
 * original guardaba `stickers` por separado y las dos listas se desincronizaban,
 * regalando pegatinas no ganadas.
 */

import { unhandled } from './exhaustive';
import {
  GAMES,
  GAME_IDS,
  findGame,
  findWorld,
  gamesOfWorld,
  populatedWorlds,
} from './games/catalog';
import type { World, WorldId } from './games/types';

const STORAGE_KEY = 'bosque_magico_progress_v2';
const LEGACY_KEY = 'bosque_bichitos_progress';

export interface Progress {
  completed: number[];
  /** Veces que se ha empezado cada prueba. Ausente/vacío en progreso migrado de v2. */
  playCounts: Record<number, number>;
  /** Aciertos de la mejor maratón. Ausente en progreso guardado antes de que existiera. */
  bestMarathon: number;
}

export const emptyProgress: Progress = { completed: [], playCounts: {}, bestMarathon: 0 };

function sanitize(ids: unknown): number[] {
  if (!Array.isArray(ids)) return [];
  const valid = ids.filter((id): id is number => typeof id === 'number' && GAME_IDS.has(id));
  return [...new Set(valid)].sort((a, b) => a - b);
}

function sanitizePlayCounts(raw: unknown): Record<number, number> {
  if (!raw || typeof raw !== 'object') return {};
  const out: Record<number, number> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    const id = Number(key);
    if (GAME_IDS.has(id) && typeof value === 'number' && value >= 0) {
      out[id] = value;
    }
  }
  return out;
}

export function loadProgress(storage: Storage | undefined = safeStorage()): Progress {
  if (!storage) return emptyProgress;

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      const completed = sanitize((parsed as { completed?: unknown } | null)?.completed);
      // Esquema v2 no tenía playCounts: se migra a {} de forma aditiva, igual
      // que en su día se migró el formato de un solo fichero HTML.
      const playCounts = sanitizePlayCounts((parsed as { playCounts?: unknown } | null)?.playCounts);
      const raw2 = (parsed as { bestMarathon?: unknown } | null)?.bestMarathon;
      const bestMarathon = typeof raw2 === 'number' && raw2 >= 0 ? Math.floor(raw2) : 0;
      return { completed, playCounts, bestMarathon };
    }

    // Migración desde el formato de la versión de un solo fichero HTML.
    const legacy = storage.getItem(LEGACY_KEY);
    if (legacy) {
      const parsed: unknown = JSON.parse(legacy);
      const completed = sanitize((parsed as { completed?: unknown } | null)?.completed);
      const migrated = { completed, playCounts: {}, bestMarathon: 0 };
      saveProgress(migrated, storage);
      return migrated;
    }
  } catch {
    // JSON corrupto o localStorage bloqueado: se empieza de cero en vez de romper.
  }

  return emptyProgress;
}

export function saveProgress(progress: Progress, storage: Storage | undefined = safeStorage()): void {
  if (!storage) return;
  try {
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 2,
        completed: progress.completed,
        playCounts: progress.playCounts,
        bestMarathon: progress.bestMarathon,
      }),
    );
  } catch {
    // Cuota llena o modo privado: el progreso se pierde al recargar, pero la
    // partida en curso sigue funcionando.
  }
}

/** Se llama cada vez que se entra a jugar una prueba (se supere o no). */
export function incrementPlayCount(progress: Progress, gameId: number): Progress {
  const current = progress.playCounts[gameId] ?? 0;
  return { ...progress, playCounts: { ...progress.playCounts, [gameId]: current + 1 } };
}

/**
 * Nivel de dificultad numérica (0, 1 o 2): sube cada 3 partidas jugadas de
 * esa prueba, con tope en 2 para no disparar la dificultad sin límite.
 */
export function tierFor(progress: Progress, gameId: number): number {
  const plays = progress.playCounts[gameId] ?? 0;
  return Math.min(Math.floor(plays / 3), 2);
}

/** Guarda la marca solo si mejora la anterior. */
export function recordMarathon(progress: Progress, hits: number): Progress {
  if (hits <= progress.bestMarathon) return progress;
  return { ...progress, bestMarathon: hits };
}

export function markCompleted(progress: Progress, gameId: number): Progress {
  if (progress.completed.includes(gameId)) return progress;
  return { ...progress, completed: [...progress.completed, gameId].sort((a, b) => a - b) };
}

export function resetProgress(storage: Storage | undefined = safeStorage()): Progress {
  try {
    storage?.removeItem(STORAGE_KEY);
    storage?.removeItem(LEGACY_KEY);
  } catch {
    // Ignorado a propósito.
  }
  return emptyProgress;
}

/**
 * ¿Está abierto el mundo?
 *
 * El requisito se recorta a las pruebas que existen de verdad
 * (`Math.min(...)`): los mundos se dimensionaron para un catálogo de cien
 * pruebas, así que mientras se va llenando por fases hay mundos con menos
 * pruebas de las que pide la condición y, sin el recorte, quedarían cerrados
 * para siempre.
 */
export function isWorldUnlocked(progress: Progress, worldId: WorldId): boolean {
  const world = findWorld(worldId);
  if (!world) return false;

  const { unlock } = world;
  switch (unlock.kind) {
    case 'always':
      return true;

    case 'world': {
      const source = gamesOfWorld(unlock.world);
      const done = source.filter((game) => progress.completed.includes(game.id)).length;
      return done >= Math.min(unlock.count, source.length);
    }

    case 'total': {
      const outside = GAMES.filter((game) => game.world !== worldId);
      const done = outside.filter((game) => progress.completed.includes(game.id)).length;
      return done >= Math.min(unlock.count, outside.length);
    }

    default:
      return unhandled(unlock) ?? false;
  }
}

/**
 * Cuántas pruebas de un mundo están abiertas a la vez por delante de lo
 * superado. Tres deja margen para saltarse una que no apetece hoy sin perder
 * la sensación de ir avanzando en orden.
 */
const OPEN_AHEAD = 3;

/**
 * Una prueba está abierta si su mundo lo está y entra en la ventana de las
 * tres siguientes a lo que se lleva superado **de ese mismo mundo**.
 *
 * Al principio era una única cadena para el catálogo entero: la prueba N
 * exigía la N-1. Con cien pruebas, una que no apetezca deja fuera de alcance
 * todas las siguientes.
 */
export function isUnlocked(progress: Progress, gameId: number): boolean {
  // Lo ya superado no se vuelve a cerrar nunca, pase lo que pase con las
  // condiciones de los mundos: quitarle acceso a algo que ya se ganó sería
  // incomprensible desde el otro lado de la pantalla.
  if (progress.completed.includes(gameId)) return true;

  const game = findGame(gameId);
  if (!game) return false;
  if (!isWorldUnlocked(progress, game.world)) return false;

  const siblings = gamesOfWorld(game.world);
  const index = siblings.findIndex((sibling) => sibling.id === gameId);
  if (index <= 0) return true;

  // Dentro de un mundo no hay una cadena de un solo eslabón, sino una ventana
  // de `OPEN_AHEAD` pruebas abiertas por delante de lo que se lleva superado.
  //
  // Con mundos de hasta catorce pruebas, la cadena estricta reproducía a
  // pequeña escala justo el problema que los mundos venían a resolver: una
  // prueba que no le gusta —o que ese día no le sale— dejaba las trece
  // siguientes fuera de alcance. Con la ventana siempre puede saltarse un par
  // y volver luego, y el orden se sigue notando porque la ventana avanza a
  // medida que supera pruebas.
  const done = siblings.filter((sibling) => progress.completed.includes(sibling.id)).length;
  return index <= done + OPEN_AHEAD - 1;
}

export interface WorldProgress {
  world: World;
  /** Pruebas que tiene el mundo hoy. */
  total: number;
  /** Cuántas de ellas están superadas. */
  completed: number;
  unlocked: boolean;
  /** Mundo entero superado: es lo que da derecho a su medalla. */
  done: boolean;
}

export function worldProgress(progress: Progress, worldId: WorldId): WorldProgress | undefined {
  const world = findWorld(worldId);
  if (!world) return undefined;

  const games = gamesOfWorld(worldId);
  const completed = games.filter((game) => progress.completed.includes(game.id)).length;
  return {
    world,
    total: games.length,
    completed,
    unlocked: isWorldUnlocked(progress, worldId),
    done: games.length > 0 && completed === games.length,
  };
}

/** El progreso de cada mundo que tenga pruebas, en el orden del mapa. */
export function allWorldProgress(progress: Progress): WorldProgress[] {
  return populatedWorlds()
    .map((world) => worldProgress(progress, world.id))
    .filter((entry): entry is WorldProgress => entry !== undefined);
}

/**
 * El mundo «en curso»: el primero abierto que aún no está terminado. Es el que
 * el mapa pone el primero para poder seguir por donde iba sin buscar.
 */
export function currentWorldId(progress: Progress): WorldId | undefined {
  const worlds = allWorldProgress(progress);
  const started = worlds.find((entry) => entry.unlocked && entry.completed > 0 && !entry.done);
  const pending = worlds.find((entry) => entry.unlocked && !entry.done);
  return (started ?? pending)?.world.id;
}

/** La pegatina N se gana superando la prueba N. */
export function hasSticker(progress: Progress, gameId: number): boolean {
  return progress.completed.includes(gameId);
}

function safeStorage(): Storage | undefined {
  try {
    return typeof window !== 'undefined' ? window.localStorage : undefined;
  } catch {
    // Safari en modo privado lanza al acceder a localStorage.
    return undefined;
  }
}
