"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { demoUser, orders as mockOrders } from "@/data/reviews-orders";
import { productBySlug } from "@/data/products";
import { useWishlist } from "@/stores/wishlist";
import type { Order } from "@/types";
import { formatUSD } from "@/config/site";
import { ProductCard } from "@/components/ProductCard";

const TABS = ["Profil", "Commandes", "Favoris", "Adresses", "Paramètres"] as const;

function localOrders(): Order[] {
  try {
    const raw = localStorage.getItem("jmstore.orders.v1");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function AccountPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Profil");
  const [mine, setMine] = useState<Order[]>([]);
  const { slugs } = useWishlist();
  const [settings, setSettings] = useState({ whatsappNotif: true, newsletter: true });

  useEffect(() => {
    setMine(localOrders());
  }, [tab]);

  const history = [...mine, ...mockOrders.filter((o) => o.customer.name === demoUser.name)];
  const favs = slugs.map((s) => productBySlug.get(s)).filter((p) => p !== undefined);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <nav aria-label="Fil d'Ariane" className="mb-3 text-sm text-ink-500">
        <Link href="/" className="hover:underline">Accueil</Link> / <span aria-current="page" className="font-medium text-ink-950">Mon compte</span>
      </nav>
      <p className="inline-block rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest">Démonstration — utilisateur fictif</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Bonjour, {demoUser.name.split(" ")[0]}</h1>

      <div className="mt-5 flex gap-2 overflow-x-auto" role="tablist" aria-label="Sections du compte">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium ${tab === t ? "bg-ink-950 text-white" : "border border-ink-200"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "Profil" && (
          <section className="max-w-xl rounded-3xl border border-ink-100 bg-white p-6" aria-label="Profil">
            <dl className="divide-y divide-ink-100 text-sm">
              {[["Nom", demoUser.name], ["Téléphone", demoUser.phone], ["WhatsApp", demoUser.whatsapp], ["E-mail", demoUser.email], ["Ville", demoUser.city], ["Membre depuis", demoUser.memberSince]].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2.5">
                  <dt className="text-ink-500">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <button type="button" onClick={() => alert("Maquette : modification du profil désactivée en démonstration.")} className="mt-4 rounded-full border border-ink-200 px-6 py-2.5 text-sm font-medium">
              Modifier le profil
            </button>
          </section>
        )}

        {tab === "Commandes" && (
          <section aria-label="Commandes">
            {history.length === 0 ? (
              <p className="rounded-3xl border border-dashed border-ink-200 bg-white p-10 text-center text-ink-500">
                Aucune commande passée pendant cette session. <Link href="/shop" className="font-medium text-ink-950 underline">Voir le catalogue</Link>
              </p>
            ) : (
              <ul className="space-y-3">
                {history.map((o) => (
                  <li key={o.id} className="rounded-2xl border border-ink-100 bg-white p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-mono font-bold">#{o.id}</p>
                      <span className="rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold">{o.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-ink-500">{o.date} · {o.items.map((i) => `${i.productName} x${i.qty}`).join(", ")}</p>
                    <p className="mt-1 text-sm font-semibold">Total : {formatUSD(o.totalUSD)} · {o.deliveryMode}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {tab === "Favoris" && (
          <section aria-label="Favoris">
            {favs.length === 0 ? (
              <p className="rounded-3xl border border-dashed border-ink-200 bg-white p-10 text-center text-ink-500">
                Aucun favori. <Link href="/wishlist" className="font-medium text-ink-950 underline">Voir mes favoris</Link>
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {favs.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            )}
          </section>
        )}

        {tab === "Adresses" && (
          <section className="max-w-xl rounded-3xl border border-ink-100 bg-white p-6" aria-label="Adresses">
            <p className="font-semibold">Adresse principale</p>
            <p className="mt-1 text-sm text-ink-700">{demoUser.address}<br />{demoUser.city}</p>
            <button type="button" onClick={() => alert("Maquette : gestion des adresses désactivée en démonstration.")} className="mt-4 rounded-full border border-ink-200 px-6 py-2.5 text-sm font-medium">
              Ajouter une adresse
            </button>
          </section>
        )}

        {tab === "Paramètres" && (
          <section className="max-w-xl rounded-3xl border border-ink-100 bg-white p-6" aria-label="Paramètres">
            <label className="flex cursor-pointer items-center justify-between py-3 text-sm font-medium">
              Notifications WhatsApp
              <input type="checkbox" checked={settings.whatsappNotif} onChange={(e) => setSettings({ ...settings, whatsappNotif: e.target.checked })} className="h-5 w-5 accent-black" />
            </label>
            <label className="flex cursor-pointer items-center justify-between border-t border-ink-100 py-3 text-sm font-medium">
              Newsletter mensuelle
              <input type="checkbox" checked={settings.newsletter} onChange={(e) => setSettings({ ...settings, newsletter: e.target.checked })} className="h-5 w-5 accent-black" />
            </label>
            <p className="mt-2 text-xs text-ink-500">Préférences stockées localement (démonstration).</p>
          </section>
        )}
      </div>
    </main>
  );
}
