"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type LinkItem = { href: string; label: string };

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1280);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems: LinkItem[] = useMemo(
    () => [
      { href: "#nosotros", label: "Nosotros" },
      { href: "#resenas", label: "Reseñas" },
      { href: "#habitaciones", label: "Habitaciones" },
      { href: "#tarifas", label: "Tarifas" },
      {href: "#empresas", label: "Empresas"},
      { href: "#contacto", label: "Contacto" },
    ],
    []
  );

  const isExternal = (href: string) => href.startsWith("http");

  const handleSectionNavigation = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.startsWith("#")) return;
    event.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const headerHeight = 88;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: "smooth" });
      window.history.pushState(null, "", href);
    }
    setMenuOpen(false);
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full bg-[#FFF8e7] text-black py-4 px-4 md:px-6 z-40 shadow-md"
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="mx-auto w-full max-w-[1200px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center shrink-0">
          <Link href="/">
            <Image
              src="/logo-casacerro-base.svg"
              alt="Casacerro Salta"
              width={120}
              height={120}
              className="w-32 cursor-pointer transition-transform duration-300 hover:scale-105"
            />
          </Link>
        </div>

        {/* Menú desktop */}
        {isDesktop && (
          <div className="flex items-center justify-end">
            <ul className="flex items-center justify-end p-0">
              {menuItems.map((item, index) => (
                <React.Fragment key={item.href}>
                  <li className="whitespace-nowrap">
                    <a
                      href={item.href}
                      target={isExternal(item.href) ? "_blank" : undefined}
                      rel={isExternal(item.href) ? "noopener noreferrer" : undefined}
                      onClick={(event) => handleSectionNavigation(event, item.href)}
                      className="relative group py-1 font-sans font-medium text-base transition-colors duration-300 hover:text-gray-800 uppercase"
                    >
                      {item.label}
                      <span className="absolute left-1/2 bottom-0 h-[1px] w-0 bg-black transition-all duration-300 group-hover:w-full group-hover:left-0" />
                    </a>
                  </li>
                  {index < menuItems.length - 1 && (
                    <li className="flex items-center mx-6">
                      <span className="text-lg">•</span>
                    </li>
                  )}
                </React.Fragment>
              ))}
            </ul>
          </div>
        )}

        {/* Toggle móvil */}
        <div className="flex items-center gap-x-6 xl:hidden">
          <button
            className="text-3xl focus:outline-none flex items-center ml-4 text-[#6c1710]"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Abrir menú"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {menuOpen && !isDesktop && (
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 bg-[#FFF8e7] flex flex-col items-center justify-center z-50"
          >
            <button
              className="absolute top-6 right-6 text-3xl focus:outline-none text-[#6c1710]"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
            >
              ✖
            </button>

            <ul className="text-xl space-y-6 text-center">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target={isExternal(item.href) ? "_blank" : undefined}
                    rel={isExternal(item.href) ? "noopener noreferrer" : undefined}
                    onClick={(event) => handleSectionNavigation(event, item.href)}
                    className="relative group font-sans transition-colors duration-300 hover:text-gray-800 uppercase"
                  >
                    {item.label}
                    <span className="absolute left-1/2 bottom-0 h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-full group-hover:left-0" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
