import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} | Apartamentos en Salta`,
    short_name: "CasaCerro",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#eeeeee",
    theme_color: "#6c1710",
    lang: "es-AR",
    icons: [
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
