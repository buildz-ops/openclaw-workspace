### # CONTEXT_POLICY.md - Dynamic Context Discovery Rules

Based on: <https://cursor.com/blog/dynamic-context-discovery>

## Core Principle
**Pull context dynamically instead of front-loading everything.**

Files > Static Context

---

## 1. Session Startup

### OLD (Static Loading)
```
Load ALL of:
- MEMORY.md (full file)
- SOUL.md (full file)
- USER.md (full file)
- AGENTS.md (full file)
- HEARTBEAT.md (full file)
- All skill metadata
- All MCP tool schemas
```

### NEW (Dynamic Discovery)
```
Static context:
- Role: "You are Vex, Ayoub's personal AI assistant"
- Location: workspace = ~/.openclaw/workspace
- Available files: ls
- Available MCP servers: ls mcp-tools/
- Available skills: ls skills/

Dynamic loading (on demand):
- Read MEMORY.md only when answering memory-related questions
- Read SOUL.md when tone/identity is unclear
- Read USER.md when user preferences are needed
- Read skill SKILL.md when skill is triggered
- Read mcp-tools/<server>/<tool>.md when calling MCP tool
```

**Token savings:** ~80% reduction in session startup context.

---

## 2. Tool Outputs

### Long Exec Outputs (>100 lines or >5KB)
- **Cache to:** `context-cache/exec/exec-<timestamp>.txt`
- **Show:** First 20 + last 20 lines + file path
- **Explore:** `tail`, `grep`, `head`

### MCP Responses (>3KB)
- **Cache to:** `context-cache/mcp/mcp-<timestamp>-<hash>.json`
- **Show:** Preview (50 lines) + file path
- **Explore:** `jq`, `grep`

### Web Fetch (future)
- **Cache to:** `context-cache/web/fetch-<hash>.md`
- **Show:** Summary + file path
- **Explore:** `grep`, `read`

---

## 3. MCP Tool Discovery

### Static Context (Always)
```
Available MCP servers:
- exa (search)
- google-workspace (Gmail, Calendar, Drive, Docs)
```

### Dynamic Discovery (On Demand)
```bash
# List tools for a server
ls mcp-tools/exa/

# Find tools by keyword
grep -r "search" mcp-tools/

# Read tool schema
read mcp-tools/exa/web_search_exa.md
```

**Impact:** 46.9% token reduction (Cursor's benchmark).

---

## 4. Skill Discovery

### Static Context (Always)
```
Available skills: agent-autonomy-kit, browser-use, capability-evolver, 
clawdstrike, clawtunes, exa-search, evolve, proactive-agent, prompt-guard, 
qmd-skill-2, reddit-readonly, self-improvement, x-bookmarks
```

### Dynamic Discovery (Triggered by Description Match)
```bash
# When skill is triggered, read its SKILL.md
read skills/<skill-name>/SKILL.md

# Semantic search for relevant skills (future)
qmd search "reddit automation"
```

---

## 5. Memory & History

### Current Approach
- `memory/working-buffer.md` logs when context >60%
- `memory/YYYY-MM-DD.md` daily logs
- `MEMORY.md` long-term memory (main session only)

### Enhanced Approach
```bash
# Search memory before answering
memory_search query="last time we discussed X"

# If not found, grep fallback
grep -r "keyword" memory/

# Read specific sections
memory_get path="memory/2026-02-13.md" from=50 lines=20
```

**Rule:** Always search memory BEFORE answering questions about:
- Prior work
- Decisions
- Dates
- People
- Preferences
- TODOs

---

## 6. Chat History During Summarization

### Problem
When context window fills up → summarization → lossy compression → forgotten details.

### Solution
**Before summarization:**
1. Write full chat history to `memory/chat-history-<session-id>.md`
2. During summarization, give agent reference to history file
3. If summary is missing details, agent can search/grep history file

```bash
# Recover details from history
grep "project name" memory/chat-history-<id>.md
tail -n 100 memory/chat-history-<id>.md
```

---

## 7. Terminal Session Logs (Future)

### Pattern
```bash
# Long-running processes → continuous log
tail -f terminal/session-<id>.log

# Search for errors
grep "ERROR" terminal/session-<id>.log

# Get last output
tail -n 50 terminal/session-<id>.log
```

---

## Behavioral Changes Summary

| Context Type | OLD (Static) | NEW (Dynamic) | Token Savings |
|--------------|-------------|---------------|---------------|
| Session startup | Load all core files | Load role + ls only | ~80% |
| MCP tools | All schemas inline | Server names + discovery | ~99% |
| Skills | All metadata | Names + triggered read | ~60% |
| Exec outputs | Inline (truncated) | Cached + summary | ~70% |
| Memory access | Load MEMORY.md always | Search first, read sections | ~90% |

**Overall estimated impact:** 60-80% context reduction across sessions.

---

## Implementation Checklist

- [x] Phase 1: File-based tool outputs (exec, mcp)
- [x] Phase 2: MCP tool folder structure
- [ ] Phase 3: Enhanced memory search patterns
- [ ] Phase 4: Chat history during summarization
- [ ] Phase 5: Terminal session logs

---

## Usage Notes

### When to Use Static Context
- Core identity (role, name, workspace location)
- Current session metadata (date, time, channel)
- File/directory listings (lightweight)

### When to Use Dynamic Discovery
- Long documents (MEMORY.md, AGENTS.md, SOUL.md)
- Tool schemas (MCP tools, skill contents)
- Historical data (old conversations, logs)
- Large outputs (exec, web fetch, MCP responses)

**Rule of thumb:** If it's >1KB or rarely needed, make it discoverable instead of static.
