"use client";

import { useCallback, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion } from "framer-motion";

// ── Plataform badges ─────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function BookingIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-5 h-5" aria-hidden="true">
      <rect width="32" height="32" rx="4" fill="#003580" />
      <text
        x="7"
        y="23"
        fontFamily="Arial, sans-serif"
        fontSize="20"
        fontWeight="bold"
        fill="#FEBA02"
      >
        b.
      </text>
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────

type Platform = "google" | "booking";

type Review = {
  id: number;
  platform: Platform;
  /** 1-5 for Google, 1-10 for Booking */
  score: number;
  author: string;
  date: string;
  text: string;
  /** Optional room type label */
  room?: string;
};

const REVIEWS: Review[] = [
  {
    id: 1,
    platform: "google",
    score: 5,
    author: "María G.",
    date: "Febrero 2025",
    text: "Un lugar increíble para descansar. Todo limpio, cómodo y muy bien equipado. La atención fue impecable y el entorno es hermoso. Definitivamente volvemos.",
  },
  {
    id: 2,
    platform: "booking",
    score: 10,
    author: "Carlos R.",
    date: "Enero 2025",
    text: "Superó todas nuestras expectativas. Silencioso, tranquilo y con todo lo necesario para disfrutar. La ubicación es perfecta para explorar la zona serrana.",
    room: "Dos Ambientes",
  },
  {
    id: 3,
    platform: "google",
    score: 5,
    author: "Sofía M.",
    date: "Diciembre 2024",
    text: "Un rincón mágico en las sierras. Las habitaciones son amplias, luminosas y tienen todo lo necesario. La familia que atiende el lugar es muy amable y atenta.",
  },
  {
    id: 4,
    platform: "booking",
    score: 9.6,
    author: "Roberto F.",
    date: "Marzo 2025",
    text: "Excelente relación calidad-precio. El lugar está muy bien mantenido y la limpieza es impecable. Perfecto para desconectarse del ruido de la ciudad.",
    room: "Monoambiente",
  },
  {
    id: 5,
    platform: "google",
    score: 5,
    author: "Lucas T.",
    date: "Noviembre 2024",
    text: "Hermoso, tranquilo y muy cómodo. Ideal para una escapada en familia. Los chicos disfrutaron mucho el espacio y nosotros pudimos descansar de verdad.",
  },
  {
    id: 6,
    platform: "booking",
    score: 9.8,
    author: "Valentina S.",
    date: "Febrero 2025",
    text: "Todo perfecto desde la llegada hasta la partida. El alojamiento supera las fotos: es aún más acogedor en persona. Ya reservamos para volver en invierno.",
    room: "Dos Ambientes",
  },
];

const PLATFORM_SCORES = {
  google: { label: "Google", score: "4.9", outOf: "/ 5", count: "38 reseñas" },
  booking: { label: "Booking.com", score: "9.7", outOf: "/ 10", count: "52 reseñas" },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function StarRow({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${score} estrellas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 16 16"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path
            d="M8 1.5l1.75 3.55 3.92.57-2.84 2.76.67 3.9L8 10.38l-3.5 1.85.67-3.9L2.33 5.62l3.92-.57L8 1.5z"
            fill={i <= score ? "#FCB040" : "#e8d9c0"}
            stroke={i <= score ? "#FCB040" : "#e8d9c0"}
            strokeWidth="0.5"
          />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const isGoogle = review.platform === "google";

  return (
    <div className="h-full rounded-2xl border border-[#e8d9c0] bg-white flex flex-col p-6 shadow-sm select-none">
      {/* Platform + score header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          {isGoogle ? <GoogleIcon /> : <BookingIcon />}
          <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {isGoogle ? "Google" : "Booking.com"}
          </span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          {isGoogle ? (
            <StarRow score={review.score} />
          ) : (
            <span className="text-xl font-bold text-[#6c1710] leading-none">
              {review.score}
              <span className="text-xs font-normal text-neutral-400 ml-0.5">/10</span>
            </span>
          )}
        </div>
      </div>

      {/* Quote */}
      <div className="relative flex-1">
        <Quote
          size={28}
          className="absolute -top-1 -left-1 text-[#FCB040]/40"
          strokeWidth={1.5}
        />
        <p className="text-sm text-neutral-600 leading-relaxed pl-6 italic">
          "{review.text}"
        </p>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-[#e8d9c0] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#f5ecd7] border border-[#e8d9c0] flex items-center justify-center text-[11px] font-semibold text-[#6c1710] uppercase shrink-0">
            {review.author.slice(0, 2)}
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-800 leading-tight">
              {review.author}
            </p>
            {review.room && (
              <p className="text-[10px] uppercase tracking-wide text-[#A87B51]">
                {review.room}
              </p>
            )}
          </div>
        </div>
        <span className="text-[11px] text-neutral-400 shrink-0">{review.date}</span>
      </div>
    </div>
  );
}

function PlatformBadge({ platform }: { platform: Platform }) {
  const data = PLATFORM_SCORES[platform];
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#e8d9c0] bg-white px-6 py-4 shadow-sm">
      <div className="shrink-0">
        {platform === "google" ? <GoogleIcon /> : <BookingIcon />}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-0.5">
          {data.label}
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-[#6c1710] leading-none">
            {data.score}
          </span>
          <span className="text-sm text-neutral-400">{data.outOf}</span>
        </div>
        <p className="text-[11px] text-neutral-500 mt-0.5">{data.count}</p>
      </div>
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────

export default function Resenas() {
  const autoplay = useMemo(
    () => Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true }),
    []
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", slidesToScroll: 1, duration: 50 },
    [autoplay]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section id="resenas" className="py-20 px-4 md:px-6 bg-(--resenas-bg)">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-light tracking-[0.15em] uppercase text-neutral-900">
            Reseñas
          </h2>
          <div className="mt-5 mb-5 mx-auto w-14 h-0.5 bg-[#FCB040]" />
          <p className="text-xs uppercase tracking-[0.3em] text-[#A87B51]">
            Lo que dicen nuestros huéspedes
          </p>
        </motion.div>

        {/* Platform score badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
          className="flex flex-wrap justify-center gap-4 mb-10"
        >
          <PlatformBadge platform="google" />
          <PlatformBadge platform="booking" />
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
        >
          {/* Viewport */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-5 -ml-1 pl-1">
              {REVIEWS.map((review) => (
                <div
                  key={review.id}
                  className="flex-none w-full md:w-[min(50%,400px)] xl:w-[min(33.333%,420px)]"
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={scrollPrev}
              aria-label="Reseña anterior"
              className="flex items-center justify-center w-11 h-11 rounded-full border border-[#6c1710] text-[#6c1710] transition hover:bg-[#6c1710] hover:text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Siguiente reseña"
              className="flex items-center justify-center w-11 h-11 rounded-full border border-[#6c1710] text-[#6c1710] transition hover:bg-[#6c1710] hover:text-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
