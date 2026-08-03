import { describe, expect, it } from 'vitest';
import { seededRng } from '../lib/random';
import { GAMES } from '../lib/games/catalog';
import { generateRounds, initialLetter } from '../lib/games/generators';
import type { Round } from '../lib/games/types';

/** Muchas semillas: los generadores son aleatorios y un solo caso no prueba nada. */
const SEEDS = Array.from({ length: 200 }, (_, i) => i + 1);

const CHOICE_GAMES = GAMES.filter((game) => game.generate !== undefined);

function allRounds(): Round[] {
  return CHOICE_GAMES.flatMap((game) =>
    SEEDS.flatMap((seed) => generateRounds(game.generate!, seededRng(seed), game.roundsToWin)),
  );
}

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
  it('cubre las 13 pruebas del catálogo', () => {
    expect(GAMES).toHaveLength(13);
    // La de memoria no usa generador; las demás sí. Ninguna debe quedar sin
    // implementar: en la versión original, 10 de 13 caían a un botón genérico.
    const unimplemented = GAMES.filter((game) => game.kind === 'choice' && !game.generate);
    expect(unimplemented).toEqual([]);
  });

  it('produce siempre exactamente una opción correcta', () => {
    for (const round of allRounds()) {
      const correct = round.options.filter((option) => option.correct);
      expect(correct, `pregunta: ${round.question}`).toHaveLength(1);
    }
  });

  it('nunca repite el contenido visible de dos opciones', () => {
    for (const round of allRounds()) {
      const rendered = round.options.map((option) => JSON.stringify(option.display));
      expect(new Set(rendered).size, `pregunta: ${round.question}`).toBe(rendered.length);
    }
  });

  it('da ids únicos a las opciones', () => {
    for (const round of allRounds()) {
      const ids = round.options.map((option) => option.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('siempre ofrece al menos dos opciones', () => {
    for (const round of allRounds()) {
      expect(round.options.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('rellena enunciado hablado y escrito', () => {
    for (const round of allRounds()) {
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
