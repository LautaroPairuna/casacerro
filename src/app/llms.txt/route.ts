import { buildFaqItems } from "@/lib/faq";
import { BUSINESS, SITE_URL, formatPhone } from "@/lib/site";
import { formatPrecio, loadTariffData } from "@/lib/tariffs";

/**
 * `/llms.txt`: resumen en texto plano del alojamiento para motores generativos
 * (ChatGPT, Perplexity, AI Overviews), que leen mucho mejor un markdown corto
 * que el HTML completo de la landing. Se arma con los mismos datos que la
 * página, así que las tarifas nunca quedan desfasadas.
 */
export async function GET() {
  const { habitaciones, tariffInfo } = await loadTariffData();
  const faqItems = buildFaqItems(habitaciones, tariffInfo);

  const tarifas = habitaciones
    .map((hab) => {
      const filas = hab.precios
        .map((p) => `  - ${p.label} (hasta ${p.personas} personas): ${formatPrecio(p.precio)} por noche`)
        .join("\n");
      return `- **${hab.tipo}** — ${hab.descripcion}\n${filas}`;
    })
    .join("\n");

  const faq = faqItems
    .map((item) => `### ${item.question}\n\n${item.answer}`)
    .join("\n\n");

  const body = `# CasaCerro — Apartamentos en Salta, Argentina

> Alojamiento con ${BUSINESS.numberOfRooms} apartamentos equipados en ${BUSINESS.streetAddress}, ${BUSINESS.addressLocality}, a 50 metros del ${BUSINESS.landmark}. Estadías cortas y prolongadas para turistas, familias y viajeros de negocios. Reservas por WhatsApp.

## Datos del alojamiento

- Nombre: ${BUSINESS.legalName}
- Sitio web: ${SITE_URL}
- Dirección: ${BUSINESS.streetAddress}, ${BUSINESS.postalCode} ${BUSINESS.addressLocality}, Provincia de ${BUSINESS.addressRegion}, Argentina
- Coordenadas: ${BUSINESS.latitude}, ${BUSINESS.longitude}
- WhatsApp: ${BUSINESS.phones.map(formatPhone).join(" / ")}
- Instagram: ${BUSINESS.instagram}
- Valoración: ${BUSINESS.ratingValue}/5 sobre ${BUSINESS.reviewCount} reseñas de Google
- Idioma de atención: español

## Tarifas por noche (pesos argentinos)

${tarifas}

- ${tariffInfo.parkingNote}
- ${tariffInfo.seasonalNote}
- ${tariffInfo.validityNote}

## Servicios incluidos

WiFi de alta velocidad, aire acondicionado frío/calor, kitchenette equipada, ropa de cama y ropa de baño, servicio de limpieza, TV led con cable, baño privado completo, caja fuerte, cochera privada (sujeta a disponibilidad), check-in con código de acceso y cámaras de seguridad.

## Para empresas

Facturación A o B, convenios corporativos, tarifas diferenciadas para estadías prolongadas y reserva de varios apartamentos para equipos de trabajo.

## Preguntas frecuentes

${faq}

## Secciones del sitio

- [Nosotros](${SITE_URL}/#nosotros): sobre CasaCerro y su ubicación.
- [Reseñas](${SITE_URL}/#resenas): opiniones verificadas de huéspedes.
- [Servicios](${SITE_URL}/#servicios): qué incluye la estadía.
- [Habitaciones](${SITE_URL}/#habitaciones): categorías, capacidad y fotos.
- [Tarifas](${SITE_URL}/#tarifas): precios por noche actualizados.
- [Empresas](${SITE_URL}/#empresas): condiciones corporativas.
- [Preguntas frecuentes](${SITE_URL}/#preguntas)
- [Contacto](${SITE_URL}/#contacto): WhatsApp, Instagram y mapa.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
