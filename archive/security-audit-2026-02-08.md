# ClawdStrike Security Audit Report

## 1) Header

| Field | Value |
|---|---|
| **Timestamp** | 2026-02-08T21:57:00Z |
| **Mode** | Verified (manual collection — `collect_verified.sh` json_escape bug on macOS sed) |
| **OS** | macOS 26.2 (Build 25C56) — Darwin 25.2.0 arm64 (Mac Mini M4 T8132) |
| **OpenClaw version** | Unable to determine — `openclaw --version` fails (`env: node: No such file or directory`) |
| **State dir** | `/Users/<user>/.openclaw` |
| **Config path** | `/Users/<user>/.openclaw/openclaw.json` |
| **Runtime context** | Bare metal (no container/VM detected) |

---

## 2) Threat Model

- **Assets**: API tokens (Anthropic, Google, GitHub Copilot), Discord bot token, gateway auth token, conversation history, filesystem access, workspace files
- **Actors**: External attackers (network), malicious skill authors, compromised Discord accounts, local users
- **Entry points**: Gateway port 18789 (loopback), Discord channel (allowlisted), workspace skills, browser control
- **Trust boundaries**: macOS host OS, loopback network, Discord guild allowlist, gateway token auth
- **Abuse cases**:
  1. **Firewall disabled + future misconfiguration** — If gateway bind is ever changed from loopback to `0.0.0.0`, the disabled macOS firewall provides no secondary defense, exposing the gateway to LAN/WAN (relates to `net.firewall`)
  2. **Discord token on disk + DM policy missing** — Discord bot token stored in plaintext config; if DM policy defaults to open, any Discord user could send commands to the bot (relates to `channels.dm_policy`, `config.secrets_on_disk`)
- **Mitigations (top 3)**:
  1. Enable macOS Application Firewall
  2. Set explicit DM policy to `deny` or `allowlist`
  3. Rotate secrets and move to env vars or keychain
- **Residual risks**: Skills with executable scripts (self-improvement), `node` not in PATH causing version check failure, heartbeat model running on local Ollama without auth

---

## 3) Summary

| Metric | Value |
|---|---|
| **Total checks** | 24 |
| **Critical** | 2 |
| **Warn** | 5 |
| **Info** | 0 |
| **OK** | 17 |
| **Unverified** | 4 |
| **Top 3 urgent fixes** | 1. Enable macOS firewall · 2. Set explicit DM policy · 3. Fix `node` in PATH to enable version/security audit |

---

## 4) Findings Table

