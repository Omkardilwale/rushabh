"use client";

import { useSiteContent } from "@/context/ContentContext";
import { formatPrice } from "@/lib/data";

export function GoldRateTicker() {
  const { content } = useSiteContent();
  const {
    goldRate,
    silverRate,
    diamondRateLabel,
    freeShippingThreshold,
    tickerExtras,
    ratesMode,
  } = content.store;

  const items = [
    `22K Gold: ${formatPrice(goldRate.rate22k)}/g`,
    `18K Gold: ${formatPrice(goldRate.rate18k)}/g`,
    silverRate.rate999 > 0
      ? `Silver 999: ${formatPrice(silverRate.rate999)}/g`
      : null,
    diamondRateLabel.trim() || null,
    ...tickerExtras,
    `Free Insured Shipping on orders above ${formatPrice(freeShippingThreshold)}`,
    `Rates updated: ${goldRate.updatedAt}${ratesMode === "auto" ? " (auto)" : ""}`,
  ].filter((item): item is string => Boolean(item));

  const tickerContent = [...items, ...items].join("   •   ");

  return (
    <div className="overflow-hidden bg-maroon-dark py-2 text-xs text-gold-light">
      <div className="ticker-animate flex whitespace-nowrap">
        <span className="px-4">{tickerContent}</span>
        <span className="px-4" aria-hidden="true">
          {tickerContent}
        </span>
      </div>
    </div>
  );
}
