import { describe, expect, it } from 'vitest';
import { seededRng } from '../lib/random';
import { GAMES } from '../lib/games/catalog';
import { CONTAINERS, SCENE_ITEMS, SHAPE_SIDES } from '../lib/games/data';
import { POSITION_LABELS } from '../lib/games/generators';

const SEEDS = Array.from({ length: 200 }, (_, i) => i + 1);
const generatorOf = (id: number) => GAMES.find((game) => game.id === id)!.generate!;

describe('pruebas de orientación espacial', () => {
  const SCENE_GAMES = [48, 49, 50, 51];

  it('la opción correcta describe la posición que se dibuja', () => {
    // Es el invariante que el barrido genérico no puede ver: que la palabra
    // marcada como buena sea la del sitio donde está de verdad el objeto.
    for (const id of SCENE_GAMES) {
      for (const seed of SEEDS) {
        const round = generatorOf(id)(seededRng(seed));
        expect(round.prompt.kind).toBe('scene');
        if (round.prompt.kind !== 'scene') continue;
        const correct = round.options.find((option) => option.correct)!;
        expect(correct.label, `prueba ${id}`).toBe(POSITION_LABELS[round.prompt.position]);
      }
    }
  });

  it('dibuja siempre un contenedor y un objeto conocidos', () => {
    for (const id of SCENE_GAMES) {
      for (const seed of SEEDS) {
        const round = generatorOf(id)(seededRng(seed));
        if (round.prompt.kind !== 'scene') continue;
        expect(CONTAINERS).toContain(round.prompt.container);
        expect(SCENE_ITEMS).toContain(round.prompt.item);
      }
    }
  });

  it('cada prueba solo enfrenta las posiciones de su pareja o trío', () => {
    // Preguntar «¿dentro o fuera?» y ofrecer «encima» sería desconcertante.
    const esperado: Record<number, string[]> = {
      48: ['dentro', 'fuera'],
      49: ['encima', 'debajo'],
      50: ['izquierda', 'derecha'],
      51: ['arriba', 'en medio', 'abajo'],
    };
    for (const id of SCENE_GAMES) {
      for (const seed of SEEDS) {
        const round = generatorOf(id)(seededRng(seed));
        const labels = round.options.map((option) => option.label).sort();
        expect(labels).toEqual([...esperado[id]].sort());
      }
    }
  });
});

describe('¿Cuántos Lados Tiene?', () => {
  it('nunca ofrece dos figuras con el mismo número de lados', () => {
    // El cuadrado, el rombo y el rectángulo tienen cuatro los tres: juntos en
    // la misma ronda darían tres respuestas buenas.
    for (const seed of SEEDS) {
      const round = generatorOf(53)(seededRng(seed));
      if (!round.question.includes('lados?') || round.prompt.kind === 'shape') continue;
      const sides = round.options.map(
        (option) =>
          SHAPE_SIDES.find((s) => option.display.kind === 'shape' && s.shape === option.display.shape)!
            .sides,
      );
      expect(new Set(sides).size).toBe(sides.length);
    }
  });

  it('el número marcado como bueno es el que de verdad tiene la figura', () => {
    for (const seed of SEEDS) {
      const round = generatorOf(53)(seededRng(seed));
      if (round.prompt.kind !== 'shape') continue;
      const figura = round.prompt.shape;
      const esperado = SHAPE_SIDES.find((s) => s.shape === figura)!;
      const correct = round.options.find((option) => option.correct)!;
      expect(correct.label, figura).toBe(String(esperado.sides));
    }
  });
});
