import type { Metadata } from "next";
import Link from "next/link";
import { AdminGuard, AdminLogout } from "@/components/AdminGuard";
import { SiteLogo } from "@/components/SiteLogo";

export const metadata: Metadata = {
  title: {
    default: "Administration",
    template: "%s · Admin JM Store",
  },
};

const NAV = [
  { label: "Dashboard", href: "/admin" },
  { label: "Produits", href: "/admin/products" },
  { label: "Commandes", href: "/admin/orders" },
  { label: "Clients", href: "/admin/customers" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-50">
      <div className="bg-ink-950 py-2 text-center text-xs font-semibold uppercase tracking-widest text-amber-300">
        Espace d&apos;administration JM Store
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row md:px-6">
        <aside className="shrink-0 md:w-56" aria-label="Navigation admin">
          <div className="flex items-center justify-between md:block">
            <Link href="/" className="flex items-center gap-2" aria-label="Retour au site">
              <SiteLogo size={36} />
              <span className="font-semibold">Admin</span>
            </Link>
            <Link href="/" className="text-sm font-medium underline md:mt-1 md:block">← Voir le site</Link>
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto md:flex-col" aria-label="Sections admin">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="shrink-0 rounded-xl bg-white px-4 py-2.5 text-sm font-medium hover:bg-ink-950 hover:text-white">
                {n.label}
              </Link>
            ))}
            <AdminLogout />
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <AdminGuard>{children}</AdminGuard>
        </div>
      </div>
    </div>
  );
}
