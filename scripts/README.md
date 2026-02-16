# Scripts

## health-check.sh
**Purpose:** Comprehensive Mac Mini M4 health check that never fails.

**Usage:**
```bash
./scripts/health-check.sh
```

**What it reports:**
- System uptime
- Disk usage (root partition)
- Memory stats (free/active/wired/compressed)
- Top 10 CPU processes
- OpenClaw status (first 20 lines)
- Tailscale status (first 5 devices)
- System temperatures (if istats installed)
- Load average

**Why it exists:**
The original multi-command chain with `&&` would fail if ANY command returned non-zero. This script uses `set +e` and `|| echo "failed"` patterns to ensure it always completes and returns exit code 0.

**Added:** 2026-02-16 (fixed command chain failure in #health)
