import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.resolve(__dirname, '../src/assets');

const imagesToConvert = [
  'medical-equipment-01.jpg',
  'medical-equipment-02.jpg',
  'generator-01.jpg',
  'Factories-and-industrial.jpg',
  'water-pump-01.jpg',
  'water-pump-02.jpg',
  'water-pump-03.jpg',
  'water-pump-04.jpg',
];

async function convert() {
  console.log('Starting image conversion to WebP...');
  let totalSaved = 0;

  for (const imgName of imagesToConvert) {
    const srcPath = path.join(assetsDir, imgName);
    if (!fs.existsSync(srcPath)) {
      console.warn(`File not found: ${srcPath}`);
      continue;
    }
    const origStat = fs.statSync(srcPath);
    const destName = imgName.replace(/\.jpg$/, '.webp');
    const destPath = path.join(assetsDir, destName);

    await sharp(srcPath)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(destPath);

    const newStat = fs.statSync(destPath);
    const saved = origStat.size - newStat.size;
    totalSaved += saved;
    console.log(
      `✓ Converted ${imgName} (${(origStat.size / 1024).toFixed(1)} KB) -> ${destName} (${(newStat.size / 1024).toFixed(1)} KB) [Saved ${(saved / 1024).toFixed(1)} KB]`
    );
  }

  console.log(`\nTotal saved across images: ${(totalSaved / (1024 * 1024)).toFixed(2)} MB`);
}

convert().catch((err) => {
  console.error(err);
  process.exit(1);
});
