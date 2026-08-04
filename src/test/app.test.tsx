import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { ChoiceGame } from '../components/games/ChoiceGame';
import { seededRng } from '../lib/random';
import type { Round } from '../lib/games/types';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

const ROUND: Round = {
  question: '¿Con qué letra empieza Abeja?',
  spoken: '¿Con qué letra empieza Abeja?',
  prompt: { kind: 'emoji-single', item: '🐝' },
  options: [
    { id: 'a', label: 'A', display: { kind: 'text', text: 'A' }, correct: true },
    { id: 'm', label: 'M', display: { kind: 'text', text: 'M' }, correct: false },
  ],
};

describe('ChoiceGame', () => {
  it('avanza solo cuando se acierta y llama a onWin al final', async () => {
    const user = userEvent.setup();
    const onWin = vi.fn();

    render(
      <ChoiceGame
        generate={() => ROUND}
        roundsToWin={2}
        onSpeak={vi.fn()}
        onWin={onWin}
        rng={seededRng(1)}
      />,
    );

    // Fallar no supera la prueba ni avanza de ronda.
    await user.click(screen.getByRole('button', { name: 'M' }));
    expect(onWin).not.toHaveBeenCalled();

    // El avance de ronda lleva una pausa deliberada (ADVANCE_DELAY_MS), más
    // larga que el timeout por defecto de waitFor.
    await user.click(screen.getByRole('button', { name: 'A' }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveAccessibleName('Ronda 2 de 2'), {
      timeout: 3000,
    });
    expect(onWin).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'A' }));
    await waitFor(() => expect(onWin).toHaveBeenCalledTimes(1), { timeout: 3000 });
  });

  it('desactiva la opción fallada para poder descartarla', async () => {
    const user = userEvent.setup();

    render(
      <ChoiceGame
        generate={() => ROUND}
        roundsToWin={1}
        onSpeak={vi.fn()}
        onWin={vi.fn()}
        rng={seededRng(1)}
      />,
    );

    const wrong = screen.getByRole('button', { name: 'M' });
    await user.click(wrong);
    expect(wrong).toBeDisabled();
    expect(screen.getByRole('button', { name: 'A' })).toBeEnabled();
  });
});

describe('App', () => {
  it('muestra el mapa con las 19 pruebas', async () => {
    render(<App />);
    expect(await screen.findByText('¡El Mapa del Bosque! 🌳')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^Prueba \d+:/ })).toHaveLength(19);
  });

  it('empieza sin pegatinas y solo con la primera prueba abierta', async () => {
    render(<App />);

    expect(await screen.findByRole('button', { name: /Álbum \(0\/19\)/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Prueba 1:.*Disponible$/ })).toBeEnabled();
    expect(screen.getByRole('button', { name: /^Prueba 2:.*Bloqueada$/ })).toBeDisabled();
  });

  it('recupera el progreso guardado al arrancar', async () => {
    localStorage.setItem(
      'bosque_magico_progress_v2',
      JSON.stringify({ version: 2, completed: [1, 2] }),
    );

    render(<App />);

    expect(await screen.findByRole('button', { name: /Álbum \(2\/19\)/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Prueba 3:.*Disponible$/ })).toBeEnabled();
  });

  it('el álbum solo enseña las pegatinas ganadas', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      'bosque_magico_progress_v2',
      JSON.stringify({ version: 2, completed: [1] }),
    );

    render(<App />);
    await user.click(await screen.findByRole('button', { name: /Álbum/ }));

    expect(screen.getByText('Mariquita Risueña')).toBeInTheDocument();
    // La pegatina 2 no se ha ganado: aparece como incógnita, no con su nombre.
    expect(screen.queryByText('Oruga Saltarina')).not.toBeInTheDocument();
    expect(screen.getByText('Prueba 2')).toBeInTheDocument();
  });
});
