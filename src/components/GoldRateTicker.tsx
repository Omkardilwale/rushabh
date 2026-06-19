import { goldRate } from "@/lib/data";

export function GoldRateTicker() {
  const items = [
    `22K Gold: ₹${goldRate.rate22k.toLocaleString("en-IN")}/g`,
    `18K Gold: ₹${goldRate.rate18k.toLocaleString("en-IN")}/g`,
    "BIS Hallmarked Jewellery",
    "Free Insured Shipping on orders above ₹25,000",
    "Lifetime Exchange Available",
    `Rates updated: ${goldRate.updatedAt}`,
  ];

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
