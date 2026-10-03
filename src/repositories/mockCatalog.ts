import { getCollection } from "@/data/catalog-meta";
import { products } from "@/data/products";
import type { Collection, Product } from "@/types";
import { productFromPrice, variantPrice } from "@/types";
import type { CatalogRepository, Facets, ProductQuery, SortKey } from "./types";

function matchesCollection(p: Product, c: Collection): boolean {
  const f = c.filter;
  if (f.brands && !f.brands.includes(p.brand)) return false;
  if (f.categories && !f.categories.includes(p.category)) return false;
  if (f.isNew && !p.isNew) return false;
  if (f.isBestSeller && !p.isBestSeller) return false;
  if (f.isDeal && !p.isDeal) return false;
  const { price } = productFromPrice(p);
  if (f.maxPriceUSD !== undefined && price > f.maxPriceUSD) return false;
  if (f.minPriceUSD !== undefined && price < f.minPriceUSD) return false;
  return true;
}

export function applyCollection(all: Product[], slug: string): Product[] {
  const c = getCollection(slug);
  if (!c) return [];
  return all.filter((p) => matchesCollection(p, c));
}

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function searchProducts(all: Product[], q: string): Product[] {
  const query = norm(q.trim());
  if (!query) return all;
  const words = query.split(/\s+/);
  return all.filter((p) => {
    const hay = norm(
      [p.name, p.brand, p.category, p.tagline, ...p.variants.map((v) => `${v.color} ${v.storage ?? ""}`)].join(" ")
    );
    return words.every((w) => hay.includes(w));
  });
}

export function bestPrice(p: Product): number {
  const f = productFromPrice(p);
  return f.sale ?? f.price;
}

export function sortProducts(all: Product[], sort: SortKey = "pertinence"): Product[] {
  const arr = [...all];
  switch (sort) {
    case "prix-croissant":
      return arr.sort((a, b) => bestPrice(a) - bestPrice(b));
    case "prix-decroissant":
      return arr.sort((a, b) => bestPrice(b) - bestPrice(a));
    case "nouveautes":
      return arr.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "meilleures-ventes":
      return arr.sort((a, b) => b.reviewCount - a.reviewCount);
    case "meilleures-notes":
      return arr.sort((a, b) => b.rating - a.rating);
    default:
      return arr.sort(
        (a, b) =>
          Number(b.featured ?? false) - Number(a.featured ?? false) ||
          Number(b.isBestSeller ?? false) - Number(a.isBestSeller ?? false) ||
          b.rating - a.rating
      );
  }
}

export function filterProducts(all: Product[], q: ProductQuery): Product[] {
  let list = [...all];
  if (q.search) list = searchProducts(list, q.search);
  if (q.brands?.length) list = list.filter((p) => q.brands!.includes(p.brand));
  if (q.categories?.length) list = list.filter((p) => q.categories!.includes(p.category));
  if (q.conditions?.length) list = list.filter((p) => q.conditions!.includes(p.condition));
  if (q.onlyPromo) list = list.filter((p) => p.variants.some((v) => v.salePriceUSD !== undefined));
  if (q.onlyInStock) list = list.filter((p) => p.variants.some((v) => v.stock > 0));
  if (q.minPrice !== undefined || q.maxPrice !== undefined) {
    list = list.filter((p) => {
      const best = Math.min(...p.variants.map(variantPrice));
      if (q.minPrice !== undefined && best < q.minPrice) return false;
      if (q.maxPrice !== undefined && best > q.maxPrice) return false;
      return true;
    });
  }
  if (q.storages?.length) {
    list = list.filter((p) => p.variants.some((v) => v.storage && q.storages!.includes(v.storage)));
  }
  if (q.rams?.length) {
    list = list.filter((p) => p.variants.some((v) => v.ram && q.rams!.includes(v.ram)));
  }
  if (q.colors?.length) {
    list = list.filter((p) => p.variants.some((v) => q.colors!.includes(v.color)));
  }
  return sortProducts(list, q.sort ?? "pertinence");
}

export function paginate<T>(items: T[], page = 1, perPage = 12) {
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), pages);
  return {
    items: items.slice((safePage - 1) * perPage, safePage * perPage),
    total,
    pages,
    page: safePage,
    perPage,
  };
}

export function buildFacets(all: Product[]): Facets {
  const count = (fn: (p: Product) => (string | undefined)[]) => {
    const m = new Map<string, number>();
    all.forEach((p) => fn(p).forEach((v) => {
      if (v) m.set(v, (m.get(v) ?? 0) + 1);
    }));
    return [...m.entries()]
      .map(([value, c]) => ({ value, slug: value, count: c }))
      .sort((a, b) => b.count - a.count);
  };
  const brandCounts = new Map<string, number>();
  const catCounts = new Map<string, number>();
  all.forEach((p) => {
    brandCounts.set(p.brand, (brandCounts.get(p.brand) ?? 0) + 1);
    catCounts.set(p.category, (catCounts.get(p.category) ?? 0) + 1);
  });
  return {
    brands: [...brandCounts.entries()].map(([slug, c]) => ({ slug, count: c })),
    categories: [...catCounts.entries()].map(([slug, c]) => ({ slug, count: c })),
    storages: count((p) => p.variants.map((v) => v.storage)).map((s) => ({ ...s, slug: s.value })),
    rams: count((p) => p.variants.map((v) => v.ram)).map((s) => ({ ...s, slug: s.value })),
    colors: count((p) => p.variants.map((v) => v.color)).map((s) => ({ ...s, slug: s.value })),
    maxPrice: Math.max(...all.map((p) => productFromPrice(p).price)),
  };
}

export function relatedProducts(all: Product[], product: Product, n = 4): Product[] {
  return all
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) => {
      const score = (p: Product) =>
        (p.brand === product.brand ? 3 : 0) +
        (p.category === product.category ? 2 : 0) +
        p.rating / 5;
      return score(b) - score(a);
    })
    .slice(0, n);
}

/** Implémentation mock — échangeable avec Supabase sans toucher l'UI. */
export class MockCatalogRepository implements CatalogRepository {
  async listProducts(): Promise<Product[]> {
    return products;
  }
  async getProduct(slug: string): Promise<Product | undefined> {
    return products.find((p) => p.slug === slug);
  }
}

export const catalogRepository: CatalogRepository = new MockCatalogRepository();
