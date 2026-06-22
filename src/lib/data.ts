import {
  getRuntimeContent,
  setRuntimeContent,
  type SiteContent,
} from "@/lib/content/client";
import type { Product } from "@/lib/content/types";

export type { Product };

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
