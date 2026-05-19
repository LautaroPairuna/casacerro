import ResenasCarousel, { type Review } from "@/components/ResenasCarousel";

// ── Icons ─────────────────────────────────────────────────────────────────────

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

function BookingIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-5 h-5" aria-hidden="true">
      <rect width="32" height="32" rx="4" fill="#003580" />
      <text x="7" y="23" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold" fill="#ffffff">b.</text>
    </svg>
  );
}

const FALLBACK_REVIEWS: Review[] = [
  {
    id: 1,
    platform: "google",
    score: 5,
    author: "Patricia Arce",
    date: "Mayo 2026",
    text: "Excelente atención de los anfitriones y el servicio de alojamiento muy completo y confortable. Muy buena ubicación.",
    tripTypes: ["Vacaciones", "Familiar"],
    categoryScores: { habitaciones: 5, servicio: 5, ubicacion: 5 },
    highlights: ["Vista increíble", "Tranquilo", "Buen precio"],
    ownerResponse: {
      text: "Mucho nos reconforta estimada Patricia, saber que se han sentido cómodos y a gusto con nosotros! Hasta pronto!",
      date: "Mayo 2026",
    },
  },
  {
    id: 2,
    platform: "google",
    score: 5,
    author: "Paula Cortez",
    date: "Marzo 2026",
    text: "Excelente servicio!!!",
    tripTypes: ["Vacaciones", "Familiar"],
    categoryScores: { habitaciones: 5, servicio: 5, ubicacion: 5 },
    highlights: ["Vista increíble"],
    ownerResponse: {
      text: "Muchas gracias Paula por tu valoración. Es una satisfacción que te hayas sentido cómoda y a gusto con nosotros. Hasta pronto!",
      date: "Marzo 2026",
    },
  },
  {
    id: 3,
    platform: "google",
    score: 5,
    author: "Ana Cristina Diaz Singh",
    date: "Enero 2026",
    text: "Hermoso lugar, muy cómodo, buena ubicación. Seguro lo volvemos a elegir en nuestra próxima visita a Salta.",
    tripTypes: ["Vacaciones"],
    categoryScores: { habitaciones: 5, servicio: 5, ubicacion: 5 },
    highlights: ["Tranquilo", "Apto para niños", "Buen precio"],
  },
  {
    id: 4,
    platform: "google",
    score: 5,
    author: "Daniel Edgardo Lavallen",
    date: "Diciembre 2025",
    text: "Amabilidad, muy buen servicio y la comodidad exacta.",
    categoryScores: { habitaciones: 5, servicio: 5, ubicacion: 5 },
    ownerResponse: {
      text: "Muchas gracias Daniel por tu valoración. Para nosotros es muy importante la opinión de nuestros huéspedes para brindar un óptimo servicio. Hasta pronto!",
      date: "Diciembre 2025",
    },
  },
  {
    id: 5,
    platform: "google",
    score: 5,
    author: "Andres (BCSA)",
    date: "Diciembre 2025",
    text: "Excelente atención, predisposición del personal. La unidad super cómoda, excelente disposición y comodidades.",
    tripTypes: ["Por negocios", "Una persona sola"],
    categoryScores: { habitaciones: 5, servicio: 5, ubicacion: 5 },
    highlights: ["Tranquilo", "Buen precio"],
    ownerResponse: {
      text: "Muchas gracias Andrés por tomarte el tiempo y calificarnos. Para nosotros es muy importante para seguir mejorando. Nos encanta que te hayas sentido cómodo y a gusto con nosotros. Saludos y hasta pronto!",
      date: "Diciembre 2025",
    },
  },
  {
    id: 6,
    platform: "google",
    score: 5,
    author: "Araujo María Elisa",
    date: "Diciembre 2025",
    text: "",
    tripTypes: ["Vacaciones", "Familiar"],
    categoryScores: { habitaciones: 4, servicio: 4, ubicacion: 5 },
    highlights: ["Tranquilo", "Buen precio"],
    ownerResponse: {
      text: "Muchas gracias Elisa por tu valoración. Nos alegra saber que se sintieron cómodos y a gusto con nosotros. Hasta pronto!",
      date: "Diciembre 2025",
    },
  },
  {
    id: 7,
    platform: "google",
    score: 5,
    author: "Ricardo Rodríguez",
    date: "Diciembre 2025",
    text: "Excelente todo muy cómodo a pasito del schoping buena ubicación y Excelente atención de los dueños",
    tripTypes: ["Vacaciones", "Familiar"],
    categoryScores: { habitaciones: 4, servicio: 4, ubicacion: 4 },
    highlights: ["Tranquilo"],
    ownerResponse: {
      text: "Muchas gracias Ricardo por tu valoración. Para nosotros es muy importante recibir la opinión de nuestros huéspedes para ofrecerles siempre un mejor servicio. Hasta pronto!",
      date: "Diciembre 2025",
    },
  },
  {
    id: 8,
    platform: "google",
    score: 5,
    author: "Yulian Casco",
    date: "Noviembre 2025",
    text: "",
    categoryScores: { habitaciones: 5, servicio: 5, ubicacion: 5 },
    ownerResponse: {
      text: "Muchas gracias Yulian por tomarte el tiempo y calificarnos. Esto es muy importante para seguir mejorando y brindar un mejor servicio a nuestros huéspedes. Saludos y hasta pronto!",
      date: "Noviembre 2025",
    },
  },
];

// ── Badge de puntaje ──────────────────────────────────────────────────────────

function PlatformBadge({ platform }: { platform: "google" | "booking" }) {
  const data = {
    google: { label: "Google", score: "4.8", outOf: "/ 5", count: "180 reseñas" },
    booking: { label: "Booking.com", score: "9.3", outOf: "/ 10", count: "" },
  }[platform];

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#e8d9c0] bg-white px-6 py-4 shadow-sm">
      <div className="shrink-0">
        {platform === "google" ? <GoogleIcon /> : <BookingIcon />}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-0.5">{data.label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-[#6c1710] leading-none">{data.score}</span>
          <span className="text-sm text-neutral-400">{data.outOf}</span>
        </div>
        <p className="text-[11px] text-neutral-500 mt-0.5 min-h-[1em]">{data.count}</p>
      </div>
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────

export default function Resenas() {
  const reviews = FALLBACK_REVIEWS;

  return (
    <section id="resenas" className="py-20 px-4 md:px-6 bg-(--resenas-bg)">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-light tracking-[0.15em] uppercase text-neutral-900">
            Reseñas
          </h2>
          <div className="mt-5 mb-5 mx-auto w-32 h-0.5 bg-[#FCB040]" />
        </div>

        {/* Platform score badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <PlatformBadge platform="google" />
          <PlatformBadge platform="booking" />
        </div>

        {/* Carousel (Client Component) */}
        <ResenasCarousel reviews={reviews} />
      </div>
    </section>
  );
}