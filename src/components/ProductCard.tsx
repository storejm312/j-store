"use client";

import Link from "next/link";
import { getBrand } from "@/data/catalog-meta";
import { useCart } from "@/stores/cart";
import { useWishlist } from "@/stores/wishlist";
import type { Product } from "@/types";
import { productFromPrice, variantLabel } from "@/types";
import { DiscountBadge, Price } from "./Price";
import { ProductImage, Stars } from "./ProductImage";
import { useQuickView } from "./QuickView";

export function stockState(p: Product): { label: string; tone: string } {
  const { stock } = productFromPrice(p);
  if (stock <= 0) return { label: "Rupture", tone: "text-red-600" };
  if (stock <= 5) return { label: `Plus que ${stock}`, tone: "text-amber-600" };
  return { label: "En stock", tone: "text-emerald-600" };
}

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const { open } = useQuickView();
  const wished = has(product.slug);
  const { price, sale, stock } = productFromPrice(product);
  const s = stockState(product);
  const brand = getBrand(product.brand)?.name ?? product.brand;
  const firstInStock = product.variants.find((v) => v.stock > 0) ?? product.variants[0];
  const badge = product.isDeal && sale !== undefined ? "Promo" : product.isNew ? "Nouveau" : product.isBestSeller ? "Top vente" : null;

  return (
    <div className="group relative flex flex-col rounded-2xl border border-ink-100 bg-white p-3 transition-shadow duration-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      <div className="relative">
        <Link href={`/product/${product.slug}`} aria-label={`Voir ${product.name}`}>
          <ProductImage
            src={product.images[0] ?? ""}
            alt={product.name}
            brand={product.brand}
            className="aspect-square w-full rounded-xl"
          />
        </Link>
        {badge && (
          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide backdrop-blur">
            {badge}
          </span>
        )}
        <button
          type="button"
          onClick={() => toggle(product.slug)}
          aria-label={wished ? "Retirer des favoris" : "Ajouter aux favoris"}
          aria-pressed={wished}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur transition hover:scale-105"
        >
          <span aria-hidden="true" className={wished ? "text-red-500" : "text-ink-400"}>
            {wished ? "♥" : "♡"}
          </span>
        </button>
        <button
          type="button"
          onClick={() => open(product.slug)}
          className="absolute inset-x-2 bottom-2 hidden rounded-full bg-ink-950/90 py-2 text-xs font-medium text-white opacity-0 backdrop-blur transition group-hover:block group-hover:opacity-100"
        >
          Aperçu rapide
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-1 pt-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-400">{brand}</p>
        <Link href={`/product/${product.slug}`} className="font-medium leading-snug hover:underline">
          {product.name}
        </Link>
        <p className="text-xs text-ink-500">{product.tagline.split(".")[0]}.</p>
        <Stars rating={product.rating} />
        <div className="mt-1 flex items-center justify-between">
          <Price price={price} sale={sale} size="sm" />
          <DiscountBadge price={price} sale={sale} />
        </div>
        <p className={`text-xs font-medium ${s.tone}`}>
          <span aria-hidden="true">● </span>
          {s.label}
        </p>
        <button
          type="button"
          disabled={stock <= 0 || !firstInStock}
          onClick={() =>
            firstInStock &&
            add({
              productSlug: product.slug,
              productName: product.name,
              brand,
              variant: firstInStock,
              variantLabel: variantLabel(firstInStock),
            })
          }
          className="mt-2 w-full rounded-full bg-ink-950 py-2.5 text-sm font-medium text-white transition hover:bg-ink-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {stock <= 0 ? "Indisponible" : "Ajouter au panier"}
        </button>
      </div>
    </div>
  );
}
