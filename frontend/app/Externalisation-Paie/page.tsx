"use client";

import Image from "next/image";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar";
import {
  Settings, Shield, TrendingDown, Users,
  Clock, CheckCircle, UserCheck, Database,
} from "lucide-react";

const expertises = [
  { icon: Settings,    titre: "Gestion technique complète", desc: "Collecte, calcul, édition des bulletins, virements et DSN. Nous prenons en main toute la chaîne." },
  { icon: Shield,      titre: "Conformité garantie",        desc: "Respect strict du code du travail, conventions collectives et mises à jour légales 2026." },
  { icon: TrendingDown,titre: "Optimisation charges",       desc: "Analyse des dispositifs légaux (CNSS, impôts) pour réduire vos coûts sans risque de redressement." },
  { icon: Users,       titre: "Accès expert dédié",         desc: "Un interlocuteur unique, spécialiste paie internationale, pour répondre à toutes vos questions." },
];

const processus = [
  { num: "1", titre: "Collecte des données",   desc: "Variables de paie, absences, congés, primes – via une interface sécurisée ou votre SIRH." },
  { num: "2", titre: "Calcul & contrôles",     desc: "Application des barèmes CNSS, IRPP, mutuelle ; double validation experte avant édition." },
  { num: "3", titre: "Déclarations sociales",  desc: "Déclarations CNSS, affidavit, impôt : nous produisons et télétransmettons en votre nom." },
  { num: "4", titre: "Reporting & analyse",    desc: "Accès à des tableaux de bord RH, coûts par service, évolution de la masse salariale." },
];

const valeurs = [
  { icon: CheckCircle, titre: "Réduction des erreurs", desc: "Taux d'erreur inférieur à 0,1% grâce à nos doubles contrôles et à notre veille légale permanente." },
  { icon: Clock,       titre: "Gain de temps",         desc: "Récupérez jusqu'à 3 jours par mois sur les tâches administratives, concentrez-vous sur le cœur de métier." },
  { icon: UserCheck,   titre: "Expertise technique",   desc: "Équipe dédiée de juristes et experts-comptables spécialisés en paie internationale et droit social tunisien." },
  { icon: Database,    titre: "Sécurité données",      desc: "Hébergement certifié, sauvegardes quotidiennes, accès chiffrés – conforme RGPD et normes locales." },
];

/* Header de section réutilisable — titre à gauche */
function SectionHeader({ label, title, sub }: { label: string; title: string; sub?: string }) {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-8 h-[2px] bg-red-500" />
        <p className="text-red-500 uppercase tracking-[0.2em] text-xs font-bold">{label}</p>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-snug">{title}</h2>
      {sub && <p className="text-gray-500 text-base max-w-xl">{sub}</p>}
    </div>
  );
}

export default function ExternalisationPaie() {
  return (
    <main className="bg-white text-gray-900">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative w-full min-h-screen flex items-center">
        <Image src="/calc.png" alt="Externalisation Paie" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-[#020617]/80" />

        <div className="relative w-full px-10 md:px-24 text-white z-10">
          {/* Badge bicolore */}
          <div className="mb-8 inline-flex items-center overflow-hidden rounded-full">
            <span className="bg-red-600 text-white text-[11px] font-bold uppercase tracking-widest px-4 py-1.5">●</span>
            <span className="bg-white text-gray-900 text-[11px] font-bold uppercase tracking-widest px-4 py-1.5">Externalisation Paie</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 max-w-2xl">
            Paie & Conformité<br />
           
          </h1>

          <p className="text-gray-300 max-w-lg mb-10 text-base leading-relaxed">
            Externalisez votre paie en Tunisie : gestion complète, conformité absolue et
            optimisation des charges sociales. Nos experts vous libèrent du temps et
            sécurisent vos obligations légales.
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="#expertise" className="bg-red-600 hover:bg-red-700 px-7 py-3.5 rounded-full font-semibold transition text-sm shadow-lg shadow-red-900/40 flex items-center gap-2">
              Voir nos tarifs →
            </a>
            <a href="#processus" className="border border-white/40 px-7 py-3.5 rounded-full text-gray-200 hover:bg-white hover:text-black transition text-sm font-medium flex items-center gap-2">
              Découvrir le processus ▶
            </a>
          </div>
        </div>
      </section>

      {/* ── NOTRE EXPERTISE ── */}
      <section id="expertise" className="py-40 px-20 md:px-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            label="Notre Expertise"
            title="Une gestion de paie sans faille"
            sub="Des processus maîtrisés, une conformité totale et une optimisation continue."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertises.map(({ icon: Icon, titre, desc }) => (
              <div
                key={titre}
                className="bg-gradient-to-br from-[#020617] via-[#020617] to-[#0a1a2f]
                           rounded-2xl p-8 cursor-pointer group
                           transition-all duration-300
                           hover:scale-105 hover:shadow-2xl hover:shadow-black/50
                           active:scale-95"
              >
                <div className="w-13 h-13 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-600/25 transition-colors">
                  <Icon className="text-red-400" size={22} />
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">{titre}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESSUS ── */}
      <section id="processus" className="py-32 px-10 md:px-24 ">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            label="Processus Maîtrisé"
            title="Comment ça marche ?"
            sub="Une méthodologie transparente, rythmée par le mois social tunisien."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processus.map(({ num, titre, desc }, i) => (
              <div
                key={num}
                className="relative bg-gradient-to-br from-[#020617] via-[#020617] to-[#0a1a2f]
                           border border-white/10 rounded-2xl p-8 cursor-pointer
                           transition-all duration-300
                           hover:scale-105 hover:shadow-2xl hover:shadow-black/50 hover:border-red-500/40
                           active:scale-95"
              >
                {i < processus.length - 1 && (
                  <div className="hidden lg:flex absolute top-9 -right-4 z-10 items-center gap-1">
                    <div className="w-5 h-[2px] bg-red-600" />
                    <div className="w-2 h-2 rounded-full bg-red-600" />
                  </div>
                )}
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm mb-6 shadow-lg shadow-red-900/40">
                  {num}
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">{titre}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALEUR AJOUTÉE ── */}
      <section className="py-32 px-10 md:px-24 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-start">

          {/* Gauche */}
          <div className="sticky top-28">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-red-500" />
              <p className="text-red-500 uppercase tracking-[0.2em] text-xs font-bold">Valeur Ajoutée</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug mb-5">
              Reprenez le contrôle<br />en toute sérénité
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
              Déléguez la complexité de la paie à nos experts et concentrez-vous sur ce qui compte vraiment : développer votre entreprise.
            </p>
          </div>

          {/* Droite — cartes cliquables tout en noir */}
          <div className="space-y-5">
            {valeurs.map(({ icon: Icon, titre, desc }) => (
              <div
                key={titre}
                className="flex gap-5 items-start border border-gray-100 rounded-2xl p-6 cursor-pointer
                           transition-all duration-300
                           hover:scale-[1.02] hover:shadow-xl hover:shadow-black/10 hover:border-gray-300
                           active:scale-[0.98] group"
              >
                <div className="w-11 h-11 rounded-full border-2 border-gray-900 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-900 transition-colors">
                  <Icon size={18} className="text-gray-900 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base mb-1">{titre}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}