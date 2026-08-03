import type { ShapeName } from '../lib/games/types';

const PATHS: Record<ShapeName, { d?: string; element?: 'circle' | 'rect'; fill: string }> = {
  círculo: { element: 'circle', fill: '#0ea5e9' },
  cuadrado: { element: 'rect', fill: '#f59e0b' },
  triángulo: { d: 'M 50 12 L 90 84 L 10 84 Z', fill: '#10b981' },
  estrella: {
    d: 'M 50 8 L 61 38 L 93 38 L 67 57 L 77 88 L 50 69 L 23 88 L 33 57 L 7 38 L 39 38 Z',
    fill: '#eab308',
  },
  corazón: {
    d: 'M 50 86 C 20 64 8 46 8 33 C 8 20 18 12 29 12 C 38 12 45 17 50 25 C 55 17 62 12 71 12 C 82 12 92 20 92 33 C 92 46 80 64 50 86 Z',
    fill: '#ec4899',
  },
  rombo: { d: 'M 50 8 L 90 50 L 50 92 L 10 50 Z', fill: '#8b5cf6' },
};

interface ShapeProps {
  shape: ShapeName;
  className?: string;
}

/** Figura geométrica dibujada en SVG (no emoji: se ve igual en todos los sistemas). */
export function Shape({ shape, className = 'w-16 h-16' }: ShapeProps) {
  const spec = PATHS[shape];

  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={shape} focusable="false">
      {spec.element === 'circle' && <circle cx="50" cy="50" r="42" fill={spec.fill} />}
      {spec.element === 'rect' && <rect x="12" y="12" width="76" height="76" rx="6" fill={spec.fill} />}
      {spec.d && <path d={spec.d} fill={spec.fill} />}
    </svg>
  );
}
