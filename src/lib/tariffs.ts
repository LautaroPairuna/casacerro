import { getTariffCatalog } from "@/lib/admin-data";

export type PrecioItem = {
  personas: number;
  label: string;
  precio: number;
};

export type Habitacion = {
  id: number;
  tipo: string;
  badge: string;
  descripcion: string;
  gridCols: string;
  precios: PrecioItem[];
};

export type TariffInfo = {
  parkingNote: string;
  seasonalNote: string;
  validityNote: string;
  extraNotes: string[];
};

const INITIAL_HABITACIONES: Habitacion[] = [
  {
    id: 1,
    tipo: "Monoambientes",
    badge: "Hasta 4 personas",
    descripcion:
      "Ambiente integrado con todo lo necesario para una estadía cómoda y agradable.",
    gridCols: "grid-cols-2 sm:grid-cols-3",
    precios: [
      { personas: 2, label: "Single / Doble", precio: 59000 },
      { personas: 3, label: "Triple", precio: 69000 },
      { personas: 4, label: "Cuádruple", precio: 78000 },
    ],
  },
  {
    id: 2,
    tipo: "Dos Ambientes",
    badge: "Hasta 4 personas",
    descripcion:
      "Ambientes separados, mayor privacidad y espacio. Ideal para familias o grupos.",
    gridCols: "grid-cols-2",
    precios: [
      { personas: 3, label: "Triple", precio: 75000 },
      { personas: 4, label: "Cuádruple", precio: 88000 },
    ],
  },
];

const INITIAL_TARIFF_INFO: TariffInfo = {
  parkingNote: "Cochera $9.000 por día. Sujeta a disponibilidad.",
  seasonalNote:
    "Los precios pueden variar sin previo aviso en temporada alta y fines de semana largos.",
  validityNote: "Valores vigentes hasta el 31 de marzo de 2026.",
  extraNotes: [],
};

export function formatPrecio(precio: number): string {
  return `$${precio.toLocaleString("es-AR")}`;
}

/**
 * Fuente única de tarifas para la UI, el JSON-LD y las preguntas frecuentes.
 * `getTariffCatalog` está memoizado con `unstable_cache`, así que llamarlo desde
 * varios componentes del mismo render no agrega consultas a la base.
 */
export async function loadTariffData(): Promise<{
  habitaciones: Habitacion[];
  tariffInfo: TariffInfo;
}> {
  try {
    const { roomTypes, tariffInfo } = await getTariffCatalog();
    const habitaciones =
      roomTypes.length > 0
        ? roomTypes.map((roomType) => ({
            id: roomType.id,
            tipo: roomType.name,
            badge: roomType.badge,
            descripcion: roomType.description,
            gridCols:
              roomType.rates.length === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2",
            precios: roomType.rates.map((rate) => ({
              personas: rate.people,
              label: rate.label,
              precio: rate.price,
            })),
          }))
        : INITIAL_HABITACIONES;

    return {
      habitaciones,
      tariffInfo: tariffInfo ?? INITIAL_TARIFF_INFO,
    };
  } catch {
    return {
      habitaciones: INITIAL_HABITACIONES,
      tariffInfo: INITIAL_TARIFF_INFO,
    };
  }
}

/** Rango de precios por noche, para el `priceRange` del JSON-LD y el FAQ. */
export function priceRange(habitaciones: Habitacion[]): { min: number; max: number } | null {
  const precios = habitaciones.flatMap((hab) => hab.precios.map((p) => p.precio));
  if (precios.length === 0) return null;
  return { min: Math.min(...precios), max: Math.max(...precios) };
}
