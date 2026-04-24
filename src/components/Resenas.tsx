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

// ── Fallback reviews (se usan si no hay credenciales de Google) ───────────────

const FALLBACK_REVIEWS: Review[] = [
  { id: 1, platform: "google", score: 5, author: "María G.", date: "Febrero 2025", text: "Un lugar increíble para descansar. Todo limpio, cómodo y muy bien equipado. La atención fue impecable y el entorno es hermoso. Definitivamente volvemos." },
  { id: 2, platform: "google", score: 5, author: "Carlos R.", date: "Enero 2025", text: "Superó todas nuestras expectativas. Silencioso, tranquilo y con todo lo necesario para disfrutar. La ubicación es perfecta para explorar la zona serrana." },
  { id: 3, platform: "google", score: 5, author: "Sofía M.", date: "Diciembre 2024", text: "Un rincón mágico en las sierras. Las habitaciones son amplias, luminosas y tienen todo lo necesario. La familia que atiende el lugar es muy amable y atenta." },
  { id: 4, platform: "google", score: 5, author: "Roberto F.", date: "Marzo 2025", text: "Excelente relación calidad-precio. El lugar está muy bien mantenido y la limpieza es impecable. Perfecto para desconectarse del ruido de la ciudad." },
  { id: 5, platform: "google", score: 5, author: "Lucas T.", date: "Noviembre 2024", text: "Hermoso, tranquilo y muy cómodo. Ideal para una escapada en familia. Los chicos disfrutaron mucho el espacio y nosotros pudimos descansar de verdad." },
  { id: 6, platform: "google", score: 5, author: "Valentina S.", date: "Febrero 2025", text: "Todo perfecto desde la llegada hasta la partida. El alojamiento supera las fotos: es aún más acogedor en persona. Ya reservamos para volver en invierno." },
  { id: 7, platform: "google", score: 5, author: "Agustina P.", date: "Enero 2025", text: "El lugar es una joya. Tranquilidad total, naturaleza por todos lados y las instalaciones impecables. La atención personalizada hizo la diferencia." },
  { id: 8, platform: "google", score: 5, author: "Martín D.", date: "Marzo 2025", text: "Sin dudas el mejor alojamiento que tuvimos en las sierras. El entorno es hermoso y el lugar está pensado para que realmente puedas descansar." },
];

// ── Fetch reviews desde Google Places API ────────────────────────────────────

type GoogleReview = {
  rating: number;
  authorAttribution: { displayName: string };
  relativePublishTimeDescription: string;
  text?: { text: string };
};

async function fetchGoogleReviews(): Promise<Review[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || apiKey === "TU_API_KEY_AQUI" || !placeId || placeId === "TU_PLACE_ID_AQUI") {
    return [];
  }

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "reviews",
        },
        next: { revalidate: 86400 },
      }
    );
    if (!res.ok) return [];

    const data = await res.json();
    const raw: GoogleReview[] = data.reviews ?? [];

    return raw
      .filter((r) => r.text?.text)
      .map((r, i) => ({
        id: i + 1,
        platform: "google" as const,
        score: r.rating,
        author: r.authorAttribution.displayName,
        date: r.relativePublishTimeDescription,
        text: r.text!.text,
      }));
  } catch {
    return [];
  }
}

// ── Badge de puntaje ──────────────────────────────────────────────────────────

function PlatformBadge({ platform }: { platform: "google" | "booking" }) {
  const data = {
    google: { label: "Google", score: "4.8", outOf: "/ 5", count: "179 reseñas" },
    booking: { label: "Booking.com", score: "9.7", outOf: "/ 10", count: "" },
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

export default async function Resenas() {
  const googleReviews = await fetchGoogleReviews();
  const reviews = googleReviews.length > 0 ? googleReviews : FALLBACK_REVIEWS;

  return (
    <section id="resenas" className="py-20 px-4 md:px-6 bg-(--resenas-bg)">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-light tracking-[0.15em] uppercase text-neutral-900">
            Reseñas
          </h2>
          <div className="mt-5 mb-5 mx-auto w-32 h-0.5 bg-[#FCB040]" />
          <p className="text-xs uppercase tracking-[0.3em] text-[#A87B51]">
            Lo que dicen nuestros huéspedes
          </p>
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
