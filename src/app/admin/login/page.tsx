"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ADMIN_KEY, DEMO_ADMIN } from "@/components/AdminGuard";
import { SiteLogo } from "@/components/SiteLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const inputCls = "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none focus:border-ink-950";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      try {
        localStorage.setItem(ADMIN_KEY, "1");
      } catch {
        /* stockage indisponible */
      }
      router.push("/admin");
    } else {
      setError("Identifiants incorrects. Utilisez le compte démo ci-dessous.");
    }
  };

  const fillDemo = () => {
    setEmail(DEMO_ADMIN.email);
    setPassword(DEMO_ADMIN.password);
    setError("");
  };

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-10">
      <Link href="/" className="mx-auto" aria-label="Retour au site">
        <SiteLogo size={64} />
      </Link>
      <h1 className="mt-4 text-center text-2xl font-semibold tracking-tight">Connexion admin</h1>
      <p className="mt-1 text-center text-sm text-ink-500">Pilotez votre boutique, même depuis votre téléphone.</p>

      <form onSubmit={submit} className="mt-6 rounded-3xl border border-ink-100 bg-white p-6">
        <div>
          <label htmlFor="admin-email" className="mb-1 block text-sm font-medium">E-mail</label>
          <input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@jmstore.cd" className={inputCls} autoComplete="username" />
        </div>
        <div className="mt-3">
          <label htmlFor="admin-password" className="mb-1 block text-sm font-medium">Mot de passe</label>
          <input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputCls} autoComplete="current-password" />
        </div>
        {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
        <button type="submit" className="mt-4 w-full rounded-full bg-ink-950 py-3.5 text-sm font-medium text-white hover:bg-ink-700">
          Se connecter
        </button>
        <button type="button" onClick={fillDemo} className="mt-2 w-full rounded-full border border-ink-200 py-3 text-sm font-medium">
          Remplir le compte démo
        </button>
      </form>

      <div className="mt-3 rounded-2xl bg-ink-100 p-4 text-center text-xs text-ink-700">
        <p className="font-semibold">Compte de démonstration</p>
        <p className="mt-1 font-mono">{DEMO_ADMIN.email} · {DEMO_ADMIN.password}</p>
      </div>
      <Link href="/" className="mt-4 text-center text-sm font-medium underline underline-offset-4">
        ← Retour au site
      </Link>
    </main>
  );
}
