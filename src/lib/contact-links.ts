import { getEnquiryEmail, getWhatsappNumber, getContactPhone } from "./contact";

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

export function buildTelUrl(): string | null {
  const phone = getContactPhone();
  return phone ? `tel:+${phone}` : null;
}
