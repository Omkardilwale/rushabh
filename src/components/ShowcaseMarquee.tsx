"use client";

import { JewelryImage } from "@/components/JewelryImage";
import Link from "next/link";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { RoyalBackground } from "./effects/RoyalBackground";
import { useSiteContent } from "@/context/ContentContext";

/** px per second — higher = faster auto slide */
const AUTO_SCROLL_SPEED = 60;

export function ShowcaseMarquee() {
  const { content } = useSiteContent();
  const marqueeItems = [
    ...content.products.slice(0, 6).map((p) => p.name),
    ...content.store.marqueeExtras,
    ...content.products.slice(0, 6).map((p) => p.name),
  ];
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
  const { content } = useSiteContent();
  const items = content.products.slice(0, 8);
  const loopItems = [...items, ...items];
  const trackRef = useRef<HTMLDivElement>(null);
  const loopWidthRef = useRef(0);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const x = useMotionValue(0);
  const reduceMotion = useReducedMotion();

  const measureLoop = () => {
    const el = trackRef.current;
    if (!el) return;
    const half = el.scrollWidth / 2;
    if (half > 0) loopWidthRef.current = half;
  };

  useEffect(() => {
    measureLoop();
    const el = trackRef.current;
    if (!el) return;

    const observer = new ResizeObserver(measureLoop);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const pauseAuto = (ms = 3000) => {
    pausedRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, ms);
  };

  useAnimationFrame((_, delta) => {
    if (reduceMotion || pausedRef.current || draggingRef.current) return;

    const loopWidth = loopWidthRef.current;
    if (loopWidth <= 0) return;

    const moveBy = (AUTO_SCROLL_SPEED * delta) / 1000;
    let next = x.get() - moveBy;

    if (next <= -loopWidth) {
      next += loopWidth;
    }

    x.set(next);
  });

  return (
    <section className="relative overflow-hidden bg-cream py-6">
      <RoyalBackground density="light" />
      <div className="relative z-10 overflow-hidden px-4 pb-2">
        <motion.div
          ref={trackRef}
          style={{ x, touchAction: "pan-y" }}
          className="flex w-max cursor-grab gap-4 active:cursor-grabbing"
          drag="x"
          dragElastic={0.06}
          dragMomentum
          onDragStart={() => {
            draggingRef.current = true;
            pausedRef.current = true;
          }}
          onDragEnd={() => {
            draggingRef.current = false;
            pauseAuto(3500);
          }}
        >
          {loopItems.map((product, i) => (
            <Link
              key={`${product.id}-${i}`}
              href={`/shop/${product.id}`}
              className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-gold/20 bg-ivory shadow-sm transition-transform hover:scale-[1.03] md:h-36 md:w-36"
              draggable={false}
              onFocus={() => pauseAuto(4000)}
            >
              <JewelryImage src={product.image} alt={product.name} fill />
            </Link>
          ))}
        </motion.div>
      </div>
      <p className="relative z-10 mt-2 text-center text-[10px] uppercase tracking-wider text-foreground/40">
        Swipe or drag · Auto-scrolling
      </p>
    </section>
  );
}
