# LEARNINGS.md — What I've Learned

<!-- Insights, patterns, and better approaches discovered over time. -->
<!-- Format:
## YYYY-MM-DD — Topic
- **Insight:** What was learned
- **Context:** When/why it matters
- **Apply when:** Future trigger conditions
-->

## 2026-02-08 — Proactive messaging requires heartbeat config
- **Insight:** OpenClaw is request-response by default. Without heartbeat enabled, the agent cannot initiate contact.
- **Context:** Ayoub reported that on VPS, Vex never followed up on tasks proactively
- **Apply when:** Setting up any new OpenClaw instance — always configure heartbeat early

## 2026-02-08 — Opus for setup, cheaper models for daily use
- **Insight:** Use the strongest available model for one-time setup tasks (writing templates, refining AGENTS.md, security audits). The quality of these artifacts determines how well cheaper models perform later.
- **Context:** Opus writes better HEARTBEAT.md templates → llama3.2 follows them reliably
- **Apply when:** Any "foundation-building" task — invest tokens now, save tokens forever

## 2026-02-08 — Discord guild config needs explicit user allowlist
- **Insight:** With `groupPolicy: "allowlist"`, users must be explicitly listed in `guilds.*.users[]` to use commands
- **Context:** Fresh setup missed this, blocking Ayoub from /model
- **Apply when:** Any Discord guild setup with allowlist policy

## 2026-02-08 — Always do git init + first commit on fresh workspace
- **Insight:** Establishing a git baseline immediately means you can always diff/revert changes
- **Context:** Fresh Mac Mini workspace had all files untracked
- **Apply when:** Any workspace migration or fresh setup

## 2026-02-08: Discord message splitting annoys Ayoub
**Issue:** Replies often get split into multiple Discord messages (mid-thought tool calls, separate sections, etc.), making it hard to copy/reply-to.
**Fix:** Always consolidate into a single reply. Do all tool calls first, then send one complete message. Stay under 2000 chars when possible.
