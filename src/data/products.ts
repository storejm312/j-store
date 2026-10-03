import type { Product } from "@/types";
import { productsAccessories, productsApple, productsGoogle } from "./products-1";
import {
  productsExtra,
  productsInfinix,
  productsItelXiaomi,
  productsSamsung,
  productsTecno,
} from "./products-2";

export const products: Product[] = [
  ...productsApple,
  ...productsGoogle,
  ...productsSamsung,
  ...productsTecno,
  ...productsInfinix,
  ...productsItelXiaomi,
  ...productsAccessories,
  ...productsExtra,
];

export const productBySlug = new Map(products.map((p) => [p.slug, p]));

export function getProduct(slug: string): Product | undefined {
  return productBySlug.get(slug);
}
