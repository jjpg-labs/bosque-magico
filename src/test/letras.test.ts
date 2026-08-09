/**
 * Invariantes propios del mundo «El Claro de las Letras».
 *
 * El barrido genérico de `generators.test.ts` ya comprueba lo estructural (una
 * sola respuesta correcta, ningún dibujo repetido, variedad suficiente y sin
 * repetir ejercicio dentro de una partida) en las once pruebas de este mundo.
 * Aquí solo va lo que ese barrido no puede saber: que la letra, la sílaba o la
 * vocal que se da por buena es **de verdad** la de la palabra.
 *
 * Buena parte son tests de la propia tabla de datos. Son los que más valen a
 * futuro: una palabra nueva mal separada en sílabas o con una terminación que
 * no es la que dice no rompe ningún tipo, y sin estos tests llegaría al juego.
 */

import { describe, expect, it } from 'vitest';
import { seededRng } from '../lib/random';
import { GAMES } from '../lib/games/catalog';
import {
  EVERYDAY_OBJECTS,
  FINAL_LETTERS,
  FINAL_LETTER_WORDS,
  ONE_VOWEL_WORDS,
  SYLLABLE_WORDS,
  WORDS_BY_INITIAL,
} from '../lib/games/data';
import { ALPHABET, initialLetter } from '../lib/games/generators';
import type { Round } from '../lib/games/types';

const SEEDS = Array.from({ length: 200 }, (_, i) => i + 1);

const generatorOf = (id: number) => GAMES.find((game) => game.id === id)!.generate!;
const correctOf = (round: Round) => round.options.find((option) => option.correct)!;

/** El texto de una opción de tipo `text`, para no repetir el estrechamiento. */
function textOf(round: Round): string {
  const display = correctOf(round).display;
  return display.kind === 'text' ? display.text : '';
}

/** La palabra que se locuta en un prompt de escucha. */
function heardWord(round: Round): string {
  return round.prompt.kind === 'listen' ? round.prompt.word : '';
}

