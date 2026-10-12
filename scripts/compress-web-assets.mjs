import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const assets = [
  ['public/assets/ankou-board.png', 'public/assets/web/ankou-board.jpg'],
  ['public/assets/ankou-cultural-design.jpg', 'public/assets/web/ankou-cultural-design.jpg'],
  ['public/assets/ankou-calendar.jpg', 'public/assets/web/ankou-calendar.jpg'],
  ['public/assets/bole-brand-operations.jpg', 'public/assets/web/bole-brand-operations.jpg'],
  ['public/assets/ankou-exhibition-board.jpg', 'public/assets/web/ankou-exhibition-board.jpg'],
];

await mkdir('public/assets/web', { recursive: true });

for (const [source, destination] of assets) {
  await sharp(source)
    .resize({ width: 2400, withoutEnlargement: true })
    .jpeg({ quality: 78, progressive: true, mozjpeg: true })
    .toFile(destination);
  console.log(`${source} -> ${destination}`);
}
