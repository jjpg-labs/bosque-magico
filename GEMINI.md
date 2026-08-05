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

## Añadir una prueba nueva

@docs/adding-a-prueba.md

## Notas propias de Gemini CLI

- El comando `/nueva-prueba <idea>` (`.gemini/commands/nueva-prueba.toml`)
  sigue esta misma receta con un solo paso — prefiérelo si el usuario pide
  una prueba nueva en lenguaje natural.
- Ejecuta siempre `npm run lint && npm run typecheck && npm test && npm run
  build` antes de dar una tarea por terminada. No se corren solos: hazlo tú
  explícitamente como último paso, y si algo falla, arréglalo antes de
  terminar.
