import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { defaultSiteContent } from "../src/lib/content/defaults.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const uri = process.env.MONGODB_URI?.trim();
if (!uri) {
  console.error("Set MONGODB_URI in .env.local first.");
  process.exit(1);
}

const dbName = process.env.MONGODB_DB_NAME?.trim() || "rushabh_jewellers";
const contentPath = path.join(root, "data", "site-content.json");

let content = defaultSiteContent;
try {
  const raw = await readFile(contentPath, "utf-8");
  content = JSON.parse(raw);
} catch {
  console.log("data/site-content.json not found, seeding defaultSiteContent (empty catalog)...");
}

const SiteContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    content: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "site_content", minimize: false },
);

const SiteContentModel =
  mongoose.models.SiteContent ||
  mongoose.model("SiteContent", SiteContentSchema);

const force = process.argv.includes("--force");

try {
  await mongoose.connect(uri, { dbName, serverSelectionTimeoutMS: 10000 });
  const existing = await SiteContentModel.findOne({ key: "main" }).lean();
  if (existing?.content && !force) {
    console.log(
      "MongoDB already has site content. Skipping seed so uploaded data is not overwritten. Pass --force to replace it.",
    );
  } else {
    await SiteContentModel.updateOne(
      { key: "main" },
      { $set: { content, updatedAt: new Date() } },
      { upsert: true },
    );
    console.log(`Seeded site content to MongoDB (${dbName}.site_content)`);
  }
} finally {
  await mongoose.disconnect();
}

