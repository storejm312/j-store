// ─── JM STORE · configuration centrale ─────────────────────────────
// Ne jamais écrire le numéro WhatsApp en dur dans les composants.
// Tout passe par ici pour un remplacement en 1 ligne.

export const siteConfig = {
  name: "JM Store",
  logo: "/logo-jm-store.png",
  tagline: "Technology, beautifully chosen.",
  description:
    "Smartphones, tablettes, montres connectées et accessoires premium à Kinshasa. Produits authentiques, garantie, livraison rapide.",
  whatsappNumber: "243992057204", // +243 992 057 204 — format international sans "+"
  whatsappDisplay: "+243 992 057 204",
  phone: "+243 992 057 204",
  email: "contact@jmstore.cd",
  address: "Boulevard du 30 Juin, Kinshasa, RDC",
  hours: "Lun – Sam · 9h00 – 19h00",
  currency: {
    main: "USD" as const,
    secondary: "CDF" as const,
    // Taux de conversion de démonstration (modifiable / branchable sur API plus tard)
    usdToCdf: 2850,
  },
} as const;

export function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCDF(usdValue: number): string {
  const cdf = Math.round(usdValue * siteConfig.currency.usdToCdf);
  return new Intl.NumberFormat("fr-CD").format(cdf) + " FC";
}

/** Affiche "$899 · 2 562 150 FC" */
export function formatDualPrice(usdValue: number): string {
  return `${formatUSD(usdValue)} · ${formatCDF(usdValue)}`;
}
