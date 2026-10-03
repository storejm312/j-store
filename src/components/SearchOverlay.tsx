"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { brands } from "@/data/catalog-meta";
import { products } from "@/data/products";
import { searchProducts } from "@/repositories/mockCatalog";
import { productFromPrice } from "@/types";
import { formatUSD } from "@/config/site";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setQ("");
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open ]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const results = useMemo(() => searchProducts(products, q).slice(0, 7), [q]);

  if (!open) return null;

  const submit = () => {
    onClose();
    router.push(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search");
  };

  return (
    <div className="fixed inset-0 z-[60] bg-white" role="dialog" aria-modal="true" aria-label="Recherche">
      <div className="mx-auto max-w-2xl px-5 pt-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex items-center gap-3 border-b-2 border-ink-950 pb-3"
        >
          <span aria-hidden="true" className="text-xl text-ink-400">⌕</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un produit, une marque…"
            aria-label="Rechercher un produit"
            className="w-full bg-transparent text-lg outline-none placeholder:text-ink-400"
          />
          <button type="button" onClick={onClose} aria-label="Fermer la recherche" className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 text-lg">
            ×
          </button>
        </form>

        {q.trim() === "" ? (
          <div className="py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">Marques populaires</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {brands.map((b) => (
                <Link
                  key={b.slug}
                  href={`/shop?brands=${b.slug}`}
                  onClick={onClose}
                  className="rounded-full border border-ink-200 px-4 py-2 text-sm font-medium hover:border-ink-950"
                >
                  {b.name}
                </Link>
              ))}
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">Recherches fréquentes</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["iPhone 16", "Galaxy", "Camon", "AirPods", "Moins de 300 $"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setQ(t)}
                  className="rounded-full bg-ink-100 px-4 py-2 text-sm font-medium hover:bg-ink-200"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-5xl" aria-hidden="true">○</p>
            <p className="mt-4 font-semibold">Aucun résultat pour « {q} »</p>
            <p className="mt-1 text-sm text-ink-500">Essayez « iPhone », « Camon » ou « AirPods ».</p>
            <button type="button" onClick={submit} className="mt-4 rounded-full bg-ink-950 px-6 py-2.5 text-sm font-medium text-white">
              Voir tout le catalogue
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-ink-100 py-2">
            {results.map((p) => {
              const f = productFromPrice(p);
              return (
                <li key={p.slug}>
                  <Link href={`/product/${p.slug}`} onClick={onClose} className="flex items-center justify-between gap-3 py-3 hover:bg-ink-50">
                    <span>
                      <span className="block font-medium">{p.name}</span>
                      <span className="block text-xs text-ink-500">{p.brand} · {p.category}</span>
                    </span>
                    <span className="text-sm font-semibold">{formatUSD(f.sale ?? f.price)}</span>
                  </Link>
                </li>
              );
            })}
            <li>
              <button type="button" onClick={submit} className="w-full py-3 text-center text-sm font-medium underline underline-offset-4">
                Voir tous les résultats
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
