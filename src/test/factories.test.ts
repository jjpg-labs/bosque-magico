import { describe, expect, it } from 'vitest';
import { seededRng } from '../lib/random';
import {
  categoryMember,
  distinctDistractors,
  emojiToName,
  listenAndPick,
  makeMixGenerator,
  nameToEmoji,
  numberQuestion,
  oddOneOut,
  orderedSequence,
  pairMatch,
} from '../lib/games/generators';
import type { Category, Item, Pair } from '../lib/games/generators';
import type { Round, RoundGenerator } from '../lib/games/types';

/**
 * Las fábricas se prueban con datos de juguete, no con el contenido real: lo
 * que hay que garantizar es que **ninguna tabla bien formada** puede producir
 * una ronda inválida, no que una prueba concreta funcione. El contenido de
 * verdad ya lo cubre el barrido de `generators.test.ts`.
 */
const SEEDS = Array.from({ length: 200 }, (_, i) => i + 1);

const ANIMALS: readonly Item[] = [
  { emoji: '🐶', name: 'Perro' },
  { emoji: '🐱', name: 'Gato' },
  { emoji: '🐰', name: 'Conejo' },
  { emoji: '🐻', name: 'Oso' },
  { emoji: '🐸', name: 'Rana' },
  { emoji: '🦊', name: 'Zorro' },
];

/** Muchos elementos comparten nombre: es el caso de las pruebas de clasificar. */
const ZONES: readonly Item[] = [
  { emoji: '🐄', name: 'La granja' },
  { emoji: '🐖', name: 'La granja' },
  { emoji: '🐔', name: 'La granja' },
  { emoji: '🦁', name: 'La selva' },
  { emoji: '🐒', name: 'La selva' },
  { emoji: '🐬', name: 'El mar' },
  { emoji: '🐟', name: 'El mar' },
  { emoji: '🐧', name: 'El hielo' },
];

const HOMES: readonly Pair[] = [
  { from: { emoji: '🐟', name: 'el pez' }, to: { emoji: '🌊', name: 'el mar' } },
  { from: { emoji: '🐒', name: 'el mono' }, to: { emoji: '🌴', name: 'la selva' } },
  { from: { emoji: '🐄', name: 'la vaca' }, to: { emoji: '🏠', name: 'la granja' } },
  { from: { emoji: '🐦', name: 'el pájaro' }, to: { emoji: '🌳', name: 'el árbol' } },
  // Dos animales que viven en el mismo sitio: permitido, no hay ambigüedad.
  { from: { emoji: '🐬', name: 'el delfín' }, to: { emoji: '🌊', name: 'el mar' } },
];

const CLASSES: readonly Category[] = [
  {
    name: 'fruta',
    article: 'una',
    items: [
      { emoji: '🍌', name: 'plátano' },
      { emoji: '🍓', name: 'fresa' },
      { emoji: '🍇', name: 'uvas' },
      { emoji: '🍐', name: 'pera' },
    ],
  },
  {
    name: 'vehículo',
    article: 'un',
    items: [
      { emoji: '🚗', name: 'coche' },
      { emoji: '🚌', name: 'autobús' },
      { emoji: '🚲', name: 'bici' },
      { emoji: '🚂', name: 'tren' },
    ],
  },
  {
    name: 'instrumento',
    article: 'un',
    items: [
      { emoji: '🎸', name: 'guitarra' },
      { emoji: '🥁', name: 'tambor' },
      { emoji: '🎺', name: 'trompeta' },
      { emoji: '🎻', name: 'violín' },
    ],
  },
  {
    name: 'flor',
    article: 'una',
    items: [
      { emoji: '🌸', name: 'cerezo' },
      { emoji: '🌻', name: 'girasol' },
      { emoji: '🌷', name: 'tulipán' },
      { emoji: '🌹', name: 'rosa' },
    ],
  },
];

const CYCLES: ReadonlyArray<readonly Item[]> = [
  [
    { emoji: '🥚', name: 'el huevo' },
    { emoji: '🐛', name: 'la oruga' },
    { emoji: '🦋', name: 'la mariposa' },
  ],
  [
    { emoji: '🌰', name: 'la semilla' },
    { emoji: '🌱', name: 'el brote' },
    { emoji: '🌳', name: 'el árbol' },
  ],
  [
    { emoji: '🧊', name: 'el hielo' },
    { emoji: '💧', name: 'la gota' },
    { emoji: '☁️', name: 'la nube' },
    { emoji: '🌧️', name: 'la lluvia' },
  ],
];

