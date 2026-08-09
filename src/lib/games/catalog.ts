import {
  genAdd,
  genAnimalSound,
  genColors,
  genCount,
  genEmotion,
  genLetters,
  genMoreLess,
  genNumberSequence,
  genOddOne,
  genPatterns,
  genPhonics,
  genRhyme,
  genRoutine,
  genShapeMatch,
  genShapes,
  genSize,
  genSub,
  makeMixGenerator,
} from './generators';
import type { GameDefinition, RoundGenerator, Sticker, World, WorldId } from './types';

/**
 * Los mundos del mapa, en el orden en que se pintan.
 *
 * Cuatro están abiertos de salida (letras, números, formas y animales), así
 * que siempre hay varias pruebas disponibles a la vez: nunca se puede quedar
 * atascada detrás de una prueba concreta que no le apetezca ese día.
 */
export const WORLDS: readonly World[] = [
  {
    id: 'letras',
    name: 'El Claro de las Letras',
    icon: '🔤',
    desc: 'Letras, sonidos y palabras',
    bg: 'bg-sky-100',
    color: 'text-sky-700',
    border: 'border-sky-300',
    unlock: { kind: 'always' },
  },
  {
    id: 'numeros',
    name: 'El Río de los Números',
    icon: '🔢',
    desc: 'Contar y conocer los números',
    bg: 'bg-indigo-100',
    color: 'text-indigo-700',
    border: 'border-indigo-300',
    unlock: { kind: 'always' },
  },
  {
    id: 'cuentas',
    name: 'La Cueva de las Cuentas',
    icon: '➕',
    desc: 'Sumar, restar y repartir',
    bg: 'bg-violet-100',
    color: 'text-violet-700',
    border: 'border-violet-300',
    unlock: { kind: 'world', world: 'numeros', count: 3 },
  },
  {
    id: 'formas',
    name: 'La Montaña de las Formas',
    icon: '🔷',
    desc: 'Figuras, colores y sitios',
    bg: 'bg-cyan-100',
    color: 'text-cyan-700',
    border: 'border-cyan-300',
    unlock: { kind: 'always' },
  },
  {
    id: 'logica',
    name: 'El Laberinto de la Lógica',
    icon: '🧩',
    desc: 'Patrones, parejas y clasificar',
    bg: 'bg-purple-100',
    color: 'text-purple-700',
    border: 'border-purple-300',
    unlock: { kind: 'world', world: 'formas', count: 3 },
  },
  {
    id: 'medidas',
    name: 'El Prado de las Medidas',
    icon: '📏',
    desc: 'Comparar, medir y el paso del tiempo',
    bg: 'bg-teal-100',
    color: 'text-teal-700',
    border: 'border-teal-300',
    unlock: { kind: 'world', world: 'numeros', count: 3 },
  },
  {
    id: 'natura',
    name: 'El Bosque de los Animales',
    icon: '🦊',
    desc: 'Animales, plantas y naturaleza',
    bg: 'bg-emerald-100',
    color: 'text-emerald-700',
    border: 'border-emerald-300',
    unlock: { kind: 'always' },
  },
  {
    id: 'cuerpo',
    name: 'La Casa de los Peques',
    icon: '🧒',
    desc: 'El cuerpo, la comida y los hábitos',
    bg: 'bg-rose-100',
    color: 'text-rose-700',
    border: 'border-rose-300',
    unlock: { kind: 'world', world: 'natura', count: 3 },
  },
  {
    id: 'emociones',
    name: 'La Plaza de las Emociones',
    icon: '💛',
    desc: 'Emociones, amigos y música',
    bg: 'bg-amber-100',
    color: 'text-amber-700',
    border: 'border-amber-300',
    unlock: { kind: 'always' },
  },
  {
    id: 'oficios',
    name: 'La Ciudad de los Oficios',
    icon: '🚂',
    desc: 'Oficios y transportes',
    bg: 'bg-orange-100',
    color: 'text-orange-700',
    border: 'border-orange-300',
    unlock: { kind: 'world', world: 'cuerpo', count: 3 },
  },
  {
    id: 'especial',
    name: 'La Torre del Trofeo',
    icon: '🏆',
    desc: 'Las pruebas más difíciles de todas',
    bg: 'bg-yellow-100',
    color: 'text-yellow-700',
    border: 'border-yellow-400',
    unlock: { kind: 'total', count: 20 },
  },
];

