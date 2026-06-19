"use client";

import { useCallback, useEffect, useState } from "react";
import { JewelryImage } from "@/components/JewelryImage";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/data";
import { OrnamentSticker, SectionOrnaments } from "./effects/OrnamentStickers";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./effects/ScrollReveal";

export function Categories() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="relative overflow-hidden bg-ivory py-24">
      <SectionOrnaments />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <ScrollReveal className="mb-14 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-gold-dark">
            Explore
          </p>
          <h2 className="mt-2 font-serif text-4xl font-light text-maroon md:text-5xl">
            Shop by Category
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-foreground/60">
            Infinite designs, handcrafted for utmost brilliance.
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:gap-5">
          {categories.map((category) => (
            <StaggerItem key={category.slug}>
              <Link
                href={`/shop?category=${category.slug}`}
                className="group relative block overflow-hidden rounded-2xl"
                onMouseEnter={() => setHovered(category.slug)}
                onMouseLeave={() => setHovered(null)}
              >
                <motion.div
                  className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream"
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <JewelryImage
                    src={category.image}
                    alt={category.name}
                    fill
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark/90 via-maroon-dark/20 to-transparent transition-opacity group-hover:from-maroon-dark/95" />

                  <motion.div
                    className="absolute inset-0 border-2 border-gold/0 transition-colors group-hover:border-gold/40"
                    style={{ borderRadius: "1rem" }}
                  />

                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                    <h3 className="font-serif text-lg font-medium text-white">
                      {category.name}
                    </h3>
                    <motion.p
                      className="text-xs text-gold-light/80"
                      animate={{ opacity: hovered === category.slug ? 1 : 0.7 }}
                    >
                      {category.count} designs
                    </motion.p>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                      Explore
                    </span>
                  </div>
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollReveal className="mt-14 text-center" delay={0.2}>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 rounded-full border border-maroon/20 bg-white px-8 py-3 text-sm font-semibold uppercase tracking-wider text-maroon shadow-sm transition-all hover:border-gold hover:shadow-md"
          >
            View All Categories
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </ScrollReveal>
      </div>

      <OrnamentSticker variant="diamond" className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-10" size={60} />
    </section>
  );
}
