"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Shield,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JewelryImage } from "@/components/JewelryImage";
import { HeritageCardTopBand, JharokhaFrame } from "@/components/ui/JharokhaFrame";
import { RoyalBackground } from "@/components/effects/RoyalBackground";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { useCart } from "@/context/CartContext";
import { useSiteContent } from "@/context/ContentContext";
import {
  computeProductPrice,
  formatPrice,
  formatWeight,
  getProductById,
  getProductUnit,
  getRelatedProducts,
} from "@/lib/data";

export function ProductDetail({ id }: { id: number }) {
  const product = getProductById(id);
  const { addToCart } = useCart();
  const { content } = useSiteContent();
  const productDetail = content.productDetail;

  if (!product) {
    return (
      <>
        <Header />
        <main className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden bg-ivory px-4">
          <RoyalBackground density="light" />
          <div className="relative z-10 text-center">
          <h1 className="font-serif text-3xl text-maroon">Product not found</h1>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-maroon hover:text-gold-dark"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to shop
          </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const related = getRelatedProducts(id);
  const price = computeProductPrice(product, content.store);
  const weightLabel = formatWeight(product.weight, getProductUnit(product.rateType));

  return (
    <>
      <Header />
      <main className="relative overflow-hidden bg-ivory">
        <RoyalBackground density="light" />
        <div className="relative z-10 border-b border-gold/15 bg-cream/50 py-4">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 text-sm text-foreground/60 lg:px-8">
            <Link href="/" className="hover:text-maroon">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-maroon">
              Shop
            </Link>
            <span>/</span>
            <span className="text-maroon">{product.name}</span>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <ScrollReveal>
              <JharokhaFrame tone="cream" className="shadow-lg">
              <div className="jharokha-media relative aspect-square bg-cream">
                <HeritageCardTopBand />
                <JewelryImage
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                />
                {product.badge && (
                  <span className="absolute left-4 top-4 rounded-full bg-maroon px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                    {product.badge}
                  </span>
                )}
              </div>
              </JharokhaFrame>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-gold-dark">
                  {product.category} · {product.metal}
                  {weightLabel && <span> · {weightLabel}</span>}
                </p>
                <h1 className="mt-3 font-serif text-4xl font-light text-maroon md:text-5xl">
                  {product.name}
                </h1>

                <div className="mt-4 flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? "fill-gold text-gold"
                            : "text-gold/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-foreground/60">
                    {product.rating} / 5
                  </span>
                </div>

                <div className="mt-6 flex items-baseline gap-3">
                  <span className="font-serif text-3xl font-semibold text-maroon">
                    {formatPrice(price)}
                  </span>
                  {product.originalPrice && product.originalPrice > price && (
                    <span className="text-lg text-foreground/40 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                {product.originalPrice && product.originalPrice > price && (
                  <p className="mt-2 text-sm font-medium text-green-700">
                    Save {formatPrice(product.originalPrice - price)}
                  </p>
                )}

                <p className="mt-6 leading-relaxed text-foreground/70">
                  {product.description ??
                    `${productDetail.defaultDescription} This exquisite ${product.metal.toLowerCase()} piece is perfect for special occasions and everyday elegance.`}
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <motion.button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full gold-gradient px-8 py-4 text-sm font-semibold uppercase tracking-wider text-maroon-dark sm:flex-none"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => addToCart(product.id)}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Add to Cart
                  </motion.button>
                  <motion.button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-maroon/25 bg-white px-6 py-4 text-sm font-semibold uppercase tracking-wider text-maroon"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    aria-label="Add to wishlist"
                  >
                    <Heart className="h-4 w-4" />
                  </motion.button>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {productDetail.trustChips.map((label, i) => {
                    const icons = [Shield, Truck, Star];
                    const Icon = icons[i] ?? Shield;
                    return (
                    <div
                      key={label}
                      className="flex items-center gap-3 rounded-xl border border-gold/20 bg-white p-4"
                    >
                      <Icon className="h-5 w-5 shrink-0 text-gold-dark" />
                      <span className="text-xs font-medium text-foreground/70">
                        {label}
                      </span>
                    </div>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {related.length > 0 && (
            <section className="mt-20 border-t border-gold/15 pt-16">
              <ScrollReveal>
                <h2 className="font-serif text-3xl font-light text-maroon">
                  {productDetail.relatedHeading}
                </h2>
              </ScrollReveal>
              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/shop/${item.id}`}
                  >
                  <JharokhaFrame tone="white" className="group transition-all hover:-translate-y-1 hover:shadow-md">
                    <div className="jharokha-media relative aspect-square bg-cream">
                      <HeritageCardTopBand />
                      <JewelryImage
                        src={item.image}
                        alt={item.name}
                        fill
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="border-t border-gold/25 p-4">
                      <h3 className="font-serif text-sm font-medium line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="mt-1 font-semibold text-maroon">
                        {formatPrice(computeProductPrice(item, content.store))}
                      </p>
                    </div>
                  </JharokhaFrame>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}