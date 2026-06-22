"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useSiteContent } from "@/context/ContentContext";
import { useMounted } from "@/hooks/useMounted";
import { formatPrice } from "@/lib/data";
import { GoldRateTicker } from "./GoldRateTicker";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const mounted = useMounted();
  const { content } = useSiteContent();
  const { site, store, navigation } = content;
  const navLinks = navigation.primary;
  const mobileExtras = navigation.mobileExtras;

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNavClick = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-ivory/95 shadow-sm backdrop-blur-md">
      <GoldRateTicker />

      <div className="border-b border-gold/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-maroon hover:bg-cream lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/" className="flex items-center gap-2" onClick={handleNavClick}>
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-full gold-gradient"
                whileHover={{ scale: 1.08, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="font-serif text-lg font-bold text-maroon-dark">{site.logoLetter}</span>
              </motion.div>
              <div className="hidden sm:block">
                <p className="font-serif text-xl font-semibold tracking-wide text-maroon">
                  {site.shortName}
                </p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold-dark">
                  {site.tagline}
                </p>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/shop" ? pathname === "/shop" : pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="relative text-sm font-medium text-foreground/80 transition-colors hover:text-maroon"
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 gold-gradient"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            {[
              { icon: Search, label: "Search" },
              { icon: User, label: "Account", hidden: "hidden sm:block" },
              { icon: Heart, label: "Wishlist", hidden: "hidden sm:block" },
            ].map(({ icon: Icon, label, hidden }) => (
              <motion.button
                key={label}
                type="button"
                className={`rounded-full p-2.5 text-maroon transition-colors hover:bg-cream ${hidden ?? ""}`}
                aria-label={label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon className="h-5 w-5" />
              </motion.button>
            ))}
            <motion.button
              type="button"
              className="relative rounded-full p-2.5 text-maroon transition-colors hover:bg-cream"
              aria-label={`Enquiry list${mounted && itemCount > 0 ? `, ${itemCount} items` : ""}`}
              onClick={openCart}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ShoppingBag className="h-5 w-5" />
              {mounted && itemCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 min-w-4 items-center justify-center rounded-full bg-maroon px-0.5 text-[10px] font-bold text-white">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-40 bg-maroon-dark/40 lg:hidden"
              aria-label="Close menu overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              className="fixed left-0 right-0 top-[var(--header-offset,7.5rem)] z-50 max-h-[calc(100dvh-var(--header-offset,7.5rem))] overflow-y-auto border-b border-gold/20 bg-ivory shadow-lg lg:hidden"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mx-auto max-w-7xl px-4 py-4">
                <ul className="space-y-1">
                  {navLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={handleNavClick}
                        className="block rounded-lg px-4 py-3 text-sm font-semibold uppercase tracking-wider text-maroon transition-colors hover:bg-cream"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="my-3 border-t border-gold/15" />
                <ul className="space-y-1">
                  {mobileExtras.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={handleNavClick}
                        className="block rounded-lg px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-foreground/70 transition-colors hover:bg-cream hover:text-maroon"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <div className="hidden border-b border-gold/10 bg-cream/50 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-8 px-8 py-2">
          {navigation.secondary.map((link, i) => (
            <span key={link.label} className="flex items-center gap-8">
              {i > 0 && <span className="text-gold/40">|</span>}
              <Link
                href={link.href}
                className="text-xs font-medium uppercase tracking-wider text-maroon hover:text-gold-dark"
              >
                {link.label}
              </Link>
            </span>
          ))}
          <span className="text-gold/40">|</span>
          <span className="text-xs text-foreground/60">
            Use code <strong className="text-maroon">{store.promo.code}</strong> for{" "}
            {formatPrice(store.promo.discount)} off
          </span>
        </div>
      </div>
    </header>
  );
}
