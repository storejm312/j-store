import type { BrandSlug, CategorySlug, Product, ProductVariant } from "@/types";

// ─── Helpers de construction (gardent le fichier compact) ──────────

interface ColorOpt {
  name: string;
  hex: string;
  image?: string;
}

interface StorageOpt {
  size: string;
  delta: number;
}

export function buildVariants(args: {
  productId: string;
  colors: ColorOpt[];
  storages: StorageOpt[];
  ram?: string;
  basePrice: number;
  baseSale?: number;
  stocks: number[];
  defaultImage: string;
}): ProductVariant[] {
  const out: ProductVariant[] = [];
  // Sans stockage (accessoires, montres…) : une variante par couleur.
  const storages: StorageOpt[] = args.storages.length ? args.storages : [{ size: "", delta: 0 }];
  args.colors.forEach((c, ci) => {
    storages.forEach((s, si) => {
      const price = args.basePrice + s.delta;
      const sale = args.baseSale !== undefined ? args.baseSale + s.delta : undefined;
      out.push({
        id: `${args.productId}-${ci}-${si}`,
        color: c.name,
        colorHex: c.hex,
        storage: s.size || undefined,
        ram: args.ram,
        priceUSD: price,
        salePriceUSD: sale,
        stock: args.stocks[(ci + si) % args.stocks.length],
        sku: `${args.productId.toUpperCase()}-${c.name.slice(0, 2).toUpperCase()}${s.size.replace(/\s/g, "")}`,
        image: c.image ?? args.defaultImage,
      });
    });
  });
  return out;
}

export function singleVariant(args: {
  productId: string;
  color?: string;
  hex?: string;
  price: number;
  sale?: number;
  stock?: number;
  image: string;
  storage?: string;
  ram?: string;
}): ProductVariant[] {
  return [
    {
      id: `${args.productId}-std`,
      color: args.color ?? "Unique",
      colorHex: args.hex ?? "#3a3a3f",
      storage: args.storage,
      ram: args.ram,
      priceUSD: args.price,
      salePriceUSD: args.sale,
      stock: args.stock ?? 12,
      sku: `${args.productId.toUpperCase()}-STD`,
      image: args.image,
    },
  ];
}

export function phoneSpecs(args: {
  screen: string;
  chip: string;
  camera: string;
  battery: string;
  os: string;
  extra?: [string, string][];
}) {
  return [
    { label: "Écran", value: args.screen },
    { label: "Puce", value: args.chip },
    { label: "Appareil photo", value: args.camera },
    { label: "Batterie", value: args.battery },
    { label: "Système", value: args.os },
    { label: "Garantie", value: "12 mois JM Store" },
    ...(args.extra ?? []).map(([label, value]) => ({ label, value })),
  ];
}

const NOIR = { name: "Noir", hex: "#1b1b1e" };
const BLANC = { name: "Blanc", hex: "#f2f2f4" };
const BLEU = { name: "Bleu", hex: "#2e4a7a" };
const TITANE = { name: "Titane", hex: "#8e8e93" };
const VERT = { name: "Vert", hex: "#3d5a45" };

// ─── APPLE (photos réelles) ─────────────────────────────────────────

const apple1 = "/images/iPhone/iPhone-16-Pro-Max-768x768.webp";
const apple1b = "/images/iPhone/16-Pro-Max-300x300.webp";

