import { BUSINESS, formatPhone } from "@/lib/site";
import { formatPrecio, priceRange, type Habitacion, type TariffInfo } from "@/lib/tariffs";

export type FaqItem = {
  question: string;
  answer: string;
};

/**
 * Las respuestas se arman con los datos reales del sitio (tarifas de la base,
 * dirección, servicios) para que el texto visible y el `FAQPage` del JSON-LD
 * digan exactamente lo mismo: Google descarta el rich result si difieren.
 */
export function buildFaqItems(
  habitaciones: Habitacion[],
  tariffInfo: TariffInfo
): FaqItem[] {
  const rango = priceRange(habitaciones);
  const precioRespuesta = rango
    ? `Las tarifas por noche van desde ${formatPrecio(rango.min)} hasta ${formatPrecio(
        rango.max
      )} en pesos argentinos, según el tipo de apartamento y la cantidad de huéspedes. ${tariffInfo.seasonalNote} ${tariffInfo.validityNote}`
    : `Las tarifas se informan por noche en pesos argentinos y varían según el tipo de apartamento y la cantidad de huéspedes. ${tariffInfo.seasonalNote}`;

  return [
    {
      question: "¿Dónde queda CasaCerro en Salta?",
      answer: `CasaCerro está en ${BUSINESS.streetAddress}, ${BUSINESS.postalCode} ${BUSINESS.addressLocality}, a 50 metros del ${BUSINESS.landmark} y a pocos minutos del centro de la ciudad de Salta.`,
    },
    {
      question: "¿Cómo reservo un apartamento?",
      answer: `La reserva se coordina por WhatsApp al ${formatPhone(
        BUSINESS.phones[0]
      )} o al ${formatPhone(
        BUSINESS.phones[1]
      )}. También podés escribirnos por Instagram a @casacerro.salta y te confirmamos disponibilidad y tarifas.`,
    },
    {
      question: "¿Cuánto cuesta la noche en CasaCerro?",
      answer: precioRespuesta,
    },
    {
      question: "¿Qué incluye cada apartamento?",
      answer:
        "Todos los apartamentos incluyen ropa de cama y ropa de baño, WiFi de alta velocidad, aire acondicionado frío/calor, kitchenette equipada, TV led con cable, baño privado completo, caja fuerte y servicio de limpieza. No necesitás traer blanquería.",
    },
    {
      question: "¿CasaCerro tiene cochera?",
      answer: `Sí, contamos con cochera privada y segura. ${tariffInfo.parkingNote}`,
    },
    {
      question: "¿Para cuántas personas son los apartamentos?",
      answer: `CasaCerro tiene ${BUSINESS.numberOfRooms} apartamentos para 1 a 4 huéspedes: monoambientes single/doble, monoambiente triple, monoambiente cuádruple y una unidad de dos ambientes con mayor privacidad para familias o grupos.`,
    },
    {
      question: "¿Hacen factura a empresas?",
      answer:
        "Sí. Emitimos factura A o B según corresponda y trabajamos con convenios corporativos, tarifas diferenciadas para estadías prolongadas y reservas de varios apartamentos para equipos de trabajo.",
    },
    {
      question: "¿Sirve para trabajar de forma remota?",
      answer:
        "Sí. Todos los apartamentos tienen WiFi de alta velocidad con conexión estable para trabajo remoto y reuniones virtuales, además de escritorio y ambientes tranquilos. Es una opción habitual para viajeros de negocios que visitan Salta.",
    },
    {
      question: "¿Es un alojamiento seguro?",
      answer:
        "Sí. El ingreso se hace con códigos de acceso, el edificio cuenta con cámaras de seguridad, cada apartamento tiene caja fuerte y la cochera es privada y cerrada.",
    },
  ];
}
