"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ResetMailPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setError("");

    if (!email) {
      setError("Veuillez saisir votre adresse e-mail.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Adresse e-mail invalide.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://staffing-tunisia-1.onrender.com/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.message === "EMAIL_NOT_FOUND") {
          setError("Aucun compte trouvé avec cet e-mail.");
        } else {
          setError("Une erreur est survenue. Réessayez.");
        }
        return;
      }

      setSent(true);
    } catch (err) {
      setError("Erreur réseau. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">

      {/* Bouton retour */}
      <button
        onClick={() => router.push("/auth/login")}
        className="absolute top-6 left-6 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-gray-800 transition text-sm"
      >
        ←
      </button>

      <div className="flex flex-1 items-center justify-center px-5 py-20">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10 space-y-8">

          {/* Logo */}
          <div className="flex flex-col items-center">
            <Image src="/logo.png" alt="Logo" width={220} height={220} />
          </div>

          {!sent ? (
            <>
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-gray-800">Mot de passe oublié ?</h1>
                <p className="text-gray-500 text-sm">
                  Entrez votre adresse e-mail. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-semibold text-gray-800">E-mail</label>
                  <input
                    type="email"
                    placeholder="exemple@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:border-red-500 transition"
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      ⚠️ {error}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleSend}
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Envoi en cours..." : "ENVOYER LE LIEN"}
                </button>
              </div>
            </>
          ) : (
            /* ✅ Message de succès */
            <div className="text-center space-y-6 py-4">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-4xl">✅</span>
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">E-mail envoyé !</h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Un lien de réinitialisation a été envoyé à <br />
                  <span className="font-semibold text-red-600">{email}</span>
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Vérifiez votre boîte de réception (et les spams).
                </p>
              </div>
              <button
                onClick={() => router.push("/auth/login")}
                className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
              >
                Retour à la connexion
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
