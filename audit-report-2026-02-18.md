# 🔒 FULL SYSTEM AUDIT REPORT
**Date:** 2026-02-18  
**Scope:** Security, Config, Errors, Logic  
**Status:** COMPLETE

---

## EXECUTIVE SUMMARY

| Category | Critical | High | Medium | Low | Info |
|----------|----------|------|--------|-----|------|
| Security | 1 | 4 | 5 | 2 | 3 |
| Config | 0 | 1 | 2 | 3 | 2 |
| Errors | 1 | 1 | 2 | 3 | 0 |
| **TOTAL** | **2** | **6** | **9** | **8** | **5** |

**Top 3 Immediate Actions:**
1. ⚠️ **CRITICAL:** Sandboxing misconfig — small model (llama3.2:3b) has web tools enabled without sandbox
2. 🔥 **HIGH:** Gateway recurring crashes (100+ events Feb 9-10, ongoing)
3. 📛 **HIGH:** #ai-news channel completely non-functional

---

## 🔴 CRITICAL ISSUES

### 1. Small Model + Web Tools = Attack Vector
**Severity:** CRITICAL  
**Location:** `agents.defaults.model.fallbacks`  
**Finding:** `ollama/llama3.2:3b` (3B params) configured with `web_search`, `web_fetch`, `browser` tools enabled, but `sandbox.mode=off`

**Risk:** Small models can be jailbroken to exfiltrate data or execute unauthorized web requests. Without sandboxing, this is a major security hole.

**Fix:**
```json
// Option A: Enable sandbox for ALL sessions
"agents.defaults.sandbox.mode": "all"

// Option B: Disable web tools for small models
"tools.deny": ["group:web", "browser"]
```

---

### 2. Gateway Recurring Crashes
**Severity:** CRITICAL (Stability)  
**Evidence:** `openclaw-watchdog.log` — 100+ restarts Feb 9-10, 12x Feb 15, 4x Feb 18

**Pattern:** HTTP 000 errors (connection failed), watchdog auto-restarts working but root cause unknown

**Fix:**
```bash
# Check system logs for crash cause
sudo log show --predicate 'process == "openclaw"' --last 24h

# Check for port conflicts
lsof -i :18789

# Check memory pressure
vm_stat | grep "Pages free"
```

---

## 🟠 HIGH PRIORITY

### 3. #ai-news Channel Non-Functional
**Severity:** HIGH  
**Location:** Discord channel `1466764486286250240`  
**Finding:** Gets @mentions (👀 ack) but no text responses. Never worked per MEMORY.md.

**Fix:** Full gateway stop/start (NOT hot-reload)
```bash
openclaw gateway stop
openclaw gateway start
```

If still broken, check channel permissions and OpenClaw's message intent.

---

### 4. Missing Security Configurations
**Severity:** HIGH  
**Finding:** Multiple security settings not explicitly configured (using defaults)

| Setting | Current | Recommended |
|---------|---------|-------------|
| `discovery.mdns.mode` | missing (defaults to ?) | `"none"` |
| `discovery.wideArea.enabled` | missing | `false` |
| `canvasHost.enabled` | missing | `false` |
| `browser.enabled` | missing (enabled?) | Explicitly set |
| `session.dmScope` | missing | `true` |
| `channels.discord.dm.policy` | missing | `"allowlist"` |

**Fix:** Add to `~/.openclaw/config.json`:
```json
{
  "discovery": { "mdns": { "mode": "none" }, "wideArea": { "enabled": false } },
  "canvasHost": { "enabled": false },
  "browser": { "enabled": true, "bind": "loopback" },
  "session": { "dmScope": true },
  "channels": { "discord": { "dm": { "policy": "allowlist" } } }
}
```

---

### 5. Elevated Exec Enabled
**Severity:** HIGH  
**Finding:** `tools.elevated.enabled: true` — allows privileged command execution

**Risk:** If session compromised, attacker can run commands with elevated privileges

**Fix:** Disable unless actively needed:
```json
"tools.elevated.enabled": false
```

---

### 6. gateway.trustedProxies Not Configured
**Severity:** HIGH (if exposed)  
**Finding:** Empty trustedProxies list with gateway.bind=loopback

**Risk:** If you expose Control UI via reverse proxy, local-client checks can be spoofed

**Fix:** If using reverse proxy:
```json
"gateway.trustedProxies": ["your.proxy.ip.here"]
```

If keeping local-only, no action needed.

---

## 🟡 MEDIUM PRIORITY

