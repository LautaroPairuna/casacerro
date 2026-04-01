"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import type { LucideIcon } from "lucide-react";
import {
  Bath,
  BedDouble,
  CarFront,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Home,
  Shield,
  Snowflake,
  Sparkles,
  Tv,
  Users,
  Wifi,
  X,
} from "lucide-react";

type Amenity = {
  label: string;
  icon: LucideIcon;
};

type RoomCategory = {
  id: string;
  name: string;
  quantityLabel: string;
  capacityLabel: string;
  bedsLabel: string;
  cardImage: string;
  images: string[];
  cardSummary: string;
  modalDescription: string;
  amenities: Amenity[];
};

const COMMON_AMENITIES: Amenity[] = [
  { label: "WiFi rápido gratis", icon: Wifi },
  { label: "Aire acondicionado frío / calor", icon: Snowflake },
  { label: "Kitchenette", icon: Coffee },
  { label: "Servicio de limpieza", icon: Sparkles },
  { label: "TV led / cable", icon: Tv },
  { label: "Baño privado completo", icon: Bath },
  { label: "Caja fuerte", icon: Shield },
  { label: "Cochera privada", icon: CarFront },
];

const ROOM_CATEGORIES: RoomCategory[] = [
  {
    id: "monoambiente-single-doble",
    name: "Single / Doble",
    quantityLabel: "2 habitaciones",
    capacityLabel: "1 o 2 huéspedes",
    bedsLabel: "Configuración single / doble",
    cardImage: "/image/habitaciones/monoambiente-single-doble.jpeg",
    images: [
      "/image/habitaciones/monoambiente-single-doble/monoambiente-single-doble-1.jpeg",
      "/image/habitaciones/monoambiente-single-doble/monoambiente-single-doble-2.jpeg",
      "/image/habitaciones/monoambiente-single-doble/monoambiente-single-doble-3.jpeg",
    ],
    cardSummary: "Ideal para una estadía cómoda, práctica y tranquila.",
    modalDescription:
      "CasaCerro cuenta con 2 monoambientes single / doble, pensados para una o dos personas que buscan comodidad, privacidad y una excelente ubicación durante su estadía en Salta.",
    amenities: COMMON_AMENITIES,
  },
  {
    id: "monoambiente-triple",
    name: "Triple",
    quantityLabel: "1 habitacion",
    capacityLabel: "Hasta 3 huéspedes",
    bedsLabel: "Configuración triple",
    cardImage: "/image/habitaciones/monoambiente-triple.jpeg",
    images: [
      "/image/habitaciones/monoambiente-triple/monoambiente-triple-1.jpeg",
      "/image/habitaciones/monoambiente-triple/monoambiente-triple-2.jpeg",
      "/image/habitaciones/monoambiente-triple/monoambiente-triple-3.jpeg",
    ],
    cardSummary: "Una opción versátil para grupos pequeños o familias.",
    modalDescription:
      "Este monoambiente triple está preparado para alojar hasta 3 personas en un espacio funcional, cálido y confortable, ideal para una estadía simple y agradable.",
    amenities: COMMON_AMENITIES,
  },
  {
    id: "monoambiente-4-personas",
    name: "Monoambientes",
    quantityLabel: "3 habitaciones",
    capacityLabel: "Hasta 4 huéspedes",
    bedsLabel: "Configuración para 4 personas",
    cardImage: "/image/habitaciones/dos-ambientes-4-personas.jpeg",
    images: [
      "/image/habitaciones/dos-ambientes-4-personas/dos-ambientes-4-personas-1.jpeg",
      "/image/habitaciones/dos-ambientes-4-personas/dos-ambientes-4-personas-2.jpeg",
      "/image/habitaciones/dos-ambientes-4-personas/dos-ambientes-4-personas-3.jpeg",
    ],
    cardSummary: "Amplio y cómodo para compartir en un solo ambiente.",
    modalDescription:
      "CasaCerro dispone de 3 monoambientes con capacidad de hasta 4 personas, ideales para quienes priorizan practicidad, confort y una estadía segura en una muy buena ubicación.",
    amenities: COMMON_AMENITIES,
  },
  {
    id: "dos-ambientes-4-personas",
    name: "Dos Ambientes",
    quantityLabel: "1 habitacion",
    capacityLabel: "Hasta 4 huéspedes",
    bedsLabel: "Ambientes separados",
    cardImage: "/image/habitaciones/monoambiente-4-personas.jpeg",
    images: [
      "/image/habitaciones/monoambiente-4-personas/monoambiente-4-personas-1.jpeg",
      "/image/habitaciones/monoambiente-4-personas/monoambiente-4-personas-2.jpeg",
      "/image/habitaciones/monoambiente-4-personas/monoambiente-4-personas-3.jpeg",
    ],
    cardSummary: "Más amplitud, privacidad y comodidad para la estadía.",
    modalDescription:
      "La habitacion de dos ambientes ofrece una experiencia más espaciosa y privada para hasta 4 personas, siendo una excelente alternativa para familias o grupos.",
    amenities: COMMON_AMENITIES,
  },
];

type RoomModalProps = {
  room: RoomCategory;
  onClose: () => void;
};

