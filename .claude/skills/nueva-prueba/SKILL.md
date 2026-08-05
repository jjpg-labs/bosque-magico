---
name: nueva-prueba
description: Añade una nueva prueba (mini-juego) al catálogo de El Bosque Mágico siguiendo la arquitectura de generadores tipados del proyecto. Usar cuando pidan crear, añadir o diseñar una prueba, lección, mini-juego o ejercicio nuevo para el juego.
---

Vas a añadir una prueba nueva a El Bosque Mágico de los Bichitos.

1. Lee **`docs/adding-a-prueba.md`** entero — es la receta completa y la
   única fuente de verdad del proyecto para esto. Síguela al pie de la
   letra: dónde va el contenido nuevo (`data.ts`), cómo se escribe el
   generador (`generators.ts`), cómo se registra (`catalog.ts`), y cuándo
   hace falta un test propio además del barrido genérico.

2. Si no tienes claro cuál es la idea concreta de la prueba (qué pregunta
   hace, qué trabaja: letras, números, lógica, emociones...), pregúntalo
   antes de escribir código.

3. Implementa siguiendo exactamente el patrón de una prueba existente
   parecida (el propio `docs/adding-a-prueba.md` trae `genColors` como
   plantilla completa).

4. Antes de dar la tarea por terminada, ejecuta y confirma que pasan los
   cuatro comandos:

   ```bash
   npm run lint && npm run typecheck && npm test && npm run build
   ```

   No informes de éxito si alguno falla — corrígelo primero.

5. Recuerda actualizar la tabla de pruebas en `README.md`.
