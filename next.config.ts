import type { NextConfig } from "next";

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
    // El contenedor arranca con heap acotado (256 MB), así que las imágenes se
    // sirven tal cual desde /public en vez de optimizarse on-demand.
    unoptimized: true,
    minimumCacheTTL: 86400,
  },
  async headers() {
    return [
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
