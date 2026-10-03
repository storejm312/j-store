import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchClient } from "./SearchClient";

export const metadata: Metadata = {
  title: "Recherche",
  description: "Recherchez un produit, une marque ou une catégorie.",
};

export default function SearchPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <Suspense fallback={<p className="py-10 text-center text-ink-500">Chargement…</p>}>
        <SearchClient />
      </Suspense>
    </main>
  );
}