function AmenityItem({ icon: Icon, label }: Amenity) {
  return (
    <div className="flex flex-col items-center justify-start gap-3 text-center">
      <Icon className="h-8 w-8 text-neutral-500" />
      <p className="max-w-[130px] text-sm leading-5 text-neutral-600 md:text-base">
        {label}
      </p>
    </div>
  );
}

function RoomModal({ room, onClose }: RoomModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

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
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[999] bg-black/55 p-4 md:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          className="mx-auto flex h-full w-full max-w-[1320px] items-center justify-center"
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.98 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <div className="relative max-h-[92vh] w-full overflow-hidden rounded-[32px] bg-[#eee] shadow-2xl">
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              className="absolute left-4 top-4 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#770000] text-white transition hover:opacity-90"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="grid max-h-[92vh] grid-cols-1 overflow-y-auto lg:grid-cols-12">
              <div className="p-8 pt-24 md:p-10 md:pt-24 lg:col-span-6 lg:p-12 lg:pt-24">
                <h3 className="text-4xl uppercase leading-tight tracking-[0.08em] text-neutral-900 md:text-5xl">
                  {room.name}
                </h3>

                <div className="mt-6 space-y-3 text-sm uppercase tracking-[0.16em] text-neutral-500 md:text-base">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span>{room.quantityLabel}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{room.capacityLabel}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <BedDouble className="h-4 w-4" />
                    <span>{room.bedsLabel}</span>
                  </div>
                </div>

                <p className="mt-8 text-base leading-8 text-neutral-700 md:text-lg">
                  {room.modalDescription}
                </p>

                <div className="mt-12">
                  <h4 className="text-lg uppercase tracking-[0.16em] text-neutral-900">
                    Servicios
                  </h4>

                  <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
                    {room.amenities.map((amenity) => (
                      <AmenityItem
                        key={amenity.label}
                        icon={amenity.icon}
                        label={amenity.label}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative h-[420px] w-full md:h-[560px] lg:h-full">
                  <div className="h-full overflow-hidden" ref={emblaRef}>
                    <div className="flex h-full">
                      {room.images.map((image, index) => (
                        <div
                          key={`${room.id}-${index}`}
                          className="relative h-full min-w-0 flex-[0_0_100%]"
                        >
                          <Image
                            src={image}
                            alt={`${room.name} - imagen ${index + 1}`}
                            fill
                            priority={index === 0}
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={scrollPrev}
                    aria-label="Imagen anterior"
                    className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-3 text-neutral-900 shadow-md transition hover:bg-white"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>

                  <button
                    type="button"
                    onClick={scrollNext}
                    aria-label="Siguiente imagen"
                    className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-3 text-neutral-900 shadow-md transition hover:bg-white"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>

                  <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
                    {room.images.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => scrollTo(index)}
                        aria-label={`Ir a la imagen ${index + 1}`}
                        className={`h-2.5 rounded-full transition-all ${
                          selectedIndex === index
                            ? "w-8 bg-white"
                            : "w-2.5 bg-white/65 hover:bg-white/85"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Habitaciones() {
  const [selectedRoom, setSelectedRoom] = useState<RoomCategory | null>(null);

  return (
    <section id="habitaciones" className="w-full bg-[#eee] px-4 py-20 md:px-6">
      <div className="mx-auto w-full max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl md:text-6xl font-light tracking-[0.15em] uppercase text-neutral-900">
            Habitaciones
          </h2>
          <div className="mt-5 mb-5 mx-auto w-32 h-0.5 bg-[#FCB040]" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:grid-cols-4">
          {ROOM_CATEGORIES.map((room, index) => (
            <motion.article
              key={room.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
              className="overflow-hidden rounded-[32px] border border-[#e7dcc8] bg-white shadow-sm"
            >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                    src={room.cardImage}
                    alt={room.name}
                    fill
                    className="object-cover transition duration-500 hover:scale-[1.02]"
                    />
                </div>

                <div className="bg-[#f5ecd7] p-6 md:p-8">
                    <div className="flex flex-row flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-full border border-[#d8c7a8] bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-600">
                        {room.quantityLabel}
                        </span>

                        <span className="inline-flex items-center rounded-full border border-[#d8c7a8] bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-600">
                        {room.capacityLabel}
                        </span>
                    </div>

                    <h3 className="mt-4 text-3xl text-neutral-900 md:text-[2.2rem]">
                        {room.name}
                    </h3>

                    <p className="mt-4 max-w-[540px] text-base leading-7 text-neutral-700 md:text-lg">
                        {room.cardSummary}
                    </p>

                    <button
                        type="button"
                        onClick={() => setSelectedRoom(room)}
                        className="mt-6 inline-flex items-center justify-center rounded-full border border-[#8d2c16] px-6 py-3 text-sm font-medium uppercase tracking-[0.08em] text-[#8d2c16] transition hover:bg-[#8d2c16] hover:text-white"
                    >
                        Ver más
                    </button>
                </div>
            </motion.article>
          ))}
        </div>
      </div>

      {selectedRoom && (
        <RoomModal
          key={selectedRoom.id}
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </section>
  );
}
