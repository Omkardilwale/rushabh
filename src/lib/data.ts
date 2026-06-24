import {
  getRuntimeContent,
  setRuntimeContent,
  type SiteContent,
} from "@/lib/content/client";
import type { Product, ProductRateType } from "@/lib/content/types";

export type { Product };

type StoreSettings = SiteContent["store"];

export function getMetalRatePerGram(
  rateType: ProductRateType | undefined,
  store: StoreSettings,
): number | null {
  switch (rateType) {
    case "gold24k":
      return store.goldRate.rate24k;
    case "gold22k":
      return store.goldRate.rate22k;
    case "gold18k":
      return store.goldRate.rate18k;
    case "silver":
      return store.silverRate.rate999;
    case "diamond":
      return store.diamondRate.ratePerCarat;
    default:
      return null;
  }
}

/** Unit a product's weight is measured in: carats for diamond, grams otherwise. */
export function getProductUnit(rateType: ProductRateType | undefined): "g" | "ct" {
  return rateType === "diamond" ? "ct" : "g";
}

/**
 * Today's total price for a product: when a weight + live rate type are set,
 * total = weight × today's metal rate + custom charges. Otherwise falls back
 * to the manually entered price.
 */
export function computeProductPrice(
  product: Product,
  store: StoreSettings,
): number {
  const rate =
    product.weight && product.weight > 0
      ? getMetalRatePerGram(product.rateType, store)
      : null;

  if (rate && product.weight) {
    return Math.round(rate * product.weight + (product.makingCharges ?? 0));
  }

  return product.price;
}

export function formatWeight(weight?: number, unit: "g" | "ct" = "g"): string | null {
  if (!weight || weight <= 0) return null;
  const rounded = Math.round(weight * 100) / 100;
  return `${rounded} ${unit}`;
}

export function setSiteContent(content: SiteContent) {
  setRuntimeContent(content);
}

export function getSiteContentSync(): SiteContent {
  return getRuntimeContent();
}

export function getGoldRate() {
  return getRuntimeContent().store.goldRate;
}

export function getCategories() {
  return getRuntimeContent().categories;
}

export function getCollections() {
  return getRuntimeContent().collections;
}

export function getProducts() {
  return getRuntimeContent().products;
}

export function getOccasions() {
  return getRuntimeContent().occasions;
}

export function getTrustFeatures() {
  return getRuntimeContent().trustFeatures;
}

export function getTestimonials() {
  return getRuntimeContent().testimonials;
}

/** @deprecated Use getGoldRate() or useSiteContent() */
export const goldRate = new Proxy({} as ReturnType<typeof getGoldRate>, {
  get(_target, prop) {
    return getGoldRate()[prop as keyof ReturnType<typeof getGoldRate>];
  },
});

/** @deprecated Use getProducts() or useSiteContent() */
export const products = new Proxy([] as Product[], {
  get(_target, prop) {
    const list = getProducts();
    if (prop === "length") return list.length;
    if (prop === Symbol.iterator) return list[Symbol.iterator].bind(list);
    const index = Number(prop);
    if (!Number.isNaN(index)) return list[index];
    const value = list[prop as keyof Product[]];
    if (typeof value === "function") return value.bind(list);
    return value;
  },
});

/** @deprecated Use getters or useSiteContent() */
export const categories = new Proxy([] as ReturnType<typeof getCategories>, {
  get(_target, prop) {
    const list = getCategories();
    if (prop === "length") return list.length;
    if (prop === Symbol.iterator) return list[Symbol.iterator].bind(list);
    const index = Number(prop);
    if (!Number.isNaN(index)) return list[index];
    const value = list[prop as keyof typeof list];
    if (typeof value === "function") return value.bind(list);
    return value;
  },
});

export const collections = new Proxy([] as ReturnType<typeof getCollections>, {
  get(_target, prop) {
    const list = getCollections();
    if (prop === "length") return list.length;
    if (prop === Symbol.iterator) return list[Symbol.iterator].bind(list);
    const index = Number(prop);
    if (!Number.isNaN(index)) return list[index];
    const value = list[prop as keyof typeof list];
    if (typeof value === "function") return value.bind(list);
    return value;
  },
});

export const occasions = new Proxy([] as ReturnType<typeof getOccasions>, {
  get(_target, prop) {
    const list = getOccasions();
    if (prop === "length") return list.length;
    if (prop === Symbol.iterator) return list[Symbol.iterator].bind(list);
    const index = Number(prop);
    if (!Number.isNaN(index)) return list[index];
    const value = list[prop as keyof typeof list];
    if (typeof value === "function") return value.bind(list);
    return value;
  },
});

export const trustFeatures = new Proxy(
  [] as ReturnType<typeof getTrustFeatures>,
  {
    get(_target, prop) {
      const list = getTrustFeatures();
      if (prop === "length") return list.length;
      if (prop === Symbol.iterator) return list[Symbol.iterator].bind(list);
      const index = Number(prop);
      if (!Number.isNaN(index)) return list[index];
      const value = list[prop as keyof typeof list];
      if (typeof value === "function") return value.bind(list);
      return value;
    },
  },
);

export const testimonials = new Proxy([] as ReturnType<typeof getTestimonials>, {
  get(_target, prop) {
    const list = getTestimonials();
    if (prop === "length") return list.length;
    if (prop === Symbol.iterator) return list[Symbol.iterator].bind(list);
    const index = Number(prop);
    if (!Number.isNaN(index)) return list[index];
    const value = list[prop as keyof typeof list];
    if (typeof value === "function") return value.bind(list);
    return value;
  },
});

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getProductById(id: number) {
  return getProducts().find((p) => p.id === id);
}

export function getRelatedProducts(id: number, limit = 4) {
  const product = getProductById(id);
  if (!product) return getProducts().slice(0, limit);
  return getProducts()
    .filter((p) => p.id !== id && p.category === product.category)
    .slice(0, limit);
}

export function getAllProductIds() {
  return getProducts().map((p) => p.id);
}
