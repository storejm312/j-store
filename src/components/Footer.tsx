import Link from "next/link";
import { siteConfig } from "@/config/site";
import { whatsappContactLink } from "@/lib/whatsapp";
import { SiteLogo } from "./SiteLogo";

const COLS = [
  {
    title: "Boutique",
    links: [
      { label: "Tout le catalogue", href: "/shop" },
      { label: "Collections", href: "/collections" },
      { label: "Promotions", href: "/collections/deals" },
      { label: "Nouveautés", href: "/collections/nouveautes" },
      { label: "Moins de 300 $", href: "/collections/moins-de-300" },
    ],
  },
  {
    title: "Aide",
    links: [
      { label: "Services", href: "/services" },
      { label: "Notre boutique", href: "/store" },
      { label: "À propos", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Recherche", href: "/search" },
    ],
  },
  {
    title: "Compte",
    links: [
      { label: "Mon compte", href: "/account" },
      { label: "Panier", href: "/cart" },
      { label: "Favoris", href: "/wishlist" },
      { label: "Commander", href: "/checkout" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-100 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.2fr_1fr_1fr_1fr] md:px-6">
        <div>
          <p className="flex items-center gap-2">
            <SiteLogo size={44} />
            <span className="text-lg font-semibold tracking-tight">Store</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-ink-500">{siteConfig.tagline} {siteConfig.description}</p>
          <p className="mt-4 text-sm text-ink-700">{siteConfig.address}</p>
          <p className="text-sm text-ink-500">{siteConfig.hours}</p>
          <a href={whatsappContactLink()} target="_blank" rel="noreferrer" className="mt-4 inline-block rounded-full bg-ink-950 px-5 py-2.5 text-sm font-medium text-white">
            WhatsApp {siteConfig.whatsappDisplay}
          </a>
        </div>
        {COLS.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">{c.title}</p>
            <ul className="mt-3 space-y-2">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-ink-700 hover:text-ink-950 hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-ink-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-ink-500 sm:flex-row md:px-6">
          <p>© 2026 {siteConfig.name} — Maquette de démonstration, données simulées.</p>
          <p>Prix en USD · équivalent FC indicatif.</p>
        </div>
      </div>
    </footer>
  );
}
