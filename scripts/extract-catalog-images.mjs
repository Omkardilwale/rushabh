import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const jsonPath = path.join(root, "rushabh.data.json");
const mediaDir = path.join(root, "public", "media");

fs.mkdirSync(mediaDir, { recursive: true });

const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const cache = new Map();

function extract(dataUrl) {
  const cached = cache.get(dataUrl);
  if (cached) return cached;

  const match = /^data:image\/([\w+.-]+);base64,([\s\S]+)$/.exec(dataUrl);
  if (!match) return dataUrl;

  const buffer = Buffer.from(match[2], "base64");
  const hash = crypto.createHash("sha1").update(buffer).digest("hex").slice(0, 16);
  const outPath = path.join(mediaDir, `${hash}.jpg`);
  const publicPath = `/media/${hash}.jpg`;

  if (!fs.existsSync(outPath)) {
    fs.writeFileSync(outPath, buffer);
    try {
      execFileSync(
        "sips",
        ["-s", "format", "jpeg", "-s", "formatOptions", "72", "-Z", "1280", outPath],
        { stdio: "ignore" },
      );
    } catch {
      // Keep the original bytes if macOS sips cannot recompress this file.
    }
  }

  cache.set(dataUrl, publicPath);
  return publicPath;
}

function walk(value) {
  if (typeof value === "string") {
    return value.startsWith("data:image/") ? extract(value) : value;
  }
  if (Array.isArray(value)) return value.map(walk);
  if (value && typeof value === "object") {
    const next = {};
    for (const [key, child] of Object.entries(value)) {
      next[key] = walk(child);
    }
    return next;
  }
  return value;
}

const next = walk(data);
fs.writeFileSync(jsonPath, `${JSON.stringify(next, null, 4)}\n`);

const mediaBytes = fs
  .readdirSync(mediaDir)
  .reduce((sum, name) => sum + fs.statSync(path.join(mediaDir, name)).size, 0);

console.log(
  JSON.stringify(
    {
      images: cache.size,
      jsonBytes: fs.statSync(jsonPath).size,
      mediaBytes,
    },
    null,
    2,
  ),
);
