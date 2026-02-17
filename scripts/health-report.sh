#!/bin/bash
# health-report.sh — Mac Mini M4 health snapshot
# Requires: /etc/sudoers.d/powermetrics-vex (NOPASSWD for powermetrics)

set -euo pipefail

REPORT=""
WARNINGS=0

# ── 1. Uptime & Load ─────────────────────────────────────────────────────────
UPTIME_RAW=$(uptime)
LOAD=$(echo "$UPTIME_RAW" | awk -F'load averages:' '{print $2}' | xargs)
LOAD1=$(echo "$LOAD" | awk '{print $1}' | tr -d ',')

if (( $(echo "$LOAD1 > 3.0" | bc -l 2>/dev/null || echo 0) )); then
  UPTIME_ICON="⚠️"
  ((WARNINGS++))
else
  UPTIME_ICON="✅"
fi

UPTIME_STR=$(echo "$UPTIME_RAW" | sed 's/.*up //' | sed 's/,.*//' | xargs)
REPORT+="**System**\n"
REPORT+="${UPTIME_ICON} Uptime: ${UPTIME_STR}\n"
REPORT+="📊 Load: ${LOAD}\n"

# ── 2. Disk ──────────────────────────────────────────────────────────────────
DISK_RAW=$(df -h / | tail -1)
DISK_USE=$(echo "$DISK_RAW" | awk '{print $5}' | tr -d '%')
DISK_AVAIL=$(echo "$DISK_RAW" | awk '{print $4}')
DISK_USED=$(echo "$DISK_RAW" | awk '{print $3}')
DISK_TOTAL=$(echo "$DISK_RAW" | awk '{print $2}')

if [ "$DISK_USE" -ge 90 ]; then
  DISK_ICON="❌"; ((WARNINGS++))
elif [ "$DISK_USE" -ge 75 ]; then
  DISK_ICON="⚠️"; ((WARNINGS++))
else
  DISK_ICON="✅"
fi

REPORT+="\n**Disk**\n"
REPORT+="${DISK_ICON} ${DISK_USED}/${DISK_TOTAL} (${DISK_USE}% used, ${DISK_AVAIL} free)\n"

# ── 3. Memory ────────────────────────────────────────────────────────────────
PAGE_SIZE=16384
VM=$(vm_stat)
FREE_PAGES=$(echo "$VM" | awk '/Pages free/ {gsub(/\./, "", $3); print $3}')
ACTIVE_PAGES=$(echo "$VM" | awk '/Pages active/ {gsub(/\./, "", $3); print $3}')
WIRED_PAGES=$(echo "$VM" | awk '/Pages wired/ {gsub(/\./, "", $4); print $4}')
COMPRESSED_PAGES=$(echo "$VM" | awk '/Pages occupied by compressor/ {gsub(/\./, "", $5); print $5}')

FREE_MB=$(( FREE_PAGES * PAGE_SIZE / 1024 / 1024 ))
ACTIVE_MB=$(( ACTIVE_PAGES * PAGE_SIZE / 1024 / 1024 ))
WIRED_MB=$(( WIRED_PAGES * PAGE_SIZE / 1024 / 1024 ))
COMPRESSED_MB=$(( COMPRESSED_PAGES * PAGE_SIZE / 1024 / 1024 ))
TOTAL_MB=16384

USED_MB=$(( ACTIVE_MB + WIRED_MB + COMPRESSED_MB ))
USED_PCT=$(( USED_MB * 100 / TOTAL_MB ))

if [ "$USED_PCT" -ge 90 ]; then
  MEM_ICON="❌"; ((WARNINGS++))
elif [ "$USED_PCT" -ge 75 ]; then
  MEM_ICON="⚠️"; ((WARNINGS++))
else
  MEM_ICON="✅"
fi

REPORT+="\n**Memory** (16 GB)\n"
REPORT+="${MEM_ICON} ~${USED_MB} MB / ${TOTAL_MB} MB (${USED_PCT}%)\n"
REPORT+="   Active: ${ACTIVE_MB} MB | Wired: ${WIRED_MB} MB | Compressed: ${COMPRESSED_MB} MB | Free: ${FREE_MB} MB\n"

# ── 4. Temperature & Power (via powermetrics, no die temp on M4) ─────────────
REPORT+="\n**Thermal & Power**\n"
PM_OUT=$(sudo -n /usr/bin/powermetrics -n 1 --samplers cpu_power,thermal 2>&1) || PM_OUT=""

if [ -n "$PM_OUT" ]; then
  THERMAL_LEVEL=$(echo "$PM_OUT" | awk '/Current pressure level:/ {print $NF}')
  CPU_POWER=$(echo "$PM_OUT" | awk '/^CPU Power:/ {print $3, $4}')
  GPU_POWER=$(echo "$PM_OUT" | awk '/^GPU Power:/ {print $3, $4}')
  COMBINED=$(echo "$PM_OUT" | awk '/^Combined Power/ {print $(NF-1), $NF}')

  if [ "$THERMAL_LEVEL" = "Nominal" ]; then
    THERM_ICON="✅"
  else
    THERM_ICON="⚠️"; ((WARNINGS++))
  fi

  REPORT+="${THERM_ICON} Thermal pressure: ${THERMAL_LEVEL:-unknown}\n"
  REPORT+="⚡ Power — CPU: ${CPU_POWER} | GPU: ${GPU_POWER} | Total: ${COMBINED}\n"
  REPORT+="ℹ️ Die temp not exposed on Apple Silicon\n"
else
  REPORT+="⚠️ powermetrics unavailable\n"
  ((WARNINGS++))
fi

# ── 5. OpenClaw gateway ──────────────────────────────────────────────────────
REPORT+="\n**OpenClaw Gateway**\n"
GW_LINE=$(ps -e -o pid,comm | grep "openclaw-gateway" | grep -v grep | head -1 || true)
if [ -n "$GW_LINE" ]; then
  GW_PID=$(echo "$GW_LINE" | awk '{print $1}')
  REPORT+="✅ Running (PID ${GW_PID})\n"
else
  REPORT+="❌ NOT running\n"
  ((WARNINGS++))
fi

# ── 6. Tailscale ────────────────────────────────────────────────────────────
REPORT+="\n**Tailscale**\n"
if command -v tailscale &>/dev/null; then
  TS_STATUS=$(tailscale status 2>/dev/null | head -1 || echo "error")
  if echo "$TS_STATUS" | grep -qi "stopped\|error\|not running"; then
    REPORT+="❌ Stopped or error\n"
    ((WARNINGS++))
  else
    TS_IP=$(tailscale ip -4 2>/dev/null || echo "?")
    REPORT+="✅ Connected (${TS_IP})\n"
  fi
else
  REPORT+="⚠️ tailscale not found\n"
fi

# ── Summary ──────────────────────────────────────────────────────────────────
echo -e "### ⚡ Mac Mini M4 Health Report"
echo -e "$(date '+%Y-%m-%d %H:%M CET')\n"
echo -e "$REPORT"
if [ "$WARNINGS" -eq 0 ]; then
  echo -e "✅ All systems nominal."
else
  echo -e "⚠️ **${WARNINGS} warning(s)** — review above."
fi
