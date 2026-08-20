import type { SiteContent } from "./types";

export const defaultSiteContent: SiteContent = {
  site: {
    name: "Rushabh Jewellers",
    shortName: "Rushabh",
    tagline: "Jewellers",
    url: "https://vrushabhjewellers.in",
    description:
      "Shop exquisite gold and diamond jewellery online. BIS hallmarked, handcrafted designs for weddings, festivals, and everyday elegance.",
    copyrightYear: 2026,
    brandBlurb:
      "Celebrating the rich heritage of Indian jewellery with exquisite craftsmanship and timeless design. BIS hallmarked, trusted quality.",
    logoLetter: "R",
  },
  contact: {
    enquiryEmail: "omkar.dilwale.od@gmail.com",
    whatsappNumber: "8830688733",
    contactPhone: "",
  },
  store: {
    goldRate: {
      rate24k: 0,
      rate22k: 0,
      rate18k: 0,
      updatedAt: "Not Available",
    },
    silverRate: {
      rate999: 0,
      updatedAt: "Not Available",
    },
    diamondRate: {
      ratePerCarat: 0,
      updatedAt: "Not Available",
    },
    ratesMode: "manual",
    ratesLastSyncedAt: "",
    diamondRateLabel: "Diamond: Price on enquiry",
    promo: { code: "WELCOME500", discount: 500 },
    freeShippingThreshold: 25000,
    storeLocation: "15+ stores across Maharashtra",
    tickerExtras: [
      "BIS Hallmarked Jewellery",
      "Lifetime Exchange Available",
    ],
    marqueeExtras: [
      "BIS Hallmarked",
      "Free Shipping",
      "Lifetime Exchange",
      "Handcrafted in India",
    ],
  },
  navigation: {
    primary: [
      { label: "Shop All", href: "/shop" },
      { label: "Gold", href: "/shop?metal=gold" },
      { label: "Diamond", href: "/shop?metal=diamond" },
      { label: "Bridal", href: "/shop?occasion=bridal" },
      { label: "Collections", href: "/#collections" },
      { label: "Stores", href: "/#stores" },
    ],
    secondary: [
      { label: "New Arrivals", href: "/shop" },
      { label: "Book Appointment", href: "/#consultation" },
      { label: "Video Consultation", href: "/#consultation" },
    ],
    mobileExtras: [
      { label: "New Arrivals", href: "/shop" },
      { label: "Book Appointment", href: "/#consultation" },
      { label: "Video Consultation", href: "/#consultation" },
    ],
  },
  footer: {
    shop: [
      { label: "Gold Jewellery", href: "/shop?metal=gold" },
      { label: "Diamond Jewellery", href: "/shop?metal=diamond" },
      { label: "Bridal Collection", href: "/shop?occasion=bridal" },
      { label: "New Arrivals", href: "/shop" },
      { label: "Gifts", href: "/shop?occasion=gifting" },
    ],
    help: [
      { label: "Track Order", href: "#" },
      { label: "Shipping Info", href: "#" },
      { label: "Returns & Exchange", href: "#" },
      { label: "Ring Size Guide", href: "#" },
      { label: "Jewellery Care", href: "#" },
    ],
    company: [
      { label: "About Us", href: "#" },
      { label: "Our Stores", href: "#stores" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
    ],
    legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms & Conditions", href: "#" },
      { label: "BIS Certification", href: "#" },
    ],
    storeHeading: "Find a Store Near You",
    storeCta: "Locate Store",
  },
  hero: {
    slides: [],
    stats: [
      { value: "25+", label: "Years Legacy" },
      { value: "50K+", label: "Happy Customers" },
      { value: "100%", label: "BIS Certified" },
    ],
    primaryCta: { label: "Shop Collection", href: "/shop" },
    secondaryCta: { label: "Virtual Try-On", href: "#consultation" },
  },
  sections: {
    categories: {
      eyebrow: "Explore",
      heading: "Shop by Category",
      subtitle: "Infinite designs, handcrafted for utmost brilliance.",
      ctaLabel: "View All Categories",
      ctaHref: "/shop",
    },
    featuredCollections: {
      eyebrow: "Curated For You",
      heading: "Featured Collections",
    },
    productGrid: {
      eyebrow: "Trending Now",
      heading: "Top Sellers",
      subtitle: "Products our customers love the most.",
      ctaLabel: "Explore All",
      ctaHref: "/shop",
    },
    occasions: {
      eyebrow: "For Every Moment",
      heading: "Shop for Occasions",
      subtitle: "Find the perfect piece for life's special moments.",
      ctaLabel: "Shop Collection",
      ctaHref: "/shop",
    },
    testimonials: {
      eyebrow: "From Our Patrons",
      heading: "Customer Stories",
    },
    consultation: {
      eyebrow: "We're Here to Help",
      heading: "Connect With Us",
      subtitle:
        "Our experts are always available to guide you at your convenience.",
    },
    shop: {
      heading: "Our Collection",
      subtitle: "exquisite designs found",
    },
  },
  consultation: {
    options: [
      {
        type: "video",
        title: "Video Consultation",
        description: "Connect with our jewellery experts via live video call",
        cta: "Schedule Now",
      },
      {
        type: "appointment",
        title: "Store Appointment",
        description: "Visit our showroom for a personalized experience",
        cta: "Book Visit",
      },
      {
        type: "whatsapp",
        title: "WhatsApp Chat",
        description: "Get instant answers and recommendations",
        cta: "Chat Now",
      },
      {
        type: "callback",
        title: "Call Back",
        description: "Request a call from our jewellery consultant",
        cta: "Request Call",
      },
    ],
  },
  shop: {
    bannerImage: "",
    metalFilters: ["All", "18K Gold", "22K Gold", "Platinum"],
    priceFilters: [
      { label: "All Prices", min: 0, max: null },
      { label: "Under ₹30,000", min: 0, max: 30000 },
      { label: "₹30,000 - ₹60,000", min: 30000, max: 60000 },
      { label: "Above ₹60,000", min: 60000, max: null },
    ],
    emptyTitle: "No products found",
    emptyMessage: "Try adjusting your filters",
  },
  categories: [],
  collections: [],
  products: [],
  occasions: [],
  trustFeatures: [],
  testimonials: [],
  productDetail: {
    defaultDescription:
      "Handcrafted with precision and certified for purity. BIS hallmarked with lifetime exchange available.",
    trustChips: ["BIS Hallmarked", "Free Shipping", "Lifetime Exchange"],
    relatedHeading: "You May Also Like",
  },
  enquiry: {
    cartGreeting: "I would like to enquire about the following items:",
    cartClosing:
      "Please share availability, pricing, and delivery details.\n\nThank you!",
    cartSubject: "Jewellery enquiry from",
  },
};

