"use client";

import { useCallback, useEffect, useState } from "react";
import { JewelryImage } from "@/components/JewelryImage";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteContent } from "@/context/ContentContext";
import { JharokhaFrame } from "@/components/ui/JharokhaFrame";
import { RoyalBackground } from "./effects/RoyalBackground";
import { ScrollReveal } from "./effects/ScrollReveal";

export function FeaturedCollections() {
  const [active, setActive] = useState(0);
  const { content } = useSiteContent();
  const items = content.collections;
  const copy = content.sections.featuredCollections;

  const next = useCallback(() => {
    if (!items || items.length === 0) return;
    setActive((prev) => (prev + 1) % items.length);
  }, [items]);

  const prev = useCallback(() => {
    if (!items || items.length === 0) return;
    setActive((prev) => (prev - 1 + items.length) % items.length);
  }, [items]);

  useEffect(() => {
    if (!items || items.length === 0) return;
    const timer = setInterval(next, 3500);
    return () => clearInterval(timer);
  }, [next, items]);

  return (
    <section id="collections" className="relative overflow-hidden bg-cream py-24">
      <RoyalBackground density="normal" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
        <ScrollReveal className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-gold-dark">
              {copy.eyebrow}
            </p>
            <h2 className="mt-2 font-serif text-4xl font-light text-maroon md:text-5xl">
              {copy.heading}
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-maroon hover:text-gold-dark"
          >
            Explore All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </ScrollReveal>

        {!items || items.length === 0 ? (
          <div className="rounded-2xl border border-gold/20 bg-ivory/80 p-12 text-center shadow-sm backdrop-blur-sm">
            <p className="font-serif text-2xl text-maroon">Collections Not Available</p>
            <p className="mt-2 text-sm text-foreground/60">
              No featured collections have been added yet.
            </p>
          </div>
        ) : (
          <div className="relative pb-2">
          <JharokhaFrame tone="cream" className="relative aspect-[16/9] md:aspect-[21/9]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
                className="absolute inset-0"
              >
                <JewelryImage
                  src={items[active].image}
                  alt={items[active].name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-maroon-dark/90 via-maroon-dark/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark/70 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-gold-light backdrop-blur-sm"
                  >
                    {items[active].tag}
                  </motion.span>
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 font-serif text-3xl font-medium text-white md:text-5xl"
                  >
                    {items[active].name}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-3 max-w-md text-white/70"
                  >
                    {items[active].description}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Link
                      href="/shop"
                      className="group mt-6 inline-flex items-center gap-2 rounded-full gold-gradient px-6 py-3 text-sm font-semibold uppercase tracking-wider text-maroon-dark"
                    >
                      Shop Collection
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </JharokhaFrame>

          <div className="mt-4 flex items-center justify-between gap-4 px-1">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={prev}
                className="rounded-full border border-gold/30 bg-ivory p-2.5 text-maroon shadow-md transition-all hover:bg-cream md:p-3"
                aria-label="Previous collection"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={next}
                className="rounded-full border border-gold/30 bg-ivory p-2.5 text-maroon shadow-md transition-all hover:bg-cream md:p-3"
                aria-label="Next collection"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs uppercase tracking-wider text-foreground/45">
              {active + 1} / {items.length}
            </p>
          </div>

          <div className="mt-6 flex justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {items.map((col, i) => (
              <button
                key={col.name}
                type="button"
                onClick={() => setActive(i)}
                className={`overflow-hidden rounded-xl border-2 transition-all ${
                  i === active
                    ? "border-gold scale-105 shadow-lg"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
                aria-label={`View ${col.name}`}
              >
                <div className="relative h-16 w-24 md:h-20 md:w-32">
                  <JewelryImage
                    src={col.image}
                    alt={col.name}
                    fill
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
        )}
      </div>
    </section>
  );
}


