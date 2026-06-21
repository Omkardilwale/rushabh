import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface JharokhaFrameProps {
  children: ReactNode;
  className?: string;
  tone?: "ivory" | "cream" | "white";
}

/** Minimal heritage card — gold border with matching top & bottom lines via .heritage-card-bands */
export function JharokhaFrame({
  children,
  className,
  tone = "ivory",
}: JharokhaFrameProps) {
  return (
    <div
      className={cn(
        "heritage-card overflow-hidden rounded-xl border border-gold/30 shadow-sm",
        tone === "cream" && "bg-cream",
        tone === "white" && "bg-white",
        tone === "ivory" && "bg-ivory",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Matching gold line at top of card media (same as bottom title bar) */
export function HeritageCardTopBand({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-[3] border-b border-gold/25",
        className,
      )}
      aria-hidden="true"
    />
  );
}
