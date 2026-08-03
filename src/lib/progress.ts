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

import { TOTAL_GAMES } from './games/catalog';

const STORAGE_KEY = 'bosque_magico_progress_v2';
const LEGACY_KEY = 'bosque_bichitos_progress';

export interface Progress {
  completed: number[];
}

export const emptyProgress: Progress = { completed: [] };

function sanitize(ids: unknown): number[] {
  if (!Array.isArray(ids)) return [];
  const valid = ids.filter(
    (id): id is number => typeof id === 'number' && Number.isInteger(id) && id >= 1 && id <= TOTAL_GAMES,
  );
  return [...new Set(valid)].sort((a, b) => a - b);
}

export function loadProgress(storage: Storage | undefined = safeStorage()): Progress {
  if (!storage) return emptyProgress;

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      const completed = sanitize((parsed as { completed?: unknown } | null)?.completed);
      return { completed };
    }

    // Migración desde el formato de la versión de un solo fichero HTML.
    const legacy = storage.getItem(LEGACY_KEY);
    if (legacy) {
      const parsed: unknown = JSON.parse(legacy);
      const completed = sanitize((parsed as { completed?: unknown } | null)?.completed);
      const migrated = { completed };
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
    storage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, completed: progress.completed }));
  } catch {
    // Cuota llena o modo privado: el progreso se pierde al recargar, pero la
    // partida en curso sigue funcionando.
  }
}

export function markCompleted(progress: Progress, gameId: number): Progress {
  if (progress.completed.includes(gameId)) return progress;
  return { completed: [...progress.completed, gameId].sort((a, b) => a - b) };
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
