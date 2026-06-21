"use client";

import Link from "next/link";
import { useRef } from "react";
import { JewelryImage } from "@/components/JewelryImage";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, Star } from "lucide-react";
import { formatPrice, products } from "@/lib/data";
import { HeritageCardTopBand, JharokhaFrame } from "@/components/ui/JharokhaFrame";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./effects/ScrollReveal";

function ProductCard({
  product,
}: {
  product: (typeof products)[0];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Link href={`/shop/${product.id}`} className="block">
    <JharokhaFrame tone="ivory" className="group transition-shadow hover:shadow-md">
    <motion.article
      ref={ref}
      className="relative"
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="jharokha-media relative aspect-square bg-cream">
        <HeritageCardTopBand />
        <JewelryImage
          src={product.image}
          alt={product.name}
          fill
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark/30 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

        {product.badge && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute left-3 top-3 rounded-full bg-maroon px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
          >
            {product.badge}
          </motion.span>
        )}
        <button
          type="button"
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-maroon opacity-0 shadow-sm backdrop-blur-sm transition-all hover:scale-110 hover:bg-white group-hover:opacity-100"
          aria-label={`Add ${product.name} to wishlist`}
        >
          <Heart className="h-4 w-4" />
        </button>
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-maroon/90 py-3 text-center backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-white">
            Quick View
          </span>
        </div>
      </div>

      <div className="border-t border-gold/25 p-4">
        <p className="text-[10px] font-medium uppercase tracking-wider text-gold-dark">
          {product.metal}
        </p>
        <h3 className="mt-1 font-serif text-base font-medium text-foreground line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center gap-1">
          <Star className="h-3 w-3 fill-gold text-gold" />
          <span className="text-xs text-foreground/60">{product.rating}</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-semibold text-maroon">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-foreground/40 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </motion.article>
    </JharokhaFrame>
    </Link>
  );
}

export function ProductGrid() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.offsetWidth * 0.7;
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative overflow-hidden bg-ivory py-24">
      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
        <ScrollReveal className="mb-12 flex items-end justify-between">
          <div className="text-center md:text-left">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-gold-dark">
              Trending Now
            </p>
            <h2 className="mt-2 font-serif text-4xl font-light text-maroon md:text-5xl">
              Top Sellers
            </h2>
            <p className="mt-4 max-w-xl text-foreground/60">
              Products our customers love the most
            </p>
          </div>

          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="rounded-full border border-gold/30 bg-white p-3 text-maroon transition-all hover:bg-cream"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="rounded-full border border-gold/30 bg-white p-3 text-maroon transition-all hover:bg-cream"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </ScrollReveal>

        <StaggerContainer
          ref={scrollRef}
          stagger={0.08}
          className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:grid-cols-4"
        >
          {products.map((product) => (
            <StaggerItem
              key={product.id}
              className="w-[72vw] shrink-0 snap-center sm:w-[45vw] md:w-auto"
            >
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
