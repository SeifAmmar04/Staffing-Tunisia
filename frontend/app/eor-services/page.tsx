import Image from "next/image";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar";

import { BookOpen, CheckCircle, Scale } from "lucide-react";
export default function HeroEOR() {
    
  return (
    <main className="bg-white text-gray-900"><Navbar/>
    <section className="relative w-full bg-gradient-to-br from-[#020617] via-[#071a33] to-[#0a1a2f]  text-white py-50 px-6 md:px-16 overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-red-600/20 blur-3xl rounded-full"></div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <div>
          
          {/* Badge */}
          <span className="inline-block bg-white/5 border border-white/10 text-sm px-4 py-1 rounded-full mb-6">
            🌍 PORTAGE INTERNATIONAL
          </span>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Employer of Record <br /> (EOR)
          </h1>

          {/* Red Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-red-600 mt-4 relative inline-block">
            Votre entité légale en Tunisie.
            <span className="block w-full h-[3px] bg-red-600 mt-2"></span>
          </h2>

          {/* Description */}
          <p className="text-gray-400 mt-6 max-w-lg">
            Déployez vos équipes en 48h sans créer de filiale. Nous assumons
            la responsabilité juridique, administrative et RH de vos collaborateurs.
          </p>
<div className="pt-8"></div>
          {/* Button */}
          <a  href="#proc" className=" bg-white/5 border border-white/10 mt-4  px-6 py-3 rounded-full hover:bg-white/10 transition">
            Comment ça marche ↓
          </a>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative w-full h-[400px] md:h-[450px] rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src="/EOR.png" // 👉 mets ton image ici
            alt="EOR"
            fill
            className="object-cover"
          />
        </div>

      </div>
    </section>
<section className="py-20 bg-gray-50">
  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">

    {/* CARD 1 */}
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
      <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-xl mb-4">
        <BookOpen size={24} />
      </div>

      <h3 className="text-xl font-semibold mb-3">
        Qu'est-ce que l'EOR ?
      </h3>

      <p className="text-gray-600">
        L'Employer of Record (Portage Salarial International) est une solution permettant aux entreprises étrangères d'embaucher du personnel en Tunisie sans y établir de structure juridique locale.
      </p>
    </div>

    {/* CARD 2 */}
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
      <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-xl mb-4">
        <CheckCircle size={24} />
      </div>

      <h3 className="text-xl font-semibold mb-3">
        Avantages Clés
      </h3>

      <ul className="space-y-2 text-gray-600">
        <li>✔ Zéro capital social requis</li>
        <li>✔ Démarrage en moins de 48h</li>
        <li>✔ Aucune gestion comptable locale</li>
      </ul>
    </div>

    {/* CARD 3 */}
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
      <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-xl mb-4">
        <Scale size={24} />
      </div>

      <h3 className="text-xl font-semibold mb-3">
        Cadre Juridique
      </h3>

      <p className="text-gray-600">
        Staffing Tunisia agit en tant qu'employeur légal. Nous signons le contrat de travail (CDI/CDD) conforme au Code du Travail Tunisien et gérons les relations avec la CNSS et l'administration fiscale.
      </p>
    </div>

  </div>
</section>
<section
  id="proc"
  className=" py-20 bg-gradient-to-br from-[#020617] via-[#071a33] to-[#0a1a3f] text-center max-w-7xl mx-auto px-7 rounded-2xl"
>
  <p className="text-blue-400 font-semibold tracking-widest mb-2">
    SIMPLE & RAPIDE
  </p>

  <h2 className="text-4xl font-bold text-white mb-16">
    Processus d'Intégration
  </h2>

  <div className="max-w-6xl mx-auto relative">
    
    {/* Ligne */}
    <div className="absolute top-6 left-0 w-full h-[2px] bg-gray-700"></div>

    <div className="grid md:grid-cols-5 gap-8 relative">
      
      {[
        { step: "1", title: "Analyse", time: "48 HEURES", desc: "Définition des besoins, profils et packages salariaux." },
        { step: "2", title: "Contrat", time: "24 HEURES", desc: "Signature de la convention de portage (MSA)." },
        { step: "3", title: "Onboarding", time: "72 HEURES", desc: "Signature du contrat salarié et affiliation CNSS." },
        { step: "4", title: "Gestion", time: "MENSUEL", desc: "Paie, notes de frais, congés et conformité légale." },
        { step: "5", title: "Optimisation", time: "TRIMESTRIEL", desc: "Reporting RH détaillé et conseils d'optimisation fiscale." },
      ].map((item, i) => (
        <div key={i} className="text-center relative">
          
          {/* STEP */}
          <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center 
                          rounded-full bg-blue-600 text-white font-bold relative z-10 shadow-lg shadow-blue-500/30">
            {item.step}
          </div>

          {/* TEXT */}
          <h4 className="font-semibold text-white">
            {item.title}
          </h4>

          <p className="text-blue-400 text-sm font-medium">
            {item.time}
          </p>

          <p className="text-gray-400 text-sm mt-2">
            {item.desc}
          </p>

        </div>
      ))}

    </div>
  </div>
</section>
<section className="mt-20 py-20 bg-gradient-to-br from-[#020617] via-[#071a33] to-[#0a1a3f]  max-w-7xl mx-auto px-7 rounded-2xl">
  <div className="max-w-7xl mx-auto px-6">
    
    <h2 className="text-3xl font-bold mb-10 text-white">
      Secteurs d'Intervention
    </h2>

    <div className="grid md:grid-cols-4 gap-6">
      
      {[
        {
          title: "Technologie",
          desc: "Développeurs full-stack, DevOps et Data Scientists pour startups européennes.",
        },
        {
          title: "Énergie",
          desc: "Consultants et ingénieurs pour projets Pétrole & Gaz ou Renouvelables.",
        },
        {
          title: "Construction",
          desc: "Chefs de chantier et architectes pour supervision de projets locaux.",
        },
        {
          title: "Logistique",
          desc: "Staff opérationnel pour gestion d'entrepôts et supply chain.",
        },
      ].map((item, i) => (
        <div
          key={i}
          className="border border-gray-700 rounded-xl p-6 hover:border-red-600 transition"
        >
          <h3 className="text-lg text-green-200 mb-2">{item.title}</h3>
          <p className="text-gray-400 text-sm">{item.desc}</p>
        </div>
      ))}

    </div>

  </div>
</section>
 
<section className="py-20 bg-gray-50">
  <div className="max-w-4xl mx-auto px-6">
    
    <h2 className="text-3xl font-bold text-center mb-10">
      Questions Fréquentes
    </h2>

    <div className="space-y-4">

      <details className="bg-gray-100 rounded-xl p-5">
        <summary className="cursor-pointer font-semibold text-gray-800">
          Est-ce légal en Tunisie ?
        </summary>
        <p className="text-gray-600 mt-3">
         Oui, le modèle EOR est parfaitement légal. Staffing Tunisia agit en tant qu'employeur légal (via les statuts appropriés) et assure le respect total du Code du Travail tunisien.
        </p>
      </details>

      <details className="bg-gray-100 rounded-xl p-5">
        <summary className="cursor-pointer font-semibold text-gray-800">
          Qui dirige le salarié au quotidien ?
        </summary>
        <p className="text-gray-600 mt-3">
          Vous conservez la gestion opérationnelle totale (tâches, horaires, objectifs). Nous ne gérons que l'aspect administratif, légal et la paie.
        </p>
      </details>

      <details className="bg-gray-100 rounded-xl p-5">
        <summary className="cursor-pointer font-semibold text-gray-800">
          Quels sont les délais de paiement ?
        </summary>
        <p className="text-gray-600 mt-3">
         Nous facturons mensuellement le salaire chargé + nos frais de gestion. Le paiement doit être reçu avant le virement des salaires aux employés.
        </p>
      </details>

    </div>

  </div>
</section>
    
    
    
    
    
    
    
        <section className="pt-20">
        <Footer /></section>
    </main>
  );
}