"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

 const validatePassword = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password) ? "" : "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre";
};

  const handleSubmit = async () => {
    setErrors({ email: "", password: "" });

    // ✅ 1. CHECK EMAIL EN PREMIER
    if (form.email) {
      const checkRes = await fetch("http://localhost:5000/users/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (checkData.exists === true) {
          setErrors({ email: "Cet email est déjà utilisé", password: "" });
          return;
        }
      }
    }

    // ✅ 2. CHAMPS OBLIGATOIRES
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // ✅ 3. PASSWORD VALIDATION
    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setErrors({ email: "", password: passwordError });
      return;
    }

    // ✅ 4. CONFIRM PASSWORD
    if (form.password !== form.confirmPassword) {
      setErrors({ email: "", password: "Les mots de passe ne correspondent pas" });
      return;
    }

    // ✅ 5. CREATE USER
    try {
      const res = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.message === "EMAIL_EXISTS") {
          setErrors({ email: "Cet email est déjà utilisé", password: "" });
        } else {
          alert("Une erreur est survenue");
        }
        return;
      }

      alert("Inscription réussie ✅");
      setForm({ firstName: "", lastName: "", phone: "", email: "", password: "", confirmPassword: "" });

    } catch (err) {
      console.error("NETWORK ERROR:", err);
      alert("Erreur réseau ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-12 space-y-8">

        <div className="flex justify-center">
          <Image src="/logo.png" alt="Logo" width={300} height={300} />
        </div>

        <button 
        onClick={() => signIn("google", { callbackUrl: "/Dashbord-candidat" })}
        className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition">
          <Image src="/gog.png" alt="Google" width={22} height={22} />
          <span className="text-gray-700">Inscrivez-vous avec Google</span>
        </button>

        <div className="space-y-6">

          {/* PRENOM */}
          <div>
            <label className="block mb-2 font-semibold text-gray-800">
              Prénom <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl px-4">
              <FaUser className="text-gray-400 mr-3" />
              <input
                type="text"
                value={form.firstName}
                className="w-full py-3 outline-none"
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
            </div>
          </div>

          {/* NOM */}
          <div>
            <label className="block mb-2 font-semibold text-gray-800">
              Nom <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl px-4">
              <FaUser className="text-gray-400 mr-3" />
              <input
                type="text"
                value={form.lastName}
                className="w-full py-3 outline-none"
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>
          </div>

          {/* TELEPHONE */}
          <div>
            <label className="block mb-2 font-semibold text-gray-800">
              Téléphone
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl px-4">
              <FaPhone className="text-gray-400 mr-3" />
              <input
                type="tel"
                value={form.phone}
                className="w-full py-3 outline-none"
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block mb-2 font-semibold text-gray-800">
              E-mail <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl px-4">
              <FaEnvelope className="text-gray-400 mr-3" />
              <input
                type="email"
                value={form.email}
                className="w-full py-3 outline-none"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block mb-2 font-semibold text-gray-800">
              Mot de passe
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl px-4">
              <FaLock className="text-gray-400 mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                className="w-full py-3 outline-none"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block mb-2 font-semibold text-gray-800">
              Confirmer mot de passe
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl px-4">
              <FaLock className="text-gray-400 mr-3" />
              <input
                type={showConfirm ? "text" : "password"}
                value={form.confirmPassword}
                className="w-full py-3 outline-none"
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            type="button"
            className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
          >
            S'inscrire
          </button>
        </div>

        <p className="text-center text-sm text-gray-600">
          Déjà un compte ?{" "}
          <Link href="/auth/login" className="text-red-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}