import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCategory } from "@/data/catalog-meta";
import { products } from "@/data/products";
import { ShopBreadcrumb, ShopClient } from "../ShopClient";

export async function generateStaticParams() {
  return [...new Set(products.map((p) => p.category))].map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) return { title: "Catégorie" };
  return { title: c.name, description: c.description };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) notFound();
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <ShopBreadcrumb trail={[{ label: "Accueil", href: "/" }, { label: "Shop", href: "/shop" }, { label: c.name }]} />
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{c.name}</h1>
      <p className="mb-6 mt-2 max-w-2xl text-ink-500">{c.description}</p>
      <Suspense fallback={<p className="py-10 text-center text-ink-500">Chargement…</p>}>
        <ShopClient presetCategories={[c.slug]} title={c.name} description={c.description} />
      </Suspense>
    </main>
  );
}
