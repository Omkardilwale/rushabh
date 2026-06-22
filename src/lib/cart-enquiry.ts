import { getEnquiryEmail, getWhatsappNumber } from "./contact";
import { formatPrice, getSiteContentSync } from "./data";
import { getSiteConfig } from "./site-config";

export type EnquiryLine = {
  name: string;
  metal: string;
  quantity: number;
  price: number;
};

export function buildCartEnquiryText(lines: EnquiryLine[], total: number): string {
  const { enquiry } = getSiteContentSync();
  const siteName = getSiteConfig().name;
  const itemsText = lines
    .map(
      (line, i) =>
        `${i + 1}. ${line.name} (${line.metal}) — Qty: ${line.quantity} — ${formatPrice(line.price * line.quantity)}`,
    )
    .join("\n");

  return `Hello ${siteName},

${enquiry.cartGreeting}

${itemsText}

Estimated total: ${formatPrice(total)}

${enquiry.cartClosing}`;
}

export function buildWhatsAppUrl(message = ""): string {
  const whatsappNumber = getWhatsappNumber();
  const text = encodeURIComponent(message);
  if (whatsappNumber) {
    return `https://wa.me/${whatsappNumber}?text=${text}`;
  }
  return `https://api.whatsapp.com/send?text=${text}`;
}

export function buildMailtoUrl(subject: string, body = ""): string {
  return `mailto:${getEnquiryEmail()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
