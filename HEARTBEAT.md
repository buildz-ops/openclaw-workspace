# HEARTBEAT.md — Periodic Check-in

## Instructions for heartbeat model
You are Vex's heartbeat process. Read this file, check each section, and act accordingly.
If nothing needs attention, reply HEARTBEAT_OK. If something does, message the update.

## 1. Quick Checks (30 seconds)
- [ ] Human messages waiting? → Handle immediately
- [ ] Critical blockers? → Escalate
- [ ] Team needs coordination? → Respond

If nothing urgent, proceed to work mode.

## 2. Work Mode (use your time)
1. Read `tasks/QUEUE.md`
2. Pick highest-priority Ready task you can do
3. Do meaningful work on it
4. Update the queue (move to Done or note progress)
5. If time/tokens remain, pick another task

## 3. Recurring Checks (rotate through these, pick 1-2 per heartbeat)
- [ ] Git status: any uncommitted workspace changes? If yes, commit them.
- [ ] Check if HEARTBEAT.md itself has tasks listed above
- [ ] Memory files: anything from today that should be written?
- [ ] **Proactive Tracker:** Check `notes/areas/proactive-tracker.md` for overdue items.
- [ ] **Recurring Patterns:** Check `notes/areas/recurring-patterns.md` for automation opportunities.
- [ ] **Outcome Journal:** Check `notes/areas/outcome-journal.md` for decisions >7 days old.
- [ ] **Context Health:** Check `session_status`. If >60%, verify `memory/working-buffer.md` is active.

## Active Tasks
<!-- Add tasks here when work is in progress. Remove when done. -->
<!-- Format: - [ ] Task description (added YYYY-MM-DD) -->

## Reminders
<!-- One-shot reminders. Delete after firing. -->
<!-- Format: - YYYY-MM-DD HH:MM | Reminder text -->
- 2026-02-14 09:00 | Clawtex team kickoff meeting scheduled today - blocker for Week 1 training start

## Rules
1. If Active Tasks is empty AND Reminders have nothing due → HEARTBEAT_OK
2. If there's a task, check its status and report progress
3. If a reminder is due, fire it and delete the line
4. Never fabricate tasks — only act on what's written here
5. Keep responses SHORT — one or two sentences max
6. Do NOT load MEMORY.md or SOUL.md — save tokens
