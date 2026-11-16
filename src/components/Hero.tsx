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
      ref={sectionRef}
      aria-label="Bienvenida"
      className="relative isolate h-svh min-h-[600px] w-full overflow-hidden bg-[#2b1a12]"
    >
      {/* Carrusel a sangre, de fondo. La primera foto es el elemento LCP: se
          pinta sin animación de entrada ni espera de hidratación. */}
      <div className="hero-parallax-bg absolute inset-0 -z-10">
        <div className="h-full overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {HERO_IMAGES.map((image, index) => (
              <div key={image.src} className="relative h-full min-w-0 flex-[0_0_100%]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Oscurece abajo (mobile, donde va la tarjeta) y a la izquierda
          (desktop) para que los controles blancos se lean sobre cualquier foto. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/55 via-black/10 to-black/25 xl:bg-gradient-to-r xl:from-black/45 xl:via-black/10 xl:to-transparent"
      />

      <div className="mx-auto flex h-full max-w-[1400px] flex-col justify-end px-4 pb-24 pt-28 md:px-6 xl:justify-center xl:pb-16">
        {/* Above the fold: animación por CSS en vez de <Reveal>, que arranca en
            opacity:0 y no se muestra hasta que hidrata el JS (retrasa el LCP). */}
        <div className="hero-parallax-content w-full max-w-md">
          <div
            className="cc-anim-fade-up rounded-3xl bg-[#f5ecd7]/95 p-6 shadow-xl backdrop-blur-sm sm:p-8 md:p-10"
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
                className="mx-auto mb-3 h-auto w-44 sm:mb-4 sm:w-[250px]"
              />
              <span className="block text-lg leading-7 tracking-[0.06em] text-neutral-800 sm:text-xl sm:leading-8 md:text-2xl">
                Apartamentos en Salta, a 50 metros del Shopping Alto Noa
              </span>
            </h1>

            <p className="mt-4 hidden text-base leading-7 text-neutral-700 sm:block md:mt-5 md:text-lg">
              Un espacio pensado para disfrutar Salta con comodidad, calidez y
              una experiencia tranquila cerca de todo lo importante.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-1 sm:gap-4">
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-[#6c1710] bg-[#6c1710] px-4 py-3 text-center text-xs font-medium uppercase tracking-wide text-white transition hover:bg-transparent hover:text-[#6c1710] sm:px-6 sm:text-sm"
              >
                Hablar por WhatsApp
              </a>

              <a
                href="#habitaciones"
                className="inline-flex items-center justify-center rounded-full border border-[#6c1710] px-4 py-3 text-center text-xs font-medium uppercase tracking-wide text-[#6c1710] transition hover:bg-[#6c1710] hover:text-[#FFFFFF] sm:px-6 sm:text-sm"
              >
                Ver habitaciones
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Controles del carrusel: arriba a la derecha en mobile (abajo está la
          tarjeta), abajo a la derecha desde md. */}
      <div className="absolute right-4 top-28 z-20 flex items-center gap-1 rounded-full bg-black/35 px-2 py-1 backdrop-blur-sm md:bottom-8 md:right-28 md:top-auto">
        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Imagen anterior"
          className="hidden h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:flex"
        >
          <ChevronLeft size={20} />
        </button>

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
          className="flex h-7 w-7 items-center justify-center rounded-full text-white transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {isPlaying ? <Pause size={13} /> : <Play size={13} />}
        </button>

        <button
          type="button"
          onClick={scrollNext}
          aria-label="Siguiente imagen"
          className="hidden h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:flex"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Indicador de scroll hacia la primera sección. */}
      <a
        href="#nosotros"
        aria-label="Bajar a Acerca de nosotros"
        className="hero-parallax-content absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/90 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:flex"
      >
        <span aria-hidden="true">Descubrí más</span>
        <span aria-hidden="true" className="flex h-9 w-5 justify-center rounded-full border-2 border-white/80 pt-1.5">
          <span className="hero-scroll-dot block h-2 w-1 rounded-full bg-white" />
        </span>
      </a>
    </section>
  );
}
