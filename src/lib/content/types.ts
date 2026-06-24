export type NavLink = { label: string; href: string };

export type ProductRateType =
  | "gold24k"
  | "gold22k"
  | "gold18k"
  | "silver"
  | "diamond"
  | "none";

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  metal: string;
  image: string;
  badge?: string;
  rating: number;
  description?: string;
  /** Net weight in grams (shown on cards, used for live price calc). */
  weight?: number;
  /** Which live metal rate to apply to the weight. "none" = use manual price. */
  rateType?: ProductRateType;
  /** Extra/custom charges (making, stones, GST, etc.) added to the metal value. */
  makingCharges?: number;
};

export type Category = {
  name: string;
  slug: string;
  image: string;
  count: number;
};

export type Collection = {
  name: string;
  description: string;
  image: string;
  tag: string;
};

export type Occasion = { name: string; count: string };

export type TrustFeature = {
  title: string;
  description: string;
  icon: "shield" | "refresh" | "truck" | "rotate";
};

export type Testimonial = {
  name: string;
  location: string;
  text: string;
  rating: number;
};

export type HeroSlide = {
  image: string;
  tagline: string;
  title: string;
  accent: string;
  subtitle: string;
  description: string;
};

export type HeroStat = { value: string; label: string };

export type SectionCopy = {
  eyebrow?: string;
  heading: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export type ConsultationOption = {
  title: string;
  description: string;
  cta: string;
  type: "video" | "appointment" | "whatsapp" | "callback";
};

export type PriceFilter = {
  label: string;
  min: number;
  max: number | null;
};

export type SiteContent = {
  site: {
    name: string;
    shortName: string;
    tagline: string;
    url: string;
    description: string;
    copyrightYear: number;
    brandBlurb: string;
    logoLetter: string;
  };
  contact: {
    enquiryEmail: string;
    whatsappNumber: string;
    contactPhone: string;
  };
  store: {
    goldRate: {
      rate24k: number;
      rate22k: number;
      rate18k: number;
      updatedAt: string;
    };
    silverRate: { rate999: number; updatedAt: string };
    diamondRate: { ratePerCarat: number; updatedAt: string };
    ratesMode: "manual" | "auto";
    ratesLastSyncedAt: string;
    diamondRateLabel: string;
    promo: { code: string; discount: number };
    freeShippingThreshold: number;
    storeLocation: string;
    tickerExtras: string[];
    marqueeExtras: string[];
  };
  navigation: {
    primary: NavLink[];
    secondary: NavLink[];
    mobileExtras: NavLink[];
  };
  footer: {
    shop: NavLink[];
    help: NavLink[];
    company: NavLink[];
    legal: NavLink[];
    storeHeading: string;
    storeCta: string;
  };
  hero: {
    slides: HeroSlide[];
    stats: HeroStat[];
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  sections: {
    categories: SectionCopy;
    featuredCollections: SectionCopy;
    productGrid: SectionCopy;
    occasions: SectionCopy;
    testimonials: SectionCopy;
    consultation: SectionCopy;
    shop: SectionCopy;
  };
  consultation: { options: ConsultationOption[] };
  shop: {
    bannerImage: string;
    metalFilters: string[];
    priceFilters: PriceFilter[];
    emptyTitle: string;
    emptyMessage: string;
  };
  categories: Category[];
  collections: Collection[];
  products: Product[];
  occasions: Occasion[];
  trustFeatures: TrustFeature[];
  testimonials: Testimonial[];
  productDetail: {
    defaultDescription: string;
    trustChips: string[];
    relatedHeading: string;
  };
  enquiry: {
    cartGreeting: string;
    cartClosing: string;
    cartSubject: string;
  };
};
