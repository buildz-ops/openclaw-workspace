---
name: evolve
description: Run Capability Evolver in review mode to generate a GEP-guided evolution prompt and proposed changes (no auto-apply).
tags: [meta, self-improvement]
---

# /evolve

Use this command to run the **Capability Evolver** (current build uses `run`).

## What it does
- Executes: `node skills/capability-evolver/index.js run`
- Scans recent memory/history for signals (errors, gaps, patterns)
- Generates a **GEP protocol prompt** + assets (genes/capsules/events)
- Produces **proposed changes** and may output a `sessions_spawn(...)` line for a follow-up executor

## Safety
- It **does not auto-apply** patches itself
- You explicitly approve any changes before we run solidify

## Usage
- `/evolve`
