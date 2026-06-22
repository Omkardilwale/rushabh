"use client";

import type { ReactNode } from "react";
import { CartDrawer } from "@/components/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import { ContentProvider } from "@/context/ContentContext";
import type { SiteContent } from "@/lib/content/types";
import { ClientOnly } from "./ClientOnly";
import { CursorGlow } from "./CursorGlow";
import { GrainOverlay } from "./GrainOverlay";
import { PageTransition } from "./PageTransition";
import { ScrollProgress } from "./ScrollProgress";

export function SiteEffects({
  children,
  initialContent,
}: {
  children: ReactNode;
  initialContent?: SiteContent;
}) {
  return (
    <ContentProvider initialContent={initialContent}>
      <CartProvider>
        <ClientOnly>
          <ScrollProgress />
          <CursorGlow />
        </ClientOnly>
        <GrainOverlay />
        <PageTransition>{children}</PageTransition>
        <CartDrawer />
      </CartProvider>
    </ContentProvider>
  );
}
