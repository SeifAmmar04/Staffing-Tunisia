"use client";

import Image from "next/image";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar";
import { useLang } from "@/context/LangContext";
import {
  Settings, Shield, TrendingDown, Users,
  Clock, CheckCircle, UserCheck, Database,
} from "lucide-react";

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
  const { t } = useLang();

  const expertises = [
    { icon: Settings,     titre: t("paieExp1Title"), desc: t("paieExp1Desc") },
    { icon: Shield,       titre: t("paieExp2Title"), desc: t("paieExp2Desc") },
    { icon: TrendingDown, titre: t("paieExp3Title"), desc: t("paieExp3Desc") },
    { icon: Users,        titre: t("paieExp4Title"), desc: t("paieExp4Desc") },
  ];

  const processus = [
    { num: "1", titre: t("paieProc1Title"), desc: t("paieProc1Desc") },
    { num: "2", titre: t("paieProc2Title"), desc: t("paieProc2Desc") },
    { num: "3", titre: t("paieProc3Title"), desc: t("paieProc3Desc") },
    { num: "4", titre: t("paieProc4Title"), desc: t("paieProc4Desc") },
  ];

  const valeurs = [
    { icon: CheckCircle, titre: t("paieVal1Title"), desc: t("paieVal1Desc") },
    { icon: Clock,       titre: t("paieVal2Title"), desc: t("paieVal2Desc") },
    { icon: UserCheck,   titre: t("paieVal3Title"), desc: t("paieVal3Desc") },
    { icon: Database,    titre: t("paieVal4Title"), desc: t("paieVal4Desc") },
  ];

  return (
    <main className="bg-white text-gray-900">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative w-full min-h-screen flex items-center">
        <Image src="/calc.png" alt="Externalisation Paie" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-[#020617]/80" />

        <div className="relative w-full px-10 md:px-24 text-white z-10">
          <div className="mb-8 inline-flex items-center overflow-hidden">
            <span className="bg-red-600 text-white text-[11px] font-bold uppercase tracking-widest px-4 py-1.5">●</span>
            <span className="bg-white text-gray-900 text-[11px] font-bold uppercase tracking-widest px-4 py-1.5">
              {t("paieHeroBadge")}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 max-w-2xl">
            {t("paieHeroTitle")}
          </h1>

          <p className="text-gray-300 max-w-lg mb-10 text-base leading-relaxed">
            {t("paieHeroDesc")}
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="#processus" className="border border-white/40 px-7 py-3.5 text-gray-200 hover:bg-white hover:text-black transition text-sm font-medium flex items-center gap-2">
              {t("paieHeroCta")}
            </a>
          </div>
        </div>
      </section>

      {/* ── NOTRE EXPERTISE ── */}
      <section id="expertise" className="py-40 px-20 bg-white">
        <div className="mx-auto">
          <SectionHeader
            label={t("paieExpertLabel")}
            title={t("paieExpertTitle")}
            sub={t("paieExpertSub")}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertises.map(({ icon: Icon, titre, desc }) => (
              <div
                key={titre}
                className="bg-gray-100 border border-gray-200 p-10 cursor-pointer group
                           transition-all duration-300
                           hover:scale-105 hover:shadow-2xl hover:shadow-black/10
                           active:scale-95"
              >
                <div className="w-12 h-12 bg-gray-200 flex items-center justify-center mb-7 group-hover:bg-red-100 transition-colors">
                  <Icon className="text-red-600" size={22} />
                </div>
                <h3 className="font-semibold text-gray-900 text-base mb-3">{titre}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESSUS ── */}
      <section id="processus" className="py-32 px-10">
        <div className="mx-auto">
          <SectionHeader
            label={t("paieProcessLabel")}
            title={t("paieProcessTitle")}
            sub={t("paieProcessSub")}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processus.map(({ num, titre, desc }, i) => (
              <div
                key={num}
                className="relative bg-gray-100 border border-gray-200 p-10 cursor-pointer
                           transition-all duration-300
                           hover:scale-105 hover:shadow-2xl hover:shadow-black/10 hover:border-red-300
                           active:scale-95"
              >
                {i < processus.length - 1 && (
                  <div className="hidden lg:flex absolute top-9 -right-4 z-10 items-center gap-1">
                    <div className="w-5 h-[2px] bg-red-600" />
                    <div className="w-2 h-2 bg-red-600" />
                  </div>
                )}
                <div className="w-10 h-10 bg-red-600 flex items-center justify-center text-white font-bold text-sm mb-7 shadow-lg shadow-red-900/20">
                  {num}
                </div>
                <h3 className="font-semibold text-gray-900 text-base mb-3">{titre}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALEUR AJOUTÉE ── */}
      <section className="py-32 px-10 md:px-24 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-start">

          <div className="sticky top-28">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-red-500" />
              <p className="text-red-500 uppercase tracking-[0.2em] text-xs font-bold">
                {t("paieValeurLabel")}
              </p>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug mb-5">
              {t("paieValeurTitle")}
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
              {t("paieValeurDesc")}
            </p>
          </div>

          <div className="space-y-5">
            {valeurs.map(({ icon: Icon, titre, desc }) => (
              <div
                key={titre}
                className="flex gap-5 items-start border border-gray-100 p-6 cursor-pointer
                           transition-all duration-300
                           hover:scale-[1.02] hover:shadow-xl hover:shadow-black/10 hover:border-gray-300
                           active:scale-[0.98] group"
              >
                <div className="w-11 h-11 border-2 border-gray-900 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-900 transition-colors">
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