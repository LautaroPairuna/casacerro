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
import PreSaltaBanner from "@/components/PreSaltaBanner";
import { connection } from "next/server";
import { cookies } from "next/headers";
import { buildJsonLd } from "@/lib/seo";
import { loadTariffData } from "@/lib/tariffs";
import {
  isPreSaltaPurchaseOpen,
  PRESALTA_DISMISS_COOKIE,
  PRESALTA_PREVIEW_PARAM,
} from "@/lib/presalta";

// La página se renderiza en cada request (connection() la fuerza a dinámica),
// pero eso no pega contra la base en cada visita: getTariffCatalog() está
// memoizado con unstable_cache + tags, así que la consulta real sólo corre
// cuando el panel de admin invalida el tag ("tariff-catalog") al guardar un
// cambio. Antes esta página tenía `revalidate = 3600`: eso agregaba una
// SEGUNDA caché, de la página entera, que si una regeneración de fondo
// pisaba la base en el momento justo (timeout, deploy en curso), horneaba
// los precios de fallback en el HTML estático durante una hora entera — sin
// ningún error visible. Con render dinámico + caché sólo a nivel dato, un
// fallo puntual de la base ya no queda pegado.

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
        url: "/og-casacerro.png",
        width: 1200,
        height: 630,
        alt: "CasaCerro: apartamentos en Salta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: homeDescription,
    images: ["/og-casacerro.png"],
  },
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const [{ habitaciones, tariffInfo }, params, cookieStore] = await Promise.all([
    loadTariffData(),
    searchParams,
    cookies(),
  ]);
  // El banner de PRE SALTA sólo existe durante el período de compras (o con
  // ?presalta=preview para revisarlo antes) y no vuelve a aparecer en la misma
  // sesión una vez que el visitante lo cerró.
  const showPreSalta =
    (isPreSaltaPurchaseOpen() || params[PRESALTA_PREVIEW_PARAM] === "preview") &&
    !cookieStore.has(PRESALTA_DISMISS_COOKIE);
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
      {showPreSalta && <PreSaltaBanner />}
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
      <aside aria-label="Contacto por WhatsApp">
        <WhatsappLink />
      </aside>
    </>
  );
}
