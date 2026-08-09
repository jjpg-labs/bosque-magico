import { afterEach, describe, expect, it, vi } from 'vitest';
import { seededRng } from '../lib/random';
import { GAMES } from '../lib/games/catalog';
import {
  ANIMAL_SOUNDS,
  COLOR_OBJECTS,
  EMOTIONS,
  RHYME_FAMILIES,
  ROUTINE_STEPS,
} from '../lib/games/data';
import { generateRounds, initialLetter } from '../lib/games/generators';
import type { Round } from '../lib/games/types';

/** Muchas semillas: los generadores son aleatorios y un solo caso no prueba nada. */
const SEEDS = Array.from({ length: 200 }, (_, i) => i + 1);

/**
 * Las pruebas que producen rondas, con su generador ya resuelto.
 *
 * «La Aventura del Día» no trae `generate` sino `generateFor`, porque su
 * mezcla depende de lo que se lleve superado; aquí se le pasa el catálogo
 * entero para que también la recorran las comprobaciones genéricas.
 */
const ALL_IDS = GAMES.map((game) => game.id);
const CHOICE_GAMES = GAMES.flatMap((game) => {
  const generate = game.generateFor ? game.generateFor(ALL_IDS) : game.generate;
  return generate ? [{ ...game, generate }] : [];
});

function allRounds(): Round[] {
  return CHOICE_GAMES.flatMap((game) =>
    SEEDS.flatMap((seed) => generateRounds(game.generate!, seededRng(seed), game.roundsToWin)),
  );
}

// Se calcula una sola vez: es el 83 % del coste de este fichero y las seis
// comprobaciones genéricas recorren exactamente el mismo material.
const ALL_ROUNDS = allRounds();

/**
 * Identifica un ejercicio: mismo enunciado, mismo dibujo y misma respuesta.
 * Dos rondas con el mismo `core` son la misma pregunta para la niña, aunque
 * los distractores hayan salido distintos.
 */
function coreOf(round: Round): string {
  const correct = round.options.find((option) => option.correct);
  return [round.question, JSON.stringify(round.prompt), JSON.stringify(correct?.display)].join('|');
}

/**
 * Deuda de variedad: pruebas eximidas del mínimo por tener el pool corto.
 *
 * **Está vacío, y la idea es que siga así.** Las cuatro que había —Formas,
 * Colores, Sonidos y Emociones— se saldaron ampliando sus pools y dándoles
 * un segundo modo de preguntar. Si una prueba nueva no llega al mínimo, la
 * solución es más contenido, no una excepción aquí.
 */
const VARIETY_DEBT = new Set<number>();

describe('initialLetter', () => {
  it('quita las tildes', () => {
    expect(initialLetter('Árbol')).toBe('A');
    expect(initialLetter('Óscar')).toBe('O');
  });

  it('pasa a mayúscula', () => {
    expect(initialLetter('abeja')).toBe('A');
  });
});

