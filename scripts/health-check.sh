#!/bin/bash
# Health check script for Mac Mini M4
# Returns 0 always (never fails the command)

set +e  # Don't exit on errors

echo "=== SYSTEM UPTIME ==="
uptime || echo "uptime failed"

echo -e "\n=== DISK USAGE ==="
df -h / | tail -n +2 || echo "df failed"

echo -e "\n=== MEMORY STATS ==="
vm_stat | grep -E "(Pages free|Pages active|Pages wired|Pages occupied by compressor)" || echo "vm_stat failed"

echo -e "\n=== TOP PROCESSES (CPU) ==="
ps -A -o %cpu,%mem,comm | tail -n +2 | sort -rn | head -10 || echo "ps failed"

echo -e "\n=== OPENCLAW STATUS ==="
openclaw status --quiet 2>&1 | head -20 || echo "openclaw status failed"

echo -e "\n=== TAILSCALE STATUS ==="
tailscale status 2>&1 | head -5 || echo "tailscale failed"

echo -e "\n=== SYSTEM TEMPS (if available) ==="
if command -v istats >/dev/null 2>&1; then
    istats cpu temp --no-graphs 2>&1 || echo "istats failed"
else
    echo "istats not installed"
fi

echo -e "\n=== LOAD AVERAGE ==="
/usr/sbin/sysctl -n vm.loadavg 2>/dev/null || echo "sysctl not available"

exit 0  # Always succeed
