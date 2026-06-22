import { getRuntimeContent } from "@/lib/content/client";

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function normalizeWhatsAppNumber(raw: string): string {
  const digits = digitsOnly(raw);
  if (digits.length === 10 && /^[6-9]/.test(digits)) {
    return `91${digits}`;
  }
  return digits;
}

export function getSiteConfig() {
  const { site, contact } = getRuntimeContent();
  return {
    name: site.name,
    shortName: site.shortName,
    tagline: site.tagline,
    url: site.url,
    description: site.description,
    enquiryEmail: contact.enquiryEmail,
    whatsappNumber: normalizeWhatsAppNumber(contact.whatsappNumber),
    contactPhone: digitsOnly(contact.contactPhone),
  } as const;
}

/** @deprecated Use getSiteConfig() */
export const siteConfig = new Proxy({} as ReturnType<typeof getSiteConfig>, {
  get(_target, prop) {
    return getSiteConfig()[prop as keyof ReturnType<typeof getSiteConfig>];
  },
});