| # | Check ID | Result | Severity | Evidence (redacted) | Fix (safe) |
|---|----------|--------|----------|----------------------|------------|
| 1 | host.os | OK | info | `os.sw_vers`: `ProductName: macOS`, `ProductVersion: 26.2`, `BuildVersion: 25C56`; `os.uname`: `Darwin mac-mini 25.2.0 … arm64` | None required |
| 2 | host.runtime_context | OK | info | `env.virt`: `unknown` (no /.dockerenv, no WSL markers — bare metal Mac Mini M4) | None required |
| 3 | net.listening_ports | OK | info | `net.listening`: `netstat -an | grep LISTEN` returned no listeners (gateway not running at audit time) | Verify gateway listener with `lsof -i -P -n` when gateway is active |
| 4 | net.firewall | VULNERABLE | critical | `fw.macos`: `Firewall is disabled. (State = 0)` | Run: `sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on` |
| 5 | gateway.exposure_and_auth | OK | info | `config.summary`: `gateway.bind=loopback`, `gateway.port=18789`, `gateway.mode=local`, `gateway.auth.mode=token`, `gateway.auth.token=****sent`, `gateway.tailscale.mode=off`, `gateway.controlUi.enabled=missing` | None required — loopback + token auth is correct |
| 6 | discovery.mdns_leak | OK | info | `config.summary`: `discovery.mdns.mode=missing`; `net.listening`: no UDP 5353 listener found | None required — no mDNS listener active |
| 7 | discovery.wide_area | VULNERABLE | warn | `config.summary`: `discovery.wideArea.enabled=missing` (UNVERIFIED) | Set `discovery.wideArea.enabled: false` explicitly in config |
| 8 | canvasHost.exposure | OK | info | `config.summary`: `canvasHost.enabled=missing`, `canvasHost.port=missing`; no canvas listener in `net.listening` | None required — canvas host not enabled |
| 9 | browser.control_exposure | OK | info | `config.summary`: `browser.enabled=missing`, `browser.cdpUrl=missing`; no CDP listener in `net.listening` | None required — browser control not exposed |
| 10 | tools.policy_baseline | OK | info | `config.summary`: `tools.exec=missing`, `tools.elevated.enabled=missing`, `tools.elevated.allowFrom=missing`; (UNVERIFIED — `openclaw security audit` unavailable) | Confirm tools policy once `node` is in PATH and `openclaw security audit` runs |
| 11 | channels.dm_policy | VULNERABLE | warn | `config.summary`: `channels.defaults.dm.policy=missing`, `channels.discord.dm.policy=missing`, `channels.discord.dm.allowFrom=missing` (UNVERIFIED) | Set `channels.discord.dm.policy: "allowlist"` and add `dm.allowFrom` with owner ID |
| 12 | channels.group_policy | OK | info | `config.summary`: `channels.discord.groupPolicy=[allowlist]`; guild `1466038****4048` with explicit user allowlist and channel config | None required — allowlist is active |
| 13 | session.dm_scope_isolation | VULNERABLE | warn | `config.summary`: `session.dmScope=missing` | Set `session.dmScope` explicitly to isolate DM sessions |
| 14 | fs.perms.core | OK | info | `fs.stat.state_dir`: `Directory\|700\|vex\|staff`; `fs.stat.config`: `Regular File\|600\|vex\|staff`; `fs.stat.credentials_dir`: `Directory\|700\|vex\|staff`; `fs.stat.sessions_dir` (agents): `Directory\|700\|vex\|staff`; `fs.stat.auth_profiles`: `Regular File\|600\|vex\|staff` | None required — all owner-only permissions |
| 15 | fs.symlinks | OK | info | `fs.symlinks_state`: no symlinks found in `~/.openclaw` | None required |
| 16 | fs.synced_folder | OK | info | `fs.synced_folder`: `state_dir=/Users/<user>/.openclaw; synced=false` | None required |
| 17 | fs.suid_sgid_in_openclaw_paths | OK | info | `fs.suid_sgid_state`: no SUID/SGID files; `fs.suid_sgid_workspace`: no SUID/SGID files | None required |
| 18 | fs.world_writable_in_openclaw_paths | OK | info | `fs.world_writable_state`: none; `fs.world_writable_workspace`: none | None required |
| 19 | config.secrets_on_disk | VULNERABLE | warn | `config.summary`: `secrets.on_disk.count=2`, `secrets.on_disk.keys=****oken,gateway.auth.token` (Discord token + gateway token in plaintext JSON) | Move secrets to environment variables or OS keychain; restrict config to 600 (already done) |
| 20 | skills.env_injection | OK | info | `config.summary`: `skills.entries.env.count=0` — no skill-level env vars injected | None required |
| 21 | supply_chain.skills_inventory | OK | info | `skills.workspace_inventory`: 5 skills found — prompt-guard, clawtunes, self-improvement, clawdstrike, qmd-skill-2; `skills.state_inventory`: no state skills dir | Review third-party skills periodically |
| 22 | supply_chain.skills_pattern_scan | VULNERABLE | warn | `skills.workspace_pattern_scan`: grep found `chmod +x` references in self-improvement skill (`hooks-setup.md:157,165-167`), `curl\|bash` patterns in prompt-guard (detection rules, not execution) | Review self-improvement `hooks-setup.md` chmod instructions; pattern matches in prompt-guard are detection signatures (false positive) |
| 23 | supply_chain.skills_exec_files | OK | info | `skills.workspace_exec_files`: 1 executable — `clawdstrike/scripts/collect_verified.sh`; `skills.state_exec_files`: no state skills dir | None required — only the audit script itself is executable |
| 24 | supply_chain.plugins_allowlist | OK | info | `config.summary`: `plugins.allow=missing`, `plugins.deny=missing`; only `discord` plugin enabled in config; (UNVERIFIED — `openclaw plugins list` unavailable) | Set explicit `plugins.allow` list in config |
| 25 | version.patch_level | VULNERABLE | critical | `openclaw.version`: FAILED — `env: node: No such file or directory`; `openclaw.security_audit`: FAILED (same error) (UNVERIFIED) | Fix `node` in PATH (likely `/opt/homebrew/bin/node` or nvm); verify OpenClaw version; run `openclaw security audit` |

---

## 5) Remediation Plan

### Immediate Containment
1. **Enable macOS Application Firewall** — `sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on` — provides defense-in-depth if gateway bind ever changes
2. **Fix `node` in PATH** — OpenClaw CLI cannot run (`env: node: No such file or directory`). Ensure Node.js is accessible system-wide. Check: `which node`, verify nvm/homebrew setup. Without this, version checks and `openclaw security audit` are impossible.
3. **Set explicit DM policy** — Add to `openclaw.json`: `"channels.discord.dm.policy": "allowlist"` with `"dm.allowFrom": ["281112594348244993"]`

### Hardening
4. **Set `discovery.wideArea.enabled: false`** explicitly in config to prevent accidental wide-area exposure
5. **Set `session.dmScope`** to isolate DM conversations per sender
6. **Set explicit `plugins.allow`** list rather than relying on defaults
7. **Move secrets to env vars** — Discord bot token and gateway auth token are stored as plaintext in `openclaw.json`. Use `OPENCLAW_DISCORD_TOKEN` and `OPENCLAW_GATEWAY_TOKEN` env vars instead.

### Hygiene and Monitoring
8. **Review self-improvement skill** — `hooks-setup.md` contains `chmod +x` instructions; verify these are documentation-only and not auto-executed
9. **Re-run audit** after fixing `node` PATH to get full `openclaw security audit` and `openclaw --version` output
10. **Schedule periodic audits** — Add ClawdStrike to heartbeat or cron for monthly re-checks
11. **Monitor for new skills** — Any new skill installed should be reviewed before use

---

## 6) Redaction Notice

No secrets, tokens, passwords, pairing codes, or OAuth credentials were printed in this report. All sensitive values are masked with `****` notation per ClawdStrike redaction rules.
