function env(name: string, fallback = ""): string {
  const value = process.env[name];
  if (value === undefined || value.trim() === "") return fallback;
  return value.trim();
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export const siteConfig = {
  name: env("NEXT_PUBLIC_SITE_NAME", "Rushabh Jewellers"),
  shortName: env("NEXT_PUBLIC_SITE_SHORT_NAME", "Rushabh"),
  tagline: env("NEXT_PUBLIC_SITE_TAGLINE", "Jewellers"),
  url: env("NEXT_PUBLIC_SITE_URL", "https://rushabh-website.vercel.app"),
  description: env(
    "NEXT_PUBLIC_SITE_DESCRIPTION",
    "Shop exquisite gold and diamond jewellery online. BIS hallmarked, handcrafted designs for weddings, festivals, and everyday elegance.",
  ),
  enquiryEmail: env("NEXT_PUBLIC_ENQUIRY_EMAIL", "omkar.dilwale.od@gmail.com"),
  whatsappNumber: digitsOnly(env("NEXT_PUBLIC_WHATSAPP_NUMBER")),
  contactPhone: digitsOnly(env("NEXT_PUBLIC_CONTACT_PHONE")),
} as const;
