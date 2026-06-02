"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import {
  FaUser, FaPhone, FaEnvelope, FaLock, FaEye, FaEyeSlash,
} from "react-icons/fa";

export default function SignupPage() {
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm,  setShowConfirm]    = useState(false);
  const [step,         setStep]           = useState<1 | 2>(1);
  const [otpCode,      setOtpCode]        = useState("");
  const [otpError,     setOtpError]       = useState("");
  const [loading,      setLoading]        = useState(false);

  const [form, setForm] = useState({
    firstName:       "",
    lastName:        "",
    phone:           "",
    email:           "",
    password:        "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({ email: "", password: "" });

  // ──────────────────────────────────────────
  // VALIDATION FORMAT
  // ──────────────────────────────────────────
  const validatePassword = (pwd: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(pwd)
      ? ""
      : "Au moins 8 caractères, une majuscule et un chiffre";
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) ? "" : "Format email invalide";
  };

  // ──────────────────────────────────────────
  // ÉTAPE 1 — Soumettre le formulaire
  // ──────────────────────────────────────────
  const handleSubmit = async () => {
    setErrors({ email: "", password: "" });

    // 1. Champs obligatoires
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // 2. Format email
    const emailFmtError = validateEmail(form.email);
    if (emailFmtError) {
      setErrors({ email: emailFmtError, password: "" });
      return;
    }

    // 3. Format mot de passe
    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setErrors({ email: "", password: passwordError });
      return;
    }

    // 4. Confirmation mot de passe
    if (form.password !== form.confirmPassword) {
      setErrors({ email: "", password: "Les mots de passe ne correspondent pas" });
      return;
    }

    setLoading(true);

    // 5. Vérifier si email existe déjà en BD
    const checkRes = await fetch("https://staffing-tunisia-1.onrender.com/users/check-email", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email: form.email }),
    });
    const checkData = await checkRes.json();

    if (checkData.exists === true) {
      setErrors({ email: "Cet email est déjà utilisé", password: "" });
      setLoading(false);
      return;
    }

    // 6. Email disponible → envoyer OTP
    await fetch("http://localhost:5000/users/send-otp", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email: form.email }),
    });

    setLoading(false);
    setStep(2);
  };

  // ──────────────────────────────────────────
  // ÉTAPE 2 — Vérifier OTP puis créer compte
  // ──────────────────────────────────────────
  const handleVerifyOtp = async () => {
    setOtpError("");
    setLoading(true);

    // 1. Vérifier le code OTP
    const verifyRes = await fetch("http://localhost:5000/users/verify-otp", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email: form.email, code: otpCode }),
    });

    if (!verifyRes.ok) {
      const err = await verifyRes.json();
      setOtpError(err.message || "Code invalide");
      setLoading(false);
      return;
    }

    // 2. OTP correct → créer le compte
    const res = await fetch("http://localhost:5000/users", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        firstName: form.firstName,
        lastName:  form.lastName,
        phone:     form.phone,
        email:     form.email,
        password:  form.password,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Une erreur est survenue lors de la création du compte");
      return;
    }

    alert("Inscription réussie ✅");
    window.location.href = "/auth/login";
  };

  // ──────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-12 space-y-8">

        {/* Logo */}
        <div className="flex justify-center">
          <Image src="/logo.png" alt="Logo" width={200} height={200} />
        </div>

        {/* ══════════ ÉTAPE 1 : FORMULAIRE ══════════ */}
        {step === 1 && (
          <>
            {/* Google */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/Dashbord-candidat" })}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition"
            >
              <Image src="/gog.png" alt="Google" width={22} height={22} />
              <span className="text-gray-700">Inscrivez-vous avec Google</span>
            </button>

            <div className="flex items-center gap-3">
              <hr className="flex-1 border-gray-200" />
              <span className="text-gray-400 text-sm">ou</span>
              <hr className="flex-1 border-gray-200" />
            </div>

            <div className="space-y-5">

              {/* PRÉNOM */}
              <div>
                <label className="block mb-1 font-semibold text-gray-800">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border border-gray-300 rounded-xl px-4 focus-within:border-red-400 transition">
                  <FaUser className="text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Votre prénom"
                    value={form.firstName}
                    className="w-full py-3 outline-none text-gray-800"
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  />
                </div>
              </div>

              {/* NOM */}
              <div>
                <label className="block mb-1 font-semibold text-gray-800">
                  Nom <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border border-gray-300 rounded-xl px-4 focus-within:border-red-400 transition">
                  <FaUser className="text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Votre nom"
                    value={form.lastName}
                    className="w-full py-3 outline-none text-gray-800"
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  />
                </div>
              </div>

              {/* TÉLÉPHONE */}
              <div>
                <label className="block mb-1 font-semibold text-gray-800">Téléphone</label>
                <div className="flex items-center border border-gray-300 rounded-xl px-4 focus-within:border-red-400 transition">
                  <FaPhone className="text-gray-400 mr-3" />
                  <input
                    type="tel"
                    placeholder="Votre numéro"
                    value={form.phone}
                    className="w-full py-3 outline-none text-gray-800"
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="block mb-1 font-semibold text-gray-800">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <div className={`flex items-center border rounded-xl px-4 focus-within:border-red-400 transition ${errors.email ? "border-red-400" : "border-gray-300"}`}>
                  <FaEnvelope className="text-gray-400 mr-3" />
                  <input
                    type="email"
                    placeholder="exemple@email.com"
                    value={form.email}
                    className="w-full py-3 outline-none text-gray-800"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">⚠ {errors.email}</p>
                )}
              </div>

              {/* MOT DE PASSE */}
              <div>
                <label className="block mb-1 font-semibold text-gray-800">
                  Mot de passe <span className="text-red-500">*</span>
                </label>
                <div className={`flex items-center border rounded-xl px-4 focus-within:border-red-400 transition ${errors.password ? "border-red-400" : "border-gray-300"}`}>
                  <FaLock className="text-gray-400 mr-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 8 caractères"
                    value={form.password}
                    className="w-full py-3 outline-none text-gray-800"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEye className="text-gray-400" /> : <FaEyeSlash className="text-gray-400" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">⚠ {errors.password}</p>
                )}
              </div>

              {/* CONFIRMER MOT DE PASSE */}
              <div>
                <label className="block mb-1 font-semibold text-gray-800">
                  Confirmer mot de passe <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border border-gray-300 rounded-xl px-4 focus-within:border-red-400 transition">
                  <FaLock className="text-gray-400 mr-3" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Répétez votre mot de passe"
                    value={form.confirmPassword}
                    className="w-full py-3 outline-none text-gray-800"
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <FaEye className="text-gray-400" /> : <FaEyeSlash className="text-gray-400" />}
                  </button>
                </div>
              </div>

              {/* BOUTON S'INSCRIRE */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                type="button"
                className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Vérification en cours..." : "S'inscrire"}
              </button>
            </div>

            <p className="text-center text-sm text-gray-600">
              Déjà un compte ?{" "}
              <Link href="/auth/login" className="text-red-600 hover:underline font-medium">
                Se connecter
              </Link>
            </p>
          </>
        )}

        {/* ══════════ ÉTAPE 2 : CODE OTP ══════════ */}
        {step === 2 && (
          <div className="space-y-6 text-center">

            <div className="text-6xl">📧</div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">Vérifiez votre email</h2>
              <p className="text-gray-500 mt-2">
                Un code à 6 chiffres a été envoyé à
              </p>
              <p className="font-semibold text-gray-800 mt-1">{form.email}</p>
            </div>

            {/* Champ OTP */}
            <input
              type="text"
              maxLength={6}
              value={otpCode}
              placeholder="- - - - - -"
              className="w-full text-center text-3xl font-bold tracking-[1rem] border-2 border-gray-300 rounded-xl py-5 outline-none focus:border-red-500 transition"
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
            />

            {otpError && (
              <p className="text-red-500 text-sm">⚠ {otpError}</p>
            )}

            {/* BOUTON CONFIRMER */}
            <button
              onClick={handleVerifyOtp}
              disabled={loading || otpCode.length !== 6}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Vérification..." : "Confirmer le code"}
            </button>

            {/* Retour */}
            <button
              onClick={() => { setStep(1); setOtpCode(""); setOtpError(""); }}
              className="text-sm text-gray-500 hover:text-gray-700 hover:underline transition"
            >
              ← Modifier mon email
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
