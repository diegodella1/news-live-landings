#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${TELEGRAM_BOT_TOKEN:-}" ]]; then
  echo "ERROR: TELEGRAM_BOT_TOKEN is required."
  exit 1
fi

echo "Clearing slash-command menu so the chat works as a plain-topic interface."
curl -sS "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/deleteMyCommands" \
  -H "Content-Type: application/json" \
  --data '{}'

echo
echo "Setting bot description."
curl -sS "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setMyDescription" \
  -H "Content-Type: application/json" \
  --data '{"description":"Send a news topic. I research, write, design, review, and publish a sourced landing page."}'

echo
echo "Setting short description."
curl -sS "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setMyShortDescription" \
  -H "Content-Type: application/json" \
  --data '{"short_description":"Send a topic. Get a sourced landing URL."}'

echo
