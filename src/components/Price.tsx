import { formatCDF, formatUSD } from "@/config/site";

/** Prix double devise : $ principal, FC secondaire, ancien prix si promo. */
export function Price({
  price,
  sale,
  size = "md",
  cdf = true,
}: {
  price: number;
  sale?: number;
  size?: "sm" | "md" | "lg";
  cdf?: boolean;
}) {
  const main = sale ?? price;
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
  } as const;
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <span className={`font-semibold tracking-tight ${sizes[size]}`}>{formatUSD(main)}</span>
      {sale !== undefined && (
        <span className="text-sm text-ink-400 line-through">{formatUSD(price)}</span>
      )}
      {cdf && <span className="w-full text-xs font-normal text-ink-500">{formatCDF(main)}</span>}
    </div>
  );
}

export function DiscountBadge({ price, sale }: { price: number; sale?: number }) {
  if (sale === undefined) return null;
  const pct = Math.round((1 - sale / price) * 100);
  return (
    <span className="rounded-full bg-ink-950 px-2 py-0.5 text-[11px] font-semibold text-white">
      −{pct}%
    </span>
  );
}
