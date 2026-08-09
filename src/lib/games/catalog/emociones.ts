/** Pruebas y pegatinas del mundo «La Plaza de las Emociones». */

import {
  genClapRhythm,
  genEmotion,
  genEmotionSituation,
  genInstruments,
  genKindness,
  genMagicWords,
} from '../generators';
import type { GameDefinition, Sticker } from '../types';

export const EMOCIONES_GAMES: readonly GameDefinition[] = [
  {
    id: 16,
    title: '¿Cómo Se Siente?',
    desc: 'Reconoce las caras y sus emociones',
    icon: '😊',
    cat: 'Emociones',
    world: 'emociones',
    kind: 'choice',
    roundsToWin: 3,
    generate: genEmotion,
  },
  {
    id: 92,
    title: '¿Cómo se Siente Ahora?',
    desc: 'Escucha lo que pasa e imagina su cara',
    icon: '💭',
    cat: 'Emociones',
    world: 'emociones',
    kind: 'choice',
    roundsToWin: 3,
    generate: genEmotionSituation,
  },
  {
    id: 93,
    title: '¿Cómo Ayudo?',
    desc: 'Compartir, esperar el turno y ayudar',
    icon: '🤝',
    cat: 'Convivencia',
    world: 'emociones',
    kind: 'choice',
    roundsToWin: 3,
    generate: genKindness,
  },
  {
    id: 94,
    title: 'Los Instrumentos',
    desc: '¿Qué instrumento suena aquí?',
    icon: '🎺',
    cat: 'Música',
    world: 'emociones',
    kind: 'choice',
    roundsToWin: 3,
    generate: genInstruments,
  },
  {
    id: 95,
    title: 'El Ritmo de las Palmas',
    desc: 'Sigue el ritmo: fuerte, flojo, fuerte',
    icon: '👏',
    cat: 'Música',
    world: 'emociones',
    kind: 'choice',
    roundsToWin: 3,
    generate: genClapRhythm,
  },
  {
    id: 96,
    title: 'Las Palabras Mágicas',
    desc: 'Por favor, gracias y perdón',
    icon: '✨',
    cat: 'Convivencia',
    world: 'emociones',
    kind: 'choice',
    roundsToWin: 3,
    generate: genMagicWords,
  },
];

export const EMOCIONES_STICKERS: readonly Sticker[] = [
  { gameId: 16, name: 'Koala Cariñoso', icon: '🐨', bg: 'bg-cyan-100', color: 'text-cyan-600' },
  { gameId: 92, name: 'Nubecita Pensante', icon: '💭' },
  { gameId: 93, name: 'Manos Amigas', icon: '🤝' },
  { gameId: 94, name: 'Trompeta Alegre', icon: '🎺' },
  { gameId: 95, name: 'Palmas con Ritmo', icon: '👏' },
  { gameId: 96, name: 'Chispa Mágica', icon: '✨' },
];