interface RhymeWord {
  emoji: string;
  name: string;
  family: string;
}

const RHYMES: readonly RhymeWord[] = [
  { emoji: '🐱', name: 'gato', family: 'ato' },
  { emoji: '🦆', name: 'pato', family: 'ato' },
  { emoji: '🍽️', name: 'plato', family: 'ato' },
  { emoji: '🌙', name: 'luna', family: 'una' },
  { emoji: '🍼', name: 'cuna', family: 'una' },
  { emoji: '🌞', name: 'sol', family: 'ol' },
  { emoji: '⚽', name: 'gol', family: 'ol' },
  { emoji: '🌸', name: 'flor', family: 'or' },
  { emoji: '🥁', name: 'tambor', family: 'or' },
];

const TEXTS = { question: () => 'Pregunta', spoken: () => 'Enunciado hablado' };

/** Los dos invariantes que el barrido genérico exige a toda ronda. */
function expectValidRound(round: Round, where: string, optionCount: number) {
  const correct = round.options.filter((option) => option.correct);
  expect(correct, `${where}: opciones correctas`).toHaveLength(1);

  const displays = round.options.map((option) => JSON.stringify(option.display));
  expect(new Set(displays).size, `${where}: displays repetidos`).toBe(displays.length);

  expect(round.options, `${where}: número de opciones`).toHaveLength(optionCount);
  expect(round.question.length, `${where}: enunciado vacío`).toBeGreaterThan(0);
  expect(round.spoken.length, `${where}: enunciado hablado vacío`).toBeGreaterThan(0);
}

/** Ejecuta la fábrica con muchas semillas y comprueba los invariantes en todas. */
function expectAlwaysValid(name: string, generate: RoundGenerator, optionCount = 4) {
  for (const seed of SEEDS) {
    for (const tier of [0, 1, 2]) {
      expectValidRound(generate(seededRng(seed), tier), `${name} (semilla ${seed})`, optionCount);
    }
  }
}

describe('distinctDistractors', () => {
  it('nunca devuelve la clave excluida ni repite claves', () => {
    for (const seed of SEEDS) {
      const out = distinctDistractors(seededRng(seed), ZONES, (z) => z.name, 'La granja', 3);
      const keys = out.map((z) => z.name);
      expect(keys).not.toContain('La granja');
      expect(new Set(keys).size).toBe(keys.length);
      expect(keys).toHaveLength(3);
    }
  });

  it('acepta varias claves excluidas', () => {
    for (const seed of SEEDS) {
      const out = distinctDistractors(
        seededRng(seed),
        ZONES,
        (z) => z.name,
        ['La granja', 'El mar'],
        2,
      );
      expect(out.map((z) => z.name).sort()).toEqual(['El hielo', 'La selva']);
    }
  });

  it('devuelve lo que haya cuando el pool se queda corto, sin repetir', () => {
    const out = distinctDistractors(seededRng(1), ANIMALS.slice(0, 2), (a) => a.emoji, '🐶', 3);
    expect(out).toHaveLength(1);
  });

  it('varía el representante cuando varios elementos comparten clave', () => {
    // Si dedujera antes de barajar saldría siempre el primero de la tabla.
    const seen = new Set(
      SEEDS.map((seed) => {
        const out = distinctDistractors(seededRng(seed), ZONES, (z) => z.name, 'El mar', 3);
        return out.find((z) => z.name === 'La granja')?.emoji;
      }),
    );
    expect(seen.size).toBeGreaterThan(1);
  });
});

