"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AtSign, MessageCircle, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5493874029160";

export default function Contacto() {
  const whatsappHref = useMemo(() => {
    const message =
      "Hola, quisiera consultar por disponibilidad y tarifas en CasaCerro.";
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }, []);

  return (
    <section id="contacto" className="w-full bg-white px-4 py-20 md:px-6">
      <div className="mx-auto w-full max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-medium uppercase text-neutral-900 md:text-5xl">
            Contacto
          </h2>
          <div className="mx-auto mt-4 h-[2px] w-14 bg-[#d49a2a]" />
        </motion.div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12 xl:items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="xl:col-span-4"
          >
            <div className="h-full rounded-[32px] bg-[#f5ecd7] p-8 shadow-sm md:p-10">
              <p className="text-base leading-8 text-neutral-700 md:text-lg">
                Estamos a disposición para ayudarte con tu reserva, resolver
                dudas sobre disponibilidad y brindarte la información que
                necesites para tu estadía.
              </p>

              <div className="mt-8 space-y-6 text-base text-neutral-700 md:text-lg">
                <div>
                  <div className="flex items-center gap-3">
                    <AtSign size={18} className="text-neutral-500" />
                    <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
                      Instagram
                    </p>
                  </div>
                  <p className="mt-2">@casacerro.salta</p>
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <MessageCircle size={18} className="text-neutral-500" />
                    <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
                      WhatsApp
                    </p>
                  </div>
                  <p className="mt-2">+54 9 387 402 9160</p>
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-neutral-500" />
                    <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
                      Ubicación
                    </p>
                  </div>
                  <p className="mt-2">Av. Uruguay 691, A4400 Salta</p>
                </div>
              </div>

              <div className="mt-10">
                <Link
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full border border-[#8d2c16] px-6 py-4 text-sm font-medium uppercase tracking-[0.08em] text-[#8d2c16] transition hover:bg-[#8d2c16] hover:text-white"
                >
                  Consultar por WhatsApp
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="xl:col-span-8"
          >
            <div className="overflow-hidden rounded-[32px] shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3622.3938671779433!2d-65.40379382374566!3d-24.781963207568836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941bc39432107a25%3A0x78c00de00add8673!2sCasacerro!5e0!3m2!1ses-419!2sar!4v1774445836355!5m2!1ses-419!2sar"
                className="h-[420px] w-full md:h-[520px]"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de ubicación de CasaCerro"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
