import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MarathonGame } from '../components/games/MarathonGame';
import { seededRng } from '../lib/random';
import type { Round } from '../lib/games/types';

/** Un generador de juguete: la respuesta buena es siempre «A». */
function ronda(n: number): Round {
  return {
    question: `Pregunta ${n}`,
    spoken: `Pregunta ${n}`,
    prompt: { kind: 'none' },
    options: [
      { id: 'a', label: 'A', display: { kind: 'text', text: 'A' }, correct: true },
      { id: 'm', label: 'M', display: { kind: 'text', text: 'M' }, correct: false },
    ],
  };
}

function renderMaraton(props: Partial<Parameters<typeof MarathonGame>[0]> = {}) {
  let n = 0;
  const onWin = vi.fn();
  const onExit = vi.fn();
  const onRecord = vi.fn();

  render(
    <MarathonGame
      generate={() => ronda(n++)}
      roundsToWin={2}
      onSpeak={vi.fn()}
      onWin={onWin}
      onExit={onExit}
      onRecord={onRecord}
      rng={seededRng(1)}
      {...props}
    />,
  );

  return { onWin, onExit, onRecord };
}

/**
 * Acierta y espera a que aparezca la ronda siguiente.
 *
 * Tras acertar hay una pausa deliberada (`ADVANCE_DELAY_MS`) con los botones
 * bloqueados para que dé tiempo a ver el acierto; sin esperarla, el clic
 * siguiente se ignora.
 */
async function acertar(user: ReturnType<typeof userEvent.setup>, siguiente: number) {
  await user.click(screen.getByRole('button', { name: 'A' }));
  await waitFor(() => expect(screen.getByText(`Pregunta ${siguiente}`)).toBeInTheDocument(), {
    timeout: 3000,
  });
}

describe('Maratón Amable', () => {
  it('cuenta los aciertos y sigue después de ganar la pegatina', async () => {
    const user = userEvent.setup();
    const { onWin } = renderMaraton();

    await acertar(user, 1);
    expect(screen.getByRole('status')).toHaveTextContent('Aciertos: 1');

    await acertar(user, 2);
    expect(onWin).toHaveBeenCalledTimes(1);

    // La pegatina se gana una vez y la maratón continúa: el premio no puede
    // ser el motivo para dejar de jugar.
    await acertar(user, 3);
    expect(screen.getByRole('status')).toHaveTextContent('Aciertos: 3');
    expect(onWin).toHaveBeenCalledTimes(1);
  });

  it('un fallo no termina la partida ni resta aciertos', async () => {
    const user = userEvent.setup();
    const { onExit } = renderMaraton();

    await acertar(user, 1);

    await user.click(screen.getByRole('button', { name: 'M' }));
    expect(screen.getByRole('status')).toHaveTextContent('Aciertos: 1');
    expect(onExit).not.toHaveBeenCalled();
    // Se puede seguir intentando la misma ronda.
    expect(screen.getByRole('button', { name: 'A' })).toBeEnabled();
  });

  it('«Ya está» sale y guarda los aciertos de la tanda', async () => {
    const user = userEvent.setup();
    const { onExit, onRecord } = renderMaraton();

    await acertar(user, 1);

    await user.click(screen.getByRole('button', { name: /Ya está/ }));
    expect(onRecord).toHaveBeenCalledWith(1);
    expect(onExit).toHaveBeenCalledTimes(1);
  });

  it('enseña el récord anterior para poder superarlo', () => {
    renderMaraton({ best: 9 });
    expect(screen.getByRole('status')).toHaveTextContent('Tu récord: 9');
  });
});
