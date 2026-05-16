"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/context/LangContext";

export default function Hero() {
  const { t } = useLang();
  const [stats, setStats] = useState({ clients: 0, satisfaction: 0, reponse: 0, pays: 0 });
  const statsRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          animateStats();
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => { if (statsRef.current) observer.unobserve(statsRef.current); };
  }, []);

  const animateStats = () => {
    const duration = 1200;
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
      <section className="w-full min-h-screen bg-gray-100 text-gray-900 flex items-center">
        <div className="w-full grid md:grid-cols-2 gap-10 px-5 py-16 max-w-7xl mx-auto">

          {/* LEFT */}
          <div className="flex flex-col justify-center -ml-6">
            <div className="mb-6">
              <span className="bg-red-100 text-red-600 px-4 py-2 text-sm border border-red-400">
                ● {t("expansion")}
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              {t("heroTitle1")} <br />
              <span className="text-red-600">{t("heroTitle2")}</span> <br />
              <span className="text-gray-400 italic font-light">{t("heroTitle3")}</span>
            </h1>

            <p className="mt-6 text-gray-600 max-w-lg bg-gray-200 border border-gray-300 p-4">
              {t("heroDesc")}
            </p>

            <div className="mt-8 flex gap-4">
              <a href="contact" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 font-semibold transition">
                {t("startNow")} →
              </a>
              <a href="#solutions" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 font-semibold transition">
                {t("ourSolutions")}
              </a>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-[600px] aspect-[16/9] overflow-hidden">
              <Image
                src="/image.png"
                alt="Team work"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30"></div>

              <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-gray-900/80 backdrop-blur-lg border border-red-600/50 px-5 py-3 shadow-lg animate-float">
                <div className="w-10 h-10 flex items-center justify-center bg-red-700/20 border border-red-600">
                  <span className="text-red-500">✔</span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{t("conforme")}</p>
                  <p className="text-gray-300 text-xs">{t("conformeDesc")}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* STATISTIQUES */}
      <section ref={statsRef} className="w-full bg-gray-100 text-gray-900 py-7 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 px-6">

          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-4xl font-bold text-gray-900">{stats.clients}</span>
            <span className="text-sm md:text-base text-gray-600">{t("clients")}</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-4xl font-bold text-gray-900">{stats.satisfaction}%</span>
            <span className="text-sm md:text-base text-gray-600">{t("satisfaction")}</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-4xl font-bold text-gray-900">{stats.reponse}h</span>
            <span className="text-sm md:text-base text-gray-600">{t("reponse")}</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-4xl font-bold text-red-600">{stats.pays}</span>
            <span className="text-sm md:text-base text-gray-600">{t("pays")}</span>
          </div>

        </div>
      </section>
    </>
  );
}