function withoutAccents(word: string): string {
  return word.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// --- Las tablas de datos --------------------------------------------------------

describe('FINAL_LETTER_WORDS', () => {
  it('la letra marcada es la última de la palabra', () => {
    for (const entry of FINAL_LETTER_WORDS) {
      const last = withoutAccents(entry.word).toUpperCase().slice(-1);
      expect(entry.last, entry.word).toBe(last);
    }
  });

  it('solo usa terminaciones que se oyen con claridad', () => {
    for (const entry of FINAL_LETTER_WORDS) {
      expect(FINAL_LETTERS, entry.word).toContain(entry.last);
    }
  });
});

describe('SYLLABLE_WORDS', () => {
  it('las sílabas montadas dan exactamente la palabra', () => {
    for (const entry of SYLLABLE_WORDS) {
      expect(entry.syllables.join(''), entry.word).toBe(entry.word);
    }
  });

  it('hay palabras de una a cinco sílabas', () => {
    const lengths = new Set(SYLLABLE_WORDS.map((word) => word.syllables.length));
    expect([...lengths].sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('toda palabra tiene con quién compararse a dos sílabas de distancia', () => {
    // Lo que hace posible «Palabras Largas y Cortas»: si una palabra se quedara
    // sin pareja, el generador reventaría al elegirla como primera.
    for (const entry of SYLLABLE_WORDS) {
      const partners = SYLLABLE_WORDS.filter(
        (other) => Math.abs(other.syllables.length - entry.syllables.length) >= 2,
      );
      expect(partners.length, entry.word).toBeGreaterThan(0);
    }
  });

  it('la palabra con más sílabas es también la más larga escrita', () => {
    // «Más larga» se resuelve dando palmadas, pero quien ya lee cuenta letras.
    // Con dos sílabas de diferencia las dos formas de mirarlo coinciden, y así
    // no hay ninguna pareja en la que las dos respuestas sean defendibles.
    for (const a of SYLLABLE_WORDS) {
      for (const b of SYLLABLE_WORDS) {
        if (a.syllables.length - b.syllables.length < 2) continue;
        expect(a.word.length, `${a.word} / ${b.word}`).toBeGreaterThan(b.word.length);
      }
    }
  });
});

describe('WORDS_BY_INITIAL', () => {
  it('no repite ningún dibujo', () => {
    const emojis = WORDS_BY_INITIAL.map((word) => word.emoji);
    expect(new Set(emojis).size).toBe(emojis.length);
  });

  it('cada sonido tiene al menos dos palabras', () => {
    // Con una sola, esa palabra no podría salir nunca: no tendría pareja.
    const counts = new Map<string, number>();
    for (const word of WORDS_BY_INITIAL) {
      counts.set(word.sound, (counts.get(word.sound) ?? 0) + 1);
    }
    for (const [sound, count] of counts) {
      expect(count, `sonido ${sound}`).toBeGreaterThanOrEqual(2);
    }
  });

  it('no mete letras que suenan igual que otra', () => {
    for (const word of WORDS_BY_INITIAL) {
      // La V suena exactamente igual que la B: «vaca» y «bota» empezarían
      // igual al oído y habría dos respuestas buenas.
      expect(word.word.startsWith('v'), word.word).toBe(false);
      // Y la H no suena: «hormiga» empieza por O para quien escucha.
      expect(word.word.startsWith('h'), word.word).toBe(false);
    }
  });
});

describe('ONE_VOWEL_WORDS', () => {
  it('dentro de cada palabra solo se oye una vocal, y es la marcada', () => {
    for (const entry of ONE_VOWEL_WORDS) {
      const vowels = new Set(withoutAccents(entry.word).toUpperCase().match(/[AEIOU]/g) ?? []);
      expect([...vowels], entry.word).toEqual([entry.vowel]);
    }
  });
});

describe('EVERYDAY_OBJECTS', () => {
  it('no repite ningún dibujo', () => {
    const emojis = EVERYDAY_OBJECTS.map((object) => object.emoji);
    expect(new Set(emojis).size).toBe(emojis.length);
  });

  it('la inicial de cada cosa es una letra que se puede ofrecer', () => {
    for (const object of EVERYDAY_OBJECTS) {
      expect(ALPHABET, object.name).toContain(initialLetter(object.name));
    }
  });

  it('no empieza ninguna por dígrafo', () => {
    // «Chocolate» y «Llave» empiezan por dos letras, y la respuesta es una.
    for (const object of EVERYDAY_OBJECTS) {
      const start = object.name.toLowerCase().slice(0, 2);
      expect(['ch', 'll'], object.name).not.toContain(start);
    }
  });
});

// --- Los generadores ---------------------------------------------------------------

describe('Toca la Letra', () => {
  const generate = generatorOf(20);

  it('la opción correcta es la letra que pide el enunciado', () => {
    for (const seed of SEEDS) {
      const round = generate(seededRng(seed));
      expect(round.question).toBe(`Toca la letra ${textOf(round)}`);
    }
  });
});

describe('Letras Pequeñitas', () => {
  const generate = generatorOf(21);

  it('la minúscula correcta es la de la mayúscula que se enseña', () => {
    for (const seed of SEEDS) {
      const round = generate(seededRng(seed));
      expect(round.prompt.kind).toBe('emoji-single');
      if (round.prompt.kind !== 'emoji-single') continue;
      expect(textOf(round)).toBe(round.prompt.item.toLowerCase());
    }
  });
});

describe('¿Con Qué Letra Acaba?', () => {
  const generate = generatorOf(22);

  it('la letra correcta es la última de la palabra del enunciado', () => {
    for (const seed of SEEDS) {
      const round = generate(seededRng(seed));
      const word = round.question.match(/«(.+)»/)![1];
      const entry = FINAL_LETTER_WORDS.find((candidate) => candidate.word === word)!;
      expect(entry, word).toBeDefined();
      expect(textOf(round)).toBe(entry.last);
    }
  });
});

describe('Cuenta las Palmadas', () => {
  const generate = generatorOf(23);

  it('el número correcto es el de sílabas de la palabra que se escucha', () => {
    for (const seed of SEEDS) {
      for (const tier of [0, 1, 2]) {
        const round = generate(seededRng(seed), tier);
        const entry = SYLLABLE_WORDS.find((word) => word.word === heardWord(round))!;
        expect(entry, heardWord(round)).toBeDefined();
        expect(textOf(round)).toBe(String(entry.syllables.length));
      }
    }
  });

  it('cada nivel sube el techo de sílabas sin bajar el suelo', () => {
    const topOf = (tier: number) =>
      Math.max(
        ...SEEDS.map((seed) => {
          const round = generate(seededRng(seed), tier);
          return SYLLABLE_WORDS.find((word) => word.word === heardWord(round))!.syllables.length;
        }),
      );
    expect(topOf(0)).toBe(3);
    expect(topOf(2)).toBe(5);
  });
});

describe('La Primera Sílaba', () => {
  const generate = generatorOf(24);

  it('la sílaba correcta es con la que empieza la palabra que se escucha', () => {
    for (const seed of SEEDS) {
      const round = generate(seededRng(seed));
      const entry = SYLLABLE_WORDS.find((word) => word.word === heardWord(round))!;
      expect(entry, heardWord(round)).toBeDefined();
      expect(textOf(round)).toBe(entry.syllables[0].toUpperCase());
    }
  });
});

describe('Empiezan Igual', () => {
  const generate = generatorOf(25);

  it('solo la opción correcta empieza con el sonido de la palabra escuchada', () => {
    for (const seed of SEEDS) {
      const round = generate(seededRng(seed));
      const target = WORDS_BY_INITIAL.find((word) => word.word === heardWord(round))!;
      expect(target, heardWord(round)).toBeDefined();

      for (const option of round.options) {
        const entry = WORDS_BY_INITIAL.find((word) => word.word === option.label)!;
        expect(entry, option.label).toBeDefined();
        expect(entry.sound === target.sound, `${target.word} / ${entry.word}`).toBe(option.correct);
      }
    }
  });

  it('nunca se ofrece la propia palabra escuchada como respuesta', () => {
    for (const seed of SEEDS) {
      const round = generate(seededRng(seed));
      expect(round.options.map((option) => option.label)).not.toContain(heardWord(round));
    }
  });
});

describe('La Letra Perdida y El Abecedario en Orden', () => {
  for (const id of [26, 27]) {
    const generate = generatorOf(id);

    it(`deja un solo hueco y nunca el primero (prueba ${id})`, () => {
      for (const seed of SEEDS) {
        const round = generate(seededRng(seed));
        expect(round.prompt.kind).toBe('sequence');
        if (round.prompt.kind !== 'sequence') continue;
        expect(round.prompt.items[0]).not.toBeNull();
        expect(round.prompt.items.filter((item) => item === null)).toHaveLength(1);
      }
    });

    it(`ninguna opción es una letra que ya está a la vista (prueba ${id})`, () => {
      for (const seed of SEEDS) {
        const round = generate(seededRng(seed));
        if (round.prompt.kind !== 'sequence') continue;
        const visible = round.prompt.items.filter((item): item is string => item !== null);
        for (const option of round.options) {
          if (option.correct) continue;
          if (option.display.kind !== 'text') continue;
          // En «La Letra Perdida» la respuesta sí puede repetirse dentro de la
          // palabra (la A de «caracol»); un distractor visible, no: se
          // descartaría sin leer.
          if (id === 26 && visible.includes(option.display.text)) continue;
          expect(visible, option.display.text).not.toContain(option.display.text);
        }
      }
    });
  }

  it('la letra correcta del abecedario es la que va en ese hueco', () => {
    const generate = generatorOf(27);
    for (const seed of SEEDS) {
      const round = generate(seededRng(seed));
      if (round.prompt.kind !== 'sequence') continue;
      const gap = round.prompt.items.findIndex((item) => item === null);
      const before = round.prompt.items[gap - 1] as string;
      const after = round.prompt.items[gap + 1] as string | undefined;
      const answer = textOf(round);
      // Encaja entre sus vecinas: va justo detrás de la anterior y, si hay
      // siguiente, justo delante de ella.
      expect(answer.charCodeAt(0) - before.charCodeAt(0), `${before} ? ${after}`).not.toBe(0);
      expect(round.prompt.items.includes(answer)).toBe(false);
    }
  });
});

describe('Palabras Largas y Cortas', () => {
  const generate = generatorOf(28);

  it('la palabra correcta es de verdad la más larga (o la más corta)', () => {
    for (const seed of SEEDS) {
      const round = generate(seededRng(seed));
      const [first, second] = round.question.match(/: (.+) o (.+)\?$/)!.slice(1);
      const wordsOf = (word: string) => SYLLABLE_WORDS.find((entry) => entry.word === word)!;
      const wantsLongest = round.question.includes('más larga');
      const longer =
        wordsOf(first).syllables.length > wordsOf(second).syllables.length ? first : second;

      expect(correctOf(round).label).toBe(wantsLongest ? longer : longer === first ? second : first);
    }
  });

  it('enfrenta siempre dos palabras y dos opciones', () => {
    for (const seed of SEEDS) {
      const round = generate(seededRng(seed));
      expect(round.options).toHaveLength(2);
    }
  });
});

describe('¿Con Qué Empieza?', () => {
  const generate = generatorOf(29);

  it('la letra correcta es la inicial de la cosa del enunciado', () => {
    for (const seed of SEEDS) {
      const round = generate(seededRng(seed));
      const name = round.question.match(/empieza (.+)\?$/)![1];
      expect(textOf(round)).toBe(initialLetter(name));
    }
  });
});

describe('La Vocal Escondida', () => {
  const generate = generatorOf(30);

  it('la vocal correcta es la que suena dentro de la palabra escuchada', () => {
    for (const seed of SEEDS) {
      const round = generate(seededRng(seed));
      const entry = ONE_VOWEL_WORDS.find((word) => word.word === heardWord(round))!;
      expect(entry, heardWord(round)).toBeDefined();
      expect(textOf(round)).toBe(entry.vowel);
    }
  });

  it('todas las opciones son vocales', () => {
    for (const seed of SEEDS) {
      const round = generate(seededRng(seed));
      for (const option of round.options) {
        expect(option.display.kind === 'text' && /^[AEIOU]$/.test(option.display.text)).toBe(true);
      }
    }
  });
});
