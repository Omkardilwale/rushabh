"use client";

import { motion } from "framer-motion";
import { RefreshCw, RotateCcw, Shield, Truck } from "lucide-react";
import { useSiteContent } from "@/context/ContentContext";

const iconMap = {
  shield: Shield,
  refresh: RefreshCw,
  truck: Truck,
  rotate: RotateCcw,
};

export function TrustBadges() {
  const { content } = useSiteContent();
  const trustFeatures = content.trustFeatures;
  return (
    <section className="relative overflow-hidden border-y border-gold/20 bg-maroon py-14">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_20%_50%,rgba(201,169,98,0.4),transparent_50%)]" />
        <div className="absolute right-0 top-0 h-full w-full bg-[radial-gradient(circle_at_80%_50%,rgba(201,169,98,0.3),transparent_50%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {trustFeatures.map((feature) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={feature.title}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
                  },
                }}
                className="group flex flex-col items-center text-center"
              >
                <motion.div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-maroon-dark"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Icon className="h-6 w-6 text-gold-light transition-colors group-hover:text-gold" />
                </motion.div>
                <h3 className="font-serif text-lg font-medium text-gold-light">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm text-white/55">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
