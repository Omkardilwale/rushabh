"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  defaultSiteContent,
  setRuntimeContent,
  type SiteContent,
} from "@/lib/content/client";

type ContentContextValue = {
  content: SiteContent;
  refresh: () => Promise<void>;
  updateContent: (next: SiteContent) => void;
  loading: boolean;
};

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({
  children,
  initialContent,
}: {
  children: ReactNode;
  initialContent?: SiteContent;
}) {
  const [content, setContent] = useState<SiteContent>(
    initialContent ?? defaultSiteContent,
  );
  const [loading, setLoading] = useState(!initialContent);
  const hydratedRef = useRef(false);

  const applyContent = useCallback((next: SiteContent) => {
    setContent(next);
    setRuntimeContent(next);
  }, []);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/content", { cache: "no-store" });
    if (!res.ok) return;
    const data = (await res.json()) as SiteContent;
    applyContent(data);
  }, [applyContent]);

  useEffect(() => {
    if (!hydratedRef.current) {
      applyContent(initialContent ?? defaultSiteContent);
      hydratedRef.current = true;
      setLoading(false);
    }

    if (!initialContent) {
      void refresh().finally(() => setLoading(false));
    }
  }, [initialContent, applyContent, refresh]);

  const value = useMemo(
    () => ({
      content,
      refresh,
      updateContent: applyContent,
      loading,
    }),
    [content, refresh, applyContent, loading],
  );

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useSiteContent must be used within ContentProvider");
  }
  return context;
}
