"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useSiteContent } from "@/context/ContentContext";
import { JharokhaFrame } from "@/components/ui/JharokhaFrame";
import { RoyalBackground } from "./effects/RoyalBackground";
import { ScrollReveal } from "./effects/ScrollReveal";

export function Testimonials() {
  const { content } = useSiteContent();
  const testimonials = content.testimonials;
  const copy = content.sections.testimonials;
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > active ? 1 : -1);
      setActive(index);
    },
    [active],
  );

  const next = useCallback(() => {
    setDirection(1);
    setActive((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next]);

  const testimonial = testimonials[active];

  const variants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 80 : -80,
      scale: 0.95,
    }),
    center: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -80 : 80,
      scale: 0.95,
      transition: { duration: 0.4 },
    }),
  };

  return (
    <section className="relative overflow-hidden bg-ivory py-24">
      <RoyalBackground density="light" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 lg:px-8">
        <ScrollReveal className="mb-14 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-gold-dark">
            {copy.eyebrow}
          </p>
          <h2 className="mt-2 font-serif text-4xl font-light text-maroon md:text-5xl">
            {copy.heading}
          </h2>
        </ScrollReveal>

        <div className="relative">
          <div className="absolute -left-4 -top-4 text-gold/20">
            <Quote className="h-16 w-16" />
          </div>

          <JharokhaFrame tone="white" className="relative min-h-[280px] shadow-xl">
            <div className="border-b border-gold/25" aria-hidden="true" />
            <div className="p-10 md:p-14">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.blockquote
                key={active}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="text-center"
              >
                <div className="mb-6 flex justify-center gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="font-serif text-xl leading-relaxed text-foreground/80 md:text-2xl">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <footer className="mt-8">
                  <p className="font-serif text-lg font-medium text-maroon">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-foreground/50">
                    {testimonial.location}
                  </p>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
            </div>
            <div className="border-t border-gold/25" aria-hidden="true" />
          </JharokhaFrame>

          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={prev}
              className="rounded-full border border-gold/30 bg-white p-2.5 text-maroon transition-all hover:bg-cream"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === active ? "w-8 bg-maroon" : "w-2 bg-maroon/20"
                  }`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              className="rounded-full border border-gold/30 bg-white p-2.5 text-maroon transition-all hover:bg-cream"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
