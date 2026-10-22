import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/content/server";
import { syncMetalRates } from "@/lib/rates/sync-rates";

function isCronAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const force = searchParams.get("force") === "1";
  const cron = isCronAuthorized(request);
  const admin = await isAdminAuthenticated();

  if (!cron && !(admin && force)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncMetalRates({
      force: admin && force,
      skipThrottle: admin && force,
    });
    if (result.skipped) {
      return NextResponse.json({
        ok: true,
        skipped: true,
        reason: result.reason,
      });
    }
    return NextResponse.json({
      ok: true,
      skipped: false,
      rates: result.rates,
      content: result.content.store,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to sync rates";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
