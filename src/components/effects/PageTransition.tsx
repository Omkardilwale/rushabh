"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useMounted } from "@/hooks/useMounted";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const mounted = useMounted();

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] as const }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
