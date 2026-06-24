"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { JewelryImage } from "@/components/JewelryImage";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useSiteContent } from "@/context/ContentContext";
import { ParallaxLayer } from "./effects/ParallaxLayer";
import { OrnamentSticker } from "./effects/OrnamentStickers";
import { SparkleField } from "./effects/SparkleField";
import { CountUp } from "./effects/CountUp";

export function Hero() {
  const { content } = useSiteContent();
  const { hero } = content;
  const slides = hero.slides;
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.3]);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current],
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: 1.08,
      x: dir > 0 ? 60 : -60,
    }),
    center: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as const },
    },
    exit: (dir: number) => ({
      opacity: 0,
      scale: 1.02,
      x: dir > 0 ? -60 : 60,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
    }),
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.3 + i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    }),
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <motion.div
        className="relative min-h-[90vh] lg:min-h-screen"
        style={{ opacity: heroOpacity }}
      >
        <motion.div className="absolute inset-0" style={{ y: imageY }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              <JewelryImage
                src={slide.image}
                alt={slide.title}
                fill
                priority={current === 0}
                className="ken-burns"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-r from-maroon-dark/95 via-maroon-dark/70 to-maroon-dark/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark/60 via-transparent to-maroon-dark/30" />
        <div className="absolute inset-0 vignette" />

        <SparkleField count={25} />
        <ParallaxLayer speed={0.6} className="absolute right-8 top-24 hidden lg:block">
          <OrnamentSticker variant="mandala" className="relative opacity-20" size={200} />
        </ParallaxLayer>
        <ParallaxLayer speed={0.4} className="absolute left-12 bottom-32 hidden md:block">
          <OrnamentSticker variant="diamond" className="relative opacity-15" size={140} delay={2} />
        </ParallaxLayer>
        <OrnamentSticker variant="spark" className="absolute right-1/4 top-1/3" size={24} delay={1} />
        <OrnamentSticker variant="spark" className="absolute left-1/3 bottom-1/4" size={18} delay={2.5} />

        <motion.div
          className="relative mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-center px-4 py-24 lg:min-h-screen lg:px-8"
          style={{ y: contentY }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="max-w-2xl"
              initial="hidden"
              animate="visible"
            >
              <motion.p
                custom={0}
                variants={textVariants}
                className="mb-4 inline-block border border-gold/30 bg-white/5 px-4 py-1.5 text-sm font-medium uppercase tracking-[0.3em] text-gold-light backdrop-blur-sm"
              >
                {slide.tagline}
              </motion.p>

              <motion.h1
                custom={1}
                variants={textVariants}
                className="font-serif text-5xl font-light leading-[1.1] text-white md:text-6xl lg:text-7xl"
              >
                {slide.title}{" "}
                <span className="text-gold-gradient italic">{slide.accent}</span>
                <br />
                {slide.subtitle}
              </motion.h1>

              <motion.p
                custom={2}
                variants={textVariants}
                className="mt-6 max-w-lg text-lg leading-relaxed text-white/75"
              >
                {slide.description}
              </motion.p>

              <motion.div
                custom={3}
                variants={textVariants}
                className="mt-10 flex flex-wrap gap-4"
              >
                <Link
                  href={hero.primaryCta.href}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full gold-gradient px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-maroon-dark"
                >
                  <span className="absolute inset-0 shimmer opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="relative">{hero.primaryCta.label}</span>
                  <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href={hero.secondaryCta.href}
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-md transition-all hover:border-gold/50 hover:bg-white/15"
                >
                  <Play className="h-4 w-4 fill-current" />
                  {hero.secondaryCta.label}
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <motion.div
            className="mt-16 grid max-w-md grid-cols-3 gap-6 border-t border-white/15 pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <CountUp
                  value={stat.value}
                  className="font-serif text-3xl font-semibold text-gold-light"
                />
                <p className="mt-1 text-xs uppercase tracking-wider text-white/50">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-4">
          <button
            type="button"
            onClick={prev}
            className="rounded-full border border-white/20 bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current ? "w-8 bg-gold-light" : "w-2 bg-white/40"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            className="rounded-full border border-white/20 bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
