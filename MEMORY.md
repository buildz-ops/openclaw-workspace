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

## 2026-02-03
- **Name Change:** Assistant is now officially **Vex**.
- **Credentials:** Dedicated accounts created for Mac Mini M4 (`vex0x76@gmail.com`).

## Newsletter (The Daily Vex)
- **Schedule:** Daily @ 21:00 CET (cron `daily-ai-brief`).
- **Target:** #ai-newsletter (1471155181352911093).
- **Format:** Summary + Source Links.
- **Growth Strategy:** Do *not* auto-follow. Propose 1-2 high-value accounts in the summary for Ayoub's approval.
