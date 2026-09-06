import { BUSINESS, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { priceRange, type Habitacion } from "@/lib/tariffs";

const LODGING_ID = `${SITE_URL}/#lodging`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const PAGE_ID = `${SITE_URL}/#webpage`;

const AMENITIES = [
  "WiFi de alta velocidad gratis",
  "Aire acondicionado frío / calor",
  "Kitchenette equipada",
  "Cochera privada y segura",
  "Ropa de cama y ropa de baño incluida",
  "Servicio de limpieza",
  "TV led con cable",
  "Baño privado completo",
  "Caja fuerte",
  "Cámaras de seguridad",
  "Check-in con código de acceso",
];

function amenityFeature(name: string) {
  return {
    "@type": "LocationFeatureSpecification",
    name,
    value: true,
  };
}

/**
 * Un solo `@graph` en vez de varios `<script>` sueltos: permite referenciar los
 * nodos entre sí por `@id` (la página apunta al negocio, las ofertas al mismo
 * alojamiento) y es lo que Google recomienda para una entidad local.
 */
export function buildJsonLd(habitaciones: Habitacion[]) {
  const rango = priceRange(habitaciones);

  const offers = habitaciones.flatMap((hab) =>
    hab.precios.map((precio) => ({
      "@type": "Offer",
      name: `${hab.tipo} · ${precio.label}`,
      description: hab.descripcion,
      price: String(precio.precio),
      priceCurrency: "ARS",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/#tarifas`,
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        value: precio.personas,
        unitText: "huéspedes",
      },
      itemOffered: {
        "@type": "HotelRoom",
        name: `${hab.tipo} ${precio.label}`,
        occupancy: {
          "@type": "QuantitativeValue",
          maxValue: precio.personas,
          unitCode: "C62",
        },
        amenityFeature: AMENITIES.map(amenityFeature),
      },
    }))
  );

  const lodging = {
    "@type": ["LodgingBusiness", "Apartment"],
    "@id": LODGING_ID,
    name: BUSINESS.legalName,
    alternateName: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    slogan: "Apartamentos amplios y cómodos en Salta, a 50 metros del Shopping Alto Noa.",
    image: [
      `${SITE_URL}/image/hero/foto-hero-2.jpeg`,
      `${SITE_URL}/image/habitaciones/monoambiente-4-personas.jpeg`,
      `${SITE_URL}/image/nosotros/foto-nosotros.jpeg`,
    ],
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo-casacerro-base.svg`,
    },
    telephone: BUSINESS.phones[0],
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.addressLocality,
      addressRegion: BUSINESS.addressRegion,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.latitude,
      longitude: BUSINESS.longitude,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${BUSINESS.latitude},${BUSINESS.longitude}`,
    areaServed: {
      "@type": "City",
      name: "Salta",
      containedInPlace: { "@type": "AdministrativeArea", name: "Provincia de Salta, Argentina" },
    },
    numberOfRooms: BUSINESS.numberOfRooms,
    currenciesAccepted: "ARS",
    availableLanguage: [{ "@type": "Language", name: "Español", alternateName: "es" }],
    ...(rango
      ? {
          priceRange: `$${rango.min.toLocaleString("es-AR")} - $${rango.max.toLocaleString("es-AR")} ARS por noche`,
          makesOffer: offers,
        }
      : {}),
    amenityFeature: AMENITIES.map(amenityFeature),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: BUSINESS.ratingValue,
      reviewCount: BUSINESS.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    sameAs: [BUSINESS.instagram],
    contactPoint: BUSINESS.phones.map((phone) => ({
      "@type": "ContactPoint",
      telephone: phone,
      contactType: "reservations",
      availableLanguage: "es-AR",
      areaServed: "AR",
    })),
  };

  const website = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: "es-AR",
    publisher: { "@id": LODGING_ID },
  };

  const webPage = {
    "@type": "WebPage",
    "@id": PAGE_ID,
    url: SITE_URL,
    name: `${SITE_NAME} | Apartamentos en Salta`,
    description: SITE_DESCRIPTION,
    inLanguage: "es-AR",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": LODGING_ID },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${SITE_URL}/image/hero/foto-hero-2.jpeg`,
    },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [lodging, website, webPage],
  };
}
