"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useFocusTrap } from "@/lib/use-focus-trap";

type LinkItem = { href: string; label: string };

const MENU_ITEMS: LinkItem[] = [
  { href: "#inicio", label: "Inicio" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#resenas", label: "Reseñas" },
  { href: "#servicios", label: "Servicios" },
  { href: "#habitaciones", label: "Habitaciones" },
  { href: "#tarifas", label: "Tarifas" },
  { href: "#empresas", label: "Empresas" },
  { href: "#contacto", label: "Contacto" },
];

/** Píldora roja que lleva a la sección PRE SALTA (barra desktop, barra móvil y menú). */
function PreSaltaPill({
  size = "md",
  onClick,
}: {
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}) {
  const sizes = {
    sm: { pill: "gap-1.5 pl-3 pr-1 text-xs", badge: "px-1.5 text-[11px]" },
    md: { pill: "gap-2 pl-3.5 pr-1 text-sm", badge: "px-2 text-xs" },
    lg: { pill: "gap-2 py-1.5 pl-5 pr-1.5 text-lg", badge: "px-2.5 text-sm" },
  }[size];
  return (
    <a
      href="#presalta"
      onClick={onClick}
      className={`presalta-font inline-flex items-center rounded-full bg-[#A80003] py-1 font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-[#8d0003] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A80003] ${sizes.pill}`}
    >
      PreSalta
      <span className={`rounded-full bg-white py-0.5 font-bold text-[#A80003] ${sizes.badge}`}>
        50%
      </span>
    </a>
  );
}

/** `preSalta`: suma el acceso a la sección PRE SALTA mientras dura el programa. */
export default function Header({ preSalta = false }: { preSalta?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // El menú móvil tapa la pantalla completa: mientras está abierto el foco no
  // puede seguir viajando por los enlaces de abajo.
  useFocusTrap(menuRef, menuOpen, closeMenu);

  // El logo de la barra aparece recién cuando el hero (que ya muestra el
  // logo grande) quedó entero por debajo de la barra fija (h-16 = 64px).
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("inicio");
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { rootMargin: "-64px 0px 0px 0px" }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 z-40 flex h-16 w-full items-center bg-[#FFF8e7] px-4 text-black shadow-md md:px-6"
      aria-label="Navegación principal"
    >
      <div className="relative mx-auto flex w-full max-w-[1400px] items-center justify-between gap-6">
        {/* Izquierda: en el hero, el botón "Inicio" (sólo móvil); al salir
            del hero, el logo de CasaCerro. Comparten la misma celda para que
            el cambio sea un fundido sin salto de layout. */}
        <div className="grid items-center *:col-start-1 *:row-start-1">
          <a
            href="#inicio"
            inert={pastHero}
            className={`inline-flex items-center justify-self-start rounded-full border border-[#6c1710] px-4 py-1.5 text-sm font-medium uppercase tracking-wide text-[#6c1710] transition duration-300 hover:bg-[#6c1710] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c1710] motion-reduce:transition-none xl:hidden ${
              pastHero ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            Inicio
          </a>

          <a
            href="#inicio"
            aria-label="CasaCerro, volver al inicio"
            inert={!pastHero}
            className={`block rounded-sm transition duration-700 ease-[cubic-bezier(0.45,0,0.2,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c1710] motion-reduce:transition-none ${
              pastHero
                ? "translate-x-0 opacity-100"
                : "pointer-events-none -translate-x-2 opacity-0"
            }`}
          >
            <Image
              src="/logo-casacerro.svg"
              alt=""
              width={95}
              height={36}
              className="h-8 w-auto xl:h-9"
            />
          </a>
        </div>

        {/* Menú desktop: visible por CSS, no por estado de React. Así el
            HTML inicial ya trae los enlaces (los ve el crawler) y no hay
            salto de layout al hidratar. En el hero va centrado; al aparecer
            el logo se desliza a la derecha (left + translate sí se animan,
            un margin auto no). */}
        <ul
          className={`absolute top-1/2 hidden w-max -translate-y-1/2 items-center p-0 transition-[left,translate] duration-700 ease-[cubic-bezier(0.45,0,0.2,1)] motion-reduce:transition-none xl:flex ${
            pastHero ? "left-full -translate-x-full" : "left-1/2 -translate-x-1/2"
          }`}
        >
          {MENU_ITEMS.map((item, index) => (
            <React.Fragment key={item.href}>
              <li className="whitespace-nowrap">
                <a
                  href={item.href}
                  className="relative group inline-flex items-center py-1 font-sans font-medium text-base uppercase transition-colors duration-300 hover:text-gray-800"
                >
                  {item.label}
                  <span className="absolute left-1/2 bottom-0 h-[1px] w-0 bg-black transition-all duration-300 group-hover:w-full group-hover:left-0" />
                </a>
              </li>
              {/* PRE SALTA va entre "Inicio" y "Nosotros". */}
              {preSalta && index === 0 && (
                <>
                  <li aria-hidden="true" className="mx-3 flex items-center 2xl:mx-5">
                    <span className="text-lg">•</span>
                  </li>
                  <li className="whitespace-nowrap">
                    <PreSaltaPill />
                  </li>
                </>
              )}
              {index < MENU_ITEMS.length - 1 && (
                // mx-3 en xl: con la píldora de PRE SALTA y el logo, a 1280px
                // el menú no entra con más aire.
                <li aria-hidden="true" className="mx-3 flex items-center 2xl:mx-5">
                  <span className="text-lg">•</span>
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>

        <div className="flex items-center gap-3 xl:hidden">
          {preSalta && <PreSaltaPill size="sm" />}
          <button
            type="button"
            className="flex items-center rounded-sm text-3xl leading-none text-[#6c1710] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c1710]"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div
          id="menu-movil"
          ref={menuRef}
          tabIndex={-1}
          className="cc-anim-slide-down fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFF8e7] focus:outline-none xl:hidden"
        >
          <button
            type="button"
            className="absolute right-6 top-6 rounded-sm text-3xl text-[#6c1710] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c1710]"
            onClick={closeMenu}
            aria-label="Cerrar menú"
          >
            ✖
          </button>

          <ul className="text-xl space-y-6 text-center">
            {MENU_ITEMS.map((item, index) => (
              <React.Fragment key={item.href}>
                <li>
                  <a
                    href={item.href}
                    onClick={closeMenu}
                    className="relative group font-sans transition-colors duration-300 hover:text-gray-800 uppercase"
                  >
                    {item.label}
                    <span className="absolute left-1/2 bottom-0 h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-full group-hover:left-0" />
                  </a>
                </li>
                {preSalta && index === 0 && (
                  <li>
                    <PreSaltaPill size="lg" onClick={closeMenu} />
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
