# Session State (Active Working Memory)
**Status:** ACTIVE
**Last Updated:** 2026-02-09

## Current Task
- Re-enable memorySearch safely (watch disabled, scheduled sync only)
- Explain root cause of exec EBADF and difference between old vs safe config

## Key Decisions & Constraints
- Ayoub wants memorySearch re-enabled safely
- Must avoid FD leaks; keep watchers off

## Context & Drafts
- Root cause: FD leak from memory indexing/watchers caused spawn EBADF
- Safe config: memorySearch enabled with watch=false + scheduled sync
