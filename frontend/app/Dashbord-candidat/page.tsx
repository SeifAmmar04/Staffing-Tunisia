"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import {
  FaUser, FaBriefcase, FaFileAlt, FaClipboardList, FaSignOutAlt,
  FaTachometerAlt, FaEnvelope, FaPhone, FaIdBadge, FaMapMarkerAlt,
  FaLock, FaEdit, FaCheck, FaTimes, FaUpload, FaFilePdf,
} from "react-icons/fa";

const API_URL = "http://localhost:5000";

// ── Helpers localStorage ──────────────────────────────────────────────────────
function lsGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  try { return localStorage.getItem(key); } catch { return null; }
}
function lsSet(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, value); } catch {}
}
function lsRemove(key: string): void {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(key); } catch {}
}

function buildCvUrl(path?: string): string {
  if (!path) return "";
  return `${API_URL}/${path.replace(/\\/g, "/")}`;
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface UserState {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  provider?: string;
  image?: string | null;
}

export default function DashboardCandidat() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [user, setUser] = useState<UserState | null>(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [avatar, setAvatar] = useState<string | null>(null);

  // Candidatures & offres
  const [candidatures, setCandidatures] = useState<any[]>([]);
  const [offres, setOffres] = useState<any[]>([]);
  const [loadingCandidatures, setLoadingCandidatures] = useState(false);
  const [loadingOffres, setLoadingOffres] = useState(false);

  // Profil
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Mot de passe
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  // CV global
  const [globalCV, setGlobalCV] = useState<File | null>(null);
  const [globalCVName, setGlobalCVName] = useState<string | null>(null);
  const [globalCVPath, setGlobalCVPath] = useState<string | null>(null);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [cvSuccess, setCvSuccess] = useState(false);
  const globalCVRef = useRef<HTMLInputElement>(null);

  // Postulation
  const [selectedOffre, setSelectedOffre] = useState<any>(null);
  const [postulForm, setPostulForm] = useState({ nom: "", prenom: "", email: "", phone: "" });
  const [postulCV, setPostulCV] = useState<File | null>(null);
  const [postulError, setPostulError] = useState("");
  const [postulSuccess, setPostulSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const postulCVRef = useRef<HTMLInputElement>(null);

  // ── Helper : construire un objet user depuis les données DB ──────────────────
  const buildUser = (dbUser: any, fallback: Partial<UserState> = {}): UserState => ({
    id: dbUser.id || fallback.id || "",
    firstName: dbUser.firstName || fallback.firstName || "",
    lastName: dbUser.lastName || fallback.lastName || "",
    email: dbUser.email || fallback.email || "",
    phone: dbUser.phone ?? fallback.phone ?? "",   // ✅ phone depuis DB (Google inclus)
    role: dbUser.role || fallback.role || "CANDIDATE",
    provider: fallback.provider || "local",
    image: fallback.image || null,
  });

  const syncEditForm = (u: UserState) =>
    setEditForm({ firstName: u.firstName, lastName: u.lastName, email: u.email, phone: u.phone });

  // ── 1. Chargement initial de l'utilisateur ───────────────────────────────────
  useEffect(() => {
    if (status === "loading") return;

    const loadUser = async () => {
      // Cas 1 : utilisateur en localStorage (connexion classique)
      const stored = lsGet("user");
      if (stored) {
        try {
          const parsed: UserState = JSON.parse(stored);
          if (parsed.role !== "CANDIDATE") { router.push("/auth/login"); return; }
          setUser(parsed);
          syncEditForm(parsed);
          const savedAvatar = lsGet(`avatar_${parsed.id}`);
          if (savedAvatar) setAvatar(savedAvatar);
          return;
        } catch {
          lsRemove("user");
        }
      }

      // Cas 2 : session NextAuth (Google ou autre OAuth)
      if (session?.user) {
        const provider = (session.user as any).provider || "google";
        try {
          // ✅ Récupérer les données complètes depuis la DB (inclut phone)
          const res = await fetch(`${API_URL}/users/by-email/${session.user.email}`);
          if (res.ok) {
            const dbUser = await res.json();
            const u = buildUser(dbUser, { provider, image: session.user.image });
            setUser(u);
            syncEditForm(u);
            if (session.user.image) setAvatar(session.user.image);
            const savedAvatar = lsGet(`avatar_${u.id}`);
            if (savedAvatar) setAvatar(savedAvatar);
            lsSet("user", JSON.stringify(u));
            return;
          }
        } catch (err) {
          console.error("Erreur fetch DB user (Google):", err);
        }

        // Fallback minimal si la DB est inaccessible
        const u: UserState = {
          id: (session.user as any).id || "",
          firstName: session.user.name?.split(" ")[0] || "",
          lastName: session.user.name?.split(" ").slice(1).join(" ") || "",
          email: session.user.email || "",
          phone: "",
          role: "CANDIDATE",
          provider,
          image: session.user.image,
        };
        setUser(u);
        syncEditForm(u);
        if (session.user.image) setAvatar(session.user.image);
        lsSet("user", JSON.stringify(u));
        return;
      }

      router.push("/auth/login");
    };

    loadUser();
  }, [session, status]);

  // ── 2. Rafraîchir TOUS les champs utilisateur depuis DB après montage ──────────
  useEffect(() => {
    if (!user?.id) return;

    const refreshUserFromDB = async () => {
      try {
        const res = await fetch(`${API_URL}/users/${user.id}`);
        if (!res.ok) return;
        const dbUser = await res.json();
        
        // ✅ Récupérer TOUS les champs depuis la DB avec gestion des strings vides
        const phone = dbUser.phone && String(dbUser.phone).trim() ? String(dbUser.phone).trim() : user.phone;
        
        const updatedUser = {
          ...user,
          firstName: dbUser.firstName && String(dbUser.firstName).trim() ? String(dbUser.firstName).trim() : user.firstName,
          lastName: dbUser.lastName && String(dbUser.lastName).trim() ? String(dbUser.lastName).trim() : user.lastName,
          email: dbUser.email && String(dbUser.email).trim() ? String(dbUser.email).trim() : user.email,
          phone: phone,
        };
        
        setUser(updatedUser);
        setEditForm({
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          phone: updatedUser.phone,
        });
        lsSet("user", JSON.stringify(updatedUser));
        console.log("✅ User data refreshed from DB:", updatedUser);
      } catch (err) {
        console.error("Erreur refresh user DB:", err);
      }
    };

    refreshUserFromDB();
  }, [user?.id]);

  // ── 3. Charger le CV depuis la DB ────────────────────────────────────────────
  useEffect(() => {
    if (!user?.id) return;

    const fetchCV = async () => {
      try {
        const res = await fetch(`${API_URL}/cv/user/${user.id}`);

        if (!res.ok) {
          setGlobalCVPath(null);
          setGlobalCVName(null);
          lsRemove(`cv_name_${user.id}`);
          lsRemove(`cv_path_${user.id}`);
          return;
        }

        // Lire comme texte pour éviter le crash sur réponse vide/null
        const text = await res.text();
        if (!text || text === "null") {
          setGlobalCVPath(null);
          setGlobalCVName(null);
          lsRemove(`cv_name_${user.id}`);
          lsRemove(`cv_path_${user.id}`);
          return;
        }

        const cv = JSON.parse(text);
        if (cv?.cv_path) {
          // ✅ original_name si dispo, sinon extrait du path
          const name = cv.original_name || cv.cv_path.split(/[\\/]/).pop() || "Mon CV";
          setGlobalCVPath(cv.cv_path);
          setGlobalCVName(name);
          lsSet(`cv_name_${user.id}`, name);
          lsSet(`cv_path_${user.id}`, cv.cv_path);
        } else {
          setGlobalCVPath(null);
          setGlobalCVName(null);
          lsRemove(`cv_name_${user.id}`);
          lsRemove(`cv_path_${user.id}`);
        }
      } catch (err) {
        console.error("Erreur fetch CV:", err);
        // Fallback localStorage si réseau indisponible
        const name = lsGet(`cv_name_${user.id}`);
        const path = lsGet(`cv_path_${user.id}`);
        if (name) setGlobalCVName(name);
        if (path) setGlobalCVPath(path);
      }
    };

    fetchCV();
  }, [user?.id]);

  // ── 4. Fetch candidatures (polling 30s) ──────────────────────────────────────
  useEffect(() => {
    if (!user?.id) return;

    const fetchCandidatures = async () => {
      setLoadingCandidatures(true);
      try {
        const res = await fetch(`${API_URL}/applications`);
        const data = await res.json();
        setCandidatures(data.filter((c: any) => String(c.applicant_id) === String(user.id)));
      } catch {
        setCandidatures([]);
      } finally {
        setLoadingCandidatures(false);
      }
    };

    fetchCandidatures();
    const interval = setInterval(fetchCandidatures, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  // ── 5. Fetch offres ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!["offres", "dashboard", "postuler"].includes(activeSection)) return;

    const fetchOffres = async () => {
      setLoadingOffres(true);
      try {
        const res = await fetch(`${API_URL}/offres`);
        setOffres(await res.json());
      } catch {
        setOffres([]);
      } finally {
        setLoadingOffres(false);
      }
    };

    fetchOffres();
  }, [activeSection]);

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    lsRemove("token");
    lsRemove("user");
    signOut({ callbackUrl: "/auth/login" });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("L'image ne doit pas dépasser 2 Mo."); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setAvatar(result);
      if (user?.id) lsSet(`avatar_${user.id}`, result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    setSavingProfile(true);
    setProfileError("");
    try {
      const res = await fetch(`${API_URL}/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
      const updated = await res.json();
      const updatedUser = { ...user, ...updated };
      setUser(updatedUser);
      syncEditForm(updatedUser);
      lsSet("user", JSON.stringify(updatedUser));
      setEditMode(false);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      setProfileError(err.message || "Erreur lors de la mise à jour.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    setPwError("");
    if (user?.provider === "google") { setPwError("Connexion Google : impossible de modifier le mot de passe ici."); return; }
    if (!user?.id) { setPwError("Identifiant manquant."); return; }
    if (!pwForm.current) { setPwError("Veuillez entrer votre mot de passe actuel."); return; }
    if (pwForm.next.length < 6) { setPwError("Minimum 6 caractères."); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError("Les mots de passe ne correspondent pas."); return; }

    setSavingPw(true);
    try {
      const res = await fetch(`${API_URL}/users/${user.id}/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
      setPwForm({ current: "", next: "", confirm: "" });
      setPwSuccess(true);
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err: any) {
      setPwError(err.message || "Erreur lors du changement.");
    } finally {
      setSavingPw(false);
    }
  };

  const handleUploadGlobalCV = async () => {
    if (!globalCV || !user?.id) return;
    setUploadingCV(true);
    try {
      const formData = new FormData();
      formData.append("resume", globalCV);
      formData.append("user_id", String(user.id));

      const res = await fetch(`${API_URL}/cv/upload`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload échoué");
      const data = await res.json();

      const path: string = data.resume_path;
      const name: string = data.originalname || globalCV.name;

      setGlobalCVPath(path);
      setGlobalCVName(name);
      lsSet(`cv_name_${user.id}`, name);
      lsSet(`cv_path_${user.id}`, path);
      setGlobalCV(null);
      setCvSuccess(true);
      setTimeout(() => setCvSuccess(false), 3000);
    } catch {
      alert("Erreur lors de l'upload du CV.");
    } finally {
      setUploadingCV(false);
    }
  };

  const openPostuler = (offre: any) => {
    setSelectedOffre(offre);
    setPostulForm({
      nom: user?.firstName || "",
      prenom: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setPostulCV(null);
    setPostulError("");
    setPostulSuccess(false);
    setActiveSection("postuler");
  };

  const handlePostuler = async () => {
    setPostulError("");
    if (!postulForm.nom || !postulForm.prenom || !postulForm.email || !postulForm.phone) {
      setPostulError("Veuillez remplir tous les champs obligatoires."); return;
    }
    if (!postulCV && !globalCVPath) { setPostulError("Veuillez joindre votre CV."); return; }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("job_id", String(selectedOffre.id));
      formData.append("first_name", postulForm.nom);
      formData.append("last_name", postulForm.prenom);
      formData.append("email", postulForm.email);
      formData.append("phone", postulForm.phone);
      if (user?.id) formData.append("applicant_id", String(user.id));
      if (postulCV) {
        formData.append("resume", postulCV);
      } else if (globalCVPath) {
        formData.append("existing_resume_path", globalCVPath);
      }

      const res = await fetch(`${API_URL}/applications`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Erreur serveur");

      setPostulSuccess(true);
      const res2 = await fetch(`${API_URL}/applications`);
      const data = await res2.json();
      setCandidatures(data.filter((c: any) => String(c.applicant_id) === String(user?.id)));
    } catch {
      setPostulError("Erreur lors de l'envoi de la candidature.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCandidature = async (id: number) => {
    if (!confirm("Supprimer cette candidature ?")) return;
    try {
      const res = await fetch(`${API_URL}/applications/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setCandidatures(prev => prev.filter(c => c.id !== id));
    } catch {
      alert("Erreur lors de la suppression.");
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (!user) return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f4f0]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#9b0000] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Chargement...</p>
      </div>
    </div>
  );

  // ── Config UI ─────────────────────────────────────────────────────────────────
  const menuItems = [
    { id: "dashboard",    label: "Tableau de bord",  icon: <FaTachometerAlt /> },
    { id: "profil",       label: "Mon Profil",        icon: <FaUser /> },
    { id: "cv",           label: "Mon CV",            icon: <FaFilePdf /> },
    { id: "offres",       label: "Offres d'emploi",   icon: <FaBriefcase /> },
    { id: "candidatures", label: "Mes Candidatures",  icon: <FaClipboardList /> },
  ];

  const statusColor: Record<string, string> = {
    PENDING:  "bg-yellow-100 text-yellow-700",
    ACCEPTED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  };
  const statusLabel: Record<string, string> = {
    PENDING:  "En attente",
    ACCEPTED: "Acceptée",
    REJECTED: "Refusée",
  };

  // ── Sections ──────────────────────────────────────────────────────────────────
  const renderContent = () => {
    switch (activeSection) {

      case "dashboard":
        return (
          <div className="space-y-8 animate-fadein">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-gray-400 font-medium uppercase tracking-widest mb-1">Bienvenue de retour</p>
                <h1 className="text-3xl font-bold text-gray-900">{user.firstName} {user.lastName} 👋</h1>
              </div>
              <div className="text-right text-sm text-gray-400">
                {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { label: "Candidatures envoyées", value: candidatures.length,                                               icon: <FaClipboardList />, color: "from-[#9b0000] to-[#c0392b]" },
                { label: "Offres disponibles",    value: offres.length,                                                     icon: <FaBriefcase />,     color: "from-gray-700 to-gray-900" },
                { label: "CV uploadés",           value: globalCVPath ? 1 : candidatures.filter(c => c.resume_path).length, icon: <FaFileAlt />,       color: "from-[#b45309] to-[#92400e]" },
              ].map(stat => (
                <div key={stat.label} className={`bg-gradient-to-br ${stat.color} text-white rounded-2xl p-6 flex items-center justify-between shadow-lg`}>
                  <div>
                    <p className="text-4xl font-bold">{stat.value}</p>
                    <p className="text-sm opacity-80 mt-1">{stat.label}</p>
                  </div>
                  <div className="text-4xl opacity-30">{stat.icon}</div>
                </div>
              ))}
            </div>

            {!globalCVPath && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 text-lg"><FaFilePdf /></div>
                  <div>
                    <p className="font-semibold text-amber-800 text-sm">Vous n&apos;avez pas encore ajouté votre CV</p>
                    <p className="text-xs text-amber-600 mt-0.5">Ajoutez votre CV pour postuler plus rapidement.</p>
                  </div>
                </div>
                <button onClick={() => setActiveSection("cv")} className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition whitespace-nowrap">
                  Ajouter mon CV →
                </button>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">Candidatures récentes</h2>
                <button onClick={() => setActiveSection("candidatures")} className="text-xs text-[#9b0000] font-medium hover:underline">Voir tout →</button>
              </div>
              {loadingCandidatures ? (
                <div className="p-8 text-center text-gray-400 text-sm">Chargement...</div>
              ) : candidatures.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">
                  Aucune candidature pour l&apos;instant.<br />
                  <button onClick={() => setActiveSection("offres")} className="mt-2 text-[#9b0000] font-medium hover:underline text-sm">Parcourir les offres →</button>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {candidatures.slice(0, 3).map(c => (
                    <div key={c.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                      <div>
                        <p className="font-medium text-gray-800">{c.job_title || "Poste inconnu"}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{new Date(c.createdAt).toLocaleDateString("fr-FR")}</p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusColor[c.status] || "bg-gray-100 text-gray-500"}`}>
                        {statusLabel[c.status] || "Envoyée"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case "profil":
        return (
          <div className="max-w-2xl space-y-6 animate-fadein">
            <div>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-widest mb-1">Compte</p>
              <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
            </div>

            {profileSuccess && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
                <FaCheck /> Profil mis à jour avec succès !
              </div>
            )}

            {/* Avatar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-gray-200">
                    {avatar ? (
                      <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#9b0000] to-[#c0392b] flex items-center justify-center text-white text-3xl font-bold">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </div>
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#9b0000] rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-[#7a0000] transition">
                    <span className="text-white text-xs">✎</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <span className="mt-2 inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">{user.role}</span>
                </div>
              </div>
            </div>

            {/* Informations */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Informations personnelles</h3>
                {!editMode ? (
                  <button onClick={() => { setEditMode(true); setProfileError(""); }} className="flex items-center gap-1.5 text-xs text-[#9b0000] font-medium hover:underline">
                    <FaEdit /> Modifier
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditMode(false); setProfileError(""); syncEditForm(user); }} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
                      <FaTimes /> Annuler
                    </button>
                    <button onClick={handleSaveProfile} disabled={savingProfile} className="flex items-center gap-1.5 text-xs bg-[#9b0000] text-white px-3 py-1.5 rounded-lg hover:bg-[#7a0000] transition disabled:opacity-60">
                      <FaCheck /> {savingProfile ? "Sauvegarde..." : "Sauvegarder"}
                    </button>
                  </div>
                )}
              </div>

              {profileError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-4">{profileError}</div>
              )}

              <div className="space-y-4">
                {[
                  { icon: <FaUser />,     label: "Prénom",    field: "firstName" as const },
                  { icon: <FaIdBadge />,  label: "Nom",       field: "lastName"  as const },
                  { icon: <FaEnvelope />, label: "Email",     field: "email"     as const },
                  { icon: <FaPhone />,    label: "Téléphone", field: "phone"     as const },
                ].map(item => (
                  <div key={item.field} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                    <div className="w-9 h-9 bg-[#9b0000]/10 text-[#9b0000] rounded-lg flex items-center justify-center text-sm flex-shrink-0">{item.icon}</div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                      {editMode ? (
                        <input
                          value={editForm[item.field]}
                          onChange={e => setEditForm({ ...editForm, [item.field]: e.target.value })}
                          className="w-full text-sm font-semibold text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#9b0000]"
                        />
                      ) : (
                        <p className="font-semibold text-gray-800 text-sm">{editForm[item.field]?.trim() ? editForm[item.field] : "Non renseigné"}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mot de passe */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FaLock className="text-[#9b0000]" /> Changer le mot de passe
              </h3>
              {user.provider === "google" ? (
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl px-4 py-3 text-sm">
                  ℹ️ Vous êtes connecté via Google. Modification du mot de passe non disponible ici.
                </div>
              ) : (
                <>
                  {pwSuccess && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium mb-4">
                      <FaCheck /> Mot de passe modifié avec succès !
                    </div>
                  )}
                  {pwError && (
                    <div className="flex items-center gap-2 bg-red-100 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-4">{pwError}</div>
                  )}
                  <div className="space-y-3">
                    {[
                      { label: "Mot de passe actuel",               field: "current" as const, placeholder: "••••••••" },
                      { label: "Nouveau mot de passe",              field: "next"    as const, placeholder: "Min. 6 caractères" },
                      { label: "Confirmer le nouveau mot de passe", field: "confirm" as const, placeholder: "••••••••" },
                    ].map(item => (
                      <div key={item.field}>
                        <label className="block text-xs text-gray-500 mb-1 font-medium">{item.label}</label>
                        <input
                          type="password"
                          placeholder={item.placeholder}
                          value={pwForm[item.field]}
                          onChange={e => setPwForm({ ...pwForm, [item.field]: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:border-[#9b0000]"
                        />
                      </div>
                    ))}
                    <button onClick={handleChangePassword} disabled={savingPw} className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-medium transition disabled:opacity-60 mt-2">
                      {savingPw ? "Modification..." : "Modifier le mot de passe"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case "cv":
        return (
          <div className="max-w-xl space-y-6 animate-fadein">
            <div>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-widest mb-1">Fichier</p>
              <h1 className="text-3xl font-bold text-gray-900">Mon CV</h1>
            </div>

            {cvSuccess && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
                <FaCheck /> CV uploadé avec succès !
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              {globalCVPath ? (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6 border border-gray-100">
                  <div className="w-12 h-12 bg-red-50 text-[#9b0000] rounded-xl flex items-center justify-center text-xl"><FaFilePdf /></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{globalCVName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">CV actuel</p>
                  </div>
                  <a href={buildCvUrl(globalCVPath)} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-[#9b0000] text-white text-xs rounded-lg hover:bg-[#7a0000] transition">Ouvrir</a>
                </div>
              ) : (
                <div className="text-center py-6 mb-6">
                  <div className="w-16 h-16 bg-amber-50 text-amber-400 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3"><FaFilePdf /></div>
                  <p className="text-gray-500 text-sm">Vous n&apos;avez pas encore de CV enregistré.</p>
                  <p className="text-gray-400 text-xs mt-1">Ajoutez votre CV pour postuler plus facilement.</p>
                </div>
              )}

              <div onClick={() => globalCVRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#9b0000] hover:bg-red-50/30 transition-all">
                <FaUpload className="text-2xl text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 font-medium">
                  {globalCV ? (
                    <span className="text-[#9b0000] font-semibold">{globalCV.name}</span>
                  ) : (
                    <>{globalCVPath ? "Remplacer mon CV" : "Ajouter mon CV"}<br /><span className="text-xs text-gray-400">PDF, DOC, DOCX acceptés</span></>
                  )}
                </p>
                <input type="file" ref={globalCVRef} accept=".pdf,.doc,.docx" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) { setGlobalCV(f); setCvSuccess(false); } }} />
              </div>

              {globalCV && (
                <button onClick={handleUploadGlobalCV} disabled={uploadingCV} className="w-full mt-4 py-3 bg-[#9b0000] hover:bg-[#7a0000] text-white rounded-xl font-medium text-sm transition disabled:opacity-60">
                  {uploadingCV ? "Upload en cours..." : "💾 Sauvegarder mon CV"}
                </button>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-700">
              <p className="font-semibold mb-1">💡 Comment fonctionne le CV global ?</p>
              <p className="text-xs text-blue-600 leading-relaxed">Votre CV est sauvegardé dans notre base de données. Il sera automatiquement joint à chaque candidature.</p>
            </div>
          </div>
        );

      case "offres":
        return (
          <div className="space-y-6 animate-fadein">
            <div>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-widest mb-1">Explorer</p>
              <h1 className="text-3xl font-bold text-gray-900">Offres d&apos;emploi</h1>
            </div>
            {loadingOffres ? (
              <div className="text-center text-gray-400 py-16 text-sm">Chargement des offres...</div>
            ) : offres.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center text-gray-400">Aucune offre disponible</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {offres.map((offre: any) => {
                  const alreadyApplied = candidatures.some(c => String(c.job_id) === String(offre.id));
                  return (
                    <div key={offre.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{offre.title}</h3>
                          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                            <FaMapMarkerAlt className="text-[#9b0000]" /> {offre.location || "Tunisie"}
                          </p>
                        </div>
                        <span className="bg-red-100 text-[#9b0000] text-xs font-semibold px-2 py-1 rounded-full">{offre.typeContrat}</span>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{offre.description}</p>
                      {alreadyApplied ? (
                        <div className="w-full text-center py-2 bg-green-50 text-green-600 rounded-xl text-sm font-medium border border-green-100">✓ Déjà postulé</div>
                      ) : (
                        <button onClick={() => openPostuler(offre)} className="w-full py-2 bg-[#9b0000] text-white rounded-xl text-sm font-medium hover:bg-[#7a0000] transition">Postuler →</button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );

      case "postuler":
        return (
          <div className="max-w-xl space-y-6 animate-fadein">
            <button onClick={() => setActiveSection("offres")} className="text-gray-400 hover:text-gray-700 transition text-sm">← Retour aux offres</button>
            <div>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-widest mb-1">Candidature</p>
              <h1 className="text-3xl font-bold text-gray-900">{selectedOffre?.title}</h1>
              {selectedOffre?.location && (
                <p className="text-sm text-gray-400 mt-1 flex items-center gap-1"><FaMapMarkerAlt className="text-[#9b0000]" /> {selectedOffre.location}</p>
              )}
            </div>

            {postulSuccess ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"><FaCheck className="text-2xl text-green-600" /></div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Candidature envoyée !</h3>
                <p className="text-gray-500 text-sm">Votre candidature pour <span className="font-semibold text-[#9b0000]">{selectedOffre?.title}</span> a bien été reçue.</p>
                <button onClick={() => setActiveSection("candidatures")} className="mt-6 px-6 py-2.5 bg-[#9b0000] text-white rounded-xl text-sm font-medium hover:bg-[#7a0000] transition">
                  Voir mes candidatures →
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                <p className="text-xs text-gray-400">Les champs sont pré-remplis avec vos informations de profil.</p>

                {postulError && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{postulError}</div>}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block font-medium">Prénom *</label>
                    <input value={postulForm.nom} onChange={e => setPostulForm({ ...postulForm, nom: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:border-[#9b0000]" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block font-medium">Nom *</label>
                    <input value={postulForm.prenom} onChange={e => setPostulForm({ ...postulForm, prenom: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:border-[#9b0000]" />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-medium">Email *</label>
                  <input type="email" value={postulForm.email} onChange={e => setPostulForm({ ...postulForm, email: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:border-[#9b0000]" />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-medium">Téléphone *</label>
                  <input type="tel" value={postulForm.phone} onChange={e => setPostulForm({ ...postulForm, phone: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:border-[#9b0000]" />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-2 block font-medium">CV *</label>
                  {globalCVPath && !postulCV ? (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                      <FaFilePdf className="text-green-600 text-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-800 truncate">{globalCVName}</p>
                        <p className="text-xs text-green-600">CV enregistré — joint automatiquement</p>
                      </div>
                      <button onClick={() => postulCVRef.current?.click()} className="text-xs text-gray-400 hover:text-gray-600 underline whitespace-nowrap">Changer</button>
                    </div>
                  ) : (
                    <div onClick={() => postulCVRef.current?.click()} className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${postulCV ? "border-[#9b0000] bg-red-50/30" : "border-gray-200 hover:border-[#9b0000]"}`}>
                      <FaUpload className="text-xl text-gray-300 mx-auto mb-1" />
                      <p className="text-sm text-gray-500">
                        {postulCV ? <span className="text-[#9b0000] font-semibold">{postulCV.name}</span> : <>Cliquez pour joindre votre CV<br /><span className="text-xs text-gray-400">PDF, DOC, DOCX</span></>}
                      </p>
                    </div>
                  )}
                  <input type="file" ref={postulCVRef} accept=".pdf,.doc,.docx" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) setPostulCV(f); }} />
                  {!globalCVPath && !postulCV && (
                    <p className="text-xs text-amber-600 mt-1.5">
                      💡 <button onClick={() => setActiveSection("cv")} className="underline">Ajoutez votre CV</button> dans &quot;Mon CV&quot; pour ne plus le re-joindre à chaque postulation.
                    </p>
                  )}
                </div>

                <button onClick={handlePostuler} disabled={submitting} className="w-full py-3 bg-[#9b0000] hover:bg-[#7a0000] text-white font-medium rounded-xl text-sm transition disabled:opacity-60">
                  {submitting ? "Envoi en cours..." : "Envoyer ma candidature →"}
                </button>
              </div>
            )}
          </div>
        );

      case "candidatures":
        return (
          <div className="space-y-6 animate-fadein">
            <div>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-widest mb-1">Suivi</p>
              <h1 className="text-3xl font-bold text-gray-900">Mes Candidatures</h1>
            </div>
            {loadingCandidatures ? (
              <div className="text-center text-gray-400 py-16 text-sm">Chargement...</div>
            ) : candidatures.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                <FaClipboardList className="text-5xl text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 text-sm">Vous n&apos;avez encore postulé à aucune offre.</p>
                <button onClick={() => setActiveSection("offres")} className="mt-4 px-5 py-2 bg-[#9b0000] text-white rounded-xl text-sm font-medium hover:bg-[#7a0000] transition">Voir les offres →</button>
              </div>
            ) : (
              <div className="space-y-3">
                {candidatures.map(c => (
                  <div key={c.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#9b0000]/10 text-[#9b0000] rounded-xl flex items-center justify-center"><FaBriefcase /></div>
                      <div>
                        <p className="font-semibold text-gray-800">{c.job_title || "Poste inconnu"}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Postulé le {new Date(c.createdAt).toLocaleDateString("fr-FR")}</p>
                        {c.resume_path && (
                          <a href={buildCvUrl(c.resume_path)} target="_blank" rel="noreferrer" className="text-xs text-[#9b0000] hover:underline mt-0.5 inline-block">📎 Voir mon CV</a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusColor[c.status] || "bg-gray-100 text-gray-500"}`}>
                        {statusLabel[c.status] || "Envoyée"}
                      </span>
                      <button onClick={() => handleDeleteCandidature(c.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 transition text-sm" title="Supprimer">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // ── Rendu principal ───────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes fadein { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadein { animation: fadein 0.3s ease; }
      `}</style>

      <div className="min-h-screen bg-[#f5f5f0] flex font-sans">
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between py-8 px-4 sticky top-0 h-screen overflow-y-auto">
          <div className="space-y-1">
            <div className="flex justify-center mb-8 px-2">
              <Image src="/logo.png" alt="Logo" width={140} height={45} priority />
            </div>
            <div className="flex flex-col items-center mb-6 py-4 px-3 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-md">
                {avatar ? (
                  <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#9b0000] to-[#c0392b] flex items-center justify-center text-white text-xl font-bold">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                )}
              </div>
              <p className="mt-3 font-semibold text-gray-800 text-sm text-center leading-tight">{user.firstName} {user.lastName}</p>
              <span className="mt-1 text-xs text-[#9b0000] font-medium bg-red-50 px-2 py-0.5 rounded-full">Candidat</span>
            </div>

            {menuItems.map(item => (
              <button key={item.id} onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  activeSection === item.id || (activeSection === "postuler" && item.id === "offres")
                    ? "bg-[#9b0000] text-white shadow-md shadow-red-200"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                }`}>
                <span className="text-base">{item.icon}</span>
                {item.label}
                {item.id === "cv" && !globalCVPath && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" title="CV manquant" />
                )}
              </button>
            ))}
          </div>

          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all text-sm font-medium">
            <FaSignOutAlt /> Déconnexion
          </button>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </>
  );
}