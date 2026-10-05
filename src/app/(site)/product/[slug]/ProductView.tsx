"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getBrand } from "@/data/catalog-meta";
import { reviewsFor } from "@/data/reviews-orders";
import { whatsappContactLink } from "@/lib/whatsapp";
import { relatedProducts } from "@/repositories/mockCatalog";
import { products } from "@/data/products";
import { useCart } from "@/stores/cart";
import { useWishlist } from "@/stores/wishlist";
import type { Product } from "@/types";
import { productFromPrice, variantLabel } from "@/types";
import { Price } from "@/components/Price";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage, Stars } from "@/components/ProductImage";

const FAQ = [
  { q: "Le produit est-il authentique ?", a: "Oui. Chaque produit est vérifié (IMEI / numéro de série) devant vous en boutique ou avant expédition. Scellé d'origine pour le neuf." },
  { q: "Quelle garantie est incluse ?", a: "12 mois pour le neuf, 6 mois pour le reconditionné. La garantie couvre les défauts matériels (hors casse et oxydation). SAV assuré à Kolwezi." },
  { q: "Quels moyens de paiement acceptez-vous ?", a: "Cash à la livraison, Mobile Money (M-Pesa, Airtel Money, Orange Money) et paiement en boutique." },
  { q: "Livrez-vous hors Kolwezi ?", a: "Oui, nous expédions dans toutes les provinces sous 48 à 72 h avec suivi WhatsApp." },
];

