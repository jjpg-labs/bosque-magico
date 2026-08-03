# 🌳 El Bosque Mágico de los Bichitos

Juego educativo en español para peques de 4 a 6 años: letras, números, sumas, restas,
formas geométricas y lógica, repartidos en 13 pruebas con un álbum de pegatinas.

**Sin anuncios, sin cuentas, sin servidor y sin recogida de datos.** Se instala como
app en el móvil o la tablet y funciona sin conexión.

---

## Cómo se juega

Cada prueba del mapa plantea **preguntas generadas al azar**: la abeja no siempre
empieza por la misma letra ni hay siempre cinco mariquitas, así que no se puede
aprobar memorizando dónde está el botón bueno. Al superar las rondas de una prueba
se gana su pegatina y se abre la siguiente.

Todas las instrucciones se **leen en voz alta** (síntesis de voz del navegador, en
español), porque a esa edad todavía no se lee. El botón 🔊 las repite.

| Prueba | Qué trabaja                       | Prueba | Qué trabaja                           |
| ------ | --------------------------------- | ------ | ------------------------------------- |
| 1      | Letra inicial de una palabra      | 8      | Memoria (parejas)                     |
| 2      | Contar hasta 8                    | 9      | Comparar cantidades (más / menos)     |
| 3      | Sumas hasta 6                     | 10     | Serie numérica                        |
| 4      | Restas                            | 11     | Vocal inicial (conciencia fonológica) |
| 5      | Reconocer figuras geométricas     | 12     | Forma geométrica de objetos reales    |
| 6      | Patrones (ABAB, AABAAB, ABC)      | 13     | Desafío final combinado               |
| 7      | Clasificar y encontrar el intruso |        |                                       |

### Fichas para imprimir

La sección 🖨️ genera fichas en papel usando **los mismos generadores** que el juego:
cada pulsación de «Otra ficha» produce seis ejercicios nuevos de la prueba elegida.

---

## Desarrollo

Requiere Node.js 20 o superior.

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
│   ├── audio.ts          # efectos de sonido (Web Audio, un único contexto)
│   ├── speech.ts         # síntesis de voz en español
│   ├── progress.ts       # progreso en localStorage
│   ├── random.ts         # aleatoriedad con semilla inyectable (tests)
│   └── games/
│       ├── data.ts       # animales, palabras, formas, categorías
│       ├── generators.ts # un generador de preguntas por prueba
│       ├── catalog.ts    # las 13 pruebas y sus pegatinas
│       └── types.ts
├── components/           # UI (mapa, juego, álbum, fichas, avatar)
├── hooks/useSpeech.ts
└── test/
```

Los generadores están separados de la interfaz a propósito: son funciones puras que
reciben un `rng`, así que los tests los ejecutan con **200 semillas distintas** y
comprueban que cada ronda tiene exactamente una respuesta correcta, que la suma
cuadra con las manzanas dibujadas, que la resta nunca da negativo, etc.

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
- Lo único que se guarda es la lista de pruebas superadas, en el `localStorage` del
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
