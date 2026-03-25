import WhatsappLink from "@/components/WhatsappLink";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Nosotros from "@/components/Nosotros";
import Tarifas from "@/components/Tarifas";
import Contacto from "@/components/Contacto";
import Resenas from "@/components/Resenas";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Nosotros />
      <Resenas />
      <Tarifas />
      <Contacto />
      <WhatsappLink />
    </main>
  );
}
