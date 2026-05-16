"use client";

import { Globe, Calculator, Users } from "lucide-react";
import { useState } from "react";
import { useLang } from "@/context/LangContext";

const temoignages = [
  {
    etoiles: 5,
    texte: "Staffing Tunisia a transformé notre processus de recrutement. En moins de deux semaines, nous avons trouvé le profil idéal pour notre équipe tech. Un service rapide, professionnel et vraiment à l'écoute.",
    nom: "Kareem Ben Ali",
    poste: "Senior Designer",
    photo: "/temoignage1.jpg",
  },
  {
    etoiles: 5,
    texte: "L'équipe de support client a été extrêmement utile pour répondre à toutes nos questions. Ils sont toujours rapides à répondre et à fournir des solutions. Bonne continuation !",
    nom: "Sarah Mansouri",
    poste: "DRH – Tech Solutions",
    photo: "/temoignage2.jpg",
  },
  {
    etoiles: 4,
    texte: "Grâce à Staffing Tunisia, nous avons externalisé notre paie en toute sérénité. La conformité est assurée et notre équipe RH peut enfin se concentrer sur l'essentiel.",
    nom: "Mohamed Trabelsi",
    poste: "CEO – Innova Group",
    photo: "/temoignage3.jpg",
  },
];

export default function Solutions() {
  const { t } = useLang();
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i === 0 ? temoignages.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === temoignages.length - 1 ? 0 : i + 1));

  const temoignage = temoignages[index];

  return (
    <>
      {/* ── SOLUTIONS ── */}
      <section id="solutions" className=" py-16 px-6 md:px-16">
        <div className="flex items-center gap-3 mb-12">
          <span className="w-8 h-[2px] bg-red-500"></span>
          <p className="text-red-500 uppercase tracking-[0.2em] text-lg font-semibold">
            {t("solutionsLabel")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-100  text-gray-900 p-8 hover:scale-105 hover:shadow-2xl transition duration-300">
            <div className="w-12 h-12  flex items-center justify-center mb-6">
              <Globe className="text-red-600" size={22} />
            </div>
            <h3 className="text-xl font-semibold mb-3">{t("sol1Title")}</h3>
            <p className="text-gray-600 mb-6">
              {t("sol1Desc")}
            </p>
            <a href="/eor-services"
            className="text-sm font-semibold flex items-center gap-2 cursor-pointer text-red-600 hover:underline">
              {t("sol1Cta")}
            </a>
          </div>

          <div className="bg-gray-100  text-gray-900 p-8 hover:scale-105 hover:shadow-2xl transition duration-300">
            <div className="w-12 h-12 flex items-center justify-center mb-6">
              <Calculator className="text-red-600" size={22} />
            </div>
            <h3 className="text-xl font-semibold mb-3">{t("sol2Title")}</h3>
            <p className="text-gray-600 mb-6">
              {t("sol2Desc")}
            </p>
            <a href="/Externalisation-Paie"
            className="text-sm font-semibold flex items-center gap-2 cursor-pointer text-red-600 hover:underline">
               {t("sol2Cta")}
            </a>
          </div>

          <div className="bg-gray-100 text-gray-900 p-8 hover:scale-105 hover:shadow-2xl transition duration-300">
            <div className="w-12 h-12 flex items-center justify-center mb-6">
              <Users className="text-red-600" size={22} />
            </div>
            <h3 className="text-xl font-semibold mb-3">{t("sol3Title")}</h3>
            <p className="text-gray-600 mb-6">
              {t("sol3Desc")}
            </p>
            <a href="/Recretement4pack" className="text-sm font-semibold flex items-center gap-2 cursor-pointer text-red-600 hover:underline">
              {t("sol3Cta")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}