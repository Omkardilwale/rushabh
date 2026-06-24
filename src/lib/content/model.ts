import mongoose, { Schema, type Model } from "mongoose";
import type { SiteContent } from "./types";

export const SITE_CONTENT_KEY = "main";

export interface SiteContentDoc {
  key: string;
  content: SiteContent;
  updatedAt: Date;
}

const SiteContentSchema = new Schema<SiteContentDoc>(
  {
    key: { type: String, required: true, unique: true, default: SITE_CONTENT_KEY },
    content: { type: Schema.Types.Mixed, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "site_content", minimize: false },
);

export const SiteContentModel: Model<SiteContentDoc> =
  (mongoose.models.SiteContent as Model<SiteContentDoc>) ||
  mongoose.model<SiteContentDoc>("SiteContent", SiteContentSchema);
