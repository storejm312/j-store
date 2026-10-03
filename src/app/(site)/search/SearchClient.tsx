"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { products } from "@/data/products";
import { searchProducts } from "@/repositories/mockCatalog";
import { ProductCard } from "@/components/ProductCard";

export function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const results = useMemo(() => searchProducts(products, q), [q]);

  return (
    <div>
      <nav aria-label="Fil d'Ariane" className="mb-3 text-sm text-ink-500">
        <Link href="/" className="hover:underline">Accueil</Link> / <span aria-current="page" className="font-medium text-ink-950">Recherche</span>
      </nav>
      <h1 className="text-3xl font-semibold tracking-tight">Recherche</h1>
      <form
        className="mt-4 flex items-center gap-2 rounded-full border border-ink-200 bg-white px-5 py-3.5"
        onSubmit={(e) => {
          e.preventDefault();
          router.replace(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search", { scroll: false });
        }}
        role="search"
      >
        <span aria-hidden="true" className="text-lg text-ink-400">⌕</span>
        <label htmlFor="search-page-q" className="sr-only">Rechercher un produit</label>
        <input
          id="search-page-q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="iPhone, Galaxy, Camon, AirPods…"
          className="w-full bg-transparent outline-none"
        />
        {q && (
          <button type="button" onClick={() => setQ("")} aria-label="Effacer" className="text-ink-400">×</button>
        )}
      </form>

      {q.trim() === "" ? (
        <div className="mt-8 rounded-3xl border border-ink-100 bg-white p-10 text-center">
          <p className="text-lg font-semibold">Que cherchez-vous ?</p>
          <p className="mt-1 text-sm text-ink-500">Tapez un produit, une marque ou une catégorie.</p>
        </div>
      ) : results.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-ink-200 bg-white p-10 text-center">
          <p className="text-4xl" aria-hidden="true">○</p>
          <p className="mt-3 text-lg font-semibold">Aucun résultat pour « {q} »</p>
          <p className="mt-1 text-sm text-ink-500">Essayez « iPhone », « Camon » ou « AirPods ».</p>
          <Link href="/shop" className="mt-4 inline-block rounded-full bg-ink-950 px-6 py-2.5 text-sm font-medium text-white">
            Voir tout le catalogue
          </Link>
        </div>
      ) : (
        <div className="mt-6">
          <p className="mb-4 text-sm text-ink-500" role="status">{results.length} résultat{results.length > 1 ? "s" : ""} pour « {q} »</p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {results.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
