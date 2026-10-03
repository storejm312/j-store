"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";

export function ProductRow({
  title,
  subtitle,
  href,
  hrefLabel,
  items,
}: {
  title: string;
  subtitle?: string;
  href: string;
  hrefLabel: string;
  items: Product[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * Math.min(640, ref.current.clientWidth * 0.8), behavior: "smooth" });
  };
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 md:px-6" aria-label={title}>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Link href={href} className="mr-1 hidden text-sm font-medium underline underline-offset-4 sm:block">
            {hrefLabel}
          </Link>
          <button type="button" onClick={() => scroll(-1)} aria-label="Défiler vers la gauche" className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 hover:border-ink-950">
            ←
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label="Défiler vers la droite" className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 hover:border-ink-950">
            →
          </button>
        </div>
      </div>
      <div ref={ref} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
        {items.map((p) => (
          <div key={p.slug} className="w-[240px] shrink-0 snap-start md:w-[260px]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      <Link href={href} className="mt-4 block text-center text-sm font-medium underline underline-offset-4 sm:hidden">
        {hrefLabel}
      </Link>
    </section>
  );
}

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  return done ? (
    <p className="rounded-2xl bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700" role="status">
      Merci ! Votre inscription est enregistrée (démonstration).
    </p>
  ) : (
    <form
      className="flex flex-col gap-2 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          setError("Veuillez saisir une adresse e-mail valide.");
          return;
        }
        setError("");
        setDone(true);
      }}
    >
      <label htmlFor="newsletter-email" className="sr-only">Adresse e-mail</label>
      <input
        id="newsletter-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="votre@email.com"
        className="w-full rounded-full border border-ink-200 bg-white px-5 py-3 text-sm outline-none focus:border-ink-950"
      />
      <button type="submit" className="rounded-full bg-ink-950 px-7 py-3 text-sm font-medium text-white hover:bg-ink-700">
        S&apos;inscrire
      </button>
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
    </form>
  );
}