export function ProductView({ product }: { product: Product }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const [imgIndex, setImgIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [qty, setQty] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [added, setAdded] = useState(false);

  const colors = useMemo(() => [...new Set(product.variants.map((v) => v.color))], [product]);
  const [color, setColor] = useState<string | null>(null);
  const [storage, setStorage] = useState<string | null>(null);
  const [ram, setRam] = useState<string | null>(null);

  const activeColor = color ?? colors[0];
  const storages = [...new Set(product.variants.filter((v) => v.color === activeColor && v.storage).map((v) => v.storage as string))];
  const rams = [...new Set(product.variants.filter((v) => v.color === activeColor && v.ram).map((v) => v.ram as string))];
  const activeStorage = storages.length ? (storage && storages.includes(storage) ? storage : storages[0]) : undefined;
  const activeRam = rams.length ? (ram && rams.includes(ram) ? ram : rams[0]) : undefined;
  const variant =
    product.variants.find(
      (v) =>
        v.color === activeColor &&
        (activeStorage === undefined || v.storage === activeStorage) &&
        (activeRam === undefined || v.ram === activeRam)
    ) ?? product.variants[0];

  const gallery = useMemo(() => {
    const imgs = [variant.image, ...product.images].filter(Boolean);
    return [...new Set(imgs)];
  }, [variant, product]);
  const mainImage = gallery[Math.min(imgIndex, gallery.length - 1)] ?? "";

  const brand = getBrand(product.brand)?.name ?? product.brand;
  const reviews = reviewsFor(product.slug);
  const related = relatedProducts(products, product);
  const { stock } = productFromPrice(product);

  const handleAdd = () => {
    add({ productSlug: product.slug, productName: product.name, brand, variant, variantLabel: variantLabel(variant), qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div>
      {/* Fil d'Ariane */}
      <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-ink-500">
        <ol className="flex flex-wrap gap-1.5">
          <li><Link href="/" className="hover:underline">Accueil</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/shop" className="hover:underline">Shop</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-ink-950">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ── GALERIE ── */}
        <div>
          <button
            type="button"
            onClick={() => setZoom(true)}
            className="block w-full cursor-zoom-in"
            aria-label="Agrandir l'image"
          >
            <ProductImage src={mainImage} alt={product.name} brand={product.brand} sizes="(max-width: 1024px) 100vw, 50vw" className="aspect-square w-full rounded-3xl border border-ink-100" />
          </button>
          {gallery.length > 1 && (
            <div className="mt-3 flex gap-2" role="tablist" aria-label="Images du produit">
              {gallery.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  role="tab"
                  aria-selected={i === Math.min(imgIndex, gallery.length - 1)}
                  aria-label={`Image ${i + 1}`}
                  onClick={() => setImgIndex(i)}
                  className={`w-20 overflow-hidden rounded-xl border-2 ${i === imgIndex ? "border-ink-950" : "border-transparent"}`}
                >
                  <ProductImage src={src} alt="" brand={product.brand} className="aspect-square w-full" />
                </button>
              ))}
            </div>
          )}
          {zoom && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4" role="dialog" aria-modal="true" aria-label="Image en plein écran" onClick={() => setZoom(false)}>
              <div className="relative max-h-full w-full max-w-3xl overflow-hidden rounded-2xl bg-white">
                <ProductImage src={mainImage} alt={product.name} brand={product.brand} sizes="90vw" className="aspect-square w-full" />
                <button type="button" aria-label="Fermer" className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-ink-950 text-xl text-white">×</button>
              </div>
            </div>
          )}
        </div>

        {/* ── INFORMATIONS ── */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">{brand} · {product.condition}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">{product.name}</h1>
          <p className="mt-1 text-ink-500">{product.tagline}</p>
          <div className="mt-2 flex items-center gap-2">
            <Stars rating={product.rating} />
            <span className="text-sm text-ink-500">({product.reviewCount} avis)</span>
          </div>
          <div className="mt-4"><Price price={variant.priceUSD} sale={variant.salePriceUSD} size="lg" /></div>
          <p className="mt-1 font-mono text-xs text-ink-400">SKU : {variant.sku}</p>
          <p className={`mt-2 text-sm font-medium ${variant.stock > 0 ? "text-emerald-600" : "text-red-600"}`} role="status">
            {variant.stock > 0 ? (variant.stock <= 5 ? `Plus que ${variant.stock} en stock` : `En stock (${variant.stock} disponibles)`) : "Rupture de stock"}
            {stock <= 0 && " — laissez-nous un message WhatsApp pour être prévenu."}
          </p>

          {/* Variantes */}
          {colors.length > 1 && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">Couleur : {activeColor}</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => {
                  const v = product.variants.find((x) => x.color === c);
                  return (
                    <button key={c} type="button" onClick={() => { setColor(c); setStorage(null); setRam(null); setImgIndex(0); }}
                      aria-pressed={c === activeColor} title={c}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${c === activeColor ? "border-ink-950" : "border-ink-200"}`}
                      style={{ backgroundColor: v?.colorHex ?? "#ddd" }}>
                      <span className="sr-only">{c}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {storages.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">Stockage</p>
              <div className="flex flex-wrap gap-2">
                {storages.map((s) => (
                  <button key={s} type="button" onClick={() => setStorage(s)} aria-pressed={s === activeStorage}
                    className={`rounded-full border px-5 py-2.5 text-sm font-medium ${s === activeStorage ? "border-ink-950 bg-ink-950 text-white" : "border-ink-200"}`}>{s}</button>
                ))}
              </div>
            </div>
          )}
          {rams.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">RAM</p>
              <div className="flex flex-wrap gap-2">
                {rams.map((r) => (
                  <button key={r} type="button" onClick={() => setRam(r)} aria-pressed={r === activeRam}
                    className={`rounded-full border px-5 py-2.5 text-sm font-medium ${r === activeRam ? "border-ink-950 bg-ink-950 text-white" : "border-ink-200"}`}>{r}</button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-ink-200">
              <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Diminuer la quantité" className="flex h-11 w-11 items-center justify-center text-lg">−</button>
              <span aria-live="polite" className="w-8 text-center font-semibold">{qty}</span>
              <button type="button" onClick={() => setQty(Math.min(variant.stock || 1, qty + 1))} aria-label="Augmenter la quantité" className="flex h-11 w-11 items-center justify-center text-lg">+</button>
            </div>
            <button
              type="button"
              disabled={variant.stock <= 0}
              onClick={handleAdd}
              className="flex-1 rounded-full bg-ink-950 py-3.5 text-sm font-medium text-white hover:bg-ink-700 disabled:opacity-40"
            >
              {added ? "✓ Ajouté au panier" : variant.stock <= 0 ? "Indisponible" : "Ajouter au panier"}
            </button>
            <button
              type="button"
              onClick={() => toggle(product.slug)}
              aria-pressed={has(product.slug)}
              aria-label={has(product.slug) ? "Retirer des favoris" : "Ajouter aux favoris"}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-ink-200 text-xl"
            >
              <span aria-hidden="true" className={has(product.slug) ? "text-red-500" : ""}>{has(product.slug) ? "♥" : "♡"}</span>
            </button>
          </div>
          <a
            href={whatsappContactLink(`Bonjour JM Store, je suis intéressé par ${product.name} (${variantLabel(variant)}). Est-il disponible ?`)}
            target="_blank" rel="noreferrer"
            className="mt-3 block rounded-full bg-whatsapp-500 py-3.5 text-center text-sm font-semibold text-white hover:bg-whatsapp-600"
          >
            Commander via WhatsApp
          </a>

          {/* Garantie / livraison */}
          <ul className="mt-6 grid gap-2 text-sm sm:grid-cols-3">
            {[
              ["✓ Garantie", product.condition === "Neuf" ? "12 mois incluse" : "6 mois incluse"],
              ["◷ Livraison", "Kolwezi 24 h"],
              ["⇄ Retours", "7 jours boutique"],
            ].map(([t, d]) => (
              <li key={t} className="rounded-2xl border border-ink-100 bg-white p-3">
                <p className="font-semibold">{t}</p>
                <p className="text-ink-500">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── DESCRIPTION / SPECS ── */}
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-ink-100 bg-white p-6 md:p-8" aria-label="Description">
          <h2 className="text-xl font-semibold tracking-tight">Description</h2>
          <p className="mt-3 text-ink-700">{product.description}</p>
        </section>
        <section className="rounded-3xl border border-ink-100 bg-white p-6 md:p-8" aria-label="Spécifications">
          <h2 className="text-xl font-semibold tracking-tight">Spécifications</h2>
          <dl className="mt-3 divide-y divide-ink-100">
            {product.specs.map((s) => (
              <div key={s.label} className="flex justify-between gap-4 py-2.5 text-sm">
                <dt className="text-ink-500">{s.label}</dt>
                <dd className="text-right font-medium">{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {/* ── FAQ ── */}
      <section className="mx-auto mt-6 max-w-3xl" aria-label="Questions fréquentes">
        <h2 className="text-xl font-semibold tracking-tight">Questions fréquentes</h2>
        <div className="mt-3 divide-y divide-ink-100 rounded-3xl border border-ink-100 bg-white px-6">
          {FAQ.map((f, i) => (
            <div key={f.q}>
              <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i} className="flex w-full items-center justify-between gap-4 py-4 text-left font-medium">
                {f.q}
                <span aria-hidden="true" className="text-ink-400">{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && <p className="pb-4 text-sm text-ink-500">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* ── AVIS ── */}
      <section className="mx-auto mt-10 max-w-3xl" aria-label="Avis clients">
        <h2 className="text-xl font-semibold tracking-tight">Avis clients ({product.reviewCount})</h2>
        <ul className="mt-3 space-y-3">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-2xl border border-ink-100 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{r.author}</p>
                <p aria-label={`Note ${r.rating} sur 5`} className="text-sm text-amber-500">{"★".repeat(r.rating)}</p>
              </div>
              <p className="mt-1 text-sm font-medium">{r.title}</p>
              <p className="mt-1 text-sm text-ink-500">{r.body}</p>
              <p className="mt-2 text-xs text-ink-400">{r.date}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── SIMILAIRES ── */}
      <section className="mt-12" aria-label="Produits similaires">
        <h2 className="text-2xl font-semibold tracking-tight">Produits similaires</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
