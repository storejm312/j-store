"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { whatsappContactLink } from "@/lib/whatsapp";
import { useCart } from "@/stores/cart";
import { useWishlist } from "@/stores/wishlist";
import { SearchOverlay } from "./SearchOverlay";
import { SiteLogo } from "./SiteLogo";

const NAV = [
  { label: "Shop", href: "/shop" },
  { label: "iPhone", href: "/shop?brands=apple" },
  { label: "Samsung", href: "/shop?brands=samsung" },
  { label: "Android", href: "/collections/android" },
  { label: "Accessoires", href: "/collections/accessoires" },
  { label: "Collections", href: "/collections" },
  { label: "Deals", href: "/collections/deals" },
  { label: "Services", href: "/services" },
];

export function Header() {
  const { count: cartCount, lastAddedAt } = useCart();
  const { slugs } = useWishlist();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!lastAddedAt) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 400);
    return () => clearTimeout(t);
  }, [lastAddedAt ]);

  return (
    <>
      <div className="bg-ink-950 text-center text-[12px] font-medium text-white">
        <p className="mx-auto max-w-6xl px-4 py-2">
          Livraison offerte à Kinshasa dès 500 $ · Garantie 12 mois ·{" "}
          <a href={whatsappContactLink()} target="_blank" rel="noreferrer" className="underline underline-offset-2">
            WhatsApp {siteConfig.whatsappDisplay}
          </a>
        </p>
      </div>
      <header
        className={`sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md transition-shadow duration-200 ${
          scrolled ? "border-ink-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)]" : "border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 md:gap-6 md:px-6">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-ink-100 md:hidden"
            aria-label="Ouvrir le menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <span aria-hidden="true" className="text-xl">☰</span>
          </button>
          <Link href="/" className="flex items-center gap-2" aria-label="JM Store — accueil">
            <SiteLogo size={40} priority />
            <span className="text-lg font-semibold tracking-tight">Store</span>
          </Link>
          <nav className="hidden items-center gap-5 md:flex" aria-label="Navigation principale">
            {NAV.map((n) => (
              <Link key={n.label} href={n.href} className="text-sm font-medium text-ink-700 hover:text-ink-950">
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Rechercher"
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-ink-100"
            >
              <span aria-hidden="true" className="text-lg">⌕</span>
            </button>
            <Link href="/wishlist" aria-label={`Favoris, ${slugs.length} articles`} className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-ink-100">
              <span aria-hidden="true" className="text-lg">♡</span>
              {slugs.length > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink-950 px-1 text-[10px] font-bold text-white">
                  {slugs.length}
                </span>
              )}
            </Link>
            <Link href="/cart" aria-label={`Panier, ${cartCount} articles`} className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-ink-100">
              <span aria-hidden="true" className={`text-lg transition-transform ${bump ? "scale-125" : ""}`}>🛒</span>
              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink-950 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <a
              href={whatsappContactLink()}
              target="_blank"
              rel="noreferrer"
              className="ml-1 hidden rounded-full bg-whatsapp-500 px-4 py-2 text-sm font-semibold text-white hover:bg-whatsapp-600 sm:block"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <nav className="absolute left-0 top-0 flex h-full w-72 flex-col gap-1 bg-white p-5" aria-label="Menu mobile">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-lg font-semibold">Menu</span>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Fermer le menu" className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 text-lg">×</button>
            </div>
            {[...NAV, { label: "Boutique", href: "/store" }, { label: "Mon compte", href: "/account" }].map((n) => (
              <Link key={n.label} href={n.href} onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 font-medium hover:bg-ink-100">
                {n.label}
              </Link>
            ))}
            <a href={whatsappContactLink()} target="_blank" rel="noreferrer" className="mt-4 rounded-full bg-whatsapp-500 py-3 text-center font-semibold text-white">
              WhatsApp
            </a>
          </nav>
        </div>
      )}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
