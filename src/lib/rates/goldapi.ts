/** GoldAPI.io free plan: 100 API calls/month. Each sync uses 2 calls (gold + silver). */
export const GOLDAPI_CALLS_PER_SYNC = 2;
export const GOLDAPI_MONTHLY_LIMIT = 100;

/** Minimum hours between syncs (~1/day max ≈ 60 calls/month, leaves room for manual). */
export const GOLDAPI_MIN_SYNC_INTERVAL_HOURS = 22;

export type GoldApiPriceResponse = {
  price: number;
  metal?: string;
  currency?: string;
  price_gram_24k?: number;
  price_gram_22k?: number;
  price_gram_18k?: number;
  ch?: number;
  chp?: number;
};

export function getGoldApiKey(): string {
  const key = process.env.GOLDAPI_KEY;
  if (!key) {
    throw new Error(
      "GOLDAPI_KEY is not set. Add your free key from https://www.goldapi.io/dashboard",
    );
  }
  return key;
}

export async function fetchGoldApiMetal(
  metal: "XAU" | "XAG",
  currency = "INR",
): Promise<GoldApiPriceResponse> {
  const res = await fetch(`https://www.goldapi.io/api/${metal}/${currency}`, {
    headers: {
      "x-access-token": getGoldApiKey(),
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (res.status === 429) {
    throw new Error("GoldAPI monthly/rate limit reached (100 free calls/month)");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GoldAPI ${metal}/${currency} failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<GoldApiPriceResponse>;
}

export function hoursSince(isoTimestamp: string): number | null {
  if (!isoTimestamp) return null;
  const ms = Date.now() - new Date(isoTimestamp).getTime();
  if (Number.isNaN(ms)) return null;
  return ms / (1000 * 60 * 60);
}

export function canSyncRates(lastSyncedAt: string): {
  allowed: boolean;
  hoursRemaining: number;
  reason?: string;
} {
  const elapsed = hoursSince(lastSyncedAt);
  if (elapsed === null) {
    return { allowed: true, hoursRemaining: 0 };
  }

  if (elapsed >= GOLDAPI_MIN_SYNC_INTERVAL_HOURS) {
    return { allowed: true, hoursRemaining: 0 };
  }

  const hoursRemaining = Math.ceil(GOLDAPI_MIN_SYNC_INTERVAL_HOURS - elapsed);
  return {
    allowed: false,
    hoursRemaining,
    reason: `GoldAPI free limit: wait ${hoursRemaining}h before next sync (2 calls per sync, 100/month).`,
  };
}

export function estimatedMonthlySyncs(): number {
  return Math.floor(GOLDAPI_MONTHLY_LIMIT / GOLDAPI_CALLS_PER_SYNC);
}
