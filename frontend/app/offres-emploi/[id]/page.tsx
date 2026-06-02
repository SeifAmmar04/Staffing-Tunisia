"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";

const API_URL = "https://staffing-tunisia-1.onrender.com";

export default function OffreDetails() {
  const searchParams = useSearchParams();
  const id = searchParams.get("n");

  const [offre, setOffre] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [cvError, setCvError] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    if (!id) return;
    const fetchOffre = async () => {
      try {
        const res = await fetch(`${API_URL}/offres/${id}`);
        const data = await res.json();
        setOffre(data);
      } catch {
        setOffre(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOffre();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fileRef.current?.files?.[0] || fileError) {
      setCvError(true);
      return;
    }
    setCvError(false);

    const formData = new FormData();
    formData.append("job_id", id!);
    formData.append("first_name", form.nom);
    formData.append("last_name", form.prenom);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("resume", fileRef.current.files[0]);

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        formData.append("applicant_id", String(payload.id));
      } catch {}
    }

    try {
      await fetch(`${API_URL}/applications`, {
        method: "POST",
        body: formData,
      });
      setSubmitted(true);
    } catch {
      alert("Erreur lors de l'envoi.");
    }
  };

  if (loading) return <p className="text-center mt-10">Chargement...</p>;
  if (!offre) return <p className="text-center mt-10">Offre introuvable</p>;

  return (
    <>
      <Navbar />
      <section className="bg-gray-50 pt-32 pb-20 min-h-screen w-full">
        <div className="w-full px-4 md:px-10 flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">

            {/* LEFT */}
            <div className="lg:col-span-2 flex">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col w-full h-full">
                <div className="text-center px-6 py-6">
                  <p className="text-sm tracking-widest opacity-80 mb-2 uppercase">
                    Offre d'emploi
                  </p>
                  <h2 className="text-xl font-semibold uppercase tracking-wide">
                    {offre.title}
                  </h2>
                  <span className="mt-3 inline-block bg-red-100 text-[#9b0000] text-xs font-medium px-3 py-1 rounded-full">
                    {offre.typeContrat}
                  </span>
                </div>

                <div className="bg-gray-100 border-y border-gray-200 px-4 py-3 text-xl font-medium text-gray-600 text-center">
                  Détails de l'offre
                </div>

                <div className="px-5 py-5 divide-y divide-gray-100 flex-1">
                  {[
                    {
                      label: "Date de publication",
                      value: offre.dateExpiration
                        ? new Date(offre.dateExpiration).toLocaleDateString("fr-FR")
                        : "---",
                    },
                    {
                      label: "Expérience requise",
                      value: offre.experience ? `${offre.experience} ans` : "---",
                    },
                    { label: "Type de contrat", value: offre.typeContrat || "---" },
                    { label: "Salaire", value: offre.salary_range || "---" },
                    { label: "Ville", value: offre.location || "---" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-5 text-base">
                      <span className="text-gray-600 text-base font-medium">{item.label}</span>
                      <span className="font-semibold text-gray-900 text-base">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-3 flex flex-col gap-5 h-full">
              <div className="bg-white rounded-xl border border-gray-200 px-10 py-6 flex-1">
                <h3 className="text-xl font-semibold text-[#9b0000] border-b-2 border-[#9b0000] pb-2 mb-4">
                  Description du poste
                </h3>
                <p className="text-base text-black leading-loose whitespace-pre-line">
                  • {offre.description}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 flex-1">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center h-full py-10 text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Candidature envoyée !</h3>
                    <p className="text-gray-500 text-sm max-w-xs">
                      Votre candidature pour le poste de{" "}
                      <span className="font-semibold text-[#9b0000]">{offre.title}</span>{" "}
                      a bien été reçue. Nous vous contacterons prochainement.
                    </p>
                    <button
                      onClick={() => window.history.back()}
                      className="mt-4 px-6 py-2 border border-[#9b0000] text-[#9b0000] rounded-lg text-sm hover:bg-red-50 transition-colors"
                    >
                      ← Retour aux offres
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-base font-medium text-[#9b0000] border-b-2 border-[#9b0000] pb-2 mb-5">
                      Postuler à cette offre
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          placeholder="Nom *"
                          required
                          value={form.nom}
                          onChange={(e) => setForm({ ...form, nom: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-[#9b0000]"
                        />
                        <input
                          placeholder="Prénom *"
                          required
                          value={form.prenom}
                          onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-[#9b0000]"
                        />
                      </div>

                      <input
                        type="email"
                        placeholder="Adresse email *"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-[#9b0000]"
                      />

                      <input
                        type="tel"
                        placeholder="Numéro de téléphone *"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-[#9b0000]"
                      />

                      {/* CV avec validation */}
                      <div
                        onClick={() => fileRef.current?.click()}
                        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors bg-gray-50 ${
                          fileError || cvError
                            ? "border-red-600"
                            : fileName
                            ? "border-[#9b0000]"
                            : "border-gray-300 hover:border-[#9b0000]"
                        }`}
                      >
                        <p className={fileError || cvError ? "text-red-600" : "text-gray-500"}>
                          📎 {fileName ? "CV joint :" : "Cliquez pour joindre votre CV *"}
                        </p>
                        {fileName && (
                          <p className="text-xs text-[#9b0000] mt-1 font-medium">{fileName}</p>
                        )}
                        {/* Message d'erreur fichier */}
                        {fileError && (
                          <p className="text-xs text-red-600 mt-1 font-medium">{fileError}</p>
                        )}
                        {/* Message si CV manquant au submit */}
                        {cvError && !fileError && (
                          <p className="text-xs text-red-600 mt-1 font-medium">Veuillez joindre votre CV.</p>
                        )}
                        <input
                          type="file"
                          ref={fileRef}
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const allowed = [
                              'application/pdf',
                              'application/msword',
                              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            ];

                            if (!allowed.includes(file.type)) {
                              setFileError("Format non autorisé. PDF ou Word uniquement.");
                              setFileName(null);
                              e.target.value = '';
                              return;
                            }

                            if (file.size > 3 * 1024 * 1024) {
                              setFileError("Fichier trop volumineux. Maximum 3MB.");
                              setFileName(null);
                              e.target.value = '';
                              return;
                            }

                            setFileError(null);
                            setCvError(false);
                            setFileName(file.name);
                          }}
                        />
                      </div>

                      <textarea
                        placeholder="Message (optionnel)"
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-[#9b0000]"
                      />

                      <button
                        type="submit"
                        className="w-full py-3 bg-[#9b0000] hover:bg-[#7a0000] text-white font-medium rounded-lg transition-colors"
                      >
                        Envoyer ma candidature
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
