import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
await mkdir(new URL('public/photos/responsive/', root), { recursive: true });
const manifest = {};
for (let i = 1; i <= 4; i++) {
  const src = `/photos/memory-${i}.jpg`;
  const input = await readFile(new URL(`public${src}`, root));
  const metadata = await sharp(input).metadata();
  const sources = [];
  for (const width of new Set([320, 560, Math.min(960, metadata.width)])) {
    if (width > metadata.width) continue;
    const path = `/photos/responsive/memory-${i}-${width}.webp`;
    await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 85 }).toFile(fileURLToPath(new URL(`public${path}`, root)));
    sources.push(`${path} ${width}w`);
  }
  manifest[src] = { width: metadata.width, height: metadata.height, srcSet: sources.join(', '), sha256: createHash('sha256').update(input).digest('hex') };
}
await writeFile(new URL('app/photo-manifest.json', root), JSON.stringify(manifest, null, 2) + '\n');
console.log('Prepared local responsive photos; original JPEGs unchanged.');
