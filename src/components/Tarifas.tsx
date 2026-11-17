import { User, Car, Info, MessageCircle } from "lucide-react";
import { whatsappHref } from "@/lib/site";
import { formatPrecio, type Habitacion, type TariffInfo } from "@/lib/tariffs";
import Reveal from "./Reveal";

function PersonasIcons({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <User key={i} size={13} strokeWidth={1.8} className="text-[#6c1710]" />
      ))}
    </div>
  );
}

export default function Tarifas({
  habitaciones,
  tariffInfo,
}: {
  habitaciones: Habitacion[];
  tariffInfo: TariffInfo;
}) {
  const href = whatsappHref(
    "Hola, me gustaría consultar por disponibilidad y tarifas en Casa Cerro."
  );

  return (
    <section id="tarifas" className="py-20 px-4 md:px-6 bg-[#eee]">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="text-center mb-12" duration={0.55} amount={0.7}>
          <h2 className="text-5xl md:text-6xl font-light tracking-[0.15em] uppercase  text-neutral-900">
            Tarifas
          </h2>
          <div className="mt-5 mb-5 mx-auto w-32 h-0.5 bg-[#FCB040]" />
          <p className="text-xs uppercase tracking-[0.3em] text-[#8a5f38] mb-3">
            Precios por noche · en pesos argentinos
          </p>
        </Reveal>

        {/* Dos columnas desde lg. items-stretch iguala las alturas y el
            flex-1 de la lista alinea los botones de las dos tarjetas. */}
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
          {habitaciones.map((hab, cardIndex) => (
            <Reveal
              key={hab.id}
              className="rounded-2xl overflow-hidden border border-[#e8d9c0] shadow-sm bg-white flex flex-col"
              duration={0.6}
              delay={cardIndex * 0.12}
              amount={0.2}
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

              {/* Lista de precios: un renglón por opción. A diferencia de la
                  grilla de cajitas, se adapta a cualquier cantidad de tarifas
                  que se carguen desde el admin. Los renglones se estiran
                  (flex-1) para llenar el alto de la tarjeta: si una tiene
                  menos opciones que la otra, no queda espacio en blanco. */}
              <div className="flex flex-1 flex-col px-6 pt-5 pb-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 mb-2">
                  Opciones disponibles
                </p>
                <ul className="flex flex-1 flex-col divide-y divide-[#efe4d0]">
                  {hab.precios.map((p) => (
                    <li
                      key={p.label}
                      className="-mx-3 flex flex-1 items-center justify-between gap-4 rounded-xl px-3 py-3.5 transition-colors duration-200 hover:bg-[#FFF5E5]"
                    >
                      <div className="min-w-0">
                        <PersonasIcons count={p.personas} />
                        <p className="mt-1 text-sm font-medium uppercase tracking-wide text-neutral-800">
                          {p.label}
                        </p>
                      </div>
                      <p className="shrink-0 text-right">
                        <span className="block text-xl font-bold leading-none text-[#6c1710] sm:text-2xl">
                          {formatPrecio(p.precio)}
                        </span>
                        <span className="mt-1 block text-[11px] text-neutral-500">por noche</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-6 pb-6 pt-2">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-full border border-[#6c1710] px-6 py-3 text-sm font-medium uppercase tracking-wide text-[#6c1710] transition hover:bg-[#6c1710] hover:text-[#FFFFFF]"
                >
                  <MessageCircle size={16} />
                  Consultar disponibilidad
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-7 rounded-2xl border border-[#e8d9c0] bg-[#f5ecd7]/80 px-6 py-5 space-y-3">
          <div className="flex items-start gap-2.5 text-base font-bold text-[#6c1710]">
            <Car size={15} className="mt-0.5 shrink-0 text-[#6c1710]" />
            <span>{tariffInfo.parkingNote}</span>
          </div>
          <div className="flex items-start gap-2.5 text-base font-bold text-[#6c1710]">
            <Info size={15} className="mt-0.5 shrink-0 text-[#6c1710]" />
            <span>{tariffInfo.seasonalNote}</span>
          </div>
          <div className="flex items-start gap-2.5 text-base font-bold text-[#6c1710]">
            <Info size={15} className="mt-0.5 shrink-0 text-[#6c1710]" />
            <span>{tariffInfo.validityNote}</span>
          </div>
          {tariffInfo.extraNotes.map((note, index) => (
            <div key={`${note}-${index}`} className="flex items-start gap-2.5 text-base font-bold text-[#6c1710]">
              <Info size={15} className="mt-0.5 shrink-0 text-[#6c1710]" />
              <span>{note}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
