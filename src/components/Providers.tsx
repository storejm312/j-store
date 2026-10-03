"use client";

import { CartProvider } from "@/stores/cart";
import { WishlistProvider } from "@/stores/wishlist";
import { QuickViewProvider } from "./QuickView";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <QuickViewProvider>{children}</QuickViewProvider>
      </WishlistProvider>
    </CartProvider>
  );
}
