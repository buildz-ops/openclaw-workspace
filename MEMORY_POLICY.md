# MEMORY_POLICY.md - When to Load Memory

## Default Behavior
**Do not load memory files by default.**
Availability ≠ automatic inclusion.

## Load Memory When:
1. User explicitly requests: "Load my context", "What do you know about...", "Based on what you remember..."
2. Personalized recommendations needed
3. Continuing previous work
4. User references past conversations or projects

## Do NOT Load Memory For:
1. Generic technical questions
2. Factual lookups
3. One-off tasks
4. Casual conversation
5. Token optimization scenarios

## Memory Files & Token Cost
Estimated token costs per file:
- SOUL.md: ~600 tokens
- IDENTITY.md: ~400 tokens
- USER.md: ~800 tokens
- MEMORY.md: ~1000 tokens
- OPERATING_CONTRACT.md: ~400 tokens

**Total: ~3200 tokens**
Load only when value justifies cost.

## Explicit Loading
When user says "load memory" or equivalent, load in this order:
1. USER.md (who they are)
2. IDENTITY.md (who you are)
3. MEMORY.md (what's happened)
4. OPERATING_CONTRACT.md (rules)
5. SOUL.md (personality - usually already internalized)

## Session Management
Before /compact or /clear:
1. Ask: "Should I save anything to memory first?"
2. Write important decisions to memory/YYYY-MM-DD.md
3. Confirm write completed
4. Then compact/clear
