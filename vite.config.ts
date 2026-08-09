// `vitest/config` en lugar de `vite`: es lo que tipa la clave `test` de abajo.
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * `BASE_PATH` permite servir la app desde un subdirectorio (GitHub Pages la
 * publica en /<repo>/). En Netlify, Vercel o Cloudflare Pages se deja sin
 * definir y queda en '/'.
 */
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'El Bosque Mágico de los Bichitos',
        short_name: 'Bosque Mágico',
        description:
          'Juego educativo en español para peques: letras, números, sumas, formas y lógica.',
        lang: 'es',
        dir: 'ltr',
        categories: ['education', 'kids', 'games'],
        start_url: base,
        scope: base,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#fffbeb',
        theme_color: '#059669',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Se precachean también las fuentes: es lo que permite jugar sin red.
        globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2}'],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    /**
     * Cinco segundos (el defecto) se quedan cortos en el runner de CI.
     *
     * Los tests de `ChoiceGame` y de la maratón esperan de verdad la pausa de
     * 1,1 s que hay tras acertar —está puesta para que dé tiempo a ver el
     * acierto—, así que tres rondas son más de tres segundos de reloj. En
     * local van sobrados; en CI, con la máquina compartida, no.
     */
    testTimeout: 20000,
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/test/**', 'src/main.tsx', 'src/**/*.d.ts'],
    },
  },
});
