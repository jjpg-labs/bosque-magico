# Plan: de 19 a ~100 pruebas en El Bosque Mágico de los Bichitos

Documento de diseño e implementación. Escrito para que otro agente lo ejecute
sin volver a investigar el código. Todas las referencias son
`fichero:línea` sobre el estado del repo en la rama `docs/ia-guias-contenido`
(commit `2275d1b`).

**Problema a resolver:** la niña se pasa el juego entero demasiado rápido.
**Objetivo del usuario:** ~100 pruebas por fases, priorizando que la primera
pasada tenga mucho más contenido cuanto antes.

---

## 1. Diagnóstico de capacidad actual

### 1.1 Cuánto dura hoy la "primera pasada"

| Concepto | Valor |
| --- | --- |
| Pruebas en `GAMES` | 19 (18 de tipo `choice` + 1 `memory`) |
| Rondas de la primera pasada | **56 rondas** (17 pruebas × 3 + prueba 13 × 5) + 1 tablero de memoria (4 parejas) |
| Duración estimada | **10-20 minutos** (≈12 s/ronda: 1,1 s de `ADVANCE_DELAY_MS` en `ChoiceGame.tsx:13`, 3-5 s de locución a `rate: 0.85` en `speech.ts:72`, más el tiempo de pensar) |

Eso es el techo real: **la app entera se termina en una tarde**. No es un
problema de dificultad, es un problema de volumen.

### 1.2 Variedad real por generador (medido, no estimado)

Medición empírica: 30.000 semillas distintas por generador, contando
**ejercicios distintos** = tupla `(question, prompt, display de la opción
correcta)`. Es decir, cuántos problemas realmente diferentes puede plantear
la prueba, ignorando qué distractores le tocan al lado.

También se midió el **% de sesiones (de `roundsToWin` rondas) en las que se
repite el mismo ejercicio**, sobre 5.000 sesiones.

| id | Prueba | Ejercicios distintos (tier 0) | Sesiones con ejercicio repetido | Usa `tier` |
| --- | --- | ---: | ---: | :---: |
| 5 | Formas Geométricas | **6** | 0,0 % | no |
| 16 | ¿Cómo Se Siente? | **6** | **43,2 %** | no |
| 14 | Colores del Bosque | **9** | 0,0 % | no |
| 15 | ¿Quién Hace Este Sonido? | **10** | **27,8 %** | no |
| 19 | La Rutina del Día | **12** | **24,0 %** | no |
| 12 | Empareja las Formas | 14 | 0,0 % | no |
| 3 | La Suma de las Manzanas | 16 (t1: 25, t2: 36) | 0,0 % | **sí** |
| 18 | Grande y Pequeño | 24 | 7,7 % | no |
| 11 | Sonidos e Iniciales | 25 | 0,0 % | no |
| 1 | Letras Iniciales | 30 | 0,0 % | no |
| 10 | El Tren de los Números | 32 (t2: 44) | 8,8 % | **sí** |
| 17 | Rimas Divertidas | 34 | 0,0 % | no |
| 4 | La Resta del Monito | 44 (t1: 65, t2: 90) | 0,0 % | **sí** |
| 7 | El Intruso | 48 | 6,1 % | no |
| 2 | Cuenta los Bichitos | 96 (t2: 168) | 2,8 % | **sí** |
| 9 | ¿Dónde hay MÁS? | 144 (t2: 240) | 1,8 % | **sí** |
| 6 | Patrones Divertidos | 3.903 | 0,4 % | no |
| 13 | El Gran Desafío Final | 1.311 (remezcla de los demás) | 0,0 % | **no** (bug, ver 2.7) |
| 8 | Memoria de Bichos | 4 parejas de 30 bichos → C(30,4)=27.405 tableros | — | no |

**Total del catálogo ≈ 4.450 ejercicios distintos**, pero **3.903 son de
Patrones**, y esos son perceptualmente casi idénticos entre sí (cambia qué
tres emojis se repiten). Descontándolos, **el juego entero contiene unos
550 ejercicios realmente distintos**.

Dónde se agota antes la variedad, por orden: **16 (Emociones, 6), 5 (Formas,
6), 14 (Colores, 9), 15 (Sonidos, 10), 19 (Rutina, 12)**. Las cinco están
limitadas por el tamaño del pool de datos, no por el generador: `EMOTIONS`
tiene 6 entradas (`data.ts:157-164`), `SHAPES` 6 (`data.ts:90-97`), `COLORS`
9 (`data.ts:130-140`), `ANIMAL_SOUNDS` 10 (`data.ts:143-154`),
`ROUTINE_STEPS` 7 (`data.ts:205-213`).

### 1.3 Generadores que usan `tier`

- **Lo usan (5):** `genCount` (`generators.ts:97`), `genAdd` (`:111`),
  `genSub` (`:133`), `genMoreLess` (`:219`), `genNumberSequence` (`:256`).
- **Lo ignoran (13):** `genLetters`, `genShapes`, `genPatterns`, `genOddOne`,
  `genPhonics`, `genShapeMatch`, `genColors`, `genAnimalSound`, `genEmotion`,
  `genRhyme`, `genSize`, `genRoutine`, `genFinalChallenge`.

`tierFor` (`progress.ts:99-102`) topa en **2**, y sube cada 3 partidas. Con
`tier: 2` la suma llega a 36 ejercicios distintos y contar a 168. El techo
de dificultad se alcanza en 6 partidas por prueba.

### 1.4 Bugs de contenido detectados de paso

1. **`RHYME_FAMILIES` enseña una rima falsa** (`data.ts:193-197`): `lápiz`
   está en la misma familia que `nariz` y `maíz`. `nariz`/`maíz` son agudas
   en `-íz`; `lápiz` es llana en `-ápiz`. No riman. Hay que sacar `lápiz`
   (sustituto válido: `perdiz` 🐦, `raíz` 🌱, `feliz` 😀).
2. **Emoji que no corresponde a la palabra** (`data.ts:52`):
   `{ emoji: '🏠', name: 'Iglú' }` — 🏠 es una casa. Cambiar a 🧊 o quitar
   "Iglú" del pool.
3. **`ALPHABET` (`generators.ts:31`) no incluye `Ñ Q W X Y Z`.** Al añadir
   pools de objetos con "Queso", "Zapato", "Yogur", la letra correcta no
   estaría en el alfabeto de distractores → el test genérico no lo detecta,
   pero la prueba quedaría rara. Hay que ampliarlo (o filtrar los pools).
4. **`🪻` (`data.ts:122`) es Emoji 14.0 (2021)**: no se pinta en Android
   antiguos, sale como caja. Ver la regla de emoji en §4.1.

---

## 2. Blockers estructurales para escalar a ~100 pruebas

### 2.1 Desbloqueo lineal — `progress.ts:120-122` (BLOCKER duro)

```ts
export function isUnlocked(progress: Progress, gameId: number): boolean {
  return gameId === 1 || progress.completed.includes(gameId - 1);
}
```

Una cadena de 100 eslabones significa que si la prueba 37 no le gusta (o le
sale mal ese día), **las 63 siguientes son inalcanzables**. Con 19 pruebas
ya es discutible; con 100 es inaceptable. Es el blocker número uno: sin
resolverlo, el contenido nuevo simplemente no se puede alcanzar.

Además el desbloqueo depende de que los ids sean **consecutivos**, lo que
impide reservar rangos de id por fase (ver 2.4).

Tests que cambian: `progress.test.ts:19-29`.

### 2.2 `GameMap.tsx` con 100 nodos

`GameMap.tsx:33-97` pinta `GAMES.map(...)` en una rejilla plana
`grid-cols-2 sm:grid-cols-3 md:grid-cols-4`.

- **Rendimiento: no es problema.** 100 botones ≈ 600 nodos DOM; React 19 lo
  renderiza sin despeinarse. No hace falta virtualización.
- **UX: sí es problema.** En móvil (2 columnas) son **50 filas de scroll**.
  Encontrar "la de los animales" es imposible para alguien que no lee.
- `GameMap.tsx:27` dice literalmente «Completa las {GAMES.length} pruebas»
  → «Completa las 100 pruebas» es desmotivador, no motivador.
- No hay agrupación, ni filtro, ni "seguir por donde iba".

**Solución:** agrupar por mundos (§3.C). El mapa pasa a mostrar 10-11
tarjetas de mundo; al tocar una se ven sus ~10 pruebas. Se navega en dos
niveles, cada pantalla cabe sin scroll infinito.

### 2.3 `STICKERS`: 100 pegatinas — `catalog.ts:233-271`

Hoy cada pegatina lleva `name`, `icon`, `bg` y `color` escritos a mano y
únicos. Con 100:

- Se agotan los emojis de bichito distinguibles y los pares
  `bg-*-100`/`text-*-600` de Tailwind sin repetir.
- El álbum (`StickerAlbum.tsx:35-55`) es otra rejilla plana de 100 celdas.
- `App.tsx:130` muestra `Álbum ({unlockedCount}/{TOTAL_GAMES})` — acopla el
  contador de pegatinas al número de pruebas.

**Recomendación (intermedia, no quitar el coleccionable):** mantener **una
pegatina por prueba** (el aliciente de coleccionar es la mitad de la
motivación a esta edad) pero:

- Reducir `Sticker` a `{ gameId, name, icon }`. Los colores (`bg`, `color`)
  se **derivan del mundo** al que pertenece la prueba, no se escriben a mano.
  El tipo mantiene `bg`/`color` como opcionales para no tocar las 19 actuales.
