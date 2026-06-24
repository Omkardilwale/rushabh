"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { JewelryImage } from "@/components/JewelryImage";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Heart, ShoppingBag, SlidersHorizontal, Star, X } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeritageCardTopBand, JharokhaFrame } from "@/components/ui/JharokhaFrame";
import { RoyalBackground } from "@/components/effects/RoyalBackground";
import { OrnamentSticker } from "@/components/effects/OrnamentStickers";
import { ParallaxLayer } from "@/components/effects/ParallaxLayer";
import { useSiteContent } from "@/context/ContentContext";
import {
  computeProductPrice,
  formatPrice,
  formatWeight,
  getProductUnit,
} from "@/lib/data";
import {
  getShopFilterLabel,
  matchesShopUrlFilters,
  parseShopSearchParams,
} from "@/lib/shop-filters";
import { useCart } from "@/context/CartContext";

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopPageFallback />}>
      <ShopPageContent />
    </Suspense>
  );
}

function ShopPageFallback() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-ivory" />
      <Footer />
    </>
  );
}

function ShopPageContent() {
  const { content } = useSiteContent();
  const { addToCart } = useCart();
  const { categories, products, shop } = content;
  const metalFilters = shop.metalFilters;
  const priceFilters = shop.priceFilters.map((f) => ({
    ...f,
    max: f.max ?? Infinity,
  }));
  const searchParams = useSearchParams();
  const urlFilters = useMemo(
    () => parseShopSearchParams(searchParams),
    [searchParams],
  );
  const activeUrlLabel = getShopFilterLabel(urlFilters);
  const hasUrlFilters = Boolean(
    urlFilters.metal || urlFilters.occasion || urlFilters.category,
  );

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMetal, setSelectedMetal] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState(priceFilters[0]);
  const [showFilters, setShowFilters] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (urlFilters.category) {
      setSelectedCategory(urlFilters.category.toLowerCase());
      return;
    }
    setSelectedCategory("all");
  }, [urlFilters.category]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const price = computeProductPrice(product, content.store);
      const categoryMatch =
        selectedCategory === "all" ||
        product.category.toLowerCase() === selectedCategory;
      const metalMatch =
        selectedMetal === "All" || product.metal === selectedMetal;
      const priceMatch =
        price >= selectedPrice.min && price <= selectedPrice.max;
      const urlMatch = matchesShopUrlFilters(product, urlFilters);
      return categoryMatch && metalMatch && priceMatch && urlMatch;
    });
  }, [products, content.store, selectedCategory, selectedMetal, selectedPrice, urlFilters]);

  const gridKey = [
    selectedCategory,
    selectedMetal,
    selectedPrice.label,
    urlFilters.metal,
    urlFilters.occasion,
    urlFilters.category,
  ].join("-");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-ivory">
        <div ref={heroRef} className="relative overflow-hidden maroon-gradient py-20 text-center md:py-28">
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{ y: heroY, scale: heroScale }}
          >
            <JewelryImage
              src={shop.bannerImage}
              alt=""
              fill
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-maroon-dark/80 via-maroon/90 to-maroon-dark" />

          <ParallaxLayer speed={0.5} className="absolute left-8 top-8 hidden md:block">
            <OrnamentSticker variant="mandala" className="relative opacity-20" size={120} />
          </ParallaxLayer>
          <ParallaxLayer speed={0.3} className="absolute right-8 bottom-8 hidden md:block">
            <OrnamentSticker variant="diamond" className="relative opacity-15" size={90} delay={1} />
          </ParallaxLayer>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
            className="relative"
          >
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold-light">
              {content.sections.shop.heading}
            </p>
            <h1 className="mt-3 font-serif text-4xl font-light text-white md:text-6xl">
              {activeUrlLabel ?? "Shop All Jewellery"}
            </h1>
            <motion.p
              key={filteredProducts.length}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 text-white/70"
            >
              {filteredProducts.length} exquisite designs found
            </motion.p>
          </motion.div>
        </div>

        <div className="relative">
          <RoyalBackground density="normal" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 lg:px-8">
          {hasUrlFilters && (
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-gold/30 bg-cream px-4 py-1.5 text-sm font-medium text-maroon">
                {activeUrlLabel}
              </span>
              <Link
                href="/shop"
                className="text-sm font-medium text-maroon underline-offset-4 hover:underline"
              >
                Clear filter
              </Link>
            </div>
          )}

          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 rounded-full border border-maroon/20 bg-white px-4 py-2 text-sm font-medium text-maroon lg:hidden"
            >
              {showFilters ? (
                <X className="h-4 w-4" />
              ) : (
                <SlidersHorizontal className="h-4 w-4" />
              )}
              Filters
            </button>
          </div>

          <div className="flex gap-8">
            <aside
              className={`${
                showFilters ? "block" : "hidden"
              } w-full shrink-0 lg:block lg:w-64`}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="sticky top-36 space-y-8 rounded-xl border border-gold/30 bg-white p-6 shadow-sm lg:sticky lg:top-36"
              >
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-maroon">
                    Category
                  </h3>
                  <div className="space-y-2">
                    <FilterButton
                      active={selectedCategory === "all"}
                      onClick={() => setSelectedCategory("all")}
                    >
                      All Categories
                    </FilterButton>
                    {categories.map((cat) => (
                      <FilterButton
                        key={cat.slug}
                        active={selectedCategory === cat.name.toLowerCase()}
                        onClick={() =>
                          setSelectedCategory(cat.name.toLowerCase())
                        }
                      >
                        {cat.name}
                      </FilterButton>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-maroon">
                    Metal Type
                  </h3>
                  <div className="space-y-2">
                    {metalFilters.map((metal) => (
                      <FilterButton
                        key={metal}
                        active={selectedMetal === metal}
                        onClick={() => setSelectedMetal(metal)}
                      >
                        {metal}
                      </FilterButton>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-maroon">
                    Price Range
                  </h3>
                  <div className="space-y-2">
                    {priceFilters.map((filter) => (
                      <FilterButton
                        key={filter.label}
                        active={selectedPrice.label === filter.label}
                        onClick={() => setSelectedPrice(filter)}
                      >
                        {filter.label}
                      </FilterButton>
                    ))}
                  </div>
                </div>
              </motion.div>
            </aside>

            <div className="flex-1">
              <AnimatePresence mode="popLayout">
                {filteredProducts.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="rounded-2xl border border-gold/20 bg-white p-16 text-center"
                  >
                    <p className="font-serif text-2xl text-maroon">
                      {shop.emptyTitle}
                    </p>
                    <p className="mt-2 text-foreground/60">
                      {shop.emptyMessage}
                    </p>
                    {hasUrlFilters && (
                      <Link
                        href="/shop"
                        className="mt-6 inline-block text-sm font-semibold uppercase tracking-wider text-maroon hover:text-gold-dark"
                      >
                        View all products
                      </Link>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key={gridKey}
                    className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.06 } },
                    }}
                  >
                    {filteredProducts.map((product) => (
                      <Link key={product.id} href={`/shop/${product.id}`}>
                      <JharokhaFrame tone="white" className="group transition-shadow hover:shadow-md">
                      <motion.article
                        variants={{
                          hidden: { opacity: 0, y: 24, scale: 0.96 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            transition: {
                              duration: 0.45,
                              ease: [0.22, 1, 0.36, 1] as const,
                            },
                          },
                        }}
                        className="relative"
                        whileHover={{
                          y: -6,
                          boxShadow: "0 20px 40px rgba(107,29,58,0.1)",
                        }}
                      >
                        <div className="jharokha-media relative aspect-square bg-cream">
                          <HeritageCardTopBand />
                          <JewelryImage
                            src={product.image}
                            alt={product.name}
                            fill
                            className="transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark/20 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                          {product.badge && (
                            <span className="absolute left-3 top-3 rounded-full bg-maroon px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                              {product.badge}
                            </span>
                          )}
                          <button
                            type="button"
                            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-maroon shadow-sm backdrop-blur-sm transition-transform hover:scale-110"
                            aria-label="Add to wishlist"
                          >
                            <Heart className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="border-t border-gold/25 p-4">
                          <p className="text-[10px] font-medium uppercase tracking-wider text-gold-dark">
                            {product.category} · {product.metal}
                          </p>
                          <h3 className="mt-1 font-serif text-base font-medium line-clamp-2">
                            {product.name}
                          </h3>
                          <div className="mt-1 flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-gold text-gold" />
                              <span className="text-xs text-foreground/60">
                                {product.rating}
                              </span>
                            </div>
                            {formatWeight(product.weight, getProductUnit(product.rateType)) && (
                              <span className="text-xs text-foreground/50">
                                · {formatWeight(product.weight, getProductUnit(product.rateType))}
                              </span>
                            )}
                          </div>
                          {(() => {
                            const price = computeProductPrice(product, content.store);
                            return (
                              <>
                                <div className="mt-2 flex items-baseline gap-2">
                                  <span className="font-semibold text-maroon">
                                    {formatPrice(price)}
                                  </span>
                                  {product.originalPrice && product.originalPrice > price && (
                                    <span className="text-xs text-foreground/40 line-through">
                                      {formatPrice(product.originalPrice)}
                                    </span>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    addToCart(product.id);
                                  }}
                                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-maroon px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-maroon-dark"
                                >
                                  <ShoppingBag className="h-3.5 w-3.5" />
                                  Add to Cart
                                </button>
                              </>
                            );
                          })()}
                        </div>
                      </motion.article>
                      </JharokhaFrame>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function FilterButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative block w-full overflow-hidden rounded-lg px-3 py-2 text-left text-sm transition-colors ${
        active ? "text-white" : "hover:bg-cream"
      }`}
    >
      {active && (
        <motion.span
          layoutId="shop-filter-active"
          className="absolute inset-0 bg-maroon"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative">{children}</span>
    </button>
  );
}
