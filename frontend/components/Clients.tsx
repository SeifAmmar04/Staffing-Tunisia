"use client";

import Image from "next/image";
import { useState } from "react";
import { useLang } from "@/context/LangContext";

const logos = [
  "/logo1.png", "/logo2.png", "/logo3.png", "/logo4.png",
  "/logo6.png", "/logo7.png", "/logo8.png", "/logo9.png",
  "/logo10.png", "/logo11.png", "/logo12.png", "/logo13.png",
  "/logo14.png", "/logo15.png",
];

const temoignages = [
  {
    etoiles: 5,
    texte:
      "Staffing Tunisia a transformé notre processus de recrutement. En moins de deux semaines, nous avons trouvé le profil idéal pour notre équipe tech. Un service rapide, professionnel et vraiment à l'écoute.",
    nom: "Kareem Ben Ali",
    poste: "Senior Designer",
    photo: "/temoignage1.jpg",
  },
  {
    etoiles: 5,
    texte:
      "L'équipe de support client a été extrêmement utile pour répondre à toutes nos questions ou problèmes que nous avons eus. Ils sont toujours rapides à répondre et à fournir des solutions. Bonne continuation !",
    nom: "Sarah Mansouri",
    poste: "DRH – Tech Solutions",
    photo: "/temoignage2.jpg",
  },
  {
    etoiles: 4,
    texte:
      "Grâce à Staffing Tunisia, nous avons externalisé notre paie en toute sérénité. La conformité est assurée et notre équipe RH peut enfin se concentrer sur l'essentiel.",
    nom: "Mohamed Trabelsi",
    poste: "CEO – Innova Group",
    photo: "/temoignage3.jpg",
  },
];

export default function Clients() {
  const { t } = useLang();
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i === 0 ? temoignages.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === temoignages.length - 1 ? 0 : i + 1));

  const temoignage = temoignages[index];

  return (
    <>
      {/* ── LOGOS CLIENTS ── */}
      <section className="bg-white py-20 px-6 md:px-16 overflow-hidden">

        <div className="max-w-6xl mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-[2px] bg-red-500"></span>
            <p className="text-red-500 uppercase tracking-[0.2em] text-lg font-semibold">
              {t("clientsConfiance")}
            </p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("clientsTitle")}
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl">
            {t("clientsDesc")}
          </p>
        </div>

        {/* LOGOS DÉFILANTS */}
        <div className="relative overflow-hidden">
          <div className="flex items-center gap-16 w-max animate-scroll">
            {[...logos, ...logos].map((logo, i) => (
              <div
                key={i}
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

      {/* ── ILS PARLENT DE NOUS ── */}
      <section className="bg-white py-16 px-6 md:px-16">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-12">
          <span className="w-8 h-[2px] bg-red-500"></span>
          <p className="text-red-500 uppercase tracking-[0.2em] text-lg font-semibold">
            {t("clientsTemoignagesLabel")}
          </p>
        </div>

        {/* CAROUSEL */}
        <div className="relative max-w-5xl mx-auto">

          {/* Bordure dégradée bleu → rose */}
          <div className="p-[2px]  bg-gradient-to-br from-[#020617] via-[#020617] to-[#0a1a2f]">
            <div className="bg-white  px-10 py-10">

              {/* ÉTOILES */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-6 h-6 ${i < temoignage.etoiles ? "text-yellow-400" : "text-gray-200"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* TEXTE */}
              <p className="text-gray-600 text-base leading-relaxed mb-10 max-w-3xl">
                {temoignage.texte}
              </p>

              {/* BAS : PHOTO + NOM + BOUTONS */}
              <div className="flex items-center justify-between flex-wrap gap-6">

                <div className="flex items-center gap-6">
                  {/* Photo avec bordure dégradée */}
                  <div className="p-[2px] rounded-full bg-gradient-to-br from-blue-300 to-pink-300">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-700 font-bold text-sm">
                        {temoignage.nom?.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Nom + poste */}
                  <div className="border border-gray-200  px-6 py-3">
                    <p className="font-bold text-gray-900 text-base">{temoignage.nom}</p>
                    <p className="text-gray-400 text-sm">{temoignage.poste}</p>
                  </div>
                </div>

                {/* BOUTONS PREV / NEXT */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={prev}
                    className="w-11 h-11 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 text-xl hover:border-red-500 hover:text-red-500 transition"
                  >
                    ‹
                  </button>
                  <button
                    onClick={next}
                    className="w-11 h-11 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 text-xl hover:border-red-500 hover:text-red-500 transition"
                  >
                    ›
                  </button>
                </div>

              </div>

              {/* POINTS INDICATEURS */}
              <div className="flex gap-2 mt-6">
                {temoignages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === index ? "w-6 bg-red-500" : "w-2 bg-gray-200"
                    }`}
                  />
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}