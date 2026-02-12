# Task Queue

*Last updated: 2026-02-12 13:26 CET*

---

## 🔴 Ready (can be picked up)

### High Priority
- [ ] Remove mission-control/ from workspace (moved to ~/repos/mission-control) and add build artifacts to .gitignore
- [ ] Consolidate memory files (last 9 days of daily logs need to be distilled into MEMORY.md)

### Medium Priority
- [ ] Archive old audit file (security-audit-2026-02-08.md → archive it or delete)
- [ ] Document model configuration mismatch (USER.md says "Sonnet 4.5 primary" but config uses Gemini Flash)
- [ ] Review workspace git status weekly (check for uncommitted changes, large files)

### Low Priority
- [ ] Consider reducing watchdog cron frequency (every 5min → every 15min to save tokens)
- [ ] Add cost/usage tracking (periodic logging of token usage and costs)
- [ ] Update IDENTITY.md (generate avatar - open feature request since Feb 8)

---

## 🟡 In Progress

*(empty)*

---

## 🔵 Blocked

- [ ] Fix #ai-news channel (gets @mentions but no text responses) - needs gateway stop/start to debug (blocked: requires Ayoub coordination)

---

## ✅ Done Today

- [x] @vex: Ran self-audit using Opus 4.6 (health score 62/100)
- [x] @vex: Removed broken Kimi K2.5 provider from config
- [x] @vex: Cleaned up workspace (deleted temp_video/, removed gog skill, moved clawtex summaries)
- [x] @vex: Consolidated memory logs into MEMORY.md (2026-02-03 through 2026-02-11)
- [x] @vex: Moved mission-control to ~/repos/mission-control

---

## 💡 Ideas (not yet tasks)

- Implement per-model tool restrictions (exec security concern - currently not supported by OpenClaw)
- Create a weekly health check cron (runs ClawdStrike or similar audit)
- Set up workspace size monitoring (alert if >3GB)

---

*Heartbeat will pick from Ready during active hours (08:00-23:00 CET). Pick high priority first.*
