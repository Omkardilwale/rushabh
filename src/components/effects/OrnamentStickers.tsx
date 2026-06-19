"use client";

import type { FC } from "react";

type StickerVariant = "mandala" | "diamond" | "paisley" | "spark" | "ring";

interface OrnamentStickersProps {
  variant?: StickerVariant;
  className?: string;
  size?: number;
  delay?: number;
}

function Mandala({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="58" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <circle cx="60" cy="60" r="45" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <circle cx="60" cy="60" r="30" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={i}
          x1="60"
          y1="60"
          x2={60 + 55 * Math.cos((i * Math.PI) / 4)}
          y2={60 + 55 * Math.sin((i * Math.PI) / 4)}
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.25"
        />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <circle
          key={`dot-${i}`}
          cx={60 + 45 * Math.cos((i * Math.PI) / 4)}
          cy={60 + 45 * Math.sin((i * Math.PI) / 4)}
          r="3"
          fill="currentColor"
          opacity="0.3"
        />
      ))}
    </svg>
  );
}

function Diamond({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <path
        d="M40 4 L76 40 L40 76 L4 40 Z"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.35"
      />
      <path
        d="M40 16 L64 40 L40 64 L16 40 Z"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.25"
      />
      <path d="M40 4 L40 76 M4 40 L76 40" stroke="currentColor" strokeWidth="0.4" opacity="0.2" />
    </svg>
  );
}

function Paisley({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path
        d="M50 10 C70 10 85 30 80 55 C75 75 55 90 50 90 C45 90 25 75 20 55 C15 30 30 10 50 10 Z"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.3"
      />
      <circle cx="55" cy="40" r="8" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
    </svg>
  );
}

function Spark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path
        d="M20 2 L22 18 L38 20 L22 22 L20 38 L18 22 L2 20 L18 18 Z"
        fill="currentColor"
        opacity="0.4"
      />
    </svg>
  );
}

function Ring({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="30" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <circle cx="40" cy="40" r="22" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <circle cx="40" cy="12" r="5" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

const stickers: Record<StickerVariant, FC<{ size: number }>> = {
  mandala: Mandala,
  diamond: Diamond,
  paisley: Paisley,
  spark: Spark,
  ring: Ring,
};

export function OrnamentSticker({
  variant = "mandala",
  className = "",
  size = 120,
  delay = 0,
}: OrnamentStickersProps) {
  const Sticker = stickers[variant];

  return (
    <div
      className={`ornament-sticker pointer-events-none text-gold select-none ${className}`}
      style={{ animationDelay: `${delay}s` }}
      aria-hidden="true"
    >
      <Sticker size={size} />
    </div>
  );
}

export function SectionOrnaments() {
  return (
    <>
      <OrnamentSticker variant="mandala" className="absolute -left-8 top-12 hidden lg:block" size={160} />
      <OrnamentSticker variant="diamond" className="absolute -right-6 top-1/3 hidden md:block" size={100} delay={1} />
      <OrnamentSticker variant="paisley" className="absolute right-12 bottom-20 hidden lg:block" size={90} delay={2} />
      <OrnamentSticker variant="spark" className="absolute left-1/4 top-8" size={28} delay={0.5} />
      <OrnamentSticker variant="spark" className="absolute right-1/3 bottom-12" size={20} delay={1.5} />
      <OrnamentSticker variant="ring" className="absolute left-8 bottom-8 hidden sm:block" size={70} delay={3} />
    </>
  );
}
