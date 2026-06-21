"use client";

import type { FC } from "react";

type StickerVariant =
  | "mandala"
  | "diamond"
  | "paisley"
  | "spark"
  | "ring"
  | "jharokha"
  | "jali"
  | "arch"
  | "lotus";

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

/** Rajput Jharokha window silhouette */
function Jharokha({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 140" fill="none">
      <path
        d="M12 130 L12 48 Q30 18 60 48 Q90 18 108 48 L108 130 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.45"
      />
      <path
        d="M22 130 L22 54 Q60 28 98 54 L98 130 Z"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.3"
      />
      <path d="M60 48 L60 130" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <path d="M12 90 L108 90" stroke="currentColor" strokeWidth="0.4" opacity="0.18" />
      <circle cx="60" cy="70" r="6" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
    </svg>
  );
}

/** Geometric Jali lattice */
function Jali({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {Array.from({ length: 5 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={10 + i * 20}
          x2="100"
          y2={10 + i * 20}
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.22"
        />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={10 + i * 20}
          y1="0"
          x2={10 + i * 20}
          y2="100"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.22"
        />
      ))}
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 5 }).map((_, col) => (
          <circle
            key={`c-${row}-${col}`}
            cx={10 + col * 20}
            cy={10 + row * 20}
            r="3"
            stroke="currentColor"
            strokeWidth="0.4"
            opacity="0.2"
          />
        )),
      )}
    </svg>
  );
}

/** Cusped Rajput arch */
function Arch({ size }: { size: number }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 100 70" fill="none">
      <path
        d="M8 68 L8 28 Q25 6 50 28 Q75 6 92 28 L92 68"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />
      <path
        d="M18 68 L18 32 Q50 14 82 32 L82 68"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.25"
      />
    </svg>
  );
}

/** Traditional lotus petal motif */
function Lotus({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <ellipse cx="40" cy="48" rx="14" ry="22" stroke="currentColor" strokeWidth="0.7" opacity="0.3" />
      <ellipse cx="40" cy="48" rx="14" ry="22" stroke="currentColor" strokeWidth="0.7" opacity="0.3" transform="rotate(60 40 48)" />
      <ellipse cx="40" cy="48" rx="14" ry="22" stroke="currentColor" strokeWidth="0.7" opacity="0.3" transform="rotate(120 40 48)" />
      <circle cx="40" cy="44" r="5" fill="currentColor" opacity="0.25" />
    </svg>
  );
}

const stickers: Record<StickerVariant, FC<{ size: number }>> = {
  mandala: Mandala,
  diamond: Diamond,
  paisley: Paisley,
  spark: Spark,
  ring: Ring,
  jharokha: Jharokha,
  jali: Jali,
  arch: Arch,
  lotus: Lotus,
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
      <OrnamentSticker variant="jharokha" className="absolute -left-10 top-10 hidden lg:block opacity-[0.12]" size={150} />
      <OrnamentSticker variant="jali" className="absolute -right-4 top-1/3 hidden md:block opacity-[0.1]" size={95} delay={1} />
      <OrnamentSticker variant="arch" className="absolute right-10 bottom-16 hidden lg:block opacity-[0.11]" size={85} delay={2} />
      <OrnamentSticker variant="lotus" className="absolute left-1/4 top-8 opacity-[0.09]" size={65} delay={0.5} />
      <OrnamentSticker variant="spark" className="absolute right-1/3 bottom-12 opacity-[0.12]" size={20} delay={1.5} />
      <OrnamentSticker variant="mandala" className="absolute left-6 bottom-8 hidden sm:block opacity-[0.08]" size={75} delay={3} />
    </>
  );
}
