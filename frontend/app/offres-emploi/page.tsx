"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";
import {
  FaDesktop, FaBullhorn, FaBriefcase, FaUsers, FaHeartbeat,
  FaGraduationCap, FaTruck, FaShoppingCart, FaShieldAlt, FaBalanceScale,
} from "react-icons/fa";
import {
  FaDollarSign, FaHammer, FaIndustry, FaWrench, FaHeadphones,
  FaGlobe, FaBrain, FaPalette, FaUtensils,
} from "react-icons/fa6";

const API_URL = "http://localhost:5000";

type JobCategory = { icon: React.ElementType; label: string };

const categoryMap: Record<string, JobCategory> = {
  it:           { icon: FaDesktop,       label: "Informatique & IT" },
  marketing:    { icon: FaBullhorn,      label: "Marketing & Communication" },
  business:     { icon: FaBriefcase,     label: "Business & Management" },
  finance:      { icon: FaDollarSign,    label: "Finance & Comptabilité" },
  juridique:    { icon: FaBalanceScale,  label: "Juridique" },
  sante:        { icon: FaHeartbeat,     label: "Santé & Médical" },
  education:    { icon: FaGraduationCap, label: "Éducation & Formation" },
  btp:          { icon: FaHammer,        label: "BTP & Construction" },
  industrie:    { icon: FaIndustry,      label: "Industrie & Production" },
  logistique:   { icon: FaTruck,         label: "Logistique & Transport" },
  vente:        { icon: FaShoppingCart,  label: "Vente & Commerce" },
  rh:           { icon: FaUsers,         label: "Ressources Humaines" },
  design:       { icon: FaPalette,       label: "Design & Création" },
  hotellerie:   { icon: FaUtensils,      label: "Hôtellerie & Restauration" },
  services:     { icon: FaWrench,        label: "Services & Maintenance" },
  support:      { icon: FaHeadphones,    label: "Support Client" },
  freelance:    { icon: FaGlobe,         label: "Freelance & Remote" },
  ia:           { icon: FaBrain,         label: "IA & Data" },
  cybersecurity:{ icon: FaShieldAlt,     label: "Cybersécurité" },
  autre:        { icon: FaBriefcase,     label: "Autre" },
};

function getJobCategory(categorie?: string): JobCategory {
  return categoryMap[categorie?.toLowerCase() ?? ""] ?? categoryMap["autre"];
}

