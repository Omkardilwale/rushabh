"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { CartDrawer } from "@/components/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import { ContentProvider } from "@/context/ContentContext";
import type { SiteContent } from "@/lib/content/types";
import { ApiLoadingPopup } from "./ApiLoadingPopup";
import { ClientOnly } from "./ClientOnly";
import { FloatingActions } from "./FloatingActions";
import { PageTransition } from "./PageTransition";
import { ScrollProgress } from "./ScrollProgress";

const CursorGlow = dynamic(
  () => import("./CursorGlow").then((mod) => mod.CursorGlow),
  { ssr: false },
);
const GrainOverlay = dynamic(
  () => import("./GrainOverlay").then((mod) => mod.GrainOverlay),
  { ssr: false },
);

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
          <ApiLoadingPopup />
        </ClientOnly>
        <GrainOverlay />
        <PageTransition>{children}</PageTransition>
        <ClientOnly>
          <FloatingActions />
        </ClientOnly>
        <CartDrawer />
      </CartProvider>
    </ContentProvider>
  );
}
