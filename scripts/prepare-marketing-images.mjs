import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const sourceDirectory =
  process.env.PREFAB_SOURCE_DIR ?? join(homedir(), 'Desktop', 'PREFAB');
const manifestPath = join(root, 'src/data/marketing/image-manifest.json');
const outputDirectory = join(root, 'src/assets/images/marketing');
const publicDirectory = join(root, 'public');

async function verifySources(images) {
  return Promise.all(
    images.map(async image => {
      const source = join(sourceDirectory, image.source);

      try {
        await access(source);
      } catch (error) {
        throw new Error(
          `Missing marketing image source for ${image.id}: ${source}`,
          { cause: error }
        );
      }

      return { image, source };
    })
  );
}

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const sources = await verifySources(manifest.images);

  await mkdir(outputDirectory, { recursive: true });

  for (const { image, source } of sources) {
    for (const derivative of image.derivatives) {
      const pipeline = sharp(source).rotate().resize({
        width: derivative.width,
        height: derivative.height,
        fit: 'cover',
        position: image.focalPoint,
      });

      await pipeline
        .clone()
        .webp({ quality: 82 })
        .toFile(join(outputDirectory, `${derivative.name}.webp`));
      await pipeline
        .clone()
        .jpeg({ quality: 86, mozjpeg: true })
        .toFile(join(outputDirectory, `${derivative.name}.jpg`));
    }
  }

  const homeHero = sources.find(({ image }) => image.id === 'homeHero');

  if (!homeHero) {
    throw new Error('homeHero is missing from the marketing manifest.');
  }

  const monogram = Buffer.from(
    `
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" rx="96" fill="#14141A"/>
      <rect x="120" y="120" width="272" height="272" rx="12" fill="none" stroke="#D6AC7A" stroke-width="6"/>
      <path d="M196 336V176h46v56h44c30 0 52 20 52 52s-22 52-52 52h-90Z" fill="none" stroke="#E1BE92" stroke-width="6"/>
      <path d="M196 336h-8" stroke="#E1BE92" stroke-width="6" stroke-linecap="round"/>
    </svg>
  `.trim()
  );
  const socialOverlay = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="shade" x1="0" x2="1"><stop stop-color="#14141A" stop-opacity="0.94"/><stop offset="0.7" stop-color="#14141A" stop-opacity="0.22"/><stop offset="1" stop-color="#14141A" stop-opacity="0"/></linearGradient></defs>
      <rect width="1200" height="630" fill="url(#shade)"/>
      <text x="72" y="90" fill="#E1BE92" font-family="Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="3">THE SWIFT PROJECT</text>
      <text x="72" y="135" fill="#C9CDD6" font-family="Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="2">ILLUSTRATIVE REFERENCE</text>
      <text x="72" y="390" fill="#F4EFE6" font-family="Arial, sans-serif" font-size="64" font-weight="700">A home in Accra,</text>
      <text x="72" y="462" fill="#F4EFE6" font-family="Arial, sans-serif" font-size="64" font-weight="700">built with certainty.</text>
    </svg>
  `);

  await sharp(homeHero.source)
    .rotate()
    .resize(1200, 630, { fit: 'cover', position: homeHero.image.focalPoint })
    .composite([{ input: socialOverlay, top: 0, left: 0 }])
    .png()
    .toFile(join(publicDirectory, 'social.png'));

  await writeFile(join(publicDirectory, 'icon.svg'), monogram);
  await Promise.all([
    sharp(monogram)
      .resize(192, 192)
      .png()
      .toFile(join(publicDirectory, 'icon-192.png')),
    sharp(monogram)
      .resize(512, 512)
      .png()
      .toFile(join(publicDirectory, 'icon-512.png')),
    sharp(monogram)
      .resize(180, 180)
      .png()
      .toFile(join(publicDirectory, 'apple-touch-icon.png')),
  ]);
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
