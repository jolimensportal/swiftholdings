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
      <rect width="512" height="512" rx="96" fill="#2A1C46"/>
      <path d="M152 156h208v54H220v39h112c39 0 68 23 68 59 0 35-28 58-70 58H152v-54h176c10 0 17-5 17-13 0-9-8-14-19-14H214c-39 0-64-23-64-58 0-42 29-71 72-71Z" fill="white"/>
    </svg>
  `.trim()
  );
  const socialOverlay = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="shade" x1="0" x2="1"><stop stop-color="#2A1C46" stop-opacity="0.92"/><stop offset="0.7" stop-color="#2A1C46" stop-opacity="0.18"/><stop offset="1" stop-color="#2A1C46" stop-opacity="0"/></linearGradient></defs>
      <rect width="1200" height="630" fill="url(#shade)"/>
      <text x="72" y="90" fill="white" font-family="Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="3">SWIFT HOLDINGS</text>
      <text x="72" y="135" fill="white" font-family="Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="2">ILLUSTRATIVE REFERENCE</text>
      <text x="72" y="390" fill="white" font-family="Arial, sans-serif" font-size="64" font-weight="700">A home in Accra,</text>
      <text x="72" y="462" fill="white" font-family="Arial, sans-serif" font-size="64" font-weight="700">built with certainty.</text>
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