- El álbum se agrupa por mundo, con una barra de progreso por mundo y una
  **medalla de mundo** (10 medallas grandes) que se gana al completar el
  mundo entero. Eso da un objetivo intermedio real.
- `App.tsx:130` pasa a `STICKERS.length`, no `TOTAL_GAMES`.

### 2.4 `sanitize` / `sanitizePlayCounts` acotados por `TOTAL_GAMES` (BLOCKER de datos)

```ts
// progress.ts:26-32
id >= 1 && id <= TOTAL_GAMES
// progress.ts:34-44
id >= 1 && id <= TOTAL_GAMES && typeof value === 'number' && value >= 0
```

`TOTAL_GAMES = GAMES.length` (`catalog.ts:217`). Hoy funciona por accidente:
los ids son 1..19 y hay 19 pruebas.

**Riesgo concreto:** en cuanto se reserven rangos de id por fase (p. ej. la
fase de formas ocupa 48-56 pero se implementa la última), habrá **ids
mayores que `GAMES.length`**. `sanitize` los descarta **silenciosamente**
→ la niña pierde pruebas superadas y pegatinas ganadas al recargar. Es
pérdida de datos silenciosa, y es irrecuperable.

**Arreglo obligatorio y previo a todo lo demás** (`progress.ts`):

```ts
import { GAME_IDS } from './games/catalog';   // new Set(GAMES.map(g => g.id))
// sanitize:            GAME_IDS.has(id)
// sanitizePlayCounts:  GAME_IDS.has(id)
```

Nota adicional: sanear contra los ids *actuales* también borra el progreso
si algún día se **retira** una prueba. Es aceptable (y ya es el
comportamiento actual), pero conviene no retirar ids nunca; solo añadir.

**Compatibilidad con el progreso ya guardado:** `STORAGE_KEY =
'bosque_magico_progress_v2'`. Nada de lo propuesto cambia el formato
(`{version, completed, playCounts}`), así que el progreso de la niña
sobrevive intacto siempre que:
- los ids 1..19 **no se reasignen jamás** a otras pruebas;
- las migraciones sigan siendo aditivas (como se hizo con `playCounts`,
  `progress.ts:54-57`);
- no se suba `STORAGE_KEY` a v3 sin migración.

### 2.5 Otros puntos que asumen ids contiguos

| Sitio | Código | Qué rompe con huecos de id |
| --- | --- | --- |
| `App.tsx:168` | `if (currentGame.id < TOTAL_GAMES) handleSelectGame(currentGame.id + 1)` | «Siguiente» salta a un id inexistente → `findGame` devuelve `undefined` → pantalla en blanco (`App.tsx:159` no renderiza nada) |
| `GameContainer.tsx:32` | `const isLastGame = game.id >= TOTAL_GAMES` | El botón dice «Siguiente» en la última, o «Volver al mapa» a mitad |
| `progress.test.ts:108-113` | espera que el id 99 se descarte | Con 100 pruebas, 99 pasa a ser válido; el test hay que cambiarlo |

**Arreglo:** `nextGameId(currentId)` en `catalog.ts` = el siguiente id del
**mismo mundo**, y si no hay, el primero del mundo siguiente; `undefined` si
es la última del catálogo.

### 2.6 Tests: barrido de 200 semillas (NO es blocker, pero hay que tocarlo)

Medido en esta máquina:

| Métrica | Hoy (18 choice) | Proyección (99 choice × 3 rondas) |
| --- | --- | --- |
| Coste por ronda generada | 4,40 µs | igual |
| `allRounds()` × 6 llamadas | 67.200 rondas / **296 ms** | 356.400 rondas / **≈1,6 s** |
| Memoria de un `allRounds()` | 11.200 rondas / 5,0 MB (446 B/ronda) | 59.400 rondas / **≈26 MB** |
| `generators.test.ts` completo | 1,13 s | **≈2,5-3 s** |
| `npm test` completo | 3,17 s | **≈5 s** |

**Conclusión honesta: el barrido de 200 semillas aguanta 100 pruebas sin
cambiar de estrategia.** Aun así, dos mejoras baratas y una adición valiosa:

1. **`allRounds()` se recalcula 6 veces** (`generators.test.ts:13-17`, usado
   en `:40, :47, :54, :61, :67`). Hoistearlo a una constante de módulo
   (`const ALL_ROUNDS = allRounds();`) ahorra el 83 % del coste: de 1,6 s a
   0,27 s con 100 pruebas.
2. Si aun así molesta, bajar `SEEDS` a 80 en el barrido genérico y dejar 200
   en los `describe` específicos. No es necesario todavía.
3. **Test nuevo de capacidad mínima** (esto es lo importante): un barrido que
   afirme que **ninguna prueba nueva produce menos de N ejercicios
   distintos**. Codifica el diagnóstico de §1.2 para que nadie vuelva a
   publicar una prueba de 6 ejercicios:

   ```ts
   // Deuda conocida: pruebas antiguas con pool corto (se arreglan en la fase 7).
   const VARIETY_DEBT = new Set([5, 12, 14, 15, 16, 19]);
   it('cada prueba produce variedad suficiente', () => {
     for (const game of CHOICE_GAMES) {
       if (VARIETY_DEBT.has(game.id)) continue;
       const cores = new Set(
         Array.from({ length: 800 }, (_, s) => coreOf(game.generate!(seededRng(s + 1), 0))),
       );
       expect(cores.size, game.title).toBeGreaterThanOrEqual(Math.max(8, 4 * game.roundsToWin));
     }
   });
   ```

   donde `coreOf(round)` = `question + JSON(prompt) + JSON(display de la
   correcta)`. Al vaciar `VARIETY_DEBT` en la fase 7 el test protege todo.

4. Tests con el número 19 **quemado a fuego** que hay que actualizar en cada
   fase: `generators.test.ts:31-33` (`toHaveLength(19)`),
   `app.test.tsx:73-77` (`toHaveLength(19)`), `app.test.tsx:82` (`Álbum
   (0/19)`), `app.test.tsx:95` (`Álbum (2/19)`).
   **Recomendación:** sustituirlos por `GAMES.length` / `STICKERS.length`
   para que dejen de ser un peaje en cada PR. Lo único que merece un número
   literal es un test de "no se ha borrado medio catálogo por accidente":
   `expect(GAMES.length).toBeGreaterThanOrEqual(19)`.

### 2.7 Tipos `Prompt` y `Option['display']`: qué es barato y qué no

**Estado actual** (`types.ts:6-31`):

| `Prompt.kind` | ¿Usado por algún generador? | Renderizado en |
| --- | --- | --- |
| `none` | sí (5 pruebas) | `PromptView.tsx:24` |
| `emoji-single` | sí (3) | `:27` |
| `emoji-group` | sí (1) | `:34` |
| `equation` | sí (2) | `:41` |
| `sequence` | sí (2) | `:52` |
| `number-sequence` | sí (1) | `:72` |
| `two-groups` | **NO — código muerto** | `:91` |
| `shape` | **NO — código muerto** | `:99` |
| `listen` | sí (2) | `:106` |

**Hallazgo importante: `two-groups` y `shape` ya están implementados en
`PromptView` y no los usa nadie.** Son dos formatos de prueba **gratis**.
(`two-groups` está sin caja de fondo, a diferencia del resto; conviene darle
el mismo tratamiento visual al usarlo por primera vez — 3 líneas.)

**`Option['display']`:** `text`, `emoji` (con `scale?: 'sm' | 'lg'`),
`shape`, `group`. Los cuatro se usan.

**Coste de añadir un `kind` nuevo — tres ficheros, no uno:**

1. `types.ts` — la unión.
2. `PromptView.tsx` — un `case` nuevo.
3. `PrintableWorksheets.tsx:127-146` (`WorksheetOption`) — si es un `display`
   nuevo, **también hay que pintarlo aquí** o la ficha imprimible sale con
   recuadros vacíos. Es el sitio que se olvida.
4. `OptionButton.tsx:38-68` — si es un `display` nuevo.

⚠️ **`tsconfig.app.json` no tiene `"strict": true`** y `PromptView` no tiene
`default` ni guard de exhaustividad: **si se añade un `Prompt.kind` y se
olvida el `case`, ni `tsc -b` ni oxlint lo detectan** — la función devuelve
`undefined`, React 19 lo acepta y el enunciado simplemente **no se pinta**.
Fallo silencioso.

**Arreglo obligatorio de 4 líneas** al final del `switch` de `PromptView`:

```ts
default: {
  const _exhaustive: never = prompt;   // error de compilación si falta un case
  return _exhaustive;
}
```

Lo mismo en `OptionButton` y `WorksheetOption` (allí son `&&` encadenados;
conviene convertirlos a `switch` para poder poner el guard).

**Trabajo de UI que sí merece la pena** (una sola inversión, ver fase 6):

