# Cómo añadir una prueba nueva

Esta es la guía de referencia — para humanos y para asistentes de IA (Claude,
Gemini o cualquier otro) — para añadir una prueba nueva a **El Bosque Mágico
de los Bichitos** sin romper nada. Es la única fuente de esta receta: los
ficheros `CLAUDE.md`, `GEMINI.md` y los comandos/skills del proyecto la
referencian en vez de repetirla, así que si algo cambia aquí, cambia en todas
partes a la vez.

## Qué es este proyecto

Juego educativo en español para peques de 3 a 6 años (letras, números,
formas, lógica...), repartido en pruebas con pegatinas de premio. Es una PWA
estática: sin servidor, sin cuentas, sin recogida de datos — ver
[`PRIVACIDAD.md`](../PRIVACIDAD.md). El tono es siempre amable: un fallo
nunca se penaliza ni se reprende (ver `ENCOURAGEMENTS` y `PRAISES` en
`src/lib/games/data/comun.ts`), solo anima a intentarlo otra vez.

La versión original tenía las respuestas fijas en el JSX (siempre la abeja,
siempre cinco mariquitas), así que bastaban dos partidas para memorizar la
posición del botón correcto. La versión actual genera cada pregunta al vuelo
con datos aleatorios pero deterministas, precisamente para que eso no pase:
esta guía existe para que las pruebas nuevas mantengan esa propiedad.

## Los mundos

Cada prueba pertenece a un **mundo**, y el mapa se navega en dos niveles:
tarjetas de mundo → pruebas de ese mundo. Un mundo se abre según su
condición (`WORLDS` en `src/lib/games/catalog/worlds.ts`) y, dentro de un
mundo, las pruebas se abren en orden de id.

| Mundo | Nombre | Se abre al… |
| --- | --- | --- |
| `letras` | El Claro de las Letras 🔤 | siempre abierto |
| `numeros` | El Río de los Números 🔢 | siempre abierto |
| `cuentas` | La Cueva de las Cuentas ➕ | 3 pruebas de `numeros` |
| `formas` | La Montaña de las Formas 🔷 | siempre abierto |
| `logica` | El Laberinto de la Lógica 🧩 | 3 pruebas de `formas` |
| `medidas` | El Prado de las Medidas 📏 | 3 pruebas de `numeros` |
| `natura` | El Bosque de los Animales 🦊 | siempre abierto |
| `cuerpo` | La Casa de los Peques 🧒 | 3 pruebas de `natura` |
| `emociones` | La Plaza de las Emociones 💛 | siempre abierto |
| `oficios` | La Ciudad de los Oficios 🚂 | 3 pruebas de `cuerpo` |
| `especial` | La Torre del Trofeo 🏆 | 20 pruebas en total |

Los requisitos se recortan a las pruebas que existen de verdad, así que un
mundo a medio llenar nunca queda cerrado por su propia condición.

## Mapa de la arquitectura

Todo el contenido vive en `src/lib/games/`, **troceado por mundo** para que
varias personas (o agentes) puedan escribir contenido a la vez sin pisarse:

```
src/lib/games/
├── types.ts                 Los contratos: Round, Option, Prompt,
│                            GameDefinition, RoundGenerator, World, Sticker.
├── data/
│   ├── index.ts             Barril: una línea por mundo.
│   ├── comun.ts             Contenido compartido (CRITTERS, COUNTABLES,
│   │                        ENCOURAGEMENTS, PRAISES).
│   └── <mundo>.ts           Las tablas de datos de ese mundo.
├── generators/
│   ├── index.ts             Barril: una línea por mundo.
│   ├── factories.ts         Las 8 fábricas. ⚠️ API congelada.
│   ├── options.ts           buildOptions, textOption, numberOptions.
│   ├── rounds.ts            generateRounds y el dedupe por ejercicio.
│   └── <mundo>.ts           Los generadores de ese mundo.
└── catalog/
    ├── index.ts             Compone GAMES y STICKERS; nextGameId,
    │                        gamesOfWorld, stickerStyle…
    ├── worlds.ts            La tabla WORLDS.
    ├── especial.ts          La prueba de remezcla (se deriva del catálogo).
    └── <mundo>.ts           <MUNDO>_GAMES y <MUNDO>_STICKERS.
```

Y fuera de `games/`: `src/lib/random.ts`, la aleatoriedad **inyectable**
(`pick`, `sample`, `shuffle`, `randomInt`, `numericDistractors`, todas
reciben un `rng`), y `src/lib/progress.ts`, el progreso y el desbloqueo.