describe('emojiToName', () => {
  const generate = emojiToName(ANIMALS, TEXTS);

  it('cumple los invariantes con muchas semillas', () => {
    expectAlwaysValid('emojiToName', generate);
  });

  it('la opción correcta es el nombre de lo que se enseña', () => {
    for (const seed of SEEDS) {
      const round = generate(seededRng(seed));
      const { prompt } = round;
      expect(prompt.kind).toBe('emoji-single');
      if (prompt.kind !== 'emoji-single') continue;
      const correct = round.options.find((option) => option.correct)!;
      const shown = ANIMALS.find((animal) => animal.emoji === prompt.item)!;
      expect(correct.display).toEqual({ kind: 'text', text: shown.name });
    }
  });

  it('agrupa por nombre cuando varios elementos comparten respuesta', () => {
    // Ocho animales, cuatro zonas: los distractores son zonas distintas, no
    // animales distintos con la misma zona.
    const zones = emojiToName(ZONES, TEXTS);
    for (const seed of SEEDS) {
      const round = zones(seededRng(seed));
      expectValidRound(round, `zonas (semilla ${seed})`, 4);
    }
  });

  it('avisa al construir si la tabla no da para cuatro respuestas', () => {
    expect(() => emojiToName(ZONES.slice(0, 3), TEXTS)).toThrow(/al menos 4/);
  });
});

describe('nameToEmoji', () => {
  it('cumple los invariantes con muchas semillas', () => {
    expectAlwaysValid('nameToEmoji', nameToEmoji(ANIMALS, TEXTS));
  });

  it('no pinta enunciado visual: la pregunta ya lo dice todo', () => {
    const round = nameToEmoji(ANIMALS, TEXTS)(seededRng(1));
    expect(round.prompt).toEqual({ kind: 'none' });
  });

  it('con as: text pinta el nombre en vez del emoji', () => {
    const letters: readonly Item[] = ['A', 'E', 'I', 'O', 'U', 'M'].map((l) => ({
      emoji: l,
      name: l,
    }));
    const generate = nameToEmoji(letters, TEXTS, { as: 'text' });
    expectAlwaysValid('nameToEmoji (texto)', generate);
    for (const seed of SEEDS) {
      for (const option of generate(seededRng(seed)).options) {
        expect(option.display.kind).toBe('text');
      }
    }
  });

  it('respeta optionCount', () => {
    expectAlwaysValid('nameToEmoji (2)', nameToEmoji(ANIMALS, TEXTS, { optionCount: 2 }), 2);
  });
});

describe('pairMatch', () => {
  const generate = pairMatch(HOMES, TEXTS);

  it('cumple los invariantes con muchas semillas', () => {
    expectAlwaysValid('pairMatch', generate);
  });

  it('la respuesta correcta es la pareja de lo que se enseña', () => {
    for (const seed of SEEDS) {
      const round = generate(seededRng(seed));
      const { prompt } = round;
      if (prompt.kind !== 'emoji-single') throw new Error('prompt inesperado');
      const pair = HOMES.find((p) => p.from.emoji === prompt.item)!;
      const correct = round.options.find((option) => option.correct)!;
      expect(correct.display).toEqual({ kind: 'emoji', emoji: pair.to.emoji });
    }
  });

  it('nunca ofrece dos veces la misma respuesta aunque varios pares la compartan', () => {
    // 🌊 es la casa del pez y del delfín: no puede salir dos veces en la misma
    // ronda, ni como correcta y como distractor.
    for (const seed of SEEDS) {
      const emojis = generate(seededRng(seed)).options.map((option) =>
        option.display.kind === 'emoji' ? option.display.emoji : '',
      );
      expect(new Set(emojis).size).toBe(emojis.length);
    }
  });

  it('revienta al construir si un mismo dibujo tiene dos respuestas', () => {
    expect(() =>
      pairMatch(
        [
          ...HOMES,
          { from: { emoji: '🐟', name: 'el pez' }, to: { emoji: '🏠', name: 'la granja' } },
        ],
        TEXTS,
      ),
    ).toThrow(/dos respuestas distintas/);
  });
});