| Cambio | Ficheros | Tamaño | Desbloquea |
| --- | --- | ---: | --- |
| `Prompt`+`display` `scene` (objeto dentro/fuera/encima/debajo/izq/der de un contenedor) | `types.ts`, `PromptView.tsx`, `OptionButton.tsx`, `PrintableWorksheets.tsx` | ~130 líneas | 4 pruebas de orientación espacial (48-51), imposibles hoy |
| `scale` de `emoji` pasa de `'sm'\|'lg'` a `'xs'\|'sm'\|'md'\|'lg'\|'xl'` | `types.ts:27`, `OptionButton.tsx:44-56` | ~10 líneas | 3 pruebas de medida (64, 66, 67) |
| `Shape` acepta `fill` y `display.shape` acepta `color` | `Shape.tsx:24-34`, `types.ts:28`, `OptionButton.tsx:58` | ~15 líneas | 1 prueba (54) + multiplica ×6 la variedad de la prueba 5 |
| `MemoryGame` acepta `pool` y `pairCount` variables | `MemoryGame.tsx:12-23, 83`, `types.ts:70` | ~15 líneas | 1 prueba (63) + rejugabilidad de la 8 |
| Tamaño de texto adaptativo en `OptionButton` | `OptionButton.tsx:38-42` | ~5 líneas | **Transversal:** hoy `text-4xl` para "Con sueño" o "Miércoles" se desborda. Sin esto, ninguna prueba puede usar palabras como respuesta |

El último es el más rentable de todos y hay que hacerlo en la fase 1:

```tsx
const t = option.display.text;
const size = t.length <= 2 ? 'text-4xl md:text-5xl' : t.length <= 6 ? 'text-2xl' : 'text-xl';
```

### 2.8 `genFinalChallenge` — dos problemas (`generators.ts:455-475`)

```ts
const CHALLENGE_POOL: readonly RoundGenerator[] = [ /* 17 generadores a mano */ ];
export const genFinalChallenge: RoundGenerator = (rng) => pick(rng, CHALLENGE_POOL)(rng);
```

1. **Pierde el `tier`**: la firma recibe `(rng, tier)` pero llama al
   generador elegido con `(rng)` solo. El desafío final nunca sube de
   dificultad. Arreglo: `(rng, tier) => pick(rng, CHALLENGE_POOL)(rng, tier)`.
2. **Lista manual de 17** → con 100 pruebas serían 99 entradas a mano y se
   desincronizará. No se puede derivar de `GAMES` porque `catalog.ts` importa
   `generators.ts` (ciclo). Solución limpia: que cada generador se
   **autorregistre** en un array exportado, o que `CHALLENGE_POOL` viva en
   `catalog.ts` (`GAMES.filter(g => g.generate && g.id !== 13).map(g => g.generate!)`)
   y se le inyecte al generador vía closure. La segunda es más simple:
   convertir `genFinalChallenge` en una **fábrica** `makeMixGenerator(pool)`
   invocada desde `catalog.ts`.

### 2.9 `generateRounds` deduplica por `question` — `generators.ts:483-502`

```ts
for (let attempt = 0; attempt < 12 && used.has(round.question); attempt++) { ... }
```

**7 de 18 generadores producen un único enunciado** (`¿Cuántos hay?`,
`¿Qué viene después?`, `¿Cuál es diferente?`, `¿Qué número falta en el
tren?`, `¿Quién hace este sonido?`, `¿Cómo se siente?`, `¿Qué toca ahora?`).
Para ellos el antirrepetición **no hace nada**: gasta 12 reintentos y acepta
igual. Resultado medido: **43 % de las sesiones de "¿Cómo Se Siente?"
repiten la misma cara**, 28 % en sonidos, 24 % en rutina.

**Arreglo (10 líneas, gran retorno):** deduplicar por el *core* del
ejercicio, no por el enunciado:

```ts
function coreKey(r: Round): string {
  const ok = r.options.find((o) => o.correct)!;
  return `${r.question}|${JSON.stringify(r.prompt)}|${JSON.stringify(ok.display)}`;
}
```

Con eso, "¿Cómo se siente?" ya no repite emoción dentro de la misma sesión.
El tope de 12 reintentos sigue protegiendo a los pools cortos.

### 2.10 `PrintableWorksheets.tsx`

- `:59-70` un `<select>` nativo con **100 `<option>`** es usable pero
  horrible. Arreglo barato: `<optgroup label={mundo}>`.
- `:13` `PRINTABLE_GAMES = GAMES.filter(g => g.generate)` — correcto, sigue
  funcionando.
- `:30-35` genera 6 ejercicios con `defaultRng`: **una prueba con 6
  ejercicios distintos (Formas, Emociones) produce una ficha con
  repeticiones garantizadas**. Se arregla solo cuando se apliquen §2.9 y la
  ampliación de pools.
- ⚠️ `WorksheetOption` (`:127-146`) hay que ampliarlo con cada `display`
  nuevo (ver §2.7).

### 2.11 Voz (`speech.ts`) — sin impacto de escala, con reglas de contenido

No hay coste por número de pruebas: se lee una frase cada vez. Pero el
contenido nuevo tiene que respetar reglas o la voz lo estropea:

- **Nunca meter emoji en `spoken`**: los lectores TTS los verbalizan
  ("cara sonriente") o los saltan.
- **Nunca abreviaturas ni símbolos** (`1º`, `+`, `%`): escribir "primero",
  "más".
- `rate: 0.85` (`speech.ts:72`) hace que una frase larga tarde ~5 s. Los
  `spoken` nuevos deben quedar **por debajo de ~15 palabras**, o la niña
  toca antes de que acabe.
- `game.desc` se lee entero al pulsar 🔊 (`GameContainer.tsx:57`): mantener
  los `desc` en una línea corta.
- Números en `spoken`: la voz española lee "5" como "cinco" correctamente,
  pero **"3-6" lo lee como un guion**. Escribir "del tres al seis".

---

## 3. Alternativas evaluadas

| Palanca | Coste (tamaño de cambio) | Rendimiento pedagógico | Contenido añadido |
| --- | --- | --- | --- |
| **A. Más pruebas (→100)** | Muy alto en volumen, muy bajo en riesgo por unidad. ~81 generadores + ~60 tablas de datos. Con fábricas (§5), ~40 líneas por prueba | **Alto**: es lo único que amplía la *cobertura curricular*. Una prueba nueva de "¿dónde vive?" enseña algo que hoy no está | +243 rondas de primera pasada (×5,3) y +~2.500 ejercicios distintos |
| **B. Más profundidad por prueba** | **Bajo**: ampliar `EMOTIONS` de 6 a 16 son 10 líneas de datos. `tier` de 0-2 a 0-4 es 1 línea (`progress.ts:101`). Variantes internas (una prueba que rota entre 3 formulaciones), ~25 líneas por prueba | **Medio-alto** en consolidación, **bajo** en novedad. Arregla el 43 % de repetición, pero la niña sigue viendo "las mismas 19 pantallas" | Multiplica ×2-4 los ejercicios de lo existente; **no añade ni una ronda a la primera pasada** |
| **C. Reestructurar el progreso (mundos)** | **Medio-bajo**: ~150 líneas (`types.ts`, `catalog.ts`, `progress.ts`, `GameMap.tsx`, `StickerAlbum.tsx`) + reescribir 2 tests | **Alto indirecto**: no añade contenido, pero es **condición necesaria** para que el contenido nuevo sea alcanzable y encontrable. También da autonomía (elegir qué jugar) que a los 4-6 años es motivación pura | 0 rondas nuevas, pero desbloquea el 100 % de las demás |
| **D. Modos de juego infinito** | **Bajo**: «Aventura del Día» son ~60 líneas (un generador que mezcla los de las pruebas superadas, con semilla derivada de la fecha). «Maratón amable» ~80. «Repaso adaptativo» ~150 (hay que guardar aciertos/fallos en `Progress`, migración aditiva) | **Medio**: no enseña nada nuevo, pero convierte el catálogo en un pozo sin fondo y da **motivo para volver mañana**. El repaso adaptativo sí tiene valor pedagógico real (dedica tiempo a lo que falla) | Infinito en rondas, cero en cobertura curricular |

### Recomendación

**Hacer A + C + D, en ese orden entrelazado, y dejar B para el final.**

Razonamiento:

1. **C primero pero mínimo y en el mismo PR que el primer lote de A.** El
   desbloqueo lineal y el mapa plano son el cuello de botella: sin ellos,
   añadir 40 pruebas al final de una cadena de 100 eslabones es tirar el
   trabajo. Pero C sola no le da nada a la niña ese día, así que **nunca
   debe ir en un PR sin contenido**.
2. **A es la palanca principal.** Es la única que ataca el problema
   declarado ("se lo pasa demasiado rápido") *y* amplía cobertura
   curricular. Y con el enfoque de fábricas (§5) el coste marginal por
   prueba baja a ~40 líneas, de las cuales 30 son datos.
3. **D en cuanto haya ≥40 pruebas.** «Aventura del Día» es la mejor relación
   coste/beneficio de todo el documento: **60 líneas para contenido
   ilimitado**, y crea el hábito de abrir la app cada día. Antes de tener
   40 pruebas la mezcla es pobre, por eso va después del primer lote grande.
4. **B al final.** Es la palanca más barata pero la de menor retorno
   percibido: nadie nota que "hay más emociones" hasta que las ve. Sí hay
   que hacer **la parte de B que es un arreglo de calidad** (§2.9, dedupe por
   ejercicio) desde el minuto uno, porque el 43 % de repetición se nota
   inmediatamente y es gratis de arreglar.

**Lo que NO recomiendo:** subir `roundsToWin` de 3 a 5 como forma de alargar
el juego. Es la manera más rápida de que se aburra: la misma prueba con más
rondas es más de lo mismo, no más juego. Y con pools de 6 ejercicios
garantiza repetición. Se puede subir a 4 en la fase 7, **después** de haber
ampliado los pools.

