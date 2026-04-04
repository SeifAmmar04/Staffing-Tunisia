"use client";

import Image from "next/image";
import Link from "next/link"; 
import { useEffect, useRef, useState } from "react";
export default function Hero() {
  // === HOOKS ICI ===
  const [stats, setStats] = useState({ clients: 0, satisfaction: 0, reponse: 0, pays: 0 });
  const statsRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false); // pour ne pas répéter l'animation

   useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          animateStats();
        }
      },
      { threshold: 0.3 } // plus petit seuil pour détecter plus tôt
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) observer.unobserve(statsRef.current);
    };
  }, []);

  const animateStats = () => {
    const duration = 1200; // durée totale
    const frameRate = 30;
    const totalFrames = Math.round((duration / 1000) * frameRate);
    let frame = 0;

    const endValues = { clients: 150, satisfaction: 95, reponse: 24, pays: 3 };

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;

      setStats({
        clients: Math.round(endValues.clients * progress),
        satisfaction: Math.round(endValues.satisfaction * progress),
        reponse: Math.round(endValues.reponse * progress),
        pays: Math.round(endValues.pays * progress),
      });

      if (frame >= totalFrames) clearInterval(counter);
    }, duration / totalFrames);
  };
  return (
    <>
      {/* HERO */}
      <section className="w-full min-h-screen bg-gradient-to-r from-[#020617] via-[#020617] to-[#0a1a2f] text-white flex items-center">
        <div className="w-full grid md:grid-cols-2 gap-10 px-5 py-16 max-w-7xl mx-auto">
          
          {/* LEFT */}
          <div className="flex flex-col justify-center -ml-6">
            <div className="mb-6">
              <span className="bg-red-900/40 text-red-500 px-4 py-2 rounded-full text-sm border border-red-500">
                ● EXPANSION INTERNATIONALE
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Votre Partenaire <br />
              <span className="text-red-600">EOR & RH</span> <br />
              <span className="text-gray-400 italic font-light">
                en Tunisie
              </span>
            </h1>

            <p className="mt-6 text-gray-400 max-w-lg bg-white/5 border border-white/10 p-4 rounded-xl">
              Recrutez et gérez vos talents en Tunisie sans créer
              d'entité légale. Conformité garantie, gestion simplifiée.
            </p>

            <div className="mt-8 flex gap-4">
              <a href="contact" className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full font-semibold transition">
                Démarrer maintenant →
              </a>
              
            <a href="#solutions" className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full font-semibold transition">
  Nos Solutions
</a>
            
          </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-[600px] aspect-[16/9] rounded-2xl overflow-hidden">
              <Image
                src="/image.png"
                alt="Team work"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 bg-red-600/10 blur-3xl opacity-30"></div>

              <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-black/70 backdrop-blur-lg border border-red-500/50 px-5 py-3 rounded-xl shadow-lg transform transition-transform duration-1000 ease-in-out group-hover:scale-105 animate-float">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-600/20 border border-red-500">
                  <span className="text-red-500">✔</span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">
                    100% CONFORME
                  </p>
                  <p className="text-gray-300 text-xs">
                    Juridique & Fiscal
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* STATISTIQUES SOUS HERO */}
      <section ref={statsRef} className="w-full bg-gray-900 text-white py-7 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 px-6">

          {/* 150+ CLIENTS */}
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-bold text-white">{stats.clients}</span>
            <span className="text-sm md:text-base text-gray-300">CLIENTS</span>
          </div>

          {/* 95% SATISFACTION */}
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-bold text-white">{stats.satisfaction}%</span>
            <span className="text-sm md:text-base text-gray-300">SATISFACTION</span>
          </div>

          {/* 24h RÉPONSE */}
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-bold text-white">{stats.reponse}h</span>
            <span className="text-sm md:text-base text-gray-300">RÉPONSE</span>
          </div>

          {/* 3 PAYS */}
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-bold text-red-600">{stats.pays}</span>
            <span className="text-sm md:text-base text-gray-300">PAYS</span>
          </div>
        </div>
      </section>
    </>
  );
}