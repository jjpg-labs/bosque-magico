/** Contenido del mundo «La Plaza de las Emociones». */

import type { Item } from '../generators';

export interface Emotion {
  emoji: string;
  name: string;
  /**
   * Emociones que un peque podría defender igual de bien mirando esta cara.
   * Nunca se ofrecen como distractor: viendo 🤗 y con «Feliz» entre las
   * opciones, «Feliz» no es una respuesta equivocada, y marcársela como
   * fallo sería injusto.
   */
  conflicts?: readonly string[];
}

/** Caras con una emoción clara, para reconocer y nombrar cómo se siente alguien. */
export const EMOTIONS: readonly Emotion[] = [
  { emoji: '😀', name: 'Feliz', conflicts: ['Cariñoso', 'Tranquilo'] },
  { emoji: '😢', name: 'Triste' },
  { emoji: '😠', name: 'Enfadado' },
  { emoji: '😴', name: 'Con sueño', conflicts: ['Tranquilo', 'Aburrido'] },
  { emoji: '😲', name: 'Sorprendido', conflicts: ['Asustado'] },
  { emoji: '😨', name: 'Asustado', conflicts: ['Sorprendido'] },
  { emoji: '🤔', name: 'Pensativo' },
  { emoji: '🤗', name: 'Cariñoso', conflicts: ['Feliz'] },
  { emoji: '😌', name: 'Tranquilo', conflicts: ['Feliz', 'Con sueño'] },
  { emoji: '🥶', name: 'Con frío' },
  { emoji: '🥵', name: 'Con calor' },
  { emoji: '😐', name: 'Aburrido', conflicts: ['Tranquilo', 'Con sueño'] },
];

export function emotion(name: string): Emotion {
  const found = EMOTIONS.find((candidate) => candidate.name === name);
  if (!found) throw new Error(`EMOTIONS no tiene «${name}».`);
  return found;
}

// --- 92. ¿Cómo se siente ahora? ------------------------------------------------

/**
 * Situaciones cotidianas y qué se siente en ellas.
 *
 * Todas son cosas que le pasan a un peque de verdad, y ninguna da miedo: lo
 * peor que ocurre aquí es que se caiga un helado. Las tristes van siempre
 * emparejadas con algo que se arregla, porque la prueba se juega seguida.
 */
export const EMOTION_SITUATIONS: ReadonlyArray<{ text: string; feels: string }> = [
  { text: 'Le regalan un globo de colores', feels: 'Feliz' },
  { text: 'Se le cae el helado al suelo', feels: 'Triste' },
  { text: 'Su amigo le quita el juguete sin pedirlo', feels: 'Enfadado' },
  { text: 'Ha jugado toda la tarde y ya es de noche', feels: 'Con sueño' },
  { text: 'Abre la puerta y hay una fiesta esperándole', feels: 'Sorprendido' },
  { text: 'Suena un trueno muy fuerte en la calle', feels: 'Asustado' },
  { text: 'Está eligiendo qué dibujar en el papel', feels: 'Pensativo' },
  { text: 'Su abuela le da un abrazo muy grande', feels: 'Cariñoso' },
  { text: 'Escucha una canción suave antes de dormir', feels: 'Tranquilo' },
  { text: 'Sale a la nieve sin la bufanda', feels: 'Con frío' },
  { text: 'Corre por el parque en pleno verano', feels: 'Con calor' },
  { text: 'Lleva un rato esperando en la cola sin nada que hacer', feels: 'Aburrido' },
  { text: 'Se le rompe su dibujo favorito', feels: 'Triste' },
  { text: 'Le sale bien el puzle a la primera', feels: 'Feliz' },
  { text: 'Aparece un gatito donde no había nadie', feels: 'Sorprendido' },
  { text: 'Se acurruca con su peluche en el sofá', feels: 'Tranquilo' },
  { text: 'Le toca esperar su turno y no le dejan pasar', feels: 'Enfadado' },
  { text: 'Piensa qué nombre ponerle a su muñeco', feels: 'Pensativo' },
];