---

## 4. Inventario de pruebas nuevas (81 nuevas → 100 totales)

### 4.1 Reglas de calidad obligatorias para toda prueba nueva

1. **Tono**: nunca reprender, nunca alarmar. Prohibido: enfermedad, peligro
   explícito, muerte, animales que dan miedo (araña vale, pero nada de
   "cuidado que pica"), comida "buena/mala" (sí "¿cuál es una fruta?", no
   "¿cuál es más sano?").
2. **Español de España**: coche (no carro), zumo (no jugo), patata (no papa),
   ordenador (no computadora), tarta, chaqueta, cole.
3. **Respuesta única e inequívoca.** Antes de dar una prueba por hecha,
   comprobar a mano que **ningún distractor podría defenderse**. Trampas
   típicas:
   - Color: 🍎 es rojo *y* verde; 🌽 amarillo *y* verde. No usarlos en
     pruebas de color.
   - Categoría: tomate/aguacate/pepino son fruta botánicamente. No usarlos
     en "¿cuál es una fruta?".
   - Hábitat: la rana vive en el estanque *y* en tierra. La tortuga en mar
     *y* tierra. Elegir animales monohábitat (pez↔mar, topo↔tierra,
     mono↔selva).
   - Forma: 🍕 es triángulo *y* sector circular. Ya está en el pool; no
     añadir más ambiguos.
4. **Emoji**: solo Unicode **≤ 12.0** salvo excepción justificada (los de
   14.0+ salen como caja en Android 10 y anteriores). Que se distinga a
   **32 px**: descartar los que solo difieren en un detalle
   (🐕/🐩, 🍊/🍋 pasan; 🫑/🥒 no). Nunca dos opciones con el mismo emoji.
5. **`spoken`**: sin emoji, sin símbolos, sin abreviaturas, < 15 palabras.
6. **`desc`**: una línea, se lee en voz alta al pulsar 🔊.
7. **Texto en `display: text`**: preferir 1-2 caracteres. Si es una palabra,
   requiere el tamaño adaptativo de §2.7.

### 4.2 Fábricas de generadores (la clave del coste)

En vez de 81 generadores a mano, **8 fábricas parametrizadas** en
`src/lib/games/generators/factories.ts`. Cada fábrica garantiza por
construcción los dos invariantes del test genérico (una sola correcta,
`display` únicos). Una prueba nueva pasa a ser **una llamada a una fábrica +
una tabla de datos**.

| Fábrica | Firma | Prompt | Opciones | Regla de distractores |
| --- | --- | --- | --- | --- |
| `emojiToName` | `(pool: Item[], texts) => RoundGenerator` | `emoji-single` | `text` con el nombre | 3 del mismo pool con `name` ≠ y `emoji` ≠ |
| `nameToEmoji` | `(pool: Item[], texts)` | `none` | `emoji` | 3 del mismo pool con `emoji` ≠ |
| `pairMatch` | `(pairs: {from,to}[], texts)` | `emoji-single` (`from`) | `emoji` (`to`) | 3 `to` de otros pares, deduplicados por `to.emoji`; descartar pares que compartan `to` |
| `categoryMember` | `(cats: Category[], texts)` | `none` | `emoji` | 1 de la categoría pedida + 3 de **tres categorías distintas** entre sí; test extra que verifica que ningún emoji está en dos categorías |
| `oddOneOut` | `(cats: Category[], texts)` | `none` | `emoji` | igual que `genOddOne` (`generators.ts:197`) pero con tabla inyectable |
| `orderedSequence` | `(steps: Item[], {windowLen})` | `sequence` | `emoji` | ventana de `windowLen`, hueco nunca en la posición 0 (igual que `genRoutine`, `generators.ts:422`) |
| `numberQuestion` | `((rng, tier) => {question, spoken, prompt, answer, max})` | el que devuelva | `text` numérico vía `numericDistractors` | ya lo garantiza `numericDistractors` |
| `listenAndPick` | `(pool, {targetOf, matchOf}, texts)` | `listen` | `emoji` o `text` | 3 que no cumplan la relación, deduplicados por `display` |

Contrato común de toda fábrica:

```ts
interface Item { emoji: string; name: string }
interface Category { name: string; article: 'un' | 'una'; items: readonly Item[] }
type Texts<T> = { question: (x: T) => string; spoken: (x: T) => string };
```

Y una utilidad compartida que hay que usar siempre:

```ts
/** `count` distractores garantizando que ningún `display` se repite. */
function distinctDistractors<T>(rng: Rng, pool: readonly T[], keyOf: (t: T) => string,
                                exclude: string, count: number): T[]
```

### 4.3 Mundos

| Mundo | Nombre | Icono | Pruebas | Se abre al… |
| --- | --- | --- | ---: | --- |
| `letras` | El Claro de las Letras | 🔤 | 14 (1, 11, 17, 20-30) | siempre abierto |
| `numeros` | El Río de los Números | 🔢 | 12 (2, 10, 31-40) | siempre abierto |
| `cuentas` | La Cueva de las Cuentas | ➕ | 9 (3, 4, 41-47) | 3 pruebas de `numeros` |
| `formas` | La Montaña de las Formas | 🔷 | 12 (5, 12, 14, 48-56) | siempre abierto |
| `logica` | El Laberinto de la Lógica | 🧩 | 12 (6, 7, 8, 57-65) | 3 pruebas de `formas` |
| `medidas` | El Prado de las Medidas | 📏 | 11 (9, 18, 19, 66-73) | 3 pruebas de `numeros` |
| `natura` | El Bosque de los Animales | 🦊 | 11 (15, 74-83) | siempre abierto |
| `cuerpo` | La Casa de los Peques | 🧒 | 8 (84-91) | 3 pruebas de `natura` |
| `emociones` | La Plaza de las Emociones | 💛 | 6 (16, 92-96) | siempre abierto |
| `oficios` | La Ciudad de los Oficios | 🚂 | 4 (97-100) | 3 pruebas de `cuerpo` |
| `especial` | La Torre del Trofeo | 🏆 | 1 prueba (13) + 2 modos | 20 pruebas en total |

Cuatro mundos abiertos de salida = **la niña siempre tiene ~40 pruebas
disponibles** y nunca se queda atascada detrás de una que no le gusta.

### 4.4 Inventario

Leyenda de **coste**:
- 🟢 **barata** — solo datos + una llamada a fábrica. Cero cambios en tipos ni UI.
- 🟡 **media** — generador propio (~40 líneas) reutilizando `Prompt` existente. Cero cambios en UI.
- 🔴 **cara** — necesita el tipo/UI nuevo indicado.

`cat` es la etiqueta corta que se pinta en la tarjeta del mapa
(`GameMap.tsx:87`); máximo 11 caracteres o se rompe el diseño.

---

#### Mundo `letras` — El Claro de las Letras (ids 20-30, 11 pruebas)

| id | Título | Icono | Cat | Desc | Pregunta / Prompt | Datos nuevos | Tier | Coste |
| --- | --- | --- | --- | --- | --- | --- | :---: | :---: |
| 20 | Toca la Letra | 🅰️ | Letras | Busca la letra que te digo | «Toca la letra M» · `none` · opciones `text` | `ALPHABET` ampliado con Ñ Q W X Y Z | no | 🟢 `nameToEmoji` variante texto |
| 21 | Letras Pequeñitas | 🔡 | Letras | La misma letra, en pequeñita | «¿Cuál es la a de A?» · `none` · opciones `text` minúsculas | ninguno (deriva de `ALPHABET`) | no | 🟢 |
| 22 | ¿Con Qué Letra Acaba? | 🔚 | Letras | La última letra de la palabra | `emoji-single` · opciones `text` | `FINAL_LETTER_WORDS` (~30 ítems: solo terminaciones limpias en vocal, `-n -l -r -s -z`) | no | 🟢 `emojiToName` variante |
| 23 | Cuenta las Palmadas | 👏 | Sílabas | Da una palmada por sílaba | `listen` · opciones `text` 1-5 | `SYLLABLE_WORDS` (~40: `{emoji, word, syllables}`) | **sí** (t0: 1-3 sílabas, t2: 1-5) | 🟡 `numberQuestion` |
| 24 | La Primera Sílaba | 🎵 | Sílabas | ¿Por qué sílaba empieza? | `listen` · opciones `text` (PE, MA…) | reutiliza `SYLLABLE_WORDS` + campo `syllableList` | no | 🟢 |
| 25 | Empiezan Igual | 🔗 | Letras | Dos palabras que empiezan igual | `listen` · opciones `emoji` | `WORDS_BY_INITIAL` (~50, ≥3 por letra) | no | 🟡 |
| 26 | La Letra Perdida | 🧩 | Letras | Falta una letra en la palabra | **`sequence`** con letras y un `null` · opciones `text` | reutiliza `CRITTERS` (palabras ≤ 8 letras) | no | 🟡 (reusa prompt) |
| 27 | El Abecedario en Orden | 🔠 | Letras | ¿Qué letra viene después? | **`sequence`** con letras · opciones `text` | ninguno | no | 🟢 |
| 28 | Palabras Largas y Cortas | 📐 | Sílabas | ¿Qué palabra es más larga? | `none` · **2** opciones `emoji` | reutiliza `SYLLABLE_WORDS` (diferencia ≥ 2 sílabas) | no | 🟢 |
| 29 | ¿Con Qué Empieza? | 🎒 | Letras | La primera letra de las cosas | `emoji-single` · opciones `text` | `EVERYDAY_OBJECTS` (~40: mochila, silla, queso, zapato…) | no | 🟢 |
| 30 | La Vocal Escondida | 🅾️ | Letras | ¿Qué vocal se oye dentro? | `listen` · opciones `text` vocales | `ONE_VOWEL_WORDS` (~25 monosílabas con una sola vocal: sol, pan, tren, luz, mar) | no | 🟢 |