export function findWorld(id: WorldId): World | undefined {
  return WORLDS.find((world) => world.id === id);
}

/**
 * Las pruebas con contenido propio. Las de remezcla se construyen aparte,
 * porque su generador se deriva justo de estas.
 */
const CONTENT_GAMES: readonly GameDefinition[] = [
  {
    id: 1,
    title: 'Letras Iniciales',
    desc: '¿Qué letra empieza como el animalito?',
    icon: '🔤',
    cat: 'Letras',
    world: 'letras',
    kind: 'choice',
    roundsToWin: 3,
    generate: genLetters,
  },
  {
    id: 2,
    title: 'Cuenta los Bichitos',
    desc: 'Cuenta cuántos bichitos hay en el jardín',
    icon: '🔢',
    cat: 'Números',
    world: 'numeros',
    kind: 'choice',
    roundsToWin: 3,
    generate: genCount,
  },
  {
    id: 3,
    title: 'La Suma de las Manzanas',
    desc: 'Suma las manzanas del árbol',
    icon: '🍎',
    cat: 'Sumas',
    world: 'cuentas',
    kind: 'choice',
    roundsToWin: 3,
    generate: genAdd,
  },
  {
    id: 4,
    title: 'La Resta del Monito',
    desc: 'El monito se come plátanos. ¿Cuántos quedan?',
    icon: '🍌',
    cat: 'Restas',
    world: 'cuentas',
    kind: 'choice',
    roundsToWin: 3,
    generate: genSub,
  },
  {
    id: 5,
    title: 'Formas Geométricas',
    desc: 'Encuentra la figura geométrica correcta',
    icon: '📐',
    cat: 'Geometría',
    world: 'formas',
    kind: 'choice',
    roundsToWin: 3,
    generate: genShapes,
  },
  {
    id: 6,
    title: 'Patrones Divertidos',
    desc: '¿Qué bichito sigue en la fila?',
    icon: '🧩',
    cat: 'Lógica',
    world: 'logica',
    kind: 'choice',
    roundsToWin: 3,
    generate: genPatterns,
  },
  {
    id: 7,
    title: 'El Intruso',
    desc: '¿Cuál es diferente a los demás?',
    icon: '🔍',
    cat: 'Lógica',
    world: 'logica',
    kind: 'choice',
    roundsToWin: 3,
    generate: genOddOne,
  },
  {
    id: 8,
    title: 'Memoria de Bichos',
    desc: 'Encuentra las parejas de animalitos iguales',
    icon: '🎴',
    cat: 'Lógica',
    world: 'logica',
    kind: 'memory',
    roundsToWin: 1,
    pairCount: 4,
  },
  {
    id: 9,
    title: '¿Dónde hay MÁS?',
    desc: 'Elige el grupo que tiene más elementos',
    icon: '⚖️',
    cat: 'Comparación',
    world: 'medidas',
    kind: 'choice',
    roundsToWin: 3,
    generate: genMoreLess,
  },
  {
    id: 10,
    title: 'El Tren de los Números',
    desc: '¿Qué número falta en el vagón?',
    icon: '🚂',
    cat: 'Números',
    world: 'numeros',
    kind: 'choice',
    roundsToWin: 3,
    generate: genNumberSequence,
  },
  {
    id: 11,
    title: 'Sonidos e Iniciales',
    desc: 'Escucha la palabra e identifica la vocal inicial',
    icon: '🗣️',
    cat: 'Letras',
    world: 'letras',
    kind: 'choice',
    roundsToWin: 3,
    generate: genPhonics,
  },
  {
    id: 12,
    title: 'Empareja las Formas',
    desc: 'Encaja cada figura en su lugar',
    icon: '⭐',
    cat: 'Geometría',
    world: 'formas',
    kind: 'choice',
    roundsToWin: 3,
    generate: genShapeMatch,
  },
  {
    id: 14,
    title: 'Colores del Bosque',
    desc: 'Descubre y toca cada color',
    icon: '🎨',
    cat: 'Colores',
    world: 'formas',
    kind: 'choice',
    roundsToWin: 3,
    generate: genColors,
  },
  {
    id: 15,
    title: '¿Quién Hace Este Sonido?',
    desc: 'Escucha el sonido y adivina qué animal es',
    icon: '🔊',
    cat: 'Sonidos',
    world: 'natura',
    kind: 'choice',
    roundsToWin: 3,
    generate: genAnimalSound,
  },
  {
    id: 16,
    title: '¿Cómo Se Siente?',
    desc: 'Reconoce las caras y sus emociones',
    icon: '😊',
    cat: 'Emociones',
    world: 'emociones',
    kind: 'choice',
    roundsToWin: 3,
    generate: genEmotion,
  },
  {
    id: 17,
    title: 'Rimas Divertidas',
    desc: 'Escucha una palabra y encuentra la que rima',
    icon: '🎵',
    cat: 'Letras',
    world: 'letras',
    kind: 'choice',
    roundsToWin: 3,
    generate: genRhyme,
  },
  {
    id: 18,
    title: 'Grande y Pequeño',
    desc: 'Toca el que es más grande o más pequeño',
    icon: '📏',
    cat: 'Comparación',
    world: 'medidas',
    kind: 'choice',
    roundsToWin: 3,
    generate: genSize,
  },
  {
    id: 19,
    title: 'La Rutina del Día',
    desc: '¿Qué toca después en el día?',
    icon: '🕐',
    cat: 'Lógica',
    world: 'medidas',
    kind: 'choice',
    roundsToWin: 3,
    generate: genRoutine,
  },
];

