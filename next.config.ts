import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  images: {
    minimumCacheTTL: 86400,
  },
};

export default nextConfig;