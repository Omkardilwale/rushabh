import type { Product } from "@/lib/content/types";

export type ShopUrlFilters = {
  metal: string | null;
  occasion: string | null;
  category: string | null;
};

export function parseShopSearchParams(
  searchParams: URLSearchParams,
): ShopUrlFilters {
  return {
    metal: searchParams.get("metal"),
    occasion: searchParams.get("occasion"),
    category: searchParams.get("category"),
  };
}

export function slugifyFilterValue(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function matchesOccasion(product: Product, occasion: string): boolean {
  const name = product.name.toLowerCase();
  const category = slugifyFilterValue(product.category);
  const badge = product.badge?.toLowerCase() ?? "";

  switch (occasion) {
    case "bridal":
    case "wedding":
      return (
        category === "mangalsutra" ||
        name.includes("kundan") ||
        name.includes("mangalsutra") ||
        name.includes("bridal") ||
        badge === "heritage"
      );
    case "engagement":
      return (
        category === "rings" &&
        (name.includes("diamond") || name.includes("solitaire") || name.includes("floral"))
      );
    case "festivals":
      return (
        name.includes("temple") ||
        name.includes("gold") ||
        badge === "trending" ||
        badge === "heritage"
      );
    case "gifting":
      return product.price <= 50000;
    case "daily-wear":
      return (
        category === "earrings" ||
        category === "pendants" ||
        product.price <= 60000
      );
    case "anniversary":
      return name.includes("necklace") || name.includes("diamond");
    default:
      return true;
  }
}

export function matchesShopUrlFilters(
  product: Product,
  filters: ShopUrlFilters,
): boolean {
  if (filters.category) {
    const slug = slugifyFilterValue(filters.category);
    if (slugifyFilterValue(product.category) !== slug) {
      return false;
    }
  }

  const metal = filters.metal ? slugifyFilterValue(filters.metal) : null;

  if (metal === "gold") {
    if (!product.metal.toLowerCase().includes("gold")) {
      return false;
    }
  } else if (metal === "diamond") {
    const isDiamond =
      product.name.toLowerCase().includes("diamond") ||
      product.metal.toLowerCase() === "platinum";
    if (!isDiamond) {
      return false;
    }
  } else if (metal && slugifyFilterValue(product.metal) !== metal) {
    return false;
  }

  if (filters.occasion && !matchesOccasion(product, filters.occasion.toLowerCase())) {
    return false;
  }

  return true;
}

export function getShopFilterLabel(filters: ShopUrlFilters): string | null {
  if (filters.occasion) {
    const labels: Record<string, string> = {
      bridal: "Bridal Collection",
      wedding: "Wedding Jewellery",
      engagement: "Engagement Jewellery",
      festivals: "Festival Jewellery",
      gifting: "Gift Ideas",
      "daily-wear": "Daily Wear",
      anniversary: "Anniversary Jewellery",
    };
    return labels[filters.occasion.toLowerCase()] ?? null;
  }

  const metal = filters.metal ? slugifyFilterValue(filters.metal) : null;
  if (metal === "gold") return "Gold Jewellery";
  if (metal === "diamond") return "Diamond Jewellery";
  if (metal) return `${titleFromSlug(metal)} Jewellery`;

  if (filters.category) {
    return titleFromSlug(slugifyFilterValue(filters.category));
  }

  return null;
}
