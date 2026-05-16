"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar";
import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";

export default function ContactPage() {
  const { t } = useLang();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    services: [] as string[],
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const servicesList = [
    t("contactService1"),
    t("contactService2"),
    t("contactService3"),
    t("contactService4"),
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (service: string) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
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
          services: [],
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

  return (
    <main className="bg-white text-gray-900">
      <Navbar />

      <section className="min-h-screen pt-30 bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-11 grid md:grid-cols-2 gap-12">
          {/* GAUCHE */}
          <motion.div
            className="h-full flex flex-col py-16 pr-10"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-[2px] bg-blue-600"></div>
                <span className="text-blue-600 font-semibold">{t("contactLabel")}</span>
              </div>

              <h2 className="text-5xl font-bold leading-tight mb-6">
                {t("contactTitle")}
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                {t("contactDesc")}
              </p>
            </div>

            <div className="space-y-10 mt-12">
              <div className="flex items-start gap-4">
                <div className="text-blue-600 text-3xl">📞</div>
                <div>
                  <p className="text-gray-500">{t("contactPhone")}</p>
                  <p className="font-semibold text-lg">(00216) 31 360 300</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-blue-600 text-3xl">✉️</div>
                <div>
                  <p className="text-gray-500">{t("contactEmail")}</p>
                  <p className="font-semibold text-lg">contact@staffing-tunisia.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-blue-600 text-3xl">📍</div>
                <div>
                  <p className="text-gray-500">{t("contactSiege")}</p>
                  <p className="font-semibold text-lg">
                    {t("contactSiegeAddr")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* DROITE - FORMULAIRE */}
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white p-8  shadow-lg space-y-5"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <h3 className="text-xl font-semibold mb-4">{t("formTitle")}</h3>

            <input
              type="text"
              name="company"
              placeholder={t("formCompany")}
              value={form.company}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            />

            <input
              type="text"
              name="name"
              placeholder={t("formName")}
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500"
            />

            <input
              type="email"
              name="email"
              placeholder={t("formEmail")}
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500"
            />

            <input
              type="text"
              name="phone"
              placeholder={t("formPhone")}
              value={form.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            />

            <div>
              <p className="font-semibold mb-3">{t("contactServiceLabel")}</p>
              <div className="grid grid-cols-2 gap-3">
                {servicesList.map((service) => (
                  <div
                    key={service}
                    onClick={() => handleServiceChange(service)}
                    className={`cursor-pointer border rounded-xl p-4 text-sm transition ${
                      form.services.includes(service)
                        ? "border-red-600 bg-red-50"
                        : "hover:border-red-400"
                    }`}
                  >
                    {service}
                  </div>
                ))}
              </div>
            </div>

            <textarea
              name="message"
              placeholder={t("formMessage")}
              rows={4}
              value={form.message}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500"
            />

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
            >
              {loading ? t("formSending") : t("formSubmit")}
            </button>

            {success && (
              <p className="text-green-600 text-sm text-center">
                {t("formSuccess")}
              </p>
            )}
          </motion.form>
        </div>
      </section>

      <Footer />
    </main>
  );
}