import "server-only";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { connectMongoose, isMongoConfigured } from "@/lib/mongodb";
import { defaultSiteContent } from "./defaults";
import { SITE_CONTENT_KEY, SiteContentModel } from "./model";
import type { SiteContent } from "./types";

const CONTENT_PATH = path.join(process.cwd(), "data", "site-content.json");

function deepMerge<T extends Record<string, unknown>>(
  base: T,
  patch: Partial<T>,
): T {
  const result = { ...base };
  for (const key of Object.keys(patch) as (keyof T)[]) {
    const value = patch[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      base[key] &&
      typeof base[key] === "object" &&
      !Array.isArray(base[key])
    ) {
      result[key] = deepMerge(
        base[key] as Record<string, unknown>,
        value as Record<string, unknown>,
      ) as T[keyof T];
    } else if (value !== undefined) {
      result[key] = value as T[keyof T];
    }
  }
  return result;
}

export function mergeWithDefaults(content: Partial<SiteContent>): SiteContent {
  return deepMerge(
    defaultSiteContent as unknown as Record<string, unknown>,
    content as unknown as Record<string, unknown>,
  ) as unknown as SiteContent;
}

async function readFromMongo(): Promise<SiteContent | null> {
  if (!isMongoConfigured()) return null;

  await connectMongoose();
  const doc = await SiteContentModel.findOne({ key: SITE_CONTENT_KEY }).lean();
  if (!doc?.content) return null;

  return mergeWithDefaults(doc.content as Partial<SiteContent>);
}

async function writeToMongo(content: SiteContent): Promise<void> {
  await connectMongoose();
  await SiteContentModel.updateOne(
    { key: SITE_CONTENT_KEY },
    { $set: { content, updatedAt: new Date() } },
    { upsert: true },
  );
}

async function readFromFile(): Promise<SiteContent | null> {
  try {
    const raw = await readFile(CONTENT_PATH, "utf-8");
    return mergeWithDefaults(JSON.parse(raw) as Partial<SiteContent>);
  } catch {
    return null;
  }
}

async function writeToFile(content: SiteContent): Promise<void> {
  await mkdir(path.dirname(CONTENT_PATH), { recursive: true });
  await writeFile(CONTENT_PATH, JSON.stringify(content, null, 2), "utf-8");
}

async function seedMongoFromFallback(): Promise<SiteContent> {
  const fromFile = await readFromFile();
  const content = fromFile ?? defaultSiteContent;

  if (isMongoConfigured()) {
    await writeToMongo(content);
  }

  return content;
}

export async function readSiteContent(): Promise<SiteContent> {
  if (isMongoConfigured()) {
    const fromMongo = await readFromMongo();
    if (fromMongo) return fromMongo;
    return seedMongoFromFallback();
  }

  const fromFile = await readFromFile();
  return fromFile ?? defaultSiteContent;
}

export async function writeSiteContent(content: SiteContent): Promise<void> {
  if (isMongoConfigured()) {
    await writeToMongo(content);
    return;
  }

  await writeToFile(content);
}
