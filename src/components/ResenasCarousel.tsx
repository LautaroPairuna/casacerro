"use client";

import { useCallback, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion } from "framer-motion";

type Platform = "google" | "booking";

export type Review = {
  id: number;
  platform: Platform;
  score: number;
  author: string;
  date: string;
  text: string;
  room?: string;
  tripTypes?: string[];
  highlights?: string[];
  categoryScores?: {
    habitaciones?: number;
    servicio?: number;
    ubicacion?: number;
  };
  ownerResponse?: {
    text: string;
    date?: string;
  };
};

// ── Icons ────────────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function StarRow({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${score} estrellas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 16 16" className="w-4 h-4" aria-hidden="true">
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
  const { highlights } = review;

  return (
    <article className="h-full rounded-[28px] border border-[#eadfcb] bg-white px-6 py-6 shadow-sm select-none">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <GoogleIcon />
          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500">
            Google
          </span>
        </div>
        <StarRow score={review.score} />
      </div>

      <div className="mt-6 flex min-h-[168px] flex-col">
        <Quote size={24} className="mb-3 text-[#d7b27a]" strokeWidth={1.5} />
        <p className="text-[15px] leading-8 text-neutral-700 italic line-clamp-6">
          &quot;{review.text}&quot;
        </p>
      </div>

      {highlights && highlights.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {highlights.slice(0, 4).map((h) => (
            <span
              key={h}
              className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-neutral-500"
            >
              {h}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#eee2cf] pt-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8d9c0] bg-[#f8f1e3] text-[11px] font-semibold uppercase text-[#6c1710] shrink-0">
            {review.author.slice(0, 2)}
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-800 leading-tight">{review.author}</p>
            {review.room && (
              <p className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">{review.room}</p>
            )}
          </div>
        </div>
        <span className="shrink-0 text-[11px] uppercase tracking-[0.12em] text-neutral-400">
          {review.date}
        </span>
      </div>
    </article>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ResenasCarousel({ reviews }: { reviews: Review[] }) {
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
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-5 -ml-1 pl-1">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex-none w-full md:w-[min(50%,400px)] xl:w-[min(33.333%,420px)]"
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>

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
  );
}
