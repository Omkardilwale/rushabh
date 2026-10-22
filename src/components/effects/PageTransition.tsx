"use client";

import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div key={pathname} className={reduceMotion ? undefined : "page-enter"}>
      {children}
    </div>
  );
}
