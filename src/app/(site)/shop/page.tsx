import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopBreadcrumb, ShopClient } from "./ShopClient";

export const metadata: Metadata = {
  title: "Catalogue",
  description: "Tous nos smartphones, tablettes, montres et accessoires. Filtrez par marque, prix, stockage et couleur.",
};

export default function ShopPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <ShopBreadcrumb trail={[{ label: "Accueil", href: "/" }, { label: "Shop" }]} />
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Catalogue</h1>
      <p className="mb-6 mt-2 max-w-2xl text-ink-500">
        Smartphones, tablettes, montres connectées et accessoires — 100 % authentiques, garantis 12 mois.
      </p>
      <Suspense fallback={<p className="py-10 text-center text-ink-500">Chargement du catalogue…</p>}>
        <ShopClient title="Catalogue" description="" />
      </Suspense>
    </main>
  );
}
