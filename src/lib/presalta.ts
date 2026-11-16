/**
 * PRE SALTA · Verano 2027: programa provincial de reintegro del 50% en
 * crédito (tope $150.000 por adulto) para compras anticipadas de servicios
 * turísticos. Todo lo que el sitio muestra del programa sale de acá, así las
 * fechas se corrigen en un solo lugar.
 *
 * Ojo con las fechas: las guías para prestadores dicen que las compras cierran
 * el 13 de diciembre, pero las piezas gráficas del manual de marca dicen 5 de
 * diciembre. Se usa el 13/12 (lo que confirmó el cliente); si el programa
 * oficial dice otra cosa, se cambian `purchaseEnd` y los textos de compra.
 */
export const PRESALTA = {
  // Instantes en hora de Salta (UTC-3, sin horario de verano).
  // El banner se muestra desde ya (pedido del cliente), antes del inicio
  // oficial de compras del 20/11: los textos siguen diciendo las fechas
  // reales del programa.
  purchaseStart: new Date("2026-11-15T00:00:00-03:00"),
  // Exclusivo: el banner se apaga al terminar el 13/12.
  purchaseEnd: new Date("2026-12-14T00:00:00-03:00"),
  // Partidas en dos renglones como en las piezas del manual; `short` es para mobile.
  purchaseLines: ["Del 20 de noviembre", "al 13 de diciembre"],
  purchaseShort: "20/11 al 13/12",
  travelLines: ["Entre el 4 de enero", "y el 5 de marzo"],
  travelShort: "4/1 al 5/3",
  maxCreditLabel: "$150.000",
  url: "https://www.presalta.ar",
} as const;

/** `?presalta=preview` muestra el banner fuera de fecha, para revisarlo antes del lanzamiento. */
export const PRESALTA_PREVIEW_PARAM = "presalta";

export function isPreSaltaPurchaseOpen(now: Date = new Date()): boolean {
  return now >= PRESALTA.purchaseStart && now < PRESALTA.purchaseEnd;
}
