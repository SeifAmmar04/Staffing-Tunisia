"use client";

import { Globe, Calculator, Users } from "lucide-react";

export default function Solutions() {
  return (
    <section id="solutions"  className="bg-white py-16 px-6 md:px-16">

      {/* HEADER */}
     <div className="flex items-center gap-3 mb-18">
    <span className="w-8 h-[2px] bg-red-500"></span>
    <p className="text-red-500 uppercase tracking-[0.2em] text-lg font-semibold">
      Solutions Complètes
    </p>
  </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-3 gap-8 ">

        {/* CARD 1 */}
        <div className="bg-gradient-to-r from-[#020617] via-[#020617] to-[#0a1a2f] text-white rounded-2xl p-8 hover:scale-105 hover:shadow-2xl transition duration-300">
          
          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-6">
            <Globe className="text-red-500" size={22} />
          </div>

          <h3 className="text-xl font-semibold mb-3">
            EOR & Portage
          </h3>

          <p className="text-gray-300 mb-6">
            Hébergement légal de vos salariés. Nous portons la responsabilité
            juridique, fiscale et sociale.
          </p>

          <span className="text-sm font-semibold flex items-center gap-2 cursor-pointer text-red-500 hover:underline">
            DÉCOUVRIR →
          </span>
        </div>

        {/* CARD 2 */}
        <div className="bg-gradient-to-r from-[#020617] via-[#020617] to-[#0a1a2f]  text-white rounded-2xl p-8 hover:scale-105 hover:shadow-2xl transition duration-300">
          
          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-6">
            <Calculator className="text-red-500" size={22} />
          </div>

          <h3 className="text-xl font-semibold mb-3">
            Gestion Paie
          </h3>

          <p className="text-gray-300 mb-6">
            Traitement des salaires, déclarations CNSS et fiscales. Conformité locale assurée.
          </p>

          <span className="text-sm font-semibold flex items-center gap-2 cursor-pointer text-red-500 hover:underline">
            DÉCOUVRIR →
          </span>
        </div>

        {/* CARD 3 */}
        <div className="bg-gradient-to-r from-[#020617] via-[#020617] to-[#0a1a2f] text-white rounded-2xl p-8 hover:scale-105 hover:shadow-2xl transition duration-300">
          
          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-6">
            <Users className="text-red-500" size={22} />
          </div>

          <h3 className="text-xl font-semibold mb-3">
            Recrutement
          </h3>

          <p className="text-gray-300 mb-6">
            Sourcing de talents IT et multilingues. 4 packs adaptés à vos besoins de croissance.
          </p>

          <span className="text-sm font-semibold flex items-center gap-2 cursor-pointer text-red-500 hover:underline">
            DÉCOUVRIR →
          </span>
        </div>

      </div>
    </section>
  );
}