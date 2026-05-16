"use client";

import Image from "next/image";
import Link from "next/link";
import { FaLinkedinIn, FaFacebookF, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative text-gray-300 pt-17 pb-10 px-6 md:px-16 overflow-hidden">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617] to-[#0a1a2f]" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* TOP */}
        <div className="grid md:grid-cols-4 gap-12">

          {/* LOGO + DESC */}
          <div>
            <Image
              src="/logo.png"
              alt="Staffing Tunisia"
              width={180}
              height={60}
              className="mb-6 mb-6 brightness-0 invert"
            />

            <p className="text-gray-400 leading-relaxed mb-6">
              Facilitateur d'expansion internationale. Nous connectons les
              entreprises mondiales aux talents tunisiens.
            </p>

            {/* SOCIAL */}
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/company/staffing-tunisia/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="social"
              >
                <FaLinkedinIn size={16} />
              </a>

              <a
                href="https://www.facebook.com/staffingtunisia"
                target="_blank"
                rel="noopener noreferrer"
                className="social"
              >
                <FaFacebookF size={16} />
              </a>

              <a
                href="https://www.instagram.com/staffing_tunisia"
                target="_blank"
                rel="noopener noreferrer"
                className="social"
              >
                <FaInstagram size={16} />
              </a>
            </div>
          </div>

          {/* EXPERTISE */}
          <div>
            <h3 className="footer-title">EXPERTISE</h3>
            <ul className="space-y-3">
              <li><Link href="/eor-services" className="footer-link">Services EOR</Link></li>
              <li><Link href="/Externalisation-Paie" className="footer-link">Externalisation Paie</Link></li>
              <li><Link href="/Recretement4pack" className="footer-link">Recrutement (4 packs)</Link></li>
              
            </ul>
          </div>

          {/* COMPAGNIE */}
          <div>
            <h3 className="footer-title">COMPAGNIE</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="footer-link">Accueil</Link></li>
              <li><Link href="/about" className="footer-link">À propos</Link></li>
              <li><Link href="/Espace-entreprise" className="footer-link">Espace Entreprise</Link></li>
              <li><Link href="/Espace-candidat" className="footer-link">Espace Candidat</Link></li>
              <li><Link href="/offres-emploi" className="footer-link">Offres Emploi</Link></li>
              <li><Link href="/contact" className="footer-link">Contact</Link></li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-white text-lg font-semibold mb-2">
              Restez informé
            </h3>

            <p className="text-gray-400 text-sm mb-4">
              Recevez nos dernières études sur le marché de l'emploi.
            </p>

            <input
              type="email"
              placeholder="votre email"
              className="w-full mb-4 px-4 py-3 rounded-lg bg-transparent border border-gray-600 text-sm outline-none focus:border-red-500"
            />

            <button className="w-full bg-red-600 hover:bg-red-700 transition text-white py-3 rounded-lg font-medium">
              S'abonner →
            </button>
          </div>
        </div>

        {/* CONTACT */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 text-sm text-gray-400">
          <div className="flex gap-6 mb-4 md:mb-0">
            <span>📞 +216 31 360 300</span>
            <span>📍 Tunis, Tunisie</span>
          </div>

          <div className="flex gap-6">
            <Link href="#" className="footer-link">Politique de confidentialité</Link>
            <Link href="#" className="footer-link">CGU</Link>
            <Link href="#" className="footer-link">Mentions légales</Link>
          </div>
        </div>

        {/* LINE */}
        <div className="border-t border-white/10 my-8" />

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row justify-between text-sm text-gray-500">
          <p>© 2026 Staffing Tunisia. Tous droits réservés.</p>
          <p>
            Créé par <span className="text-red-500">EOR4TECH</span>
          </p>
        </div>
      </div>

      {/* SCROLL TOP */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-red-600 p-3 rounded-full text-white shadow-lg hover:bg-red-700"
      >
        ↑
      </button>
    </footer>
  );
}