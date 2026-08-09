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

import { GAME_IDS } from './games/catalog';

const STORAGE_KEY = 'bosque_magico_progress_v2';
const LEGACY_KEY = 'bosque_bichitos_progress';

export interface Progress {
  completed: number[];
  /** Veces que se ha empezado cada prueba. Ausente/vacío en progreso migrado de v2. */
  playCounts: Record<number, number>;
}

export const emptyProgress: Progress = { completed: [], playCounts: {} };

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
      return { completed, playCounts };
    }

    // Migración desde el formato de la versión de un solo fichero HTML.
    const legacy = storage.getItem(LEGACY_KEY);
    if (legacy) {
      const parsed: unknown = JSON.parse(legacy);
      const completed = sanitize((parsed as { completed?: unknown } | null)?.completed);
      const migrated = { completed, playCounts: {} };
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
      JSON.stringify({ version: 2, completed: progress.completed, playCounts: progress.playCounts }),
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

/** Una prueba se desbloquea al superar la anterior. La primera siempre está abierta. */
export function isUnlocked(progress: Progress, gameId: number): boolean {
  return gameId === 1 || progress.completed.includes(gameId - 1);
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
