import "server-only";
import { cookies } from "next/headers";
import { setRuntimeContent } from "./client";
import { readSiteContent } from "./storage";

export const ADMIN_COOKIE = "rushabh_admin";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "rushabh-admin";
}

export async function getSiteContent() {
  const content = await readSiteContent();
  setRuntimeContent(content);
  return content;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === "authenticated";
}