/**
 * El desafío final remezcla los generadores de las demás pruebas, derivados
 * del propio catálogo: así entra automáticamente cada prueba nueva sin tener
 * que acordarse de añadirla a ninguna lista.
 */
const MIX_POOL: readonly RoundGenerator[] = CONTENT_GAMES.flatMap((game) => game.generate ?? []);

const MIX_GAMES: readonly GameDefinition[] = [
  {
    id: 13,
    title: 'El Gran Desafío Final',
    desc: 'Prueba combinada para ganar el trofeo',
    icon: '🏆',
    cat: 'Especial',
    world: 'especial',
    kind: 'choice',
    roundsToWin: 5,
    generate: makeMixGenerator(MIX_POOL),
  },
];

/** Las 19 pruebas, ordenadas por id. El orden del mapa lo pone `WORLDS`. */
export const GAMES: readonly GameDefinition[] = [...CONTENT_GAMES, ...MIX_GAMES].sort(
  (a, b) => a.id - b.id,
);

/**
 * Los ids que existen de verdad, para validar el progreso guardado.
 *
 * No vale con comparar contra `GAMES.length`: hoy coincidiría por accidente
 * (ids 1..19 y 19 pruebas), pero en cuanto se reserven rangos de id por fase
 * habrá ids mayores que el total y el progreso de esas pruebas se descartaría
 * en silencio al recargar. Por eso ya no existe un `TOTAL_GAMES` exportado:
 * era la vía fácil de volver a cometer ese error.
 */
export const GAME_IDS: ReadonlySet<number> = new Set(GAMES.map((g) => g.id));

export function findGame(id: number): GameDefinition | undefined {
  return GAMES.find((g) => g.id === id);
}

/** Las pruebas de un mundo, en el orden en que se juegan (por id). */
export function gamesOfWorld(worldId: WorldId): readonly GameDefinition[] {
  return GAMES.filter((game) => game.world === worldId);
}

export function worldOfGame(gameId: number): World | undefined {
  const game = findGame(gameId);
  return game && findWorld(game.world);
}

/** Mundos que tienen al menos una prueba: los vacíos no se pintan. */
export function populatedWorlds(): readonly World[] {
  return WORLDS.filter((world) => gamesOfWorld(world.id).length > 0);
}

/**
 * La prueba siguiente: la siguiente del mismo mundo y, si no queda ninguna, la
 * primera del mundo siguiente que tenga pruebas. `undefined` en la última.
 *
 * No vale con sumar 1 al id ni con avanzar en el catálogo plano: los ids se
 * reservan por rangos y tienen huecos, y «Siguiente» tiene que seguir el hilo
 * del mundo en el que se está jugando, no saltar a otro tema a media tanda.
 */
