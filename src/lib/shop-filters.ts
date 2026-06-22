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

function matchesOccasion(product: Product, occasion: string): boolean {
  const name = product.name.toLowerCase();
  const category = product.category.toLowerCase();
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
    const slug = filters.category.toLowerCase();
    if (product.category.toLowerCase() !== slug) {
      return false;
    }
  }

  if (filters.metal === "gold") {
    if (!product.metal.toLowerCase().includes("gold")) {
      return false;
    }
  } else if (filters.metal === "diamond") {
    const isDiamond =
      product.name.toLowerCase().includes("diamond") ||
      product.metal.toLowerCase() === "platinum";
    if (!isDiamond) {
      return false;
    }
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

  if (filters.metal === "gold") return "Gold Jewellery";
  if (filters.metal === "diamond") return "Diamond Jewellery";

  if (filters.category) {
    return filters.category.charAt(0).toUpperCase() + filters.category.slice(1);
  }

  return null;
}
