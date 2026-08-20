"use client";

import { useEffect, useState } from "react";
import { isRemoteImage } from "@/lib/images";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";

interface JewelryImageProps {
  src?: string;
  alt: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}

export function JewelryImage({
  src,
  alt,
  fill = false,
  className,
  priority,
  width,
  height,
}: JewelryImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const cleanSrc = src?.trim() ?? "";

  if (!cleanSrc || hasError) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center bg-cream/80 text-foreground/40 text-xs font-medium p-4 text-center select-none border border-gold/15",
          fill ? "absolute inset-0 h-full w-full" : "",
          className,
        )}
        style={{
          width: width ? `${width}px` : undefined,
          height: height ? `${height}px` : undefined,
        }}
      >
        <ImageOff className="h-6 w-6 mb-1 text-gold-dark/60 opacity-60" />
        <span>Not Available</span>
      </div>
    );
  }

  const imgClass = cn(
    fill ? "absolute inset-0 h-full w-full object-cover" : "",
    className,
  );

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={cleanSrc}
      alt={alt}
      width={width}
      height={height}
      className={imgClass}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy={isRemoteImage(cleanSrc) ? "no-referrer" : undefined}
      onError={() => setHasError(true)}
    />
  );
}

