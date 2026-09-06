import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/faq";
import Reveal from "./Reveal";

/**
 * Acordeón con `<details>` nativo: cero JavaScript, accesible por teclado y con
 * todo el texto presente en el HTML inicial (lo que buscan los crawlers y los
 * motores generativos). Las mismas preguntas alimentan el `FAQPage` del JSON-LD.
 */
export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <section id="preguntas" className="w-full bg-[#eee] px-4 py-20 md:px-6">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="mb-12 text-center" duration={0.55} amount={0.7}>
          <h2 className="text-5xl font-light uppercase tracking-[0.15em] text-neutral-900 md:text-6xl">
            Preguntas frecuentes
          </h2>
          <div className="mx-auto mb-5 mt-5 h-0.5 w-32 bg-[#FCB040]" />
          <p className="mx-auto max-w-3xl text-sm leading-7 text-neutral-600 md:text-base">
            Lo que más nos consultan antes de reservar. Si te queda alguna duda,
            escribinos por WhatsApp y te respondemos al momento.
          </p>
        </Reveal>

        <Reveal className="mx-auto max-w-4xl" duration={0.6} delay={0.1} amount={0.15}>
          <div className="divide-y divide-[#e8d9c0] overflow-hidden rounded-2xl border border-[#e8d9c0] bg-white shadow-sm">
            {items.map((item) => (
              <details key={item.question} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-[#f5ecd7]/60 focus-visible:bg-[#f5ecd7]/60 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#6c1710]">
                  <h3 className="text-base font-semibold text-[#20160a] md:text-lg">
                    {item.question}
                  </h3>
                  <ChevronDown
                    size={18}
                    aria-hidden="true"
                    className="shrink-0 text-[#6c1710] transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                <p className="px-6 pb-6 text-sm leading-7 text-neutral-600 md:text-base">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
