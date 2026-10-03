import type { Collection, Product } from "@/types";

// ─── Contrats repository (l'UI ne dépend que de ces interfaces) ───
// Aujourd'hui : MockCatalogRepository. Demain : SupabaseCatalogRepository
// implémentant les mêmes signatures — aucune interface à refaire.

export interface CatalogRepository {
  listProducts(): Promise<Product[]>;
  getProduct(slug: string): Promise<Product | undefined>;
}

export interface ProductQuery {
  search?: string;
  brands?: string[];
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  storages?: string[];
  rams?: string[];
  colors?: string[];
  conditions?: string[];
  onlyPromo?: boolean;
  onlyInStock?: boolean;
  sort?: SortKey;
  page?: number;
  perPage?: number;
}

export type SortKey =
  | "pertinence"
  | "prix-croissant"
  | "prix-decroissant"
  | "nouveautes"
  | "meilleures-ventes"
  | "meilleures-notes";

export interface Facets {
  brands: { slug: string; count: number }[];
  categories: { slug: string; count: number }[];
  storages: { value: string; count: number }[];
  rams: { value: string; count: number }[];
  colors: { value: string; count: number }[];
  maxPrice: number;
}
