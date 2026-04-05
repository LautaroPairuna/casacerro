import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond, Mulish } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const siteUrl =
  rawSiteUrl && /^https?:\/\//.test(rawSiteUrl)
    ? rawSiteUrl
    : "https://casacerro.com.ar";
const siteName = "CasaCerro Salta";
const siteDescription =
  "CasaCerro ofrece apartamentos amplios y cómodos en Salta, a 50 metros del Shopping Alto Noa, con excelente ubicación, servicios completos y atención cercana para una estadía tranquila.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Apartamentos en Salta`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "CasaCerro",
    "apartamentos en Salta",
    "alojamiento en Salta",
    "apart hotel Salta",
    "departamentos temporarios Salta",
    "hospedaje cerca Alto Noa",
    "tarifas alojamiento Salta",
    "reserva por WhatsApp Salta",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${siteName} | Apartamentos en Salta`,
    description: siteDescription,
    url: "/",
    siteName,
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
    title: `${siteName} | Apartamentos en Salta`,
    description: siteDescription,
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
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${mulish.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
