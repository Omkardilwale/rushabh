"use client";

import { JewelryImage } from "@/components/JewelryImage";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
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
      <div className="absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-maroon-dark to-transparent md:w-24" />
      <div className="absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-maroon-dark to-transparent md:w-24" />

      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const userScrollingRef = useRef(false);

  const scrollStep = useCallback(() => {
    const el = scrollRef.current;
    if (!el || pausedRef.current || userScrollingRef.current) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;

    if (el.scrollLeft >= maxScroll - 1) {
      el.scrollLeft = 0;
    } else {
      el.scrollLeft += 1.2;
    }
  }, []);

  useEffect(() => {
    const interval = window.setInterval(scrollStep, 16);
    return () => window.clearInterval(interval);
  }, [scrollStep]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let resumeTimer: ReturnType<typeof setTimeout>;

    const pause = () => {
      pausedRef.current = true;
    };

    const resumeLater = () => {
      window.clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        pausedRef.current = false;
        userScrollingRef.current = false;
      }, 2000);
    };

    const onTouchStart = () => {
      userScrollingRef.current = true;
      pause();
    };

    const onScroll = () => {
      userScrollingRef.current = true;
      pause();
      resumeLater();
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("mousedown", pause);
    el.addEventListener("mouseup", resumeLater);
    el.addEventListener("mouseleave", resumeLater);
    el.addEventListener("touchend", resumeLater);
    el.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(resumeTimer);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("mousedown", pause);
      el.removeEventListener("mouseup", resumeLater);
      el.removeEventListener("mouseleave", resumeLater);
      el.removeEventListener("touchend", resumeLater);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-cream py-6">
      <div
        ref={scrollRef}
        className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {[...images, ...images].map((product, i) => (
          <div
            key={`${product.id}-${i}`}
            className="relative h-28 w-28 shrink-0 snap-center overflow-hidden rounded-xl border border-gold/20 shadow-sm md:h-36 md:w-36"
          >
            <JewelryImage src={product.image} alt={product.name} fill />
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-[10px] uppercase tracking-wider text-foreground/40">
        Swipe to browse · Auto-scrolling
      </p>
    </section>
  );
}
