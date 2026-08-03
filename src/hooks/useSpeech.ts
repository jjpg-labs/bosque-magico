import { useCallback, useEffect, useRef, useState } from 'react';
import { cancelSpeech, speak as speakText } from '../lib/speech';

/**
 * Envuelve la síntesis de voz y expone el texto que se está leyendo, para
 * mostrarlo también por escrito (la niña no lee aún, pero un adulto sí).
 */
export function useSpeech() {
  const [spokenText, setSpokenText] = useState('');
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimeout(clearTimerRef.current);
      cancelSpeech();
    };
  }, []);

  const speak = useCallback((text: string) => {
    clearTimeout(clearTimerRef.current);
    setSpokenText(text);

    void speakText(text, {
      onEnd: () => {
        if (!mountedRef.current) return;
        // El bocadillo se queda un momento más tras acabar la voz.
        clearTimerRef.current = setTimeout(() => {
          if (mountedRef.current) setSpokenText('');
        }, 1200);
      },
    });
  }, []);

  const stop = useCallback(() => {
    clearTimeout(clearTimerRef.current);
    cancelSpeech();
    setSpokenText('');
  }, []);

  return { speak, stop, spokenText };
}
