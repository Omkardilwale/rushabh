import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/content/server";

export async function GET() {
  return NextResponse.json({ authenticated: await isAdminAuthenticated() });
}
