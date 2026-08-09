---
name: nueva-prueba
description: Añade una nueva prueba (mini-juego) al catálogo de El Bosque Mágico siguiendo la arquitectura de generadores tipados del proyecto. Usar cuando pidan crear, añadir o diseñar una prueba, lección, mini-juego o ejercicio nuevo para el juego.
---

Vas a añadir una prueba nueva a El Bosque Mágico de los Bichitos.

1. Lee **`docs/adding-a-prueba.md`** entero — es la receta completa y la
   única fuente de verdad del proyecto para esto. Síguela al pie de la
   letra: en qué mundo va la prueba y con qué id, dónde va el contenido
   nuevo (`data/<mundo>.ts`), cómo se escribe el generador
   (`generators/<mundo>.ts`), cómo se registra (`catalog/<mundo>.ts` más una
   línea en cada barril), y cuándo hace falta un test propio además del
   barrido genérico.

2. Si no tienes claro cuál es la idea concreta de la prueba (qué pregunta
   hace, qué trabaja: letras, números, lógica, emociones...), pregúntalo
   antes de escribir código. Decide también **a qué mundo pertenece**.

3. **Empieza por las fábricas.** Mira la tabla de las ocho fábricas de
   `src/lib/games/generators/factories.ts` en la guía y usa la que encaje:
   es el camino por defecto, y garantiza por construcción que hay una sola
   respuesta correcta y que ninguna opción repite lo que se ve. Solo escribe
   un generador a mano si ninguna sirve — y entonces ponlo en tu
   `generators/<mundo>.ts`, nunca en `factories.ts`, que está congelado.

4. Cuida el contenido antes de darlo por bueno: respuesta única e
   inequívoca (repasa las trampas de la guía), español de España, emoji
   Unicode ≤ 12.0 legible a 32 px, `spoken` sin emojis ni símbolos y por
   debajo de 15 palabras, y tono siempre amable.

5. No reasignes nunca un id ya usado ni retires una prueba: se perderían
   pegatinas ya ganadas. No pongas `bg` ni `color` en la pegatina nueva: se
   heredan del mundo.

6. Antes de dar la tarea por terminada, ejecuta y confirma que pasan los
   cuatro comandos:

   ```bash
   npm run lint && npm run typecheck && npm test && npm run build
   ```

   No informes de éxito si alguno falla — corrígelo primero.

7. Recuerda añadir el id de la prueba a la tabla de mundos de `README.md`.