describe('generadores de rondas', () => {
  it('no deja ninguna prueba del catálogo sin implementar', () => {
    // Un mínimo, no un número exacto: el catálogo crece por fases y no tiene
    // sentido pagar un peaje de test en cada prueba nueva. Lo que sí protege
    // es que no se borre medio catálogo por accidente.
    expect(GAMES.length).toBeGreaterThanOrEqual(19);
    // La de memoria no usa generador; las demás sí. Ninguna debe quedar sin
    // implementar: en la versión original, 10 de 13 caían a un botón genérico.
    const unimplemented = GAMES.filter(
      (game) => game.kind === 'choice' && !game.generate && !game.generateFor,
    );
    expect(unimplemented).toEqual([]);
  });

  it('no repite ids en el catálogo', () => {
    const ids = GAMES.map((game) => game.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('produce siempre exactamente una opción correcta', () => {
    for (const round of ALL_ROUNDS) {
      const correct = round.options.filter((option) => option.correct);
      expect(correct, `pregunta: ${round.question}`).toHaveLength(1);
    }
  });

  it('nunca repite el contenido visible de dos opciones', () => {
    for (const round of ALL_ROUNDS) {
      const rendered = round.options.map((option) => JSON.stringify(option.display));
      expect(new Set(rendered).size, `pregunta: ${round.question}`).toBe(rendered.length);
    }
  });

  it('da ids únicos a las opciones', () => {
    for (const round of ALL_ROUNDS) {
      const ids = round.options.map((option) => option.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('siempre ofrece al menos dos opciones', () => {
    for (const round of ALL_ROUNDS) {
      expect(round.options.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('rellena enunciado hablado y escrito', () => {
    for (const round of ALL_ROUNDS) {
      expect(round.question.length).toBeGreaterThan(0);
      expect(round.spoken.length).toBeGreaterThan(0);
    }
  });

  it('genera tantas rondas como pide cada prueba', () => {
    for (const game of CHOICE_GAMES) {
      const rounds = generateRounds(game.generate!, seededRng(7), game.roundsToWin);
      expect(rounds).toHaveLength(game.roundsToWin);
    }
  });

  it('varía las preguntas entre partidas', () => {
    // Con el mismo generador y semillas distintas no puede salir siempre lo
    // mismo, o la niña acaba memorizando la posición del botón.
    const letters = GAMES[0].generate!;
    const questions = new Set(SEEDS.map((seed) => letters(seededRng(seed)).question));
    expect(questions.size).toBeGreaterThan(5);
  });

  it('no repite el mismo ejercicio dentro de una misma partida', () => {
    // `generateRounds` deduplica por ejercicio, no por enunciado. Antes
    // deduplicaba solo por `question`, así que las siete pruebas cuyo
    // enunciado es siempre el mismo («¿Cómo se siente?», «¿Cuántos hay?»...)
    // repetían la misma cara en el 43 % de las partidas.
    // Sin excepciones: con el dedupe por ejercicio, ni siquiera las pruebas de
    // pool corto repiten dentro de una misma partida.
    for (const game of CHOICE_GAMES) {
      for (const seed of SEEDS) {
        const rounds = generateRounds(game.generate!, seededRng(seed), game.roundsToWin);
        const cores = new Set(rounds.map(coreOf));
        expect(cores.size, `${game.title} (semilla ${seed})`).toBe(rounds.length);
      }
    }
  });

  it('cada prueba produce variedad suficiente para no memorizarse', () => {
    for (const game of CHOICE_GAMES) {
      if (VARIETY_DEBT.has(game.id)) continue;
      // «La Aventura del Día» es igual toda la jornada a propósito: su
      // variedad no se mide por semilla sino por fecha, más abajo.
      if (game.generateFor) continue;
      const cores = new Set(
        Array.from({ length: 800 }, (_, seed) => coreOf(game.generate!(seededRng(seed + 1), 0))),
      );
      expect(cores.size, game.title).toBeGreaterThanOrEqual(Math.max(8, 4 * game.roundsToWin));
    }
  });
});

describe('«¿Dónde hay MÁS?»', () => {
  const moreLess = GAMES.find((game) => game.id === 9)!.generate!;

  it('nunca enfrenta dos grupos del mismo tamaño', () => {
    for (const seed of SEEDS) {
      const round = moreLess(seededRng(seed));
      const sizes = round.options.map((option) =>
        option.display.kind === 'group' ? option.display.items.length : -1,
      );
      expect(sizes[0]).not.toBe(sizes[1]);
    }
  });

  it('marca como correcto el grupo que de verdad tiene más (o menos)', () => {
    for (const seed of SEEDS) {
      const round = moreLess(seededRng(seed));
      const sizes = round.options.map((option) =>
        option.display.kind === 'group' ? option.display.items.length : -1,
      );
      const correctIndex = round.options.findIndex((option) => option.correct);
      const expected = round.question.includes('MÁS')
        ? sizes.indexOf(Math.max(...sizes))
        : sizes.indexOf(Math.min(...sizes));
      expect(correctIndex).toBe(expected);
    }
  });
});

describe('«El Tren de los Números»', () => {
  const sequence = GAMES.find((game) => game.id === 10)!.generate!;

  it('deja visible el primer vagón para poder deducir el hueco', () => {
    for (const seed of SEEDS) {
      const round = sequence(seededRng(seed));
      expect(round.prompt.kind).toBe('number-sequence');
      if (round.prompt.kind !== 'number-sequence') continue;
      expect(round.prompt.items[0]).not.toBeNull();
      expect(round.prompt.items.filter((item) => item === null)).toHaveLength(1);
    }
  });

  it('la respuesta correcta es el número que falta', () => {
    for (const seed of SEEDS) {
      const round = sequence(seededRng(seed));
      if (round.prompt.kind !== 'number-sequence') continue;
      const gapIndex = round.prompt.items.findIndex((item) => item === null);
      const known = round.prompt.items[gapIndex === 0 ? 1 : 0] as number;
      const expected = known + (gapIndex - (gapIndex === 0 ? 1 : 0));
      const answer = round.options.find((option) => option.correct)!;
      expect(answer.display).toEqual({ kind: 'text', text: String(expected) });
    }
  });
});

describe('sumas y restas', () => {
  it('la suma cuadra con las manzanas dibujadas', () => {
    const add = GAMES.find((game) => game.id === 3)!.generate!;
    for (const seed of SEEDS) {
      const round = add(seededRng(seed));
      if (round.prompt.kind !== 'equation') continue;
      const total = round.prompt.left.length + round.prompt.right.length;
      const answer = round.options.find((option) => option.correct)!;
      expect(answer.display).toEqual({ kind: 'text', text: String(total) });
    }
  });

  it('la resta nunca da un resultado negativo', () => {
    const sub = GAMES.find((game) => game.id === 4)!.generate!;
    for (const seed of SEEDS) {
      const round = sub(seededRng(seed));
      if (round.prompt.kind !== 'equation') continue;
      const remaining = round.prompt.left.length - round.prompt.right.length;
      expect(remaining).toBeGreaterThanOrEqual(1);
      const answer = round.options.find((option) => option.correct)!;
      expect(answer.display).toEqual({ kind: 'text', text: String(remaining) });
    }
  });
});

describe('contar', () => {
  it('la respuesta es el número de bichitos dibujados', () => {
    const count = GAMES.find((game) => game.id === 2)!.generate!;
    for (const seed of SEEDS) {
      const round = count(seededRng(seed));
      if (round.prompt.kind !== 'emoji-group') continue;
      const answer = round.options.find((option) => option.correct)!;
      expect(answer.display).toEqual({ kind: 'text', text: String(round.prompt.items.length) });
    }
  });
});

describe('Colores del Bosque', () => {
  const colors = GAMES.find((game) => game.id === 14)!.generate!;

  it('pide un color y la opción correcta es ese color', () => {
    for (const seed of SEEDS) {
      const round = colors(seededRng(seed));
      const correct = round.options.find((option) => option.correct)!;
      if (round.question.startsWith('Toca el color')) {
        expect(round.question).toBe(`Toca el color ${correct.label}`);
        continue;
      }
      // El otro modo: se ve un objeto y hay que decir de qué color es.
      const objeto = COLOR_OBJECTS.find((o) => round.question.includes(o.name));
      expect(objeto, round.question).toBeDefined();
      expect(correct.label).toBe(objeto!.color);
    }
  });

  it('nunca pregunta por el color de algo que puede ser de dos colores', () => {
    // La manzana es roja y verde; el maíz, amarillo y verde. Un objeto con
    // dos colores defendibles convierte la ronda en una trampa.
    const ambiguos = ['🍎', '🌽', '🌶️', '🍏', '🐈', '🦜', '🎈'];
    for (const objeto of COLOR_OBJECTS) {
      expect(ambiguos, objeto.name).not.toContain(objeto.emoji);
    }
  });
});

describe('¿Quién Hace Este Sonido?', () => {
  const animalSound = GAMES.find((game) => game.id === 15)!.generate!;

  it('el sonido locutado corresponde al animal marcado como correcto', () => {
    for (const seed of SEEDS) {
      const round = animalSound(seededRng(seed));
      const correct = round.options.find((option) => option.correct)!;
      const entry = ANIMAL_SOUNDS.find((a) => a.name === correct.label)!;
      expect(entry).toBeDefined();
      expect(round.spoken).toContain(entry.sound);
    }
  });
});

describe('¿Cómo Se Siente?', () => {
  const emotion = GAMES.find((game) => game.id === 16)!.generate!;

  it('el emoji mostrado corresponde a la emoción marcada como correcta', () => {
    for (const seed of SEEDS) {
      const round = emotion(seededRng(seed));
      expect(round.prompt.kind).toBe('emoji-single');
      if (round.prompt.kind !== 'emoji-single') continue;
      const correct = round.options.find((option) => option.correct)!;
      const entry = EMOTIONS.find((e) => e.name === correct.label)!;
      expect(entry).toBeDefined();
      expect(entry.emoji).toBe(round.prompt.item);
    }
  });
});

describe('Rimas Divertidas', () => {
  const rhyme = GAMES.find((game) => game.id === 17)!.generate!;

  it('la opción correcta pertenece a la misma familia de rima que la palabra escuchada', () => {
    for (const seed of SEEDS) {
      const round = rhyme(seededRng(seed));
      const targetMatch = round.question.match(/¿Qué rima con (.+)\?/);
      expect(targetMatch).not.toBeNull();
      const target = targetMatch![1];
      const family = RHYME_FAMILIES.find((f) => f.some((w) => w.word === target));
      expect(family).toBeDefined();
      const correct = round.options.find((option) => option.correct)!;
      expect(family!.some((w) => w.word === correct.label)).toBe(true);
    }
  });
});

describe('Grande y Pequeño', () => {
  const size = GAMES.find((game) => game.id === 18)!.generate!;

  it('exactamente una opción es grande y la otra pequeña', () => {
    for (const seed of SEEDS) {
      const round = size(seededRng(seed));
      const scales = round.options.map((option) =>
        option.display.kind === 'emoji' ? option.display.scale : undefined,
      );
      expect(scales.slice().sort()).toEqual(['lg', 'sm']);
    }
  });

  it('la pregunta pide GRANDE o PEQUEÑO acorde a la opción correcta', () => {
    for (const seed of SEEDS) {
      const round = size(seededRng(seed));
      const correct = round.options.find((option) => option.correct)!;
      const correctScale = correct.display.kind === 'emoji' ? correct.display.scale : undefined;
      expect(correctScale).toBe(round.question.includes('GRANDE') ? 'lg' : 'sm');
    }
  });
});

describe('La Rutina del Día', () => {
  const routine = GAMES.find((game) => game.id === 19)!.generate!;

  it('deja visible el primer paso de la ventana y solo oculta uno', () => {
    for (const seed of SEEDS) {
      const round = routine(seededRng(seed));
      expect(round.prompt.kind).toBe('sequence');
      if (round.prompt.kind !== 'sequence') continue;
      expect(round.prompt.items[0]).not.toBeNull();
      expect(round.prompt.items.filter((item) => item === null)).toHaveLength(1);
    }
  });

  it('la opción correcta es el paso que de verdad falta en la secuencia', () => {
    for (const seed of SEEDS) {
      const round = routine(seededRng(seed));
      if (round.prompt.kind !== 'sequence') continue;
      const correct = round.options.find((option) => option.correct)!;
      const step = ROUTINE_STEPS.find((s) => s.label === correct.label)!;
      expect(step).toBeDefined();
      expect(correct.display).toEqual({ kind: 'emoji', emoji: step.emoji });
    }
  });
});


describe('La Aventura del Día', () => {
  const aventura = GAMES.find((game) => game.id === 101)!;
  const todos = GAMES.map((game) => game.id);

  function rondasDe(fecha: Date, completadas: readonly number[] = todos): string[] {
    vi.setSystemTime(fecha);
    const rounds = generateRounds(aventura.generateFor!(completadas), seededRng(1), 8);
    return rounds.map(coreOf);
  }

  afterEach(() => vi.useRealTimers());

  it('es la misma aventura durante todo el día', () => {
    // Se puede hablar de ella en la merienda y volver a jugarla igual.
    const manana = rondasDe(new Date(2026, 7, 9, 9, 0));
    const noche = rondasDe(new Date(2026, 7, 9, 20, 30));
    expect(noche).toEqual(manana);
  });

  it('no depende de la semilla que le pasen, solo de la fecha', () => {
    vi.setSystemTime(new Date(2026, 7, 9, 9, 0));
    const conUna = generateRounds(aventura.generateFor!(todos), seededRng(1), 8).map(coreOf);
    const conOtra = generateRounds(aventura.generateFor!(todos), seededRng(999), 8).map(coreOf);
    expect(conOtra).toEqual(conUna);
  });

  it('cambia al día siguiente', () => {
    const hoy = rondasDe(new Date(2026, 7, 9));
    const manana = rondasDe(new Date(2026, 7, 10));
    expect(manana).not.toEqual(hoy);
  });

  it('dentro de una misma aventura las rondas son distintas entre sí', () => {
    const rondas = rondasDe(new Date(2026, 7, 9));
    expect(new Set(rondas).size).toBe(rondas.length);
  });

  it('solo mezcla pruebas ya superadas', () => {
    // Con una sola prueba superada, las ocho rondas salen todas de ella.
    vi.setSystemTime(new Date(2026, 7, 9));
    const soloColores = generateRounds(aventura.generateFor!([14]), seededRng(1), 8);
    for (const ronda of soloColores) {
      const esDeColores =
        ronda.question.startsWith('Toca el color') || ronda.question.startsWith('¿De qué color');
      expect(esDeColores, ronda.question).toBe(true);
    }
  });

  it('sin nada superado todavía, mezcla el catálogo entero en vez de romperse', () => {
    vi.setSystemTime(new Date(2026, 7, 9));
    expect(() => generateRounds(aventura.generateFor!([]), seededRng(1), 8)).not.toThrow();
  });
});