#### Mundo `numeros` — El Río de los Números (ids 31-40, 10 pruebas)

| id | Título | Icono | Cat | Desc | Pregunta / Prompt | Datos nuevos | Tier | Coste |
| --- | --- | --- | --- | --- | --- | --- | :---: | :---: |
| 31 | Toca el Número | 7️⃣ | Números | Busca el número que te digo | `none` · opciones `text` | ninguno | **sí** (t0: 1-10, t2: 1-20) | 🟢 |
| 32 | ¿Cuál es Mayor? | 🔺 | Números | El número más grande (o el más pequeño) | `none` · 4 opciones `text` | ninguno | **sí** | 🟡 |
| 33 | Antes y Después | ↔️ | Números | ¿Qué número va justo antes o después? | `none` · opciones `text` | ninguno | **sí** | 🟢 `numberQuestion` |
| 34 | El Tren al Revés | 🚃 | Números | Cuenta hacia atrás | `number-sequence` descendente | ninguno | **sí** | 🟢 |
| 35 | De Dos en Dos | 👣 | Números | Cuenta dando saltos de dos | `number-sequence` paso 2 | ninguno | **sí** | 🟢 |
| 36 | Toca el Grupo Correcto | 🫧 | Números | ¿Dónde hay justo esa cantidad? | `none` · opciones `group` | ninguno (usa `COUNTABLES`) | **sí** | 🟡 |
| 37 | ¿Cuántos Faltan? | 🕳️ | Números | ¿Cuántos faltan para llegar a cinco? | **`sequence`** con huecos · opciones `text` | ninguno | **sí** (t0: hasta 5, t2: hasta 10) | 🟡 |
| 38 | ¿Quién Va el Primero? | 🥇 | Números | Primero, segundo, tercero… | **`sequence`** de animales · opciones `emoji` | ninguno (usa `CRITTERS`) | no | 🟡 |
| 39 | Los Mismos que Aquí | 🟰 | Números | Busca el grupo que tiene los mismos | `emoji-group` · opciones `group` | ninguno | **sí** | 🟡 |
| 40 | Uno Más, Uno Menos | ➕1️⃣ | Números | Si viene uno más, ¿cuántos hay? | `emoji-group` · opciones `text` | ninguno | **sí** | 🟢 |

#### Mundo `cuentas` — La Cueva de las Cuentas (ids 41-47, 7 pruebas)

| id | Título | Icono | Cat | Desc | Pregunta / Prompt | Datos nuevos | Tier | Coste |
| --- | --- | --- | --- | --- | --- | --- | :---: | :---: |
| 41 | Reparte por Igual | 🍪 | Repartir | Reparte las galletas entre los amigos | **`two-groups`** (galletas / caritas) · opciones `text` | ninguno | **sí** (t0: ÷2 hasta 8; t2: ÷2,3,4 hasta 12) | 🟡 (estrena `two-groups`) |
| 42 | El Doble | 👯 | Sumas | El doble es lo mismo dos veces | `equation` (n + n) · opciones `text` | ninguno | **sí** | 🟢 |
| 43 | La Cesta de la Compra | 🧺 | Sumas | Suma dos cosas distintas | **`two-groups`** (3🍐 + 2🍌) · opciones `text` | ninguno (usa `CATEGORIES.frutas`) | **sí** | 🟡 |
| 44 | El Número Secreto | 🔐 | Sumas | ¿Cuánto falta para llegar? | `equation` con `right: ['❓']` · opciones `text` | ninguno | **sí** | 🟡 |
| 45 | La Mitad Justa | 🍰 | Repartir | La mitad es partirlo en dos iguales | **`two-groups`** · opciones `text` | ninguno | **sí** (solo pares) | 🟢 |
| 46 | Se Fueron Volando | 🐦 | Restas | Estaban y se fueron. ¿Cuántos quedan? | `equation` con `−` · opciones `text` | `LEAVE_SCENES` (~8: pajaritos/rama, peces/pecera, globos/mano) | **sí** | 🟢 |
| 47 | Problemas del Bosque | 🌰 | Problemas | Escucha el problema y resuélvelo | `emoji-group` · opciones `text` | `WORD_PROBLEMS` (~10 plantillas suma/resta con personaje y objeto) | **sí** | 🟡 |

#### Mundo `formas` — La Montaña de las Formas (ids 48-56, 9 pruebas)

| id | Título | Icono | Cat | Desc | Pregunta / Prompt | Datos nuevos | Tier | Coste |
| --- | --- | --- | --- | --- | --- | --- | :---: | :---: |
| 48 | Dentro y Fuera | 📦 | Espacio | ¿Está dentro o fuera de la caja? | **`scene`** (nuevo) · opciones `scene` | `CONTAINERS` (~6: caja, cesta, casa, bol, coche, cueva) | no | 🔴 `scene` |
| 49 | Encima y Debajo | 🪑 | Espacio | ¿Está encima o debajo? | **`scene`** · opciones `scene` | reutiliza `CONTAINERS` | no | 🔴 (amortizado) |
| 50 | Izquierda y Derecha | 👈 | Espacio | El lado izquierdo y el derecho | **`scene`** · opciones `scene` | reutiliza `CONTAINERS` | no | 🔴 (amortizado) |
| 51 | Arriba, en Medio y Abajo | 🗼 | Espacio | Tres pisos: arriba, en medio y abajo | **`scene`** vertical · opciones `scene` | reutiliza `CONTAINERS` | no | 🔴 (amortizado) |
| 52 | ¿Hacia Dónde Va? | 🧭 | Espacio | Sube, baja, va a un lado | `emoji-single` (⬆️⬇️⬅️➡️) · opciones `text` | `DIRECTIONS` (8 ítems) | no | 🟢 |
| 53 | ¿Cuántos Lados Tiene? | 📐 | Geometría | Cuenta los lados de la figura | **`shape`** (prompt hoy muerto) · opciones `text` | ninguno | no | 🟢 (estrena `shape`) |
| 54 | Formas de Colores | 🎨 | Geometría | Un círculo azul, un cuadrado rojo… | `none` · opciones `shape` **con color** | ninguno | no | 🔴 `Shape` con `fill` |
| 55 | El Patrón de las Formas | 🔷 | Lógica | ¿Qué forma sigue en la fila? | **`sequence`** con 🔴🟦🔺… · opciones `emoji` | `GEOMETRIC_EMOJI` (12 ítems: 🔴🟠🟡🟢🔵🟣🟥🟧🟨🟩🟦🟪🔺🔻🔶🔷) | no | 🟢 |
| 56 | Cuerpos que Ruedan | ⚽ | Geometría | ¿Cuál rueda y cuál no? | `none` · opciones `emoji` | `ROLLING_OBJECTS` (~10 pares rueda/no rueda) | no | 🟢 |

#### Mundo `logica` — El Laberinto de la Lógica (ids 57-65, 9 pruebas)

| id | Título | Icono | Cat | Desc | Pregunta / Prompt | Datos nuevos | Tier | Coste |
| --- | --- | --- | --- | --- | --- | --- | :---: | :---: |
| 57 | Patrón de Colores | 🌈 | Lógica | ¿Qué color sigue? | `sequence` con `COLORS` · opciones `emoji` | ninguno | no | 🟢 |
| 58 | El Hueco del Medio | 🕳️ | Lógica | Falta uno en medio de la fila | `sequence` con hueco central · opciones `emoji` | ninguno | no | 🟡 |
| 59 | ¿Cuál es una Fruta? | 🍓 | Clasificar | Busca el que es de esa clase | `none` · opciones `emoji` | `CLASS_SETS` (~10 categorías × 8, sin solapes) | no | 🟢 `categoryMember` |
| 60 | La Pareja Lógica | 🔗 | Lógica | El perro con el hueso, el gato con… | `sequence` [A,B,C,`null`] · opciones `emoji` | `ANALOGIES` (~15 cuartetos) | no | 🟡 |
| 61 | ¿Qué Pasa Después? | ⏭️ | Lógica | Del huevo sale el pollito | `sequence` · opciones `emoji` | `CAUSE_EFFECT` (~15 pares: semilla→flor, hielo→charco, masa→pan) | no | 🟢 `orderedSequence` |
| 62 | El Intruso por Color | 🔍 | Lógica | Tres del mismo color y uno distinto | `none` · opciones `emoji` | `COLOR_GROUPS` (9 colores × 5 objetos monocolor) | no | 🟢 `oddOneOut` |
| 63 | Memoria de Colores | 🎴 | Memoria | Encuentra las parejas de colores | (tipo `memory`, 6 parejas) | ninguno | no | 🔴 `MemoryGame` con `pool` |
| 64 | De Pequeño a Grande | 📶 | Medidas | ¿Cuál es el más pequeño de todos? | `none` · 4 opciones `emoji` con 4 escalas | ninguno | no | 🔴 `scale` ampliada |
| 65 | ¿De Quién Es? | 🐾 | Lógica | La casa, la comida o la huella | `emoji-single` · opciones `emoji` | `BELONGINGS` (~20 pares) | no | 🟢 `pairMatch` |

