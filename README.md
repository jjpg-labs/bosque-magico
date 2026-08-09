# 🌳 El Bosque Mágico de los Bichitos

Juego educativo en español para peques de 3 a 6 años: letras, números, sumas, restas,
formas geométricas, lógica, colores, sonidos, emociones y rimas, repartidos en 19
pruebas por **mundos**, con un álbum de pegatinas.

**Sin anuncios, sin cuentas, sin servidor y sin recogida de datos.** Se instala como
app en el móvil o la tablet y funciona sin conexión.

---

## Cómo se juega

Cada prueba del mapa plantea **preguntas generadas al azar**: la abeja no siempre
empieza por la misma letra ni hay siempre cinco mariquitas, así que no se puede
aprobar memorizando dónde está el botón bueno. Al superar las rondas de una prueba
se gana su pegatina y se abre la siguiente de su mundo.

El mapa se navega en **dos niveles**: primero los mundos, y al tocar uno, sus
pruebas. Cuatro mundos están abiertos desde el primer día y los demás se van
abriendo con el juego, así que siempre hay varias pruebas disponibles a la vez y
nunca se queda atascada detrás de una que no le apetezca ese día. El mundo en el
que iba aparece el primero y marcado.

Todas las instrucciones se **leen en voz alta** (síntesis de voz del navegador, en
español), porque a esa edad todavía no se lee. El botón 🔊 las repite.

Las pruebas con rango numérico (contar, sumas, restas, serie numérica, más/menos)
tienen **dificultad escalonada**: cada 3 partidas jugadas de la misma prueba el rango
sube un nivel (hasta 2 niveles por encima del inicial), así que sigue dando trabajo
según va creciendo quien juega.

| Mundo                          | Qué trabaja                                     | Pruebas   | Se abre al…            |
| ------------------------------ | ----------------------------------------------- | --------- | ---------------------- |
| 🔤 El Claro de las Letras      | Letra inicial, vocales y rimas                  | 1, 11, 17 | siempre abierto        |
| 🔢 El Río de los Números       | Contar y series numéricas                       | 2, 10     | siempre abierto        |
| ➕ La Cueva de las Cuentas     | Sumar y restar                                  | 3, 4      | 3 pruebas de números   |
| 🔷 La Montaña de las Formas    | Figuras geométricas y colores                   | 5, 12, 14 | siempre abierto        |
| 🧩 El Laberinto de la Lógica   | Patrones, clasificar el intruso y memoria       | 6, 7, 8   | 3 pruebas de formas    |
| 📏 El Prado de las Medidas     | Comparar cantidades y tamaños, rutina del día   | 9, 18, 19 | 3 pruebas de números   |
| 🦊 El Bosque de los Animales   | Sonidos de animales                             | 15        | siempre abierto        |
| 🧒 La Casa de los Peques       | Cuerpo, comida, higiene y seguridad             | —         | 3 pruebas de animales  |
| 💛 La Plaza de las Emociones   | Emociones y convivencia                         | 16        | siempre abierto        |
| 🚂 La Ciudad de los Oficios    | Oficios y transportes                           | —         | 3 pruebas de la casa   |
| 🏆 La Torre del Trofeo         | Desafío combinado con todo lo anterior          | 13        | 20 pruebas en total    |

Los mundos sin pruebas todavía no se pintan en el mapa: están reservados para el
contenido que viene. Las condiciones de apertura se recortan a las pruebas que
existen de verdad, así que ningún mundo queda cerrado por su propia condición.

### Fichas para imprimir

La sección 🖨️ genera fichas en papel usando **los mismos generadores** que el juego:
cada pulsación de «Otra ficha» produce seis ejercicios nuevos de la prueba elegida.

---

## Desarrollo

Requiere Node.js 20 o superior.

> ¿Quieres añadir una prueba nueva? La receta completa está en
> [`docs/adding-a-prueba.md`](docs/adding-a-prueba.md) — pensada tanto para
> seguirla a mano como para dársela a un asistente de IA (Claude, Gemini...).

```bash
npm install
npm run dev        # servidor de desarrollo
npm test           # tests (Vitest)
npm run typecheck  # comprobación de tipos
npm run lint       # oxlint
npm run build      # build de producción en dist/
npm run preview    # sirve dist/ en local
npm run icons      # regenera los iconos PNG desde assets/icon.svg
```

### Estructura

