"use client";

import type { ReactNode } from "react";
import { ClientOnly } from "./ClientOnly";
import { CursorGlow } from "./CursorGlow";
import { GrainOverlay } from "./GrainOverlay";
import { PageTransition } from "./PageTransition";
import { ScrollProgress } from "./ScrollProgress";

export function SiteEffects({ children }: { children: ReactNode }) {
  return (
    <>
      <ClientOnly>
        <ScrollProgress />
        <CursorGlow />
      </ClientOnly>
      <GrainOverlay />
      <PageTransition>{children}</PageTransition>
    </>
  );
}
