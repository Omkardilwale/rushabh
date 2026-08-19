"use client";

import { useState } from "react";
import { JewelryImage } from "@/components/JewelryImage";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useSiteContent } from "@/context/ContentContext";
import { HeritageCardTopBand, JharokhaFrame } from "@/components/ui/JharokhaFrame";
import { categoryImage } from "@/lib/images";
import { slugifyFilterValue } from "@/lib/shop-filters";
import { RoyalBackground } from "./effects/RoyalBackground";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./effects/ScrollReveal";

export function Categories() {
  const [hovered, setHovered] = useState<string | null>(null);
  const { content } = useSiteContent();
  const { categories, products } = content;
  const copy = content.sections.categories;
  const visibleCategories = categories
    .map((category) => {
      const slug = slugifyFilterValue(category.slug || category.name);
      const count = products.filter(
        (product) => slugifyFilterValue(product.category) === slug,
      ).length;

      return {
        ...category,
        slug,
        count: count || category.count,
      };
    })
    .concat(
      products
        .filter(
          (product, index, list) =>
            list.findIndex(
              (item) =>
                slugifyFilterValue(item.category) ===
                slugifyFilterValue(product.category),
            ) === index &&
            !categories.some(
              (category) =>
                slugifyFilterValue(category.slug || category.name) ===
                slugifyFilterValue(product.category),
            ),
        )
        .map((product) => {
          const slug = slugifyFilterValue(product.category);
          return {
            name: product.category,
            slug,
            image: product.image || categoryImage(slug),
            count: products.filter(
              (item) => slugifyFilterValue(item.category) === slug,
            ).length,
          };
        }),
    );

  return (
    <section className="relative overflow-hidden bg-ivory py-24">
      <RoyalBackground density="rich" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
        <ScrollReveal className="mb-14 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-gold-dark">
            {copy.eyebrow}
          </p>
          <h2 className="mt-2 font-serif text-4xl font-light text-maroon md:text-5xl">
            {copy.heading}
          </h2>
          {copy.subtitle && (
            <p className="mx-auto mt-4 max-w-xl text-foreground/60">{copy.subtitle}</p>
          )}
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:gap-5">
          {visibleCategories.map((category) => (
            <StaggerItem key={category.slug}>
              <Link
                href={`/shop?category=${category.slug}`}
                className="group block"
                onMouseEnter={() => setHovered(category.slug)}
                onMouseLeave={() => setHovered(null)}
              >
                <JharokhaFrame
                  tone="cream"
                  className="transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md"
                >
                  <div className="jharokha-media relative aspect-[3/4] bg-cream">
                    <HeritageCardTopBand />
                    <JewelryImage
                      src={category.image}
                      alt={category.name}
                      fill
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark/95 via-maroon-dark/25 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 border-t border-gold/25 bg-gradient-to-t from-maroon-dark/80 to-transparent p-3.5 text-center">
                      <h3 className="font-serif text-base font-medium text-white lg:text-lg">
                        {category.name}
                      </h3>
                      <motion.p
                        className="mt-0.5 text-[10px] uppercase tracking-wider text-gold-light/90"
                        animate={{ opacity: hovered === category.slug ? 1 : 0.75 }}
                      >
                        {category.count} designs
                      </motion.p>
                    </div>
                  </div>
                </JharokhaFrame>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollReveal className="mt-14 text-center" delay={0.2}>
          <Link
            href={copy.ctaHref ?? "/shop"}
            className="group inline-flex items-center gap-2 rounded-full border border-maroon/20 bg-white px-8 py-3 text-sm font-semibold uppercase tracking-wider text-maroon shadow-sm transition-all hover:border-gold hover:shadow-md"
          >
            {copy.ctaLabel ?? "View All Categories"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
