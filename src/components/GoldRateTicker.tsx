"use client";

import { useSiteContent } from "@/context/ContentContext";
import { formatPrice } from "@/lib/data";

export function GoldRateTicker() {
  const { content } = useSiteContent();
  const {
    goldRate,
    silverRate,
    diamondRate,
    diamondRateLabel,
    freeShippingThreshold,
    tickerExtras,
    ratesMode,
  } = content.store;

  const items = [
    goldRate.rate24k > 0 ? `24K Gold: ${formatPrice(goldRate.rate24k)}/g` : null,
    `22K Gold: ${formatPrice(goldRate.rate22k)}/g`,
    `18K Gold: ${formatPrice(goldRate.rate18k)}/g`,
    silverRate.rate999 > 0
      ? `Silver 999: ${formatPrice(silverRate.rate999)}/g`
      : null,
    diamondRate?.ratePerCarat > 0
      ? `Diamond: ${formatPrice(diamondRate.ratePerCarat)}/ct`
      : null,
    diamondRateLabel.trim() || null,
    ...tickerExtras,
    `Free Insured Shipping on orders above ${formatPrice(freeShippingThreshold)}`,
    `Rates updated: ${goldRate.updatedAt}`,
  ].filter((item): item is string => Boolean(item));

  const tickerContent = [...items, ...items].join("   •   ");
  const isLive = ratesMode === "auto";

  return (
    <div className="flex items-stretch overflow-hidden bg-maroon-dark text-xs text-gold-light">
      {isLive && (
        <div className="flex shrink-0 items-center gap-1.5 border-r border-gold/20 bg-maroon px-3 py-2 font-semibold uppercase tracking-wider">
          <span className="relative flex h-2 w-2">
            <span className="pulse-ring absolute inset-0 rounded-full bg-emerald-400" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="hidden sm:inline">Live Rates</span>
        </div>
      )}
      <div className="flex-1 overflow-hidden py-2">
        <div className="ticker-animate flex whitespace-nowrap">
          <span className="px-4">{tickerContent}</span>
          <span className="px-4" aria-hidden="true">
            {tickerContent}
          </span>
        </div>
      </div>
    </div>
  );
}
