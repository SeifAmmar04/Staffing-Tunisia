"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import {
  FaUser,
  FaBriefcase,
  FaFileAlt,
  FaClipboardList,
  FaSignOutAlt,
  FaTachometerAlt,
} from "react-icons/fa";

export default function DashboardCandidat() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    // ✅ Connexion normale (email/password)
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.role !== "CANDIDATE") { router.push("/auth/login"); return; }
      setUser(parsed);
      const savedImage = localStorage.getItem(`avatar_${parsed.id}`);
      if (savedImage) setImage(savedImage);
      return;
    }

    // ✅ Connexion Google
    if (session?.user) {
      setUser({
        firstName: session.user.name?.split(" ")[0] || "",
        lastName: session.user.name?.split(" ")[1] || "",
        email: session.user.email,
        phone: "",
        role: "CANDIDATE",
        id: "",
        image: session.user.image,
      });
      if (session.user.image) setImage(session.user.image);
      return;
    }

    // ❌ Pas connecté
    router.push("/auth/login");

  }, [session, status]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    signOut({ callbackUrl: "/auth/login" });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImage(result);
      localStorage.setItem(`avatar_${user.id}`, result);
    };
    reader.readAsDataURL(file);
  };

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen">
      Chargement...
    </div>
  );

  const menuItems = [
    { id: "dashboard", label: "Tableau de bord", icon: <FaTachometerAlt /> },
    { id: "profil", label: "Mon Profil", icon: <FaUser /> },
    { id: "offres", label: "Offres d'emploi", icon: <FaBriefcase /> },
    { id: "candidatures", label: "Mes Candidatures", icon: <FaClipboardList /> },
    { id: "documents", label: "Mes Documents", icon: <FaFileAlt /> },
  ];

  const renderContent = () => {
    switch (activeSection) {

      case "dashboard":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Bienvenue, {user.firstName} 👋
            </h1>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow p-6 text-center">
                <p className="text-3xl font-bold text-red-600">0</p>
                <p className="text-gray-500 mt-1">Candidatures</p>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 text-center">
                <p className="text-3xl font-bold text-red-600">0</p>
                <p className="text-gray-500 mt-1">Offres disponibles</p>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 text-center">
                <p className="text-3xl font-bold text-red-600">0</p>
                <p className="text-gray-500 mt-1">Documents</p>
              </div>
            </div>
          </div>
        );

      case "profil":
        return (
          <div className="bg-white rounded-2xl shadow p-8 space-y-6 max-w-2xl">
            <h1 className="text-2xl font-bold text-gray-800 border-b pb-4">Mon Profil</h1>

            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-red-600">
                {image ? (
                  <img src={image} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-3xl text-gray-400">
                    <FaUser />
                  </div>
                )}
              </div>
              <label className="cursor-pointer bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition text-sm">
                Changer photo
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Prénom</p>
                <p className="font-semibold text-gray-800">{user.firstName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Nom</p>
                <p className="font-semibold text-gray-800">{user.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-semibold text-gray-800">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Téléphone</p>
                <p className="font-semibold text-gray-800">{user.phone || "Non renseigné"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Rôle</p>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {user.role}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">ID</p>
                <p className="font-semibold text-gray-800">{user.id || "Google Account"}</p>
              </div>
            </div>
          </div>
        );

      case "offres":
        return (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-800">Offres d'emploi</h1>
            <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-400">
              Aucune offre disponible pour le moment
            </div>
          </div>
        );

      case "candidatures":
        return (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-800">Mes Candidatures</h1>
            <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-400">
              Aucune candidature pour le moment
            </div>
          </div>
        );

      case "documents":
        return (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-800">Mes Documents</h1>
            <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-400">
              Aucun document uploadé pour le moment
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      <aside className="w-64 bg-white shadow-xl flex flex-col justify-between py-8 px-4">
        <div className="space-y-2">

          <div className="flex justify-center mb-8">
            <Image src="/logo.png" alt="Logo" width={150} height={50} />
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-red-600">
              {image ? (
                <img src={image} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl text-gray-400">
                  <FaUser />
                </div>
              )}
            </div>
            <p className="mt-2 font-semibold text-gray-800 text-sm">
              {user.firstName} {user.lastName}
            </p>
            <span className="text-xs text-green-600 font-medium">{user.role}</span>
          </div>

          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium ${
                activeSection === item.id
                  ? "bg-red-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition text-sm font-medium"
        >
          <FaSignOutAlt />
          Déconnexion
        </button>
      </aside>

      <main className="flex-1 p-10">
        {renderContent()}
      </main>

    </div>
  );
}