"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

interface CountUpProps {
  value: string;
  duration?: number;
  className?: string;
}

/**
 * Splits a display value like "50K+", "1.2L", "100%", "₹4999" into a
 * leading non-digit prefix, the numeric core (animated), and a trailing suffix.
 */
function parseValue(value: string) {
  const match = value.match(/^(\D*)([\d.,]+)(.*)$/);
  if (!match) {
    return { prefix: "", number: null as number | null, suffix: value, decimals: 0 };
  }

  const [, prefix, rawNumber, suffix] = match;
  const normalized = rawNumber.replace(/,/g, "");
  const number = Number.parseFloat(normalized);
  const decimals = normalized.includes(".")
    ? normalized.split(".")[1]?.length ?? 0
    : 0;

  if (Number.isNaN(number)) {
    return { prefix: "", number: null, suffix: value, decimals: 0 };
  }

  return { prefix, number, suffix, decimals };
}

export function CountUp({ value, duration = 1.6, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const { prefix, number, suffix, decimals } = parseValue(value);
  const [display, setDisplay] = useState(number === null ? value : `${prefix}0${suffix}`);

  useEffect(() => {
    if (!inView || number === null) return;

    const controls = animate(0, number, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        setDisplay(`${prefix}${latest.toFixed(decimals)}${suffix}`);
      },
    });

    return () => controls.stop();
  }, [inView, number, prefix, suffix, decimals, duration]);

  return (
    <span ref={ref} className={className}>
      {number === null ? value : display}
    </span>
  );
}
