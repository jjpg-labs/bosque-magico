/** La tabla de mundos del mapa. */

import type { World, WorldId } from '../types';

/**
 * Los mundos del mapa, en el orden en que se pintan.
 *
 * Cuatro están abiertos de salida (letras, números, formas y animales), así
 * que siempre hay varias pruebas disponibles a la vez: nunca se puede quedar
 * atascada detrás de una prueba concreta que no le apetezca ese día.
 */
export const WORLDS: readonly World[] = [
  {
    id: 'letras',
    name: 'El Claro de las Letras',
    icon: '🔤',
    desc: 'Letras, sonidos y palabras',
    bg: 'bg-sky-100',
    color: 'text-sky-700',
    border: 'border-sky-300',
    unlock: { kind: 'always' },
  },
  {
    id: 'numeros',
    name: 'El Río de los Números',
    icon: '🔢',
    desc: 'Contar y conocer los números',
    bg: 'bg-indigo-100',
    color: 'text-indigo-700',
    border: 'border-indigo-300',
    unlock: { kind: 'always' },
  },
  {
    id: 'cuentas',
    name: 'La Cueva de las Cuentas',
    icon: '➕',
    desc: 'Sumar, restar y repartir',
    bg: 'bg-violet-100',
    color: 'text-violet-700',
    border: 'border-violet-300',
    unlock: { kind: 'world', world: 'numeros', count: 3 },
  },
  {
    id: 'formas',
    name: 'La Montaña de las Formas',
    icon: '🔷',
    desc: 'Figuras, colores y sitios',
    bg: 'bg-cyan-100',
    color: 'text-cyan-700',
    border: 'border-cyan-300',
    unlock: { kind: 'always' },
  },
  {
    id: 'logica',
    name: 'El Laberinto de la Lógica',
    icon: '🧩',
    desc: 'Patrones, parejas y clasificar',
    bg: 'bg-purple-100',
    color: 'text-purple-700',
    border: 'border-purple-300',
    unlock: { kind: 'world', world: 'formas', count: 3 },
  },
  {
    id: 'medidas',
    name: 'El Prado de las Medidas',
    icon: '📏',
    desc: 'Comparar, medir y el paso del tiempo',
    bg: 'bg-teal-100',
    color: 'text-teal-700',
    border: 'border-teal-300',
    unlock: { kind: 'world', world: 'numeros', count: 3 },
  },
  {
    id: 'natura',
    name: 'El Bosque de los Animales',
    icon: '🦊',
    desc: 'Animales, plantas y naturaleza',
    bg: 'bg-emerald-100',
    color: 'text-emerald-700',
    border: 'border-emerald-300',
    unlock: { kind: 'always' },
  },
  {
    id: 'cuerpo',
    name: 'La Casa de los Peques',
    icon: '🧒',
    desc: 'El cuerpo, la comida y los hábitos',
    bg: 'bg-rose-100',
    color: 'text-rose-700',
    border: 'border-rose-300',
    unlock: { kind: 'world', world: 'natura', count: 3 },
  },
  {
    id: 'emociones',
    name: 'La Plaza de las Emociones',
    icon: '💛',
    desc: 'Emociones, amigos y música',
    bg: 'bg-amber-100',
    color: 'text-amber-700',
    border: 'border-amber-300',
    unlock: { kind: 'always' },
  },
  {
    id: 'oficios',
    name: 'La Ciudad de los Oficios',
    icon: '🚂',
    desc: 'Oficios y transportes',
    bg: 'bg-orange-100',
    color: 'text-orange-700',
    border: 'border-orange-300',
    unlock: { kind: 'world', world: 'cuerpo', count: 3 },
  },
  {
    id: 'especial',
    name: 'La Torre del Trofeo',
    icon: '🏆',
    desc: 'Las pruebas más difíciles de todas',
    bg: 'bg-yellow-100',
    color: 'text-yellow-700',
    border: 'border-yellow-400',
    unlock: { kind: 'total', count: 20 },
  },
];

export function findWorld(id: WorldId): World | undefined {
  return WORLDS.find((world) => world.id === id);
}
