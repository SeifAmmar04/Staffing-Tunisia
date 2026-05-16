"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLang } from "@/context/LangContext";
import type { Lang } from "@/lib/i18n";

export default function Navbar() {
  const { lang, setLang, t } = useLang();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"login" | "register">("login");

  return (
    <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="w-full flex items-center justify-between px-2 py-4">

        {/* Logo cliquable → Accueil */}
        <Link href="/" className="flex items-center ml-20">
          <Image
            src="/logo.png"
            alt="Staffing Tunisia"
            width={230}
            height={70}
            className="object-contain"
          />
        </Link>

        {/* Menu */}
        <nav className="hidden md:flex items-center gap-8 text-black font-medium text-[13px] tracking-wide">

          <Link
            href="/"
            className={`uppercase transition ${
              pathname === "/" ? "text-red-600 font-semibold" : "hover:text-red-600"
            }`}
          >
            {t("home")}
          </Link>

          <Link
            href="/about"
            className={`uppercase transition ${
              pathname === "/about" ? "text-red-600 font-semibold" : "hover:text-red-600"
            }`}
          >
            {t("about")}
          </Link>

          {/* SOLUTIONS RH dropdown */}
          <div className="relative group inline-block">
            <button className="flex items-center gap-1 uppercase text-gray-900 font-medium group-hover:text-red-500 transition-colors cursor-pointer outline-none">
              {t("solutionsRH")}
              <svg className="w-2 h-2 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className="absolute top-full left-0 mt-3 w-69 bg-white  shadow-2xl p-8 border border-gray-100
                opacity-0 invisible scale-95
                group-hover:opacity-100 group-hover:visible group-hover:scale-100
                transition-all duration-200 ease-out z-50">

              <div className="mb-6">
                <p className="text-[10px] tracking-widest text-gray-400 font-bold mb-1">{t("global")}</p>
                <a href="/eor-services" className="block text-lg font-semibold text-slate-800 hover:text-red-600 transition-colors">
                  {t("eorServices")}
                </a>
              </div>

              <div className="mb-6">
                <p className="text-[10px] tracking-widest text-gray-400 font-bold mb-1">{t("finance")}</p>
                <a href="/Externalisation-Paie" className="block text-lg font-semibold text-slate-800 hover:text-red-600 transition-colors">
                  {t("externalisationPaie")}
                </a>
              </div>

              <div className="">
                <p className="text-[10px] tracking-widest text-gray-400 font-bold mb-1">{t("talents")}</p>
                <a href="/Recretement4pack" className="block text-lg font-semibold text-slate-800 hover:text-red-600 transition-colors">
                  {t("recrutementPacks")}
                </a>
              </div>

              
            </div>
          </div>

          {/* RECRUTEMENT dropdown */}
          <div className="relative group inline-block">
            <button className="flex items-center gap-1 uppercase text-gray-700 font-medium group-hover:text-red-500 transition-colors cursor-pointer outline-none">
              {t("recrutement")}
                <svg className="w-2 h-2 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className="absolute top-full left-0 mt-3 w-56 bg-white  shadow-2xl p-5 border border-gray-100
                opacity-0 invisible scale-95
                group-hover:opacity-100 group-hover:visible group-hover:scale-100
                transition-all duration-200 ease-out z-50">

              <div className="mb-4">
                <a href="/Espace-entreprise" className="block text-base font-semibold text-slate-800 hover:text-red-600 transition-colors">
                  {t("espaceEntreprise")}
                </a>
              </div>
              <div>
                <a href="/Espace-candidat" className="block text-base font-semibold text-slate-800 hover:text-red-600 transition-colors">
                  {t("espaceCandidat")}
                </a>
              </div>
            </div>
          </div>

          <Link href="/offres-emploi" className="uppercase hover:text-red-600 transition">
            {t("offresEmploi")}
          </Link>


          <Link href="/contact" className="uppercase hover:text-red-600 transition">
            {t("contact")}
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4 mr-8">

          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            className="border  px-1.5 py-1 text-sm"
          >
            <option value="fr">FR</option>
            <option value="en">EN</option>
          </select>

          <a
            href="/auth/login"
            className="flex items-center gap-2 border border-red-600 px-3 py-1.5  text-red-600 font-bold text-sm uppercase tracking-widest hover:bg-red-50 transition-colors cursor-pointer"
          >
            <span className="text-red-600 font-bold text-base">&#8594;</span>
            {t("login")}
          </a>

        </div>
      </div>
    </header>
  );
}