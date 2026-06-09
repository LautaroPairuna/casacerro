import type { Metadata } from "next";
import { connection } from "next/server";
import WhatsappLink from "@/components/WhatsappLink";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Nosotros from "@/components/Nosotros";
import Tarifas from "@/components/Tarifas";
import Contacto from "@/components/Contacto";
import Resenas from "@/components/Resenas";
import Habitaciones from "@/components/Habitaciones";
import Empresas from "@/components/Empresas";
import Servicios from "@/components/Servicios";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const siteUrl =
  rawSiteUrl && /^https?:\/\//.test(rawSiteUrl)
    ? rawSiteUrl
    : "https://casacerro.com.ar";

const homeTitle = "Apartamentos cómodos en Salta | CasaCerro";
const homeDescription =
  "Alojate en CasaCerro: apartamentos amplios, cómodos y equipados en Salta, cerca del Shopping Alto Noa. Consultá disponibilidad, habitaciones y tarifas por WhatsApp.";

export const metadata: Metadata = {
  title: homeTitle,
  description: homeDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: "/",
    images: [
      {
        url: "/image/hero/foto-hero-2.jpeg",
        width: 1200,
        height: 630,
        alt: "Apartamentos CasaCerro en Salta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: homeDescription,
    images: ["/image/hero/foto-hero-2.jpeg"],
  },
};

export default async function Home() {
  await connection();

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CasaCerro Salta",
    url: siteUrl,
    inLanguage: "es-AR",
    description: homeDescription,
  };

  const lodgingJsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "CasaCerro",
    url: siteUrl,
    image: [
      `${siteUrl}/image/hero/foto-hero-2.jpeg`,
      `${siteUrl}/image/habitaciones/monoambiente-4-personas.jpeg`,
    ],
    logo: `${siteUrl}/logo-casacerro-base.svg`,
    description:
      "CasaCerro ofrece apartamentos espaciosos y confortables en Salta, con servicios completos y ubicación estratégica cerca del Shopping Alto Noa.",
    telephone: "+54 9 387 402 9160",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Uruguay 691",
      addressLocality: "Salta",
      postalCode: "A4400",
      addressCountry: "AR",
    },
    areaServed: "Salta, Argentina",
    sameAs: ["https://www.instagram.com/casacerro.salta/"],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "WiFi gratis", value: true },
      { "@type": "LocationFeatureSpecification", name: "Aire acondicionado", value: true },
      { "@type": "LocationFeatureSpecification", name: "Kitchenette", value: true },
      { "@type": "LocationFeatureSpecification", name: "Cochera privada", value: true },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingJsonLd) }}
      />
      <Header />
      <Hero />
      <Nosotros />
      <Resenas />
      <Servicios />
      <Habitaciones />
      <Tarifas />
      <Empresas />
      <Contacto />
      <WhatsappLink />
    </main>
  );
}
