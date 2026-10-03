import Image from "next/image";
import { getBrand } from "@/data/catalog-meta";

/** Visuel produit : vraie photo si disponible, sinon tuile monogramme élégante. */
export function ProductImage({
  src,
  alt,
  brand,
  className = "",
  sizes = "(max-width: 768px) 50vw, 25vw",
}: {
  src: string;
  alt: string;
  brand: string;
  className?: string;
  sizes?: string;
}) {
  if (!src) {
    const b = getBrand(brand);
    const initial = (b?.name ?? "?").charAt(0);
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_35%,#ffffff_0%,#f1f1f4_70%)] ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="text-5xl font-semibold tracking-tight text-ink-200">{initial}</span>
        <span className="mt-2 text-[11px] font-medium uppercase tracking-[0.2em] text-ink-400">
          {b?.name ?? ""}
        </span>
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden bg-white ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        loading="lazy"
        className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.04]"
      />
    </div>
  );
}

export function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-sm ${className}`}
      role="img"
      aria-label={`Note ${rating} sur 5`}
    >
      <span className="tracking-tight text-amber-500" aria-hidden="true">
        {"★".repeat(Math.round(rating))}
        <span className="text-ink-200">{"★".repeat(5 - Math.round(rating))}</span>
      </span>
      <span className="text-xs font-medium text-ink-500">{rating.toFixed(1)}</span>
    </span>
  );
}
