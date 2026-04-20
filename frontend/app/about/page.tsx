"use client";
import { useEffect, useRef, useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar";
import Image from "next/image";
import { MapPin } from "lucide-react";


export default function AboutPage() {
  // === HOOKS ICI ===
  const [stats, setStats] = useState({ Annéesdexpertise : 0, Clientssatisfaits: 0, Tauxderéussite: 0, BureauxenTunisie: 0 });
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

    const endValues = { Annéesdexpertise : 7, Clientssatisfaits: 150, Tauxderéussite: 95, BureauxenTunisie: 3 };

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;

      setStats({
        Annéesdexpertise: Math.round(endValues.Annéesdexpertise * progress),
        Clientssatisfaits: Math.round(endValues.Clientssatisfaits * progress),
        Tauxderéussite: Math.round(endValues.Tauxderéussite * progress),
        BureauxenTunisie: Math.round(endValues.BureauxenTunisie * progress),
      });

      if (frame >= totalFrames) clearInterval(counter);
    }, duration / totalFrames);
  };
  return (
    <main className="bg-white text-gray-900">
      <Navbar/>
<section className="relative w-full min-h-screen flex items-center text-white">

  {/* IMAGE BACKGROUND */}
  <Image
    src="/about1.png"
    alt="team"
    fill
    className="object-cover"
  />

  {/* DARK OVERLAY */}
  <div className="absolute inset-0 bg-[#020617]/80"></div>

  {/* CONTENT */}
  <div className="relative z-10 max-w-7xl pl-10 md:pl-25">
    
    <span className="bg-red-600/20 text-red-500 px-4 py-2 rounded-full text-sm border border-red-500">
      ● EXPANSION INTERNATIONALE
    </span>

    <h1 className="text-5xl md:text-6xl font-bold mt-6 leading-tight">
      Votre Partenaire <br />
      <span className="text-red-600">EOR & RH</span> <br />
      en Tunisie.
    </h1>

    <p className="text-gray-300 mt-6 max-w-xl">
      Staffing Tunisia est le leader des solutions de ressources humaines en Tunisie.
      Nous accompagnons les entreprises dans leur développement local et international.
    </p>

    <div className="mt-8 flex gap-4">
      <a href="#nous" className="bg-red-600 px-6 py-3 rounded-full hover:bg-red-700 transition">
        Découvrir notre histoire →
      </a>

      <button className="border border-gray-400 px-6 py-3 rounded-full hover:bg-white/10 transition">
        Rencontrer l'équipe
      </button>
    </div>

  </div>
</section>
 {/* STATISTIQUES SOUS HERO */}
      <section ref={statsRef} className="w-full bg-gray-900 text-white py-7 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 px-6">

          {/* 150+ CLIENTS */}
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-bold text-white">{stats.Annéesdexpertise}</span>
            <span className="text-sm md:text-base text-gray-300">Années d'expertise</span>
          </div>

          {/* 95% SATISFACTION */}
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-bold text-white">{stats.Clientssatisfaits}</span>
            <span className="text-sm md:text-base text-gray-300">Clients satisfaits</span>
          </div>

          {/* 24h RÉPONSE */}
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-bold text-white">{stats.Tauxderéussite}</span>
            <span className="text-sm md:text-base text-gray-300">Taux de réussite</span>
          </div>

          {/* 3 PAYS */}
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-bold text-red-600">{stats.BureauxenTunisie}</span>
            <span className="text-sm md:text-base text-gray-300">Bureaux en Tunisie</span>
          </div>
        </div>
      </section>
    
  
  
      {/* VISION */}
      <section className="py-20 px-6 md:px-16 bg-gray-50 text-center">
        <p className="text-red-500 uppercase tracking-[0.3em] text-10xl mb-4">
          NOTRE VISION
        </p>

        <h2 className="text-4xl font-bold mb-10">
          Guidée par le changement
        </h2>

        <div className="max-w-4xl mx-auto bg-red-50 p-10 rounded-2xl text-lg text-gray-700">
          Notre vision est guidée et inspirée par notre parfaite maîtrise du monde
          du travail et de l'emploi en Tunisie. Cette vision se base sur un maître mot :
          <span className="text-red-600 font-semibold"> LE CHANGEMENT</span>.
          <br /><br />
          <strong>Nous proposons des solutions créatives et innovantes.</strong>
        </div>
      </section>
<section id="nous" className="bg-gray-50 py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">

        {/* LEFT - TIMELINE */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16">
            Qui sommes-nous ?
          </h2>

          <div className="relative">

            {/* LINE */}
            <div className="absolute left-4 top-0 w-[2px] h-full bg-red-500"></div>

            {/* ITEM */}
            {[
              {
                title: "À l'origine",
                text: "À l'origine de Staffing Tunisia, une équipe de compétences tunisiennes qui a fait le choix de s'engager dans le capital humain, l'excellence et l'innovation.",
              },
              {
                title: "Fondation et croissance",
                text: "Fondée en 2018, Staffing Tunisia fut un acteur majeur dans le monde du travail dans toutes ses facettes.",
              },
              {
                title: "Expansion nationale et internationale",
                text: "Aujourd'hui Staffing Tunisia couvre le réseau national Tunisien avec 3 agences : une à Tunis, une à Sousse et le siège à Sfax ; et s'ouvre davantage sur le monde.",
              },
              {
                title: "Notre devise",
                text: "Servir nos partenaires clients, nos collaborateurs et nos candidats avec des solutions de proximité.",
              },
            ].map((item, index) => (
              <div key={index} className="relative pl-12 mb-12">

                {/* DOT */}
                <div className="absolute left-0 top-2 w-8 h-8 bg-red-500 rounded-full border-4 border-red-200"></div>

                {/* CONTENT (TOUS BLANCS) */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.text}</p>
                </div>

              </div>
            ))}

          </div>
        </div>

        {/* RIGHT - IMAGE */}
        <div className="relative w-full h-[420px] rounded-2xl overflow-hidden mt-50">
          {/* 👆 mt-20 = descend l'image */}
          
          <Image
            src="/about2.png"
            alt="team"
            fill
            className="object-cover"
          />

          {/* BADGE */}
          <div className="absolute bottom-6 left-6 bg-white shadow-lg rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 text-white flex items-center justify-center rounded-lg">
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

      {/* MISSION */}
      <section className="py-20 px-6 md:px-16   rounded-2xl mx-6 md:mx-16">
        <h2 className="text-3xl font-bold text-black text-center mb-6">
          Notre mission
        </h2>

        <p className="text-center text-gray-800 mb-10">
          Transformer les besoins des entreprises en solutions optimales.
        </p>

        <div className="grid md:grid-cols-2 gap-8 ">

          <div className="border border-gray-700 p-6 rounded-xl bg-gradient-to-r from-[#020617] via-[#020617] to-[#0a1a2f] ">
            <h3 className="text-lg text-white font-semibold mb-2">
              Accompagnement stratégique
            </h3>
            <p className="text-gray-400">
              Accompagner les entreprises dans leurs besoins en capital humain.
            </p>
          </div>

          <div className="border border-gray-700 p-6 rounded-xl bg-gradient-to-r from-[#020617] via-[#020617] to-[#0a1a2f]">
            <h3 className="text-lg font-semibold mb-2 text-white">
              Solutions sur mesure
            </h3>
            <p className="text-gray-400">
              Des solutions adaptées à chaque besoin spécifique.
            </p>
          </div>

        </div>
      </section>
<section className="w-full py-20 px-6 md:px-16  text-white">
  
  {/* TITLE */}
  <div className="max-w-4xl mx-auto text-center mb-16">
    <p className="text-gray-400">
      Staffing Tunisia est avant tout un ensemble de valeurs qui régissent nos actions et notre vision
      qui constitue le fondement de nos missions.
    </p>
  </div>

  {/* CARDS */}
  <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">

    {/* CARD 1 */}
    <div className="bg-[#111827] rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
      
      {/* ICON */}
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-600/20 mb-6">
        ❤️
      </div>

      <h3 className="text-xl font-bold mb-4">L'HUMAIN</h3>

      <p className="text-gray-400 mb-6 leading-relaxed">
        Le Capital humain est au cœur de notre activité. Nous misons sur la richesse humaine,
        qui constitue une force inépuisable et intarissable dans notre secteur.
        Le Capital humain constitue la plus importante ressource indispensable pour tout développement d'activité.
      </p>

      <div className="bg-[#0f172a] border border-gray-700 rounded-xl p-4 text-sm text-gray-300">
        C'est pour cette raison que nous traitons chaque client, chaque candidat et chaque collaborateur
        avec tout le respect qu'il mérite.
      </div>
    </div>

    {/* CARD 2 */}
    <div className="bg-[#111827] rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
      
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-600/20 mb-6">
        🎯
      </div>

      <h3 className="text-xl font-bold mb-4">L'EXCELLENCE</h3>

      <p className="text-gray-400 mb-6 leading-relaxed">
        Nous sommes animés par une volonté permanente d'apporter les meilleures solutions et services à nos clients,
        nos collaborateurs et nos candidats. Notre parfaite maîtrise du monde du travail nous permet de viser l'excellence.
      </p>

      <div className="bg-[#0f172a] border border-gray-700 rounded-xl p-4 text-sm text-gray-300">
        Nous ne cessons d'agir pour progresser, améliorer et perfectionner nos relations,
        nos solutions et nos services. L'excellence est plus qu'une valeur, c'est un choix !
      </div>
    </div>

    {/* CARD 3 */}
    <div className="bg-[#111827] rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
      
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-600/20 mb-6">
        ✨
      </div>

      <h3 className="text-xl font-bold mb-4">L'INNOVATION</h3>

      <p className="text-gray-400 mb-6 leading-relaxed">
        Pour nous, innovation et digitalisation vont de pair dans le monde actuel.
        Nous investissons dans l'innovation qui implique la digitalisation des métiers.
      </p>

      <div className="bg-[#0f172a] border border-gray-700 rounded-xl p-4 text-sm text-gray-300">
        Innover en matière de ressources humaines implique une migration vers le digital,
        dans le respect de l'environnement et l'accélération des procédures.
      </div>
    </div>

  </div>
</section>
      {/* IMPLANTATIONS */}
      <section className="w-full py-20 px-6 md:px-16 bg-white">
      <h2 className="text-3xl font-bold text-center mb-6">
          Notre présence

        </h2>
      {/* TITLE */}
      <p className="text-center text-gray-500 mb-16">
        Un réseau régional pour mieux vous accompagner partout en Tunisie.
      </p>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* ================= LEFT MAP ================= */}
        <div className="relative w-full h-[700px]  rounded-3xl flex items-center justify-center overflow-hidden">

          {/* IMAGE MAP */}
          <img src="/Tunisie.png" alt="map"  className="w-70" />

          {/* TUNIS */}
          <div className="absolute top-[17%] left-[48%] flex flex-col items-center">
            <div className="w-6 h-6 bg-red-600 rounded-full animate-ping absolute"></div>
            <div className="w-4 h-4 bg-red-600 rounded-full"></div>
            <span className="text-xs mt-2 font-medium">Tunis</span>
          </div>

          {/* SOUSSE */}
          <div className="absolute top-[29%] left-[60%] flex flex-col items-center">
            <div className="w-6 h-6 bg-blue-500 rounded-full animate-ping absolute"></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-xs mt-2 font-medium">Sousse</span>
          </div>

          {/* SFAX */}
          <div className="absolute top-[40%] left-[58%] flex flex-col items-center">
            <div className="w-6 h-6 bg-green-500 rounded-full animate-ping absolute"></div>
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-xs mt-2 font-medium">Sfax</span>
          </div>
        </div>

        {/* ================= RIGHT CONTENT ================= */}
        <div className="space-y-10">

          {/* CARD */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border">
            
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-100 text-red-600 p-3 rounded-lg">
                🏢
              </div>
              <div>
                <h3 className="font-bold text-lg">Tunis : Siège social</h3>
                <p className="text-sm text-gray-500">
                  Direction générale & Support client
                </p>
              </div>
            </div>

            <p className="text-gray-600 mb-4">
              Notre siège social regroupe les équipes de direction, support client et
              développement commercial. Centre de formation et d'innovation.
            </p>

            <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
              <MapPin size={16} />
              Centre Urbain Nord, Tunis
            </div>

            <div className="flex gap-3 text-sm">
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                🔴 Direction Générale
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                🔵 Support Client
              </span>
            </div>
          </div>

          {/* PARTNERS */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">
                Partenaires internationaux
              </h3>
              <span className="text-red-600 text-sm font-medium">
                🌍 20+ Pays
              </span>
            </div>

            <p className="text-gray-500 mb-8">
              Grâce à notre réseau de partenaires, nous accompagnons nos clients dans plus de 20 pays à travers le monde.
            </p>

            <div className="flex justify-between">

              {/* EUROPE */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full border flex items-center justify-center mb-2">
                  🌍
                </div>
                <p className="font-medium">Europe</p>
                <p className="text-sm text-gray-400">FR France</p>
              </div>

              {/* AMERIQUE */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full border flex items-center justify-center mb-2">
                  🌎
                </div>
                <p className="font-medium">Amérique</p>
                <p className="text-sm text-gray-400">USA, Canada</p>
              </div>

              {/* AFRIQUE */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full border flex items-center justify-center mb-2">
                  🌍
                </div>
                <p className="font-medium">Afrique</p>
                <p className="text-sm text-gray-400">Maroc, Côte d'Ivoire</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>

      {/* CTA */}
      <section className="py-20 px-6 md:px-16">
        <div className="bg-gradient-to-r from-black to-gray-800 text-white p-10 rounded-2xl text-center">
          <h2 className="text-2xl font-bold mb-4">
            Visitez-nous dans nos bureaux
          </h2>
          <p className="text-gray-300 mb-6">
            Prenez rendez-vous avec nos experts.
          </p>
          <a href="/contact" className="bg-red-600 px-6 py-3 rounded-full hover:bg-red-700">
            Prendre rendez-vous
          </a>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section className="py-20 pb-32 px-6 md:px-16  text-white">
  
  <p className="text-red-500 uppercase text-center mb-4">
    RECONNAISSANCE
  </p>

  <h2 className="text-4xl text-center text-black font-bold mb-10">
    Certifications
  </h2>

  <div className="grid md:grid-cols-3 gap-8">

    <div className="border border-gray-700 bg-[#111827] p-6 rounded-xl text-center">
      <h3 className="font-semibold">ISO 9001:2015</h3>
      <p className="text-gray-400 mt-2">Certification qualité</p>
    </div>

    <div className="border border-gray-700 bg-[#111827] p-6 rounded-xl text-center">
      <h3 className="font-semibold">Certification CNSS</h3>
      <p className="text-gray-400 mt-2">Agrément officiel</p>
    </div>

    <div className="border border-gray-700 bg-[#111827] p-6 rounded-xl text-center">
      <h3 className="font-semibold">Global EOR</h3>
      <p className="text-gray-400 mt-2">Réseau international</p>
    </div>

  </div>

</section>

    <section className="pt-20">
    <Footer /></section></main>
  );
}