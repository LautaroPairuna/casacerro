import { User, Car, Info, MessageCircle } from "lucide-react";
import { whatsappHref } from "@/lib/site";
import { formatPrecio, type Habitacion, type TariffInfo } from "@/lib/tariffs";

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
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-light tracking-[0.15em] uppercase  text-neutral-900">
            Tarifas
          </h2>
          <div className="mt-5 mb-5 mx-auto w-32 h-0.5 bg-[#FCB040]" />
          <p className="text-xs uppercase tracking-[0.3em] text-[#8a5f38] mb-3">
            Precios por noche · en pesos argentinos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {habitaciones.map((hab) => (
            <div
              key={hab.id}
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
                <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 mb-3">
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
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        por noche
                      </p>
                    </div>
                  ))}
                </div>
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
            </div>
          ))}
        </div>

        <div className="mt-7 rounded-2xl border border-[#e8d9c0] bg-[#f5ecd7]/80 px-6 py-5 space-y-3">
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
        </div>
      </div>
    </section>
  );
}
