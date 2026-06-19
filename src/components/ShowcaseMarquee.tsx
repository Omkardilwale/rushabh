"use client";

import { JewelryImage } from "@/components/JewelryImage";
import { motion } from "framer-motion";
import { products } from "@/lib/data";

const marqueeItems = [
  ...products.slice(0, 6).map((p) => p.name),
  "BIS Hallmarked",
  "Free Shipping",
  "Lifetime Exchange",
  "Handcrafted in India",
  ...products.slice(0, 6).map((p) => p.name),
];

export function ShowcaseMarquee() {
  return (
    <section className="relative overflow-hidden border-y border-gold/15 bg-maroon-dark py-5">
      <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-maroon-dark to-transparent" />
      <div className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-maroon-dark to-transparent" />

      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      >
        {marqueeItems.map((item, i) => (
          <div key={`${item}-${i}`} className="flex shrink-0 items-center gap-12">
            <span className="font-serif text-lg tracking-wide text-gold-light/80 md:text-xl">
              {item}
            </span>
            <span className="text-gold/40">✦</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

export function ImageMarquee() {
  const images = products.slice(0, 8);

  return (
    <section className="relative overflow-hidden bg-cream py-6">
      <motion.div
        className="flex gap-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {[...images, ...images].map((product, i) => (
          <div
            key={`${product.id}-${i}`}
            className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-gold/20 shadow-sm md:h-36 md:w-36"
          >
            <JewelryImage
              src={product.image}
              alt={product.name}
              fill
            />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
