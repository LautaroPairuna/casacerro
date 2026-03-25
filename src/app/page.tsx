import WhatsappLink from "@/components/WhatsappLink";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Nosotros from "@/components/Nosotros";
import Tarifas from "@/components/Tarifas";
import Contacto from "@/components/Contacto";
import Resenas from "@/components/Resenas";
import Habitaciones from "@/components/Habitaciones";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Nosotros />
      <Tarifas />
      <Contacto />
      <WhatsappLink />
    </main>
  );
}
