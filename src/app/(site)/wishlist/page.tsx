"use client";

import Link from "next/link";
import { productBySlug } from "@/data/products";
import { useWishlist } from "@/stores/wishlist";
import { ProductCard } from "@/components/ProductCard";

export default function WishlistPage() {
  const { slugs, clear } = useWishlist();
  const items = slugs.map((s) => productBySlug.get(s)).filter((p) => p !== undefined);

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6">
        <p className="text-6xl" aria-hidden="true">♡</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Aucun favori pour l&apos;instant</h1>
        <p className="mt-2 text-ink-500">Touchez le cœur sur un produit pour le retrouver ici.</p>
        <Link href="/shop" className="mt-6 inline-block rounded-full bg-ink-950 px-8 py-3 text-sm font-medium text-white">
          Explorer le catalogue
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <nav aria-label="Fil d'Ariane" className="mb-3 text-sm text-ink-500">
        <Link href="/" className="hover:underline">Accueil</Link> / <span aria-current="page" className="font-medium text-ink-950">Favoris ({items.length})</span>
      </nav>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Favoris</h1>
        <button type="button" onClick={clear} className="text-sm font-medium text-ink-500 underline underline-offset-4">
          Tout retirer
        </button>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </main>
  );
}
