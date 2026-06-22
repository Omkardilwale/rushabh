import { defaultSiteContent } from "./defaults";
import type { SiteContent } from "./types";

export type { SiteContent } from "./types";
export { defaultSiteContent } from "./defaults";

let runtimeContent: SiteContent = defaultSiteContent;

export function setRuntimeContent(content: SiteContent) {
  runtimeContent = content;
}

export function getRuntimeContent(): SiteContent {
  return runtimeContent;
}
