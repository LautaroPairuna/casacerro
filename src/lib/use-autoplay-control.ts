"use client";

import { useCallback, useEffect, useState } from "react";
import type { UseEmblaCarouselType } from "embla-carousel-react";

type EmblaApi = UseEmblaCarouselType[1];

/**
 * Control de pausa para los carruseles con autoplay.
 *
 * WCAG 2.2.2 (nivel A) exige poder frenar cualquier contenido que se mueva solo
 * más de 5 segundos. El `stopOnMouseEnter` de Embla no alcanza: no existe para
 * teclado ni para touch. Además corta el autoplay si el sistema pide menos
 * movimiento, que Embla no mira por su cuenta.
 */
export function useAutoplayControl(emblaApi: EmblaApi) {
  const [isPlaying, setIsPlaying] = useState(true);

  // El estado real vive en el plugin de Embla, no en React: este efecto sólo
  // lo espeja para poder etiquetar el botón.
  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = emblaApi.plugins().autoplay;
    if (!autoplay) return;

    const sync = () => setIsPlaying(autoplay.isPlaying());

    emblaApi.on("autoplay:play", sync).on("autoplay:stop", sync).on("reInit", sync);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      autoplay.stop();
    }
    sync();

    return () => {
      emblaApi.off("autoplay:play", sync).off("autoplay:stop", sync).off("reInit", sync);
    };
  }, [emblaApi]);

  const toggle = useCallback(() => {
    const autoplay = emblaApi?.plugins().autoplay;
    if (!autoplay) return;
    if (autoplay.isPlaying()) autoplay.stop();
    else autoplay.play();
  }, [emblaApi]);

  return { isPlaying, toggle };
}
