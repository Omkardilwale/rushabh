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
    global._mongooseConn = mongoose.connect(uri, {
      dbName,
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    });
  }

  return global._mongooseConn;
}
