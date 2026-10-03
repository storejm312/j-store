"use client";

import { useEffect, useMemo, useState } from "react";
import { orders as seed } from "@/data/reviews-orders";
import type { Order, OrderStatus } from "@/types";
import { formatUSD } from "@/config/site";

const STATUSES: OrderStatus[] = ["Nouvelle", "Confirmée", "Préparation", "Expédiée", "Livrée", "Annulée"];

function localOrders(): Order[] {
  try {
    const raw = localStorage.getItem("jmstore.orders.v1");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function AdminOrders() {
  const [items, setItems] = useState<Order[]>(seed);
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    setItems([...localOrders(), ...seed]);
  }, []);

  const filtered = useMemo(() => items.filter((o) => !status || o.status === status), [items, status]);

  const changeStatus = (id: string, s: OrderStatus) => {
    setItems((prev) => prev.map((o) => (o.id === id ? { ...o, status: s } : o)));
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Commandes ({filtered.length})</h1>
      <p className="text-sm text-ink-500">Changement de statut fonctionnel côté frontend (démo).</p>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filtrer par statut">
        <button type="button" onClick={() => setStatus("")} aria-pressed={!status} className={`rounded-full px-4 py-2 text-sm font-medium ${!status ? "bg-ink-950 text-white" : "border border-ink-200 bg-white"}`}>
          Toutes
        </button>
        {STATUSES.map((s) => (
          <button key={s} type="button" onClick={() => setStatus(s)} aria-pressed={status === s} className={`rounded-full px-4 py-2 text-sm font-medium ${status === s ? "bg-ink-950 text-white" : "border border-ink-200 bg-white"}`}>
            {s}
          </button>
        ))}
      </div>

      <ul className="mt-4 space-y-3">
        {filtered.map((o) => (
          <li key={o.id} className="rounded-2xl border border-ink-100 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono font-bold">#{o.id} <span className="font-sans text-xs font-normal text-ink-500">{o.date}</span></p>
              <label className="flex items-center gap-2 text-sm">
                <span className="sr-only">Statut de la commande {o.id}</span>
                <select value={o.status} onChange={(e) => changeStatus(o.id, e.target.value as OrderStatus)} className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold">
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>
            <p className="mt-1 text-sm"><strong>{o.customer.name}</strong> · {o.customer.phone} · {o.customer.city}</p>
            <p className="text-sm text-ink-500">{o.deliveryMode} · {o.paymentMode} · <strong className="text-ink-950">{formatUSD(o.totalUSD)}</strong></p>
            <button type="button" onClick={() => setOpen(open === o.id ? null : o.id)} aria-expanded={open === o.id} className="mt-2 text-sm font-medium underline underline-offset-4">
              {open === o.id ? "Masquer le détail" : "Voir le détail"}
            </button>
            {open === o.id && (
              <ul className="mt-2 space-y-1 rounded-xl bg-ink-50 p-3 text-sm">
                {o.items.map((i) => (
                  <li key={i.productName + i.variantLabel} className="flex justify-between gap-2">
                    <span>{i.productName} ({i.variantLabel}) x{i.qty}</span>
                    <span className="font-semibold">{formatUSD(i.unitPriceUSD * i.qty)}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      {filtered.length === 0 && <p className="mt-4 rounded-2xl bg-white p-8 text-center text-ink-500">Aucune commande avec ce statut.</p>}
    </div>
  );
}
