"use client";

import { useEffect, useState } from "react";
import { images, isRemoteImage } from "@/lib/images";
import { cn } from "@/lib/utils";

interface JewelryImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  fallback?: string;
}

function resolveImageSrc(src: string, fallback: string): string {
  const trimmed = src.trim();
  return trimmed || fallback;
}

export function JewelryImage({
  src,
  alt,
  fill = false,
  className,
  priority,
  width,
  height,
  fallback = images.fallback,
}: JewelryImageProps) {
  const [currentSrc, setCurrentSrc] = useState(() =>
    resolveImageSrc(src, fallback),
  );

  useEffect(() => {
    setCurrentSrc(resolveImageSrc(src, fallback));
  }, [src, fallback]);

  const handleError = () => {
    if (currentSrc !== fallback) {
      setCurrentSrc(fallback);
    }
  };

  const safeSrc = resolveImageSrc(currentSrc, fallback);

  const imgClass = cn(
    fill ? "absolute inset-0 h-full w-full object-cover" : "",
    className,
  );

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={safeSrc}
      alt={alt}
      width={width}
      height={height}
      className={imgClass}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy={isRemoteImage(safeSrc) ? "no-referrer" : undefined}
      onError={handleError}
    />
  );
}
