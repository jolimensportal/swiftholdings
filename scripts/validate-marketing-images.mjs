import { readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const manifestPath = join(root, 'src/data/marketing/image-manifest.json');
const outputDirectory = join(root, 'src/assets/images/marketing');
const publicDirectory = join(root, 'public');
const formats = ['webp', 'jpg'];
const publicRasterAssets = [
  { name: 'social.png', width: 1200, height: 630 },
  { name: 'icon-192.png', width: 192, height: 192 },
  { name: 'icon-512.png', width: 512, height: 512 },
  { name: 'apple-touch-icon.png', width: 180, height: 180 },
];

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const failures = [];

  for (const image of manifest.images) {
    for (const derivative of image.derivatives) {
      for (const format of formats) {
        const path = join(outputDirectory, `${derivative.name}.${format}`);

        try {
          const metadata = await sharp(path).metadata();

          if (
            metadata.width !== derivative.width ||
            metadata.height !== derivative.height
          ) {
            failures.push(
              `wrong dimensions: ${relative(root, path)} expected ${derivative.width}x${derivative.height}, found ${metadata.width}x${metadata.height}`
            );
          }
        } catch {
          failures.push(`missing: ${relative(root, path)}`);
        }
      }
    }
  }

  for (const asset of publicRasterAssets) {
    const path = join(publicDirectory, asset.name);

    try {
      const metadata = await sharp(path).metadata();

      if (metadata.width !== asset.width || metadata.height !== asset.height) {
        failures.push(
          `wrong dimensions: ${relative(root, path)} expected ${asset.width}x${asset.height}, found ${metadata.width}x${metadata.height}`
        );
      }
    } catch {
      failures.push(`missing: ${relative(root, path)}`);
    }
  }

  const iconPath = join(publicDirectory, 'icon.svg');

  try {
    const icon = await readFile(iconPath, 'utf8');

    if (!icon.includes('#2A1C46') || !icon.includes('fill="white"')) {
      failures.push(`invalid branding: ${relative(root, iconPath)}`);
    }
  } catch {
    failures.push(`missing: ${relative(root, iconPath)}`);
  }

  if (failures.length > 0) {
    console.error(failures.join('\n'));
    process.exitCode = 1;
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
