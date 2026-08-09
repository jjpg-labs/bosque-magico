/** Pruebas y pegatinas del mundo «La Ciudad de los Oficios». */

import { genJobTools, genJobs, genTownPlaces, genTransportZones } from '../generators';
import type { GameDefinition, Sticker } from '../types';

export const OFICIOS_GAMES: readonly GameDefinition[] = [
  {
    id: 97,
    title: '¿Quién Lo Hace?',
    desc: 'Cada oficio con su herramienta',
    icon: '🧰',
    cat: 'Oficios',
    world: 'oficios',
    kind: 'choice',
    roundsToWin: 3,
    generate: genJobTools,
  },
  {
    id: 98,
    title: 'Los Oficios del Pueblo',
    desc: '¿A qué se dedica cada persona?',
    icon: '👩‍⚕️',
    cat: 'Oficios',
    world: 'oficios',
    kind: 'choice',
    roundsToWin: 3,
    generate: genJobs,
  },
  {
    id: 99,
    title: 'Por Tierra, Mar o Aire',
    desc: '¿Por dónde va este transporte?',
    icon: '✈️',
    cat: 'Transporte',
    world: 'oficios',
    kind: 'choice',
    roundsToWin: 3,
    generate: genTransportZones,
  },
  {
    // El plan pedía aquí «Vamos de Viaje» (destino → transporte), pero elegir
    // el transporte de un destino admite más de una respuesta buena: a la
    // playa se puede ir en coche, en tren y en autobús. Los sitios del pueblo
    // enseñan el mismo vocabulario y sí tienen respuesta única.
    id: 100,
    title: 'Los Sitios del Pueblo',
    desc: 'El cole, el parque, el hospital…',
    icon: '🏘️',
    cat: 'Pueblo',
    world: 'oficios',
    kind: 'choice',
    roundsToWin: 3,
    generate: genTownPlaces,
  },
];

export const OFICIOS_STICKERS: readonly Sticker[] = [
  { gameId: 97, name: 'Bombera Valiente', icon: '👩‍🚒' },
  { gameId: 98, name: 'Cocinero Chef', icon: '👨‍🍳' },
  { gameId: 99, name: 'Avioncito Viajero', icon: '🛩️' },
  { gameId: 100, name: 'Casita del Pueblo', icon: '🏘️' },
];