La pieza clave es `random.ts`: nunca se usa `Math.random()` directamente en
un generador, siempre el `rng` que se recibe como parámetro. Eso es lo que
permite que los tests fijen una semilla (`seededRng(n)`) y reproduzcan
exactamente la misma ronda para comprobarla — si un generador nuevo usa
`Math.random()` a pelo, deja de ser determinista y los tests no lo pueden
verificar.

Los barriles reexportan exactamente los mismos nombres que exportaban los
antiguos ficheros únicos, así que `import { ... } from '../lib/games/data'`
sigue funcionando igual.

## Las fábricas: el camino por defecto

**Antes de escribir un generador a mano, mira si alguna fábrica sirve.** Las
ocho de `generators/factories.ts` garantizan por construcción los dos
invariantes que exige el test genérico (una sola opción correcta, ningún
`display` repetido) y validan la tabla de datos al cargar el módulo, así que
una tabla mal formada revienta en el primer test y no jugando.

Contrato común:

```ts
interface Item { emoji: string; name: string }
interface Category { name: string; article: 'un' | 'una'; items: readonly Item[] }
interface Texts<T> { question: (subject: T) => string; spoken: (subject: T) => string }
interface ChoiceOptions { optionCount?: number }   // por defecto 4
```

| Fábrica | Firma | Para qué |
| --- | --- | --- |
| `emojiToName` | `(pool: Item[], texts: Texts<Item>, opts?) => RoundGenerator` | Se ve un dibujo, se elige su nombre. También clasificar: varios ítems comparten `name` y la fábrica agrupa por él. |
| `nameToEmoji` | `(pool: Item[], texts: Texts<Item>, opts?: { as?: 'emoji' \| 'text' }) => RoundGenerator` | El enunciado lo nombra y hay que tocarlo. Con `as: 'text'` las opciones son palabras o letras. |
| `pairMatch` | `(pairs: Pair[], texts: Texts<Pair>, opts?) => RoundGenerator` | Emparejar: el animal y su casa, la herramienta y su oficio. `Pair = { from: Item; to: Item }`. |
| `categoryMember` | `(cats: Category[], texts: Texts<CategoryPick>, opts?) => RoundGenerator` | «¿Cuál es una fruta?». Un acierto y tres de categorías distintas entre sí. |
| `oddOneOut` | `(cats: Category[], texts: Texts<OddOnePick>, opts?) => RoundGenerator` | El intruso: tres de una clase y uno de otra. |
| `orderedSequence` | `(sequences: Item[][], texts: Texts<SequencePick>, opts?: { windowLen?: number }) => RoundGenerator` | Una fila en orden con un hueco. Se pasa una **lista** de secuencias; para una sola, `[PASOS]`. |
| `numberQuestion` | `(build: (rng, tier) => NumberSpec, opts?) => RoundGenerator` | Cualquier respuesta numérica. Es la única que recibe el `tier`. |
| `listenAndPick` | `(pool: T[], relation: ListenRelation<T>, texts: Texts<ListenPick<T>>, opts?) => RoundGenerator` | Se escucha una palabra y se toca la que rima / empieza igual / tiene esa vocal. |

Los tipos de apoyo (`Pair`, `CategoryPick`, `OddOnePick`, `SequencePick`,
`NumberSpec`, `ListenRelation`, `ListenPick`) se exportan desde el mismo
sitio, y cada fábrica lleva un ejemplo de uso en su comentario.

Además, `distinctDistractors(rng, pool, keyOf, exclude, count)` está
disponible por si escribes un generador a mano: es lo que garantiza que no se
repita el contenido visible de dos opciones.

⚠️ **`factories.ts` está congelado.** Si tu prueba necesita una fábrica que
no existe, escríbela en tu propio `generators/<mundo>.ts`; ya se promocionará
más tarde, en un cambio aparte.

## Receta paso a paso

1. **Elige mundo e id.** El mundo decide dónde sale en el mapa y de qué color
   es su pegatina. El id es el siguiente libre del rango de ese mundo. **Un
   id no se reasigna jamás**: el progreso guardado se valida contra los ids
   reales, así que reutilizar uno le cambiaría de prueba una pegatina ya
   ganada. Los huecos son seguros; retirar ids, no.

2. **Contenido nuevo, si hace falta**, en `data/<mundo>.ts` (créalo si no
   existe y añade su línea a `data/index.ts`). Sigue el estilo de lo que ya
   hay: emoji + nombre en español, mayúscula inicial cuando el nombre es la
   respuesta, nada que pueda asustar a un niño de 3 años. Reglas duras:
   - **Español de España**: coche, zumo, patata, ordenador, cole.
   - **Respuesta única e inequívoca.** Comprueba a mano que ningún distractor
     podría defenderse. Trampas típicas: 🍎 es rojo *y* verde; el tomate es
     fruta botánicamente; la rana vive en el estanque *y* en tierra; 🍕 es
     triángulo *y* sector circular.
   - **Emoji de Unicode ≤ 12.0** salvo excepción justificada (los de 14.0+
     salen como caja en Android 10 y anteriores), y que se distinga a 32 px.

