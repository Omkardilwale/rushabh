/** Target encoded size per image (base64 in one shared save payload). */
export const TARGET_IMAGE_BYTES = 350 * 1024;

/** Vercel serverless request body limit (~4.5MB); stay under for safety. */
export const VERCEL_PAYLOAD_LIMIT_BYTES = 4 * 1024 * 1024;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = src;
  });
}

function dataUrlByteSize(dataUrl: string): number {
  if (typeof Blob !== "undefined") return new Blob([dataUrl]).size;
  return dataUrl.length;
}

/**
 * Resize and compress an image to JPEG data URL for MongoDB storage.
 * Keeps admin saves under Vercel's function payload limit.
 */
export async function compressImageToDataUrl(
  file: File,
  maxBytes = TARGET_IMAGE_BYTES,
): Promise<string> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const img = await loadImage(objectUrl);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is not supported in this browser");

    let maxDim = 1280;
    let quality = 0.85;

    for (let attempt = 0; attempt < 24; attempt++) {
      const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
      const width = Math.max(1, Math.round(img.naturalWidth * scale));
      const height = Math.max(1, Math.round(img.naturalHeight * scale));

      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      if (dataUrlByteSize(dataUrl) <= maxBytes) {
        return dataUrl;
      }

      if (quality > 0.45) {
        quality -= 0.08;
        continue;
      }

      if (maxDim > 400) {
        maxDim = Math.round(maxDim * 0.8);
        quality = 0.78;
        continue;
      }

      throw new Error("Image could not be compressed enough. Use a smaller file or paste a URL.");
    }

    throw new Error("Image could not be compressed enough. Use a smaller file or paste a URL.");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
