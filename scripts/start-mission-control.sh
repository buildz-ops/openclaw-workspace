#!/bin/bash

# Configuration
PROJECT_DIR="/Users/vex/.openclaw/workspace/mission-control"
LOG_DIR="/Users/vex/.openclaw/logs/mission-control"

# Create log directory
mkdir -p "$LOG_DIR"

# Navigate to project
cd "$PROJECT_DIR" || exit 1

# Load user environment (for npx/node/convex token)
source ~/.zshrc 2>/dev/null
export PATH=$PATH:/opt/homebrew/bin:/usr/local/bin

echo "Starting Mission Control (Dev Mode)..."

# 1. Start Convex Backend Sync (Background)
# This keeps the local schema synced with the cloud dev deployment
echo "Starting Convex..."
npx convex dev > "$LOG_DIR/convex.log" 2>&1 &
CONVEX_PID=$!

# 2. Start Next.js Frontend (Foreground)
# Listen on 0.0.0.0 to allow access from Tailscale/LAN
echo "Starting Next.js..."
npm run dev -- -H 0.0.0.0 -p 3000 > "$LOG_DIR/next.log" 2>&1 &
NEXT_PID=$!

echo "Mission Control started."
echo "Convex PID: $CONVEX_PID"
echo "Next.js PID: $NEXT_PID"

# Wait for processes
wait $NEXT_PID
