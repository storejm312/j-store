"use client";

import { getBrand, getCategory } from "@/data/catalog-meta";
import type { Facets } from "@/repositories/types";

export interface FilterState {
  brands: string[];
  categories: string[];
  minPrice?: number;
  maxPrice?: number;
  storages: string[];
  rams: string[];
  colors: string[];
  conditions: string[];
  onlyPromo: boolean;
  onlyInStock: boolean;
}

export const EMPTY_FILTERS: FilterState = {
  brands: [],
  categories: [],
  storages: [],
  rams: [],
  colors: [],
  conditions: [],
  onlyPromo: false,
  onlyInStock: false,
};

function toggle(list: string[], v: string): string[] {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

function Check({ label, count, checked, onChange }: { label: string; count?: number; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-black" />
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="text-xs text-ink-400">{count}</span>}
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-ink-100 py-4 last:border-0">
      <legend className="px-0 text-xs font-semibold uppercase tracking-[0.15em] text-ink-500">{title}</legend>
      <div className="mt-1">{children}</div>
    </fieldset>
  );
}

export function FilterPanel({
  facets,
  filters,
  onChange,
  onClear,
}: {
  facets: Facets;
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onClear: () => void;
}) {
  const activeCount =
    filters.brands.length + filters.categories.length + filters.storages.length +
    filters.rams.length + filters.colors.length + filters.conditions.length +
    (filters.onlyPromo ? 1 : 0) + (filters.onlyInStock ? 1 : 0) +
    (filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0);
  const set = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch });

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-semibold">Filtres {activeCount > 0 && <span className="text-sm font-normal text-ink-500">({activeCount})</span>}</p>
        {activeCount > 0 && (
          <button type="button" onClick={onClear} className="text-sm font-medium underline underline-offset-4">
            Tout effacer
          </button>
        )}
      </div>
      <Section title="Marque">
        {facets.brands.map((b) => (
          <Check key={b.slug} label={getBrand(b.slug)?.name ?? b.slug} count={b.count} checked={filters.brands.includes(b.slug)} onChange={() => set({ brands: toggle(filters.brands, b.slug) })} />
        ))}
      </Section>
      <Section title="Catégorie">
        {facets.categories.map((c) => (
          <Check key={c.slug} label={getCategory(c.slug)?.name ?? c.slug} count={c.count} checked={filters.categories.includes(c.slug)} onChange={() => set({ categories: toggle(filters.categories, c.slug) })} />
        ))}
      </Section>
      <Section title="Prix (USD)">
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="f-min">Prix minimum</label>
          <input id="f-min" type="number" min={0} placeholder="Min" value={filters.minPrice ?? ""} onChange={(e) => set({ minPrice: e.target.value ? Number(e.target.value) : undefined })} className="w-full rounded-xl border border-ink-200 px-3 py-2 text-sm outline-none focus:border-ink-950" />
          <span className="text-ink-400">–</span>
          <label className="sr-only" htmlFor="f-max">Prix maximum</label>
          <input id="f-max" type="number" min={0} placeholder={`Max ${facets.maxPrice}`} value={filters.maxPrice ?? ""} onChange={(e) => set({ maxPrice: e.target.value ? Number(e.target.value) : undefined })} className="w-full rounded-xl border border-ink-200 px-3 py-2 text-sm outline-none focus:border-ink-950" />
        </div>
      </Section>
      {facets.storages.length > 0 && (
        <Section title="Stockage">
          {facets.storages.map((s) => (
            <Check key={s.value} label={s.value} count={s.count} checked={filters.storages.includes(s.value)} onChange={() => set({ storages: toggle(filters.storages, s.value) })} />
          ))}
        </Section>
      )}
      {facets.rams.length > 0 && (
        <Section title="RAM">
          {facets.rams.map((s) => (
            <Check key={s.value} label={s.value} count={s.count} checked={filters.rams.includes(s.value)} onChange={() => set({ rams: toggle(filters.rams, s.value) })} />
          ))}
        </Section>
      )}
      <Section title="Couleur">
        <div className="flex flex-wrap gap-2 pt-1">
          {facets.colors.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => set({ colors: toggle(filters.colors, c.value) })}
              aria-pressed={filters.colors.includes(c.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${filters.colors.includes(c.value) ? "border-ink-950 bg-ink-950 text-white" : "border-ink-200"}`}
            >
              {c.value}
            </button>
          ))}
        </div>
      </Section>
      <Section title="État">
        {(["Neuf", "Reconditionné"] as const).map((c) => (
          <Check key={c} label={c} checked={filters.conditions.includes(c)} onChange={() => set({ conditions: toggle(filters.conditions, c) })} />
        ))}
      </Section>
      <Section title="Offres">
        <Check label="En promotion" checked={filters.onlyPromo} onChange={() => set({ onlyPromo: !filters.onlyPromo })} />
        <Check label="En stock uniquement" checked={filters.onlyInStock} onChange={() => set({ onlyInStock: !filters.onlyInStock })} />
      </Section>
    </div>
  );
}
