import Image from "next/image";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar";

import { BookOpen, CheckCircle, Scale } from "lucide-react";
export default function HeroEOR() {
    
  return (
    <main className="bg-white text-gray-900"><Navbar/>
<section className="relative h-[85vh] flex items-center">
  
  {/* Background */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: "url('/images/paie-bg.jpg')" }}
  >
    <div className="absolute inset-0 bg-black/60"></div>
  </div>

  {/* Content */}
  <div className="relative max-w-6xl mx-auto px-6 text-white">

    {/* Tag */}
    <span className="px-4 py-1 text-xs border border-white/30 rounded-full text-gray-300 tracking-widest mb-6 inline-block">
      ● EXTERNALISATION PAIE
    </span>

    {/* Title */}
    <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
      <span>
        Paie & Conformité
      </span>
      <br />
      <span className="italic text-gray-200">
        sans risque, zéro contrainte.
      </span>
    </h1>

    {/* Description */}
    <p className="text-gray-300 max-w-xl mb-8 text-lg leading-relaxed">
      Externalisez votre paie en Tunisie : gestion complète, conformité absolue et
      optimisation des charges sociales. Nos experts vous libèrent du temps et
      sécurisent vos obligations légales.
    </p>

    {/* Buttons */}
    <div className="flex gap-4">
      
      <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full font-semibold transition">
        Voir nos tarifs →
      </button>

      <button className="border border-white/40 px-6 py-3 rounded-full text-gray-200 hover:bg-white hover:text-black transition">
        Découvrir le processus ▶
      </button>

    </div>

  </div>
</section>
    
    
    
    
    
    
        <section className="pt-20">
        <Footer /></section>
    </main>
  );
}