"use client";

import { useState } from "react";
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
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleError = () => {
    if (currentSrc !== fallback) {
      setCurrentSrc(fallback);
    }
  };

  const imgClass = cn(
    fill ? "absolute inset-0 h-full w-full object-cover" : "",
    className,
  );

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      className={imgClass}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy={isRemoteImage(currentSrc) ? "no-referrer" : undefined}
      onError={handleError}
    />
  );
}
