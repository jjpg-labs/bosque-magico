/**
 * Cómo se reparten los botones de respuesta según cuántos haya.
 *
 * En móvil siempre dos columnas, que es lo que cabe con botones grandes de
 * tocar. En pantalla ancha se busca que la última fila no quede coja: con
 * cinco o seis opciones, tres columnas reparten mejor que cuatro.
 *
 * El número de opciones no es fijo: sube con el nivel de la prueba, de cuatro
 * a seis.
 */
export function optionGridClass(count: number): string {
  if (count <= 2) return 'grid-cols-2';
  if (count === 3) return 'grid-cols-3';
  if (count === 4) return 'grid-cols-2 sm:grid-cols-4';
  return 'grid-cols-2 sm:grid-cols-3';
}
