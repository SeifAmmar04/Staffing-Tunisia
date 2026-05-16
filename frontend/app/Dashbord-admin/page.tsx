"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaTachometerAlt, FaUsers, FaBriefcase, FaClipboardList,
  FaSignOutAlt, FaTrash, FaEdit, FaPlus, FaTimes,
  FaEye, FaSearch, FaFileAlt, FaMapMarkerAlt,
  FaEnvelope, FaPhone, FaCalendarAlt, FaBuilding, FaInbox,
  FaDesktop, FaBullhorn, FaGraduationCap,
  FaTruck, FaHeartbeat, FaShoppingCart, FaShieldAlt, FaBalanceScale,
  FaCommentAlt, FaChevronLeft,
} from "react-icons/fa";
import {
  FaDollarSign, FaHammer, FaIndustry, FaWrench,
  FaHeadphones, FaGlobe, FaBrain, FaPalette, FaUtensils,
} from "react-icons/fa6";

const API_URL = "http://localhost:5000";

// ─── Types ───────────────────────────────────────────────────────────────────
type Candidat = {
  id: number; firstName: string; lastName: string;
  email: string; phone?: string; role: string; createdAt?: string;
};
type Candidature = {
  id: number; job_id: number; applicant_id?: number;
  first_name: string; last_name: string; email: string;
  phone?: string; resume_path?: string; createdAt: string;
  job_title?: string; status?: string; message?: string;
  score?: number;
  score_resume?: string;
};
type Offre = {
  id: number; title: string; description: string;
  requirements?: string; typeContrat: string; location?: string;
  experience?: number; salary_range?: string; dateExpiration?: string; categorie?: string;
};
type Contact = {
  id: number; societe?: string; nomComplet: string; email: string;
  telephone?: string; services?: string[] | string; message: string; createdAt: string;
};

// ─── Catégories ──────────────────────────────────────────────────────────────
type JobCategory = { icon: React.ElementType; color: string; label: string };
const categoryMap: Record<string, JobCategory> = {
  it:           { icon: FaDesktop,       color: "#6366f1", label: "Informatique & IT" },
  marketing:    { icon: FaBullhorn,      color: "#ec4899", label: "Marketing & Communication" },
  business:     { icon: FaBriefcase,     color: "#3b82f6", label: "Business & Management" },
  finance:      { icon: FaDollarSign,    color: "#f59e0b", label: "Finance & Comptabilité" },
  juridique:    { icon: FaBalanceScale,  color: "#64748b", label: "Juridique" },
  sante:        { icon: FaHeartbeat,     color: "#ef4444", label: "Santé & Médical" },
  education:    { icon: FaGraduationCap, color: "#8b5cf6", label: "Éducation & Formation" },
  btp:          { icon: FaHammer,        color: "#a16207", label: "BTP & Construction" },
  industrie:    { icon: FaIndustry,      color: "#6b7280", label: "Industrie & Production" },
  logistique:   { icon: FaTruck,         color: "#f97316", label: "Logistique & Transport" },
  vente:        { icon: FaShoppingCart,  color: "#10b981", label: "Vente & Commerce" },
  rh:           { icon: FaUsers,         color: "#14b8a6", label: "Ressources Humaines" },
  design:       { icon: FaPalette,       color: "#f43f5e", label: "Design & Création" },
  hotellerie:   { icon: FaUtensils,      color: "#f59e0b", label: "Hôtellerie & Restauration" },
  services:     { icon: FaWrench,        color: "#64748b", label: "Services & Maintenance" },
  support:      { icon: FaHeadphones,    color: "#0ea5e9", label: "Support Client" },
  freelance:    { icon: FaGlobe,         color: "#22c55e", label: "Freelance & Remote" },
  ia:           { icon: FaBrain,         color: "#8b5cf6", label: "IA & Data" },
  cybersecurity:{ icon: FaShieldAlt,     color: "#111827", label: "Cybersécurité" },
  autre:        { icon: FaBriefcase,     color: "#3b82f6", label: "Autre" },
};
const categorieOptions = Object.entries(categoryMap).map(([value, { label }]) => ({ value, label }));
function getJobCategory(categorie?: string): JobCategory {
  return categoryMap[categorie?.toLowerCase() ?? ""] ?? categoryMap["autre"];
}

// ─── Utilitaires ─────────────────────────────────────────────────────────────
function parseServices(s?: string[] | string): string[] {
  if (!s) return [];
  if (Array.isArray(s)) return s;
  try { return JSON.parse(s); } catch { return [s as string]; }
}
function buildCvUrl(resumePath?: string): string {
  if (!resumePath) return "";
  return `${API_URL}/${resumePath.replace(/\\/g, "/")}`;
}

// ─── Score Badge ──────────────────────────────────────────────────────────────
function ScoreBadge({ score }: { score?: number }) {
  if (score === undefined || score === null) {
    return (
      <span className="text-xs px-2.5 py-1 rounded-full  text-gray-400 font-semibold">
        — Non scoré
      </span>
    );
  }
  if (score >= 9) return (
    <span className="text-xs px-2.5 py-1 rounded-full text-black-700 font-bold">
      🟢⭐{score}/10
    </span>
  );
  if (score >= 7) return (
    <span className="text-xs px-2.5 py-1 rounded-full  text-black-400 font-bold">
      🟢{score}/10
    </span>
  );
  if (score >= 4) return (
    <span className="text-xs px-2.5 py-1 rounded-full  text-black-700 font-bold">
      🟡 {score}/10
    </span>
  );
  return (
    <span className="text-xs px-2.5 py-1 rounded-full  text-black-700 font-bold">
      🔴 {score}/10
    </span>
  );
}

