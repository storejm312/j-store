"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { products } from "@/data/products";
import { buildFacets, filterProducts, paginate } from "@/repositories/mockCatalog";
import type { SortKey } from "@/repositories/types";
import { EMPTY_FILTERS, FilterPanel, type FilterState } from "@/components/Filters";
import { ProductCard } from "@/components/ProductCard";

const PER_PAGE = 12;

const SORTS: { value: SortKey; label: string }[] = [
  { value: "pertinence", label: "Pertinence" },
  { value: "prix-croissant", label: "Prix croissant" },
  { value: "prix-decroissant", label: "Prix décroissant" },
  { value: "nouveautes", label: "Nouveautés" },
  { value: "meilleures-ventes", label: "Meilleures ventes" },
  { value: "meilleures-notes", label: "Meilleures notes" },
];

function splitParam(v: string | null): string[] {
  return v ? v.split(",").filter(Boolean) : [];
}

export function ShopClient({ presetCategories = [] as string[], title, description }: { presetCategories?: string[]; title: string; description: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>(() => ({
    ...EMPTY_FILTERS,
    brands: splitParam(searchParams.get("brands")),
    categories: [...presetCategories, ...splitParam(searchParams.get("categories"))],
    minPrice: searchParams.get("min") ? Number(searchParams.get("min")) : undefined,
    maxPrice: searchParams.get("max") ? Number(searchParams.get("max")) : undefined,
    storages: splitParam(searchParams.get("storages")),
    onlyPromo: searchParams.get("promo") === "1",
  }));
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [sort, setSort] = useState<SortKey>((searchParams.get("sort") as SortKey) || "pertinence");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  // Verrouille le scroll quand le drawer mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Synchronise l'URL (partageable) sans recharger
  useEffect(() => {
    const p = new URLSearchParams();
    if (filters.brands.length) p.set("brands", filters.brands.join(","));
    if (filters.categories.filter((c) => !presetCategories.includes(c)).length)
      p.set("categories", filters.categories.filter((c) => !presetCategories.includes(c)).join(","));
    if (q.trim()) p.set("q", q.trim());
    if (filters.minPrice !== undefined) p.set("min", String(filters.minPrice));
    if (filters.maxPrice !== undefined) p.set("max", String(filters.maxPrice));
    if (filters.storages.length) p.set("storages", filters.storages.join(","));
    if (filters.rams.length) p.set("rams", filters.rams.join(","));
    if (filters.colors.length) p.set("colors", filters.colors.join(","));
    if (filters.conditions.length) p.set("conditions", filters.conditions.join(","));
    if (filters.onlyPromo) p.set("promo", "1");
    if (filters.onlyInStock) p.set("stock", "1");
    if (sort !== "pertinence") p.set("sort", sort);
    if (page > 1) p.set("page", String(page));
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, q, sort, page]);

  // Reset page quand les critères changent
  useEffect(() => {
    setPage(1);
  }, [filters, q, sort]);

  const facets = useMemo(() => buildFacets(products), []);
  const filtered = useMemo(
    () =>
      filterProducts(products, {
        search: q || undefined,
        brands: filters.brands,
        categories: filters.categories,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        storages: filters.storages,
        rams: filters.rams,
        colors: filters.colors,
        conditions: filters.conditions,
        onlyPromo: filters.onlyPromo,
        onlyInStock: filters.onlyInStock,
        sort,
      }),
    [filters, q, sort]
  );
  const { items, total, pages } = paginate(filtered, page, PER_PAGE);

  return (
    <div>
      {/* Barre d'outils */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="rounded-full border border-ink-200 px-5 py-2.5 text-sm font-medium lg:hidden"
        >
          Filtres
        </button>
        <form
          className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2.5"
          onSubmit={(e) => e.preventDefault()}
          role="search"
        >
          <span aria-hidden="true" className="text-ink-400">⌕</span>
          <label htmlFor="shop-q" className="sr-only">Rechercher dans le catalogue</label>
          <input
            id="shop-q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher…"
            className="w-full bg-transparent text-sm outline-none"
          />
          {q && (
            <button type="button" onClick={() => setQ("")} aria-label="Effacer la recherche" className="text-ink-400">×</button>
          )}
        </form>
        <label className="sr-only" htmlFor="shop-sort">Trier par</label>
        <select
          id="shop-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-full border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium outline-none"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <p className="mb-4 text-sm text-ink-500" role="status">
        {total} produit{total > 1 ? "s" : ""} {title.toLowerCase().includes("catalogue") ? "" : `— ${title}`}
      </p>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block" aria-label="Filtres">
          <div className="sticky top-24 rounded-2xl border border-ink-100 bg-white p-5">
            <FilterPanel facets={facets} filters={filters} onChange={setFilters} onClear={() => setFilters({ ...EMPTY_FILTERS, categories: presetCategories })} />
          </div>
        </aside>

        <div>
          {items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-ink-200 bg-white px-6 py-16 text-center">
              <p className="text-4xl" aria-hidden="true">○</p>
              <p className="mt-3 text-lg font-semibold">Aucun produit ne correspond à vos filtres</p>
              <p className="mt-1 text-sm text-ink-500">Essayez d&apos;élargir le prix ou de retirer un filtre.</p>
              <button
                type="button"
                onClick={() => { setFilters({ ...EMPTY_FILTERS, categories: presetCategories }); setQ(""); }}
                className="mt-4 rounded-full bg-ink-950 px-6 py-2.5 text-sm font-medium text-white"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
              {items.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}

          {pages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => { setPage(page - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="rounded-full border border-ink-200 px-4 py-2 text-sm font-medium disabled:opacity-40"
              >
                ← Précédent
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  aria-current={n === page ? "page" : undefined}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium ${n === page ? "bg-ink-950 text-white" : "border border-ink-200"}`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                disabled={page >= pages}
                onClick={() => { setPage(page + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="rounded-full border border-ink-200 px-4 py-2 text-sm font-medium disabled:opacity-40"
              >
                Suivant →
              </button>
            </nav>
          )}
        </div>
      </div>

      {/* Drawer mobile */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Filtres">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-lg font-semibold">Filtres</p>
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Fermer les filtres" className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 text-lg">×</button>
            </div>
            <FilterPanel facets={facets} filters={filters} onChange={setFilters} onClear={() => setFilters({ ...EMPTY_FILTERS, categories: presetCategories })} />
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="sticky bottom-0 mt-4 w-full rounded-full bg-ink-950 py-3.5 text-sm font-medium text-white"
            >
              Voir {total} produit{total > 1 ? "s" : ""}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ShopBreadcrumb({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="mb-3 text-sm text-ink-500">
      <ol className="flex flex-wrap gap-1.5">
        {trail.map((t, i) => (
          <li key={t.label} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {t.href ? <Link href={t.href} className="hover:underline">{t.label}</Link> : <span aria-current="page" className="font-medium text-ink-950">{t.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
