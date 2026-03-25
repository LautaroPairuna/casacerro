// "use client";

// import { useMemo } from "react";
// import Link from "next/link";

// const WHATSAPP_NUMBER =
//   process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5493874029160";

// export default function Contacto() {
//   const whatsappHref = useMemo(() => {
//     const message =
//       "Hola, me gustaría consultar por disponibilidad, tarifas y más información sobre Casa Cerro.";
//     return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
//   }, []);

//   return (
//     <section
//       id="contacto"
//       className="w-full bg-[#f5ecd7] px-4 py-16 md:px-6 md:py-24"
//     >
//       <div className="mx-auto w-full">
//         <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
//           {/* Texto principal */}
//           <div className="xl:col-span-5">
//             <span className="mb-4 inline-block text-sm uppercase tracking-[0.25em] text-neutral-500">
//               Contacto
//             </span>

//             <h2 className="text-3xl font-semibold leading-tight text-neutral-900 md:text-5xl">
//               Estamos para ayudarte
//               <br />
//               con tu próxima estadía
//             </h2>

//             <p className="mt-6 max-w-xl text-base leading-8 text-neutral-700 md:text-lg">
//               Si querés consultar disponibilidad, tarifas o cualquier detalle
//               sobre tu visita, podés escribirnos directamente y te responderemos
//               a la brevedad.
//             </p>
//           </div>

//           {/* Tarjetas de contacto */}
//           <div className="xl:col-span-7">
//             <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//               <div className="rounded-3xl bg-[#FFF8E7] p-6 shadow-sm">
//                 <h3 className="text-lg font-semibold text-neutral-900">
//                   WhatsApp
//                 </h3>
//                 <p className="mt-3 text-neutral-700">
//                   Contactanos de forma rápida y directa para recibir información
//                   sobre reservas y estadía.
//                 </p>

//                 <Link
//                   href={whatsappHref}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="mt-6 inline-flex rounded-full bg-black px-5 py-3 text-sm font-medium uppercase tracking-wide text-white transition hover:opacity-90"
//                 >
//                   Hablar por WhatsApp
//                 </Link>
//               </div>

//               <div className="rounded-3xl bg-[#FFF8E7] p-6 shadow-sm">
//                 <h3 className="text-lg font-semibold text-neutral-900">
//                   Información general
//                 </h3>
//                 <p className="mt-3 text-neutral-700">
//                   También podés sumar acá dirección, correo electrónico, horario
//                   de atención o cualquier otro dato de contacto importante.
//                 </p>

//                 <div className="mt-6 space-y-2 text-sm text-neutral-700">
//                   <p>
//                     <span className="font-medium text-neutral-900">
//                       Ubicación:
//                     </span>{" "}
//                     Salta, Argentina
//                   </p>
//                   <p>
//                     <span className="font-medium text-neutral-900">
//                       Email:
//                     </span>{" "}
//                     info@casacerro.com
//                   </p>
//                   <p>
//                     <span className="font-medium text-neutral-900">
//                       Atención:
//                     </span>{" "}
//                     Todos los días
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }