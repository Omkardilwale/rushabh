import { getRuntimeContent } from "@/lib/content/client";

export function getStoreSettings() {
  return getRuntimeContent().store;
}

/** @deprecated Use getStoreSettings() or useSiteContent() */
export const storeSettings = new Proxy(
  {} as ReturnType<typeof getStoreSettings>,
  {
    get(_target, prop) {
      const store = getStoreSettings();
      const value = store[prop as keyof typeof store];
      if (value && typeof value === "object" && !Array.isArray(value)) {
        return new Proxy(value as object, {
          get(t, p) {
            return (value as Record<string, unknown>)[p as string];
          },
        });
      }
      return value;
    },
  },
);
