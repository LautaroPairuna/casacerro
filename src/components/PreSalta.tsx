import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { whatsappHref } from "@/lib/site";
import { PRESALTA } from "@/lib/presalta";
import Reveal from "./Reveal";

const WHATSAPP_HREF = whatsappHref(
  "Hola, quiero reservar con PRE SALTA. Viajaríamos del _ al _ y somos __ personas. ¿Me pasan disponibilidad y tarifas?"
);

/** "presalta.ar" remarcado en el rojo del programa, para que se lea de un vistazo. */
const PRESALTA_DOMINIO = "font-bold text-[#A80003]";

const PASOS = [
  {
    titulo: "Reservá en CasaCerro",
    texto: (
      <>
        Comprá tu estadía entre el{" "}
        <strong>
          {PRESALTA.purchaseFrom} y el {PRESALTA.purchaseTo}
        </strong>
        , para viajar del {PRESALTA.travelFrom} al {PRESALTA.travelTo}.
      </>
    ),
  },
  {
    titulo: (
      <>
        Cargá tu factura en <span className={PRESALTA_DOMINIO}>presalta.ar</span>
      </>
    ),
    texto: (
      <>
        Te damos factura B a tu nombre y DNI. Te registrás en la página de{" "}
        <a
          href={PRESALTA.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${PRESALTA_DOMINIO} underline decoration-[#A80003]/40 underline-offset-2 transition hover:decoration-[#A80003]`}
        >
          presalta.ar
        </a>{" "}
        hasta el <strong>{PRESALTA.invoiceDeadline}</strong> y la subís.
      </>
    ),
  },
  {
    titulo: "Viajá y usá tu crédito",
    texto: (
      <>
        Desde el <strong>{PRESALTA.travelFrom}</strong> hasta el <strong>{PRESALTA.travelTo}</strong> lo tenés en MODO para
        pagar con QR en comercios turísticos adheridos de toda Salta.
      </>
    ),
  },
];

const USOS = ["Restaurantes", "Excursiones", "Bodegas", "Teleférico", "Museos", "Artesanías"];

/**
 * Sección de PRE SALTA, entre el hero y "Nosotros". Sólo se monta durante el
 * período de compras (la decide page.tsx). Sigue el manual de marca del
 * programa: logo oficial sin modificar, rojo institucional #A80003 y Trebuchet
 * (.presalta-font); el "50% DE REINTEGRO" replica la composición del posteo
 * oficial. La marca convive con la de CasaCerro: la tarjeta de pasos usa la
 * tipografía y los acentos del resto del sitio.
 */
export default function PreSalta() {
  return (
    <section
      id="presalta"
      aria-labelledby="presalta-titulo"
      className="presalta-bg relative overflow-hidden px-4 py-16 text-white md:px-6 md:py-24"
    >
      {/* Ondas como las de las piezas oficiales, sólo decorativas. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
      >
        <path d="M0 160 C 240 60, 480 260, 760 170 S 1200 40, 1440 140" fill="none" stroke="#ff3b3f" strokeWidth="2" />
        <path d="M0 560 C 300 470, 520 680, 820 590 S 1240 450, 1440 560" fill="none" stroke="#ff3b3f" strokeWidth="2" />
        <path d="M0 640 C 260 560, 600 760, 900 660 S 1260 560, 1440 650" fill="none" stroke="#ff6064" strokeWidth="1" />
      </svg>

      <div className="relative mx-auto max-w-300">
        <Reveal
          className="mb-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center md:mb-14"
          duration={0.55}
        >
          <Image
            src="/presalta/logo-presalta-blanco.png"
            alt="PRE SALTA"
            width={298}
            height={168}
            unoptimized
            className="h-12 w-auto md:h-14"
          />
          <span aria-hidden="true" className="hidden h-10 w-px bg-white/40 sm:block" />
          <p className="presalta-font text-xs font-bold uppercase tracking-[0.2em] text-white/90 md:text-sm">
            Verano 2027 ·{" "}
            <span className="whitespace-nowrap">CasaCerro es prestador adherido</span>
          </p>
        </Reveal>

        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          {/* El gancho: 50% de reintegro. */}
          <Reveal className="presalta-font text-center lg:text-left" duration={0.6}>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-black/25 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] md:text-xs">
              <span aria-hidden="true" className="h-2 w-2 animate-pulse rounded-full bg-[#FCB040]" />
              Compras del {PRESALTA.purchaseShort}
            </p>
            {/* presalta-font explícito: globals.css le pone Cormorant a todos los h2. */}
            <h2 id="presalta-titulo" className="presalta-font">
              <span className="presalta-50 block text-[8.5rem] font-bold sm:text-[11rem] lg:text-[12.5rem]">
                50%
              </span>
              <span className="relative z-1 -mt-3 inline-block -rotate-2 rounded-2xl bg-white px-5 py-2 shadow-[0_10px_30px_rgba(0,0,0,.3)] md:px-7">
                <span className="block text-4xl font-bold uppercase leading-none tracking-tight text-[#A80003] sm:text-5xl lg:text-6xl">
                  de reintegro
                </span>
              </span>
            </h2>
            <div className="-mt-1">
              <span className="inline-block -rotate-2 rounded-lg bg-[#1d1d1d] px-4 py-1.5 text-xs font-bold uppercase tracking-wide sm:text-sm">
                en crédito para disfrutar Salta
              </span>
            </div>
            <p className="mx-auto mt-6 max-w-md text-base leading-7 text-white/90 md:text-lg lg:mx-0">
              Reservá tu estadía por adelantado y te devuelven la mitad en crédito,{" "}
              <strong className="text-white">hasta {PRESALTA.maxCreditLabel} por adulto</strong>,
              para usar en restaurantes, excursiones, bodegas, el teleférico y mucho más.
            </p>
          </Reveal>

          {/* Cómo funciona + reserva. */}
          <Reveal
            className="rounded-3xl bg-[#f5ecd7] p-6 text-neutral-800 shadow-[0_25px_60px_rgba(0,0,0,.35)] md:p-8"
            duration={0.6}
            delay={0.12}
            amount={0.2}
          >
            <h3 className="text-center text-3xl font-medium uppercase tracking-[0.12em] text-neutral-900 md:text-4xl">
              Cómo funciona
            </h3>
            <div aria-hidden="true" className="mx-auto mb-6 mt-3 h-0.5 w-20 bg-[#FCB040]" />

            <ol className="space-y-4">
              {PASOS.map((paso, index) => (
                <li key={index} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="presalta-font flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#A80003] text-lg font-bold text-white"
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-bold text-neutral-900">{paso.titulo}</p>
                    <p className="text-sm leading-6 text-neutral-600">{paso.texto}</p>
                  </div>
                </li>
              ))}
            </ol>

            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#A80003] px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition hover:bg-[#8d0003] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A80003]"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Reservar con PRE SALTA
            </a>
          </Reveal>
        </div>

        <Reveal className="mt-12 text-center md:mt-16" duration={0.55}>
          <p className="presalta-font text-xs font-bold uppercase tracking-[0.25em] text-white/80">
            Usá tu crédito en
          </p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2 md:gap-3">
            {USOS.map((uso) => (
              <li
                key={uso}
                className="rounded-full border border-white/50 bg-white/10 px-4 py-1.5 text-sm"
              >
                {uso}
              </li>
            ))}
          </ul>
        </Reveal>

        <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-5 text-white/75">
          Crédito del 50% de compras anticipadas en prestadores adheridos, con un máximo de{" "}
          {PRESALTA.maxCreditLabel} por adulto (compras de hasta {PRESALTA.maxPurchaseLabel}).
          Facturas desde {PRESALTA.minInvoiceLabel}, pagadas en su totalidad y emitidas a nombre y
          DNI del viajero. Sujeto a las bases y condiciones del programa en presalta.ar.
        </p>
      </div>
    </section>
  );
}
