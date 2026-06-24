import type {
  Category,
  Collection,
  ConsultationOption,
  HeroSlide,
  HeroStat,
  NavLink,
  Occasion,
  Product,
  Testimonial,
  TrustFeature,
} from "@/lib/content/types";
import { images } from "@/lib/images";

export function nextProductId(products: Product[]): number {
  if (products.length === 0) return 1;
  return Math.max(...products.map((p) => p.id)) + 1;
}

export function uniqueSlug(base: string, existing: string[]): string {
  let slug = base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item";
  if (!existing.includes(slug)) return slug;
  let n = 2;
  while (existing.includes(`${slug}-${n}`)) n += 1;
  return `${slug}-${n}`;
}

export function emptyProduct(id: number): Product {
  return {
    id,
    name: "New Product",
    category: "Rings",
    price: 25000,
    metal: "22K Gold",
    image: images.products.ringFloral,
    rating: 4.5,
    weight: 5,
    rateType: "gold22k",
    makingCharges: 2000,
  };
}

export function emptyCategory(existingSlugs: string[]): Category {
  const slug = uniqueSlug("new-category", existingSlugs);
  return {
    name: "New Category",
    slug,
    image: images.categories.rings,
    count: 0,
  };
}

export function emptyCollection(): Collection {
  return {
    name: "New Collection",
    description: "Collection description",
    image: images.collections.modern,
    tag: "New",
  };
}

export function emptyHeroSlide(): HeroSlide {
  return {
    image: images.hero.heritage,
    tagline: "New Collection",
    title: "Your",
    accent: "Title",
    subtitle: "Goes Here",
    description: "Add a short description for this hero slide.",
  };
}

export function emptyHeroStat(): HeroStat {
  return { value: "100+", label: "New Stat" };
}

export function emptyNavLink(): NavLink {
  return { label: "New Link", href: "/" };
}

export function emptyTestimonial(): Testimonial {
  return {
    name: "Customer Name",
    location: "City",
    text: "Share a customer review here.",
    rating: 5,
  };
}

export function emptyTrustFeature(): TrustFeature {
  return {
    title: "New Feature",
    description: "Short description",
    icon: "shield",
  };
}

export function emptyOccasion(): Occasion {
  return { name: "New Occasion", count: "50+ designs" };
}

export function emptyConsultationOption(): ConsultationOption {
  return {
    type: "video",
    title: "New Consultation",
    description: "Describe this contact option.",
    cta: "Get Started",
  };
}
