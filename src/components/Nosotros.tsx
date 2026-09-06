import Image from "next/image";
import Reveal from "./Reveal";

export default function Nosotros() {
  return (
    <section
      id="nosotros"
      className="w-full bg-[#eee] px-4 py-12 md:px-6"
    >
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="mb-10" duration={0.55} amount={0.7}>
          <h2 className="text-center text-5xl md:text-6xl font-light tracking-[0.15em] uppercase text-neutral-900">
            Acerca de Nosotros
          </h2>
          <div className="mt-5 mb-5 mx-auto w-32 h-0.5 bg-[#FCB040]" />
        </Reveal>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 xl:items-stretch xl:gap-8">
          <Reveal className="xl:col-span-4" duration={0.6}>
            <div className="h-full rounded-4xl bg-[#f5ecd7] p-8 shadow-sm md:p-10">
            <p className="text-base leading-8 text-neutral-700 md:text-lg">
            A 50 metros del Shopping Alto Noa, <strong>CasaCerro</strong> le
            ofrece 7 apartamentos espaciosos, muy cómodos, con cochera privada y segura, y todos los
            servicios para una estadía tranquila y agradable.
            </p>

            <p className="mt-6 text-base leading-8 text-neutral-700 md:text-lg">
            Nuestro objetivo es brindar un espacio acogedor para quienes
            desean disfrutar de Salta con comodidad, buena ubicación y una
            atención cercana, ya sea en una visita corta o durante varios
            días.
            </p>

            <p className="mt-6 text-base leading-8 text-neutral-700 md:text-lg">
            En CasaCerro combinamos calidez, confort y practicidad para que
            cada huésped encuentre un lugar donde descansar, sentirse bien
            recibido y vivir una experiencia simple y memorable desde el
            primer momento.
            </p>
            </div>
          </Reveal>

          <Reveal className="xl:col-span-8" duration={0.7} delay={0.1} amount={0.25}>
            <div className="relative h-full min-h-105 w-full overflow-hidden rounded-4xl shadow-md xl:min-h-full">
              <Image
                src="/image/nosotros/foto-nosotros.jpeg"
                alt="Interior de un apartamento de CasaCerro en Salta"
                fill
                sizes="(min-width: 1280px) 66vw, 100vw"
                loading="lazy"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
