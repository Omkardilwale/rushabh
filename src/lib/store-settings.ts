/**
 * Store-facing settings (gold rates, promos, shipping, locations).
 * Update here for now — wire to an admin page later.
 */
export const storeSettings = {
  goldRate: {
    rate22k: 6850,
    rate18k: 5620,
    updatedAt: "Today, 10:30 AM",
  },
  promo: {
    code: "WELCOME500",
    discount: 500,
  },
  freeShippingThreshold: 25000,
  storeLocation: "15+ stores across Maharashtra",
} as const;
