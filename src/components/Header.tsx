"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { GoldRateTicker } from "./GoldRateTicker";

const navLinks = [
  { label: "Shop All", href: "/shop" },
  { label: "Gold", href: "/shop?metal=gold" },
  { label: "Diamond", href: "/shop?metal=diamond" },
  { label: "Bridal", href: "/shop?occasion=bridal" },
  { label: "Collections", href: "/#collections" },
  { label: "Stores", href: "/#stores" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-ivory/95 shadow-sm backdrop-blur-md">
      <GoldRateTicker />

      <div className="border-b border-gold/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="rounded-lg p-2 text-maroon hover:bg-cream lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-full gold-gradient"
                whileHover={{ scale: 1.08, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="font-serif text-lg font-bold text-maroon-dark">
                  R
                </span>
              </motion.div>
              <div className="hidden sm:block">
                <p className="font-serif text-xl font-semibold tracking-wide text-maroon">
                  Rushabh
                </p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold-dark">
                  Jewellers
                </p>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/shop"
                  ? pathname === "/shop"
                  : pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-foreground/80 transition-colors hover:text-maroon"
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
              aria-label="Cart"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-maroon text-[10px] font-bold text-white">
                0
              </span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="hidden border-b border-gold/10 bg-cream/50 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-8 px-8 py-2">
          <Link
            href="/shop"
            className="text-xs font-medium uppercase tracking-wider text-maroon hover:text-gold-dark"
          >
            New Arrivals
          </Link>
          <span className="text-gold/40">|</span>
          <Link
            href="/#consultation"
            className="text-xs font-medium uppercase tracking-wider text-maroon hover:text-gold-dark"
          >
            Book Appointment
          </Link>
          <span className="text-gold/40">|</span>
          <Link
            href="/#consultation"
            className="text-xs font-medium uppercase tracking-wider text-maroon hover:text-gold-dark"
          >
            Video Consultation
          </Link>
          <span className="text-gold/40">|</span>
          <span className="text-xs text-foreground/60">
            Use code <strong className="text-maroon">WELCOME500</strong> for
            ₹500 off
          </span>
        </div>
      </div>
    </header>
  );
}
