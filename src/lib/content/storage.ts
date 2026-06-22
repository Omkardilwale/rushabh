import "server-only";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { getMongoDb, isMongoConfigured } from "@/lib/mongodb";
import { defaultSiteContent } from "./defaults";
import type { SiteContent } from "./types";

const CONTENT_PATH = path.join(process.cwd(), "data", "site-content.json");
const COLLECTION = "site_content";
const DOC_ID = "main" as const;

type SiteContentDoc = SiteContent & {
  _id: typeof DOC_ID;
  updatedAt: string;
};

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

function stripMongoMeta(doc: Record<string, unknown>): Partial<SiteContent> {
  const { _id, updatedAt, ...content } = doc;
  void _id;
  void updatedAt;
  return content as Partial<SiteContent>;
}

async function readFromMongo(): Promise<SiteContent | null> {
  if (!isMongoConfigured()) return null;

  const db = await getMongoDb();
  const doc = await db
    .collection<SiteContentDoc>(COLLECTION)
    .findOne({ _id: DOC_ID });
  if (!doc) return null;

  return mergeWithDefaults(stripMongoMeta(doc as Record<string, unknown>));
}

async function writeToMongo(content: SiteContent): Promise<void> {
  const db = await getMongoDb();
  await db.collection<SiteContentDoc>(COLLECTION).updateOne(
    { _id: DOC_ID },
    {
      $set: {
        ...content,
        updatedAt: new Date().toISOString(),
      },
    },
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
