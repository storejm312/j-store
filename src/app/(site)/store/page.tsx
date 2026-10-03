import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { whatsappContactLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Notre boutique",
  description: "JM Store à Kinshasa : adresse, horaires, téléphone et WhatsApp. Venez nous rendre visite.",
};

const HOURS = [
  ["Lundi – Vendredi", "9h00 – 19h00"],
  ["Samedi", "9h00 – 17h00"],
  ["Dimanche", "Fermé"],
];

export default function StorePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <nav aria-label="Fil d'Ariane" className="mb-3 text-sm text-ink-500">
        <Link href="/" className="hover:underline">Accueil</Link> / <span aria-current="page" className="font-medium text-ink-950">Boutique</span>
      </nav>
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ink-400">Showroom Kinshasa</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">Venez nous rendre visite.</h1>
      <p className="mb-6 mt-2 max-w-2xl text-ink-500">
        Essayez les téléphones en main, vérifiez l&apos;authenticité sur place et repartez avec un appareil configuré.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink-100">
          <Image src="/images/HERO.jpg" alt="Devanture de la boutique JM Store" fill loading="lazy" sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          <p className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium backdrop-blur">Façade — Boulevard du 30 Juin</p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink-100">
          <Image src="/images/HERO.jpg" alt="Intérieur du showroom JM Store" fill loading="lazy" sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          <p className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium backdrop-blur">Intérieur — espace démonstration</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <section className="rounded-3xl border border-ink-100 bg-white p-6" aria-label="Adresse et contact">
          <h2 className="font-semibold">Adresse & contact</h2>
          <p className="mt-2 text-sm">{siteConfig.address}</p>
          <p className="mt-1 text-sm">Tél : {siteConfig.phone}</p>
          <p className="text-sm">E-mail : {siteConfig.email}</p>
          <a href={whatsappContactLink("Bonjour JM Store, je souhaite passer en boutique.")} target="_blank" rel="noreferrer" className="mt-4 block rounded-full bg-whatsapp-500 py-2.5 text-center text-sm font-semibold text-white">
            WhatsApp
          </a>
        </section>
        <section className="rounded-3xl border border-ink-100 bg-white p-6" aria-label="Horaires">
          <h2 className="font-semibold">Horaires</h2>
          <dl className="mt-2 space-y-1.5 text-sm">
            {HOURS.map(([d, h]) => (
              <div key={d} className="flex justify-between">
                <dt className="text-ink-500">{d}</dt>
                <dd className="font-medium">{h}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="rounded-3xl border border-ink-100 bg-white p-6" aria-label="L'équipe">
          <h2 className="font-semibold">L&apos;équipe vous accueille</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-ink-700">
            <li><strong>Jonathan</strong> — conseil & vente</li>
            <li><strong>Grâce</strong> — configuration & SAV</li>
            <li><strong>Moïse</strong> — technique & réparations</li>
          </ul>
          <p className="mt-2 text-xs text-ink-500">Configuration et transfert de données offerts pour tout achat.</p>
        </section>
      </div>
    </main>
  );
}
