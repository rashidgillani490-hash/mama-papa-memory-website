import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const base = process.argv[2] || 'http://localhost:3100';
const response = await fetch(base);
assert.equal(response.status, 200, 'Homepage must return 200');
const html = await response.text();
assert(!html.includes('Loading memory'), 'Server HTML must not contain the old indefinite loading state');
assert(html.includes('<details class="letter"'), 'Letter must be available without JavaScript');
const images = [...html.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);
assert(images.length >= 5, 'Hero and all four album photographs must render on the server');
for (const tag of images) {
  assert(!/opacity\s*:\s*0|visibility\s*:\s*hidden|display\s*:\s*none/.test(tag), 'Images must not start hidden');
  assert(/alt="[^"]+"/.test(tag), 'Every photograph needs descriptive alt text');
}
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
for (const m of html.matchAll(/href="#([^"]+)"/g)) assert(ids.has(m[1]), `Missing anchor target: ${m[1]}`);
const content = await readFile(new URL('../app/content.ts', import.meta.url), 'utf8');
for (const m of content.matchAll(/(?:title|caption|label|text): "([^"]+)"/g)) {
  const escaped = m[1].replaceAll('&', '&amp;');
  assert(html.includes(escaped), `Original content missing from HTML: ${m[1]}`);
}
for (let i = 1; i <= 4; i++) {
  const path = `/photos/memory-${i}.jpg`;
  const asset = await fetch(base + path);
  assert.equal(asset.status, 200, `${path} must be available`);
  assert(asset.headers.get('content-type')?.startsWith('image/jpeg'), 'JPEG MIME type required');
  const actual = Buffer.from(await asset.arrayBuffer());
  assert.equal(actual[0], 0xff); assert.equal(actual[1], 0xd8);
  const original = await readFile(new URL(`../public${path}`, import.meta.url));
  assert.equal(createHash('sha256').update(actual).digest('hex'), createHash('sha256').update(original).digest('hex'), 'Deployment must serve the original image bytes');
  console.log(`PASS ${path}: 200, JPEG, identical original bytes`);
}
const manifest = JSON.parse(await readFile(new URL('../app/photo-manifest.json', import.meta.url), 'utf8'));
for (const asset of Object.values(manifest)) {
  for (const entry of asset.srcSet.split(', ')) {
    const path = entry.split(' ')[0];
    const response = await fetch(base + path);
    assert.equal(response.status, 200, `Responsive asset missing: ${path}`);
    assert(response.headers.get('content-type')?.startsWith('image/webp'));
  }
}
assert.equal(createHash('sha256').update(content).digest('hex'), '247331b9ccf4458b7056736d33e009e7fb041fdd51d31e4a2679f6c449d0429c', 'Original personal content must remain byte-for-byte unchanged');
console.log('PASS: original content checksum and all local responsive WebP paths.');
console.log('PASS: SSR image visibility, original captions/milestones, native letter, descriptive alt text, navigation anchors.');
