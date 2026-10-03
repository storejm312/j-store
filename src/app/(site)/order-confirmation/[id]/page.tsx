"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig, formatCDF, formatUSD } from "@/config/site";
import { whatsappOrderLink } from "@/lib/whatsapp";
import type { Order } from "@/types";

function loadOrder(id: string): Order | null {
  try {
    const raw = localStorage.getItem("jmstore.orders.v1");
    const list: Order[] = raw ? JSON.parse(raw) : [];
    return list.find((o) => o.id === id) ?? null;
  } catch {
    return null;
  }
}

export default function ConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string>("");
  const [order, setOrder] = useState<Order | null>(null);
  const searchParams = useSearchParams();
  const name = searchParams.get("name") ?? "";
  const phone = searchParams.get("phone") ?? "";
  const delivery = searchParams.get("delivery") ?? "";
  const payment = searchParams.get("payment") ?? "";

  useEffect(() => {
    params.then((p) => {
      setId(p.id);
      setOrder(loadOrder(p.id));
    });
  }, [params]);

  const waHref = order
    ? whatsappOrderLink({
        orderId: `#${order.id}`,
        lines: order.items.map((i) => ({
          name: i.productName,
          variant: i.variantLabel,
          qty: i.qty,
          unitPriceUSD: i.unitPriceUSD,
        })),
        totalUSD: order.totalUSD,
        customerName: order.customer.name,
        customerPhone: order.customer.phone,
        deliveryMode: order.deliveryMode,
      })
    : "#";

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <div className="rounded-3xl border border-ink-100 bg-white p-6 text-center md:p-10">
        <p className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl" aria-hidden="true">✓</p>
        <p className="mt-3 inline-block rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest">Démonstration</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Commande confirmée</h1>
        <p className="mt-1 text-ink-500">
          Merci{name ? ` ${name}` : ""} ! Statut : <strong className="text-amber-700">En attente de confirmation</strong>.
        </p>
        <p className="mt-3 font-mono text-lg font-bold">#{id || "…"}</p>

        {order ? (
          <dl className="mx-auto mt-6 max-w-md space-y-2 text-left text-sm">
            <div className="flex justify-between border-b border-ink-100 py-2">
              <dt className="text-ink-500">Produits</dt>
              <dd className="text-right font-medium">
                {order.items.map((i) => (
                  <span key={i.productName + i.variantLabel} className="block">
                    {i.productName} ({i.variantLabel}) x{i.qty}
                  </span>
                ))}
              </dd>
            </div>
            <div className="flex justify-between border-b border-ink-100 py-2"><dt className="text-ink-500">Total</dt><dd className="font-semibold">{formatUSD(order.totalUSD)} · {formatCDF(order.totalUSD)}</dd></div>
            <div className="flex justify-between border-b border-ink-100 py-2"><dt className="text-ink-500">Client</dt><dd className="font-medium">{order.customer.name} · {order.customer.phone}</dd></div>
            <div className="flex justify-between border-b border-ink-100 py-2"><dt className="text-ink-500">Livraison</dt><dd className="font-medium">{order.deliveryMode}</dd></div>
            <div className="flex justify-between py-2"><dt className="text-ink-500">Paiement (démo)</dt><dd className="font-medium">{payment || order.paymentMode}</dd></div>
          </dl>
        ) : (
          <p className="mt-4 text-sm text-ink-500">
            Détail : {phone} · {delivery} · {payment} · {siteConfig.whatsappDisplay}
          </p>
        )}

        <a href={waHref} target="_blank" rel="noreferrer" className="mt-6 block rounded-full bg-whatsapp-500 py-3.5 text-sm font-semibold text-white hover:bg-whatsapp-600">
          Commander via WhatsApp
        </a>
        <p className="mt-2 text-xs text-ink-500">Le message contient n° de commande, produits, quantités, prix, total, nom et téléphone.</p>
        <div className="mt-4 flex justify-center gap-4 text-sm font-medium">
          <Link href="/shop" className="underline underline-offset-4">Continuer mes achats</Link>
          <Link href="/account" className="underline underline-offset-4">Voir mes commandes</Link>
        </div>
      </div>
    </main>
  );
}
