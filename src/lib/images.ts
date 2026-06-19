/** Verified remote image URLs (tested HTTP 200). */

const pexels = (id: number, width = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}&fit=crop`;

const unsplash = (path: string, width = 800) =>
  `https://images.unsplash.com/${path}?w=${width}&q=80&auto=format&fit=crop`;

export const images = {
  categories: {
    rings: pexels(1191531, 800),
    earrings: unsplash("photo-1535632066927-ab7c9ab60908", 800),
    necklaces: unsplash("photo-1599643478518-a784e5dc4c8f", 800),
    bangles: unsplash("photo-1611591437281-460bfbe1220a", 800),
    pendants: unsplash("photo-1515562141207-7a88fb7ce338", 800),
    mangalsutra: pexels(4938194, 800),
  },
  hero: {
    heritage: unsplash("photo-1515562141207-7a88fb7ce338", 1920),
    bridal: unsplash("photo-1511285560929-80b456fea0bc", 1920),
    modern: unsplash("photo-1573408301185-9146fe634ad0", 1920),
    traditional: unsplash("photo-1599643478518-a784e5dc4c8f", 1920),
  },
  collections: {
    bridal: unsplash("photo-1511285560929-80b456fea0bc", 1200),
    modern: unsplash("photo-1573408301185-9146fe634ad0", 1200),
    heritage: pexels(1616096, 1200),
  },
  products: {
    ringFloral: pexels(1191531, 800),
    ringSolitaire: unsplash("photo-1603561591411-07134e71a2a9", 800),
    earringsPearl: unsplash("photo-1535632066927-ab7c9ab60908", 800),
    earringsTemple: unsplash("photo-1573408301185-9146fe634ad0", 800),
    necklaceRoyal: unsplash("photo-1599643478518-a784e5dc4c8f", 800),
    banglesClassic: unsplash("photo-1611591437281-460bfbe1220a", 800),
    pendantEmerald: unsplash("photo-1515562141207-7a88fb7ce338", 800),
    mangalsutraAntique: pexels(4938194, 800),
  },
  shopBanner: unsplash("photo-1515562141207-7a88fb7ce338", 1920),
  /** Local SVG fallback when remote image fails */
  fallback: "/images/rings.svg",
} as const;

export type CategoryImageKey = keyof typeof images.categories;

export function categoryImage(slug: string): string {
  const key = slug as CategoryImageKey;
  return images.categories[key] ?? images.categories.rings;
}

export function isRemoteImage(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://");
}
