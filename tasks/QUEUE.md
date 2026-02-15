# Task Queue

*Last updated: 2026-02-15 12:26 CET*

---

## 🔴 Ready (can be picked up)

### High Priority
*(empty)*

### Medium Priority
- [ ] Add cost/usage tracking (periodic logging of token usage and costs)
- [ ] Update IDENTITY.md (generate avatar - open feature request since Feb 8)

### Low Priority
*(empty)*

---

## 🟡 In Progress

- [ ] Add cost/usage tracking (periodic logging of token usage and costs)

---

## 🔵 Blocked

- [ ] Fix #ai-news channel (gets @mentions but no text responses) - needs gateway stop/start to debug (blocked: requires Ayoub coordination)

---

## ✅ Done Today (2026-02-15)

- [x] @vex: Reduced watchdog cron frequency (5m → 15m) to save tokens
- [x] @vex: Auto-committed pending mission-control changes to workspace git
- [x] @vex: Fixed heartbeat configuration (Updated target to `channel:...`, increased Llama 3.2 3B context to 32k)
- [x] @vex: Fixed model configuration mismatch (Updated openclaw.json: Sonnet 4.5 primary, GPT-5.2/Gemini fallbacks)
- [x] @vex: Documented model configuration mismatch (see `notes/config-audit-2026-02-15.md`)
- [x] @vex: Reviewed workspace git status weekly (verified clean, 596M total size)
- [x] @vex: Archived old audit file (security-audit-2026-02-08.md → archive/)
- [x] @vex: Verified cleanup of mission-control/ from workspace
- [x] @vex: Verified memory consolidation (Feb 3-11) completion

## ✅ Done History

- [x] (2026-02-12) @vex: Ran self-audit using Opus 4.6 (health score 62/100)
- [x] (2026-02-12) @vex: Removed broken Kimi K2.5 provider from config
- [x] (2026-02-12) @vex: Cleaned up workspace (deleted temp_video/, removed gog skill, moved clawtex summaries)
- [x] (2026-02-12) @vex: Consolidated memory logs into MEMORY.md (2026-02-03 through 2026-02-11)
- [x] (2026-02-12) @vex: Moved mission-control to ~/repos/mission-control

---

## 💡 Ideas (not yet tasks)

- Implement per-model tool restrictions (exec security concern - currently not supported by OpenClaw)
- Create a weekly health check cron (runs ClawdStrike or similar audit)
- Set up workspace size monitoring (alert if >3GB)

---

*Heartbeat will pick from Ready during active hours (08:00-23:00 CET). Pick high priority first.*