export const productsApple: Product[] = [
  {
    id: "iphone-16-pro-max",
    slug: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    brand: "apple",
    category: "smartphones",
    tagline: "Le summum d'Apple. Titane, A18 Pro, 48 Mpx.",
    description:
      "L'iPhone 16 Pro Max repousse toutes les limites : châssis en titane, puce A18 Pro, nouveau bouton Contrôle de l'appareil photo et la meilleure autonomie jamais vue sur iPhone. Disponible à Kinshasa avec garantie JM Store.",
    specs: phoneSpecs({
      screen: '6,9" OLED Super Retina XDR 120 Hz',
      chip: "Apple A18 Pro",
      camera: "Triple 48 + 48 + 12 Mpx",
      battery: "Jusqu'à 33 h de vidéo",
      os: "iOS 18",
    }),
    images: [apple1, apple1b],
    rating: 4.9,
    reviewCount: 84,
    condition: "Neuf",
    variants: buildVariants({
      productId: "ip16pm",
      colors: [NOIR, TITANE, { name: "Bleu profond", hex: "#1f2d4d" }],
      storages: [
        { size: "256 GB", delta: 0 },
        { size: "512 GB", delta: 200 },
        { size: "1 TB", delta: 400 },
      ],
      basePrice: 1299,
      baseSale: 1199,
      stocks: [8, 5, 3],
      defaultImage: apple1,
    }),
    featured: true,
    isNew: true,
    isBestSeller: true,
    isDeal: true,
    createdAt: "2026-09-02",
  },
  {
    id: "iphone-16-pro",
    slug: "iphone-16-pro",
    name: "iPhone 16 Pro",
    brand: "apple",
    category: "smartphones",
    tagline: "Puissance Pro dans un format 6,3 pouces.",
    description:
      "L'iPhone 16 Pro concentre tout le savoir-faire Apple : titane, A18 Pro et zoom optique 5x, dans un format plus compact que le Pro Max.",
    specs: phoneSpecs({
      screen: '6,3" OLED Super Retina XDR 120 Hz',
      chip: "Apple A18 Pro",
      camera: "Triple 48 + 48 + 12 Mpx, zoom 5x",
      battery: "Jusqu'à 27 h de vidéo",
      os: "iOS 18",
    }),
    images: ["/images/iPhone/iPhone-16-Pro-300x300.webp"],
    rating: 4.8,
    reviewCount: 52,
    condition: "Neuf",
    variants: buildVariants({
      productId: "ip16p",
      colors: [NOIR, BLANC, TITANE],
      storages: [
        { size: "128 GB", delta: 0 },
        { size: "256 GB", delta: 100 },
        { size: "512 GB", delta: 300 },
      ],
      basePrice: 1099,
      stocks: [7, 4, 2],
      defaultImage: "/images/iPhone/iPhone-16-Pro-300x300.webp",
    }),
    isNew: true,
    featured: true,
    createdAt: "2026-08-28",
  },
  {
    id: "iphone-16",
    slug: "iphone-16",
    name: "iPhone 16",
    brand: "apple",
    category: "smartphones",
    tagline: "A18, 48 Mpx et Contrôle photo. L'équilibre parfait.",
    description:
      "L'iPhone 16 apporte la puce A18, un double capteur 48 Mpx et le bouton Contrôle de l'appareil photo à un prix plus accessible.",
    specs: phoneSpecs({
      screen: '6,1" OLED Super Retina XDR',
      chip: "Apple A18",
      camera: "Double 48 + 12 Mpx",
      battery: "Jusqu'à 22 h de vidéo",
      os: "iOS 18",
    }),
    images: ["/images/iPhone/iPhone-16-300x300.webp"],
    rating: 4.8,
    reviewCount: 61,
    condition: "Neuf",
    variants: buildVariants({
      productId: "ip16",
      colors: [NOIR, BLANC, BLEU],
      storages: [
        { size: "128 GB", delta: 0 },
        { size: "256 GB", delta: 100 },
        { size: "512 GB", delta: 300 },
      ],
      basePrice: 899,
      baseSale: 849,
      stocks: [10, 6, 3],
      defaultImage: "/images/iPhone/iPhone-16-300x300.webp",
    }),
    isBestSeller: true,
    isDeal: true,
    featured: true,
    createdAt: "2026-08-20",
  },
  {
    id: "iphone-15",
    slug: "iphone-15",
    name: "iPhone 15",
    brand: "apple",
    category: "smartphones",
    tagline: "Dynamic Island et 48 Mpx pour tous.",
    description:
      "L'iPhone 15 adopte la Dynamic Island, un capteur principal 48 Mpx et le port USB-C. Un excellent choix valeur sûre.",
    specs: phoneSpecs({
      screen: '6,1" OLED Super Retina XDR',
      chip: "Apple A16 Bionic",
      camera: "Double 48 + 12 Mpx",
      battery: "Jusqu'à 20 h de vidéo",
      os: "iOS 17",
    }),
    images: ["/images/iPhone/iPhone-15-300x300.webp"],
    rating: 4.7,
    reviewCount: 93,
    condition: "Neuf",
    variants: buildVariants({
      productId: "ip15",
      colors: [NOIR, BLEU, { name: "Rose", hex: "#e8c4c4" }],
      storages: [
        { size: "128 GB", delta: 0 },
        { size: "256 GB", delta: 100 },
        { size: "512 GB", delta: 300 },
      ],
      basePrice: 799,
      baseSale: 749,
      stocks: [9, 6, 4],
      defaultImage: "/images/iPhone/iPhone-15-300x300.webp",
    }),
    isBestSeller: true,
    isDeal: true,
    createdAt: "2026-05-14",
  },
  {
    id: "iphone-15-plus",
    slug: "iphone-15-plus",
    name: "iPhone 15 Plus",
    brand: "apple",
    category: "smartphones",
    tagline: "Grand écran 6,7 pouces, grande autonomie.",
    description:
      "L'iPhone 15 Plus combine un grand écran 6,7 pouces et une excellente autonomie, avec le capteur 48 Mpx et la Dynamic Island.",
    specs: phoneSpecs({
      screen: '6,7" OLED Super Retina XDR',
      chip: "Apple A16 Bionic",
      camera: "Double 48 + 12 Mpx",
      battery: "Jusqu'à 26 h de vidéo",
      os: "iOS 17",
    }),
    images: ["/images/iPhone/iPhone15-Plus-300x300.webp"],
    rating: 4.7,
    reviewCount: 38,
    condition: "Neuf",
    variants: buildVariants({
      productId: "ip15pl",
      colors: [NOIR, BLEU, VERT],
      storages: [
        { size: "128 GB", delta: 0 },
        { size: "256 GB", delta: 100 },
      ],
      basePrice: 899,
      stocks: [6, 4],
      defaultImage: "/images/iPhone/iPhone15-Plus-300x300.webp",
    }),
    createdAt: "2026-04-02",
  },
  {
    id: "iphone-14-pro",
    slug: "iphone-14-pro",
    name: "iPhone 14 Pro",
    brand: "apple",
    category: "smartphones",
    tagline: "Le Pro accessible : 48 Mpx et Dynamic Island.",
    description:
      "L'iPhone 14 Pro reste une référence : triple capteur 48 Mpx, écran toujours activé et châssis acier inoxydable.",
    specs: phoneSpecs({
      screen: '6,1" OLED 120 Hz, Always-On',
      chip: "Apple A16 Bionic",
      camera: "Triple 48 + 12 + 12 Mpx",
      battery: "Jusqu'à 23 h de vidéo",
      os: "iOS 17",
    }),
    images: ["/images/iPhone/iPhone-14-Pro-300x300.webp"],
    rating: 4.7,
    reviewCount: 77,
    condition: "Neuf",
    variants: buildVariants({
      productId: "ip14p",
      colors: [NOIR, { name: "Violet", hex: "#5b5580" }],
      storages: [
        { size: "128 GB", delta: 0 },
        { size: "256 GB", delta: 100 },
        { size: "512 GB", delta: 300 },
      ],
      basePrice: 849,
      baseSale: 799,
      stocks: [5, 4, 2],
      defaultImage: "/images/iPhone/iPhone-14-Pro-300x300.webp",
    }),
    isDeal: true,
    createdAt: "2026-02-11",
  },
  {
    id: "iphone-14",
    slug: "iphone-14",
    name: "iPhone 14",
    brand: "apple",
    category: "smartphones",
    tagline: "Fiable, endurant, excellent en photo de nuit.",
    description:
      "L'iPhone 14 mise sur l'essentiel : double capteur optimisé pour la basse lumière, détection des accidents et superbe autonomie.",
    specs: phoneSpecs({
      screen: '6,1" OLED Super Retina XDR',
      chip: "Apple A15 Bionic",
      camera: "Double 12 + 12 Mpx",
      battery: "Jusqu'à 20 h de vidéo",
      os: "iOS 17",
    }),
    images: ["/images/iPhone/iPhone-14-300x300.webp", "/images/iPhone/iPhone14-300x300.webp"],
    rating: 4.6,
    reviewCount: 112,
    condition: "Neuf",
    variants: buildVariants({
      productId: "ip14",
      colors: [NOIR, BLEU, BLANC],
      storages: [
        { size: "128 GB", delta: 0 },
        { size: "256 GB", delta: 100 },
      ],
      basePrice: 699,
      baseSale: 649,
      stocks: [11, 7],
      defaultImage: "/images/iPhone/iPhone-14-300x300.webp",
    }),
    isBestSeller: true,
    isDeal: true,
    createdAt: "2026-01-19",
  },
  {
    id: "iphone-13-pro",
    slug: "iphone-13-pro",
    name: "iPhone 13 Pro",
    brand: "apple",
    category: "smartphones",
    tagline: "Triple capteur et écran 120 Hz à prix doux.",
    description:
      "L'iPhone 13 Pro offre encore aujourd'hui une expérience haut de gamme : ProMotion 120 Hz, zoom 3x et finition acier.",
    specs: phoneSpecs({
      screen: '6,1" OLED ProMotion 120 Hz',
      chip: "Apple A15 Bionic",
      camera: "Triple 12 + 12 + 12 Mpx",
      battery: "Jusqu'à 22 h de vidéo",
      os: "iOS 17",
    }),
    images: ["/images/iPhone/iphone-13-pro-300x300.webp"],
    rating: 4.6,
    reviewCount: 64,
    condition: "Neuf",
    variants: buildVariants({
      productId: "ip13p",
      colors: [NOIR, BLEU],
      storages: [
        { size: "128 GB", delta: 0 },
        { size: "256 GB", delta: 80 },
      ],
      basePrice: 649,
      stocks: [4, 3],
      defaultImage: "/images/iPhone/iphone-13-pro-300x300.webp",
    }),
    createdAt: "2025-11-08",
  },
  {
    id: "iphone-13",
    slug: "iphone-13",
    name: "iPhone 13",
    brand: "apple",
    category: "smartphones",
    tagline: "Le best-seller rapport qualité-prix.",
    description:
      "L'iPhone 13 reste l'un des meilleurs rapports qualité-prix Apple : double capteur, Face ID et excellentes performances.",
    specs: phoneSpecs({
      screen: '6,1" OLED Super Retina XDR',
      chip: "Apple A15 Bionic",
      camera: "Double 12 + 12 Mpx",
      battery: "Jusqu'à 19 h de vidéo",
      os: "iOS 17",
    }),
    images: [
      "/images/iPhone/iphone-13-black-300x300.webp",
      "/images/iPhone/iphone-13-blanc-300x300.webp",
    ],
    rating: 4.6,
    reviewCount: 148,
    condition: "Neuf",
    variants: buildVariants({
      productId: "ip13",
      colors: [
        { ...NOIR, image: "/images/iPhone/iphone-13-black-300x300.webp" },
        { ...BLANC, image: "/images/iPhone/iphone-13-blanc-300x300.webp" },
        BLEU,
      ],
      storages: [
        { size: "128 GB", delta: 0 },
        { size: "256 GB", delta: 80 },
      ],
      basePrice: 599,
      baseSale: 549,
      stocks: [12, 8],
      defaultImage: "/images/iPhone/iphone-13-black-300x300.webp",
    }),
    isBestSeller: true,
    isDeal: true,
    featured: true,
    createdAt: "2025-10-01",
  },
  {
    id: "iphone-12",
    slug: "iphone-12",
    name: "iPhone 12",
    brand: "apple",
    category: "smartphones",
    tagline: "5G et OLED à petit prix.",
    description:
      "L'iPhone 12 ouvre la porte à l'écosystème Apple 5G : écran OLED, MagSafe et double capteur, à un prix très accessible.",
    specs: phoneSpecs({
      screen: '6,1" OLED Super Retina XDR',
      chip: "Apple A14 Bionic",
      camera: "Double 12 + 12 Mpx",
      battery: "Jusqu'à 17 h de vidéo",
      os: "iOS 17",
    }),
    images: [
      "/images/iPhone/iPhone-12-300x300.webp",
      "/images/iPhone/iPhone-12-green-300x300.webp",
    ],
    rating: 4.5,
    reviewCount: 121,
    condition: "Neuf",
    variants: buildVariants({
      productId: "ip12",
      colors: [
        { ...NOIR, image: "/images/iPhone/iPhone-12-300x300.webp" },
        { ...VERT, image: "/images/iPhone/iPhone-12-green-300x300.webp" },
      ],
      storages: [
        { size: "64 GB", delta: 0 },
        { size: "128 GB", delta: 60 },
      ],
      basePrice: 499,
      baseSale: 449,
      stocks: [9, 6],
      defaultImage: "/images/iPhone/iPhone-12-300x300.webp",
    }),
    isDeal: true,
    createdAt: "2025-08-15",
  },
  {
    id: "iphone-11-pro",
    slug: "iphone-11-pro",
    name: "iPhone 11 Pro",
    brand: "apple",
    category: "smartphones",
    tagline: "Triple capteur, format compact. Reconditionné vérifié.",
    description:
      "iPhone 11 Pro reconditionné et vérifié par nos techniciens : batterie contrôlée, 12 points de contrôle, garantie 6 mois.",
    specs: phoneSpecs({
      screen: '5,8" OLED Super Retina XDR',
      chip: "Apple A13 Bionic",
      camera: "Triple 12 + 12 + 12 Mpx",
      battery: "Jusqu'à 18 h de vidéo",
      os: "iOS 17",
    }),
    images: ["/images/iPhone/iPhone-11-Pro-300x300.webp"],
    rating: 4.4,
    reviewCount: 58,
    condition: "Reconditionné",
    variants: buildVariants({
      productId: "ip11p",
      colors: [NOIR],
      storages: [
        { size: "64 GB", delta: 0 },
        { size: "256 GB", delta: 60 },
      ],
      basePrice: 449,
      stocks: [3, 2],
      defaultImage: "/images/iPhone/iPhone-11-Pro-300x300.webp",
    }),
    createdAt: "2025-06-20",
  },
  {
    id: "iphone-11",
    slug: "iphone-11",
    name: "iPhone 11",
    brand: "apple",
    category: "smartphones",
    tagline: "L'entrée idéale dans l'univers Apple.",
    description:
      "L'iPhone 11 demeure un excellent premier iPhone : double capteur grand angle, Face ID et autonomie d'une journée entière.",
    specs: phoneSpecs({
      screen: '6,1" LCD Liquid Retina',
      chip: "Apple A13 Bionic",
      camera: "Double 12 + 12 Mpx",
      battery: "Jusqu'à 17 h de vidéo",
      os: "iOS 17",
    }),
    images: ["/images/iPhone/iPhone-11.webp", "/images/iPhone/iPhone-11-blanc-300x300.webp"],
    rating: 4.5,
    reviewCount: 167,
    condition: "Neuf",
    variants: buildVariants({
      productId: "ip11",
      colors: [
        { ...NOIR, image: "/images/iPhone/iPhone-11.webp" },
        { ...BLANC, image: "/images/iPhone/iPhone-11-blanc-300x300.webp" },
      ],
      storages: [
        { size: "64 GB", delta: 0 },
        { size: "128 GB", delta: 50 },
      ],
      basePrice: 379,
      baseSale: 349,
      stocks: [14, 10],
      defaultImage: "/images/iPhone/iPhone-11.webp",
    }),
    isBestSeller: true,
    isDeal: true,
    createdAt: "2025-05-11",
  },
  {
    id: "iphone-xr",
    slug: "iphone-xr",
    name: "iPhone XR",
    brand: "apple",
    category: "smartphones",
    tagline: "Grand écran, petit prix. Reconditionné vérifié.",
    description:
      "iPhone XR reconditionné : écran 6,1 pouces, Face ID et puce A12 toujours fluide pour un usage quotidien. Batterie contrôlée.",
    specs: phoneSpecs({
      screen: '6,1" LCD Liquid Retina',
      chip: "Apple A12 Bionic",
      camera: "Simple 12 Mpx",
      battery: "Jusqu'à 16 h de vidéo",
      os: "iOS 17",
    }),
    images: ["/images/iPhone/iPhone-XR.webp"],
    rating: 4.3,
    reviewCount: 89,
    condition: "Reconditionné",
    variants: buildVariants({
      productId: "ipxr",
      colors: [NOIR, BLANC],
      storages: [{ size: "64 GB", delta: 0 }],
      basePrice: 299,
      stocks: [6],
      defaultImage: "/images/iPhone/iPhone-XR.webp",
    }),
    createdAt: "2025-03-02",
  },
  {
    id: "iphone-x",
    slug: "iphone-x",
    name: "iPhone X",
    brand: "apple",
    category: "smartphones",
    tagline: "Le design qui a tout changé. Reconditionné.",
    description:
      "L'iPhone X, premier iPhone à écran bord à bord OLED avec Face ID. Version reconditionnée vérifiée, idéale comme second téléphone.",
    specs: phoneSpecs({
      screen: '5,8" OLED Super Retina',
      chip: "Apple A11 Bionic",
      camera: "Double 12 + 12 Mpx",
      battery: "Jusqu'à 14 h de vidéo",
      os: "iOS 16",
    }),
    images: ["/images/iPhone/iPhone-X.webp", "/images/iPhone/iPhone-X-black.webp"],
    rating: 4.2,
    reviewCount: 47,
    condition: "Reconditionné",
    variants: buildVariants({
      productId: "ipx",
      colors: [
        { ...BLANC, image: "/images/iPhone/iPhone-X.webp" },
        { ...NOIR, image: "/images/iPhone/iPhone-X-black.webp" },
      ],
      storages: [{ size: "64 GB", delta: 0 }],
      basePrice: 279,
      stocks: [4],
      defaultImage: "/images/iPhone/iPhone-X.webp",
    }),
    createdAt: "2025-01-25",
  },
];

