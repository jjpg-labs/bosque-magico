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
`src/lib/games/data.ts`), solo anima a intentarlo otra vez.

La versión original tenía las respuestas fijas en el JSX (siempre la abeja,
siempre cinco mariquitas), así que bastaban dos partidas para memorizar la
posición del botón correcto. La versión actual genera cada pregunta al vuelo
con datos aleatorios pero deterministas, precisamente para que eso no pase:
esta guía existe para que las pruebas nuevas mantengan esa propiedad.

## Mapa de la arquitectura

Todo el contenido del juego vive en `src/lib/games/`:

| Fichero | Qué contiene |
| --- | --- |
| `types.ts` | Los contratos: `Round`, `Option`, `Prompt`, `GameDefinition`, `RoundGenerator`. |
| `data.ts` | Contenido reutilizable — animales, colores, formas, categorías, frases de ánimo — como listas de datos, no de lógica. |
| `generators.ts` | Un generador de rondas por prueba: función pura que arma una pregunta al vuelo. |
| `catalog.ts` | El registro `GAMES` (las pruebas del mapa) y `STICKERS` (su recompensa). |
| `random.ts` | Aleatoriedad **inyectable**: `pick`, `sample`, `shuffle`, `randomInt`, `numericDistractors`, todas reciben un `rng`. |

La pieza clave es `random.ts`: nunca se usa `Math.random()` directamente en
un generador, siempre el `rng` que se recibe como parámetro. Eso es lo que
permite que los tests fijen una semilla (`seededRng(n)`) y reproduzcan
exactamente la misma ronda para comprobarla — si un generador nuevo usa
`Math.random()` a pelo, deja de ser determinista y los tests no lo pueden
verificar.

## Receta paso a paso

1. **Contenido nuevo, si hace falta.** Si la prueba necesita datos que no
   existen todavía (más animales, palabras, categorías...), añádelos a
   `data.ts` siguiendo el estilo de lo que ya hay: emoji + nombre en
   español, mayúscula inicial cuando el nombre es la respuesta (p. ej. las
   letras iniciales), nada que pueda asustar a un niño de 3 años.

2. **El generador.** Escribe `genXxx: RoundGenerator` en `generators.ts`:
   una función pura `(rng, tier?) => Round` que usa los helpers de
   `random.ts` para elegir la respuesta y sus distractores. Debe cumplir
   siempre estos dos invariantes (los comprueba el test genérico, ver más
   abajo):
   - Exactamente una opción con `correct: true`.
   - Ninguna opción repite el contenido visible (`display`) de otra.

   El parámetro `tier` es opcional: solo lo usan las pruebas con rango
   numérico natural (contar, sumar, restar...) para subir la dificultad
   cada 3 partidas — ver `tierFor` en `progress.ts`. Si tu prueba no tiene
   un rango numérico que escalar, simplemente ignóralo.

3. **Registro en el catálogo.** Añade la prueba a `GAMES` en `catalog.ts`:
   `id` correlativo (el siguiente número libre), `title`, `desc`, `icon`
   (un emoji), `cat` (categoría corta), `kind: 'choice'`, `roundsToWin`
   (3 es el estándar de las pruebas normales), y `generate` apuntando a tu
   función. Añade también su pegatina a `STICKERS` con el mismo `gameId`.

4. **Tests.** El barrido genérico en `src/test/generators.test.ts`
   (`allRounds()`) recorre **todas** las pruebas de `GAMES` con 200
   semillas distintas, así que en cuanto tu prueba está registrada queda
   cubierta automáticamente por esas comprobaciones genéricas — no hace
   falta escribir nada nuevo para eso. Añade un test específico solo si tu
   prueba tiene un invariante propio que esas comprobaciones genéricas no
   capturan (por ejemplo: que una suma cuadre con los elementos dibujados,
   como hace el test de `genAdd`). En ese caso, sigue el patrón de los
   `describe` ya existentes en ese fichero.

5. **README.** Añade la fila correspondiente a la tabla de pruebas en
   `README.md`.

6. **Verificación local antes de dar la tarea por terminada:**

   ```bash
   npm run lint && npm run typecheck && npm test && npm run build
   ```

   Si algo de esto falla, la tarea no está terminada — arréglalo antes de
   proponer el cambio. (Esto mismo lo vuelve a comprobar el CI en cada PR:
   `.github/workflows/ci.yml`, así que es una red de seguridad, no la
   única.)

## Ejemplo completo: `genColors`

La prueba más corta y clara del catálogo, como plantilla de referencia
(`src/lib/games/generators.ts`):

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

Y su registro correspondiente en `catalog.ts`:

```ts
{
  id: 14,
  title: 'Colores del Bosque',
  desc: 'Descubre y toca cada color',
  icon: '🎨',
  cat: 'Colores',
  kind: 'choice',
  roundsToWin: 3,
  generate: genColors,
},
```

## Qué NO hacer

- No metas contenido ni lógica de preguntas en `src/components/`: los datos
  van en `data.ts`/`generators.ts`, la interfaz ya sabe pintar cualquier
  `Round` bien formado.
- No uses `Math.random()` directamente — rompe la reproducibilidad de los
  tests.
- No añadas dependencias nuevas sin un motivo claro: el proyecto presume de
  no tener servidor ni llamadas externas (ver `PRIVACIDAD.md`).
- No cambies el tono: siempre en español, siempre amable, nunca un mensaje
  que pueda inquietar a un niño de 3-4 años.
