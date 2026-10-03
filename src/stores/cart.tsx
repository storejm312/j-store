"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ProductVariant } from "@/types";
import { variantPrice } from "@/types";

export interface CartLine {
  productSlug: string;
  productName: string;
  brand: string;
  variantId: string;
  variantLabel: string;
  image: string;
  unitPriceUSD: number;
  qty: number;
  maxStock: number;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotalUSD: number;
  deliveryUSD: number;
  totalUSD: number;
  lastAddedAt: number;
  add: (args: {
    productSlug: string;
    productName: string;
    brand: string;
    variant: ProductVariant;
    variantLabel: string;
    qty?: number;
  }) => void;
  setQty: (variantId: string, qty: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const KEY = "jmstore.cart.v1";
export const FREE_SHIPPING_FROM = 500;
export const DELIVERY_FEE = 10;

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [lastAddedAt, setLastAddedAt] = useState(0);

  useEffect(() => {
    setLines(load());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* stockage indisponible */
    }
  }, [lines]);

  const add: CartContextValue["add"] = useCallback((args) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.variantId === args.variant.id);
      const qty = args.qty ?? 1;
      if (existing) {
        return prev.map((l) =>
          l.variantId === args.variant.id
            ? { ...l, qty: Math.min(l.qty + qty, l.maxStock) }
            : l
        );
      }
      return [
        ...prev,
        {
          productSlug: args.productSlug,
          productName: args.productName,
          brand: args.brand,
          variantId: args.variant.id,
          variantLabel: args.variantLabel,
          image: args.variant.image,
          unitPriceUSD: variantPrice(args.variant),
          qty: Math.min(qty, args.variant.stock),
          maxStock: args.variant.stock,
        },
      ];
    });
    setLastAddedAt(Date.now());
  }, []);

  const setQty = useCallback((variantId: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.variantId !== variantId)
        : prev.map((l) =>
            l.variantId === variantId ? { ...l, qty: Math.min(qty, l.maxStock) } : l
          )
    );
  }, []);

  const remove = useCallback((variantId: string) => {
    setLines((prev) => prev.filter((l) => l.variantId !== variantId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const subtotalUSD = lines.reduce((s, l) => s + l.unitPriceUSD * l.qty, 0);
    const deliveryUSD = lines.length === 0 || subtotalUSD >= FREE_SHIPPING_FROM ? 0 : DELIVERY_FEE;
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotalUSD,
      deliveryUSD,
      totalUSD: subtotalUSD + deliveryUSD,
      lastAddedAt,
      add,
      setQty,
      remove,
      clear,
    };
  }, [lines, lastAddedAt, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans <CartProvider>");
  return ctx;
}
