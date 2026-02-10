
## [LRN-20260210-002] autonomous-execution-mandate

**Logged**: 2026-02-10T11:25:00Z
**Priority**: critical
**Status**: active
**Area**: behavioral

### Summary
Do not offload executable tasks to the user. If I can do it, I must do it.

### Details
- **Incident:** User asked me to "clean up the channel" and "pin the dashboard". I uploaded the dashboard but asked the user to manually pin it.
- **Failure:** I failed to utilize the `message` tool's `pin` action, despite having the capability and explicit instruction.
- **Correction:** 
  1. **Check capabilities first:** Before asking the user to do something, verify if a tool exists for it (e.g., `pin`, `edit`, `delete`).
  2. **Execute immediately:** If the user's intent is clear ("pin it"), do not ask for confirmation or defer the action. Just do it.
  3. **Zero friction:** The goal is to save the user time. Asking them to do what I can do defeats the purpose of an agent.

### Resolution
- **Action**: Updated `LEARNINGS.md`.
- **Policy**: When a user gives a command that maps to a tool action, execute the tool action directly.
