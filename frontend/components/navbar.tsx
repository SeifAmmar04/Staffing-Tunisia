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
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Logo (plus grand) */}
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Staffing Tunisia"
            width={230} // 👈 agrandi
            height={70}
            className="object-contain"
          />
        </div>

        {/* Menu (reste statique) */}
        <nav className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <Link
                  href="/"
                 className={`transition ${
                pathname === "/" ? "text-red-600 font-semibold" : "hover:text-red-600"}`}>
                  Accueil
           </Link>
          <Link
                 href="/about"
                 className={`transition ${
                 pathname === "/about" ? "text-red-600 font-semibold" : "hover:text-red-600"}`}>
                À propos
          </Link>
        <div className="relative group inline-block">
  
  {/* ITEM PARENT : Le déclencheur */}
           <button className="flex items-center gap-1 text-gray-700 font-medium group-hover:text-red-500 transition-colors cursor-pointer outline-none">
    Solutions RH 
    <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
           </button>

  {/* DROPDOWN : Le menu flottant */}
      <div className="absolute top-full left-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl p-8 border border-gray-100
                  opacity-0 invisible scale-95
                  group-hover:opacity-100 group-hover:visible group-hover:scale-100
                  transition-all duration-200 ease-out z-50">

    {/* Section GLOBAL */}
         <div className="mb-6">
      <p className="text-[10px] tracking-widest text-gray-400 font-bold mb-1">GLOBAL</p>
      <a href="/eor-services" className="block text-lg font-semibold text-slate-800 hover:text-red-600 transition-colors">
        Services EOR
      </a>
      </div>

    {/* Section FINANCE */}
    <div className="mb-6">
      <p className="text-[10px] tracking-widest text-gray-400 font-bold mb-1">FINANCE</p>
      <a href="/Externalisation-Paie" className="block text-lg font-semibold text-slate-800 hover:text-red-600 transition-colors">
        Externalisation Paie
      </a>
    </div>

    {/* Section TALENTS */}
    <div className="mb-6">
      <p className="text-[10px] tracking-widest text-gray-400 font-bold mb-1">TALENTS</p>
      <a href="/recrutement" className="block text-lg font-semibold text-slate-800 hover:text-red-600 transition-colors">
        Recrutement (4 packs)
      </a>
    </div>

    {/* Section STRATEGY */}
    <div className="">
      <p className="text-[10px] tracking-widest text-gray-400 font-bold mb-1">STRATEGY</p>
      <a href="/conseil-rh" className="block text-lg font-semibold text-slate-800 hover:text-red-600 transition-colors">
        Conseil RH
      </a>
    </div>
  </div>
</div>

           <div className="relative group inline-block">
             <button className="flex items-center gap-1 text-gray-700 font-medium group-hover:text-red-500 transition-colors cursor-pointer outline-none">
                 Recrutement
                 <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                 </svg>
              </button>

  {/* DROPDOWN : Le menu flottant */}
<div className="absolute top-full left-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl p-5 border border-gray-100
  opacity-0 invisible scale-95
  group-hover:opacity-100 group-hover:visible group-hover:scale-100
  transition-all duration-200 ease-out z-50">

  {/* Espace Entreprise */}
  <div className="mb-4">
    <a href="/Espace-entreprise" className="block text-40 font-semibold text-slate-800 hover:text-red-600 transition-colors">
      Espace Entreprise
    </a>
  </div>

  {/* Espace Candidat */}
  <div>
    <a href="/Espace-candidat" className="block text-40 font-semibold text-slate-800 hover:text-red-600 transition-colors">
      Espace Candidat
    </a>
  </div>

</div>
                     </div>
          
          <Link href="/offres-emploi" className="hover:text-red-600 transition">
            
              Offres Emploi
          </Link>
          <Link href="/Blog" className="hover:text-red-600 transition">
            Blog
          </Link>
          <Link href="/contact" className="hover:text-red-600 transition">
            Contact
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          
          {/* Language فقط يتبدل */}
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm"
          >
            <option value="fr">FR</option>
            <option value="en">EN</option>
            <option value="ar">AR</option>
          </select>

          
          

          {/* Login */}
 <a  href="/auth/login"
  
  className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-full text-white font-semibold cursor-pointer"
>
  <span className="text-lg">🙍</span>
  Connexion
</a>

 

        </div>
      </div>
    </header>
  );
}