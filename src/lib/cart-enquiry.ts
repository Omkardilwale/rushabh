import { formatPrice } from "./data";
import { siteConfig } from "./site-config";
import { buildMailtoUrl, buildWhatsAppUrl } from "./contact-links";

export type EnquiryLine = {
  name: string;
  metal: string;
  quantity: number;
  price: number;
};

export function buildCartEnquiryText(lines: EnquiryLine[], total: number): string {
  const itemsText = lines
    .map(
      (line, i) =>
        `${i + 1}. ${line.name} (${line.metal}) — Qty: ${line.quantity} — ${formatPrice(line.price * line.quantity)}`,
    )
    .join("\n");

  return `Hello ${siteConfig.name},

I would like to enquire about the following items:

${itemsText}

Estimated total: ${formatPrice(total)}

Please share availability, pricing, and delivery details.

Thank you!`;
}

export { buildMailtoUrl, buildWhatsAppUrl };
