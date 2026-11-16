"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, MessageCircle, X } from "lucide-react";
import { whatsappHref } from "@/lib/site";
import { PRESALTA, PRESALTA_DISMISS_COOKIE } from "@/lib/presalta";
import { useFocusTrap } from "@/lib/use-focus-trap";

const WHATSAPP_HREF = whatsappHref(
  "Hola, quiero reservar con PRE SALTA. ¿Me pasan disponibilidad y tarifas para mis fechas?"
);

// Igual a la duración de la transición de salida en las clases de abajo.
const EXIT_MS = 700;

// Teclas que en una página normal la desplazan hacia abajo.
const SCROLL_KEYS = new Set(["ArrowDown", "PageDown", " ", "Spacebar", "End"]);

/**
 * Portada a pantalla completa de PRE SALTA. Se monta encima de la web (fixed)
 * y se va con cualquier gesto de scroll, con el botón de cierre o con Escape;
 * después la página queda exactamente como siempre.
 *
 * Mientras está abierta frena el scroll de la página (para que al cerrarla el
 * visitante arranque desde el hero y no a mitad de "Nosotros") y retiene el
 * foco como un modal. Al cerrarla deja una cookie de sesión: el servidor ya no
 * la renderiza en las siguientes páginas vistas, así no hay parpadeo.
 *
 * Composición según el manual de marca PRE SALTA ("Comprá / Viajá" sobre
 * imagen): sello oficial sin modificar, rojo institucional #A80003 y
 * Trebuchet MS, que es la tipografía del programa y ya viene en el sistema.
 */