// ─── GOOGLE PIXEL (photos réelles) ──────────────────────────────────

export const productsGoogle: Product[] = [
  {
    id: "pixel-9-pro-fold",
    slug: "pixel-9-pro-fold",
    name: "Pixel 9 Pro Fold",
    brand: "google",
    category: "smartphones",
    tagline: "Le pliable Google : 8 pouces déplié, Gemini intégré.",
    description:
      "Le Pixel 9 Pro Fold déploie un écran intérieur de 8 pouces, la puce Tensor G4 et l'IA Gemini pour traduire, résumer et photographier comme jamais.",
    specs: phoneSpecs({
      screen: '8" OLED pliable + 6,3" externe',
      chip: "Google Tensor G4",
      camera: "Triple 48 + 10,5 + 10,8 Mpx",
      battery: "4650 mAh, 24 h+",
      os: "Android 14, 7 ans de mises à jour",
    }),
    images: [
      "/images/GOOGL-PIXEL/Pixel-9pro-fold.webp",
      "/images/GOOGL-PIXEL/Pixel-9pro-fold-1.webp",
    ],
    rating: 4.7,
    reviewCount: 21,
    condition: "Neuf",
    variants: buildVariants({
      productId: "px9pf",
      colors: [NOIR, { name: "Porcelaine", hex: "#efe9df" }],
      storages: [
        { size: "256 GB", delta: 0 },
        { size: "512 GB", delta: 120 },
      ],
      ram: "16 GB",
      basePrice: 1799,
      stocks: [3, 2],
      defaultImage: "/images/GOOGL-PIXEL/Pixel-9pro-fold.webp",
    }),
    isNew: true,
    featured: true,
    createdAt: "2026-09-05",
  },
  {
    id: "pixel-7a",
    slug: "pixel-7a",
    name: "Pixel 7a",
    brand: "google",
    category: "smartphones",
    tagline: "La photo Google à prix serré.",
    description:
      "Le Pixel 7a concentre l'essentiel : capteur 64 Mpx signé Google, Tensor G2 et 5 ans de mises à jour de sécurité.",
    specs: phoneSpecs({
      screen: '6,1" OLED 90 Hz',
      chip: "Google Tensor G2",
      camera: "Double 64 + 13 Mpx",
      battery: "4385 mAh",
      os: "Android 14",
    }),
    images: ["/images/GOOGL-PIXEL/google-pixel-7a-1.webp"],
    rating: 4.5,
    reviewCount: 43,
    condition: "Neuf",
    variants: buildVariants({
      productId: "px7a",
      colors: [NOIR, BLANC],
      storages: [{ size: "128 GB", delta: 0 }],
      ram: "8 GB",
      basePrice: 449,
      baseSale: 399,
      stocks: [7, 5],
      defaultImage: "/images/GOOGL-PIXEL/google-pixel-7a-1.webp",
    }),
    isDeal: true,
    createdAt: "2026-03-18",
  },
  {
    id: "pixel-6a",
    slug: "pixel-6a",
    name: "Pixel 6a",
    brand: "google",
    category: "smartphones",
    tagline: "Compact, endurant, photo HDR magique.",
    description:
      "Le Pixel 6a reste un excellent photophone compact avec la puce Tensor, la gomme magique et un prix très doux.",
    specs: phoneSpecs({
      screen: '6,1" OLED',
      chip: "Google Tensor",
      camera: "Double 12,2 + 12 Mpx",
      battery: "4410 mAh",
      os: "Android 14",
    }),
    images: ["/images/GOOGL-PIXEL/Pixel-6-A.webp"],
    rating: 4.4,
    reviewCount: 35,
    condition: "Neuf",
    variants: buildVariants({
      productId: "px6a",
      colors: [NOIR, VERT],
      storages: [{ size: "128 GB", delta: 0 }],
      ram: "6 GB",
      basePrice: 349,
      stocks: [5, 4],
      defaultImage: "/images/GOOGL-PIXEL/Pixel-6-A.webp",
    }),
    createdAt: "2025-09-30",
  },
  {
    id: "pixel-5a-5g",
    slug: "pixel-5a-5g",
    name: "Pixel 5a 5G",
    brand: "google",
    category: "smartphones",
    tagline: "5G et grande batterie. Reconditionné vérifié.",
    description:
      "Pixel 5a 5G reconditionné : énorme batterie 4680 mAh, certification IP67 et la qualité photo Google. Contrôlé en 12 points.",
    specs: phoneSpecs({
      screen: '6,34" OLED',
      chip: "Snapdragon 765G",
      camera: "Double 12,2 + 16 Mpx",
      battery: "4680 mAh",
      os: "Android 13",
    }),
    images: ["/images/GOOGL-PIXEL/google-pixel-5a-5g-01.webp"],
    rating: 4.3,
    reviewCount: 19,
    condition: "Reconditionné",
    variants: buildVariants({
      productId: "px5a",
      colors: [NOIR],
      storages: [{ size: "128 GB", delta: 0 }],
      ram: "6 GB",
      basePrice: 299,
      stocks: [3],
      defaultImage: "/images/GOOGL-PIXEL/google-pixel-5a-5g-01.webp",
    }),
    createdAt: "2025-07-07",
  },
];

