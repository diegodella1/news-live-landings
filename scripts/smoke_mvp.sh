#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
CHAT_ID="${TELEGRAM_CHAT_ID:-123}"
TOPIC="${TOPIC:-bitcoin etf record inflows}"
TELEGRAM_WEBHOOK_SECRET="${TELEGRAM_WEBHOOK_SECRET:-}"
INTERNAL_CRON_SECRET="${INTERNAL_CRON_SECRET:-}"

SECRET_HEADER=()
if [[ -n "${TELEGRAM_WEBHOOK_SECRET}" ]]; then
  SECRET_HEADER=(-H "x-telegram-bot-api-secret-token: ${TELEGRAM_WEBHOOK_SECRET}")
fi

CRON_SECRET_HEADER=()
if [[ -n "${INTERNAL_CRON_SECRET}" ]]; then
  CRON_SECRET_HEADER=(-H "x-internal-cron-secret: ${INTERNAL_CRON_SECRET}")
fi

echo "[1/4] Health check"
curl -fsS "${BASE_URL%/}/api/health"
echo

echo "[2/4] Create landing through Telegram webhook fallback"
curl -fsS -X POST "${BASE_URL%/}/api/telegram" \
  -H "Content-Type: application/json" \
  "${SECRET_HEADER[@]}" \
  --data "{\"message\":{\"message_id\":1,\"chat\":{\"id\":\"${CHAT_ID}\"},\"text\":\"/start_live ${TOPIC}\"}}"
echo

SLUG="$(printf '%s' "${TOPIC}" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g')"

echo "[3/4] Verify public landing"
curl -fsSI "${BASE_URL%/}/landings/${SLUG}" | head -n 1

echo "[4/4] Trigger live cycle"
curl -fsS -X POST "${BASE_URL%/}/api/internal/live-cycle" "${CRON_SECRET_HEADER[@]}"
echo
