import type { ReactNode } from 'react';
import { SHAPE_FILLS } from '../lib/shape-colors';
import type { ShapeColor } from '../lib/shape-colors';
import type { ShapeName } from '../lib/games/types';

/**
 * Cada figura, dibujada en SVG y no con un emoji: los emojis de figuras
 * geométricas cambian de aspecto en cada sistema, y aquí la forma **es** la
 * respuesta.
 *
 * `fill` es el color por defecto de la figura. Se puede sobrescribir desde
 * fuera para las pruebas que preguntan por el color, y por eso el color no
 * está metido dentro del `path`.
 */
const SHAPES: Record<ShapeName, { fill: string; render: (fill: string) => ReactNode }> = {
  círculo: {
    fill: '#0ea5e9',
    render: (fill) => <circle cx="50" cy="50" r="42" fill={fill} />,
  },
  cuadrado: {
    fill: '#f59e0b',
    render: (fill) => <rect x="12" y="12" width="76" height="76" rx="6" fill={fill} />,
  },
  triángulo: {
    fill: '#10b981',
    render: (fill) => <path d="M 50 12 L 90 84 L 10 84 Z" fill={fill} />,
  },
  estrella: {
    fill: '#eab308',
    render: (fill) => (
      <path
        d="M 50 8 L 61 38 L 93 38 L 67 57 L 77 88 L 50 69 L 23 88 L 33 57 L 7 38 L 39 38 Z"
        fill={fill}
      />
    ),
  },
  corazón: {
    fill: '#ec4899',
    render: (fill) => (
      <path
        d="M 50 86 C 20 64 8 46 8 33 C 8 20 18 12 29 12 C 38 12 45 17 50 25 C 55 17 62 12 71 12 C 82 12 92 20 92 33 C 92 46 80 64 50 86 Z"
        fill={fill}
      />
    ),
  },
  rombo: {
    fill: '#8b5cf6',
    render: (fill) => <path d="M 50 8 L 90 50 L 50 92 L 10 50 Z" fill={fill} />,
  },
  rectángulo: {
    fill: '#f97316',
    render: (fill) => <rect x="6" y="28" width="88" height="44" rx="6" fill={fill} />,
  },
  óvalo: {
    fill: '#14b8a6',
    render: (fill) => <ellipse cx="50" cy="50" rx="44" ry="30" fill={fill} />,
  },
  pentágono: {
    fill: '#6366f1',
    render: (fill) => <path d="M 50 8 L 92 39 L 76 88 L 24 88 L 8 39 Z" fill={fill} />,
  },
  hexágono: {
    fill: '#ef4444',
    render: (fill) => <path d="M 50 6 L 89 28 L 89 72 L 50 94 L 11 72 L 11 28 Z" fill={fill} />,
  },
};

interface ShapeProps {
  shape: ShapeName;
  className?: string;
  /** Nombre del color en español. Si no se pasa, la figura usa el suyo. */
  color?: ShapeColor;
}

export function Shape({ shape, className = 'w-16 h-16', color }: ShapeProps) {
  const spec = SHAPES[shape];
  const fill = (color && SHAPE_FILLS[color]) ?? spec.fill;

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label={color ? `${shape} ${color}` : shape}
      focusable="false"
    >
      {spec.render(fill)}
    </svg>
  );
}
