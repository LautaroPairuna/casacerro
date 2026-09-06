/**
 * Genera las variantes WebP responsive de /public/image.
 *
 * El contenedor de producción arranca con el heap acotado, así que en vez de
 * optimizar on-demand con el servidor de imágenes de Next, las variantes se
 * generan una sola vez acá y se sirven como archivos estáticos. El loader de
 * `src/lib/image-loader.ts` es el que arma el srcset apuntando a estos nombres.
 *
 * Correlo cada vez que agregues o reemplaces una foto:  pnpm images:optimize
 */
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

// Tiene que coincidir con `imageSizes` + `deviceSizes` de next.config.ts.
const WIDTHS = [256, 640, 828, 1200, 1600];
const QUALITY = 78;
const SOURCE_DIR = path.join(process.cwd(), "public", "image");
const SOURCE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);
// Assets que están en /public pero no se renderizan con next/image.
const IGNORED = new Set(["logoCasaCerroColor.png"]);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function main() {
  if (!existsSync(SOURCE_DIR)) {
    console.error(`No existe ${SOURCE_DIR}`);
    process.exit(1);
  }

  const force = process.argv.includes("--force");
  let generated = 0;
  let skipped = 0;
  let sourceBytes = 0;
  let outputBytes = 0;

  for await (const file of walk(SOURCE_DIR)) {
    if (!SOURCE_EXTENSIONS.has(path.extname(file).toLowerCase())) continue;
    if (IGNORED.has(path.basename(file))) continue;

    const source = await stat(file);
    sourceBytes += source.size;

    const image = sharp(file);
    const { width: originalWidth } = await image.metadata();
    const dir = path.dirname(file);
    const base = path.basename(file, path.extname(file));

    for (const width of WIDTHS) {
      const target = path.join(dir, `${base}-${width}.webp`);

      // Regenera sólo si falta o si la fuente es más nueva que la variante.
      if (!force && existsSync(target)) {
        const current = await stat(target);
        if (current.mtimeMs >= source.mtimeMs) {
          outputBytes += current.size;
          skipped += 1;
          continue;
        }
      }

      const buffer = await sharp(file)
        // `withoutEnlargement` evita escalar hacia arriba una foto chica: la
        // variante existe igual (el loader la pide) pero con el ancho original.
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 6 })
        .toBuffer();

      await mkdir(dir, { recursive: true });
      await writeFile(target, buffer);
      outputBytes += buffer.byteLength;
      generated += 1;
    }

    console.log(`  ${path.relative(process.cwd(), file)} (${originalWidth}px)`);
  }

  const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;
  console.log(
    `\n${generated} variantes generadas, ${skipped} ya estaban al día.\n` +
      `Originales: ${kb(sourceBytes)} · WebP (todas las variantes): ${kb(outputBytes)}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
