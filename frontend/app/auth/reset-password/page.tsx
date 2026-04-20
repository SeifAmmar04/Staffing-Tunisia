"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // le token vient du lien Gmail

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState({ password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenError, setTokenError] = useState("");

  useEffect(() => {
    if (!token) {
      setTokenError("Lien invalide ou expiré. Veuillez refaire une demande.");
    }
  }, [token]);

  const handleReset = async () => {
    setErrors({ password: "", confirm: "" });

    if (!form.password) {
      setErrors((e) => ({ ...e, password: "Mot de passe obligatoire." }));
      return;
    }
    if (form.password.length < 6) {
      setErrors((e) => ({ ...e, password: "Minimum 6 caractères." }));
      return;
    }
    if (!form.confirm) {
      setErrors((e) => ({ ...e, confirm: "Veuillez confirmer le mot de passe." }));
      return;
    }
    if (form.password !== form.confirm) {
      setErrors((e) => ({ ...e, confirm: "Les mots de passe ne correspondent pas." }));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.message === "TOKEN_EXPIRED") {
          setTokenError("Ce lien a expiré. Veuillez refaire une demande.");
        } else {
          setErrors((e) => ({ ...e, password: "Une erreur est survenue." }));
        }
        return;
      }

      setSuccess(true);
    } catch {
      setErrors((e) => ({ ...e, password: "Erreur réseau ❌" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">

      <button
        onClick={() => router.push("/auth/login")}
        className="absolute top-6 left-6 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-gray-800 transition text-sm"
      >
        ←
      </button>

      <div className="flex flex-1 items-center justify-center px-5 py-20">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10 space-y-8">

          <div className="flex flex-col items-center">
            <Image src="/logo.png" alt="Logo" width={220} height={220} />
          </div>

          {tokenError ? (
            /* ❌ Token invalide */
            <div className="text-center space-y-6 py-4">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-4xl">❌</span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Lien invalide</h2>
              <p className="text-gray-500 text-sm">{tokenError}</p>
              <button
                onClick={() => router.push("/auth/reset-mail")}
                className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
              >
                Refaire une demande
              </button>
            </div>

          ) : !success ? (
            /* 📝 Formulaire nouveau mot de passe */
            <>
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-gray-800">Nouveau mot de passe</h1>
                <p className="text-gray-500 text-sm">Choisissez un nouveau mot de passe sécurisé.</p>
              </div>

              <div className="space-y-5">

                {/* Nouveau mot de passe */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-800">Nouveau mot de passe</label>
                  <div className="flex items-center border border-gray-300 rounded-xl px-4 focus-within:border-red-500 transition">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 6 caractères"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full py-3 outline-none"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FaEye className="text-gray-400" /> : <FaEyeSlash className="text-gray-400" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">⚠️ {errors.password}</p>}
                </div>

                {/* Confirmer mot de passe */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-800">Confirmer le mot de passe</label>
                  <div className="flex items-center border border-gray-300 rounded-xl px-4 focus-within:border-red-500 transition">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Répétez le mot de passe"
                      value={form.confirm}
                      onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && handleReset()}
                      className="w-full py-3 outline-none"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? <FaEye className="text-gray-400" /> : <FaEyeSlash className="text-gray-400" />}
                    </button>
                  </div>
                  {errors.confirm && <p className="text-red-500 text-sm mt-1">⚠️ {errors.confirm}</p>}
                </div>

                <button
                  onClick={handleReset}
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? "Enregistrement..." : "RÉINITIALISER"}
                </button>
              </div>
            </>

          ) : (
            /* ✅ Succès */
            <div className="text-center space-y-6 py-4">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-4xl">✅</span>
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">Mot de passe modifié !</h2>
                <p className="text-gray-500 text-sm">
                  Votre mot de passe a été réinitialisé avec succès.
                </p>
              </div>
              <button
                onClick={() => router.push("/auth/login")}
                className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
              >
                Se connecter
              </button>
            </div>
          )}

        </div>
      </div>

      <div className="text-center text-sm text-gray-500 pb-6">
        © 2026 Staffing Tunisia. Tous droits réservés.
      </div>
    </div>
  );
}