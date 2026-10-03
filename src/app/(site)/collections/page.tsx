import Link from "next/link";
import type { Metadata } from "next";
import { collections } from "@/data/catalog-meta";
import { products } from "@/data/products";
import { applyCollection } from "@/repositories/mockCatalog";
import { ProductImage } from "@/components/ProductImage";

export const metadata: Metadata = {
  title: "Collections",
  description: "Nouveautés, best-sellers, premium, deals et sélections par univers.",
};

export default function CollectionsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <nav aria-label="Fil d'Ariane" className="mb-3 text-sm text-ink-500">
        <Link href="/" className="hover:underline">Accueil</Link> / <span aria-current="page" className="font-medium text-ink-950">Collections</span>
      </nav>
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Collections</h1>
      <p className="mb-6 mt-2 max-w-2xl text-ink-500">Nos sélections : nouveautés, meilleures ventes, premium et bonnes affaires.</p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => {
          const count = applyCollection(products, c.slug).length;
          const cover = c.image ?? applyCollection(products, c.slug)[0]?.images[0] ?? "";
          return (
            <li key={c.slug}>
              <Link href={`/collections/${c.slug}`} className="group block overflow-hidden rounded-3xl border border-ink-100 bg-white">
                <ProductImage src={cover} alt={c.title} brand="" sizes="(max-width: 768px) 100vw, 33vw" className="aspect-[16/10] w-full" />
                <div className="p-5">
                  <p className="text-xl font-semibold tracking-tight group-hover:underline">{c.title}</p>
                  <p className="mt-1 text-sm text-ink-500">{c.description}</p>
                  <p className="mt-2 text-sm font-medium">{count} produit{count > 1 ? "s" : ""} →</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
