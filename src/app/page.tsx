import Image from "next/image";

export default function Home() {
  return (
    <Image
      src="/logo-casacerro-animado.svg"
      alt="Next.js logo"
      width={100}
      height={40}
      priority
    />
  );
}
