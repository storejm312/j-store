import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { whatsappContactLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Services",
  description: "Livraison, garantie, configuration, transfert de données, réparation, reprise et assistance.",
};

const SERVICES = [
  { title: "Livraison", text: "Kolwezi en 24 h (offerte dès 500 $), provinces en 48–72 h avec suivi WhatsApp. Chaque colis est vérifié avant départ.", icon: "◷" },
  { title: "Garantie", text: "12 mois sur le neuf, 6 mois sur le reconditionné. Garantie écrite remise à chaque achat, SAV assuré sur place.", icon: "✓" },
  { title: "Configuration offerte", text: "Mise en route, comptes, WhatsApp, mobile money et transfert complet de vos données depuis l'ancien téléphone.", icon: "⚙" },
  { title: "Transfert de données", text: "Photos, contacts, messages et applications migrés sans perte, iPhone comme Android.", icon: "⇄" },
  { title: "Réparation", text: "Diagnostic gratuit, écrans, batteries et connecteurs remplacés avec pièces de qualité. Devis avant toute intervention.", icon: "✚" },
  { title: "Reprise", text: "Votre ancien téléphone estimé au juste prix et déduit immédiatement de votre nouvel achat.", icon: "♻" },
  { title: "Assistance", text: "Support WhatsApp 6 j/7 : réglages, mises à jour, conseils d'achat. On répond en quelques minutes.", icon: "☎" },
];

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <nav aria-label="Fil d'Ariane" className="mb-3 text-sm text-ink-500">
        <Link href="/" className="hover:underline">Accueil</Link> / <span aria-current="page" className="font-medium text-ink-950">Services</span>
      </nav>
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Nos services</h1>
      <p className="mb-6 mt-2 max-w-2xl text-ink-500">
        Acheter un téléphone ne suffit pas : nous vous accompagnons avant, pendant et après l&apos;achat.
      </p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => (
          <li key={s.title} className="rounded-3xl border border-ink-100 bg-white p-6">
            <p aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-950 text-lg text-white">{s.icon}</p>
            <h2 className="mt-3 text-lg font-semibold">{s.title}</h2>
            <p className="mt-1 text-sm text-ink-500">{s.text}</p>
          </li>
        ))}
      </ul>
      <div className="mt-8 rounded-3xl bg-ink-950 p-8 text-center text-white">
        <h2 className="text-2xl font-semibold">Besoin d&apos;un service ?</h2>
        <p className="mt-1 text-white/70">Écrivez-nous, devis gratuit en quelques minutes.</p>
        <a href={whatsappContactLink("Bonjour JM Store, j'aurais besoin d'un service (réparation, configuration…).")} target="_blank" rel="noreferrer" className="mt-4 inline-block rounded-full bg-white px-7 py-3 text-sm font-semibold text-ink-950">
          WhatsApp {siteConfig.whatsappDisplay}
        </a>
      </div>
    </main>
  );
}
