import Image from "next/image";
import { siteConfig } from "@/config/site";

/** Logo officiel JM Store — utilisé dans le header, le footer et l'admin. */
export function SiteLogo({ size = 40, priority = false }: { size?: number; priority?: boolean }) {
  return (
    <Image
      src={siteConfig.logo}
      alt="JM Store — vente de téléphones"
      width={size}
      height={size}
      priority={priority}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  );
}
