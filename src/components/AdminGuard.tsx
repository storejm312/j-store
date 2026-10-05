"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const ADMIN_KEY = "jmstore.admin.v1";
export const DEMO_ADMIN = { email: "admin@jmstore.cd", password: "jmstore2026" };

/** Protège l'espace admin côté frontend (maquette — vrai login avec Supabase Auth plus tard). */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ok, setOk] = useState(false);
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) {
      setOk(true);
      return;
    }
    let authed = false;
    try {
      authed = localStorage.getItem(ADMIN_KEY) === "1";
    } catch {
      /* stockage indisponible */
    }
    if (!authed) router.replace("/admin/login");
    else setOk(true);
  }, [isLogin, router]);

  if (isLogin) return <>{children}</>;
  if (!ok) {
    return <p className="py-10 text-center text-sm text-ink-500" role="status">Vérification de la session…</p>;
  }
  return <>{children}</>;
}

export function AdminLogout() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        try {
          localStorage.removeItem(ADMIN_KEY);
        } catch {
          /* stockage indisponible */
        }
        router.push("/admin/login");
      }}
      className="shrink-0 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium hover:border-red-300 hover:text-red-600"
    >
      Déconnexion
    </button>
  );
}
