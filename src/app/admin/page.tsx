import Link from "next/link";
import type { Metadata } from "next";
import { customers, orders } from "@/data/reviews-orders";
import { products } from "@/data/products";
import { formatUSD } from "@/config/site";
import { productFromPrice } from "@/types";

export const metadata: Metadata = { title: "Dashboard" };

const WEEK = [
  { day: "Lun", value: 1840 },
  { day: "Mar", value: 2420 },
  { day: "Mer", value: 1310 },
  { day: "Jeu", value: 2980 },
  { day: "Ven", value: 3540 },
  { day: "Sam", value: 4210 },
  { day: "Dim", value: 1980 },
];

export default function AdminHome() {
  const revenue = orders.filter((o) => o.status !== "Annulée").reduce((s, o) => s + o.totalUSD, 0);
  const lowStock = products
    .map((p) => ({ p, stock: productFromPrice(p).stock }))
    .filter((x) => x.stock <= 5)
    .slice(0, 5);
  const max = Math.max(...WEEK.map((w) => w.value));

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-sm text-ink-500">Données simulées — aperçu de la future interface réelle.</p>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Chiffre d'affaires", formatUSD(revenue * 14)],
          ["Commandes", String(orders.length * 21)],
          ["Clients", String(customers.length * 34)],
          ["Produits", String(products.length)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-ink-100 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-400">{k}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-ink-100 bg-white p-5" aria-label="Ventes de la semaine">
          <h2 className="font-semibold">Ventes — 7 derniers jours (USD)</h2>
          <div className="mt-4 flex h-40 items-end gap-2" role="img" aria-label="Graphique des ventes hebdomadaires">
            {WEEK.map((w) => (
              <div key={w.day} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full flex-1 items-end rounded-lg bg-ink-50">
                  <div className="w-full rounded-lg bg-ink-950" style={{ height: `${Math.round((w.value / max) * 100)}%` }} title={`${w.day} : $${w.value}`} />
                </div>
                <span className="text-xs text-ink-500">{w.day}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-ink-100 bg-white p-5" aria-label="Stock faible">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Stock faible</h2>
            <Link href="/admin/products" className="text-sm font-medium underline">Gérer</Link>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {lowStock.map(({ p, stock }) => (
              <li key={p.slug} className="flex justify-between">
                <span className="font-medium">{p.name}</span>
                <span className="font-semibold text-amber-700">{stock} restants</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-4 rounded-2xl border border-ink-100 bg-white p-5" aria-label="Dernières commandes">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Dernières commandes</h2>
          <Link href="/admin/orders" className="text-sm font-medium underline">Tout voir</Link>
        </div>
        <ul className="mt-3 divide-y divide-ink-100 text-sm">
          {orders.slice(0, 5).map((o) => (
            <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
              <span className="font-mono font-bold">#{o.id}</span>
              <span className="text-ink-500">{o.customer.name}</span>
              <span className="font-semibold">{formatUSD(o.totalUSD)}</span>
              <span className="rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-semibold">{o.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
