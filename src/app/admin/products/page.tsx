"use client";

import { useMemo, useState } from "react";
import { brands } from "@/data/catalog-meta";
import { products as seed } from "@/data/products";
import type { Product } from "@/types";
import { formatUSD } from "@/config/site";
import { productFromPrice } from "@/types";

interface Draft {
  name: string;
  brand: string;
  category: string;
  price: string;
  sale: string;
  stock: string;
  sku: string;
  description: string;
}

const EMPTY_DRAFT: Draft = { name: "", brand: "apple", category: "smartphones", price: "", sale: "", stock: "10", sku: "", description: "" };

export default function AdminProducts() {
  const [items, setItems] = useState<Product[]>(seed);
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState("");
  const [modal, setModal] = useState<null | { mode: "add" } | { mode: "edit"; slug: string }>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);

  const filtered = useMemo(
    () =>
      items.filter(
        (p) =>
          (!q || p.name.toLowerCase().includes(q.toLowerCase()) || p.variants.some((v) => v.sku.toLowerCase().includes(q.toLowerCase()))) &&
          (!brand || p.brand === brand)
      ),
    [items, q, brand]
  );

  const openAdd = () => {
    setDraft(EMPTY_DRAFT);
    setModal({ mode: "add" });
  };
  const openEdit = (p: Product) => {
    const v = p.variants[0];
    setDraft({
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: String(v?.priceUSD ?? ""),
      sale: v?.salePriceUSD ? String(v.salePriceUSD) : "",
      stock: String(v?.stock ?? 0),
      sku: v?.sku ?? "",
      description: p.description,
    });
    setModal({ mode: "edit", slug: p.slug });
  };

  const save = () => {
    if (!draft.name.trim() || !Number(draft.price)) {
      alert("Nom et prix (nombre) sont requis.");
      return;
    }
    if (modal?.mode === "add") {
      const slug = draft.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-demo";
      const price = Number(draft.price);
      const sale = draft.sale ? Number(draft.sale) : undefined;
      const stock = Number(draft.stock) || 0;
      setItems((prev) => [
        {
          id: slug,
          slug,
          name: draft.name.trim(),
          brand: draft.brand as Product["brand"],
          category: draft.category as Product["category"],
          tagline: "Ajouté depuis l'admin démo.",
          description: draft.description || "Description à compléter.",
          specs: [{ label: "Garantie", value: "12 mois JM Store" }],
          images: [],
          rating: 5,
          reviewCount: 0,
          condition: "Neuf",
          variants: [
            { id: `${slug}-std`, color: "Unique", colorHex: "#3a3a3f", priceUSD: price, salePriceUSD: sale, stock, sku: draft.sku || `${slug.toUpperCase()}-STD`, image: "" },
          ],
          isNew: true,
          createdAt: new Date().toISOString().slice(0, 10),
        },
        ...prev,
      ]);
    } else if (modal?.mode === "edit") {
      setItems((prev) =>
        prev.map((p) => {
          if (p.slug !== modal.slug) return p;
          const price = Number(draft.price);
          const sale = draft.sale ? Number(draft.sale) : undefined;
          const stock = Number(draft.stock) || 0;
          return {
            ...p,
            name: draft.name.trim(),
            description: draft.description,
            variants: p.variants.map((v, i) =>
              i === 0 ? { ...v, priceUSD: price, salePriceUSD: sale, stock, sku: draft.sku || v.sku } : v
            ),
          };
        })
      );
    }
    setModal(null);
  };

  const remove = (slug: string) => {
    if (confirm("Supprimer ce produit (démo locale) ?")) setItems((prev) => prev.filter((p) => p.slug !== slug));
  };

  const setField = (k: keyof Draft, v: string) => setDraft((d) => ({ ...d, [k]: v }));
  const inputCls = "w-full rounded-xl border border-ink-200 px-3 py-2.5 text-sm outline-none focus:border-ink-950";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Produits ({items.length})</h1>
          <p className="text-sm text-ink-500">Modifications locales (état frontend) — branchées sur Supabase plus tard.</p>
        </div>
        <button type="button" onClick={openAdd} className="rounded-full bg-ink-950 px-5 py-2.5 text-sm font-medium text-white">
          + Ajouter un produit
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <label className="sr-only" htmlFor="ap-q">Rechercher un produit</label>
        <input id="ap-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher (nom, SKU)…" className="min-w-52 flex-1 rounded-full border border-ink-200 bg-white px-4 py-2.5 text-sm outline-none" />
        <label className="sr-only" htmlFor="ap-brand">Filtrer par marque</label>
        <select id="ap-brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="rounded-full border border-ink-200 bg-white px-4 py-2.5 text-sm">
          <option value="">Toutes marques</option>
          {brands.map((b) => (
            <option key={b.slug} value={b.slug}>{b.name}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-100 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-xs uppercase tracking-widest text-ink-400">
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Marque</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {filtered.map((p) => {
              const f = productFromPrice(p);
              return (
                <tr key={p.slug} className={f.stock <= 5 ? "bg-amber-50/50" : ""}>
                  <td className="px-4 py-3 font-medium">{p.name}<span className="block font-mono text-xs text-ink-400">{p.variants[0]?.sku}</span></td>
                  <td className="px-4 py-3">{p.brand}</td>
                  <td className="px-4 py-3 font-semibold">{formatUSD(f.sale ?? f.price)}</td>
                  <td className={`px-4 py-3 font-semibold ${f.stock <= 5 ? "text-amber-700" : ""}`}>{f.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => openEdit(p)} className="rounded-full border border-ink-200 px-3 py-1 text-xs font-medium">Modifier</button>
                      <button type="button" onClick={() => remove(p.slug)} className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-600">Supprimer</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-8 text-center text-ink-500">Aucun produit trouvé.</p>}
      </div>

      {modal && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={modal.mode === "add" ? "Ajouter un produit" : "Modifier le produit"}>
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 sm:rounded-3xl">
            <h2 className="text-lg font-semibold">{modal.mode === "add" ? "Ajouter un produit" : "Modifier le produit"}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="ap-name" className="mb-1 block text-sm font-medium">Nom *</label>
                <input id="ap-name" value={draft.name} onChange={(e) => setField("name", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label htmlFor="ap-mbrand" className="mb-1 block text-sm font-medium">Marque</label>
                <select id="ap-mbrand" value={draft.brand} onChange={(e) => setField("brand", e.target.value)} className={inputCls}>
                  {brands.map((b) => (
                    <option key={b.slug} value={b.slug}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="ap-cat" className="mb-1 block text-sm font-medium">Catégorie</label>
                <select id="ap-cat" value={draft.category} onChange={(e) => setField("category", e.target.value)} className={inputCls}>
                  {["smartphones", "tablettes", "montres", "ecouteurs", "accessoires"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="ap-price" className="mb-1 block text-sm font-medium">Prix (USD) *</label>
                <input id="ap-price" type="number" value={draft.price} onChange={(e) => setField("price", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label htmlFor="ap-sale" className="mb-1 block text-sm font-medium">Promo (USD)</label>
                <input id="ap-sale" type="number" value={draft.sale} onChange={(e) => setField("sale", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label htmlFor="ap-stock" className="mb-1 block text-sm font-medium">Stock</label>
                <input id="ap-stock" type="number" value={draft.stock} onChange={(e) => setField("stock", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label htmlFor="ap-sku" className="mb-1 block text-sm font-medium">SKU</label>
                <input id="ap-sku" value={draft.sku} onChange={(e) => setField("sku", e.target.value)} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="ap-desc" className="mb-1 block text-sm font-medium">Description</label>
                <textarea id="ap-desc" rows={3} value={draft.description} onChange={(e) => setField("description", e.target.value)} className={inputCls} />
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button type="button" onClick={() => setModal(null)} className="flex-1 rounded-full border border-ink-200 py-3 text-sm font-medium">Annuler</button>
              <button type="button" onClick={save} className="flex-1 rounded-full bg-ink-950 py-3 text-sm font-medium text-white">Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
