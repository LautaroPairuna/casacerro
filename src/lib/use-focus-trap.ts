"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Manejo de foco para overlays que tapan la página (el modal de habitaciones y
 * el menú móvil). Al abrirse el foco entra al contenedor, mientras está abierto
 * no se escapa al contenido de atrás, Escape cierra, y al cerrarse el foco
 * vuelve al elemento que lo abrió. WCAG 2.1.2 y 2.4.3, nivel A.
 *
 * React no trae nada de esto: sin manejarlo a mano, alguien que navega con
 * teclado abre el overlay y sigue tabulando por las cards que quedaron debajo.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  onEscape: () => void
) {
  useEffect(() => {
    if (!active) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const container = containerRef.current;
    container?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onEscape();
        return;
      }

      if (event.key !== "Tab" || !container) return;

      const focusables = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [active, containerRef, onEscape]);
}
