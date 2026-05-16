"use client";
import { useEffect, useRef, useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { useLang } from "@/context/LangContext";

export default function AboutPage() {
  const { t } = useLang();

  const [stats, setStats] = useState({ years: 0, clients: 0, success: 0, offices: 0 });
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
    const endValues = { years: 7, clients: 150, success: 95, offices: 3 };
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      setStats({
        years:   Math.round(endValues.years   * progress),
        clients: Math.round(endValues.clients * progress),
        success: Math.round(endValues.success * progress),
        offices: Math.round(endValues.offices * progress),
      });
      if (frame >= totalFrames) clearInterval(counter);
    }, duration / totalFrames);
  };

  const timelineItems = [
    { title: t("timeline1Title"), text: t("timeline1Text") },
    { title: t("timeline2Title"), text: t("timeline2Text") },
    { title: t("timeline3Title"), text: t("timeline3Text") },
    { title: t("timeline4Title"), text: t("timeline4Text") },
  ];

  return (
    <main className="bg-white text-gray-900">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative w-full min-h-screen flex items-center text-white">
        <Image src="/about1.png" alt="team" fill className="object-cover" />
        <div className="absolute inset-0 bg-[#020617]/80" />
        <div className="relative z-10 max-w-7xl pl-10 md:pl-25">
          <span className="bg-red-600/20 text-red-500 px-4 py-2 text-sm border border-red-500">
            ● {t("aboutHeroBadge")}
          </span>
          <h1 className="text-5xl md:text-6xl font-bold mt-6 leading-tight">
            {t("aboutHeroTitle1")} <br />
            <span className="text-red-600">{t("aboutHeroTitle2")}</span> <br />
            {t("aboutHeroTitle3")}
          </h1>
          <p className="text-gray-300 mt-6 max-w-xl">{t("aboutHeroDesc")}</p>
          <div className="mt-8 flex gap-4">
            <a href="#nous" className="bg-red-600 px-6 py-3 hover:bg-red-700 transition">
              {t("aboutHeroCta1")}
            </a>
            <a href="/contact" className="border border-gray-400 px-6 py-3 hover:bg-white/10 transition">
              {t("aboutHeroCta2")}
            </a>
          </div>
        </div>
      </section>

      {/* ── STATISTIQUES ── */}
      <section ref={statsRef} className="w-full bg-gray-100 text-gray-900 py-7 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 px-6">
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-4xl font-bold text-gray-900">{stats.years}</span>
            <span className="text-sm md:text-base text-gray-600">{t("statYears")}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-4xl font-bold text-gray-900">{stats.clients}</span>
            <span className="text-sm md:text-base text-gray-600">{t("statClients")}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-4xl font-bold text-gray-900">{stats.success}</span>
            <span className="text-sm md:text-base text-gray-600">{t("statSuccess")}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-4xl font-bold text-red-600">{stats.offices}</span>
            <span className="text-sm md:text-base text-gray-600">{t("statOffices")}</span>
          </div>
        </div>
      </section>

      {/* ── VISION ── */}
      <section className="py-20 px-6 md:px-16 bg-gray-50 text-center">
        <p className="text-red-500 uppercase tracking-[0.3em] text-10xl mb-4">
          {t("visionLabel")}
        </p>
        <h2 className="text-4xl font-bold mb-10">{t("visionTitle")}</h2>
        <div className="max-w-4xl mx-auto bg-red-50 p-10 text-lg text-gray-700">
          {t("visionText")}
          <br /><br />
          <strong>{t("visionSub")}</strong>
        </div>
      </section>

      {/* ── QUI SOMMES-NOUS ── */}
      <section id="nous" className="bg-gray-50 py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16">
              {t("whoTitle")}
            </h2>
            <div className="relative">
              <div className="absolute left-4 top-0 w-[2px] h-full bg-red-500" />
              {timelineItems.map((item, index) => (
                <div key={index} className="relative pl-12 mb-12">
                  <div className="absolute left-0 top-2 w-8 h-8 bg-red-500 border-4 border-red-200" />
                  <div className="bg-white p-6 shadow-md">
                    <h3 className="font-semibold text-lg mb-2 text-gray-900">{item.title}</h3>
                    <p className="text-gray-600">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative w-full h-[420px] overflow-hidden mt-50">
            <Image src="/about2.png" alt="team" fill className="object-cover" />
            <div className="absolute bottom-6 left-6 bg-white shadow-lg px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 text-white flex items-center justify-center">
                👥
              </div>
              <div>
                <p className="font-semibold text-gray-900">50+ experts</p>
                <p className="text-sm text-gray-500">RH qualifiés</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="py-20 px-15">
        <h2 className="text-red-500 uppercase tracking-[0.3em] text-center mb-4">{t("missionLabel")}</h2>
        <p className="text-center text-gray-800 mb-10">{t("missionSub")}</p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="border border-gray-300 p-6 bg-gray-100">
            <h3 className="text-lg text-gray-900 font-semibold text-center mb-2">{t("mission1Title")}</h3>
            <p className="text-gray-600 text-center">{t("mission1Desc")}</p>
          </div>
          <div className="border border-gray-300 p-6 bg-gray-100">
            <h3 className="text-lg font-semibold mb-2 text-center text-gray-900">{t("mission2Title")}</h3>
            <p className="text-gray-600 text-center">{t("mission2Desc")}</p>
          </div>
        </div>
      </section>

      {/* ── VALEURS ── */}
      <section className="w-full py-20 px-6 md:px-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-red-500 uppercase tracking-[0.3em] text-center mb-4">{t("valuesLabel")}</h2>
          <p className="text-gray-700">{t("valuesSub")}</p>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-gray-100 p-8 shadow-lg hover:shadow-xl transition border-2 border-gray-300">
            <div className="w-14 h-14 flex items-center justify-center mb-6 border-2 border-gray-300">❤️</div>
            <h3 className="text-xl font-bold mb-4 text-gray-900">{t("value1Title")}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{t("value1Desc")}</p>
            <div className="bg-white border border-gray-200 p-4 text-sm text-gray-700">{t("value1Box")}</div>
          </div>
          <div className="bg-gray-100 p-8 shadow-lg hover:shadow-xl transition border-2 border-gray-300">
            <div className="w-14 h-14 flex items-center justify-center mb-6 border-2 border-gray-300">🎯</div>
            <h3 className="text-xl font-bold mb-4 text-gray-900">{t("value2Title")}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{t("value2Desc")}</p>
            <div className="bg-white border border-gray-200 p-4 text-sm text-gray-700">{t("value2Box")}</div>
          </div>
          <div className="bg-gray-100 p-8 shadow-lg hover:shadow-xl transition border-2 border-gray-300">
            <div className="w-14 h-14 flex items-center justify-center mb-6 border-2 border-gray-300">✨</div>
            <h3 className="text-xl font-bold mb-4 text-gray-900">{t("value3Title")}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{t("value3Desc")}</p>
            <div className="bg-white border border-gray-200 p-4 text-sm text-gray-700">{t("value3Box")}</div>
          </div>
        </div>
      </section>

      {/* ── PRÉSENCE ── */}
      <section className="w-full py-20 px-6 md:px-16 bg-white">
        <h2 className="text-red-500 uppercase tracking-[0.3em] text-center mb-4">{t("presenceLabel")}</h2>
        <p className="text-center text-gray-500 mb-16">{t("presenceSub")}</p>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* MAP */}
          <div className="relative w-full h-[700px] rounded-3xl flex items-center justify-center overflow-hidden">
            <img src="/Tunisie.png" alt="map" className="w-70" />
            <div className="absolute top-[17%] left-[48%] flex flex-col items-center">
              <div className="w-6 h-6 bg-red-600 rounded-full animate-ping absolute" />
              <div className="w-4 h-4 bg-red-600 rounded-full" />
              <span className="text-xs mt-2 font-medium">Tunis</span>
            </div>
            <div className="absolute top-[29%] left-[60%] flex flex-col items-center">
              <div className="w-6 h-6 bg-blue-500 rounded-full animate-ping absolute" />
              <div className="w-4 h-4 bg-blue-500 rounded-full" />
              <span className="text-xs mt-2 font-medium">Sousse</span>
            </div>
            <div className="absolute top-[40%] left-[58%] flex flex-col items-center">
              <div className="w-6 h-6 bg-green-500 rounded-full animate-ping absolute" />
              <div className="w-4 h-4 bg-green-500 rounded-full" />
              <span className="text-xs mt-2 font-medium">Sfax</span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-10">
            <div className="bg-white shadow-lg p-6 border">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-red-100 text-red-600 p-3">🏢</div>
                <div>
                  <h3 className="font-bold text-lg">{t("office1Title")}</h3>
                  <p className="text-sm text-gray-500">{t("office1Sub")}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{t("office1Desc")}</p>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                <MapPin size={16} />
                {t("office1Addr")}
              </div>
              <div className="flex gap-3 text-sm">
                <span className="bg-gray-100 px-3 py-1 rounded-full">🔴 Direction Générale</span>
                <span className="bg-gray-100 px-3 py-1 rounded-full">🔵 Support Client</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">{t("partnersTitle")}</h3>
                <span className="text-red-600 text-sm font-medium">🌍 20+ Pays</span>
              </div>
              <p className="text-gray-500 mb-8">{t("partnersSub")}</p>
              <div className="flex justify-between">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full border flex items-center justify-center mb-2">🌍</div>
                  <p className="font-medium">{t("partnerEurope")}</p>
                  <p className="text-sm text-gray-400">FR France</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full border flex items-center justify-center mb-2">🌎</div>
                  <p className="font-medium">{t("partnerAmerique")}</p>
                  <p className="text-sm text-gray-400">USA, Canada</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full border flex items-center justify-center mb-2">🌍</div>
                  <p className="font-medium">{t("partnerAfrique")}</p>
                  <p className="text-sm text-gray-400">Maroc, Côte d'Ivoire</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ── */}
      <section className="py-20 pb-32 px-6 md:px-16">
        <p className="text-red-600 uppercase text-center mb-4">{t("certifLabel")}</p>
        <h2 className="text-4xl text-center text-gray-900 font-bold mb-10">{t("certifTitle")}</h2>
        <p className="text-gray-400 text-lg text-center leading-relaxed max-w-2xl mx-auto">{t("certifSub")}</p>
        <div className="grid md:grid-cols-3 gap-8 pt-18">

          {/* ISO 9001 */}
          <div className="bg-gray-100 p-8 border border-gray-200 hover:border-red-400/40 transition-all duration-300 group">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl text-gray-900 font-semibold text-center mb-4">{t("certif1Title")}</h3>
            <p className="text-gray-700 text-center leading-relaxed mb-6">{t("certif1Desc")}</p>
            <p className="text-gray-500 text-center text-sm">{t("certif1Date")}</p>
          </div>

          {/* CNSS */}
          <div className="bg-gray-100 p-8 border border-gray-200 hover:border-red-400/40 transition-all duration-300 group">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl text-gray-900 font-semibold text-center mb-4">{t("certif2Title")}</h3>
            <p className="text-gray-700 text-center leading-relaxed mb-6">{t("certif2Desc")}</p>
            <p className="text-gray-500 text-center text-sm">{t("certif2Date")}</p>
          </div>

          {/* Global EOR */}
          <div className="bg-gray-100 p-8 border border-gray-200 hover:border-red-400/40 transition-all duration-300 group">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl text-gray-900 font-semibold text-center mb-4">{t("certif3Title")}</h3>
            <p className="text-gray-700 text-center leading-relaxed mb-6">{t("certif3Desc")}</p>
            <p className="text-gray-500 text-center text-sm">{t("certif3Date")}</p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 md:px-16">
        <div className="bg-gray-100 text-white p-10 text-center border-2 border-gray-300">
          <h2 className="text-2xl font-bold mb-4 text-black">{t("ctaTitle")}</h2>
          <p className="text-gray-900 mb-6">{t("ctaSub")}</p>
          <a href="/contact" className="bg-red-600 px-6 py-3 hover:bg-red-700 inline-block">
            {t("ctaBtn")}
          </a>
        </div>
      </section>

      <section className="pt-20">
        <Footer />
      </section>
    </main>
  );
}