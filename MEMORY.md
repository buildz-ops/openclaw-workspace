# MEMORY (Long-term)

## OpenClaw setup / ops
- Email: Primary email for Vex is **vex00x00@gmail.com** (Mac Mini M4 setup).
- **Google Workspace:** Full access via MCP (`google-workspace`). **DO NOT USE `gog` CLI.** It is deprecated and replaced by the MCP for all Gmail, Drive, Docs, Sheets, and Calendar operations.
- AgentMail (**openclaw@agentmail.to**): Polling disabled. Service files removed from VPS.
- Email secrets are stored on the VPS at **/etc/openclaw/secrets.env** (permissions **chmod 600**).
- **Auto-Resume Watchdog:** Vex includes a proactive watchdog that detects gateway crashes and automatically resumes conversations with Ayoub upon restart.
- **GCP Credits:** €255 available (expires April 28, 2026). Billing alerts set at 50%, 80%, 95%, 98%; manual cutoff at 98%.

## Hardware
- **Mac Mini M4:** 16GB/256GB (macOS Tahoe 26.2). Dedicated accounts (`vex00x00@gmail.com`) for browser automation, iMessage, and autonomous tasks. Setup includes FileVault, Tailscale, and "always-on" power config.

## Discord preferences (Ayoub)
- For new Discord organization: prefers **emoji-prefixed category names**, clean formatting, and a **pinned welcome message**; generally keep resources well-organized.

## Projects
- **Clawtex (Business Launch):** See `clawtex/QUICK_REF.md` for service tiers, team structure, tech stack, and roadmap.
  - **Discord Server ID:** `1469693301991932040`

## 2026-02-16
- **OpenClaw Update:** Upgraded to **v2026.2.15** (from v2026.2.14)
  - **Security:** SHA-256 sandbox hashing, token redaction in logs, sandbox Docker hardening, path sanitization, XSS fixes
  - **Discord:** Components v2 (buttons, selects, modals, file blocks), embed passthrough, exec approval UX
  - **Subagents:** Nested sub-agents (sub-sub-agents) with configurable depth, max children per agent (default 5)
  - **Channels:** Per-channel ack reaction overrides (Slack/Discord/Telegram), cron webhook delivery toggle
  - **Fixes:** Group chat context on every turn (prevents loss of awareness), timezone-aware memory dates, Discord role allowlist, Telegram streaming, TUI copy-paste token preservation
  - **Notable:** Multi-turn OpenAI store=true for Codex/Responses, FTS Unicode awareness for CJK queries

## 2026-02-03
- **Name Change:** Assistant is now officially **Vex**.
- **Credentials:** Dedicated accounts created for Mac Mini M4 (`vex0x76@gmail.com`).

## Newsletter (The Daily Vex)
- **Schedule:** Daily @ 21:00 CET (cron `daily-ai-brief`).
- **Target:** #ai-newsletter (1471155181352911093).
- **Format:** Summary + Source Links.
- **X Account:** @vex00x00 (vex00x00@gmail.com) — 44-account seed list complete (2026-02-11). Now in organic curation phase; Ayoub curates feed manually.
- **Growth Strategy:** Do *not* auto-follow. Propose 1-2 high-value accounts in the summary for Ayoub's approval.

## Mac Mini M4 Setup (2026-02-08)
- Fresh OpenClaw install via `openclaw configure` (version 2026.2.6-3+)
- Heartbeat: every 30m using `ollama/llama3.2:3b` (local, $0), active 08:00-23:00 CET, targets #ops
- Discord: guild `1466038234600444048` allowlisted, DM policy allowlist (owner only)
- Cron jobs: workspace-git-commit (6h), morning-briefing (08:00 CET), daily-ai-brief (21:00 CET), weekly-clawtex-summary (Fri 18:00 CET)

## Mission Control Dashboard (2026-02-09)
- Built full Tauri + Next.js dashboard for OpenClaw at `workspace/mission-control/`
- Dark glassmorphism design, SF Pro fonts, real gateway data
- Pages: Dashboard, Sessions, Agents, Cron Jobs, Workshop, Journal, API Usage, Documents
- Two .app builds created: Mac Mini (localhost) + MacBook (Tailscale)
- Sidebar branded "Vex" with idle/working/offline status
- **Note:** 1.7 GB build artifacts (node_modules, src-tauri/target) currently in workspace — flagged for cleanup in 2026-02-12 audit

## Self-Audit (2026-02-12)
- Full introspection run using Opus 4.6
- Health score: 62/100 (needs attention)
- Key findings: 2.3 GB workspace bloat, empty task queue, broken Kimi provider, exec security too permissive
- Immediate cleanup: deleted temp_video/ (35 MB), removed deprecated gog skill, moved clawtex summaries to clawtex/

## Discord User IDs
- **Onguitowa:** `1467903988585337021`
- **Ayoub (buildztweaks):** `281112594348244993`
- **@365968466383208459's OpenClaw bot:** `1467903989722120417` (Clawtex team member, added 2026-07-21)

## Known Issues
- **#ai-news channel (1466764486286250240):** Gets @mentions (👀 ack) but no text responses spawn. Never worked per Ayoub. Needs full gateway stop/start (not hot-reload) to debug.
