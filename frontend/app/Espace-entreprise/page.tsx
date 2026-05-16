"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";

export default function EspaceEntreprise() {
  const { t } = useLang();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    services: ["Recrutement"],
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      alert(t("contactAlert"));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess(true);
        setForm({
          name: "",
          email: "",
          phone: "",
          company: "",
          services: ["Recrutement"],
          message: "",
        });
      } else {
        alert(t("contactErreur"));
      }
    } catch (err) {
      console.error(err);
      alert(t("contactErreurReseau"));
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: t("proc1Title"), desc: t("proc1Desc") },
    { title: t("proc2Title"), desc: t("proc2Desc") },
    { title: t("proc3Title"), desc: t("proc3Desc") },
    { title: t("proc4Title"), desc: t("proc4Desc") },
  ];

  const whyUs = [
    { title: t("why1Title"), desc: t("why1Desc") },
    { title: t("why2Title"), desc: t("why2Desc") },
    { title: t("why3Title"), desc: t("why3Desc") },
  ];

  return (
    <main className="bg-white text-gray-900 overflow-x-hidden">
      <div className="mt-30">
        <Navbar />
      </div>

      {/* ─── HERO ─── */}
      <section className="relative pt-30 pb-32 bg-white overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[55%] h-full bg-red-50 -z-10"
          style={{ clipPath: "polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        />
        <div
          className="absolute bottom-10 left-10 w-40 h-40 -z-10 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, #ef4444 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
          {/* TEXTE */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="inline-block text-sm font-bold uppercase tracking-[0.2em] text-red-500 mb-6 border-l-4 border-red-500 pl-3">
              {t("entrepriseBadge")}
            </span>
            <h1 className="text-6xl font-extrabold mb-8 leading-[1.1] text-gray-900">
              <span className="relative inline-block">
                {t("entrepriseTitle")}
                <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-red-500" />
              </span>
            </h1>
            <p className="text-gray-500 text-xl mb-12 leading-relaxed max-w-lg">
              {t("entrepriseDesc")}
            </p>
            <motion.a
              href="/"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-red-600 text-white px-10 py-5 text-base font-bold uppercase tracking-widest hover:bg-red-700 transition-colors duration-200 shadow-lg shadow-red-200"
            >
              {t("entrepriseCta")}
            </motion.a>
          </motion.div>

          {/* IMAGE */}
          <motion.div
            className="relative flex justify-center"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          >
            <div className="absolute -top-6 -left-6 bg-white shadow-xl px-6 py-5 z-10 flex items-center gap-3 border border-gray-100">
              <div className="w-10 h-10 bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-xl">✓</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{t("entrepriseStat")}</p>
                <p className="text-xs text-gray-400">{t("entrepriseStatSub")}</p>
              </div>
            </div>

            <motion.img
              src="/rec.png"
              className="w-full max-w-md drop-shadow-2xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </section>

      {/* ─── PROCESS ─── */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-20 items-center">
          {/* IMAGE LEFT */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 translate-x-4 translate-y-4 -z-10 opacity-10" />
              <svg
                viewBox="0 0 680 520"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full max-w-2xl"
                style={{ width: "600px", height: "auto" }}
              >
                <circle cx="580" cy="80" r="90" fill="#fff1f1" opacity="0.9" />
                <circle cx="80" cy="440" r="70" fill="#fff1f1" opacity="0.7" />
                <circle cx="340" cy="500" r="50" fill="#fef2f2" opacity="0.6" />
                <g opacity="0.12">
                  <circle cx="600" cy="160" r="2.5" fill="#dc2626" />
                  <circle cx="620" cy="160" r="2.5" fill="#dc2626" />
                  <circle cx="640" cy="160" r="2.5" fill="#dc2626" />
                  <circle cx="600" cy="180" r="2.5" fill="#dc2626" />
                  <circle cx="620" cy="180" r="2.5" fill="#dc2626" />
                  <circle cx="640" cy="180" r="2.5" fill="#dc2626" />
                  <circle cx="600" cy="200" r="2.5" fill="#dc2626" />
                  <circle cx="620" cy="200" r="2.5" fill="#dc2626" />
                  <circle cx="640" cy="200" r="2.5" fill="#dc2626" />
                  <circle cx="40" cy="80" r="2.5" fill="#dc2626" />
                  <circle cx="60" cy="80" r="2.5" fill="#dc2626" />
                  <circle cx="80" cy="80" r="2.5" fill="#dc2626" />
                  <circle cx="40" cy="100" r="2.5" fill="#dc2626" />
                  <circle cx="60" cy="100" r="2.5" fill="#dc2626" />
                  <circle cx="80" cy="100" r="2.5" fill="#dc2626" />
                </g>
                <rect x="160" y="40" width="360" height="240" rx="18" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
                <rect x="160" y="40" width="360" height="10" rx="9" fill="#dc2626" />
                <rect x="160" y="46" width="360" height="4" fill="#dc2626" />
                <circle cx="186" cy="68" r="6" fill="#fee2e2" />
                <circle cx="206" cy="68" r="6" fill="#fecaca" />
                <circle cx="226" cy="68" r="6" fill="#dc2626" opacity="0.4" />
                <rect x="178" y="84" width="200" height="130" rx="10" fill="#1e1e2e" />
                <circle cx="278" cy="118" r="24" fill="#3b3b5c" />
                <circle cx="278" cy="109" r="11" fill="#6366f1" opacity="0.9" />
                <ellipse cx="278" cy="136" rx="17" ry="10" fill="#6366f1" opacity="0.7" />
                <rect x="266" y="198" width="24" height="8" rx="4" fill="#dc2626" />
                <rect x="272" y="194" width="12" height="6" rx="3" fill="#ef4444" />
                <rect x="390" y="84" width="118" height="130" rx="10" fill="#f8fafc" />
                <circle cx="449" cy="118" r="22" fill="#dbeafe" />
                <circle cx="449" cy="110" r="10" fill="#3b82f6" />
                <ellipse cx="449" cy="134" rx="15" ry="9" fill="#3b82f6" opacity="0.7" />
                <rect x="408" y="148" width="82" height="8" rx="4" fill="#e2e8f0" />
                <rect x="418" y="162" width="62" height="6" rx="3" fill="#bfdbfe" />
                <rect x="415" y="174" width="68" height="20" rx="10" fill="#dcfce7" />
                <circle cx="429" cy="184" r="4" fill="#16a34a" />
                <rect x="437" y="180" width="38" height="8" rx="4" fill="#16a34a" opacity="0.6" />
                <rect x="200" y="220" width="140" height="22" rx="11" fill="#fee2e2" />
                <circle cx="216" cy="231" r="5" fill="#dc2626" />
                <rect x="225" y="226" width="100" height="10" rx="5" fill="#dc2626" opacity="0.55" />
                <rect x="28" y="140" width="118" height="160" rx="14" fill="white" stroke="#e5e7eb" strokeWidth="1" />
                <rect x="28" y="140" width="118" height="6" rx="6" fill="#dc2626" />
                <circle cx="87" cy="192" r="26" fill="#fef3c7" />
                <circle cx="87" cy="183" r="11" fill="#f59e0b" />
                <ellipse cx="87" cy="208" rx="16" ry="9" fill="#f59e0b" opacity="0.75" />
                <rect x="46" y="227" width="82" height="8" rx="4" fill="#f3f4f6" />
                <rect x="54" y="241" width="66" height="7" rx="3" fill="#fef3c7" />
                <rect x="46" y="256" width="82" height="6" rx="3" fill="#f3f4f6" />
                <rect x="46" y="256" width="56" height="6" rx="3" fill="#f59e0b" opacity="0.8" />
                <rect x="46" y="270" width="52" height="16" rx="8" fill="#fef3c7" />
                <rect x="54" y="275" width="36" height="6" rx="3" fill="#f59e0b" opacity="0.6" />
                <rect x="534" y="140" width="118" height="160" rx="14" fill="white" stroke="#e5e7eb" strokeWidth="1" />
                <rect x="534" y="140" width="118" height="6" rx="6" fill="#dc2626" />
                <circle cx="593" cy="192" r="26" fill="#ede9fe" />
                <circle cx="593" cy="183" r="11" fill="#7c3aed" />
                <ellipse cx="593" cy="208" rx="16" ry="9" fill="#7c3aed" opacity="0.75" />
                <rect x="552" y="227" width="82" height="8" rx="4" fill="#f3f4f6" />
                <rect x="560" y="241" width="66" height="7" rx="3" fill="#ede9fe" />
                <rect x="552" y="256" width="82" height="6" rx="3" fill="#f3f4f6" />
                <rect x="552" y="256" width="70" height="6" rx="3" fill="#7c3aed" opacity="0.7" />
                <rect x="552" y="270" width="52" height="16" rx="8" fill="#ede9fe" />
                <rect x="560" y="275" width="36" height="6" rx="3" fill="#7c3aed" opacity="0.6" />
                <line x1="146" y1="200" x2="160" y2="200" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
                <line x1="520" y1="200" x2="534" y2="200" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
                <rect x="80" y="330" width="520" height="150" rx="16" fill="white" stroke="#e5e7eb" strokeWidth="1" />
                <rect x="80" y="330" width="520" height="6" rx="6" fill="#f3f4f6" />
                <circle cx="160" cy="390" r="22" fill="#fee2e2" />
                <circle cx="160" cy="390" r="14" fill="#dc2626" />
                <rect x="148" y="386" width="24" height="8" rx="4" fill="white" opacity="0.9" />
                <rect x="124" y="420" width="72" height="8" rx="4" fill="#f3f4f6" />
                <rect x="130" y="434" width="60" height="6" rx="3" fill="#fee2e2" />
                <line x1="184" y1="390" x2="226" y2="390" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.35" />
                <circle cx="250" cy="390" r="22" fill="#fee2e2" />
                <circle cx="250" cy="390" r="14" fill="#dc2626" />
                <rect x="238" y="386" width="24" height="8" rx="4" fill="white" opacity="0.9" />
                <rect x="214" y="420" width="72" height="8" rx="4" fill="#f3f4f6" />
                <rect x="220" y="434" width="60" height="6" rx="3" fill="#fee2e2" />
                <line x1="274" y1="390" x2="316" y2="390" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.35" />
                <circle cx="340" cy="390" r="26" fill="#dc2626" opacity="0.15" />
                <circle cx="340" cy="390" r="22" fill="#dc2626" />
                <circle cx="340" cy="390" r="14" fill="white" opacity="0.25" />
                <rect x="328" y="386" width="24" height="8" rx="4" fill="white" opacity="0.95" />
                <rect x="304" y="422" width="72" height="8" rx="4" fill="#f3f4f6" />
                <rect x="310" y="436" width="60" height="6" rx="3" fill="#fecaca" />
                <line x1="364" y1="390" x2="406" y2="390" stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.5" />
                <circle cx="430" cy="390" r="22" fill="#f9fafb" />
                <circle cx="430" cy="390" r="14" fill="#d1d5db" />
                <rect x="418" y="386" width="24" height="8" rx="4" fill="white" opacity="0.7" />
                <rect x="394" y="420" width="72" height="8" rx="4" fill="#f3f4f6" />
                <rect x="400" y="434" width="60" height="6" rx="3" fill="#f3f4f6" />
                <line x1="454" y1="390" x2="496" y2="390" stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.5" />
                <circle cx="520" cy="390" r="22" fill="#f9fafb" />
                <circle cx="520" cy="390" r="14" fill="#d1d5db" />
                <rect x="508" y="386" width="24" height="8" rx="4" fill="white" opacity="0.7" />
                <rect x="484" y="420" width="72" height="8" rx="4" fill="#f3f4f6" />
                <rect x="490" y="434" width="60" height="6" rx="3" fill="#f3f4f6" />
                <rect x="460" y="48" width="158" height="64" rx="14" fill="white" stroke="#e5e7eb" strokeWidth="1" />
                <circle cx="490" cy="80" r="18" fill="#dcfce7" />
                <circle cx="490" cy="80" r="11" fill="#16a34a" />
                <rect x="484" y="76" width="12" height="8" rx="4" fill="white" opacity="0.9" />
                <rect x="514" y="68" width="86" height="9" rx="4" fill="#f3f4f6" />
                <rect x="514" y="83" width="60" height="8" rx="4" fill="#dcfce7" />
                <rect x="28" y="48" width="120" height="76" rx="14" fill="white" stroke="#e5e7eb" strokeWidth="1" />
                <rect x="42" y="64" width="40" height="8" rx="4" fill="#fee2e2" />
                <rect x="42" y="78" width="24" height="18" rx="4" fill="#dc2626" />
                <rect x="72" y="78" width="18" height="12" rx="3" fill="#fca5a5" />
                <rect x="96" y="78" width="14" height="16" rx="3" fill="#fecaca" />
                <rect x="116" y="78" width="10" height="20" rx="3" fill="#dc2626" opacity="0.3" />
                <rect x="42" y="102" width="86" height="7" rx="3" fill="#f3f4f6" />
              </svg>
            </div>
          </motion.div>

          {/* TEXT RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block text-sm font-bold uppercase tracking-[0.2em] text-red-500 mb-4 border-l-4 border-red-500 pl-3">
              {t("processLabel")}
            </span>
            <h2 className="text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
              {t("processTitle")}
            </h2>
            <p className="text-gray-500 mb-14 text-lg leading-relaxed max-w-lg">
              {t("processDesc")}
            </p>

            <div className="space-y-10">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="flex gap-6 items-start group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className="w-14 h-14 flex items-center justify-center border-2 border-red-600 text-red-600 font-black text-base shrink-0 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1 text-gray-900">{step.title}</p>
                    <p className="text-gray-500 text-base leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── WHY US + FORM ─── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />

        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-20 items-start relative z-10">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block text-sm font-bold uppercase tracking-[0.2em] text-red-500 mb-6 border-l-4 border-red-500 pl-3">
              {t("whyLabel")}
            </span>
            <h2 className="text-5xl font-extrabold mb-14 leading-tight text-gray-900">
              {t("whyTitle")}
            </h2>

            <div className="space-y-12">
              {whyUs.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex gap-6 items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                >
                  <div className="mt-1 w-10 h-10 bg-red-600 flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-bold">0{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-gray-900">{item.title}</h3>
                    <p className="text-gray-500 text-base leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* FORM RIGHT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="bg-white shadow-2xl shadow-gray-200 p-12 border border-gray-100">
              <h3 className="text-3xl font-extrabold mb-2 text-gray-900">
                {t("formTitle")}
              </h3>
              <p className="text-gray-400 text-base mb-10">
                {t("formSub")}
              </p>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="company"
                  placeholder={t("formCompany")}
                  value={form.company}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 placeholder-gray-400 text-gray-900 text-base outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
                <input
                  type="text"
                  name="name"
                  placeholder={t("formName")}
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 placeholder-gray-400 text-gray-900 text-base outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
                <input
                  type="email"
                  name="email"
                  placeholder={t("formEmail")}
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 placeholder-gray-400 text-gray-900 text-base outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
                <input
                  type="text"
                  name="phone"
                  placeholder={t("formPhone")}
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 placeholder-gray-400 text-gray-900 text-base outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
                <textarea
                  name="message"
                  placeholder={t("formMessage")}
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 placeholder-gray-400 text-gray-900 text-base outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-red-600 text-white py-5 font-bold text-base uppercase tracking-widest hover:bg-red-700 transition-colors duration-200 shadow-lg shadow-red-200 mt-2"
                >
                  {loading ? t("formSending") : t("formSubmit")}
                </motion.button>

                {success && (
                  <p className="text-green-600 text-sm text-center pt-2">
                    {t("formSuccess")}
                  </p>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}