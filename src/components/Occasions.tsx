"use client";

import Link from "next/link";
import {
  CalendarHeart,
  Gem,
  Gift,
  Heart,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useSiteContent } from "@/context/ContentContext";
import { HeritageCardTopBand, JharokhaFrame } from "@/components/ui/JharokhaFrame";
import { RoyalBackground } from "./effects/RoyalBackground";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./effects/ScrollReveal";

const occasionIcons: Record<string, LucideIcon> = {
  Wedding: Heart,
  Engagement: Gem,
  Festivals: Sparkles,
  Gifting: Gift,
  "Daily Wear": Sparkles,
  Anniversary: CalendarHeart,
};

const occasionStyles: Record<string, { gradient: string; accent: string }> = {
  Wedding: {
    gradient: "from-maroon/90 to-maroon-dark",
    accent: "bg-rose-100 text-maroon",
  },
  Engagement: {
    gradient: "from-gold-dark/80 to-maroon",
    accent: "bg-amber-50 text-gold-dark",
  },
  Festivals: {
    gradient: "from-orange-900/80 to-maroon-dark",
    accent: "bg-orange-50 text-orange-800",
  },
  Gifting: {
    gradient: "from-maroon to-gold-dark/90",
    accent: "bg-cream text-maroon",
  },
  "Daily Wear": {
    gradient: "from-stone-700/80 to-maroon-dark",
    accent: "bg-stone-100 text-stone-700",
  },
  Anniversary: {
    gradient: "from-rose-900/80 to-maroon-dark",
    accent: "bg-rose-50 text-rose-800",
  },
};

export function Occasions() {
  const { content } = useSiteContent();
  const { occasions } = content;
  const copy = content.sections.occasions;
  return (
    <section className="relative overflow-hidden bg-cream py-24">
      <RoyalBackground density="normal" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
        <ScrollReveal className="mb-14 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-gold-dark">
            {copy.eyebrow}
          </p>
          <h2 className="mt-2 font-serif text-4xl font-light text-maroon md:text-5xl">
            {copy.heading}
          </h2>
          {copy.subtitle && (
            <p className="mx-auto mt-4 max-w-lg text-foreground/60">{copy.subtitle}</p>
          )}
        </ScrollReveal>

        <StaggerContainer
          stagger={0.05}
          className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6"
        >
          {occasions.map((occasion) => {
            const Icon = occasionIcons[occasion.name] ?? Sparkles;
            const style = occasionStyles[occasion.name] ?? {
              gradient: "from-maroon to-maroon-dark",
              accent: "bg-cream text-maroon",
            };

            return (
              <StaggerItem key={occasion.name}>
                <Link
                  href={`/shop?occasion=${occasion.name.toLowerCase().replace(" ", "-")}`}
                  className="group block"
                >
                  <JharokhaFrame tone="ivory" className="transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-md">
                  <div className="relative overflow-hidden bg-ivory">
                    <HeritageCardTopBand />
                    <div
                      className={`relative flex h-24 items-center justify-center bg-gradient-to-br ${style.gradient} sm:h-28`}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(232,213,163,0.25),transparent_55%)]" />
                      <div
                        className={`relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-transform duration-200 group-hover:scale-110 ${style.accent}`}
                      >
                        <Icon className="h-6 w-6" strokeWidth={1.5} />
                      </div>
                    </div>

                    <div className="border-t border-gold/25 p-4 text-center">
                      <h3 className="font-serif text-base font-medium text-maroon sm:text-lg">
                        {occasion.name}
                      </h3>
                      <p className="mt-1 text-[11px] uppercase tracking-wider text-foreground/45">
                        {occasion.count}
                      </p>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gold transition-transform duration-200 group-hover:scale-x-100" />
                  </div>
                  </JharokhaFrame>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
