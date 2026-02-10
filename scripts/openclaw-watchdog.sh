#!/bin/bash
# OpenClaw Gateway Watchdog
# Checks if gateway is responding, restarts if not, writes flag for notification

OPENCLAW_BIN="/opt/homebrew/bin/openclaw"
LOG_DIR="/Users/vex/.openclaw/workspace/logs"
LOG_FILE="$LOG_DIR/openclaw-watchdog.log"
FLAG_FILE="$LOG_DIR/openclaw-watchdog.flag"

# Use curl to check if gateway is actually responding on its port
HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 http://127.0.0.1:18789/health 2>/dev/null)

# Gateway returns 401/403 for unauthenticated requests, which still means it's alive
# Only restart if we get 000 (connection refused/timeout) or empty
if [ "$HTTP_CODE" = "000" ] || [ -z "$HTTP_CODE" ]; then
  TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  echo "$TS | gateway down (http=$HTTP_CODE) -> restarting" >> "$LOG_FILE"
  
  # Only write flag if it doesn't already exist (prevent spam)
  if [ ! -f "$FLAG_FILE" ]; then
    echo "$TS" > "$FLAG_FILE"
  fi
  
  $OPENCLAW_BIN gateway restart >/dev/null 2>&1
fi
