import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Mulish } from "next/font/google";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

// Solo los pesos que realmente se usan: cada peso extra es un archivo woff2
// más en el critical path. Cormorant se aplica únicamente a los títulos.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  display: "swap",
});

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#6c1710",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Apartamentos en Salta`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  manifest: "/manifest.webmanifest",
  keywords: [
    "CasaCerro",
    "apartamentos en Salta",
    "alojamiento en Salta",
    "apart hotel Salta",
    "departamentos temporarios Salta",
    "hospedaje cerca Alto Noa",
    "alojamiento cerca del Shopping Alto Noa",
    "tarifas alojamiento Salta",
    "alojamiento para empresas en Salta",
    "reserva por WhatsApp Salta",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  alternates: {
    canonical: "/",
    languages: { "es-AR": "/" },
  },
  openGraph: {
    title: `${SITE_NAME} | Apartamentos en Salta`,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/image/hero/foto-hero-2.jpeg",
        width: 1200,
        height: 630,
        alt: "CasaCerro Salta - apartamentos para estadía en Salta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Apartamentos en Salta`,
    description: SITE_DESCRIPTION,
    images: ["/image/hero/foto-hero-2.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "travel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-AR"
      className={`${cormorant.variable} ${mulish.variable} h-full antialiased`}
    >
      <head>
        {/* El iframe del mapa y los enlaces a wa.me se resuelven antes de que el
            usuario llegue a esas secciones. */}
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://wa.me" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
