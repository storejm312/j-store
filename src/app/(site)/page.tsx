import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { brands, collections } from "@/data/catalog-meta";
import { products } from "@/data/products";
import { reviews } from "@/data/reviews-orders";
import { whatsappContactLink } from "@/lib/whatsapp";
import { applyCollection, sortProducts } from "@/repositories/mockCatalog";
import { NewsletterForm, ProductRow } from "@/components/HomeClient";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";

export const metadata: Metadata = {
  title: "Accueil",
  description: siteConfig.description,
};

const SERVICES = [
  { title: "Livraison rapide", text: "Kolwezi le jour même, provinces 48–72 h.", icon: "◷" },
  { title: "Garantie 12 mois", text: "Produits authentiques, garantie écrite.", icon: "✓" },
  { title: "Configuration offerte", text: "Transfert de données et mise en route.", icon: "⚙" },
  { title: "Reprise", text: "Votre ancien téléphone estimé et repris.", icon: "⇄" },
];

export default function HomePage() {
  const newArrivals = sortProducts(products.filter((p) => p.isNew), "nouveautes").slice(0, 8);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);
  const deals = products.filter((p) => p.isDeal).slice(0, 8);
  const premium = applyCollection(products, "premium").slice(0, 4);
  const premiumCollection = collections.find((c) => c.slug === "premium");

  return (
    <main>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pt-8 md:px-6 md:pt-14" aria-label="Présentation">
        <div className="grid items-center gap-8 rounded-3xl bg-white p-6 md:grid-cols-2 md:p-12">
          <div>
            <p className="inline-block rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
              Nouvelle collection
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Technology, beautifully chosen.
            </h1>
            <p className="mt-4 max-w-md text-ink-500">
              iPhone, Galaxy, Tecno, Infinix et accessoires — 100 % authentiques, garantis et configurés à Kolwezi.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/shop" className="rounded-full bg-ink-950 px-7 py-3 text-sm font-medium text-white hover:bg-ink-700">
                Découvrir la collection
              </Link>
              <Link href="/collections/deals" className="rounded-full border border-ink-200 px-7 py-3 text-sm font-medium hover:border-ink-950">
                Explorer les offres
              </Link>
            </div>
            <dl className="mt-8 flex gap-8 text-sm">
              {[
                ["49+", "Produits en stock"],
                ["12 mois", "De garantie"],
                ["24 h", "Livraison Kolwezi"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="text-lg font-semibold">{v}</dt>
                  <dd className="text-ink-500">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink-100">
            <Image
              src="/images/HERO.jpg"
              alt="Showroom JM Store — smartphones premium"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── BRANDS ───────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6" aria-label="Nos marques">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Nos marques</h2>
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {brands.map((b) => (
            <li key={b.slug}>
              <Link
                href={`/shop?brands=${b.slug}`}
                className="block rounded-2xl border border-ink-100 bg-white p-5 transition hover:border-ink-950"
              >
                <p className="text-lg font-semibold tracking-tight">{b.name}</p>
                <p className="mt-1 text-xs text-ink-500">{b.baseline}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── NEW ARRIVALS ─────────────────────────────────── */}
      <ProductRow title="New arrivals" subtitle="Les derniers modèles en boutique." href="/collections/nouveautes" hrefLabel="Voir tout" items={newArrivals} />

      {/* ── FEATURED COLLECTION : PREMIUM ────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-6 md:px-6" aria-label="Collection premium">
        <div className="grid overflow-hidden rounded-3xl bg-ink-950 text-white md:grid-cols-2">
          <div className="flex flex-col justify-center p-8 md:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">Collection à l&apos;honneur</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{premiumCollection?.title}</h2>
            <p className="mt-2 text-white/70">{premiumCollection?.description}</p>
            <div className="mt-6">
              <Link href="/collections/premium" className="rounded-full bg-white px-7 py-3 text-sm font-medium text-ink-950">
                Explorer la collection
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 p-6 md:p-8">
            {premium.map((p) => (
              <Link key={p.slug} href={`/product/${p.slug}`} className="rounded-2xl bg-white p-2 text-ink-950">
                <ProductImage src={p.images[0] ?? ""} alt={p.name} brand={p.brand} className="aspect-square w-full rounded-xl" />
                <p className="truncate px-2 py-2 text-xs font-medium">{p.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEST SELLERS ─────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6" aria-label="Meilleures ventes">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Best sellers</h2>
            <p className="mt-1 text-sm text-ink-500">Les préférés de nos clients.</p>
          </div>
          <Link href="/collections/best-sellers" className="text-sm font-medium underline underline-offset-4">Voir tout</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {bestSellers.slice(0, 4).map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* ── DEALS ────────────────────────────────────────── */}
      <ProductRow title="Deals" subtitle="Offres à durée limitée, dans la limite des stocks." href="/collections/deals" hrefLabel="Toutes les offres" items={deals} />

      {/* ── SERVICES ─────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6" aria-label="Nos services">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Services inclus</h2>
          <Link href="/services" className="text-sm font-medium underline underline-offset-4">Tous les services</Link>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <li key={s.title} className="rounded-2xl border border-ink-100 bg-white p-6">
              <p aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-100 text-lg">{s.icon}</p>
              <p className="mt-3 font-semibold">{s.title}</p>
              <p className="mt-1 text-sm text-ink-500">{s.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── SHOWROOM ─────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-6 md:px-6" aria-label="Notre boutique">
        <div className="grid items-center gap-6 rounded-3xl border border-ink-100 bg-white p-6 md:grid-cols-2 md:p-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ink-400">Showroom Kolwezi</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Venez nous rendre visite.</h2>
            <p className="mt-2 text-ink-500">Essayez les téléphones, vérifiez l&apos;authenticité sur place, repartez configuré.</p>
            <p className="mt-4 text-sm font-medium">{siteConfig.address}</p>
            <p className="text-sm text-ink-500">{siteConfig.hours}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/store" className="rounded-full bg-ink-950 px-6 py-2.5 text-sm font-medium text-white">Voir la boutique</Link>
              <a href={whatsappContactLink("Bonjour JM Store, je souhaite visiter la boutique.")} target="_blank" rel="noreferrer" className="rounded-full border border-ink-200 px-6 py-2.5 text-sm font-medium">
                Nous écrire
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink-100">
            <Image src="/images/HERO.jpg" alt="Devanture JM Store à Kolwezi" fill loading="lazy" sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6" aria-label="Avis clients">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Ils nous font confiance</h2>
        <ul className="mt-5 grid gap-3 md:grid-cols-3">
          {reviews.slice(0, 3).map((r) => (
            <li key={r.id} className="rounded-2xl border border-ink-100 bg-white p-6">
              <p aria-label={`Note ${r.rating} sur 5`} className="text-amber-500">{"★".repeat(r.rating)}</p>
              <p className="mt-2 font-semibold">{r.title}</p>
              <p className="mt-1 text-sm text-ink-500">« {r.body} »</p>
              <p className="mt-3 text-sm font-medium">{r.author}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── NEWSLETTER + WHATSAPP ────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-4 md:px-6" aria-label="Restez informé">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-ink-100 bg-white p-8">
            <h2 className="text-2xl font-semibold tracking-tight">Restez informé</h2>
            <p className="mt-1 text-sm text-ink-500">Nouveautés et offres privées, une fois par mois.</p>
            <div className="mt-4"><NewsletterForm /></div>
          </div>
          <div className="rounded-3xl bg-whatsapp-500 p-8 text-white">
            <h2 className="text-2xl font-semibold tracking-tight">Une question ? Commandez sur WhatsApp.</h2>
            <p className="mt-1 text-sm text-white/85">Réponse en quelques minutes pendant les horaires d&apos;ouverture.</p>
            <a href={whatsappContactLink()} target="_blank" rel="noreferrer" className="mt-4 inline-block rounded-full bg-white px-7 py-3 text-sm font-semibold text-whatsapp-600">
              Discuter : {siteConfig.whatsappDisplay}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