describe('categoryMember', () => {
  const generate = categoryMember(CLASSES, TEXTS);

  it('cumple los invariantes con muchas semillas', () => {
    expectAlwaysValid('categoryMember', generate);
  });

  it('exactamente una opción pertenece a la categoría pedida', () => {
    const texts = {
      question: (pick: { category: Category }) => `¿Cuál es ${pick.category.article} ${pick.category.name}?`,
      spoken: (pick: { category: Category }) => `Busca ${pick.category.article} ${pick.category.name}.`,
    };
    const asked = categoryMember(CLASSES, texts);

    for (const seed of SEEDS) {
      const round = asked(seededRng(seed));
      const category = CLASSES.find((c) => round.question.includes(c.name))!;
      const members = round.options.filter((option) =>
        category.items.some(
          (item) => option.display.kind === 'emoji' && option.display.emoji === item.emoji,
        ),
      );
      expect(members, `semilla ${seed}`).toHaveLength(1);
      expect(members[0].correct).toBe(true);
    }
  });

  it('los distractores salen de categorías distintas entre sí', () => {
    for (const seed of SEEDS) {
      const round = categoryMember(CLASSES, TEXTS)(seededRng(seed));
      const owners = round.options.map(
        (option) =>
          CLASSES.find((category) =>
            category.items.some(
              (item) => option.display.kind === 'emoji' && option.display.emoji === item.emoji,
            ),
          )!.name,
      );
      expect(new Set(owners).size).toBe(owners.length);
    }
  });

  it('revienta al construir si un elemento está en dos categorías', () => {
    const overlapping: Category[] = [
      ...CLASSES,
      { name: 'postre', article: 'un', items: [{ emoji: '🍓', name: 'fresa' }] },
    ];
    expect(() => categoryMember(overlapping, TEXTS)).toThrow(/ambigua/);
  });
});

describe('oddOneOut', () => {
  const generate = oddOneOut(CLASSES, TEXTS);

  it('cumple los invariantes con muchas semillas', () => {
    expectAlwaysValid('oddOneOut', generate);
  });

  it('el intruso es el único que no comparte categoría con los demás', () => {
    for (const seed of SEEDS) {
      const round = generate(seededRng(seed));
      const owners = round.options.map((option) => ({
        correct: option.correct,
        category: CLASSES.find((category) =>
          category.items.some(
            (item) => option.display.kind === 'emoji' && option.display.emoji === item.emoji,
          ),
        )!.name,
      }));
      const intruder = owners.find((o) => o.correct)!;
      const family = owners.filter((o) => !o.correct);
      expect(new Set(family.map((o) => o.category)).size, `semilla ${seed}`).toBe(1);
      expect(family[0].category).not.toBe(intruder.category);
    }
  });

  it('revienta al construir si ninguna categoría da para la familia', () => {
    const tiny = CLASSES.map((category) => ({ ...category, items: category.items.slice(0, 2) }));
    expect(() => oddOneOut(tiny, TEXTS)).toThrow(/familia/);
  });
});

describe('orderedSequence', () => {
  const generate = orderedSequence(CYCLES, TEXTS);

  it('cumple los invariantes con muchas semillas', () => {
    expectAlwaysValid('orderedSequence', generate);
  });

  it('deja siempre visible el primer paso y oculta uno solo', () => {
    for (const seed of SEEDS) {
      const round = generate(seededRng(seed));
      expect(round.prompt.kind).toBe('sequence');
      if (round.prompt.kind !== 'sequence') continue;
      expect(round.prompt.items[0], `semilla ${seed}`).not.toBeNull();
      expect(round.prompt.items.filter((item) => item === null)).toHaveLength(1);
    }
  });

  it('la respuesta correcta es el paso que de verdad falta', () => {
    for (const seed of SEEDS) {
      const round = generate(seededRng(seed));
      const { prompt } = round;
      if (prompt.kind !== 'sequence') continue;
      const gap = prompt.items.findIndex((item) => item === null);
      const shown = prompt.items.filter((item): item is string => item !== null);
      const sequence = CYCLES.find((cycle) =>
        shown.every((emoji) => cycle.some((step) => step.emoji === emoji)),
      )!;
      const start = sequence.findIndex((step) => step.emoji === prompt.items[0]);
      const expected = sequence[start + gap];
      const correct = round.options.find((option) => option.correct)!;
      expect(correct.display).toEqual({ kind: 'emoji', emoji: expected.emoji });
    }
  });

  it('acepta una sola secuencia larga', () => {
    const routine = orderedSequence([CYCLES[2]], TEXTS, { windowLen: 3, optionCount: 3 });
    expectAlwaysValid('orderedSequence (una)', routine, 3);
  });

  it('revienta al construir con una secuencia de un solo paso', () => {
    expect(() => orderedSequence([[{ emoji: '🥚', name: 'huevo' }]], TEXTS)).toThrow(/dos pasos/);
  });
});

