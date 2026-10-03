"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { whatsappContactLink } from "@/lib/whatsapp";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", subject: "Question produit", message: "" });
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const inputCls = "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none focus:border-ink-950";

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <nav aria-label="Fil d'Ariane" className="mb-3 text-sm text-ink-500">
        <Link href="/" className="hover:underline">Accueil</Link> / <span aria-current="page" className="font-medium text-ink-950">Contact</span>
      </nav>
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Contact</h1>
      <p className="mb-6 mt-2 max-w-2xl text-ink-500">Une question, un devis, une disponibilité ? Écrivez-nous.</p>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-3xl border border-ink-100 bg-white p-6 md:p-8" aria-label="Formulaire de contact">
          {done ? (
            <div role="status" className="py-8 text-center">
              <p className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl" aria-hidden="true">✓</p>
              <p className="mt-3 text-xl font-semibold">Message envoyé — démonstration</p>
              <p className="mt-1 text-sm text-ink-500">Aucun service externe n&apos;est connecté dans cette maquette. Pour une vraie demande, utilisez WhatsApp.</p>
              <a href={whatsappContactLink(`Bonjour JM Store, ${form.subject} : ${form.message}`)} target="_blank" rel="noreferrer" className="mt-4 inline-block rounded-full bg-whatsapp-500 px-7 py-3 text-sm font-semibold text-white">
                Renvoyer via WhatsApp
              </a>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (form.name.trim().length < 2 || form.message.trim().length < 5) {
                  setError("Veuillez saisir votre nom et un message d'au moins 5 caractères.");
                  return;
                }
                setError("");
                setDone(true);
              }}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="ct-name" className="mb-1 block text-sm font-medium">Nom *</label>
                  <input id="ct-name" value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} autoComplete="name" />
                </div>
                <div>
                  <label htmlFor="ct-phone" className="mb-1 block text-sm font-medium">Téléphone</label>
                  <input id="ct-phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} autoComplete="tel" inputMode="tel" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="ct-subject" className="mb-1 block text-sm font-medium">Sujet</label>
                  <select id="ct-subject" value={form.subject} onChange={(e) => set("subject", e.target.value)} className={inputCls}>
                    {["Question produit", "Disponibilité", "Devis réparation", "Suivi commande", "Autre"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="ct-message" className="mb-1 block text-sm font-medium">Message *</label>
                  <textarea id="ct-message" rows={5} value={form.message} onChange={(e) => set("message", e.target.value)} className={inputCls} />
                </div>
              </div>
              {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
              <button type="submit" className="mt-4 rounded-full bg-ink-950 px-8 py-3 text-sm font-medium text-white">
                Envoyer le message
              </button>
            </form>
          )}
        </section>

        <aside className="h-fit space-y-3" aria-label="Coordonnées">
          {[
            ["Téléphone", siteConfig.phone],
            ["WhatsApp", siteConfig.whatsappDisplay],
            ["E-mail", siteConfig.email],
            ["Adresse", siteConfig.address],
            ["Horaires", siteConfig.hours],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl border border-ink-100 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-400">{k}</p>
              <p className="mt-1 text-sm font-medium">{v}</p>
            </div>
          ))}
          <a href={whatsappContactLink()} target="_blank" rel="noreferrer" className="block rounded-full bg-whatsapp-500 py-3 text-center text-sm font-semibold text-white">
            Discuter sur WhatsApp
          </a>
        </aside>
      </div>
    </main>
  );
}
