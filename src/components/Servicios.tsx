"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Car,
  Clock,
  MessageCircle,
  Shield,
  Users,
  Wifi,
} from "lucide-react";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5493874029160";

const SERVICIOS = [
  {
    icon: Wifi,
    titulo: "WiFi de alta velocidad",
    descripcion:
      "Conexión estable en todos los apartamentos para trabajo remoto, reuniones y entretenimiento.",
  },
  {
    icon: Car,
    titulo: "Cochera",
    descripcion:
      "Espacio de estacionamiento para mayor comodidad durante tu estadía, sujeta a disponibilidad.",
  },
  {
    icon: Clock,
    titulo: "Atención y coordinación de horarios",
    descripcion:
      "Te ayudamos con la organización de ingreso y salida para que llegues sin complicaciones.",
  },
  {
    icon: BadgeCheck,
    titulo: "Apartamentos equipados",
    descripcion:
      "Ambientes cómodos, funcionales y listos para una estadía tranquila, corta o prolongada.",
  },
  {
    icon: Users,
    titulo: "Opciones para familias y grupos",
    descripcion:
      "Configuraciones de alojamiento para distintas cantidades de personas.",
  },
  {
    icon: Shield,
    titulo: "Seguridad",
    descripcion:
      "Rapidez y facilidad en el check-in a través de códigos, cámaras de seguridad.",
  },
];


export default function Servicios() {
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hola, quisiera consultar por los servicios y disponibilidad en Casa Cerro."
  )}`;

  return (
    <section id="servicios" className="bg-[#eee] px-4 py-20 md:px-6">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mb-10 text-center"
        >
          <h2 className="text-5xl font-light uppercase tracking-[0.15em] text-neutral-900 md:text-6xl">
            Servicios
          </h2>
          <div className="mx-auto mb-5 mt-5 h-0.5 w-32 bg-[#FCB040]" />
          <p className="mx-auto max-w-3xl text-sm leading-7 text-neutral-600 md:text-base">
            Conocé en detalle lo que ofrecemos para que tu experiencia en CasaCerro sea cómoda,
            práctica y adaptada a tu viaje.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {SERVICIOS.map((servicio, index) => (
            <motion.article
              key={servicio.titulo}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, delay: index * 0.06, ease: "easeOut" }}
              className="rounded-2xl border border-[#e8d9c0] bg-white p-6 shadow-sm hover:border-[#FCB040] transition-colors duration-200"
            >
              <div className="mb-4 inline-flex rounded-full bg-[#f5ecd7] p-2.5 text-black">
                <servicio.icon size={18} />
              </div>
              <h3 className="text-xl font-semibold text-[#20160a]">{servicio.titulo}</h3>
              <p className="mt-2 text-sm leading-7 text-neutral-600">{servicio.descripcion}</p>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
          className="mt-8"
        >
          <Link
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded-full border border-[#6c1710] px-6 py-3 text-sm font-medium uppercase tracking-wide text-[#6c1710] transition hover:bg-[#6c1710] hover:text-[#FFFFFF]"
          >
            <MessageCircle size={16} />
            Consultar servicios
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
