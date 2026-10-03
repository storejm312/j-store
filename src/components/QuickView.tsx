"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createContext, useContext } from "react";
import { productBySlug } from "@/data/products";
import { getBrand } from "@/data/catalog-meta";
import { useCart } from "@/stores/cart";
import type { Product } from "@/types";
import { productFromPrice, variantLabel, variantPrice } from "@/types";
import { Price } from "./Price";
import { ProductImage, Stars } from "./ProductImage";

// ─── Contexte global d'aperçu rapide ────────────────────────────────
const QuickViewContext = createContext<{ open: (slug: string) => void }>({ open: () => {} });
export const useQuickView = () => useContext(QuickViewContext);

export function QuickViewProvider({ children }: { children: React.ReactNode }) {
  const [slug, setSlug] = useState<string | null>(null);
  const value = useMemo(() => ({ open: (s: string) => setSlug(s) }), []);
  return (
    <QuickViewContext.Provider value={value}>
      {children}
      {slug && <QuickViewModal slug={slug} onClose={() => setSlug(null)} />}
    </QuickViewContext.Provider>
  );
}

function QuickViewModal({ slug, onClose }: { slug: string; onClose: () => void }) {
  const product: Product | undefined = productBySlug.get(slug);
  const { add } = useCart();
  const colors = useMemo(() => [...new Set((product?.variants ?? []).map((v) => v.color))], [product]);
  const [color, setColor] = useState<string | null>(null);
  const [storage, setStorage] = useState<string | null>(null);

  if (!product) return null;
  const activeColor = color ?? colors[0];
  const storages = [...new Set(product.variants.filter((v) => v.color === activeColor && v.storage).map((v) => v.storage as string))];
  const activeStorage = storages.length > 0 ? (storage && storages.includes(storage) ? storage : storages[0]) : undefined;
  const variant =
    product.variants.find((v) => v.color === activeColor && (activeStorage === undefined || v.storage === activeStorage)) ??
    product.variants[0];
  const brand = getBrand(product.brand)?.name ?? product.brand;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Aperçu ${product.name}`}
      onClick={onClose}
    >
      <div
        className="fade-up grid max-h-[92vh] w-full max-w-2xl grid-cols-1 overflow-y-auto rounded-t-3xl bg-white p-5 sm:rounded-3xl sm:p-6 md:grid-cols-2 md:gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <ProductImage src={variant.image || product.images[0] || ""} alt={product.name} brand={product.brand} className="aspect-square w-full rounded-2xl" />
        <div className="flex flex-col gap-3 pt-4 md:pt-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-400">{brand}</p>
              <h2 className="text-xl font-semibold tracking-tight">{product.name}</h2>
              <Stars rating={product.rating} />
            </div>
            <button type="button" onClick={onClose} aria-label="Fermer l'aperçu" className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 text-lg leading-none">
              ×
            </button>
          </div>
          <Price price={variant.priceUSD} sale={variant.salePriceUSD} size="lg" />
          <p className={`text-sm font-medium ${variant.stock > 0 ? "text-emerald-600" : "text-red-600"}`}>
            {variant.stock > 0 ? `En stock (${variant.stock} disponibles)` : "Rupture de stock"}
          </p>
          {colors.length > 1 && (
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-500">Couleur : {activeColor}</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => {
                  const v = product.variants.find((x) => x.color === c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => { setColor(c); setStorage(null); }}
                      aria-pressed={c === activeColor}
                      title={c}
                      className={`flex h-9 w-9 items-center justify-center rounded-full border-2 ${c === activeColor ? "border-ink-950" : "border-ink-100"}`}
                      style={{ backgroundColor: v?.colorHex ?? "#ddd" }}
                    />
                  );
                })}
              </div>
            </div>
          )}
          {storages.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-500">Stockage</p>
              <div className="flex flex-wrap gap-2">
                {storages.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStorage(s)}
                    aria-pressed={s === activeStorage}
                    className={`rounded-full border px-4 py-2 text-sm font-medium ${s === activeStorage ? "border-ink-950 bg-ink-950 text-white" : "border-ink-200"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          <button
            type="button"
            disabled={variant.stock <= 0}
            onClick={() => {
              add({ productSlug: product.slug, productName: product.name, brand, variant, variantLabel: variantLabel(variant) });
              onClose();
            }}
            className="mt-1 w-full rounded-full bg-ink-950 py-3 text-sm font-medium text-white hover:bg-ink-700 disabled:opacity-40"
          >
            Ajouter au panier — ${variantPrice(variant)}
          </button>
          <Link href={`/product/${product.slug}`} onClick={onClose} className="text-center text-sm font-medium underline underline-offset-4">
            Voir le produit complet
          </Link>
        </div>
      </div>
    </div>
  );
}
