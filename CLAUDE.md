# El Bosque Mágico de los Bichitos

Juego educativo en español (3-6 años) como PWA estática: React + TypeScript +
Vite, sin servidor, sin cuentas, sin recogida de datos — ver
[`PRIVACIDAD.md`](PRIVACIDAD.md). El contenido del juego (pruebas, preguntas)
vive en `src/lib/games/` como generadores puros y deterministas, validados
por tests con 200 semillas.

## Comandos

```bash
npm run dev        # servidor de desarrollo
npm test           # tests (Vitest)
npm run typecheck  # tsc -b
npm run lint       # oxlint
npm run build      # build de producción en dist/
```

CI (`.github/workflows/ci.yml`) corre estos cuatro en cada PR — es la red de
seguridad final, no el único sitio donde deben pasar.

## Añadir una prueba nueva

@docs/adding-a-prueba.md

## Notas propias de Claude Code

- El comando `/nueva-prueba` (skill en `.claude/skills/nueva-prueba/`) sigue
  la misma receta de forma más guiada; úsalo si el usuario pide "añade una
  prueba sobre X" en vez de repetir la receta a mano.
- Antes de dar por terminado cualquier cambio en `src/lib/games/`, corre los
  cuatro comandos de verificación de arriba.
