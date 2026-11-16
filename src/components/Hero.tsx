"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const sectionRef = useRef<HTMLElement>(null);

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

  // Parallax: publica cuánto del hero ya se scrolleó (0 a 1) en una variable
  // CSS y globals.css hace el resto. Se escribe directo en el estilo (sin
  // estado de React) y una sola vez por frame, así no re-renderiza nada.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const height = section.offsetHeight || 1;
      const progress = Math.min(Math.max(window.scrollY / height, 0), 1);
      section.style.setProperty("--hero-progress", progress.toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      id="inicio"
      ref={sectionRef}
      aria-label="Bienvenida"
      className="w-full bg-[#f5ecd7] pt-16 xl:h-svh xl:min-h-[640px]"
    >
      {/* Tarjeta y carrusel forman un único bloque a sangre: ocupan todo el
          ancho y, en desktop, todo el alto debajo del header. El pt-16 del
          section es la altura del header fijo. */}
      <div className="grid h-full grid-cols-1 overflow-hidden xl:grid-cols-12">
        {/* Carrusel (8 columnas). En mobile va primero: la foto es lo que
            engancha, y la tarjeta queda justo abajo. La primera foto es el
            elemento LCP: se pinta sin animación de entrada ni espera de
            hidratación. */}
        <div className="order-first xl:order-last xl:col-span-8 xl:h-full">
          <div className="relative h-full overflow-hidden bg-[#2b1a12]">
            <div className="h-full overflow-hidden" ref={emblaRef}>
              <div className="flex h-full">
                {HERO_IMAGES.map((image, index) => (
                  <div
                    key={image.src}
                    className="relative aspect-[4/3] min-w-0 flex-[0_0_100%] sm:aspect-video xl:aspect-auto xl:h-full"
                  >
                    {/* Fondo: la misma foto desenfocada rellena el recuadro, así
                        la foto real se muestra entera (contain) sin bandas
                        vacías, sea horizontal o vertical. */}
                    <Image
                      src={image.src}
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="(min-width: 1280px) 66vw, 100vw"
                      className="scale-110 object-cover opacity-70 blur-2xl"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1280px) 66vw, 100vw"
                      className="object-contain"
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Imagen anterior"
              className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/85 p-2.5 text-black shadow transition hover:bg-white md:left-4 md:p-3"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={scrollNext}
              aria-label="Siguiente imagen"
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/85 p-2.5 text-black shadow transition hover:bg-white md:right-4 md:p-3"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center rounded-full bg-black/30 px-1 backdrop-blur-sm">
              {HERO_IMAGES.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => scrollTo(index)}
                  aria-label={`Ir a la imagen ${index + 1}`}
                  aria-current={selectedIndex === index ? "true" : undefined}
                  // El punto visible sigue midiendo 10px, pero el área
                  // clickeable llega a 24x24 (WCAG 2.5.8).
                  className="group flex h-6 items-center justify-center px-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
                className="flex h-6 w-6 items-center justify-center rounded-full text-white transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              </button>
            </div>
          </div>
        </div>

        {/* Tarjeta de bienvenida (4 columnas). Above the fold: animación por
            CSS en vez de <Reveal>, que arranca en opacity:0 y no se muestra
            hasta que hidrata el JS (retrasa el LCP). */}
        <div className="hero-parallax-content flex xl:col-span-4 xl:h-full">
          <div
            className="cc-anim-fade-up mx-auto flex w-full max-w-xl flex-col justify-center px-6 py-8 sm:px-10 sm:py-10 xl:px-12"
            style={{ ["--anim-duration" as string]: "0.7s", ["--anim-delay" as string]: "0.1s" }}
          >
            <span className="mb-4 block text-center text-xs uppercase tracking-[0.25em] text-neutral-600 sm:mb-6 sm:text-sm">
              Bienvenidos a...
            </span>

            <h1 className="text-center">
              <Image
                src="/logo-casacerro-animado.svg"
                alt="CasaCerro"
                width={250}
                height={125}
                loading="eager"
                className="mx-auto mb-3 h-auto w-48 sm:mb-4 sm:w-[250px]"
              />
              <span className="block text-lg leading-7 tracking-[0.06em] text-neutral-800 sm:text-xl sm:leading-8 md:text-2xl">
                Apartamentos en Salta, a 50 metros del Shopping Alto Noa
              </span>
            </h1>

            <p className="mt-4 text-base leading-7 text-neutral-700 md:mt-5 md:text-lg">
              Un espacio pensado para disfrutar Salta con comodidad, calidez y
              una experiencia tranquila cerca de todo lo importante.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 xl:grid-cols-1">
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-[#6c1710] bg-[#6c1710] px-6 py-3 text-center text-sm font-medium uppercase tracking-wide text-white transition hover:bg-transparent hover:text-[#6c1710]"
              >
                Hablar por WhatsApp
              </a>

              <a
                href="#habitaciones"
                className="inline-flex items-center justify-center rounded-full border border-[#6c1710] px-6 py-3 text-center text-sm font-medium uppercase tracking-wide text-[#6c1710] transition hover:bg-[#6c1710] hover:text-[#FFFFFF]"
              >
                Ver habitaciones
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