export default function CareersPage() {
  const [offres, setOffres]     = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [type, setType]         = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate]         = useState("");
  const [filtered, setFiltered] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const router = useRouter();

  const fetchOffres = async () => {
    try {
      setLoading(true);
      const res  = await fetch(`${API_URL}/offres`);
      const data = await res.json();
      setOffres(Array.isArray(data) ? data : []);
    } catch {
      setOffres([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOffres(); }, []);

  const handleSearch = () => {
    const result = offres.filter((offre) => {
      const matchSearch   = offre.title?.toLowerCase().includes(search.toLowerCase());
      const matchType     = type     ? offre.typeContrat === type     : true;
      const matchLocation = location ? offre.location   === location  : true;
      const matchDate     = date     ? offre.dateExpiration?.slice(0, 10) >= date : true;
      return matchSearch && matchType && matchLocation && matchDate;
    });
    setFiltered(result);
    setSearched(true);
  };

  const handleReset = () => {
    setSearch(""); setType(""); setLocation(""); setDate("");
    setSearched(false);
  };

  const handlePostuler = (offre: any) => {
    router.push(`/offres-emploi/${encodeURIComponent(offre.title)}?n=${offre.id}`);
  };

  const displayedJobs = searched ? filtered : offres;
  const locations     = [...new Set(offres.map((o) => o.location).filter(Boolean))];
  const types         = [...new Set(offres.map((o) => o.typeContrat).filter(Boolean))];

  const tagColors = [
    "bg-orange-100 text-orange-600 border-orange-200",
    "bg-amber-100 text-amber-600 border-amber-200",
    "bg-orange-50 text-orange-500 border-orange-200",
    "bg-yellow-100 text-yellow-600 border-yellow-200",
    "bg-amber-50 text-amber-500 border-amber-200",
    "bg-orange-100 text-orange-700 border-orange-300",
  ];

  return (
    <main className="">
      <Navbar />

      {/* ══════════════ HERO ══════════════ */}
      <section className="bg-gray-50 pt-32 pb-20 text-center border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6">
         
          <h1 className="text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
            Offres d'emploi
          </h1>
          <p className="text-gray-900 text-lg">
            Trouvez l'opportunité qui correspond à votre profil parmi nos{" "}
            <span className="text-red-600 font-semibold"></span> offres disponibles.
          </p>
        </div>
      </section>

      {/* ══════════════ CONTENU ══════════════ */}
      <section className="min-h-screen bg-gray-50 py-10 pb-32">
        <div className="max-w-7xl mx-auto px-6">

          {/* ── Barre de recherche ── */}
          <div className="bg-white p-6 rounded-2xl shadow-md mb-10 -mt-8 relative z-10">
            <div className="grid md:grid-cols-5 gap-4">
              <input
                type="text"
                placeholder="Rechercher un poste..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-300"
              />
              <select value={type} onChange={(e) => setType(e.target.value)} className="p-3 border rounded-xl outline-none">
                <option value="">Type de contrat</option>
                {types.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={location} onChange={(e) => setLocation(e.target.value)} className="p-3 border rounded-xl outline-none">
                <option value="">Localisation</option>
                {locations.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="p-3 border rounded-xl outline-none"
              />
              <div className="flex gap-2">
                <button onClick={handleSearch} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition">
                  🔍 Rechercher
                </button>
                {searched && (
                  <button onClick={handleReset} className="px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition">
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {searched && (
            <p className="text-gray-500 mb-6 text-sm">{filtered.length} offre(s) trouvée(s)</p>
          )}

          {/* ── Grille ── */}
          {loading ? (
            <p className="text-center text-gray-500">Chargement...</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {displayedJobs.length > 0 ? displayedJobs.map((offre) => {

                const competences: string[] = offre.requirements
                  ? offre.requirements.split(/[,\s]+/).map((c: string) => c.trim()).filter(Boolean)
                  : [];

                const { icon: CatIcon } = getJobCategory(offre.categorie);

                return (
                  <div
                    key={offre.id}
                    className="bg-white p-6 rounded-3xl shadow hover:shadow-lg transition flex flex-col justify-between border border-gray-200 h-full"
                  >

{/* ══ EN-TÊTE ══ */}
{/* ══ EN-TÊTE ══ */}
<div className="mb-8 pb-5 border-b border-gray-100">

  {/* Icône centrée en haut */}
  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
    <CatIcon size={29} className="text-red-800" />
  </div>

  {/* Titre centré en dessous */}
  <h3 className="text-[21px] font-bold text-red-900 leading-snug line-clamp-2 text-center">
    {offre.title}
  </h3>

</div>

                    {/* ══ COMPÉTENCES ══ */}
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                      {competences.map((comp: string, i: number) => (
                        <span
                          key={i}
                          className={`border text-[12px] px-3 py-1 rounded-full font-semibold ${tagColors[i % tagColors.length]}`}
                        >
                          {comp}
                        </span>
                      ))}
                    </div>

                    <div className="flex-1" />

                    {/* ══ CARACTÉRISTIQUES ══ */}
                    <div className="flex flex-wrap justify-center gap-2 mt-4 mb-5">
                      <span className="border border-gray-200 bg-gray-50 text-gray-600 text-[11px] px-3 py-1.5 rounded-full">
                        💰 {offre.salary_range || "—"}
                      </span>
                      <span className="border border-gray-200 bg-gray-50 text-gray-600 text-[11px] px-3 py-1.5 rounded-full">
                        🎓 {offre.experience ? `${offre.experience} ans` : "—"}
                      </span>
                      {offre.location && (
                        <span className="border border-gray-200 bg-gray-50 text-gray-600 text-[11px] px-3 py-1.5 rounded-full">
                          📍 {offre.location}
                        </span>
                      )}
                      {offre.typeContrat && (
                        <span className="border border-gray-200 bg-gray-50 text-gray-600 text-[11px] px-3 py-1.5 rounded-full">
                          📝 {offre.typeContrat}
                        </span>
                      )}
                      {offre.dateExpiration && (
                        <span className="border border-gray-200 bg-gray-50 text-gray-600 text-[11px] px-3 py-1.5 rounded-full">
                          ⏳ {offre.dateExpiration?.slice(0, 10)}
                        </span>
                      )}
                    </div>

                    {/* ══ BOUTON ══ */}
                    <button
                      onClick={() => handlePostuler(offre)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition mt-2"
                    >
                      Postuler
                    </button>

                  </div>
                );
              }) : (
                <p className="text-center col-span-3 text-gray-500">Aucune offre trouvée</p>
              )}
            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}