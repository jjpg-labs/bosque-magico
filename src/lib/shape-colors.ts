/**
 * Los colores con los que puede pintarse una figura geométrica.
 *
 * Vive fuera de `Shape.tsx` y de `data/formas.ts` porque lo necesitan los
 * dos: el componente para pintar y el generador para nombrar el color en el
 * enunciado. Con dos listas separadas, añadir un color en un sitio y no en el
 * otro daría figuras del color por defecto y dos opciones idénticas.
 */
export const SHAPE_FILLS = {
  rojo: '#ef4444',
  naranja: '#f97316',
  amarillo: '#eab308',
  verde: '#22c55e',
  azul: '#3b82f6',
  morado: '#a855f7',
} as const;

export type ShapeColor = keyof typeof SHAPE_FILLS;

export const SHAPE_COLOR_NAMES = Object.keys(SHAPE_FILLS) as ShapeColor[];
