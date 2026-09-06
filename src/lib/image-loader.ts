/**
 * Loader de next/image apuntando a las variantes WebP que genera
 * `scripts/optimize-images.mjs`. El servidor no optimiza nada en runtime: sólo
 * elige, dentro del srcset, el archivo estático que ya existe en /public.
 *
 * Los anchos tienen que coincidir con `imageSizes` + `deviceSizes` de
 * next.config.ts, que es de donde Next saca los `width` que pide acá.
 */
const WIDTHS = [256, 640, 828, 1200, 1600];

type LoaderParams = {
  src: string;
  width: number;
  quality?: number;
};

export default function imageLoader({ src, width }: LoaderParams): string {
  // SVG, assets externos y cualquier cosa fuera de /image no tienen variantes.
  if (!src.startsWith("/image/") || !/\.(jpe?g|png)$/i.test(src)) {
    return src;
  }

  const target = WIDTHS.find((candidate) => candidate >= width) ?? WIDTHS.at(-1)!;
  return src.replace(/\.(jpe?g|png)$/i, `-${target}.webp`);
}
