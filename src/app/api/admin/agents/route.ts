import { NextRequest, NextResponse } from "next/server";
import { isEditableAgentId, listEditableAgents, saveAgentOverride } from "@/lib/admin-agents";
import { requestHasAdminAccess, unauthorizedAdminResponse } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!requestHasAdminAccess(request)) return unauthorizedAdminResponse();
  return NextResponse.json({ ok: true, agents: await listEditableAgents() });
}

export async function POST(request: NextRequest) {
  if (!requestHasAdminAccess(request)) return unauthorizedAdminResponse();
  const body = await request.json().catch(() => ({})) as { agentId?: unknown; override?: unknown };
  if (!isEditableAgentId(body.agentId)) {
    return NextResponse.json({ ok: false, error: "agentId must be one of: research, writer, designer, critic" }, { status: 400 });
  }
  if (typeof body.override !== "string") {
    return NextResponse.json({ ok: false, error: "override must be a string" }, { status: 400 });
  }
  const override = await saveAgentOverride(body.agentId, body.override);
  return NextResponse.json({ ok: true, agentId: body.agentId, override });
}

