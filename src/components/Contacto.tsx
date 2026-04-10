"use client";

import { useMemo } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
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
    <section id="contacto" className="w-full bg-[#eee] px-4 py-20 md:px-6">
      <div className="mx-auto w-full max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <h2 className="text-5xl md:text-6xl font-light tracking-[0.15em] uppercase text-neutral-900">
            Contacto
          </h2>
          <div className="mt-5 mb-5 mx-auto w-32 h-0.5 bg-[#FCB040]" />
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
                    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                    </svg>
                    <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
                      Instagram
                    </p>
                  </div>
                  <a href="https://www.instagram.com/casacerro.salta/" target="_blank" rel="noopener noreferrer" className="mt-2">@casacerro.salta</a>
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-neutral-500" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.535 5.858L.057 23.428a.75.75 0 0 0 .916.927l5.733-1.498A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.712 9.712 0 0 1-4.953-1.355l-.355-.21-3.68.962.982-3.588-.23-.368A9.715 9.715 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                    </svg>
                    <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
                      WhatsApp
                    </p>
                  </div>
                  <p className="mt-2">+54 9 387 402 9160</p>
                  <p className="mt-2">+54 9 387 402 5892</p>
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
                  className="inline-flex w-full items-center justify-center rounded-full border border-[#6c1710] px-6 py-4 text-sm font-medium uppercase tracking-wide text-[#6c1710] transition hover:bg-[#6c1710] hover:text-white"
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
                className="h-[420px] w-full md:h-[560px]"
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
