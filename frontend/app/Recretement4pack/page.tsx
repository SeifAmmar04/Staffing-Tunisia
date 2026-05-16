"use client";

import Image from "next/image";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar";
import { useLang } from "@/context/LangContext";

export default function RecrutementExpert() {
  const { t } = useLang();

  const packs = [
    {
      badge: t("pack1Badge"),
      nom: t("pack1Nom"),
      desc: t("pack1Desc"),
      tarif: t("pack1Tarif"),
      tarifNote: t("pack1Note"),
      tag: undefined,
    },
    {
      badge: t("pack2Badge"),
      nom: t("pack2Nom"),
      desc: t("pack2Desc"),
      tarif: t("pack2Tarif"),
      tarifNote: t("pack2Note"),
      tag: t("pack2Tag"),
    },
    {
      badge: t("pack3Badge"),
      nom: t("pack3Nom"),
      desc: t("pack3Desc"),
      tarif: t("pack3Tarif"),
      tarifNote: t("pack3Note"),
      tag: undefined,
    },
    {
      badge: t("pack4Badge"),
      nom: t("pack4Nom"),
      desc: t("pack4Desc"),
      tarif: t("pack4Tarif"),
      tarifNote: t("pack4Note"),
      tag: undefined,
    },
  ];

  const comparatif = [
    {
      critere: t("comparCible"),
      sourcing: t("cibleSourcing"),
      selection: t("cibleSelection"),
      executive: t("cibleExecutive"),
      headhunting: t("cibleHeadhunting"),
      zebra: false,
    },
    {
      critere: t("comparDelai"),
      sourcing: t("delaiSourcing"),
      selection: t("delaiSelection"),
      executive: t("delaiExecutive"),
      headhunting: t("delaiHeadhunting"),
      zebra: true,
    },
    {
      critere: t("comparTarif"),
      sourcing: t("tarifSourcing"),
      selection: t("tarifSelection"),
      executive: t("tarifExecutive"),
      headhunting: t("tarifHeadhunting"),
      zebra: false,
    },
  ];

  return (
    <main className="bg-white text-gray-900">
      <Navbar />

      {/* ── HERO ── */}
     <section className="relative w-full  bg-gray-50 text-gray-900 py-50 px-6 md:px-16 overflow-hidden">
           <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-gray-400/20 blur-3xl"></div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* Gauche */}
          <div>
            <div className="inline-flex items-center gap-2 border border-gray-200 px-3 py-1.5 mb-8">
              <span className="w-2 h-2 bg-red-600 inline-block" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-700">{t("recrutHeroBadge")}</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-[#0d0f1a]">
              {t("recrutHeroTitle1")}<br />
              <span className="text-red-600">{t("recrutHeroTitle2")}</span>
            </h1>

            <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-md">
              {t("recrutHeroDesc")}
            </p>

            <a
              href="#packs"
              className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 font-semibold text-sm transition"
            >
              {t("recrutHeroCta")}
            </a>
          </div>

          {/* Droite — image */}
          <div className="relative w-full h-[400px]">
            <Image
              src="/about2.png"
              alt="Recrutement Expert"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

{/* ── NOS 4 PACKS ── */}
<section id="packs" className="py-32 px-10 md:px-24 bg-[#f5f4f0]">
  <div className="max-w-7xl mx-auto">

    {/* Header gauche */}
    <div className="mb-20">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-8 h-[2px] bg-red-500" />
        <p className="text-red-500 uppercase tracking-[0.2em] text-xs font-bold">{t("recrutPacksLabel")}</p>
      </div>
      <h2 className="text-3xl md:text-4xl font-extrabold text-[#0d0f1a] mb-3 leading-snug">
        {t("recrutPacksTitle")}
      </h2>
      <p className="text-gray-500 text-base max-w-xl">
        {t("recrutPacksSub")}
      </p>
    </div>

    {/* Cards */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
      {packs.map(({ badge, nom, desc, tarif, tarifNote, tag }) => (
        <div key={nom} className="flex flex-col h-full">

          {/* Tag au-dessus de la card — hauteur fixe pour toutes */}
          <div className="h-8 flex items-end mb-2">
            {tag ? (
              <span className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 whitespace-nowrap">
                {tag}
              </span>
            ) : null}
          </div>

          {/* Card — prend toute la hauteur restante */}
          <div className="bg-white border-2 border-red-600 flex flex-col flex-1 transition-all duration-300 hover:shadow-2xl hover:shadow-red-100">
            <div className="p-8 flex flex-col flex-1">

              {/* Badge type */}
              <div className="inline-block bg-red-50 border border-red-200 px-3 py-1 mb-6 self-start">
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-600">{badge}</span>
              </div>

              <h3 className="text-xl font-extrabold mb-3 text-[#0d0f1a]">{nom}</h3>

              {/* flex-1 pousse la tarification vers le bas */}
              <p className="text-gray-500 text-sm leading-relaxed flex-1">{desc}</p>

              {/* Tarification toujours en bas */}
              <div className="mt-8 flex items-end justify-between gap-2 pt-4 border-t border-red-100">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-red-400 font-bold mb-1">{t("comparTarif")}</p>
                  <p className="text-base font-extrabold text-[#0d0f1a]">{tarif}</p>
                </div>
                <span className="text-[10px] text-gray-400 italic text-right leading-tight max-w-[80px]">{tarifNote}</span>
              </div>

            </div>
          </div>

        </div>
      ))}
    </div>
  </div>
</section>

      {/* ── TABLEAU COMPARATIF ── */}
      <section className="py-32 px-15  bg-white">
        <div className="max-w-7xl mx-auto">

          {/* Header gauche */}
          <div className="">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-red-500" />
              <p className="text-red-500 uppercase tracking-[0.2em] text-xs font-bold">{t("comparLabel")}</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0d0f1a] leading-snug">
              {t("comparTitle")}
            </h2>
          </div>

          {/* Tableau */}
          <div className="overflow-x-auto pt-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 pr-8 font-semibold text-gray-700 w-[15%]">{t("comparCritere")}</th>
                  <th className="py-4 px-6 font-bold text-red-600 text-center w-[21%]">{t("sourcing")}</th>
                  <th className="py-4 px-6 font-semibold text-[#0d0f1a] text-center w-[21%]">{t("selection")}</th>
                  <th className="py-4 px-6 font-semibold text-[#0d0f1a] text-center w-[21%]">{t("executive")}</th>
                  <th className="py-4 px-6 font-semibold text-[#0d0f1a] text-center w-[22%]">{t("headhunting")}</th>
                </tr>
              </thead>
              <tbody>
                {comparatif.map(({ critere, sourcing, selection, executive, headhunting, zebra }) => (
                  <tr key={critere} className={`border-b border-gray-100 ${zebra ? "" : "bg-white"}`}>
                    <td className="py-5 pr-8 font-medium text-gray-700">{critere}</td>
                    <td className="py-5 px-6 text-gray-500 text-center">{sourcing}</td>
                    <td className="py-5 px-6 text-gray-500 text-center">{selection}</td>
                    <td className="py-5 px-6 text-gray-500 text-center">{executive}</td>
                    <td className="py-5 px-6 text-gray-500 text-center">{headhunting}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}