// ─── Composants utilitaires ───────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition">
            <FaTimes />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const map: Record<string, string> = {
    PENDING:  "bg-yellow-100 text-yellow-700",
    ACCEPTED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  };
  const label: Record<string, string> = {
    PENDING:  "En attente",
    ACCEPTED: "Acceptée",
    REJECTED: "Refusée",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${map[status ?? ""] || "bg-gray-100 text-gray-500"}`}>
      {label[status ?? ""] || "Envoyée"}
    </span>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
      <div className="w-8 h-8 bg-[#9b0000]/10 text-[#9b0000] rounded-lg flex items-center justify-center text-xs flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder = "", as = "input" }: any) {
  const cls = "w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:border-[#9b0000]";
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1 font-medium">{label}</label>
      {as === "textarea"
        ? <textarea value={value} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)} placeholder={placeholder} rows={3} className={cls} />
        : <input type={type} value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} placeholder={placeholder} className={cls} />}
    </div>
  );
}

// ─── Carte candidature ────────────────────────────────────────────────────────
function CandidatureCard({
  c, onView, onDelete, onUpdateStatus,
}: {
  c: Candidature;
  onView: () => void;
  onDelete: () => void;
  onUpdateStatus: (id: number, status: string) => void;
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border transition hover:shadow-md ${
      !c.status || c.status === "PENDING" ? "border-yellow-200" : "border-gray-100"
    }`}>
      {(!c.status || c.status === "PENDING") && (
        <div className="px-5 pt-3 pb-0">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-yellow-700 bg-yellow-50 px-2.5 py-1 rounded-full border border-yellow-100">
            ⏳ En attente de traitement
          </span>
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {c.first_name?.[0]}{c.last_name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800">{c.first_name} {c.last_name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{c.email}{c.phone && ` · ${c.phone}`}</p>
              <p className="text-xs text-gray-300 mt-0.5">
                <FaCalendarAlt className="inline mr-1" />
                {new Date(c.createdAt).toLocaleDateString("fr-FR")}
              </p>
              {c.message && (
                <div className="mt-2 flex items-start gap-1.5 bg-gray-50 rounded-lg px-2.5 py-2 border border-gray-100">
                  <FaCommentAlt className="text-[#9b0000] mt-0.5 flex-shrink-0 text-xs" />
                  <p className="text-xs text-gray-600 italic line-clamp-2">"{c.message}"</p>
                </div>
              )}
              {/* Score IA */}
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <ScoreBadge score={c.score} />
                {c.score_resume && (
                  <p className="text-xs text-gray-400 italic line-clamp-1">🤖 {c.score_resume}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={c.status} />
            <div className="flex gap-1">
              <button onClick={onView}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:bg-blue-50 hover:text-blue-500 transition text-xs" title="Voir détail">
                <FaEye />
              </button>
              <button onClick={onDelete}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 transition text-xs" title="Supprimer">
                <FaTrash />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50 flex-wrap">
          <span className="text-xs text-gray-400 font-medium">Statut :</span>
          {[
            { val: "PENDING",  label: "⏳ En attente", cls: "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-100" },
            { val: "ACCEPTED", label: "✓ Accepter",    cls: "bg-green-50 text-green-700 hover:bg-green-100 border-green-100" },
            { val: "REJECTED", label: "✕ Refuser",     cls: "bg-red-50 text-red-700 hover:bg-red-100 border-red-100" },
          ].map(s => (
            <button key={s.val} onClick={() => onUpdateStatus(c.id, s.val)}
              disabled={c.status === s.val}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition disabled:opacity-40 disabled:cursor-not-allowed ${s.cls}`}>
              {s.label}
            </button>
          ))}
          {c.resume_path ? (
            <a href={buildCvUrl(c.resume_path)} target="_blank" rel="noreferrer"
              className="ml-auto flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-[#9b0000] bg-red-50 hover:bg-red-100 font-medium transition">
              <FaFileAlt /> Voir CV
            </a>
          ) : (
            <span className="ml-auto text-xs text-gray-300 flex items-center gap-1">
              <FaFileAlt /> Pas de CV
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function DashboardAdmin() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [offres, setOffres] = useState<Offre[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchCandidats, setSearchCandidats] = useState("");
  const [searchCandidatures, setSearchCandidatures] = useState("");
  const [searchOffres, setSearchOffres] = useState("");
  const [searchContacts, setSearchContacts] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [selectedOffreId, setSelectedOffreId] = useState<number | null>(null);

  const [modalOffre, setModalOffre] = useState<Offre | null | "new">(null);
  const [modalCandidature, setModalCandidature] = useState<Candidature | null>(null);
  const [modalCandidat, setModalCandidat] = useState<Candidat | null>(null);
  const [modalContact, setModalContact] = useState<Contact | null>(null);

  const emptyOffre = {
    title: "", description: "", requirements: "", typeContrat: "CDI",
    location: "", experience: 0, salary_range: "", dateExpiration: "", categorie: "autre",
  };
  const [offreForm, setOffreForm] = useState<any>(emptyOffre);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { router.push("/auth/login"); return; }
    const parsed = JSON.parse(stored);
    if (parsed.role !== "ADMIN") { router.push("/auth/login"); return; }
    setAdmin(parsed);
  }, []);

  useEffect(() => { if (admin) fetchAll(); }, [admin]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [u, a, o, c] = await Promise.all([
        fetch(`${API_URL}/users`).then(r => r.json()).catch(() => []),
        fetch(`${API_URL}/applications`).then(r => r.json()).catch(() => []),
        fetch(`${API_URL}/offres`).then(r => r.json()).catch(() => []),
        fetch(`${API_URL}/contact`).then(r => r.json()).catch(() => []),
      ]);
      setCandidats(Array.isArray(u) ? u.filter((x: any) => x.role === "CANDIDATE") : []);
      setCandidatures(Array.isArray(a) ? a : []);
      setOffres(Array.isArray(o) ? o : []);
      setContacts(Array.isArray(c) ? c : []);
    } finally { setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

const deleteCandidat = async (id: number) => {
  if (!confirm("Supprimer ce candidat ?")) return;
  
  try {
    const res = await fetch(`${API_URL}/users/${id}`, { method: "DELETE" });
    
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(`Erreur : ${err.message || "Impossible de supprimer ce candidat"}`);
      return;
    }

    setCandidats(p => p.filter(c => c.id !== id));
    setCandidatures(p => p.filter(c => String(c.applicant_id) !== String(id)));
    setModalCandidat(null);

  } catch (error) {
    alert("Erreur réseau, veuillez réessayer.");
    console.error(error);
  }
};

  const updateStatus = async (id: number, status: string) => {
    await fetch(`${API_URL}/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setCandidatures(p => p.map(c => c.id === id ? { ...c, status } : c));
    setModalCandidature(p => p?.id === id ? { ...p, status } : p);
  };

  const deleteCandidature = async (id: number) => {
    if (!confirm("Supprimer cette candidature ?")) return;
    await fetch(`${API_URL}/applications/${id}`, { method: "DELETE" });
    setCandidatures(p => p.filter(c => c.id !== id));
    setModalCandidature(null);
  };

  const saveOffre = async () => {
    if (modalOffre === "new") {
      const res = await fetch(`${API_URL}/offres`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offreForm),
      });
      const created = await res.json();
      setOffres(p => [created, ...p]);
    } else {
      const id = (modalOffre as Offre).id;
      await fetch(`${API_URL}/offres/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offreForm),
      });
      setOffres(p => p.map(o => o.id === id ? { ...o, ...offreForm } : o));
    }
    setModalOffre(null);
  };

  const deleteOffre = async (id: number) => {
    if (!confirm("Supprimer cette offre ?")) return;
    await fetch(`${API_URL}/offres/${id}`, { method: "DELETE" });
    setOffres(p => p.filter(o => o.id !== id));
    setCandidatures(p => p.filter(c => c.job_id !== id));
  };

  const deleteContact = async (id: number) => {
    if (!confirm("Supprimer ce message ?")) return;
    await fetch(`${API_URL}/contact/${id}`, { method: "DELETE" });
    setContacts(p => p.filter(c => c.id !== id));
    setModalContact(null);
  };

  // ─── Filtres ──────────────────────────────────────────────────────────────
  const fCandidats = candidats.filter(c =>
    `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(searchCandidats.toLowerCase())
  );
  const fOffres = offres.filter(o =>
    `${o.title} ${o.location} ${o.typeContrat}`.toLowerCase().includes(searchOffres.toLowerCase())
  );
  const fContacts = contacts.filter(c =>
    `${c.nomComplet} ${c.email} ${c.societe}`.toLowerCase().includes(searchContacts.toLowerCase())
  );

  const stats = {
    candidats: candidats.length,
    candidatures: candidatures.length,
    offres: offres.length,
    contacts: contacts.length,
    pending:  candidatures.filter(c => !c.status || c.status === "PENDING").length,
    accepted: candidatures.filter(c => c.status === "ACCEPTED").length,
    rejected: candidatures.filter(c => c.status === "REJECTED").length,
  };

  const menuItems = [
    { id: "dashboard",    label: "Tableau de bord",  icon: <FaTachometerAlt /> },
    { id: "candidats",    label: "Candidats",         icon: <FaUsers />,         count: stats.candidats },
    { id: "candidatures", label: "Candidatures",      icon: <FaClipboardList />, count: stats.candidatures },
    { id: "offres",       label: "Offres d'emploi",   icon: <FaBriefcase />,     count: stats.offres },
    { id: "contacts",     label: "Formulaires reçus", icon: <FaInbox />,         count: stats.contacts },
  ];

  if (!admin) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-[#9b0000] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // ─── Rendu section candidatures ───────────────────────────────────────────
  const renderCandidatures = () => {
    const grouped = offres
      .map(o => ({
        offre: o,
        items: candidatures.filter(c => c.job_id === o.id),
      }))
      .filter(g => g.items.length > 0);

    const orphelines = candidatures.filter(c => !offres.find(o => o.id === c.job_id));

    if (selectedOffreId !== null) {
      const isOrphan = selectedOffreId === -1;
      const group = grouped.find(g => g.offre.id === selectedOffreId);
      const allItems = isOrphan ? orphelines : (group?.items ?? []);
      const offreTitle = isOrphan ? "Offres supprimées" : (group?.offre.title ?? "");

      const filtered = allItems.filter(c => {
        const txt = `${c.first_name} ${c.last_name} ${c.email}`.toLowerCase()
          .includes(searchCandidatures.toLowerCase());
        const st = filterStatus === "ALL" || c.status === filterStatus ||
          (!c.status && filterStatus === "PENDING");
        return txt && st;
      });

      // Tri par score décroissant, puis PENDING en premier
      const sorted = [...filtered].sort((a, b) => {
        const scoreA = a.score ?? -1;
        const scoreB = b.score ?? -1;
        if (scoreB !== scoreA) return scoreB - scoreA;
        const aP = !a.status || a.status === "PENDING" ? 0 : 1;
        const bP = !b.status || b.status === "PENDING" ? 0 : 1;
        return aP - bP;
      });

      return (
        <div className="space-y-6 animate-fadein">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedOffreId(null);
                setSearchCandidatures("");
                setFilterStatus("ALL");
              }}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-500 transition"
            >
              <FaChevronLeft className="text-xs" />
            </button>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Candidatures pour</p>
              <h1 className="text-2xl font-bold text-gray-900">{offreTitle}</h1>
            </div>
            <span className="ml-auto text-sm text-gray-400 bg-white border border-gray-100 px-3 py-1.5 rounded-xl">
              {filtered.length} candidature{filtered.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
              <input value={searchCandidatures} onChange={e => setSearchCandidatures(e.target.value)}
                placeholder="Rechercher un candidat..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:border-[#9b0000]" />
            </div>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none text-gray-600">
              <option value="ALL">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="ACCEPTED">Acceptées</option>
              <option value="REJECTED">Refusées</option>
            </select>
          </div>

          {sorted.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
              <FaClipboardList className="text-5xl text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Aucune candidature trouvée</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sorted.map(c => (
                <CandidatureCard
                  key={c.id}
                  c={c}
                  onView={() => setModalCandidature(c)}
                  onDelete={() => deleteCandidature(c.id)}
                  onUpdateStatus={updateStatus}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-fadein">
        <div>
          <p className="text-sm text-gray-400 font-medium uppercase tracking-widest mb-1">Gestion</p>
          <h1 className="text-3xl font-bold text-gray-900">
            Candidatures <span className="text-gray-300 text-xl font-normal">({candidatures.length})</span>
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Chargement...</div>
        ) : grouped.length === 0 && orphelines.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
            <FaClipboardList className="text-5xl text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Aucune candidature reçue</p>
          </div>
        ) : (
          <div className="space-y-3">
            {grouped.map(({ offre, items }) => {
              const { icon: CatIcon, color: catColor } = getJobCategory(offre.categorie);
              const pendingCount  = items.filter(c => !c.status || c.status === "PENDING").length;
              const acceptedCount = items.filter(c => c.status === "ACCEPTED").length;
              const rejectedCount = items.filter(c => c.status === "REJECTED").length;

              return (
                <button key={offre.id} onClick={() => setSelectedOffreId(offre.id)}
                  className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-[#9b0000]/20 transition text-left group">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: catColor + "18" }}>
                        <CatIcon size={20} style={{ color: catColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 group-hover:text-[#9b0000] transition truncate">
                          {offre.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-[#9b0000]" />
                            {offre.location || "Tunisie"}
                          </span>
                          <span className="text-gray-200">·</span>
                          <span>{offre.typeContrat}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="hidden md:flex items-center gap-1.5">
                        {pendingCount > 0 && (
                          <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-100 px-2 py-0.5 rounded-full font-semibold">
                            ⏳ {pendingCount}
                          </span>
                        )}
                        {acceptedCount > 0 && (
                          <span className="text-xs bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full font-semibold">
                            ✓ {acceptedCount}
                          </span>
                        )}
                        {rejectedCount > 0 && (
                          <span className="text-xs bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded-full font-semibold">
                            ✕ {rejectedCount}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">{items.length}</span>
                        <span className="text-xs text-gray-400">candidature{items.length > 1 ? "s" : ""}</span>
                        <span className="text-gray-300 text-sm group-hover:text-[#9b0000] transition ml-1">→</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}

            {orphelines.length > 0 && (
              <button onClick={() => setSelectedOffreId(-1)}
                className="w-full bg-white rounded-2xl shadow-sm border border-dashed border-gray-200 p-5 hover:shadow-md transition text-left group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <FaClipboardList className="text-gray-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-500">Offres supprimées</p>
                      <p className="text-xs text-gray-400 mt-0.5">Candidatures sans offre associée</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-500">{orphelines.length}</span>
                    <span className="text-xs text-gray-400">candidature{orphelines.length > 1 ? "s" : ""}</span>
                    <span className="text-gray-300 text-sm ml-1">→</span>
                  </div>
                </div>
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {

      case "dashboard": return (
        <div className="space-y-8 animate-fadein">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-widest mb-1">Administration</p>
              <h1 className="text-3xl font-bold text-gray-900">Tableau de bord 👑</h1>
            </div>
            <p className="text-sm text-gray-400">
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Candidats inscrits",   value: stats.candidats,    icon: <FaUsers />,         color: "from-[#9b0000] to-[#c0392b]",  section: "candidats" },
              { label: "Candidatures",          value: stats.candidatures, icon: <FaClipboardList />, color: "from-gray-700 to-gray-900",     section: "candidatures" },
              { label: "Offres publiées",        value: stats.offres,       icon: <FaBriefcase />,     color: "from-[#1d4ed8] to-[#1e40af]",  section: "offres" },
              { label: "Messages entreprises",  value: stats.contacts,     icon: <FaInbox />,         color: "from-[#065f46] to-[#047857]",  section: "contacts" },
            ].map(s => (
              <button key={s.label} onClick={() => { setActiveSection(s.section); setSelectedOffreId(null); }}
                className={`bg-gradient-to-br ${s.color} text-white rounded-2xl p-5 flex items-center justify-between shadow-lg hover:opacity-90 transition text-left`}>
                <div>
                  <p className="text-3xl font-bold">{s.value}</p>
                  <p className="text-xs opacity-75 mt-1 leading-tight">{s.label}</p>
                </div>
                <div className="text-3xl opacity-20">{s.icon}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "En attente", value: stats.pending,  cls: "bg-yellow-50 text-yellow-700 border-yellow-100" },
              { label: "Acceptées",  value: stats.accepted, cls: "bg-green-50 text-green-700 border-green-100" },
              { label: "Refusées",   value: stats.rejected, cls: "bg-red-50 text-red-700 border-red-100" },
            ].map(s => (
              <div key={s.label} className={`rounded-2xl border p-5 text-center ${s.cls}`}>
                <p className="text-3xl font-bold">{s.value}</p>
                <p className="text-sm font-medium mt-1 opacity-75">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800 text-sm">Dernières candidatures</h2>
                <button onClick={() => { setActiveSection("candidatures"); setSelectedOffreId(null); }}
                  className="text-xs text-[#9b0000] hover:underline">Voir tout →</button>
              </div>
              <div className="divide-y divide-gray-50">
                {candidatures.slice(0, 5).map(c => (
                  <div key={c.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{c.first_name} {c.last_name}</p>
                      <p className="text-xs text-gray-400">{c.job_title || "Offre #" + c.job_id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ScoreBadge score={c.score} />
                      <StatusBadge status={c.status} />
                      <button onClick={() => setModalCandidature(c)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-600 transition text-xs">
                        <FaEye />
                      </button>
                    </div>
                  </div>
                ))}
                {candidatures.length === 0 && <p className="px-5 py-8 text-center text-gray-400 text-sm">Aucune candidature</p>}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800 text-sm">Derniers messages entreprises</h2>
                <button onClick={() => setActiveSection("contacts")} className="text-xs text-[#9b0000] hover:underline">Voir tout →</button>
              </div>
              <div className="divide-y divide-gray-50">
                {contacts.slice(0, 5).map(c => (
                  <div key={c.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{c.nomComplet}</p>
                      <p className="text-xs text-gray-400">{c.societe || c.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString("fr-FR")}</span>
                      <button onClick={() => setModalContact(c)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-600 transition text-xs">
                        <FaEye />
                      </button>
                    </div>
                  </div>
                ))}
                {contacts.length === 0 && <p className="px-5 py-8 text-center text-gray-400 text-sm">Aucun message reçu</p>}
              </div>
            </div>
          </div>
        </div>
      );

      case "candidats": return (
        <div className="space-y-6 animate-fadein">
          <div>
            <p className="text-sm text-gray-400 font-medium uppercase tracking-widest mb-1">Gestion</p>
            <h1 className="text-3xl font-bold text-gray-900">Candidats <span className="text-gray-300 text-xl font-normal">({fCandidats.length})</span></h1>
          </div>
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
            <input value={searchCandidats} onChange={e => setSearchCandidats(e.target.value)}
              placeholder="Rechercher par nom, prénom, email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:border-[#9b0000]" />
          </div>
          {loading ? (
            <div className="text-center py-16 text-gray-400 text-sm">Chargement...</div>
          ) : fCandidats.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
              <FaUsers className="text-5xl text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Aucun candidat inscrit</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Candidat</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Email</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Téléphone</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Candidatures</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden xl:table-cell">Inscrit le</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {fCandidats.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#9b0000] to-[#c0392b] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {c.firstName?.[0]?.toUpperCase()}{c.lastName?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{c.firstName} {c.lastName}</p>
                            <p className="text-xs text-gray-400 md:hidden">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500 hidden md:table-cell">{c.email}</td>
                      <td className="px-5 py-4 text-gray-500 hidden lg:table-cell">{c.phone || "—"}</td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-xs bg-[#9b0000]/10 text-[#9b0000] px-2.5 py-1 rounded-full font-semibold">
                          {candidatures.filter(a => String(a.applicant_id) === String(c.id)).length}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs hidden xl:table-cell">
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString("fr-FR") : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setModalCandidat(c)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:bg-blue-50 hover:text-blue-500 transition">
                            <FaEye className="text-xs" />
                          </button>
                          <button onClick={() => deleteCandidat(c.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 transition">
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );

      case "candidatures": return renderCandidatures();

      case "offres": return (
        <div className="space-y-6 animate-fadein">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-widest mb-1">Gestion</p>
              <h1 className="text-3xl font-bold text-gray-900">Offres d'emploi <span className="text-gray-300 text-xl font-normal">({fOffres.length})</span></h1>
            </div>
            <button onClick={() => { setOffreForm(emptyOffre); setModalOffre("new"); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#9b0000] text-white rounded-xl text-sm font-medium hover:bg-[#7a0000] transition">
              <FaPlus /> Nouvelle offre
            </button>
          </div>
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
            <input value={searchOffres} onChange={e => setSearchOffres(e.target.value)}
              placeholder="Rechercher une offre..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:border-[#9b0000]" />
          </div>
          {loading ? (
            <div className="text-center py-16 text-gray-400 text-sm">Chargement...</div>
          ) : fOffres.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
              <FaBriefcase className="text-5xl text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm mb-4">Aucune offre publiée</p>
              <button onClick={() => { setOffreForm(emptyOffre); setModalOffre("new"); }}
                className="px-4 py-2 bg-[#9b0000] text-white rounded-xl text-sm hover:bg-[#7a0000] transition">
                Créer la première offre →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fOffres.map(o => {
                const { icon: CatIcon, color: catColor } = getJobCategory(o.categorie);
                return (
                  <div key={o.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: catColor + "18" }}>
                          <CatIcon size={18} style={{ color: catColor }} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{o.title}</h3>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <FaMapMarkerAlt className="text-[#9b0000]" />{o.location || "Tunisie"}
                          </p>
                        </div>
                      </div>
                      <span className="bg-red-100 text-[#9b0000] text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0">{o.typeContrat}</span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">{o.description}</p>
                    {o.requirements && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-400 mb-1 font-medium">Compétences :</p>
                        <p className="text-xs text-gray-600 line-clamp-1">{o.requirements}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <span className="text-xs text-gray-400">
                        <FaClipboardList className="inline mr-1 text-[#9b0000]" />
                        {candidatures.filter(c => c.job_id === o.id).length} candidature(s)
                      </span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setOffreForm({ ...o }); setModalOffre(o); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition">
                          <FaEdit /> Modifier
                        </button>
                        <button onClick={() => deleteOffre(o.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 transition">
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );

      case "contacts": return (
        <div className="space-y-6 animate-fadein">
          <div>
            <p className="text-sm text-gray-400 font-medium uppercase tracking-widest mb-1">Entreprises</p>
            <h1 className="text-3xl font-bold text-gray-900">Formulaires reçus <span className="text-gray-300 text-xl font-normal">({fContacts.length})</span></h1>
          </div>
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
            <input value={searchContacts} onChange={e => setSearchContacts(e.target.value)}
              placeholder="Rechercher par nom, société, email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:border-[#9b0000]" />
          </div>
          {loading ? (
            <div className="text-center py-16 text-gray-400 text-sm">Chargement...</div>
          ) : fContacts.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
              <FaInbox className="text-5xl text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Aucun formulaire reçu</p>
            </div>
          ) : (
            <div className="space-y-3">
              {fContacts.map(c => (
                <div key={c.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#065f46] to-[#047857] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {c.nomComplet?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800">{c.nomComplet}</p>
                        {c.societe && (
                          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                            <FaBuilding className="text-[#9b0000]" />{c.societe}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-0.5">{c.email}{c.telephone && ` · ${c.telephone}`}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {parseServices(c.services).map(s => (
                            <span key={s} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">{s}</span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-1 mt-1 italic">"{c.message}"</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString("fr-FR")}</span>
                      <div className="flex gap-1">
                        <button onClick={() => setModalContact(c)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:bg-blue-50 hover:text-blue-500 transition text-xs">
                          <FaEye />
                        </button>
                        <button onClick={() => deleteContact(c.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 transition text-xs">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );

      default: return null;
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadein { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
        .animate-fadein { animation: fadein 0.3s ease }
      `}</style>

      <div className="min-h-screen bg-[#f5f5f0] flex font-sans">
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between py-8 px-4 sticky top-0 h-screen overflow-y-auto">
          <div className="space-y-1">
            <div className="flex justify-center mb-8 px-2">
              <Image src="/logo.png" alt="Logo" width={140} height={45} />
            </div>
            <div className="flex flex-col items-center mb-6 py-4 px-3 bg-gray-50 rounded-2xl">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#9b0000] to-[#c0392b] flex items-center justify-center text-white text-xl font-bold shadow-md">👑</div>
              <p className="mt-3 font-semibold text-gray-800 text-sm">{admin.firstName} {admin.lastName}</p>
              <span className="mt-1 text-xs text-white font-medium bg-[#9b0000] px-3 py-0.5 rounded-full">Administrateur</span>
            </div>
            {menuItems.map(item => (
              <button key={item.id}
                onClick={() => { setActiveSection(item.id); setSelectedOffreId(null); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  activeSection === item.id
                    ? "bg-[#9b0000] text-white shadow-md shadow-red-200"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                }`}>
                <span className="text-base">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.count !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    activeSection === item.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}>{item.count}</span>
                )}
              </button>
            ))}
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all text-sm font-medium">
            <FaSignOutAlt /> Déconnexion
          </button>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">{renderContent()}</div>
        </main>
      </div>

      {/* ═══ MODAL CANDIDATURE ═══════════════════════════════════════════════ */}
      {modalCandidature && (
        <Modal title="Détail candidature" onClose={() => setModalCandidature(null)}>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9b0000] to-[#c0392b] flex items-center justify-center text-white font-bold">
                {modalCandidature.first_name?.[0]}{modalCandidature.last_name?.[0]}
              </div>
              <div>
                <p className="font-bold text-gray-900">{modalCandidature.first_name} {modalCandidature.last_name}</p>
                <StatusBadge status={modalCandidature.status} />
              </div>
            </div>
            <InfoRow icon={<FaEnvelope />}    label="Email"     value={modalCandidature.email} />
            <InfoRow icon={<FaPhone />}        label="Téléphone" value={modalCandidature.phone || "—"} />
            <InfoRow icon={<FaBriefcase />}    label="Poste"     value={modalCandidature.job_title || "Offre #" + modalCandidature.job_id} />
            <InfoRow icon={<FaCalendarAlt />}  label="Date"      value={new Date(modalCandidature.createdAt).toLocaleDateString("fr-FR")} />

            {/* Score IA */}
            {modalCandidature.score !== undefined && modalCandidature.score !== null && (
              <div className="p-3  rounded-xl border border-purple-100">
                <p className="text-xs text-purple-400 mb-2 font-medium flex items-center gap-1">
                  🤖 Score IA
                </p>
                <div className="flex items-center gap-3">
                  <ScoreBadge score={modalCandidature.score} />
                  {modalCandidature.score_resume && (
                    <p className="text-xs text-gray-600 italic flex-1">
                      {modalCandidature.score_resume}
                    </p>
                  )}
                </div>
              </div>
            )}

            {modalCandidature.message && (
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-400 mb-1 font-medium flex items-center gap-1">
                  <FaCommentAlt /> Message du candidat
                </p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line italic">
                  "{modalCandidature.message}"
                </p>
              </div>
            )}

            {modalCandidature.resume_path ? (
              <a href={buildCvUrl(modalCandidature.resume_path)} target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#9b0000] text-white rounded-xl text-sm font-medium hover:bg-[#7a0000] transition">
                <FaFileAlt /> Voir le CV →
              </a>
            ) : (
              <div className="flex items-center gap-2 w-full px-4 py-3 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-sm text-gray-400">
                <FaFileAlt /> Aucun CV joint
              </div>
            )}

            <div>
              <p className="text-xs text-gray-400 font-medium mb-2">Changer le statut</p>
              <div className="flex gap-2">
                {[
                  { val: "PENDING",  label: "⏳ Attente", cls: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100" },
                  { val: "ACCEPTED", label: "✓ Accepter", cls: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" },
                  { val: "REJECTED", label: "✕ Refuser",  cls: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100" },
                ].map(s => (
                  <button key={s.val} onClick={() => updateStatus(modalCandidature.id, s.val)}
                    disabled={modalCandidature.status === s.val}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition disabled:opacity-40 disabled:cursor-not-allowed ${s.cls}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => deleteCandidature(modalCandidature.id)}
              className="w-full py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition border border-red-100">
              Supprimer cette candidature
            </button>
          </div>
        </Modal>
      )}

      {/* ═══ MODAL CANDIDAT ══════════════════════════════════════════════════ */}
      {modalCandidat && (
        <Modal title="Profil candidat" onClose={() => setModalCandidat(null)}>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9b0000] to-[#c0392b] flex items-center justify-center text-white font-bold">
                {modalCandidat.firstName?.[0]}{modalCandidat.lastName?.[0]}
              </div>
              <div>
                <p className="font-bold text-gray-900">{modalCandidat.firstName} {modalCandidat.lastName}</p>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">CANDIDATE</span>
              </div>
            </div>
            <InfoRow icon={<FaEnvelope />}    label="Email"      value={modalCandidat.email} />
            <InfoRow icon={<FaPhone />}        label="Téléphone"  value={modalCandidat.phone || "Non renseigné"} />
            {modalCandidat.createdAt && (
              <InfoRow icon={<FaCalendarAlt />} label="Inscrit le" value={new Date(modalCandidat.createdAt).toLocaleDateString("fr-FR")} />
            )}
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
                Candidatures ({candidatures.filter(c => String(c.applicant_id) === String(modalCandidat.id)).length})
              </p>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {candidatures.filter(c => String(c.applicant_id) === String(modalCandidat.id)).length === 0
                  ? <p className="text-xs text-gray-400 text-center py-4">Aucune candidature</p>
                  : candidatures.filter(c => String(c.applicant_id) === String(modalCandidat.id)).map(c => (
                      <div key={c.id} className="p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-800">{c.job_title || "Offre #" + c.job_id}</p>
                          <StatusBadge status={c.status} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString("fr-FR")}</p>
                            <ScoreBadge score={c.score} />
                          </div>
                          {c.resume_path && (
                            <a href={buildCvUrl(c.resume_path)} target="_blank" rel="noreferrer"
                              className="flex items-center gap-1 text-xs text-[#9b0000] font-medium hover:underline">
                              <FaFileAlt className="text-xs" /> Voir CV
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                }
              </div>
            </div>
            <button onClick={() => deleteCandidat(modalCandidat.id)}
              className="w-full py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition border border-red-100">
              Supprimer ce candidat
            </button>
          </div>
        </Modal>
      )}

      {/* ═══ MODAL CONTACT ═══════════════════════════════════════════════════ */}
      {modalContact && (
        <Modal title="Message entreprise" onClose={() => setModalContact(null)}>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#065f46] to-[#047857] flex items-center justify-center text-white font-bold text-lg">
                {modalContact.nomComplet?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-900">{modalContact.nomComplet}</p>
                {modalContact.societe && <p className="text-sm text-gray-500">{modalContact.societe}</p>}
              </div>
            </div>
            <InfoRow icon={<FaEnvelope />}    label="Email"   value={modalContact.email} />
            {modalContact.telephone && <InfoRow icon={<FaPhone />} label="Téléphone" value={modalContact.telephone} />}
            <InfoRow icon={<FaCalendarAlt />} label="Reçu le" value={new Date(modalContact.createdAt).toLocaleDateString("fr-FR")} />
            {modalContact.services && parseServices(modalContact.services).length > 0 && (
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 mb-2">Services demandés</p>
                <div className="flex flex-wrap gap-1">
                  {parseServices(modalContact.services).map(s => (
                    <span key={s} className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium">{s}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Message</p>
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{modalContact.message}</p>
            </div>
            <a href={`mailto:${modalContact.email}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#9b0000] text-white rounded-xl text-sm font-medium hover:bg-[#7a0000] transition">
              <FaEnvelope /> Répondre par email
            </a>
            <button onClick={() => deleteContact(modalContact.id)}
              className="w-full py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition border border-red-100">
              Supprimer ce message
            </button>
          </div>
        </Modal>
      )}

      {/* ═══ MODAL OFFRE ═════════════════════════════════════════════════════ */}
      {modalOffre !== null && (
        <Modal title={modalOffre === "new" ? "Nouvelle offre" : "Modifier l'offre"} onClose={() => setModalOffre(null)}>
          <div className="space-y-4">
            <Field label="Titre du poste *" value={offreForm.title}
              onChange={(v: string) => setOffreForm({ ...offreForm, title: v })}
              placeholder="ex: Développeur Full Stack" />
            <Field label="Description *" value={offreForm.description}
              onChange={(v: string) => setOffreForm({ ...offreForm, description: v })}
              as="textarea" placeholder="Description du poste..." />
            <Field label="Compétences requises" value={offreForm.requirements || ""}
              onChange={(v: string) => setOffreForm({ ...offreForm, requirements: v })}
              as="textarea" placeholder="ex: React, Node.js, SQL..." />

            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">Catégorie</label>
              <div className="relative">
                <select
                  value={offreForm.categorie || "autre"}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setOffreForm({ ...offreForm, categorie: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:border-[#9b0000] appearance-none cursor-pointer">
                  {categorieOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {(() => {
                  const { icon: SelIcon, color: selColor } = getJobCategory(offreForm.categorie);
                  return (
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                      <SelIcon size={14} style={{ color: selColor }} />
                    </div>
                  );
                })()}
              </div>
              {offreForm.categorie && (() => {
                const { icon: PrevIcon, color: prevColor, label: prevLabel } = getJobCategory(offreForm.categorie);
                return (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: prevColor + "18" }}>
                      <PrevIcon size={12} style={{ color: prevColor }} />
                    </div>
                    <span className="text-xs font-medium" style={{ color: prevColor }}>{prevLabel}</span>
                  </div>
                );
              })()}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-medium">Type de contrat</label>
                <select value={offreForm.typeContrat}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setOffreForm({ ...offreForm, typeContrat: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:border-[#9b0000]">
                  {["CDI", "CDD", "Stage", "Freelance", "Temps partiel"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <Field label="Ville" value={offreForm.location || ""}
                onChange={(v: string) => setOffreForm({ ...offreForm, location: v })}
                placeholder="Tunis, Sfax..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Expérience (ans)" type="number" value={offreForm.experience || ""}
                onChange={(v: string) => setOffreForm({ ...offreForm, experience: Number(v) })} />
              <Field label="Salaire" value={offreForm.salary_range || ""}
                onChange={(v: string) => setOffreForm({ ...offreForm, salary_range: v })}
                placeholder="1500-2500 TND" />
            </div>
            <Field label="Date d'expiration" type="date"
              value={offreForm.dateExpiration ? offreForm.dateExpiration.split("T")[0] : ""}
              onChange={(v: string) => setOffreForm({ ...offreForm, dateExpiration: v })} />
            <div className="flex gap-3 pt-1">
              <button onClick={() => setModalOffre(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm hover:bg-gray-50 transition">
                Annuler
              </button>
              <button onClick={saveOffre}
                className="flex-1 py-2.5 bg-[#9b0000] text-white rounded-xl text-sm font-medium hover:bg-[#7a0000] transition">
                {modalOffre === "new" ? "Publier l'offre" : "Sauvegarder"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}