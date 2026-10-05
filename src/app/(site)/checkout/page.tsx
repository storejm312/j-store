"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { formatCDF, formatUSD } from "@/config/site";
import { useCart } from "@/stores/cart";
import { ProductImage } from "@/components/ProductImage";

const DELIVERY = [
  { value: "Livraison à domicile", hint: "Kolwezi 24 h · +10 $ offerts dès 500 $" },
  { value: "Retrait boutique", hint: "Boulevard du 30 Juin · Lun–Sam 9h–19h" },
];

const PAYMENTS = [
  { value: "Cash", hint: "À la livraison ou en boutique" },
  { value: "Mobile Money", hint: "M-Pesa, Airtel Money, Orange Money" },
  { value: "Paiement boutique", hint: "Lors du retrait" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotalUSD, deliveryUSD, totalUSD, clear } = useCart();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    email: "",
    city: "Kolwezi",
    commune: "",
    address: "",
    notes: "",
    delivery: DELIVERY[0].value,
    payment: PAYMENTS[1].value,
  });
  const [errors, setErrors] = useState<string[]>([]);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const summary = useMemo(
    () => lines.map((l) => `${l.productName} (${l.variantLabel}) x${l.qty}`).join(", "),
    [lines]
  );

  if (lines.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Votre panier est vide</h1>
        <p className="mt-2 text-ink-500">Ajoutez des produits avant de passer commande.</p>
        <Link href="/shop" className="mt-6 inline-block rounded-full bg-ink-950 px-8 py-3 text-sm font-medium text-white">
          Voir le catalogue
        </Link>
      </main>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: string[] = [];
    if (form.name.trim().length < 2) errs.push("Veuillez saisir votre nom complet.");
    if (!/^\+?\d[\d\s-]{7,}$/.test(form.phone.trim())) errs.push("Numéro de téléphone invalide.");
    if (!form.address.trim() && form.delivery === "Livraison à domicile") errs.push("Adresse de livraison requise.");
    setErrors(errs);
    if (errs.length) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const id = `DEMO-${String(Math.floor(1000 + Math.random() * 9000))}`;
    try {
      const raw = localStorage.getItem("jmstore.orders.v1");
      const prev = raw ? JSON.parse(raw) : [];
      localStorage.setItem(
        "jmstore.orders.v1",
        JSON.stringify([
          {
            id,
            customer: { name: form.name, phone: form.phone, city: form.city },
            date: new Date().toISOString().slice(0, 10),
            items: lines.map((l) => ({
              productSlug: l.productSlug,
              productName: l.productName,
              variantLabel: l.variantLabel,
              qty: l.qty,
              unitPriceUSD: l.unitPriceUSD,
              image: l.image,
            })),
            totalUSD,
            deliveryMode: form.delivery,
            paymentMode: form.payment,
            status: "Nouvelle",
            address: `${form.address}, ${form.commune}, ${form.city}`,
            notes: form.notes,
          },
          ...(Array.isArray(prev) ? prev : []),
        ])
      );
    } catch {
      /* stockage indisponible — la commande reste affichée */
    }
    clear();
    const qs = new URLSearchParams({ name: form.name, phone: form.phone, delivery: form.delivery, payment: form.payment });
    router.push(`/order-confirmation/${id}?${qs.toString()}`);
  };

  const inputCls = "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none focus:border-ink-950";

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <nav aria-label="Fil d'Ariane" className="mb-3 text-sm text-ink-500">
        <Link href="/" className="hover:underline">Accueil</Link> / <Link href="/cart" className="hover:underline">Panier</Link> / <span aria-current="page" className="font-medium text-ink-950">Commande</span>
      </nav>
      <h1 className="text-3xl font-semibold tracking-tight">Finaliser la commande</h1>
      <p className="mt-2 inline-block rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-800" role="note">
        Mode démonstration — aucun paiement réel ne sera débité
      </p>

      {errors.length > 0 && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4" role="alert">
          <p className="font-semibold text-red-700">Veuillez corriger :</p>
          <ul className="mt-1 list-disc pl-5 text-sm text-red-700">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={submit} className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-ink-100 bg-white p-6" aria-label="Vos coordonnées">
            <h2 className="text-lg font-semibold">1 · Vos coordonnées</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="co-name" className="mb-1 block text-sm font-medium">Nom complet *</label>
                <input id="co-name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ex. Grâce Mbuyi" className={inputCls} autoComplete="name" />
              </div>
              <div>
                <label htmlFor="co-phone" className="mb-1 block text-sm font-medium">Téléphone *</label>
                <input id="co-phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+243 …" className={inputCls} autoComplete="tel" inputMode="tel" />
              </div>
              <div>
                <label htmlFor="co-wa" className="mb-1 block text-sm font-medium">WhatsApp</label>
                <input id="co-wa" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+243 … (si différent)" className={inputCls} inputMode="tel" />
              </div>
              <div>
                <label htmlFor="co-email" className="mb-1 block text-sm font-medium">E-mail</label>
                <input id="co-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="vous@exemple.cd" className={inputCls} autoComplete="email" />
              </div>
              <div>
                <label htmlFor="co-city" className="mb-1 block text-sm font-medium">Ville</label>
                <input id="co-city" value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label htmlFor="co-commune" className="mb-1 block text-sm font-medium">Commune</label>
                <input id="co-commune" value={form.commune} onChange={(e) => set("commune", e.target.value)} placeholder="Dilala, Manika…" className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="co-address" className="mb-1 block text-sm font-medium">Adresse *</label>
                <input id="co-address" value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="N°, avenue, référence" className={inputCls} autoComplete="street-address" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="co-notes" className="mb-1 block text-sm font-medium">Instructions (optionnel)</label>
                <textarea id="co-notes" value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={2} placeholder="Point de repère, heure de passage…" className={inputCls} />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-ink-100 bg-white p-6" aria-label="Livraison">
            <h2 className="text-lg font-semibold">2 · Livraison</h2>
            <div className="mt-3 space-y-2" role="radiogroup" aria-label="Mode de livraison">
              {DELIVERY.map((d) => (
                <label key={d.value} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 ${form.delivery === d.value ? "border-ink-950" : "border-ink-200"}`}>
                  <input type="radio" name="delivery" checked={form.delivery === d.value} onChange={() => set("delivery", d.value)} className="h-4 w-4 accent-black" />
                  <span>
                    <span className="block font-medium">{d.value}</span>
                    <span className="block text-xs text-ink-500">{d.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-ink-100 bg-white p-6" aria-label="Paiement">
            <h2 className="text-lg font-semibold">3 · Paiement <span className="text-sm font-normal text-ink-500">(démo)</span></h2>
            <div className="mt-3 space-y-2" role="radiogroup" aria-label="Mode de paiement">
              {PAYMENTS.map((p) => (
                <label key={p.value} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 ${form.payment === p.value ? "border-ink-950" : "border-ink-200"}`}>
                  <input type="radio" name="payment" checked={form.payment === p.value} onChange={() => set("payment", p.value)} className="h-4 w-4 accent-black" />
                  <span>
                    <span className="block font-medium">{p.value}</span>
                    <span className="block text-xs text-ink-500">{p.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-3xl border border-ink-100 bg-white p-6 lg:sticky lg:top-24" aria-label="Votre commande">
          <h2 className="text-lg font-semibold">Votre commande</h2>
          <ul className="mt-3 space-y-3">
            {lines.map((l) => (
              <li key={l.variantId} className="flex items-center gap-3">
                <ProductImage src={l.image} alt={l.productName} brand={l.brand} className="h-14 w-14 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{l.productName}</p>
                  <p className="text-xs text-ink-500">x{l.qty} · {formatUSD(l.unitPriceUSD)}</p>
                </div>
                <p className="text-sm font-semibold">{formatUSD(l.unitPriceUSD * l.qty)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1 border-t border-ink-100 pt-3 text-sm">
            <div className="flex justify-between"><dt className="text-ink-500">Sous-total</dt><dd>{formatUSD(subtotalUSD)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-500">Livraison</dt><dd>{deliveryUSD === 0 ? "Offerte" : formatUSD(deliveryUSD)}</dd></div>
            <div className="flex justify-between pt-1 text-base font-semibold"><dt>Total</dt><dd>{formatUSD(totalUSD)}</dd></div>
            <p className="text-xs text-ink-500">≈ {formatCDF(totalUSD)}</p>
          </dl>
          <p className="sr-only">{summary}</p>
          <button type="submit" className="mt-5 w-full rounded-full bg-ink-950 py-3.5 text-sm font-medium text-white hover:bg-ink-700">
            Confirmer la commande
          </button>
        </aside>
      </form>
    </main>
  );
}
