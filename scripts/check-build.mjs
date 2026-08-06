import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { memorialImages } from '../src/memorialImages.js';

const uniqueImages = new Set(memorialImages.map((image) => image.src));
if (memorialImages.length !== 38 || uniqueImages.size !== memorialImages.length) {
  throw new Error(
    `Expected 38 unique memorial images; found ${memorialImages.length} entries and ${uniqueImages.size} unique URLs.`
  );
}

const assetsDirectory = join(process.cwd(), 'dist', 'assets');
const assetNames = await readdir(assetsDirectory);
const javascriptAssets = assetNames.filter((name) => name.endsWith('.js'));
const javascriptSizes = await Promise.all(
  javascriptAssets.map(async (name) => (await stat(join(assetsDirectory, name))).size)
);
const totalJavascriptBytes = javascriptSizes.reduce((total, size) => total + size, 0);
const javascriptLimitBytes = 350 * 1024;

if (totalJavascriptBytes > javascriptLimitBytes) {
  throw new Error(
    `JavaScript bundle budget exceeded: ${(totalJavascriptBytes / 1024).toFixed(1)} KiB exceeds 350 KiB.`
  );
}

const builtHtml = await readFile(join(process.cwd(), 'dist', 'index.html'), 'utf8');
for (const marker of ['property="og:image"', 'name="twitter:card"']) {
  if (!builtHtml.includes(marker)) throw new Error(`Missing required social metadata: ${marker}`);
}

console.log(
  `Checks passed: 38 unique images, ${javascriptAssets.length} JavaScript chunks, ${(totalJavascriptBytes / 1024).toFixed(1)} KiB total JavaScript.`
);
