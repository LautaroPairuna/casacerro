import Image from "next/image";

type WhatsappLinkProps = {
  phone?: string;
  text?: string;
  className?: string;
};

export default function WhatsappLink({
  phone = "5493874029160",
  text = "¡Hola! Me gustaría contactar con Casacerro Salta.",
  className = "",
}: WhatsappLinkProps) {
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      title="Contactar por WhatsApp"
      className={`cc-anim-pop-in fixed z-50 inline-block rounded-full shadow-sm transition-transform hover:scale-[1.03] active:scale-95 ${className}`}
      style={{
        right: 'max(1rem, env(safe-area-inset-right))',
        bottom: 'max(1rem, env(safe-area-inset-bottom))',
      }}
    >
      <Image
        src="/icons/ico-whatsapp-ventana.svg"
        alt="WhatsApp"
        width={64}
        height={64}
        loading="lazy"
        priority={false}
      />
    </a>
  );
}
