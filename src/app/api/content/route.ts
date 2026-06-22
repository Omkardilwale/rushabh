import { NextResponse } from "next/server";
import { getSiteContent, isAdminAuthenticated } from "@/lib/content/server";
import { mergeWithDefaults } from "@/lib/content/storage";
import { writeSiteContent } from "@/lib/content/storage";
import type { SiteContent } from "@/lib/content/types";

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<SiteContent>;
    const content = mergeWithDefaults(body);
    await writeSiteContent(content);
    return NextResponse.json({ ok: true, content });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
