import { readSiteContent, writeSiteContent } from "@/lib/content/storage";
import type { SiteContent } from "@/lib/content/types";
import { canSyncRates } from "./goldapi";
import { fetchLiveMetalRates } from "./fetch-rates";

export async function syncMetalRates(options?: {
  force?: boolean;
  skipThrottle?: boolean;
}) {
  const content = await readSiteContent();
  const force = options?.force ?? false;
  const skipThrottle = options?.skipThrottle ?? false;

  if (!force && content.store.ratesMode !== "auto") {
    return {
      skipped: true as const,
      reason: "Rates mode is manual",
      content,
    };
  }

  if (!skipThrottle) {
    const throttle = canSyncRates(content.store.ratesLastSyncedAt);
    if (!throttle.allowed) {
      return {
        skipped: true as const,
        reason: throttle.reason ?? "Sync throttled to save API quota",
        content,
      };
    }
  }

  const live = await fetchLiveMetalRates();
  const syncedAt = new Date().toISOString();

  const updated: SiteContent = {
    ...content,
    store: {
      ...content.store,
      ratesLastSyncedAt: syncedAt,
      goldRate: {
        rate22k: live.rate22k,
        rate18k: live.rate18k,
        updatedAt: live.updatedAt,
      },
      silverRate: {
        rate999: live.silver999,
        updatedAt: live.updatedAt,
      },
    },
  };

  await writeSiteContent(updated);

  return {
    skipped: false as const,
    rates: live,
    content: updated,
  };
}