```
src/
├── lib/
│   ├── audio.ts              # efectos de sonido (Web Audio, un único contexto)
│   ├── speech.ts             # síntesis de voz en español
│   ├── progress.ts           # progreso en localStorage y desbloqueo por mundo
│   ├── random.ts             # aleatoriedad con semilla inyectable (tests)
│   └── games/
│       ├── types.ts          # Round, Option, Prompt, GameDefinition, World…
│       ├── data/             # el contenido, un fichero por mundo
│       │   ├── index.ts      #   barril: una línea por mundo
│       │   ├── comun.ts      #   lo compartido entre mundos
│       │   └── <mundo>.ts
│       ├── generators/       # cómo se arma cada pregunta
│       │   ├── index.ts      #   barril
│       │   ├── factories.ts  #   las 8 fábricas (API congelada)
│       │   ├── options.ts    #   piezas para montar las opciones
│       │   ├── rounds.ts     #   generateRounds y el dedupe por ejercicio
│       │   └── <mundo>.ts
│       └── catalog/          # qué pruebas hay y qué pegatina dan
│           ├── index.ts      #   barril: GAMES, STICKERS, nextGameId…
│           ├── worlds.ts     #   la tabla de mundos
│           └── <mundo>.ts
├── components/               # UI (mapa, juego, álbum, fichas, avatar)
├── hooks/useSpeech.ts
└── test/
```

Está troceado por mundo a propósito: un lote de contenido nuevo son tres ficheros
propios y una línea en cada barril, así que varias personas pueden escribir pruebas
a la vez sin pisarse.

Los generadores están separados de la interfaz: son funciones puras que reciben un
`rng`, así que los tests los ejecutan con **200 semillas distintas** y comprueban
que cada ronda tiene exactamente una respuesta correcta, que ninguna opción repite
lo que se ve, que la suma cuadra con las manzanas dibujadas, que la resta nunca da
negativo, etc. Y como la mayoría de las pruebas se montan con una de las **ocho
fábricas** de `factories.ts`, esos invariantes están garantizados por construcción
en vez de comprobados a posteriori.

---

## Despliegue

El build genera ficheros estáticos en `dist/`: sirve en cualquier hosting estático.

### Netlify

Ya configurado en `netlify.toml`. Conecta el repositorio y despliega, o bien:

```bash
npm run build
npx netlify deploy --prod --dir=dist
```

### Vercel

Ya configurado en `vercel.json`. Conecta el repositorio, o bien:

```bash
npm run build
npx vercel --prod
```

### Cloudflare Pages

Comando de build `npm run build`, directorio de salida `dist`.

### GitHub Pages

El workflow `.github/workflows/deploy-pages.yml` publica en cada push a `main`.
Hay que activarlo una vez en **Settings → Pages → Source: GitHub Actions**.

Como Pages sirve desde `/<nombre-del-repo>/`, el workflow pasa `BASE_PATH` para que
las rutas y el service worker apunten al subdirectorio correcto.

> Si despliegas a mano en un subdirectorio:
> `BASE_PATH=/mi-subdirectorio/ npm run build`

---

## Privacidad

Punto importante tratándose de una app infantil: **la app no recoge ningún dato**.

- No hay servidor, ni base de datos, ni API: todo se ejecuta en el navegador.
- No hay cuentas, registro ni inicio de sesión.
- No hay analítica, ni cookies, ni píxeles de seguimiento, ni anuncios.
- No hay peticiones a terceros: React, la fuente y el resto de recursos viajan en el
  propio despliegue. La fuente está autoalojada precisamente para no filtrar la IP de
  quien juega a Google Fonts.
- Lo único que se guarda es la lista de pruebas superadas y cuántas veces se ha
  jugado cada una (para la dificultad escalonada), en el `localStorage` del
  dispositivo. No sale de ahí y se borra con el botón «Borrar progreso» del pie.

Esto deja la app fuera del alcance de las obligaciones de consentimiento de COPPA y
del RGPD-K, que se activan cuando se recogen datos personales de menores. Ver
[PRIVACIDAD.md](PRIVACIDAD.md).

**Si algún día se añade analítica, publicidad o cuentas de usuario, esto deja de ser
cierto** y hará falta una política de privacidad real y consentimiento verificable de
madres, padres o tutores.

---

## Accesibilidad

- Se puede jugar entero con teclado; todos los controles tienen foco visible.
- Los botones llevan `aria-label` descriptivo y los cambios de ronda se anuncian.
- El zoom del navegador **no** está bloqueado.
- Se respeta `prefers-reduced-motion`: sin confeti ni animaciones para quien lo pida.
- Los fallos no penalizan: la opción errónea se atenúa y se anima a probar otra vez.

---

## Licencia

MIT — ver [LICENSE](LICENSE).
