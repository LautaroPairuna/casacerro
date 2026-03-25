"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

type HeroImage = {
  src: string;
  alt: string;
};

const HERO_IMAGES: HeroImage[] = [
  {
    src: "/image/hero/foto-hero-2.jpeg",
    alt: "Vista principal de Casa Cerro",
  },
  {
    src: "/image/hero/foto-hero-4.jpeg",
    alt: "Habitación de Casa Cerro",
  },
  {
    src: "/image/hero/foto-hero-3.jpeg",
    alt: "Espacio exterior de Casa Cerro",
  },
];

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5493876138620";

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

  const whatsappHref = useMemo(() => {
    const message =
      "Hola, me gustaría consultar por disponibilidad y tarifas en Casa Cerro.";
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }, []);

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
    <section className="w-full bg-[#FFF] pt-32 pb-12 px-4 md:px-6">
      <div className="mx-auto grid grid-cols-1 gap-8 xl:grid-cols-12 xl:items-stretch">
        {/* 4/12 */}
        <div className="xl:col-span-4 flex">
          <div className="flex w-full flex-col justify-center rounded-3xl bg-[#f5ecd7] p-8 shadow-md md:p-10">
            <span className="mb-10 inline-block text-sm uppercase tracking-[0.25em] text-neutral-600 text-center">
              Bienvenidos a...
            </span>

            <Image
              src="/logo-casacerro-animado.svg"
              alt="Logo Casa Cerro"
              width={250}
              height={125}
              loading="lazy"
              priority={false}
              className="mx-auto mb-5"
            />

            <p className="mt-5 text-base leading-7 text-neutral-700 md:text-lg">
              Un espacio pensado para disfrutar Salta con comodidad, calidez y
              una experiencia tranquila cerca de todo lo importante.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-[#6c1710] px-6 py-3 text-sm font-medium uppercase tracking-wide text-[#6c1710] transition hover:bg-[#6c1710] hover:text-[#fcb040]"
              >
                Hablar por WhatsApp
              </Link>

              <a
                href="#habitaciones"
                className="inline-flex items-center justify-center rounded-full border border-[#6c1710] px-6 py-3 text-sm font-medium uppercase tracking-wide text-[#6c1710] transition hover:bg-[#6c1710] hover:text-[#fcb040]"
              >
                Ver habitaciones
              </a>
            </div>
          </div>
        </div>

        {/* 8/12 */}
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
                      className="object-cover"
                      priority={index === 0}
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

            <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
              {HERO_IMAGES.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => scrollTo(index)}
                  aria-label={`Ir a la imagen ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    selectedIndex === index
                      ? "w-8 bg-white"
                      : "w-2.5 bg-white/60 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}