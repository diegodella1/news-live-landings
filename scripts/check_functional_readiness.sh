#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-https://diegodella.ar/landings}"

echo "[1/4] App health"
curl -fsS "${BASE_URL%/}/api/health"
echo

echo "[2/4] Public index"
curl -fsSI "${BASE_URL%/}" | head -n 1

echo "[3/4] Required local env for Telegram setup"
missing=0
for key in OPENAI_API_KEY TELEGRAM_BOT_TOKEN TELEGRAM_CHAT_ID TELEGRAM_WEBHOOK_SECRET INTERNAL_CRON_SECRET; do
  if [[ -z "${!key:-}" ]]; then
    echo "MISSING ${key}"
    missing=1
  else
    echo "OK ${key}"
  fi
done

echo "[4/4] Telegram webhook info"
if [[ -n "${TELEGRAM_BOT_TOKEN:-}" ]]; then
  curl -fsS "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo"
  echo
else
  echo "SKIPPED getWebhookInfo because TELEGRAM_BOT_TOKEN is missing."
fi

if [[ "${missing}" -ne 0 ]]; then
  echo "Functional circuit is deployed but not fully configured."
  exit 2
fi

echo "Functional circuit is ready for live Telegram testing."
