export function isRemoteImage(src: string): boolean {
  if (!src) return false;
  return src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:");
}

