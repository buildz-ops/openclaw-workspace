# Discord Components v2 Bug (2026-02-16)

## Issue
Components v2 documented in OpenClaw v2026.2.15 release notes but **non-functional**.

## GitHub Issues
- **#18161:** `message` tool silently drops `components` field before sending to Discord
- **#18145:** Select menus fail with "unknown component" error (even if #18161 is fixed)

## Testing Results
- Sent multiple test messages with `components` payload
- All rendered as plain text (no buttons)
- Discord bot has Administrator permissions (not a permissions issue)
- Format used matches official docs exactly

## Root Cause
Message tool → Discord plugin wiring is incomplete. The field is accepted but dropped before reaching Discord API.

## Status
**Broken in v2026.2.15.** Wait for v2026.2.16+ patch.

## What Works
- Regular Discord embeds (legacy)
- Exec approvals (use Components v2 internally, separate code path)

## Updated Files
- `discord-components-v2.md` — Added warning banner
- `TOOLS.md` — Marked as broken with strikethrough
- `MEMORY.md` — Will update on next flush
