import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollection } from "@/data/catalog-meta";
import { products } from "@/data/products";
import { applyCollection } from "@/repositories/mockCatalog";
import { ProductCard } from "@/components/ProductCard";

export async function generateStaticParams() {
  const { collections } = await import("@/data/catalog-meta");
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCollection(slug);
  return c ? { title: c.title, description: c.description } : { title: "Collection" };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) notFound();
  const items = applyCollection(products, slug);
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <nav aria-label="Fil d'Ariane" className="mb-3 text-sm text-ink-500">
        <Link href="/" className="hover:underline">Accueil</Link> / <Link href="/collections" className="hover:underline">Collections</Link> / <span aria-current="page" className="font-medium text-ink-950">{c.title}</span>
      </nav>
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{c.title}</h1>
      <p className="mb-6 mt-2 max-w-2xl text-ink-500">{c.description} — {items.length} produit{items.length > 1 ? "s" : ""}.</p>
      {items.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-ink-200 bg-white p-10 text-center text-ink-500">Aucun produit dans cette collection pour l&apos;instant.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
