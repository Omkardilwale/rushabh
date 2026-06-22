import { contactPhone, enquiryEmail, whatsappNumber } from "./contact";

export function buildWhatsAppUrl(message = ""): string {
  const text = encodeURIComponent(message);
  if (whatsappNumber) {
    return `https://wa.me/${whatsappNumber}?text=${text}`;
  }
  return `https://api.whatsapp.com/send?text=${text}`;
}

export function buildMailtoUrl(subject: string, body = ""): string {
  return `mailto:${enquiryEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function buildTelUrl(): string | null {
  return contactPhone ? `tel:+${contactPhone}` : null;
}
