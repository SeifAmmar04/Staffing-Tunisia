"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";

export default function CandidatPage() {
  const { t } = useLang();

  const features = [
    { icon: "📄", title: t("feature1Title"), desc: t("feature1Desc") },
    { icon: "🔀", title: t("feature2Title"), desc: t("feature2Desc") },
    { icon: "💬", title: t("feature3Title"), desc: t("feature3Desc") },
    { icon: "💼", title: t("feature4Title"), desc: t("feature4Desc") },
    { icon: "🔔", title: t("feature5Title"), desc: t("feature5Desc") },
  ];

  const steps = [
    { n: "01", label: t("step1Label"), title: t("step1Title"), desc: t("step1Desc") },
    { n: "02", label: t("step2Label"), title: t("step2Title"), desc: t("step2Desc") },
    { n: "03", label: t("step3Label"), title: t("step3Title"), desc: t("step3Desc") },
    { n: "04", label: t("step4Label"), title: t("step4Title"), desc: t("step4Desc") },
    { n: "05", label: t("step5Label"), title: t("step5Title"), desc: t("step5Desc") },
  ];

  const atsFeatures = [
    { title: t("ats1Title"), desc: t("ats1Desc") },
    { title: t("ats2Title"), desc: t("ats2Desc") },
    { title: t("ats3Title"), desc: t("ats3Desc") },
    { title: t("ats4Title"), desc: t("ats4Desc") },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <div className="mt-30">
        <Navbar />
      </div>

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-28 bg-white overflow-hidden">
        <div
          className="absolute top-0 left-0 w-[50%] h-full bg-red-50 -z-10"
          style={{ clipPath: "polygon(0% 0%, 86% 0%, 100% 100%, 0% 100%)" }}
        />
        <div
          className="absolute bottom-12 right-8 w-44 h-44 -z-10 opacity-15"
          style={{
            backgroundImage: "radial-gradient(circle, #dc2626 1.5px, transparent 1.5px)",
            backgroundSize: "18px 18px",
          }}
        />
        <div className="absolute top-0 right-0 w-1 h-full bg-red-600" />

        <div className="max-w-7xl mx-auto px-10 grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT — Texte */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-[2px] bg-red-600" />
              <span className="text-red-600 font-bold text-xs uppercase tracking-widest">
                {t("candidatBadge")}
              </span>
            </div>

            <h1 className="text-5xl font-black leading-[1.08] mb-5 text-gray-900">
              {t("candidatTitle1")}{" "}
              <span className="relative inline-block text-red-600">
                {t("candidatTitle2")}
                <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-red-600" />
              </span>{" "}
              {t("candidatTitle3")}
            </h1>

            <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-lg">
              {t("candidatDesc")}
            </p>

            <ul className="flex flex-col gap-3 mb-10">
              {[
                t("candidatCheck1"),
                t("candidatCheck2"),
                t("candidatCheck3"),
                t("candidatCheck4"),
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="w-5 h-5 bg-red-600 flex items-center justify-center text-white text-[10px] flex-shrink-0 mt-0.5 font-black">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <motion.a
              href="/auth/register"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="bg-red-600 text-white px-10 py-4 font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-colors duration-200 shadow-lg shadow-red-100 inline-block"
            >
              {t("candidatCta")}
            </motion.a>
          </motion.div>

          {/* RIGHT — Image */}
          <motion.div
            className="relative flex justify-center items-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[440px] h-[440px] border border-red-100 -z-10" />
            <div className="absolute bottom-4 left-1/2 -translate-x-[45%] w-[400px] h-[400px] border border-red-200 -z-10" />
            <motion.img
              src="/cand.png"
              alt="Candidat"
              className="relative z-10 w-[520px] object-contain drop-shadow-xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute -top-4 -left-2 bg-white border border-gray-100 shadow-lg px-5 py-4 z-20 flex items-center gap-3">
              <div className="w-9 h-9 bg-red-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-black">✓</span>
              </div>
              <div>
                <p className="text-sm font-black text-gray-900">{t("candidatStat")}</p>
                <p className="text-xs text-gray-400">{t("candidatStatSub")}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-[2px] bg-red-600" />
            <span className="text-red-600 font-bold text-xs uppercase tracking-widest">{t("featuresLabel")}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
            <h2 className="text-3xl font-black text-gray-900 max-w-sm leading-tight">
              {t("featuresTitle")}
            </h2>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              {t("featuresSub")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="bg-white border border-gray-100 rounded-none p-7 flex flex-col gap-5 group hover:bg-red-600 hover:border-red-600 hover:shadow-xl hover:shadow-red-100 transition-all duration-300 cursor-default"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <div className="w-11 h-11 bg-red-50 group-hover:bg-white/20 flex items-center justify-center text-xl flex-shrink-0 transition-colors duration-300">
                  {f.icon}
                </div>
                <div className="w-8 h-[2px] bg-red-200 group-hover:bg-white/40 transition-colors duration-300" />
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-black text-gray-900 group-hover:text-white leading-snug transition-colors duration-300">
                    {f.title}
                  </p>
                  <p className="text-[12px] leading-relaxed text-gray-500 group-hover:text-red-100 transition-colors duration-300">
                    {f.desc}
                  </p>
                </div>
                <div className="mt-auto">
                  <span className="text-red-200 group-hover:text-white text-lg font-black opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300 inline-block">
                    →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CV ATS SECTION ── */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-10">
          <div className="grid md:grid-cols-2 gap-20 items-center">

            {/* LEFT — Mock CV */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative bg-white border border-gray-200 shadow-2xl shadow-gray-200 overflow-hidden">
                <div className="bg-gray-900 px-8 py-7 flex items-center gap-5">
                  <div className="w-16 h-16 bg-white/10 border border-white/20 flex items-center justify-center">
                    <span className="text-white text-2xl font-black">AT</span>
                  </div>
                  <div>
                    <p className="text-white font-black text-lg">Ahmed Trabelsi</p>
                    <p className="text-gray-400 text-xs mt-1">Développeur Full Stack · Tunis</p>
                  </div>
                  <div className="ml-auto bg-white text-gray-900 text-[10px] font-black px-3 py-1.5 flex-shrink-0">
                    ATS READY ✓
                  </div>
                </div>

                <div className="p-8 grid grid-cols-3 gap-6">
                  <div className="col-span-2 space-y-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-3 border-b border-gray-100 pb-2">
                        Expérience
                      </p>
                      <div className="space-y-3">
                        {["Développeur Senior · 3 ans", "Chef de projet digital · 2 ans"].map((e) => (
                          <div key={e} className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-gray-400 flex-shrink-0" />
                            <p className="text-xs text-gray-700 font-medium">{e}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-3 border-b border-gray-100 pb-2">
                        Compétences
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {["React", "Node.js", "SQL", "Docker", "Figma"].map((skill) => (
                          <span key={skill} className="bg-gray-100 text-gray-700 text-[10px] px-2.5 py-1 font-semibold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-3 border-b border-gray-100 pb-2">
                        Formation
                      </p>
                      <p className="text-xs text-gray-700">Licence Informatique · ESPRIT · 2018</p>
                    </div>
                  </div>

                  <div className="space-y-6 bg-gray-50 -mr-8 -my-8 px-5 py-8">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-3">Contact</p>
                      <div className="space-y-2">
                        {["📧 email@mail.com", "📞 +216 XX XXX", "📍 Tunis, TN"].map((c) => (
                          <p key={c} className="text-[10px] text-gray-600">{c}</p>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-3">Langues</p>
                      <div className="space-y-2">
                        {["Français · Courant", "Anglais · B2", "Arabe · Natif"].map((l) => (
                          <p key={l} className="text-[10px] text-gray-600">{l}</p>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-3">Profil</p>
                      <div className="space-y-2">
                        {[
                          { label: "React", pct: "90%" },
                          { label: "Node", pct: "75%" },
                          { label: "SQL", pct: "65%" },
                        ].map((sk) => (
                          <div key={sk.label}>
                            <div className="flex justify-between mb-1">
                              <span className="text-[9px] text-gray-500">{sk.label}</span>
                              <span className="text-[9px] text-gray-400">{sk.pct}</span>
                            </div>
                            <div className="h-1 bg-gray-200 w-full">
                              <motion.div
                                className="h-full bg-gray-700"
                                style={{ width: sk.pct }}
                                initial={{ width: 0 }}
                                whileInView={{ width: sk.pct }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 px-8 py-4 flex items-center gap-4 bg-white">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold flex-shrink-0">Score ATS</p>
                  <div className="flex-1 h-1.5 bg-gray-100">
                    <motion.div
                      className="h-full bg-gray-800"
                      initial={{ width: 0 }}
                      whileInView={{ width: "92%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                    />
                  </div>
                  <p className="text-xs font-black text-gray-800 flex-shrink-0">92%</p>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gray-100 border border-gray-200 -z-10" />
              <div
                className="absolute -top-4 -right-4 w-24 h-24 -z-10 opacity-20"
                style={{
                  backgroundImage: "radial-gradient(circle, #374151 1.5px, transparent 1.5px)",
                  backgroundSize: "14px 14px",
                }}
              />
            </motion.div>

            {/* RIGHT — Texte ATS */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-[2px] bg-red-600" />
                <span className="text-red-600 font-bold text-xs uppercase tracking-widest">{t("atsLabel")}</span>
              </div>

              <h2 className="text-4xl font-black text-gray-900 leading-tight mb-4">
                {t("atsTitle1")}{" "}
                <span className="relative inline-block text-red-600">
                  {t("atsTitle2")}
                  <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-red-600" />
                </span>{" "}
                {t("atsTitle3")}
              </h2>

              <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-md">
                {t("atsDesc")}
              </p>

              <div className="space-y-5 mb-12">
                {atsFeatures.map((f, i) => (
                  <motion.div
                    key={f.title}
                    className="flex items-start gap-4 group"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                  >
                    <div className="w-8 h-8 bg-red-600 flex items-center justify-center text-white text-xs font-black flex-shrink-0 group-hover:bg-gray-900 transition-colors duration-300">
                      0{i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 mb-0.5">{f.title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.a
                href="https://hresume.pro"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 bg-red-600 text-white px-10 py-4 font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-colors duration-200 shadow-lg shadow-red-100"
              >
                {t("atsCta")}
                <span className="text-base">→</span>
              </motion.a>

              <p className="text-[11px] text-gray-400 mt-3 ml-1">
                {t("atsCtaSub")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STEPS ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-[2px] bg-red-600" />
            <span className="text-red-600 font-bold text-xs uppercase tracking-widest">{t("stepsLabel")}</span>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-10">
            {t("stepsTitle")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-gray-200 border border-gray-200">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                className="bg-white p-7 flex flex-col gap-4 border-t-4 border-transparent hover:border-red-600 transition-all duration-300 cursor-pointer group"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
              >
                <div className="w-10 h-10 bg-red-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0 group-hover:bg-gray-900 transition-colors duration-300">
                  {s.n}
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-red-500 mb-1 font-bold">{s.label}</p>
                  <p className="text-xs font-black text-gray-900 mb-1.5">{s.title}</p>
                  <p className="text-[11px] leading-relaxed text-gray-500">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}