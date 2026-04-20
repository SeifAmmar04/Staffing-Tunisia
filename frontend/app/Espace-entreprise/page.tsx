"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function EspaceEntreprise() {
const steps = [
  {
    title: "Tri des candidatures",
    desc: "Nous analysons et filtrons les candidatures reçues afin de sélectionner les profils les plus pertinents selon vos besoins."
  },
  {
    title: "Évaluation des compétences",
    desc: "Nous organisons des tests techniques et fonctionnels pour mesurer les compétences réelles des candidats."
  },
  {
    title: "Analyse et sélection",
    desc: "Nos experts évaluent chaque profil en fonction de l’expérience, des compétences et de l’adéquation avec votre entreprise."
  },
  {
    title: "Accompagnement au recrutement",
    desc: "Nous vous accompagnons tout au long du processus afin de faciliter votre prise de décision et sécuriser vos recrutements."
  }
];

  return (
    <main className="bg-white text-gray-900">
      <div className="mt-30" ><Navbar /></div>

  {/* HERO */}
<section className="pt-40 m-15  pb-24 bg-gradient-to-r from-[#020617] via-[#020617] to-[#0a1a2f]  text-gray-900 rounded-2xl">
  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

    {/* TEXTE */}
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >


      <h1 className="text-6xl font-bold mb-8 leading-tight text-red-400">
        Simplifiez vos recrutements
      </h1>

      <p className="text-white  text-xl mb-10 leading-relaxed max-w-xl">
        Nous accompagnons les entreprises dans l'identification,
        l'évaluation et l'intégration des meilleurs talents,
        quel que soit le secteur d'activité.
      </p>
    </motion.div>

    {/* IMAGE */}
    <motion.img
      src="/rec.png"
      className="w-full max-w-lg mx-auto"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    />

  </div>
</section> 
      {/* PROCESS */}
<section className="py-24 bg-gray-50">
  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

    {/* IMAGE LEFT */}
   <div className="flex justify-center -ml-10">
  <img
    src="/rec2.png"
    alt="Recrutement en ligne"
    className="w-full max-w-xl "
  />
</div>

    {/* TEXT RIGHT */}
    <div>

      <h2 className="text-4xl font-bold mb-6">
        Gestion des candidature
      </h2>

      <p className="text-gray-600 mb-10 text-lg leading-relaxed">
        Nous prenons en charge l’ensemble de votre processus de recrutement en ligne.
        De la réception des candidatures jusqu’à la sélection finale,
        notre équipe vous accompagne pour identifier rapidement les meilleurs talents.
      </p>

      <div className="space-y-10">

        {steps.map((step, index) => (
          <div key={index} className="flex gap-6 items-start">

            {/* NUMERO */}
            <div className="w-14 h-14 flex items-center justify-center rounded-full border-4 bordergradient-to-br from-[#020617] via-[#071a33] to-[#0a1a2f] 500 text-bleu-500 font-bold text-lg">
              {String(index + 1).padStart(2, "0")}
            </div>

            {/* TEXTE */}
            <div>
              <p className="font-semibold text-lg mb-1">
                {step.title}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {step.desc}
              </p>
            </div>

          </div>
        ))}

      </div>

    </div>

  </div>
</section>
{/* WHY US + FORM */}
<section className="py-24 bg-gray-50">
  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">

    {/* LEFT CONTENT */}
    <div>
  <h2 className="text-5xl font-bold mb-12 leading-tight">
    Pourquoi nous confier vos recrutements ?
  </h2>

  <div className="space-y-12">

    <div>
      <h3 className="font-semibold text-2xl mb-3">
        Gain de temps
      </h3>
      <p className="text-gray-600 text-lg leading-relaxed">
        Nous prenons en charge l’ensemble du processus de recrutement,
        de la recherche des candidats jusqu’à leur sélection finale.
        Vous vous concentrez sur votre activité pendant que nous trouvons
        les profils adaptés à vos besoins.
      </p>
    </div>

    <div>
      <h3 className="font-semibold text-2xl mb-3">
        Expertise RH
      </h3>
      <p className="text-gray-600 text-lg leading-relaxed">
        Notre équipe dispose d’une solide expérience dans l’identification
        et l’évaluation des talents dans différents secteurs.
        Nous appliquons des méthodes modernes pour garantir des recrutements efficaces.
      </p>
    </div>

    <div>
      <h3 className="font-semibold text-2xl mb-3">
        Qualité des profils
      </h3>
      <p className="text-gray-600 text-lg leading-relaxed">
        Nous vous proposons uniquement des candidats qualifiés,
        soigneusement sélectionnés selon vos critères techniques
        et humains, afin d’assurer une parfaite adéquation avec votre entreprise.
      </p>
    </div>

  </div>
</div>
    {/* FORM RIGHT */}
    <div>
      <form className="bg-gradient-to-br from-[#020617] via-[#071a33] to-[#0a1a2f] p-10 rounded-3xl shadow-2xl space-y-6 border border-white/10 text-white">

  <h3 className="text-2xl font-bold mb-4">
    Informations personnelles
  </h3>

  {/* Société */}
  <input
    type="text"
    placeholder="Société"
    className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl placeholder-gray-300 text-white outline-none focus:ring-2 focus:ring-red-500"
  />

  {/* Nom */}
  <input
    type="text"
    placeholder="Nom complet *"
    className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl placeholder-gray-300 text-white outline-none focus:ring-2 focus:ring-red-500"
  />

  {/* Email */}
  <input
    type="email"
    placeholder="Email professionnel *"
    className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl placeholder-gray-300 text-white outline-none focus:ring-2 focus:ring-red-500"
  />

  {/* Téléphone */}
  <input
    type="text"
    placeholder="Téléphone"
    className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl placeholder-gray-300 text-white outline-none focus:ring-2 focus:ring-red-500"
  />

  {/* Message */}
  <textarea
    placeholder="Votre message *"
    rows={5}
    className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl placeholder-gray-300 text-white outline-none focus:ring-2 focus:ring-red-500"
  />

  {/* Button */}
  <button className="w-full bg-red-600 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-red-700 transition">
    Envoyer la demande
  </button>

</form>
    </div>

  </div>
</section>
<section className="py-10 mx-6 md:mx-16 mb-10 rounded-xl bg-gray-100">

  <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-10">

    {/* TEXTE */}
    <div className="max-w-xl">
      <p className="text-gray-500 text-lg mb-4">
        — Vous souhaitez parler à un professionnel
      </p>

      <h2 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
        Nos experts sont à votre écoute.
      </h2>
    </div>

    {/* BUTTON */}
    <a href="/contact">
      <button className="bg-gradient-to-br from-[#020617] via-[#071a33] to-[#0a1a2f] text-white px-8 py-4 font-semibold rounded-lg hover:bg-red-700 transition">
        NOUS CONTACTER
      </button>
    </a>

  </div>

</section>
      <Footer />
    </main>
  );
}