"use client";

import Image from "next/image";

const logos = [
  "/logo1.png",
  "/logo2.png",
  "/logo3.png",
  "/logo4.png",
  
 "/logo6.png",
  "/logo7.png",
  "/logo8.png",
  "/logo9.png",
  "/logo10.png",
  "/logo11.png",
  "/logo12.png",
  "/logo13.png",
  "/logo14.png",
  "/logo15.png",

  
];

export default function Clients() {
  return (
    <section className="bg-white py-20 px-6 md:px-16 overflow-hidden">
      
   <div className="max-w-6xl mb-16">

  {/* LABEL */}
  <div className="flex items-center gap-3 mb-5">
    <span className="w-8 h-[2px] bg-red-500"></span>
    <p className="text-red-500 uppercase tracking-[0.2em] text-lg font-semibold">
      Confiance
    </p>
  </div>

  {/* TITLE */}
  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
    Des entreprises nous font confiance
  </h2>

  {/* DESCRIPTION */}
  <p className="text-gray-600 text-base md:text-lg max-w-2xl">
    Nous aidons nos clients à trouver les bons talents et à développer leur activité en toute simplicité.
  </p>

</div>
      {/* LOGOS */}
      <div className="relative overflow-hidden">
        <div className="flex items-center gap-16 w-max animate-scroll">
          
          {[...logos, ...logos].map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center w-[140px] h-[60px] flex-shrink-0"
            >
              <Image
          src={logo}
          alt="client"
          width={0}
          height={0}
          sizes="100vw"
          className="h-full w-auto object-contain grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition"
        />
            </div>
          ))}

        </div>
      </div>
    </section>
  );}