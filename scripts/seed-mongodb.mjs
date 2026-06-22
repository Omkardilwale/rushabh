import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";
import { resolveMongoUri } from "./mongodb-uri.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const uri = resolveMongoUri();
if (!uri) {
  console.error(
    "Set MONGODB_URI or MONGODB_USER + MONGODB_PASSWORD + MONGODB_HOST in .env.local",
  );
  process.exit(1);
}

const dbName = process.env.MONGODB_DB_NAME ?? "rushabh_jewellers";
const contentPath = path.join(root, "data", "site-content.json");

const raw = await readFile(contentPath, "utf-8");
const content = JSON.parse(raw);

const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db(dbName);
  await db.collection("site_content").updateOne(
    { _id: "main" },
    {
      $set: {
        ...content,
        updatedAt: new Date().toISOString(),
      },
    },
    { upsert: true },
  );
  console.log(`Seeded site content to MongoDB (${dbName}.site_content)`);
} finally {
  await client.close();
}
