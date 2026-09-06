import Image from "next/image";
import { MapPin, MessageCircle } from "lucide-react";
import { BUSINESS, SITE_NAME, formatPhone, whatsappHref } from "@/lib/site";

const SECCIONES = [
  { href: "#nosotros", label: "Nosotros" },
  { href: "#resenas", label: "Reseñas" },
  { href: "#servicios", label: "Servicios" },
  { href: "#habitaciones", label: "Habitaciones" },
  { href: "#tarifas", label: "Tarifas" },
  { href: "#empresas", label: "Empresas" },
  { href: "#contacto", label: "Contacto" },
];

/**
 * Bloque NAP (nombre, dirección, teléfono) consistente con el JSON-LD y con
 * la ficha de Google: es una de las señales de SEO local que más pesa, y de
 * paso da enlaces internos a todas las secciones de la landing.
 */
/** lucide-react v1 ya no incluye iconos de marca: se usa el mismo SVG inline
 *  que la sección de contacto. */
function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0 text-neutral-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="w-full bg-[#f5ecd7] px-4 py-14 md:px-6">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <Image
            src="/logo-casacerro-base.svg"
            alt={`${SITE_NAME} - apartamentos en Salta`}
            width={140}
            height={70}
            loading="lazy"
            className="mb-5 w-36"
          />
          <p className="max-w-sm text-sm leading-7 text-neutral-700">
            Apartamentos amplios y equipados en la ciudad de Salta, a 50 metros del{" "}
            {BUSINESS.landmark}. Estadías cortas y prolongadas, con cochera privada y
            atención cercana.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#6c1710]">
            Contacto
          </h2>
          <address className="space-y-3 text-sm not-italic leading-6 text-neutral-700">
            <p className="flex items-start gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-neutral-500" aria-hidden="true" />
              <span>
                {BUSINESS.streetAddress}, {BUSINESS.postalCode} {BUSINESS.addressLocality},
                Provincia de {BUSINESS.addressRegion}, Argentina
              </span>
            </p>
            {BUSINESS.phones.map((phone) => (
              <p key={phone} className="flex items-center gap-2.5">
                <MessageCircle size={16} className="shrink-0 text-neutral-500" aria-hidden="true" />
                <a
                  href={whatsappHref(
                    "Hola, quisiera consultar por disponibilidad y tarifas en CasaCerro.",
                    phone.replace("+", "")
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c1710]"
                >
                  {formatPhone(phone)}
                </a>
              </p>
            ))}
            <p className="flex items-center gap-2.5">
              <InstagramIcon />
              <a
                href={BUSINESS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c1710]"
              >
                @casacerro.salta
              </a>
            </p>
          </address>
        </div>

        <nav aria-label="Secciones del sitio">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#6c1710]">
            Secciones
          </h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-neutral-700">
            {SECCIONES.map((seccion) => (
              <li key={seccion.href}>
                <a
                  href={seccion.href}
                  className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c1710]"
                >
                  {seccion.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-12 max-w-[1400px] border-t border-[#e8d9c0] pt-6 text-xs text-neutral-500">
        <p>
          © {new Date().getFullYear()} {BUSINESS.legalName} · Apartamentos en Salta,
          Argentina.
        </p>
      </div>
    </footer>
  );
}
