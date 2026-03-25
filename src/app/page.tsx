import WhatsappLink from "@/components/WhatsappLink";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Nosotros from "@/components/Nosotros";
// import Contacto from "@/components/Contacto";

export default function Home() {
  return (
      
    <main>
      <Header />
      <Hero />
      <Nosotros />
      {/* <Contacto /> */}
      <WhatsappLink />
    </main>
  );
}