export function nextGameId(currentId: number): number | undefined {
  const game = findGame(currentId);
  if (!game) return undefined;

  const siblings = gamesOfWorld(game.world);
  const index = siblings.findIndex((g) => g.id === currentId);
  const nextInWorld = siblings[index + 1];
  if (nextInWorld) return nextInWorld.id;

  const worldIndex = WORLDS.findIndex((w) => w.id === game.world);
  for (const world of WORLDS.slice(worldIndex + 1)) {
    const first = gamesOfWorld(world.id)[0];
    if (first) return first.id;
  }
  return undefined;
}

export type { Sticker } from './types';

/** La pegatina N se gana superando la prueba N. */
export const STICKERS: readonly Sticker[] = [
  { gameId: 1, name: 'Mariquita Risueña', icon: '🐞', bg: 'bg-red-100', color: 'text-red-500' },
  { gameId: 2, name: 'Oruga Saltarina', icon: '🐛', bg: 'bg-green-100', color: 'text-green-600' },
  { gameId: 3, name: 'Abeja Bailarina', icon: '🐝', bg: 'bg-yellow-100', color: 'text-yellow-600' },
  { gameId: 4, name: 'Ranita Sonriente', icon: '🐸', bg: 'bg-emerald-100', color: 'text-emerald-600' },
  { gameId: 5, name: 'Caracol Veloz', icon: '🐌', bg: 'bg-orange-100', color: 'text-orange-500' },
  { gameId: 6, name: 'Axolote Curioso', icon: '🦎', bg: 'bg-pink-100', color: 'text-pink-500' },
  { gameId: 7, name: 'Búho Sabihondo', icon: '🦉', bg: 'bg-purple-100', color: 'text-purple-600' },
  { gameId: 8, name: 'Gatito Mágico', icon: '🐱', bg: 'bg-indigo-100', color: 'text-indigo-500' },
  { gameId: 9, name: 'Perrito Juguetón', icon: '🐶', bg: 'bg-amber-100', color: 'text-amber-600' },
  { gameId: 10, name: 'Erizito Dulce', icon: '🦔', bg: 'bg-stone-100', color: 'text-stone-600' },
  { gameId: 11, name: 'Monito Risueño', icon: '🐵', bg: 'bg-amber-200', color: 'text-amber-800' },
  { gameId: 12, name: 'Unicornio Bebé', icon: '🦄', bg: 'bg-fuchsia-100', color: 'text-fuchsia-500' },
  {
    gameId: 13,
    name: 'Super Bichito Dorado',
    icon: '👑',
    bg: 'bg-yellow-200',
    color: 'text-yellow-700',
  },
  { gameId: 14, name: 'Loro Multicolor', icon: '🦜', bg: 'bg-teal-100', color: 'text-teal-600' },
  { gameId: 15, name: 'Grillo Cantarín', icon: '🦗', bg: 'bg-lime-100', color: 'text-lime-600' },
  { gameId: 16, name: 'Koala Cariñoso', icon: '🐨', bg: 'bg-cyan-100', color: 'text-cyan-600' },
  { gameId: 17, name: 'Ruiseñor Cantor', icon: '🐦', bg: 'bg-rose-100', color: 'text-rose-500' },
  {
    gameId: 18,
    name: 'Elefantito Curioso',
    icon: '🐘',
    bg: 'bg-violet-100',
    color: 'text-violet-600',
  },
  {
    gameId: 19,
    name: 'Zorrito Madrugador',
    icon: '🦊',
    bg: 'bg-orange-200',
    color: 'text-orange-700',
  },
];

export function stickerFor(gameId: number): Sticker | undefined {
  return STICKERS.find((s) => s.gameId === gameId);
}

/** Colores con los que pintar una pegatina: los suyos o, si no tiene, los de su mundo. */
export function stickerStyle(sticker: Sticker): { bg: string; color: string } {
  const world = worldOfGame(sticker.gameId);
  return {
    bg: sticker.bg ?? world?.bg ?? 'bg-slate-100',
    color: sticker.color ?? world?.color ?? 'text-slate-600',
  };
}
