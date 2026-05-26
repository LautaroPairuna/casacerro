"use client";

import { useMemo } from "react";
import Link from "next/link";
import Reveal from "./Reveal";
import {
  BadgeCheck,
  Building2,
  CalendarCheck,
  Car,
  FileText,
  MessageCircle,
  Users,
  Wifi,
} from "lucide-react";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5493874029160";

const BENEFICIOS = [
  {
    icon: FileText,
    titulo: "Facturación a empresa",
    descripcion:
      "Emitimos factura A o B según corresponda.",
  },
  {
    icon: CalendarCheck,
    titulo: "Estadías prolongadas",
    descripcion:
      "Tarifas diferenciadas. Coordinamos horarios de ingreso y egreso.",
  },
  {
    icon: Car,
    titulo: "Cochera privada",
    descripcion:
      "Contamos con cochera privada y segura para tus vehículos o los de tu equipo, sujeta a disponibilidad.",
  },
  {
    icon: Users,
    titulo: "Reservas para equipos",
    descripcion:
      "Gestionamos múltiples apartamentos simultáneos para grupos o equipos.",
  },
  {
    icon: Wifi,
    titulo: "WiFi de alta velocidad",
    descripcion:
      "Conexión estable y rápida en todos los apartamentos. Para trabajo remoto y/o reuniones virtuales.",
  },
  {
    icon: BadgeCheck,
    titulo: "Convenio corporativo",
    descripcion:
      "¿Tu empresa viaja frecuentemente a Salta? Consultanos por tarifas especiales y condiciones exclusivas.",
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
        <Reveal className="text-center mb-14" duration={0.55} amount={0.7}>
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
        </Reveal>

        {/* Beneficios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {BENEFICIOS.map((b, index) => {
            const Icon = b.icon;
            return (
              <Reveal
                key={b.titulo}
                duration={0.55}
                delay={index * 0.07}
                amount={0.3}
                className="rounded-2xl border border-[#e8d9c0] bg-white px-6 py-6 flex gap-4 shadow-sm hover:border-[#FCB040] transition-colors duration-200"
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
              </Reveal>
            );
          })}
        </div>

        {/* CTA */}
        <Reveal
          duration={0.55}
          amount={0.5}
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
        </Reveal>

      </div>
    </section>
  );
}
