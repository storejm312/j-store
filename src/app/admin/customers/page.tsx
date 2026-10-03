"use client";

import { useState } from "react";
import { customers, orders } from "@/data/reviews-orders";
import { formatUSD } from "@/config/site";

export default function AdminCustomers() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Clients ({customers.length})</h1>
      <p className="text-sm text-ink-500">Données simulées — cliquez sur un client pour voir sa fiche.</p>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-100 bg-white">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-xs uppercase tracking-widest text-ink-400">
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Téléphone</th>
              <th className="px-4 py-3">Commandes</th>
              <th className="px-4 py-3">Total dépensé</th>
              <th className="px-4 py-3">Fiche</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {customers.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-medium">{c.name}<span className="block text-xs font-normal text-ink-500">{c.city}</span></td>
                <td className="px-4 py-3">{c.phone}</td>
                <td className="px-4 py-3">{c.ordersCount}</td>
                <td className="px-4 py-3 font-semibold">{formatUSD(c.totalSpentUSD)}</td>
                <td className="px-4 py-3">
                  <button type="button" onClick={() => setOpen(open === c.id ? null : c.id)} aria-expanded={open === c.id} className="rounded-full border border-ink-200 px-3 py-1 text-xs font-medium">
                    {open === c.id ? "Fermer" : "Voir"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label="Fiche client" onClick={() => setOpen(null)}>
          <div className="w-full max-w-md rounded-t-3xl bg-white p-6 sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const c = customers.find((x) => x.id === open)!;
              const history = orders.filter((o) => o.customer.phone === c.phone);
              return (
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">{c.name}</h2>
                      <p className="text-sm text-ink-500">{c.email}</p>
                    </div>
                    <button type="button" onClick={() => setOpen(null)} aria-label="Fermer la fiche" className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 text-lg">×</button>
                  </div>
                  <dl className="mt-3 space-y-1.5 text-sm">
                    <div className="flex justify-between"><dt className="text-ink-500">Téléphone</dt><dd className="font-medium">{c.phone}</dd></div>
                    <div className="flex justify-between"><dt className="text-ink-500">WhatsApp</dt><dd className="font-medium">{c.whatsapp}</dd></div>
                    <div className="flex justify-between"><dt className="text-ink-500">Ville</dt><dd className="font-medium">{c.city}</dd></div>
                    <div className="flex justify-between"><dt className="text-ink-500">Commandes</dt><dd className="font-medium">{c.ordersCount}</dd></div>
                    <div className="flex justify-between"><dt className="text-ink-500">Total dépensé</dt><dd className="font-semibold">{formatUSD(c.totalSpentUSD)}</dd></div>
                  </dl>
                  <h3 className="mt-4 font-semibold">Historique récent</h3>
                  {history.length === 0 ? (
                    <p className="mt-1 text-sm text-ink-500">Aucune commande sur la période affichée.</p>
                  ) : (
                    <ul className="mt-2 space-y-1.5 text-sm">
                      {history.map((o) => (
                        <li key={o.id} className="flex justify-between rounded-xl bg-ink-50 px-3 py-2">
                          <span className="font-mono">#{o.id} · {o.status}</span>
                          <span className="font-semibold">{formatUSD(o.totalUSD)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
