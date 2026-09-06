"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useFocusTrap } from "@/lib/use-focus-trap";

type LinkItem = { href: string; label: string };

const MENU_ITEMS: LinkItem[] = [
  { href: "#nosotros", label: "Nosotros" },
  { href: "#resenas", label: "Reseñas" },
  { href: "#servicios", label: "Servicios" },
  { href: "#habitaciones", label: "Habitaciones" },
  { href: "#tarifas", label: "Tarifas" },
  { href: "#empresas", label: "Empresas" },
  { href: "#contacto", label: "Contacto" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // El menú móvil tapa la pantalla completa: mientras está abierto el foco no
  // puede seguir viajando por los enlaces de abajo.
  useFocusTrap(menuRef, menuOpen, closeMenu);

  return (
    <nav
      className="fixed top-0 left-0 w-full bg-[#FFF8e7] text-black py-4 px-4 md:px-6 z-40 shadow-md"
      aria-label="Navegación principal"
    >
      <div className="mx-auto w-full max-w-[1400px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center shrink-0">
          <Link href="/" aria-label="CasaCerro - inicio">
            <Image
              src="/logo-casacerro-base.svg"
              alt="CasaCerro Salta"
              width={120}
              height={120}
              loading="eager"
              className="w-32 cursor-pointer transition-transform duration-300 hover:scale-105"
            />
          </Link>
        </div>

        {/* Menú desktop: visible por CSS, no por estado de React. Así el HTML
            inicial ya trae los enlaces (los ve el crawler) y no hay salto de
            layout al hidratar. */}
        <div className="hidden items-center justify-end xl:flex">
          <ul className="flex items-center justify-end p-0">
            {MENU_ITEMS.map((item, index) => (
              <React.Fragment key={item.href}>
                <li className="whitespace-nowrap">
                  <a
                    href={item.href}
                    className="relative group py-1 font-sans font-medium text-base transition-colors duration-300 hover:text-gray-800 uppercase"
                  >
                    {item.label}
                    <span className="absolute left-1/2 bottom-0 h-[1px] w-0 bg-black transition-all duration-300 group-hover:w-full group-hover:left-0" />
                  </a>
                </li>
                {index < MENU_ITEMS.length - 1 && (
                  <li aria-hidden="true" className="flex items-center mx-6">
                    <span className="text-lg">•</span>
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>

        {/* Toggle móvil */}
        <div className="flex items-center gap-x-6 xl:hidden">
          <button
            type="button"
            className="ml-4 flex items-center rounded-sm text-3xl text-[#6c1710] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c1710]"
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
            {MENU_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={closeMenu}
                  className="relative group font-sans transition-colors duration-300 hover:text-gray-800 uppercase"
                >
                  {item.label}
                  <span className="absolute left-1/2 bottom-0 h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-full group-hover:left-0" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
