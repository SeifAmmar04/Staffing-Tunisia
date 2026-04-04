"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function CandidatPage() {
  return (
    <main className="bg-white text-gray-900">
      <div className="mt-30" ><Navbar /></div>

      {/* HERO */}
<section className="pt-40 m-15  pb-24 bg-gray-100 text-gray-900 rounded-2xl">
  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

    {/* TEXT (LEFT - PLUS LARGE) */}
    <motion.div
      className="md:col-span-1 lg:col-span-1"
      initial={{ opacity: 0, x: -60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-5xl md:text-5xl font-bold leading-tight mb-6 text-gray-900">
        Boostez votre recherche d'emploi en ligne
      </h1>

      <p className="text-lg mb-8 leading-relaxed text-gray-600">
        Devenez un candidat compétitif grâce à notre site de recherche d’emploi en ligne.
        Fini les tracas de la candidature : rejoignez notre communauté et postulez aux meilleures offres.
      </p>

      {/* LIST */}
      <div className="space-y-4 mb-8">
        {[
          "Créer un profil professionnel",
          "Créer un CV professionnel gratuit",
          "Contacter les recruteurs",
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-900 flex items-center justify-center text-white text-xs">
              ✓
            </div>
            <p className="text-black-900 font-medium">{item}</p>
          </div>
        ))}
      </div>

      <button className="bg-gradient-to-r from-[#020617] via-[#020617] to-[#0a1a2f] text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition">
        INSCRIPTION EN LIGNE
      </button>
    </motion.div>

    {/* IMAGE (RIGHT - PLUS PETITE) */}
    <motion.div
      className="flex justify-center"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <img
        src="/cand.png"
        alt="Candidat"
        height={600}
        
        
      />
    </motion.div>

  </div>
</section>
      

      <Footer />
    </main>
  );
}