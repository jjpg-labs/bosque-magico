/**
 * Genera los iconos PNG de la PWA a partir de assets/icon.svg.
 *
 *   npm run icons
 *
 * Se ejecuta a mano cuando cambia el icono; los PNG resultantes se versionan
 * para que ni el build ni el despliegue necesiten sharp.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(resolve(root, 'assets/icon.svg'));

/** `maskable` deja margen para que Android pueda recortar el icono en círculo. */
const TARGETS = [
  { file: 'public/icons/icon-192.png', size: 192, padding: 0 },
  { file: 'public/icons/icon-512.png', size: 512, padding: 0 },
  { file: 'public/icons/icon-maskable-512.png', size: 512, padding: 54 },
  { file: 'public/icons/apple-touch-icon.png', size: 180, padding: 0 },
];

await mkdir(resolve(root, 'public/icons'), { recursive: true });

for (const { file, size, padding } of TARGETS) {
  const inner = size - padding * 2;
  let image = sharp(source, { density: 512 }).resize(inner, inner);

  if (padding > 0) {
    image = image.extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: '#059669',
    });
  }

  const png = await image.png().toBuffer();
  await writeFile(resolve(root, file), png);
  console.log(`✓ ${file} (${size}×${size})`);
}