export default function PreSaltaBanner() {
  const [state, setState] = useState<"open" | "closing" | "closed">("open");
  const containerRef = useRef<HTMLDivElement>(null);

  const dismiss = useCallback(() => {
    setState((current) => (current === "open" ? "closing" : current));
  }, []);

  useFocusTrap(containerRef, state === "open", dismiss);

  useEffect(() => {
    if (state === "closing") {
      document.cookie = `${PRESALTA_DISMISS_COOKIE}=1; path=/; SameSite=Lax`;
      const timeout = window.setTimeout(() => setState("closed"), EXIT_MS);
      return () => window.clearTimeout(timeout);
    }
  }, [state]);

  useEffect(() => {
    if (state !== "open") return;

    let touchStartY: number | null = null;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (event.deltaY > 4) dismiss();
    };
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (event: TouchEvent) => {
      // Sin esto el primer swipe ya desplaza la página por detrás.
      if (event.cancelable) event.preventDefault();
      const y = event.touches[0]?.clientY;
      if (touchStartY !== null && y !== undefined && touchStartY - y > 24) {
        touchStartY = null;
        dismiss();
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      // La barra espaciadora sobre un botón o link tiene que activarlo, no cerrar.
      const target = event.target as HTMLElement | null;
      if (event.key === " " && target?.closest("a, button")) return;
      if (SCROLL_KEYS.has(event.key)) {
        event.preventDefault();
        dismiss();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [state, dismiss]);

  if (state === "closed") return null;

  const closing = state === "closing";

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="presalta-titulo"
      aria-describedby="presalta-descripcion"
      tabIndex={-1}
      className={`presalta-banner fixed inset-0 z-[60] flex h-svh flex-col overflow-hidden bg-[#3a1a10] text-white outline-none transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.7,0,0.3,1)] motion-reduce:transition-none ${
        closing ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <Image
        src="/image/presalta/fondo-presalta.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="presalta-banner__bg object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/60" />

      <button
        type="button"
        onClick={dismiss}
        aria-label="Cerrar el aviso de PRE SALTA y ver la web"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-black/25 text-white backdrop-blur-sm transition hover:bg-white hover:text-[#A80003] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:right-8 md:top-8"
      >
        <X size={22} />
      </button>

      <div className="relative z-[1] mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-5 px-4 pb-20 pt-16 md:gap-10 md:px-8">
        <h2 id="presalta-titulo" className="sr-only">
          PRE SALTA: te devolvemos el 50% de tus gastos en crédito
        </h2>

        {/* Mobile: sello arriba y dos bloques apilados. Desde md: la cápsula
            del manual con el sello encimado en el centro. */}
        <div className="presalta-font relative flex w-full flex-col items-center gap-4 md:block">
          <div className="presalta-pop order-first md:absolute md:left-1/2 md:top-1/2 md:z-[1] md:-translate-x-1/2 md:-translate-y-1/2">
            <Image
              src="/presalta/sello-presalta.png"
              alt="PRE SALTA"
              width={480}
              height={480}
              priority
              className="h-28 w-28 drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)] sm:h-44 sm:w-44 md:h-64 md:w-64 lg:h-72 lg:w-72"
            />
          </div>

          <div className="grid w-full max-w-md grid-cols-2 gap-3 md:max-w-none md:grid-cols-2 md:gap-0 md:rounded-full md:border-2 md:border-white/90 md:py-10 lg:py-12">
            <PhaseBlock
              title="Comprá"
              lines={PRESALTA.purchaseLines}
              short={PRESALTA.purchaseShort}
              className="presalta-rise md:pr-36 lg:pr-44"
              style={{ ["--presalta-delay" as string]: "0.25s" }}
            />
            <PhaseBlock
              title="Viajá"
              lines={PRESALTA.travelLines}
              short={PRESALTA.travelShort}
              className="presalta-rise md:pl-36 lg:pl-44"
              style={{ ["--presalta-delay" as string]: "0.35s" }}
            />
          </div>
        </div>

        <div
          className="presalta-font presalta-rise text-center"
          style={{ ["--presalta-delay" as string]: "0.45s" }}
        >
          <p className="text-lg font-bold uppercase leading-tight tracking-wide sm:text-2xl md:text-4xl">
            Te devolvemos el 50% de tus gastos en crédito
          </p>
          <p id="presalta-descripcion" className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/90 md:text-base">
            <span className="hidden sm:inline">
              Reservá tu estadía en CasaCerro dentro del período de compras y recuperá{" "}
            </span>
            <span className="sm:hidden">Recuperá </span>
            hasta {PRESALTA.maxCreditLabel} por adulto
            <span className="hidden sm:inline"> para disfrutar Salta</span>. Sujeto a las
            condiciones del programa.
          </p>
        </div>

        <div
          className="presalta-rise flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center"
          style={{ ["--presalta-delay" as string]: "0.55s" }}
        >
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#A80003] px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition hover:bg-white hover:text-[#A80003] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <MessageCircle size={18} />
            Reservar con PRE SALTA
          </a>
          <a
            href={PRESALTA.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-white/80 px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white hover:text-[#A80003] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Cómo funciona
            <span className="sr-only"> (abre presalta.ar en una pestaña nueva)</span>
          </a>
        </div>
      </div>

      <button
        type="button"
        onClick={dismiss}
        className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-white/85 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Ver CasaCerro
        <ChevronDown size={20} className="presalta-bounce" aria-hidden="true" />
      </button>
    </div>
  );
}

function PhaseBlock({
  title,
  lines,
  short,
  className = "",
  style,
}: {
  title: string;
  lines: readonly string[];
  short: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-3xl border-2 border-white/90 px-3 py-3 text-center md:rounded-none md:border-0 md:px-10 md:py-0 ${className}`}
      style={style}
    >
      <p className="text-2xl font-bold uppercase tracking-wide md:text-5xl">{title}</p>
      <p className="mt-1 text-sm font-bold uppercase leading-snug tracking-wide text-white/95 md:mt-3 md:text-xl">
        <span className="md:hidden">{short}</span>
        <span className="hidden md:inline">
          {lines[0]}
          <br />
          {lines[1]}
        </span>
      </p>
    </div>
  );
}