3. **El generador**, en `generators/<mundo>.ts` (y su línea en
   `generators/index.ts`). Lo normal es una llamada a una fábrica. Si la
   escribes a mano, es una función pura `(rng, tier?) => Round` que debe
   cumplir los dos invariantes: exactamente una opción con `correct: true` y
   ningún `display` repetido.

   El parámetro `tier` (0 a 3, sube cada 3 partidas — ver `tierFor` en
   `progress.ts`) es la dificultad. **Las fábricas ya lo usan solas**: sin
   `optionCount` explícito, una ronda pasa de cuatro opciones a cinco y seis
   según sube el nivel, así que una prueba de fábrica escala sin que hagas
   nada. Si escribes el generador a mano y tiene un rango numérico que
   estirar (contar, sumar...), úsalo; si no, puedes ignorarlo.

   Fija `optionCount` solo cuando la prueba tenga un número cerrado de
   respuestas posibles —«¿por tierra, mar o aire?» son tres y punto—: un
   `optionCount` explícito no crece con el nivel.

4. **Registro en el catálogo**, en `catalog/<mundo>.ts`: añade la
   `GameDefinition` a `<MUNDO>_GAMES` (`id`, `title`, `desc`, `icon`, `cat`
   de 11 caracteres como mucho, `world`, `kind`, `roundsToWin` — 3 es el
   estándar — y `generate`) y su pegatina a `<MUNDO>_STICKERS`
   (`gameId`, `name`, `icon`). **No pongas `bg` ni `color`**: se heredan del
   mundo. Si el mundo es nuevo, añade sus dos líneas a `catalog/index.ts`.

   Hay tres `kind`: `'choice'` (lo normal), `'memory'` (parejas; lleva
   `pairCount` y opcionalmente `pairPool` con la baraja) y `'marathon'`
   (rondas sin fin). Y para las pruebas que remezclan el catálogo,
   `generateFor(completedIds)` en vez de `generate`: recibe lo ya superado y
   devuelve el generador. Manda sobre `generate` si están los dos.

5. **Tests.** El barrido genérico de `src/test/generators.test.ts`
   (`ALL_ROUNDS`) recorre **todas** las pruebas de `GAMES` con 200 semillas,
   así que en cuanto tu prueba está registrada queda cubierta: una sola
   respuesta correcta, sin `display` repetidos, sin repetir ejercicio dentro
   de una partida y con variedad suficiente para no memorizarse. No hace
   falta escribir nada para eso.

   ⚠️ El mínimo de variedad es `max(8, 4 × roundsToWin)` ejercicios distintos,
   y **`VARIETY_DEBT` está vacío: ninguna prueba está exenta**. Si la tuya no
   llega, la solución es ampliar el pool o darle un segundo modo de preguntar
   —«Formas Geométricas» alterna tocar la figura con nombrarla, y «Colores»
   con «¿de qué color es el plátano?»—, nunca añadir tu id a la lista.

   Añade un test específico solo si tu prueba tiene un invariante propio que
   el barrido no captura (que una suma cuadre con los elementos dibujados,
   que el sonido locutado sea el del animal correcto...). Si has escrito una
   tabla de pares o de categorías, el mejor test es el de la propia tabla:
   «ningún emoji aparece en dos categorías», «ningún `from` tiene dos
   respuestas» — aunque las fábricas ya lo comprueban al construirse.

6. **README.** La tabla de pruebas es **por mundo**: normalmente basta con
   añadir el id a la celda de tu mundo.

7. **Verificación local antes de dar la tarea por terminada:**

   ```bash
   npm run lint && npm run typecheck && npm test && npm run build
   ```

   Si algo de esto falla, la tarea no está terminada — arréglalo antes de
   proponer el cambio. (Esto mismo lo vuelve a comprobar el CI en cada PR:
   `.github/workflows/ci.yml`, así que es una red de seguridad, no la
   única.) Comprueba también en `npm run dev` que se ve bien **a 360 px de
   ancho**.

## Ejemplo completo con fábrica

Una prueba de «¿dónde vive cada animal?», que es el caso más típico.

