/**
 * Datos del negocio en un solo lugar: los consumen metadata, JSON-LD, sitemap,
 * footer y el bloque de contacto. Si cambia un teléfono o la dirección, se
 * cambia acá y queda consistente en todos lados.
 */

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL =
  rawSiteUrl && /^https?:\/\//.test(rawSiteUrl)
    ? rawSiteUrl.replace(/\/$/, "")
    : "https://casacerro.com.ar";

export const SITE_NAME = "CasaCerro Salta";

export const SITE_DESCRIPTION =
  "CasaCerro ofrece apartamentos amplios y cómodos en Salta, a 50 metros del Shopping Alto Noa, con excelente ubicación, servicios completos y atención cercana para una estadía tranquila.";

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5493874029160";

export const BUSINESS = {
  legalName: "CasaCerro",
  streetAddress: "Av. Uruguay 691",
  addressLocality: "Salta",
  addressRegion: "Salta",
  postalCode: "A4400",
  addressCountry: "AR",
  // Coordenadas del local (mismas que el embed de Google Maps de #contacto).
  latitude: -24.781963,
  longitude: -65.403794,
  phones: ["+5493874029160", "+5493874025892"],
  instagram: "https://www.instagram.com/casacerro.salta/",
  mapUrl: "https://maps.app.goo.gl/",
  numberOfRooms: 7,
  landmark: "Shopping Alto Noa",
  ratingValue: 4.8,
  reviewCount: 180,
} as const;

export function whatsappHref(message: string, phone: string = WHATSAPP_NUMBER) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/** +5493874029160 -> +54 9 387 402 9160 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 13) return phone;
  return `+${digits.slice(0, 2)} ${digits.slice(2, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
}
