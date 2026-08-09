/**
 * Guard de exhaustividad para los `switch` sobre uniones discriminadas
 * (`Prompt['kind']`, `Option['display']['kind']`...).
 *
 * El proyecto no tiene `strict: true`, así que un `switch` al que le falta un
 * `case` devuelve `undefined` sin que se queje ni `tsc` ni oxlint: React lo
 * acepta y el enunciado simplemente no se pinta. Con esto, olvidar un `case`
 * al añadir un `kind` nuevo es un **error de compilación**, no un fallo mudo
 * que se descubre jugando.
 *
 * Devuelve `null` en vez de lanzar: si aun así llegara aquí en producción, es
 * preferible una ronda sin ilustración a una pantalla rota delante de la niña.
 */
export function unhandled(value: never): null {
  console.warn('Caso no contemplado:', value);
  return null;
}
