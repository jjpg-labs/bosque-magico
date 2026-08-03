import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Fuente autoalojada: sin petición a Google Fonts, así la app funciona offline
// y no se filtra la IP de quien la usa a un tercero. Solo el subconjunto latino
// (el paquete completo arrastra también el hebreo, que aquí no se usa).
import '@fontsource/fredoka/latin-400.css';
import '@fontsource/fredoka/latin-600.css';
import '@fontsource/fredoka/latin-700.css';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
