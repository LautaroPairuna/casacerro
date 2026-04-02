"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Building2,
  CalendarCheck,
  Clock,
  FileText,
  MessageCircle,
  Users,
  Wifi,
} from "lucide-react";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5493876138620";

const BENEFICIOS = [
  {
    icon: FileText,
    titulo: "Facturación a empresa",
    descripcion:
      "Emitimos factura A o B según corresponda. Ideal para gastos corporativos y reembolso de viáticos.",
  },
  {
    icon: CalendarCheck,
    titulo: "Estadías prolongadas",
    descripcion:
      "Tarifas diferenciadas por semana, quincena o mes. Cuanto más tiempo, mejor el precio.",
  },
  {
    icon: Clock,
    titulo: "Check-in flexible",
    descripcion:
      "Coordinamos horarios de ingreso y egreso según los requerimientos de cada viaje de trabajo.",
  },
  {
    icon: Users,
    titulo: "Reservas para equipos",
    descripcion:
      "Gestionamos múltiples apartamentos simultáneos para grupos o equipos en simultáneo.",
  },
  {
    icon: Wifi,
    titulo: "WiFi de alta velocidad",
    descripcion:
      "Conexión estable y rápida en todos los apartamentos. Ideal para trabajo remoto o reuniones virtuales.",
  },
  {
    icon: BadgeCheck,
    titulo: "Convenio corporativo",
    descripcion:
      "¿Tu empresa viaja frecuentemente a Salta? Consultanos por tarifas especiales y condiciones exclusivas.",
  },
];

type TarifaCorporativa = {
  label: string;
  sublabel: string;
  descuento: string;
  precio: string;
  nota: string;
  destacado?: boolean;
};

const TARIFAS_CORPORATIVAS: TarifaCorporativa[] = [
  {
    label: "Semanal",
    sublabel: "7 a 14 noches",
    descuento: "15% off",
    precio: "$50.000",
    nota: "por noche · monoambiente doble",
  },
  {
    label: "Quincenal",
    sublabel: "15 a 29 noches",
    descuento: "20% off",
    precio: "$47.000",
    nota: "por noche · monoambiente doble",
    destacado: true,
  },
  {
    label: "Mensual",
    sublabel: "30+ noches",
    descuento: "A convenir",
    precio: "Consultar",
    nota: "según disponibilidad y temporada",
  },
];

export default function Empresas() {
  const whatsappHref = useMemo(() => {
    const message =
      "Hola, me comunico de una empresa y quisiera consultar por tarifas corporativas y disponibilidad en Casa Cerro.";
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }, []);

  return (
    <section id="empresas" className="py-20 px-4 md:px-6 bg-[#eee]">
      <div className="mx-auto max-w-[1400px]">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <h2 className="text-5xl md:text-6xl font-light tracking-[0.15em] uppercase text-neutral-900">
            Para Empresas
          </h2>
          <div className="mt-5 mb-6 mx-auto w-32 h-0.5 bg-[#FCB040]" />
          <div className="inline-flex items-center gap-2 mb-5">
            <Building2 size={16} className="text-[#A87B51]" />
            <span className="text-xs uppercase tracking-[0.3em] text-[#A87B51]">
              Soluciones corporativas
            </span>
          </div>
          <p className="max-w-xl mx-auto text-base leading-7 text-neutral-600">
            CasaCerro es la opción ideal para viajeros de negocios que visitan
            Salta. Ofrecemos condiciones especiales para empresas, equipos y
            estadías de larga duración.
          </p>
        </motion.div>

        {/* Beneficios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {BENEFICIOS.map((b, index) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.titulo}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: index * 0.07, ease: "easeOut" }}
                className="rounded-2xl border border-[#e8d9c0] bg-[#FFFAF3] px-6 py-6 flex gap-4 hover:border-[#FCB040] transition-colors duration-200"
              >
                <div className="shrink-0 mt-0.5">
                  <div className="w-9 h-9 rounded-full bg-[#6c1710]/10 flex items-center justify-center">
                    <Icon size={16} className="text-[#6c1710]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-900 mb-1.5">
                    {b.titulo}
                  </h3>
                  <p className="text-sm leading-6 text-neutral-600">
                    {b.descripcion}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tarifas corporativas */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-2xl border border-[#e8d9c0] overflow-hidden mb-8"
        >
          <div className="bg-[#f5ecd7] px-6 py-5 border-b border-[#e8d9c0]">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#A87B51]">
              Tarifas por estadía extendida · precios por noche en pesos argentinos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#e8d9c0] bg-white">
            {TARIFAS_CORPORATIVAS.map((t, index) => (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
                className={`px-8 py-8 flex flex-col gap-2 ${
                  t.destacado ? "bg-[#FFFAF3]" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-base font-semibold uppercase tracking-wide text-neutral-900">
                    {t.label}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-0.5 text-[11px] font-medium uppercase tracking-wide ${
                      t.destacado
                        ? "bg-[#FCB040]/20 text-[#A87B51]"
                        : "bg-[#6c1710]/10 text-[#6c1710]"
                    }`}
                  >
                    {t.descuento}
                  </span>
                </div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">
                  {t.sublabel}
                </p>
                <p className="text-3xl font-bold text-[#6c1710] mt-2 leading-none">
                  {t.precio}
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">{t.nota}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="rounded-2xl border border-[#e8d9c0] bg-[#f5ecd7]/80 px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div>
            <p className="text-base font-semibold text-neutral-900 mb-1">
              ¿Necesitás coordinar una estadía corporativa?
            </p>
            <p className="text-sm text-neutral-600">
              Contactanos por WhatsApp y armamos una propuesta a medida para tu empresa.
            </p>
          </div>
          <Link
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center justify-center gap-2 rounded-full border border-[#6c1710] px-7 py-3 text-sm font-medium uppercase tracking-wide text-[#6c1710] transition hover:bg-[#6c1710] hover:text-white"
          >
            <MessageCircle size={16} />
            Consultar condiciones
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
