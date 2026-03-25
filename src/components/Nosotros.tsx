"use client";

import Image from "next/image";

export default function Nosotros() {
  return (
    <section
      id="nosotros"
      className="w-full bg-white px-4 py-12 md:px-6"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10">
          <h2 className="text-center text-4xl font-medium text-neutral-900 md:text-5xl">
            ACERCA DE NOSOTROS
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 xl:items-stretch xl:gap-8">
          {/* Texto - 4/12 */}
          <div className="xl:col-span-4">
            <div className="h-full rounded-[32px] bg-[#f5ecd7] p-8 shadow-sm md:p-10">
              <p className="text-base leading-8 text-neutral-700 md:text-lg">
                A 50 metros del Shopping Alto Noa, <strong>CasaCerro</strong> le
                ofrece 7 apartamentos espaciosos, muy cómodos y con todos los
                servicios para una estadía tranquila, segura y agradable.
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
          </div>

          {/* Imagen - 8/12 */}
          <div className="xl:col-span-8">
            <div className="relative h-full min-h-[420px] w-full overflow-hidden rounded-[32px] shadow-md xl:min-h-[100%]">
              <Image
                src="/image/nosotros/foto-nosotros.jpeg"
                alt="CasaCerro - apartamentos y estadía en Salta"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}