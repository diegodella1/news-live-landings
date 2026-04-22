import { NextResponse } from "next/server";
import { env } from "@/lib/config";
import { listLandings } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "news-live-landings",
    landings: listLandings(1).length,
    configured: {
      openai: Boolean(env.openaiApiKey),
      telegramBot: Boolean(env.telegramBotToken),
      telegramChat: Boolean(env.telegramChatId),
      telegramWebhookSecret: Boolean(env.telegramWebhookSecret),
      internalCronSecret: Boolean(env.internalCronSecret)
    },
    timestamp: new Date().toISOString()
  });
}