#### Mundo `medidas` — El Prado de las Medidas (ids 66-73, 8 pruebas)

| id | Título | Icono | Cat | Desc | Pregunta / Prompt | Datos nuevos | Tier | Coste |
| --- | --- | --- | --- | --- | --- | --- | :---: | :---: |
| 66 | Largo y Corto | 📏 | Medidas | ¿Cuál es más largo? | `none` · 2 opciones `group` (fila de n) | ninguno | no | 🟡 |
| 67 | Alto y Bajo | 🏔️ | Medidas | ¿Cuál es más alto? | `none` · 2 opciones `emoji` con escala | ninguno | no | 🔴 `scale` ampliada |
| 68 | ¿Qué Pesa Más? | ⚖️ | Medidas | Uno pesa mucho y otro poquito | `none` · 2 opciones `emoji` | `WEIGHT_PAIRS` (~15 pares con diferencia obvia: pluma/elefante) | no | 🟢 |
| 69 | ¿Antes o Después? | ⏳ | Tiempo | ¿Qué pasa primero? | `none` · 2 opciones `emoji` | `TIME_PAIRS` (~15: desayuno/cena, semilla/árbol) | no | 🟢 |
| 70 | Los Días de la Semana | 📅 | Tiempo | ¿Qué día viene después? | `sequence` con nombres · opciones `text` | `WEEKDAYS` (7) | no | 🟢 (requiere texto adaptativo) |
| 71 | Las Cuatro Estaciones | 🍂 | Tiempo | Primavera, verano, otoño e invierno | `emoji-single` · opciones `text` | `SEASONS` (4 × 5 pistas: 🌷☀️🍂❄️) | no | 🟢 |
| 72 | De Día y de Noche | 🌙 | Tiempo | ¿Qué hacemos de día y qué de noche? | `emoji-single` (☀️/🌙) · opciones `emoji` | `DAY_NIGHT` (~16 actividades) | no | 🟢 |
| 73 | Ordena el Cuento | 📖 | Tiempo | Principio, medio y final | `sequence` de 3 viñetas · opciones `emoji` | `STORY_STRIPS` (~12 tríos) | no | 🟢 `orderedSequence` |

#### Mundo `natura` — El Bosque de los Animales (ids 74-83, 10 pruebas)

| id | Título | Icono | Cat | Desc | Pregunta / Prompt | Datos nuevos | Tier | Coste |
| --- | --- | --- | --- | --- | --- | --- | :---: | :---: |
| 74 | ¿Dónde Vive? | 🏡 | Animales | Cada animal tiene su casa | `emoji-single` · opciones `emoji` | `HABITATS` (~20 pares monohábitat) | no | 🟢 `pairMatch` |
| 75 | Los Bebés de los Animales | 🐣 | Animales | ¿Quién es el bebé de la vaca? | `emoji-single` · opciones `emoji` | `ANIMAL_BABIES` (~12 pares) | no | 🟢 `pairMatch` |
| 76 | ¿Qué Come? | 🥕 | Animales | Cada animal come una cosa | `emoji-single` · opciones `emoji` | `ANIMAL_FOOD` (~18 pares inequívocos) | no | 🟢 `pairMatch` |
| 77 | Granja, Selva o Mar | 🌍 | Clasificar | ¿De dónde es este animal? | `emoji-single` · opciones `text` | `ANIMAL_ZONES` (4 zonas × 8) | no | 🟢 `emojiToName` |
| 78 | ¿Vuela, Nada o Anda? | 🕊️ | Animales | Cómo se mueve cada animal | `emoji-single` · opciones `text` | `ANIMAL_MOVES` (3 × 10, sin ambiguos: nada de patos ni tortugas) | no | 🟢 |
| 79 | Del Huevo a la Mariposa | 🦋 | Naturaleza | Cómo crecen los bichitos | `sequence` · opciones `emoji` | `LIFE_CYCLES` (4 ciclos × 4 pasos) | no | 🟢 `orderedSequence` |
| 80 | ¿Qué Tiempo Hace? | ☀️ | Naturaleza | Sol, lluvia, nieve o viento | `emoji-single` · opciones `text` | `WEATHER` (6) | no | 🟢 |
| 81 | Las Partes de la Planta | 🌻 | Naturaleza | Raíz, tallo, hoja y flor | `emoji-single` · opciones `text` | `PLANT_PARTS` (5) | no | 🟢 |
| 82 | ¿Qué Necesita una Planta? | 💧 | Naturaleza | Agua, sol y tierra | `none` · opciones `emoji` | `PLANT_NEEDS` (3 sí + 8 no) | no | 🟢 `categoryMember` |
| 83 | Cuidamos el Bosque | ♻️ | Naturaleza | ¿En qué cubo va cada cosa? | `emoji-single` · opciones `emoji` (cubos de color) | `RECYCLING` (4 cubos × 6 objetos) | no | 🟢 `pairMatch` |

#### Mundo `cuerpo` — La Casa de los Peques (ids 84-91, 8 pruebas)

| id | Título | Icono | Cat | Desc | Pregunta / Prompt | Datos nuevos | Tier | Coste |
| --- | --- | --- | --- | --- | --- | --- | :---: | :---: |
| 84 | Las Partes del Cuerpo | 🧒 | Cuerpo | Ojos, nariz, boca y manos | `emoji-single` · opciones `text` | `BODY_PARTS` (~10: 👁️👃👂👄✋🦶🦵🦷🦴🧠) | no | 🟢 `emojiToName` |
| 85 | Los Cinco Sentidos | 👀 | Cuerpo | ¿Con qué olemos, vemos y oímos? | `emoji-single` (acción) · opciones `emoji` (órgano) | `SENSES` (5 × 3 ejemplos) | no | 🟢 `pairMatch` |
| 86 | ¿Qué Me Pongo? | 🧥 | Hábitos | La ropa según el tiempo que hace | `emoji-single` (tiempo) · opciones `emoji` (ropa) | `CLOTHES_WEATHER` (~12 pares) | no | 🟢 `pairMatch` |
| 87 | Frutas y Verduras | 🥦 | Comida | ¿Es una fruta o una verdura? | `emoji-single` · opciones `text` | `FRUIT_VEG` (2 × 12, sin tomate/aguacate/pepino) | no | 🟢 |
| 88 | ¿De Dónde Viene? | 🥛 | Comida | La leche viene de la vaca | `emoji-single` · opciones `emoji` | `FOOD_ORIGIN` (~12 pares) | no | 🟢 `pairMatch` |
| 89 | Cosas de Aseo | 🧼 | Hábitos | ¿Qué usamos para lavarnos? | `none` · opciones `emoji` | `HYGIENE` (6 sí + 10 no) | no | 🟢 `categoryMember` |
| 90 | El Semáforo y la Calle | 🚦 | Seguridad | Rojo esperamos, verde cruzamos | `emoji-single` · opciones `text` | `TRAFFIC` (3 luces + 4 señales sencillas) | no | 🟢 |
| 91 | La Rutina de los Dientes | 🪥 | Hábitos | El orden de lavarse los dientes | `sequence` · opciones `emoji` | `TOOTH_ROUTINE` (5 pasos) | no | 🟢 `orderedSequence` |

#### Mundo `emociones` — La Plaza de las Emociones (ids 92-96, 5 pruebas)

| id | Título | Icono | Cat | Desc | Pregunta / Prompt | Datos nuevos | Tier | Coste |
| --- | --- | --- | --- | --- | --- | --- | :---: | :---: |
| 92 | ¿Cómo se Siente Ahora? | 💭 | Emociones | Escucha lo que pasa y mira su cara | `none` (enunciado narrado) · opciones `emoji` | `EMOTION_SITUATIONS` (~20 situaciones **amables**: le regalan un globo, se le cae el helado) + `EMOTIONS` ampliado a 12 | no | 🟢 |
| 93 | ¿Cómo Ayudo? | 🤝 | Convivencia | Compartir, esperar el turno, ayudar | `none` (narrado) · opciones `emoji` | `KINDNESS` (~15 situaciones con una única respuesta amable) | no | 🟡 (revisar ambigüedad una a una) |
| 94 | Los Instrumentos | 🎺 | Música | ¿Qué instrumento es? | `emoji-single` · opciones `text` | `INSTRUMENTS` (~10) | no | 🟢 `emojiToName` |
| 95 | El Ritmo de las Palmas | 👏 | Música | Sigue el ritmo: fuerte, flojo, fuerte | `sequence` (👏/🤲) · opciones `emoji` | ninguno | no | 🟢 |
| 96 | Las Palabras Mágicas | ✨ | Convivencia | Por favor, gracias y perdón | `none` (narrado) · opciones `text` | `MAGIC_WORDS` (~12 situaciones) | no | 🟢 (requiere texto adaptativo) |

#### Mundo `oficios` — La Ciudad de los Oficios (ids 97-100, 4 pruebas)

