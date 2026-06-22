import Link from "next/link";
import { Globe, MapPin, Share2 } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { storeSettings } from "@/lib/store-settings";

const footerLinks = {
  shop: [
    { label: "Gold Jewellery", href: "/shop?metal=gold" },
    { label: "Diamond Jewellery", href: "/shop?metal=diamond" },
    { label: "Bridal Collection", href: "/shop?occasion=bridal" },
    { label: "New Arrivals", href: "/shop" },
    { label: "Gifts", href: "/shop?occasion=gifting" },
  ],
  help: [
    { label: "Track Order", href: "#" },
    { label: "Shipping Info", href: "#" },
    { label: "Returns & Exchange", href: "#" },
    { label: "Ring Size Guide", href: "#" },
    { label: "Jewellery Care", href: "#" },
  ],
  company: [
    { label: "About Us", href: "#" },
    { label: "Our Stores", href: "#stores" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contact", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer id="stores" className="relative overflow-hidden bg-maroon-dark text-white/70">
      <div className="relative mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full gold-gradient">
                <span className="font-serif text-lg font-bold text-maroon-dark">
                  R
                </span>
              </div>
              <div>
                <p className="font-serif text-xl font-semibold text-white">
                  {siteConfig.shortName}
                </p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold-light">
                  {siteConfig.tagline}
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              Celebrating the rich heritage of Indian jewellery with exquisite
              craftsmanship and timeless design. BIS hallmarked, trusted quality.
            </p>
            <div className="mt-6 flex gap-3">
              {[Share2, Globe, Share2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:border-gold hover:text-gold-light"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-light">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-gold/20 bg-white/5 p-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-light" />
              <div>
                <p className="font-medium text-white">Find a Store Near You</p>
                <p className="text-sm">
                  {storeSettings.storeLocation}. Visit for a premium shopping
                  experience.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-full border border-gold/40 px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-gold-light transition-colors hover:bg-gold/10"
            >
              Locate Store
            </button>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs">
              © 2026 {siteConfig.name}. All rights
              reserved.
            </p>
            <div className="flex gap-6 text-xs">
              <Link href="#" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-white">
                Terms & Conditions
              </Link>
              <Link href="#" className="hover:text-white">
                BIS Certification
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
