import { images } from "./images";

export const goldRate = {
  rate22k: 6850,
  rate18k: 5620,
  updatedAt: "Today, 10:30 AM",
};

export const categories = [
  {
    name: "Rings",
    slug: "rings",
    image: images.categories.rings,
    count: 240,
  },
  {
    name: "Earrings",
    slug: "earrings",
    image: images.categories.earrings,
    count: 380,
  },
  {
    name: "Necklaces",
    slug: "necklaces",
    image: images.categories.necklaces,
    count: 195,
  },
  {
    name: "Bangles",
    slug: "bangles",
    image: images.categories.bangles,
    count: 156,
  },
  {
    name: "Pendants",
    slug: "pendants",
    image: images.categories.pendants,
    count: 210,
  },
  {
    name: "Mangalsutra",
    slug: "mangalsutra",
    image: images.categories.mangalsutra,
    count: 89,
  },
];

export const collections = [
  {
    name: "Bridal Brilliance",
    description: "Timeless pieces for your special day",
    image: images.collections.bridal,
    tag: "Wedding",
  },
  {
    name: "Modern Muses",
    description: "Contemporary designs for everyday elegance",
    image: images.collections.modern,
    tag: "Daily Wear",
  },
  {
    name: "Heritage Gold",
    description: "Crafted with traditional artistry",
    image: images.collections.heritage,
    tag: "Traditional",
  },
];

export const products = [
  {
    id: 1,
    name: "Floral Diamond Ring",
    category: "Rings",
    price: 45999,
    originalPrice: 52999,
    metal: "18K Gold",
    image: images.products.ringFloral,
    badge: "Bestseller",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Pearl Drop Earrings",
    category: "Earrings",
    price: 28500,
    metal: "22K Gold",
    image: images.products.earringsPearl,
    badge: "New",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Royal Kundan Necklace",
    category: "Necklaces",
    price: 125000,
    metal: "22K Gold",
    image: images.products.necklaceRoyal,
    rating: 5.0,
  },
  {
    id: 4,
    name: "Classic Gold Bangle Set",
    category: "Bangles",
    price: 67800,
    metal: "22K Gold",
    image: images.products.banglesClassic,
    badge: "Trending",
    rating: 4.7,
  },
  {
    id: 5,
    name: "Emerald Pendant",
    category: "Pendants",
    price: 34200,
    originalPrice: 38900,
    metal: "18K Gold",
    image: images.products.pendantEmerald,
    rating: 4.6,
  },
  {
    id: 6,
    name: "Diamond Solitaire Ring",
    category: "Rings",
    price: 89000,
    metal: "Platinum",
    image: images.products.ringSolitaire,
    badge: "Premium",
    rating: 4.9,
  },
  {
    id: 7,
    name: "Temple Gold Earrings",
    category: "Earrings",
    price: 52300,
    metal: "22K Gold",
    image: images.products.earringsTemple,
    rating: 4.8,
  },
  {
    id: 8,
    name: "Antique Mangalsutra",
    category: "Mangalsutra",
    price: 41500,
    metal: "22K Gold",
    image: images.products.mangalsutraAntique,
    badge: "Heritage",
    rating: 4.9,
  },
];

export const occasions = [
  { name: "Wedding", count: "500+ designs" },
  { name: "Engagement", count: "200+ designs" },
  { name: "Festivals", count: "350+ designs" },
  { name: "Gifting", count: "180+ designs" },
  { name: "Daily Wear", count: "400+ designs" },
  { name: "Anniversary", count: "150+ designs" },
];

export const trustFeatures = [
  {
    title: "BIS Hallmarked",
    description: "Every piece certified for purity",
    icon: "shield",
  },
  {
    title: "Lifetime Exchange",
    description: "Exchange anytime at current gold rate",
    icon: "refresh",
  },
  {
    title: "Free Shipping",
    description: "Insured delivery across India",
    icon: "truck",
  },
  {
    title: "15-Day Returns",
    description: "Hassle-free return policy",
    icon: "rotate",
  },
];

export const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    text: "The craftsmanship is exceptional. My bridal set was exactly as shown online. Rushabh Jewellers made my wedding truly special.",
    rating: 5,
  },
  {
    name: "Ananya Reddy",
    location: "Hyderabad",
    text: "Beautiful designs and transparent pricing. The video consultation helped me choose the perfect mangalsutra.",
    rating: 5,
  },
  {
    name: "Rahul Mehta",
    location: "Delhi",
    text: "Bought an engagement ring — the quality exceeded expectations. Fast delivery and excellent packaging.",
    rating: 5,
  },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getProductById(id: number) {
  return products.find((p) => p.id === id);
}

export function getRelatedProducts(id: number, limit = 4) {
  const product = getProductById(id);
  if (!product) return products.slice(0, limit);
  return products
    .filter((p) => p.id !== id && p.category === product.category)
    .slice(0, limit);
}
