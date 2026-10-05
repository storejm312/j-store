"use client";

import Link from "next/link";
import { formatCDF, formatUSD } from "@/config/site";
import { DELIVERY_FEE, FREE_SHIPPING_FROM, useCart } from "@/stores/cart";
import { ProductImage } from "@/components/ProductImage";

export default function CartPage() {
  const { lines, count, subtotalUSD, deliveryUSD, totalUSD, setQty, remove, clear } = useCart();

  if (lines.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6">
        <p className="text-6xl" aria-hidden="true">🛒</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Votre panier est vide</h1>
        <p className="mt-2 text-ink-500">Explorez le catalogue et trouvez le téléphone fait pour vous.</p>
        <Link href="/shop" className="mt-6 inline-block rounded-full bg-ink-950 px-8 py-3 text-sm font-medium text-white">
          Découvrir le catalogue
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <nav aria-label="Fil d'Ariane" className="mb-3 text-sm text-ink-500">
        <Link href="/" className="hover:underline">Accueil</Link> / <span aria-current="page" className="font-medium text-ink-950">Panier ({count})</span>
      </nav>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Panier</h1>
        <button type="button" onClick={clear} className="text-sm font-medium text-ink-500 underline underline-offset-4">
          Vider le panier
        </button>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <ul className="space-y-3">
          {lines.map((l) => (
            <li key={l.variantId} className="flex gap-4 rounded-2xl border border-ink-100 bg-white p-3">
              <Link href={`/product/${l.productSlug}`} className="w-24 shrink-0" aria-label={`Voir ${l.productName}`}>
                <ProductImage src={l.image} alt={l.productName} brand={l.brand} className="aspect-square w-full rounded-xl" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-400">{l.brand}</p>
                    <Link href={`/product/${l.productSlug}`} className="truncate font-medium hover:underline">
                      {l.productName}
                    </Link>
                    <p className="text-xs text-ink-500">{l.variantLabel}</p>
                  </div>
                  <button type="button" onClick={() => remove(l.variantId)} aria-label={`Supprimer ${l.productName}`} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-ink-100">
                    🗑
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center rounded-full border border-ink-200">
                    <button type="button" onClick={() => setQty(l.variantId, l.qty - 1)} aria-label="Diminuer" className="flex h-9 w-9 items-center justify-center">−</button>
                    <span className="w-7 text-center text-sm font-semibold" aria-live="polite">{l.qty}</span>
                    <button type="button" onClick={() => setQty(l.variantId, l.qty + 1)} aria-label="Augmenter" className="flex h-9 w-9 items-center justify-center">+</button>
                  </div>
                  <p className="font-semibold">{formatUSD(l.unitPriceUSD * l.qty)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-3xl border border-ink-100 bg-white p-6 lg:sticky lg:top-24" aria-label="Résumé">
          <h2 className="text-lg font-semibold">Résumé</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-500">Sous-total</dt>
              <dd className="font-medium">{formatUSD(subtotalUSD)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-500">Livraison Kolwezi</dt>
              <dd className="font-medium">{deliveryUSD === 0 ? "Offerte" : formatUSD(deliveryUSD)}</dd>
            </div>
            {deliveryUSD > 0 && (
              <p className="rounded-xl bg-ink-100 px-3 py-2 text-xs text-ink-700">
                Plus que {formatUSD(FREE_SHIPPING_FROM - subtotalUSD)} pour la livraison offerte ({formatUSD(DELIVERY_FEE)} sinon).
              </p>
            )}
            <div className="flex justify-between border-t border-ink-100 pt-3 text-base">
              <dt className="font-semibold">Total</dt>
              <dd className="font-semibold">{formatUSD(totalUSD)}</dd>
            </div>
            <p className="text-xs text-ink-500">≈ {formatCDF(totalUSD)}</p>
          </dl>
          <Link href="/checkout" className="mt-5 block rounded-full bg-ink-950 py-3.5 text-center text-sm font-medium text-white hover:bg-ink-700">
            Passer commande
          </Link>
          <Link href="/shop" className="mt-2 block text-center text-sm font-medium underline underline-offset-4">
            Continuer mes achats
          </Link>
        </aside>
      </div>
    </main>
  );
}