// ─── ACCESSOIRES & AUDIO ────────────────────────────────────────────

export const productsAccessories: Product[] = [
  {
    id: "airpods-max",
    slug: "airpods-max",
    name: "AirPods Max",
    brand: "apple",
    category: "ecouteurs",
    tagline: "Réduction de bruit pro, son spatial.",
    description:
      "Les AirPods Max combinent un design en aluminium, la réduction de bruit active et l'audio spatial personnalisé. Confort exceptionnel.",
    specs: [
      { label: "Type", value: "Casque circum-aural Bluetooth" },
      { label: "Réduction de bruit", value: "Active, 8 micros" },
      { label: "Autonomie", value: "Jusqu'à 20 h avec ANC" },
      { label: "Puce", value: "Apple H1 (chaque oreillette)" },
      { label: "Garantie", value: "12 mois JM Store" },
    ],
    images: [
      "/images/iPhone/Accessoires/121205-airpods-max-800x800.webp",
      "/images/iPhone/Accessoires/AirPods-Max.webp",
    ],
    rating: 4.8,
    reviewCount: 46,
    condition: "Neuf",
    variants: buildVariants({
      productId: "apmax",
      colors: [NOIR, BLANC, BLEU],
      storages: [],
      basePrice: 549,
      baseSale: 499,
      stocks: [6, 4, 3],
      defaultImage: "/images/iPhone/Accessoires/121205-airpods-max-800x800.webp",
    }),
    isBestSeller: true,
    isDeal: true,
    featured: true,
    createdAt: "2026-04-25",
  },
  {
    id: "airpods-pro-2",
    slug: "airpods-pro-2",
    name: "AirPods Pro 2 (USB-C)",
    brand: "apple",
    category: "ecouteurs",
    tagline: "2x plus de réduction de bruit. Boîtier USB-C.",
    description:
      "Les AirPods Pro 2 avec boîtier USB-C offrent une réduction de bruit deux fois supérieure, l'audio adaptatif et jusqu'à 30 h d'écoute.",
    specs: [
      { label: "Type", value: "Écouteurs intra-auriculaires Bluetooth" },
      { label: "Réduction de bruit", value: "Active 2x, mode adaptatif" },
      { label: "Autonomie", value: "6 h + 24 h avec boîtier" },
      { label: "Connecteur", value: "USB-C, charge MagSafe" },
      { label: "Garantie", value: "12 mois JM Store" },
    ],
    images: [],
    rating: 4.9,
    reviewCount: 128,
    condition: "Neuf",
    variants: singleVariant({
      productId: "appro2",
      color: "Blanc",
      hex: "#f2f2f4",
      price: 249,
      sale: 229,
      stock: 15,
      image: "",
    }),
    isBestSeller: true,
    isDeal: true,
    featured: true,
    createdAt: "2026-06-10",
  },
  {
    id: "adaptateur-usbc-30w",
    slug: "adaptateur-usbc-30w",
    name: "Adaptateur USB-C 30W",
    brand: "accessoires",
    category: "accessoires",
    tagline: "Charge rapide officielle : 50 % en 30 min.",
    description:
      "Adaptateur secteur USB-C 30W : recharge la moitié de votre iPhone en 30 minutes. Compact, compatible avec tous les appareils USB-C.",
    specs: [
      { label: "Puissance", value: "30 W USB-C Power Delivery" },
      { label: "Compatibilité", value: "iPhone, iPad, Android, accessoires" },
      { label: "Garantie", value: "12 mois JM Store" },
    ],
    images: ["/images/iPhone/Accessoires/Adaptateur-USB-C-30W.webp"],
    rating: 4.6,
    reviewCount: 74,
    condition: "Neuf",
    variants: singleVariant({
      productId: "ad30w",
      color: "Blanc",
      hex: "#f2f2f4",
      price: 25,
      stock: 40,
      image: "/images/iPhone/Accessoires/Adaptateur-USB-C-30W.webp",
    }),
    isBestSeller: true,
    createdAt: "2026-01-05",
  },
  {
    id: "coque-iphone-16-pro",
    slug: "coque-iphone-16-pro",
    name: "Coque premium iPhone 16 Pro",
    brand: "accessoires",
    category: "accessoires",
    tagline: "Fine, magnétique, protection militaire.",
    description:
      "Coque fine compatible MagSafe pour iPhone 16 Pro : protection antichoc de qualité militaire, boutons aluminium, finition mate premium.",
    specs: [
      { label: "Compatibilité", value: "iPhone 16 Pro" },
      { label: "Magnétique", value: "Oui, compatible MagSafe" },
      { label: "Protection", value: "Antichoc, bords surélevés" },
      { label: "Garantie", value: "6 mois JM Store" },
    ],
    images: [],
    rating: 4.4,
    reviewCount: 31,
    condition: "Neuf",
    variants: buildVariants({
      productId: "cq16p",
      colors: [NOIR, BLEU, { name: "Transparent", hex: "#d7d7dc" }],
      storages: [],
      basePrice: 29,
      stocks: [25, 18, 20],
      defaultImage: "",
    }),
    createdAt: "2026-07-22",
  },
  {
    id: "chargeur-magsafe",
    slug: "chargeur-sans-fil-magsafe",
    name: "Chargeur sans fil magnétique 15W",
    brand: "accessoires",
    category: "accessoires",
    tagline: "Posez, ça charge. 15W sans fil.",
    description:
      "Socle de charge sans fil magnétique 15W : alignement parfait, charge rapide, compatible iPhone et boîtiers AirPods.",
    specs: [
      { label: "Puissance", value: "15 W sans fil" },
      { label: "Fixation", value: "Magnétique" },
      { label: "Câble", value: "USB-C 1,5 m inclus" },
      { label: "Garantie", value: "12 mois JM Store" },
    ],
    images: [],
    rating: 4.5,
    reviewCount: 27,
    condition: "Neuf",
    variants: singleVariant({ productId: "chmg", price: 45, stock: 22, image: "" }),
    createdAt: "2026-05-30",
  },
  {
    id: "apple-watch-se",
    slug: "apple-watch-se",
    name: "Apple Watch SE (2e gén, 40 mm)",
    brand: "apple",
    category: "montres",
    tagline: "L'essentiel Apple Watch à prix doux.",
    description:
      "L'Apple Watch SE 2e génération suit votre activité, votre sommeil et votre fréquence cardiaque, avec la détection des accidents.",
    specs: [
      { label: "Boîtier", value: "40 mm aluminium" },
      { label: "Écran", value: "Retina OLED" },
      { label: "Capteurs", value: "Cardiaque, sommeil, accidents" },
      { label: "Autonomie", value: "Jusqu'à 18 h" },
      { label: "Garantie", value: "12 mois JM Store" },
    ],
    images: [],
    rating: 4.7,
    reviewCount: 39,
    condition: "Neuf",
    variants: buildVariants({
      productId: "awse",
      colors: [NOIR, BLANC],
      storages: [],
      basePrice: 249,
      baseSale: 229,
      stocks: [8, 6],
      defaultImage: "",
    }),
    isDeal: true,
    createdAt: "2026-02-14",
  },
  {
    id: "ipad-10",
    slug: "ipad-10-9-64go",
    name: "iPad 10,9\" 64 Go",
    brand: "apple",
    category: "tablettes",
    tagline: "Polyvalent : travail, cours et divertissement.",
    description:
      "L'iPad 10,9 pouces avec puce A14, Touch ID et port USB-C : parfait pour les cours, le travail et le streaming en famille.",
    specs: [
      { label: "Écran", value: '10,9" Liquid Retina' },
      { label: "Puce", value: "Apple A14 Bionic" },
      { label: "Stockage", value: "64 Go" },
      { label: "Connecteur", value: "USB-C, Touch ID" },
      { label: "Garantie", value: "12 mois JM Store" },
    ],
    images: [],
    rating: 4.7,
    reviewCount: 44,
    condition: "Neuf",
    variants: buildVariants({
      productId: "ipad10",
      colors: [BLANC, BLEU],
      storages: [
        { size: "64 Go", delta: 0 },
        { size: "256 Go", delta: 150 },
      ],
      basePrice: 449,
      baseSale: 419,
      stocks: [7, 4],
      defaultImage: "",
    }),
    isDeal: true,
    featured: true,
    createdAt: "2026-03-09",
  },
];

export type { BrandSlug, CategorySlug };
export type { Product };