// --- 93. ¿Cómo ayudo? ------------------------------------------------------------

/**
 * Cada situación trae sus propias alternativas en vez de mezclarlas entre
 * situaciones: «ayudarle a levantarse» vale para media docena de casos, y
 * usarlo de distractor haría que hubiera dos respuestas buenas.
 *
 * Las alternativas no son crueldades, son cosas que un peque hace sin pensar:
 * seguir jugando, mirar para otro lado. La prueba enseña qué es lo amable, no
 * regaña por lo demás.
 */
export const KINDNESS: ReadonlyArray<{
  text: string;
  good: Item;
  others: readonly Item[];
}> = [
  {
    text: 'Tu amigo se ha caído en el parque',
    good: { emoji: '🤝', name: 'Ayudarle a levantarse' },
    others: [
      { emoji: '🏃', name: 'Seguir corriendo' },
      { emoji: '🙈', name: 'Mirar a otro lado' },
      { emoji: '🎈', name: 'Jugar con el globo' },
    ],
  },
  {
    text: 'Solo queda una galleta y sois dos',
    good: { emoji: '🍪', name: 'Partirla por la mitad' },
    others: [
      { emoji: '🏃', name: 'Salir corriendo con ella' },
      { emoji: '😴', name: 'Guardarla para dormir' },
      { emoji: '🧦', name: 'Meterla en el calcetín' },
    ],
  },
  {
    text: 'Otro niño quiere jugar y está solo',
    good: { emoji: '👋', name: 'Invitarle a jugar' },
    others: [
      { emoji: '🔇', name: 'No decirle nada' },
      { emoji: '🚪', name: 'Irse a otro sitio' },
      { emoji: '📺', name: 'Ponerse a ver la tele' },
    ],
  },
  {
    text: 'Se ha caído todo el puzle al suelo',
    good: { emoji: '🧩', name: 'Recogerlo entre los dos' },
    others: [
      { emoji: '🛋️', name: 'Sentarse en el sofá' },
      { emoji: '🙈', name: 'Mirar a otro lado' },
      { emoji: '🎨', name: 'Ponerse a pintar' },
    ],
  },
  {
    text: 'Tu hermano está usando el columpio',
    good: { emoji: '⏳', name: 'Esperar tu turno' },
    others: [
      { emoji: '💨', name: 'Empujarle para subir' },
      { emoji: '😠', name: 'Enfadarse muy fuerte' },
      { emoji: '📣', name: 'Gritar muy alto' },
    ],
  },
  {
    text: 'Tu amiga está triste en el recreo',
    good: { emoji: '🫂', name: 'Preguntarle qué le pasa' },
    others: [
      { emoji: '⚽', name: 'Seguir con el partido' },
      { emoji: '🔇', name: 'No decirle nada' },
      { emoji: '🏃', name: 'Irse corriendo' },
    ],
  },
  {
    text: 'Has acabado de merendar en el parque',
    good: { emoji: '🗑️', name: 'Tirar el papel a la papelera' },
    others: [
      { emoji: '🌿', name: 'Dejarlo en la hierba' },
      { emoji: '🧦', name: 'Metérselo en el bolsillo roto' },
      { emoji: '💨', name: 'Soltarlo al viento' },
    ],
  },
  {
    text: 'Un abuelito no llega al estante de arriba',
    good: { emoji: '🙋', name: 'Avisar a un mayor para ayudarle' },
    others: [
      { emoji: '🛒', name: 'Seguir con el carro' },
      { emoji: '🙈', name: 'Mirar a otro lado' },
      { emoji: '🍬', name: 'Coger caramelos' },
    ],
  },
  {
    text: 'Tu amigo te presta su coche favorito',
    good: { emoji: '💛', name: 'Darle las gracias y cuidarlo' },
    others: [
      { emoji: '🏃', name: 'Llevárselo corriendo' },
      { emoji: '📦', name: 'Guardarlo en tu caja' },
      { emoji: '🔇', name: 'No decir nada' },
    ],
  },
  {
    text: 'Estáis pintando y tu amiga no tiene rotulador',
    good: { emoji: '🖍️', name: 'Dejarle uno de los tuyos' },
    others: [
      { emoji: '🎨', name: 'Usarlos todos tú' },
      { emoji: '📦', name: 'Guardarlos en la caja' },
      { emoji: '🙈', name: 'Mirar a otro lado' },
    ],
  },
  {
    text: 'Habéis terminado de jugar y hay juguetes por el suelo',
    good: { emoji: '🧺', name: 'Recogerlos juntos' },
    others: [
      { emoji: '🛏️', name: 'Irse a la cama' },
      { emoji: '📺', name: 'Ponerse a ver la tele' },
      { emoji: '🚪', name: 'Salir de la habitación' },
    ],
  },
  {
    text: 'Tu amiga te está contando algo',
    good: { emoji: '👂', name: 'Escucharla hasta el final' },
    others: [
      { emoji: '📣', name: 'Hablar por encima' },
      { emoji: '🏃', name: 'Irse a jugar' },
      { emoji: '🎵', name: 'Ponerse a cantar' },
    ],
  },
];

