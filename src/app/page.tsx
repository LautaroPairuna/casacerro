import type { Metadata } from "next";
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
import Footer from "@/components/Footer";
import { buildJsonLd } from "@/lib/seo";
import { loadTariffData } from "@/lib/tariffs";

// La landing se prerenderiza y se regenera cada hora; el panel de admin ya
// llama a `revalidatePath("/")` al tocar una tarifa, así que un cambio de
// precio se ve al instante sin renderizar la página en cada visita.
export const revalidate = 3600;

const homeTitle = "Apartamentos en Salta cerca del Alto Noa | CasaCerro";
const homeDescription =
  "Apartamentos amplios y equipados en Salta, a 50 metros del Shopping Alto Noa. Cochera privada, WiFi, aire acondicionado y kitchenette. Consultá tarifas y disponibilidad por WhatsApp.";

export const metadata: Metadata = {
  title: homeTitle,
  description: homeDescription,
  alternates: {
    canonical: "/",
    languages: { "es-AR": "/" },
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
  const { habitaciones, tariffInfo } = await loadTariffData();
  const jsonLd = buildJsonLd(habitaciones);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a
        href="#contenido"
        className="sr-only rounded-full bg-[#6c1710] px-5 py-3 text-sm font-medium uppercase tracking-wide text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1}>
        <Hero />
        <Nosotros />
        <Resenas />
        <Servicios />
        <Habitaciones />
        <Tarifas habitaciones={habitaciones} tariffInfo={tariffInfo} />
        <Empresas />
        <Contacto />
      </main>
      <Footer />
      <WhatsappLink />
    </>
  );
}
