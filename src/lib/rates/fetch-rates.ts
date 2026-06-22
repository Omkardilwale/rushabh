import {
  fetchGoldApiMetal,
  GOLDAPI_CALLS_PER_SYNC,
  GOLDAPI_MONTHLY_LIMIT,
} from "./goldapi";

const TROY_OZ_GRAMS = 31.1034768;

export type LiveMetalRates = {
  rate24k: number;
  rate22k: number;
  rate18k: number;
  silver999: number;
  updatedAt: string;
  source: string;
  apiCallsUsed: number;
};

function formatRatesTimestamp(): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
}

function roundInr(value: number): number {
  return Math.round(value);
}

function goldGram24k(data: Awaited<ReturnType<typeof fetchGoldApiMetal>>): number {
  if (data.price_gram_24k && data.price_gram_24k > 0) {
    return data.price_gram_24k;
  }
  if (data.price > 0) {
    return data.price / TROY_OZ_GRAMS;
  }
  throw new Error("GoldAPI returned no usable gold price");
}

function silverGram999(data: Awaited<ReturnType<typeof fetchGoldApiMetal>>): number {
  if (data.price_gram_24k && data.price_gram_24k > 0) {
    return data.price_gram_24k;
  }
  if (data.price > 0) {
    return data.price / TROY_OZ_GRAMS;
  }
  throw new Error("GoldAPI returned no usable silver price");
}

export async function fetchLiveMetalRates(): Promise<LiveMetalRates> {
  const [gold, silver] = await Promise.all([
    fetchGoldApiMetal("XAU", "INR"),
    fetchGoldApiMetal("XAG", "INR"),
  ]);

  const goldInrPerGram24k = goldGram24k(gold);
  const silverInrPerGram = silverGram999(silver);

  const rate24k = roundInr(goldInrPerGram24k);
  const rate22k = roundInr(
    gold.price_gram_22k && gold.price_gram_22k > 0
      ? gold.price_gram_22k
      : goldInrPerGram24k * (22 / 24),
  );
  const rate18k = roundInr(goldInrPerGram24k * (18 / 24));
  const silver999 = roundInr(silverInrPerGram);

  return {
    rate24k,
    rate22k,
    rate18k,
    silver999,
    updatedAt: formatRatesTimestamp(),
    source: `GoldAPI.io (free: ${GOLDAPI_MONTHLY_LIMIT} calls/mo)`,
    apiCallsUsed: GOLDAPI_CALLS_PER_SYNC,
  };
}
