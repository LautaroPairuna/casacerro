import type { NextConfig } from "next";

/**
 * Cabeceras de seguridad para todo el sitio. Sin Content-Security-Policy a
 * propósito: Next y los scripts de terceros meten código inline, y una CSP mal
 * armada rompe el sitio en silencio. X-Frame-Options cubre el caso que más
 * importa (que otro sitio meta el nuestro en un iframe para engañar clics).
 */
const SECURITY_HEADERS = [
  // Solo tiene efecto sobre https; el navegador lo ignora en local.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  // gzip del propio Next: sin esto el HTML y el JS viajan sin comprimir salvo
  // que el proxy de adelante tenga el middleware de compresión activado.
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    // El contenedor arranca con heap acotado (256 MB), así que no se optimiza
    // on-demand: las variantes WebP se generan antes con sharp
    // (`pnpm images:optimize`) y este loader arma el srcset apuntando a ellas.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [640, 828, 1200, 1600],
    imageSizes: [256],
  },
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      {
        // Los assets de /public no llevan hash en el nombre: sin esta cabecera
        // el navegador los revalida en cada visita.
        source: "/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/:path*.svg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
