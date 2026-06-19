"use client";

import { motion, type Variants } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
}

const getVariants = (direction: ScrollRevealProps["direction"]): Variants => {
  const offset = 40;
  const hidden = {
    up: { opacity: 0, y: offset },
    down: { opacity: 0, y: -offset },
    left: { opacity: 0, x: offset },
    right: { opacity: 0, x: -offset },
    none: { opacity: 0 },
  };
  const dir = direction ?? "up";

  return {
    hidden: hidden[dir],
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
    },
  };
};

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration,
}: ScrollRevealProps) {
  const variants = getVariants(direction);

  if (duration) {
    variants.visible = {
      ...variants.visible,
      transition: { duration, ease: [0.22, 1, 0.36, 1] as const, delay },
    };
  } else if (delay) {
    variants.visible = {
      ...variants.visible,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const, delay },
    };
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

export const StaggerContainer = forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    className?: string;
    stagger?: number;
  }
>(function StaggerContainer({ children, className = "", stagger = 0.1 }, ref) {
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
});

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
