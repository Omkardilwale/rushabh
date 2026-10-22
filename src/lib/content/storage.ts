import "server-only";
import { readFile } from "fs/promises";
import path from "path";
import { connectMongoose, isMongoConfigured } from "@/lib/mongodb";
import { defaultSiteContent } from "./defaults";
import { SITE_CONTENT_KEY, SiteContentModel } from "./model";
import type { SiteContent } from "./types";

const CONTENT_PATH = path.join(process.cwd(), "rushabh.data.json");

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

export type ContentSource = "mongo" | "file" | "defaults";

export type SiteContentRead = {
  content: SiteContent;
  source: ContentSource;
};

declare global {
  var _fileContentCache: SiteContent | undefined;
}

// MongoDB reads are disabled. The public site loads rushabh.data.json
// instead of querying the database on each request.
// async function readFromMongo(): Promise<SiteContent | null> {
//   if (!isMongoConfigured()) return null;
//   await connectMongoose();
//   const doc = await SiteContentModel.findOne({ key: SITE_CONTENT_KEY })
//     .lean()
//     .exec();
//   if (!doc?.content) return null;
//   return mergeWithDefaults(doc.content as Partial<SiteContent>);
// }

async function readFromFile(): Promise<SiteContent | null> {
  if (global._fileContentCache) return global._fileContentCache;

  try {
    const raw = await readFile(CONTENT_PATH, "utf-8");
    const content = mergeWithDefaults(JSON.parse(raw) as Partial<SiteContent>);
    global._fileContentCache = content;
    return content;
  } catch (error) {
    console.error("[content] Failed to read rushabh.data.json:", error);
    return null;
  }
}

async function writeToMongo(content: SiteContent): Promise<void> {
  if (!isMongoConfigured()) {
    throw new Error(
      "MONGODB_URI is not configured, so this could not be saved to the database.",
    );
  }

  await connectMongoose();
  await SiteContentModel.updateOne(
    { key: SITE_CONTENT_KEY },
    { $set: { content, updatedAt: new Date() } },
    { upsert: true },
  );
}

export async function readSiteContentResult(): Promise<SiteContentRead> {
  const fromFile = await readFromFile();
  if (fromFile) return { content: fromFile, source: "file" };
  return { content: defaultSiteContent, source: "defaults" };
}

export async function readSiteContent(): Promise<SiteContent> {
  const result = await readSiteContentResult();
  return result.content;
}

export async function writeSiteContent(content: SiteContent): Promise<void> {
  await writeToMongo(content);
}
