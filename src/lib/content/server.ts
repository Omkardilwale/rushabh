import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { setRuntimeContent } from "./client";
import { readSiteContentResult, type SiteContentRead } from "./storage";

export const ADMIN_COOKIE = "rushabh_admin";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "rushabh-admin";
}

export const getSiteContentResult = cache(async (): Promise<SiteContentRead> => {
  const result = await readSiteContentResult();
  setRuntimeContent(result.content);
  return result;
});

export async function getSiteContent() {
  return (await getSiteContentResult()).content;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === "authenticated";
}
