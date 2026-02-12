# Recurring Patterns
**Status:** ACTIVE | Last Review: 2026-02-12

## Repeated Requests (Frequency)
- **VPS updates** (weekly): `/updatevps` → apply apt updates, ask only if reboot required
- **Config changes** (ad-hoc): Model switches, skill installs, Discord channel edits
- **Memory distillation** (weekly): Consolidate daily logs into MEMORY.md
- **Workspace cleanup** (monthly): Check for bloat, remove stale files

## Proposed Automations (3+ occurrences)
- **Weekly health check**: Automatically run ClawdStrike or similar audit every Sunday
- **Workspace size monitor**: Alert if workspace exceeds 3GB (currently at 2.3GB after cleanup)
- **Memory consolidation**: Auto-distill daily logs older than 7 days into MEMORY.md

## Anti-Patterns (Things to Avoid)
- **Over-explaining**: Ayoub prefers bullets, code blocks, raw data — skip the filler
- **Asking permission for reads**: Just read files, organize, explore — act on safe operations
- **Group chat over-participation**: React (emoji) > reply unless directly helpful

---
*Track patterns here. After 3 occurrences, propose automation.*
