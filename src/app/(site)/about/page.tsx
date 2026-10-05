import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description: "JM Store : notre histoire, notre vision et nos engagements à Kolwezi.",
};

const VALUES = [
  { title: "Authenticité", text: "Chaque produit est vérifié : IMEI, numéro de série, scellé d'origine. Aucune copie, aucune surprise." },
  { title: "Garantie écrite", text: "12 mois sur le neuf, 6 mois sur le reconditionné. Le SAV est assuré dans notre boutique, pas à l'autre bout du monde." },
  { title: "Service client", text: "Conseil honnête, configuration offerte, support WhatsApp 6 j/7. Nous répondons en quelques minutes." },
  { title: "Livraison soignée", text: "Kolwezi en 24 h, provinces en 48–72 h. Produit testé et emballé avant chaque départ." },
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:px-6">
      <nav aria-label="Fil d'Ariane" className="mb-3 text-sm text-ink-500">
        <Link href="/" className="hover:underline">Accueil</Link> / <span aria-current="page" className="font-medium text-ink-950">À propos</span>
      </nav>
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ink-400">Notre marque</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-5xl">La technologie, en toute confiance.</h1>

      <section className="mt-8 rounded-3xl border border-ink-100 bg-white p-6 md:p-10" aria-label="Notre histoire">
        <h2 className="text-xl font-semibold">Notre histoire</h2>
        <p className="mt-3 text-ink-700">
          JM Store est née à Kolwezi d&apos;un constat simple : acheter un smartphone devrait être simple et rassurant.
          Nous avons ouvert notre showroom sur le Boulevard du 30 Juin pour offrir ce qui manquait : des produits
          100 % authentiques, des prix affichés en dollars sans surprise, et une équipe qui configure votre téléphone
          devant vous.
        </p>
      </section>

      <section className="mt-4 rounded-3xl bg-ink-950 p-6 text-white md:p-10" aria-label="Notre vision">
        <h2 className="text-xl font-semibold">Notre vision</h2>
        <p className="mt-3 text-white/80">
          Devenir la référence tech de confiance en RDC : le réflexe naturel quand on veut un téléphone authentique,
          bien conseillé et bien suivi — en boutique comme en ligne.
        </p>
      </section>

      <section className="mt-8" aria-label="Nos engagements">
        <h2 className="text-2xl font-semibold tracking-tight">Nos engagements</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {VALUES.map((v) => (
            <li key={v.title} className="rounded-3xl border border-ink-100 bg-white p-6">
              <h3 className="font-semibold">{v.title}</h3>
              <p className="mt-1 text-sm text-ink-500">{v.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/shop" className="rounded-full bg-ink-950 px-7 py-3 text-sm font-medium text-white">Voir le catalogue</Link>
        <Link href="/contact" className="rounded-full border border-ink-200 px-7 py-3 text-sm font-medium">Nous contacter</Link>
      </div>
    </main>
  );
}
