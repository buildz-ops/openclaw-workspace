#!/bin/bash

OPENCLAW_BIN="/opt/homebrew/bin/openclaw"
LOG_DIR="/Users/vex/.openclaw/workspace/logs"
LOG_FILE="$LOG_DIR/openclaw-watchdog.log"
FLAG_FILE="$LOG_DIR/openclaw-watchdog.flag"

# Check gateway status
$OPENCLAW_BIN status >/dev/null 2>&1
STATUS=$?

if [ $STATUS -ne 0 ]; then
  TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  echo "$TS | gateway down -> restarting" >> "$LOG_FILE"
  touch "$FLAG_FILE"
  $OPENCLAW_BIN gateway restart >/dev/null 2>&1
fi
