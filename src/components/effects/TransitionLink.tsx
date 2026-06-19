"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function TransitionLink({
  href,
  children,
  className = "",
  onClick,
}: TransitionLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={className} onClick={onClick}>
      <motion.span
        className="inline-flex items-center"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {children}
        {isActive && (
          <motion.span
            layoutId="nav-underline"
            className="absolute -bottom-0.5 left-0 right-0 h-px bg-gold"
          />
        )}
      </motion.span>
    </Link>
  );
}
