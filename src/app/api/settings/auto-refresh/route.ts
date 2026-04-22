import { NextRequest, NextResponse } from "next/server";
import { isAutoRefreshEnabled, setAutoRefreshEnabled } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ ok: true, enabled: isAutoRefreshEnabled() });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({})) as { enabled?: unknown };
  if (typeof body.enabled !== "boolean") {
    return NextResponse.json({ ok: false, error: "enabled boolean is required" }, { status: 400 });
  }

  setAutoRefreshEnabled(body.enabled);
  return NextResponse.json({ ok: true, enabled: body.enabled });
}
