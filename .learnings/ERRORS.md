# ERRORS.md — Unexpected Failures

<!-- Log unexpected failures here so future sessions learn from them. -->
<!-- Format:
## YYYY-MM-DD — Short title
- **What happened:** Description of the error
- **Root cause:** Why it happened
- **Fix/workaround:** What resolved it
- **Prevention:** How to avoid it next time
-->

## 2026-02-08 — Discord /model command unauthorized
- **What happened:** Ayoub couldn't use `/model` slash command — got "not authorized"
- **Root cause:** Fresh config had no `users` array in guild config and no `commands.ownerAllowFrom`
- **Fix:** Added user ID to `guilds.*.users[]` and `commands.ownerAllowFrom: ["discord:281112594348244993"]`
- **Prevention:** Always include owner user ID in guild users + ownerAllowFrom on fresh setups

## 2026-02-08 — config.patch returns "raw required"
- **What happened:** Tried using `gateway config.patch` with a `patch` parameter — got "raw required"
- **Root cause:** The gateway tool's config.patch action apparently requires `raw` parameter, not `patch`
- **Fix:** Used `config.apply` with full config instead
- **Prevention:** Use `config.apply` with complete config JSON for reliable config changes

## 2026-02-09 — exec tool spawn EBADF blocks git status
- **What happened:** `exec` failed with `spawn EBADF` when running `git status --porcelain` for cron workspace-git-commit
- **Root cause:** Unknown (exec tool failure)
- **Fix/workaround:** None yet; previously suggested retry with PTY mode or hard restart
- **Prevention:** Investigate exec tool stability; document workaround (PTY redirect) in TOOLS.md if confirmed

## 2026-02-09 — Config broke gateway: wrong schema for experimental.sessionMemory
- **What happened:** Added `memorySearch.experimental.sessionMemory` as `{enabled: true, sources: [...]}` — it's actually a plain boolean. Also put `sources` inside experimental instead of at the memorySearch level.
- **Root cause:** Didn't check config.schema before editing openclaw.json directly
- **Fix:** Used `gateway config.patch` with correct schema: `experimental.sessionMemory: true` (boolean) and `sources: ["memory", "sessions"]` at memorySearch level
- **Prevention:** ALWAYS run `gateway config.schema` and validate keys before any config change. Never edit openclaw.json directly — use config.patch.

## 2026-02-09 — Watchdog false positives spamming Discord
- **What happened:** Watchdog script used `openclaw status` which returns non-zero in launchd environment (no interactive shell). Flag file wasn't being cleaned up, causing repeated alerts.
- **Root cause:** `openclaw status` exit code unreliable in non-interactive context. Flag file cleanup relied on cron job which ran too late.
- **Fix:** Switched to `curl` health check on gateway port (HTTP code 000 = down, anything else = alive). Added flag dedup (only write if flag doesn't exist).
- **Prevention:** For launchd scripts, use direct HTTP/network checks instead of CLI commands that depend on shell environment.

## 2026-02-09 — Codex CLI not installed
- **What happened:** Attempted to run `codex exec` for GitHub Copilot Opus 4.6; command failed with `codex: command not found` (exit 127)
- **Root cause:** Codex CLI not installed on this machine
- **Fix/workaround:** Ask Ayoub to install Codex CLI or use an available coding agent (claude/opencode/pi) instead
- **Prevention:** Check for `codex` binary before spawning coding-agent tasks
