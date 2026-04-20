"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [lang, setLang] = useState("fr");
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
            Accueil
          </Link>

          <Link
            href="/about"
            className={`uppercase transition ${
              pathname === "/about" ? "text-red-600 font-semibold" : "hover:text-red-600"
            }`}
          >
            À propos
          </Link>

          {/* SOLUTIONS RH dropdown */}
          <div className="relative group inline-block">
            <button className="flex items-center gap-1 uppercase text-gray-900 font-medium group-hover:text-red-500 transition-colors cursor-pointer outline-none">
              Solutions RH
              <svg className="w-2 h-2 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className="absolute top-full left-0 mt-3 w-69 bg-white rounded-2xl shadow-2xl p-8 border border-gray-100
                opacity-0 invisible scale-95
                group-hover:opacity-100 group-hover:visible group-hover:scale-100
                transition-all duration-200 ease-out z-50">

              <div className="mb-6">
                <p className="text-[10px] tracking-widest text-gray-400 font-bold mb-1">GLOBAL</p>
                <a href="/eor-services" className="block text-lg font-semibold text-slate-800 hover:text-red-600 transition-colors">
                  Services EOR
                </a>
              </div>

              <div className="mb-6">
                <p className="text-[10px] tracking-widest text-gray-400 font-bold mb-1">FINANCE</p>
                <a href="/Externalisation-Paie" className="block text-lg font-semibold text-slate-800 hover:text-red-600 transition-colors">
                  Externalisation Paie
                </a>
              </div>

              <div className="mb-6">
                <p className="text-[10px] tracking-widest text-gray-400 font-bold mb-1">TALENTS</p>
                <a href="/recrutement" className="block text-lg font-semibold text-slate-800 hover:text-red-600 transition-colors">
                  Recrutement (4 packs)
                </a>
              </div>

              <div>
                <p className="text-[10px] tracking-widest text-gray-400 font-bold mb-1">STRATEGY</p>
                <a href="/conseil-rh" className="block text-lg font-semibold text-slate-800 hover:text-red-600 transition-colors">
                  Conseil RH
                </a>
              </div>
            </div>
          </div>

          {/* RECRUTEMENT dropdown */}
          <div className="relative group inline-block">
            <button className="flex items-center gap-1 uppercase text-gray-700 font-medium group-hover:text-red-500 transition-colors cursor-pointer outline-none">
              Recrutement
                <svg className="w-2 h-2 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className="absolute top-full left-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl p-5 border border-gray-100
                opacity-0 invisible scale-95
                group-hover:opacity-100 group-hover:visible group-hover:scale-100
                transition-all duration-200 ease-out z-50">

              <div className="mb-4">
                <a href="/Espace-entreprise" className="block text-base font-semibold text-slate-800 hover:text-red-600 transition-colors">
                  Espace Entreprise
                </a>
              </div>
              <div>
                <a href="/Espace-candidat" className="block text-base font-semibold text-slate-800 hover:text-red-600 transition-colors">
                  Espace Candidat
                </a>
              </div>
            </div>
          </div>

          <Link href="/offres-emploi" className="uppercase hover:text-red-600 transition">
            Offres Emploi
          </Link>

          <Link href="/Blog" className="uppercase hover:text-red-600 transition">
            Blog
          </Link>

          <Link href="/contact" className="uppercase hover:text-red-600 transition">
            Contact
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4 mr-8">

          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="border rounded-md px-1.5 py-1 text-sm"
          >
            <option value="fr">FR</option>
            <option value="en">EN</option>
            <option value="ar">AR</option>
          </select>

          <a
            href="/auth/login"
            className="flex items-center gap-2 border border-red-600 px-3 py-2 rounded-full text-red-600 font-bold text-sm uppercase tracking-widest hover:bg-red-50 transition-colors cursor-pointer"
          >
            <span className="text-red-600 font-bold text-base">→</span>
            Login
          </a>

        </div>
      </div>
    </header>
  );
}