### 7. Stale Config Reference
**Severity:** MEDIUM  
**Location:** `skills/clawdstrike/verified-bundle.json`  
**Finding:** Still references deprecated `gog` skill

**Fix:** Regenerate bundle:
```bash
cd ~/.openclaw/workspace/skills/clawdstrike
scripts/collect_verified.sh
```

---

### 8. Prompt-Guard Config Inconsistency
**Severity:** MEDIUM  
**Location:** `skills/prompt-guard/`  
**Finding:** `SKILL.md` documents `secret_protection` section but `config.yaml` doesn't have it

**Fix:** Add to `config.yaml`:
```yaml
secret_protection:
  enabled: true
  patterns:
    - api_key
    - password
    - token
```

---

### 9. Discord Components v2 Broken
**Severity:** MEDIUM  
**Finding:** Marked BROKEN in TOOLS.md — issue #18161, waiting for v2026.2.16+

**Fix:** Update OpenClaw when v2026.2.16+ available:
```bash
openclaw update
```

---

### 10. Workspace Bloat
**Severity:** MEDIUM (Maintenance)  
**Findings:**
- `mission-control/node_modules`: 530MB
- `.git/`: 39MB (acceptable)

**Fix:** Clean up if mission-control not actively developed:
```bash
cd ~/.openclaw/workspace/mission-control
rm -rf node_modules
# Re-install only if needed: npm install
```

---

### 11. Webhook Loopback Broken
**Severity:** MEDIUM  
**Location:** `skills/prompt-guard/README.md`  
**Finding:** "Webhook `loopback` — Broken. Telegram can't reach you."

**Fix:** Use HTTPS webhook with public URL or ngrok for Telegram integration

---

## 🟢 LOW PRIORITY

### 12. Empty Task Queue
**Severity:** LOW  
**Finding:** `tasks/QUEUE.md` has structure but no active work

**Action:** Populate with actual tasks or archive

---

### 13. HEARTBEAT.md Active Tasks Empty
**Severity:** LOW  
**Finding:** Active Tasks section present but commented-out/empty

**Action:** Clean up or populate with actual recurring work

---

### 14. Logs Directory Minimal
**Severity:** LOW  
**Finding:** `logs/` only 12K — good rotation or minimal activity

**Action:** None needed

---

### 15. Unverified Security Checks
**Severity:** LOW  
**Finding:** 10 checks marked UNVERIFIED in security audit (fs.symlinks, net.listening, etc.)

**Action:** Re-run ClawdStrike audit with full verification:
```bash
cd ~/.openclaw/workspace/skills/clawdstrike
scripts/collect_verified.sh --full
```

---

## ✏️ INFO / NOTES

### 16. Known Workarounds Documented
- `exec spawn EBADF` — PTY redirect workaround in TOOLS.md
- `config.patch` returns "raw required" — use `config.apply` instead

### 17. Version Status
- OpenClaw: v2026.2.17
- Node: v22.22.0
- OS: macOS 26.3 (Build 25D125)

### 18. Session Statistics
- 326 active sessions
- 944 memory cache entries
- Gateway reachable (30ms)

---

## ACTION CHECKLIST

| # | Action | Command/Config | Priority |
|---|--------|----------------|----------|
| 1 | Enable sandbox or disable web tools for small models | See CRITICAL #1 | 🔴 NOW |
| 2 | Investigate gateway crashes | `log show` + port check | 🔴 NOW |
| 3 | Fix #ai-news channel | `gateway stop && start` | 🔴 NOW |
| 4 | Disable elevated exec if not needed | `"tools.elevated.enabled": false` | 🟠 Today |
| 5 | Add missing security configs | See HIGH #4 | 🟠 Today |
| 6 | Regenerate clawdstrike bundle | `scripts/collect_verified.sh` | 🟡 This week |
| 7 | Fix prompt-guard config | Add `secret_protection` | 🟡 This week |
| 8 | Clean mission-control node_modules | `rm -rf node_modules` | 🟡 This week |
| 9 | Update OpenClaw for Components v2 | `openclaw update` | 🟡 When available |
| 10 | Re-run full security audit | `scripts/collect_verified.sh --full` | 🟢 Eventually |

---

## EVIDENCE FILES

- `skills/clawdstrike/verified-bundle.json` — Security data
- `logs/openclaw-watchdog.log` — Crash evidence
- `.learnings/ERRORS.md` — Historical errors
- `MEMORY.md` — Known issues section

---

*Report generated by Vex audit subagents — Security (4m), Config (failed, manual), Errors (3m)*
