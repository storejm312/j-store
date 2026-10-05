import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/data/products";
import { ProductView } from "./ProductView";

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return { title: "Produit introuvable" };
  return {
    title: p.name,
    description: `${p.tagline} Garantie incluse, livraison à Kolwezi.`,
    openGraph: {
      title: `${p.name} · JM Store`,
      description: p.tagline,
      images: p.images[0] ? [p.images[0]] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <ProductView product={product} />
    </main>
  );
}