| id | Título | Icono | Cat | Desc | Pregunta / Prompt | Datos nuevos | Tier | Coste |
| --- | --- | --- | --- | --- | --- | --- | :---: | :---: |
| 97 | ¿Quién Lo Hace? | 🧑‍🚒 | Oficios | Cada oficio con su herramienta | `emoji-single` (herramienta) · opciones `emoji` (oficio) | `JOB_TOOLS` (~14 pares) | no | 🟢 `pairMatch` |
| 98 | Los Oficios del Pueblo | 👩‍⚕️ | Oficios | ¿A qué se dedica? | `emoji-single` · opciones `text` | `JOBS` (~14) | no | 🟢 `emojiToName` |
| 99 | Por Tierra, Mar o Aire | ✈️ | Transporte | ¿Por dónde va este transporte? | `emoji-single` · opciones `text` | `TRANSPORT_ZONES` (3 × 8) | no | 🟢 |
| 100 | Vamos de Viaje | 🧳 | Transporte | ¿En qué vamos hasta allí? | `emoji-single` (destino) · opciones `emoji` | `TRIP_CHOICES` (~10 destino→transporte único) | no | 🟢 `pairMatch` |

#### Resumen del inventario

| Coste | Pruebas | % |
| --- | ---: | ---: |
| 🟢 barata (datos + fábrica, cero UI) | **57** | 70 % |
| 🟡 media (generador propio, prompt existente) | **17** | 21 % |
| 🔴 cara (tipos/UI nuevos) | **7** | 9 % |

Las 7 caras se concentran en **tres inversiones de UI**: `scene` (4 pruebas),
`scale` ampliada (2), `Shape` con color (1), más `MemoryGame` parametrizable
(1, contada aparte). Todas se pueden aplazar a la fase 6 sin bloquear nada.

**Cobertura curricular resultante** (infantil 3-6 en España): prelectura y
conciencia fonológica (1, 11, 17, 20-30 → 14), números y cantidad (2, 10,
31-40 → 12), operaciones y reparto (3, 4, 41-47 → 9), geometría y orientación
espacial (5, 12, 14, 48-56 → 12), lógica, patrones y clasificación (6, 7, 8,
57-65 → 12), medida, comparación y tiempo (9, 18, 19, 66-73 → 11), naturaleza,
animales y estaciones (15, 74-83 → 11), cuerpo, alimentación, higiene y
seguridad (84-91 → 8), emociones, convivencia y música (16, 92-96 → 6),
oficios y transportes (97-100 → 4).

---

## 5. Plan por fases

Criterio de orden: **máximo contenido jugable cuanto antes**, sin dejar
deuda que impida seguir.

**Criterio de "hecho" común a todas las fases** (no se repite abajo):

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

los cuatro en verde, más: `README.md` actualizado, y una comprobación
manual en `npm run dev` de que las pruebas nuevas se ven bien **en anchura
de móvil (360 px)**.

---

### Fase 1 — Cimientos + primer lote de contenido (mejor ratio)

**Suma: +21 pruebas → 40 totales.** Es la fase que más contenido entrega por
unidad de esfuerzo, y la única que es prerrequisito de todo lo demás.

**Incluye:**

1. *Arreglos habilitadores* (~150 líneas en total):
   - `progress.ts`: `sanitize`/`sanitizePlayCounts` contra `GAME_IDS`, no
     `TOTAL_GAMES` (§2.4). **Bloqueante para todo lo demás.**
   - `generators.ts`: dedupe por *core* en `generateRounds` (§2.9).
   - `generators.ts`: `genFinalChallenge` pasa el `tier` (§2.8.1).
   - `PromptView.tsx` / `OptionButton.tsx` / `WorksheetOption`: guard
     `never` de exhaustividad (§2.7).
   - `OptionButton.tsx`: tamaño de texto adaptativo (§2.7). Sin esto no se
     pueden usar palabras como respuesta.
   - `generators.test.ts`: `allRounds()` una sola vez; sustituir los `19`
     literales por `GAMES.length`; añadir el test de variedad mínima (§2.6.3).
   - `app.test.tsx`: sustituir los `19` literales.
   - Arreglar los bugs de contenido de §1.4 (rima `lápiz`, emoji del iglú,
     `ALPHABET` ampliado).
2. *Mundos* (~180 líneas):
   - `types.ts`: `GameDefinition.world: WorldId`; nueva interfaz `World`.
   - `catalog.ts`: `WORLDS`, `world` en las 19 pruebas actuales,
     `GAME_IDS`, `nextGameId()`, `gamesOfWorld()`.
   - `progress.ts`: `isUnlocked` por mundo (§2.1); `worldProgress()`.
   - `GameMap.tsx`: dos niveles (tarjetas de mundo → pruebas del mundo).
   - `StickerAlbum.tsx`: agrupado por mundo + medalla de mundo.
   - `App.tsx:130`: `STICKERS.length`; `App.tsx:168`: `nextGameId`.
   - `GameContainer.tsx:32`: `isLastGame` vía `nextGameId === undefined`.
3. *Reorganización de ficheros* (mecánica, pero hay que hacerla ya o los
   ficheros se hacen ingobernables y las fases paralelas chocan):
   - `src/lib/games/data.ts` → `src/lib/games/data/index.ts` (barril que
     reexporta) + `data/<mundo>.ts`.
   - `src/lib/games/generators.ts` → `generators/index.ts` (barril) +
     `generators/factories.ts` + `generators/<mundo>.ts`.
   - `src/lib/games/catalog.ts` → `catalog/index.ts` (compone) +
     `catalog/<mundo>.ts` (un array `GameDefinition[]` por mundo).
   - **Los barriles deben reexportar exactamente lo mismo** para que
     `import { … } from '../lib/games/generators'` siga funcionando en los
     tests y en `ChoiceGame.tsx:8` / `PrintableWorksheets.tsx:6`.
   - Actualizar las rutas citadas en `docs/adding-a-prueba.md`, `CLAUDE.md`,
     `GEMINI.md`, `.claude/skills/nueva-prueba/SKILL.md`, `README.md:68-83`.
4. *Las 8 fábricas* de §4.2 en `generators/factories.ts`.
5. *Contenido*: **ids 20-30 (letras, 11) y 31-40 (números, 10)**.

**Ficheros que toca:** casi todos los de `src/lib/`, `GameMap.tsx`,
`StickerAlbum.tsx`, `App.tsx`, `GameContainer.tsx`, `OptionButton.tsx`,
`PromptView.tsx`, los 4 ficheros de tests, `README.md` y los 4 docs.

**Riesgos:**
- *Alto*: el `sanitize` mal hecho **borra el progreso de la niña**. Mitigar
  con un test explícito: guardar `{completed:[1..19], playCounts:{...}}`,
  recargar, comprobar que se conserva íntegro.
- *Medio*: la reorganización de ficheros produce un diff enorme que oculta
  errores. **Hacerla en un commit propio, puramente mecánico, con los tests
  en verde antes y después.**
- *Medio*: `progress.test.ts:19-29` y `:108-113` fallan a propósito; hay que
  reescribirlos, no borrarlos.
- *Bajo*: el mapa de dos niveles cambia el flujo que la niña ya conoce.
  Mitigar: la tarjeta del mundo en curso aparece primero y abierta.

**Hecho cuando:** los 4 comandos en verde + 40 pruebas jugables + progreso
previo (`completed:[1,2,3]`) intacto tras recargar + navegación «Siguiente»
correcta dentro y entre mundos.

---

### Fase 2 — Modos de juego infinito

**Suma: +2 entradas de mapa, contenido ilimitado.** ~200 líneas. Mejor
relación coste/beneficio del plan después de la fase 1.

- **«La Aventura del Día»** (id 101, mundo `especial`): 8 rondas mezclando
  los generadores de las pruebas **ya superadas**, con
  `seededRng(añoMesDía)`: la aventura es la misma durante todo el día
  (se puede hablar de ella en la merienda) y cambia mañana. Se puede rejugar
  sin dar pegatina nueva; da una **pegatina de racha** por días seguidos.
  Es una `GameDefinition` con `generate` construido en `catalog.ts` con
  `makeMixGenerator(progress)` — ojo: necesita el `progress`, así que la
  firma de `generate` no sirve tal cual. Alternativa limpia:
  `GameDefinition.generateFor?: (progress: Progress) => RoundGenerator`,
  campo opcional que solo usa este modo (~15 líneas en `GameContainer`).
- **«Maratón Amable»** (id 102): rondas sin fin, contador de aciertos
  seguidos, **nunca se pierde**; se sale cuando se quiere. Guardar el récord
  en `Progress.best?: number` (migración aditiva, igual que `playCounts`).
- **Repaso adaptativo**: aplazado a la fase 7 (necesita guardar aciertos y
  fallos por prueba).

**Riesgos:** *bajo*. El único: `generateFor` mete el progreso dentro de la
generación de rondas y podría regenerar al cambiar el progreso; se evita con
el `useMemo` que ya tiene `ChoiceGame.tsx:35`.

**Hecho cuando:** la aventura del día es idéntica dos veces el mismo día y
distinta al día siguiente (test con fecha fijada por `vi.setSystemTime`).

---

### Fase 3 — Lote de contenido 2: naturaleza, cuerpo, oficios (todo 🟢)

**Suma: +22 pruebas → 62 totales.** ids **74-83, 84-91, 97-100**.

Se eligen estos y no los de lógica/medidas porque son los **más baratos**
(21 de 22 son 🟢 puras: tabla de datos + `pairMatch`/`emojiToName`/
`categoryMember`) y los más "nuevos" temáticamente para la niña (animales,
comida, oficios), que es lo que más engancha a esta edad.

