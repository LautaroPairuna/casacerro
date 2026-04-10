"use client";

import { User, Car, Info, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5493874029160";

type PrecioItem = {
  personas: number;
  label: string;
  precio: number;
};

type Habitacion = {
  id: number;
  tipo: string;
  badge: string;
  descripcion: string;
  gridCols: string;
  precios: PrecioItem[];
};

type TariffInfo = {
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
  seasonalNote: "Los precios pueden variar sin previo aviso en temporada alta y fines de semana largos.",
  validityNote: "Valores vigentes hasta el 31 de marzo de 2026.",
  extraNotes: [],
};

function formatPrecio(precio: number): string {
  return `$${precio.toLocaleString("es-AR")}`;
}

function PersonasIcons({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <User key={i} size={13} strokeWidth={1.8} className="text-[#6c1710]" />
      ))}
    </div>
  );
}

export default function Tarifas() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>(INITIAL_HABITACIONES);
  const [tariffInfo, setTariffInfo] = useState<TariffInfo>(INITIAL_TARIFF_INFO);

  const whatsappHref = useMemo(() => {
    const message =
      "Hola, me gustaría consultar por disponibilidad y tarifas en Casa Cerro.";
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }, []);

  useEffect(() => {
    const fetchTarifas = async () => {
      try {
        const response = await fetch("/api/tarifas", { cache: "no-store" });
        if (!response.ok) return;

        const payload = (await response.json()) as {
          roomTypes: Array<{
            id: number;
            name: string;
            badge: string;
            description: string;
            rates: Array<{
              id: number;
              label: string;
              people: number;
              price: number;
            }>;
          }>;
          tariffInfo?: TariffInfo | null;
        };

        const next = payload.roomTypes.map((roomType) => ({
          id: roomType.id,
          tipo: roomType.name,
          badge: roomType.badge,
          descripcion: roomType.description,
          gridCols: roomType.rates.length === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2",
          precios: roomType.rates.map((rate) => ({
            personas: rate.people,
            label: rate.label,
            precio: rate.price,
          })),
        }));

        if (next.length > 0) {
          setHabitaciones(next);
        }

        if (payload.tariffInfo) {
          setTariffInfo(payload.tariffInfo);
        }
      } catch {
        return;
      }
    };

    void fetchTarifas();
  }, []);

  return (
    <section id="tarifas" className="py-20 px-4 md:px-6 bg-[#eee]">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-light tracking-[0.15em] uppercase  text-neutral-900">
            Tarifas
          </h2>
          <div className="mt-5 mb-5 mx-auto w-32 h-0.5 bg-[#FCB040]" />
          <h3>  </h3>
          <p className="text-xs uppercase tracking-[0.3em] text-[#A87B51] mb-3">
            Precios por noche · en pesos argentinos
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {habitaciones.map((hab, index) => (
            <motion.div
              key={hab.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
              className="rounded-2xl overflow-hidden border border-[#e8d9c0] shadow-sm bg-white flex flex-col"
            >
              <div className="bg-[#f5ecd7] px-6 pt-6 pb-5 border-b border-[#e8d9c0]">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <h3 className="text-2xl font-semibold tracking-wide uppercase text-neutral-900">
                    {hab.tipo}
                  </h3>
                  <span className="self-start sm:mt-1 shrink-0 rounded-full bg-[#6c1710]/10 px-3 py-0.5 text-[11px] font-medium uppercase tracking-wide text-[#6c1710]">
                    {hab.badge}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
                  {hab.descripcion}
                </p>
              </div>

              <div className="px-6 pt-5 pb-4 flex-1">
                <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 mb-3">
                  Opciones disponibles
                </p>
                <div className={`grid ${hab.gridCols} gap-3`}>
                  {hab.precios.map((p, idx) => (
                    <div
                      key={p.label}
                      className={`rounded-xl border border-[#e8d9c0] bg-[#FFFAF3] px-4 py-3 hover:border-[#FCB040] hover:bg-[#FFF5E5] transition-colors duration-200 cursor-default${
                        hab.precios.length === 3 && idx === 2
                          ? " col-span-2 w-1/2 mx-auto sm:col-span-1 sm:w-auto sm:mx-0"
                          : ""
                      }`}
                    >
                      <PersonasIcons count={p.personas} />
                      <p className="text-[11px] text-neutral-500 mt-1.5 uppercase tracking-wide leading-tight">
                        {p.label}
                      </p>
                      <p className="text-xl font-bold text-[#6c1710] mt-1 leading-none">
                        {formatPrecio(p.precio)}
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        por noche
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <Link
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-full border border-[#6c1710] px-6 py-3 text-sm font-medium uppercase tracking-wide text-[#6c1710] transition hover:bg-[#6c1710] hover:text-[#FFFFFF]"
                >
                  <MessageCircle size={16} />
                  Consultar disponibilidad
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="mt-7 rounded-2xl border border-[#e8d9c0] bg-[#f5ecd7]/80 px-6 py-5 space-y-3"
        >
          <div className="flex items-start gap-2.5 text-sm text-neutral-600">
            <Car size={15} className="mt-0.5 shrink-0 text-[#A87B51]" />
            <span>{tariffInfo.parkingNote}</span>
          </div>
          <div className="flex items-start gap-2.5 text-sm text-neutral-600">
            <Info size={15} className="mt-0.5 shrink-0 text-[#A87B51]" />
            <span>{tariffInfo.seasonalNote}</span>
          </div>
          <div className="flex items-start gap-2.5 text-sm text-neutral-600">
            <Info size={15} className="mt-0.5 shrink-0 text-[#A87B51]" />
            <span>{tariffInfo.validityNote}</span>
          </div>
          {tariffInfo.extraNotes.map((note, index) => (
            <div key={`${note}-${index}`} className="flex items-start gap-2.5 text-sm text-neutral-600">
              <Info size={15} className="mt-0.5 shrink-0 text-[#A87B51]" />
              <span>{note}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
