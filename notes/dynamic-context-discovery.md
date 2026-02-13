# Dynamic Context Discovery Implementation

Based on Cursor's research: <https://cursor.com/blog/dynamic-context-discovery>

## Problem
Static context bloat → context rot → performance degradation.

## Solution
Pull context dynamically instead of front-loading everything.

---

## Phase 1: File-Based Tool Outputs ✅

### Long Exec Outputs
**Pattern:** Write outputs >5KB or >100 lines to cache files.

**Wrapper:** `scripts/exec-cached.sh`
```bash
# Instead of:
exec command="long-running-command"

# Use:
exec command="$HOME/.openclaw/workspace/scripts/exec-cached.sh long-running-command"
```

**Result:** Returns summary + file path. Use `tail`/`grep` to explore.

---

### MCP Responses
**Pattern:** Write JSON responses >3KB to cache files.

**Wrapper:** `scripts/mcp-cached.sh`
```bash
# Instead of:
mcporter call exa.web_search_exa query="..." --output json

# Use:
$HOME/.openclaw/workspace/scripts/mcp-cached.sh call exa.web_search_exa query="..."
```

**Result:** Returns preview + file path. Use `jq` to parse.

---

### Cache Location
`~/.openclaw/workspace/context-cache/`
- `exec/` - Shell command outputs
- `mcp/` - MCP JSON responses
- `web/` - Web fetch content (future)

**Cleanup strategy:** Auto-purge files >7 days old (cron job).

---

## Phase 2: MCP Tool Discovery (In Progress)

### Goal
Load only tool names in static context. Discover full schemas on demand.

### Structure
```
mcp-tools/
  exa/
    web_search_exa.md
    company_research_exa.md
    ...
  google-workspace/
    gmail.send.md
    calendar.list.md
    ...
```

**Static context:** "Available MCP servers: exa, google-workspace"
**Dynamic discovery:** `ls mcp-tools/exa/` or `grep -r "search" mcp-tools/`

**Expected impact:** 46.9% token reduction (Cursor's benchmark).

---

## Phase 3: Enhanced Memory & History

### Searchable Chat History
**Current:** `memory/working-buffer.md` logs at >60% context.
**Enhancement:** Add explicit grep/search patterns during summarization.

### Semantic Search for Skills
**Goal:** Find relevant skills without loading all metadata.
**Tool:** Use `qmd` skill or vector search.

---

## Phase 4: Persistent Terminal Logs

### Session-Based Logs
```
terminal/
  session-<id>.log
```

**Pattern:** Long-running processes (servers, builds) → continuous append to log.
**Discovery:** `tail -f terminal/session-<id>.log` or `grep "ERROR" terminal/session-<id>.log`

---

## Behavioral Changes

### Before
- Load ALL skills metadata at startup
- Include full MCP schemas in context
- Inline all exec outputs
- Front-load MEMORY.md, SOUL.md, USER.md every session

### After
- Load skill names only, read SKILL.md on trigger
- List MCP servers, discover tools on demand
- Cache large outputs, use tail/grep
- Load memory files only when needed (search first)

---

## Metrics to Track
- Context window usage per session
- Token reduction from cached outputs
- Frequency of dynamic discovery vs static loading
- Performance over long conversations (>50 turns)

---

## Implementation Status
- [x] Phase 1: File-based wrappers (exec, mcp)
- [x] Phase 2: MCP tool folders (59 tools indexed)
- [x] Phase 3: Enhanced memory (CONTEXT_POLICY.md, chat history capture)
- [x] Phase 4: Terminal logs (persistent session logs)

**✅ ALL PHASES COMPLETE** - See `DYNAMIC_CONTEXT_SUMMARY.md` for full details.
