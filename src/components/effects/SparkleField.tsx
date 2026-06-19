"use client";

import { useMemo } from "react";
import { useMounted } from "@/hooks/useMounted";

interface SparkleFieldProps {
  count?: number;
  className?: string;
}

function seeded(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function createSparkles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: seeded(i * 5 + 1) * 100,
    y: seeded(i * 5 + 2) * 100,
    size: seeded(i * 5 + 3) * 4 + 2,
    delay: seeded(i * 5 + 4) * 5,
    duration: seeded(i * 5 + 5) * 3 + 2,
  }));
}

export function SparkleField({ count = 20, className = "" }: SparkleFieldProps) {
  const mounted = useMounted();
  const sparkles = useMemo(() => createSparkles(count), [count]);

  if (!mounted) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="sparkle-particle absolute rounded-full bg-gold-light"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
