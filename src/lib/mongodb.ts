import "server-only";
import { MongoClient, type Db } from "mongodb";

function resolveMongoUri(): string | undefined {
  const direct = process.env.MONGODB_URI?.trim();
  if (direct) return direct;

  const user = process.env.MONGODB_USER?.trim();
  const pass = process.env.MONGODB_PASSWORD?.trim();
  const host = process.env.MONGODB_HOST?.trim();

  if (user && pass && host) {
    return `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}/?retryWrites=true&w=majority`;
  }

  return undefined;
}

const uri = resolveMongoUri();

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function createClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error(
      "MongoDB is not configured. Set MONGODB_URI or MONGODB_USER + MONGODB_PASSWORD + MONGODB_HOST",
    );
  }

  const client = new MongoClient(uri);

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }

  return client.connect();
}

export function isMongoConfigured(): boolean {
  return Boolean(uri);
}

export async function getMongoDb(): Promise<Db> {
  const client = await createClientPromise();
  const dbName = process.env.MONGODB_DB_NAME ?? "rushabh_jewellers";
  return client.db(dbName);
}
