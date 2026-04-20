"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleSubmit = async () => {
    setErrors({ email: "", password: "" });

    // ✅ champs obligatoires
    if (!form.email || !form.password) {
      setErrors({
        email: !form.email ? "Email obligatoire" : "",
        password: !form.password ? "Mot de passe obligatoire" : "",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.message === "EMAIL_NOT_FOUND") {
          setErrors({ email: "Email introuvable", password: "" });
        } else if (data?.message === "WRONG_PASSWORD") {
          setErrors({ email: "", password: "Mot de passe incorrect" });
        } else {
          setErrors({ email: "", password: "Une erreur est survenue" });
        }
        return;
      }

      // ✅ Sauvegarde token et user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Redirection selon le rôle
      if (data.user.role === "ADMIN") {
        router.push("/Dashbord-admin");
      } else {
        router.push("/Dashbord-candidat");
      }

    } catch (err) {
      console.error("NETWORK ERROR:", err);
      setErrors({ email: "", password: "Erreur réseau ❌" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 bg-red-600 px-2 py-1 rounded-lg hover:bg-gray-800 transition"
      >
        ←
      </button>

      <div className="flex flex-1 items-center justify-center px-5 py-20">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-12 relative space-y-8">

          <div className="absolute top-6 right-6">
            <a href="/auth/register">
              <button className="px-8 py-3 text-sm bg-white text-gray-800 rounded-xl border border-gray-300 shadow-md hover:shadow-lg hover:border-gray-400 transition">
                S'inscrire
              </button>
            </a>
          </div>

          <div className="flex flex-col items-center">
            <Image src="/logo.png" alt="Logo" width={300} height={300} />
          </div>

          <div className="flex justify-center">
            <button
  onClick={() => signIn("google", { callbackUrl: "/Dashbord-candidat" })}
  className="flex items-center justify-center gap-3 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition w-[80%]"
>
  <Image src="/gog.png" alt="Google" width={28} height={28} />
  <span className="text-gray-700 font-medium text-sm">
    Se connecter avec Google
  </span>
</button>
          </div>

          <div className="space-y-6">

            {/* EMAIL */}
            <div>
              <label className="block mb-2 font-semibold text-gray-800">E-mail</label>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                className="w-full p-4 border border-gray-300 rounded-xl outline-none"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block mb-2 font-semibold text-gray-800">Mot de passe</label>
              <div className="flex items-center border border-gray-300 rounded-xl px-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={form.password}
                  className="w-full py-3 outline-none"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEye className="text-gray-400" /> : <FaEyeSlash className="text-gray-400" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              <a href="reset-mail" className="text-sm text-gray-500 mt-3 hover:underline cursor-pointer">
                Mot de passe oublié ?
              </a>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                className="bg-red-600 text-white px-38 py-3 rounded-xl font-semibold hover:bg-red-700 transition mt-4"
              >
                SE CONNECTER
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 pb-6">
        © 2026 Staffing Tunisia. Tous droits réservés.
      </div>
    </div>
  );
}