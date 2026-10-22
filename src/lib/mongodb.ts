import "server-only";
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI?.trim();
const dbName = process.env.MONGODB_DB_NAME?.trim() || "rushabh_jewellers";

declare global {
  var _mongooseConn: Promise<typeof mongoose> | undefined;
}

export function isMongoConfigured(): boolean {
  return Boolean(uri);
}

export async function connectMongoose(): Promise<typeof mongoose> {
  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (!global._mongooseConn) {
    mongoose.set("strictQuery", true);
    const timeoutMs = 8000;
    global._mongooseConn = Promise.race([
      mongoose.connect(uri, {
        dbName,
        bufferCommands: false,
        serverSelectionTimeoutMS: timeoutMs,
        connectTimeoutMS: timeoutMs,
        socketTimeoutMS: timeoutMs,
      }),
      new Promise<typeof mongoose>((_, reject) => {
        setTimeout(() => reject(new Error("MongoDB connect timed out")), timeoutMs + 250);
      }),
    ]).catch((error) => {
      global._mongooseConn = undefined;
      void mongoose.disconnect().catch(() => undefined);
      throw error;
    });
  }

  return global._mongooseConn;
}
