"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { whatsappHref } from "@/lib/site";
import { useAutoplayControl } from "@/lib/use-autoplay-control";

type HeroImage = {
  src: string;
  alt: string;
};

const HERO_IMAGES: HeroImage[] = [
  {
    src: "/image/hero/foto-hero-2.jpeg",
    alt: "Frente de CasaCerro, apartamentos en Av. Uruguay 691, Salta",
  },
  {
    src: "/image/hero/foto-hero-4.jpeg",
    alt: "Apartamento equipado de CasaCerro en Salta",
  },
  {
    src: "/image/hero/foto-hero-3.jpeg",
    alt: "Espacio exterior de CasaCerro en Salta",
  },
];

const WHATSAPP_HREF = whatsappHref(
  "Hola, me gustaría consultar por disponibilidad y tarifas en Casa Cerro."
);

export default function Hero() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 5000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    []
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
    },
    [autoplay]
  );

  const { isPlaying, toggle: toggleAutoplay } = useAutoplayControl(emblaApi);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Embla expone su estado por eventos, no por render: este efecto sólo
  // sincroniza el índice activo de los puntos con el carrusel.
  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="w-full bg-[#eee] pt-32 pb-12 px-4 md:px-6">
      <div className="mx-auto max-w-[1400px] grid grid-cols-1 gap-8 xl:grid-cols-12 xl:items-stretch">
        {/* Above the fold: animación por CSS en vez de <Reveal>, que arranca en
            opacity:0 y no se muestra hasta que hidrata el JS (retrasa el LCP). */}
        <div className="cc-anim-fade-up flex xl:col-span-4">
          <div className="flex w-full flex-col justify-center rounded-3xl bg-[#f5ecd7] p-8 shadow-md md:p-10">
            <span className="mb-8 inline-block text-sm uppercase tracking-[0.25em] text-neutral-600 text-center">
              Bienvenidos a...
            </span>

            <h1 className="text-center">
              <Image
                src="/logo-casacerro-animado.svg"
                alt="CasaCerro"
                width={250}
                height={125}
                loading="eager"
                className="mx-auto mb-4"
              />
              <span className="block text-xl leading-8 tracking-[0.06em] text-neutral-800 md:text-2xl">
                Apartamentos en Salta, a 50 metros del Shopping Alto Noa
              </span>
            </h1>

            <p className="mt-5 text-base leading-7 text-neutral-700 md:text-lg">
              Un espacio pensado para disfrutar Salta con comodidad, calidez y
              una experiencia tranquila cerca de todo lo importante.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-col">
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-[#6c1710] px-6 py-3 text-sm font-medium uppercase tracking-wide text-[#6c1710] transition hover:bg-[#6c1710] hover:text-[#FFFFFF]"
              >
                Hablar por WhatsApp
              </a>

              <a
                href="#habitaciones"
                className="inline-flex items-center justify-center rounded-full border border-[#6c1710] px-6 py-3 text-sm font-medium uppercase tracking-wide text-[#6c1710] transition hover:bg-[#6c1710] hover:text-[#FFFFFF]"
              >
                Ver habitaciones
              </a>
            </div>
          </div>
        </div>

        {/* La primera foto es el elemento LCP: se pinta sin animación de entrada
            ni espera de hidratación. */}
        <div className="xl:col-span-8">
          <div className="relative overflow-hidden rounded-3xl shadow-md">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {HERO_IMAGES.map((image, index) => (
                  <div
                    key={image.src}
                    className="relative h-[420px] min-w-0 flex-[0_0_100%] md:h-[520px]"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1280px) 66vw, 100vw"
                      className="object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Imagen anterior"
              className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/85 p-3 text-black shadow transition hover:bg-white"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={scrollNext}
              aria-label="Siguiente imagen"
              className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/85 p-3 text-black shadow transition hover:bg-white"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center">
              {HERO_IMAGES.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => scrollTo(index)}
                  aria-label={`Ir a la imagen ${index + 1}`}
                  aria-current={selectedIndex === index ? "true" : undefined}
                  // El punto visible sigue midiendo 10px, pero el área
                  // clickeable llega a 24x24 (WCAG 2.5.8).
                  className="group flex h-6 items-center justify-center px-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span
                    className={`block h-2.5 rounded-full transition-all ${
                      selectedIndex === index
                        ? "w-8 bg-white"
                        : "w-2.5 bg-white/60 group-hover:bg-white/80"
                    }`}
                  />
                </button>
              ))}

              <button
                type="button"
                onClick={toggleAutoplay}
                aria-label={
                  isPlaying ? "Pausar el cambio automático de imágenes" : "Reanudar el cambio automático de imágenes"
                }
                className="ml-2 flex h-6 w-6 items-center justify-center rounded-full text-white transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