describe('numberQuestion', () => {
  const generate = numberQuestion((rng, tier) => {
    const n = 1 + Math.floor(rng() * (5 + tier));
    return {
      question: `¿Cuánto es el doble de ${n}?`,
      spoken: `El doble de ${n}.`,
      prompt: { kind: 'emoji-group', items: Array.from({ length: n }, () => '🍪') },
      answer: n * 2,
      max: 12 + tier * 2,
    };
  });

  it('cumple los invariantes con muchas semillas', () => {
    expectAlwaysValid('numberQuestion', generate);
  });

  it('la opción correcta es la respuesta declarada y las demás no', () => {
    for (const seed of SEEDS) {
      const round = generate(seededRng(seed));
      const expected = round.question.match(/doble de (\d+)/)![1];
      const correct = round.options.find((option) => option.correct)!;
      expect(correct.display).toEqual({ kind: 'text', text: String(Number(expected) * 2) });
    }
  });

  it('mantiene los distractores dentro del rango declarado', () => {
    for (const seed of SEEDS) {
      for (const option of generate(seededRng(seed)).options) {
        if (option.display.kind !== 'text') continue;
        const value = Number(option.display.text);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(12);
      }
    }
  });

  it('propaga el tier al constructor del enunciado', () => {
    const seen = new Set<number>();
    const spy = numberQuestion((_rng, tier) => {
      seen.add(tier);
      return { question: 'q', spoken: 's', prompt: { kind: 'none' }, answer: 4, max: 10 };
    });
    spy(seededRng(1), 2);
    spy(seededRng(1));
    expect([...seen].sort()).toEqual([0, 2]);
  });
});

describe('listenAndPick', () => {
  const relation = {
    targetOf: (word: RhymeWord) => ({ word: word.name, emoji: word.emoji }),
    matchesOf: (word: RhymeWord, pool: readonly RhymeWord[]) =>
      pool.filter((other) => other !== word && other.family === word.family),
    optionOf: (word: RhymeWord) => ({
      label: word.name,
      display: { kind: 'emoji' as const, emoji: word.emoji },
    }),
  };
  const generate = listenAndPick(RHYMES, relation, TEXTS);

  it('cumple los invariantes con muchas semillas', () => {
    expectAlwaysValid('listenAndPick', generate);
  });

  it('la opción correcta cumple la relación y los distractores no', () => {
    for (const seed of SEEDS) {
      const round = generate(seededRng(seed));
      const { prompt } = round;
      expect(prompt.kind).toBe('listen');
      if (prompt.kind !== 'listen') continue;
      const target = RHYMES.find((word) => word.name === prompt.word)!;

      for (const option of round.options) {
        const word = RHYMES.find(
          (w) => option.display.kind === 'emoji' && w.emoji === option.display.emoji,
        )!;
        expect(word.family === target.family, `${word.name} (semilla ${seed})`).toBe(
          option.correct,
        );
      }
    }
  });

  it('nunca ofrece como opción la propia palabra escuchada', () => {
    for (const seed of SEEDS) {
      const round = generate(seededRng(seed));
      const { prompt } = round;
      if (prompt.kind !== 'listen') continue;
      const heard = prompt.emoji;
      expect(
        round.options.some(
          (option) => option.display.kind === 'emoji' && option.display.emoji === heard,
        ),
      ).toBe(false);
    }
  });

  it('revienta al construir si ninguna palabra tiene con quién casar', () => {
    const lonely = RHYMES.filter((word) => word.family === 'ol').slice(0, 1);
    expect(() => listenAndPick(lonely, relation, TEXTS)).toThrow(/pareja/);
  });
});

describe('makeMixGenerator', () => {
  it('remezcla los generadores del pool y propaga el tier', () => {
    const seen = new Set<string>();
    const mix = makeMixGenerator([
      emojiToName(ANIMALS, TEXTS),
      pairMatch(HOMES, TEXTS),
      categoryMember(CLASSES, TEXTS),
    ]);

    for (const seed of SEEDS) {
      const round = mix(seededRng(seed));
      expectValidRound(round, `mix (semilla ${seed})`, 4);
      seen.add(round.prompt.kind);
    }
    // Con doscientas semillas tienen que haber salido varios tipos de prueba.
    expect(seen.size).toBeGreaterThan(1);
  });

  it('avisa si el pool está vacío', () => {
    expect(() => makeMixGenerator([])).toThrow(/al menos un generador/);
  });
});