**Ficheros:** `data/natura.ts`, `data/cuerpo.ts`, `data/oficios.ts`,
`generators/natura.ts`, `generators/cuerpo.ts`, `generators/oficios.ts`,
`catalog/natura.ts`, `catalog/cuerpo.ts`, `catalog/oficios.ts`, un import
por mundo en cada barril, `README.md`.

**Riesgos:** *medio-alto en ambigüedad de contenido*, no en código. Cada
tabla de pares hay que revisarla a mano contra las trampas de §4.1.3.
Mitigar con un test específico por tabla: «ningún emoji aparece en dos
categorías» y «ningún `to` se repite en dos pares del mismo conjunto».

**Hecho cuando:** los 4 comandos + revisión manual de las ~180 entradas de
datos nuevas contra la lista de ambigüedades.

---

### Fase 4 — Lote de contenido 3: cuentas, lógica, medidas y tiempo

**Suma: +21 pruebas → 83 totales.** Desglose exacto:

- **41-47** (7, cuentas): reutilizan `two-groups` y `equation`.
- **57-62 y 65** (7, lógica). **63 y 64 quedan fuera**: dependen de UI nueva.
- **66 y 68-73** (7, medidas y tiempo). **67 queda fuera**: depende de UI nueva.

**Ficheros:** `data/cuentas.ts`, `data/logica.ts`, `data/medidas.ts` y sus
`generators/` y `catalog/`. Primera vez que se usa `two-groups`: darle caja
de fondo en `PromptView.tsx:91-97` (3 líneas).

**Riesgos:** *medio*. Es la fase con más 🟡 (generadores propios). Los dos
que más cuidado piden:
- **41 «Reparte por Igual»**: garantizar división exacta (`total % partes === 0`).
- **47 «Problemas del Bosque»**: el `spoken` es la única vía de entender el
  problema; mantenerlo bajo 15 palabras (§2.11).

---

### Fase 5 — Emociones, convivencia y música

**Suma: +5 pruebas → 88 totales.** ids **92-96** (emociones, convivencia y
música).

Va aquí y no antes porque **93 «¿Cómo Ayudo?» y 96 «Las Palabras Mágicas»
son las que más riesgo de ambigüedad tienen de todo el catálogo** (una
situación social casi siempre admite dos respuestas defendibles) y conviene
diseñarlas con calma. Regla estricta: los tres distractores tienen que ser
**claramente ajenos a la situación**, no "peores opciones".

Además, ampliar `EMOTIONS` de 6 a 12 (arregla la peor cifra del
diagnóstico: 43 % de repetición en la prueba 16).

---

### Fase 6 — Inversión de UI y las pruebas que dependen de ella

**Suma: +12 pruebas → 100 totales.** ids **48-56** (formas y espacio, 9),
**63**, **64**, **67**.

Trabajo de UI (§2.7), en este orden:
1. `scale` ampliada (`types.ts`, `OptionButton.tsx`) → 64, 67.
2. `Shape` con `fill` (`Shape.tsx`, `types.ts`, `OptionButton.tsx`,
   `WorksheetOption`) → 54, y de paso la prueba 5 pasa de 6 a 36 ejercicios.
3. `MemoryGame` con `pool` y `pairCount` (`MemoryGame.tsx`) → 63.
4. `scene` (`types.ts`, `PromptView.tsx`, `OptionButton.tsx`,
   `WorksheetOption`) → 48-51. **Es lo más caro del plan (~130 líneas) y lo
   último precisamente por eso.**

**Riesgos:** *alto en UI, bajo en datos*. `scene` hay que probarlo a 360 px
y en la ficha impresa (blanco y negro). Si sale mal, se puede recortar a
dos pruebas (dentro/fuera y encima/debajo) sin perder el resto del plan.

**Hecho cuando:** 100 pruebas, `scene` legible a 360 px y en la ficha
impresa, y el guard `never` de `PromptView` compilando.

---

### Fase 7 — Profundidad (palanca B) y cierre de deuda

Sin pruebas nuevas; multiplica lo que hay.

- Ampliar pools: `EMOTIONS` 6→12 (ya en fase 5), `COLORS` 9→12,
  `ANIMAL_SOUNDS` 10→16, `ROUTINE_STEPS` 7→12, `SHAPE_OBJECTS` 14→30,
  `CRITTERS` 30→50, `RHYME_FAMILIES` 6→14, `COUNTABLES` 12→20.
  **Efecto medido esperado:** las 6 pruebas de `VARIETY_DEBT` pasan de 6-14
  ejercicios a 25-40.
- `tierFor` de 0-2 a **0-4** (`progress.ts:101`: `Math.min(…, 4)`) y ampliar
  los rangos de los 5 generadores numéricos + los ~12 nuevos que usan `tier`.
- **Variantes internas**: que un mismo generador rote entre 2-3
  formulaciones (p. ej. la 74 pregunta unas veces «¿dónde vive el pez?» y
  otras «¿quién vive en el mar?»). ~25 líneas por prueba, ×2-3 la variedad
  percibida.
- Vaciar `VARIETY_DEBT` y subir el umbral del test de variedad.
- **Repaso adaptativo**: `Progress.stats?: Record<number, {ok, ko}>`
  (migración aditiva) + un modo que priorice lo que más falla.
- Valorar `roundsToWin: 4` — solo ahora que los pools lo aguantan.

---

### 5.1 Paralelización sin conflictos

**Punto caliente:** hoy `catalog.ts`, `data.ts` y `generators.ts` son tres
ficheros únicos; dos agentes escribiendo a la vez chocan en cada uno.

**La fase 1 lo resuelve estructuralmente** con el troceado por mundo. A
partir de ahí, un lote de contenido = **3 ficheros nuevos propios + 1 línea
en cada barril**:

```
src/lib/games/
├── data/index.ts          ← barril: 1 línea por mundo   (punto de conflicto trivial)
├── data/letras.ts         ← propiedad exclusiva de un agente
├── data/natura.ts
├── generators/index.ts    ← barril
├── generators/factories.ts ← compartido: CONGELADO tras la fase 1
├── generators/letras.ts
├── generators/natura.ts
├── catalog/index.ts       ← barril + WORLDS
├── catalog/letras.ts
└── catalog/natura.ts
```

Reglas para agentes en paralelo:

1. **Rangos de id reservados** (ya asignados en §4.4). Un agente no toca
   ids fuera de su rango. Los huecos son seguros **solo después** del
   arreglo de `sanitize` de la fase 1.
2. **Un agente = un mundo = tres ficheros nuevos.** Nunca dos agentes en el
   mismo mundo.
3. **Los barriles se editan al final**, en una línea, y son la única fuente
   de conflicto: un conflicto de una línea en un `export * from './x'` se
   resuelve solo.
4. **`factories.ts` se congela** al terminar la fase 1. Si un mundo necesita
   una fábrica nueva, la pone en **su propio** `generators/<mundo>.ts`; se
   promociona a `factories.ts` más tarde, en un PR aparte.
5. **`README.md` es el segundo punto caliente.** Sustituir la tabla plana de
   19 filas (`README.md:27-38`) por **una tabla de 11 filas, una por mundo**
   («qué trabaja» + rango de ids). Así un lote de contenido toca una sola
   celda en vez de añadir 20 filas. Actualizar también
   `docs/adding-a-prueba.md` paso 5.
6. **`STICKERS`** se trocea igual: `catalog/<mundo>.ts` exporta sus
   `GameDefinition[]` **y** sus `Sticker[]`.

**Qué puede ir en paralelo:**

| Fases | ¿Paralelo? | Motivo |
| --- | --- | --- |
| 1 | **No.** Agente único | Toca todo; es el prerrequisito de todos |
| 2, 3 | Sí, entre sí | La 2 toca `catalog/especial.ts` + `progress.ts`; la 3 solo mundos de contenido |
| 3, 4, 5 | **Sí, tres agentes a la vez** | Mundos disjuntos, rangos de id disjuntos, ficheros disjuntos |
| 6 | **No.** Agente único | Toca `types.ts`, `PromptView`, `OptionButton`, `Shape`, `MemoryGame`: colisiona con cualquiera |
| 7 | Sí, por mundo | Solo `data/<mundo>.ts` |

Camino más corto a "mucho contenido ya": **fase 1 → (2 ∥ 3 ∥ 4 ∥ 5) → 6 →
7**. Con las fases 3-5 en paralelo, se llega a **88 pruebas en cuatro
tandas de trabajo** en vez de siete.

---

## 6. Resumen de cifras

| Momento | Pruebas | Rondas de primera pasada | Ejercicios distintos (aprox.) |
| --- | ---: | ---: | ---: |
| Hoy | 19 | 56 | ~4.450 (~550 sin contar Patrones) |
| Tras fase 1 | 40 | 119 | ~1.200 sin Patrones |
| Tras fase 2 | 40 + 2 modos | 119 + ilimitado | ilimitado por combinatoria diaria |
| Tras fases 3-5 | 88 | 263 | ~2.800 sin Patrones |
| Tras fase 6 | 100 | 296 + 2 tableros de memoria | ~3.100 sin Patrones |
| Tras fase 7 | 100 | 296 (o ~395 con `roundsToWin: 4`) | ~8.000-10.000 |

Y con la Aventura del Día (fase 2), una sesión distinta garantizada **cada
día, indefinidamente**, sin escribir una sola prueba más.
