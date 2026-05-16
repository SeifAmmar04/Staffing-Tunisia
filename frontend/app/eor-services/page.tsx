"use client";

import Image from "next/image";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar";
import { useLang } from "@/context/LangContext";
import { BookOpen, CheckCircle, Scale } from "lucide-react";

export default function HeroEOR() {
  const { t } = useLang();

  const steps = [
    { step: "1", title: t("eorProc1Title"), time: t("eorProc1Time"), desc: t("eorProc1Desc") },
    { step: "2", title: t("eorProc2Title"), time: t("eorProc2Time"), desc: t("eorProc2Desc") },
    { step: "3", title: t("eorProc3Title"), time: t("eorProc3Time"), desc: t("eorProc3Desc") },
    { step: "4", title: t("eorProc4Title"), time: t("eorProc4Time"), desc: t("eorProc4Desc") },
    { step: "5", title: t("eorProc5Title"), time: t("eorProc5Time"), desc: t("eorProc5Desc") },
  ];

  const sectors = [
    { title: t("eorSec1Title"), desc: t("eorSec1Desc") },
    { title: t("eorSec2Title"), desc: t("eorSec2Desc") },
    { title: t("eorSec3Title"), desc: t("eorSec3Desc") },
    { title: t("eorSec4Title"), desc: t("eorSec4Desc") },
  ];

  return (
    <main className="text-gray-900"><Navbar/>
    <section className="relative w-full  bg-gray-50 text-gray-900 py-50 px-6 md:px-16 overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-gray-400/20 blur-3xl"></div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <div>
          
          {/* Badge */}
          <span className="inline-block bg-white/80 border border-gray-300 text-sm px-4 py-1 mb-6">
            {t("eorHeroBadge")}
          </span>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900">
            {t("eorHeroTitle")}
          </h1>

          {/* Red Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-red-600 mt-4 relative inline-block">
            {t("eorHeroSubtitle")}
            <span className="block w-full h-[3px] bg-red-600 mt-2"></span>
          </h2>

          {/* Description */}
          <p className="text-gray-600 mt-6 max-w-lg">
            {t("eorHeroDesc")}
          </p>
<div className="pt-8"></div>
          {/* Button */}
          <a href="#proc" className=" bg-white border border-gray-300 mt-4  px-6 py-3 hover:bg-gray-50 transition">
            {t("eorHeroCta")}
          </a>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative w-full h-[400px] md:h-[450px] overflow-hidden shadow-2xl">
          <Image
            src="/EOR.png"
            alt="EOR"
            fill
            className="object-cover"
          />
        </div>

      </div>
    </section>
<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">

    {/* CARD 1 */}
    <div className=" border border-black p-6 shadow-sm hover:shadow-md transition">
      <div className="w-12 h-12 flex items-center justify-center  text-red-600 mb-4">
        <BookOpen size={24} />
      </div>

      <h3 className="text-xl font-semibold mb-3">
        {t("eorCard1Title")}
      </h3>

      <p className="text-gray-600">
        {t("eorCard1Desc")}
      </p>
    </div>

    {/* CARD 2 */}
    <div className="border border-black p-6 shadow-sm hover:shadow-md transition">
      <div className="w-12 h-12 flex items-center justify-center  text-red-600 mb-4">
        <CheckCircle size={24} />
      </div>

      <h3 className="text-xl font-semibold mb-3">
        {t("eorCard2Title")}
      </h3>

      <ul className="space-y-2 text-gray-600">
        <li>{t("eorCard2Li1")}</li>
        <li>{t("eorCard2Li2")}</li>
        <li>{t("eorCard2Li3")}</li>
      </ul>
    </div>

    {/* CARD 3 */}
    <div className="border border-black  p-6 shadow-sm hover:shadow-md transition">
      <div className="w-12 h-12 flex items-center justify-center  text-red-600 mb-4">
        <Scale size={24} />
      </div>

      <h3 className="text-xl font-semibold mb-3">
        {t("eorCard3Title")}
      </h3>

      <p className="text-gray-600">
        {t("eorCard3Desc")}
      </p>
    </div>

  </div>
</section>
<section
  id="proc"
  className=" py-20 text-center max-w-7xl mx-auto px-7"
>
  <p className="text-red-600 font-semibold tracking-widest mb-2">
    {t("eorProcBadge")}
  </p>

  <h2 className="text-4xl font-bold text-gray-900 mb-16">
    {t("eorProcTitle")}
  </h2>

  <div className="max-w-6xl mx-auto relative">
    
    {/* Ligne */}
    <div className="absolute top-6 left-0 w-full h-[2px] bg-gray-400"></div>

    <div className="grid md:grid-cols-5 gap-8 relative">
      
      {steps.map((item, i) => (
        <div key={i} className="text-center relative">
          
          {/* STEP */}
          <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center 
                          bg-red-600 text-white font-bold relative z-10 shadow-lg shadow-red-500/30">
            {item.step}
          </div>

          {/* TEXT */}
          <h4 className="font-semibold text-gray-900">
            {item.title}
          </h4>

          <p className="text-red-600 text-sm font-medium">
            {item.time}
          </p>

          <p className="text-gray-600 text-sm mt-2">
            {item.desc}
          </p>

        </div>
      ))}

    </div>
  </div>
</section>
<section className="mt-20 py-20 bg-white mx-auto px-7">
  <div className="max-w-7xl mx-auto px-6">
    
    <h2 className="text-3xl font-bold mb-10 text-gray-900">
      {t("eorSectorsTitle")}
    </h2>

    <div className="grid md:grid-cols-4 gap-6">
      
      {sectors.map((item, i) => (
        <div
          key={i}
          className="border border-black p-6 hover:border-red-600 transition"
        >
          <h3 className="text-lg text-green-700 mb-2">{item.title}</h3>
          <p className="text-gray-500 text-sm">{item.desc}</p>
        </div>
      ))}

    </div>

  </div>
</section>
 
<section className="py-20 ">
  <div className="max-w-4xl mx-auto px-6">
    
    <h2 className="text-3xl font-bold text-center mb-10">
      {t("eorFaqTitle")}
    </h2>

    <div className="space-y-4">

      <details className="bg-white border border-gray-200 p-5">
        <summary className="cursor-pointer font-semibold text-gray-800">
          {t("eorFaq1Q")}
        </summary>
        <p className="text-gray-600 mt-3">
          {t("eorFaq1A")}
        </p>
      </details>

      <details className="bg-white border border-gray-200 p-5">
        <summary className="cursor-pointer font-semibold text-gray-800">
          {t("eorFaq2Q")}
        </summary>
        <p className="text-gray-600 mt-3">
          {t("eorFaq2A")}
        </p>
      </details>

      <details className="bg-white border border-gray-200 p-5">
        <summary className="cursor-pointer font-semibold text-gray-800">
          {t("eorFaq3Q")}
        </summary>
        <p className="text-gray-600 mt-3">
          {t("eorFaq3A")}
        </p>
      </details>

    </div>

  </div>
</section>
    
        <section className="pt-20">
        <Footer /></section>
    </main>
  );
}