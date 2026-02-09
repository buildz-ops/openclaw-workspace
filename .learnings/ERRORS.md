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
