import { siteConfig } from "@/config/site";

export interface OrderLine {
  name: string;
  variant?: string;
  qty: number;
  unitPriceUSD: number;
}

export interface OrderSummary {
  orderId: string;
  lines: OrderLine[];
  totalUSD: number;
  customerName: string;
  customerPhone: string;
  deliveryMode: string;
}

export function whatsappLink(message: string): string {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function generateWhatsAppOrderMessage(order: OrderSummary): string {
  const lines = order.lines
    .map(
      (l, i) =>
        `${i + 1}. ${l.name}${l.variant ? ` (${l.variant})` : ""} x${l.qty} — $${l.unitPriceUSD * l.qty}`
    )
    .join("\n");
  return (
    `Bonjour ${siteConfig.name} ! Je confirme ma commande ${order.orderId} :\n` +
    `${lines}\n` +
    `Total : $${order.totalUSD}\n` +
    `Nom : ${order.customerName}\n` +
    `Téléphone : ${order.customerPhone}\n` +
    `Livraison : ${order.deliveryMode}`
  );
}

export function whatsappOrderLink(order: OrderSummary): string {
  return whatsappLink(generateWhatsAppOrderMessage(order));
}

export function whatsappContactLink(message = "Bonjour JM Store, je cherche un produit."): string {
  return whatsappLink(message);
}
