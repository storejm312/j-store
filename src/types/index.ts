// ─── JM STORE · types métier ─────────────────────────────────────
// Ces types sont la source de vérité partagée par l'UI, les mocks
// et (demain) les repositories Supabase. Ne pas les dupliquer.

export type BrandSlug =
  | "apple"
  | "samsung"
  | "tecno"
  | "infinix"
  | "itel"
  | "xiaomi"
  | "google"
  | "accessoires";

export type CategorySlug =
  | "smartphones"
  | "tablettes"
  | "montres"
  | "ecouteurs"
  | "accessoires";

export type Condition = "Neuf" | "Reconditionné";

export interface ProductVariant {
  id: string;
  color: string;
  colorHex: string;
  storage?: string;
  ram?: string;
  priceUSD: number;
  salePriceUSD?: number;
  stock: number;
  sku: string;
  image: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: BrandSlug;
  category: CategorySlug;
  tagline: string;
  description: string;
  specs: ProductSpec[];
  images: string[];
  rating: number;
  reviewCount: number;
  condition: Condition;
  variants: ProductVariant[];
  featured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  isDeal?: boolean;
  createdAt: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  image?: string;
}

export interface Brand {
  slug: BrandSlug;
  name: string;
  baseline: string;
}

export interface Collection {
  slug: string;
  title: string;
  description: string;
  image?: string;
  /** Prédicat de sélection exprimé en données (pas d'UI en dur) */
  filter: {
    brands?: BrandSlug[];
    categories?: CategorySlug[];
    isNew?: boolean;
    isBestSeller?: boolean;
    isDeal?: boolean;
    maxPriceUSD?: number;
    minPriceUSD?: number;
  };
}

export interface Review {
  id: string;
  productSlug: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
}

export type OrderStatus =
  | "Nouvelle"
  | "Confirmée"
  | "Préparation"
  | "Expédiée"
  | "Livrée"
  | "Annulée";

export interface OrderItem {
  productSlug: string;
  productName: string;
  variantLabel: string;
  qty: number;
  unitPriceUSD: number;
  image: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  ordersCount: number;
  totalSpentUSD: number;
}

export interface Order {
  id: string;
  customer: Pick<Customer, "name" | "phone" | "city">;
  date: string;
  items: OrderItem[];
  totalUSD: number;
  deliveryMode: string;
  paymentMode: string;
  status: OrderStatus;
}

/** Prix effectif d'une variante (promo si présente) */
export function variantPrice(v: ProductVariant): number {
  return v.salePriceUSD ?? v.priceUSD;
}

/** Prix d'appel d'un produit = variante la moins chère */
export function productFromPrice(p: Product): { price: number; sale?: number; stock: number } {
  const sorted = [...p.variants].sort((a, b) => variantPrice(a) - variantPrice(b));
  const first = sorted[0];
  const stock = p.variants.reduce((s, v) => s + v.stock, 0);
  if (!first) return { price: 0, stock: 0 };
  return first.salePriceUSD
    ? { price: first.priceUSD, sale: first.salePriceUSD, stock }
    : { price: first.priceUSD, stock };
}

export function variantLabel(v: ProductVariant): string {
  return [v.color, v.storage, v.ram].filter(Boolean).join(" · ");
}