// --- 94. Los instrumentos --------------------------------------------------------

/**
 * Instrumentos que se distinguen de un vistazo, con cómo suenan.
 *
 * Los emojis de instrumento son pocos, así que la prueba pregunta de dos
 * maneras —viendo el dibujo y escuchando el sonido— en vez de estirar la
 * lista con emojis que no se ven bien o que ni siquiera son instrumentos (el
 * micrófono, sin ir más lejos, no lo es).
 */
export const INSTRUMENTS: ReadonlyArray<Item & { sound: string }> = [
  { emoji: '🥁', name: 'El tambor', sound: 'Pom pom pom' },
  { emoji: '🎸', name: 'La guitarra', sound: 'Chan chan chan' },
  { emoji: '🎺', name: 'La trompeta', sound: 'Tururú' },
  { emoji: '🎻', name: 'El violín', sound: 'Ñiiii ñiiii' },
  { emoji: '🎹', name: 'El piano', sound: 'Plin plin plon' },
  { emoji: '🪕', name: 'El banjo', sound: 'Ping ping ping' },
  { emoji: '🎷', name: 'El saxofón', sound: 'Fuuu fuuu' },
  { emoji: '🪗', name: 'El acordeón', sound: 'Fa la fa la' },
  { emoji: '📯', name: 'La corneta', sound: 'Tuuu tuuu' },
  { emoji: '🔔', name: 'La campana', sound: 'Talán talán' },
];

// --- 96. Las palabras mágicas -----------------------------------------------------

/** Las cinco palabras y cuándo toca cada una. Una sola encaja en cada caso. */
export const MAGIC_WORDS: ReadonlyArray<{ text: string; word: string }> = [
  { text: 'Quieres que te pasen el agua', word: 'Por favor' },
  { text: 'Te han regalado un cuento', word: 'Gracias' },
  { text: 'Sin querer has pisado a alguien', word: 'Perdón' },
  { text: 'Llegas por la mañana al cole', word: 'Hola' },
  { text: 'Te vas del parque a casa', word: 'Adiós' },
  { text: 'Quieres coger un juguete que no es tuyo', word: 'Por favor' },
  { text: 'Tu amiga te ha ayudado a atarte los cordones', word: 'Gracias' },
  { text: 'Se te ha caído la torre que estaba haciendo tu hermano', word: 'Perdón' },
  { text: 'Entra alguien nuevo en la clase', word: 'Hola' },
  { text: 'Se acaba el cumpleaños y te recogen', word: 'Adiós' },
  { text: 'Quieres que te dejen sitio en la mesa', word: 'Por favor' },
  { text: 'Te han guardado un trozo de tarta', word: 'Gracias' },
];

export const MAGIC_WORD_LIST: readonly string[] = [
  'Por favor',
  'Gracias',
  'Perdón',
  'Hola',
  'Adiós',
];