```ts
// src/lib/games/data/natura.ts
import type { Pair } from '../generators';

export const HABITATS: readonly Pair[] = [
  { from: { emoji: '🐟', name: 'el pez' }, to: { emoji: '🌊', name: 'el mar' } },
  { from: { emoji: '🐒', name: 'el mono' }, to: { emoji: '🌴', name: 'la selva' } },
  { from: { emoji: '🐄', name: 'la vaca' }, to: { emoji: '🏠', name: 'la granja' } },
  // ...animales monohábitat: nada de ranas ni tortugas, que viven en dos sitios.
];
```

```ts
// src/lib/games/generators/natura.ts
import { pairMatch } from './factories';
import { HABITATS } from '../data';
import type { RoundGenerator } from '../types';

export const genHabitats: RoundGenerator = pairMatch(HABITATS, {
  question: (pair) => `¿Dónde vive ${pair.from.name}?`,
  spoken: (pair) => `Mira el animal. ¿Dónde vive ${pair.from.name}?`,
});
```

```ts
// src/lib/games/catalog/natura.ts
{
  id: 74,
  title: '¿Dónde Vive?',
  desc: 'Cada animal tiene su casa',
  icon: '🏡',
  cat: 'Animales',
  world: 'natura',
  kind: 'choice',
  roundsToWin: 3,
  generate: genHabitats,
},
// y en NATURA_STICKERS:
{ gameId: 74, name: 'Topo Excavador', icon: '🦫' },
```

Eso es todo: la fábrica pone el enunciado visual, baraja las opciones, elige
tres distractores que no se repiten y garantiza que solo hay una respuesta.

## Ejemplo de generador a mano

Cuando ninguna fábrica encaja. `genColors` es el más corto del catálogo
(`src/lib/games/generators/formas.ts`):

```ts
export const genColors: RoundGenerator = (rng) => {
  // 1. Elige la respuesta correcta al azar entre los colores.
  const answer = pick(rng, COLORS);
  // 2. Elige 3 distractores distintos de la respuesta (nunca el mismo color dos veces).
  const others = sample(
    rng,
    COLORS.filter((c) => c.name !== answer.name),
    3,
  );

  return {
    question: `Toca el color ${answer.name}`,
    spoken: `Busca el color ${answer.name} y tócalo.`,
    prompt: { kind: 'none' },
    // buildOptions baraja las 4 opciones y les da ids estables.
    options: buildOptions(rng, [
      { label: answer.name, display: { kind: 'emoji', emoji: answer.emoji }, correct: true },
      ...others.map((c) => ({
        label: c.name,
        display: { kind: 'emoji' as const, emoji: c.emoji },
        correct: false,
      })),
    ]),
  };
};
```

## La voz

Todos los enunciados se leen en voz alta, y eso impone reglas al contenido:

- **Nunca emojis en `spoken`**: el lector los verbaliza («cara sonriente»).
- **Nunca abreviaturas ni símbolos** (`1º`, `+`, `%`): escribe «primero»,
  «más». «3-6» se lee como un guion: escribe «del tres al seis».
- Menos de **15 palabras**: a `rate: 0.85` una frase larga tarda 5 segundos y
  la niña toca antes de que acabe.
- `desc` se lee entero al pulsar 🔊: una línea corta.

## Qué NO hacer

- No metas contenido ni lógica de preguntas en `src/components/`: los datos
  van en `data/<mundo>.ts`, los generadores en `generators/<mundo>.ts`, y la
  interfaz ya sabe pintar cualquier `Round` bien formado.
- No uses `Math.random()` directamente — rompe la reproducibilidad de los
  tests.
- No reasignes un id ya usado ni retires una prueba: el progreso guardado se
  valida contra los ids reales y se perderían pegatinas ganadas.
- No escribas `bg` ni `color` en una pegatina nueva: se heredan del mundo.
- No añadas tu prueba a `VARIETY_DEBT`: está vacío a propósito.
- Si añades un `Prompt.kind` o un `display.kind` nuevo, el guard `unhandled`
  (`src/lib/exhaustive.ts`) te obliga a pintarlo en los **tres** sitios:
  `PromptView`, `OptionButton` y las fichas imprimibles. Es error de
  compilación, no un fallo mudo, pero conviene saberlo antes de empezar: un
  `kind` nuevo cuesta bastante más que una tabla de datos.
- No toques `factories.ts` para añadir una fábrica nueva: va en tu
  `generators/<mundo>.ts`.
- No añadas dependencias nuevas: el proyecto presume de no tener servidor ni
  llamadas externas (ver `PRIVACIDAD.md`).
- No cambies el tono: siempre en español, siempre amable, nunca un mensaje
  que pueda inquietar a un niño de 3-4 años.
