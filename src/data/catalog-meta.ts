import type { Brand, Category, Collection } from "@/types";

export const brands: Brand[] = [
  { slug: "apple", name: "Apple", baseline: "iPhone, iPad & accessoires" },
  { slug: "samsung", name: "Samsung", baseline: "Galaxy S, Z & A" },
  { slug: "tecno", name: "Tecno", baseline: "Camon, Phantom & Spark" },
  { slug: "infinix", name: "Infinix", baseline: "Note, Hot & Smart" },
  { slug: "itel", name: "Itel", baseline: "L'essentiel à petit prix" },
  { slug: "xiaomi", name: "Xiaomi", baseline: "Redmi & Poco" },
  { slug: "google", name: "Google", baseline: "Pixel & Pixel Fold" },
  { slug: "accessoires", name: "Accessoires", baseline: "Audio, charge & protection" },
];

export const categories: Category[] = [
  {
    slug: "smartphones",
    name: "Smartphones",
    description: "Les derniers smartphones Apple, Samsung, Tecno, Infinix et Xiaomi.",
    image: "/images/iPhone/iPhone-16-Pro-Max-768x768.webp",
  },
  {
    slug: "tablettes",
    name: "Tablettes",
    description: "iPad et tablettes Android pour travailler et se divertir.",
  },
  {
    slug: "montres",
    name: "Montres connectées",
    description: "Apple Watch et montres connectées pour suivre votre activité.",
  },
  {
    slug: "ecouteurs",
    name: "Écouteurs",
    description: "AirPods et écouteurs sans fil à réduction de bruit.",
    image: "/images/iPhone/Accessoires/121205-airpods-max-800x800.webp",
  },
  {
    slug: "accessoires",
    name: "Accessoires",
    description: "Chargeurs, câbles, coques et protections.",
    image: "/images/iPhone/Accessoires/Adaptateur-USB-C-30W.webp",
  },
];

export const collections: Collection[] = [
  {
    slug: "nouveautes",
    title: "New Arrivals",
    description: "Les derniers modèles arrivés en boutique.",
    image: "/images/iPhone/iPhone-16-Pro-Max-768x768.webp",
    filter: { isNew: true },
  },
  {
    slug: "best-sellers",
    title: "Best Sellers",
    description: "Les produits préférés de nos clients.",
    image: "/images/iPhone/iPhone-15-300x300.webp",
    filter: { isBestSeller: true },
  },
  {
    slug: "premium",
    title: "Premium",
    description: "Le haut de gamme : Pro, Ultra, Fold et éditions spéciales.",
    image: "/images/TECNO/Phantom/Tecno-PHANTOM-V-Fold2-5G.webp",
    filter: { minPriceUSD: 600 },
  },
  {
    slug: "deals",
    title: "Deals",
    description: "Promotions et offres à durée limitée.",
    image: "/images/iPhone/iphone-13-black-300x300.webp",
    filter: { isDeal: true },
  },
  {
    slug: "moins-de-300",
    title: "Under $300",
    description: "D'excellents smartphones à moins de 300 $.",
    image: "/images/TECNO/Spark/Tecno-Spark-30.webp",
    filter: { maxPriceUSD: 300, categories: ["smartphones"] },
  },
  {
    slug: "apple",
    title: "Apple",
    description: "Tout l'univers Apple : iPhone, iPad, Watch et AirPods.",
    image: "/images/iPhone/iPhone-16-Pro-300x300.webp",
    filter: { brands: ["apple", "accessoires"] },
  },
  {
    slug: "android",
    title: "Android",
    description: "Samsung, Tecno, Infinix, Xiaomi et Google Pixel.",
    image: "/images/TECNO/Camon/Tecno-Camon-30-premier.webp",
    filter: { brands: ["samsung", "tecno", "infinix", "xiaomi", "google", "itel"] },
  },
  {
    slug: "accessoires",
    title: "Accessoires",
    description: "Audio, charge rapide, coques et protections.",
    image: "/images/iPhone/Accessoires/AirPods-Max.webp",
    filter: { categories: ["ecouteurs", "accessoires"] },
  },
];

export function getBrand(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}
